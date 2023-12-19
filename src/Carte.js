export default class Carte {
    mot;
    retourne;
    correspond;

    constructor(mot, retourne = false, correspond = false) {
        this.mot = mot;
        this.retourne = retourne;
        this.correspond = correspond;
    }

}