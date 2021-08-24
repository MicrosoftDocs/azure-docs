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



### Option 2: Deploy from the Models page 

This section provides guidance on how to deploy Automated ML trained model from Azure Machine Learning Models Page. 

1. Follow the steps above to download conda yaml file, scoring script and model pickle file. 

2. Go to the Models page in Azure machine learning studio. 

3. Click on + Register Model option. 

4. Register the model you downloaded from Automated ML run. 

5. Go to Environments page, select Custom environment and select + Create option to create an environment for your deployment. Use the downloaded conda yaml to create a custom environment.  

6. Select the model, and from the Deploy drop-down option, select Deploy to real-time endpoint. 

7. Complete all the steps in wizard to create an online endpoint and deployment. 

 

3. Deploy from Endpoints page 

This section provides guidance on how to deploy Automated ML trained model from Azure Machine Learning Endpoints page.  

1. Follow the steps above to download conda yaml file, scoring script and model pickle file. 

2. Go to Environments page, select Custom environment and select + Create option to create an environment for your deployment. Use the downloaded conda yaml to create a custom environment. 

3. Click on + Create option on the endpoints page. 

4. Complete all the steps in wizard to create an online endpoint and deployment. 

 

Using Azure Machine Learning CLI 2.0 

This section provides guidance on how to download Automated ML trained model, scoring script and environment (conda.yaml), then use CLI 2.0 to deploy the model to online endpoint. 

1. Go to Automated ML page in Azure machine learning studio, select the Run 

2. Click on Models 

3. From the list of Models, select the one you want to deploy to an online endpoint. 

4. After you have select the mode, click on Output + Logs option. 

:::image type="content" source="media/how-to-deploy-automl-endpoint/output-and-logs.png" alt-text="{alt-text}":::

5. From the outputs folder, download model pickle file, conda yaml file and scoring script. 

6. Follow the sample here: azureml-examples/1-create-endpoint-with-blue.yml at main · Azure/azureml-examples (github.com), replace scoring script, model and conda yaml file downloaded from step above.  

7. az ml endpoint create -n $ENDPOINT_NAME -f  

 