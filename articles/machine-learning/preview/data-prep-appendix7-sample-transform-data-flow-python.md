---
title: Sample of Custom DataFlow Transforms (Python) | Microsoft Docs
description: Gives samples of python custom dataFlow transforms expressions
author: cforbe
ms.author: cforbe@microsoft.com
ms.date: 9/7/2017
---

# Sample of Custom DataFlow Transforms (Python) #

## Transform Frame - Create a New Column on the fly ##
Creates a column on the fly(city2) and reconciles multiple different versions of San Francisco to one.
```python
    df.loc[(df['city'] == 'San Francisco') | (df['city'] == 'SF') | (df['city'] == 'S.F.') | (df['city'] == 'SAN FRANCISCO'), 'city2'] = 'San Francisco'
```

## Transform Frame Add New Aggregates ##
Creates a new frame with the first and last aggs computed for the score column grouped by risk_category
```python
    df = df.groupby(['risk_category'])['Score'].agg(['first','last'])
```
## Fill Down
This requires 2 transforms.
Assuming data that looks like this;


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
    row['State'] if len(row['State']) > 0 else None`
```
Now create a Transform Data Flow (Script) Transform that contains the following code
```python
    df = df.fillna( method='pad')`
```

And the data will now look like this

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

## Transform Frame - Winsorize a Column
Reformulates the data to meet a formula for reducing the outliers in a column
```python
    df['Last Order'] = sp.stats.mstats.winsorize(df['Last Order'].values, limits=0.4)
```