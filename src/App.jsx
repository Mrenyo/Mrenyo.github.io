import React from 'react'
import './App.css'

let cords = [];

const wall_distance = 25;
const next_cell_distance = 50;

function App() {
    let lines = generate_maze(getRandomPosition(), generate_cords());
    let path = drawPath();

    return (
    <>
        {path}
        {lines}
    </>
    );
};

// IDK ChatGPT, vonalat rajzol syntax: <Line x1={100} y1={100} x2={200} y2={200} />
class Line extends React.Component {
    render() {
      const { x1, y1, x2, y2 } = this.props;
  
      const lineStyle = {
        position: 'absolute',
        left: x1,
        top: y1,
        width: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
        height: 5, 
        transform: `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`,
        transformOrigin: 'top left',
        background: 'black',
      };
  
      return (
        <div style={lineStyle}></div>
      );
    }
  }
  // <Square x={100} y={100} color={"red"} />
  class Square extends React.Component {
    render() {
      const { x, y, color } = this.props;
  
      const squareStyle = {
        width: '50px',
        height: '50px',
        backgroundColor: `${color}`,
        position: 'absolute',
        top: `${y}px`,
        left: `${x}px`,
      };
  
      return (
        <div style={squareStyle}></div>
      );
    }
  }

// Legenerálja a cords dictionaryt [x, y]: boolean formátumban, ahol a boolean jelzi, hogy kell-e fal vagy látogatotte az adott cella, [x, y] STRING
function generate_cords() {
    const width = 1800
    const height = 800

    for(let i = 100;i <= width;i += 25) {
        for(let j = 100;j <= height; j += 25) {
            // Kizárjuk a sarkokat
            if(i % 50 != 0 || j % 50 != 0) {
                // A maze szélét meghatározzuk
                if(j == 100 || j == height || i == 100 || i == width) {
                    cords[i + ', ' + j] = true;
                // Berajzoljuk az összes lehetséges falat
                }else if(i % 50 == 0 || j % 50 == 0){
                    cords[i + ', ' + j] = true;
                }else {
                    cords[i + ', ' + j] = false;
                }
            }
        }
    }
}

// Random cella kordinátát kapunk vissta tömb formában, a cella kordinátái mindig 25 / 75 -re végződnek
function getRandomPosition() {
    let randomX = 50;
    let randomY = 50;
    while(randomX % 50 != 25) {
        randomX = parseInt(100 + Math.random() * 1700);
    }
    while(randomY % 50 != 25) {
        randomY = parseInt(100 + Math.random() * 700);
    }
    return [randomX, randomY];
}

// Legenerálja a vonalakat és visszaadja az összes kirajzolandó tagat egy tömbbe
function generate_maze(first) {

    // Módosítjuk a cords dictionaryt, ahova falat kell raknuk az a kordináta true lesz
    generateMazeWalls(first[0], first[1]);
    
    const width = 1800
    const height = 800

    let lines = []
    for(let i = 100;i <= width;i += 25) {
        for(let j = 100;j <= height; j += 25) {
            
            // Kizárjuk a sarkokat
            if(i % 50 != 0 || j % 50 != 0) {

                // Kiválasztjuk a vízszintes falakat
                if(i % 50 == 0 && j % 50 != 0) {
                    if(cords[i + ', ' + j]) {
                        lines.push(<Line x1={i} y1={j - 25} x2={i} y2={j + 25} />);
                    }

                // Kiválasztjuk a függőleges falakat
                } else if(i % 50 != 0 && j % 50 == 0) {
                    if(cords[i + ', ' + j]) {
                        lines.push(<Line x1={i - 30} y1={j} x2={i + 25} y2={j} />);
                    }
                } 
            }
        }
    }
    return lines;
}

function generateMazeWalls(x, y) {   
    // Látogatottá tesszük az adott kordinátát 
    cords[x + ', ' + y] = true;  

    let directions = getRandomDirection();

    // Végig megyünk a direction tömbbön amíg nem találunk egy még nem látogatott cellát
    for(let i = 0;i < directions.length;i++) {
        if(cords[(x + (directions[i][0] * next_cell_distance)) + ', ' + (y + (directions[i][1] * next_cell_distance))] != undefined && !cords[(x + (directions[i][0] * next_cell_distance)) + ', ' + (y + (directions[i][1] * next_cell_distance))]) {
            cords[(x + (directions[i][0] * next_cell_distance)) + ', ' + (y + (directions[i][1] * next_cell_distance))] = true;
            cords[(x + (directions[i][0] * wall_distance)) + ', ' + (y + (directions[i][1] * wall_distance))] = false;
            generateMazeWalls((x + (directions[i][0] * next_cell_distance)), (y + (directions[i][1] * next_cell_distance)));
        }
    }
}

// Visszaad egy tömbböt a négy iránnyal random sorrendben
function getRandomDirection() {
    let directions = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    directions.sort(() => Math.random() - 0.5);
    return directions;
}

