---
title:  "Train Clustering Model: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Train Clustering Model module in Azure Machine Learning to train clustering models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 11/19/2019
---
# Train Clustering Model

This article describes a module in Azure Machine Learning designer.

Use this module to train a clustering model.

The module takes an untrained clustering model that you have already configured using the [K-Means Clustering](k-means-clustering.md) module, and trains the model using a labeled or unlabeled data set. The module creates both a trained model that you can use for prediction, and a set of cluster assignments for each case in the training data.

> [!NOTE]
> A clustering model cannnot be trained using the [Train Model](train-model.md) module, which is the generic module for training machine learning models. That is because [Train Model](train-model.md) works only with supervised learning algorithms. K-means and other clustering algorithms allow unsupervised learning, meaning that the algorithm can learn from unlabeled data.  
  
## How to use Train Clustering Model  

1.  Add the **Train Clustering Model** module to your pipeline in the designer. You can find the module under **Machine Learning Modules**, in the **Train** category.  
  
2. Add the [K-Means Clustering](k-means-clustering.md) module, or another custom module that creates a compatible clustering model, and set the parameters of the clustering model.  
    
3.  Attach a training dataset to the right-hand input of **Train Clustering Model**.
  
5.  In **Column Set**, select the columns from the dataset to use in building clusters. Be sure to select columns that make good features: for example, avoid using IDs or other columns that have unique values, or columns that have all the same values.

    If a label is available, you can either use it as a feature, or leave it out.  
  
6. Select the option, **Check for append or uncheck for result only**, if you want to output the training data together with the new cluster label.

    If you deselect this option, only the cluster assignments are output. 

7. Run the pipeline, or click the **Train Clustering Model** module and select **Run Selected**.  
  
### Results

After training has completed:

+ To save a snapshot of the trained model, select the **Outputs** tab in the right panel of the **Train model** module. Select the **Register dataset** icon to save the model as a reusable module.

+ To generate scores from the model, use [Assign Data to Clusters](assign-data-to-clusters.md).

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 