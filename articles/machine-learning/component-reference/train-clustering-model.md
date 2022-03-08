---
title:  "Train Clustering Model: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Train Clustering Model component in Azure Machine Learning to train clustering models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 03/17/2021
---
# Train Clustering Model

This article describes a component in Azure Machine Learning designer.

Use this component to train a clustering model.

The component takes an untrained clustering model that you have already configured using the [K-Means Clustering](k-means-clustering.md) component, and trains the model using a labeled or unlabeled data set. The component creates both a trained model that you can use for prediction, and a set of cluster assignments for each case in the training data.

> [!NOTE]
> A clustering model cannot be trained using the [Train Model](train-model.md) component, which is the generic component for training machine learning models. That is because [Train Model](train-model.md) works only with supervised learning algorithms. K-means and other clustering algorithms allow unsupervised learning, meaning that the algorithm can learn from unlabeled data.  
  
## How to use Train Clustering Model  

1.  Add the **Train Clustering Model** component to your pipeline in the designer. You can find the component under **Machine Learning components**, in the **Train** category.  
  
2. Add the [K-Means Clustering](k-means-clustering.md) component, or another custom component that creates a compatible clustering model, and set the parameters of the clustering model.  
    
3.  Attach a training dataset to the right-hand input of **Train Clustering Model**.
  
5.  In **Column Set**, select the columns from the dataset to use in building clusters. Be sure to select columns that make good features: for example, avoid using IDs or other columns that have unique values, or columns that have all the same values.

    If a label is available, you can either use it as a feature, or leave it out.  
  
6. Select the option, **Check for append or uncheck for result only**, if you want to output the training data together with the new cluster label.

    If you deselect this option, only the cluster assignments are output. 

7. Submit the pipeline, or click the **Train Clustering Model** component and select **Run Selected**.  
  
### Results

After training has completed:

+ To save a snapshot of the trained model, select the **Outputs** tab in the right panel of the **Train model** component. Select the **Register dataset** icon to save the model as a reusable component.

+ To generate scores from the model, use [Assign Data to Clusters](assign-data-to-clusters.md).

> [!NOTE]
> If you need to deploy the trained model in the designer, make sure that [Assign Data to Clusters](assign-data-to-clusters.md) instead of **Score Model** is connected to the input of [Web Service Output component](web-service-input-output.md) in the inference pipeline.

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 