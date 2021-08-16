export const dijkstras = (grid, startNode, endNode)=>{
    const visitedNodes=[];
    startNode.distance=0
    const unvisitedNodes = getNodes(grid);
    while(unvisitedNodes.length>0){
        unvisitedNodes.sort((a,b)=>a.distance-b.distance)
        const firstNode = unvisitedNodes.shift();
        if(firstNode.isWall)continue;
        if(firstNode.distance===Infinity){
            return visitedNodes
        }
        visitedNodes.push(firstNode)
        firstNode.isVisited=true
        if(firstNode === endNode) {
            return visitedNodes;
        } 
        updateNeighbors(firstNode,grid)
    }
}

const getNodes = (grid)=>{
    const allNodes = []
    for (const row of grid){
        for (const node of row){
            allNodes.push(node)
        }
    }
    return allNodes
}
const updateNeighbors=(node, grid)=>{
    const neighbors=[]
    const {row,col} = node;
    // Check above, below, left, and right of node
    if(row>0)if(!grid[row-1][col].isVisited)neighbors.push(grid[row-1][col]) 
    if(row<grid.length-1)if(!grid[row+1][col].isVisited)neighbors.push(grid[row+1][col]) 
    if(col>0)if(!grid[row][col-1].isVisited)neighbors.push(grid[row][col-1]) 
    if(col<grid[0].length-1)if(!grid[row][col+1].isVisited)neighbors.push(grid[row][col+1]) 

    for (const n of neighbors){
        n.distance = node.distance+1;
        n.previousNode = node
    }
}

export const aStar = (grid, startNode, endNode)=>{
    const open = []
    const close =[]
    open.push(startNode)
    startNode.f_score = getDist(startNode,endNode)
    startNode.g_score = 0;
    while(open.length){
        open.sort((a,b)=>a.f_score - b.f_score)
        const current = open.shift();
        const neighbors = getNeighbors(current, grid)
        close.push(current)
        for(const neighbor of neighbors){
            if(!close.includes(neighbor) && !open.includes(neighbor)){
                open.push(neighbor)
            }
            if(!neighbor.isStart && !neighbor.previousNode){
                neighbor.previousNode = current
            }
            neighbor.g_score = current.g_score + 1
            neighbor.f_score = neighbor.g_score + getDist(neighbor, endNode)
            if (neighbor===endNode){
                close.push(current)
                close.push(neighbor)
                return close
            }
        }
    }
    return []
}
const getDist = (node1, node2)=>{
    const col1 = node1.col
    const row1 = node1.row
    const col2 = node2.col
    const row2 = node2.row
    return Math.abs(col1-col2) + Math.abs(row1 - row2)
}
const getNeighbors=(node, grid)=>{
    const neighbors = []
    const {row, col} = node
    if(row>0)if(!grid[row-1][col].isVisited && !grid[row-1][col].isWall)neighbors.push(grid[row-1][col]) 

    if(row<grid.length-1)if(!grid[row+1][col].isVisited && !grid[row+1][col].isWall)neighbors.push(grid[row+1][col]) 

    if(col>0)if(!grid[row][col-1].isVisited && !grid[row][col-1].isWall)neighbors.push(grid[row][col-1]) 

    if(col<grid[0].length-1)if(!grid[row][col+1].isVisited && !grid[row][col+1].isWall)neighbors.push(grid[row][col+1]) 

    return neighbors
}