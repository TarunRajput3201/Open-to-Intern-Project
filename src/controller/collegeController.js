const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

function validURL(myURL) {
    let regex = (/^(https:\/\/|http:\/\/)[a-zA-Z!_$]+\-[a-zA-Z]+\.[a-zA-Z3]+\.[a-z]+\-[a-z]+\-[1]+\.[a-z]+\.(com)+\/[radon]+\/[a-zA-Z]+\.(jpeg|jpg|png|gif|webp)$/)
    return regex.test(myURL)
 }


let createCollege = async function (req, res) {
    res.setHeader("access-control-allow-origin","*")
    try{
        
    let bodyData = req.body
    let { name, fullName, logoLink } = bodyData
    if (Object.keys(bodyData).length === 0) {
        return res.status(400).send({ status: false, message: "please provide data" })
    }

    let checkname = await collegeModel.findOne({name:name})
    
if(!name){
    return res.status(400).send({ status: false, message: "college name is missing" })
}
if(!/^([a-zA-Z ]){1,100}$/.test(name)){
    return res.status(400).send({ status: false, message: "college name should not be a number or symbol" })
}
if(checkname){
    return res.status(400).send({ status: false, message: "college name is alredy exist please enter unique college name" }) 
}
if(!fullName){
    return res.status(400).send({ status: false, message: "college fullName is missing" })
}
if(!logoLink){
    return res.status(400).send({ status: false, message: "college logoLink is missing" })
}
if(!validURL(logoLink)){
    return res.status(400).send({status:false, message:"url not valid"})
}

let collegeCreate = await collegeModel.create(bodyData)


    res.status(201).send({ status: true, data: collegeCreate})
}
catch(error){
    res.status(500).send({status:false,message:error.message})
}
}


const collegedetail = async function (req, res) {
    res.setHeader("access-control-allow-origin","*")
try{let collegeName = req.query.collegeName
if(!collegeName){
    return res.status(400).send({status:false,message:"please provide college name"})
}
let checkname = await collegeModel.find({name:collegeName})
if(checkname.length==0){
    return res.status(400).send({status:false,message:"please provide valid college name"})
}
let college = await collegeModel.findOne({name:collegeName , isDeleted:false},{updatedAt:0,createdAt:0,isDeleted:0,__v:0}).lean()
let collegeId=college._id
let interns=await internModel.find({collegeId:collegeId},{_id:1,updatedAt:0,createdAt:0,isDeleted:0,__v:0,collegeId:0}).lean()

college.interns=interns
if(interns.length==0){return res.status(404).send({status:false , message: "there is no intern from this college"})}
delete college._id
res.status(200).send({status:true, data:college}) }
catch(error){
    res.status(500).send({status:false,message:error.message})
}

}

module.exports.createCollege = createCollege
module.exports.collegedetail = collegedetail


        