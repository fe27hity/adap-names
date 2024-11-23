import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringName extends AbstractName {
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(other: string, delimiter?: string) {
    super(delimiter);

    this.assertTruthyParameter(other);
    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
      "g"
    );
    let componentsWithDelimSplit = this.name.split(regex);
    this.assertCorrectParamComponents(componentsWithDelimSplit);

    this.name = other;
    this.noComponents = componentsWithDelimSplit.length;

    this.assertDelimiterSet(delimiter ? delimiter : DEFAULT_DELIMITER);

  }

  public getNoComponents(): number {
    return this.noComponents;
  }

  public getComponent(i: number): string {
    this.assertValidIndex(i);

    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
      "g"
    );
    let arrayOfComponents = this.name.split(regex);
    return arrayOfComponents[i];
  }

  public setComponent(i: number, c: string) {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
      "g"
    );
    let arrayOfComponents = this.name.split(regex);
    arrayOfComponents[i] = c;
    this.name = arrayOfComponents.join(this.delimiter);
  }

  public insert(i: number, c: string) {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
      "g"
    );
    let arrayOfComponents = this.name.split(regex);

    arrayOfComponents.splice(i, 0, c);
    this.name = arrayOfComponents.join(this.delimiter);
    this.noComponents++;
  }

  public append(c: string) {
    this.assertValidComponent(c);

    this.name += this.delimiter + c;
    this.noComponents++;
  }

  public remove(i: number) {
    this.assertValidIndex(i);

    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
      "g"
    );
    let arrayOfComponents = this.name.split(regex);
    arrayOfComponents.splice(i, 1);
    this.name = arrayOfComponents.join(this.delimiter);
    this.noComponents--;
  }

  public cloneSubclass(): Name {
    return Object.assign(new StringName(""), this);
  }

  // Post condition

  protected assertNameSet(other: String): void {
    MethodFailureException.assertIsNotNullOrUndefined(this.name);
    const condition 
  }

  recoverNameStateImpl(backup: Name): void {
    this.delimiter = backup.getDelimiterCharacter();
    let array = [];
    for (let index = 0; index < backup.getNoComponents(); index++) {
      array.push(backup.getComponent(index));
    }
    this.name = array.join(this.delimiter);
    this.noComponents = backup.getNoComponents();
  }
}
