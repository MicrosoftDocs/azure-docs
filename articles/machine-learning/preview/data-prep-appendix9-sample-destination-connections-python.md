---
title: Example destinations/outputs possible with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a a set of examples of custom data destinations/outputs with Azure ML data prep
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


# Sample of destination connections (Python) 
Before reading this appendix read [Python Extensibility Overview](data-prep-python-extensibility-overview.md)

## Write to Excel 

Writing to Excel requires an additional library, adding new libraries is documented in the extensibility overview. `openpyxl` is the library that needs added.

Before writing, some other changes might be needed. Some of the datatypes used in Data Prep are not supported in some destination formats. As an example if "Error" objects exist, these will not serialize correctly to Excel. Thus a "Replace Error Values" transform, that removes Errors from any columns, is needed before attempting to write to Excel.

Assuming all of the above work has been completed, the following line writes the data table to a single sheet in an Excel document. Add a Write DataFlow (Script) transform and enter the following code in an expression section:

### On Windows 
```python
df.to_excel('c:\dev\data\Output\Customer.xlsx', sheet_name='Sheet1')
```

### On macOS/OS X ###
```python
df.to_excel('c:/dev/data/Output/Customer.xlsx', sheet_name='Sheet1')
```
