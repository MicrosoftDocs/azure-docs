---
title: What is Form Recognizer Studio?
titleSuffix: Azure Applied AI Services
description: Learn how to set up and use Form Recognizer Studio to test features of Azure Form Recognizer on the web.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 07/18/2022
ms.author: lajanuar
recommendations: false
---

# What is Form Recognizer Studio?

>[!NOTE]
> Form Recognizer Studio is currently in public preview. Some features may not be supported or have limited capabilities.

  [Form Recognizer Studio preview](https://formrecognizer.appliedai.azure.com/) is an online tool to visually explore, understand, and integrate features from the Form Recognizer service into your applications. Form Recognizer Studio provides a platform for you to quickly try several service models and sample their returned data in an interactive manner. You can use Studio to experiment with the different Form Recognizer models and without the need to write any code. After trying Form Recognizer in the Studio, you can use the available client libraries and REST APIs to get started adding models and incorporating features within your own applications.

## Get started using Form Recognizer Studio

1. To use Form Recognizer Studio, you'll need the following resources:

    * **Azure subscription** - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

    * **A Cognitive Services or Form Recognizer resource**. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource, in the Azure portal to get your key and endpoint.

    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../active-directory/authentication/overview-authentication.md).

1. Navigate to the Form Recognizer Studio. If it's your first time logging in, a popup window will appear prompting you to configure your service resource. You have two options:

    a. **Access by Resource**.
      * Choose your existing subscription.
      * Select an existing resource group within your subscription or create a new one.
      * Select your existing Form Recognizer or Cognitive services resource.

      :::image type="content" source="media/studio/welcome-to-studio.png" alt-text="Screenshot of the configure service resource window.":::

    b. **Access by API endpoint and key**.
        * You can retrieve your endpoint and key from the Azure portal. Go to the overview page for your resource and select **Keys and Endpoint** from the left navigation bar.

      :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

1. Once you have completed configuring your resource, you'll be able to try the different models offered by Form Recognizer Studio.

:::image type="content" source="media/studio/form-recognizer-studio-front.png" alt-text="Screenshot of Form Recognizer Studio front page.":::

1. From the front page, select any model offered by Form Recognizer to easily try using a no-code approach.  Each model is explained in depth in the concept article section:

<!-- markdownlint-disable MD036 -->

  **Document analysis models**

    * [**Read model**](concept-read.md).
    * [**Layout model**](concept-layout.md).
    * [**General document model**](concept-general-document.md) .

  **Prebuilt models**

    * [**W-2 form model**](concept-w2.md).
    * [**Invoice model**](concept-invoice.md).
    * [**Receipt model**](concept-receipt.md).
    * [**ID document model**](concept-id-document.md).
    * [**Business card model**](concept-business-card.md).

  **Custom models**

    * [**Custom model**](concept-custom.md).
    * [**Composed model**](concept-model-overview.md).

### View and manage your resource

 In Form Recognizer Studio, select the **Settings** icon in the top-right corner of the studio home page. Select the **Resource** tab to view resource details such as name and pricing tier. If you have access to other resources, you can switch resources as well.

:::image type="content" source="media/studio/form-recognizer-studio-resource-page.png" alt-text="Screenshot of the studio settings page resource tab.":::

## Next steps

* Go to Form Recognizer Studio to begin using the models offered by the service.
* For more information on models and their capabilities, see [Azure Form Recognizer overview](overview.md).
