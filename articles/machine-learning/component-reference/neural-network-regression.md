---
title:  "Neural Network Regression: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Neural Network Regression component in Azure Machine Learning to create a regression model using a customizable neural network algorithm..
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 04/22/2020
---
# Neural Network Regression component

*Creates a regression model using a neural network algorithm*  
  
 Category: Machine Learning / Initialize Model / Regression
  
## Component overview  

This article describes a component in Azure Machine Learning designer.

Use this component to create a regression model using a customizable neural network algorithm.
  
 Although neural networks are widely known for use in deep learning and modeling complex problems such as image recognition, they are easily adapted to regression problems. Any class of statistical models can be termed a neural network if they use adaptive weights and can approximate non-linear functions of their inputs. Thus neural network regression is suited to problems where a more traditional regression model cannot fit a solution.
  
 Neural network regression is a supervised learning method, and therefore requires a *tagged dataset*, which includes a label column. Because a regression model predicts a numerical value, the label column must be a numerical data type.  
  
 You can train the model by providing the model and the tagged dataset as an input to [Train Model](./train-model.md). The trained model can then be used to predict values for the new input examples.  
  
## Configure Neural Network Regression 

Neural networks can be extensively customized. This section describes how to create a model using two methods:
  
+ [Create a neural network model using the default architecture](#bkmk_DefaultArchitecture)  
  
    If you accept the default neural network architecture,  use the **Properties** pane to set parameters that control the behavior of the neural network, such as the number of nodes in the hidden layer, learning rate, and normalization.

    Start here if you are new to neural networks. The component supports many customizations, as well as model tuning, without deep knowledge of neural networks. 

+ Define a custom architecture for a neural network 

    Use this option if you want to add extra hidden layers, or fully customize the network architecture, its connections, and activation functions.
    
    This option is best if you are already somewhat familiar with neural networks. You use the Net# language to define the network architecture.  

##  <a name="bkmk_DefaultArchitecture"></a> Create a neural network model using the default architecture

1.  Add the **Neural Network Regression** component to your pipeline in the designer. You can find this component under **Machine Learning**, **Initialize**, in the **Regression** category. 
  
2. Indicate how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    -   **Single Parameter**: Choose this option if you already know how you want to configure the model.

    -   **Parameter Range**: Select this option if you are not sure of the best parameters, and want to run a parameter sweep. Select a range of values to iterate over, and the [Tune Model Hyperparameters](tune-model-hyperparameters.md) iterates over all possible combinations of the settings you provided to determine the hyperparameters that produce the optimal results.   

3.  In **Hidden layer specification**, select **Fully connected case**. This option creates a model using the default neural network architecture, which for a neural network regression model, has these attributes:  
  
    + The network has exactly one hidden layer.
    + The output layer is fully connected to the hidden layer and the hidden layer is fully connected to the input layer.
    + The number of nodes in the hidden layer can be set by the user (default value is 100).  
  
    Because the number of nodes in the input layer is determined by the number of features in the training data, in a regression model there can be only one node in the output layer.  
  
4. For **Number of hidden nodes**, type the number of hidden nodes. The default is one hidden layer with 100 nodes. (This option is not available if you define a custom architecture using Net#.)
  
5.  For **Learning rate**, type a value that defines the step taken at each iteration, before correction. A larger value for learning rate can cause the model to converge faster, but it can overshoot local minima.

6.  For **Number of learning iterations**, specify the maximum number of times the algorithm processes the training cases.


8.  For **The momentum**, type a value to apply during learning as a weight on nodes from previous iterations.

10. Select the option, **Shuffle examples**, to change the order of cases between iterations. If you deselect this option, cases are processed in exactly the same order each time you run the pipeline.
  
11. For **Random number seed**, you can optionally type a value to use as the seed. Specifying a seed value is useful when you want to ensure repeatability across runs of the same pipeline.
  
13. Connect a training dataset and train the model:

    + If you set **Create trainer mode** to **Single Parameter**, connect a tagged dataset and the [Train Model](train-model.md) component.  
  
    + If you set **Create trainer mode** to **Parameter Range**, connect a tagged dataset and train the model by using [Tune Model Hyperparameters](tune-model-hyperparameters.md).  
  
    > [!NOTE]
    > 
    > If you pass a parameter range to [Train Model](train-model.md), it uses only the default value in the single parameter list.  
    > 
    > If you pass a single set of parameter values to the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component, when it expects a range of settings for each parameter, it ignores the values, and uses the default values for the learner.  
    > 
    > If you select the **Parameter Range** option and enter a single value for any parameter, that single value you specified is used throughout the sweep, even if other parameters change across a range of values.  
  
   
14. Submit the pipeline.  

## Results

After training is complete:

- To save a snapshot of the trained model, select the **Outputs** tab in the right panel of the **Train model** component. Select the **Register dataset** icon to save the model as a reusable component.

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 