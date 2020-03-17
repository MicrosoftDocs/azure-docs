---
title: How to deploy the Form Recognizer sample labeling tool
titleSuffix: Azure Cognitive Services
description: Learn the different ways you can deploy the Form Recognizer sample labeling tool to help with supervised learning.
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 02/28/2020
ms.author: pafarley
---

# Deploy the sample labeling tool

The Form Recognizer sample labeling tool is an application that runs in a Docker container. It provides a helpful UI that you can use to manually label form documents for the purpose of supervised learning. The [Train with labels](./quickstarts/label-tool.md) quickstart shows you how to run the tool on your local computer, which is the most common scenario. 

This guide will explain alternate ways you can deploy and run the sample labeling tool. 

## Deploy with Azure Container Instances

You can run the label tool in a Docker web app container. First, [create a new Web App resource](https://ms.portal.azure.com/#create/Microsoft.WebSite) on the Azure portal. Fill in the form with your subscription and resource group details. Enter the following information in the required fields:
* **Publish**: Docker Container
* **Operating** System: Linux

On the next page, fill in the following fields for the Docker container setup:

* **Options**: Single Container
* **Image Source**: Azure Container Registry
* **Access Type**: public
* **Image and tag**: mcr.microsoft.com/azure-cognitive-services/custom-form/labeltool:latest

The steps that follow are optional. Once your app has finished deploying, you can run it and access the label tool online.

### Connect to Azure AD for authorization

We recommend to connect your web app to Azure Active Director (AAD) so that only someone with your credentials can sign in and use the app. Follow the instructions in [Configure your App Service app](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad) to connect to AAD.

## Next steps

Return to the [Train with labels](./quickstarts/label-tool.md) quickstart to learn how to use the tool to manually label training data and do supervised learning.
