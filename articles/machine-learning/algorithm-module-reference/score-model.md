---
title:  "Score Model: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Score Model module in Azure Machine Learning to generate predictions using a trained classification or regression model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Score Model module

This article describes a module in Azure Machine Learning designer.

Use this module to generate predictions using a trained classification or regression model.

## How to use

1. Add the **Score Model** module to your pipeline.

2. Attach a trained model and a dataset containing new input data. 

    The data should be in a format compatible with the type of trained model you are using. The schema of the input dataset should also generally match the schema of the data used to train the model.

3. Run the pipeline.

## Results

After you have generated a set of scores using [Score Model](./score-model.md):

+ To generate a set of metrics used for evaluating the model’s accuracy (performance).  you can connect the scored dataset to [Evaluate Model](./evaluate-model.md), 
+ Right-click the module and select **Visualize** to see a sample of the results.
+ Save the results to a dataset.

The score, or predicted value, can be in many different formats, depending on the model and your input data:

- For classification models, [Score Model](./score-model.md) outputs a predicted value for the class, as well as the probability of the predicted value.
- For regression models, [Score Model](./score-model.md) generates just the predicted numeric value.
- For image classification models, the score might be the class of object in the image, or a Boolean indicating whether a particular feature was found.

## Publish scores as a web service

A common use of scoring is to return the output as part of a predictive web service. For more information, see this tutorial on how to create a web service based on a pipeline in Azure Machine Learning:

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 