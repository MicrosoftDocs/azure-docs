---
title: What is Document Intelligence (formerly Form Recognizer) Studio?
titleSuffix: Azure AI services
description: Learn how to set up and use Document Intelligence Studio to test features of Azure AI Document Intelligence on the web.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: overview
ms.date: 05/10/2024
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---


<!-- markdownlint-disable MD033 -->
# What is Document Intelligence Studio?

[!INCLUDE [applies to v4.0 v3.1 v3.0](includes/applies-to-v40-v31-v30.md)]

[Document Intelligence Studio](https://documentintelligence.ai.azure.com/studio/) is an online tool to visually explore, understand, train, and integrate features from the Document Intelligence service into your applications. The studio provides a platform for you to experiment with the different Document Intelligence models and sample returned data in an interactive manner without the need to write code. Use the Document Intelligence Studio to:

* Learn more about the different capabilities in Document Intelligence.
* Use your Document Intelligence resource to test models on sample documents or upload your own documents.
* Experiment with different add-on and preview features to adapt the output to your needs.
* Train custom classification models to classify documents.
* Train custom extraction models to extract fields from documents.
* Get sample code for the language specific `SDKs` to integrate into your applications.

The studio supports Document Intelligence v3.0 and later API versions for model analysis and custom model training. Previously trained v2.1 models with labeled data are supported, but not v2.1 model training. Refer to the [REST API migration guide](v3-1-migration-guide.md) for detailed information about migrating from v2.1 to v3.0.

## Get started

1. To use Document Intelligence Studio, you need the following assets:

    * **Azure subscription** - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

    * **Azure AI services or Document Intelligence resource**. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource, in the Azure portal to get your key and endpoint. Use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Authorization policies

Your organization can opt to disable local authentication and enforce Microsoft Entra (formerly Azure Active Directory) authentication for Azure AI Document Intelligence resources and Azure blob storage. 

* Using Microsoft Entra authentication requires that key based authorization is disabled. After key access is disabled, Microsoft Entra ID is the only available authorization method.

* Microsoft Entra allows granting minimum privileges and granular control for Azure resources.

* For more information *see* the following guidance:

  * [Disable local authentication for Azure AI Services](../disable-local-auth.md).
  * [Prevent Shared Key authorization for an Azure Storage account](../../storage/common/shared-key-authorization-prevent.md)

* **Designating role assignments**. Document Intelligence Studio basic access requires the [`Cognitive Services User`](../../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-user) role. For more information, *see* [Document Intelligence role assignments](quickstarts/try-document-intelligence-studio.md#azure-role-assignments) and [Document Intelligence Studio Permission](faq.yml#what-permissions-do-i-need-to-access-document-intelligence-studio-).

## Authentication

Navigate to the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/). If it's your first time logging in, a popup window appears prompting you to configure your service resource. In accordance with your organization's policy, you have one or two options:

* **Microsoft Entra authentication: access by Resource (recommended)**.

  * Choose your existing subscription.
  * Select an existing resource group within your subscription or create a new one.
  * Select your existing Document Intelligence or Azure AI services resource.

    :::image type="content" source="media/studio/configure-service-resource.png" alt-text="Screenshot of configure service resource form from the Document Intelligence Studio.":::

* **Local authentication: access by API endpoint and key**.

  * Retrieve your endpoint and key from the Azure portal.
  * Go to the overview page for your resource and select **Keys and Endpoint** from the left navigation bar.
  * Enter the values in the appropriate fields.

      :::image type="content" source="media/studio/keys-and-endpoint.png" alt-text="Screenshot of the keys and endpoint page in the Azure portal.":::

## Try a Document Intelligence model

1. Once your resource is configured, you can try the different models offered by Document Intelligence Studio. From the front page, select any Document Intelligence model to try using with a no-code approach.

1. To test any of the document analysis or prebuilt models, select the model and use one of the sample documents or upload your own document to analyze. The analysis result is displayed at the right in the content-result-code window.

1. Custom models need to be trained on your documents. See [custom models overview](concept-custom.md) for an overview of custom models.

1. After validating the scenario in the Document Intelligence Studio, use the [**C#**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**Java**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [**Python**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) client libraries or the [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) to get started incorporating Document Intelligence models into your own applications.

To learn more about each model, *see* our concept pages.

### View resource details

 To view resource details such as name and pricing tier, select the **Settings** icon in the top-right corner of the Document Intelligence Studio home page and select the **Resource** tab. If you have access to other resources, you can switch resources as well.

:::image type="content" source="media/studio/form-recognizer-studio-resource-page.png" alt-text="Screenshot of the studio settings page resource tab.":::

With Document Intelligence, you can quickly automate your data processing in applications and workflows, easily enhance data-driven strategies, and skillfully enrich document search capabilities.

## Next steps

* To begin using the models presented by the service, visit [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

* For more information on Document Intelligence capabilities, see [Azure AI Document Intelligence overview](overview.md).
