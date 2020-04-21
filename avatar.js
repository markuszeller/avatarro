'use strict';

class AvatarCell {
    STATE_CSS = ['dead', 'alive', 'outline'];

    constructor(x, y, state) {
        this.x = x;
        this.y = y;
        this.state = state;
    }

    getClassName() {
        return this.STATE_CSS[this.state];
    }
}

class Avatar {

    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.cells = [];

        this.cells = this.getCells();
        this.game();
    }

    getCells() {
        let cells = [];
        for (let y = 0; y <= this.sizeY + 1; y++) {
            for (let x = 0; x <= this.sizeX; x++) {
                cells.push(new AvatarCell(x, y, 0));
            }
        }

        return cells;
    }

    createNoise() {
        for (let y = 0; y <= this.sizeY + 1; y++) {
            for (let x = 0; x <= this.sizeX; x++) {
                if (!(y === 0 || y === this.sizeY + 1 || x === 0)) {
                    let r = Math.random() < .4 ? 1 : 0;
                    this.cells[y * (this.sizeX + 1) + x].state = r ? 1 : 0;
                }
            }
        }
    }

    createOutlines() {
        for (let y = 0; y <= this.sizeY + 1; y++) {
            for (let x = 0; x <= this.sizeX; x++) {
                let c = this.cells[y * (this.sizeX + 1) + x];
                let n = this.getAliveNeighbourCount(c);
                if (c.state === 0 && n > 0) c.state = 2;
            }
        }
    }

    getAliveNeighbourCount(cell) {
        let n = 0;

        let top = (cell.y - 1) * (this.sizeX + 1) + cell.x;
        if (cell.y > 0 && this.cells[top].state === 1) n++;

        let right = cell.y * (this.sizeX + 1) + cell.x + 1;
        if (cell.x <= this.sizeX && right < this.cells.length && this.cells[right].state === 1) n++;

        let bottom = (cell.y + 1) * (this.sizeX + 1) + cell.x;
        if (cell.y <= this.sizeY && this.cells[bottom].state === 1) n++;

        let left = cell.y * (this.sizeX + 1) + cell.x - 1;
        if (cell.x > 0 && this.cells[left].state === 1) n++;

        return n;
    }

    game() {
        this.createNoise();
        this.createOutlines();
    }

    renderTable() {
        let table = document.createElement('table');
        for (let y = 0; y < this.sizeY + 2; y++) {
            let tr = document.createElement('tr');
            for (let x = 0; x <= this.sizeX; x++) {
                let td = document.createElement('td');
                td.classList.add(this.cells[y * (this.sizeX + 1) + x].getClassName());
                tr.appendChild(td);
            }
            for (let x = this.sizeX - 1; x >= 0; x--) {
                let td = document.createElement('td');
                td.classList.add(this.cells[y * (this.sizeX + 1) + x].getClassName());
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        document.body.appendChild(table);
    }
}

for (let i = 0; i < 512; i++) {
    let a = new Avatar(4, 8);
    a.renderTable();
}
