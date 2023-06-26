const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());
mongoose.set("strictQuery", false);

const jsdfsw=new Date();
console.log(jsdfsw.getDate(),jsdfsw.getHours());

const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iiitaks12345@gmail.com",
    pass: "kamnbqnhpjztbhta",
  },
});
var mailOptions = {
  from: "iiitaks12345@gmail.com",
  to: "",
  subject: "SubGreddiit Notification",
  text: "",
};
const dburl =
  "mongodb+srv://users:5WTmhGDa9eafGNn3@cluster1.bl7gbeo.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connection successful");
  })
  .catch((e) => {
    console.log(e);
  });

const saltRounds = 10;

const secret = "IamtheKING";

const userSchema = new mongoose.Schema({
  Fname: String,
  Lname: String,
  Uname: String,
  Age: String,
  Email: String,
  ContactNo: String,
  Password: String,
});

const User = new mongoose.model("User", userSchema);

const user_followSch = new mongoose.Schema({
  Uname: String,
  Password: String,
  Followers: [String],
  Following: [String],
});

const Follow = new mongoose.model("follower", user_followSch);

const subG = new mongoose.Schema({
  Name: String,
  Desc: String,
  Tags: [String],
  BannedKeys: [String],
  Moderators: [{ Uname: String, Email: String }],
  Followers: [{ Uname: String, Email: String, Blocked: String }],
  JoinReqs: [{ Uname: String, Email: String }],
  Left: [{ Uname: String, Email: String }],
});

const SubGreddiit = new mongoose.model("SubGreddiit", subG);

const pst = new mongoose.Schema({
  SubName: String,
  posts: [
    {
      Uname: String,
      Email: String,
      Desc: String,
      Comments: [{ Uname: String, Email: String, ComStr: String }],
      Upvotes: [String],
      Downvotes: [String],
    },
  ],
});

const Post = new mongoose.model("Post", pst);

// const temp=new Post({
//   SubName:"zbcd",
//   posts:[]
// });

// temp.save();

const rep = new mongoose.Schema({
  SubName: String,
  Reports: [
    {
      posterName: String,
      posterEmail: String,
      reporterName: String,
      reporterEmail: String,
      Concern: String,
      text: String,
      status: Number,
      repid: String,
    },
  ],
});

const Report = new mongoose.model("Report", rep);

const svdps = new mongoose.Schema({
  Uname: String,
  Email: String,
  posts: [{ SubName: String, Postid: String }],
});

const SavedPost = new mongoose.model("Savedpost", svdps);

const joinstat = new mongoose.Schema({
  Name: String,
  Click: [{ Uname: String }],
});

const Stat = new mongoose.model("stat", joinstat);

const blockrepStat = new mongoose.Schema({
  Name: String,
  Blocks: [{ Uname: String }],
});

const BlockStat = new mongoose.model("block", blockrepStat);

app.post("/api/newSub", (req, res) => {
  const newv = req.body;
  const j = newv.usrjwt;
  try {
    dec = jwt.verify(j, secret);
  } catch (error) {
    res.status(401).send({ disp: "Access Restricted, JWT Error!", message: 0 });
  }
  User.findOne({ Uname: dec.Uname }, (err, us) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    if (dec.Password != us.Password || !us) {
      res.send({ message: 0 });
    } else {
      const subg = new SubGreddiit({
        Name: newv.Name,
        Desc: newv.Desc,
        Tags: newv.Tags,
        BannedKeys: newv.BannedKeys,
        Moderators: [{ Uname: us.Uname, Email: us.Email }],
        Followers: [{ Uname: us.Uname, Email: us.Email, Blocked: "0" }],
        JoinReqs: [],
        Left: [],
      });
      SubGreddiit.find({ Name: newv.Name }, (er, out) => {
        if (out.length === 0) {
          subg.save();
          const temp = new Post({
            SubName: newv.Name,
            posts: [],
          });

          const temp2 = new Report({
            SubName: newv.Name,
            Reports: [],
          });

          const temp3 = new Stat({
            Name: newv.Name,
            Click: [],
          });

          temp3.save();

          const temp4 = new BlockStat({
            Name: newv.Name,
            Blocks: [],
          });

          temp4.save();

          temp.save();
          temp2.save();
          res.send({ message: "New Subgreddiit Added!" });
        } else {
          res.send({ message: "SubGreddiit with this name already exists!" });
        }
      });
    }
  });
});

