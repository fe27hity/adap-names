import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(other: string[], delimiter?: string) {
    super(delimiter);

    this.assertCorrectParamComponents(other);
    this.components = other;

    this.assertDelimiterSet(delimiter ? delimiter : DEFAULT_DELIMITER);

    this.assertStringArrayNameInvariant();
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    this.assertValidIndex(i);

    return this.components[i];
  }

  public setComponent(i: number, c: string): StringArrayName {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    const backup = this.deepCopy();
    let newNameObject = this.deepCopy() as StringArrayName;


    newNameObject.components[i] = c;
    this.assertComponentWasSetAndOriginalUnchanged(newNameObject, backup, i, c);
    return newNameObject;
  }

  public insert(i: number, c: string): StringArrayName {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    const backup = this.deepCopy()
    let newNameObject = this.deepCopy() as StringArrayName;


    newNameObject.components.splice(i, 0, c);
    this.assertComponentWasInsertedAndOriginalUnchanged(newNameObject, backup, i, c);
    return newNameObject;
  }

  public append(c: string): StringArrayName {
    this.assertValidComponent(c);

    const backup = this.deepCopy();
    let newNameObject = this.deepCopy() as StringArrayName;

    newNameObject.components.push(c);

    this.assertComponentWasAppendedAndOriginalUnchanged(newNameObject, backup, c);
    return newNameObject;
  }

  public remove(i: number): StringArrayName {
    this.assertValidIndex(i);

    const backup = this.deepCopy();
    let newNameObject = this.deepCopy() as StringArrayName;


    newNameObject.components.splice(i, 1);

    this.assertComponentWasRemovedAndOriginalUnchanged(newNameObject, backup, i);
    return newNameObject;
  }

  public deepCopy(): Name {
    let copyOfComponets = [...this.components];
    return new StringArrayName(copyOfComponets, this.delimiter);
  }

  protected assertStringArrayNameInvariant() {
    this.assertValidDelimiterState();
    InvalidStateException.assertIsNotNullOrUndefined(
      this.components,
      "components undefined"
    );
    try {
      this.components.forEach((element) => {
        this.assertValidComponent(element);
      });
    } catch (error) {
      throw new InvalidStateException("a component has an invalid value");
    }
  }
}
