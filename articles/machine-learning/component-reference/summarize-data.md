---
title:  "Summarize Data"
titleSuffix: Azure Machine Learning
description: Learn how to use the Summarize Data component in Azure Machine Learning to generate a basic descriptive statistics report for the columns in a dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 01/27/2020
---

# Summarize Data

This article describes a component of Azure Machine Learning designer.

Use the Summarize Data component to create a set of standard statistical measures that describe each column in the input table.

Summary statistics are useful when you want to understand the characteristics of the complete dataset. For example, you might need to know:

- How many missing values are there in each column?
- How many unique values are there in a feature column?
- What is the mean and standard deviation for each column?

The component calculates the important scores for each column, and returns a row of summary statistics for each variable (data column) provided as input.

## How to configure Summarize Data  

1. Add the **Summarize Data** component to your pipeline. You can find this component in the **Statistical Functions** category in the designer.

1. Connect the dataset for which you want to generate a report.

    If you want to report on only some columns, use the [Select Columns in Dataset](select-columns-in-dataset.md) component to project a subset of columns to work with.

1. No additional parameters are required. By default, the component analyzes all columns that are provided as input, and depending on the type of values in the columns, outputs a relevant set of statistics as described in the [Results](#results) section.

1. Submit the pipeline.

## Results

The report from the component can include the following statistics. 

|Column name|Description|
|------|------|  
|**Feature**|Name of the column|
|**Count**|Count of all rows|
|**Unique Value Count**|Number of unique values in column|
|**Missing Value Count**|Number of unique values in column|
|**Min**|Lowest value in column|  
|**Max**|Highest value in column|
|**Mean**|Mean of all column values|
|**Mean Deviation**|Mean deviation of column values|
|**1st Quartile**|Value at first quartile|
|**Median**|Median column value|
|**3rd Quartile**|Value at third quartile|
|**Mode**|Mode of column values|
|**Range**|Integer representing the number of values between the maximum and minimum values|
|**Sample Variance**|Variance for column; see Note|
|**Sample Standard Deviation**|Standard deviation for column; see Note|
|**Sample Skewness**|Skewness for column; see Note|
|**Sample Kurtosis**|Kurtosis for column; see Note|
|**P0.5**|0.5% percentile|
|**P1**|1% percentile|
|**P5**|5% percentile|
|**P95**|95% percentile|
|**P99.5**|99.5% percentile |

## Technical notes

- For non-numeric columns, only the values for Count, Unique value count, and Missing value count are computed. For other statistics, a null value is returned.

- Columns that contain Boolean values are processed using these rules:

    - When calculating Min, a logical AND is applied.
    
    - When calculating Max, a logical OR is applied
    
    - When computing Range, the component first checks whether the number of unique values in the column equals 2.
    
    - When computing any statistic that requires floating-point calculations, values of True are treated as 1.0, and values of False are treated as 0.0.

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning.  
