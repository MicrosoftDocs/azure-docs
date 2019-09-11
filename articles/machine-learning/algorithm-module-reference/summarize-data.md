---
title:  "Summarize Data"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Summarize Data module in Azure Machine Learning service to generate a basic descriptive statistics report for the columns in a dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 09/09/2019
---

# Summarize Data

This article describes a module of Azure Machine Learning Designer.

Use the Summarize Data module in Azure Machine Learning Studio, to create a set of standard statistical measures that describe each column in the input table.

Such summary statistics are useful when you want to understand the characteristics of the complete dataset. For example, you might need to know:

- How many missing values are there in each column?
- How many unique values are there in a feature column?
- What is the mean and standard deviation for each column?

The module calculates the important scores for each column, and returns a row of summary statistics for each variable (data column) provided as input.

> [!TIP]
> You might already know that you can get a short list of statistics by using the **Visualize** option in Studio. However, this visualization is created based on some top number of rows. In contrast, the **Summarize Data** module computes its statistics on all rows of data.  

## How to configure Summarize Data  

1. Add the **Summarize Data** module to your experiment. You can find this module in the [Statistical Functions](statistical-functions.md) category in Studio.

2. Connect the dataset for which you want to generate a report.

    If you want to report on only some columns, use the [Select Columns in Dataset](select-columns-in-dataset.md) module to project a subset of columns to work with.

3. No additional parameters are required. By default, the module analyzes all columns that are provided as input, and depending on the type of values in the columns, outputs a relevant set of statistics as described in the [Results](#bkmk_Results) section.

4. Run the experiment, or right-click the module, and select **Run selected**.

## Results

The report from the module can include the following statistics. 

+ The exact statistics that are generated depend on the column data type. See the [Technical notes](#bkmk_Notes) section for details.

+ The assumption is made that the instances belong to a representative sample of a population. If you need to compute statistics on a population, use the options in the [Compute Elementary Statistics](compute-elementary-statistics.md) module, which can compute either sample or population statistics.

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


> [!TIP]
> 
> Output the statistics report as a tabular dataset, so that you can use the data in BI reporting tools, or use the values as input to another operation in the experiment.
  

## Technical notes

- For numeric and Boolean columns, you can output the mean, median, mode, and standard deviation. 

- For non-numeric columns, only the values for **Count**, **Unique value count**, and **Missing value count** are computed. For other statistics, a null value is returned.

- Columns that contain Boolean values are processed using these rules:

    - When calculating **Min**, a logical AND is applied.
    
    - When calculating **Max**, a logical OR is applied
    
    - When computing **Range**, the module first checks whether the number of unique values in the column equals 2.

    - When computing any statistic that requires floating-point calculations, values of True are treated as 1.0, and values of False are treated as 0.0.

## Expected inputs

|Name|Type|Description|  
|----------|----------|-----------------|  
|Dataset|[Data Table](data-table.md)|Input dataset|  

## Output

|Name|Type|Description|  
|----------|----------|-----------------|  
|Results dataset|[Data Table](data-table.md)|A profile of the input dataset that contains descriptive statistics|  

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service.  
