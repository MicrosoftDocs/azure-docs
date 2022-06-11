---
title:  "K-Means Clustering: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the K-Means Clustering component in the Azure Machine Learning to train clustering models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 08/04/2020
---
# Component: K-Means Clustering

This article describes how to use the *K-Means Clustering* component in Azure Machine Learning designer to create an untrained K-means clustering model. 
 
K-means is one of the simplest and the best known *unsupervised* learning algorithms. You can use the algorithm for a variety of machine learning tasks, such as: 

* [Detecting abnormal data](/archive/msdn-magazine/2013/february/data-clustering-detecting-abnormal-data-using-k-means-clustering).
* Clustering text documents.
* Analyzing datasets before you use other classification or regression methods. 

To create a clustering model, you:

* Add this component to your pipeline.
* Connect a dataset.
* Set parameters, such as the number of clusters you expect, the distance metric to use in creating the clusters, and so forth. 
  
After you've configured the component hyperparameters, you connect the untrained model to the [Train Clustering Model](train-clustering-model.md). Because the K-means algorithm is an unsupervised learning method, a label column is optional. 

+ If your data includes a label, you can use the label values to guide selection of the clusters and optimize the model. 

+ If your data has no label, the algorithm creates clusters representing possible categories, based solely on the data.  

##  Understand K-means clustering
 
In general, clustering uses iterative techniques to group cases in a dataset into clusters that possess similar characteristics. These groupings are useful for exploring data, identifying anomalies in the data, and eventually for making predictions. Clustering models can also help you identify relationships in a dataset that you might not logically derive by browsing or simple observation. For these reasons, clustering is often used in the early phases of machine learning tasks, to explore the data and discover unexpected correlations.  
  
 When you configure a clustering model by using the K-means method, you must specify a target number *k* that indicates the number of *centroids* you want in the model. The centroid is a point that's representative of each cluster. The K-means algorithm assigns each incoming data point to one of the clusters by minimizing the within-cluster sum of squares. 
 
When it processes the training data, the K-means algorithm begins with an initial set of randomly chosen centroids. Centroids serve as starting points for the clusters, and they apply Lloyd's algorithm to iteratively refine their locations. The K-means algorithm stops building and refining clusters when it meets one or more of these conditions:  
  
-   The centroids stabilize, meaning that the cluster assignments for individual points no longer change and the algorithm has converged on a solution.  
  
-   The algorithm completed running the specified number of iterations.  
  
 After you've completed the training phase, you use the [Assign Data to Clusters](assign-data-to-clusters.md) component to assign new cases to one of the clusters that you found by using the K-means algorithm. You perform cluster assignment by computing the distance between the new case and the centroid of each cluster. Each new case is assigned to the cluster with the nearest centroid.  

## Configure the K-Means Clustering component
  
1.  Add the **K-Means Clustering** component to your pipeline.  
  
2.  To specify how you want the model to be trained, select the **Create trainer mode** option.  
  
    -   **Single Parameter**: If you know the exact parameters you want to use in the clustering model, you can provide a specific set of values as arguments.  
  
3.  For **Number of centroids**, type the number of clusters you want the algorithm to begin with.  
  
     The model isn't guaranteed to produce exactly this number of clusters. The algorithm starts with this number of data points and iterates to find the optimal configuration. You can refer to the [source code of sklearn](https://github.com/scikit-learn/scikit-learn/blob/fd237278e/sklearn/cluster/_kmeans.py#L1069).
  
4.  The properties **Initialization** is used to specify the algorithm that's used to define the initial cluster configuration.  
  
    -   **First N**: Some initial number of data points are chosen from the dataset and used as the initial means. 
    
         This method is also called the *Forgy method*.  
  
    -   **Random**: The algorithm randomly places a data point in a cluster and then computes the initial mean to be the centroid of the cluster's randomly assigned points. 

         This method is also called the *random partition* method.  
  
    -   **K-Means++**: This is the default method for initializing clusters.  
  
         The **K-means++** algorithm was proposed in 2007 by David Arthur and Sergei Vassilvitskii to avoid poor clustering by the standard K-means algorithm. **K-means++** improves upon standard K-means by using a different method for choosing the initial cluster centers.  
  
    
5.  For **Random number seed**, optionally type a value to use as the seed for the cluster initialization. This value can have a significant effect on cluster selection.  
  
6.  For **Metric**, choose the function to use for measuring the distance between cluster vectors, or between new data points and the randomly chosen centroid. Azure Machine Learning supports the following cluster distance metrics:  
  
    -   **Euclidean**: The Euclidean distance is commonly used as a measure of cluster scatter for K-means clustering. This metric is preferred because it minimizes the mean distance between points and the centroids.
  
7.  For **Iterations**, type the number of times the algorithm should iterate over the training data before it finalizes the selection of centroids.  
  
     You can adjust this parameter to balance accuracy against training time.  
  
8.  For **Assign label mode**, choose an option that specifies how a label column, if it's present in the dataset, should be handled.  
  
     Because K-means clustering is an unsupervised machine learning method, labels are optional. However, if your dataset already has a label column, you can use those values to guide the selection of the clusters, or you can specify that the values be ignored.  
  
    -   **Ignore label column**: The values in the label column are ignored and are not used in building the model.
  
    -   **Fill missing values**: The label column values are used as features to help build the clusters. If any rows are missing a label, the value is imputed by using other features.  
  
    -   **Overwrite from closest to center**: The label column values are replaced with predicted label values, using the label of the point that is closest to the current centroid.  

8.  Select the **Normalize features** option if you want to normalize features before training.
  
     If you apply normalization, before training, the data points are normalized to `[0,1]` by MinMaxNormalizer.

10. Train the model.  
  
    -   If you set **Create trainer mode** to **Single Parameter**, add a tagged dataset and train the model by using the [Train Clustering Model](train-clustering-model.md) component.  
  
## Results

After you've finished configuring and training the model, you have a model that you can use to generate scores. However, there are multiple ways to train the model, and multiple ways to view and use the results: 

### Capture a snapshot of the model in your workspace

If you used the [Train Clustering Model](train-clustering-model.md) component:

1. Select the **Train Clustering Model** component and open the right panel.

2. Select **Outputs** tab. Select the **Register dataset** icon to save a copy of the trained model.

The saved model represents the training data at the time you saved the model. If you later update the training data used in the pipeline, it doesn't update the saved model. 

### See the clustering result dataset 

If you used the [Train Clustering Model](train-clustering-model.md) component:

1. Right-click the **Train Clustering Model** component.

2. Select **Visualize**.

### Tips for generating the best clustering model  

It is known that the *seeding* process that's used during clustering can significantly affect the model. Seeding means the initial placement of points into potential centroids.
 
For example, if the dataset contains many outliers, and an outlier is chosen to seed the clusters, no other data points would fit well with that cluster, and the cluster could be a singleton. That is, it might have only one point.  
  
You can avoid this problem in a couple of ways:  
  
-   Change the number of centroids and try multiple seed values.  
  
-   Create multiple models, varying the metric or iterating more.  
  
In general, with clustering models, it's possible that any given configuration will result in a locally optimized set of clusters. In other words, the set of clusters that's returned by the model suits only the current data points and isn't generalizable to other data. If you use a different initial configuration, the K-means method might find a different, superior, configuration. 

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning.