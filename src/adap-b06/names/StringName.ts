import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";

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
    let componentsWithDelimSplit = other.split(regex);
    this.assertCorrectParamComponents(componentsWithDelimSplit);

    this.name = other;
    this.noComponents = other == "" ? 1: componentsWithDelimSplit.length;

    this.assertDelimiterSet(delimiter ? delimiter : DEFAULT_DELIMITER);

    this.assertStringNameInvariant();
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

  public setComponent(i: number, c: string): StringName {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    const backup = this.deepCopy();
    let newNameObject = this.deepCopy() as StringName;

    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${newNameObject.getDelimiterCharacter()}`,
      "g"
    );
    let arrayOfComponents = newNameObject.name.split(regex);
    arrayOfComponents[i] = c;
    newNameObject.name = arrayOfComponents.join(newNameObject.getDelimiterCharacter());

    //this.assertComponentWasSet(backup, i, c);
    return newNameObject;
  }

  public insert(i: number, c: string): StringName {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    const backup = this.deepCopy();
    let newNameObject = this.deepCopy() as StringName;


    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${newNameObject.getDelimiterCharacter()}`,
      "g"
    );
    let arrayOfComponents = newNameObject.name.split(regex);

    arrayOfComponents.splice(i, 0, c);
    newNameObject.name = arrayOfComponents.join(newNameObject.getDelimiterCharacter());
    newNameObject.noComponents++;
    //this.assertComponentWasInserted(backup, i, c);
    return newNameObject;
  }

  public append(c: string): StringName {
    this.assertValidComponent(c);

    const backup = this.deepCopy();
    let newNameObject = this.deepCopy() as StringName;


    newNameObject.name += newNameObject.delimiter + c;
    newNameObject.noComponents++;

    //this.assertComponentWasAppended(backup, c);
    return newNameObject;
  }

  public remove(i: number): StringName {
    this.assertValidIndex(i);

    const backup = this.deepCopy();
    let newNameObject = this.deepCopy() as StringName;


    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${newNameObject.getDelimiterCharacter()}`,
      "g"
    );
    let arrayOfComponents = newNameObject.name.split(regex);
    arrayOfComponents.splice(i, 1);
    newNameObject.name = arrayOfComponents.join(newNameObject.getDelimiterCharacter());
    newNameObject.noComponents--;

    //this.assertComponentWasRemoved(backup, i);
    return newNameObject;
  }

  public cloneSubclass(): Name {
    return Object.assign(new StringName(""), this);
  }

  public deepCopy(): Name {
    return new StringName(this.name, this.delimiter);
    
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

  protected assertStringNameInvariant() {
    this.assertValidDelimiterState();
    InvalidStateException.assertIsNotNullOrUndefined(
      this.name,
      "components undefined"
    );
    try {
      const regex = new RegExp(
        `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
        "g"
      );
      let componentsWithDelimSplit = this.name.split(regex);
      this.assertCorrectParamComponents(componentsWithDelimSplit);
    } catch (error) {
      throw new InvalidStateException("a component has an invalid value");
    }
  }
}
