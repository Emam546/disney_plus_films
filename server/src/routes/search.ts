/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import FilmDB from "@serv/models/film";
import Validator, { parseRules } from "validator-checker-js";
// **** Init **** //
interface SearchParam {
    search: string;
}
const QueryRules = parseRules({
    search: "string",
});
const router = Router();

// **** Export default **** //

export default router;
