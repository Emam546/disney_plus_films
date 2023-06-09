import axios from "axios";
import { domain } from "@src/constants";
import { useDispatch } from "react-redux";
import { pageActions } from "@src/store";
import Header from "@src/components/MovieHeadPage";
import { Title } from "@src/components/TitleSlider";
import { useGetInfinityData, useGetFilmsQuery } from "@src/hooks";
import { GetServerSideProps, NextPage } from "next";
import { getFilmData } from "@serv/routes/film";
import { useRouter } from "next/router";
import { serialize } from "@src/utils";
import Head from "next/head";

async function getFilmMoreLike(_id: string, page: number, numFilms = 8) {
    const res = await axios.get(`${domain}/api/films/morelike/${_id}`, {
        params: {
            offset: page * numFilms,
            limit: numFilms,
        },
    });
    return {
        data: res.data.data as Film[],
        page: res.data.data.length != 0 ? page + 1 : page,
    };
}
function CustomSlider({ _id }: { _id: string }) {
    const query = useGetInfinityData(
        ["films", "morelike", _id],
        ({ pageParam = 0 }) => getFilmMoreLike(_id, pageParam)
    );
    return (
        <Title
            id="morelikethis"
            films={query.data?.pages.reduce((acc, cur) => {
                acc.push(...cur.data);
                return acc;
            }, [] as Film[])}
            onScroll={(event) => {
                const slider = event.currentTarget;
                const state =
                    slider.scrollWidth -
                        slider.scrollLeft -
                        slider.clientWidth <
                    100;
                if (state) query.fetchNextPage();
            }}
        />
    );
}
interface ServerData {
    film: Film;
}
const Movie: NextPage<ServerData> = ({ film }) => {
    const router = useRouter();
    const name = typeof router.query.name == "string" ? router.query.name : "";
    const dispatch = useDispatch();
    const query = useGetFilmsQuery(name, { initialData: film });
    if (query.isError) dispatch(pageActions.setError(query.error));
    if (query.isLoading || query.isError) return null;

    return (
        <>
            <Head>
                <title>{film.name} - Disney +</title>
            </Head>
            <section className="movie">
                <Header film={query.data} />
                <div className="ml-[6rem] my-5">
                    <div className="pb-6 border-b-4 border-solid border-[#252833] mb-7 flex">
                        <h1
                            className="cursor-pointer text-xl font-bold"
                            onClick={() => {
                                document
                                    .getElementById("morelikethis")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            More Like This
                        </h1>
                    </div>
                    <CustomSlider _id={query.data._id} />
                </div>
            </section>
        </>
    );
};
export const getServerSideProps: GetServerSideProps<ServerData> = async (
    ctx
) => {
    const name = ctx?.params?.name;
    if (typeof name != "string")
        return {
            notFound: true,
        };
    try {
        const data = serialize(await getFilmData(name).lean());
        if (!data)
            return {
                notFound: true,
            };
        return {
            props: {
                film: data,
            },
        };
    } catch (err) {
        return {
            notFound: true,
        };
    }
};

export default Movie;
