---
title:  "Algorithm & module reference"
titleSuffix: Azure Machine Learning service
description: Learn about the modules available in the Azure Machine Learning visual interface
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: amlstudiodocs
ms.date: 05/06/2019
---
# Algorithm & module reference overview

This reference content provides the technical background on each of the machine learning algorithms and modules available in the visual interface of Azure Machine Learning. 

Each module represents a set of code that can run independently and perform a machine learning task, given the required inputs. A module might contain a particular algorithm, or perform a task that is important in machine learning, such as missing value replacement, or statistical analysis. 

> [!TIP]
> If you are signed in to the visual interface and have created an experiment, you can get information about a specific module. Select the module, then select the **more help** link in the **Quick Help** pane.

Modules are organized by functionality:

**Data format conversions**

  + [Convert to CSV ](convert-to-csv.md)

**Data input and output modules**  do the work of moving data from cloud sources into your experiment. You can write your results or intermediate data to Azure Storage, a SQL database, or Hive, while running an experiment, or use cloud storage to exchange data between experiments.  

  + [Import Data](import-data.md)

  + [Export Data](export-data.md)

  + [Enter Data Manually](enter-data-manually.md)


**Data transformation modules** support operations on data that are unique to machine learning, such as normalizing or binning data, feature selection, and dimensionality reduction.

  + [Select Columns in Dataset](select-columns-in-dataset.md)

  + [Edit Metadata](edit-metadata.md)

  + [Clean Missing Data](clean-missing-data.md)

  + [Add Columns](add-columns.md)

  + [Add Rows](add-rows.md)

  + [Remove Duplicate Rows](remove-duplicate-rows.md)

  + [Split Data](split-data.md)

  + [Normalize Data](normalize-data.md)

  + [Partition and Sample](partition-and-sample.md)


**Machine learning algorithms** such as clustering, support vector machine, or neural networks, are available within individual modules that let you customize the machine learning task with appropriate parameters.  
  + [Score Model](score-model.md)

  + [Train Model](train-model.md)

  + [Evaluate Model](evaluate-model.md)

  + [Apply Transformation](apply-transformation.md)

  + [Linear Regression](linear-regression.md)

  + [Neural Network Regression](neural-network-regression.md)

  + [Decision Forest Regression](decision-forest-regression.md)

  + [Boosted Decision Tree Regression](boosted-decision-tree-regression.md)

  + [Two-Class Boosted Decision Tree](two-class-boosted-decision-tree.md)

  + [Two-Class Logistic Regression](two-class-logistic-regression.md)

  + [Multiclass Logistic Regression](multiclass-logistic-regression.md)

  + [Multiclass Neural Network](multiclass-neural-network.md)

  + [Multiclass Decision Forest](multiclass-decision-forest.md)

  + [Two-Class Averaged Perceptron](two-class-averaged-perceptron.md)

  + [Two-Class Decision Forest](two-class-decision-forest.md)

  + [Two-Class Neural Network](two-class-neural-network.md)

  + [Two-Class Support Vector Machine](two-class-support-vector-machine.md)


**Python module** makes it easy to run a custom function. You write the code, and embed it in a module, to integrate Python with an experiment service.
  + [Execute Python Script](execute-python-script.md)


