class Users {

    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = { id, name, room };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        const user = this.getUser(id);

        if (user) {
            this.users = this.users.filter(u => u.id !== user.id);
        }
        return user;
    }

    getUser(id) {
        return this.users.find(u => u.id === id);
    }

    getUserList(room) {
        let users = this.users.filter((user) => user.room === room);
        users = users.map(u => u.name);
        return users;
    }
}

module.exports = { Users };