import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {
  protected targetNode: Node | null = null;

  constructor(bn: string, pn: Directory, tn?: Node) {
    super(bn, pn);

    if (tn != undefined) {
      this.targetNode = tn;
    }
  }

  public getTargetNode(): Node | null {
    return this.targetNode;
  }

  public setTargetNode(target: Node): void {
    this.assertValidTargetNode(target);
    this.targetNode = target;
  }

  public getBaseName(): string {
    const target = this.ensureTargetNode(this.targetNode);
    return target.getBaseName();
  }

  public rename(bn: string): void {
    this.assertValidBaseName(bn);
    const target = this.ensureTargetNode(this.targetNode);
    target.rename(bn);
  }

  protected ensureTargetNode(target: Node | null): Node {
    this.assertTargetNodeNotUndefined(target);
    const result: Node = this.targetNode as Node;
    return result;
  }

  protected assertValidTargetNode(target: Node): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(target);
  }

  protected assertValidBaseName(bn: string): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(bn);
  }

  protected assertTargetNodeNotUndefined(tn: Node | null): void {
    const condition = tn != undefined;
    IllegalArgumentException.assertCondition(condition, "Target is undefined")
  }
}
