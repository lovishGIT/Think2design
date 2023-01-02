const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_TOKEN = "IAMVIHAANSINGLA";
const Stationinfo = require("../../models/Stationinfo");
var nodemailer = require("nodemailer");

router.post("/create_estation", async (req, res) => {
  try {
    const { ename, eaddress, city, state, pincode } = req.body.data;
    if (!ename || !eaddress || !city || !state || !pincode) {
      return res.json({ status: "error", message: "Some fields are missing" });
    } else {
      const stationinfo = new Stationinfo({
        ename,
        eaddress,
        city,
        state,
        pincode,
      });
      const data = await stationinfo.save();
      
      return res
        .status(201)
        .json({ status: "success", message: "Data saved successfully" });
    }
  } catch (error) {
    res.status(400).send({ error: "Some Internal Server Error" });
  }
});

router.put("/create_estation/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { ename, eaddress, city, state, pincode } = req.body.data;

    if (!ename || !eaddress || !city || !state || !pincode) {
      return res.json({ status: "error", message: "Some fields are missing" });
    } else {
      Stationinfo.findByIdAndUpdate(id, req.body.data, (err, success) => {
        if (err) {
          res.json({ status: "error", message: "Some Internal Server Error" });
        } else {
          return res.json({
            status: "success",
            message: "Data updated successfully",
          });
        }
      });
    }
  } catch (error) {
    res.json({ status: "error", message: "Some Internal Server Error" });
  }
});

router.get("/get_station/:id", async (req, res) => {
  try {
    const id = req.params.id;

    Stationinfo.find({ _id: id }, (err, data) => {
      if (err) {
        res.json({ status: "error", message: "some error occured" });
      } else {
        res.json({ status: "success", data: data });
      }
    });
    //   const stationinfo = new Stationinfo({
    //     ename,
    //     eaddress,
    //     city,
    //     state,
    //     pincode,
    //   });
    //   await stationinfo.save();
    //   return res
    //     .status(201)
    //     .json({ status: "success", message: "Data saved successfully" });
  } catch (error) {
    res.status(400).send({ error: "Some Internal Server Error" });
  }
});

router.post("/draft_record/:id", async (req, res) => {
  const id = req.params.id;
  try {
    Stationinfo.findOne({ _id: id }, (err, data1) => {
      
        Stationinfo.findByIdAndUpdate(id,{draft:!data1.draft}, (err, data) => {
         
          if (err) {
            res.json({ status: "error", message: "some error occured" });
          } else {
            res.json({
              status: "success",
              message: "Record successfully drafted",
            });
          }
        });
    
    });
  } catch (error) {
    res.status(400).send({ error: "Some Internal Server Error" });
  }
});

router.get("/search/:query", async (req, res) => {
  const query = req.params.query;

  Stationinfo.find(
    {draft:false,
      $or: [
        { ename: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { state: { $regex: query, $options: "i" } },
        { eaddress: { $regex: query, $options: "i" } },
      ],
    },
    (err, data) => {
      res.send(data);
    }
  );
});

router.delete("/delete_record/:id", async (req, res) => {
  const id = req.params.id;
  try {
    Stationinfo.deleteOne({ _id: id }, (err, data) => {
      if (err) {
        res.json({ status: "error", message: "some error occured" });
      } else {
        res.json({ status: "success", message: "Record successfully deleted" });
      }
    });
  } catch (error) {
    res.status(400).send({ error: "Some Internal Server Error" });
  }
});

router.get("/get_station", async (req, res) => {
  try {
    Stationinfo.find({}, (err, data) => {
      if (err) {
        res.json({ status: "error", message: "some error occured" });
      } else {
        res.json({ status: "success", data: data });
      }
    });
    //   const stationinfo = new Stationinfo({
    //     ename,
    //     eaddress,
    //     city,
    //     state,
    //     pincode,
    //   });
    //   await stationinfo.save();
    //   return res
    //     .status(201)
    //     .json({ status: "success", message: "Data saved successfully" });
  } catch (error) {
    res.status(400).send({ error: "Some Internal Server Error" });
  }
});

module.exports = router;
