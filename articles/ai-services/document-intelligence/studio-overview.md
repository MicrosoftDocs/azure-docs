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
ms.date: 07/09/2024
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---


<!-- markdownlint-disable MD033 -->
# What is Document Intelligence Studio?

[!INCLUDE [applies to v4.0 v3.1 v3.0](includes/applies-to-v40-v31-v30.md)]

> [!IMPORTANT]
>
> * There are separate URLs for Document Intelligence Studio sovereign cloud regions.
> * Azure for US Government: [Document Intelligence Studio (Azure Fairfax cloud)](https://formrecognizer.appliedai.azure.us/studio)
> * Microsoft Azure operated by 21Vianet: [Document Intelligence Studio (Azure in China)](https://formrecognizer.appliedai.azure.cn/studio)

[Document Intelligence Studio](https://documentintelligence.ai.azure.com/studio/) is an online tool to visually explore, understand, train, and integrate features from the Document Intelligence service into your applications. The studio provides a platform for you to experiment with the different Document Intelligence models and sample returned data in an interactive manner without the need to write code. Use the Document Intelligence Studio to:

* Learn more about the different capabilities in Document Intelligence.
* Use your Document Intelligence resource to test models on sample documents or upload your own documents.
* Experiment with different add-on and preview features to adapt the output to your needs.
* Train custom classification models to classify documents.
* Train custom extraction models to extract fields from documents.
* Get sample code for the language specific `SDKs` to integrate into your applications.

The studio supports Document Intelligence v3.0 and later API versions for model analysis and custom model training. Previously trained v2.1 models with labeled data are supported, but not v2.1 model training. Refer to the [REST API migration guide](v3-1-migration-guide.md) for detailed information about migrating from v2.1 to v3.0.

Use the [Document Intelligence Studio quickstart](quickstarts/try-document-intelligence-studio.md) to get started analyzing documents with document analysis or prebuilt models. Build custom models and reference the models in your applications using one of the [language specific `SDKs`](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true). To use Document Intelligence Studio, you need to acquire the following assets from the Azure portal:

* **An Azure subscription** - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* **An Azure AI services or Document Intelligence resource**. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAIServices) resource, in the Azure portal to get your key and endpoint. Use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Authorization policies

Your organization can opt to disable local authentication and enforce Microsoft Entra (formerly Azure Active Directory) authentication for Azure AI Document Intelligence resources and Azure blob storage.

* Using Microsoft Entra authentication requires that key based authorization is disabled. After key access is disabled, Microsoft Entra ID is the only available authorization method.

* Microsoft Entra allows granting minimum privileges and granular control for Azure resources.

* For more information, *see* the following guidance:

  * [Disable local authentication for Azure AI Services](../disable-local-auth.md).
  * [Prevent Shared Key authorization for an Azure Storage account](../../storage/common/shared-key-authorization-prevent.md)

* **Designating role assignments**. Document Intelligence Studio basic access requires the [`Cognitive Services User`](../../role-based-access-control/built-in-roles/ai-machine-learning.md#cognitive-services-user) role. For more information, *see* [Document Intelligence role assignments](quickstarts/try-document-intelligence-studio.md#azure-role-assignments).

> [!IMPORTANT]
>
> * Make sure you have the **Cognitive Services User role**, and not the Cognitive Services Contributor role when setting up Entra authentication. 
> * In Azure context, Contributor role can only perform actions to control and manage the resource itself, including listing the access keys. 
> * User accounts with a Contributor are only able to access the Document Intelligence service by calling with access keys. However, when setting up access with Entra ID, key-access will be disabled and **Cognitive Service User** role will be required for an account to use the resources.

## Document Intelligence model support

Use the help wizard, labeling interface, training step, and interactive visualizations to understand how each feature works.

* **Read**: Try out Document Intelligence's [Studio Read feature](https://documentintelligence.ai.azure.com/studio/read) with sample documents or your own documents and extract text lines, words, detected languages, and handwritten style if detected. To learn more, *see* [Read overview](concept-read.md).

* **Layout**: Try out Document Intelligence's [Studio Layout feature](https://documentintelligence.ai.azure.com/studio/layout) with sample documents or your own documents and extract text, tables, selection marks, and structure information. To learn more, *see* [Layout overview](concept-layout.md). 

* **Prebuilt models**: Document Intelligence's prebuilt models enable you to add intelligent document processing to your apps and flows without having to train and build your own models. As an example, start with the [Studio Invoice feature](https://documentintelligence.ai.azure.com/studio/prebuilt?formType=invoice). To learn more, *see* [Models overview](concept-model-overview.md).

* **Custom extraction models**: Document Intelligence's [Studio Custom models feature](https://documentintelligence.ai.azure.com/studio/custommodel/projects) enables you to extract fields and values from models trained with your data, tailored to your forms and documents. To extract data from multiple form types, create standalone custom models or combine two, or more, custom models and create a composed model. Test the custom model with your sample documents and iterate to improve the model. To learn more, *see* the [Custom models overview](concept-custom.md).

* **Custom classification models**: Document classification is a new scenario supported by Document Intelligence. The document classifier API supports classification and splitting scenarios. Train a classification model to identify the different types of documents your application supports. The input file for the classification model can contain multiple documents and classifies each document within an associated page range. To learn more, *see* [custom classification models](concept-custom-classifier.md).

* **Add-on Capabilities**: Document Intelligence supports more sophisticated analysis capabilities. These optional capabilities can be enabled and disabled in the studio using the `Analyze Options` button in each model page. There are four add-on capabilities available: `highResolution`, `formula`, `font`, and `barcode extraction` capabilities. To learn more, *see* [Add-on capabilities](concept-add-on-capabilities.md).

## Try a Document Intelligence model

* Once your resource is configured, you can try the different models offered by Document Intelligence Studio. From the front page, select any Document Intelligence model to try using with a no-code approach.

* To test any of the document analysis or prebuilt models, select the model and use one of the sample documents or upload your own document to analyze. The analysis result is displayed at the right in the content-result-code window.

* Custom models need to be trained on your documents. See [custom models overview](concept-custom.md) for an overview of custom models.

* After validating the scenario in the Document Intelligence Studio, use the [**C#**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**Java**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [**Python**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) client libraries or the [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) to get started incorporating Document Intelligence models into your own applications.

To learn more about each model, *see* our concept pages.

### View resource details

 To view resource details such as name and pricing tier, select the **Settings** icon in the top-right corner of the Document Intelligence Studio home page and select the **Resource** tab. If you have access to other resources, you can switch resources as well.

:::image type="content" source="media/studio/form-recognizer-studio-resource-page.png" alt-text="Screenshot of the studio settings page resource tab.":::

With Document Intelligence, you can quickly automate your data processing in applications and workflows, easily enhance data-driven strategies, and skillfully enrich document search capabilities.

## Analyze options

* Document Intelligence supports sophisticated analysis capabilities. The Studio allows one entry point (Analyze options button) for configuring the add-on capabilities with ease.
* Depending on the document extraction scenario, configure the analysis range, document page range, optional detection, and premium detection features.

    :::image type="content" source="media/studio/analyze-options.png" alt-text="Screenshot of the analyze-options dialog window.":::

    > [!NOTE]
    > Font extraction is not visualized in Document Intelligence Studio. However, you can check the styles section of the JSON output for the font detection results.

### Auto label documents with prebuilt models or one of your own models

* In custom extraction model labeling page, you can now auto label your documents using one of Document Intelligent Service prebuilt models or your trained models.

    :::image type="content" source="media/studio/auto-label.gif" alt-text="Animated screenshot showing auto labeling in Studio.":::

* For some documents, duplicate labels after running autolabel are possible. Make sure to modify the labels so that there are no duplicate labels in the labeling page afterwards.

    :::image type="content" source="media/studio/duplicate-labels.png" alt-text="Screenshot showing duplicate label warning after auto labeling.":::

### Auto label tables

* In custom extraction model labeling page, you can now auto label the tables in the document without having to label the tables manually.

    :::image type="content" source="media/studio/auto-table-label.gif" alt-text="Animated screenshot showing auto table labeling in Studio.":::

### Add test files directly to your training dataset

* Once you train a custom extraction model, make use of the test page to improve your model quality by uploading test documents to training dataset if needed.

* If a low confidence score is returned for some labels, make sure to correctly label your content. If not, add them to the training dataset and relabel to improve the model quality.

    :::image type="content" source="media/studio/add-from-test.gif" alt-text="Animated screenshot showing how to add test files to training dataset.":::

### Make use of the document list options and filters in custom projects

* Use the custom extraction model labeling page to navigate through your training documents with ease by making use of the search, filter, and sort by feature.

* Utilize the grid view to preview documents or use the list view to scroll through the documents more easily.

    :::image type="content" source="media/studio/document-options.png" alt-text="Screenshot of document list view options and filters.":::

### Project sharing

Share custom extraction projects with ease. For more information, see [Project sharing with custom models](how-to-guides/project-share-custom-models.md).

## Troubleshooting

|Scenario     |Cause| Resolution|
|-------------|------|----------|
|You receive the error message</br> `Form Recognizer Not Found` when opening a custom project.|Your Document Intelligence resource, bound to the custom project was deleted or moved to another resource group.| There are two ways to resolve this problem: </br>&bullet; Re-create the Document Intelligence resource under the same subscription and resource group with the same name.</br>&bullet; Re-create a custom project with the migrated Document Intelligence resource and specify the same storage account.|
|You receive the error message</br> `PermissionDenied` when using prebuilt apps or opening a custom project.|The principal doesn't have access to API/Operation" when analyzing against prebuilt models or opening a custom project. It's likely the local (key-based) authentication is disabled for your Document Intelligence resource don't have enough permission to access the resource.|Reference [Azure role assignments](quickstarts/try-document-intelligence-studio.md#azure-role-assignments) to configure your access roles.|
|You receive the error message</br> `AuthorizationPermissionMismatch` when opening a custom project.|The request isn't authorized to perform the operation using the designated permission. It's likely the local (key-based) authentication is disabled for your storage account and you don't have the granted permission to access the blob data.|Reference [Azure role assignments](quickstarts/try-document-intelligence-studio.md#azure-role-assignments) to configure your access roles.|
|You can't sign in to Document Intelligence Studio and receive the error message</br> `InteractionRequiredAuthError:login_required:AADSTS50058:A silent sign-request was sent but no user is signed in`|It's likely that your browser is blocking third-party cookies so you can't successfully sign in.|To resolve, see [Manage third-party settings](#manage-third-party-settings-for-studio-access) for your browser.|

### Manage third-party settings for Studio access

**Edge**:

* Go to **Settings** for Edge
* Search for "**third*party**"
* Go to **Manage and delete cookies and site data**
* Turn off the setting of **Block third*party cookies**

**Chrome**:

* Go to **Settings** for Chrome
* Search for "**Third*party**"
* Under **Default behavior**, select **Allow third*party cookies**

**Firefox**:

* Go to **Settings** for Firefox
* Search for "**cookies**"
* Under **Enhanced Tracking Protection**, select **Manage Exceptions**
* Add exception for **https://documentintelligence.ai.azure.com** or the Document Intelligence Studio URL of your environment

**Safari**:

* Choose **Safari** > **Preferences**
* Select **Privacy**
* Deselect **Block all cookies**

## Next steps

* Visit [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

* Get started with [Document Intelligence Studio quickstart](quickstarts/try-document-intelligence-studio.md).
