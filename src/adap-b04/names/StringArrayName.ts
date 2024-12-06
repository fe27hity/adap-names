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

  public setComponent(i: number, c: string) {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    const backup = this.deepCopy();

    this.components[i] = c;
    this.assertComponentWasSet(backup, i, c);
  }

  public insert(i: number, c: string) {
    this.assertValidIndex(i);
    this.assertValidComponent(c);

    const backup = this.deepCopy()

    this.components.splice(i, 0, c);
    this.assertComponentWasInserted(backup, i, c);
  }

  public append(c: string) {
    this.assertValidComponent(c);

    const backup = this.deepCopy()

    this.components.push(c);

    this.assertComponentWasAppended(backup, c);
  }

  public remove(i: number) {
    this.assertValidIndex(i);

    const backup = this.deepCopy()

    this.components.splice(i, 1);

    this.assertComponentWasRemoved(backup, i);
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

  protected assertStringArrayNameInvariant() {
    this.assertValidDelimiterState();
    /*InvalidStateException.assertIsNotNullOrUndefined(
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
      */
  }

  public deepCopy(): Name {
    let copyOfComponets = [...this.components];
    return new StringArrayName(copyOfComponets, this.delimiter);
    
  }
}
