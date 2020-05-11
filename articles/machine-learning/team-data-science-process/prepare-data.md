---
title: Prep data for ML Studio (classic) - Team Data Science Process
description: Pre-process and clean data to prepare it to be used effectively for machine learning.
services: machine-learning
author: marktab
manager: marktab
editor: marktab
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 01/10/2020
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Tasks to prepare data for enhanced machine learning
Pre-processing and cleaning data are important tasks that must be conducted before a dataset can be used for model training. Raw data is often noisy and unreliable, and may be missing values. Using such data for modeling can produce misleading results. These tasks are part of the Team Data Science Process (TDSP) and typically follow an initial exploration of a dataset used to discover and plan the pre-processing required. For more detailed instructions on the TDSP process, see the steps outlined in the [Team Data Science Process](overview.md).

Pre-processing and cleaning tasks, like the data exploration task, can be carried out in a wide variety of environments, such as SQL or Hive or Azure Machine Learning Studio (classic), and with various tools and languages, such as R or Python, depending where your data is stored and how it is formatted. Since TDSP is iterative in nature, these tasks can take place at various steps in the  workflow of the process.

This article introduces various data processing concepts and tasks that can be undertaken either before or after ingesting data into Azure Machine Learning Studio (classic).

For an example of data exploration and pre-processing done inside Azure Machine Learning Studio (classic), see the [Pre-processing data](https://azure.microsoft.com/documentation/videos/preprocessing-data-in-azure-ml-studio/) video.

## Why pre-process and clean data?
Real world data is gathered from various sources and processes and it may contain irregularities or corrupt data compromising the quality of the dataset. The typical data quality issues that arise are:

* **Incomplete**: Data lacks attributes or containing missing values.
* **Noisy**: Data contains erroneous records or outliers.
* **Inconsistent**: Data contains conflicting records or discrepancies.

Quality data is a prerequisite for quality predictive models. To avoid "garbage in, garbage out" and improve data quality and therefore model performance, it is imperative to conduct a data health screen to spot data issues early and decide on the corresponding data processing and cleaning steps.

## What are some typical data health screens that are employed?
We can check the general quality of data by checking:

* The number of **records**.
* The number of **attributes** (or **features**).
* The attribute **data types** (nominal, ordinal, or continuous).
* The number of **missing values**.
* **Well-formed** data.
  * If the data is in TSV or CSV, check that the column separators and line separators always correctly separate columns and lines.
  * If the data is in HTML or XML format, check whether the data is well formed based on their respective standards.
  * Parsing may also be necessary in order to extract structured information from semi-structured or unstructured data.
* **Inconsistent data records**. Check the range of values are allowed. For example, if the data contains student GPA (grade point average), check if the GPA is in the designated range, say 0~4.

When you find issues with data, **processing steps** are necessary, which often involves cleaning missing values, data normalization, discretization, text processing to remove and/or replace embedded characters that may affect data alignment, mixed data types in common fields, and others.

**Azure Machine Learning consumes well-formed tabular data**.  If the data is already in tabular form, data pre-processing can be performed directly with Azure Machine Learning Studio (classic) in the Machine Learning.  If data is not in tabular form, say it is in XML, parsing may be required in order to convert the data to tabular form.  

## What are some of the major tasks in data pre-processing?
* **Data cleaning**:  Fill in missing values, detect, and remove noisy data and outliers.
* **Data transformation**:  Normalize data to reduce dimensions and noise.
* **Data reduction**:  Sample data records or attributes for easier data handling.
* **Data discretization**:  Convert continuous attributes to categorical attributes for ease of use with certain machine learning methods.
* **Text cleaning**: remove embedded characters that may cause data misalignment, for example, embedded tabs in a tab-separated data file, embedded new lines that may break records, for example.

The sections below detail some of these data processing steps.

## How to deal with missing values?
To deal with missing values, it is best to first identify the reason for the missing values to better handle the problem. Typical missing value handling methods are:

* **Deletion**: Remove records with missing values
* **Dummy substitution**: Replace missing values with a dummy value: e.g, *unknown* for categorical or 0 for numerical values.
* **Mean substitution**: If the missing data is numerical, replace the missing values with the mean.
* **Frequent substitution**: If the missing data is categorical, replace the missing values with the most frequent item
* **Regression substitution**: Use a regression method to replace missing values with regressed values.  

## How to normalize data?
Data normalization rescales numerical values to a specified range. Popular data normalization methods include:

* **Min-Max Normalization**: Linearly transform the data to a range, say between 0 and 1, where the min value is scaled to 0 and max value to 1.
* **Z-score Normalization**: Scale data based on mean and standard deviation: divide the difference between the data and the mean by the standard deviation.
* **Decimal scaling**: Scale the data by moving the decimal point of the attribute value.  

## How to discretize data?
Data can be discretized by converting continuous values to nominal attributes or intervals. Some ways of doing this are:

* **Equal-Width Binning**: Divide the range of all possible values of an attribute into N groups of the same size, and assign the values that fall in a bin with the bin number.
* **Equal-Height Binning**: Divide the range of all possible values of an attribute into N groups, each containing the same number of instances, then assign the values that fall in a bin with the bin number.  

## How to reduce data?
There are various methods to reduce data size for easier data handling. Depending on data size and the domain, the following methods can be applied:

* **Record Sampling**: Sample the data records and only choose the representative subset from the data.
* **Attribute Sampling**: Select only a subset of the most important attributes from the data.  
* **Aggregation**: Divide the data into groups and store the numbers for each group. For example, the daily revenue numbers of a restaurant chain over the past 20 years can be aggregated to monthly revenue to reduce the size of the data.  

## How to clean text data?
**Text fields in tabular data** may include characters that affect columns alignment and/or record boundaries. For example, embedded tabs in a tab-separated file cause column misalignment, and embedded new line characters break record lines. Improper text encoding handling while writing or reading text leads to information loss, inadvertent introduction of unreadable characters (like nulls), and may also affect text parsing. Careful parsing and editing may be required in order to clean text fields for proper alignment and/or to extract structured data from unstructured or semi-structured text data.

**Data exploration** offers an early view into the data. A number of data issues can be uncovered during this step and  corresponding methods can be applied to address those issues.  It is important to ask questions such as what is the source of the issue and how the issue may have been introduced. This process also helps you decide on the data processing steps that need to be taken to resolve them. Identifying the final use cases and personas can also be used to prioritize the data processing effort.

## References
> *Data Mining: Concepts and Techniques*, Third Edition, Morgan Kaufmann, 2011, Jiawei Han, Micheline Kamber, and Jian Pei
> 
> 

