---
title: Use Language services in power automate
titleSuffix: Azure Cognitive Services
description: Use Language services in power automate.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: tutorial
ms.date: 05/27/2022
ms.author: aahi
ms.custom: ignite-fall-2021, cogserv-non-critical-language
---



To automate repetative tasks and bring efficiencies to any organization, you can use [power automate](). To make this more taliored for your business, you can use lanague services capabilites and automate tasks like:
* Triaging incoming emails to different departments 
* Analyze the sentiment of new tweets
* Extract entities from incoming documents 
* Summarize meetings 
* Rmeove personal data before saving the files

## Prerequisites
* Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.* Trained model (if using custom capabilites)
    * You will need the key and endpoint from the resource you created in your flow


## Create a power automate flow

1- [Signin to power automate](https://make.powerautomate.com/)

2- From the left side menu, choose *My flows* and create a *Automated cloud flow*
:::image type="content" source="../media/create-flow.png" alt-text="A screenshot of the flow creation." lightbox="../media/create-flow.png":::

3- Name your flow as *Languageflow*
:::image type="content" source="../media/language-flow.png" alt-text="A screenshot of the language flow." lightbox="../media/language-flow.png":::

4- Start by adding a *Manually trigger flow*
:::image type="content" source="../media/trigger-flow.png" alt-text="A screenshot of how to manually trigger a flow." lightbox="../media/trigger-flow.png":::

5- To add a Language connector, search for *Azure Language* 
:::image type="content" source="../media/language-connector.png" alt-text="A screenshot of azure language connectors." lightbox="../media/language-connector.png":::

6- For this tutorial, we will work on extracting named entities from text. To do so, search for *Named entity recognition*
:::image type="content" source="../media/entity-connector.png" alt-text="A screenshot of NER connector." lightbox="../media/entity-connector.png":::

7- Add your language endpoint and key to be used for authentication 
:::image type="content" source="../media/language-auth.png" alt-text="A screenshot of language key and endpoint." lightbox="../media/language-auth.png":::

8- Add the data in the connector
:::image type="content" source="../media/ner-connector.png" alt-text="A screenshot of the NER connector." lightbox="../media/ner-connector.png":::

> [!NOTE]
> You will need deployment name and project name if you are using custom language capabilites

9- From the top bar, save and test the flow
:::image type="content" source="../media/test-connector.png" alt-text="A screenshot of how to run the flow." lightbox="../media/test-connector.png":::

10- After the flow runs, you should see the response in the outputs field
:::image type="content" source="../media/response-connector.png" alt-text="A screenshot of flow response." lightbox="../media/response-connector.png":::



## Next steps 

[Language studio quick start](../language-studio.md)



