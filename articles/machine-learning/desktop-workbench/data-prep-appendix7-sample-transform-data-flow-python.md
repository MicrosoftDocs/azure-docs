---
title: Example transform data flow transformations possible with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a set of examples of transform data flow transforms possible with Azure Machine Learning data preparation
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 02/01/2018

ROBOTS: NOINDEX
---

# Sample of custom data flow transforms (Python) 

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


The name of the transform in the menu is **Transform Dataflow (Script)**. Before you read this appendix, read [Python extensibility overview](data-prep-python-extensibility-overview.md).

## Transform frame
### Create a new column dynamically 
Creates a column dynamically (**city2**) and reconciles multiple different versions of San Francisco to one from the existing city column.
```python
    df.loc[(df['city'] == 'San Francisco') | (df['city'] == 'SF') | (df['city'] == 'S.F.') | (df['city'] == 'SAN FRANCISCO'), 'city2'] = 'San Francisco'
```

### Add new aggregates
Creates a new frame with the first and last aggregates computed for the score column. These are grouped by the **risk_category** column.
```python
    df = df.groupby(['risk_category'])['Score'].agg(['first','last'])
```
### Winsorize a column 
Reformulates the data to meet a formula for reducing the outliers in a column.
```python
    import scipy.stats as stats
    df['Last Order'] = stats.mstats.winsorize(df['Last Order'].values, limits=0.4)
```

## Transform data flow
### Fill down 

Fill down requires two transforms. It assumes data that looks like the following table:

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

1. Create an "Add Column (Script)" transform using the following code:
```python
    row['State'] if len(row['State']) > 0 else None
```

2. Create a "Transform Data Flow (Script)" transform that contains the following code:
```python
    df = df.fillna( method='pad')
```

The data now looks like the following table:

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


### Min-max normalization
```python
    df["NewCol"] = (df["Col1"]-df["Col1"].mean())/df["Col1"].std()
```