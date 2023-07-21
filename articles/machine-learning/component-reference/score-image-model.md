---
title: Use the Score Image Model component
titleSuffix: Azure Machine Learning
description: Learn how to use the Score Image Model component in Azure Machine Learning to generate predictions using a trained image model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 05/26/2020
---

# Score Image Model

This article describes a component in Azure Machine Learning designer.

Use this component to generate predictions using a trained image model on input image data.

## How to configure Score Image Model

1. Add the **Score Image Model** component to your pipeline.

2. Attach a trained image model and a dataset containing input image data. 

    The data should be of type ImageDirectory. Refer to [Convert to Image Directory](convert-to-image-directory.md) component for more information about how to get a image directory. The schema of the input dataset should also generally match the schema of the data used to train the model.

3. Submit the pipeline.

## Results

After you have generated a set of scores using [Score Image Model](score-image-model.md), to generate a set of metrics used for evaluating the model's accuracy (performance), you can connect this component and the scored dataset to [Evaluate Model](evaluate-model.md), 

### Publish scores as a web service

A common use of scoring is to return the output as part of a predictive web service. For more information, see [this tutorial](../v1/tutorial-designer-automobile-price-deploy.md) on how to deploy a real-time endpoint based on a pipeline in Azure Machine Learning designer.

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning.