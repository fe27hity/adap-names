import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});





// Tests for StringName implementation
describe("StringName function tests", () => {
  it("should initialize and get number of components", () => {
    const n: Name = new StringName("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("should properly append a new component", () => {
    const n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("should insert component at specified index", () => {
    const n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("should remove component at specified index", () => {
    const n: Name = new StringName("oss.cs.fau.de");
    n.remove(1);
    expect(n.asString()).toBe("oss.fau.de");
    expect(n.getNoComponents()).toBe(3);
  });

  it("should handle empty name correctly", () => {
    const n: Name = new StringName("");
    expect(n.isEmpty()).toBe(true);
    expect(n.getNoComponents()).toBe(0);
  });

  it("should handle escaped delimiter correctly", () => {
    const n: Name = new StringName("oss\\.cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

// Tests for StringArrayName implementation
describe("StringArrayName function tests", () => {
  it("should initialize and get number of components", () => {
    const n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.getNoComponents()).toBe(4);
  });

  it("should append a new component", () => {
    const n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("should insert a component at the correct index", () => {
    const n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("should remove a component at specified index", () => {
    const n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(2);
    expect(n.asString()).toBe("oss.cs.de");
  });

  it("should handle escaped characters in component", () => {
    const n: Name = new StringArrayName(["oss\\.", "cs", "fau.de"]);
    expect(n.getNoComponents()).toBe(3);
    expect(n.asDataString()).toBe("oss\\..cs.fau.de");
  });
});

// Tests for delimiter customization
describe("Delimiter customization tests", () => {
  it("should use custom delimiter", () => {
    const n: Name = new StringName("oss#fau#de", "#");
    expect(n.asString()).toBe("oss#fau#de");
    expect(n.getDelimiterCharacter()).toBe("#");
  });

  it("should insert with custom delimiter", () => {
    const n: Name = new StringName("oss#fau#de", "#");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });

  it("should append with custom delimiter", () => {
    const n: Name = new StringName("oss#cs#fau", "#");
    n.append("de");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

// Tests for escape character usage
describe("Escape character tests", () => {
  it("should handle escaping of delimiters", () => {
    const n: Name = new StringName("oss\\.cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("should handle escaped escape characters", () => {
    const n: Name = new StringName("oss\\.\\.cs.fau.\\.de");
    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("oss..cs.fau..de");
  });

  it("should handle escaped escape characters", () => {
    const n: Name = new StringArrayName(["oss\\.\\.cs","fau", "\\.de"]);
    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("oss..cs.fau..de");
  });

  it("should handle escaped escape characters", () => {
    const n: Name = new StringName("oss\\.\\..cs.fau.\\.de");
    expect(n.getNoComponents()).toBe(4);
    expect(n.asString()).toBe("oss...cs.fau..de");
  });

  it("should escape components when converting to data string", () => {
    const n: Name = new StringName("oss.cs\\.fau.de");
    expect(n.asDataString()).toBe("oss.cs\\.fau.de");
  });

  it("should correctly parse data strings with escaped characters", () => {
    const n: Name = new StringName("oss\\.cs\\.fau\\.de");
    expect(n.getNoComponents()).toBe(1);
    expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de");
  });
});
