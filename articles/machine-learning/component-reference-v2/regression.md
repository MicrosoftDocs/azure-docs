---
title:  "AutoML Regression"
titleSuffix: Azure Machine Learning
description: Learn how to use the AutoML Regression component in Azure Machine Learning to create a classifier using ML Table data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: rasavage
author: rsavage2
ms.reviewer: ssalgadodev
ms.date: 07/17/2023
---

# AutoML Regression

This article describes a component in Azure Machine Learning designer.

Use this component to create a machine learning model that is based on the AutoML Regression.


## How to configure 


This model requires a training dataset. Validation and test datasets are optional. 

AutoML creates a number of pipelines in parallel that try different algorithms and parameters for your model. The service iterates through ML algorithms paired with feature selections, where each iteration produces a model with a training score. You are able to choose the metric you want the model to optimize for. The better the score for the chosen metric the better the model is considered to "fit" your data. You are able to define an exit criteria for the experiment. The exit criteria will be model with a specific training score you want AutoML to find. It will stop once it hits the exit criteria defined. This component will then output the best model that has been generated at the end of the run for your dataset. Visit this link for more information on [exit criteria (termination policy)](../how-to-auto-train-image-models.md#early-termination-policies).



1.  Add the **AutoML Regression** component to your pipeline.

1.  Specify the **Target Column** you want the model to output 

1. (Optional) View addition configuration settings: additional settings you can use to better control the training job. Otherwise, defaults are applied based on experiment selection and data. 

    Additional configurations|Description
    ------|------
    Primary metric| Main metric used for scoring your model. [Learn more about model metrics](..//how-to-configure-auto-train.md#primary-metric).
    Debug model via the [Responsible AI dashboard](..//concept-responsible-ai-dashboard.md)  | Generate a Responsible AI dashboard to do a holistic assessment and debugging of the recommended best model. This includes insights such as model explanations, fairness and performance explorer, data explorer, and model error analysis. [Learn more about how you can generate a Responsible AI dashboard.](../how-to-responsible-ai-insights-ui.md)
    Blocked algorithm| Select algorithms you want to exclude from the training job. <br><br> Allowing algorithms is only available for [SDK experiments](../how-to-configure-auto-train.md#supported-algorithms). <br> See the [supported algorithms for each task type](/python/api/azureml-automl-core/azureml.automl.core.shared.constants.supportedmodels).
    Exit criterion| When any of these criteria are met, the training job is stopped. <br> *Training job time (hours)*: How long to allow the training job to run. <br> *Metric score threshold*:  Minimum metric score for all pipelines. This ensures that if you have a defined target metric you want to reach, you do not spend more time on the training job than necessary.
    Concurrency| *Max concurrent iterations*: Maximum number of pipelines (iterations) to test in the training job. The job will not run more than the specified number of iterations. Learn more about how automated ML performs [multiple child jobs on clusters](../how-to-configure-auto-train.md#multiple-child-runs-on-clusters).



1. The **[Optional] Validate and test** form allows you to do the following. 

    1. Specify the type of validation to be used for your training job. 
    
    
    1. Provide a test dataset (preview) to evaluate the recommended model that automated ML generates for you at the end of your experiment. When you provide test data, a test job is automatically triggered at the end of your experiment. This test job is only job on the best model that was recommended by automated ML.
    
        >[!IMPORTANT]
        > Providing a test dataset to evaluate generated models is a preview feature. This capability is an [experimental](/python/api/overview/azure/ml/#stable-vs-experimental) preview feature, and may change at any time.
        
        * Test data is considered a separate from training and validation, so as to not bias the results of the test job of the recommended model. [Learn more about bias during model validation](../concept-automated-ml.md#training-validation-and-test-data).
        * You can either provide your own test dataset or opt to use a percentage of your training dataset. Test data must be in the form of an [Azure Machine Learning TabularDataset](../how-to-create-data-assets.md).         
        * The schema of the test dataset should match the training dataset. The target column is optional, but if no target column is indicated no test metrics are calculated.
        * The test dataset should not be the same as the training dataset or the validation dataset.
        * Forecasting jobs do not support train/test split.
        

        
     

## Next steps

See the [set of components available](../component-reference/component-reference.md) to Azure Machine Learning. 
