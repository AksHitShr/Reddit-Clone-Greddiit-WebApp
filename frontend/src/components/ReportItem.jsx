import {React,useState,useEffect} from "react";

function ReportItem(props) {
    let myInterval;
  const [foropacity, setopacity] = useState(1);
  const [disab, setdisab] = useState(false);
  const [disabblock, setblockdisb] = useState(false);

  const [isrunning, setrun] = useState(false);
  const [count, setcount] = useState(3);
  const [disp, setdisp] = useState("3");
  const [blockidforpost, setblockid] = useState("");
  const [blkper,setblkper]=useState("");
  const [repem,setrepem]=useState("");

  useEffect(() => {
    if (isrunning) {
      myInterval = setInterval(() => {
        console.log(count);
        const v = count;
        setcount(v - 1);
        setdisp(String(v - 1));
        if (count === 1) {
          clearInterval(myInterval);
          setdisp("3");
          setrun(false);
          setcount(3);
          console.log(blkper);
          props.newfunc(blockidforpost,blkper,repem);
        }
      }, 1000);
    }
    return () => {
      clearInterval(myInterval);
    };
  }, [count, isrunning]);

  function handlestart(postid,perna,repemail) {
    setrepem(repemail);
    setblkper(perna);
    setblockid(postid);
    setrun(true);
  }

  function handlestop() {
    setrun(false);
    clearInterval(myInterval);
    setdisp("3");
    setcount(3);
    console.log("stopped");
  }

  if (props.item.status === 1 && disab === false) {
    setdisab(true);
    setopacity(0.5);
  }
  if (props.item.status === 2 && disabblock === false) {
    setblockdisb(true);
    setopacity(0.5);
  }
  let fordel = true;
  let forignore = true;
  let forblock = true;

  return (
    <div className="note">
      <h1>{"Reported By : " + props.item.reporterName}</h1>
      <p>{"Posted By : " + props.item.posterName}</p>
      <p>{"Concern : " + props.item.Concern}</p>
      <p>{"Posted Message : " + props.item.text}</p>
      {fordel && (
        <button
          onClick={() => {
            props.delreq(props.item);
          }}
          className="btn btn-primary"
          style={{ opacity: foropacity }}
          disabled={disab || disabblock}
        >
          Delete Post
        </button>
      )}
      {forignore && (
        <button
          disabled={disabblock}
          onClick={() => {
            props.funcIgnore(props.item.repid, props.item.status,props.item.reporterEmail,props.item.posterName);
            setdisab(true);
            setopacity(0.5);
          }}
          className="btn btn-primary"
          style={{opacity:foropacity}}
        >
          Ignore
        </button>
      )}
      {forblock &&
        (!isrunning ? (
          <button
            onClick={() => {
              handlestart(props.item.repid,props.item.posterName,props.item.reporterEmail);
              // console.log(props.item.posterName);
            }}
            className="btn btn-primary"
            disabled={disab || disabblock}
            style={{ opacity: foropacity }}
          >
            Block User
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => {
              handlestop();
            }}
            disabled={disab}
            style={{ opacity: foropacity }}
          >
            {"Cancel in " + disp + " secs"}
          </button>
        ))}
    </div>
  );
}

export default ReportItem;
