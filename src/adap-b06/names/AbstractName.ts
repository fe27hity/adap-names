import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.assertValidDelimter(delimiter);

    this.delimiter = delimiter;
  }

  concat(other: Name): Name {
    this.assertTruthyParameter(other);
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.assertValidComponent(other.getComponent(i));
    }
    const backup = this.deepCopy();

    let newNameObject = this.deepCopy();
  
    for (let i = 0; i < other.getNoComponents(); i++) {
      newNameObject = newNameObject.append(other.getComponent(i));
    }
    return newNameObject;
  }

  // Abstract methods

  public clone(): Name {
    return this.deepCopy();
  }

  public asString(delimiter: string = this.delimiter): string {
    this.assertValidDelimter(delimiter);

    let array = [];
    for (let index = 0; index < this.getNoComponents(); index++) {
      array.push(this.getComponent(index));
    }
    array = array.map((componentString) => {
      return componentString.replaceAll(
        ESCAPE_CHARACTER + this.delimiter,
        this.delimiter
      );
    });
    return array.join(delimiter);
  }

  public toString(): string {
    return this.asDataString();
  }

  public asDataString(): string {
    let array = [];
    for (let index = 0; index < this.getNoComponents(); index++) {
      array.push(this.getComponent(index));
    }
    return array.join(this.delimiter);
  }

  public isEqual(other: Name): boolean {
    IllegalArgumentException.assertIsNotNullOrUndefined(other);
    return this.asDataString() === other.asDataString();
  }

  public getHashCode(): number {
    let hashCode: number = 0;
    const s: string = this.asDataString();
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      hashCode = (hashCode << 5) - hashCode + c;
      hashCode |= 0;
    }
    return hashCode;
  }

  public isEmpty(): boolean {
    return this.getNoComponents() == 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  // Methods to be implemented by subclasses
  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): Name;

  abstract insert(i: number, c: string): Name;
  abstract append(c: string): Name;
  abstract remove(i: number): Name;
  abstract deepCopy(): Name;

  // Pre conditions

  /* This checks when there is meant to be a custom delimter whether it's correct.*/
  protected assertValidDelimter(delim: string): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(delim);
    const condition = delim.length === 1;
    IllegalArgumentException.assert(
      condition,
      "Delimer is not exactly one character"
    );
  }

  protected assertCorrectParamComponents(components: string[]): void {
    this.assertTruthyParameter(components);
    for (let i = 0; i < components.length; i++) {
      this.assertValidComponent(components[i]);
    }
  }

  protected assertTruthyParameter(obj: Object) {
    IllegalArgumentException.assertIsNotNullOrUndefined(
      obj,
      "Argument is invalid"
    );
  }

  protected assertValidComponent(c: string): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(c);
  }

  protected assertValidIndex(n: number): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(n);
    const condition = n >= 0 && n < this.getNoComponents();
    IllegalArgumentException.assert(condition, "Index out of bounds");
  }

  // Post conditions

  protected assertValidClone(clone: Name): void {
    const condition = this.isEqual(clone);
    MethodFailedException.assert(condition, "clone does not equal to 'this'");
  }

  protected assertDelimiterSet(delim?: string): void {
    MethodFailedException.assertIsNotNullOrUndefined(this.delimiter);
    const condition = this.delimiter === delim;
    MethodFailedException.assert(
      condition,
      "Delimiter of 'this' does not equals intended delimiter"
    );
  }

  protected assertComponentsConcatenated(backup: Name, other: Name) {
    const condition =
      this.getNoComponents() ===
      backup.getNoComponents() + other.getNoComponents();
    MethodFailedException.assert(
      condition,
      "'This' is not properly concatenated"
    );
  }

  protected assertMethodPostCondition(condition: boolean, msg: string) {
    MethodFailedException.assert(condition, msg);
  }

  protected assertComponentWasSetAndOriginalUnchanged(
    newObject: Name,
    backup: Name,
    i: number,
    c: string
  ) {
    const condition = newObject.getComponent(i) === c && this.isEqual(backup);
    this.assertMethodPostCondition(
      condition,
      "Components not correctly changed"
    );
  }

  protected assertComponentWasInsertedAndOriginalUnchanged(
    newObject: Name,
    backup: Name,
    i: number,
    c: string
  ) {
    const condition =
    newObject.getComponent(i) === c &&
      backup.getNoComponents() + 1 === newObject.getNoComponents() &&
      this.isEqual(backup);
    this.assertMethodPostCondition(
      condition,
      "Components not correctly changed"
    );
  }
  protected assertComponentWasAppendedAndOriginalUnchanged(
    newObject: Name,
    backup: Name,
    c: string
  ) {
    const condition =
    newObject.getComponent(newObject.getNoComponents() - 1) === c &&
      backup.getNoComponents() + 1 === newObject.getNoComponents() &&
      this.isEqual(backup);
    this.assertMethodPostCondition(
      condition,
      "Components not correctly changed"
    );
  }
  protected assertComponentWasRemovedAndOriginalUnchanged(
    newObject: Name,
    backup: Name,
    i: number
  ) {
    const condition =
      backup.getNoComponents() - 1 === newObject.getNoComponents() &&
      this.isEqual(backup);
    this.assertMethodPostCondition(
      condition,
      "Components not correctly changed"
    );
  }

  // Invariant checks

  protected assertValidDelimiterState(): void {
    InvalidStateException.assertIsNotNullOrUndefined(
      this.delimiter,
      "this.delimiter is null or undefined"
    );
    try {
      this.assertValidDelimter(this.delimiter);
    } catch (error) {
      throw new InvalidStateException(
        "Invalid delimiter as current object state"
      );
    }
  }
}
