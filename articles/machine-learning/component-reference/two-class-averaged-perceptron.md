---
title:  "Two-Class Averaged Perceptron: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Two-Class Averaged Perceptron component in the designer to create a binary classifier.  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 04/22/2020
---
# Two-Class Averaged Perceptron component

This article describes a component in Azure Machine Learning designer.

Use this component to create a machine learning model based on the averaged perceptron algorithm.  
  
This classification algorithm is a supervised learning method, and requires a *tagged dataset*, which includes a label column. You can train the model by providing the model and the tagged dataset as an input to [Train Model](./train-model.md). The trained model can then be used to predict values for the new input examples.  

### About averaged perceptron models

The *averaged perceptron method* is an early and simple version of a neural network. In this approach, inputs are classified into several possible outputs based on a linear function, and then combined with a set of weights that are derived from the feature vector—hence the name "perceptron."

The simpler perceptron models are suited to learning linearly separable patterns, whereas neural networks (especially deep neural networks) can model more complex class boundaries. However, perceptrons are faster, and because they process cases serially, perceptrons can be used with continuous training.

## How to configure Two-Class Averaged Perceptron

1.  Add the **Two-Class Averaged Perceptron** component to your pipeline.  

2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    -   **Single Parameter**: If you know how you want to configure the model, provide a specific set of values as arguments.

    -   **Parameter Range**: Select this option if you are not sure of the best parameters, and want to run a parameter sweep. Select a range of values to iterate over, and the [Tune Model Hyperparameters](tune-model-hyperparameters.md) iterates over all possible combinations of the settings you provided to determine the hyperparameters that produce the optimal results.  
  
3.  For **Learning rate**, specify a value for the *learning rate*. The learning rate values control the size of the step that is used in stochastic gradient descent each time the model is tested and corrected.
  
     By making the rate smaller, you test the model more often, with the risk that you might get stuck in a local plateau. By making the step larger, you can converge faster, at the risk of overshooting the true minima.
  
4.  For **Maximum number of iterations**, type the number of times you want the algorithm to examine the training data.  
  
     Stopping early often provides better generalization. Increasing the number of iterations improves fitting, at the risk of overfitting.
  
5.  For **Random number seed**, optionally type an integer value to use as the seed. Using a seed is recommended if you want to ensure reproducibility of the pipeline across runs.  
  
1.  Connect a training dataset, and train the model:

    + If you set **Create trainer mode** to **Single Parameter**, connect a tagged dataset and the [Train Model](train-model.md) component.  
  
    + If you set **Create trainer mode** to **Parameter Range**, connect a tagged dataset and train the model by using [Tune Model Hyperparameters](tune-model-hyperparameters.md).  
  
    > [!NOTE]
    > 
    > If you pass a parameter range to [Train Model](train-model.md), it uses only the default value in the single parameter list.  
    > 
    > If you pass a single set of parameter values to the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component, when it expects a range of settings for each parameter, it ignores the values, and uses the default values for the learner.  
    > 
    > If you select the **Parameter Range** option and enter a single value for any parameter, that single value you specified is used throughout the sweep, even if other parameters change across a range of values.




## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 