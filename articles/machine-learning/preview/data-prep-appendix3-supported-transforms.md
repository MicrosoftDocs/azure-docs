---
title: Supported transformations available with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a complete list of transformations available for Azure ML data prep
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
ms.date: 09/07/2017
---
# Supported Transforms for this release 

## Column selection 
Many of the following listed transforms work on a single column or many. To select multiple columns, use Control Click on each column or use Shift Click on a range of columns.

## Transforms from main menu and/or grid header 
Transforms may be accessed from the Transforms option on the main menu. Transforms may also be selectedby right-clicking on the column name in the data grid. If multiple columns are selected, then right-clicking on any of them provides a transforms menu.

Only valid transforms for the data type selected are offered on the righ-click menu, the main menu offers all transforms but gray's out the transforms that are not relevant to the selected columns.

A small subset of contextual transforms is available by right-clicking in a cell. These transforms are Copy, Replace, and Filter, these transforms are data type aware so the options for a number column are different than a string column.

## Derive Column by Example
This transform allows the creation of a new column as a derivative of one ore more existing column. It does this by looking at the input(selected) columns and the example given to determine the desire output in the new column. 

To use it, select one or more columns. Aadd a new (blank) derived column by example. Type an example of what you wish to see in the derived column (assuming it is derived from other columns) and the “By Example” technology attempts to fill in all the other cells in the column. 

For complicated examples it may be necessary to provide more than one example, select another cell and type another example.

The "By Example" technology uses selected columns to attempt to determine the meaning of an example. If no columns are selected when this transform is invoked, then all the cells for the current row are used. Selecting only the required columns leads to more accurate results.

You can select columns before invoking the transform. Once the transform editor has been launched, it is possible to see what columns are selected as inputs via check boxes at the top of each column. Addition and removal of columns from the selection can be completed by using the check boxes in the column headers.

For a more detailed explanation of **Derived Column By Example** transform, along with more samples see:
[Derive Column by Example Reference](data-prep-derive-column-by-example.md)  

## Split Column by Example
Takes an existing column and using the “By Example” engine attempts to split that column into n other columns. It is possible to run the Auto-Split on the subsequent generated columns.

For a more detailed explanation of **Split Column By Example** transform, along with more samples see:
[Split Column by Example Reference](data-prep-split-column-by-example.md)

## Expand JSON

The **Expand JSON** transform enables users to add multiple columns by expanding a column with valid JSON text.

For a more detailed explanation of **Expand JSON** transform, along with more samples see:
[Expand JSON Reference](data-prep-expand-json.md)


## Combine Columns by Example

Allows user to add a new column by combining values from multiple columns. 

For a more detailed explanation of **Combine Columns by Example** transform, along with more samples see:
[Combine Columns by Example Reference](data-prep-combine-columns-by-example.md)


## Duplicate Column
This transform makes an exact copy of a column(s) and gives it a new name derived from the original column name(s). This transform supports one or many columns.

## Text Clustering 
This transform is designed to take inconsistent values that should be the same and group them together.  

On running this transform, the values in a single column are analyzed for similarity. They are then grouped into clusters. For each cluster, there is a canonical value, which is the value that replaces all instances in the cluster, and instance values. Complete clusters can be removed, the canonical value can be edited. Instances can be removed from a given cluster. In addition, the similarity score threshold filter that is used to group instances into a cluster can be changed.

By default this transform replaces all cluster instance values with the canonical value for that cluster, creating a new column to contain the new values. It is also possible to add the similarity score, for each instance, to a new column (that can be named) to allow its use later on in the data flow.

## Replace Values
This transform allows one string to be replaced by another, the source string can be a partial string or a full cell. The replacement can apply to a single column or many. The search string supports searching for special characters as well as regular characters. 

## Replace NA Values
Allows the various different forms of NA (N/A, NA, null, NaN, etc.) or empty strings to be replaced with a single value to make them consistent. This transform supports one or many columns. This transform is only listed when a column is selected and is not present on the main transform menu when no columns are selected.

## Replace Missing Values
Performs replacement of missing data with a single value. This transform supports one or many columns. This transform is only listed when a column is selected and is not present on the main transform menu when no columns are selected.

## Replace Error Values
Performs replacement of errors with a single value. This transform supports one or many columns. This transform is only listed when a column is selected and is not present on the main transform menu when no columns are selected.

## Trim String
Remove leading and trailing "whitespace" characters(includes spaces, tabs etc.), from   a single column or many.

## Adjust Precision
Allows the number of decimal places for a numeric column to be set

## Rename Column
Changes the name of the column, this transform can also be invoked inline in the column header by clicking on the name of the column.

## Remove Column
Removes the selected column(s), this transform works on a single column or many. 

## Keep Column
Keeps only the selected column(s), this transform works on a single column or many.

## Handle Path Column
During the import of a file, a path column is automatically added to the dataset by the wizard. It contains the fully qualified filename that forms the path to the dataset. This transform either adds or removes that extra column from the dataset.

## Convert Field Type to Numeric
Change the column type to numeric. Specify the separator if there is non integer data. By default this transform does not prompt for the separator, use the **Edit** menu item to invoke the editor. This transform works on a single column or many.

