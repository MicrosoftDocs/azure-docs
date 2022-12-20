---
title: Calendar features for time series forecasting in AutoML
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning's AutoML creates calendar and holiday features
services: machine-learning
author: nivi09
ms.author: nivmishra
ms.reviewer: ssalgado 
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv1, event-tier1-build-2022
ms.date: 12/15/2022
---

# Calendar features for time series forecasting in AutoML

In a forecasting job, the time index is the column in the data set which corresponds to the time axis, i.e. the time at which each observation has occurred. Each observation or row within the time series should have a unique (non-overlapping) time index. Please note that time feature can consists of only date (for e.g. date formats like "DD/MM/YYYY") or both date and time (for e.g. formats like "DD/MM/YYYY HH:MM:SS"), but the format should be uniform and parsable in datetime format.<br>
As a part of feature engineering, we use the `time_column_name` parameter provided in forecast settings of the automl job to generate [standard calendar features](#standard-calendar-features) and [holiday features](#holiday-features) as these features help to capture some information on more granular level.<br> 

Please check out [reference links](#quick-reference-links) at the bottom of document for more details.
<br>
<br>

## Standard Calendar Features

In an automl forecasting job, the given time index is decomposed into more granular level consisting of time information. Following is the example to illustrate this.
For given timestamp “2011-01-01 00:25:30” of parsable format ('YY-mm-dd %H-%m-%d'), automl job creates following features:

| Feature name | Description | Output of the above example|
| --- | ----------- | -------------- |
|`year`|Numeric feature representing year of the given datetime, according to calendar|2011|
|`year_iso`|Represents ISO year as defined in ISO 8601. <br>ISO years start on the first week of year that has a Thursday. This means if January 1 falls on a Friday, ISO year will begin only on January 4. Please note that ISO years may differ from calendar years.|2010|
|`half`|Numeric feature that represents if the given date falls in the first half of the year or second.<br>It takes following values:<ul><li>1: if given date fall prior to July 1 of the same calendar year.</li><li>2: otherwise</li></ul>|1|
|`quarter`|Numeric feature representing the quarter of the given date. <br>It takes values 1,2,3,4 representing first, second, third, fourth quarter of calendar year.|1|
|`month`|Numeric feature representing month of the date represented in numeric form.<br>It takes values 1 through 12.|1|
|`month_lbl`|Label feature representing name of month of given date.|'January'|
|`day`|Numeric feature representing the day of the month of given datetime.<br>It takes values from 1 through 30 (or 31).|1|
|`hour`|Numeric feature representing the hour of the given datetime. In case only date format is provided, then it is assumed as 0.<br>It takes values 0 through 23.|0|
|`minute`|Numeric feature representing the minute of the given datetime. In the case where only date format is provided, then it is assumed as 0.<br>It takes values 0 through 59.|25|
|`second`|Numeric feature representing the second of the given datetime. In the case where only date format is provided, then it is assumed as 0.<br>It takes values 0 through 59.|30|
|`am_pm`|Numeric feature that represents if the given timestamp falls in morning or evening.<br>It takes following values:<ul><li>0: representing am if hour of given date is below 12 (12:00 p.m.)</li><li>1: representing pm otherwise.</li></ul>|0|
|`am_pm_lbl`|Label feature representing time units in clock convention terms A.M. or P.M.|'am'|
|`hour12`|Numeric feature representing hour of day on 12 hour clock representation basis, without the AM/PM piece.<br>It takes values 0 through 12 for first half of the day and 1 through 11 for second half one.|0|
|`wday`|Numeric feature representing day of week. <br>It takes values 0 (Monday) through 6(Sunday).|5|
|`wday_lbl`|Label feature representing name of the weekday.<br>It takes values 'Monday' through 'Sunday'.|'Saturday'|
|`qday`|Numeric feature representing the day of the quarter of given datetime.<br>It takes values 1 through 92.|1|
|`yday`|Numeric feature representing the day of the year in given datetime.<br>It takes values 1 through 365(or 366, if leap year).|1|
|`week`|Numeric feature representing ISO week as defined in ISO 8601.<br>ISO weeks always start on Monday and end on Sunday.<br>It takes values 1 through 52, or 53 for years having 1st January falling on Thursday or for leap years having 1st January falling on Wednesday.|52|

Please note that time driven features are only available for regular time series data that arrives predictably at predefined intervals. If the provided time index in time series data is irregular like different frequency intervals (e.g. some observations recorded on daily basis, some on weekly basis) in the dataset, these features won’t get generated by automl job.
<br>
<br>

## Holiday Features

As mentioned earlier, the azure automl job also creates some features to represent holiday mentioned below:

| Feature name | Description |
| --- | ----------- |
|`_automl_Holiday`| String feature that represents if given date/time index is a regional or national holiday or if it is falling in range of some 'x' days before or after an observed holiday for a given country or region ([shown in example](#output)), as defined by parameter `country_or_region_for_holidays` in forecast settings.<br>This 'x' is calculated as part of internal logic where we have seen a certain pattern being repeated on those holidays in historical datasets.|
|`automl_isPaidTimeOff`| Binary feature that takes value 1 it is paid time off in the given country or region else 0 ([shown in example](#output)).|


The parameter `country_or_region_for_holidays` only accepts country or region in ISO code format.

We use public holiday data sourced from PyPI holidays package and Wikipedia, covering 38 countries or regions from 1970-01-01 to 2098-12-28 to deduce if given date time index is a regional/national holiday.

Currently, automl forecasting job supports creation of holiday features if frequency of time index is <i>'daily'</i>.  

Let’s understand this with an example dataset.

<b>sample_data</b>:<br>
<img src='./media/how-to-forecasting-time-driven-features/load_forecasting_sample_data_daily.png' alt='sample_data' width=50%></img>

We set the `country_or_region_for_holiday` as 'US' in forecast settings as shown below:

```python
from azure.ai.ml import automl

# create a forcasting job
forecasting_job = automl.forecasting(
    compute='test_cluster',   # Name of single or multinode AML compute infrastructure created by user
    experiment_name=exp_name, # name of experiment 
    training_data=sample_data,  
    target_column_name='demand',
    primary_metric='NormalizedRootMeanSquaredError',
    n_cross_validations=3,
    enable_model_explainability=True
)

# set custom forecast settings
forecasting_job.set_forecast_settings(
    time_column_name='timeStamp',
    country_or_region_for_holidays='US'
)
```
Once we submit the job for execution, the automl will generate the holiday features for given country or region ('US' in the above example) and `time_column_name` to create holiday features. 
The output is shown below:

<a name='output'><img src='./media/how-to-forecasting-time-driven-features/sample_dataset_holiday_feature_generated.png' alt='sample_data_output' width=75%></img></a>

<br>
<br>

#### **Quick reference links:**

1.	[azureml.opendatasets.PublicHolidays class - Azure Machine Learning Python | Microsoft Learn](https://learn.microsoft.com/python/api/azureml-opendatasets/azureml.opendatasets.publicholidays)
2.	[azureml.opendatasets.PublicHolidaysOffline class - Azure Machine Learning Python | Microsoft Learn](https://learn.microsoft.com/python/api/azureml-opendatasets/azureml.opendatasets.publicholidaysoffline)
3.	[ISO week date - Wikipedia](https://en.wikipedia.org/wiki/ISO_week_date)
4.  [List of ISO 3166 country codes](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)
5. [How to set forecast settings](https://learn.microsoft.com/python/api/azure-ai-ml/azure.ai.ml.automl.forecastingjob#azure-ai-ml-automl-forecastingjob-set-forecast-settings&preserve-view=true)
