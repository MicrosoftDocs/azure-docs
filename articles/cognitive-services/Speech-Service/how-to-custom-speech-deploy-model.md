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

In this article, you'll learn how to deploy an endpoint for a Custom Speech model. A custom endpoint that you deploy is required to use a Custom Speech model. 

> [!NOTE]
> You can deploy an endpoint to use a base model without training or testing. For example, you might want to quickly create a custom endpoint to start testing your application. The endpoint can be [updated](#change-model-and-redeploy-endpoint) later to use a trained and tested model. 

## Add a deployment endpoint

To create a custom endpoint, follow these steps:

1. Sign in to the [Speech Studio](https://speech.microsoft.com/customspeech). 
1. Select **Custom Speech** > Your project name > **Deploy models**.

   If this is your first endpoint, you'll notice that there are no endpoints listed in the table. After you create an endpoint, you use this page to track each deployed endpoint.

1. Select **Deploy model** to start the new endpoint wizard.

1. On the **New endpoint** page, enter a name and description for your custom endpoint. 

1. Select the custom model that you want to associate with the endpoint. 

1. Optionally, you can check the box to enable audio and diagnostic [logging](#view-logging-data) of the endpoint's traffic.

    :::image type="content" source="./media/custom-speech/custom-speech-deploy-model.png" alt-text="Screenshot of the New endpoint page that shows the checkbox to enable logging.":::

1. Select **Add** to save and deploy the endpoint. 
    
    > [!NOTE]
    > Endpoints used by `F0` Speech resources are deleted after seven days. 

On the main **Deploy models** page, details about the new endpoint are displayed in a table, such as name, description, status, and expiration date. It can take up to 30 minutes to instantiate a new endpoint that uses your custom models. When the status of the deployment changes to **Succeeded**, the endpoint is ready to use.

Note the model expiration date, and update the endpoint's model before that date to ensure uninterrupted service. For more information, see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md).

Select the endpoint link to view information specific to it, such as the endpoint key, endpoint URL, and sample code. 

## Change model and redeploy endpoint

An endpoint can be updated to use another model that was created by the same Speech resource. As previously mentioned, you must update the endpoint's model before the [model expires](./how-to-custom-speech-model-and-endpoint-lifecycle.md). 

To use a new model and redeploy the custom endpoint:

1. Sign in to the [Speech Studio](https://speech.microsoft.com/customspeech). 
1. Select **Custom Speech** > Your project name > **Deploy models**.
1. Select the link to an endpoint by name, and then select **Change model**.
1. Select the new model that you want the endpoint to use.
1. Select **Done** to save and redeploy the endpoint.

The redeployment takes several minutes to complete. In the meantime, your endpoint will use the previous model without interruption of service. 

## View logging data

Logging data is available for export if you configured it while creating the endpoint. 

To download the endpoint logs:

1. Sign in to the [Speech Studio](https://speech.microsoft.com/customspeech). 
1. Select **Custom Speech** > Your project name > **Deploy models**.
1. Select the link by endpoint name.
1. Under **Content logging**, select **Download log**.

Logging data is available on Microsoft-owned storage for 30 days, after which it will be removed. If your own storage account is linked to the Cognitive Services subscription, the logging data won't be automatically deleted.

## Next steps

- [CI/CD for Custom Speech](how-to-custom-speech-continuous-integration-continuous-deployment.md)
- [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md)
