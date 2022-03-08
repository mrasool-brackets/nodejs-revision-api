module.exports = (role) => {
    return (req, res, next) => {
        try {
            const userRole = req.userData.role
            if (role != userRole){
                res.status(401).json({
                    msg:"Permission Denied."
                })
            } else {
                next()
            }
        } catch (error) {
            res.status(401).json({
                msg:"Please Login to Continue."
            })                
        }
    }
}