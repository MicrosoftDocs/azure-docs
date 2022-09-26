---
title:  "Assign Data to Cluster: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Assign Data to Cluster component in Azure Machine Learning to score clustering model.  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 11/19/2019
---
# Component: Assign Data to Clusters

This article describes how to use the *Assign Data to Clusters* component in Azure Machine Learning designer. The component generates predictions through a clustering model that was trained with the *K-means clustering* algorithm.

The Assign Data to Clusters component returns a dataset that contains the probable assignments for each new data point. 

## How to use Assign Data to Clusters
  
1. In Azure Machine Learning designer, locate a previously trained clustering model. You can create and train a clustering model by using either of the following methods:  
  
    - Configure the K-means clustering algorithm by using the [K-Means Clustering](k-means-clustering.md) component, and train the model by using a dataset and the Train Clustering Model component (this article).  
  
    - You can also add an existing trained clustering model from the **Saved Models** group in your workspace.

2. Attach the trained model to the left input port of **Assign Data to Clusters**.  

3. Attach a new dataset as input. 

   In this dataset, labels are optional. Generally, clustering is an unsupervised learning method. You are not expected to know the categories in advance. However, the input columns must be the same as the columns that were used in training the clustering model, or an error occurs.

    > [!TIP]
    > To reduce the number of columns that are written to the designer from the cluster predictions, use [Select columns in the dataset](select-columns-in-dataset.md), and select a subset of the columns. 
    
4. Leave the **Check for append or uncheck for result only** check box selected if you want the results to contain the full input dataset, including a column that displays the results (cluster assignments).
  
    If you clear this check box, only the results are returned. This option might be useful when you create predictions as part of a web service.
  
5.  Submit the pipeline.  
  
### Results

+  To view the values in the dataset, right-click the component, and then select **Visualize**. Or Select the component and switch to the **Outputs** tab in the right panel, click on the histogram icon in the **Port outputs** to visualize the result.