app.post("/api/follow", (req, res) => {
  const name = req.body.Uname;
  Follow.findOne({ Uname: name }, (err, us) => {
    if (!err) {
      res.send({ message: 1, follow: us });
    } else {
      res.send(err);
    }
  });
});

app.post("/api/upFollowers", (req, res) => {
  const newFollArr = req.body.forFoll;
  const torem = req.body.torem;
  const currus = req.body.curr;
  Follow.findOneAndUpdate({ Uname: newFollArr.Uname }, newFollArr, (err, f) => {
    if (err) {
      res.send({ message: 0 });
    }
    //remove from following of torem
    Follow.updateOne(
      { Uname: torem },
      { $pull: { Following: currus } },
      (e, out) => {
        if (e) {
          res.send({ message: 0 });
        }
        res.send({ message: 1 });
      }
    );
  });
});

app.post("/api/upFollowing", (req, res) => {
  const newFollArr = req.body.forFoll;
  const torem = req.body.torem;
  const currus = req.body.curr;
  Follow.findOneAndUpdate({ Uname: newFollArr.Uname }, newFollArr, (err, f) => {
    if (err) {
      res.send({ message: 0 });
    }
    Follow.updateOne(
      { Uname: torem },
      { $pull: { Followers: currus } },
      (e, out) => {
        if (e) {
          res.send({ message: 0 });
        }
        res.send({ message: 1 });
      }
    );
  });
});

app.post("/api/login", (req, res) => {
  const { Uname, pass } = req.body;

  User.findOne({ Uname: Uname }, (err, us) => {
    if (us) {
      bcrypt.compare(pass, us.Password, function (err, result) {
        if (result === true) {
          const tok = jwt.sign(us.toJSON(), secret);
          const tosend = {
            message: "Login Successful!",
            user: us,
            token: tok,
            c: 1,
          };
          res.send(tosend);
        } else {
          res.send({ message: "Wrong Password!", c: 9 });
        }
      });
    } else {
      res.send({ message: "User not Registered", c: 0 });
    }
  });
});

app.post("/api/register", (req, res) => {
  User.findOne({ Email: req.body.email }, (err, us) => {
    if (us) {
      res.send({ message: "User with this email already exists!" });
    } else {
      User.findOne({ Uname: req.body.Uname }, (er, u) => {
        if (u) {
          res.send({ message: "User with this Username already exists!" });
        } else {
          bcrypt.hash(req.body.pass, saltRounds, (err, hsh) => {
            const usr = new User({
              Fname: req.body.Fname,
              Lname: req.body.Lname,
              Uname: req.body.Uname,
              Age: req.body.Age,
              Email: req.body.email,
              ContactNo: req.body.cnum,
              Password: hsh,
            });
            usr.save((err) => {
              if (err) {
                res.send(err);
              } else {
                const tofol = new Follow({
                  Uname: req.body.Uname,
                  Password: hsh,
                  Followers: [],
                  Following: [],
                });
                tofol.save();
                const svpost = new SavedPost({
                  Uname: req.body.Uname,
                  Email: req.body.email,
                  Saved: [],
                });
                svpost.save();
                res.send({
                  message: "Successfully Registered, Please Login now",
                });
              }
            });
          });
        }
      });
    }
  });
});

app.post("/api/user", (req, res) => {
  let Token = req.body.jwt;
  let dec;
  try {
    dec = jwt.verify(Token, secret);
  } catch (error) {
    res.status(401).send({ disp: "Access Restricted, JWT Error!", message: 0 });
  }
  var uname = dec.Uname;

  User.findOne({ Uname: uname }, (err, us) => {
    if (us.Password === dec.Password) {
      res.send({ message: 1, user: us });
    } else {
      res.send({ message: 0 });
    }
  });
});

app.post("/api/update", (req, res) => {
  console.log(req.body.upuser);
  const newusrdata = req.body.upuser;
  User.findOneAndUpdate(
    { Email: newusrdata.Email },
    newusrdata,
    (err, data) => {
      if (err) {
        res.send({ message: err });
      } else {
        res.send({ message: "Done updating" });
      }
    }
  );
});

