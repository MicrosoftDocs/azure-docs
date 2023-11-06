---
title: Moderate text and images with content safety in Azure AI Studio
titleSuffix: Azure OpenAI
description: Use this article to moderate text and images with content safety in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: quickstart
ms.date: 10/1/2023
ms.author: eur
---

# QuickStart: Moderate text and images with content safety in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In this quickstart, get started with the [Azure AI Content Safety](/azure/ai-services/content-safety/overview) service in Azure AI Studio. Content Safety detects harmful user-generated and AI-generated content in applications and services. 

> [!CAUTION]
> Some of the sample content provided by Azure AI Studio may be offensive. Sample images are blurred by default. User discretion is advised.

## Prerequisites

* An active Azure account. If you don't have one, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).
* An Azure AI project

## Moderate text or images

Select one of the following tabs to get started with content safety in Azure AI Studio.

# [Moderate text content](#tab/moderate-text-content)

Azure AI Studio provides a capability for you to quickly try out text moderation. The *moderate text content* tool takes into account various factors such as the type of content, the platform's policies, and the potential effect on users. Run moderation tests on sample content. Use Configure filters to rerun and further fine tune the test results. Add specific terms to the blocklist that you want detect and act on.

1. Sign in to [Azure AI Studio](https://aka.ms/aistudio) and select **Explore** from the top menu.
1. Select **Content safety** panel under **Responsible AI**.
1. Select **Try it out** in the **Moderate text content** panel.

    :::image type="content" source="../media/quickstarts/content-safety-explore-text.png" alt-text="Screenshot of the moderate text content tool in the Azure AI Studio explore tab." lightbox="../media/quickstarts/content-safety-explore-text.png":::

1. Enter text in the **Test** field, or select sample text from the panels on the page.

    :::image type="content" source="../media/quickstarts/content-safety-text.png" alt-text="Screenshot of the moderate image content page." lightbox="../media/quickstarts/content-safety-text.png":::

1. Optionally, you can use slide controls in the **Configure filters** tab to modify the allowed or prohibited severity levels for each category.
1. Select **Run test**.

The service returns all the categories that were detected, the severity level for each (0-Safe, 2-Low, 4-Medium, 6-High), and a binary **Accept** or **Reject** judgment. The result is based in part on the filters you configure.

The **Use blocklist** tab lets you create, edit, and add a blocklist to the moderation workflow. If you have a blocklist enabled when you run the test, you get a **Blocklist detection** panel under **Results**. It reports any matches with the blocklist.

# [Moderate image content](#tab/moderate-image-content)

Azure AI Studio provides a capability for you to quickly try out image moderation. The *moderate image content* tool takes into account various factors such as the type of content, the platform's policies, and the potential effect on users. Run moderation tests on sample content. Use Configure filters to rerun and further fine tune the test results. Add specific terms to the blocklist that you want detect and act on.

1. Sign in to [Azure AI Studio](https://aka.ms/aistudio) and select **Explore** from the top menu.
1. Select **Content safety** panel under **Responsible AI**.
1. Select **Try it out** in the **Moderate image content** panel.

    :::image type="content" source="../media/quickstarts/content-safety-explore-image.png" alt-text="Screenshot of the moderate image content tool in the Azure AI Studio explore tab." lightbox="../media/quickstarts/content-safety-explore-image.png":::

1. Select a sample image from the panels on the page, or upload your own image. The maximum size for image submissions is 4 MB, and image dimensions must be between 50 x 50 pixels and 2,048 x 2,048 pixels. Images can be in JPEG, PNG, GIF, BMP, TIFF, or WEBP formats.

    :::image type="content" source="../media/quickstarts/content-safety-image.png" alt-text="Screenshot of the moderate image content page." lightbox="../media/quickstarts/content-safety-image.png":::

1. Optionally, you can use slide controls in the **Configure filters** tab to modify the allowed or prohibited severity levels for each category.
1. Select **Run test**.

The service returns all the categories that were detected, the severity level for each (0-Safe, 2-Low, 4-Medium, 6-High), and a binary **Accept** or **Reject** judgment. The result is based in part on the filters you configure.

---

## View and export code

You can use the **View Code** feature in both *moderate text content* or *moderate image content* page to view and copy the sample code, which includes configuration for severity filtering, blocklists, and moderation functions. You can then deploy the code on your end.

:::image type="content" source="../media/quickstarts/content-safety-image.png" alt-text="Screenshot of viewing the code in the moderate text content page." lightbox="../media/quickstarts/content-safety-image.png":::

## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this quickstart if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true).

## Next steps

* Learn more about what you can do in the [Azure AI Studio](../what-is-ai-studio.md).
* Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml).
