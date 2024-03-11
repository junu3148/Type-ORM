import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import { error } from 'console';
import { User } from './entity/User';
import { create } from 'domain';

const app = express();

app.use(express.json());
// 로그
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 회원 가입
app.post("/users", async (req, res) => {
    const user = await AppDataSource.getRepository(User).create(req.body);
    console.log(user);
    const results = await AppDataSource.getRepository(User).save(user);
    return res.send(results);
})

// 회원 리스트
app.get("/users", async (req, res) => {
    const results = await AppDataSource.getRepository(User).find();
    return res.json(results);
})

// 회원 정보
app.get("/users/:userId", async (req, res) => {
    const results = await AppDataSource.getRepository(User).findOneBy({
        id: Number(req.params.userId)
    });
    return res.json(results);

});

// 회원 정보 수정
app.put("/users/:userId", async (req, res) => {
    const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number(req.params.userId)
    });
    AppDataSource.getRepository(User).merge(user, req.body);
    const result = await AppDataSource.getRepository(User).save(user);
    return res.send(result);
});

// 회원 삭제
app.delete("/users/:userId", async (req, res) =>{
    const result = await AppDataSource.getRepository(User).delete(req.params.userId);
    return res.json(result);
});


AppDataSource
    .initialize()
    .then(() => {
        console.log('성공');
    })
    .catch((error) => {
        console.log(error);
    });


const port = 4000;
app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
})



