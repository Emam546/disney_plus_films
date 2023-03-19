import { Router } from "express";
import CompaniesDB from "@src/models/Companies";
// **** Init **** //

const router = Router();

router.get("/:name", async (req, res) => {
    const company = await CompaniesDB.findOne({ name: req.params.name.split("-").join(" ") }).hint({
        name: 1,
    });
    if (!company)
        return res
            .status(404)
            .json({ state: false, message: "Company NOT FOUND" });

    return res.json({ state: false, message: "Success", data: company });
});
router.get("/", async (req, res) => {
    const companies = await CompaniesDB.find()
    return res.json({ state: false, message: "Success", data: companies });
});
// **** Export default **** //

export default router;
