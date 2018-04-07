const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        const from = 'Me';
        const text = 'Message';
        const message = generateMessage(from, text);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({ from, text });
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const from = 'Me';
        const latitude = 1;
        const longitude = 2;
        const url = 'https://www.google.com/maps?' + latitude + ',' + longitude;
        const message = generateLocationMessage(from, latitude, longitude);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({ from, url });
    });
})