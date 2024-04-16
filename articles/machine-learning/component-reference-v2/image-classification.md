---
title:  "AutoML Image Classification"
titleSuffix: Azure Machine Learning
description: Learn how to use the AutoML Image Classification component in Azure Machine Learning to create a classifier using ML Table data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: rasavage
author: rsavage2
ms.reviewer: ssalgadodev
ms.date: 12/1/2022
---

# AutoML Image Classification

This article describes a component in Azure Machine Learning designer.

Use this component to create a machine learning model that is based on the AutoML Image Classification.


## How to configure 

[Follow this link](../reference-automl-images-cli-classification.md) for a full list of configurable parameters of this component.


This model requires a training dataset. Validation and test datasets are optional. 

Follow this link to get more information on [how to prepare your dataset.](../how-to-prepare-datasets-for-automl-images.md) The dataset will need a *labeled dataset* that includes a label column with a value for all rows.


AutoML runs a number of trials (specified in max_trials) in parallel (specified in max_concurrent_trials) that try different algorithms and parameters for your model. The service iterates through ML algorithms paired with hyperparameter selections and each trial produces a model with a training score. You are able to choose the metric you want the model to optimize for. The better the score for the chosen metric the better the model is considered to "fit" your data. You are able to define an exit criteria (termination policy) for the experiment. The exit criteria will be model with a specific training score you want AutoML to find. It will stop once it hits the exit criteria defined. This component will then output the best model that has been generated at the end of the run for your dataset.



1.  Add the **AutoML Image Classification** component to your pipeline.

1.  Specify the **Target Column** you want the model to output 

1. Specify the **Primary Metric** you want AutoML to use to measure your model's success. Visit this link for an [explanation on each primary metric for computer vision.](../how-to-auto-train-image-models.md#primary-metric)

1. (Optional) You are able to configure algorithm settings. Visit this link for a [list of supported algorithms for computer vision.](../how-to-auto-train-image-models.md#explanations)

1. (Optional) To configure job limits, visit [this link for more explanation.](../how-to-auto-train-image-models.md#job-limits)

1. (Optional) Visit this link for a [list of configurations for Sampling and Early Termination for your Job Sweep.](../how-to-auto-train-image-models.md#sampling-methods-for-the-sweep) You can also find more information on each of the policies and sampling methods. 

    

## Next steps

See the [set of components available](../component-reference/component-reference.md) to Azure Machine Learning.