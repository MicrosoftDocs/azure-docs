---
title:  "Two-Class Logistic Regression: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Two-Class Logistic Regression component in Azure Machine Learning to create a binary classifier. 

services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 04/22/2020
---
# Two-Class Logistic Regression component

This article describes a component in Azure Machine Learning designer.

Use this component to create a logistic regression model that can be used to predict two (and only two) outcomes. 

Logistic regression is a well-known statistical technique that is used for modeling many kinds of problems. This algorithm is a *supervised learning* method;  therefore, you must provide a dataset that already contains the outcomes to train the model.  

### About logistic regression  

Logistic regression is a well-known method in statistics that is used to predict the probability of an outcome, and is especially popular for classification tasks. The algorithm predicts the probability of occurrence of an event by fitting data to a logistic function.
  
In this component, the classification algorithm is optimized for dichotomous or binary variables. if you need to classify multiple outcomes, use the [Multiclass Logistic Regression](./multiclass-logistic-regression.md) component.

##  How to configure  

To train this model, you must provide a dataset that contains a label or class column. Because this component is intended for two-class problems, the label or class column must contain exactly two values. 

For example, the label column might be [Voted] with possible values of "Yes" or "No". Or, it might be [Credit Risk], with possible values of "High" or "Low". 
  
1.  Add the **Two-Class Logistic Regression** component to your pipeline.  
  
2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    -   **Single Parameter**: If you know how you want to configure the model, you can provide a specific set of values as arguments.  

    -   **Parameter Range**: If you are not sure of the best parameters, you can find the optimal parameters by using the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component. You provide some range of values, and the trainer iterates over multiple combinations of the settings to determine the combination of values that produces the best result.
  
3.  For **Optimization tolerance**, specify a threshold value to use when optimizing the model. If the improvement between iterations falls below the specified threshold, the algorithm is considered to have converged on a solution, and training stops.  
  
4.  For **L1 regularization weight** and **L2 regularization weight**, type a value to use for the regularization parameters L1 and L2. A non-zero value is recommended for both.  
     *Regularization* is a method for preventing overfitting by penalizing models with extreme coefficient values. Regularization works by adding the penalty that is associated with coefficient values to the error of the hypothesis. Thus, an accurate model with extreme coefficient values would be penalized more, but a less accurate model with more conservative values would be penalized less.  
  
     L1 and L2 regularization have different effects and uses.  
  
    -   L1 can be applied to sparse models, which is useful when working with high-dimensional data.  
  
    -   In contrast, L2 regularization is preferable for data that is not sparse.  
  
     This algorithm supports a linear combination of L1 and L2 regularization values: that is, if <code>x = L1</code> and <code>y = L2</code>, then <code>ax + by = c</code> defines the linear span of the regularization terms.  
  
    > [!NOTE]
    >  Want to learn more about L1 and L2 regularization? The following article provides a discussion of how L1 and L2 regularization are different and how they affect model fitting, with code samples for logistic regression and neural network models:  [L1 and L2 Regularization for Machine Learning](/archive/msdn-magazine/2015/february/test-run-l1-and-l2-regularization-for-machine-learning)  
    >
    > Different linear combinations of L1 and L2 terms have been devised for logistic regression models: for example, [elastic net regularization](https://wikipedia.org/wiki/Elastic_net_regularization). We suggest that you reference these combinations to define a linear combination that is effective in your model.
      
5.  For **Memory size for L-BFGS**, specify the amount of memory to use for *L-BFGS* optimization.  
  
     L-BFGS stands for "limited memory Broyden-Fletcher-Goldfarb-Shanno". It is an optimization algorithm that is popular for parameter estimation. This parameter indicates the number of past positions and gradients to store for the computation of the next step.  
  
     This optimization parameter limits the amount of memory that is used to compute the next step and direction. When you specify less memory, training is faster but less accurate.  
  
6.  For **Random number seed**, type an integer value. Defining a seed value is important if you want the results to be reproducible over multiple runs of the same pipeline.  
  
  
8. Add a labeled dataset to the pipeline, and train the model:

    + If you set **Create trainer mode** to **Single Parameter**, connect a tagged dataset and the [Train Model](train-model.md) component.  
  
    + If you set **Create trainer mode** to **Parameter Range**, connect a tagged dataset and train the model by using [Tune Model Hyperparameters](tune-model-hyperparameters.md).  
  
    > [!NOTE]
    > 
    > If you pass a parameter range to [Train Model](train-model.md), it uses only the default value in the single parameter list.  
    > 
    > If you pass a single set of parameter values to the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component, when it expects a range of settings for each parameter, it ignores the values, and uses the default values for the learner.  
    > 
    > If you select the **Parameter Range** option and enter a single value for any parameter, that single value you specified is used throughout the sweep, even if other parameters change across a range of values.  
  
9. Submit the pipeline.  
  
## Results

After training is complete:
 
  
+ To make predictions on new data, use the trained model and new data as input to the [Score Model](./score-model.md) component. 


## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning.