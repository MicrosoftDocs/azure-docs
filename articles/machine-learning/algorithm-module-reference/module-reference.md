---
title:  "Algorithm & module reference"
titleSuffix: Azure Machine Learning service
description: Learn about the modules available in the Azure Machine Learning visual interface
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
---
# Algorithm & module reference overview

This reference content provides the technical background on each of the machine learning algorithms and modules available in the visual interface (preview) of Azure Machine Learning service.

Each module represents a set of code that can run independently and perform a machine learning task, given the required inputs. A module might contain a particular algorithm, or perform a task that is important in machine learning, such as missing value replacement, or statistical analysis.

> [!TIP]
> In any experiment in the visual interface, you can get information about a specific module. Select the module, then select the **more help** link in the **Quick Help** pane.

## Modules

Modules are organized by functionality:

| Functionality | Description | Module |
| --- |--- | ---- |
| Data format conversions | Convert data among various file formats used in machine learning, | [Convert to CSV](convert-to-csv.md) |
| Data input and output | Move data from cloud sources into your experiment. Write your results or intermediate data to Azure Storage, a SQL database, or Hive, while running an experiment, or use cloud storage to exchange data between experiments.  | [Import Data](import-data.md)<br/>[Export Data](export-data.md)<br/>[Enter Data Manually](enter-data-manually.md) |
| Data transformation | Operations on data that are unique to machine learning, such as normalizing or binning data, feature selection, and dimensionality reduction.| [Select Columns in Dataset](select-columns-in-dataset.md) <br/> [Edit Metadata](edit-metadata.md) <br/> [Clean Missing Data](clean-missing-data.md) <br/> [Add Columns](add-columns.md) <br/> [Add Rows](add-rows.md) <br/> [Remove Duplicate Rows](remove-duplicate-rows.md) <br/> [Join Data](join-data.md) <br/> [Split Data](split-data.md) <br/> [Normalize Data](normalize-data.md) <br/> [Partition and Sample](partition-and-sample.md) |
| Python  and R modules | Write code and embed it in a module to integrate Python and R with your experiment. | [Execute Python Script](execute-python-script.md)   <br/> [Create Python Model](create-python-model.md) <br/> [Execute R Script](execute-r-script.md)
|  | **Machine learning algorithms**: | |
| Classification | Predict a class.  Choose from binary (two-class) or multiclass algorithms.| [Multiclass Decision Forest](multiclass-decision-forest.md) <br/> [Multiclass Logistic Regression](multiclass-logistic-regression.md)  <br/> [Multiclass Neural Network](multiclass-neural-network.md)  <br/>  [Two-Class Logistic Regression](two-class-logistic-regression.md)  <br/>[Two-Class Averaged Perceptron](two-class-averaged-perceptron.md) <br/> [Two-Class&nbsp;Boosted&nbsp;Decision&nbsp;Tree](two-class-boosted-decision-tree.md)  <br/> [Two-Class Decision Forest](two-class-decision-forest.md)  <br/> [Two-Class Neural Network](two-class-neural-network.md)  <br/> [Two&#8209;Class&nbsp;Support&nbsp;Vector&nbsp;Machine](two-class-support-vector-machine.md) 
| Clustering | Group data together.| [K-Means Clustering](k-means-clustering.md)
| Regression | Predict a value. | [Linear Regression](linear-regression.md)  <br/> [Neural Network Regression](neural-network-regression.md)  <br/> [Decision Forest Regression](decision-forest-regression.md)  <br/> [Boosted&nbsp;Decision&nbsp;Tree&nbsp;Regression](boosted-decision-tree-regression.md)
|  | **Build and evaluate models**: | |
| Train   | Run data through the algorithm. | [Train Model](train-model.md)  <br/> [Train Clustering Model](train-clustering-model.md)    |
| Evaluate Model | Measure the accuracy of the trained model. |  [Evaluate Model](evaluate-model.md)
| Score | Get predictions from the model you've just trained. | [Apply Transformation](apply-transformation.md)<br/>[Assign&nbsp;Data&nbsp;to&nbsp;Clusters](assign-data-to-clusters.md) <br/>[Score Model](score-model.md)

## Error messages

Learn about the [error messages and exception codes](machine-learning-module-error-codes.md)  you might encounter using modules in the visual interface of Azure Machine Learning service.
