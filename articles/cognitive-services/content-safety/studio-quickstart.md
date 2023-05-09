---
title: "Quickstart: Content Safety Studio"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, get started with the Content Safety service using Content Safety Studio in your browser.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: quickstart
ms.date: 04/27/2023
ms.author: pafarley
---

# QuickStart: Azure Content Safety Studio

In this quickstart, get started with the Content Safety service using Content Safety Studio in your browser. 

> [!CAUTION]
> Some of the sample content provided by Content Safety Studio may be offensive. Sample images are blurred by default. User discretion is advised.

## Prerequisites

* An active Azure account. If you don't have one, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).
* A [Content Safety](https://aka.ms/acs-create) Azure resource.

## Analyze text content

1. Sign in to [Content Safety Studio](https://contentsafety.cognitive.azure.com) with your Azure subscription and Content Safety resource.
1. Select the **Moderate text content** panel.
1. Add text to the input field, or select sample text from the panels on the page.
1. Select **Run test**.

The service returns all the categories that were detected, with the severity level for each. It also returns a binary **Accepted**/**Rejected** result, based on the filters you configure. Use the matrix in the **Configure filters** tab on the right to set your allowed/prohibited severity levels for each category. Then you can run the text again to see how the filter works.

The **Use blocklist** tab on the right lets you create, edit, and add a blocklist to the moderation workflow. If you have a blocklist enabled when you run the test, you'll get a **Blocklist detection** panel under **Results**. It reports any matched with the blocklist.

## Analyze image content

1. Sign in to [Content Safety Studio](https://contentsafety.cognitive.azure.com) with your Azure subscription and Content Safety resource.
1. Select the **Moderate image content** panel.
1. Select a sample image from the panels on the page, or upload your own image. The maximum size for image submissions is 4MB, and image dimensions must be between 50 x 50 pixels and 2,048 x 2,048 pixels. Images can be in JPEG, PNG, GIF, or BMP formats.
1. Select **Run test**.

The service returns all the categories that were detected, with the severity level for each. It also returns a binary **Accepted**/**Rejected** result, based on the filters you configure. Use the matrix in the **Configure filters** tab on the right to set your allowed/prohibited severity levels for each category. Then you can run the text again to see how the filter works.

## Monitor online activity

The [Monitor online activity](https://contentsafety.cognitive.azure.com/monitor) page lets you view your API usage and trends. You can choose which **Media type** to monitor, between image and text. You can choose the **Granularity** to change the visualizations, either **Auto**, **Hourly** or **Daily**. You can also specify the time range that you want to check by selecting **Show data for the last __**.

In the **Reject rate per category** chart, you can also adjust the severity thresholds for each category.

:::image type="content" source="media/thresholds.png" alt-text="Screenshot of the severity thresholds table.":::

You can also edit blocklists if you want to change some terms, based in the **Top 10 blocked terms** chart.

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
- [Azure CLI](/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

## Next steps

Next, get started using Content Safety through the REST APIs or a client SDK, so you can seamlessly integrate the service into you application.

> [!div class="nextstepaction"]
> [Quickstart: REST API and client SDKs](./quickstart-text.md)