function generateShortestPath(startingX, startingY, finishX, finishY) {
    // Tárolja a lehetséges lépéseket
    let open = [
        {
            "x": startingX,
            "y": startingY,
            "f_cost": Math.sqrt((finishX - startingX) ** 2 + (finishY - startingY) ** 2),
            "parent": [
                {
                    "x": 0,
                    "y": 0,
                    "f_cost": 0,
                    "parent": 0
                }
            ]
        }
    ];
    // Tárolja azokat a mezőket, amiket leléptünk
    let closed = [];
    while(true) {      
        // Az összes f_cost egy tömbben 
        const fCosts = open.map(point => point.f_cost);

        // Kiválasztjuk a legkisebb f_cost ot
        const minIndex = fCosts.indexOf(Math.min(...fCosts))

        // Annak az elemnek akihez tartozik a legkisebb f_cost elmentjük az összes adatát
        let current = open[minIndex];

        // Kitöröljük a kiválasztott elemet az open tömbböől és át rakjuk a closedba
        open.splice(minIndex, 1);
        closed.push(current);
        
        // Ha elértük a keresett mezőt kilépünk
        if(current.x == finishX && current.y == finishY) {
            return current;
        }

        // Megkeresük azokat a szomszédos mezőket amik nincsenek a closedban és nincs arra fal
        let neighbours = getNeighbours(current, closed, startingX, startingY, finishX, finishY);
        neighbours.forEach(neighbour => {

            // Vizsgáljuk, hogyha van már ilyen elem és kisebb-e az f_costja vagy még nincs benne az open tömbben
            if(isShorter(neighbour, open) || !isInArray(neighbour, open)) {                

                // Hozzáadjuk az openhez az adott szomszédos mezőt
                open.push(neighbour);
            }
        });
    }
}

function getNeighbours(current, closed, startingX, startingY, finishX, finishY) {
    let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let neighbours = [];

    // Vizsgáljuk az összes írányt
    for(let i = 0; i < directions.length; i++) {

        // Az adott irányba lévő fal kordinátái
        let currentX = current.x + (directions[i][0] * wall_distance);
        let currentY = current.y + (directions[i][1] * wall_distance);

        // Az aktuális irányba lévő szomszéd
        let current_neighbour_cords = {
            "x": current.x + (directions[i][0] * next_cell_distance),
            "y": current.y + (directions[i][1] * next_cell_distance)
        }

        // Vizsgáljuk, hogy fal van-e az irányba és, hogy benne van-e a szomszéd a closedban
        if(!cords[currentX + ', ' + currentY] && !isInArray(current_neighbour_cords, closed)) {
            let distance_from_start = Math.sqrt((startingX - (current.x + (directions[i][0] * next_cell_distance))) ** 2 + (startingY - (current.y + (directions[i][1] * next_cell_distance))) ** 2);
            let distance_to_finish = Math.sqrt((finishX - (current.x + (directions[i][0] * next_cell_distance))) ** 2 + (finishY - (current.y + (directions[i][1] * next_cell_distance))) ** 2);
            neighbours.push(
                {
                    "x": current.x + (directions[i][0] * next_cell_distance),
                    "y": current.y + (directions[i][1] * next_cell_distance),
                    "f_cost": distance_from_start + distance_to_finish,
                    "parent": current
                }
            )
        }
    }
    return neighbours;
}

// Egy adott mező benne van-e az adott tömbben (dict-eket hasonlít össze)
function isInArray(current, array) {
    for (const item of array) {
        if (
            current.x === item.x &&
            current.y === item.y
        ) {
            return true;
        }
    }
    return false;
}

// Megnézi, hogy benne vane-e az adott elem a tömbben és ha igen kisebb-e az f_cost
function isShorter(neighbour, open) {
    for (let i = 0; i < open.length; i++) {
        if (
            neighbour.x === open[i].x &&
            neighbour.y === open[i].y
        ) {
            if(neighbour.f_cost < open[i].f_cost) {
                return true;
            }
        }
    }
    return false;
}

function getTarget() {
    return getRandomPosition();
}

function drawPath() {
    let target = getTarget();
    let start = getTarget();
    let finish = {}; 
    // Mező adatai lesznek (target)   
    finish = generateShortestPath(start[0], start[1], target[0], target[1]);

    // Hozzáadjuk a targetet
    let path = [<Square x={target[0] - 27.5} y={target[1] - 25} color={"#1199FF"} />];
    let current = finish;
    while(current.x != 0) {
        // Az utolsó elem parantje undefined lesz
        if(current.parent == undefined) {
            return path;
        }
        current = current.parent;

        if(current.x == start[0] && current.y == start[1]) {
            path.push(
                <Square x={current.x - 27.5} y={current.y - 25} color={"red"} />
            )
        }else {
            if(current.x >= 100) {
                path.push(
                    <Square x={current.x - 27.5} y={current.y - 25} color={"lightgreen"} />
                )
            }
        }
    }
    return path;
}
export default App;