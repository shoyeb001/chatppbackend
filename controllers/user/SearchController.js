import UserSchema from "../../models/UserModel"

const SearchController = {
    async searchUser(req,res){
        try {
            const { username } = req.query;
            const user = new RegExp(username, 'i');
            const users = await UserSchema.find({ username:user });
            res.status(200).json(users);
          } catch (error) {
            res.status(500).json({ msg: 'Internal server error' });
        }
    }
}

export default SearchController;