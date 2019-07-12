---
title: 'Transforms: data prep Python SDK'
titleSuffix: Azure Machine Learning service
description: Learn about transforming and cleaning data with Azure Machine Learning Data Prep SDK. Use transform methods to add columns, filter out unwanted rows or columns, and impute missing values.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sihhu
author: MayMSFT
manager: cgronlun
ms.reviewer: jmartens
ms.date: 05/02/2019
ms.custom: seodec18
---

# Transform data with the Azure Machine Learning Data Prep SDK

In this article, you learn different methods of transforming data using the `azureml-dataprep` package. The package offers functions that make it simple to add columns, filter out unwanted rows or columns, and impute missing values. See full reference documentation for the [azureml-dataprep package](https://aka.ms/data-prep-sdk).

> [!Important]
> If you are building a new solution, try the [Azure Machine Learning Datasets](how-to-explore-prepare-data.md) (preview) to transform your data, snapshot data, and store versioned dataset definitions. Datasets is the next version of the data prep SDK, offering expanded functionality for managing datasets in AI solutions. 
> If you use the `azureml-dataprep` package to create a dataflow with your transformations instead of using the `azureml-datasets` package to create a dataset, you won't be able to use snapshots or versioned datasets later.

This how-to shows examples for the following tasks:

- Add column using an expression
- [Impute missing values](#impute-missing-values)
- [Derive column by example](#derive-column-by-example)
- [Filtering](#filtering)
- [Custom Python transforms](#custom-python-transforms)

## Add column using an expression

The Azure Machine Learning Data Prep SDK includes `substring` expressions you can use to calculate a value from existing columns, and then put that value in a new column. In this example, you load data and try to add columns to that input data.

```Python
import azureml.dataprep as dprep

# loading data
dflow = dprep.read_csv(path=r'data\crime0-10.csv')
dflow.head(3)
```

||ID|Case Number|Date|Block|IUCR|Primary Type|Description|Location Description|Arrest|Domestic|...|Ward|Community Area|FBI Code|X Coordinate|Y Coordinate|Year|Updated On|Latitude|Longitude|Location|
|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
|0|10140490|HY329907|07/05/2015 11:50:00 PM|050XX N NEWLAND AVE|0820|THEFT|$500 AND UNDER|STREET|false|false|...|41|10|06|1129230|1933315|2015|07/12/2015 12:42:46 PM|41.973309466|-87.800174996|(41.973309466, -87.800174996)|
|1|10139776|HY329265|07/05/2015 11:30:00 PM|011XX W MORSE AVE|0460|BATTERY|SIMPLE|STREET|false|true|...|49|1|08B|1167370|1946271|2015|07/12/2015 12:42:46 PM|42.008124017|-87.65955018|(42.008124017, -87.65955018)|
|2|10140270|HY329253|07/05/2015 11:20:00 PM|121XX S FRONT AVE|0486|BATTERY|DOMESTIC BATTERY SIMPLE|STREET|false|true|...|9|53|08B|||2015|07/12/2015 12:42:46 PM|


Use the `substring(start, length)` expression to extract the prefix from the Case Number column and put that string in a new column, `Case Category`. Passing the `substring_expression` variable to the `expression` parameter creates a new calculated column that executes the expression on each record.

```Python
substring_expression = dprep.col('Case Number').substring(0, 2)
case_category = dflow.add_column(new_column_name='Case Category',
                                    prior_column='Case Number',
                                    expression=substring_expression)
case_category.head(3)
```

||ID|Case Number|Case Category|Date|Block|IUCR|Primary Type|Description|Location Description|Arrest|Domestic|...|Ward|Community Area|FBI Code|X Coordinate|Y Coordinate|Year|Updated On|Latitude|Longitude|Location|
|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|------|
|0|10140490|HY329907|HY|07/05/2015 11:50:00 PM|050XX N NEWLAND AVE|0820|THEFT|$500 AND UNDER|STREET|false|false|...|41|10|06|1129230|1933315|2015|07/12/2015 12:42:46 PM|41.973309466|-87.800174996|(41.973309466, -87.800174996)|
|1|10139776|HY329265|HY|07/05/2015 11:30:00 PM|011XX W MORSE AVE|0460|BATTERY|SIMPLE|STREET|false|true|...|49|1|08B|1167370|1946271|2015|07/12/2015 12:42:46 PM|42.008124017|-87.65955018|(42.008124017, -87.65955018)|
|2|10140270|HY329253|HY|07/05/2015 11:20:00 PM|121XX S FRONT AVE|0486|BATTERY|DOMESTIC BATTERY SIMPLE|STREET|false|true|...|9|53|08B|||2015|07/12/2015 12:42:46 PM|


Use the `substring(start)` expression to extract only the number from the Case Number column and create a new column. Convert it to a numeric data type using the `to_number()` function, and pass the string column name as a parameter.

```Python
substring_expression2 = dprep.col('Case Number').substring(2)
case_id = dflow.add_column(new_column_name='Case Id',
                              prior_column='Case Number',
                              expression=substring_expression2)
case_id = case_id.to_number('Case Id')
```

## Impute missing values

The SDK can impute missing values in specified columns. In this example, you load latitude and longitude values and then try to impute missing values in the input data.

```python
import azureml.dataprep as dprep

# loading input data
dflow = dprep.read_csv(r'data\crime0-10.csv')
dflow = dflow.keep_columns(['ID', 'Arrest', 'Latitude', 'Longitude'])
dflow = dflow.to_number(['Latitude', 'Longitude'])
dflow.head(3)
```

||ID|Arrest|Latitude|Longitude|
|-----|------|-----|------|-----|
|0|10140490|false|41.973309|-87.800175|
|1|10139776|false|42.008124|-87.659550|
|2|10140270|false|NaN|NaN|

The third record is missing latitude and longitude values. To impute those missing values, you use [`ImputeMissingValuesBuilder`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.api.builders.imputemissingvaluesbuilder?view=azure-dataprep-py) to learn a fixed expression. It can impute the columns with either a calculated `MIN`, `MAX`, `MEAN` value, or a `CUSTOM` value. When `group_by_columns` is specified, missing values will be imputed by group with `MIN`, `MAX`, and `MEAN` calculated per group.

Check the `MEAN` value of the latitude column using the [`summarize()`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.dataflow?view=azure-dataprep-py#summarize-summary-columns--typing-union-typing-list-azureml-dataprep-api-dataflow-summarycolumnsvalue---nonetype----none--group-by-columns--typing-union-typing-list-str---nonetype----none--join-back--bool---false--join-back-columns-prefix--typing-union-str--nonetype----none-----azureml-dataprep-api-dataflow-dataflow) function. This function accepts an array of columns in the `group_by_columns` parameter to specify the aggregation level. The `summary_columns` parameter accepts a `SummaryColumnsValue` call. This function call specifies the current column name, the new calculated field name, and the `SummaryFunction` to perform.

```python
dflow_mean = dflow.summarize(group_by_columns=['Arrest'],
                       summary_columns=[dprep.SummaryColumnsValue(column_id='Latitude',
                                                                 summary_column_name='Latitude_MEAN',
                                                                 summary_function=dprep.SummaryFunction.MEAN)])
dflow_mean = dflow_mean.filter(dprep.col('Arrest') == 'false')
dflow_mean.head(1)
```

||Arrest|Latitude_MEAN|
|-----|-----|----|
|0|false|41.878961|

The `MEAN` value of latitudes looks accurate, use the `ImputeColumnArguments` function to impute it. This function accepts a `column_id` string, and a `ReplaceValueFunction` to specify the impute type. For the missing longitude value, impute it with 42 based on external knowledge.

Impute steps can be chained together into a `ImputeMissingValuesBuilder` object, using the builder function `impute_missing_values()`. The `impute_columns` parameter accepts an array of `ImputeColumnArguments` objects. Call the `learn()` function to store the impute steps, and then apply to a dataflow object using `to_dataflow()`.

```python
# impute with MEAN
impute_mean = dprep.ImputeColumnArguments(column_id='Latitude',
                                          impute_function=dprep.ReplaceValueFunction.MEAN)
# impute with custom value 42
impute_custom = dprep.ImputeColumnArguments(column_id='Longitude',
                                            custom_impute_value=42)
# get instance of ImputeMissingValuesBuilder
impute_builder = dflow.builders.impute_missing_values(impute_columns=[impute_mean, impute_custom],
                                                   group_by_columns=['Arrest'])

impute_builder.learn()
dflow_imputed = impute_builder.to_dataflow()
dflow_imputed.head(3)
```

||ID|Arrest|Latitude|Longitude|
|-----|------|-----|------|-----|
|0|10140490|false|41.973309|-87.800175|
|1|10139776|false|42.008124|-87.659550|
|2|10140270|false|41.878961|42.000000|

As shown in the result above, the missing latitude was imputed with the `MEAN` value of `Arrest=='false'` group. The missing longitude was imputed with 42.

```python
imputed_longitude = dflow_imputed.to_pandas_dataframe()['Longitude'][2]
assert imputed_longitude == 42
```

## Derive column by example

One of the more advanced tools in the Azure Machine Learning Data Prep SDK is the ability to derive columns using examples of desired results. This lets you give the SDK an example so it can generate code to achieve the intended transformation.

```python
import azureml.dataprep as dprep
dflow = dprep.read_csv(path='https://dpreptestfiles.blob.core.windows.net/testfiles/BostonWeather.csv')
dflow.head(4)
```

||DATE|REPORTTPYE|HOURLYDRYBULBTEMPF|HOURLYRelativeHumidity|HOURLYWindSpeed|
|----|----|----|----|----|----|
|0|1/1/2015 0:54|FM-15|22|50|10|
|1|1/1/2015 1:00|FM-12|22|50|10|
|2|1/1/2015 1:54|FM-15|22|50|10|
|3|1/1/2015 2:54|FM-15|22|50|11|

Assume that you need to join this file with a dataset where date and time are in a format 'Mar 10, 2018 | 2AM-4AM'.

```python
builder = dflow.builders.derive_column_by_example(source_columns=['DATE'], new_column_name='date_timerange')
builder.add_example(source_data=dflow.iloc[1], example_value='Jan 1, 2015 12AM-2AM')
builder.preview(count=5) 
```

||DATE|date_timerange|
|----|----|----|
|0|1/1/2015 0:54|Jan 1, 2015 12AM-2AM|
|1|1/1/2015 1:00|Jan 1, 2015 12AM-2AM|
|2|1/1/2015 1:54|Jan 1, 2015 12AM-2AM|
|3|1/1/2015 2:54|Jan 1, 2015 2AM-4AM|
|4|1/1/2015 3:54|Jan 1, 2015 2AM-4AM|

The code above first creates a builder for the derived column. You provide an array of source columns to consider (`DATE`), and a name for the new column to be added. As the first example, you pass in the second row (index 1) and give an expected value for the derived column.

Finally, you call `builder.preview(skip=30, count=5)` and can see the derived column next to the source column. The format seems correct, but you only see values for the same date "Jan 1, 2015".

Now, pass in the number of rows you want to `skip` from the top to see rows further down.

> [!NOTE]
> The preview() function skips rows but does not re-number the output index. In the example below, the index 0 in the table corresponds to index 30 in the dataflow.

```python
builder.preview(skip=30, count=5)
```

||DATE|date_timerange|
|-----|-----|-----|
|0|1/1/2015 22:54|Jan 1, 2015 10PM-12AM|
|1|1/1/2015 23:54|Jan 1, 2015 10PM-12AM|
|2|1/1/2015 23:59|Jan 1, 2015 10PM-12AM|
|3|1/2/2015 0:54|Feb 1, 2015 12AM-2AM|
|4|1/2/2015 1:00|Feb 1, 2015 12AM-2AM|

Here you see an issue with the generated program. Based solely on the one example you provided above, the derive program chose to parse the date as "Day/Month/Year", which is not what you want in this case. To fix this issue, target a specific record index and provide another example using the `add_example()` function on the `builder` variable.

```python
builder.add_example(source_data=dflow.iloc[3], example_value='Jan 2, 2015 12AM-2AM')
builder.preview(skip=30, count=5)
```

||DATE|date_timerange|
|-----|-----|-----|
|0|1/1/2015 22:54|Jan 1, 2015 10PM-12AM|
|1|1/1/2015 23:54|Jan 1, 2015 10PM-12AM|
|2|1/1/2015 23:59|Jan 1, 2015 10PM-12AM|
|3|1/2/2015 0:54|Jan 2, 2015 12AM-2AM|
|4|1/2/2015 1:00|Jan 2, 2015 12AM-2AM|

Now rows correctly handle '1/2/2015' as 'Jan 2, 2015', but if you look beyond index 76 of the derived column, you see that values at the end have nothing in derived column.

```python
builder.preview(skip=75, count=5)
```


||DATE|date_timerange|
|-----|-----|-----|
|0|1/3/2015 7:00|Jan 3, 2015 6AM-8AM|
|1|1/3/2015 7:54|Jan 3, 2015 6AM-8AM|
|2|1/29/2015 6:54|None|
|3|1/29/2015 7:00|None|
|4|1/29/2015 7:54|None|

```python
builder.add_example(source_data=dflow.iloc[77], example_value='Jan 29, 2015 6AM-8AM')
builder.preview(skip=75, count=5)
```

||DATE|date_timerange|
|-----|-----|-----|
|0|1/3/2015 7:00|Jan 3, 2015 6AM-8AM|
|1|1/3/2015 7:54|Jan 3, 2015 6AM-8AM|
|2|1/29/2015 6:54|Jan 29, 2015 6AM-8AM|
|3|1/29/2015 7:00|Jan 29, 2015 6AM-8AM|
|4|1/29/2015 7:54|Jan 29, 2015 6AM-8AM|

 To see a list of current example derivations call `list_examples()` on the builder object.

```python
examples = builder.list_examples()
```

| |DATE|example|example_id|
| -------- | -------- | -------- | -------- |
|0|1/1/2015 1:00|Jan 1, 2015 12AM-2AM|-1|
|1|1/2/2015 0:54|Jan 2, 2015 12AM-2AM|-2|
|2|1/29/2015 20:54|Jan 29, 2015 8PM-10PM|-3|


In certain cases if you want to delete examples that are incorrect, you can pass in either `example_row` from the pandas DataFrame, or `example_id` value. For example, if you run `builder.delete_example(example_id=-1)`, it deletes the first transformation example.


Call `to_dataflow()` on the builder, which returns a data flow with the desired derived columns added.

```python
dflow = builder.to_dataflow()
df = dflow.to_pandas_dataframe()
```

## Filtering

The SDK includes the methods [`drop_columns()`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.dataflow?view=azure-dataprep-py#drop-columns-columns--multicolumnselection-----azureml-dataprep-api-dataflow-dataflow) and [`filter()`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.dataflow?view=azure-dataprep-py) to let you filter out columns or rows.

### Initial setup

```python
import azureml.dataprep as dprep
from datetime import datetime
dflow = dprep.read_csv(path='https://dprepdata.blob.core.windows.net/demo/green-small/*')
dflow.head(5)
```

||lpep_pickup_datetime|Lpep_dropoff_datetime|Store_and_fwd_flag|RateCodeID|Pickup_longitude|Pickup_latitude|Dropoff_longitude|Dropoff_latitude|Passenger_count|Trip_distance|Tip_amount|Tolls_amount|Total_amount|
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
|0|None|None|None|None|None|None|None|None|None|None|None|None|None|
|1|2013-08-01 08:14:37|2013-08-01 09:09:06|N|1|0|0|0|0|1|.00|0|0|21.25|
|2|2013-08-01 09:13:00|2013-08-01 11:38:00|N|1|0|0|0|0|2|.00|0|0|75|
|3|2013-08-01 09:48:00|2013-08-01 09:49:00|N|5|0|0|0|0|1|.00|0|1|2.1|
|4|2013-08-01 10:38:35|2013-08-01 10:38:51|N|1|0|0|0|0|1|.00|0|0|3.25|

### Filtering columns

To filter columns, use `drop_columns()`. This method takes a list of columns to drop or a more complex argument called [`ColumnSelector`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.columnselector?view=azure-dataprep-py).

#### Filtering columns with list of strings

In this example, `drop_columns()` takes a list of strings. Each string should exactly match the desired column to drop.

```python
dflow = dflow.drop_columns(['Store_and_fwd_flag', 'RateCodeID'])
dflow.head(2)
```

||lpep_pickup_datetime|Lpep_dropoff_datetime|Pickup_longitude|Pickup_latitude|Dropoff_longitude|Dropoff_latitude|Passenger_count|Trip_distance|Tip_amount|Tolls_amount|Total_amount|
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
|0|None|None|None|None|None|None|None|None|None|None|None|
|1|2013-08-01 08:14:37|2013-08-01 09:09:06|0|0|0|0|1|.00|0|0|21.25|

#### Filtering columns with regex

Alternatively, use the `ColumnSelector` expression to drop columns that match a regex expression. In this example, you drop all the columns that match the expression `Column*|.*longitude|.*latitude`.

```python
dflow = dflow.drop_columns(dprep.ColumnSelector('Column*|.*longitud|.*latitude', True, True))
dflow.head(2)
```

||lpep_pickup_datetime|Lpep_dropoff_datetime|Passenger_count|Trip_distance|Tip_amount|Tolls_amount|Total_amount|
|-----|-----|-----|-----|-----|-----|-----|-----|
|0|None|None|None|None|None|None|None|
|1|2013-08-01 08:14:37|2013-08-01 09:09:06|1|.00|0|0|21.25|

## Filtering rows

To filter rows, use `filter()`. This method takes an Azure Machine Learning Data Prep SDK expression as an argument, and returns a new data flow with the rows that the expression evaluates as True. Expressions are built using expression builders (`col`, `f_not`, `f_and`, `f_or`) and regular operators (>, <, >=, <=, ==, !=).

### Filtering rows with simple Expressions

Use the expression builder `col`, specify the column name as a string argument `col('column_name')`. Use this expression in combination with one of the following standard operators >, <, >=, <=, ==, != to build an expression such as `col('Tip_amount') > 0`. Finally, pass the built expression into the `filter()` function.

In this example, `dflow.filter(col('Tip_amount') > 0)` returns a new data flow with the rows in which the value of `Tip_amount` is greater than 0.

> [!NOTE] 
> `Tip_amount` is first converted to numeric, which allows us to build an expression comparing it against other numeric values.

```python
dflow = dflow.to_number(['Tip_amount'])
dflow = dflow.filter(dprep.col('Tip_amount') > 0)
dflow.head(2)
```

||lpep_pickup_datetime|Lpep_dropoff_datetime|Passenger_count|Trip_distance|Tip_amount|Tolls_amount|Total_amount|
|-----|-----|-----|-----|-----|-----|-----|-----|
|0|2013-08-01 19:33:28|2013-08-01 19:35:21|5|.00|0.08|0|4.58|
|1|2013-08-05 13:16:38|2013-08-05 13:18:24|1|.00|0.30|0|3.8|

### Filtering rows with complex expressions

To filter using complex expressions, combine one or more simple expressions with the expression builders `f_not`, `f_and`, or `f_or`.

In this example, `dflow.filter()` returns a new data flow with the rows where `'Passenger_count'` is less than 5 and `'Tolls_amount'` is greater than 0.

```python
dflow = dflow.to_number(['Passenger_count', 'Tolls_amount'])
dflow = dflow.filter(dprep.f_and(dprep.col('Passenger_count') < 5, dprep.col('Tolls_amount') > 0))
dflow.head(2)
```

||lpep_pickup_datetime|Lpep_dropoff_datetime|Passenger_count|Trip_distance|Tip_amount|Tolls_amount|Total_amount|
|-----|-----|-----|-----|-----|-----|-----|-----|
|0|2013-08-08 12:16:00|2013-08-08 12:16:00|1.0|.00|2.25|5.00|19.75|
|1|2013-08-12 14:43:53|2013-08-12 15:04:50|1.0|5.28|6.46|5.33|32.29|

It is also possible to filter rows combining more than one expression builder to create a nested expression.

> [!NOTE]
> `lpep_pickup_datetime` and `Lpep_dropoff_datetime` are first converted to datetime, which allows us to build an expression comparing it against other datetime values.

```python
dflow = dflow.to_datetime(['lpep_pickup_datetime', 'Lpep_dropoff_datetime'], ['%Y-%m-%d %H:%M:%S'])
dflow = dflow.to_number(['Total_amount', 'Trip_distance'])
mid_2013 = datetime(2013,7,1)
dflow = dflow.filter(
    dprep.f_and(
        dprep.f_or(
            dprep.col('lpep_pickup_datetime') > mid_2013,
            dprep.col('Lpep_dropoff_datetime') > mid_2013),
        dprep.f_and(
            dprep.col('Total_amount') > 40,
            dprep.col('Trip_distance') < 10)))
dflow.head(2)
```

||lpep_pickup_datetime|Lpep_dropoff_datetime|Passenger_count|Trip_distance|Tip_amount|Tolls_amount|Total_amount|
|-----|-----|-----|-----|-----|-----|-----|-----|
|0|2013-08-13 06:11:06+00:00|2013-08-13 06:30:28+00:00|1.0|9.57|7.47|5.33|44.80|
|1|2013-08-23 12:28:20+00:00|2013-08-23 12:50:28+00:00|2.0|8.22|8.08|5.33|40.41|

## Custom Python transforms

There will always be scenarios when the easiest option for making a transformation is writing your own script. The SDK provides three extension points that you can use for custom Python scripts.

- New script column
- New script filter
- Transform partition

Each of the extensions is supported in both the scale-up and scale-out runtime. A key advantage of using these extension points is that you don't need to pull all of the data in order to create a data frame. Your custom Python code will run just like other transforms, at scale, by partition, and typically in parallel.

### Initial data preparation

Start by loading some data from Azure Blob.

```python
import azureml.dataprep as dprep
col = dprep.col

dflow = dprep.read_csv(path='https://dpreptestfiles.blob.core.windows.net/testfiles/read_csv_duplicate_headers.csv', skip_rows=1)
dflow.head(2)
```

| |stnam|fipst|leaid|leanm10|ncessch|MAM_MTH00numvalid_1011|
|-----|-------|---------| -------|------|-----|------|
|0|ALABAMA|1|101710|Hale County|10171002158| |
|1|ALABAMA|1|101710|Hale County|10171002162| |

Trim down the data set and do some basic transforms including removing columns, replacing values and converting types.

```python
dflow = dflow.keep_columns(['stnam', 'leanm10', 'ncessch', 'MAM_MTH00numvalid_1011'])
dflow = dflow.replace_na(columns=['leanm10', 'MAM_MTH00numvalid_1011'], custom_na_list='.')
dflow = dflow.to_number(['ncessch', 'MAM_MTH00numvalid_1011'])
dflow.head(2)
```

| |stnam|leanm10|ncessch|MAM_MTH00numvalid_1011|
|-----|-------|---------| -------|------|
|0|ALABAMA|Hale County|1.017100e+10|None|
|1|ALABAMA|Hale County|1.017100e+10|None|

Look for null values using the following filter.

```python
dflow.filter(col('MAM_MTH00numvalid_1011').is_null()).head(2)
```

| |stnam|leanm10|ncessch|MAM_MTH00numvalid_1011|
|-----|-------|---------| -------|------|
|0|ALABAMA|Hale County|1.017100e+10|None|
|1|ALABAMA|Hale County|1.017100e+10|None|

### Transform partition

Use [`transform_partition()`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.dataflow?view=azure-dataprep-py#transform-partition-script--str-----azureml-dataprep-api-dataflow-dataflow)  to replace all null values with a 0. This code will be run by partition, not on the entire data set at one time. This means that on a large data set, this code may run in parallel as the runtime processes the data, partition by partition.

The Python script must define a function called `transform()` that takes two arguments, `df` and `index`. The `df` argument will be a pandas dataframe that contains the data for the partition and the `index` argument is a unique identifier of the partition. The transform function can fully edit the passed in dataframe, but must return a dataframe. Any libraries that the Python script imports must exist in the environment where the dataflow is run.

```python
df = df.transform_partition("""
def transform(df, index):
    df['MAM_MTH00numvalid_1011'].fillna(0,inplace=True)
    return df
""")
df.head(2)
```

||stnam|leanm10|ncessch|MAM_MTH00numvalid_1011|
|-----|-------|---------| -------|------|
|0|ALABAMA|Hale County|1.017100e+10|0.0|
|1|ALABAMA|Hale County|1.017100e+10|0.0|

### New script column

You can use a Python script to create a new column that has the county name and the state name, and also to capitalize the state name. To do this, use the [`new_script_column()`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.dataflow?view=azure-dataprep-py#new-script-column-new-column-name--str--insert-after--str--script--str-----azureml-dataprep-api-dataflow-dataflow) method on the data flow.

The Python script must define a function called `newvalue()` that takes a single argument `row`. The `row` argument is a dict (`key`:column name, `val`: current value) and will be passed to this function for each row in the data set. This function must return a value to be used in the new column. Any libraries that the Python script imports must exist in the environment where the dataflow is run.

```python
dflow = dflow.new_script_column(new_column_name='county_state', insert_after='leanm10', script="""
def newvalue(row):
    return row['leanm10'] + ', ' + row['stnam'].title()
""")
dflow.head(2)
```

||stnam|leanm10|county_state|ncessch|MAM_MTH00numvalid_1011|
|-----|-------|---------| -------|------|-----|
|0|ALABAMA|Hale County|Hale County, Alabama|1.017100e+10|0.0|
|1|ALABAMA|Hale County|Hale County, Alabama|1.017100e+10|0.0|

### New Script Filter

Build a Python expression using [`new_script_filter()`](https://docs.microsoft.com/python/api/azureml-dataprep/azureml.dataprep.dataflow?view=azure-dataprep-py#new-script-filter-script--str-----azureml-dataprep-api-dataflow-dataflow) to filter the data set to only rows where 'Hale' is not in the new `county_state` column. The expression returns `True` if we want to keep the row, and `False` to drop the row.

```python
dflow = dflow.new_script_filter("""
def includerow(row):
    val = row['county_state']
    return 'Hale' not in val
""")
dflow.head(2)
```

||stnam|leanm10|county_state|ncessch|MAM_MTH00numvalid_1011|
|-----|-------|---------| -------|------|-----|
|0|ALABAMA|Jefferson County|Jefferson County, Alabama|1.019200e+10|1.0|
|1|ALABAMA|Jefferson County|Jefferson County, Alabama|1.019200e+10|0.0|

## Next steps

* See the Azure Machine Learning Data Prep SDK [tutorial](tutorial-data-prep.md) for an example of solving a specific scenario
