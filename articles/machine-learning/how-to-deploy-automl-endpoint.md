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

# How to deploy an AutoML model to an online endpoint

How to deploy AutoML model to online endpoint 

WI: 1860352 

 

In this article you will learn how to deploy an AutoML trained machine learning model to online endpoint. Automated machine learning, also referred to as automated ML or AutoML, is the process of automating the time-consuming, iterative tasks of machine learning model development. For more, see What is automated machine learning (AutoML)? 

[IMPORTANT]: While both Azure Machine Learning Managed Online Endpoint and Automated ML are generally available, the ability to deploy a model from AutoML to Managed Online Endpoint is in preview. 

In this article you will know how to deploy AutoML trained machine learning model to online endpoint using: 

Azure Machine Learning Studio 

Azure Machine Learning CLI 2.0  

Prerequisites: 

AutoML trained machine learning model. Learn how to train a machine learning model in AutoML. 

Run tutorial to generate a trained model. Tutorial: Demand forecasting & AutoML - Azure Machine Learning | Microsoft Docs 

Using Azure Machine Learning Studio 

1. Deploy from Automated ML page 

Deploying an AutoML trained model gives no-code experience. That is, you don't need to prepare a scoring script and environment, both are auto generated. 

Go to Automated ML experiment in your machine learning workspace. 

:::image type="content" source="media/how-to-deploy-automl-endpoint/automl-experiment.jpeg" alt-text="{alt-text}":::

Click on Models option. 

:::image type="content" source="media/how-to-deploy-automl-endpoint/model-option.png" alt-text="{alt-text}":::


Select the model you want to deploy to online endpoint. Once you select a model, the Deploy button will light up with a drop-down menu. 

:::image type="content" source="media/how-to-deploy-automl-endpoint/deploy-button.png" alt-text="{alt-text}":::


Select Deploy to real-time endpoint option. 

Model and Environment will be automatically populated. 

:::image type="content" source="media/how-to-deploy-automl-endpoint/model.png" alt-text="{alt-text}":::

:::image type="content" source="media/how-to-deploy-automl-endpoint/environment.png" alt-text="{alt-text}":::


Complete the wizard to deploy model to endpoint successfully. 

 :::image type="content" source="media/how-to-deploy-automl-endpoint/complete-wizard.jpeg" alt-text="{alt-text}":::

 

2. Deploy from Models page 

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

 