---
title: Use data transforms for data preparation in Azure Machine Learning | Microsoft Docs
description: This article provides a complete list of transformations available for Azure Machine Learning data preparation.
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article
ms.date: 02/01/2018

ROBOTS: NOINDEX
---
# Use data transforms for data preparation in Azure Machine Learning

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 

A *transform* in Azure Machine Learning consumes data in a given format, performs an operation on the data (such as changing the data type), and then produces data in the new format. Each transform has its own interface and behavior. By chaining several transforms together via steps in the data flow, you can perform complex and repeatable transformations on your data. This is the core of data preparation functionality.

The following are the transforms available in Azure Machine Learning. 

## Column selection 
Many of the transforms in this list work on either a single column or many. To select multiple columns, use the Ctrl key. To select a range of columns, use the Shift key.

## Transforms from the main menu or the grid header 
Access transforms from the Transforms option on the main menu. You can also select transforms by right-clicking the column name in the data grid. If multiple columns are selected, right-clicking any of them provides a transforms menu.

The right-click menu only shows valid transforms for the data type selected. The main menu offers all transforms but disables those not relevant to the selected columns.

A small subset of contextual transforms is available by right-clicking a cell. These transforms are Copy, Replace, and Filter. These are data type-aware, so the options for a number column are different than for a string column.

## Derive Column by Example
Use this transform to create a new column as a derivative of one or more existing columns. The transform looks at the input (selected) columns and the example given, and then determines the desired output in the new column. 

