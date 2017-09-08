# Supported Inspectors for this Release #

## Column Statistics ##
For numeric columns provides a variety of different stats about the column including;
Min, Max, Median, Average, Standard Deviation, Lower Quartile, Upper Quartile

### Options ###
None

## Histogram ##
Histogram of a numeric column. Default number of buckets is calculated using Scott’s Rule.

### Options ###
Number of Buckets
Halo
Kernel Density Overlay

### Actions ###
Select buckets and Filter in or Filter out via toolbar.

## Value Counts ##
Frequency table for string columns.

### Options ###
Number of values to include
Ascending/Descending
Halo

### Actions ###
Select values and Filter in or Filter out via toolbar.

## Box Plot ##
A box whisker plot of a numeric column

### Options  ###
Group By Column

## Scatter Plot ##
A scatter plot for 2 numeric columns

### Options ###  
Group By Column
Sample Size

## Time Series ##
A line graph with time awareness on the X- Axis

### Options ###
Sample Size
Group By Column

### Actions ###
Select values and Filter in or Filter out via toolbar


## Map ##
A map with points plotted assuming latitude and longitude have been specified. Latitude must be selected first.

### Options ###
Clustering on/off
Latitude column
Longitude column
Group By Column

### Actions ###
Select (by CTRL Clicking and Dragging) and Filter in or Filter out via the toolbar.
