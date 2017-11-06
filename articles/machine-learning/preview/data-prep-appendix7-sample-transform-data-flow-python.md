---
title: Example transform data flow transformations possible with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a a set of examples of transform data flow transforms possible with Azure ML data prep
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: 
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 09/11/2017
---

# Sample of custom data flow transforms (Python) 
The name of this transform in the menu is 'Transform Dataflow (Script)'
Before reading this appendix read [Python Extensibility Overview](data-prep-python-extensibility-overview.md)

## Transform frame
### Create a new column dynamically 
Creates a column dynamically(city2) and reconciles multiple different versions of San Francisco to one from the existing city column.
```python
    df.loc[(df['city'] == 'San Francisco') | (df['city'] == 'SF') | (df['city'] == 'S.F.') | (df['city'] == 'SAN FRANCISCO'), 'city2'] = 'San Francisco'
```

### Add new aggregates
Creates a new frame with the first and last aggregates computed for the score column grouped by risk_category column
```python
    df = df.groupby(['risk_category'])['Score'].agg(['first','last'])
```
### Winsorize a column 
Reformulates the data to meet a formula for reducing the outliers in a column
```python
    import scipy.stats as stats
    df['Last Order'] = stats.mstats.winsorize(df['Last Order'].values, limits=0.4)
```

## Transform data flow
### Fill down 
Fill down requires two transforms.
Assuming data that looks like the following;


|State         |City       |
|--------------|-----------|
|Washington    |Redmond    |
|              |Bellevue   |
|              |Issaquah   |
|              |Seattle    |
|California    |Los Angeles|
|              |San Diego  |
|              |San Jose   |
|Texas         |Dallas     |
|              |San Antonio|
|              |Houston    |

First of all create an 'Add Column (Script)' Transform that contains the following code
```python
    row['State'] if len(row['State']) > 0 else None
```
Now create a Transform Data Flow (Script) Transform that contains the following code
```python
    df = df.fillna( method='pad')
```

And the data now looks like the following;

|State         |newState         |City       |
|--------------|--------------|-----------|
|Washington    |Washington    |Redmond    |
|              |Washington    |Bellevue   |
|              |Washington    |Issaquah   |
|              |Washington    |Seattle    |
|California    |California    |Los Angeles|
|              |California    |San Diego  |
|              |California    |San Jose   |
|Texas         |Texas         |Dallas     |
|              |Texas         |San Antonio|
|              |Texas         |Houston    |

