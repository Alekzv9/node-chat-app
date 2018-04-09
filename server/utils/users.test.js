const expect = require('expect');
const { Users } = require('./users');


describe('Users class', () => {
    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'User1',
            room: 'Room1'
        }, {
            id: 2,
            name: 'User2',
            room: 'Room2'
        }, {
            id: 3,
            name: 'User3',
            room: 'Room1'
        }]
    });

    it('Should add new user', () => {
        const users = new Users();
        const user = {
            id: 1,
            name: 'Test',
            room: 'RoomTest'
        };
        const res = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user])
    });

    it('Should return names for group "room1"', () => {
        let userList = users.getUserList('Room1');
        expect(userList).toEqual(['User1', 'User3']);
    });

    it('Should return names for group "room2"', () => {
        let userList = users.getUserList('Room2');
        expect(userList).toEqual(['User2']);
    });

    it('should remove a user', () => {
        const userId = 1;
        const user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        const userId = 99;
        const user = users.removeUser(userId);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find a user', () => {
        const userId = 2;
        const user = users.getUser(userId);
        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        const userId = 99;
        const user = users.getUser(userId);
        expect(user).toNotExist();
    });
});