app.post("/api/listData", (req, res) => {
  const j = req.body.userjwt;
  let dec;
  try {
    dec = jwt.verify(j, secret);
  } catch (error) {
    res.status(401).send({ disp: "Access Restricted, JWT Error!", message: 0 });
  }
  SubGreddiit.find(
    { Moderators: { $elemMatch: { Uname: dec.Uname, Email: dec.Email } } },
    (err, rval) => {
      if (err) {
        res.send({ message: 0 });
      }
      const nms = rval.map((p) => p.Name);
      Post.find({ SubName: { $in: nms } }, (e, r) => {
        if (e) {
          res.send({ message: 0 });
        }
        res.send({ x: r, d: rval, uname: dec.Uname, uemail: dec.Email });
      });
    }
  );
});

app.post("/api/delsub", (req, res) => {
  const to_del = req.body.sub;
  const t = req.body.usrjwt;
  let dec;
  try {
    dec = jwt.verify(t, secret);
  } catch (error) {
    res.status(401).send({ disp: "Access Restricted, JWT Error!", message: 0 });
  }
  SubGreddiit.deleteOne({ Name: to_del.Name })
    .then(() => {
      BlockStat.deleteOne({ Name: to_del.Name }, (a, b) => {
        if (a) {
          res.send({ message: 0 });
        }
        Post.deleteOne({ SubName: to_del.Name }, (c, d) => {
          if (c) {
            res.send({ message: 0 });
          }
          Report.deleteOne({ SubName: to_del.Name }, (e, f) => {
            if (e) {
              res.send({ message: 0 });
            }
            Stat.deleteOne({ Name: to_del.Name }, (g, h) => {
              if (g) {
                res.send({ message: 0 });
              }
              res.send({ message: 1 });
            });
          });
        });
      });
    })
    .catch((err) => {
      res.send({ message: 0 });
    });
});

app.post("/api/getUsersData", async (req, res) => {
  const jw = req.body.jwt;
  let dec;
  try {
    dec = jwt.verify(jw, secret);
  } catch (error) {
    res.status(401).send({ disp: "Access Restricted, JWT Error!", message: 0 });
  }
  const refreshdays = 10;
  const sg = req.body.sg;
  SubGreddiit.findOne({ Name: sg }, async (err, item) => {
    if (err) {
      res.send({ message: "Error!" });
    }
    Report.findOne({ SubName: sg }, async (er, o) => {
      if (er) {
        res.send({ message: "Error!" });
      }
      let bc = o.Reports;
      let d = new Date();
      const date1 = d.toISOString();

      const DAY_UNIT_IN_MILLISECONDS = 24 * 3600 * 1000;

      let rvarr = [];

      const promises = bc.map(async (k) => {
        if (k.status !== 0) {
          rvarr.push(k);
        } else {
          const at = k._id.toString().substring(0, 8);
          const diffInMilliseconds =
            new Date(date1).getTime() - new Date(parseInt(at, 16) * 1000);
          const diffInDays = diffInMilliseconds / DAY_UNIT_IN_MILLISECONDS;
          if (diffInDays < refreshdays) {
            rvarr.push(k);
          }
        }
      });

      await Promise.all(promises);

      res.send({ usr: dec, newd: item, rep: rvarr });
    });
  });
});

app.post("/api/JoinReq", (req, res) => {
  const sgName = req.body.sg;
  const reqdt = req.body.Req;
  const index = req.body.in;

  SubGreddiit.findOne({ Name: sgName }, (err, sgD) => {
    if (err) {
      console.log("err");
      res.send({ message: 0 });
    }
    const newarr = sgD.JoinReqs;
    newarr.splice(index, 1);
    const folarr = sgD.Followers;
    folarr.push({ ...reqdt, Blocked: "0" });
    SubGreddiit.updateOne(
      { Name: sgName },
      { JoinReqs: newarr, Followers: folarr },
      (err, retv) => {
        if (err) {
          res.send({ message: 0 });
        }
      }
    );
  });
});

app.post("/api/DelReq", (req, res) => {
  const sgName = req.body.sg;
  const reqdt = req.body.Req;
  const index = req.body.in;

  SubGreddiit.findOne({ Name: sgName }, (err, sgD) => {
    if (err) {
      console.log("err");
      res.send({ message: 0 });
    }
    const newarr = sgD.JoinReqs;
    newarr.splice(index, 1);
    SubGreddiit.updateOne(
      { Name: sgName },
      { JoinReqs: newarr },
      (err, retv) => {
        if (err) {
          res.send({ message: 0 });
        }
      }
    );
  });
});

