import Slider from "@src/components/slider";
import { useState } from "react";
import { getSourceImage } from "@src/utils";
import { ShowerActions, useAppDispatch } from "@src/store";
import Img from "@src/components/Img";
import Link from "next/link";

export function FilmPreview({
    film,
    showout = 2700,
    showoutTrans = 2000,
    animationDelay = 1000,
}: {
    film: Film;
    showout?: number;
    showoutTrans?: number;
    animationDelay?: number;
}) {
    const { name, thumbnails } = film;
    const dispatch = useAppDispatch();
    const [timeout, setOut] = useState<null | ReturnType<typeof setTimeout>>(
        null
    );
    return (
        <div
            onMouseEnter={(event) => {
                const ele = event.currentTarget;
                setOut(
                    setTimeout(() => {
                        const react = ele.getBoundingClientRect();
                        dispatch(
                            ShowerActions.setShower({
                                dim: {
                                    x:
                                        react.left +
                                        window.scrollX +
                                        ele.clientWidth / 2,
                                    y:
                                        react.top +
                                        window.scrollY +
                                        ele.clientHeight / 2,
                                },
                                film,
                            })
                        );
                    }, showout)
                );
            }}
            onMouseLeave={() => {
                if (timeout) clearTimeout(timeout);
            }}
            className="bg-black-off-2 flex items-center aspect-[91/121] min-w-[5rem] w-[calc(100%/6.5)] flex-shrink-0 rounded overflow-hidden"
        >
            <Link
                href={`/movies/${name}`}
                className="w-full block"
            >
                <Img
                    src={getSourceImage(thumbnails.portal)}
                    alt={name}
                    className="relative after:text-center after:bg-black-off-2 after:content-[attr(alt)] after:absolute  after:top-0 after:left-0 after:w-full after:h-full after:flex after:justify-center after:items-center w-full hover:scale-125 transition-transform text-white/40 capitalize"
                    style={{
                        transitionDuration: `${showoutTrans}ms`,
                        transitionDelay: `${animationDelay}ms`,
                    }}
                />
            </Link>
        </div>
    );
}
function FilmsSkeleton() {
    return (
        <div className="w-full flex items-stretch gap-3 overflow-hidden pr-32 max-w-full">
            {
                [...new Array(8)].map((_, i) => {
                    return (
                        <div
                            key={i}
                            className="bg-black-off-2 aspect-[91/121] min-w-[5rem] w-[calc(100%/6.5)] flex-shrink-0 rounded"
                        ></div>
                    );
                })
            }
        </div>
    );
}
export function TitleSkeleton() {
    return (
        <div>
            <h1 className="bg-black-off-2 w-56 h-8 mb-5"></h1>
            <div className="pb-8">
                <FilmsSkeleton />
            </div>
        </div>
    );
}
export function Title({
    title,
    films,
    ...props
}: { title?: string; films?: Film[] } & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>) {
    return (
        <div>
            {title && <h1 className="mb-4 font-bold text-2xl">{title}</h1>}
            <div className="pb-8 max-w-full">
                {films ? (
                    <Slider
                        className="w-full flex items-stretch gap-3 overflow-x-hidden overflow-y-visible pr-32 max-w-full"
                        {...props}
                    >
                        {films.map((film, i) => {
                            return (
                                <FilmPreview
                                    film={film}
                                    key={i}
                                />
                            );
                        })}
                    </Slider>
                ) : (
                    <FilmsSkeleton />
                )}
            </div>
        </div>
    );
}
