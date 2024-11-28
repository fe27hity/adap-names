import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";

import { AbstractName } from "./AbstractName";

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

// Tests for the AbstractName class methods
describe("AbstractName method tests", () => {
  it("should return asString with default delimiter", () => {
    const n: Name = new StringName("oss.cs.fau.de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("should return asString with custom delimiter", () => {
    const n: Name = new StringName("oss#cs#fau#de", "#");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });

  it("should return asDataString correctly", () => {
    const n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("should compare equality correctly with isEqual", () => {
    const n1: Name = new StringName("oss.cs.fau.de");
    const n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n1.isEqual(n2)).toBe(true);

    const n3: Name = new StringName("oss.cs.fau");
    expect(n1.isEqual(n3)).toBe(false);
  });

  it("should clone the object correctly", () => {
    const n1: Name = new StringName("oss.cs.fau.de");
    const n2: any = n1.clone();
    expect(n1.isEqual(n2)).toBe(true);
    n2.append("people");
    expect(n1.isEqual(n2)).toBe(false);
  });

  it("should concatenate two Name objects using concat", () => {
    const n1: Name = new StringArrayName(["oss", "cs"]);
    const n2: Name = new StringArrayName(["fau", "de"]);
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });

  it("should return a valid hash code for different names", () => {
    const n1: Name = new StringName("oss.cs.fau.de");
    const n2: Name = new StringName("oss.cs.fau.de");
    const n3: Name = new StringName("oss.cs.fau");

    // Hash codes for equal data strings should be the same
    expect(n1.getHashCode()).toBe(n2.getHashCode());
    // Hash codes for different data strings should differ
    expect(n1.getHashCode()).not.toBe(n3.getHashCode());
  });

  it("should identify an empty name correctly", () => {
    const n: Name = new StringArrayName([]);
    expect(n.isEmpty()).toBe(true);

    const n2: Name = new StringName("");
    expect(n2.isEmpty()).toBe(true);

    const n3: Name = new StringName("oss.cs");
    expect(n3.isEmpty()).toBe(false);
  });

  it("should retrieve the correct delimiter", () => {
    const n: Name = new StringName("oss#cs#fau#de", "#");
    expect(n.getDelimiterCharacter()).toBe("#");

    const n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n2.getDelimiterCharacter()).toBe(".");
  });

  it("should handle complex escape characters correctly", () => {
    const n: Name = new StringName("oss\\.cs\\.fau\\.de");
    expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

// Tests for preconditions in AbstractName
describe("AbstractName precondition tests", () => {
  it("should throw for invalid delimiter during construction", () => {
    expect(() => new StringName("oss.fau.de", "##")).toThrow(
      IllegalArgumentException
    );
    expect(() => new StringArrayName(["oss", "fau", "de"], "##")).toThrow(
      IllegalArgumentException
    );
  });

  it("should throw for null or undefined delimiter", () => {
    expect(() => new StringName("oss.fau.de", null as any)).toThrow(
      IllegalArgumentException
    );
  });

  it("should throw for invalid component in insert method", () => {
    const n: Name = new StringName("oss.fau.de");
    expect(() => n.insert(1, null as any)).toThrow(IllegalArgumentException);
    expect(() => n.insert(1, undefined as any)).toThrow(IllegalArgumentException);
  });

  it("should throw for invalid index in insert method", () => {
    const n: Name = new StringName("oss.fau.de");
    expect(() => n.insert(-1, "cs")).toThrow(IllegalArgumentException);
    expect(() => n.insert(10, "cs")).toThrow(IllegalArgumentException);
  });

  it("should throw for invalid component in append method", () => {
    const n: Name = new StringArrayName(["oss", "fau", "de"]);
    expect(() => n.append(null as any)).toThrow(IllegalArgumentException);
    expect(() => n.append(undefined as any)).toThrow(IllegalArgumentException);
  });

  it("should throw for invalid index in setComponent method", () => {
    const n: Name = new StringName("oss.fau.de");
    expect(() => n.setComponent(-1, "cs")).toThrow(IllegalArgumentException);
    expect(() => n.setComponent(10, "cs")).toThrow(IllegalArgumentException);
  });

  it("should throw for invalid component in setComponent method", () => {
    const n: Name = new StringName("oss.fau.de");
    expect(() => n.setComponent(1, null as any)).toThrow(IllegalArgumentException);
    expect(() => n.setComponent(1, undefined as any)).toThrow(IllegalArgumentException);
  });

  it("should throw for invalid index in remove method", () => {
    const n: Name = new StringName("oss.fau.de");
    expect(() => n.remove(-1)).toThrow(IllegalArgumentException);
    expect(() => n.remove(10)).toThrow(IllegalArgumentException);
  });
});

// Tests for invalid initialization
describe("StringName and StringArrayName initialization precondition tests", () => {
  it("should throw for invalid components in StringArrayName", () => {
    expect(() => new StringArrayName(["oss", null as any, "de"])).toThrow(
      IllegalArgumentException
    );
    expect(() => new StringArrayName(["oss", undefined as any, "de"])).toThrow(
      IllegalArgumentException
    );
  });

  it("should throw for null or undefined name in StringName", () => {
    expect(() => new StringName(null as any)).toThrow(IllegalArgumentException);
    expect(() => new StringName(undefined as any)).toThrow(IllegalArgumentException);
  });

});

describe("Erweiterte Tests für Vorbedingungen", () => {
  // Allgemeine Operationen
  describe("Tests für allgemeine Operationen", () => {

    it("should throw for invalid operation when name is empty", () => {
      const emptyName = new StringArrayName([]);
      expect(() => emptyName.remove(0)).toThrow(IllegalArgumentException);
      expect(() => emptyName.setComponent(0, "test")).toThrow(IllegalArgumentException);
    });

    it("should throw for out-of-range indices in operations", () => {
      let name = new StringName("oss.fau.de");

      expect(() => name.insert(5, "cs")).toThrow(IllegalArgumentException);
      expect(() => name.remove(3)).toThrow(IllegalArgumentException);
    });

    it("should throw for appending invalid components", () => {
      let name = new StringName("oss.fau.de");

      expect(() => name.append(null as any)).toThrow(IllegalArgumentException);
    });
  });

  // Spezialfälle
  describe("Spezialfälle für Grenzwerte", () => {
    it("should handle large number of components correctly", () => {
      const components = Array.from({ length: 1000 }, (_, i) => `comp${i}`);
      const name = new StringArrayName(components);
      expect(name.getComponent(999)).toBe("comp999");
    });
  });
});