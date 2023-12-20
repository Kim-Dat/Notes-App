class MainController {
    /* Get home page */
    async homepage(req, res) {
        const locals = {
            title: "NodeJS Notes",
            description: "Free NodeJS Notes App."
        }
        res.render('index', {
            locals,
            layout: '../views/layouts/front_page'
        } )
    }
    /* Get about */
    async about(req, res) {
        const locals = {
            title: "About - NodeJS Notes",
            description: "Free NodeJS Notes App."
        }
        res.render('about', locals )
    }
    
}

module.exports = new MainController();
