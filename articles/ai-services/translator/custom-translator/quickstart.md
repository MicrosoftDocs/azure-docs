---
title: "Quickstart: Build, deploy, and use a custom model - Custom Translator"
titleSuffix: Azure AI services
description: A step-by-step guide to building a translation system using the Custom Translator portal v2.
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.date: 07/05/2023
ms.author: lajanuar
ms.topic: quickstart
---
# Quickstart: Build, publish, and translate with custom models

Translator is a cloud-based neural machine translation service that is part of the Azure AI services family of REST API that can be used with any operating system.  Translator powers many Microsoft products and services used by thousands of businesses worldwide to perform language translation and other language-related operations. In this quickstart, learn to build custom solutions for your applications across all [supported languages](../language-support.md).

## Prerequisites

 To use the [Custom Translator](https://portal.customtranslator.azure.ai/) portal, you need the following resources:

* A [Microsoft account](https://signup.live.com).

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have an Azure subscription, [create a Translator resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
  * You need the key and endpoint from the resource to connect your application to the Translator service. Paste your key and endpoint into the code later in the quickstart. You can find these values on the Azure portal **Keys and Endpoint** page:

    :::image type="content" source="../media/keys-and-endpoint-portal.png" alt-text="Screenshot: Azure portal keys and endpoint page.":::

For more information, *see* [how to create a Translator resource](../create-translator-resource.md).

## Custom Translator portal

Once you have the above prerequisites, sign in to the [Custom Translator](https://portal.customtranslator.azure.ai/) portal to create workspaces, build projects, upload files, train models, and publish your custom solution.

You can read an overview of translation and custom translation, learn some tips, and watch a getting started video in the [Azure AI technical blog](https://techcommunity.microsoft.com/t5/azure-ai/customize-a-translation-to-make-sense-in-a-specific-context/ba-p/2811956).

## Process summary

1. [**Create a workspace**](#create-a-workspace). A workspace is a work area for composing and building your custom translation system. A workspace can contain multiple projects, models, and documents. All the work you do in Custom Translator is done inside a specific workspace.

1. [**Create a project**](#create-a-project). A project is a wrapper for models, documents, and tests. Each project includes all documents that are uploaded into that workspace with the correct language pair. For example, if you have both an English-to-Spanish project and a Spanish-to-English project, the same documents are included in both projects.

1. [**Upload parallel documents**](#upload-documents). Parallel documents are pairs of documents where one (target) is the translation of the other (source). One document in the pair contains sentences in the source language and the other document contains sentences translated into the target language. It doesn't matter which language is marked as "source" and which language is marked as "target"—a parallel document can be used to train a translation system in either direction.

1. [**Train your model**](#train-your-model). A model is the system that provides translation for a specific language pair. The outcome of a successful training is a model. When you train a model, three mutually exclusive document types are required: training, tuning, and testing. If only training data is provided when queuing a training, Custom Translator automatically assembles tuning and testing data. It uses a random subset of sentences from your training documents, and excludes these sentences from the training data itself. A 10,000 parallel sentence is the minimum requirement to train a model.

1. [**Test (human evaluate) your model**](#test-your-model). The testing set is used to compute the [BLEU](beginners-guide.md#what-is-a-bleu-score) score. This score indicates the quality of your translation system.

1. [**Publish (deploy) your trained model**](#publish-your-model). Your custom model is made available for runtime translation requests.

1. [**Translate text**](#translate-text). Use the cloud-based, secure, high performance, highly scalable Microsoft Translator [Text API V3](../reference/v3-0-translate.md?tabs=curl) to make translation requests.

## Create a workspace

1. After your sign-in to Custom Translator, you'll be asked for permission to read your profile from the Microsoft identity platform to request your user access token and refresh token. Both tokens are needed for authentication and to ensure that you aren't signed out during your live session or while training your models. </br>Select **Yes**.

   :::image type="content" source="media/quickstart/first-time-user.png" alt-text="Screenshot illustrating how to create a workspace.":::

1. Select **My workspaces**.

1. Select **Create a new workspace**.

1. Type _Contoso MT models_ for **Workspace name** and select **Next**.

1. Select "Global" for **Select resource region** from the dropdown list.

1. Copy/paste your Translator Services key.

1. Select **Next**.

1. Select **Done**.

   >[!Note]
   > Region must match the region that was selected during the resource creation. You can use **KEY 1** or **KEY 2.**

   :::image type="content" source="media/quickstart/resource-key.png" alt-text="Screenshot illustrating the resource key.":::

   :::image type="content" source="media/quickstart/create-workspace-1.png" alt-text="Screenshot illustrating workspace creation.":::

## Create a project

Once the workspace is created successfully, you're taken to the **Projects** page.

You create English-to-German project to train a custom model with only a [training](concepts/model-training.md#training-document-type-for-custom-translator) document type.

1. Select **Create project**.

1. Type *English-to-German* for **Project name**.

1. Select *English (en)* as **Source language** from the dropdown list.

1. Select *German (de)* as **Target language** from the dropdown list.

1. Select *General* for **Domain** from the dropdown list.

1. Select **Create project**.

   :::image type="content" source="media/quickstart/create-project.png" alt-text="Screenshot illustrating how to create a project.":::

## Upload documents

In order to create a custom model, you need to upload all or a combination of [training](concepts/model-training.md#training-document-type-for-custom-translator), [tuning](concepts/model-training.md#tuning-document-type-for-custom-translator), [testing](concepts/model-training.md#testing-dataset-for-custom-translator), and [dictionary](concepts/dictionaries.md) document types.

In this quickstart, you'll upload [training](concepts/model-training.md#training-document-type-for-custom-translator) documents for customization.

>[!Note]
> You can use our sample training, phrase and sentence dictionaries dataset, [Customer sample English-to-German datasets](https://github.com/MicrosoftTranslator/CustomTranslatorSampleDatasets), for this quickstart. However, for production, it's better to upload your own training dataset.

1. Select *English-to-German* project name.

1. Select **Manage documents** from the left navigation menu.

1. Select **Add document set**.

1. Check the  **Training set** box and select **Next**.

1. Keep **Parallel documents** checked and type *sample-English-German*.

1. Under the **Source (English - EN) file**, select **Browse files** and select *sample-English-German-Training-en.txt*.

1. Under **Target (German - EN) file**, select **Browse files** and select *sample-English-German-Training-de.txt*.

1. Select **Upload**

    >[!Note]
    >You can upload the sample phrase and sentence dictionaries dataset. This step is left for you to complete.

   :::image type="content" source="media/quickstart/upload-model.png" alt-text="Screenshot illustrating how to upload documents.":::

## Train your model

Now you're ready to train your English-to-German model.

1. Select **Train model** from the left navigation menu.

1. Type *en-de with sample data* for **Model name**.

1. Keep **Full training** checked.

1. Under **Select documents**, check *sample-English-German* and review the training cost associated with the selected number of sentences.

1. Select **Train now**.

1. Select **Train** to confirm.

    >[!Note]
    >**Notifications** displays model training in progress, e.g., **Submitting data** state. Training model takes few hours, subject to the number of selected sentences.

    :::image type="content" source="media/quickstart/train-model.png" alt-text="Screenshot illustrating how to create a model.":::

1. After successful model training, select **Model details** from the left navigation menu.

1. Select the model name *en-de with sample data*. Review training date/time, total training time, number of sentences used for training, tuning, testing, and dictionary. Check whether the system generated the test and tuning sets. You use the `Category ID` to make translation requests.

1. Evaluate the model [BLEU](beginners-guide.md#what-is-a-bleu-score) score. The test set **BLEU score** is the custom model score and **Baseline BLEU** is the pretrained baseline model used for customization. A higher **BLEU score** means higher translation quality using the custom model.

    >[!Note]
    >If you train with our shared customer sample datasets, BLEU score will be different than the image.

    :::image type="content" source="media/quickstart/model-details.png" alt-text="Screenshot illustrating model details.":::

## Test your model

Once your training has completed successfully, inspect the test set translated sentences.

1. Select **Test model** from the left navigation menu.
2. Select "en-de with sample data"
3. Human evaluate translation from **New model** (custom model), and **Baseline model** (our pretrained baseline used for customization) against **Reference** (target translation from the test set)

## Publish your model

Publishing your model makes it available for use with the Translator API. A project might have one or many successfully trained models. You can only publish one model per project; however, you can publish a model to one or multiple regions depending on your needs. For more information, see [Translator pricing](https://azure.microsoft.com/pricing/details/cognitive-services/translator/#pricing).

1. Select **Publish model** from the left navigation menu.

1. Select *en-de with sample data* and select **Publish**.

1. Check the desired region(s).

1. Select **Publish**. The status should transition from _Deploying_ to _Deployed_.

   :::image type="content" source="media/quickstart/publish-model.png" alt-text="Screenshot illustrating how to deploy a trained model.":::

## Translate text

1. Developers should use the `Category ID` when making translation requests with Microsoft Translator [Text API V3](../reference/v3-0-translate.md?tabs=curl). More information about the Translator Text API can be found on the [API Reference](../reference/v3-0-reference.md) webpage.

1. Business users may want to download and install our free [DocumentTranslator app for Windows](https://github.com/MicrosoftTranslator/DocumentTranslation/releases).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to manage workspaces](how-to/create-manage-workspace.md)
