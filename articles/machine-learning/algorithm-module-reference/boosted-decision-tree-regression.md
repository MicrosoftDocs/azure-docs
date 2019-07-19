---
title:  "Boosted Decision Tree Regression: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Boosted Decision Tree Regression module in Azure Machine Learning service to create an ensemble of regression trees using boosting. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---

# Boosted Decision Tree Regression module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to create an ensemble of regression trees using boosting. *Boosting* means that each tree is dependent on prior trees. The algorithm learns by fitting the residual of the trees that preceded it. Thus, boosting in a decision tree ensemble tends to improve accuracy with some small risk of less coverage.  
  
This regression method is a supervised learning method, and therefore requires a *labeled dataset*. The label column must contain numerical values.  

> [!NOTE]
> Use this module only with datasets that use numerical variables.  

After you have defined the model, train it by using the [Train Model](./train-model.md).

> [!TIP]
> Want to know more about the trees that were created? After the model has been trained, right-click the output of the [Train Model](./train-model.md) module and select **Visualize** to see the tree that was created on each iteration. You can drill down into the splits for each tree and see the rules for each node.  
  
## More about boosted regression trees  

Boosting is one of several classic methods for creating ensemble models, along with bagging, random forests, and so forth.  In Azure Machine Learning, boosted decision trees use an efficient implementation of the MART gradient boosting algorithm. Gradient boosting is a machine learning technique for regression problems. It builds each regression tree in a step-wise fashion, using a predefined loss function to measure the error in each step and correct for it in the next. Thus the prediction model is actually an ensemble of weaker prediction models.  
  
In regression problems, boosting builds a series of trees in a step-wise fashion, and then selects the optimal tree using an arbitrary differentiable loss function.  
  
For additional information, see these articles:  
  
+ [https://wikipedia.org/wiki/Gradient_boosting#Gradient_tree_boosting](https://wikipedia.org/wiki/Gradient_boosting)

    This Wikipedia article on gradient boosting provides some background on boosted trees. 
  
-  [https://research.microsoft.com/apps/pubs/default.aspx?id=132652](https://research.microsoft.com/apps/pubs/default.aspx?id=132652)  

    Microsoft Research: From RankNet to LambdaRank to LambdaMART: An Overview. By J.C. Burges.

The gradient boosting method can also be used for classification problems by reducing them to regression with a suitable loss function. For more information about the boosted trees implementation for classification tasks, see [Two-Class Boosted Decision Tree](./two-class-boosted-decision-tree.md).  

## How to configure Boosted Decision Tree Regression

1.  Add the **Boosted  Decision Tree** module to your experiment. You can find this module under **Machine Learning**, **Initialize**, under the **Regression** category. 
  
2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    -   **Single Parameter**: Select this option if you know how you want to configure the model, and provide a specific set of values as arguments.  
   
  
3. **Maximum number of leaves per tree**: Indicate the maximum number of terminal nodes (leaves) that can be created in any tree.  

    By increasing this value, you potentially increase the size of the tree and get better precision, at the risk of overfitting and longer training time.  

4. **Minimum number of samples per leaf node**: Indicate the minimum number of cases required to create any terminal node (leaf) in a tree.

    By increasing this value, you increase the threshold for creating new rules. For example, with the default value of 1, even a single case can cause a new rule to be created. If you increase the value to 5, the training data would have to contain at least 5 cases that meet the same conditions.

5. **Learning rate**: Type a number between 0 and 1 that defines the step size while learning. The learning rate determines how fast or slow the learner converges on the optimal solution. If the step size is too big, you might overshoot the optimal solution. If the step size is too small, training takes longer to converge on the best solution.

6. **Number of trees constructed**: Indicate the total number of decision trees to create in the ensemble. By creating more decision trees, you can potentially get better coverage, but training time increases.

    This value also controls the number of trees displayed when visualizing the trained model. if you want to see or print an ingle tree, you can set the value to 1; however, only one tree is produced (the tree with the initial set of parameters) and no further iterations are performed.

7. **Random number seed**: Type an optional non-negative integer to use as the random seed value. Specifying a seed ensures reproducibility across runs that have the same data and parameters.

    By default, the random seed is set to 0, which means the initial seed value is obtained from the system clock.
  
8. **Allow unknown categorical levels**: Select this option to create a group for unknown values in the training and validation sets. If you deselect this option, the model can accept only the values that are contained in the training data. The model might be less precise for known values, but it can provide better predictions for new (unknown) values.

9. Add a training dataset, and one of the training modules:

    - If you set **Create trainer mode** option to **Single Parameter**, use the [Train Model](train-model.md) module.  
  
    

10. Run the experiment.  
  
### Results

After training is complete:

+ To see the tree that was created on each iteration, right-click the output of the [Train Model](train-model.md) module and select **Visualize**.
  
     Click each tree to drill down into the splits and see the rules for each node.  

+ To use the model for scoring, connect it to [Score Model](./score-model.md), to predict values for new input examples.

+ To save a snapshot of the trained model, right-click the **Trained model** output of the training module and select **Save As**. The copy of the trained model that you save is not updated on successive runs of the experiment.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 