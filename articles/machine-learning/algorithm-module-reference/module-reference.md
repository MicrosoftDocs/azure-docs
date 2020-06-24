---
title:  "Algorithm & module reference"
description: Learn about the modules available in Azure Machine Learning designer (preview)
titleSuffix: Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 05/19/2020
---
# Algorithm & module reference for Azure Machine Learning designer (preview)

This reference content provides the technical background on each of the machine learning algorithms and modules available in Azure Machine Learning designer (preview).

Each module represents a set of code that can run independently and perform a machine learning task, given the required inputs. A module might contain a particular algorithm, or perform a task that is important in machine learning, such as missing value replacement, or statistical analysis.

For help with choosing algorithms, see 
* [How to select algorithms](../how-to-select-algorithms.md)
* [Azure Machine Learning Algorithm Cheat Sheet](../algorithm-cheat-sheet.md)

> [!TIP]
> In any pipeline in the designer, you can get information about a specific module. Select the **Learn more** link in the module card when hovering on the module in the module list, or in the right pane of the module.

## Data preparation modules


| Functionality | Description | Module |
| --- |--- | --- |
| Data Input and Output | Move data from cloud sources into your pipeline. Write your results or intermediate data to Azure Storage, SQL Database, or Hive, while running a pipeline, or use cloud storage to exchange data between pipelines.  | [Enter Data Manually](enter-data-manually.md) <br/> [Export Data](export-data.md) <br/> [Import Data](import-data.md) |
| Data Transformation | Operations on data that are unique to machine learning, such as normalizing or binning data, dimensionality reduction, and converting data among various file formats.| [Add Columns](add-columns.md) <br/> [Add Rows](add-rows.md) <br/> [Apply Math Operation](apply-math-operation.md) <br/> [Apply SQL Transformation](apply-sql-transformation.md) <br/> [Clean Missing Data](clean-missing-data.md) <br/> [Clip Values](clip-values.md) <br/> [Convert to CSV](convert-to-csv.md) <br/> [Convert to Dataset](convert-to-dataset.md) <br/> [Convert to Indicator Values](convert-to-indicator-values.md) <br/> [Edit Metadata](edit-metadata.md) <br/> [Group Data into Bins](group-data-into-bins.md) <br/> [Join Data](join-data.md) <br/> [Normalize Data](normalize-data.md) <br/> [Partition and Sample](partition-and-sample.md)  <br/> [Remove Duplicate Rows](remove-duplicate-rows.md) <br/> [SMOTE](smote.md) <br/> [Select Columns Transform](select-columns-transform.md) <br/> [Select Columns in Dataset](select-columns-in-dataset.md) <br/> [Split Data](split-data.md) |
| Feature Selection | Select a subset of relevant, useful features to use in building an analytical model. | [Filter Based Feature Selection](filter-based-feature-selection.md) <br/> [Permutation Feature Importance](permutation-feature-importance.md) |
| Statistical Functions | Provide a wide variety of statistical methods related to data science. | [Summarize Data](summarize-data.md)|

## Machine learning algorithms

| Functionality | Description | Module |
| --- |--- | --- |
| Regression | Predict a value. | [Boosted Decision Tree Regression](boosted-decision-tree-regression.md) <br/> [Decision Forest Regression](decision-forest-regression.md) <br/> [Linear Regression](linear-regression.md)  <br/> [Neural Network Regression](neural-network-regression.md)  <br/> |
| Clustering | Group data together.| [K-Means Clustering](k-means-clustering.md)
| Classification | Predict a class.  Choose from binary (two-class) or multiclass algorithms.| [Multiclass Boosted Decision Tree](multiclass-boosted-decision-tree.md) <br/> [Multiclass Decision Forest](multiclass-decision-forest.md) <br/> [Multiclass Logistic Regression](multiclass-logistic-regression.md)  <br/> [Multiclass Neural Network](multiclass-neural-network.md) <br/> [One vs. All Multiclass](one-vs-all-multiclass.md) <br/> [Two-Class Averaged Perceptron](two-class-averaged-perceptron.md) <br/>  [Two-Class Boosted Decision Tree](two-class-boosted-decision-tree.md)  <br/> [Two-Class Decision Forest](two-class-decision-forest.md) <br/>  [Two-Class Logistic Regression](two-class-logistic-regression.md) <br/> [Two-Class Neural Network](two-class-neural-network.md) <br/> [Two Class Support Vector Machine](two-class-support-vector-machine.md) | 

## Modules for building and evaluating models

| Functionality | Description | Module |
| --- |--- | --- |
| Model Training | Run data through the algorithm. |  [Train Clustering Model](train-clustering-model.md) <br/> [Train Model](train-model.md) <br/> [Train Pytorch Model](train-pytorch-model.md) <br/> [Tune Model Hyperparameters](tune-model-hyperparameters.md) |
| Model Scoring and Evaluation | Measure the accuracy of the trained model. | [Apply Transformation](apply-transformation.md) <br/> [Assign Data to Clusters](assign-data-to-clusters.md) <br/> [Cross Validate Model](cross-validate-model.md) <br/> [Evaluate Model](evaluate-model.md) <br/> [Score Image Model](score-image-model.md) <br/> [Score Model](score-model.md) |
| Python Language | Write code and embed it in a module to integrate Python with your pipeline. | [Create Python Model](create-python-model.md) <br/> [Execute Python Script](execute-python-script.md) |
| R Language | Write code and embed it in a module to integrate R with your pipeline. | [Execute R Script](execute-r-script.md) |
| Text Analytics | Provide specialized computational tools for working with both structured and unstructured text. |  [Convert Word to Vector](convert-word-to-vector.md) <br/> [Extract N Gram Features from Text](extract-n-gram-features-from-text.md) <br/> [Feature Hashing](feature-hashing.md) <br/> [Preprocess Text](preprocess-text.md) <br/> [Latent Dirichlet Allocation](latent-dirichlet-allocation.md) |
| Computer Vision | Image data preprocessing and Image recognition related modules. |  [Apply Image Transformation](apply-image-transformation.md) <br/> [Convert to Image Directory](convert-to-image-directory.md) <br/> [Init Image Transformation](init-image-transformation.md) <br/> [Split Image Directory](split-image-directory.md) <br/> [DenseNet](densenet.md) <br/> [ResNet](resnet.md) |
| Recommendation | Build recommendation models. | [Evaluate Recommender](evaluate-recommender.md) <br/> [Score SVD Recommender](score-svd-recommender.md) <br/> [Score Wide and Deep Recommender](score-wide-and-deep-recommender.md)<br/> [Train SVD Recommender](train-SVD-recommender.md) <br/> [Train Wide and Deep Recommender](train-wide-and-deep-recommender.md)|
| Anomaly Detection | Build anomaly detection models. | [PCA-Based Anomaly Detection](pca-based-anomaly-detection.md) <br/> [Train Anomaly Detection Model](train-anomaly-detection-model.md) |


## Web service

Learn about the [web service modules](web-service-input-output.md) which are necessary for real-time inference in Azure Machine Learning designer.

## Error messages

Learn about the [error messages and exception codes](designer-error-codes.md) you might encounter using modules in Azure Machine Learning designer.

## Next steps

* [Tutorial: Build a model in designer to predict auto prices](../tutorial-designer-automobile-price-train-score.md)
