---
title: System functions
description: Learn about SQL System functions in Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: mjbrown

---
# <a id="system_functions></a> System functions

 Cosmos DB provides many built-in SQL functions. The categories of built-in functions are listed below.  
  
|Function|Description|  
|--------------|-----------------|  
|[Mathematical functions](#bk_mathematical_functions)|The mathematical functions each perform a calculation, usually based on input values that are provided as arguments, and return a numeric value.|  
|[Type checking functions](#bk_type_checking_functions)|The type checking functions allow you to check the type of an expression within SQL queries.|  
|[String functions](#bk_string_functions)|The string functions perform an operation on a string input value and return a string, numeric or Boolean value.|  
|[Array functions](#bk_array_functions)|The array functions perform an operation on an array input value and return numeric, Boolean, or array value.|
|[Date and Time functions](#bk_date_and_time_functions)|The date and time functions allow you to get the current UTC date and time in two forms; a numeric timestamp whose value is the Unix epoch in milliseconds or as a string which conforms to the ISO 8601 format.|
|[Spatial functions](#bk_spatial_functions)|The spatial functions perform an operation on a spatial object input value and return a numeric or Boolean value.|  

Below are a list of functions within each category:

| Function group | Operations |
|---------|----------|
| Mathematical functions | ABS, CEILING, EXP, FLOOR, LOG, LOG10, POWER, ROUND, SIGN, SQRT, SQUARE, TRUNC, ACOS, ASIN, ATAN, ATN2, COS, COT, DEGREES, PI, RADIANS, SIN, TAN |
| Type-checking functions | IS_ARRAY, IS_BOOL, IS_NULL, IS_NUMBER, IS_OBJECT, IS_STRING, IS_DEFINED, IS_PRIMITIVE |
| String functions | CONCAT, CONTAINS, ENDSWITH, INDEX_OF, LEFT, LENGTH, LOWER, LTRIM, REPLACE, REPLICATE, REVERSE, RIGHT, RTRIM, STARTSWITH, SUBSTRING, UPPER |
| Array functions | ARRAY_CONCAT, ARRAY_CONTAINS, ARRAY_LENGTH, and ARRAY_SLICE |
| Spatial functions | ST_DISTANCE, ST_WITHIN, ST_INTERSECTS, ST_ISVALID, ST_ISVALIDDETAILED |

If you’re currently using a user-defined function (UDF) for which a built-in function is now available, the corresponding built-in function will be quicker to run and more efficient.

The main difference between Cosmos DB functions and ANSI SQL functions is that Cosmos DB functions are designed to work well with schemaless and mixed-schema data. For example, if a property is missing or has a non-numeric value like `unknown`, the item is skipped instead of returning an error.

###  <a name="bk_mathematical_functions"></a> Mathematical functions  

The mathematical functions each perform a calculation, based on input values that are provided as arguments, and return a numeric value.

You can run queries like the following example:

```sql
    SELECT VALUE ABS(-4)
```

The result is:

```json
    [4]
```

Here’s a table of supported built-in mathematical functions.

| Usage | Description |
|----------|--------|
| ABS (num_expr) | Returns the absolute (positive) value of the specified numeric expression. |
| CEILING (num_expr) | Returns the smallest integer value greater than, or equal to, the specified numeric expression. |
| FLOOR (num_expr) | Returns the largest integer less than or equal to the specified numeric expression. |
| EXP (num_expr) | Returns the exponent of the specified numeric expression. |
| LOG (num_expr, base) | Returns the natural logarithm of the specified numeric expression, or the logarithm using the specified base. |
| LOG10 (num_expr) | Returns the base-10 logarithmic value of the specified numeric expression. |
| ROUND (num_expr) | Returns a numeric value, rounded to the closest integer value. |
| TRUNC (num_expr) | Returns a numeric value, truncated to the closest integer value. |
| SQRT (num_expr) | Returns the square root of the specified numeric expression. |
| SQUARE (num_expr) | Returns the square of the specified numeric expression. |
| POWER (num_expr, num_expr) | Returns the power of the specified numeric expression to the value specified. |
| SIGN (num_expr) | Returns the sign value (-1, 0, 1) of the specified numeric expression. |
| ACOS (num_expr) | Returns the angle, in radians, whose cosine is the specified numeric expression; also called arccosine. |
| ASIN (num_expr) | Returns the angle, in radians, whose sine is the specified numeric expression. This function is also called arcsine. |
| ATAN (num_expr) | Returns the angle, in radians, whose tangent is the specified numeric expression. This function is also called arctangent. |
| ATN2 (num_expr) | Returns the angle, in radians, between the positive x-axis and the ray from the origin to the point (y, x), where x and y are the values of the two specified float expressions. |
| COS (num_expr) | Returns the trigonometric cosine of the specified angle, in radians, in the specified expression. |
| COT (num_expr) | Returns the trigonometric cotangent of the specified angle, in radians, in the specified numeric expression. |
| DEGREES (num_expr) | Returns the corresponding angle in degrees for an angle specified in radians. |
| PI () | Returns the constant value of PI. |
| RADIANS (num_expr) | Returns radians when a numeric expression, in degrees, is entered. |
| SIN (num_expr) | Returns the trigonometric sine of the specified angle, in radians, in the specified expression. |
| TAN (num_expr) | Returns the tangent of the input expression, in the specified expression. |

###  <a name="bk_mathematical_functions"></a> Mathematical functions  
 The following functions each perform a calculation, usually based on input values that are provided as arguments, and return a numeric value.  
  
||||  
|-|-|-|  
|[ABS](#bk_abs)|[ACOS](#bk_acos)|[ASIN](#bk_asin)|  
|[ATAN](#bk_atan)|[ATN2](#bk_atn2)|[CEILING](#bk_ceiling)|  
|[COS](#bk_cos)|[COT](#bk_cot)|[DEGREES](#bk_degrees)|  
|[EXP](#bk_exp)|[FLOOR](#bk_floor)|[LOG](#bk_log)|  
|[LOG10](#bk_log10)|[PI](#bk_pi)|[POWER](#bk_power)|  
|[RADIANS](#bk_radians)|[ROUND](#bk_round)|[SIN](#bk_sin)|  
|[SQRT](#bk_sqrt)|[SQUARE](#bk_square)|[SIGN](#bk_sign)|  
|[TAN](#bk_tan)|[TRUNC](#bk_trunc)||  
  
####  <a name="bk_abs"></a> ABS  
 Returns the absolute (positive) value of the specified numeric expression.  
  
 **Syntax**  
  
```  
ABS (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example shows the results of using the ABS function on three different numbers.  
  
```  
SELECT ABS(-1) AS abs1, ABS(0) AS abs2, ABS(1) AS abs3 
```  
  
 Here is the result set.  
  
```  
[{abs1: 1, abs2: 0, abs3: 1}]  
```  
  
####  <a name="bk_acos"></a> ACOS  
 Returns the angle, in radians, whose cosine is the specified numeric expression; also called arccosine.  
  
 **Syntax**  
  
```  
ACOS(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the ACOS of -1.  
  
```  
SELECT ACOS(-1) AS acos 
```  
  
 Here is the result set.  
  
```  
[{"acos": 3.1415926535897931}]  
```  
  
####  <a name="bk_asin"></a> ASIN  
 Returns the angle, in radians, whose sine is the specified numeric expression. This is also called arcsine.  
  
 **Syntax**  
  
```  
ASIN(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the ASIN of -1.  
  
```  
SELECT ASIN(-1) AS asin  
```  
  
 Here is the result set.  
  
```  
[{"asin": -1.5707963267948966}]  
```  
  
####  <a name="bk_atan"></a> ATAN  
 Returns the angle, in radians, whose tangent is the specified numeric expression. This is also called arctangent.  
  
 **Syntax**  
  
```  
ATAN(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the ATAN of the specified value.  
  
```  
SELECT ATAN(-45.01) AS atan  
```  
  
 Here is the result set.  
  
```  
[{"atan": -1.5485826962062663}]  
```  
  
####  <a name="bk_atn2"></a> ATN2  
 Returns the principal value of the arc tangent of y/x, expressed in radians.  
  
 **Syntax**  
  
```  
ATN2(<numeric_expression>, <numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the ATN2 for the specified x and y components.  
  
```  
SELECT ATN2(35.175643, 129.44) AS atn2  
```  
  
 Here is the result set.  
  
```  
[{"atn2": 1.3054517947300646}]  
```  
  
####  <a name="bk_ceiling"></a> CEILING  
 Returns the smallest integer value greater than, or equal to, the specified numeric expression.  
  
 **Syntax**  
  
```  
CEILING (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example shows positive numeric, negative, and zero values with the CEILING function.  
  
```  
SELECT CEILING(123.45) AS c1, CEILING(-123.45) AS c2, CEILING(0.0) AS c3  
```  
  
 Here is the result set.  
  
```  
[{c1: 124, c2: -123, c3: 0}]  
```  
  
####  <a name="bk_cos"></a> COS  
 Returns the trigonometric cosine of the specified angle, in radians, in the specified expression.  
  
 **Syntax**  
  
```  
COS(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the COS of the specified angle.  
  
```  
SELECT COS(14.78) AS cos  
```  
  
 Here is the result set.  
  
```  
[{"cos": -0.59946542619465426}]  
```  
  
####  <a name="bk_cot"></a> COT  
 Returns the trigonometric cotangent of the specified angle, in radians, in the specified numeric expression.  
  
 **Syntax**  
  
```  
COT(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the COT of the specified angle.  
  
```  
SELECT COT(124.1332) AS cot  
```  
  
 Here is the result set.  
  
```  
[{"cot": -0.040311998371148884}]  
```  
  
####  <a name="bk_degrees"></a> DEGREES  
 Returns the corresponding angle in degrees for an angle specified in radians.  
  
 **Syntax**  
  
```  
DEGREES (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the number of degrees in an angle of PI/2 radians.  
  
```  
SELECT DEGREES(PI()/2) AS degrees  
```  
  
 Here is the result set.  
  
```  
[{"degrees": 90}]  
```  
  
####  <a name="bk_floor"></a> FLOOR  
 Returns the largest integer less than or equal to the specified numeric expression.  
  
 **Syntax**  
  
```  
FLOOR (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example shows positive numeric, negative, and zero values with the FLOOR function.  
  
```  
SELECT FLOOR(123.45) AS fl1, FLOOR(-123.45) AS fl2, FLOOR(0.0) AS fl3  
```  
  
 Here is the result set.  
  
```  
[{fl1: 123, fl2: -124, fl3: 0}]  
```  
  
####  <a name="bk_exp"></a> EXP  
 Returns the exponential value of the specified numeric expression.  
  
 **Syntax**  
  
```  
EXP (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Remarks**  
  
  The constant **e** (2.718281…), is the base of natural logarithms.  
  
  The exponent of a number is the constant **e** raised to the power of the number. For example, EXP(1.0) = e^1.0 = 2.71828182845905 and EXP(10) = e^10 = 22026.4657948067.  
  
  The exponential of the natural logarithm of a number is the number itself: EXP (LOG (n)) = n. And the natural logarithm of the exponential of a number is the number itself: LOG (EXP (n)) = n.  
  
  **Examples**  
  
  The following example declares a variable and returns the exponential value of the specified variable (10).  
  
```  
SELECT EXP(10) AS exp  
```  
  
 Here is the result set.  
  
```  
[{exp: 22026.465794806718}]  
```  
  
 The following example returns the exponential value of the natural logarithm of 20 and the natural logarithm of the exponential of 20. Because these functions are inverse functions of one another, the return value with rounding for floating point math in both cases is 20.  
  
```  
SELECT EXP(LOG(20)) AS exp1, LOG(EXP(20)) AS exp2  
```  
  
 Here is the result set.  
  
```  
[{exp1: 19.999999999999996, exp2: 20}]  
```  
  
####  <a name="bk_log"></a> LOG  
 Returns the natural logarithm of the specified numeric expression.  
  
 **Syntax**  
  
```  
LOG (<numeric_expression> [, <base>])  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
- `base`  
  
   Optional numeric argument that sets the base for the logarithm.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Remarks**  
  
  By default, LOG() returns the natural logarithm. You can change the base of the logarithm to another value by using the optional base parameter.  
  
  The natural logarithm is the logarithm to the base **e**, where **e** is an irrational constant approximately equal to 2.718281828.  
  
  The natural logarithm of the exponential of a number is the number itself: LOG( EXP( n ) ) = n. And the exponential of the natural logarithm of a number is the number itself: EXP( LOG( n ) ) = n.  
  
  **Examples**  
  
  The following example declares a variable and returns the logarithm value of the specified variable (10).  
  
```  
SELECT LOG(10) AS log  
```  
  
 Here is the result set.  
  
```  
[{log: 2.3025850929940459}]  
```  
  
 The following example calculates the LOG for the exponent of a number.  
  
```  
SELECT EXP(LOG(10)) AS expLog  
```  
  
 Here is the result set.  
  
```  
[{expLog: 10.000000000000002}]  
```  
  
####  <a name="bk_log10"></a> LOG10  
 Returns the base-10 logarithm of the specified numeric expression.  
  
 **Syntax**  
  
```  
LOG10 (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Remarks**  
  
  The LOG10 and POWER functions are inversely related to one another. For example, 10 ^ LOG10(n) = n.  
  
  **Examples**  
  
  The following example declares a variable and returns the LOG10 value of the specified variable (100).  
  
```  
SELECT LOG10(100) AS log10 
```  
  
 Here is the result set.  
  
```  
[{log10: 2}]  
```  
  
####  <a name="bk_pi"></a> PI  
 Returns the constant value of PI.  
  
 **Syntax**  
  
```  
PI ()  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the value of PI.  
  
```  
SELECT PI() AS pi 
```  
  
 Here is the result set.  
  
```  
[{"pi": 3.1415926535897931}]  
```  
  
####  <a name="bk_power"></a> POWER  
 Returns the value of the specified expression to the specified power.  
  
 **Syntax**  
  
```  
POWER (<numeric_expression>, <y>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
- `y`  
  
   Is the power to which to raise `numeric_expression`.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example demonstrates raising a number to the power of 3 (the cube of the number).  
  
```  
SELECT POWER(2, 3) AS pow1, POWER(2.5, 3) AS pow2  
```  
  
 Here is the result set.  
  
```  
[{pow1: 8, pow2: 15.625}]  
```  
  
####  <a name="bk_radians"></a> RADIANS  
 Returns radians when a numeric expression, in degrees, is entered.  
  
 **Syntax**  
  
```  
RADIANS (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example takes a few angles as input and returns their corresponding radian values.  
  
```  
SELECT RADIANS(-45.01) AS r1, RADIANS(-181.01) AS r2, RADIANS(0) AS r3, RADIANS(0.1472738) AS r4, RADIANS(197.1099392) AS r5  
```  
  
  Here is the result set.  
  
```  
[{  
       "r1": -0.7855726963226477,  
       "r2": -3.1592204790349356,  
       "r3": 0,  
       "r4": 0.0025704127119236249,  
       "r5": 3.4402174274458375  
   }]  
```  
  
####  <a name="bk_round"></a> ROUND  
 Returns a numeric value, rounded to the closest integer value.  
  
 **Syntax**  
  
```  
ROUND(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Remarks**
  
  The rounding operation performed follows midpoint rounding away from zero. If the input is a numeric expression which falls exactly between two integers then the result will be the closest integer value away from zero.  
  
  |<numeric_expression>|Rounded|
  |-|-|
  |-6.5000|-7|
  |-0.5|-1|
  |0.5|1|
  |6.5000|7||
  
  **Examples**  
  
  The following example rounds the following positive and negative numbers to the nearest integer.  
  
```  
SELECT ROUND(2.4) AS r1, ROUND(2.6) AS r2, ROUND(2.5) AS r3, ROUND(-2.4) AS r4, ROUND(-2.6) AS r5  
```  
  
  Here is the result set.  
  
```  
[{r1: 2, r2: 3, r3: 3, r4: -2, r5: -3}]  
```  
  
####  <a name="bk_sign"></a> SIGN  
 Returns the positive (+1), zero (0), or negative (-1) sign of the specified numeric expression.  
  
 **Syntax**  
  
```  
SIGN(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the SIGN values of numbers from -2 to 2.  
  
```  
SELECT SIGN(-2) AS s1, SIGN(-1) AS s2, SIGN(0) AS s3, SIGN(1) AS s4, SIGN(2) AS s5  
```  
  
 Here is the result set.  
  
```  
[{s1: -1, s2: -1, s3: 0, s4: 1, s5: 1}]  
```  
  
####  <a name="bk_sin"></a> SIN  
 Returns the trigonometric sine of the specified angle, in radians, in the specified expression.  
  
 **Syntax**  
  
```  
SIN(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the SIN of the specified angle.  
  
```  
SELECT SIN(45.175643) AS sin  
```  
  
 Here is the result set.  
  
```  
[{"sin": 0.929607286611012}]  
```  
  
####  <a name="bk_sqrt"></a> SQRT  
 Returns the square root of the specified numeric value.  
  
 **Syntax**  
  
```  
SQRT(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the square roots of numbers 1-3.  
  
```  
SELECT SQRT(1) AS s1, SQRT(2.0) AS s2, SQRT(3) AS s3  
```  
  
 Here is the result set.  
  
```  
[{s1: 1, s2: 1.4142135623730952, s3: 1.7320508075688772}]  
```  
  
####  <a name="bk_square"></a> SQUARE  
 Returns the square of the specified numeric value.  
  
 **Syntax**  
  
```  
SQUARE(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the squares of numbers 1-3.  
  
```  
SELECT SQUARE(1) AS s1, SQUARE(2.0) AS s2, SQUARE(3) AS s3  
```  
  
 Here is the result set.  
  
```  
[{s1: 1, s2: 4, s3: 9}]  
```  
  
####  <a name="bk_tan"></a> TAN  
 Returns the tangent of the specified angle, in radians, in the specified expression.  
  
 **Syntax**  
  
```  
TAN (<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example calculates the tangent of PI()/2.  
  
```  
SELECT TAN(PI()/2) AS tan 
```  
  
 Here is the result set.  
  
```  
[{"tan": 16331239353195370 }]  
```  
  
####  <a name="bk_trunc"></a> TRUNC  
 Returns a numeric value, truncated to the closest integer value.  
  
 **Syntax**  
  
```  
TRUNC(<numeric_expression>)  
```  
  
 **Arguments**  
  
- `numeric_expression`  
  
   Is a numeric expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example truncates the following positive and negative numbers to the nearest integer value.  
  
```  
SELECT TRUNC(2.4) AS t1, TRUNC(2.6) AS t2, TRUNC(2.5) AS t3, TRUNC(-2.4) AS t4, TRUNC(-2.6) AS t5  
```  
  
 Here is the result set.  
  
```  
[{t1: 2, t2: 2, t3: 2, t4: -2, t5: -2}]  
```  
### Type-checking functions

The type-checking functions let you check the type of an expression within a SQL query. You can use type-checking functions to determine the types of properties within items on the fly, when they're variable or unknown. Here’s a table of supported built-in type-checking functions:

| **Usage** | **Description** |
|-----------|------------|
| [IS_ARRAY (expr)](sql-api-query-reference.md#bk_is_array) | Returns a Boolean indicating if the type of the value is an array. |
| [IS_BOOL (expr)](sql-api-query-reference.md#bk_is_bool) | Returns a Boolean indicating if the type of the value is a Boolean. |
| [IS_NULL (expr)](sql-api-query-reference.md#bk_is_null) | Returns a Boolean indicating if the type of the value is null. |
| [IS_NUMBER (expr)](sql-api-query-reference.md#bk_is_number) | Returns a Boolean indicating if the type of the value is a number. |
| [IS_OBJECT (expr)](sql-api-query-reference.md#bk_is_object) | Returns a Boolean indicating if the type of the value is a JSON object. |
| [IS_STRING (expr)](sql-api-query-reference.md#bk_is_string) | Returns a Boolean indicating if the type of the value is a string. |
| [IS_DEFINED (expr)](sql-api-query-reference.md#bk_is_defined) | Returns a Boolean indicating if the property has been assigned a value. |
| [IS_PRIMITIVE (expr)](sql-api-query-reference.md#bk_is_primitive) | Returns a Boolean indicating if the type of the value is a string, number, Boolean, or null. |

Using these functions, you can run queries like the following example:

```sql
    SELECT VALUE IS_NUMBER(-4)
```

The result is:

```json
    [true]
```

### String functions

The following scalar functions perform an operation on a string input value and return a string, numeric, or Boolean value. Here's a table of built-in string functions:

| Usage | Description |
| --- | --- |
| [LENGTH (str_expr)](sql-api-query-reference.md#bk_length) | Returns the number of characters of the specified string expression. |
| [CONCAT (str_expr, str_expr [, str_expr])](sql-api-query-reference.md#bk_concat) | Returns a string that is the result of concatenating two or more string values. |
| [SUBSTRING (str_expr, num_expr, num_expr)](sql-api-query-reference.md#bk_substring) | Returns part of a string expression. |
| [STARTSWITH (str_expr, str_expr)](sql-api-query-reference.md#bk_startswith) | Returns a Boolean indicating whether the first string expression starts with the second. |
| [ENDSWITH (str_expr, str_expr)](sql-api-query-reference.md#bk_endswith) | Returns a Boolean indicating whether the first string expression ends with the second. |
| [CONTAINS (str_expr, str_expr)](sql-api-query-reference.md#bk_contains) | Returns a Boolean indicating whether the first string expression contains the second. |
| [INDEX_OF (str_expr, str_expr)](sql-api-query-reference.md#bk_index_of) | Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or -1 if the string isn't found. |
| [LEFT (str_expr, num_expr)](sql-api-query-reference.md#bk_left) | Returns the left part of a string with the specified number of characters. |
| [RIGHT (str_expr, num_expr)](sql-api-query-reference.md#bk_right) | Returns the right part of a string with the specified number of characters. |
| [LTRIM (str_expr)](sql-api-query-reference.md#bk_ltrim) | Returns a string expression after it removes leading blanks. |
| [RTRIM (str_expr)](sql-api-query-reference.md#bk_rtrim) | Returns a string expression after truncating all trailing blanks. |
| [LOWER (str_expr)](sql-api-query-reference.md#bk_lower) | Returns a string expression after converting uppercase character data to lowercase. |
| [UPPER (str_expr)](sql-api-query-reference.md#bk_upper) | Returns a string expression after converting lowercase character data to uppercase. |
| [REPLACE (str_expr, str_expr, str_expr)](sql-api-query-reference.md#bk_replace) | Replaces all occurrences of a specified string value with another string value. |
| [REPLICATE (str_expr, num_expr)](sql-api-query-reference.md#bk_replicate) | Repeats a string value a specified number of times. |
| [REVERSE (str_expr)](sql-api-query-reference.md#bk_reverse) | Returns the reverse order of a string value. |

Using these functions, you can run queries like the following, which returns the family `id` in uppercase:

```sql
    SELECT VALUE UPPER(Families.id)
    FROM Families
```

The results are:

```json
    [
        "WAKEFIELDFAMILY",
        "ANDERSENFAMILY"
    ]
```

Or concatenate strings, like in this example:

```sql
    SELECT Families.id, CONCAT(Families.address.city, ",", Families.address.state) AS location
    FROM Families
```

The results are:

```json
    [{
      "id": "WakefieldFamily",
      "location": "NY,NY"
    },
    {
      "id": "AndersenFamily",
      "location": "Seattle,WA"
    }]
```

You can also use string functions in the WHERE clause to filter results, like in the following example:

```sql
    SELECT Families.id, Families.address.city
    FROM Families
    WHERE STARTSWITH(Families.id, "Wakefield")
```

The results are:

```json
    [{
      "id": "WakefieldFamily",
      "city": "NY"
    }]
```

### Array functions

The following scalar functions perform an operation on an array input value and return a numeric, Boolean, or array value. Here's a table of built-in array functions:

| Usage | Description |
| --- | --- |
| [ARRAY_LENGTH (arr_expr)](sql-api-query-reference.md#bk_array_length) |Returns the number of elements of the specified array expression. |
| [ARRAY_CONCAT (arr_expr, arr_expr [, arr_expr])](sql-api-query-reference.md#bk_array_concat) |Returns an array that is the result of concatenating two or more array values. |
| [ARRAY_CONTAINS (arr_expr, expr [, bool_expr])](sql-api-query-reference.md#bk_array_contains) |Returns a Boolean indicating whether the array contains the specified value. Can specify if the match is full or partial. |
| [ARRAY_SLICE (arr_expr, num_expr [, num_expr])](sql-api-query-reference.md#bk_array_slice) |Returns part of an array expression. |

Use array functions to manipulate arrays within JSON. For example, here's a query that returns all item `id`s where one of the `parents` is `Robin Wakefield`: 

```sql
    SELECT Families.id 
    FROM Families 
    WHERE ARRAY_CONTAINS(Families.parents, { givenName: "Robin", familyName: "Wakefield" })
```

The result is:

```json
    [{
      "id": "WakefieldFamily"
    }]
```

You can specify a partial fragment for matching elements within the array. The following query finds all item `id`s that have `parents` with the `givenName` of `Robin`:

```sql
    SELECT Families.id 
    FROM Families 
    WHERE ARRAY_CONTAINS(Families.parents, { givenName: "Robin" }, true)
```

The result is:

```json
    [{
      "id": "WakefieldFamily"
    }]
```

Here's another example that uses ARRAY_LENGTH to get the number of `children` per family:

```sql
    SELECT Families.id, ARRAY_LENGTH(Families.children) AS numberOfChildren
    FROM Families 
```

The results are:

```json
    [{
      "id": "WakefieldFamily",
      "numberOfChildren": 2
    },
    {
      "id": "AndersenFamily",
      "numberOfChildren": 1
    }]
```

### Spatial functions

Cosmos DB supports the following Open Geospatial Consortium (OGC) built-in functions for geospatial querying: 

| Usage | Description |
| --- | --- |
| ST_DISTANCE (point_expr, point_expr) | Returns the distance between the two GeoJSON `Point`, `Polygon`, or `LineString` expressions. |
| T_WITHIN (point_expr, polygon_expr) | Returns a Boolean expression indicating whether the first GeoJSON object (`Point`, `Polygon`, or `LineString`) is within the second GeoJSON object (`Point`, `Polygon`, or `LineString`). |
| ST_INTERSECTS (spatial_expr, spatial_expr) | Returns a Boolean expression indicating whether the two specified GeoJSON objects (`Point`, `Polygon`, or `LineString`) intersect. |
| ST_ISVALID | Returns a Boolean value indicating whether the specified GeoJSON `Point`, `Polygon`, or `LineString` expression is valid. |
| ST_ISVALIDDETAILED | Returns a JSON value containing a Boolean value if the specified GeoJSON `Point`, `Polygon`, or `LineString` expression is valid, and if invalid, the reason as a string value. |

You can use spatial functions to perform proximity queries against spatial data. For example, here's a query that returns all family items that are within 30 km of a specified location using the ST_DISTANCE built-in function:

```sql
    SELECT f.id
    FROM Families f
    WHERE ST_DISTANCE(f.location, {'type': 'Point', 'coordinates':[31.9, -4.8]}) < 30000
```

The result is:

```json
    [{
      "id": "WakefieldFamily"
    }]
```

For more information on geospatial support in Cosmos DB, see [Working with geospatial data in Azure Cosmos DB](geospatial.md). 

## <a id="References"></a>References

- [Azure Cosmos DB SQL specification](https://go.microsoft.com/fwlink/p/?LinkID=510612)
- [ANSI SQL 2011](https://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=53681)
- [JSON](https://json.org/)
- [Javascript Specification](https://www.ecma-international.org/publications/standards/Ecma-262.htm) 
- [LINQ](/previous-versions/dotnet/articles/bb308959(v=msdn.10)) 
- Graefe, Goetz. [Query evaluation techniques for large databases](https://dl.acm.org/citation.cfm?id=152611). *ACM Computing Surveys* 25, no. 2 (1993).
- Graefe, G. "The Cascades framework for query optimization." *IEEE Data Eng. Bull.* 18, no. 3 (1995).
- Lu, Ooi, Tan. "Query Processing in Parallel Relational Database Systems." *IEEE Computer Society Press* (1994).
- Olston, Christopher, Benjamin Reed, Utkarsh Srivastava, Ravi Kumar, and Andrew Tomkins. "Pig Latin: A Not-So-Foreign Language for Data Processing." *SIGMOD* (2008).

## Next steps

- [Introduction to Azure Cosmos DB][introduction]
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Azure Cosmos DB consistency levels][consistency-levels]

[1]: ./media/how-to-sql-query/sql-query1.png
[introduction]: introduction.md
[consistency-levels]: consistency-levels.md