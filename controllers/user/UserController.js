import UserSchema from "../../models/UserModel";

const UserController = {
    async viewUser(req, res, next) {
        const userId = req.user.id;
        try {
            const user = await UserSchema.findById(userId);
            if (!user) {
                return res.status(400).json({ msg: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }

    }
}

export default UserController;