const server = require('../api/server');
const request = require('supertest');
const prepTestDB = require('../helpers/prepTestDB');
const restrict = require('../middleware/authenticate-middleware');
jest.mock('../middleware/authenticate-middleware.js')
beforeEach(prepTestDB)
beforeEach(() => restrict.mockClear())

describe('favorite comments', () => {
    it('get /api/comments/favorite', async () => {
        restrict.mockImplementation((req, res, next) => {
            console.log("I ran the test!")
            req.user = { id: 1};
            next()
        })
        const res = await request(server)
            .get('/api/comments/favorites')
            expect(res.status).toBe(200)
            expect(restrict).toBeCalled();
       
    })
    it('posts a favorite comment to the BE DB', async () => {
        restrict.mockImplementation((req, res, next) => {
            console.log("I ran the test twice!")
            req.user = { id: 1};
            next()
        })
        const res = await request(server)
        .post('/api/comments/newfav')
        .send({comment: "123456"})
        expect(res.status).toBe(201)
        expect(restrict).toBeCalled();

    })
    it('deletes a favorite comment from the BE DB', async () => {
        restrict.mockImplementation((req, res, next) => {
            console.log("I ran the test again!")
            req.user = { id: 1};
            next()
        })
        const res = await request(server)
        .delete('/api/comments/deletefav')
        .send({comment: "123456"})
        expect(res.status).toBe(200)
        expect(restrict).toBeCalled();
    })
})