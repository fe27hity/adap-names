import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {
  protected baseName: string = "";
  protected parentNode: Directory;

  constructor(bn: string, pn: Directory) {
    this.assertValidBaseName(bn);
    this.assertValidMoveTarget(pn);

    this.doSetBaseName(bn);
    this.parentNode = pn;
  }

  public move(to: Directory): void {
    this.assertValidMoveTarget(to);

    this.parentNode.remove(this);
    to.add(this);
  }

  public getFullName(): Name {
    const result: Name = this.parentNode.getFullName();
    result.append(this.getBaseName());
    return result;
  }

  public getBaseName(): string {
    return this.doGetBaseName();
  }

  protected doGetBaseName(): string {
    return this.baseName;
  }

  public rename(bn: string): void {
    this.assertValidBaseName(bn);

    this.doSetBaseName(bn);
  }

  protected doSetBaseName(bn: string): void {
    this.assertValidBaseName(bn);

    this.baseName = bn;
  }

  public getParentNode(): Node {
    return this.parentNode;
  }

  protected assertValidMoveTarget(to: Directory): void {
   // IllegalArgumentException.assertIsNotNullOrUndefined(to);
  }

  protected assertValidBaseName(bn: string): void {
   // IllegalArgumentException.assertIsNotNullOrUndefined(bn);
   // IllegalArgumentException.assertCondition(bn.length > 0, "Base name is not a valid argument");
  }
}
