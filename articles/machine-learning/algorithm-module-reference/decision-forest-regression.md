---
title:  "Decision Forest Regression: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Decision Forest Regression module in Azure Machine Learning service to create a regression model based on an ensemble of decision trees.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---

# Decision Forest Regression module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to create a regression model based on an ensemble of decision trees.

After you have configured the model, you must train the model using a labeled dataset and the [Train Model](./train-model.md) module.  The trained model can then be used to make predictions. 

## How it works

Decision trees are non-parametric models that perform a sequence of simple tests for each instance, traversing a binary tree data structure until a leaf node (decision) is reached.

Decision trees have these advantages:

- They are efficient in both computation and memory usage during training and prediction.

- They can represent non-linear decision boundaries.

- They perform integrated feature selection and classification and are resilient in the presence of noisy features.

This regression model consists of an ensemble of decision trees. Each tree in a regression decision forest outputs a Gaussian distribution as a prediction. An aggregation is performed over the ensemble of trees to find a Gaussian distribution closest to the combined distribution for all trees in the model.

For more information about the theoretical framework for this algorithm and its implementation, see this article: [Decision Forests: A Unified Framework for Classification, Regression, Density Estimation, Manifold Learning and Semi-Supervised Learning](https://www.microsoft.com/en-us/research/publication/decision-forests-a-unified-framework-for-classification-regression-density-estimation-manifold-learning-and-semi-supervised-learning/?from=http%3A%2F%2Fresearch.microsoft.com%2Fapps%2Fpubs%2Fdefault.aspx%3Fid%3D158806#)

## How to configure Decision Forest Regression Model

1. Add the **Decision Forest Regression** module to the experiment. You can find the module in the interface under **Machine Learning**, **Initialize Model**, and **Regression**.

2. Open the module properties, and for **Resampling method**, choose the method used to create the individual trees.  You can choose from **Bagging** or **Replicate**.

    - **Bagging**: Bagging is also called *bootstrap aggregating*. Each tree in a regression decision forest outputs a Gaussian distribution by way of prediction. The aggregation is to find a Gaussian whose first two moments match the moments of the mixture of Gaussians given by combining all Gaussians returned by individual trees.

         For more information, see the Wikipedia entry for [Bootstrap aggregating](https://wikipedia.org/wiki/Bootstrap_aggregating).

    - **Replicate**: In replication, each tree is trained on exactly the same input data. The determination of which split predicate is used for each tree node remains random and the trees will be diverse.

         For more information about the training process with the **Replicate** option, see [Decision Forests for Computer Vision and Medical Image Analysis. Criminisi and J. Shotton. Springer 2013.](https://research.microsoft.com/projects/decisionforests/).

3. Specify how you want the model to be trained, by setting the **Create trainer mode** option.

    - **Single Parameter**

      If you know how you want to configure the model, you can provide a specific set of values as arguments. You might have learned these values by experimentation or received them as guidance.



4. For **Number of decision trees**, indicate the total number of decision trees to create in the ensemble. By creating more decision trees, you can potentially get better coverage, but training time will increase.

    > [!TIP]
    > This value also controls the number of trees displayed when visualizing the trained model. if you want to see or print a single tree, you can set the value to 1; however, this means that only one tree will be produced (the tree with the initial set of parameters) and no further iterations will be performed.

5. For **Maximum depth of the decision trees**, type a number to limit the maximum depth of any decision tree. Increasing the depth of the tree might increase precision, at the risk of some overfitting and increased training time.

6. For **Number of random splits per node**, type the number of splits to use when building each node of the tree. A *split* means that features in each level of the tree (node) are randomly divided.

7. For **Minimum number of samples per leaf node**, indicate the minimum number of cases that are required to create any terminal node (leaf) in a tree.

     By increasing this value, you increase the threshold for creating new rules. For example, with the default value of 1, even a single case can cause a new rule to be created. If you increase the value to 5, the training data would have to contain at least five cases that meet the same conditions.


9. Connect a labeled dataset, select a single label column containing no more than two outcomes, and connect to [Train Model](./train-model.md).

    - If you set **Create trainer mode** option to **Single Parameter**, train the model by using the [Train Model](./train-model.md) module.

   

10. Run the experiment.

### Results

After training is complete:

+ To see the tree that was created on each iteration, right-click the output of the training module, and select **Visualize**.

+ To see the rules for each node, click each tree and drill down into the splits.

+ To save a snapshot of the trained model, right-click the output of the training module, and select **Save As Trained Model**. This copy of the model is not updated on successive runs of the experiment. 

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 