app.post("/api/getAllSubG", (req, res) => {
  const jw = req.body.jwt;
  const dec = jwt.verify(jw, secret);
  SubGreddiit.find({}, (err, out) => {
    if (err) {
      res.send({ mes: 0 });
    }
    out.sort((a, b) => {
      let x = 0;
      a.Followers.forEach((element, ind) => {
        if (element.Uname === dec.Uname && element.Email === dec.Email) {
          x = 1;
        }
      });
      if (x === 1) {
        return -2;
      } else {
        return 2;
      }
    });
    let vb = out.map((x) => x.Name);
    Post.find({ SubName: { $in: vb } }, async (l, dtout) => {
      if (l) {
        res.send({ mes: 0 });
      }
      let rdt = [];

      const promises = out.map(async (k) => {
        m = await dtout.find((a) => a.SubName === k.Name);
        rdt.push({ ...k._doc, a: m.posts });
      });

      await Promise.all(promises);

      res.send({ dt: rdt, usr: dec });
    });
  });
});

app.post("/api/AddFolToSub", (req, res) => {
  const sg = req.body.sub;
  const sgName = sg.Name;
  const una = req.body.uname;
  const em = req.body.email;

  let reqarr = sg.JoinReqs;
  reqarr.push({ Uname: una, Email: em });
  SubGreddiit.updateOne({ Name: sgName }, { JoinReqs: reqarr }, (er, ot) => {
    if (er) {
      res.send({ message: 0 });
    }
  });
});

