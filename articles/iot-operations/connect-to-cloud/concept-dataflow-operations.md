---
title: Dataflow operations
description: Learn about dataflow operations for transforming data in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 08/01/2024

#CustomerIntent: As an operator, I want to understand how to use dataflow operations to transform data.
---

# Available operations

Dataflow offers a wide range of out-of-the-box (OOTB) conversion functions that allow users to easily perform unit conversions without the need for complex calculations. These predefined functions cover common conversions such as temperature, pressure, length, weight, and volume. The following is a list of the available conversion functions, along with their corresponding formulas and function names:

| Conversion | Formula | Function Name |
| --- | --- | --- |
| Celsius to Fahrenheit | F = (C * 9/5) + 32 | cToF |
| PSI to Bar | Bar = PSI * 0.0689476 | psiToBar |
| Inch to CM | CM = Inch * 2.54 | inToCm |
| Foot to Meter | Meter = Foot * 0.3048 | ftToM |
| Lbs to KG | KG = Lbs * 0.453592 | lbToKg |
| Gallons to Liters | Liters = Gallons * 3.78541 | galToL |

In addition to these unidirectional conversions, we also support the reverse calculations:

| Conversion | Formula | Function Name |
| --- | --- | --- |
| Fahrenheit to Celsius | C = (F - 32) * 5/9 | fToC |
| Bar to PSI | PSI = Bar / 0.0689476 | barToPsi |
| CM to Inch | Inch = CM / 2.54 | cmToIn |
| Meter to Foot | Foot = Meter / 0.3048 | mToFt |
| KG to Lbs | Lbs = KG / 0.453592 | kgToLb |
| Liters to Gallons | Gallons = Liters / 3.78541 | lToGal |

These functions are designed to simplify the conversion process, allowing users to input values in one unit and receive the corresponding value in another unit effortlessly.

Additionally, we provide a scaling function to scale the range of value to the user-defined range. Example-`scale($1,0,10,0,100)`the input value is scaled from the range 0 to 10 to the range 0 to 100. 

Moreover, users have the flexibility to define their own conversion functions using simple mathematical formulas. Our system supports basic operators such as addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`). These operators follow standard rules of precedence (for example, multiplication and division are performed before addition and subtraction), which can be adjusted using parentheses to ensure the correct order of operations. This capability empowers users to customize their unit conversions to meet specific needs or preferences, enhancing the overall utility and versatility of the system.


For more complex calculations, functions like `sqrt` (which finds the square root of a number) are also available.

## Available arithmetic, comparison, and boolean operators grouped by precedence

| Operator | Description |
|----------|-------------|
| ^        | Exponentiation: $1 ^ 3 |

Since `Exponentiation` has the highest precedence, it's executed first unless parentheses override this order:

* `$1 * 2 ^ 3` is interpreted as `$1 * 8` because the `2 ^ 3` part is executed first, before multiplication.
* `($1 * 2) ^ 3` processes the multiplication before exponentiation.

| Operator | Description |
|----------|-------------|
| -        | Negation |
| !        | Logical not |

`Negation` and `Logical not` have high precedence, so they always stick to their immediate neighbor, except when exponentiation is involved:

* `-$1 * 2` negates $1 first, then multiplies.
* `-($1 * 2)` multiplies, then negates the result

| Operator | Description |
|----------|-------------|
| *        | Multiplication: $1 * 10 |
| /        | Division: $1 / 25 (Result is an integer if both arguments are integers, otherwise float) |
| %        | Modulo: $1 % 25 |

`Multiplication`, `Division`, and `Modulo`, having the same precedence, are executed from left to right, unless the order is altered by parentheses.

| Operator | Description |
|----------|-------------|
| +        | Addition for numeric values, concatenation for strings |
| -        | Subtraction |

`Addition` and `Subtraction` are considered weaker operations compared to those in the previous group:

* `$1 + 2 * 3` results in `$1 + 6`, as `2 * 3` is executed first due to the higher precedence of `Multiplication`.
* `($1 + 2) * 3` prioritizes the `addition` before `multiplication`.

| Operator | Description |
|----------|-------------|
| <        | Less than |
| >        | Greater than |
| <=       | Less than or equal to |
| >=       | Greater than or equal to |
| ==       | Equal to |
| !=       | Not equal to |

`Comparisons` operate on numeric, boolean, and string values. Since they have lower precedence than arithmetic operators, no parentheses are needed to compare results effectively:

* `$1 * 2 <= $2` is equivalent to `($1 * 2) <= $2`.

| Operator | Description |
|----------|-------------|
| \|\|     | Logical OR |
| &&       | Logical AND |

Logical operators are used to chain conditions:

* `$1 > 100 && $2 > 200`
