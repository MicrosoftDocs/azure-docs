---
title:  "Algorithm & component reference"
description: Learn about the Azure Machine Learning designer components that you can use to create your own machine learning projects.
titleSuffix: Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 11/09/2020
---
# Algorithm & component reference for Azure Machine Learning designer

[!INCLUDE [sdk v2](../includes/machine-learning-sdk-v2.md)]

> [!div class="op_single_selector" title1="Select the version of the Azure Machine Learning SDK you are using:"]
> * [v1](./component-reference.md)
> * [v2 (current version)](../component-reference-v2/component-reference-v2.md)

>[!Note]
> Designer supports two type of components, classic prebuilt components and custom components. These two types of components are not compatible. 
>
>Classic prebuilt components provides prebuilt components majorly for data processing and traditional machine learning tasks like regression and classification. This type of component continues to be supported but will not have any new components added. 
>
>
>Custom components allow you to provide your own code as a component. It supports sharing across workspaces and seamless authoring across Studio, CLI, and SDK interfaces.
>
>This article applies to classic prebuilt components. 

This reference content provides the technical background on each of the classic prebuilt components available in Azure Machine Learning designer.


Each component represents a set of code that can run independently and perform a machine learning task, given the required inputs. A component might contain a particular algorithm, or perform a task that is important in machine learning, such as missing value replacement, or statistical analysis.

For help with choosing algorithms, see 
* [How to select algorithms](../v1/how-to-select-algorithms.md)
* [Azure Machine Learning Algorithm Cheat Sheet](../v1/algorithm-cheat-sheet.md)

> [!TIP]
> In any pipeline in the designer, you can get information about a specific component. Select the **Learn more** link in the component card when hovering on the component in the component list, or in the right pane of the component.

## Data preparation components


| Functionality | Description | component |
| --- |--- | --- |
| Data Input and Output | Move data from cloud sources into your pipeline. Write your results or intermediate data to Azure Storage, or SQL Database, while running a pipeline, or use cloud storage to exchange data between pipelines.  | [Enter Data Manually](enter-data-manually.md) <br/> [Export Data](export-data.md) <br/> [Import Data](import-data.md) |
| Data Transformation | Operations on data that are unique to machine learning, such as normalizing or binning data, dimensionality reduction, and converting data among various file formats.| [Add Columns](add-columns.md) <br/> [Add Rows](add-rows.md) <br/> [Apply Math Operation](apply-math-operation.md) <br/> [Apply SQL Transformation](apply-sql-transformation.md) <br/> [Clean Missing Data](clean-missing-data.md) <br/> [Clip Values](clip-values.md) <br/> [Convert to CSV](convert-to-csv.md) <br/> [Convert to Dataset](convert-to-dataset.md) <br/> [Convert to Indicator Values](convert-to-indicator-values.md) <br/> [Edit Metadata](edit-metadata.md) <br/> [Group Data into Bins](group-data-into-bins.md) <br/> [Join Data](join-data.md) <br/> [Normalize Data](normalize-data.md) <br/> [Partition and Sample](partition-and-sample.md)  <br/> [Remove Duplicate Rows](remove-duplicate-rows.md) <br/> [SMOTE](smote.md) <br/> [Select Columns Transform](select-columns-transform.md) <br/> [Select Columns in Dataset](select-columns-in-dataset.md) <br/> [Split Data](split-data.md) |
| Feature Selection | Select a subset of relevant, useful features to use to build an analytical model. | [Filter Based Feature Selection](filter-based-feature-selection.md) <br/> [Permutation Feature Importance](permutation-feature-importance.md) |
| Statistical Functions | Provide a wide variety of statistical methods related to data science. | [Summarize Data](summarize-data.md)|

## Machine learning algorithms

| Functionality | Description | component |
| --- |--- | --- |
| Regression | Predict a value. | [Boosted Decision Tree Regression](boosted-decision-tree-regression.md) <br/> [Decision Forest Regression](decision-forest-regression.md) <br/> [Fast Forest Quantile Regression](fast-forest-quantile-regression.md)  <br/> [Linear Regression](linear-regression.md)  <br/> [Neural Network Regression](neural-network-regression.md)  <br/> [Poisson Regression](poisson-regression.md)  <br/>|
| Clustering | Group data together.| [K-Means Clustering](k-means-clustering.md)
| Classification | Predict a class. Choose from binary (two-class) or multiclass algorithms.| [Multiclass Boosted Decision Tree](multiclass-boosted-decision-tree.md) <br/> [Multiclass Decision Forest](multiclass-decision-forest.md) <br/> [Multiclass Logistic Regression](multiclass-logistic-regression.md)  <br/> [Multiclass Neural Network](multiclass-neural-network.md) <br/> [One vs. All Multiclass](one-vs-all-multiclass.md) <br/> [One vs. One Multiclass](one-vs-one-multiclass.md) <br/>[Two-Class Averaged Perceptron](two-class-averaged-perceptron.md) <br/>  [Two-Class Boosted Decision Tree](two-class-boosted-decision-tree.md)  <br/> [Two-Class Decision Forest](two-class-decision-forest.md) <br/>  [Two-Class Logistic Regression](two-class-logistic-regression.md) <br/> [Two-Class Neural Network](two-class-neural-network.md) <br/> [Two Class Support Vector Machine](two-class-support-vector-machine.md) | 

