---
title:  "Two-Class Neural Network: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Two-Class Neural Network module in Azure Machine Learning to create a neural network model that can be used to predict a target that has only two values.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---

# Two-Class Neural Network module

This article describes a module in Azure Machine Learning designer.

Use this module to create a neural network model that can be used to predict a target that has only two values.

Classification using neural networks is a supervised learning method, and therefore requires a *tagged dataset*, which includes a label column. For example, you could use this neural network model to predict binary outcomes such as whether or not a patient has a certain disease, or whether a machine is likely to fail within a specified window of time.  

After you define the model, train it by providing a tagged dataset and the model as an input to [Train Model](./train-model.md). The trained model can then be used to predict values for new inputs.

### More about neural networks

A neural network is a set of interconnected layers. The inputs are the first layer, and are connected to an output layer by an acyclic graph comprised of weighted edges and nodes.

Between the input and output layers you can insert multiple hidden layers. Most predictive tasks can be accomplished easily with only one or a few hidden layers. However, recent research has shown that deep neural networks (DNN) with many layers can be effective in complex tasks such as image or speech recognition. The successive layers are used to model increasing levels of semantic depth.

The relationship between inputs and outputs is learned from training the neural network on the input data. The direction of the graph proceeds from the inputs through the hidden layer and to the output layer. All nodes in a layer are connected by the weighted edges to nodes in the next layer.

To compute the output of the network for a particular input, a value is calculated at each node in the hidden layers and in the output layer. The value is set by calculating the weighted sum of the values of the nodes from the previous layer. An activation function is then applied to that weighted sum.
  
## How to configure

1.  Add the **Two-Class Neural Network** module to your pipeline. You can find this module under **Machine Learning**, **Initialize**, in the **Classification** category.  
  
2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    -   **Single Parameter**: Choose this option if you already know how you want to configure the model.  

3.  For **Hidden layer specification**, select the type of network architecture to create.  
  
    -   **Fully connected case**: Uses the default neural network architecture, defined for two-class neural networks as follows:
  
        -   Has one hidden layer.
  
        -   The output layer is fully connected to the hidden layer, and the hidden layer is fully connected to the input layer.
  
        -   The number of nodes in the input layer equals the number of features in the training data.
  
        -   The number of nodes in the hidden layer is set by the user. The default value is 100.
  
        -   The number of nodes equals the number of classes. For a two-class neural network, this means that all inputs must map to one of two nodes in the output layer.

5.  For **Learning rate**, define the size of the step taken at each iteration, before correction. A larger value for learning rate can cause the model to converge faster, but it can overshoot local minima.

6.  For **Number of learning iterations**, specify the maximum number of times the algorithm should process the training cases.

7.  For **The initial learning weights diameter**, specify the node weights at the start of the learning process.

8.  For **The momentum**, specify a weight to apply during learning to nodes from previous iterations  

10. Select the **Shuffle examples** option to shuffle cases between iterations. If you deselect this option, cases are processed in exactly the same order each time you run the pipeline.
  
11. For **Random number seed**, type a value to use as the seed.
  
     Specifying a seed value is useful when you want to ensure repeatability across runs of the same pipeline.  Otherwise, a system clock value is used as the seed, which can cause slightly  different results each time you run the pipeline.
  
13. Add a tagged dataset to the pipeline, and connect one of the [training modules](module-reference.md).  
  
    -   If you set **Create trainer mode** to **Single Parameter**, use the [Train Model](train-model.md) module.  
  
14. Run the pipeline.

## Results

After training is complete:

+ To save a snapshot of the trained model, select the **Outputs** tab in the right panel of the **Train model** module. Select the **Register dataset** icon to save the model as a reusable module.

+ To use the model for scoring, add the **Score Model** module to a pipeline.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
