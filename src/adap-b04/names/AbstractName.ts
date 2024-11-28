import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.assertValidDelimter(delimiter);

    this.delimiter = delimiter;
  }

  // Abstract methods

  public clone(): Name {
    return this.cloneSubclass();
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
    return other && this.asDataString() === other.asDataString();
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
        throw new Error("needs implementation");
    }
  }

  // Methods to be implemented by subclasses
  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): void;

  abstract insert(i: number, c: string): void;
  abstract append(c: string): void;
  abstract remove(i: number): void;
  abstract deepCopy(): Name;

  abstract cloneSubclass(): Name;

  abstract recoverNameStateImpl(backup: Name): void;

  // Pre conditions

  /* This checks when there is meant to be a custom delimter whether it's correct.*/
  protected assertValidDelimter(delim: string): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(delim);
    const condition = delim.length === 1;
    IllegalArgumentException.assertCondition(
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
    IllegalArgumentException.assertCondition(condition, "Index out of bounds");
  }

  // Post conditions

  protected assertValidClone(clone: Name): void {
    const condition = this.isEqual(clone);
    MethodFailureException.assertCondition(
      condition,
      "clone does not equal to 'this'"
    );
  }

  protected assertDelimiterSet(delim?: string): void {
    MethodFailureException.assertIsNotNullOrUndefined(this.delimiter);
    const condition = this.delimiter === delim;
    MethodFailureException.assertCondition(
      condition,
      "Delimiter of 'this' does not equals intended delimiter"
    );
  }

  protected assertComponentsConcatenated(backup: Name, other: Name) {
    const condition =
      this.getNoComponents() ===
      backup.getNoComponents() + other.getNoComponents();
    try {
      MethodFailureException.assertCondition(
        condition,
        "'This' is not properly concatenated"
      );
    } catch (error: any) {
      this.recoverNameState(backup);
      MethodFailureException.assertCondition(
        condition,
        "'This' is not properly concatenated"
      );
    }
  }

  protected assertMethodPostConditionAndRecoverOnFailure(
    condition: boolean,
    msg: string,
    backup: Name
  ) {
    try {
      MethodFailureException.assertCondition(condition, msg);
    } catch (error: any) {
      this.recoverNameState(backup);
      MethodFailureException.assertCondition(condition, msg);
    }
  }

  protected assertComponentWasSet(backup: Name, i: number, c: string) {
    const condition = this.getComponent(i) === c;
    this.assertMethodPostConditionAndRecoverOnFailure(
      condition,
      "Components not correctly changed",
      backup
    );
  }

  protected assertComponentWasInserted(backup: Name, i: number, c: string) {
    const condition =
      this.getComponent(i) === c &&
      backup.getNoComponents() + 1 === this.getNoComponents();
    this.assertMethodPostConditionAndRecoverOnFailure(
      condition,
      "Components not correctly changed",
      backup
    );
  }
  protected assertComponentWasAppended(backup: Name, c: string) {
    const condition =
      this.getComponent(this.getNoComponents() - 1) === c &&
      backup.getNoComponents() + 1 === this.getNoComponents();
    this.assertMethodPostConditionAndRecoverOnFailure(
      condition,
      "Components not correctly changed",
      backup
    );
  }
  protected assertComponentWasRemoved(backup: Name, i: number) {
    const condition = backup.getNoComponents() - 1 === this.getNoComponents();
    this.assertMethodPostConditionAndRecoverOnFailure(
      condition,
      "Components not correctly changed",
      backup
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

  // Recovery methods

  protected recoverNameState(backup: Name): void {
    this.recoverNameStateImpl(backup);
  }

}
