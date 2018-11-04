---
title: Use Python extensibility with Azure Machine Learning Data Preparations | Microsoft Docs
description: This document provides an overview and some detailed examples of how to use Python code to extend the functionality of data preparation
services: machine-learning
author: euangMS
ms.author: euang
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article
ms.date: 05/09/2018

ROBOTS: NOINDEX
---
# Data Preparations Python extensions

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


As a way of filling in functionality gaps between built-in features, Azure Machine Learning Data Preparations includes extensibility at multiple levels. In this document, we outline the extensibility via Python script. 

## Custom code steps 
Data Preparations has the following custom steps where users can write code:

* Add Column
* Advanced Filter
* Transform Dataflow
* Transform Partition

## Code block types 
For each of these steps, we support two code block types. First, we support a bare Python Expression that is executed as is. Second, we support a Python Module where we call a particular function with a known signature in the code you supply.

For example, you can add a new column that calculates the log of another column in the following two ways:

Expression 

```python    
    math.log(row["Score"])
```

Module 
    
```python
def newvalue(row): 
        return math.log(row["Score"])
```


The Add Column transform in Module mode expects to find a function called `newvalue` that accepts a row variable and returns the value for the column. This module can include any quantity of Python code with other functions, imports, etc.

The details of each extension point are discussed in the following sections. 

## Imports 
If you use the Expression block type, you can still add **import** statements to your code. They all must be grouped on the top lines of your code.

Correct 

```python
import math 
import numpy 
math.log(row["Score"])
```
 

Error  

```python
import math  
math.log(row["Score"])  
import numpy
```
 
 
If you use the Module block type, you can follow all the normal Python rules for using the **import** statement. 

## Default imports
The following imports are always included and usable in your code. You don't need to reimport them. 

```python
import math  
import numbers  
import datetime  
import re  
import pandas as pd  
import numpy as np  
import scipy as sp
```
  

## Install new packages
To use a package that's not installed by default, you first need to install it into the environments that Data Preparations uses. This installation needs to be done both on your local machine and on any compute targets you want to run on.

To install your packages in a compute target, you have to modify the conda_dependencies.yml file located in the aml_config folder under the root of your project.

### Windows 
To find the location on Windows, find the app-specific installation of Python and its scripts directory. The default location is:  

`C:\Users\<user>\AppData\Local\AmlWorkbench\Python\Scripts` 

Then run either of the following commands: 

`conda install <libraryname>` 

or 

`pip install <libraryname> `

### Mac 
To find the location on a Mac, find the app-specific installation of Python and its scripts directory. The default location is: 

`/Users/<user>/Library/Caches/AmlWorkbench/Python/bin` 

Then run either of the following commands: 

`./conda install <libraryname>`

or 

`./pip install <libraryname>`

## Use custom modules
In Transform Dataflow (Script), write the following Python code

```python
import sys
sys.path.append(*<absolute path to the directory containing UserModule.py>*)

from UserModule import ExtensionFunction1
df = ExtensionFunction1(df)
```

In Add Column (Script), set Code Block Type = Module, and write the following Python code

```python 
import sys
sys.path.append(*<absolute path to the directory containing UserModule.py>*)

from UserModule import ExtensionFunction2

def newvalue(row):
    return ExtensionFunction2(row)
```
For different execution contexts (local, Docker, Spark), point absolute path to the right place. You may want to use “os.getcwd() + relativePath” to locate it.


## Column data 
Column data can be accessed from a row by using dot notation or key-value notation. Column names that contain spaces or special characters can't be accessed by using dot notation. The `row` variable should always be defined in both modes of Python extensions (Module and Expression). 

Examples 

```python
    row.ColumnA + row.ColumnB  
    row["ColumnA"] + row["ColumnB"]
```

## Add Column 
### Purpose
The Add Column extension point lets you write Python to calculate a new column. The code you write has access to the full row. It needs to return a new column value for each row. 

### How to use
You can add this extension point by using the Add Column (Script) block. It's available on the top-level **Transformations** menu, as well as on the **Column** context menu. 

### Syntax
Expression

