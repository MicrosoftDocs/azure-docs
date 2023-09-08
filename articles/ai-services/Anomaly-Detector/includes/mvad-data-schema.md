---
title: MVAD data schema
titleSuffix: Azure AI services
services: cognitive-services
author: quying
manager: tonyxin
ms.service: cognitive-services
ms.topic: include
ms.date: 7/1/2021
ms.author: yingqunpku
---


### Input data schema

MVAD detects anomalies from a group of metrics, and we call each metric a **variable** or a time series.

* You could download the sample data file from Microsoft to check the accepted schema from: [https://aka.ms/AnomalyDetector/MVADSampleData](https://aka.ms/AnomalyDetector/MVADSampleData)
* Each variable must have two and only two fields, `timestamp` and `value`, and should be stored in a comma-separated values (CSV) file.
* The column names of the CSV file should be precisely `timestamp` and `value`, case-sensitive.
* The `timestamp` values should conform to ISO 8601; the `value` could be integers or decimals with any number of decimal places.
    A good example of the content of a CSV file：

    |timestamp | value|
    |-------|-------|
    |2019-04-01T00:00:00Z| 5|
    |2019-04-01T00:01:00Z| 3.6|
    |2019-04-01T00:02:00Z| 4|
    |...| ...|

    > [!NOTE]
    > If your timestamps have hours, minutes, and/or seconds, ensure that they're properly rounded up before calling the APIs.
    >
    > For example, if your data frequency is supposed to be one data point every 30 seconds, but you're seeing timestamps like "12:00:01" and "12:00:28", it's a strong signal that you should pre-process the timestamps to new values like "12:00:00" and "12:00:30".
    >
    > For details, please refer to the ["Timestamp round-up" section](../concepts/best-practices-multivariate.md#timestamp-round-up) in the best practices document.
* The name of the csv file will be used as the variable name and should be unique. For example, "temperature.csv" and "humidity.csv".
* Variables for training and variables for inference should be consistent. For example, if you are using `series_1`, `series_2`, `series_3`, `series_4`, and `series_5` for training, you should provide exactly the same variables for inference.
* CSV files should be compressed into a zip file and uploaded to an Azure blob container. The zip file can have whatever name you want.

#### Folder structure

A common mistake in data preparation is extra folders in the zip file. For example, assume the name of the zip file is `series.zip`. Then after decompressing the files to a new folder `./series`, the **correct** path to CSV files is `./series/series_1.csv` and a **wrong** path could be `./series/foo/bar/series_1.csv`.

The correct example of the directory tree after decompressing the zip file in Windows

```bash
.
└── series
    ├── series_1.csv
    ├── series_2.csv
    ├── series_3.csv
    ├── series_4.csv
    └── series_5.csv
```

An incorrect example of the directory tree after decompressing the zip file in Windows

```bash
.
└── series
    └── series
        ├── series_1.csv
        ├── series_2.csv
        ├── series_3.csv
        ├── series_4.csv
        └── series_5.csv
```
