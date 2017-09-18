---
title: Sample Python for deriving new columns in Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides Python code examples for creating new columns in Azure ML data prep
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
ms.date: 09/12/2017
---

# Sample of Custom Column Transforms (Python) 
The name of this transform in the menu is 'Add Column (Script)'

Before reading this appendix read [Python Extensibility Overview](data-prep-python-extensibility-overview.md)

## Test equivalence and replace values 
If the value in Col1 is less than 4, then the new column should have a value of 1 else it has the value 2 

```python
    1 if row["Col1"] < 4 else 2
```
## Current date and time 

```python
    datetime.datetime.now()
```
## Typecasting 
```python
    float(row["Col1"]) / float(row["Col2"] - 1)
```
## Evaluate for nullness 
If the Col1 contains a null, then mark the new column as Bad otherwise mark it as Good 

```python
    'Bad' if pd.isnull(row["Col1"]) else 'Good'
```
## New computed column 
```python
    np.log(row["Col1"])
```
## Epoch computation 
Number of seconds since the Unix Epoch (assuming Col1 is already a date) 
```python
    row["Col1"] - datetime.datetime.utcfromtimestamp(0)).total_seconds()
```





