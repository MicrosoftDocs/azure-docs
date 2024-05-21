---
title: Moderate text and images with content safety in Azure AI Studio
titleSuffix: Azure OpenAI
description: Use this article to moderate text and images with content safety in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: quickstart
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: pafarley
author: PatrickFarley
---

# QuickStart: Moderate text and images with content safety in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this quickstart, you use the [Azure AI Content Safety](/azure/ai-services/content-safety/overview) service in Azure AI Studio to moderate text and images. Content Safety detects harmful user-generated and AI-generated content in applications and services. 

> [!CAUTION]
> Some of the sample content provided by Azure AI Studio might be offensive. Sample images are blurred by default. User discretion is advised.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region, and supported pricing tier. Then select **Create**.
* An [AI Studio hub](../how-to/create-azure-ai-resource.md) in Azure AI Studio. 

## Setting up

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select the hub you'd like to work in.
1. On the left nav menu, select **AI Services**. Select the **Content Safety** panel.
    :::image type="content" source="../media/content-safety/select-panel.png" alt-text="Screenshot of the Azure AI Studio Content Safety panel selected." lightbox="../media/content-safety/select-panel.png":::

## Moderate text or images

Select one of the following tabs to get started with Content Safety in Azure AI Studio.

# [Moderate text content](#tab/moderate-text-content)

Azure AI Studio provides a capability for you to quickly try out text moderation. The *moderate text content* feature takes into account various factors such as the type of content, the platform's policies, and the potential effect on users. Run moderation tests on sample content. Then configure the filters to further fine-tune the test results. You can also use a blocklist to add specific terms that you want detect and act on.

1. Select the **Moderate text content** panel on the **Content Safety** page in Azure AI Studio.
1. Select your AI Services resource or Content Safety resource name from the dropdown menu.
1. You can either choose a pre-written text sample, or write your own sample text in the input field.
    <!--:::image type="content" source="../media/quickstarts/content-safety-text.png" alt-text="Screenshot of the moderate image content page." lightbox="../media/quickstarts/content-safety-text.png":::-->
1. Optionally, configure the content filters in the **Configure filters** tab. Use the sliders to determine which severity level in each category should be rejected by the model. The service still returns all the harm categories that were detected, along with the severity level for each (0-Safe, 2-Low, 4-Medium, 6-High), but the **Allowed**/**Blocked** result depends on how you configure the filter.
1. Optionally, set up a blocklist with the **Use blocklist** tab. You can choose a blocklist you've already created or create a new one here. Use the **Edit** button to add and remove terms. You can stack multiple blocklists in the same filter.
1. When your filters are ready, select **Run test**.

# [Moderate image content](#tab/moderate-image-content)

Azure AI Studio provides a capability for you to quickly try out image moderation. The *moderate image content* feature takes into account various factors such as the type of content, the platform's policies, and the potential effect on users. Run moderation tests on sample content. Configure the filters to further fine-tune the test results. 

1. Select the **Moderate image content** panel on the **Content Safety** page in Azure AI Studio.
1. Select your AI Services resource or Content Safety resource name from the dropdown menu.
1. You can either use a sample image or upload your own. The maximum size for image submissions is 4 MB, and image dimensions must be between 50 x 50 pixels and 2,048 x 2,048 pixels. Images can be in JPEG, PNG, GIF, BMP, TIFF, or WEBP formats. You have the option to blur the images you use.
    <!--:::image type="content" source="../media/quickstarts/content-safety-image.png" alt-text="Screenshot of the moderate image content page." lightbox="../media/quickstarts/content-safety-image.png":::-->
1. Optionally, configure the content filters in the **Configure filters** tab. Use the sliders to determine which severity level in each category should be rejected by the model. The service still returns all the harm categories that were detected, along with the severity level for each (0-Safe, 2-Low, 4-Medium, 6-High), but the **Allowed**/**Blocked** result depends on how you configure the filter.
1. When your filters are ready, select **Run test**.

---

## View and export code

You can use the **View code** button at the top of the page in both the *moderate text content* and *moderate image content* scenarios to view and copy the sample code, which includes your configuration for severity filtering, blocklists, and moderation functions. You can then deploy the code in your own app.


## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this quickstart if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true).

## Next steps

- [Create a project in Azure AI Studio](../how-to/create-projects.md)
- [Learn more about content filtering in Azure AI Studio](../concepts/content-filtering.md)
