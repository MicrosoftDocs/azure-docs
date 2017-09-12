# Supported Transforms for this Release #

## Transforms from Main Menu and/or grid Header ##

## Derive Column by Example ##
Add a new blank column, type an example of what you wish to see in the column (assuming it is derived from other columns) and the “By Example” technology will attempt to fill in all the other cells in the column. 

For complicated examples it may be necessary to provide more than one example, simple select another cell and type another example.

If no columns are selected when this transform is created, then the “By Example” technology will use all the cells in the row which you type the example into to determine what your example means. If you select a subset of columns (one or more) then the “By Example” technology will use only those columns, this can sometimes lead to a better, more precise set of data being generated.

## Split Column by Example ##
Takes an existing column and using the “By Example” engine attempts to split that column into n other columns. It is possible to run the Auto-Split on the subsequent generated columns.

## Expand JSON ##

## Combine Column by Example ##

## Duplicate Column ##

## Text Clustering ##

## Replace Values ##
Choose a value to be replaced.
Enter a value to use in the replacement.
Match Entire Cell Contents.
Special Character handling.

## Replace NA Values ##
Allows the various different incarnations of NA (N/A, NA, null, NaN,) or empty strings with a null to make them consistent. Supports 1:n columns.

## Trim String ##
Remove leading and trailing whitespaces.

## Handle Missing Values ##
For a given column or set of columns find all the rows that have missing values and then delete all those rows or replace the missing value with a fixed value.

## Handle Error Values ##

## Adjust Precision ##
Allows the number of decimal places for a numeric column to be set

## Rename Column ##
Changes the name of the column

## Remove Column ##
Removes a column from that point forward in the step list

## Keep Column ##

## Handle Path Column ##

## Convert Field Type to Numeric ##
Change the column type

## Convert Field Type to Date ##
Change the column type

## Convert Field Type to Boolean ##
Change the column type

## Convert Field Type to String ##
Change the column type

## Convert Unix Timestamp to DateTime##

## Use first row as headers ##

## Join ##
Join 2 Dataflows together via a single column, provides the ability to handle the success rows and the left and right failing rows separately.

## Summarize ##
Select a column(s) and compute aggregates for that combination of unique values.

Aggregates supported:  COUNT, SUM, MIN, MAX, MEAN, VARIANCE, STANDARD DEVIATION

Analogous to an ANSI-SQL GROUP BY

##Remove Duplicates##

## Sort ##
Reorder the dataset

Analogous to an ANSI-SQL ORDER BY

##Add Column (Script)##
Allows a column to be added to the data using a Python expression

##Advanced Filter (Script)##
Allows a Python row level filter to be written
[See Appendix 6 for more info](data-prep-appendix6-sample-filter-expressions-python.md)

##Transform Dataflow (Script)##
Write Python code to perform a transformation on the entire table. This transform allows multiple columns to be added and for the entire table to be operated on.

[See Appendix 7 for more info](data-prep-appendix6-sample-filter-expressions-python.md)

##Write Dataflow (Script)##

##Write To CSV##

##Write to Parquet##