## Components for building and evaluating models

| Functionality | Description | component |
| --- |--- | --- |
| Model Training | Run data through the algorithm. |  [Train Clustering Model](train-clustering-model.md) <br/> [Train Model](train-model.md) <br/> [Train Pytorch Model](train-pytorch-model.md) <br/> [Tune Model Hyperparameters](tune-model-hyperparameters.md) |
| Model Scoring and Evaluation | Measure the accuracy of the trained model. | [Apply Transformation](apply-transformation.md) <br/> [Assign Data to Clusters](assign-data-to-clusters.md) <br/> [Cross Validate Model](cross-validate-model.md) <br/> [Evaluate Model](evaluate-model.md) <br/> [Score Image Model](score-image-model.md) <br/> [Score Model](score-model.md) |
| Python Language | Write code and embed it in a component to integrate Python with your pipeline. | [Create Python Model](create-python-model.md) <br/> [Execute Python Script](execute-python-script.md) |
| R Language | Write code and embed it in a component to integrate R with your pipeline. | [Execute R Script](execute-r-script.md) |
| Text Analytics | Provide specialized computational tools for working with both structured and unstructured text. |  [Convert Word to Vector](convert-word-to-vector.md) <br/> [Extract N Gram Features from Text](extract-n-gram-features-from-text.md) <br/> [Feature Hashing](feature-hashing.md) <br/> [Preprocess Text](preprocess-text.md) <br/> [Latent Dirichlet Allocation](latent-dirichlet-allocation.md) <br/> [Score Vowpal Wabbit Model](score-vowpal-wabbit-model.md) <br/> [Train Vowpal Wabbit Model](train-vowpal-wabbit-model.md)|
| Computer Vision | Image data preprocessing and Image recognition related components. |  [Apply Image Transformation](apply-image-transformation.md) <br/> [Convert to Image Directory](convert-to-image-directory.md) <br/> [Init Image Transformation](init-image-transformation.md) <br/> [Split Image Directory](split-image-directory.md) <br/> [DenseNet](densenet.md) <br/> [ResNet](resnet.md) |
| Recommendation | Build recommendation models. | [Evaluate Recommender](evaluate-recommender.md) <br/> [Score SVD Recommender](score-svd-recommender.md) <br/> [Score Wide and Deep Recommender](score-wide-and-deep-recommender.md)<br/> [Train SVD Recommender](train-SVD-recommender.md) <br/> [Train Wide and Deep Recommender](train-wide-and-deep-recommender.md)|
| Anomaly Detection | Build anomaly detection models. | [PCA-Based Anomaly Detection](pca-based-anomaly-detection.md) <br/> [Train Anomaly Detection Model](train-anomaly-detection-model.md) |

## Web service

Learn about the [web service components](web-service-input-output.md), which are necessary for real-time inference in Azure Machine Learning designer.

## Error messages

Learn about the [error messages and exception codes](designer-error-codes.md) that you might encounter using components in Azure Machine Learning designer.

## Components environment

All built-in components in the designer will be executed in a fixed environment provided by Microsoft. 

Previously this environment was based on Python 3.6, and now has been upgraded to Python 3.8. This upgrade is transparent as in the components will automatically run in the Python 3.8 environment and requires no action from the user. The environment update may impact component outputs and deploying real-time endpoint from a real-time inference, see the following sections to learn more. 

### Components outputs are different from previous results

After the Python version is upgraded from 3.6 to 3.8, the dependencies of built-in components may be also upgraded accordingly. Hence, you may find some components outputs are different from previous results.

If you are using the Execute Python Script component and have previously installed packages tied to Python 3.6, you may run into errors like:
- "Could not find a version that satisfies the requirement." 
- "No matching distribution found."
Then you'll need to specify the package version adapted to Python 3.8, and run your pipeline again.

### Deploy real-time endpoint from real-time inference pipeline issue

If you directly deploy real-time endpoint from a previous completed real-time inference pipeline, it may run into errors. 

**Recommendation**: clone the inference pipeline and submit it again, then deploy to real-time endpoint.


## Next steps

* [Tutorial: Build a model in designer to predict auto prices](../v1/tutorial-designer-automobile-price-train-score.md)
