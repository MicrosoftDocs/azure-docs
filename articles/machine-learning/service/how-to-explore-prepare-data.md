---
title: Explore and prepare data
titleSuffix: Azure Machine Learning service
description: Learn how to explore data using summary statistics and prepare data through data cleaning, transformation, and feature engineering
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sihhu
author: MayMSFT
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 04/11/19

---

# Explore and prepare data

Historically, data preparation has been very time consuming. With Azure Machine Learning SDK, you are now able to explore Datasets easily through summary statistics and prepare your data with intelligent transformation methods powered by AI. Transformation steps are saved in Dataset definitions, with the capability to handle multiple large files of different schemas in a highly scalable manner. 

In this article, you will learn how to create data profiles and different transformation methods to get your data ready for machine learning.

## Prerequisites

You do not need Azure subscriptions or workspaces to explore and prepare data. You can take create a Dataset locally, explore and prepare your data, then register the Dataset with Azure workspace for reuse and sharing.

To download the sample files used in the following examples: [crime.csv](https://dprepdata.blob.core.windows.net/dataset-sample-files/crime.csv), [city.json](https://dprepdata.blob.core.windows.net/dataset-sample-files/city.json).

## Sampling

When dealing with big data, it is common practice to sample your data before preparation in order to save processing time and compute cost. Datasets support Top N, Simple Random, and Stratified sampling.

```Python
from azureml.core import Dataset
import random

# create an in-memory Dataset from a local file
dataset = Dataset.auto_read_files('./data/crime.csv')

# create seed for Simple Random and Stratified sampling
seed = random.randint(0, 4294967295)
```

Top N sampling will keep the number of records specified from the top of your Dataset and return a modified Dataset.

```python
top_n_sample_dataset = dataset.sample('top_n', {'n': 5})
top_n_sample_dataset.to_pandas_dataframe()
```

||ID|Case Number|Date|Block|IUCR|Primary Type|...|
-|--|-----------|----|-----|----|------------|---
0|10498554|HZ239907|4/4/2016 23:56|007XX E 111TH ST|1153|DECEPTIVE PRACTICE|...
1|10516598|HZ258664|4/15/2016 17:00|082XX S MARSHFIELD AVE|890|THEFT|...
2|10519196|HZ261252|4/15/2016 10:00|104XX S SACRAMENTO AVE|1154|DECEPTIVE PRACTICE|...
3|10519591|HZ261534|4/15/2016 9:00|113XX S PRAIRIE AVE|1120|DECEPTIVE PRACTICE|...
4|10534446|HZ277630|4/15/2016 10:00|055XX N KEDZIE AVE|890|THEFT|...

Simple Random sampling will keep the records from your Dataset based on the probability specified and return a modified Dataset. The seed parameter is optional.

```python
simple_random_sample_dataset = dataset.sample('simple_random', {'probability':0.3, 'seed': seed})
simple_random_sample_dataset.to_pandas_dataframe()
```

||ID|Case Number|Date|Block|IUCR|Primary Type|...|
-|--|-----------|----|-----|----|------------|---
0|10516598|HZ258664|4/15/2016 17:00|082XX S MARSHFIELD AVE|890|THEFT|...
1|10519196|HZ261252|4/15/2016 10:00|104XX S SACRAMENTO AVE|1154|DECEPTIVE PRACTICE|...
2|10534446|HZ277630|4/15/2016 10:00|055XX N KEDZIE AVE|890|THEFT|...
3|10525877|HZ268138|4/15/2016 15:00|023XX W EASTWOOD AVE|1153|DECEPTIVE PRACTICE|...

Stratified sampling will keep the records from your Dataset based on the strata, strata weights and the probability to sample each stratum with. For all records, we will group each record by the columns specified to stratify and based on the stratum X weight information in fractions, include said record. If a stratum is not specified or the record cannot be grouped by said stratum, the default weight to sample is 0.

```python
# we will take 50% of records with `Primary Type` as `THEFT` and 20% of records with `Primary Type` as `DECEPTIVE PRACTICE` into sample Dataset
fractions = {}
fractions[('THEFT',)] = 0.5
fractions[('DECEPTIVE PRACTICE',)] = 0.2

sample_dataset = dataset.sample('stratified', {'columns': ['Primary Type'], 'fractions': fractions, 'seed': seed})
      
sample_dataset.to_pandas_dataframe()
```

||ID|Case Number|Date|Block|IUCR|Primary Type|...|
-|--|-----------|----|-----|----|------------|---
0|10516598|HZ258664|4/15/2016 17:00|082XX S MARSHFIELD AVE|890|THEFT|...
1|10534446|HZ277630|4/15/2016 10:00|055XX N KEDZIE AVE|890|THEFT|...
2|10535059|HZ278872|4/15/2016 4:30|004XX S KILBOURN AVE|810|THEFT|...
3|10525877|HZ268138|4/15/2016 15:00|023XX W EASTWOOD AVE|1153|DECEPTIVE PRACTICE|...


## Explore data through summary statistics

Data exploration is essential to help you understand the input data, identify anomalies and missing values, and verify that data preparation operations produced the desired result.

```Python
# generate profile with local compute
dataset.get_profile()
```
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Type</th>
      <th>Min</th>
      <th>Max</th>
      <th>Count</th>
      <th>Missing Count</th>
      <th>Not Missing Count</th>
      <th>Percent missing</th>
      <th>Error Count</th>
      <th>Empty count</th>
      <th>0.1% Quantile</th>
      <th>1% Quantile</th>
      <th>5% Quantile</th>
      <th>25% Quantile</th>
      <th>50% Quantile</th>
      <th>75% Quantile</th>
      <th>95% Quantile</th>
      <th>99% Quantile</th>
      <th>99.9% Quantile</th>
      <th>Mean</th>
      <th>Standard Deviation</th>
      <th>Variance</th>
      <th>Skewness</th>
      <th>Kurtosis</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>ID</th>
      <td>FieldType.INTEGER</td>
      <td>1.04986e+07</td>
      <td>1.05351e+07</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>1.04986e+07</td>
      <td>1.04992e+07</td>
      <td>1.04986e+07</td>
      <td>1.05166e+07</td>
      <td>1.05209e+07</td>
      <td>1.05259e+07</td>
      <td>1.05351e+07</td>
      <td>1.05351e+07</td>
      <td>1.05351e+07</td>
      <td>1.05195e+07</td>
      <td>12302.7</td>
      <td>1.51358e+08</td>
      <td>-0.495701</td>
      <td>-1.02814</td>
    </tr>
    <tr>
      <th>Case Number</th>
      <td>FieldType.STRING</td>
      <td>HZ239907</td>
      <td>HZ278872</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Date</th>
      <td>FieldType.DATE</td>
      <td>2016-04-04 23:56:00+00:00</td>
      <td>2016-04-15 17:00:00+00:00</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Block</th>
      <td>FieldType.STRING</td>
      <td>004XX S KILBOURN AVE</td>
      <td>113XX S PRAIRIE AVE</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>IUCR</th>
      <td>FieldType.INTEGER</td>
      <td>810</td>
      <td>1154</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>810</td>
      <td>850</td>
      <td>810</td>
      <td>890</td>
      <td>1136</td>
      <td>1153</td>
      <td>1154</td>
      <td>1154</td>
      <td>1154</td>
      <td>1058.5</td>
      <td>137.285</td>
      <td>18847.2</td>
      <td>-0.785501</td>
      <td>-1.3543</td>
    </tr>
    <tr>
      <th>Primary Type</th>
      <td>FieldType.STRING</td>
      <td>DECEPTIVE PRACTICE</td>
      <td>THEFT</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Description</th>
      <td>FieldType.STRING</td>
      <td>BOGUS CHECK</td>
      <td>OVER $500</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Location Description</th>
      <td>FieldType.STRING</td>
      <td></td>
      <td>SCHOOL, PUBLIC, BUILDING</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>1.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Arrest</th>
      <td>FieldType.BOOLEAN</td>
      <td>False</td>
      <td>False</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Domestic</th>
      <td>FieldType.BOOLEAN</td>
      <td>False</td>
      <td>False</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Beat</th>
      <td>FieldType.INTEGER</td>
      <td>531</td>
      <td>2433</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>531</td>
      <td>531</td>
      <td>531</td>
      <td>614</td>
      <td>1318.5</td>
      <td>1911</td>
      <td>2433</td>
      <td>2433</td>
      <td>2433</td>
      <td>1371.1</td>
      <td>692.094</td>
      <td>478994</td>
      <td>0.105418</td>
      <td>-1.60684</td>
    </tr>
    <tr>
      <th>District</th>
      <td>FieldType.INTEGER</td>
      <td>5</td>
      <td>24</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>5</td>
      <td>5</td>
      <td>5</td>
      <td>6</td>
      <td>13</td>
      <td>19</td>
      <td>24</td>
      <td>24</td>
      <td>24</td>
      <td>13.5</td>
      <td>6.94822</td>
      <td>48.2778</td>
      <td>0.0930109</td>
      <td>-1.62325</td>
    </tr>
    <tr>
      <th>Ward</th>
      <td>FieldType.INTEGER</td>
      <td>1</td>
      <td>48</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>1</td>
      <td>5</td>
      <td>1</td>
      <td>9</td>
      <td>22.5</td>
      <td>40</td>
      <td>48</td>
      <td>48</td>
      <td>48</td>
      <td>24.5</td>
      <td>16.2635</td>
      <td>264.5</td>
      <td>0.173723</td>
      <td>-1.51271</td>
    </tr>
    <tr>
      <th>Community Area</th>
      <td>FieldType.INTEGER</td>
      <td>4</td>
      <td>77</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>4</td>
      <td>8.5</td>
      <td>4</td>
      <td>24</td>
      <td>37.5</td>
      <td>71</td>
      <td>77</td>
      <td>77</td>
      <td>77</td>
      <td>41.2</td>
      <td>26.6366</td>
      <td>709.511</td>
      <td>0.112157</td>
      <td>-1.73379</td>
    </tr>
    <tr>
      <th>FBI Code</th>
      <td>FieldType.INTEGER</td>
      <td>6</td>
      <td>11</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>6</td>
      <td>6</td>
      <td>6</td>
      <td>6</td>
      <td>11</td>
      <td>11</td>
      <td>11</td>
      <td>11</td>
      <td>11</td>
      <td>9.4</td>
      <td>2.36643</td>
      <td>5.6</td>
      <td>-0.702685</td>
      <td>-1.59582</td>
    </tr>
    <tr>
      <th>X Coordinate</th>
      <td>FieldType.INTEGER</td>
      <td>1.16309e+06</td>
      <td>1.18336e+06</td>
      <td>10.0</td>
      <td>7.0</td>
      <td>3.0</td>
      <td>0.7</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>1.16309e+06</td>
      <td>1.16309e+06</td>
      <td>1.16309e+06</td>
      <td>1.16401e+06</td>
      <td>1.16678e+06</td>
      <td>1.17921e+06</td>
      <td>1.18336e+06</td>
      <td>1.18336e+06</td>
      <td>1.18336e+06</td>
      <td>1.17108e+06</td>
      <td>10793.5</td>
      <td>1.165e+08</td>
      <td>0.335126</td>
      <td>-2.33333</td>
    </tr>
    <tr>
      <th>Y Coordinate</th>
      <td>FieldType.INTEGER</td>
      <td>1.8315e+06</td>
      <td>1.908e+06</td>
      <td>10.0</td>
      <td>7.0</td>
      <td>3.0</td>
      <td>0.7</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>1.8315e+06</td>
      <td>1.8315e+06</td>
      <td>1.8315e+06</td>
      <td>1.83614e+06</td>
      <td>1.85005e+06</td>
      <td>1.89352e+06</td>
      <td>1.908e+06</td>
      <td>1.908e+06</td>
      <td>1.908e+06</td>
      <td>1.86319e+06</td>
      <td>39905.2</td>
      <td>1.59243e+09</td>
      <td>0.293465</td>
      <td>-2.33333</td>
    </tr>
    <tr>
      <th>Year</th>
      <td>FieldType.INTEGER</td>
      <td>2016</td>
      <td>2016</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>2016</td>
      <td>2016</td>
      <td>2016</td>
      <td>2016</td>
      <td>2016</td>
      <td>2016</td>
      <td>2016</td>
      <td>2016</td>
      <td>2016</td>
      <td>2016</td>
      <td>0</td>
      <td>0</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>Updated On</th>
      <td>FieldType.DATE</td>
      <td>2016-05-11 15:48:00+00:00</td>
      <td>2016-05-27 15:45:00+00:00</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Latitude</th>
      <td>FieldType.DECIMAL</td>
      <td>41.6928</td>
      <td>41.9032</td>
      <td>10.0</td>
      <td>7.0</td>
      <td>3.0</td>
      <td>0.7</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>41.6928</td>
      <td>41.6928</td>
      <td>41.6928</td>
      <td>41.7057</td>
      <td>41.7441</td>
      <td>41.8634</td>
      <td>41.9032</td>
      <td>41.9032</td>
      <td>41.9032</td>
      <td>41.78</td>
      <td>0.109695</td>
      <td>0.012033</td>
      <td>0.292478</td>
      <td>-2.33333</td>
    </tr>
    <tr>
      <th>Longitude</th>
      <td>FieldType.DECIMAL</td>
      <td>-87.6764</td>
      <td>-87.6043</td>
      <td>10.0</td>
      <td>7.0</td>
      <td>3.0</td>
      <td>0.7</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>-87.6764</td>
      <td>-87.6764</td>
      <td>-87.6764</td>
      <td>-87.6734</td>
      <td>-87.6645</td>
      <td>-87.6194</td>
      <td>-87.6043</td>
      <td>-87.6043</td>
      <td>-87.6043</td>
      <td>-87.6484</td>
      <td>0.0386264</td>
      <td>0.001492</td>
      <td>0.344429</td>
      <td>-2.33333</td>
    </tr>
    <tr>
      <th>Location</th>
      <td>FieldType.STRING</td>
      <td></td>
      <td>(41.903206037, -87.676361925)</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>7.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

## How to impute missing values

Missing values in Datasets include Null values, and values that contain no content or non-existent. They can impact the performance of your machine learning models, or even lead to invalid conclusions. Imputation is one common approach to deal with missing values by filling values in the place of missing data. It is useful when you have relatively high percentage of missing values in your Datasets, and you cannot simply drop all records with missing values. 

From the Dataset profile generated above, we can see that `Latitude` and `Longitude` columns have high percentage of missing values. In this example, we will impute missing values for those 2 columns.

```python
# get the latest definition of Dataset
ds_def = dataset.get_definition()

# keep useful columns for this example
ds_def = ds_def.keep_columns(['ID', 'Arrest', 'Latitude', 'Longitude'])
ds_def.head(5)
```

||ID|Arrest| Latitude|Longitude|
-|---------|-----|---------|----------|
|0|10498554|False|41.692834|-87.604319|
|1|10516598|False| 41.744107 |-87.664494|
|2|10519196|False| NaN|NaN|
|3|10519591|False| NaN|NaN|
|4|10534446|False| NaN|NaN|

Some records miss latitude and longitude values. To impute those missing values, you use `ImputeMissingValuesBuilder` to learn a fixed expression. It can impute the columns with either a calculated `MIN`, `MAX`, `MEAN` value, or a `CUSTOM` value. When `group_by_columns` is specified, missing values will be imputed by group with `MIN`, `MAX`, and `MEAN` calculated per group.
Check the `MEAN` value of the latitude column using the `summarize()` function. This function accepts an array of columns in the `group_by_columns` parameter to specify the aggregation level. The `summary_columns` parameter accepts a `SummaryColumnsValue` call. This function call specifies the current column name, the new calculated field name, and the `SummaryFunction` to perform.

```python
import azureml.dataprep as dprep
lat_mean = ds_def.summarize(group_by_columns=['Arrest'],
                       summary_columns=[dprep.SummaryColumnsValue(column_id='Latitude',
                                                                 summary_column_name='Latitude_MEAN',
                                                                 summary_function=dprep.SummaryFunction.MEAN)])
lat_mean = lat_mean.filter(dprep.col('Arrest') == False)
lat_mean.head(1)
```

||Arrest|Latitude_MEAN|
--|-----|--------|
|0|False|41.780049|

The `MEAN` value of latitudes looks accurate. The `ImputeColumnArguments` function accepts a column_id string, and a ReplaceValueFunction to specify the impute type. For the missing longitude value, impute it with -87 based on external knowledge.
Impute steps can be chained together into a ImputeMissingValuesBuilder object, using the builder function impute_missing_values(). The impute_columns parameter accepts an array of ImputeColumnArguments objects. Call the learn() function to store the impute steps, and then apply to a dataflow object using to_dataflow().

```python
# impute with MEAN
impute_mean = dprep.ImputeColumnArguments(column_id='Latitude',
                                          impute_function=dprep.ReplaceValueFunction.MEAN)
# impute with custom value 42
impute_custom = dprep.ImputeColumnArguments(column_id='Longitude',
                                            custom_impute_value=-87)
# get instance of ImputeMissingValuesBuilder
impute_builder = ds_def.builders.impute_missing_values(impute_columns=[impute_mean, impute_custom],
                                                   group_by_columns=['Arrest'])

impute_builder.learn()
ds_def = impute_builder.to_dataflow()
ds_def.head(5)
```

||ID|Arrest|Latitude|Longitude
-|---------|-----|---------|----------
0|10498554|False|41.692834|-87.604319
1|10516598|False|41.744107|-87.664494
2|10519196|False|41.780049|-87.000000
3|10519591|False|41.780049|-87.000000
4|10534446|False|41.780049|-87.000000

As shown in the result above, the missing latitude was imputed with the `MEAN` value of `Arrest==False` group. The missing longitude was imputed with -87.

```python
# update Dataset definition to keep the transformation steps performed. 
dataset = dataset.update_definition(ds_def, 'Impute Missing')
dataset.head(5)
```

||ID|Arrest|Latitude|Longitude
-|---------|-----|---------|----------
0|10498554|False|41.692834|-87.604319
1|10516598|False|41.744107|-87.664494
2|10519196|False|41.780049|-87.000000
3|10519591|False|41.780049|-87.000000
4|10534446|False|41.780049|-87.000000

## How to use assertion rules for anomalies

Frequently, the data we work with while cleaning and preparing data is just a subset of the total data we will need to work with in production. It is also common to be working on a snapshot of a live data set that is continuously updated and augmented. In these cases, some of the assumptions we make as part of our cleaning might turn out to be false. Columns that originally only contained numbers within a certain range might contain a wider range of values in later executions. These errors often result in either broken pipelines or bad data.

Datasets supports creating assertions on data, which are evaluated as the pipeline is executed. These assertions enable us to verify that our assumptions on the data continue to be accurate and, when not, to handle failures in a clean way.

For example, if you want to make sure `Latitude` and `Longitude` values in your Dataset are constrained to specific ranges. To verify this is the case, use assert_value().

```python
from azureml.dataprep import value

# get the latest definition of the Dataset
ds_def = dataset.get_definition()

# set assertion rules for `Latitude` and `Longitude` columns
ds_def = ds_def.assert_value('Latitude', (value <= 90) & (value >= -90), error_code='InvalidLatitude')
ds_def = ds_def.assert_value('Longitude', (value <= 180) & (value >= -87), error_code='InvalidLongitude')

ds_def.get_profile()
```
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Type</th>
      <th>Min</th>
      <th>Max</th>
      <th>Count</th>
      <th>Missing Count</th>
      <th>Not Missing Count</th>
      <th>Percent missing</th>
      <th>Error Count</th>
      <th>Empty count</th>
      <th>0.1% Quantile</th>
      <th>1% Quantile</th>
      <th>5% Quantile</th>
      <th>25% Quantile</th>
      <th>50% Quantile</th>
      <th>75% Quantile</th>
      <th>95% Quantile</th>
      <th>99% Quantile</th>
      <th>99.9% Quantile</th>
      <th>Mean</th>
      <th>Standard Deviation</th>
      <th>Variance</th>
      <th>Skewness</th>
      <th>Kurtosis</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>ID</th>
      <td>FieldType.INTEGER</td>
      <td>1.04986e+07</td>
      <td>1.05351e+07</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>1.04986e+07</td>
      <td>1.04992e+07</td>
      <td>1.04986e+07</td>
      <td>1.05166e+07</td>
      <td>1.05209e+07</td>
      <td>1.05259e+07</td>
      <td>1.05351e+07</td>
      <td>1.05351e+07</td>
      <td>1.05351e+07</td>
      <td>1.05195e+07</td>
      <td>12302.7</td>
      <td>1.51358e+08</td>
      <td>-0.495701</td>
      <td>-1.02814</td>
    </tr>
    <tr>
      <th>Arrest</th>
      <td>FieldType.BOOLEAN</td>
      <td>False</td>
      <td>False</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>Latitude</th>
      <td>FieldType.DECIMAL</td>
      <td>41.6928</td>
      <td>41.9032</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>41.6928</td>
      <td>41.7185</td>
      <td>41.6928</td>
      <td>41.78</td>
      <td>41.78</td>
      <td>41.78</td>
      <td>41.9032</td>
      <td>41.9032</td>
      <td>41.9032</td>
      <td>41.78</td>
      <td>0.0517107</td>
      <td>0.002674</td>
      <td>0.837593</td>
      <td>1.05</td>
    </tr>
    <tr>
      <th>Longitude</th>
      <td>FieldType.INTEGER</td>
      <td>-87</td>
      <td>-87</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>10.0</td>
      <td>0.0</td>
      <td>3.0</td>
      <td>0.0</td>
      <td>-87</td>
      <td>-87</td>
      <td>-87</td>
      <td>-87</td>
      <td>-87</td>
      <td>-87</td>
      <td>-87</td>
      <td>-87</td>
      <td>-87</td>
      <td>-87</td>
      <td>0</td>
      <td>0</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>

From the profile, you see that the `Error Count` for `Longitude` column is 3. The following code filters the Dataset to retrieve the error and see what value causes the assertion to fail. From here you can adjust your code and cleanse your data accordingly.

```python
from azureml.dataprep import col

ds_error = ds_def.filter(col('Longitude').is_error())
error = ds_error.head(10)['Longitude'][0]

print(error.originalValue)
```

    -87.60431945

## How to derive column by example

One of the more advanced tools in Datasets is the ability to derive columns using examples of desired results. This lets you give the SDK an example so it can generate code to achieve the intended transformation.

```python
from azureml.dataset import Dataset

# create an in-memory Dataset from a local file
dataset = Dataset.auto_read_files('./data/crime.csv')
dataset.head(5)
```

||ID|Case Number|Date|Block|...|
-|---------|-----|---------|----|---
0|10498554|HZ239907|2016-04-04 23:56:00|007XX E 111TH ST|...
1|10516598|HZ258664|2016-04-15 17:00:00|082XX S MARSHFIELD AVE|...
2|10519196|HZ261252|2016-04-15 10:00:00|104XX S SACRAMENTO AVE|...
3|10519591|HZ261534|2016-04-15 09:00:00|113XX S PRAIRIE AVE|...
4|10534446|HZ277630|2016-04-15 10:00:00|055XX N KEDZIE AVE|...

Assuming that you need to transform the date and time format to '2016-04-04 10PM-12AM', you can achieve it through `derive_column_by_example`. In `example_data` argument, you need to pass value pairs of original record in `source_columns` and the expected value for the derived column.

```python
ds_def = dataset.get_definition()
ds_def = ds_def.derive_column_by_example(
        source_columns = "Date", 
        new_column_name = "Date_Time_Range", 
        example_data = [("2016-04-04 23:56:00", "2016-04-04 10PM-12AM"), ("2016-04-15 17:00:00", "2016-04-15 4PM-6PM")]
    )
ds_def.keep_columns(['ID','Date','Date_Time_Range']).head(5)
```

||ID|Date|Date_Time_Range
-|--------|-----|----
0|10498554|2016-04-04 23:56:00|2016-04-04 10PM-12AM
1|10516598|2016-04-15 17:00:00|2016-04-15 4PM-6PM
2|10519196|2016-04-15 10:00:00|2016-04-15 10AM-12PM
3|10519591|2016-04-15 09:00:00|2016-04-15 8AM-10AM
4|10534446|2016-04-15 10:00:00|2016-04-15 10AM-12PM

```Python
# update Dataset definition to keep the transformation steps performed. 
dataset = dataset.update_definition(ds_def, 'Derive Date_Time_Range')
```

## How to do fuzzy groupings

Unprepared data often represents the same entity with multiple values due to different spellings, varying capitalizations, and abbreviations. This is common when working with data gathered from multiple sources or through human input. One way to canonicalize and reconcile these variants is to use `fuzzy_group_column` (also known as "text clustering") functionality.

```python
from azureml.dataset import Dataset

# create an in-memoery Dataset from a local json file
dataset = Dataset.auto_read_files('./data/city.json')
dataset.head(5)
```

||inspections.business.business_id|inspections.business_name|inspections.business.address|inspections.business.city|...|
-|-----|-------------------------|------------|--|---
0|16162|Quick-N-Ezee Indian Foods|3861 24th St|SF|...
1|67565|King of Thai Noodles Cafe|1541 TARAVAL St|SAN FRANCISCO|...
2|67565|King of Thai Noodles Cafe|1541 TARAVAL St|SAN FRANCISCO|...
3|68701|Grindz|832 Clement St|SF|...
4|69186|Premier Catering & Events, Inc.|1255 22nd St|S.F.|...

As you can see above, the column `inspections.business.city` contains several forms of the city name "San Francisco". Let's add a column with values replaced by the automatically detected canonical form. To do so, call `fuzzy_group_column()` on Dataset definition:

```python
# get the latest Dataset definition
ds_def = dataset.get_definition()
ds_def = ds_def.fuzzy_group_column(source_column='inspections.business.city',
                                       new_column_name='city_grouped',
                                       similarity_threshold=0.8,
                                       similarity_score_column_name='similarity_score')
ds_def.head(5)
```

||inspections.business.business_id|inspections.business_name|inspections.business.address|inspections.business.city|city_grouped|similarity_score|...|
-|-----|-------------------------|------------|--|---|---|---
0|16162|Quick-N-Ezee Indian Foods|3861 24th St|SF|San Francisco|0.814806|...
1|67565|King of Thai Noodles Cafe|1541 TARAVAL St|SAN FRANCISCO|San Francisco|1.000000|...
2|67565|King of Thai Noodles Cafe|1541 TARAVAL St|SAN FRANCISCO|San Francisco|1.000000|...
3|68701|Grindz|832 Clement St|SF|San Francisco|0.814806|...
4|69186|Premier Catering & Events, Inc.|1255 22nd St|S.F.|San Francisco|0.814806|...

The arguments `source_column` and `new_column_name` are required, whereas the others are optional. If `similarity_threshold` is provided, it will be used to control the required similarity level for the values to be grouped together. If `similarity_score_column_name` is provided, a second new column will be added to show similarity score between every pair of original and canonical values.

In the resulting Dataset definition, you can see that all the different variations of representing "San Francisco" in the data were normalized to the same string, "San Francisco". Now, you can update the Dataset definition to save this fuzzy grouping step into the latest Dataset definition.

```Python
dataset = dataset.update_definition(ds_def, 'fuzzy grouping')
```
