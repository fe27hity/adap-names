import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(other: string[], delimiter?: string) {
    super(delimiter);

    this.assertCorrectParamComponents(other);
    this.components = other;

    this.assertDelimiterSet(delimiter ? delimiter : DEFAULT_DELIMITER);

  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    this.assertValidIndex(i);

    return this.components[i];
  }

  public setComponent(i: number, c: string) {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    this.components[i] = c;
  }

  public insert(i: number, c: string) {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    this.components.splice(i, 0, c);
  }

  public append(c: string) {
    this.assertValidComponent(c);

    this.components.push(c);
  }

  public remove(i: number) {
    this.assertValidIndex(i);

    this.components.splice(i, 1);
  }

  cloneSubclass(): Name {
    const clone = Object.assign(new StringArrayName([""]), this);
    this.assertValidClone(clone);
    return clone;
  }

  recoverNameStateImpl(backup: Name): void {
    this.delimiter = backup.getDelimiterCharacter();
    let array = [];
    for (let index = 0; index < backup.getNoComponents(); index++) {
      array.push(backup.getComponent(index));
    }
    this.components = array;
  }
}
