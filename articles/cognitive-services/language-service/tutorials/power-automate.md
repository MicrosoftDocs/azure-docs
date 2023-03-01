---
title: Use Language services in power automate
titleSuffix: Azure Cognitive Services
description: Learn how to use Azure Cognitive Service for Language in power automate, without writing code.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: tutorial
ms.date: 01/26/2023
ms.author: aahi
ms.custom: cogserv-non-critical-language
---


#  Use the Language service in Power Automate

You can use [Power Automate](/power-automate/getting-started) flows to automate repetitive tasks and bring efficiency to your organization. Using Azure Cognitive Service for Language, you can automate tasks like:
* Send incoming emails to different departments based on their contents. 
* Analyze the sentiment of new tweets.
* Extract entities from incoming documents. 
* Summarize meetings.
* Remove personal data from files before saving them.

In this tutorial, you'll create a Power Automate flow to extract entities found in text, using [Named entity recognition](../named-entity-recognition/overview.md).

## Prerequisites
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">A Language resource </a>
    * (optional) A trained model if you're using a custom capability such as [custom NER](../custom-named-entity-recognition/overview.md), [custom text classification](../custom-text-classification/overview.md), or [conversational language understanding](../conversational-language-understanding/overview.md).
    * You will need the key and endpoint from your Language resource to authenticate your Power Automate flow.

## Create a Power Automate flow

1. [Sign in to power automate](https://make.powerautomate.com/)

2. From the left side menu, select **My flows** and create a **Automated cloud flow**

    :::image type="content" source="../media/create-flow.png" alt-text="A screenshot of the menu for creating an automated cloud flow." lightbox="../media/create-flow.png":::

3. Enter a name your flow. For example `Languageflow`.

    :::image type="content" source="../media/language-flow.png" alt-text="A screenshot of automated cloud flow screen." lightbox="../media/language-flow.png":::

4. Start by selecting **Manually trigger flow**.

    :::image type="content" source="../media/trigger-flow.png" alt-text="A screenshot of how to manually trigger a flow." lightbox="../media/trigger-flow.png":::

5. To add a Language service connector, search for **Azure Language**.

    :::image type="content" source="../media/language-connector.png" alt-text="A screenshot of An Azure language connector." lightbox="../media/language-connector.png":::

6. For this tutorial, you will create a flow that extracts named entities from text. Search for **Named entity recognition**, and select the connector.

    :::image type="content" source="../media/entity-connector.png" alt-text="A screenshot of a named entity recognition connector." lightbox="../media/entity-connector.png":::

7. Add endpoint and key for your Language resource, which will be used for authentication. You can find your key and endpoint by navigating to your resource in the [Azure portal](https://portal.azure.com), and selecting **Keys and endpoint** from the left navigation menu.

    :::image type="content" source="../media/azure-portal-resource-credentials.png" alt-text="A screenshot of A language resource key and endpoint in the Azure portal." lightbox="../media/azure-portal-resource-credentials.png":::

8. Once you have your key and endpoint, add it to the connector in Power Automate.
 
    :::image type="content" source="../media/language-auth.png" alt-text="A screenshot of adding the language key and endpoint to the Power Automate flow." lightbox="../media/language-auth.png":::

9. Add the data in the connector
:::image type="content" source="../media/connector-data.png" alt-text="A screenshot of data being added to the connector." lightbox="../media/connector-data.png":::
    
    > [!NOTE]
    > You will need deployment name and project name if you are using custom language capability.
    
9. From the top navigation menu, save the flow and select **Test the flow**. In the window that appears, select **Test**. 
:::image type="content" source="../media/test-connector.png" alt-text="A screenshot of how to run the flow." lightbox="../media/test-connector.png":::

10. After the flow runs, you will see the response in the **outputs** field.

    :::image type="content" source="../media/response-connector.png" alt-text="A screenshot of flow response." lightbox="../media/response-connector.png":::

## Next steps 

* [Triage incoming emails with custom text classification](../custom-text-classification/tutorials/triage-email.md)
* [Available Language service connectors](/connectors/cognitiveservicestextanalytics)


