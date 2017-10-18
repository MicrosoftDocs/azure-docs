---
title: Use data transforms for data preparation in Azure Machine Learning | Microsoft Docs
description: This article provides a complete list of transformations available for Azure Machine Learning data prep
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: 
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article
ms.date: 10/09/2017
---
# Use data transforms for data preparation in Azure Machine Learning

A *transform* in Azure Machine Learning consumes data in a given format, performs an operation on the data (such as changing the data type), and then produces data in the new format. Each transform has its own interface and behavior. You can chain several transforms together via steps in the dataflow, allowing you to perform complex and repeatable transformations on your data. This is the core of data preparation functionality.

The following is a list of the transforms available in Azure Machine Learning. 

## Column selection 
Many of the following listed transforms work on a single column or many. To select multiple columns, use the **Ctrl** key; or to select a range of columns, use the **Shift** key.

## Transforms from main menu and/or grid header 
Transforms may be accessed from the Transforms option on the main menu. Transforms may also be selected by right-clicking the column name in the data grid. If multiple columns are selected, then right-clicking any of them provides a transforms menu.

Only valid transforms for the data type selected are offered on the right-click menu. The main menu offers all transforms but disables the transforms that are not relevant to the selected columns.

A small subset of contextual transforms is available by right-clicking a cell. These transforms are Copy, Replace, and Filter. These transforms are data type aware so the options for a number column are different than for a string column.

## Derive Column by Example
This transform allows the creation of a new column as a derivative of one or more existing columns. The transforms looks at the input (selected) columns and the example given, and then determines the desire output in the new column. 