app.post("/api/RemFromSub", (req, res) => {
  const uname = req.body.uname;
  const email = req.body.email;
  const subgname = req.body.Name;
  try {
    SubGreddiit.findOne({ Name: subgname }, (err, out) => {
      if (err) {
        res.send({ message: 0 });
      }
      let newar = out.Followers;
      let leftar = out.Left;
      let nnar = newar.filter((e) => {
        return e.Uname !== uname;
      });
      if (!leftar.includes({ Uname: uname, Email: email })) {
        leftar.push({ Uname: uname, Email: email });
      }
      SubGreddiit.updateOne(
        { Name: subgname },
        { Followers: nnar, Left: leftar },
        (er, o) => {
          if (er) {
            res.send({ message: 0 });
          }
          res.send({ message: 1 });
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/getSgData", (req, res) => {
  const sgname = req.body.sgname;
  const j = req.body.jwt;
  const dec = jwt.verify(j, secret);

  SubGreddiit.findOne({ Name: sgname }, (err, item) => {
    if (err) {
      res.send({ message: 0 });
    }
    Post.findOne({ SubName: item.Name }, (er, out) => {
      if (er) {
        res.send({ message: 0 });
      }
      Follow.findOne({ Uname: dec.Uname }, (erro, outpu) => {
        if (erro) {
          res.send({ message: 0 });
        }
        Report.findOne({ SubName: item.Name }, (ab, cd) => {
          if (ab) {
            res.send({ message: 0 });
          }
          SavedPost.findOne({ Uname: dec.Uname, Email: dec.Email }, (g, h) => {
            if (g) {
              res.send({ message: 0 });
            }
            Stat.findOne({ Name: sgname }, (vb, ab) => {
              if (vb) {
                res.send({ message: 0 });
              }
              BlockStat.findOne({ Name: sgname }, (nc, mc) => {
                if (nc) {
                  res.send({ message: 0 });
                }
                res.send({
                  sg: item,
                  usr: dec,
                  posts: out,
                  Followers: outpu.Followers,
                  Following: outpu.Following,
                  Reports: cd.Reports,
                  svdpsts: h.posts,
                  clks: ab,
                  blocks: mc,
                });
              });
            });
          });
        });
      });
    });
  });
});

app.post("/api/AddPost", (req, res) => {
  const rb = req.body;
  const sgName = rb.sgName;
  const uname = rb.uname;
  const email = rb.email;
  const addDT = rb.toadd;
  Post.updateOne(
    { SubName: sgName },
    {
      $push: {
        posts: {
          Uname: uname,
          Email: email,
          Desc: addDT,
          Comments: [],
          Upvotes: [],
          Downvotes: [],
        },
      },
    },
    (e, x) => {
      if (e) {
        res.send({ message: e });
      }
      res.send("Post Added !");
    }
  );
});

app.post("/api/AddNewFol", (req, res) => {
  const newfol = req.body.nameofFol;
  const addTo = req.body.addTo;
  Follow.updateOne(
    { Uname: addTo },
    { $push: { Following: newfol } },
    (err, r) => {
      if (err) {
        res.send({ message: err });
      }
      Follow.updateOne(
        { Uname: newfol },
        { $push: { Followers: addTo } },
        (er, rva) => {
          if (er) {
            res.send({ message: err });
          }
          res.send({ message: "Started Following!" });
        }
      );
    }
  );
});

app.post("/api/DownvotePost", (req, res) => {
  const un = req.body.usrname;
  const sgname = req.body.sgName;
  const pstid = req.body.pstid;
  Post.findOne({ SubName: sgname }, (err, out) => {
    if (err) {
      console.log("Error!");
    }
    let bc = out;
    bc.posts.forEach((e) => {
      if (String(e._id) === String(pstid)) {
        e.Downvotes.push(un);
        let y = e.Upvotes;
        e.Upvotes = y.filter((x) => {
          return x !== un;
        });
      }
    });
    Post.updateOne({ SubName: sgname }, { posts: bc.posts }, (er, o) => {
      if (er) {
        res.send({ message: "Error!!" });
      }
      res.send({ message: "Downvoted!" });
    });
  });
});

app.post("/api/UpvotePost", (req, res) => {
  const un = req.body.usrname;
  const sgname = req.body.sgName;
  const pstid = req.body.pstid;
  Post.findOne({ SubName: sgname }, (err, out) => {
    if (err) {
      console.log("Error!");
    }
    let bc = out;
    bc.posts.forEach((e) => {
      if (String(e._id) === String(pstid)) {
        e.Upvotes.push(un);
        let y = e.Downvotes;
        e.Downvotes = y.filter((x) => {
          return x !== un;
        });
      }
    });
    Post.updateOne({ SubName: sgname }, { posts: bc.posts }, (er, o) => {
      if (er) {
        res.send({ message: "Error!!" });
      }
      res.send({ message: "Upvoted!" });
    });
  });
});

app.post("/api/AddComm", (req, res) => {
  const sgName = req.body.sgName;
  const pstid = req.body.pstid;
  const commobj = req.body.commobj;

  Post.findOne({ SubName: sgName }, (err, out) => {
    if (err) {
      res.send({ message: "Error!" });
    }
    let bc = out;
    bc.posts.forEach((e) => {
      if (String(e._id) === String(pstid)) {
        e.Comments.push(commobj);
      }
    });
    Post.updateOne({ SubName: sgName }, { posts: bc.posts }, (er, o) => {
      if (er) {
        res.send({ message: "Error!!" });
      }
      res.send({ message: "Comment Added!" });
    });
  });
});

app.post("/api/AddReport", (req, res) => {
  const sgname = req.body.sg;
  const dt = req.body.dat;

  Report.updateOne(
    { SubName: sgname },
    { $push: { Reports: dt } },
    (err, out) => {
      if (err) {
        res.send({ message: "Error!" });
      }
      res.send({ message: "Reported Successfully!" });
    }
  );
});

app.post("/api/delReport", (req, res) => {
  const sgname = req.body.sg;
  const todel = req.body.todel;
  const blkper = req.body.blkper;
  const reporterEmail = req.body.reporterEmail;
  Report.updateOne(
    { SubName: sgname },
    { $pull: { Reports: todel } },
    (err, out) => {
      if (err) {
        res.send({ message: "Error!" });
      }
      Post.findOne({ SubName: sgname }, (er, o) => {
        if (er) {
          res.send({ message: "Error!" });
        }
        let curarr = o.posts;
        const newp = curarr.filter((x) => {
          return String(x._id) !== todel.repid;
        });
        console.log(newp);
        Post.updateOne({ SubName: sgname }, { posts: newp }, (e, ou) => {
          if (e) {
            res.send({ message: "Error!" });
          }
          mailOptions.to = reporterEmail;
          mailOptions.text =
            "Hello user, we have decided to to delete the post by " +
            blkper +
            " which you had reported.";

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          mailOptions.to = "akshitshr@gmail.com";
          mailOptions.text =
            "Hello user, we have decided to to delete a post of yours, which was reported.";

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          res.send({ message: "Deleted Post!" });
        });
      });
    }
  );
});

app.post("/api/repStatus", (req, res) => {
  const sg = req.body.sg;
  const reportid = req.body.todel;
  const newsta = req.body.sta;
  const reporterEmail = req.body.reporterEmail;
  const blkper = req.body.blkper;

  Report.findOne({ SubName: sg }, (err, out) => {
    if (err) {
      res.send({ message: "Error!" });
    }
    let varar = out.Reports;
    varar.forEach((e) => {
      if (e.repid === reportid) {
        e.status = newsta;
      }
    });
    Report.updateOne({ SubName: sg }, { Reports: varar }, (e, ou) => {
      if (e) {
        res.send({ message: "Error!" });
      }
      if (newsta === 1) {
        console.log(reporterEmail);
        mailOptions.to = reporterEmail;
        mailOptions.text =
          "Hello user, we have decided to ignore your report for " + blkper;

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        res.send({ message: "Ignored Report!" });
      } else {
        Post.findOne({ SubName: sg }, (mye, oui) => {
          if (mye) {
            res.send({ message: "Error!" });
          }
          let teo = oui.posts;
          teo.forEach((i) => {
            if (String(i._id) === reportid) {
              i.Uname = "Blocked User";
            }
          });
          Post.updateOne({ SubName: sg }, { posts: teo }, (xv, yu) => {
            if (xv) {
              res.send({ message: "Error!" });
            }
            mailOptions.to = reporterEmail;
            mailOptions.text =
              "Hello user, we have decided to block the user " +
              blkper +
              " for posting something you have reported.";

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            BlockStat.updateOne(
              { Name: sg },
              { $push: { Blocks: { Uname: blkper } } },
              (nmg, klj) => {
                if (nmg) {
                  res.send({ message: "Error!" });
                }
                SubGreddiit.findOne({ Name: sg }, async (ab, cd) => {
                  if (ab) {
                    res.send({ message: "Error!" });
                  }
                  let mem = cd.Followers;
                  let bnm = [];

                  const promises = mem.map(async (k) => {
                    if (k.Uname === blkper) {
                      k.Blocked = "1";
                    }
                    bnm.push(k);
                  });

                  await Promise.all(promises);

                  SubGreddiit.updateOne(
                    { Name: sg },
                    { Followers: bnm },
                    (wq, qw) => {
                      if (wq) {
                        res.send({ message: "Error!" });
                      }

                      mailOptions.to = "akshitshr@gmail.com";
                      mailOptions.text =
                        "Hello user, we have decided to block you for a post of yours, which was reported.";

                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log("Email sent: " + info.response);
                        }
                      });

                      res.send({ message: "Blocked User!" });
                    }
                  );
                });
              }
            );
          });
        });
      }
    });
  });
});

app.post("/api/addtoSaved", (req, res) => {
  const sgname = req.body.sg;
  const pstid = req.body.pstid;
  const un = req.body.usrn;
  const uem = req.body.usrem;

  SavedPost.findOne({ Email: uem, Uname: un }, (err, out) => {
    if (err) {
      res.send({ message: "Error!" });
    }
    let curarr = out.posts;
    curarr.push({ SubName: sgname, Postid: pstid });
    SavedPost.updateOne(
      { Email: uem, Uname: un },
      { posts: curarr },
      (er, o) => {
        if (er) {
          res.send({ message: "Error!" });
        }
        res.send({ message: "Post Saved!" });
      }
    );
  });
});

app.post("/api/getSavedPosts", async (req, res) => {
  try {
    const j = req.body.jwt;
    const dec = jwt.verify(j, secret);
    const out = await SavedPost.findOne({ Uname: dec.Uname, Email: dec.Email });
    let tosend = [];

    const promises = out.posts.map(async (p) => {
      const o = await Post.findOne({ SubName: p.SubName });
      const x = o.posts.find((post) => String(post._id) === p.Postid);
      if (x) {
        tosend.push([x, p.SubName]);
      }
    });

    await Promise.all(promises);
    res.send({ saved: tosend });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error!" });
  }
});

app.post("/api/delSavedPost", (req, res) => {
  const sg = req.body.sg;
  const postid = req.body.postid;
  const j = req.body.jwt;
  const dec = jwt.verify(j, secret);

  SavedPost.updateOne(
    { Uname: dec.Uname, Email: dec.Email },
    { $pull: { posts: { SubName: sg, Postid: postid } } },
    (er, ou) => {
      if (er) {
        res.send({ message: "Error!" });
      }
      res.send({ message: "Deleted Post" });
    }
  );
});

app.post("/api/forStatJoin", (req, res) => {
  const sgname = req.body.subg;
  const usname = req.body.us;
  Stat.updateOne(
    { Name: sgname },
    { $push: { Click: { Uname: usname } } },
    (err, out) => {
      if (err) {
        res.send({ message: 0 });
      }
    }
  );
});

const port = 3500;

app.listen(port, function () {
  console.log(`Server started at port ${port}`);
});
