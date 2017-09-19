---
title: Using Python extensibility with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides the overview and some detailed examples of how to use Python code to extend the functionality of data prep
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
ms.date: 09/07/2017
---

# Data prep Python extensions
As a way of filling in functionality gaps between built-in features Data Prep includes extensibility at multiple levels. In this document, we outline the extensibility via Python script. 

## Custom code steps 
Data Prep has the following custom steps where users can write code: 
1. File Reader*
2. Writer*
3. Add Column
4. Advanced Filter
5. Transform Dataflow
6. Transform Partition

*These steps are not currently supported in a Spark execution. 

## Code block types 
For each of these steps, we support two code block types. First, we support a bare Python Expression that is executed as-is. Second, we support a Python Module where we call a particular function with a known signature in the code you supply.

For example, you could add a new column that calculates the log of another column in the following two ways: 
Expression: 

```python    
    math.log(row["Score"])
```

Module: 
    
```python
def newvalue(row): 
        return math.log(row["Score"])
```


The Add Column transform in module-mode expects to find a function called `newvalue` that accepts a row variable and returns the value for the column. This module can include any quantity of Python code with other functions, imports, etc. 

The details of each extension point are discussed in the following sections: 

## Imports 
If you are using the Expression block type, you are still able to add import statements to your code, but they must all be grouped on the top lines of your code. 
Correct: 

```python
import math 
import numpy 
math.log(row["Score"])
```
 

Error:  

```python
import math  
math.log(row["Score"])  
import numpy
```
 
 
If you are using the Module block type, then you can follow all the normal Python rules for using the ‘import’ statement. 

## Default imports
The following imports are always included and usable in your code. You do not need to reimport them. 

```python
import math  
import numbers  
import datetime  
import re  
import pandas as pd  
import numpy as np  
import scipy as sp
```
  

## Installing new packages
To use a package that is not installed by default, you first need to install it into the environments that Data Prep uses. This installation needs done both on your local machine and on any compute targets you wish to run on.

To install your packages in a compute target, you have to modify the conda_dependencies.yml file located in the aml_config folder under the root of your project.

### Windows 
The way to find the location on Windows is, find the app-specific installation of python and its scripts directory, the default is:  

`C:\Users\<user>\AppData\Local\AmlWorkbench\Python\Scripts.` 

Then run either of the following commands: 

`conda install <libraryname>` 

or 

`pip install <libraryname> `

### Mac 
To find the location on Mac, find the app-specific installation of python and its scripts directory, the default location is: 

`/Users/<user>/Library/Caches/AmlWorkbench>/Python/bin` 

Then run either of the following commands: 

`./conda install <libraryname>`

or 

`./pip install <libraryname>`

## Column data 
Column data can be accessed from a row using the dot notation or by using the key-value notation. Column names that contain spaces or special characters cannot be accessed using the dot notation. The `row` variable should always be defined in both modes of python extensions (Module and Expression). 

Examples: 

```python
    row.ColumnA + row.ColumnB  
    row["ColumnA"] + row["ColumnB"]
```

## File reader 
### Purpose 
This extension point lets you fully control the process of reading a file into a dataflow. The system calls your code, passing in the list of files that you should process, and your code needs to create and return a Pandas dataframe. 

>[!NOTE]
>This extension point does not work in Spark. 

### How to use 
You access this extension point from the Open Data Source wizard. Choose File on the first page, and then choose your file location. On the ‘Choose File Parameters’ page, drop down the File Type and choose ‘Custom File (Script)’. 

Your code is given a Pandas dataframe named ‘df’ that contains information about the files you need to read. If you chose to open a directory that contains multiple files the dataframe contains more than one row.  

This dataframe has the following columns: 
- Path – The file to be read.
- PathHint – Tells you where the file is located. Values: ‘Local’, ‘AzureBlobStorage’, ‘AzureDataLakeStorage’
- AuthenticationType – The type of authentication used to access the file. Values: ‘None’, ‘SasToken’, ‘OAuthToken’
- AuthenticationValue -  Contains None or the token to be used.

### Syntax 
Expression: 

```python
    paths = df['Path'].tolist()  
    df = pd.read_csv(paths[0])
```


Module:  
```python
PathHint = Local  
def read(df):  
    paths = df['Path'].tolist()  
    filedf = pd.read_csv(paths[0])  
    return filedf  
```
 

