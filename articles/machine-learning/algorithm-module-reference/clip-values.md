---
title:  "Clip Values"
titleSuffix: Azure Machine Learning
description: Learn how to use the Clip Values module in Azure Machine Learning to detect outliers and clip or replace their values.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 09/09/2019
---

# Clip Values

This article describes a module of Azure Machine Learning designer (preview).

Use the Clip Values module to identify and optionally replace data values that are above or below a specified threshold with a mean, a constant, or other substitute value.  

You connect the module to a dataset that has the numbers you want to clip, choose the columns to work with, and then set a threshold or range of values, and a replacement method. The module can output either just the results, or the changed values appended to the original dataset.

## How to configure Clip Values

Before you begin, identify the columns you want to clip, and the method to use. We recommend that you test any clipping method on a small subset of data first.

The module applies the same criteria and replacement method to **all** columns that you include in the selection. Therefore, be sure to exclude columns that you don't want to change.

If you need to apply clipping methods or different criteria to some columns, you must use a new instance of **Clip Values** for each set of similar columns.

1.  Add the **Clip Values** module to your pipeline and connect it to the dataset you want to modify. You can find this module under **Data Transformation**, in the **Scale and Reduce** category. 
  
1.  In **List of columns**, use the Column Selector to choose the columns to which **Clip Values** will be applied.  
  
1.  For **Set of thresholds**, choose one of the following options from the dropdown list. These options determine how you set the upper and lower boundaries for acceptable values vs. values that must be clipped.  
  
    - **ClipPeaks**: When you clip values by peaks, you specify only an upper boundary. Values greater than that boundary value are replaced.
  
    -  **ClipSubpeaks**: When you clip values by subpeaks, you specify only a lower boundary. Values that are less than that boundary value are replaced.  
  
    - **ClipPeaksAndSubpeaks**: When you clip values by peaks and subpeaks, you can specify both the upper and lower boundaries. Values that are outside that range are replaced. Values that match the boundary values are not changed.
  
1.  Depending on your selection in the preceding step, you can set the following threshold values: 

    + **Lower threshold**: Displayed only if you choose **ClipSubPeaks**
    + **Upper threshold**: Displayed only if you choose **ClipPeaks**
    + **Threshold**: Displayed only if you choose **ClipPeaksAndSubPeaks**

    For each threshold type, choose either **Constant** or **Percentile**.

1. If you select **Constant**, type the maximum or minimum value in the text box. For example, assume that you know the value 999 was used as a placeholder value. You could choose **Constant** for the upper threshold, and type 999 in **Constant value for upper threshold**.
  
1. If you choose **Percentile**, you constrain the column values to a percentile range. 

    For example, assume you want to keep only the values in the 10-80 percentile range, and replace all others. You would choose **Percentile**, and then type 10 for **Percentile value for lower threshold**, and type 80 for **Percentile value for upper threshold**. 

    See the section on [percentiles](#examples-for-clipping-using-percentiles) for some examples of how to use percentile ranges.  
  
1.  Define a substitute value.

    Numbers that exactly match the boundaries you specified are considered to be inside the allowed range of values, and thus are not replaced. All numbers that fall outside the specified range are replaced with the substitute value. 
  
    + **Substitute value for peaks**: Defines the value to substitute for all column values that are greater than the specified threshold.  
    + **Substitute value for subpeaks**: Defines the value to use as a substitute for all column values that are less than the specified threshold.  
    + If you use the **ClipPeaksAndSubpeaks** option, you can specify separate replacement values for the upper and lower clipped values.  

    The following replacement values are supported:  
  
    -   **Threshold**: Replaces clipped values with the specified threshold value.  
  
    -   **Mean**: Replaces clipped values with the mean of the column values. The mean is computed before values are clipped.  
  
    -   **Median**: Replaces clipped values with the median of the column values. The median is computed before values are clipped.   
  
    -   **Missing**. Replaces clipped values with the missing (empty) value.  
  
1.  **Add indicator columns**: Select this option if you want to generate a new column that tells you whether or not the specified clipping operation applied to the data in that row. This option is useful when you are testing a new set of clipping and substitution values.  
  
1. **Overwrite flag**: Indicate how you want the new values to be generated. By default, **Clip Values** constructs a new column with the peak values clipped to the desired threshold. New values overwrite the original column.  
  
    To keep the original column and add a new column with the clipped values, deselect this option.  
  
1.  Submit the pipeline.  
  
    Right-click the **Clip Values** module and select **Visualize** or select the module and switch to the **Outputs** tab in the right panel, click on the histogram icon in the **Port outputs**, to review the values and make sure the clipping operation met your expectations.  
 
### Examples for clipping using percentiles

To understand how clipping by percentiles works, consider a dataset with 10 rows, which have one instance each of the values 1-10.  
  
- If you are using percentile as the upper threshold, at the value for the 90th percentile, 90 percent of all values in the dataset must be less than that value.  
  
- If you are using percentile as the lower threshold, at the value for the 10th percentile, 10 percent of all values in the dataset must be less than that value.  
  
1.  For **Set of thresholds**, choose **ClipPeaksAndSubPeaks**.  
  
1.  For **Upper threshold**, choose **Percentile**, and for **Percentile number**, type 90.  
  
1.  For **Upper substitute value**, choose **Missing Value**.  
  
1.  For **Lower threshold**, choose **Percentile**, and for **Percentile number**, type 10.  
  
1.  For **Lower substitute value**, choose **Missing Value**.  
  
1.  Deselect the option **Overwrite flag**, and select the option, **Add indicator column**.  
  
Now try the same pipeline using 60 as the upper percentile threshold and 30 as the lower percentile threshold, and use the threshold value as the replacement value. The following table compares these two results:  
  
1.  Replace with missing; Upper threshold = 90; Lower threshold = 20  
  
1.  Replace with threshold; Upper percentile = 60; Lower percentile = 40  
  
|Original data|Replace with missing|Replace with threshold|  
|-------------------|--------------------------|----------------------------|  
|1<br /><br /> 2<br /><br /> 3<br /><br /> 4<br /><br /> 5<br /><br /> 6<br /><br /> 7<br /><br /> 8<br /><br /> 9<br /><br /> 10|TRUE<br /><br /> TRUE<br /><br /> 3, FALSE<br /><br /> 4, FALSE<br /><br /> 5, FALSE<br /><br /> 6, FALSE<br /><br /> 7, FALSE<br /><br /> 8, FALSE<br /><br /> 9, FALSE<br /><br /> TRUE|4, TRUE<br /><br /> 4, TRUE<br /><br /> 4, TRUE<br /><br /> 4, TRUE<br /><br /> 5, FALSE<br /><br /> 6, FALSE<br /><br /> 7, TRUE<br /><br /> 7, TRUE<br /><br /> 7, TRUE<br /><br /> 7, TRUE| 
 
## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
