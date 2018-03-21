---
title: Example filter expressions possible with Azure Machine Learning data preparation  | Microsoft Docs
description: This document provides a a set of examples of filter expressions possible with Azure Machine Learning data preparation
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 02/01/2018
---

# Sample of filter expressions (Python) 
Before you read this appendix, read [Python extensibility overview](data-prep-python-extensibility-overview.md).

## Filter with equivalence test
Filter in only those rows where the value of (numeric) Col2 is greater than 4. 

```python
    row["Col2"] > 4
```

## Filter with multiple columns 
Filter in only those rows where Col1 contains the value **Good** and Col2 contains the (numeric) value 1. 
```python
    row["Col1"] == 'Good' and row["Col2"] == 1
```

## Test filter against null
Filter in only those rows where Col1 has a null value. 
```python
    pd.isnull(row["Col1"])
```
