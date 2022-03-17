---
title: "Fast Forest Quantile Regression: Module reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Fast Forest Quantile Regression component to create a regression model that can predict values for a specified number of quantiles.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 07/13/2020
---
# Fast Forest Quantile Regression

This article describes a module in Azure Machine Learning designer.

Use this component to create a fast forest quantile regression model in a pipeline. Fast forest quantile regression is useful if you want to understand more about the distribution of the predicted value, rather than get a single mean prediction value. This method has many applications, including:  
  
- Predicting prices  
  
- Estimating student performance or applying growth charts to assess child development  
  
- Discovering predictive relationships in cases where there is only a weak relationship between variables  
  
This regression algorithm is a **supervised** learning method, which means it requires a tagged dataset that includes a label column. Because it is a regression algorithm, the label column must contain only numerical values.

## More about quantile regression

There are many different types of regression. Simply put,  regression means fitting a model to a target expressed as a numeric vector. However, statisticians have been developing increasingly advanced methods for regression.

The simplest definition of *quantile* is a value that divides a set of data into equal-sized groups; thus, the quantile values mark the boundaries between groups. Statistically speaking, quantiles are values taken at regular intervals from the inverse of the cumulative distribution function (CDF) of a random variable.

Whereas linear regression models attempt to predict the value of a numeric variable using a single estimate, the *mean*, sometimes you need to predict the range or entire distribution of the target variable. Techniques such as Bayesian regression and quantile regression have been developed for this purpose.

Quantile regression helps you understand the distribution of the predicted value. Tree-based quantile regression models, such as the one used in this component, have the additional advantage that they can be used to predict non-parametric distributions.

  
## How to configure Fast Forest Quantile Regression

1. Add the **Fast Forest Quantile Regression** component to your pipeline in the designer. You can find this component under **Machine Learning Algorithms**, in the **Regression** category.

2. In the right pane of the **Fast Forest Quantile Regression** component, specify how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    - **Single Parameter**: If you know how you want to configure the model, provide a specific set of values as arguments. When you train the model, use [Train Model](train-model.md).
  
    - **Parameter Range**: If you are not sure of the best parameters, do a parameter sweep using the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component. The trainer iterates over multiple values you specify to find the optimal configuration.

3. **Number of Trees**, type the maximum number of trees that can be created in the ensemble. If you create more trees, it generally leads to greater accuracy, but at the cost of longer training time.  

4. **Number of Leaves**, type the maximum number of leaves, or terminal nodes, that can be created in any tree.  

5. **Minimum number of training instances required to form a leaf**, specify the minimum number of examples that are required to create any terminal node (leaf) in a tree.  
  
     By increasing this value, you increase the threshold for creating new rules. For example, with the default value of 1, even a single case can cause a new rule to be created. If you increase the value to 5, the training data would have to contain at least 5 cases that meet the same conditions.

6. **Bagging fraction**, specify a number between 0 and 1 that represents the fraction of samples to use when building each group of quantiles. Samples are chosen randomly, with replacement.

7. **Split fraction**, type a number between 0 and 1 that represents the fraction of features to use in each split of the tree. The features used are always chosen randomly.

8. **Quantiles to be estimated**, type a semicolon-separated list of the quantiles for which you want the model to train and create predictions.
  
     For example, if you want to build a model that estimates for quartiles, you would type `0.25; 0.5; 0.75`.  

9. Optionally, type a value for **Random number seed** to seed the random number generator used by the model.  The default is 0, meaning a random seed is chosen.
  
     You should provide a value if you need to reproduce results across successive runs on the same data.  

10. Connect the training dataset and the untrained model to one of the training components: 

    - If you set **Create trainer mode** to **Single Parameter**, use the [Train Model](train-model.md) component.

    - If you set **Create trainer mode** to **Parameter Range**, use the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component.

    > [!WARNING]
    > 
    > - If you pass a parameter range to [Train Model](train-model.md), it uses only the first value in the parameter range list.
    > 
    > - If you pass a single set of parameter values to the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component, when it expects a range of settings for each parameter, it ignores the values and uses the default values for the learner.
    > 
    > - If you select the **Parameter Range** option and enter a single value for any parameter, that single value you specified is used throughout the sweep, even if other parameters change across a range of values.

11. Submit the pipeline.

## Results

After training is complete:

+ To save a snapshot of the trained model, select the training component, then switch to **Outputs+logs** tab in the right panel. Click on the icon **Register dataset**.  You can find the saved model as a component in the component tree.

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning.
