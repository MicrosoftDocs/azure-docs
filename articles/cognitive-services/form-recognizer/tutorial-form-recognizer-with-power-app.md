---
title: "Tutorial: Use Form Recognizer with Power App to analyze receipts - Form Recognizer API"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll use Form Recognizer with Power Apps to create a flow that automates the process of training a model and testing it using sample data.
services: cognitive-services
author: nitinme
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: tutorial
ms.date: 09/27/2019
ms.author: nitinme
---

# Tutorial: Use Form Recognizer with PowerApps to analyze receipts

In this tutorial, you'll create a Flow in PowerApps that use Form Recognizer from Azure Cognitive Services to recognize receipts. The sample data used in this tutorial is stored in Azure Storage blob containers.

Here's what this tutorial covers:

> [!div class="checklist"]
> * Get Azure subscription keys
> * Set up your development environment and install dependencies
> * Create a Flask app
> * Use the Translator Text API to translate text
> * Use Text Analytics to analyze positive/negative sentiment of input text and translations
> * Use Speech Services to convert translated text into synthesized speech
> * Run your Flask app locally

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* [Sign up](https://docs.microsoft.com/en-us/powerapps/maker/signup-for-powerapps) for PowerApps.

## Create an Azure Storage blob container

You use this container to upload sample data that is required to train the model.

1. Follow these [instructions](../../storage/common/storage-quickstart-create-account.md) to create an Azure Storage account. Give it the name **formrecostorage**.
1. Follow these [instructions](../../storage/blobs/storage-quickstart-blobs-portal.md) to create an Azure blob container within the Azure Storage account. Give it the name **formrecocontainer**. Make sure you set the public access level to **Container (anonymous read access for containers and blobs)**.

    > [!div class="mx-imgBorder"]
    > ![Create blob container](media/tutorial-form-recognizer-with-power-app/create-blob-container.png)

## Upload sample data to the Azure blob container

Download the sample data that we use in this tutorial from [Github](https://go.microsoft.com/fwlink/?linkid=2090451). Upload this sample data to the **formrecocontainer** at. Follow the instructions at [Upload a block blob](../../storage/blobs/storage-quickstart-blobs-portal.md#upload-a-block-blob) on how to upload data to a container.

## Request access for Form Recognizer

Form Recognizer is available in a limited-access preview. To get access to the preview, fill out and submit the [Form Recognizer access request](https://aka.ms/FormRecognizerRequestAccess) form. Once your request is approved by the Azure Cognitive Services team, you'll receive an email with instructions for accessing the service.

## Create a Form Recognizer resource

[!INCLUDE [create resource](./includes/create-resource.md)]

## Create a Flow in PowerApps

You can use Microsoft Flow to create logic that performs one or more tasks when an event occurs. In this tutorial, you create a flow that is triggered by uploading a reciept that you want to analyze.

1. Sing in to [PowerApps](http://www.web.powerapps.com).
1. From the left pane, select **Flows**.
    > [!div class="mx-imgBorder"]
    > ![Create blob container](media/tutorial-form-recognizer-with-power-app/create-powerapp-flow.png)
1. On the next page, select **New**, and then select, **Instant-from Blank**.
    > [!div class="mx-imgBorder"]
    > ![Create a blank Flow](media/tutorial-form-recognizer-with-power-app/create-flow-from-blank.png)
1. On the next page, enter a name for your Flow application. From **Choose how to trigger this flow**, select **Manually trigger a flow**, and then select **Create**. 
    > [!div class="mx-imgBorder"]
    > ![Enter Flow name](media/tutorial-form-recognizer-with-power-app/provide-flow-name.png)
1. On the next page, click **New step**, and under **Choose an action**, select **Form Recognizer**. Under the actions that are available for Form Recognizer, select **Train Model**.
    ![Train a Form Recognizer Model](media/tutorial-form-recognizer-with-power-app/add-form-recognizer-flow.png)

## Integrate Form Recognizer in Flow 

## Test your Flow

## Next steps

* TBD
* TBD
* TBD
