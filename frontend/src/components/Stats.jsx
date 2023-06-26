import React, { useEffect, useState } from "react";
import NavForTabs from "./navForTabs";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

function Stats() {
  const a = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        label: "Growth of SubGreddiit",
        data: [1, 2, 3],
        backgroundColor: ["#F6F7C1", "#F0A04B"],
      },
    ],
  };
  const [growth, setgrowth] = useState(a);
  const [pstgrowth, setpostgrowth] = useState(a);
  const [visdata,setvisdata]=useState(a);
  const [repdate,setrepdate]=useState(a);
  const [showdt,setdt]=useState(false);
  const [loader,setloader]=useState(false);
  const params = useParams();
  const sgname = params.name;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:3500/api/getSgData", {
        jwt: localStorage.getItem("mytoken"),
        sgname: sgname,
      })
      .then((res) => {
        if (res.data.mes === 0) {
          window.localStorage.removeItem("mytoken");
          navigate("/");
        }

        const dta = res.data.sg;
        const usrdt=res.data.usr;
        const modarr=dta.Moderators;
        const hasValue = modarr.some(obj => Object.values(obj).includes(usrdt.Email));
        if(!hasValue){
          navigate("/home");
        }else{
          setdt(true);
        }
        async function computeGrowth() {
          let newlabels = dta.Followers?.map((e) => {
            const at = e._id.toString().substring(0, 8);
            const dt = new Date(parseInt(at, 16) * 1000);
            return dt;
          });
          newlabels = newlabels?.map((z) => {
            const day = z.getDate().toString().padStart(2, "0");
            const month = (z.getMonth() + 1).toString().padStart(2, "0");
            const year = z.getFullYear().toString().slice(-2);
            const formattedDate = `${day}-${month}-${year}`;
            return formattedDate;
          });
          let xyz = new Set(newlabels);
          let uniqueArr = Array.from(xyz).sort((a, b) => a - b);
          let countArr = uniqueArr?.map(
            (num) => newlabels?.filter((n) => n === num).length
          );
          console.log(uniqueArr, countArr);
          if (countArr.length > 1) {
            for (let i = 1; i < countArr.length; i++) {
              countArr[i] += countArr[i - 1];
            }
          }

          return {
            labels: [...uniqueArr],
            datasets: [
              {
                label: "Growth of Users of SubGreddiit vs Date",
                data: [...countArr],
              },
            ],
          };
        }

        async function updateGrowth() {
          try {
            const growthData = await computeGrowth();
            setgrowth(growthData);
          } catch (error) {
            console.error(error);
          }
        }

        updateGrowth();

        const p = res.data.posts;
        async function computepstGrowth() {
            let newlabels = p.posts?.map((e) => {
              const at = e._id.toString().substring(0, 8);
              const dt = new Date(parseInt(at, 16) * 1000);
              return dt;
            });
            newlabels = newlabels?.map((z) => {
              const day = z.getDate().toString().padStart(2, "0");
              const month = (z.getMonth() + 1).toString().padStart(2, "0");
              const year = z.getFullYear().toString().slice(-2);
              const formattedDate = `${day}-${month}-${year}`;
              return formattedDate;
            });
            //done
            let xyz = new Set(newlabels);
            let uniqueArr = Array.from(xyz).sort((a, b) => a - b);
            let countArr = uniqueArr?.map(
              (num) => newlabels?.filter((n) => n === num).length
            );

            return {
              labels: [...uniqueArr],
              datasets: [
                {
                  label: "No. of Posts Added vs Date",
                  data: [...countArr],
                },
              ],
            };
          }
  
          async function updatepstGrowth() {
            try {
              const growthData = await computepstGrowth();
              setpostgrowth(growthData);
            } catch (error) {
              console.error(error);
            }
          }
  
          updatepstGrowth();

          //for no. of visitors

          let cks = res.data.clks;

          async function rnd(arr){
            return await arr.Click.filter((obj, index, self) => {
                const firstIndex = self.findIndex((otherObj) => {
                    const at1 = obj._id.toString().substring(0, 8);
                    const z1 = new Date(parseInt(at1, 16) * 1000);
                    const day1 = z1.getDate().toString().padStart(2, "0");
                    const month1 = (z1.getMonth() + 1).toString().padStart(2, "0");
                    const year1 = z1.getFullYear().toString().slice(-2);
                    const formattedDate1 = `${day1}-${month1}-${year1}`;

                    const at2 = otherObj._id.toString().substring(0, 8);
                    const z2 = new Date(parseInt(at2, 16) * 1000);
                    const day2 = z2.getDate().toString().padStart(2, "0");
                    const month2 = (z2.getMonth() + 1).toString().padStart(2, "0");
                    const year2= z2.getFullYear().toString().slice(-2);
                    const formattedDate2 = `${day2}-${month2}-${year2}`;

                  return obj.Uname === otherObj.Uname && formattedDate1===formattedDate2;
                  });
                
                return index === firstIndex;
              });
          };
        async function computevisGrowth() {
            let nsaf=await rnd(cks);
          let newlabels =nsaf.map((e) => {
            const at = e._id.toString().substring(0, 8);
            const dt = new Date(parseInt(at, 16) * 1000);
            return dt;
          });
          newlabels = newlabels?.map((z) => {
            const day = z.getDate().toString().padStart(2, "0");
            const month = (z.getMonth() + 1).toString().padStart(2, "0");
            const year = z.getFullYear().toString().slice(-2);
            const formattedDate = `${day}-${month}-${year}`;
            return formattedDate;
          });
          let xyz = new Set(newlabels);
          let uniqueArr = Array.from(xyz).sort((a, b) => a - b);
          let countArr = uniqueArr?.map(
            (num) => newlabels?.filter((n) => n === num).length
          );

          return {
            labels: [...uniqueArr],
            datasets: [
              {
                label: "No. of Daily Visitors vs Date",
                data: [...countArr],
              },
            ],
          };
        }

        async function updatevisGrowth() {
          try {
            const growthData = await computevisGrowth();
            setvisdata(growthData);
          } catch (error) {
            console.error(error);
          }
        }

        updatevisGrowth();





        const rps = res.data.Reports;
        const blks=res.data.blocks;
        async function computerepGrowth() {
            let newlabels = rps.map((e) => {
              const at = e._id.toString().substring(0, 8);
              const dt = new Date(parseInt(at, 16) * 1000);
              return dt;
            });
            let newlabels2 = blks.Blocks?.map((e) => {
              const at = e._id.toString().substring(0, 8);
              const dt = new Date(parseInt(at, 16) * 1000);
              return dt;
            });

            let newlabels3=[...newlabels,...newlabels2];
            newlabels3 = newlabels3?.map((z) => {
              const day = z.getDate().toString().padStart(2, "0");
              const month = (z.getMonth() + 1).toString().padStart(2, "0");
              const year = z.getFullYear().toString().slice(-2);
              const formattedDate = `${day}-${month}-${year}`;
              return formattedDate;
            });

            newlabels = newlabels?.map((z) => {
              const day = z.getDate().toString().padStart(2, "0");
              const month = (z.getMonth() + 1).toString().padStart(2, "0");
              const year = z.getFullYear().toString().slice(-2);
              const formattedDate = `${day}-${month}-${year}`;
              return formattedDate;
            });
            newlabels2 = newlabels2?.map((z) => {
              const day = z.getDate().toString().padStart(2, "0");
              const month = (z.getMonth() + 1).toString().padStart(2, "0");
              const year = z.getFullYear().toString().slice(-2);
              const formattedDate = `${day}-${month}-${year}`;
              return formattedDate;
            });
            //done
            let xyz = new Set(newlabels);
            let uniqueArr = Array.from(xyz).sort((a, b) => a - b);
            let countArr = uniqueArr?.map(
              (num) => newlabels?.filter((n) => n === num).length
            );

            let xyz2 = new Set(newlabels2);
            let uniqueArr2 = Array.from(xyz2).sort((a, b) => a - b);
            let countArr2 = uniqueArr2?.map(
              (num) => newlabels2?.filter((n) => n === num).length
            );


            let xyz3 = new Set(newlabels3)
            let uniqueArr3 = Array.from(xyz3).sort((a, b) => a - b);


            const newNumbers1 = Array.from(uniqueArr3, (date) => {
              const index1 = uniqueArr.indexOf(date);
              if (index1 >= 0) {
                return countArr[index1];
              } else {
                return 0;
              }
            });
            
            const newNumbers2 = Array.from(uniqueArr3, (date) => {
              const index2 =uniqueArr2.indexOf(date);
              if (index2 >= 0) {
                return countArr2[index2];
              } else {
                return 0;
              }
            });

            return {
              labels: [...uniqueArr3],
              datasets: [
                {
                  label: "No. of Reports vs Date",
                  data: [...newNumbers1],
                  borderColor: ["#F0A04B"],
                },
                {
                  label:"No. of Deleted Reported Posts vs Date",
                  data:[...newNumbers2],
                  borderColor:["blue"],
                }
              ],
            };
          }
  
          async function updaterepGrowth() {
            try {
              const growthData = await computerepGrowth();
              setrepdate(growthData);
            } catch (error) {
              console.error(error);
            }
          }
  
          updaterepGrowth();

          setloader(true);
      })
      .catch((err) => {
        alert(err);
      });
  }, []);

  const opt = {
    scales: {
      y: {
        title: {
          display: true,
          text: "No. of Users Joined",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  const opt2 = {
    scales: {
      y: {
        title: {
          display: true,
          text: "No. of Posts Added",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  const opt3 = {
    scales: {
      y: {
        title: {
          display: true,
          text: "No. of Visitors",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  const opt4 = {
    scales: {
      y: {
        title: {
          display: true,
          text: "No. of Reports",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };


  return (loader?(showdt&&
    (<div>
      <NavForTabs />
      <div className="note" style={{width:"100%",textAlign:"center",backgroundColor:"#537FE7"}}><h1 style={{color:"#E96479",fontFamily:"'Caveat', cursive",fontSize:"3rem"}}>Stats</h1></div>
      <div className="note" style={{ height: "400px", width: "700px",backgroundColor:"#ECF9FF"}}>
        <Line data={growth} options={opt} />
        </div>
        <div className="note" style={{ height: "400px", width: "700px",backgroundColor:"#ECF9FF"}}>
        <Line data={pstgrowth} options={opt2} />
        </div>
        <div className="note" style={{ height: "400px", width: "700px",backgroundColor:"#ECF9FF"}}>
        <Line data={visdata} options={opt3} />
        </div>
        <div className="note" style={{ height: "400px", width: "700px",backgroundColor:"#ECF9FF"}}>
        <Line data={repdate} options={opt4} />
        </div> 
    </div>)):<Loader />
  );
}

export default Stats;