```python
    math.log(row["Score"])
```

Module 

```python
def newvalue(row):  
     return math.log(row["Score"])
```
 

## Advanced Filter
### Purpose 
The Advanced Filter extension point lets you write a custom filter. You have access to the entire row, and your code must return True (include the row) or False (exclude the row). 

### How to use
You can add this extension point by using the Advanced Filter (Script) block. It's available on the top-level **Transformations** menu. 

### Syntax

Expression

```python
    row["Score"] > 95
```

Module  

```python
def includerow(row):  
    return row["Score"] > 95
```
 

## Transform Dataflow
### Purpose 
The Transform Dataflow extension point lets you completely transform the data flow. You have access to a Pandas dataframe that contains all the columns and rows that you're processing. Your code must return a Pandas dataframe with the new data. 

>[!NOTE]
>In Python, all the data to be loaded into memory is in a Pandas dataframe if this extension is used. 
>
>In Spark, all the data is collected onto a single worker node. If the data is very large, a worker might run out of memory. Use it carefully.

### How to use 
You can add this extension point by using the Transform Dataflow (Script) block. It's available on the top-level **Transformations** menu. 
### Syntax 

Expression

```python
    df['index-column'] = range(1, len(df) + 1)  
    df = df.reset_index()
```
 

Module 

```python
def transform(df):  
    df['index-column'] = range(1, len(df) + 1)  
    df = df.reset_index()  
    return df
```
  

## Transform Partition  
### Purpose 
The Transform Partition extension point lets you transform a partition of the data flow. You have access to a Pandas dataframe that contains all the columns and rows for that partition. Your code must return a Pandas dataframe with the new data. 

>[!NOTE]
>In Python, you might end up with a single partition or multiple partitions, depending on the size of your data. In Spark, you're working with a dataframe that holds the data for a partition on a given worker node. In both cases, you can't assume that you have access to the entire data set. 


### How to use
You can add this extension point by using the Transform Partition (Script) block. It's available on the top-level **Transformations** menu. 

### Syntax 

Expression 

```python
    df['partition-id'] = index  
    df['index-column'] = range(1, len(df) + 1)  
    df = df.reset_index()
```
 

Module 

```python
def transform(df, index):
    df['partition-id'] = index
    df['index-column'] = range(1, len(df) + 1)
    df = df.reset_index()
    return df
```


## DataPrepError  
### Error values  
In Data Preparations, the concept of error values exists. 

It's possible to encounter error values in custom Python code. They are instances of a Python class called `DataPrepError`. This class wraps a Python exception and has a couple of properties. The properties contain information about the error that occurred when the original value was processed, as well as the original value. 


### DataPrepError class definition
```python 
class DataPrepError(Exception): 
    def __bool__(self): 
        return False 
``` 
The creation of a DataPrepError in the Data Preparations Python framework generally looks like this: 
```python 
DataPrepError({ 
   'message':'Cannot convert to numeric value', 
   'originalValue': value, 
   'exceptionMessage': e.args[0], 
   '__errorCode__':'Microsoft.DPrep.ErrorValues.InvalidNumericType' 
}) 
``` 
#### How to use 
It's possible when Python runs at an extension point to generate DataPrepErrors as return values by using the previous creation method. It's much more likely that DataPrepErrors are encountered when data is processed at an extension point. At this point, the custom Python code needs to handle a DataPrepError as a valid data type.

#### Syntax 
Expression 
```python 
    if (isinstance(row["Score"], DataPrepError)): 
        row["Score"].originalValue 
    else: 
        row["Score"] 
``` 
```python 
    if (hasattr(row["Score"], "originalValue")): 
        row["Score"].originalValue 
    else: 
        row["Score"] 
``` 
Module 
```python 
def newvalue(row): 
    if (isinstance(row["Score"], DataPrepError)): 
        return row["Score"].originalValue 
    else: 
        return row["Score"] 
``` 
```python 
def newvalue(row): 
    if (hasattr(row["Score"], "originalValue")): 
        return row["Score"].originalValue 
    else: 
        return row["Score"] 
```  
