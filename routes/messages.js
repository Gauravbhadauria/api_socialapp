const Message = require("../models/Message");

const router = require("express").Router();


//add message

router.post("/", async (req, res) => {
    const newMessage = new Message(req.body);
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  });


//get message

router.get("/:conversatioId",async(req,res)=>{
    try{
        const messages=await Message.find({
            conversationId:req.params.conversatioId
        })
        res.status(200).json(messages)
    }catch(err){
        res.status(500).json(err)
    }
})




module.exports=router