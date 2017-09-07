---
title: Using Python extensibility with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides the overview and some detailed examples of how to use Python code to extend the functionality of data prep
services: machine-learning
author: euangMS
ms.author: euang
manager: 
ms.reviewer: 
ms.service: 
ms.workload: 
ms.custom: 
ms.devlang: 
ms.topic: 
ms.date: 09/07/2017
---

# Data Prep Python Extensions #
As a way of filling in functionality gaps between built-in features Data Prep includes extensibility at multiple levels. In this document, we outline the extensibility via Python script. 

## Custom Code Steps ##
Data Prep has the following custom steps where users can write code: 
1. Reader**
2. File Reader*
3. Writer*
4. File Writer**
5. Add Column
6. Advanced Filter
7. Transform Dataflow
8. Transform Partition

*These steps are not currently supported in a Spark execution. 
**These steps are not yet implemented. 

## Code Block Types ##
For each of these steps, we support two code block types. First, we support a bare Python Expression that is executed as-is. Second, we support a Python Module where we call a particular function with a known signature in the code you supply.

For example, you could add a new column that calculates the log of another column in the following two ways: 
Expression: 

```python    
    math.log(row.Score)
```

Module: 
    
```python
def newvalue(row): 
        return math.log(row.Score)
```


The Add Column transform in module-mode expects to find a function called `newvalue`"` that accepts a row variable and returns the value for the column. This module can include any quantity of Python code with other functions, imports, etc. 

The details of each extension point are discussed in the following sections: 

## Imports ##
If you are using the Expression block type, you are still able to add import statements to your code, but they must all be grouped on the top lines of your code. 
Correct: 

```python
import math 
import numpy 
math.log(row.Score)
```
 

Error:  

```python
import math  
math.log(row.Score)  
import numpy
```
 
 
If you are using the Module block type, then you can follow all the normal Python rules for using the ‘import’ statement. 

## Default Imports ##
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
  

## Installing New Packages ##
To use a package that is not installed by default, you first need to install it into the environments that Data Prep uses. This installation needs done both on your local machine and on Spark if you are using it. 

### Windows ###
The way to find the location on Windows is, find the app-specific installation of python and its scripts directory, the default is:  

`C:\Users\<user>\AppData\Local\<appcodename>\Python\Scripts.` 

Then run either of the following commands: 

`conda install <libraryname>` 

or 

`pip install <libraryname> `

### Mac ###
To find the location on Mac, find the app-specific installation of python and its scripts directory, the default location is: 

`/Users/<user>/Library/Caches/<appcodename>/Python/bin` 

Then run either of the following commands: 

`./conda install <libraryname>`

or 

`./pip install <libraryname>`

## Column Data ##
Column data can be accessed from a row using the dot notation or by using the key-value notation. Column names that contain spaces or special characters cannot be access using the dot notation. 

Examples: 

```python
    row.ColumnA + row.ColumnB  
    row["ColumnA"] + row["ColumnB"]
```


## Reader (Under Development) ##
### Purpose ###
This extension point lets you fully control the process of reading data into a dataflow. You could call a web site, load a custom file format, etc. The system calls your code when it needs data and your code needs to create and return a Pandas dataframe. 

### How to Use ###
You are able to access this extension point from the Open Data Source wizard. It is a top-level option alongside File, Database, and Reference. 

## File Reader ##
### Purpose ###
This extension point lets you fully control the process of reading a file into a dataflow. The system calls your code, passing in the list of files that you should process, and your code needs to create and return a Pandas dataframe. 

NOTE: This extension point does not work in Spark. 

### How to Use ###
You access this extension point from the Open Data Source wizard. Choose File on the first page, and then choose your file location. On the ‘Choose File Parameters’ page, drop down the File Type and choose ‘Custom File (Script)’. 

Your code is given a Pandas dataframe named ‘df’ that contains information about the files you need to read. If you chose to open a directory that contains multiple files the dataframe contains more than one row.  

This dataframe has the following columns: 
- Path – The file to be read.
- PathHint – Tells you where the file is located. Values: ‘Local’, ‘AzureBlobStorage’, ‘AzureDataLakeStorage’
- AuthenticationType – The type of authentication used to access the file. Values: ‘None’, ‘SasToken’, ‘OAuthToken’
- AuthenticationValue -  Contains None or the token to be used.

### Syntax ###
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
PathHint = AzureBlobStorage (TODO: Add example)  
PathHint = AzureDataLakeStorage (TODO: Add example)
```
 

## Writer ##
### Purpose ###
The writer extension point lets you fully control the process of writing data from a dataflow. The system calls your code, passing in a dataframe and your code can use the dataframe to write data however you wish. 

NOTE: The writer extension point does not work in Spark. 

### How to Use ###
You can add this extension point using the ‘Write Dataflow (Script)’ block. It is available on the top-level Transformations menu. 

### Syntax ###
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

## File Writer (Under Development) ##
### Purpose ###
This extension point lets you fully control the process of writing a file from a dataflow. The system calls your code, passing in the files or directory that you should write to along with a dataframe, and your code write out the file however you need. 

### How to Use ###
You are able to access the extension point using the ‘Write Dataflow to File (Script)’ block. It is available on the top-level Transformations menu. 

### Add Column ###
#### Purpose ####
This extension point lets you write Python to calculate a new column. The code you write has access to the full row. It needs to return a new column value for each row. 

### How to Use ###
You can add this extension point using the ‘Add Column (Script)’ block. It is available on the top-level Transformations menu as well as on the column context menu. 

### Syntax ###
Expression: 

```python
    math.log(row.Score)
```

Module: 

```python
def newvalue(row):  
     return math.log(row.Score)
```
 

## Advanced Filter ##
### Purpose ###
This extension point lets you write a custom filter. You have access to the entire row and your code must return True (include the row) or False (exclude the row). 

### How to Use ###
You can add this extension point using the ‘Advanced Filter (Script)’ block. It is available on the top-level Transformations menu. 

### Syntax ###

Expression: 

```python
    row.Score > 95
```

Module:  

```python
def includerow(row):  
    return row.Score > 95
```
 

## Transform Dataflow ##
### Purpose ###
The extension point lets you completely transform the dataflow. You have access to a Pandas dataframe that contains all the columns and rows that you are processing and your code must return a Pandas dataframe with the new data. 

NOTE: In Python, all the data to be loaded into memory in a Pandas dataframe if this extension is used. 

In Spark, all the data is collected onto a single worker node. Use it carefully. 

### How to Use ### 
You can add this extension point using the ‘Transform Dataflow (Script)’ block. It is available on the top-level Transformations menu. 
### Syntax ###

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
  

## Transform Partition ## 
### Purpose ###
This extension point lets you transform a partition of the dataflow. You have access to a Pandas dataframe that contains all the columns and rows for that partition and your code must return a Pandas dataframe with the new data. 

NOTE: In Python, you may end up with a single partition or multiple partitions depending on the size of your data. In Spark, you are working with a dataframe that holds the data for a partition on a given worker node. In both cases, you cannot assume that you have access to the entire data set. 

### How to Use ###
You can add this extension point using the ‘Transform Partition (Script)’ block. It is available on the top-level Transformations menu. 

### Syntax ###

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
  