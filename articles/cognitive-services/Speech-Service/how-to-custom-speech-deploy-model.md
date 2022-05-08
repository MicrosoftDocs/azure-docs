---
title: Deploy a Custom Speech model - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to deploy Custom Speech models. 
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 05/08/2022
ms.author: eur
---

# Deploy a Custom Speech model

In this article, you'll learn how to deploy Custom Speech models. Training a speech-to-text model can improve recognition accuracy for the Microsoft baseline model. You use human-labeled transcriptions and related text to train a model. And you use these datasets, along with previously uploaded audio data, to refine and train the speech-to-text model.

## Add a deployment endpoint

After you upload and inspect data, evaluate accuracy, and train a custom model, you can deploy a custom endpoint to use with your apps, tools, and products. 

To create a custom endpoint:

1. Sign in to the [Speech Studio](https://speech.microsoft.com/customspeech). 

1. On the **Custom Speech** menu at the top of the page, select **Deployment**. 

   If this is your first run, you'll notice that there are no endpoints listed in the table. After you create an endpoint, you use this page to track each deployed endpoint.

1. Select **Add endpoint**, and then enter a **Name** and **Description** for your custom endpoint. 

1. Select the custom model that you want to associate with the endpoint. 

   You can also enable logging from this page. Logging allows you to monitor endpoint traffic. If logging is disabled, traffic won't be stored.

   ![Screenshot showing the selected `Log content from this endpoint` checkbox on the `New endpoint` page.](./media/custom-speech/custom-speech-deploy-model.png)


1. Select **Create**. 

   This action returns you to the **Deployment** page. The table now includes an entry that corresponds to your custom endpoint. The endpoint’s status shows its current state. It can take up to 30 minutes to instantiate a new endpoint that uses your custom models. When the status of the deployment changes to **Complete**, the endpoint is ready to use.

   After your endpoint is deployed, the endpoint name appears as a link. 

    > [!NOTE]
    > Endpoints used by `F0` Speech resources are deleted after seven days.

1. Select the endpoint link to view information specific to it, such as the endpoint key, endpoint URL, and sample code. 

   Note the model expiration date, and update the endpoint's model before that date to ensure uninterrupted service.

## View logging data

Logging data is available for export from the endpoint's page, under **Deployments**.

> [!NOTE]
> Logging data is available on Microsoft-owned storage for 30 days, after which it will be removed. If a customer-owned storage account is linked to the Cognitive Services subscription, the logging data won't be automatically deleted.

## Next steps

- [CI/CD for Custom Speech](how-to-custom-speech-continuous-integration-continuous-deployment.md)
- [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md)