To use this transform, select one or more columns. Add a new (blank) derived column by example. Type an example of what you wish to see in the derived column (assuming it's derived from other columns) and the “By Example” technology attempts to fill in all the other cells in the column. 

For complicated examples, it may be necessary to provide more than one example. To do this, select another cell and type another example.

The "By Example" technology uses selected columns to attempt to determine the meaning of an example. If no columns are selected when this transform is invoked, then all the cells for the current row are used. Selecting only the required columns leads to more accurate results.

You can select columns before invoking the transform. Once the transform editor has been launched, check boxes at the top of each column indicate what columns are selected as inputs. You can add or remove columns from the selection by using the check boxes in the column headers.

For a more detailed explanation of **Derived Column By Example** transform, along with more samples, see:
[Derive Column by Example Reference](data-prep-derive-column-by-example.md)  

## Split Column by Example
This transform takes an existing column and using the “By Example” engine attempts to split that column into *n* other columns. It's possible to run the Auto-Split on the subsequent generated columns.

For a more detailed explanation of **Split Column By Example** transform, along with more samples, see:
[Split Column by Example Reference](data-prep-split-column-by-example.md)

## Expand JSON

This transform enables you to add multiple columns by expanding a column with valid JSON text.

For a more detailed explanation of **Expand JSON** transform, along with more samples, see:
[Expand JSON Reference](data-prep-expand-json.md)


## Combine Columns by Example

This transform allows you to add a new column by combining values from multiple columns. 

For a more detailed explanation of **Combine Columns by Example** transform, along with more samples, see:
[Combine Columns by Example Reference](data-prep-combine-columns-by-example.md)


## Duplicate Column
This transform makes an exact copy of one or more selected columns and gives each a new name derived from the original column name.

## Text Clustering 
This transform is designed to take inconsistent values that should be the same and group them together.  

When you use this transform, the values in a single column are analyzed for similarity and grouped into clusters. For each cluster, there is a canonical value, which is the value that replaces all instances in the cluster, and instance values. Complete clusters can be removed and the canonical value can be edited. Instances can be removed from a given cluster. In addition, the similarity score threshold filter that's used to group instances into a cluster can be changed.

By default this transform replaces all cluster instance values with the canonical value for that cluster, creating a new column to contain the new values. It's also possible to add the similarity score, for each instance, to a new column (that can be named) to allow its use later on in the data flow.

## Replace Values
This transform allows one string to be replaced by another. The source string can be a partial string or a full cell; the replacement can apply to a single column or many. The search string supports searching for special characters as well as regular characters. 

## Replace NA Values
This transform allows the various different forms of NA (N/A, NA, null, NaN, etc.) or empty strings to be replaced with a single value to make them consistent. This transform supports one or many columns. This transform is only listed when a column is selected and is not present on the main transform menu when no columns are selected.

## Replace Missing Values
This transform replaces missing data with a single value. This transform supports one or many columns. This transform is only listed when a column is selected and is not present on the main transform menu when no columns are selected.

## Replace Error Values
This transform replaces errors with a single value. This transform supports one or many columns. This transform is only listed when a column is selected and is not present on the main transform menu when no columns are selected.

## Trim String
This transform removes leading and trailing "whitespace" characters (includes spaces, tabs, *etc.*), from one or more columns.

## Adjust Precision
This transform allows you to set the number of decimal places for a numeric column.

## Rename Column
This transform changes the name of the selected column. This transform can also be invoked inline in the column header by clicking the name of the column.

## Remove Column
This transform removes the selected column(s). This transform works on a single column or many. 

## Keep Column
This transform keeps only the selected column(s). This transform works on a single column or many.

## Handle Path Column
During the import of a file, a path column is automatically added to the dataset by the Add Data Source wizard. It contains the fully qualified filename that forms the path to the dataset. This transform either adds or removes that extra column from the dataset.

## Convert Field Type to Numeric
This transform changes the column type to numeric. You can specify the separator if there is non-integer data. By default, this transform doesn't prompt for the separator, use the **Edit** menu item to invoke the editor. This transform works on a single column or many.

## Convert Field Type to Date
This transform changes the column type to date. A default date/time format is used, but may be overridden using `strftime` directives. It's also possible to prepend time values with a fixed date.

By default this transform doesn't prompt for the format, use the **Edit** menu item on the resultant step to invoke the editor. This transform works on a single column or many.

Only dates between 9-22-1677 and 4-11-2262 can be converted to the date type.

## Convert Field Type to Boolean
This transform changes the column type to true/false. This transform supports mapping multiple values to either true or false, and it's possible to edit these mappings. It also supports a constant to which you can map values that do not exist in the true/false mapping tables. This transform works on a single column or many.

## Convert Field Type to String
This transform changes the column type to string. This transform works on a single column or many.

## Convert Unix Timestamp to DateTime
This transform understands the Unix Timestamp format even if it's represented as a string in the data and converts it correctly to a date type in data prep.

## Filter
This transform supports filtering of rows based on the values in one or many columns. The conditions of the filter are dependent on the data type of each column, making it possible to filter string columns by "contains" or "does not contain". Numeric columns can be filtered by "greater than" "less than" conditions.

When the filter transform is invoked from the main menu, or from right-clicking the header of a column, the option to fork the failing rows into another data flow is available. Then the main data flow continues with filtered **in** rows, and a new data flow is created that contains all the rows that were filtered **out**.

## Use first row as headers
This transform promotes the first row from the data set to be the column names. If some columns don't have data in the first row, then a name is auto-generated. Using this transform means that the import of data starts at row 2 at the earliest. Depending on the Skip Rows setting, the import may start even further down in the data set. It can also be used to remove the promotion and to have auto-generated names only.

## Join
This transform is used to join two data flows together. You can select which output of the join should be the result: the successful rows from the join, the "left" failing rows from the join, or the "right" failing rows from the join.

The Join wizard is launched from a single data flow and selects that data flow as one side of the join. It then prompts you for another data flow for the other side of the join. Once the two flows have been selected, the wizard requires a single column on each side of the joint to be selected to join on. If the join needs more than one column, then create a derived column before launching the wizard to create a new (concatenated) column to be used only for join. The wizard attempts to suggest join keys and if possible generate the derived column automatically.

Once the join has been completed, a Sankey Diagram view of the join is presented. The width of the lines relative to each other represents the number of rows moving through that part of the join flow. The panel on the right allows you to select the successful rows, the left failing, or the right failing exclusively. It's also possible to choose only one branch.

## Append Rows
This transform appends data from another data flow to the current one. It maps the columns by position to add the new rows at the end.

## Append Columns
This transform appends new columns from another data flow to the current one. It adds the new columns to the right; it doesn't attempt to line up data in rows.

## Summarize
This transform computes aggregates for the combination of unique values in one or more selected columns. 

The aggregates supported are: COUNT, SUM, MIN, MAX, MEAN, VARIANCE, and STANDARD DEVIATION. The list of aggregates for a given column is filtered to only the ones that apply to the datatype. Aggregates that do not apply are disabled. For example, it's not possible to compute the mean of a string column, but it's possible to compute the min and the max.

Once the editor is available, drag from the column header up into the panel on the top left. where the columns to be aggregated are displayed. This panel is hierarchical so it's possible to do nested aggregates. The editor panel on the top right is used to select which aggregate to apply to a column. A single column can be aggregated one or more times. Once at least one aggregate has been chosen, the grid on the bottom right previews the data in its aggregate form. 

This transform is analogous to an `ANSI-SQL GROUP BY`.

## Remove Duplicates
This transform removes the entire row where there are duplicate values in one or more selected columns. If no columns are chosen, then the only rows that are removed are ones where all the column values are the same.

## Sort
This transform sorts the data. The sort can be done by a single column or many, and each column can be sorted ascending (the default) or descending (can be changed from the editor).

This transform is analogous to an `ANSI-SQL ORDER BY`.

## Output Transforms
The following transforms output data. It's possible to have multiple write blocks in a single flow to be able to write out the data at different points.

### Write To CSV
This transform writes out the data in CSV form from the current point in the data flow. It allows control of the location (local or remote) and various settings around the file.

### Write to Parquet
This transform writes out the data in Parquet form from the current point in the data flow. It allows control of the location (local or remote) and various settings around the file.

## Script based Transforms
The following transforms use script (Python) to perform functionality that's missing in the core product. 
Before using any of these transforms, read [Using Python extensibility](data-prep-python-extensibility-overview.md).

### Add Column (Script)
This transform allows a column to be added to the data using a Python expression.
For more information, see [Sample Python code for deriving new columns](data-prep-appendix10-sample-custom-column-transforms-python.md).

### Advanced Filter (Script)
This transform allows a Python row level filter to be written.
For more information, see [Example filter expressions](data-prep-appendix6-sample-filter-expressions-python.md).

### Transform Dataflow (Script)
This transform allows Python to be applied to the entire data set.
For more information, see [Example transform data flow transformations](data-prep-appendix7-sample-transform-data-flow-python.md).

### Transform Dataflow (Script)
This transform allows Python to be applied to an entire data partition.
For more information, see [Example transform data flow transformations](data-prep-appendix7-sample-transform-data-flow-python.md).

### Write Dataflow (Script)
This transform allows Python to be applied to writing out and entire data set.
For more information, see [Sample Python for deriving new columns](data-prep-appendix9-sample-destination-connections-python.md).



