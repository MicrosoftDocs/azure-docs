---
title: Deploy an AutoML model by using a managed online endpoint (preview)
titleSuffix: Azure Machine Learning
description: Learn to deploy your AutoML model as a web service that's automatically managed by Azure.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: ssambare
ms.reviewer: laobri
author: ssambare
ms.date: 09/10/2021
ms.topic: how-to
ms.custom: how-to, devplatv2
---

# How to deploy an AutoML model to an online endpoint (preview)

In this article you will learn how to deploy an AutoML-trained machine learning model to an online endpoint. Automated machine learning, also referred to as automated ML or AutoML, is the process of automating the time-consuming, iterative tasks of developing a machine learning model. For more, see (What is automated machine learning (AutoML)?)[concept-automated-ml.md]

In this article you will know how to deploy AutoML trained machine learning model to online endpoints using: 

- Azure Machine Learning Studio
- Azure Machine Learning CLI 2.0

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

An AutoML-trained machine learning model. For more, see [Tutorial: Train a classification model with no-code AutoML in the Azure Machine Learning studio]- (tutorial-first-experiment-automated-ml.md) or [Tutorial: Forecase demand with automated machine learning](tutorial-automated-ml-forecast.md).

## Deploy from Azure Machine Learning studio and no code

Deploying an AutoML-trained model from the Automated ML page is a no-code experience. That is, you don't need to prepare a scoring script and environment, both are auto generated. 

1. Go to your Automated ML experiment in your machine learning workspace. 
2. Choose the Models tab.

{>> Add sequence numbers to model-option.png <<}
{>> Nuke PII throughout <<} 

:::image type="content" source="media/how-to-deploy-automl-endpoint/model-option.png" alt-text="Screenshot of studio showing an AutoML experiment and the Details page":::

3. Select the model you want to deploy to online endpoint. Once you select a model, the Deploy button will light up with a drop-down menu. 

:::image type="content" source="media/how-to-deploy-automl-endpoint/deploy-button.png" alt-text="Screenshot showing the Deploy button's drop-down menu":::

4. Select *Deploy to real-time endpoint (preview)* option. 

The system will generate the Model and Environment needed for the deployment. 

:::image type="content" source="media/how-to-deploy-automl-endpoint/model.png" alt-text="Screenshot showing the generated Model":::

:::image type="content" source="media/how-to-deploy-automl-endpoint/environment.png" alt-text="Screenshot showing the generated Environment":::

5. Complete the wizard to deploy the model to a real-time endpoint. 

 :::image type="content" source="media/how-to-deploy-automl-endpoint/complete-wizard.jpeg" alt-text="Screenshot showing the review-and-create page":::


## Deploy manually from the studio or command line

If you wish to have more control over the deployment, you can download the training artifacts and deploy them. 

To download the components you'll need for deployment:

1. Go to your Automated ML experiment in your machine learning workspace.
1. Choose the Models tab.
1. Select the model you wish to use. Once you select a model, the *Download* button will become enabled.
1. Choose *Download* .

:::image type="content" source="{source}" alt-text="{alt-text}":::

You will receive a zip file containing:
* A conda environment specification file named `conda_env_{version}.yml`.
* A Python scoring file named `scoring_file_{version}.py`.
* The model itself, in a Python .pkl file named `model.pkl`.

To deploy these, you can use either studio or the Azure command line interface.

# [Studio](#tab/Studio)

1. Go to the Models page in Azure machine learning studio. 

1. Click on + Register Model option. 

1. Register the model you downloaded from Automated ML run. 

1. Go to Environments page, select Custom environment and select + Create option to create an environment for your deployment. Use the downloaded conda yaml to create a custom environment.  

1. Select the model, and from the Deploy drop-down option, select Deploy to real-time endpoint. 

1. Complete all the steps in wizard to create an online endpoint and deployment. 

 
# [CLI](#tab/CLI)

1. Follow the sample here: azureml-examples/1-create-endpoint-with-blue.yml at main · Azure/azureml-examples (github.com), replace scoring script, model and conda yaml file downloaded from step above.  

7. az ml endpoint create -n $ENDPOINT_NAME -f  

---

Next steps:

