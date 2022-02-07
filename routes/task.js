const express = require("express");
const router = express.Router();
const mongojs = require("mongojs");
const db = mongojs("tasks");
//get all tasks
router.get("/", function (req, res) {
  db.tasks.find({}, (err, data) => {
    console.log("Data : ", data);
    if (err) res.status(500).json(err);
    else res.status(200).json(data);
  });
});
//insert tasks
router.post("/", function (req, res) {
  req.checkBody("title", "title must be not empty").notEmpty();
  req.checkBody("done", "done must be boolean").isBoolean();
  let validationErrors = req.validationErrors();
  if (validationErrors) {
    res.status(400).json(validationErrors);
    return false;
  }
  req.body.date = new Date();
  db.tasks.insert(req.body, function (err, data) {
    if (err) {
      res.status(500).json({ msg: "Server Error" });
    } else {
      res.status(200).json({ msg: "Tasks inserted" });
    }
  });
});
//update tasks
router.put("/:id", function (req, res) {
  req.checkBody("title", "title should not be empty").notEmpty();
  req.checkParams("id", "id must be mongo id").notEmpty().isMongoId();

  let validationErrors = req.validationErrors();
  if (validationErrors) {
    res.status(400).json(validationErrors);
    return false;
  }
  let taskId = req.params.id;
  let data = req.body;
  db.tasks.update(
    { _id: mongojs.ObjectId(taskId) },
    { $set: data },
    function (err, data) {
      if (err) {
        res.status(500).json({ msg: "Server Error" });
      } else {
        res.status(200).json({ msg: "data updated!" });
      }
    }
  );
});

//delete tasks
router.delete("/:id", function (req, res) {
  req.checkParams("id", "id must be mongoid").isMongoId();
  let validationErrors = req.validationErrors();
  if (validationErrors) {
    res.status(400).json(validationErrors);
    return false;
  }
  let taskId = req.params.id;
  db.tasks.remove({ _id: mongojs.ObjectId(taskId) }, function (err, data) {
    if (err) {
      res.status(500).json({ msg: "Server Error" });
    } else {
      res.status(200).json({ msg: "data deleted" });
    }
  });
});
//update done
router.patch("/change-status/:id/:done", function (req, res) {
  // Validation
  req.checkParams("id", "id must be mongoid").isMongoId();
  req.checkParams("done", "done must be boolean").isBoolean();

  let validationErrors = req.validationErrors();
  if (validationErrors) {
    res.status(400).json(validationErrors);
    return false;
  }

  let taskId = req.params.id;
  let done = req.params.done;
  if (done == "true") {
    done = true
  } else {
    done = false
  }

  let toUpdate = {
    done,
  };
  db.tasks.update(
    { _id: mongojs.ObjectId(taskId) },
    { $set: toUpdate },
    function (err, data) {
      if (err) {
        res.status(500).json({ msg: "Server Error" });
      } else {
        res.status(200).json({ msg: "updated!" });
      }
    }
  );
});
module.exports = router;
