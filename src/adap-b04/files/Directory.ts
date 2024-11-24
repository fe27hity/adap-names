import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.assertNodeNotAlreadyPresent(cn);

        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        this.assertNodeIsPresent(cn);

        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    protected assertNodeNotAlreadyPresent(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        const condition = !this.childNodes.has(cn)
        IllegalArgumentException.assertCondition(condition, "Node already exists");
    }

    protected assertNodeIsPresent(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        const condition = this.childNodes.has(cn);
        IllegalArgumentException.assertCondition(condition, "Node does not exist");
    }

}