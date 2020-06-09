---
title:  "Apply Math Operation"
titleSuffix: Azure Machine Learning
description: Learn how to use the Apply Math Operation module in Azure Machine Learning to apply a mathematical operation to column values in a pipeline.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 09/09/2019
---

# Apply Math Operation

This article describes a module of Azure Machine Learning designer (preview).

Use the Apply Math Operation to create calculations that are applied to numeric columns in the input dataset. 

Supported math operations include common arithmetic functions such as multiplication and division, trigonometric functions, a variety of rounding functions, and special functions used in data science such as gamma and error functions.  

After you define an operation and run the pipeline, the values are added to your dataset. Depending on how you configure the module, you can:

+ Append the results to your dataset. This is particularly useful when you are verifying the result of the operation.
+ Replace columns values with the new, computed values.
+ Generate a new column for results, and not show the original data. 

Look for the operation you need in these categories:  

- [Basic](#basic-math-operations)  
  
     The functions in the **Basic** category can be used to manipulate a single value or column of values. For example, you might get the absolute value of all numbers in a column, or calculate the square root of each value in a column.  
  
-   [Compare](#comparison-operations)  
  
      The functions in the **Compare** category are all used for comparison: you can do a pair-wise comparison of the values in two columns, or you can compare each value in a column to a specified constant. For example, you could compare columns to determine whether values were the same in two datasets. Or, you might use a constant, such as a maximum allowed value, to find outliers in a numeric column.  
  
-   [Operations](#arithmetic-operations)  
  
     The **Operations** category includes the basic mathematical functions: addition, subtraction, multiplication, and division. You can work with either columns or constants. For example, you might add the value in Column A to the value in Column B. Or, you might subtract a constant, such as a previously calculated mean, from each value in Column A.  
  
-   [Rounding](#rounding-operations)  
  
     The **Rounding** category includes a variety of functions for performing operations such as rounding, ceiling, floor, and truncation to various levels of precision. You can specify the level of precision for both decimal and whole numbers.  
  
-   [Special](#special-math-functions)  
  
     The **Special** category includes mathematical functions that are especially used in data science, such as elliptic integrals and the Gaussian error function.  
  
-   [Trigonometric](#trigonometric-functions)  
  
     The **Trigonometric** category includes all standard trigonometric functions. For example, you can convert radians to degrees, or compute functions such as tangent in either radians or degrees.
     These functions are unary, meaning that they take a single column of values as input, apply the trigonometric function, and return a column of values as the result.  Therefore you need to make sure that the input column is the appropriate type and contains the right kind of values for the specified operation.   

## How to configure Apply Math Operation  

The **Apply Math Operation** module requires a dataset that contains at least one column containing only numbers. The numbers can be discrete or continuous but must be of a numeric data type, not a string.

You can apply the same operation to multiple numeric columns, but all columns must be in the same dataset. 

Each instance of this module can perform only one type of operation at a time. To perform complex math operations, you might need to chain together several instances of the **Apply Math Operation** module.  
  
1.  Add the **Apply Math Operation** module to your pipeline.

1. Connect a dataset that contains at least one numeric column.  

1.  Select one or more source columns on which to perform the calculation.   
  
    - Any column that you choose must be a numeric data type. 
    - The range of data must be valid for the selected mathematical operation. Otherwise an error or NaN (not a number) result may occur. For example, Ln(-1.0) is an invalid operation and results in a value of `NaN`.
  
1.  Click **Category** to select the **type** of math operation to perform.
    
1. Choose a specific operation from the list in that category.
  
1.  Set additional parameters required by each type of operation.  
  
1.  Use the **Output mode** option to indicate how you want the math operation to be generated: 

    - **Append**. All the columns used as inputs are included in the output dataset, plus one additional column is appended that contains the results of the math operation.
    - **Inplace**. The values in the columns used as inputs are replaced with the new calculated values. 
    - **ResultOnly**. A single column is returned containing the results of the math operation.
  
1.  Submit the pipeline.  
  
## Results

If you generate the results using the **Append** or **ResultOnly** options, the column headings of the returned dataset indicate the operation and the columns that were used. For example, if you compare two columns using the **Equals** operator, the results would look like this:  
  
-   **Equals(Col2_Col1)**,  indicating that you tested Col2 against Col1.  
-   **Equals(Col2_$10)**, indicating that you compared column 2 to the constant 10.  

Even if you use the **Inplace** option, the source data is not deleted or changed; the column in the original dataset is still available in the designer. To view the original data, you can connect the [Add Columns](add-columns.md) module and join it to the output of **Apply Math Operation**.  
    
## Basic math operations 

The functions in the **Basic** category usually take a single value from a column, perform the predefined operation, and return a single value. For some functions, you can specify a constant or a column set as a second argument.  
  
 Azure Machine Learning supports the following functions in the **Basic** category:  

### Abs

Returns the absolute value of the selected columns.  
  
### Atan2

Returns a four-quadrant inverse tangent.  

Select the columns that contain the point coordinates. For the second argument, which corresponds to the x-coordinate, you can also specify a constant.  

Corresponds to the ATAN2 function in Matlab.  

### Conj

Returns the conjugate for the values in the selected column.  

### CubeRoot

Calculates the cube root for the values in the selected column.  

### DoubleFactorial  
 Calculates the double factorial for values in the selected column. The double factorial is an extension of the normal factorial function, and it is denoted as x!!.  

### Eps

Returns the size of the gap between the current value and the next-highest, double-precision number. Corresponds to the EPS function in Matlab.  
  
### Exp

Returns e raised to the power of the value in the selected column. This is the same as the Excel EXP function.  

### Exp2

Returns the base-2 exponential of the arguments, solving for y = x * 2<sup>t</sup> where t is a column of values containing exponents.  

In  **Column set**, select the column that contains the exponent values t.

For **Exp2** you can specify a second argument x, which can be either a constant or another column of values. In **Second argument type**, indicate whether you will provide the multiplier x as a constant, or a value in a column.  

For example, if you select a column with the values {0,1,2,3,4,5} for both the multiplier and the exponent, the function returns {0, 2, 8, 24, 64 160).  

### ExpMinus1 

Returns the negative exponent for values in the selected column.  

### Factorial
Returns the factorial for values in the selected column.  

### Hypotenuse
Calculates the hypotenuse for a triangle in which the length of one side is specified as a column of values, and the length of the second side is specified either as a constant or as two columns.  

### Ln

Returns the natural logarithm for the values in the selected column.  

### LnPlus1

Returns the natural logarithm plus one for the values in the selected column.  

### Log

Returns the log of the values in the selected column, given the specified base.  

You can specify the base (the second argument) either as a constant or by selecting another column of values.  

### Log10

Returns the base 10 logarithm values for the selected column.  

### Log2

Returns the base 2 logarithm values for the selected column.  

### NthRoot
Returns the nth root of the value, using an n that you specify.  

Select the columns for which you want to calculate the root, by using the **ColumnSet** option.  

In **Second argument type**, select another column that contains the root, or specify a constant to use as the root.  

If the second argument is a column, each value in the column is used as the value of n for the corresponding row. If the second argument is a constant, type the value for n in the **Second argument** text box.
### Pow

Calculates X raised to the power of Y for each of the values in the selected column.  

First, select the columns that contain the **base**, which should be a float, by using the **ColumnSet** option.  

In **Second argument type**, select the column that contains the exponent, or specify a constant to use as the exponent.  

If the second argument is a column, each value in the column is used as the exponent for the corresponding row. If the second argument is a constant, type the value for the exponent in the **Second argument** text box.  

### Sqrt

Returns the square root of the values in the selected column.  

### SqrtPi

For each value in the selected column, multiplies the value by pi and then returns the square root of the result.  

### Square

Squares the values in the selected column.  

## Comparison operations  

Use the comparison functions in Azure Machine Learning designer anytime that you need to test two sets of values against each other. For example, in a pipeline you might need to do these comparison operations:  

- Evaluate a column of probability scores model against a threshold value.
- Determine if two sets of results are the same. For each row that is different, add a FALSE flag that can be used for further processing or filtering.  

### EqualTo

Returns True if the values are the same.  

### GreaterThan

Returns True if the values in **Column set** are greater than the specified constant, or greater than the corresponding values in the comparison column.  

### GreaterThanOrEqualTo

Returns True if the values in **Column set** are greater than or equal to the specified constant, or greater than or equal to the corresponding values in the comparison column.  

### LessThan

Returns True if the values in **Column set** are less than the specified constant, or less than the corresponding values in the comparison column.  
  
### LessThanOrEqualTo

Returns True if the values in **Column set** are less than or equal to the specified constant, or less than or equal to the corresponding values in the comparison column.  

### NotEqualTo

Returns True if the values in **Column set** are not equal to the constant or comparison column, and returns False if they are equal.  

### PairMax

Returns the value that is greater—the value in **Column set** or the value in the constant or comparison column.  

### PairMin

Returns the value that is lesser—the value in **Column set** or the value in the constant or comparison column  
  
##  Arithmetic operations   

Includes the basic arithmetic operations: addition and subtraction, division, and multiplication.  Because most operations are binary, requiring two numbers, you first choose the operation, and then choose the column or numbers to use in the first and second arguments.

The order in which you choose the columns for division and subtraction might seem counterintuitive; however, to make it easier to understand the results, the column heading provides the operation name, and the order in which the columns were used.

Operation|Num1|Num2|Result column|Result value|
----|----|----|----|----
|Addition|1|5|Add(Num2_Num1)| 4|
|Multiplication|1|5|Multiple(Num2_Num1)|5|
|Subtraction|1|5|Subtract(Num2_Num1)|4|
|Subtraction|0|1|Subtract(Num2_Num1)|0|
|Division|1|5|Divide(Num2_Num1)|5|
|Division|0|1|Divide(Num2_Num1)|Infinity|

### Add

Specify the source columns by using **Column set**, and then add to those values a number specified in **Second argument**.  

To add the values in two columns, choose a column or columns using **Column set**, and then choose a second column using **Second argument**.  

### Divide

Divides the values in **Column set** by a constant or by the column values defined in **Second argument**.  In other words, you pick the divisor first, and then the dividend. The output value is the quotient.

### Multiply

Multiplies the values in **Column set** by the specified constant or column values.  

### Subtract

Specify the column of values to operate on (the *minuend*), by choosing a different column, using the **Column set** option. Then, specify the number to subtract (the *subtrahend*) by using the **Second argument** dropdown list. You can choose either a constant or column of values.

##  Rounding operations 

Azure Machine Learning designer supports a variety of rounding operations. For many operations, you must specify the amount of  precision to use when rounding. You can use either a static precision level, specified as a constant, or you can apply a dynamic precision value obtained from a column of values.  

- If you use a constant, set **Precision Type** to **Constant** and then type the number of digits as an integer in the **Constant Precision** text box. If you type a non-integer, the module does not raise an error, but results can be unexpected.  

- To use a different precision value for each row in your dataset, set **Precision Type** to **ColumnSet**, and then choose the column that contains appropriate precision values.  

### Ceiling

Returns the ceiling for the values in **Column set**.  

### CeilingPower2

Returns the squared ceiling for the values in **Column set**.  

### Floor

Returns the floor for the values in **Column set**, to the specified precision.  

### Mod

Returns the fractional part of the values in **Column set**, to the specified precision.  

### Quotient

Returns the fractional part of the values in **Column set**, to the specified precision.  

### Remainder

Returns the remainder for the values in **Column set**.  

### RoundDigits

Returns the values in **Column set**, rounded by the 4/5 rule to the specified number of digits.  

### RoundDown

Returns the values in **Column set**, rounded down to the specified number of digits.  

### RoundUp

Returns the values in **Column set**, rounded up to the specified number of digits.  

### ToEven

Returns the values in **Column set**, rounded to the nearest whole, even number.  

### ToOdd

Returns the values in **Column set**, rounded to the nearest whole, odd number.  

### Truncate

Truncates the values in **Column set** by removing all digits not allowed by the specified precision.  
  
## Special math functions

This category includes specialized mathematical functions often used in data science. Unless otherwise noted, the function is unary and returns the specified calculation for each value in the selected column or columns.  

### Beta

Returns the value of Euler’s beta function.  

### EllipticIntegralE
Returns the value of the incomplete elliptic integral.  
  

### EllipticIntegralK

Returns the value of the complete elliptic integral (K).  

### Erf

Returns the value of the error function.  

The error function (also called the Gauss error function) is a special function of the sigmoid shape that is used in probability to describe diffusion.  

### Erfc

Returns the value of the complementary error function.  

Erfc is defined as 1 – erf(x).  

### ErfScaled

Returns the value of the scaled error function.  

The scaled version of the error function can be used to avoid arithmetic underflow.  

### ErfInverse

Returns the value of the inverse erf function.  

### ExponentialIntegralEin

Returns the value of the exponential integral Ei.  

### Gamma

Returns the value of the gamma function.  

### GammaLn

Returns the natural logarithm of the gamma function.  

### GammaRegularizedP

Returns the value of the regularized incomplete gamma function.  

This function takes a second argument, which can be provided either as a constant or a column of values.  

### GammaRegularizedPInverse

Returns the value of the inverse regularized incomplete gamma function.  

This function takes a second argument, which can be provided either as a constant or a column of values.  

### GammaRegularizedQ  

Returns the value of the regularized incomplete gamma function.  

This function takes a second argument, which can be provided either as a constant or a column of values.  

### GammaRegularizedQInverse

Returns the value of the inverse generalized regularized incomplete gamma function.

This function takes a second argument, which can be provided either as a constant or a column of values.  

### PolyGamma

Returns the value of the polygamma function.  

This function takes a second argument, which can be provided either as a constant or a column of values.

##  Trigonometric functions 

This category iIncludes most of the important trigonometric and inverse trigonometric functions. All trigonometric functions are unary and require no additional arguments.  

### Acos

Calculates the arccosine for the column values.  

### AcosDegree

Calculates the arccosine of the column values, in degrees.  

### Acosh

Calculates the hyperbolic arccosine of the column values.  

### Acot

Calculates the arccotangent of the column values.  

### AcotDegrees

Calculates the arccotangent of the column values, in degrees.  

### Acoth

Calculates the hyperbolic arccotangent of the column values.  

### Acsc

Calculates the arccosecant of the column values.  

### AcscDegrees

Calculates the arccosecant of the column values, in degrees.  
### Asec

Calculates the arcsecant of the column values.  

### AsecDegrees

Calculates the arcsecant of the column values, in degrees.  

### Asech

Calculates the hyperbolic arcsecant of the column values.  

### Asin

Calculates the arcsine of the column values.  

### AsinDegrees

Calculates the arcsine of the column values, in degrees.  

### Asinh

Calculates the hyperbolic arcsine for the column values.  

### Atan

Calculates the arctangent of the column values.  

### AtanDegrees

Calculates the arctangent of the column values, in degrees.  

### Atanh

Calculates the hyperbolic arctangent of the column values.  

### Cos

Calculates the cosine of the column values.  

### CosDegrees

Calculates the cosine for the column values, in degrees.  

### Cosh

Calculates the hyperbolic cosine for the column values.  

### Cot

Calculates the cotangent for the column values.  

### CotDegrees

Calculates the cotangent for the column values, in degrees.  

### Coth
Calculates the hyperbolic cotangent for the column values.  

### Csc

Calculates the cosecant for the column values.  

### CscDegrees

Calculates the cosecant for the column values, in degrees.  

### Csch

Calculates the hyperbolic cosecant for the column values.  

### DegreesToRadians

Converts degrees to radians.  

### Sec

Calculates the secant of the column values.  

### aSecDegrees

Calculates the secant for the column values, in degrees.  

### aSech

Calculates the hyperbolic secant of the column values.  

### Sign

Returns the sign of the column values.  

### Sin

Calculates the sine of the column values.  

### Sinc

Calculates the sine-cosine value of the column values.  

### SinDegrees

Calculates the sine for the column values, in degrees.  

### Sinh

Calculates the hyperbolic sine of the column values.  

### Tan

Calculates the tangent of the column values.  

### TanDegrees

Calculates the tangent for the argument, in degrees.  

### Tanh

Calculates the hyperbolic tangent of the column values.  
  
## Technical notes

Be careful when you select more than one column as the second operator. The results are easy to understand if the operation is simple, such as adding a constant to all columns. 

Assume your dataset has multiple columns, and you add the dataset to itself. In the results, each column is added to itself, as follows:  
  
|Num1|Num2|Num3|Add(Num1_Num1)|Add(Num2_Num2)|Add(Num3_Num3)|
|----|----|----|----|----|----|
|1|5|2|2|10|4|
|2|3|-1|4|6|-2|
|0|1|-1|0|2|-2|

If you need to perform more complex calculations, you can chain multiple instances of **Apply Math Operation**. For example, you might add two columns by using one instance of **Apply Math Operation**, and then use another instance of **Apply Math Operation** to divide the sum by a constant to obtain the mean.  
  
Alternatively, use one of the following modules to do all the calculations at once, using SQL, R, or Python script:
 
+ [Execute R Script](execute-r-script.md)
+ [Execute Python Script](execute-python-script.md)
+ [Apply SQL Transformation](apply-sql-transformation.md)   
  
## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
