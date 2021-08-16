import {useEffect, useState} from 'react'
import {Menu, MenuItem, Button, Typography} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {AiFillCaretDown} from 'react-icons/ai'
import Node from '../components/Node'
import { dijkstras, aStar } from '../algs/algorithms'
import '../css/Menu.css'
import '../css/Grid.css'
function Grid() {
    // Upper menu
    const[nodeError, setNodeError] = useState(false);
    const[value, setValue] = useState("Dijkstra's")
    const[anchor, setAnchor]=useState(null)
    const btnOpen = (e) =>{
        setAnchor(e.currentTarget)
    }
    const btnClose = ()=>{
        setAnchor(null)
    }
    // Grid
    const total_rows = 20;
    const total_cols = 50;
    const[start,setStart]=useState({row:null,col:null});
    const[end,setEnd]=useState({row:null,col:null})
    const[grid, setGrid] = useState([])
    const[mousePressed, setMousePressed] = useState(false)
    const makeGrid= ()=>{
        const temp = []
        for(let row=0; row<total_rows; row++){
            const currentRow=[]
            for(let col=0; col<total_cols; col++){
                currentRow.push(createNode(col,row))
            }
            temp.push(currentRow);
        }
        return temp;
    }
    // Create each node
    const createNode = (col, row)=>{
        return{
            col,
            row,
            distance: Infinity,
            isWall: false,
            isStart:false,
            isEnd: false,
            isVisited: false,
            previousNode: null,
            g_score: null,
            f_score: null,
            classes: ''
        }
    }

    // Creating starting, ending, and wall nodes
    const handleMouseDown = (row,col)=>{
        const newGrid = newGridWithWall(grid, row, col)
        setGrid(newGrid)
        setMousePressed(true)
    }
    const handleMouseEnter = (row,col)=>{
        if(!mousePressed) return;
        const newGrid = newGridWithWall(grid,row,col);
        setGrid(newGrid)
    }
    const handleMouseUp = ()=>{
        setMousePressed(false)
    }
    const newGridWithWall = (grid,row,col)=>{
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        let newNode;
        if(start.row===null){
            newNode={
                ...node,
                isStart: true,
            }
            setStart({row:row,col:col})
        }
        else if(end.row===null){
            newNode={
                ...node,
                isEnd: true
            }
            setEnd({row:row,col:col})
        }
        else{
            newNode={
                ...node,
                isWall: true,
            }
        }
        newGrid[row][col] = newNode;
        return newGrid
    }
    useEffect(()=>{
        setGrid(makeGrid());
    },[])


    // Search functions
    const beginSearch = (val)=>{
        if(!start.row || !end.row){
            setNodeError(true)
            setTimeout(()=>document.getElementById(`alert`).className='fadeAnimation',2000)
            setTimeout(()=>{
                document.getElementById(`alert`).className=''
                setNodeError(false)
            }, 2800)
            return;
        }
        const startNode = grid[start.row][start.col];
        const endNode = grid[end.row][end.col]
        switch(val){
            case "Dijkstra's":
                const nodes=dijkstras(grid,startNode,endNode)
                const path = shortestPath(endNode);
                visualize(nodes,path)
                break;
            case "A*":
                const a = aStar(grid,startNode,endNode)
                const aPath = shortestPath(endNode)
                visualize(a,aPath)
                break;
            default:
                break;
        }
    }
    const shortestPath = (finish) =>{
        const shortestPath=[]
        let current = finish;
        while(current!=null){
            console.log(current)
            shortestPath.unshift(current)
            current = current.previousNode;
        }
        return shortestPath
    }

    const visualize=(nodes,path)=>{
        for(let i=0; i<= nodes.length; i++){
            if(i === nodes.length){
                setTimeout(()=>{
                    animatePath(path)
                },10*i)
                return;
            }
            setTimeout(()=>{
                const node = nodes[i]
                document.getElementById(`node-${node.row}-${node.col}`).className+=' node-visited'
            },10*i)
        }
    }

    const animatePath=(path)=>{
        for(let i=0; i < path.length; i++){
            setTimeout(()=>{ 
                const node = path[i]
                document.getElementById(`node-${node.row}-${node.col}`).className+=' node-path'
            },50*i)
        }
    }
    const clearGrid = ()=>{
        setGrid(makeGrid())
        setStart({row:null,col:null})
        setEnd({row:null,col:null})
        setMousePressed(false);
        for(const row of grid){
            for(const node of row){
                document.getElementById(`node-${node.row}-${node.col}`).className='node'
            }
        }
    }

    return (
        <>
            {nodeError && <div id="alert"><Alert severity="error">Please select a starting node AND an ending node</Alert></div>}
            <div className="Menu">
                <div className="flex-menu">
                    <Button
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={btnOpen}
                        endIcon={<AiFillCaretDown />}
                        ><Typography variant="h6">{value}</Typography></Button>
                    <Menu 
                        keepMounted
                        anchorEl={anchor}
                        open={Boolean(anchor)} 
                        onClose={btnClose}
                        id="menu"
                        >
                        <MenuItem onClick={()=>{setValue("Dijkstra's"); btnClose()}}>Dijkstra's</MenuItem>
                        <MenuItem onClick={()=>{setValue("A*"); btnClose()}}>A*</MenuItem>
                    </Menu>
                    <Button variant="contained" color="primary" onClick={()=>beginSearch(value)}><Typography variant="h5">Begin Search</Typography></Button>
                    <Button variant="contained" color="secondary" onClick={()=>clearGrid()}><Typography variant="h6" >Clear Grid</Typography></Button>
                </div>
                <div className="legend">
                    <div className="definition">
                        <div className="square starting-node"></div>
                        <Typography variant="subtitle1">Starting Node</Typography>
                    </div>
                    <div className="definition">
                        <div className="square ending-node"></div>
                        <Typography variant="subtitle1">End Node</Typography>
                    </div>
                    <div className="definition">
                        <div className="square wall-node"></div>
                        <Typography variant="subtitle1">Wall Node</Typography>
                    </div>
                    <div className="definition">
                        <div className="square visited"></div>
                        <Typography variant="subtitle1">Visited Node</Typography>
                    </div>
                    <div className="definition">
                        <div className="square path"></div>
                        <Typography variant="subtitle1">Path</Typography>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="grid">
                    {grid.map((row, rowIdx)=>{
                        return(
                            <div key={rowIdx}>
                                {row.map((node,nodeIdx)=>{
                                    const{row,col,isWall,isStart,isEnd} = node
                                    return(
                                        <Node 
                                        key={nodeIdx}
                                        row={row} 
                                        col={col} 
                                        isWall={isWall} 
                                        isStart={isStart} 
                                        isEnd={isEnd}
                                        onMouseDown={(row,col)=> handleMouseDown(row,col)}
                                        onMouseEnter={(row,col)=> handleMouseEnter(row,col)}
                                        onMouseUp={()=> handleMouseUp()}
                                        />
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Grid
