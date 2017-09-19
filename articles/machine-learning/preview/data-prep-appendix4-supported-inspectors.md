---
title: Supported inspectors available with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a complete list of inspectors available for Azure ML data prep
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
ms.date: 09/11/2017
---
# Supported Inspectors for this preview
This document outlines the set of Inspectors available in this preview.
 
## The halo effect 
Some Inspectors support the Halo effect, this effect uses two different colors to immediately show the change visually from a transform. The gray represents the previous value prior to the latest transform, the blue shows the current value. This effect can be enabled/disabled in options.

## Graphical filtering 
Some of the Inspectors support filtering of data by using the Inspector as an editor. Doing so involves selection of graphical elements and then the use of the toolbar in the top right of the Inspector window to filter in or out the selected values. 

## Column statistics
For numeric columns, this inspector provides a variety of different stats about the column. Statistics include;
- Minimum
- Lower Quartile
- Median
- Upper Quartile
- Maximum
- Average
- Standard Deviation


### Options 
- None

## Histogram 
Computes and displays a Histogram of a single numeric column. Default number of buckets is calculated using Scott’s Rule, the rule can be overridden via the Options.
This Inspector supports the Halo effect.


### Options
- Minimum Number of Buckets (applies even when default bucketing is checked)
- Default Number of Buckets (Scott's Rule) 
- Show halo
- Kernel Density Plot Overlay (Gaussian Kernel) 


### Actions
This Inspector supports filtering via the buckets, single or multi select buckets and apply filters as previously described.

## Value Counts
This Inspector presents a frequency table of values for the currently select column. The default display is for the top 6, the limit can be changed to be any number or to count from the bottom not top. This Inspector supports the Halo effect.

### Options 
- Number of Top Values
- Descending
- Include null/error values
- Show halo


### Actions 
This Inspector supports filtering via the bars, single or multi select bars and apply filters as previously described.

## Box Plot 
A box whisker plot of a numeric column

### Options 
- Group By Column

## Scatter Plot
A scatter plot for two numeric columns, the data is down sampled for performance reasons, the sample size can be overridden in the options.

### Options  
- X-Axis Column
- Y-Axis Column
- Sample Size
- Group by Column


## Time Series
A line graph with time awareness on the X- Axis

### Options
- Date Column
- Numeric Column
- Sample Size


### Actions
This inspector supports filtering via a Click and Drag Select method to select a range on the graph. After completing selection, apply filters as previously described.


## Map 
A map with points plotted assuming latitude and longitude have been specified. Latitude must be selected first.

### Options
- Latitude Column
- Longitude Column
- Clustering On
- Group by Column


### Actions
This Inspector supports filtering via point selection on the map. Press the control key and then click and drag with the mouse to form a square around the points. Then apply filters as previously described.
It is possible to quickly size the map to show all the possible points and no more by pressing the **E** on the left-hand side of the map.
