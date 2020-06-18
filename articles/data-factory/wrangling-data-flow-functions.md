---
title: Wrangling data flow transformation functions in Azure Data Factory 
description: An overview of available wrangling data flow functions in Azure Data Factory
author: djpmsft
ms.author: daperlov
ms.reviewer: gamal
ms.service: data-factory
ms.topic: conceptual
ms.date: 11/01/2019
---

# Transformation functions in wrangling data flow

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Wrangling data flow in Azure Data Factory allows you to do code-free agile data preparation and wrangling at cloud scale. Wrangling data flow integrates with [Power Query Online](https://docs.microsoft.com/powerquery-m/power-query-m-reference) and makes Power Query M functions available for data wrangling via spark execution. 

Currently not all Power Query M functions are supported for data wrangling despite being available during authoring. While building your wrangling data flows, you'll be prompted with the following error message if a function isn't supported:

`The wrangling data flow is invalid. Expression.Error: The transformation logic isn't supported. Please try a simpler expression`

Below is a list of supported Power Query M functions.

## Column Management

* Selection: [Table.SelectColumns](https://docs.microsoft.com/powerquery-m/table-selectcolumns)
* Removal: [Table.RemoveColumns](https://docs.microsoft.com/powerquery-m/table-removecolumns)
* Renaming: [Table.RenameColumns](https://docs.microsoft.com/powerquery-m/table-renamecolumns), [Table.PrefixColumns](https://docs.microsoft.com/powerquery-m/table-prefixcolumns), [Table.TransformColumnNames](https://docs.microsoft.com/powerquery-m/table-transformcolumnnames)
* Reordering: [Table.ReorderColumns](https://docs.microsoft.com/powerquery-m/table-reordercolumns)

## Row Filtering

Use  M function [Table.SelectRows](https://docs.microsoft.com/powerquery-m/table-selectrows) to filter on the following conditions:

* Equality and inequality
* Numeric, text, and date comparisons (but not DateTime)
* Numeric information such as [Number.IsEven](https://docs.microsoft.com/powerquery-m/number-iseven)/[Odd](https://docs.microsoft.com/powerquery-m/number-iseven)
* Text containment using [Text.Contains](https://docs.microsoft.com/powerquery-m/text-contains), [Text.StartsWith](https://docs.microsoft.com/powerquery-m/text-startswith), or [Text.EndsWith](https://docs.microsoft.com/powerquery-m/text-endswith)
* Date ranges including all the 'IsIn' [Date functions](https://docs.microsoft.com/powerquery-m/date-functions)) 
* Combinations of these using and, or, or not conditions

## Adding and Transforming Columns

The following M functions add or transform columns: [Table.AddColumn](https://docs.microsoft.com/powerquery-m/table-addcolumn), [Table.TransformColumns](https://docs.microsoft.com/powerquery-m/table-transformcolumns), [Table.ReplaceValue](https://docs.microsoft.com/powerquery-m/table-replacevalue), [Table.DuplicateColumn](https://docs.microsoft.com/powerquery-m/table-duplicatecolumn). Below are the supported transformation functions.

* Numeric arithmetic
* Text concatenation
* Date andTime Arithmetic (Arithmetic operators, [Date.AddDays](https://docs.microsoft.com/powerquery-m/date-adddays), [Date.AddMonths](https://docs.microsoft.com/powerquery-m/date-addmonths), [Date.AddQuarters](https://docs.microsoft.com/powerquery-m/date-addquarters), [Date.AddWeeks](https://docs.microsoft.com/powerquery-m/date-addweeks), [Date.AddYears](https://docs.microsoft.com/powerquery-m/date-addyears))
* Durations can be used for date and time arithmetic, but must be transformed into another type before written to a sink (Arithmetic operators, [#duration](https://docs.microsoft.com/powerquery-m/sharpduration), [Duration.Days](https://docs.microsoft.com/powerquery-m/duration-days), [Duration.Hours](https://docs.microsoft.com/powerquery-m/duration-hours), [Duration.Minutes](https://docs.microsoft.com/powerquery-m/duration-minutes), [Duration.Seconds](https://docs.microsoft.com/powerquery-m/duration-seconds), [Duration.TotalDays](https://docs.microsoft.com/powerquery-m/duration-totaldays), [Duration.TotalHours](https://docs.microsoft.com/powerquery-m/duration-totalhours), [Duration.TotalMinutes](https://docs.microsoft.com/powerquery-m/duration-totalminutes), [Duration.TotalSeconds](https://docs.microsoft.com/powerquery-m/duration-totalseconds))    
* Most standard, scientific, and trigonometric numeric functions (All functions under [Operations](https://docs.microsoft.com/powerquery-m/number-functions#operations), [Rounding](https://docs.microsoft.com/powerquery-m/number-functions#rounding), and [Trigonometry](https://docs.microsoft.com/powerquery-m/number-functions#trigonometry) *except* Number.Factorial, Number.Permutations, and Number.Combinations)
* Replacement ([Replacer.ReplaceText](https://docs.microsoft.com/powerquery-m/replacer-replacetext), [Replacer.ReplaceValue](https://docs.microsoft.com/powerquery-m/replacer-replacevalue), [Text.Replace](https://docs.microsoft.com/powerquery-m/text-replace), [Text.Remove](https://docs.microsoft.com/powerquery-m/text-remove))
* Positional text extraction ([Text.PositionOf](https://docs.microsoft.com/powerquery-m/text-positionof), [Text.Length](https://docs.microsoft.com/powerquery-m/text-length), [Text.Start](https://docs.microsoft.com/powerquery-m/text-start), [Text.End](https://docs.microsoft.com/powerquery-m/text-end), [Text.Middle](https://docs.microsoft.com/powerquery-m/text-middle), [Text.ReplaceRange](https://docs.microsoft.com/powerquery-m/text-replacerange), [Text.RemoveRange](https://docs.microsoft.com/powerquery-m/text-removerange))
* Basic text formatting ([Text.Lower](https://docs.microsoft.com/powerquery-m/text-lower), [Text.Upper](https://docs.microsoft.com/powerquery-m/text-upper),
 [Text.Trim](https://docs.microsoft.com/powerquery-m/text-trim)/[Start](https://docs.microsoft.com/powerquery-m/text-trimstart)/[End](https://docs.microsoft.com/powerquery-m/text-trimend), [Text.PadStart](https://docs.microsoft.com/powerquery-m/text-padstart)/[End](https://docs.microsoft.com/powerquery-m/text-padend), [Text.Reverse](https://docs.microsoft.com/powerquery-m/text-reverse))
* Date/Time Functions ([Date.Day](https://docs.microsoft.com/powerquery-m/date-day), [Date.Month](https://docs.microsoft.com/powerquery-m/date-month), [Date.Year](https://docs.microsoft.com/powerquery-m/date-year) [Time.Hour](https://docs.microsoft.com/powerquery-m/time-hour), [Time.Minute](https://docs.microsoft.com/powerquery-m/time-minute), [Time.Second](https://docs.microsoft.com/powerquery-m/time-second), [Date.DayOfWeek](https://docs.microsoft.com/powerquery-m/date-dayofweek), [Date.DayOfYear](https://docs.microsoft.com/powerquery-m/date-dayofyear), [Date.DaysInMonth](https://docs.microsoft.com/powerquery-m/date-daysinmonth))
* If expressions (but branches must have matching types)
* Row filters as a logical column
* Number, text, logical, date, and datetime constants

Merging/Joining tables
----------------------
* Power Query will generate a nested join (Table.NestedJoin; users can also
    manually write
    [Table.AddJoinColumn](https://docs.microsoft.com/powerquery-m/table-addjoincolumn)).
    Users must then expand the nested join column into a non-nested join
    (Table.ExpandTableColumn, not supported in any other context).
* The M function
    [Table.Join](https://docs.microsoft.com/powerquery-m/table-join) can
    be written directly to avoid the need for an additional expansion
    step, but the user must ensure that there are no duplicate column names
    among the joined tables
* Supported Join Kinds:
    [Inner](https://docs.microsoft.com/powerquery-m/joinkind-inner),
    [LeftOuter](https://docs.microsoft.com/powerquery-m/joinkind-leftouter),
    [RightOuter](https://docs.microsoft.com/powerquery-m/joinkind-rightouter),
    [FullOuter](https://docs.microsoft.com/powerquery-m/joinkind-fullouter)
* Both
    [Value.Equals](https://docs.microsoft.com/powerquery-m/value-equals)
    and
    [Value.NullableEquals](https://docs.microsoft.com/powerquery-m/value-nullableequals)
    are supported as key equality comparers

## Group by

Use [Table.Group](https://docs.microsoft.com/powerquery-m/table-group) to aggregate values.
* Must be used with an aggregation function
* Supported aggregation functions:
    [Table.RowCount](https://docs.microsoft.com/powerquery-m/table-rowcount),
    [List.Sum](https://docs.microsoft.com/powerquery-m/list-sum),
    [List.Count](https://docs.microsoft.com/powerquery-m/list-count),
    [List.Average](https://docs.microsoft.com/powerquery-m/list-average),
    [List.Min](https://docs.microsoft.com/powerquery-m/list-min),
    [List.Max](https://docs.microsoft.com/powerquery-m/list-max),
    [List.StandardDeviation](https://docs.microsoft.com/powerquery-m/list-standarddeviation),
    [List.First](https://docs.microsoft.com/powerquery-m/list-first),
    [List.Last](https://docs.microsoft.com/powerquery-m/list-last)

## Sorting

Use [Table.Sort](https://docs.microsoft.com/powerquery-m/table-sort) to sort values.

## Reducing Rows

Keep and Remove Top, Keep Range (corresponding M functions,
    only supporting counts, not conditions:
    [Table.FirstN](https://docs.microsoft.com/powerquery-m/table-firstn),
    [Table.Skip](https://docs.microsoft.com/powerquery-m/table-skip),
    [Table.RemoveFirstN](https://docs.microsoft.com/powerquery-m/table-removefirstn),
    [Table.Range](https://docs.microsoft.com/powerquery-m/table-range),
    [Table.MinN](https://docs.microsoft.com/powerquery-m/table-minn),
    [Table.MaxN](https://docs.microsoft.com/powerquery-m/table-maxn))

## Known unsupported functions

| Function | Status |
| -- | -- |
| Table.PromoteHeaders | Not supported. The same result can be achieved by setting "First row as header" in the dataset. |
| Table.CombineColumns | This is a common scenario that isn't directly supported but can be achieved by adding a new column that concatenates two given columns.  For example, Table.AddColumn(RemoveEmailColumn, "Name", each [FirstName] & " " & [LastName]) |
| Table.TransformColumnTypes | This is supported in most cases. The following scenarios are unsupported: transforming string to currency type, transforming string to time type, transforming string to Percentage type. |
| Table.NestedJoin | Just doing a join will result in a validation error. The columns must be expanded for it to work. |
| Table.Distinct | Remove duplicate rows isn't supported. |
| Table.RemoveLastN | Remove bottom rows isn't supported. |
| Table.RowCount | Not supported, but can be achieved with an add column with all cells empty (condition column can be used) and then using group by on that column. Table.Group is supported. | 
| Row level error handling | Row level error handling is currently not supported. For example, to filter out non-numeric values from a column, one approach would be to transform the text column to a number. Every cell which fails to transform will be in an error state and need to be filtered. This scenario isn't possible in wrangling data flow. |
| Table.Transpose | Not supported |
| Table.Pivot | Not supported |

## Next steps

Learn how to [create a wrangling data flow](wrangling-data-flow-tutorial.md).