## Convert Field Type to Date
Change the column type to date. A default date/time format is used, but may be overridden using `strftime` directives. It is also possible to prepend time values with a fixed date.

By default this transform does not prompt for the format, use the **Edit** menu item on the resultant step to invoke the editor. This transform works on a single column or many.

Only dates between 9-22-1677 and 4-11-2262 can be converted to the date type.

## Convert Field Type to Boolean
Change the column type to true/false. This transform supports mapping multiple values to either true or false, it is possible to edit these mappings. It also supports a constant to map values to that do not exist in the true/false mapping tables. This transform works on a single column or many.

## Convert Field Type to String
Change the column type to string. This transform works on a single column or many.

## Convert Unix Timestamp to DateTime
This transform understands the Unix Timestamp format even if it is represented as a string in the data and converts it correctly to a date type in data prep.

## Filter
The filter transform supports filtering of rows based on the values in one or many columns, the conditions of the filter are dependent on the data type of each column, hence it is possible to filter string columns by "contains" or "does not contain" but not for numerics. However for numeric columns "greater than" "less than" conditions apply but not for string columns.

In the case where the filter transform is invoked from the main menu or from right click on the header of a column the option to fork the failing rows into another data flow is available. Thus the main data flow continues with filtered **in** rows and a new data flow is created that contains all the rows that were filtered **out**.

## Use first row as headers
This transform promotes the first row from the data set to be the column names, if some columns do not have data in the first row then a name is autogenerated. Using this transform means that the import of data starts at row 2 at the earliest. Depending on the Skip Rows setting, the import may start even further down in the data set. It can also be used to remove the promotion and to have auto generated names only.

## Join
This transform is used to join two data flows together. It allows selection of which output of the join should be the result, the successful rows from the join, the "left" failing rows from the join or the "right" failing rows from the join.

The Join wizard is launched from a single data flow and selects that data flow as one side of the join, it then prompts the user for another data flow for the other side of the join. Once the two flows have been selected, the wizard requires a single column on each side of the joint to be selected to join on. If the join needs more than one column, then create a derived column before launching the wizard to create a new (concatenated) column to be used only for join. The wizard attempts to suggest join keys and if possible generate the derived column automatically.

Once the join has been completed, a Sankey Diagram view of the join is presented, the width of the lines relative to each other is representative of the number of rows moving through that part of the join flow. The panel on the right allows the selection of the successful rows, left failing, right failing exclusively or it is possible to choose only one branch.

## Append Rows
This transform appends data from another data flow to the current one, it maps the columns by position to add the new rows at the end.

## Append Columns
This transform appends new columns from another data flow to the current one, it adds the new columns to the right, it does not attempt to line up data in rows.

## Summarize
Select a column(s) and compute aggregates for that combination of unique values.

Aggregates supported:  COUNT, SUM, MIN, MAX, MEAN, VARIANCE, STANDARD DEVIATION. The list of aggregates for a given column is filtered to only that apply to that datatype. Aggregates that do not apply are grayed out. As an example it is not possible to compute the mean of a string column, but it is possible to compute the min and the max.

Analogous to an ANSI-SQL GROUP BY

Once the editor is available drag from the column header up into the panel on the top left, columns to be aggregated are displayed here. This panel is hierarchical so it is possible to do nested aggregates. The editor panel on the top right is used to select which aggregate to apply to a column. A single column can be aggregated one or more times. Once at least one aggregate has been chosen, the grid on the bottom right previews the data in its aggregate form. 

## Remove Duplicates
This transform removes the entire row where there are duplicate values. The duplicate values are defined by one or more columns that are selected on invocation of the transform or by suing the editor. If no columns are chosen, then the only rows that are removed are ones where all the column values are the same.

## Sort
This transform sorts the data, it can be done by a single column or many, each column can be sorted ascending (the default) or descending (can be changed from the editor).

Analogous to an ANSI-SQL ORDER BY

## Output Transforms
The transforms that follow output the data. It is possible to have multiple write blocks in a single flow to be able to write out the data at different points.

### Write To CSV
This transform writes out the data in CSV form from the current point in the data flow.  It allows control of the location(local or remote) and various settings around the file.

### Write to Parquet
This transform writes out the data in Parquet form from the current point in the data flow. It allows control of the location(local or remote) and various settings around the file.

## Script based Transforms
The transforms that follow all use script (Python) to perform functionality that is missing in the core product. 
[Before using any of these transforms, read the extensibility over doc here](data-prep-python-extensibility-overview.md):

### Add Column (Script)
Allows a column to be added to the data using a Python expression
[See Appendix 10 for more info](data-prep-appendix10-sample-custom-column-transforms-python.md)

### Advanced Filter (Script)
Allows a Python row level filter to be written
[See Appendix 6 for more info](data-prep-appendix6-sample-filter-expressions-python.md)

### Transform Dataflow (Script)
Allows python to be applied to the entire data set

[See Appendix 7 for more info](data-prep-appendix7-sample-transform-data-flow-python.md)

### Transform Dataflow (Script)
Allows python to be applied to an entire data partition

[See Appendix 7 for more info](data-prep-appendix7-sample-transform-data-flow-python.md)

### Write Dataflow (Script)
Allows python to be applied to writing out and entire data set
[See Appendix 10 for more info](data-prep-appendix9-sample-destination-connections-python.md)



