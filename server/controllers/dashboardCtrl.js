const { default: mongoose } = require("mongoose");
const NoteModel = require("../model/Notes");
class DashboardController {
    /* Get home page */
    async dashboard(req, res, next) {
        /* pagination */
        let perPage = 8;
        let currentPage = req.query.page || 1;
        /* local */
        const locals = {
            title: "Dashboard",
            description: "Free NodeJS Notes App.",
        };
        try {
            // const notes = await NoteModel.find({});
            const notes = await NoteModel.aggregate([
                { $sort: { updatedAt: -1 } },
                { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
                {
                    $project: {
                        title: { $substr: ["$title", 0, 30] },
                        body: { $substr: ["$body", 0, 100] },
                    },
                },
            ])
                .skip(perPage * currentPage - perPage)
                .limit(perPage)
                .exec();
            const count = await NoteModel.countDocuments({ user: req.user.id });
            res.render("dashboard/index", {
                userName: req.user.firstName + " " + req.user.lastName,
                notes,
                locals,
                currentPage,
                totalPage: Math.ceil(count / perPage),
                layout: "../views/layouts/dashboard",
            });
        } catch (error) {
            console.log(error);
        }
    }

    async dashboardViewNote(req, res) {
        const note = await NoteModel.findById({ _id: req.params.id }).where({ user: req.user.id }).lean();
        if (note) {
            res.render("dashboard/view_note", {
                noteID: req.params.id,
                note,
                layout: "../views/layouts/dashboard",
            });
        } else {
            res.send("Something went wrong.");
        }
    }
    async dashboardUpdateNote(req, res) {
        try {
            await NoteModel.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, body: req.body.body, updatedAt: Date.now() }).where({ user: req.user.id });
            res.redirect("/dashboard");
        } catch (error) {
            console.log(error);
        }
    }
    async dashboardDeleteNote(req, res) {
        try {
            await NoteModel.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
            res.redirect("/dashboard");
        } catch (error) {
            console.log(error);
        }
    }
    async dashboardAddNote(req, res) {
        res.render("dashboard/add_note", {
            layout: "../views/layouts/dashboard",
        });
    }
    async dashboardAddNoteSubmit(req, res) {
        try {
            req.body.user = req.user.id;
            await NoteModel.create(req.body);
            res.redirect("/dashboard");
        } catch (error) {
            console.log(error);
        }
    }
    async dashboardSearch(req, res) {
        try {
            res.render("dashboard/search_note", {
                searchResults: "",
                layout: "../views/layouts/dashboard",
            });
        } catch (error) {}
    }
    async dashboardSearchSubmit(req, res) {
        try {
            let searchTerm = req.body.searchTerm;
            const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
            const searchResults = await NoteModel.find({
                $or: [
                    {
                        title: { $regex: new RegExp(searchNoSpecialChars, "i") },
                    },
                    {
                        body: { $regex: new RegExp(searchNoSpecialChars, "i") },
                    },
                ],
            }).where({ user: req.user.id });
            res.render("dashboard/search_note", {
                searchResults,
                layout: "../views/layouts/dashboard",
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new DashboardController();
