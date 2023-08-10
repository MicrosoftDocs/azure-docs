---
title:  "Score Model: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Score Model component in Azure Machine Learning to generate predictions using a trained classification or regression model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 02/11/2020
---
# Score Model

This article describes a component in Azure Machine Learning designer.

Use this component to generate predictions using a trained classification or regression model.

## How to use

1. Add the **Score Model** component to your pipeline.

2. Attach a trained model and a dataset containing new input data. 

    The data should be in a format compatible with the type of trained model you are using. The schema of the input dataset should also generally match the schema of the data used to train the model.

3. Submit the pipeline.

## Results

After you have generated a set of scores using [Score Model](./score-model.md):

+ To generate a set of metrics used for evaluating the model's accuracy (performance), you can connect the scored dataset to [Evaluate Model](./evaluate-model.md), 
+ Right-click the component and select **Visualize** to see a sample of the results.
<!-- + To Save the results to a dataset. -->

The score, or predicted value, can be in many different formats, depending on the model and your input data:

- For classification models, [Score Model](./score-model.md) outputs a predicted value for the class, as well as the probability of the predicted value.
- For regression models, [Score Model](./score-model.md) generates just the predicted numeric value.


## Publish scores as a web service

A common use of scoring is to return the output as part of a predictive web service. For more information, see [this tutorial](../v1/tutorial-designer-automobile-price-deploy.md) on how to deploy a real-time endpoint based on a pipeline in Azure Machine Learning designer.

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning.