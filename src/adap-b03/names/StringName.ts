import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super();
        throw new Error("needs implementation");
    }
  

  /** @methodtype get-method */
  getNoComponents(): number {
    return this.noComponents;
  }

  /** @methodtype get-method */
  getComponent(i: number): string {
    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
      "g"
    );
    let arrayOfComponents = this.name.split(regex);
    return arrayOfComponents[i];
  }

  /** @methodtype set-method */
  setComponent(i: number, c: string) {
    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
      "g"
    );
    let arrayOfComponents = this.name.split(regex);
    arrayOfComponents[i] = c;
    this.name = arrayOfComponents.join(this.delimiter);
  }

  /** @methodtype command-method */
  insert(i: number, c: string) {
    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
      "g"
    );
    let arrayOfComponents = this.name.split(regex);

    arrayOfComponents.splice(i, 0, c);
    this.name = arrayOfComponents.join(this.delimiter);
    this.noComponents++;
  }

  /** @methodtype command-method */
  append(c: string) {
    this.name += this.delimiter + c;
    this.noComponents++;
  }

  /** @methodtype command-method */
  remove(i: number) {
    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})\\${this.delimiter}`,
      "g"
    );
    let arrayOfComponents = this.name.split(regex);
    arrayOfComponents.splice(i, 1);
    this.name = arrayOfComponents.join(this.delimiter);
    this.noComponents--;
  }

  cloneSubclass(): Name {
    return Object.assign(new StringName(""), this);
}
}
