---
title:  "Decision Forest Regression: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Two-Class Averaged Perceptron module in Azure Machine Learning to create a machine learning model based on the averaged perceptron algorithm.  
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Two-Class Averaged Perceptron module

This article describes a module in Azure Machine Learning designer.

Use this module to create a machine learning model based on the averaged perceptron algorithm.  
  
This classification algorithm is a supervised learning method, and requires a *tagged dataset*, which includes a label column. You can train the model by providing the model and the tagged dataset as an input to [Train Model](./train-model.md). The trained model can then be used to predict values for the new input examples.  

### About averaged perceptron models

The *averaged perceptron method* is an early and simple version of a neural network. In this approach, inputs are classified into several possible outputs based on a linear function, and then combined with a set of weights that are derived from the feature vector—hence the name "perceptron."

The simpler perceptron models are suited to learning linearly separable patterns, whereas neural networks (especially deep neural networks) can model more complex class boundaries. However, perceptrons are faster, and because they process cases serially, perceptrons can be used with continuous training.

## How to configure Two-Class Averaged Perceptron

1.  Add the **Two-Class Averaged Perceptron** module to your pipeline.  

2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    -   **Single Parameter**: If you know how you want to configure the model, provide a specific set of values as arguments.
  
3.  For **Learning rate**, specify a value for the *learning rate*. The learning rate values control the size of the step that is used in stochastic gradient descent each time the model is tested and corrected.
  
     By making the rate smaller, you test the model more often, with the risk that you might get stuck in a local plateau. By making the step larger, you can converge faster, at the risk of overshooting the true minima.
  
4.  For **Maximum number of iterations**, type the number of times you want the algorithm to examine the training data.  
  
     Stopping early often provides better generalization. Increasing the number of iterations improves fitting, at the risk of overfitting.
  
5.  For **Random number seed**, optionally type an integer value to use as the seed. Using a seed is recommended if you want to ensure reproducibility of the pipeline across runs.  
  
1.  Connect a training dataset, and one of the training modules:
  
    -   If you set **Create trainer mode** to **Single Parameter**, use the [Train Model](train-model.md) module.




## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 