To use this transform, select one or more columns. Add a new (blank) derived column by example. Type an example of what you want to see in the derived column (assuming it's derived from other columns), and the “By Example” technology attempts to fill in all the other cells in the column. 

For complicated examples, you might need to provide more than one example. To do this, select another cell and type another example.

The "By Example" technology uses selected columns to attempt to determine the meaning of an example. If no columns are selected when this transform is invoked, then all cells for the current row are used. Selecting only the required columns leads to more accurate results.

You can select columns before invoking the transform. When the transform editor has been opened, check boxes at the top of each column indicate what columns are selected as inputs. You can add or remove columns from the selection by using the check boxes in the column headers.

For a more detailed explanation of the **Derived Column by Example** transform, along with more samples, see
[Derive Column by Example reference](data-prep-derive-column-by-example.md).  

## Split Column by Example
This transform takes an existing column and, by using the “By Example” engine, attempts to split that column into *n* other columns. You can run the auto-split on the subsequent generated columns.

For a more detailed explanation of the **Split Column by Example** transform, along with more samples, see
[Split Column by Example reference](data-prep-split-column-by-example.md).

## Expand JSON

This transform enables you to add multiple columns by expanding a column with valid JSON text.

For a more detailed explanation of the **Expand JSON** transform, along with more samples, see
[Expand JSON reference](data-prep-expand-json.md).


## Combine Columns by Example

This transform adds a new column by combining values from multiple columns. 

For a more detailed explanation of the **Combine Columns by Example** transform, along with more samples, see
[Combine Columns by Example reference](data-prep-combine-columns-by-example.md).


## Duplicate Column
This transform makes an exact copy of one or more selected columns and gives each a new name derived from the original column name.

## Text Clustering 
This transform is designed to take inconsistent values that should be the same and group them together.  

With this transform, the values in a single column are analyzed for similarity and grouped into clusters. For each cluster, there is a canonical value, which is the value that replaces all instances in the cluster and all instance values. Complete clusters can be removed and the canonical value edited. Instances can be removed from a given cluster. The similarity score threshold filter that's used to group instances into a cluster can be changed.

By default, this transform replaces all cluster instance values with the canonical value for that cluster, creating a new column to contain the new values. You can also add the similarity score for each instance to a new column (that can be named) for use later in the data flow.

## Replace Values
Use this transform to replace one string with another. The source string can be a partial string or a full cell, and the replacement can apply to a single column or many. The search string supports searching for special characters as well as for regular characters. 

## Replace NA Values
Use this transform to replace the various forms of NA (N/A, NA, null, NaN, etc.), or to replace empty strings with a single value to make them consistent. This transform supports one or many columns, and it's only listed when a column is selected. It's not present on the main transform menu when no columns are selected.

## Replace Missing Values
This transform replaces missing data with a single value, and it supports one or many columns. This transform is only listed when a column is selected. It's not present on the main transform menu when no columns are selected.

## Replace Error Values
This transform replaces errors with a single value, and it supports one or many columns. This transform is only listed when a column is selected. It's not present on the main transform menu when no columns are selected.

## Trim String
This transform removes leading and trailing "whitespace" characters (including spaces, tabs, etc.) from one or more columns.

## Adjust Precision
This transform sets the number of decimal places for a numeric column.

## Rename Column
This transform changes the name of the selected column. You can also invoke it inline in the column header by clicking the name of the column.

## Remove Column
This transform removes the selected columns, and it works on a single column or many. 

## Keep Column
This transform keeps only the selected columns, and it works on a single column or many.

## Handle Path Column
During the import of a file, a path column is automatically added to the data set by the **Add Data Source** feature. It contains the fully qualified filename that forms the path to the data set. This transform either adds or removes that extra column from the data set.

## Convert Field Type to Numeric
This transform changes the column type to numeric. You can specify the separator for non-integer data. By default, this transform doesn't prompt for the separator, so use the **Edit** menu item to invoke the editor. This transform works on a single column or many.

## Convert Field Type to Date
This transform changes the column type to date. A default date/time format is used, but it can be overridden by using `strftime` directives. You can also prepend time values with a fixed date.

By default, this transform doesn't prompt for the format, so use the **Edit** menu item on the resultant step to invoke the editor. This transform works on a single column or many.

Only dates between 9-22-1677 and 4-11-2262 can be converted to the date type.

## Convert Field Type to Boolean
This transform changes the column type to true/false. It supports mapping multiple values to either true or false, and you can edit these mappings. It also supports a constant to which you can map values that don't exist in the true/false mapping tables. This transform works on a single column or many.

## Convert Field Type to String
This transform changes the column type to string, and it works on a single column or many.

## Convert Unix Timestamp to DateTime
This transform understands the Unix timestamp format, even if it's represented as a string in the data. It converts the timestamp correctly to a date type in data preparation.

## Filter
This transform supports filtering of rows based on the values in one or many columns. The conditions of the filter depend on the data type of each column, so you can filter string columns by "contains" or "does not contain." Numeric columns can be filtered by "greater than" or "less than" conditions.

When the **Filter** transform is invoked from the main menu, or from right-clicking the header of a column, the option to fork the failing rows into another data flow is available. The main data flow continues with filtered **in** rows, and a new data flow is created that contains all the rows that were filtered **out**.

## Use First Row as Headers
This transform promotes the first row from the data set to be the column names. If some columns don't have data in the first row, a name is auto-generated. Using this transform means that the import of data starts at row 2 at the earliest. Depending on the **Skip Rows** setting, the import can start even further down in the data set. You can also use it to remove the promotion and to use auto-generated names only.

## Join
This transform is used to join two data flows together. You can select which output of the join to be the result: the successful rows from the join, the "left" failing rows from the join, or the "right" failing rows from the join.

The **Join** transform starts from a single data flow and selects that data flow as one side of the join. It then prompts you to select another data flow for the other side of the join. After you've selected the two flows, the transform requires a single column on each side of the join to be selected to join on. If the join needs more than one column, create a derived column before starting the transform to create a new, concatenated column to be used only for the join. The transform attempts to suggest join keys and, if possible, generate the derived column automatically.

After the join has been completed, a Sankey diagram view of the join is presented. The width of the lines relative to each other represents the number of rows moving through that part of the join flow. Using the panel on the right, you can select the successful rows, the left failing rows, or the right failing rows exclusively. You can also choose a single branch.

## Append Rows
This transform appends data from another data flow to the current one. It maps the columns by position to add the new rows at the end.

## Append Columns
This transform appends new columns from another data flow to the current one. It adds the new columns to the right. It doesn't attempt to line up data in rows.

## Summarize
This transform computes aggregates for the combination of unique values in one or more selected columns. 

The aggregates supported are: COUNT, SUM, MIN, MAX, MEAN, VARIANCE, and STANDARD DEVIATION. The list of aggregates for a given column is filtered to only the aggregates that apply to the data type. Aggregates that do not apply are disabled. For example, it's not possible to compute the MEAN of a string column, but it's possible to compute the MIN and the MAX.

When the editor is available, drag from the column header up into the panel at the top left, where the columns to be aggregated are displayed. This panel is hierarchical, so you can do nested aggregates. The editor panel at the top right is used to select which aggregate to apply to a column. A single column can be aggregated one or more times. After at least one aggregate has been chosen, the grid at the bottom right previews the data in its aggregate form. 

This transform is analogous to an `ANSI-SQL GROUP BY`.

## Remove Duplicates
This transform removes the entire row when there are duplicate values in one or more selected columns. If no columns are chosen, the only rows removed are ones where all the column values are the same.

## Sort
This transform sorts the data. The sort can be done by a single column or many, and each column can be sorted ascending (the default) or descending (which can be changed from the editor).

This transform is analogous to an `ANSI-SQL ORDER BY`.

## Output transforms
The following transforms output data. You can have multiple write blocks in a single flow to write out the data at different points.

### Write to CSV
This transform writes out the data in CSV form from the current point in the data flow. It controls the location (local or remote) and various settings around the file.

### Write to Parquet
This transform writes out the data in Parquet form from the current point in the data flow. It controls the location (local or remote) and various settings around the file.

## Script-based transforms
The following transforms use script (Python) to perform functionality that's missing in the core product. 

>[!NOTE]
>Before you use any of these transforms, read [Using Python extensibility](data-prep-python-extensibility-overview.md).

### Add Column (script)
This transform adds a column to the data using a Python expression.
For more information, see [Sample Python code for deriving new columns](data-prep-appendix10-sample-custom-column-transforms-python.md).

### Advanced Filter (script)
Use this transform to write a Python row level filter.
For more information, see [Example filter expressions](data-prep-appendix6-sample-filter-expressions-python.md).

### Transform Dataflow (script)
This transform applies Python to the entire data set.
For more information, see [Example transform data flow transformations](data-prep-appendix7-sample-transform-data-flow-python.md).

This transform also can apply Python to an entire data partition.
For more information, see [Example transform data flow transformations](data-prep-appendix7-sample-transform-data-flow-python.md).

### Write Dataflow (script)
This transform uses Python to write out an entire data set.
For more information, see [Sample Python for deriving new columns](data-prep-appendix9-sample-destination-connections-python.md).



