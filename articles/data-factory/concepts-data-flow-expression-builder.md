---
title: Expression builder in mapping data flow
description: Build expressions using the expression builder in mapping data flows in Azure Data Factory
author: kromerm
ms.author: makromer
ms.reviewer: daperlov
ms.service: data-factory
ms.topic: conceptual
ms.date: 12/9/2019
---

# Building expressions in mapping data flow

In mapping data flow, many transformation properties are entered as expressions. These expressions are composed of column values, parameters, functions, operators, and literals that evaluate to a spark data type at run time.

## Opening the expression builder

The expression editing interface in the data factory UX is know as the **Expression Builder**. As you enter in your expression logic, data factory uses [IntelliSense](https://docs.microsoft.com/visualstudio/ide/using-intellisense?view=vs-2019) code completion for highlighting, syntax checking, and autocompleting.

![Expression Builder](media/data-flow/xpb1.png "Expression Builder")

In transformations such as the derived column and filter, where expressions are mandatory, open the expression builder by clicking the blue expression box.

![Expression Builder](media/data-flow/expressionbox.png "Expression Builder")

When referencing columns in a matching or group by condition, an expression can extract values from columns. To create an expression, select the 'computed column' option.

![Expression Builder](media/data-flow/computedcolumn.png "Expression Builder")

In cases where an expression or a literal value are valid inputs, 'add dynamic content' will allow you to build an expression that evaluates to a literal.

![Expression Builder](media/data-flow/add-dynamic-content.png "Expression Builder")

## Expression language reference

Mapping data flows has built in functions and operators that can be used in expressions. A list of available functions is found in the [mapping data flow expression language](data-flow-expression-functions.md) reference page.

## Column names with special characters

When you have column names that include special characters or spaces, surround the name with curly braces to reference them in an expression.

```{[dbo].this_is my complex name$$$}```

## Previewing expression results

If [debug-mode](concepts-data-flow-debug-mode.md) is switched on, you can use the live spark cluster to see an in-progress preview of what your expression evaluates to. As you're building your logic, you can debug your expression in real time. 

![Expression Builder](media/data-flow/exp4b.png "Expression Data Preview")

Click the Refresh button to update the results of your expression against a live sample of your source.

![Expression Builder](media/data-flow/exp5.png "Expression Data Preview")

## String interpolation

Use double-quotes to enclose literal string text together with expressions. You can include expression functions, columns, and parameters. String interpolation is useful to avoid extensive use of string concatenation when including parameters in query strings. To use expression syntax, enclose it in curly braces,

Some examples of string interpolation:

* ```"My favorite movie is {iif(instr(title,', The')>0,"The {split(title,', The')[1]}",title)}"```

* ```"select * from {$tablename} where orderyear > {$year}"```

* ```"Total cost with sales tax is {round(totalcost * 1.08,2)}"```

## Commenting expressions

Add comments to your expressions using single line and multi-line comment syntax:

![Comments](media/data-flow/comments.png "Comments")

Below are examples of valid comments:

* ```/* This is my comment */```

* ```/* This is a```
*   ```multi-line comment */```
   
* ```// This is a single line comment```

If you put a comment at the top of your expression, it will appear in the transformation text box to document your transformation expressions:

![Comments](media/data-flow/comments2.png "Comments")

## Regular expressions

Many expression language functions use regular expression syntax. When using regular expression functions, the Expression Builder will try to interpret backslash (\\) as an escape character sequence. When using backslashes in your regular expression, either enclose the entire regex in ticks (\`) or use a double backslash.

Example using ticks

```
regex_replace('100 and 200', `(\d+)`, 'digits')
```

or using double slash

```
regex_replace('100 and 200', '(\\d+)', 'digits')
```

## Addressing array indexes

With expression functions that return arrays, use square brackets [] to address specific indexes inside that return array object. The array is ones-based.

![Expression Builder array](media/data-flow/expb2.png "Expression Data Preview")

## Keyboard shortcuts

* ```Ctrl-K Ctrl-C```: Comments entire line
* ```Ctrl-K Ctrl-U```: Uncomment
* ```F1```: Provide editor help commands
* ```Alt-Down Arrow```: Move down current line
* ```Alt-Up Arrow```: Move up current line
* ```Cntrl-Space```: Show context help

## Convert to dates or timestamps

To include string literals in your timestamp output, you need to wrap your conversion in ```toString()```.

```toString(toTimestamp('12/31/2016T00:12:00', 'MM/dd/yyyy\'T\'HH:mm:ss'), 'MM/dd /yyyy\'T\'HH:mm:ss')```

To convert milliseconds from Epoch to a date or timestamp, use `toTimestamp(<number of milliseconds>)`. If time is coming in seconds, multiply by 1000.

```toTimestamp(1574127407*1000l)```

The trailing "l" at the end of the expression above signifies conversion to a long type as in-line syntax.

## Next steps

[Begin building data transformation expressions](data-flow-expression-functions.md)
