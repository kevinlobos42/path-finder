import {useState,useEffect} from 'react'
import '../css/Node.css'

function Node({row,col,isWall,isStart,isEnd, onMouseDown, onMouseEnter, onMouseUp}) {
    const [classes, setClasses] = useState('')
    useEffect(()=>{
        if(isStart){
            setClasses('starting-node')
        }
        else if(isEnd){
            setClasses('ending-node')
        }
        else if(isWall){
            setClasses('wall-node')
        }
        else{
            setClasses('')
        }

    },[isEnd,isWall,isStart])
    return (
        <div
            id={`node-${row}-${col}`}
            className={`node ${classes}`}
            onMouseDown={()=> onMouseDown(row,col)}
            onMouseEnter={()=>onMouseEnter(row,col)}
            onMouseUp={()=>onMouseUp(row,col)}
        >
        </div>
    )
}

export default Node
