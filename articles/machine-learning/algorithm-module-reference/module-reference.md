---
title:  "Algorithm & module reference"
description: Learn about the modules available in Azure Machine Learning designer (preview)
titleSuffix: Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: peterclu
ms.author: peterlu
ms.date: 12/17/2019
---
# Algorithm & module reference for Azure Machine Learning designer

This reference content provides the technical background on each of the machine learning algorithms and modules available in Azure Machine Learning designer (preview).

Each module represents a set of code that can run independently and perform a machine learning task, given the required inputs. A module might contain a particular algorithm, or perform a task that is important in machine learning, such as missing value replacement, or statistical analysis.

> [!TIP]
> In any pipeline in the designer, you can get information about a specific module. Select the module, then select the **more help** link in the **Quick Help** pane.

## Modules

Modules are organized by functionality:

| Functionality | Description | Module |
| --- |--- | --- |
|  | **Data preparation**: | |
| Data input and output | Move data from cloud sources into your pipeline. Write your results or intermediate data to Azure Storage, a SQL database, or Hive, while running a pipeline, or use cloud storage to exchange data between pipelines.  | [Enter Data Manually](enter-data-manually.md) <br/> [Export Data](export-data.md) <br/> [Import Data](import-data.md) |
| Data transformation | Operations on data that are unique to machine learning, such as normalizing or binning data, dimensionality reduction, and converting data among various file formats.| [Add Columns](add-columns.md) <br/> [Add Rows](add-rows.md) <br/> [Apply Math Operation](apply-math-operation.md) <br/> [Apply SQL Transformation](apply-sql-transformation.md) <br/> [Clean Missing Data](clean-missing-data.md) <br/> [Clip Values](clip-values.md) <br/> [Convert to CSV](convert-to-csv.md) <br/> [Convert to Dataset](convert-to-dataset.md) <br/> [Edit Metadata](edit-metadata.md) <br/> [Join Data](join-data.md) <br/> [Normalize Data](normalize-data.md) <br/> [Partition and Sample](partition-and-sample.md)  <br/> [Remove Duplicate Rows](remove-duplicate-rows.md) <br/> [SMOTE](smote.md) <br/> [Select Columns Transform](select-columns-transform.md) <br/> [Select Columns in Dataset](select-columns-in-dataset.md) <br/> [Split Data](split-data.md) |
| Feature Selection | Select a subset of relevant, useful features to use in building an analytical model. | [Filter Based Feature Selection](filter-based-feature-selection.md) <br/> [Permutation Feature Importance](permutation-feature-importance.md) |
| Statistical Functions | Provide a wide variety of statistical methods related to data science. | [Summarize Data](summarize-data.md)|
|  | **Machine learning algorithms**: | |
| Regression | Predict a value. | [Boosted Decision Tree Regression](boosted-decision-tree-regression.md) <br/> [Decision Forest Regression](decision-forest-regression.md) <br/> [Linear Regression](linear-regression.md)  <br/> [Neural Network Regression](neural-network-regression.md)  <br/> |
| Clustering | Group data together.| [K-Means Clustering](k-means-clustering.md)
| Classification | Predict a class.  Choose from binary (two-class) or multiclass algorithms.| [Multiclass Boosted Decision Tree](multiclass-boosted-decision-tree.md) <br/> [Multiclass Decision Forest](multiclass-decision-forest.md) <br/> [Multiclass Logistic Regression](multiclass-logistic-regression.md)  <br/> [Multiclass Neural Network](multiclass-neural-network.md) <br/> [One vs. All Multiclass](one-vs-all-multiclass.md) <br/> [Two-Class Averaged Perceptron](two-class-averaged-perceptron.md) <br/>  [Two-Class Boosted Decision Tree](two-class-boosted-decision-tree.md)  <br/> [Two-Class Decision Forest](two-class-decision-forest.md) <br/>  [Two-Class Logistic Regression](two-class-logistic-regression.md) <br/> [Two-Class Neural Network](two-class-neural-network.md) <br/> [Two Class Support Vector Machine](two-class-support-vector-machine.md) | 
|  | **Build and evaluate models**: | |
| Model training | Run data through the algorithm. |  [Train Clustering Model](train-clustering-model.md) <br/> [Train Model](train-model.md)  <br/> [Tune Model Hyperparameters](tune-model-hyperparameters.md) |
| Model Scoring and Evaluation | Measure the accuracy of the trained model. | [Apply Transformation](apply-transformation.md) <br/> [Assign Data to Clusters](assign-data-to-clusters.md) <br/> [Cross Validate Model](cross-validate-model.md) <br/> [Evaluate Model](evaluate-model.md) <br/> [Score Model](score-model.md) |
| Python language | Write code and embed it in a module to integrate Python with your pipeline. | [Create Python Model](create-python-model.md) <br/> [Execute Python Script](execute-python-script.md) |
| R language | Write code and embed it in a module to integrate R with your pipeline. | [Execute R Script](execute-r-script.md) |
| Text Analytics | Provide specialized computational tools for working with both structured and unstructured text. | [Extract N Gram Features from Text](extract-n-gram-features-from-text.md) <br/> [Feature Hashing](feature-hashing.md) <br/> [Preprocess Text](preprocess-text.md) |
| Recommendation | Build recommendation models. | [Evaluate Recommender](evaluate-recommender.md) <br/> [Score SVD Recommender](score-svd-recommender.md) <br/> [Train SVD Recommender](train-SVD-recommender.md) |

## Error messages

Learn about the [error messages and exception codes](designer-error-codes.md) you might encounter using modules in Azure Machine Learning designer.
