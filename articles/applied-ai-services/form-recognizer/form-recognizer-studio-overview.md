---
title: What is Form Recognizer Studio?
titleSuffix: Azure Applied AI Services
description: Learn how to set up and use Form Recognizer Studio to test features of Azure Form Recognizer on the web.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 10/20/2022
ms.author: lajanuar
monikerRange: 'form-recog-3.0.0'
recommendations: false
---

<!-- markdownlint-disable MD033 -->
# What is Form Recognizer Studio?

**This article applies to:** ![Form Recognizer v3.0 checkmark](media/yes-icon.png) **Form Recognizer v3.0**.

Form Recognizer Studio is an online tool to visually explore, understand, train, and integrate features from the Form Recognizer service into your applications. The studio provides a platform for you to experiment with the different Form Recognizer models and sample their returned data in an interactive manner without the need to write code.

The studio supports Form Recognizer v3.0 models and v3.0 model training. Previously trained v2.1 models with labeled data are supported, but not v2.1 model training. Refer to the [REST API migration guide](v3-migration-guide.md) for detailed information about migrating from v2.1 to v3.0.

## Get started using Form Recognizer Studio

1. To use Form Recognizer Studio, you'll need the following assets:

    * **Azure subscription** - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

    * **Cognitive Services or Form Recognizer resource**. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource, in the Azure portal to get your key and endpoint. Use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    >
    > * Create a Cognitive Services (multi-service) resource if you plan to access multiple cognitive services under a single endpoint and key.
    > * Create a single-service resource for Form Recognizer access only. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../active-directory/authentication/overview-authentication.md).

1. Navigate to the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/). If it's your first time logging in, a popup window will appear prompting you to configure your service resource. You have two options:

   **a. Access by Resource**.

      * Choose your existing subscription.
      * Select an existing resource group within your subscription or create a new one.
      * Select your existing Form Recognizer or Cognitive services resource.

      :::image type="content" source="media/studio/welcome-to-studio.png" alt-text="Screenshot of the configure service resource window.":::

    **b. Access by API endpoint and key**.

      * Retrieve your endpoint and key from the Azure portal.
      * Go to the overview page for your resource and select **Keys and Endpoint** from the left navigation bar.
      * Enter the values in the appropriate fields.

      :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

1. Once you've completed configuring your resource, you'll be able to try the different models offered by Form Recognizer Studio. From the front page, select any Form Recognizer model to try using with a no-code approach.

    :::image type="content" source="media/studio/form-recognizer-studio-front.png" alt-text="Screenshot of Form Recognizer Studio front page.":::

1. After you've tried Form Recognizer Studio, use the [**C#**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true), [**Java**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true), [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) or [**Python**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) client libraries or the [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) to get started incorporating Form Recognizer models into your own applications.

   To learn more about each model, *see* concepts pages.

   | Model type| Models |
   |-----|-----|
   |Document analysis models| <ul><li>[**Read model**](concept-read.md)</li><li>[**Layout model**](concept-layout.md)</li><li>[**General document model**](concept-general-document.md)</li></ul>.</br></br>
   |**Prebuilt models**|<ul><li>[**W-2 form model**](concept-w2.md)</li><li>[**Invoice model**](concept-invoice.md)</li><li>[**Receipt model**](concept-receipt.md)</li><li>[**ID document model**](concept-id-document.md)</li><li>[**Business card model**](concept-business-card.md)</li></ul>
   |Custom models|<ul><li>[**Custom model**](concept-custom.md)</li><ul><li>[**Template model**](concept-custom-template.md)</li><li>[**Neural model**](concept-custom-template.md)</li></ul><li>[**Composed model**](concept-model-overview.md)</li></ul>

### Manage your resource

 To view resource details such as name and pricing tier, select the **Settings** icon in the top-right corner of the Form Recognizer Studio home page and select the **Resource** tab. If you have access to other resources, you can switch resources as well.

:::image type="content" source="media/studio/form-recognizer-studio-resource-page.png" alt-text="Screenshot of the studio settings page resource tab.":::

With Form Recognizer, you can quickly automate your data processing in applications and workflows, easily enhance data-driven strategies, and skillfully enrich document search capabilities.

## Next steps

* Visit [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio) to begin using the models presented by the service.

* For more information on Form Recognizer capabilities, see [Azure Form Recognizer overview](overview.md).
