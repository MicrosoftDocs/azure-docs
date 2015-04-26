<properties 
	pageTitle="Preprocess and Clean Data | Azure" 
	description="Preprocess and Clean Data" 
	metaKeywords="data cleansing" 
	services="machine-learning" 
	documentationCenter="" 
	authors="xibingaomsft,msolhab" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/16/2015" 
	ms.author="xibingaomsft,msolhab" /> 


Preprocess and Clean Data
========================================
Raw data is often noisy, unreliable and may be missing values. Using such data for modeling can produce misleading results. Preprocessing and cleaning data is an important step that must be conducted before using a dataset for machine learning. This article introduces various data preprocessing steps that can be taken before ingesting data into Azure Machine Learning. 

----------------

1. **Why preprocess and clean data?**

	Real world data is gathered from various sources and processes and it may contain irregularities or corrupt data compromising the quality of the dataset. The typical data quality issues that arise are:
	- Incomplete: Data lacks attributes or containing missing values.
	- Noisy: Data contains erroneous records or outliers.
	- Inconsistent: Data contains conflicting records or discrepancies. 
		
	Quality data is a pre-requisite for quality predictive models. To avoid "garbage in, garbage out" and improve data quality and therefore model quality, it is imperative to conduct a data health screen to spot data issues early and decide on the corresponding data preprocessing and cleaning steps.

2. **What are some typical data health screens that are employed?** 
	
	We can check the general quality of data by checking:
    - The number of records.
    - The number of attributes (or features).
	- The attribute data types (nominal, ordinal, or continuous).
	- The number of missing values.
	- Well formedness of the data. If the data is in tsv or csv, questions whether the column separators and line separators always correctly separate columns and lines. If the data is in HTML or XML format, check whether the data is well formed based on the respective standards. Parsing may also be necessary in order to extract structured information from semi-structured or unstructured data.
	- Inconsistent data records. e.g. If the data contains student GPA, check if the GPA is in the designated range, say 0~4. 

	When you find issues with data, processing steps are necessary which often involves cleaning missing values, data normalization, discretization, text processing to remove and/or replace embedded characters which may affect data alignment, mixed data types in common fields, and others. 
	
	Azure Machine Learning consumes well-formed tabular data.  If the data is already in tabular form, data preprocessing can be performed directly with Azure Machine Learning in the ML Studio.  If data is not in tabular form, say XML, parsing may be required in order to convert the data to tabular form.  

3. **What are some of the major tasks in data preprocessing?**

	- Data cleaning:  Fill in or missing values, detect and remove noisy data and outliers.
	- Data transformation:  Normalize data to reduce dimensions and noise.
	- Data reduction:  Sample data records or attributes for easier data handling.
	- Data discretization:  Convert continuous attributes to categorical attributes for ease of use with certain machine learning methods.
	- Text cleaning: remove embedded characters which may cause data misalignment, for e.g., embedded tabs in a tab-separated data file, embedded new lines which may break records, etc.	
	
	The sections below details some of the data preprocessing steps.

4. **How to deal with missing values?**
	
	To deal with missing values, it is best to first identify the reason for the missing values to better handle the problem. Typical missing value handling methods are:

	- Deletion: Remove records with missing values
	- Dummy substitution: Replace missing values with a dummy value: e.g, _unknown_ for categorical or 0 for numerical values.
	- Mean substitution: If the missing data is numerical, replace the missing values with the mean. 
	- Frequent substitution: If the missing data is categorical, replace the missing values with the most frequent item 
	- Regression substitution: Use regression method to replace missing values with regressed values.  

5. **How to normalize data?**
	
	Data normalization scales numerical values to a specified range. Popular data normalization methods include:
	- Min-Max Normalization: Linearly transform the data to a range, say between 0 and 1.  And the min is scaled to 0 and max to 1.
	- Z-score Normalization: Scale data based on mean and standard deviation: divide the difference between the data and the mean by the standard deviation.
	- Decimal scaling: Scale the data by moving the decimal point of the attribute value.  

6. **How to discretize data?**  

	Data can be discretized by converting continuous values to nominal attributes or intervals. Some ways of doing this are:
	- Equal-Width Binning: Divide the range of all possible values of an attribute into N groups of the same size, and assign the values that fall in a bin with the bin number.
	- Equal-Height Binning: Divide the range of all possible values of an attribute into N groups containing the same number of instances, then assign the values that fall in a bin with the bin number.  

7. **How to reduce data?**  

	There are various methods to reduce data size for easier data handling. Depending on data size and the domain, the following methods can be applied: 
	- Record Sampling: Sample the data records and only choose the representative subset from the data. 
	- Attribute Sampling: Select only important attributes from the data.  
	- Aggregation: Divide the data into groups and store the numbers for each group. For example, the daily revenue numbers of a restaurant chain over the past 20 years can be aggregated to monthly revenue to reduce the size of the data.  

8. **How to clean text data?**  

	Text fields in tabular data may include characters which affect columns alignment and/or record boundaries. For e.g., embedded tabs in a tab-separated file cause column misalignment, and embedded new line characters break record lines. Improper text encoding handling while writing/reading text leads to information loss, inadvertent introduction of unreadable chanracters, e.g., nulls, and may also affect text parsing. Careful parsing and editing may be required in order to clean text fields for proper alignment and/or to extract structured data from unstructured or semi-structured text data.

Data exploration offers an early view into the data. A number of data issues can be uncovered during this step and  corresponding methods can be applied to address those issues.  It is important to ask questions such as what is the source of the issue and how the issue may have been introduced. This also helps you decide on the data processing steps that need to be taken to resolve them. The kind of insights one intends to derive from the data can also be used to prioritize the data processing effort.

**Reference**
	
>_Data Mining: Concepts and Techniques_, Third Edition, Morgan Kaufmann, 2011, Jiawei Han, Micheline Kamber, and Jian Pei
