
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {
  protected baseName: string = "";
  protected parentNode: Directory;

  constructor(bn: string, pn: Directory) {
   // this.assertIsValidBaseName(bn);
    this.doSetBaseName(bn);
    this.parentNode = pn; // why oh why do I have to set this
    this.initialize(pn);
  }

  protected initialize(pn: Directory): void {
    this.parentNode = pn;
   // this.parentNode.add(this);
  }

  public move(to: Directory): void {
   // this.parentNode.remove(this);
   // to.add(this);
    this.parentNode = to;
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
    this.doSetBaseName(bn);
  }

  protected doSetBaseName(bn: string): void {
    this.baseName = bn;
  }

  public getParentNode(): Directory {
    return this.parentNode;
  }

  /**
   * Returns all nodes in the tree that match bn
   * @param bn basename of node being searched for
   */
  public findNodes(bn: string): Set<Node> {
    try {
      return this.findSubsequentNodes(bn);
  } catch (e) {
      throw new ServiceFailureException("findNodes() failed", e as InvalidStateException);
  }
  }

  public findSubsequentNodes(bn: string): Set<Node> {
    this.assertClassInvariants();
    const matchingNodes = new Set<Node>();

    if (this.getBaseName() === bn) {
      matchingNodes.add(this);
    }
    if("getTargetNode" in this){
      const childMatches = (this as any).getTargetNode().findSubsequentNodes(bn);
      for (const match of childMatches) {
        matchingNodes.add(match);
      }
    }

    if ("getChildren" in this) {
      for (const child of (this as any).getChildren()) {
        const childMatches = child.findSubsequentNodes(bn);
        for (const match of childMatches) {
          matchingNodes.add(match);
        }
      }
    }

    return matchingNodes;
  }

  protected assertClassInvariants(): void {
    const bn: string = this.doGetBaseName();
    //this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
  }

  protected assertIsValidBaseName(bn: string): void {
    const condition: boolean = bn != "";
   // AssertionDispatcher.dispatch(et, condition, "invalid base name");
  }
}
