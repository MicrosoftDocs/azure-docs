---
title:  "Algorithm & module reference"
description: Learn about the modules available in Azure Machine Learning designer (preview)
titleSuffix: Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

<<<<<<< HEAD
author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
=======
author: likebupt
ms.author: keli19
ms.date: 10/14/2019
>>>>>>> 24cbc9989ef... add 9 new modules; change module reference; change studio to designer
---
# Algorithm & module reference overview

This reference content provides the technical background on each of the machine learning algorithms and modules available in Azure Machine Learning designer (preview).

Each module represents a set of code that can run independently and perform a machine learning task, given the required inputs. A module might contain a particular algorithm, or perform a task that is important in machine learning, such as missing value replacement, or statistical analysis.

> [!TIP]
> In any experiment in the designer, you can get information about a specific module. Select the module, then select the **more help** link in the **Quick Help** pane.

## Modules

Modules are organized by functionality:

| Functionality | Description | Module |
| --- |--- | ---- |
| Data input and output | Move data from cloud sources into your experiment. Write your results or intermediate data to Azure Storage, a SQL database, or Hive, while running an experiment, or use cloud storage to exchange data between experiments.  | [Import Data](import-data.md)<br/>[Export Data](export-data.md)<br/>[Enter Data Manually](enter-data-manually.md) |
| Data transformation | Operations on data that are unique to machine learning, such as normalizing or binning data, dimensionality reduction, and converting data among various file formats.| [Add Columns](add-columns.md) <br/> [Add Rows](add-rows.md) <br/> [Clean Missing Data](clean-missing-data.md) <br/> [Convert to CSV](convert-to-csv.md) <br/> [Convert to Dataset](convert-to-dataset.md) <br/> [Convert to Indicator Values](convert-to-indicator-values.md) <br/> [Edit Metadata](edit-metadata.md) <br/> [Join Data](join-data.md) <br/> [Normalize Data](normalize-data.md) <br/> [Partition and Sample](partition-and-sample.md) <br/> [Remove Duplicate Rows](remove-duplicate-rows.md) <br/> [Select Columns Transform](select-columns-transform.md) <br/> [Select Columns in Dataset](select-columns-in-dataset.md) <br/> [Split Data](split-data.md) |
| Feature Selection | Select a subset of relevant, useful features to use in building an analytical model. | [Permutation Feature Importance](permutation-feature-importance.md) <br/> [Filter Based Feature Selection](filter-based-feature-selection.md) |
| Python  and R modules | Write code and embed it in a module to integrate Python and R with your experiment. | [Execute Python Script](execute-python-script.md)   <br/> [Create Python Model](create-python-model.md) <br/> [Execute R Script](execute-r-script.md)
| Text Analytics | Provide specialized computational tools for working with both structured and unstructured text. | [Extract N Gram Features from Text](extract-n-gram-features-from-text.md) <br/> [Feature Hashing](feature-hashing.md) <br/> [Preprocess Text](preprocess-text.md) |
| Recommender | Build recommendation models. | [Train SVD Recommender](train-SVD-recommender.md) <br/> [Score SVD Recommender](score-svd-recommender.md) <br/> [Evaluate Recommender](evaluate-recommender.md) |
|  | **Machine learning algorithms**: | |
| Classification | Predict a class.  Choose from binary (two-class) or multiclass algorithms.| [Multiclass Decision Forest](multiclass-decision-forest.md) <br/> [Multiclass Boosted Decision Tree](multiclass-boosted-decision-tree.md) <br/> [Multiclass Logistic Regression](multiclass-logistic-regression.md)  <br/> [Multiclass Neural Network](multiclass-neural-network.md)  <br/>  [Two-Class Logistic Regression](two-class-logistic-regression.md)  <br/>[Two-Class Averaged Perceptron](two-class-averaged-perceptron.md) <br/> [Two-Class&nbsp;Boosted&nbsp;Decision&nbsp;Tree](two-class-boosted-decision-tree.md)  <br/> [Two-Class Decision Forest](two-class-decision-forest.md)  <br/> [Two-Class Neural Network](two-class-neural-network.md) <br/> [Two Class Support Vector Machine](two-class-support-vector-machine.md) | 
| Clustering | Group data together.| [K-Means Clustering](k-means-clustering.md)
| Regression | Predict a value. | [Linear Regression](linear-regression.md)  <br/> [Neural Network Regression](neural-network-regression.md)  <br/> [Decision Forest Regression](decision-forest-regression.md)  <br/> [Boosted&nbsp;Decision&nbsp;Tree&nbsp;Regression](boosted-decision-tree-regression.md)
|  | **Build and evaluate models**: | |
| Model Training | Run data through the algorithm. | [Train Model](train-model.md)  <br/> [Train Clustering Model](train-clustering-model.md) |
| Model Scoring & Evaluation | Get predictions and Measure the accuracy of the trained model. |  [Apply Transformation](apply-transformation.md) <br/> [Assign Data to Clusters](assign-data-to-clusters.md) <br/> [Cross Validate Model](cross-validate-model.md) <br/> [Evaluate Model](evaluate-model.md) <br/> [Score Model](score-model.md)|

## Error messages

Learn about the [error messages and exception codes](machine-learning-module-error-codes.md)  you might encounter using modules in Azure Machine Learning designer.
