---
title:  "Linear Regression: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Linear Regression module in Azure Machine Learning to create a linear regression model for use in a pipeline.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Linear Regression module
This article describes a module in Azure Machine Learning designer.

Use this module to create a linear regression model for use in a pipeline.  Linear regression attempts to establish a linear relationship between one or more independent variables and a numeric outcome, or dependent variable. 

You use this module to define a linear regression method, and then train a model using a labeled dataset. The trained model can then be used to make predictions.

## About linear regression

Linear regression is a common statistical method, which has been adopted in machine learning and enhanced with many new methods for fitting the line and measuring error. In the most basic sense, regression refers to prediction of a numeric target. Linear regression is still a good choice when you want a simple model for a basic predictive task. Linear regression also tends to work well on high-dimensional, sparse data sets lacking complexity.

Azure Machine Learning supports a variety of regression models, in addition to linear regression. However, the term "regression" can be interpreted loosely, and some types of regression provided in other tools are not supported.

+ The classic regression problem involves a single independent variable and a dependent variable. This is called *simple regression*.  This module supports simple regression.

+ *Multiple linear regression* involves two or more independent variables that contribute to a single dependent variable. Problems in which multiple inputs are used to predict a single numeric outcome are also  called *multivariate linear regression*.

    The **Linear Regression** module can solve these problems, as can most of the other regression modules.

+ *Multi-label regression* is the task of predicting multiple dependent variables within a single model. For example, in multi-label logistic regression, a sample can be assigned to multiple different labels. (This is different from the task of predicting multiple levels within a single class variable.)

    This type of regression is not supported in Azure Machine Learning. To predict multiple variables, create a separate learner for each output that you wish to predict.

For years statisticians have been developing increasingly advanced methods for regression. This is true even for linear regression. This module supports two methods to measure error and fit the regression line: ordinary least squares method, and gradient descent.

- **Gradient descent** is a method that minimizes the amount of error at each step of the model training process. There are many variations on gradient descent and its optimization for various learning problems has been extensively studied. If you choose this option for **Solution method**, you can set a variety of parameters to control the step size, learning rate, and so forth. This option also supports use of an integrated parameter sweep.

- **Ordinary least squares** is one of the most commonly used techniques in linear regression. For example, least squares is the method that is used in the Analysis Toolpak for Microsoft Excel.

    Ordinary least squares refers to the loss function, which computes error as the sum of the square of distance from the actual value to the predicted line, and fits the model by minimizing the squared error. This method assumes a strong linear relationship between the inputs and the dependent variable.

## Configure Linear Regression

This module supports two methods for fitting a regression model, with different options:

+ [Create a regression model using online gradient descent](#bkmk_GradientDescent)

    Gradient descent is a better loss function for models that are more complex, or that have too little training data given the number of variables.



+ [Fit a regression model using ordinary least squares](#bkmk_OrdinaryLeastSquares)

    For small datasets, it is best to select ordinary least squares. This should give similar results to Excel.

## <a name="bkmk_OrdinaryLeastSquares"></a> Create a regression model using ordinary least squares

1. Add the **Linear Regression Model** module to your pipeline in the designer.

    You can find this module in the **Machine Learning** category. Expand **Initialize Model**, expand **Regression**, and then drag the **Linear Regression Model** module to your pipeline.

2. In the **Properties** pane, in the **Solution method** dropdown list, select **Ordinary Least Squares**. This option specifies the computation method used to find the regression line.

3. In **L2 regularization weight**, type the value to use as the weight for L2 regularization. We recommend that you use a non-zero value to avoid overfitting.

     To learn more about how regularization affects model fitting, see this article: [L1 and L2 Regularization for Machine Learning](https://msdn.microsoft.com/magazine/dn904675.aspx)

4. Select the option, **Include intercept term**, if you want to view the term for the intercept.

    Deselect this option if you don't need to review the regression formula.

5. For **Random number seed**, you can optionally type a value to seed the random number generator used by the model.

    Using a seed value is useful if you want to maintain the same results across different runs of the same pipeline. Otherwise, the default is to use a value from the system clock.


7. Add the [Train Model](./train-model.md) module to your pipeline, and connect a labeled dataset.

8. Run the pipeline.

## Results for ordinary least squares model

After training is complete:


+ To make predictions, connect the trained model to the [Score Model](./score-model.md) module, along with a dataset of new values. 


## <a name="bkmk_GradientDescent"></a> Create a regression model using online gradient descent

1. Add the **Linear Regression Model** module to your pipeline in the designer.

    You can find this module in the **Machine Learning** category. Expand **Initialize Model**, expand **Regression**, and drag the **Linear Regression Model** module to your pipeline

2. In the **Properties** pane, in the **Solution method** dropdown list, choose **Online Gradient Descent** as the computation method used to find the regression line.

3. For **Create trainer mode**, indicate whether you want to train the model with a predefined set of parameters, or if you want to optimize the model by using a parameter sweep.

    + **Single Parameter**: If you know how you want to configure the linear regression network, you can provide a specific set of values as arguments.

   
4. For **Learning rate**, specify the initial learning rate for the stochastic gradient descent optimizer.

5. For **Number of training epochs**, type a value that indicates how many times the algorithm should iterate through examples. For datasets with a small number of examples, this number should be large to reach convergence.

6. **Normalize features**: If you have already normalized the numeric data used to train the model, you can deselect this option. By default, the module normalizes all numeric inputs to a range between 0 and 1.

    > [!NOTE]
    > 
    > Remember to apply the same normalization method to new data used for scoring.

7. In **L2 regularization weight**, type the value to use as the weight for L2 regularization. We recommend that you use a non-zero value to avoid overfitting.

    To learn more about how regularization affects model fitting, see this article: [L1 and L2 Regularization for Machine Learning](https://msdn.microsoft.com/magazine/dn904675.aspx)


9. Select the option, **Decrease learning rate**, if you want the learning rate to decrease as iterations progress.  

10. For **Random number seed**, you can optionally type a value to seed the random number generator used by the model. Using a seed value is useful if you want to maintain the same results across different runs of the same pipeline.


12. Add a labeled dataset and one of the training modules.

    If you are not using a parameter sweep, use the [Train Model](train-model.md) module.

13. Run the pipeline.

## Results for online gradient descent

After training is complete:

+ To make predictions, connect the trained model to the [Score Model](./score-model.md) module, together with new input data.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 