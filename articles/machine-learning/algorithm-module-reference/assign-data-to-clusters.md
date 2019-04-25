---
title:  "Assign Data to Cluster: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Assign Data to Cluster module in Azure Machine Learning service to score clustering model.  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: amlstudiodocs
ms.date: 05/06/2019
ROBOTS: NOINDEX
---
# Assign Data to Clusters

*Assigns data to clusters using an existing trained clustering model*  

Category: Score

## Module overview  

This article describes how to use the [Assign Data to Clusters](assign-data-to-clusters.md) module in visual interface, to generate predictions using a clustering model that was trained using the K-Means clustering algorithm.

The module returns a dataset that contains the probable assignments for each new data point. 


## How to use Assign Data to Clusters
  
1.  In visual interface, locate a previously trained clustering model. You can create and train a clustering model by using either of these methods:  
  
    - Configure the K-means algorithm using the [K-Means Clustering](k-means-clustering.md) module, and then train the model using a dataset and the [Train Clustering Model](train-clustering-model.md) module.  
  
  
    You can also add an existing trained clustering model from the **Saved Models** group in your workspace.

2. Attach the trained model to the left input port of [Assign Data to Clusters](assign-data-to-clusters.md).  

3. Attach a new dataset as input. In this dataset, labels are optional. Generally, clustering is an unsupervised learning method so it is not expected that you will know categories in advance.

    However, the input columns must be the same as the columns that were used in training the clustering model, or an error occurs.

    > [!TIP]
    > To reduce the number of columns output from cluster predictions, use [Select Columns in Dataset](select-columns-in-dataset.md), and select a subset of the columns. 
    
4. Leave the option **Check for Append or Uncheck for Result Only** selected if you want the results to contain the full input dataset, together with a column indicating the results (cluster assignments).
  
    If you deselect this option, you get back just the results. This might be useful when creating predictions as part of a web service.
  
5.  Run the experiment.  
  
### Results

 
+  To view the values in the dataset, right-click the module, select **Result datasets**, and click **Visualize**.

