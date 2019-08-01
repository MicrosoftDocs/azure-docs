---
title:  "Convert to CSV: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Convert to CSV module in Azure Machine Learning service to convert a dataset into a CSV format that can be downloaded, exported, or shared with R or Python script modules.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---

# Convert to CSV module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to convert a dataset into a CSV format that can be downloaded, exported, or shared with R or Python script modules.

### More about the CSV format 

The CSV format, which stands for "comma-separated values", is a file format used by many external machine learning tools. CSV is a common interchange format when working with open-source languages such as R or Python.

Even if you do most of your work in Azure Machine Learning, there are times when you might find it handy to convert your dataset to CSV to use in external tools. For example:

+ Download the CSV file to open it with Excel, or import it into a relational database.  
+ Save the CSV file to cloud storage and connect to it from Power BI to create visualizations.  
+ Use the CSV format to prepare data for use in R and Python. Just right-click the output of the module to generate the code needed to access the data directly from Python or a Jupyter notebook. 

When you convert a dataset to CSV, the file is saved in your Azure ML workspace. You can use an Azure storage utility to open and use the file directly, or you can right-click the module output and download the CSV file to your computer, or use it in R or Python code.  

## How to configure Convert to CSV

1.  Add the [Convert to CSV](./convert-to-csv.md) module to your experiment. You can find this module in the **Data Format Conversions** group in the interface. 

2. Connect it to any module that outputs a dataset.   
  
3.  Run the experiment.

### Results
  

Double-click the output of [Convert to CSV](./convert-to-csv.md), and select one of these options.  

 + **Result Dataset -> Download**: Immediately opens a copy of the data in CSV format that you can save to a local folder. If you do not specify a folder, a default file name is applied and the CSV file is saved in the local **Downloads** library.


 + **Result Dataset -> Save as Dataset**: Saves the CSV file back to the Azure ML workspace as a separate dataset.

 + **Generate Data Access Code**: Azure ML generates two sets of code for you to access the data, either by using Python or by using R. To access the data, copy the code snippet into your application. (*Generate Data Access Code will come soon.*)

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 