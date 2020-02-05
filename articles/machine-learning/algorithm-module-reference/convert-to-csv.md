---
title:  "Convert to CSV: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Convert to CSV module in Azure Machine Learning to convert a dataset into a CSV format that can be downloaded, exported, or shared with R or Python script modules.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---

# Convert to CSV module

This article describes a module in Azure Machine Learning designer (preview).

Use this module to convert a dataset into a CSV format that can be downloaded, exported, or shared with R or Python script modules.

### More about the CSV format 

The CSV format, which stands for "comma-separated values", is a file format used by many external machine learning tools. CSV is a common interchange format when working with open-source languages such as R or Python.

Even if you do most of your work in Azure Machine Learning, there are times when you might find it handy to convert your dataset to CSV to use in external tools. For example:

+ Download the CSV file to open it with Excel, or import it into a relational database.  
+ Save the CSV file to cloud storage and connect to it from Power BI to create visualizations.  
+ Use the CSV format to prepare data for use in R and Python. 

When you convert a dataset to CSV, the csv is saved in your Azure ML workspace. You can use an Azure storage utility to open and use the file directly. You can also access the CSV in the designer by selecting the **Convert to CSV** module, then select the histogram icon under the **Outputs** tab in the right panel to view the output. You can download the CSV from the Results folder to a local directory.  

## How to configure Convert to CSV


1.  Add the Convert to CSV module to your pipeline. You can find this module in the **Data Transformation** group in the designer. 

2. Connect it to any module that outputs a dataset.   
  
3.  Run the pipeline.

### Results
  

Select the **Outputs** tab in the right panel of **Convert to CSV**, and select on one of these icons under the **Port outputs**.  

+ **Register dataset**: Select the icon and save the CSV file back to the Azure ML workspace as a separate dataset. You can find the dataset as a module in the module tree under the **My Datasets** section.

 + **View output**: Select the eye icon, and follow the instruction to browse the **Results_dataset** folder, and download the data.csv file.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 