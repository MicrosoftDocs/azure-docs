---
title:  "Decision Forest Regression: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Decision Forest Regression component in Azure Machine Learning to create a regression model based on an ensemble of decision trees.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 04/22/2020
---

# Decision Forest Regression component

This article describes a component in Azure Machine Learning designer.

Use this component to create a regression model based on an ensemble of decision trees.

After you have configured the model, you must train the model using a labeled dataset and the [Train Model](./train-model.md) component. The trained model can then be used to make predictions. 

## How it works

Decision trees are non-parametric models that perform a sequence of simple tests for each instance, traversing a binary tree data structure until a leaf node (decision) is reached.

Decision trees have these advantages:

- They are efficient in both computation and memory usage during training and prediction.

- They can represent non-linear decision boundaries.

- They perform integrated feature selection and classification and are resilient in the presence of noisy features.

This regression model consists of an ensemble of decision trees. Each tree in a regression decision forest outputs a Gaussian distribution as a prediction. An aggregation is performed over the ensemble of trees to find a Gaussian distribution closest to the combined distribution for all trees in the model.

For more information about the theoretical framework for this algorithm and its implementation, see this article: [Decision Forests: A Unified Framework for Classification, Regression, Density Estimation, Manifold Learning and Semi-Supervised Learning](https://www.microsoft.com/en-us/research/publication/decision-forests-a-unified-framework-for-classification-regression-density-estimation-manifold-learning-and-semi-supervised-learning/?from=http%3A%2F%2Fresearch.microsoft.com%2Fapps%2Fpubs%2Fdefault.aspx%3Fid%3D158806#)

## How to configure Decision Forest Regression Model

1. Add the **Decision Forest Regression** component to the pipeline. You can find the component in the designer under **Machine Learning**, **Initialize Model**, and **Regression**.

2. Open the component properties, and for **Resampling method**, choose the method used to create the individual trees.  You can choose from **Bagging** or **Replicate**.

    - **Bagging**: Bagging is also called *bootstrap aggregating*. Each tree in a regression decision forest outputs a Gaussian distribution by way of prediction. The aggregation is to find a Gaussian whose first two moments match the moments of the mixture of Gaussian distributions given by combining all distributions returned by individual trees.

         For more information, see the Wikipedia entry for [Bootstrap aggregating](https://wikipedia.org/wiki/Bootstrap_aggregating).

    - **Replicate**: In replication, each tree is trained on exactly the same input data. The determination of which split predicate is used for each tree node remains random and the trees will be diverse.

         For more information about the training process with the **Replicate** option, see [Decision Forests for Computer Vision and Medical Image Analysis. Criminisi and J. Shotton. Springer 2013.](https://research.microsoft.com/projects/decisionforests/).

3. Specify how you want the model to be trained, by setting the **Create trainer mode** option.

    - **Single Parameter**

      If you know how you want to configure the model, you can provide a specific set of values as arguments. You might have learned these values by experimentation or received them as guidance.

    - **Parameter Range**: Select this option if you are not sure of the best parameters, and want to run a parameter sweep. Select a range of values to iterate over, and the [Tune Model Hyperparameters](tune-model-hyperparameters.md) iterates over all possible combinations of the settings you provided to determine the hyperparameters that produce the optimal results. 



4. For **Number of decision trees**, indicate the total number of decision trees to create in the ensemble. By creating more decision trees, you can potentially get better coverage, but training time will increase.

    > [!TIP]
    > If you set the value to 1; however, this means that only one tree will be produced (the tree with the initial set of parameters) and no further iterations will be performed.

5. For **Maximum depth of the decision trees**, type a number to limit the maximum depth of any decision tree. Increasing the depth of the tree might increase precision, at the risk of some overfitting and increased training time.

6. For **Number of random splits per node**, type the number of splits to use when building each node of the tree. A *split* means that features in each level of the tree (node) are randomly divided.

7. For **Minimum number of samples per leaf node**, indicate the minimum number of cases that are required to create any terminal node (leaf) in a tree.

     By increasing this value, you increase the threshold for creating new rules. For example, with the default value of 1, even a single case can cause a new rule to be created. If you increase the value to 5, the training data would have to contain at least five cases that meet the same conditions.


9. Train the model:

    + If you set **Create trainer mode** to **Single Parameter**, connect a tagged dataset and the [Train Model](train-model.md) component.  
  
    + If you set **Create trainer mode** to **Parameter Range**, connect a tagged dataset and train the model by using [Tune Model Hyperparameters](tune-model-hyperparameters.md).  
  
    > [!NOTE]
    > 
    > If you pass a parameter range to [Train Model](train-model.md), it uses only the default value in the single parameter list.  
    > 
    > If you pass a single set of parameter values to the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component, when it expects a range of settings for each parameter, it ignores the values, and uses the default values for the learner.  
    > 
    > If you select the **Parameter Range** option and enter a single value for any parameter, that single value you specified is used throughout the sweep, even if other parameters change across a range of values.

   

10. Submit the pipeline.

### Results

After training is complete:

+ To save a snapshot of the trained model, select the training component, then switch to **Outputs** tab in the right panel. Click on the icon **Register model**.  You can find the saved model as a component in the component tree. 

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 