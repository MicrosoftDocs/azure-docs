---
title: Example destinations/outputs possible with Azure Machine Learning data preparation | Microsoft Docs
description: This document provides a set of examples of custom data destinations/outputs with Azure Machine Learning data preparation
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


# Sample of destination connections (Python) 

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


Before you read this appendix, read [Python extensibility overview](data-prep-python-extensibility-overview.md).


## Write to Excel 


Writing to Excel requires an additional library. Adding new libraries is documented in the extensibility overview. `openpyxl` is the library that you need to add.

Before you write to Excel, some other changes might be needed. Some of the data types that are used in data preparation are not supported in some destination formats. For example, if "Error" objects exist, they won't serialize correctly to Excel. Thus, before you attempt to write to Excel, you need a "Replace Error Values" transform, which removes errors from any columns.

If all of the previous work is complete, the following line writes the data table to a single sheet in an Excel document. Add a Transform DataFlow (Script) transform. Then enter the following code in an expression section.


### On Windows 
```python
df.to_excel('c:\dev\data\Output\Customer.xlsx', sheet_name='Sheet1')
```

### On macOS/OS X ###
```python
df.to_excel('c:/dev/data/Output/Customer.xlsx', sheet_name='Sheet1')
```
