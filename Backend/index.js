import express from 'express';
import ChatRouter from './Routes/ChatRoute.js';

const app=express();
const PORT=process.env.PORT || 5000;


app.use(express.json());
app.use('/api/chat',ChatRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}
);

