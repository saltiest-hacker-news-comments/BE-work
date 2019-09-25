const request = require('supertest');
const server = require('./server');

const db = require('../database/dbConfig');

describe('server.js', () => {
    it('should be set to the testing environment', ()=> {
        expect(process.env.NODE_ENV).toBe('testing')
    })
   describe(' GET /', () => {
       it('returns 200 OK', () => {
           return request(server)
            .get('/')
            .then(res => {
                expect(res.status).toBe(200);
            })
       })
       it('returns JSON', () => {
           return request(server)
           .get('/')
           .then(res => {
               expect(res.type).toMatch(/text/i)
           })
       })
   })
   
       
    

})