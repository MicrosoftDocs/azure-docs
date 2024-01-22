---
title:  "AutoML Forecasting Component in Microsoft Azure Machine Learning Designer"
titleSuffix: Azure Machine Learning
description: Learn how to use the AutoML Forecasting component in Azure Machine Learning to create a classifier using ML Table data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: rasavage
author: rsavage2
ms.reviewer: ssalgadodev
ms.date: 12/1/2022
---

# AutoML Forecasting

This article describes a component in Azure Machine Learning designer.

Use this component to create a machine learning model that is based on the AutoML Forecasting.


## How to configure 

This component creates a forecasting model. Because forecasting is a supervised learning method, you need a *labeled dataset* that includes a label column with a value for all rows. Follow this link to get more information on [how to prepare your dataset.](../how-to-prepare-datasets-for-automl-images.md) The dataset will need a *labeled dataset* that includes a label column with a value for all rows.

This model requires a training dataset. Validation and test datasets are optional. 

AutoML creates a number of pipelines in parallel that try different algorithms and parameters for your model. The service iterates through ML algorithms paired with feature selections, where each iteration produces a model with a training score. You are able to choose the metric you want the model to optimize for. The better the score for the chosen metric the better the model is considered to "fit" your data. You are able to define an exit criteria for the experiment. The exit criteria will be model with a specific training score you want AutoML to find. It will stop once it hits the exit criteria defined. This component will then output the best model that has been generated at the end of the run for your dataset.


1.  Add the **AutoML Forecasting** component to your pipeline.

1. Specify the **training_data** you want the model to use. 

1. Specify the **Primary Metric** you want AutoML to use to measure your model's success.


1.  Specify the **Target Column** you want the model to output 

1. On the **Task type and settings** form, select the task type: forecasting. See [supported task types](../concept-automated-ml.md#when-to-use-automl-classification-regression-forecasting-computer-vision--nlp) for more information.

    1. For **forecasting** you can, 
    
        1. Enable deep learning.
    
        1. Select *time column*: This column contains the time data to be used.

        1. Select *forecast horizon*: Indicate how many time units (minutes/hours/days/weeks/months/years) will the model be able to predict to the future. The further the model is required to predict into the future, the less accurate it becomes. [Learn more about forecasting and forecast horizon](../how-to-auto-train-forecast.md).

1. (Optional) View addition configuration settings: additional settings you can use to better control the training job. Otherwise, defaults are applied based on experiment selection and data. 

    Additional configurations|Description
    ------|------
    Primary metric| Main metric used for scoring your model. [Learn more about model metrics](../how-to-configure-auto-train.md#primary-metric).
    Explain best model | Select to enable or disable, in order to show explanations for the recommended best model. <br> This functionality is not currently available for [certain forecasting algorithms](../v1/how-to-machine-learning-interpretability-automl.md#interpretability-during-training-for-the-best-model). 
    Blocked algorithm| Select algorithms you want to exclude from the training job. <br><br> Allowing algorithms is only available for [SDK experiments](../how-to-configure-auto-train.md#supported-algorithms). <br> See the [supported algorithms for each task type](/python/api/azureml-automl-core/azureml.automl.core.shared.constants.supportedmodels).
    Exit criterion| When any of these criteria are met, the training job is stopped. <br> *Training job time (hours)*: How long to allow the training job to run. <br> *Metric score threshold*:  Minimum metric score for all pipelines. This ensures that if you have a defined target metric you want to reach, you do not spend more time on the training job than necessary.
    Concurrency| *Max concurrent iterations*: Maximum number of pipelines (iterations) to test in the training job. The job will not run more than the specified number of iterations. Learn more about how automated ML performs [multiple child jobs on clusters](../how-to-configure-auto-train.md#multiple-child-runs-on-clusters).

## Next steps

See the [set of components available](../component-reference/component-reference.md) to Azure Machine Learning.
