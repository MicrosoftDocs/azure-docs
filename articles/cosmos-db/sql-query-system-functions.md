---
title: System functions
description: Learn about SQL System functions in Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: mjbrown

---
# System functions

 Cosmos DB provides many built-in SQL functions. The categories of built-in functions are listed below.  
  
|Function|Description|  
|--------------|-----------------|  
|[Mathematical functions](#mathematical-functions)|The mathematical functions each perform a calculation, usually based on input values that are provided as arguments, and return a numeric value.|  
|[Type checking functions](#type-checking-functions)|The type checking functions allow you to check the type of an expression within SQL queries.|  
|[String functions](#string-functions)|The string functions perform an operation on a string input value and return a string, numeric or Boolean value.|  
|[Array functions](#array-functions)|The array functions perform an operation on an array input value and return numeric, Boolean, or array value.|
|[Date and Time functions](#date-time-functions)|The date and time functions allow you to get the current UTC date and time in two forms; a numeric timestamp whose value is the Unix epoch in milliseconds or as a string which conforms to the ISO 8601 format.|
|[Spatial functions](#spatial-functions)|The spatial functions perform an operation on a spatial object input value and return a numeric or Boolean value.|  

Below are a list of functions within each category:

| Function group | Operations |
|---------|----------|
| Mathematical functions | ABS, CEILING, EXP, FLOOR, LOG, LOG10, POWER, ROUND, SIGN, SQRT, SQUARE, TRUNC, ACOS, ASIN, ATAN, ATN2, COS, COT, DEGREES, PI, RADIANS, SIN, TAN |
| Type-checking functions | IS_ARRAY, IS_BOOL, IS_NULL, IS_NUMBER, IS_OBJECT, IS_STRING, IS_DEFINED, IS_PRIMITIVE |
| String functions | CONCAT, CONTAINS, ENDSWITH, INDEX_OF, LEFT, LENGTH, LOWER, LTRIM, REPLACE, REPLICATE, REVERSE, RIGHT, RTRIM, STARTSWITH, SUBSTRING, UPPER |
| Array functions | ARRAY_CONCAT, ARRAY_CONTAINS, ARRAY_LENGTH, and ARRAY_SLICE |
| Date and Time functions | GETCURRENTDATETIME, GETCURRENTTIMESTAMP,  |
| Spatial functions | ST_DISTANCE, ST_WITHIN, ST_INTERSECTS, ST_ISVALID, ST_ISVALIDDETAILED |

If you’re currently using a user-defined function (UDF) for which a built-in function is now available, the corresponding built-in function will be quicker to run and more efficient.

The main difference between Cosmos DB functions and ANSI SQL functions is that Cosmos DB functions are designed to work well with schemaless and mixed-schema data. For example, if a property is missing or has a non-numeric value like `unknown`, the item is skipped instead of returning an error.

##  <a name="mathematical-functions"></a> Mathematical functions  

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

## <a id="type-checking-functions"></a>Type checking functions

The type-checking functions let you check the type of an expression within a SQL query. You can use type-checking functions to determine the types of properties within items on the fly, when they're variable or unknown. Here’s a table of supported built-in type-checking functions:

The following functions support type checking against input values, and each return a Boolean value.  
  
||||  
|-|-|-|  
|[IS_ARRAY](#bk_is_array)|[IS_BOOL](#bk_is_bool)|[IS_DEFINED](#bk_is_defined)|  
|[IS_NULL](#bk_is_null)|[IS_NUMBER](#bk_is_number)|[IS_OBJECT](#bk_is_object)|  
|[IS_PRIMITIVE](#bk_is_primitive)|[IS_STRING](#bk_is_string)||  
  
####  <a name="bk_is_array"></a> IS_ARRAY  
 Returns a Boolean value indicating if the type of the specified expression is an array.  
  
 **Syntax**  
  
```  
IS_ARRAY(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_ARRAY function.  
  
```  
SELECT   
 IS_ARRAY(true) AS isArray1,   
 IS_ARRAY(1) AS isArray2,  
 IS_ARRAY("value") AS isArray3,  
 IS_ARRAY(null) AS isArray4,  
 IS_ARRAY({prop: "value"}) AS isArray5,   
 IS_ARRAY([1, 2, 3]) AS isArray6,  
 IS_ARRAY({prop: "value"}.prop2) AS isArray7  
```  
  
 Here is the result set.  
  
```  
[{"isArray1":false,"isArray2":false,"isArray3":false,"isArray4":false,"isArray5":false,"isArray6":true,"isArray7":false}]
```  
  
####  <a name="bk_is_bool"></a> IS_BOOL  
 Returns a Boolean value indicating if the type of the specified expression is a Boolean.  
  
 **Syntax**  
  
```  
IS_BOOL(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_BOOL function.  
  
```  
SELECT   
    IS_BOOL(true) AS isBool1,   
    IS_BOOL(1) AS isBool2,  
    IS_BOOL("value") AS isBool3,   
    IS_BOOL(null) AS isBool4,  
    IS_BOOL({prop: "value"}) AS isBool5,   
    IS_BOOL([1, 2, 3]) AS isBool6,  
    IS_BOOL({prop: "value"}.prop2) AS isBool7  
```  
  
 Here is the result set.  
  
```  
[{"isBool1":true,"isBool2":false,"isBool3":false,"isBool4":false,"isBool5":false,"isBool6":false,"isBool7":false}]
```  
  
####  <a name="bk_is_defined"></a> IS_DEFINED  
 Returns a Boolean indicating if the property has been assigned a value.  
  
 **Syntax**  
  
```  
IS_DEFINED(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks for the presence of a property within the specified JSON document. The first returns true since "a" is present, but the second returns false since "b" is absent.  
  
```  
SELECT IS_DEFINED({ "a" : 5 }.a) AS isDefined1, IS_DEFINED({ "a" : 5 }.b) AS isDefined2 
```  
  
 Here is the result set.  
  
```  
[{"isDefined1":true,"isDefined2":false}]  
```  
  
####  <a name="bk_is_null"></a> IS_NULL  
 Returns a Boolean value indicating if the type of the specified expression is null.  
  
 **Syntax**  
  
```  
IS_NULL(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_NULL function.  
  
```  
SELECT   
    IS_NULL(true) AS isNull1,   
    IS_NULL(1) AS isNull2,  
    IS_NULL("value") AS isNull3,   
    IS_NULL(null) AS isNull4,  
    IS_NULL({prop: "value"}) AS isNull5,   
    IS_NULL([1, 2, 3]) AS isNull6,  
    IS_NULL({prop: "value"}.prop2) AS isNull7  
```  
  
 Here is the result set.  
  
```  
[{"isNull1":false,"isNull2":false,"isNull3":false,"isNull4":true,"isNull5":false,"isNull6":false,"isNull7":false}]
```  
  
####  <a name="bk_is_number"></a> IS_NUMBER  
 Returns a Boolean value indicating if the type of the specified expression is a number.  
  
 **Syntax**  
  
```  
IS_NUMBER(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_NULL function.  
  
```  
SELECT   
    IS_NUMBER(true) AS isNum1,   
    IS_NUMBER(1) AS isNum2,  
    IS_NUMBER("value") AS isNum3,   
    IS_NUMBER(null) AS isNum4,  
    IS_NUMBER({prop: "value"}) AS isNum5,   
    IS_NUMBER([1, 2, 3]) AS isNum6,  
    IS_NUMBER({prop: "value"}.prop2) AS isNum7  
```  
  
 Here is the result set.  
  
```  
[{"isNum1":false,"isNum2":true,"isNum3":false,"isNum4":false,"isNum5":false,"isNum6":false,"isNum7":false}]  
```  
  
####  <a name="bk_is_object"></a> IS_OBJECT  
 Returns a Boolean value indicating if the type of the specified expression is a JSON object.  
  
 **Syntax**  
  
```  
IS_OBJECT(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_OBJECT function.  
  
```  
SELECT   
    IS_OBJECT(true) AS isObj1,   
    IS_OBJECT(1) AS isObj2,  
    IS_OBJECT("value") AS isObj3,   
    IS_OBJECT(null) AS isObj4,  
    IS_OBJECT({prop: "value"}) AS isObj5,   
    IS_OBJECT([1, 2, 3]) AS isObj6,  
    IS_OBJECT({prop: "value"}.prop2) AS isObj7  
```  
  
 Here is the result set.  
  
```  
[{"isObj1":false,"isObj2":false,"isObj3":false,"isObj4":false,"isObj5":true,"isObj6":false,"isObj7":false}]
```  
  
####  <a name="bk_is_primitive"></a> IS_PRIMITIVE  
 Returns a Boolean value indicating if the type of the specified expression is a primitive (string, Boolean, numeric, or null).  
  
 **Syntax**  
  
```  
IS_PRIMITIVE(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array and undefined types using the IS_PRIMITIVE function.  
  
```  
SELECT   
           IS_PRIMITIVE(true) AS isPrim1,   
           IS_PRIMITIVE(1) AS isPrim2,  
           IS_PRIMITIVE("value") AS isPrim3,   
           IS_PRIMITIVE(null) AS isPrim4,  
           IS_PRIMITIVE({prop: "value"}) AS isPrim5,   
           IS_PRIMITIVE([1, 2, 3]) AS isPrim6,  
           IS_PRIMITIVE({prop: "value"}.prop2) AS isPrim7  
```  
  
 Here is the result set.  
  
```  
[{"isPrim1": true, "isPrim2": true, "isPrim3": true, "isPrim4": true, "isPrim5": false, "isPrim6": false, "isPrim7": false}]  
```  
  
####  <a name="bk_is_string"></a> IS_STRING  
 Returns a Boolean value indicating if the type of the specified expression is a string.  
  
 **Syntax**  
  
```  
IS_STRING(<expression>)  
```  
  
 **Arguments**  
  
- `expression`  
  
   Is any valid expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks objects of JSON Boolean, number, string, null, object, array, and undefined types using the IS_STRING function.  
  
```  
SELECT   
       IS_STRING(true) AS isStr1,   
       IS_STRING(1) AS isStr2,  
       IS_STRING("value") AS isStr3,   
       IS_STRING(null) AS isStr4,  
       IS_STRING({prop: "value"}) AS isStr5,   
       IS_STRING([1, 2, 3]) AS isStr6,  
       IS_STRING({prop: "value"}.prop2) AS isStr7  
```  
  
 Here is the result set.  
  
```  
[{"isStr1":false,"isStr2":false,"isStr3":true,"isStr4":false,"isStr5":false,"isStr6":false,"isStr7":false}] 
```  

## <a id="string-functions"></a>String functions

The following scalar functions perform an operation on a string input value and return a string, numeric, or Boolean value:
  
||||  
|-|-|-|  
|[CONCAT](#bk_concat)|[CONTAINS](#bk_contains)|[ENDSWITH](#bk_endswith)|  
|[INDEX_OF](#bk_index_of)|[LEFT](#bk_left)|[LENGTH](#bk_length)|  
|[LOWER](#bk_lower)|[LTRIM](#bk_ltrim)|[REPLACE](#bk_replace)|  
|[REPLICATE](#bk_replicate)|[REVERSE](#bk_reverse)|[RIGHT](#bk_right)|  
|[RTRIM](#bk_rtrim)|[STARTSWITH](#bk_startswith)|[StringToArray](#bk_stringtoarray)|
|[StringToBoolean](#bk_stringtoboolean)|[StringToNull](#bk_stringtonull)|[StringToNumber](#bk_stringtonumber)|
|[StringToObject](#bk_stringtoobject)|[SUBSTRING](#bk_substring)|[ToString](#bk_tostring)|
|[TRIM](#bk_trim)|[UPPER](#bk_upper)||
  
####  <a name="bk_concat"></a> CONCAT  
 Returns a string that is the result of concatenating two or more string values.  
  
 **Syntax**  
  
```  
CONCAT(<str_expr>, <str_expr> [, <str_expr>])  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the concatenated string of the specified values.  
  
```  
SELECT CONCAT("abc", "def") AS concat  
```  
  
 Here is the result set.  
  
```  
[{"concat": "abcdef"}  
```  
  
####  <a name="bk_contains"></a> CONTAINS  
 Returns a Boolean indicating whether the first string expression contains the second.  
  
 **Syntax**  
  
```  
CONTAINS(<str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks if "abc" contains "ab" and contains "d".  
  
```  
SELECT CONTAINS("abc", "ab") AS c1, CONTAINS("abc", "d") AS c2 
```  
  
 Here is the result set.  
  
```  
[{"c1": true, "c2": false}]  
```  
  
####  <a name="bk_endswith"></a> ENDSWITH  
 Returns a Boolean indicating whether the first string expression ends with the second.  
  
 **Syntax**  
  
```  
ENDSWITH(<str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example returns the "abc" ends with "b" and "bc".  
  
```  
SELECT ENDSWITH("abc", "b") AS e1, ENDSWITH("abc", "bc") AS e2 
```  
  
 Here is the result set.  
  
```  
[{"e1": false, "e2": true}]  
```  
  
####  <a name="bk_index_of"></a> INDEX_OF  
 Returns the starting position of the first occurrence of the second string expression within the first specified string expression, or -1 if the string is not found.  
  
 **Syntax**  
  
```  
INDEX_OF(<str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example returns the index of various substrings inside "abc".  
  
```  
SELECT INDEX_OF("abc", "ab") AS i1, INDEX_OF("abc", "b") AS i2, INDEX_OF("abc", "c") AS i3 
```  
  
 Here is the result set.  
  
```  
[{"i1": 0, "i2": 1, "i3": -1}]  
```  
  
####  <a name="bk_left"></a> LEFT  
 Returns the left part of a string with the specified number of characters.  
  
 **Syntax**  
  
```  
LEFT(<str_expr>, <num_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
- `num_expr`  
  
   Is any valid numeric expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the left part of "abc" for various length values.  
  
```  
SELECT LEFT("abc", 1) AS l1, LEFT("abc", 2) AS l2 
```  
  
 Here is the result set.  
  
```  
[{"l1": "a", "l2": "ab"}]  
```  
  
####  <a name="bk_length"></a> LENGTH  
 Returns the number of characters of the specified string expression.  
  
 **Syntax**  
  
```  
LENGTH(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the length of a string.  
  
```  
SELECT LENGTH("abc") AS len 
```  
  
 Here is the result set.  
  
```  
[{"len": 3}]  
```  
  
####  <a name="bk_lower"></a> LOWER  
 Returns a string expression after converting uppercase character data to lowercase.  
  
 **Syntax**  
  
```  
LOWER(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use LOWER in a query.  
  
```  
SELECT LOWER("Abc") AS lower
```  
  
 Here is the result set.  
  
```  
[{"lower": "abc"}]  
  
```  
  
####  <a name="bk_ltrim"></a> LTRIM  
 Returns a string expression after it removes leading blanks.  
  
 **Syntax**  
  
```  
LTRIM(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use LTRIM inside a query.  
  
```  
SELECT LTRIM("  abc") AS l1, LTRIM("abc") AS l2, LTRIM("abc   ") AS l3 
```  
  
 Here is the result set.  
  
```  
[{"l1": "abc", "l2": "abc", "l3": "abc   "}]  
```  
  
####  <a name="bk_replace"></a> REPLACE  
 Replaces all occurrences of a specified string value with another string value.  
  
 **Syntax**  
  
```  
REPLACE(<str_expr>, <str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use REPLACE in a query.  
  
```  
SELECT REPLACE("This is a Test", "Test", "desk") AS replace 
```  
  
 Here is the result set.  
  
```  
[{"replace": "This is a desk"}]  
```  
  
####  <a name="bk_replicate"></a> REPLICATE  
 Repeats a string value a specified number of times.  
  
 **Syntax**  
  
```  
REPLICATE(<str_expr>, <num_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
- `num_expr`  
  
   Is any valid numeric expression. If num_expr is negative or non-finite, the result is undefined.

  > [!NOTE]
  > The maximum length of the result is 10,000 characters i.e. (length(str_expr)  *  num_expr) <= 10,000.
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use REPLICATE in a query.  
  
```  
SELECT REPLICATE("a", 3) AS replicate  
```  
  
 Here is the result set.  
  
```  
[{"replicate": "aaa"}]  
```  
  
####  <a name="bk_reverse"></a> REVERSE  
 Returns the reverse order of a string value.  
  
 **Syntax**  
  
```  
REVERSE(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use REVERSE in a query.  
  
```  
SELECT REVERSE("Abc") AS reverse  
```  
  
 Here is the result set.  
  
```  
[{"reverse": "cbA"}]  
```  
  
####  <a name="bk_right"></a> RIGHT  
 Returns the right part of a string with the specified number of characters.  
  
 **Syntax**  
  
```  
RIGHT(<str_expr>, <num_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
- `num_expr`  
  
   Is any valid numeric expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the right part of "abc" for various length values.  
  
```  
SELECT RIGHT("abc", 1) AS r1, RIGHT("abc", 2) AS r2 
```  
  
 Here is the result set.  
  
```  
[{"r1": "c", "r2": "bc"}]  
```  
  
####  <a name="bk_rtrim"></a> RTRIM  
 Returns a string expression after it removes trailing blanks.  
  
 **Syntax**  
  
```  
RTRIM(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use RTRIM inside a query.  
  
```  
SELECT RTRIM("  abc") AS r1, RTRIM("abc") AS r2, RTRIM("abc   ") AS r3  
```  
  
 Here is the result set.  
  
```  
[{"r1": "   abc", "r2": "abc", "r3": "abc"}]  
```  
  
####  <a name="bk_startswith"></a> STARTSWITH  
 Returns a Boolean indicating whether the first string expression starts with the second.  
  
 **Syntax**  
  
```  
STARTSWITH(<str_expr>, <str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example checks if the string "abc" begins with "b" and "a".  
  
```  
SELECT STARTSWITH("abc", "b") AS s1, STARTSWITH("abc", "a") AS s2  
```  
  
 Here is the result set.  
  
```  
[{"s1": false, "s2": true}]  
```  

  ####  <a name="bk_stringtoarray"></a> StringToArray  
 Returns expression translated to an Array. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToArray(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a JSON Array expression. Note that nested string values must be written with double quotes to be valid. For details on the JSON format, see [json.org](https://json.org/)
  
  **Return Types**  
  
  Returns an Array expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToArray behaves across different types. 
  
 The following are examples with valid input.

```
SELECT 
    StringToArray('[]') AS a1, 
    StringToArray("[1,2,3]") AS a2,
    StringToArray("[\"str\",2,3]") AS a3,
    StringToArray('[["5","6","7"],["8"],["9"]]') AS a4,
    StringToArray('[1,2,3, "[4,5,6]",[7,8]]') AS a5
```

Here is the result set.

```
[{"a1": [], "a2": [1,2,3], "a3": ["str",2,3], "a4": [["5","6","7"],["8"],["9"]], "a5": [1,2,3,"[4,5,6]",[7,8]]}]
```

The following is an example of invalid input. 
   
 Single quotes within the array are not valid JSON.
Even though they are valid within a query, they will not parse to valid arrays. 
 Strings within the array string must either be escaped "[\\"\\"]" or the surrounding quote must be single '[""]'.

```
SELECT
    StringToArray("['5','6','7']")
```

Here is the result set.

```
[{}]
```

The following are examples of invalid input.
   
 The expression passed will be parsed as a JSON array; the following do not evaluate to type array and thus return undefined.
   
```
SELECT
    StringToArray("["),
    StringToArray("1"),
    StringToArray(NaN),
    StringToArray(false),
    StringToArray(undefined)
```

Here is the result set.

```
[{}]
```

####  <a name="bk_stringtoboolean"></a> StringToBoolean  
 Returns expression translated to a Boolean. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToBoolean(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a Boolean expression.  
  
  **Return Types**  
  
  Returns a Boolean expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToBoolean behaves across different types. 
 
 The following are examples with valid input.

Whitespace is allowed only before or after "true"/"false".

```  
SELECT 
    StringToBoolean("true") AS b1, 
    StringToBoolean("    false") AS b2,
    StringToBoolean("false    ") AS b3
```  
  
 Here is the result set.  
  
```  
[{"b1": true, "b2": false, "b3": false}]
```  

The following are examples with invalid input.

 Booleans are case sensitive and must be written with all lowercase characters i.e. "true" and "false".

```  
SELECT 
    StringToBoolean("TRUE"),
    StringToBoolean("False")
```  

Here is the result set.  
  
```  
[{}]
``` 

The expression passed will be parsed as a Boolean expression; these inputs do not evaluate to type Boolean and thus return undefined.

```  
SELECT 
    StringToBoolean("null"),
    StringToBoolean(undefined),
    StringToBoolean(NaN), 
    StringToBoolean(false), 
    StringToBoolean(true)
```  

Here is the result set.  
  
```  
[{}]
```  

####  <a name="bk_stringtonull"></a> StringToNull  
 Returns expression translated to null. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToNull(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a null expression.
  
  **Return Types**  
  
  Returns a null expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToNull behaves across different types. 

The following are examples with valid input.

 Whitespace is allowed only before or after "null".

```  
SELECT 
    StringToNull("null") AS n1, 
    StringToNull("  null ") AS n2,
    IS_NULL(StringToNull("null   ")) AS n3
```  
  
 Here is the result set.  
  
```  
[{"n1": null, "n2": null, "n3": true}]
```  

The following are examples with invalid input.

Null is case sensitive and must be written with all lowercase characters i.e. "null".

```  
SELECT    
    StringToNull("NULL"),
    StringToNull("Null")
```  
  
 Here is the result set.  
  
```  
[{}]
```  

The expression passed will be parsed as a null expression; these inputs do not evaluate to type null and thus return undefined.

```  
SELECT    
    StringToNull("true"), 
    StringToNull(false), 
    StringToNull(undefined),
    StringToNull(NaN) 
```  
  
 Here is the result set.  
  
```  
[{}]
```  

####  <a name="bk_stringtonumber"></a> StringToNumber  
 Returns expression translated to a Number. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToNumber(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a JSON Number expression. Numbers in JSON must be an integer or a floating point. For details on the JSON format, see [json.org](https://json.org/)  
  
  **Return Types**  
  
  Returns a Number expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToNumber behaves across different types. 

Whitespace is allowed only before or after the Number.

```  
SELECT 
    StringToNumber("1.000000") AS num1, 
    StringToNumber("3.14") AS num2,
    StringToNumber("   60   ") AS num3, 
    StringToNumber("-1.79769e+308") AS num4
```  
  
 Here is the result set.  
  
```  
{{"num1": 1, "num2": 3.14, "num3": 60, "num4": -1.79769e+308}}
```  

In JSON a valid Number must be either be an integer or a floating point number.

```  
SELECT   
    StringToNumber("0xF")
```  
  
 Here is the result set.  
  
```  
{{}}
```  

The expression passed will be parsed as a Number expression; these inputs do not evaluate to type Number and thus return undefined. 

```  
SELECT 
    StringToNumber("99     54"),   
    StringToNumber(undefined),
    StringToNumber("false"),
    StringToNumber(false),
    StringToNumber(" "),
    StringToNumber(NaN)
```  
  
 Here is the result set.  
  
```  
{{}}
```  

####  <a name="bk_stringtoobject"></a> StringToObject  
 Returns expression translated to an Object. If expression cannot be translated, returns undefined.  
  
 **Syntax**  
  
```  
StringToObject(<expr>)  
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression to be evaluated as a JSON object expression. Note that nested string values must be written with double quotes to be valid. For details on the JSON format, see [json.org](https://json.org/)  
  
  **Return Types**  
  
  Returns an object expression or undefined.  
  
  **Examples**  
  
  The following example shows how StringToObject behaves across different types. 
  
 The following are examples with valid input.

``` 
SELECT 
    StringToObject("{}") AS obj1, 
    StringToObject('{"A":[1,2,3]}') AS obj2,
    StringToObject('{"B":[{"b1":[5,6,7]},{"b2":8},{"b3":9}]}') AS obj3, 
    StringToObject("{\"C\":[{\"c1\":[5,6,7]},{\"c2\":8},{\"c3\":9}]}") AS obj4
``` 

Here is the result set.

```
[{"obj1": {}, 
  "obj2": {"A": [1,2,3]}, 
  "obj3": {"B":[{"b1":[5,6,7]},{"b2":8},{"b3":9}]},
  "obj4": {"C":[{"c1":[5,6,7]},{"c2":8},{"c3":9}]}}]
```

 The following are examples with invalid input.
Even though they are valid within a query, they will not parse to valid objects. 
 Strings within the string of object must either be escaped "{\\"a\\":\\"str\\"}" or the surrounding quote must be single 
 '{"a": "str"}'.

Single quotes surrounding property names are not valid JSON.

``` 
SELECT 
    StringToObject("{'a':[1,2,3]}")
```

Here is the result set.

```  
[{}]
```  

Property names without surrounding quotes are not valid JSON.

``` 
SELECT 
    StringToObject("{a:[1,2,3]}")
```

Here is the result set.

```  
[{}]
``` 

The following are examples with invalid input.

 The expression passed will be parsed as a JSON object; these inputs do not evaluate to type object and thus return undefined.

``` 
SELECT 
    StringToObject("}"),
    StringToObject("{"),
    StringToObject("1"),
    StringToObject(NaN), 
    StringToObject(false), 
    StringToObject(undefined)
``` 
 
 Here is the result set.

```
[{}]
```

####  <a name="bk_substring"></a> SUBSTRING  
 Returns part of a string expression starting at the specified character zero-based position and continues to the specified length, or to the end of the string.  
  
 **Syntax**  
  
```  
SUBSTRING(<str_expr>, <num_expr>, <num_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
- `num_expr`  
  
   Is any valid numeric expression to denote the start and end character.    
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example returns the substring of "abc" starting at 1 and for a length of 1 character.  
  
```  
SELECT SUBSTRING("abc", 1, 1) AS substring  
```  
  
 Here is the result set.  
  
```  
[{"substring": "b"}]  
```  
####  <a name="bk_tostring"></a> ToString  
 Returns a string representation of scalar expression. 
  
 **Syntax**  
  
```  
ToString(<expr>)
```  
  
 **Arguments**  
  
- `expr`  
  
   Is any valid scalar expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how ToString behaves across different types.   
  
```  
SELECT 
    ToString(1.0000) AS str1, 
    ToString("Hello World") AS str2, 
    ToString(NaN) AS str3, 
    ToString(Infinity) AS str4,
    ToString(IS_STRING(ToString(undefined))) AS str5, 
    ToString(0.1234) AS str6, 
    ToString(false) AS str7, 
    ToString(undefined) AS str8
```  
  
 Here is the result set.  
  
```  
[{"str1": "1", "str2": "Hello World", "str3": "NaN", "str4": "Infinity", "str5": "false", "str6": "0.1234", "str7": "false"}]  
```  
 Given the following input:
```  
{"Products":[{"ProductID":1,"Weight":4,"WeightUnits":"lb"},{"ProductID":2,"Weight":32,"WeightUnits":"kg"},{"ProductID":3,"Weight":400,"WeightUnits":"g"},{"ProductID":4,"Weight":8999,"WeightUnits":"mg"}]}
```    
 The following example shows how ToString can be used with other string functions like CONCAT.   
 
```  
SELECT 
CONCAT(ToString(p.Weight), p.WeightUnits) 
FROM p in c.Products 
```  

Here is the result set.  
  
```  
[{"$1":"4lb" },
{"$1":"32kg"},
{"$1":"400g" },
{"$1":"8999mg" }]

```  
Given the following input.
```
{"id":"08259","description":"Cereals ready-to-eat, KELLOGG, KELLOGG'S CRISPIX","nutrients":[{"id":"305","description":"Caffeine","units":"mg"},{"id":"306","description":"Cholesterol, HDL","nutritionValue":30,"units":"mg"},{"id":"307","description":"Sodium, NA","nutritionValue":612,"units":"mg"},{"id":"308","description":"Protein, ABP","nutritionValue":60,"units":"mg"},{"id":"309","description":"Zinc, ZN","nutritionValue":null,"units":"mg"}]}
```
The following example shows how ToString can be used with other string functions like REPLACE.   
```
SELECT 
    n.id AS nutrientID,
    REPLACE(ToString(n.nutritionValue), "6", "9") AS nutritionVal
FROM food 
JOIN n IN food.nutrients
```
Here is the result set.  
 ```
[{"nutrientID":"305"},
{"nutrientID":"306","nutritionVal":"30"},
{"nutrientID":"307","nutritionVal":"912"},
{"nutrientID":"308","nutritionVal":"90"},
{"nutrientID":"309","nutritionVal":"null"}]
``` 
 
####  <a name="bk_trim"></a> TRIM  
 Returns a string expression after it removes leading and trailing blanks.  
  
 **Syntax**  
  
```  
TRIM(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use TRIM inside a query.  
  
```  
SELECT TRIM("   abc") AS t1, TRIM("   abc   ") AS t2, TRIM("abc   ") AS t3, TRIM("abc") AS t4
```  
  
 Here is the result set.  
  
```  
[{"t1": "abc", "t2": "abc", "t3": "abc", "t4": "abc"}]  
``` 
####  <a name="bk_upper"></a> UPPER  
 Returns a string expression after converting lowercase character data to uppercase.  
  
 **Syntax**  
  
```  
UPPER(<str_expr>)  
```  
  
 **Arguments**  
  
- `str_expr`  
  
   Is any valid string expression.  
  
  **Return Types**  
  
  Returns a string expression.  
  
  **Examples**  
  
  The following example shows how to use UPPER in a query  
  
```  
SELECT UPPER("Abc") AS upper  
```  
  
 Here is the result set.  
  
```  
[{"upper": "ABC"}]  
```

## <a id="array-functions"></a>Array functions

The following scalar functions perform an operation on an array input value and return numeric, Boolean or array value:
  
||||  
|-|-|-|  
|[ARRAY_CONCAT](#bk_array_concat)|[ARRAY_CONTAINS](#bk_array_contains)|[ARRAY_LENGTH](#bk_array_length)|  
|[ARRAY_SLICE](#bk_array_slice)|||  
  
####  <a name="bk_array_concat"></a> ARRAY_CONCAT  
 Returns an array that is the result of concatenating two or more array values.  
  
 **Syntax**  
  
```  
ARRAY_CONCAT (<arr_expr>, <arr_expr> [, <arr_expr>])  
```  
  
 **Arguments**  
  
- `arr_expr`  
  
   Is any valid array expression.  
  
  **Return Types**  
  
  Returns an array expression.  
  
  **Examples**  
  
  The following example how to concatenate two arrays.  
  
```  
SELECT ARRAY_CONCAT(["apples", "strawberries"], ["bananas"]) AS arrayConcat 
```  
  
 Here is the result set.  
  
```  
[{"arrayConcat": ["apples", "strawberries", "bananas"]}]  
```  
  
####  <a name="bk_array_contains"></a> ARRAY_CONTAINS  
Returns a Boolean indicating whether the array contains the specified value. You can check for a partial or full match of an object by using a boolean expression within the command. 

**Syntax**  
  
```  
ARRAY_CONTAINS (<arr_expr>, <expr> [, bool_expr])  
```  
  
 **Arguments**  
  
- `arr_expr`  
  
   Is any valid array expression.  
  
- `expr`  
  
   Is any valid expression.  

- `bool_expr`  
  
   Is any boolean expression. If it's set to 'true'and if the specified search value is an object, the command checks for a partial match (the search object is a subset of one of the objects). If it's set to 'false', the command checks for a full match of all objects within the array. The default value if not specified is false. 
  
  **Return Types**  
  
  Returns a Boolean value.  
  
  **Examples**  
  
  The following example how to check for membership in an array using ARRAY_CONTAINS.  
  
```  
SELECT   
           ARRAY_CONTAINS(["apples", "strawberries", "bananas"], "apples") AS b1,  
           ARRAY_CONTAINS(["apples", "strawberries", "bananas"], "mangoes") AS b2  
```  
  
 Here is the result set.  
  
```  
[{"b1": true, "b2": false}]  
```  

The following example how to check for a partial match of a JSON in an array using ARRAY_CONTAINS.  
  
```  
SELECT  
    ARRAY_CONTAINS([{"name": "apples", "fresh": true}, {"name": "strawberries", "fresh": true}], {"name": "apples"}, true) AS b1, 
    ARRAY_CONTAINS([{"name": "apples", "fresh": true}, {"name": "strawberries", "fresh": true}], {"name": "apples"}) AS b2,
    ARRAY_CONTAINS([{"name": "apples", "fresh": true}, {"name": "strawberries", "fresh": true}], {"name": "mangoes"}, true) AS b3 
```  
  
 Here is the result set.  
  
```  
[{
  "b1": true,
  "b2": false,
  "b3": false
}] 
```  
  
####  <a name="bk_array_length"></a> ARRAY_LENGTH  
 Returns the number of elements of the specified array expression.  
  
 **Syntax**  
  
```  
ARRAY_LENGTH(<arr_expr>)  
```  
  
 **Arguments**  
  
- `arr_expr`  
  
   Is any valid array expression.  
  
  **Return Types**  
  
  Returns a numeric expression.  
  
  **Examples**  
  
  The following example how to get the length of an array using ARRAY_LENGTH.  
  
```  
SELECT ARRAY_LENGTH(["apples", "strawberries", "bananas"]) AS len  
```  
  
 Here is the result set.  
  
```  
[{"len": 3}]  
```  
  
####  <a name="bk_array_slice"></a> ARRAY_SLICE  
 Returns part of an array expression.
  
 **Syntax**  
  
```  
ARRAY_SLICE (<arr_expr>, <num_expr> [, <num_expr>])  
```  
  
 **Arguments**  
  
- `arr_expr`  
  
   Is any valid array expression.  
  
- `num_expr`  
  
   Zero-based numeric index at which to begin the array. Negative values may be used to specify the starting index relative to the last element of the array i.e. -1 references the last element in the array.  

- `num_expr`  

   Maximum number of elements in the resulting array.    

  **Return Types**  
  
  Returns an array expression.  
  
  **Examples**  
  
  The following example shows how to get different slices of an array using ARRAY_SLICE.  
  
```  
SELECT
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1) AS s1,  
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, 1) AS s2,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], -2, 1) AS s3,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], -2, 2) AS s4,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, 0) AS s5,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, 1000) AS s6,
           ARRAY_SLICE(["apples", "strawberries", "bananas"], 1, -100) AS s7      
  
```  
  
 Here is the result set.  
  
```  
[{  
           "s1": ["strawberries", "bananas"],   
           "s2": ["strawberries"],
           "s3": ["strawberries"],  
           "s4": ["strawberries", "bananas"], 
           "s5": [],
           "s6": ["strawberries", "bananas"],
           "s7": [] 
}]  
```  
## <a id="date-time-functions"></a>Date and Time Function

The following scalar functions allow you to get the current UTC date and time in two forms; a numeric timestamp whose value is the Unix epoch in milliseconds or as a string which conforms to the ISO 8601 format. 

|||
|-|-|
|[GETCURRENTDATETIME](#bk_get_current_date_time)|[GETCURRENTTIMESTAMP](#bk_get_current_timestamp)||

####  <a name="bk_get_current_date_time"></a> GETCURRENTDATETIME
 Returns the current UTC date and time as an ISO 8601 string.
  
 **Syntax**
  
```
GETCURRENTDATETIME ()
```
  
  **Return Types**
  
  Returns the current UTC date and time ISO 8601 string value. 

  This is expressed in the format YYYY-MM-DDThh:mm:ss.sssZ where:
  
  |||
  |-|-|
  |YYYY|four-digit year|
  |MM|two-digit month (01 = January, etc.)|
  |DD|two-digit day of month (01 through 31)|
  |T|signifier for beginning of time elements|
  |hh|two digit hour (00 through 23)|
  |mm|two digit minutes (00 through 59)|
  |ss|two digit seconds (00 through 59)|
  |.sss|three digits of decimal fractions of a second|
  |Z|UTC (Coordinated Universal Time) designator||
  
  For more details on the ISO 8601 format, see [ISO_8601](https://en.wikipedia.org/wiki/ISO_8601)

  **Remarks**

  GETCURRENTDATETIME is a nondeterministic function. 
  
  The result returned is UTC (Coordinated Universal Time).

  **Examples**  
  
  The following example shows how to get the current UTC Date Time using the GetCurrentDateTime built-in function.
  
```  
SELECT GETCURRENTDATETIME() AS currentUtcDateTime
```  
  
 Here is an example result set.
  
```  
[{
  "currentUtcDateTime": "2019-05-03T20:36:17.784Z"
}]  
```  

####  <a name="bk_get_current_timestamp"></a> GETCURRENTTIMESTAMP
 Returns the number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970. 
  
 **Syntax**  
  
```  
GETCURRENTTIMESTAMP ()  
```  
  
  **Return Types**  
  
  Returns a numeric value, the current number of milliseconds that have elapsed since the Unix epoch i.e. the number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970.

  **Remarks**

  GETCURRENTTIMESTAMP is a nondeterministic function.
  
  The result returned is UTC (Coordinated Universal Time).

  **Examples**  
  
  The following example shows how to get the current timestamp using the GetCurrentTimestamp built-in function.
  
```  
SELECT GETCURRENTTIMESTAMP() AS currentUtcTimestamp
```  
  
 Here is an example result set.
  
```  
[{
  "currentUtcTimestamp": 1556916469065
}]  
```

## <a id="spatial-functions"></a>Spatial functions

Cosmos DB supports the following Open Geospatial Consortium (OGC) built-in functions for geospatial querying. The following scalar functions perform an operation on a spatial object input value and return a numeric or Boolean value.  
  
|||||
|-|-|-|-|
|[ST_DISTANCE](#bk_st_distance)|[ST_WITHIN](#bk_st_within)|[ST_INTERSECTS](#bk_st_intersects)|[ST_ISVALID](#bk_st_isvalid)|
|[ST_ISVALIDDETAILED](#bk_st_isvaliddetailed)||||
  
####  <a name="bk_st_distance"></a> ST_DISTANCE  
 Returns the distance between the two GeoJSON Point, Polygon, or LineString expressions.  
  
 **Syntax**  
  
```  
ST_DISTANCE (<spatial_expr>, <spatial_expr>)  
```  
  
 **Arguments**  
  
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
  
  **Return Types**  
  
  Returns a numeric expression containing the distance. This is expressed in meters for the default reference system.  
  
  **Examples**  
  
  The following example shows how to return all family documents that are within 30 km of the specified location using the ST_DISTANCE built-in function. .  
  
```  
SELECT f.id   
FROM Families f   
WHERE ST_DISTANCE(f.location, {'type': 'Point', 'coordinates':[31.9, -4.8]}) < 30000  
```  
  
 Here is the result set.  
  
```  
[{  
  "id": "WakefieldFamily"  
}]  
```  
  
####  <a name="bk_st_within"></a> ST_WITHIN  
 Returns a Boolean expression indicating whether the GeoJSON object (Point, Polygon, or LineString) specified in the first argument is within the GeoJSON (Point, Polygon, or LineString) in the second argument.  
  
 **Syntax**  
  
```  
ST_WITHIN (<spatial_expr>, <spatial_expr>)  
```  
  
 **Arguments**  
  
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
 
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
  
  **Return Types**  
  
  Returns a Boolean value.  
  
  **Examples**  
  
  The following example shows how to find all family documents within a polygon using ST_WITHIN.  
  
```  
SELECT f.id   
FROM Families f   
WHERE ST_WITHIN(f.location, {  
    'type':'Polygon',   
    'coordinates': [[[31.8, -5], [32, -5], [32, -4.7], [31.8, -4.7], [31.8, -5]]]  
})  
```  
  
 Here is the result set.  
  
```  
[{ "id": "WakefieldFamily" }]  
```  

####  <a name="bk_st_intersects"></a> ST_INTERSECTS  
 Returns a Boolean expression indicating whether the GeoJSON object (Point, Polygon, or LineString) specified in the first argument intersects the GeoJSON (Point, Polygon, or LineString) in the second argument.  
  
 **Syntax**  
  
```  
ST_INTERSECTS (<spatial_expr>, <spatial_expr>)  
```  
  
 **Arguments**  
  
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
 
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString object expression.  
  
  **Return Types**  
  
  Returns a Boolean value.  
  
  **Examples**  
  
  The following example shows how to find all areas that intersect with the given polygon.  
  
```  
SELECT a.id
FROM Areas a
WHERE ST_INTERSECTS(a.location, {  
    'type':'Polygon',
    'coordinates': [[[31.8, -5], [32, -5], [32, -4.7], [31.8, -4.7], [31.8, -5]]]  
})  
```  
  
 Here is the result set.  
  
```  
[{ "id": "IntersectingPolygon" }]  
```  
  
####  <a name="bk_st_isvalid"></a> ST_ISVALID  
 Returns a Boolean value indicating whether the specified GeoJSON Point, Polygon, or LineString expression is valid.  
  
 **Syntax**  
  
```  
ST_ISVALID(<spatial_expr>)  
```  
  
 **Arguments**
  
- `spatial_expr`  
  
   Is any valid GeoJSON Point, Polygon, or LineString expression.  
  
  **Return Types**  
  
  Returns a Boolean expression.  
  
  **Examples**  
  
  The following example shows how to check if a point is valid using ST_VALID.  
  
  For example, this point has a latitude value that's not in the valid range of values [-90, 90], so the query returns false.  
  
  For polygons, the GeoJSON specification requires that the last coordinate pair provided should be the same as the first, to create a closed shape. Points within a polygon must be specified in counter-clockwise order. A polygon specified in clockwise order represents the inverse of the region within it.  
  
```  
SELECT ST_ISVALID({ "type": "Point", "coordinates": [31.9, -132.8] }) AS b 
```  
  
 Here is the result set.  
  
```  
[{ "b": false }]  
```  
  
####  <a name="bk_st_isvaliddetailed"></a> ST_ISVALIDDETAILED  
 Returns a JSON value containing a Boolean value if the specified GeoJSON Point, Polygon, or LineString expression is valid, and if invalid, additionally the reason as a string value.  
  
 **Syntax**  
  
```  
ST_ISVALIDDETAILED(<spatial_expr>)  
```  
  
 **Arguments**  
  
- `spatial_expr`  
  
   Is any valid GeoJSON point or polygon expression.  
  
  **Return Types**  
  
  Returns a JSON value containing a Boolean value if the specified GeoJSON point or polygon expression is valid, and if invalid, additionally the reason as a string value.  
  
  **Examples**  
  
  The following example how to check validity (with details) using ST_ISVALIDDETAILED.  
  
```  
SELECT ST_ISVALIDDETAILED({   
  "type": "Polygon",   
  "coordinates": [[ [ 31.8, -5 ], [ 31.8, -4.7 ], [ 32, -4.7 ], [ 32, -5 ] ]]  
}) AS b 
```  
  
 Here is the result set.  
  
```  
[{  
  "b": {
    "valid": false,
    "reason": "The Polygon input is not valid because the start and end points of the ring number 1 are not the same. Each ring of a polygon must have the same start and end points."   
  }  
}]  
```  

## Next steps

- [Introduction to Azure Cosmos DB](introduction.md)
- [UDFs](sql-query-udfs.md)
- [Aggregates](sql-query-aggregates.md)