## Writer 
### Purpose 
The writer extension point lets you fully control the process of writing data from a dataflow. The system calls your code, passing in a dataframe and your code can use the dataframe to write data however you wish. 

>[!NOTE]
>The writer extension point does not work in Spark. 

### How to use 
You can add this extension point using the ‘Write Dataflow (Script)’ block. It is available on the top-level Transformations menu. 

### Syntax 
Expression: 

```python
    df.to_csv('c:\\temp\\output.csv')
```

Module:

```python
def write(df):  
    df.to_csv('c:\\temp\\output.csv')  
    return df
```
 
 
This custom write block can exist in the middle of a list of steps, so if you use a Module then your write function must return the dataframe that is the input to the step that follows. 

## Add column 
### Purpose
This extension point lets you write Python to calculate a new column. The code you write has access to the full row. It needs to return a new column value for each row. 

### How to Use
You can add this extension point using the ‘Add Column (Script)’ block. It is available on the top-level Transformations menu as well as on the column context menu. 

### Syntax
Expression: 

```python
    math.log(row["Score"])
```

Module: 

```python
def newvalue(row):  
     return math.log(row["Score"])
```
 

## Advanced filter
### Purpose 
This extension point lets you write a custom filter. You have access to the entire row and your code must return True (include the row) or False (exclude the row). 

### How to use
You can add this extension point using the ‘Advanced Filter (Script)’ block. It is available on the top-level Transformations menu. 

### Syntax

Expression: 

```python
    row["Score"] > 95
```

Module:  

```python
def includerow(row):  
    return row["Score"] > 95
```
 

## Transform dataflow
### Purpose 
The extension point lets you completely transform the dataflow. You have access to a Pandas dataframe that contains all the columns and rows that you are processing and your code must return a Pandas dataframe with the new data. 

>[!NOTE]
>In Python, all the data to be loaded into memory in a Pandas dataframe if this extension is used. 

In Spark, all the data is collected onto a single worker node. This could result in a worker running out of memory if the data is very large. Use it carefully.

### How to use 
You can add this extension point using the ‘Transform Dataflow (Script)’ block. It is available on the top-level Transformations menu. 
### Syntax 

Expression: 

```python
    df['index-column'] = range(1, len(df) + 1)  
    df = df.reset_index()
```
 

Module: 

```python
def transform(df):  
    df['index-column'] = range(1, len(df) + 1)  
    df = df.reset_index()  
    return df
```
  

## Transform partition  
### Purpose 
This extension point lets you transform a partition of the dataflow. You have access to a Pandas dataframe that contains all the columns and rows for that partition and your code must return a Pandas dataframe with the new data. 

>[!NOTE]
>In Python, you may end up with a single partition or multiple partitions depending on the size of your data. In Spark, you are working with a dataframe that holds the data for a partition on a given worker node. In both cases, you cannot assume that you have access to the entire data set. 

### How to use
You can add this extension point using the ‘Transform Partition (Script)’ block. It is available on the top-level Transformations menu. 

### Syntax 

Expression: 

```python
    df['partition-id'] = index  
    df['index-column'] = range(1, len(df) + 1)  
    df = df.reset_index()
```
 

Module: 

```python
def transform(df, index):
    df['partition-id'] = index
    df['index-column'] = range(1, len(df) + 1)
    df = df.reset_index()
    return df
```


## DataPrepError  
### Error values  
In Data Prep, there exists the concept of error values. They're creation and reason for existence is covered here <link to error values doc>. 

It is possible to encounter Error Values in custom python code. They are instances of a Python class called `DataPrepError`. This class wraps a Python Exception and has a couple of properties, which contain information about the error that occurred when processing the original value, as well as the original value. 

### DataPrepError class definition ### 
```python 
class DataPrepError(Exception): 
    def __bool__(self): 
        return False 
``` 
The creation of a DataPrepError in Data Prep's python framework generally looks like this: 
```python 
DataPrepError({ 
   'message':'Cannot convert to numeric value', 
   'originalValue': value, 
   'exceptionMessage': e.args[0], 
   '__errorCode__':'Microsoft.DPrep.ErrorValues.InvalidNumericType' 
}) 
``` 
#### How to use #### 
It is possible for Python being run at an extension point to generate DataPrepErrors as return values, using the creation method from earlier. 
It is much more likely that DataPrepErrors will encountered when processing data at an extension point. At this point, the custom Python code needs to handle DataPrepError as a valid data type. 

#### Syntax #### 
Expression:  
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
Module:  
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