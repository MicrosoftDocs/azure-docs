---
title:  "Multiclass Neural Network: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Multiclass Neural Network module in Azure Machine Learning service to create a neural network model that can be used to predict a target that has multiple values. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---
# Multiclass Neural Network module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to create a neural network model that can be used to predict a target that has multiple values. 

For example, neural networks of this kind might be used in complex computer vision tasks, such as digit or letter recognition, document classification, and pattern recognition.

Classification using neural networks is a supervised learning method, and therefore requires a *tagged dataset* that includes a label column.

You can train the model by providing the model and the tagged dataset as an input to [Train Model](./train-model.md). The trained model can then be used to predict values for the new input examples.  

## About neural networks

A neural network is a set of interconnected layers. The inputs are the first layer, and are connected to an output layer by an acyclic graph comprised of weighted edges and nodes.

Between the input and output layers you can insert multiple hidden layers. Most predictive tasks can be accomplished easily with only one or a few hidden layers. However, recent research has shown that deep neural networks (DNN) with many layers can be effective in complex tasks such as image or speech recognition. The successive layers are used to model increasing levels of semantic depth.

The relationship between inputs and outputs is learned from training the neural network on the input data. The direction of the graph proceeds from the inputs through the hidden layer and to the output layer. All nodes in a layer are connected by the weighted edges to nodes in the next layer.

To compute the output of the network for a particular input, a value is calculated at each node in the hidden layers and in the output layer. The value is set by calculating the weighted sum of the values of the nodes from the previous layer. An activation function is then applied to that weighted sum.

## Configure Multiclass Neural Network

1. Add the **MultiClass Neural Network** module to your experiment in the interface. You can find this module under **Machine Learning**, **Initialize**, in the **Classification** category.

2. **Create trainer mode**: Use this option to specify how you want the model to be trained:

    - **Single Parameter**: Choose this option if you already know how you want to configure the model.

    

3. **Hidden layer specification**: Select the type of network architecture to create.

    - **Fully connected case**: Select this option to create a model using the default neural network architecture. For multiclass neural network models, the defaults are as follows:

        - One hidden layer
        - The output layer is fully connected to the hidden layer.
        - The hidden layer is fully connected to the input layer.
        - The number of nodes in the input layer is determined by the number of features in the training data.
        - The number of nodes in the hidden layer can be set by the user. The default is 100.
        - The number of nodes in the output layer depends on the number of classes.
  
   

5. **Number of hidden nodes**: This option lets you customize the number of hidden nodes in the default architecture. Type the number of hidden nodes. The default is one hidden layer with 100 nodes.

6. **The learning rate**: Define the size of the step taken at each iteration, before correction.A larger value for learning rate can cause the model to converge faster, but it can overshoot local minima.

7. **Number of learning iterations**: Specify  the maximum number of times the algorithm should process the training cases.

8. **The initial learning weights diameter**: Specify the node weights at the start of the learning process.

9. **The momentum**: Specify a weight to apply during learning to nodes from previous iterations.
  
11. **Shuffle examples**: Select this option to shuffle cases between iterations.

    If you deselect this option, cases are processed in exactly the same order each time you run the experiment.

12. **Random number seed**: Type a value to use as the seed, if you want to ensure repeatability across runs of the same experiment.

14. Connect a training dataset and one of the [training modules](module-reference.md): 

    - If you set **Create trainer mode** to **Single Parameter**, use [Train Model](train-model.md).  
  

## Results

After training is complete:

- To see a summary of the model's parameters, together with the feature weights learned from training, and other parameters of the neural network, right-click the output of [Train Model](./train-model.md)  and select **Visualize**.  

- To save a snapshot of the trained model, right-click the **Trained model** output and select **Save As Trained Model**. This model is not updated on successive runs of the same experiment.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 