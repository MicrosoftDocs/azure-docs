---
title:  "Boosted Decision Tree Regression: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Boosted Decision Tree Regression module in Azure Machine Learning to create an ensemble of regression trees using boosting. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 04/22/2020
---

# Boosted Decision Tree Regression module

This article describes a module in Azure Machine Learning designer (preview).

Use this module to create an ensemble of regression trees using boosting. *Boosting* means that each tree is dependent on prior trees. The algorithm learns by fitting the residual of the trees that preceded it. Thus, boosting in a decision tree ensemble tends to improve accuracy with some small risk of less coverage.  
  
This regression method is a supervised learning method, and therefore requires a *labeled dataset*. The label column must contain numerical values.  

> [!NOTE]
> Use this module only with datasets that use numerical variables.  

After you have defined the model, train it by using the [Train Model](./train-model.md).

  
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

1.  Add the **Boosted  Decision Tree** module to your pipeline. You can find this module under **Machine Learning**, **Initialize**, under the **Regression** category. 
  
2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    -   **Single Parameter**: Select this option if you know how you want to configure the model, and provide a specific set of values as arguments. 
     
    -   **Parameter Range**: Select this option if you are not sure of the best parameters, and want to run a parameter sweep. Select a range of values to iterate over, and the [Tune Model Hyperparameters](tune-model-hyperparameters.md) iterates over all possible combinations of the settings you provided to determine the hyperparameters that produce the optimal results.    
   
  
3. **Maximum number of leaves per tree**: Indicate the maximum number of terminal nodes (leaves) that can be created in any tree.  

    By increasing this value, you potentially increase the size of the tree and get better precision, at the risk of overfitting and longer training time.  

4. **Minimum number of samples per leaf node**: Indicate the minimum number of cases required to create any terminal node (leaf) in a tree.

    By increasing this value, you increase the threshold for creating new rules. For example, with the default value of 1, even a single case can cause a new rule to be created. If you increase the value to 5, the training data would have to contain at least 5 cases that meet the same conditions.

5. **Learning rate**: Type a number between 0 and 1 that defines the step size while learning. The learning rate determines how fast or slow the learner converges on the optimal solution. If the step size is too big, you might overshoot the optimal solution. If the step size is too small, training takes longer to converge on the best solution.

6. **Number of trees constructed**: Indicate the total number of decision trees to create in the ensemble. By creating more decision trees, you can potentially get better coverage, but training time increases.

    This value also controls the number of trees displayed when visualizing the trained model. if you want to see or print a single tree, you can set the value to 1; however, only one tree is produced (the tree with the initial set of parameters) and no further iterations are performed.

7. **Random number seed**: Type an optional non-negative integer to use as the random seed value. Specifying a seed ensures reproducibility across runs that have the same data and parameters.

    By default, the random seed is set to 0, which means the initial seed value is obtained from the system clock.
  

9. Train the model:

    + If you set **Create trainer mode** to **Single Parameter**, connect a tagged dataset and the [Train Model](train-model.md) module.  
  
    + If you set **Create trainer mode** to **Parameter Range**, connect a tagged dataset and train the model by using [Tune Model Hyperparameters](tune-model-hyperparameters.md).  
  
    > [!NOTE]
    > 
    > If you pass a parameter range to [Train Model](train-model.md), it uses only the default value in the single parameter list.  
    > 
    > If you pass a single set of parameter values to the [Tune Model Hyperparameters](tune-model-hyperparameters.md) module, when it expects a range of settings for each parameter, it ignores the values, and uses the default values for the learner.  
    > 
    > If you select the **Parameter Range** option and enter a single value for any parameter, that single value you specified is used throughout the sweep, even if other parameters change across a range of values.
    

10. Submit the pipeline.  
  
## Results

After training is complete:

+ To use the model for scoring, connect [Train Model](train-model.md) to [Score Model](./score-model.md), to predict values for new input examples.

+ To save a snapshot of the trained model, select **Outputs** tab in the right panel of **Trained model** and click **Register dataset** icon. The copy of the trained model will be saved as a module in the module tree and will not be updated on successive runs of the pipeline.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
