<properties title="Preprocess Data" pageTitle="Preprocess Data | Azure" description="Preprocess Data" metaKeywords="" services="data-science-process" solutions="" documentationCenter="" authors="msolhab,xibingao" manager="jacob.spoelstra" editor="" videoId="" scriptId="" />

<tags ms.service="data-science-process" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="02/16/2015" ms.author="msolhab,xibingao" /> 


Preprocess Data
========================================

This article introduces the data preprocessing steps before ingesting data into Azure Machine Learning. 

----------------

1. **Why do we do data preprocessing and data cleaning**

	The data in real life are gathered from different sources, differenet processes, and possibly over an extended time span in which dirty data, more often than not, is introduced. As a result, the typical data quality issues that arise are:
	- incomplete. Lacking attributes or containing missing values
	- noisy. Containing erroneous data and outliers
	- inconsistent. Containing conflicting records or discrepant information
		
	Quality data produces quality predictive models. To avoid "garbage in, garbage out" and imporve the data quality and therefore model quality, typically a data health screening is necessary to spot data issues at an early stage and decide the corresponding data preprocessing and cleaning steps.

2. **What are the typical data health screenings?** 
	
	Typically we check the general quality of the data by checking:
    - the number of records.
    - the number of attributes (or features).
	- the attribute data types (nominal, ordinal, or continuous).
	- the number of missing values.
	- well formedness of the data. If the data is in tsv or csv, ask questions such as whether the column separators and line separators always correctly separate columns and lines? If the data contains Html or XML, check whether the data contains valid Htmls or XMLs.
	- any inconsistent data records. If the data contains the GPA of the students, check if the GPA is in the designated range, say 0~4. 

	When you find the issues about the data, processing steps are typically applied which often involves cleaning missing values, data normalization, and discretization. 
	
	Azure Machine Learning consumes well-formed tabular data.  If the data is already in tabular form, the preprocessing steps can be done with Azure Machine Learning.  If the data is not in tabular form, for example, XML, converting the data to tabular form is necessary.  

3. **What are some of the major tasks in data preprocessing?**

	- data cleaning.  Fill in missing values, detect and remove noises and outliers.
	- data transformation.  Normalize data to reduce dimension and noises.
	- data reduction.  Sample data records or attributes for easier data handling.
	- data discretization.  Convert continuous attributes to categorical attributes for the ease of use with certain machine learning methods.	
	
	The sections below details some of the data preprocessing steps.

4. **How to deal with missing values?**
	
	To deal with missing values, first identify the reasons for the missing values to better handle the problem. If the missing value is _student graduation date_, it may mean that the data is not available or considered important at the time of entry.  Typical missing value handling methods are:

	- deletion. Remove records with missing values
	- dummy substitution. Replace with missing values with a dummy value: e.g, _unknown_ for categorical or 0 for numerical values.
	- mean substitution. If the missing data is numerical, replace the missing values with the mean. 
	- frequent substitution. If the missing data is categorical, replace the missing values with the most frequent item 
	- regression substitution. Use regression method to replace missing values with regressed values.

5. **How to normalize data?**
	
	Normalization scales numerical values to a specified range. Popular data normalization methods includes:
	- min-max normalization. Linearly transform the data to a range, say between 0 and 1.  And the min is scaled to 0 and max to 1.
	- z-score normalization. Scale data based on mean and standard deviation: divide the difference between the data and the mean by the standard deviation.
	- decimal scaling. Scale the data by moving the decimal point of the attribute value.

6. **How to discretize data?**

	- equal-width binning. Divide the range of all possible values of an attribute into N groups of the same size, then assign the values that fall in a bin with the bin number.
	- equal-height binning. Divide the range of all possible values of an attribute into N groups containing the same number of instances, then assign the values that fall in a bin with the bin number.

7. **How to reduce data?**
	
	There are various methods to reduce the data size for easier data handling. Depending on the size and domains, data reduction methods below can be applied: 
	- records sampling Sample the data records and only choose the representative subset form the data. 
	- attribute sampling. Select only important attributes from the data.  
	- aggregation. Divide the data into groups and store the numbers for each group. For example, the daily revenue numbers of a restaurant chain over the past 20 years can be aggregated to monthly revenue to reduce the size of the data.

Data preprocessing steps offer an early expedition into the data during which data issues can be uncovered and  corresponding methods can be applied to address those issues.  It is important to ask questions such as what is the source of the data, how the data issues are introduced, and what are the data processing targets. It is also critical to think kind of insights can be discovered from the data and therefore it helps prioritize the data processing efforts. 

**Reference**
	
>_Data Mining: Concepts and Techniques_, Third Edition, Morgan Kaufmann, 2011, Jiawei Han, Micheline Kamber, and Jian Pei