---
title: How to deploy the Form Recognizer sample labeling tool
titleSuffix: Azure Cognitive Services
description: Learn the different ways you can deploy the Form Recognizer sample labeling tool to help with supervised learning.
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 03/20/2020
ms.author: pafarley
---

# Deploy the sample labeling tool

The Form Recognizer sample labeling tool is an application that provides a simple user interface (UI), which you can use to manually label forms (documents) for the purpose of supervised learning. In this article, we'll provide links and instructions that teach you how to:

* Run sample labeling tool locally
* Deploy the sample labeling tool to an Azure Container Instance (ACI)
* Use the open sourced OCR Form Labeling Tool

## Run the sample labeling tool locally

The fastest way to start labeling data is to run the sample labeling tool locally. The following quickstart uses the Form Recognizer REST API and the sample labeling tool to train a custom model with manually labeled data. 

* [Quickstart: Label forms, train a model, and analyze a form using the sample labeling tool](./quickstarts/label-tool.md).

## Deploy with Azure Container Instances

Before we get started, it's important to note that there are two ways to deploy the sample labeling tool to an Azure Container Instance (AC): 

* Using the Azure portal 
* Using the Azure CLI

### Azure portal

You can run the label tool in a Docker web app container. First, [create a new Web App resource](https://ms.portal.azure.com/#create/Microsoft.WebSite) on the Azure portal. Fill in the form with your subscription and resource group details. Enter the following information in the required fields:
* **Publish**: Docker Container
* **Operating** System: Linux

On the next page, fill in the following fields for the Docker container setup:

* **Options**: Single Container
* **Image Source**: Azure Container Registry
* **Access Type**: public
* **Image and tag**: mcr.microsoft.com/azure-cognitive-services/custom-form/labeltool:latest

The steps that follow are optional. Once your app has finished deploying, you can run it and access the label tool online.

### Azure CLI

```cli
DNS_NAME_LABEL=aci-demo-$RANDOM

az container create \
  --resource-group <resorunce_group_name> \
  --name <name> \
  --image mcr.microsoft.com/azure-cognitive-services/custom-form/labeltool \
  --ports 3000 \
  --dns-name-label $DNS_NAME_LABEL \
  --location <region name> \
  --cpu 2 \
  --memory 8
  --command-line "./run.sh eula=accept”
```

### Connect to Azure AD for authorization

We recommend to connect your web app to Azure Active Director (AAD) so that only someone with your credentials can sign in and use the app. Follow the instructions in [Configure your App Service app](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad) to connect to AAD.

## Open source on GitHub



## Next steps

Return to the [Train with labels](./quickstarts/label-tool.md) quickstart to learn how to use the tool to manually label training data and do supervised learning.
