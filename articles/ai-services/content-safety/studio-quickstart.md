---
title: "Quickstart: Content Safety Studio"
titleSuffix: "Azure AI services"
description: In this quickstart, get started with the Content Safety service using Content Safety Studio in your browser.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023, build-2023-dataai
ms.topic: quickstart
ms.date: 04/27/2023
ms.author: pafarley
---

# QuickStart: Azure AI Content Safety Studio

In this quickstart, get started with the Azure AI Content Safety service using Content Safety Studio in your browser. 

> [!CAUTION]
> Some of the sample content provided by Content Safety Studio may be offensive. Sample images are blurred by default. User discretion is advised.

## Prerequisites

* An active Azure account. If you don't have one, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).
* A [Content Safety](https://aka.ms/acs-create) Azure resource.
* Sign in to [Content Safety Studio](https://contentsafety.cognitive.azure.com) with your Azure subscription and Content Safety resource. 


## Analyze text content
The [Moderate text content](https://contentsafety.cognitive.azure.com/text) page provides capability for you to quickly try out text moderation.

:::image type="content" source="media/analyzetext.png" alt-text="Screenshot of Analyze Text panel.":::

1. Select the **Moderate text content** panel.
1. Add text to the input field, or select sample text from the panels on the page.
    > [!TIP]
    > Text size and granularity
    >
    > The default maximum length for text submissions is **10K** characters.
1. Select **Run test**.

The service returns all the categories that were detected, with the severity level for each(0-Safe, 2-Low, 4-Medium, 6-High). It also returns a binary **Accepted**/**Rejected** result, based on the filters you configure. Use the matrix in the **Configure filters** tab on the right to set your allowed/prohibited severity levels for each category. Then you can run the text again to see how the filter works.

The **Use blocklist** tab on the right lets you create, edit, and add a blocklist to the moderation workflow. If you have a blocklist enabled when you run the test, you get a **Blocklist detection** panel under **Results**. It reports any matches with the blocklist.

## Detect jailbreak risk

The **Jailbreak risk detection** panel lets you try out jailbreak risk detection. Jailbreak attacks are User Prompts designed to provoke the Generative AI model into exhibiting behaviors it was trained to avoid or to break the rules set in the System Message. These attacks can vary from intricate role-play to subtle subversion of the safety objective. 

:::image type="content" source="media/jailbreak-panel.png" alt-text="Screenshot of content safety studio with jailbreak risk detection panel selected.":::

1. Select the **Jailbreak risk detection** panel.
1. Select a sample text on the page, or input your own content for testing. You can also upload a CSV file to do a batch test.
1. Select Run test.

The service returns the jailbreak risk level and type for each sample. You can also view the details of the jailbreak risk detection result by selecting the **Details** button.

For more information, see the [Jailbreak risk detection conceptual guide](./concepts/jailbreak-detection.md).

## Analyze image content
The [Moderate image content](https://contentsafety.cognitive.azure.com/image) page provides capability for you to quickly try out image moderation.

:::image type="content" source="media/analyzeimage.png" alt-text="Screenshot of Analyze Image panel.":::

1. Select the **Moderate image content** panel.
1. Select a sample image from the panels on the page, or upload your own image. The maximum size for image submissions is 4 MB, and image dimensions must be between 50 x 50 pixels and 2,048 x 2,048 pixels. Images can be in JPEG, PNG, GIF, BMP, TIFF, or WEBP formats.
1. Select **Run test**.

The service returns all the categories that were detected, with the severity level for each(0-Safe, 2-Low, 4-Medium, 6-High). It also returns a binary **Accepted**/**Rejected** result, based on the filters you configure. Use the matrix in the **Configure filters** tab on the right to set your allowed/prohibited severity levels for each category. Then you can run the text again to see how the filter works.

## View and export code
You can use the **View Code** feature in both *Analyze text content* or *Analyze image content* page to view and copy the sample code, which includes configuration for severity filtering, blocklists, and moderation functions. You can then deploy the code on your end.

:::image type="content" source="media/viewcode.png" alt-text="Screenshot of the View code.":::


## Monitor online activity

The [Monitor online activity](https://contentsafety.cognitive.azure.com/monitor) page lets you view your API usage and trends. 

:::image type="content" source="media/monitor.png" alt-text="Screenshot of Monitoring panel.":::

You can choose which **Media type** to monitor. You can also specify the time range that you want to check by selecting **Show data for the last __**.

In the **Reject rate per category** chart, you can also adjust the severity thresholds for each category.

:::image type="content" source="media/thresholds.png" alt-text="Screenshot of the severity thresholds table.":::

You can also edit blocklists if you want to change some terms, based on the **Top 10 blocked terms** chart.

## Manage your resource
To view resource details such as name and pricing tier, select the **Settings** icon in the top-right corner of the Content Safety Studio home page and select the **Resource** tab. If you have other resources, you can switch resources here as well.

:::image type="content" source="media/manage-resource.png" alt-text="Screenshot of Manage Resource.":::

## Clean up resources

If you want to clean up and remove an Azure AI services resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

Next, get started using Azure AI Content Safety through the REST APIs or a client SDK, so you can seamlessly integrate the service into your application.

> [!div class="nextstepaction"]
> [Quickstart: REST API and client SDKs](./quickstart-text.md)
