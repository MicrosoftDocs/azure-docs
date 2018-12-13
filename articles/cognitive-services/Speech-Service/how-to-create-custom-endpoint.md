---
title: Create a custom speech endpoint with Speech Service on Azure | Microsoft Docs
description: Learn how to create a custom speech-to-text endpoint with the Speech Service in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 03/12/2018
ms.author: panosper
---

# Create a custom speech-to-text endpoint

After you have created custom acoustic models or language models, you can deploy them in a custom speech-to-text endpoint. 

## Create an endpoint
To create a new custom endpoint, select **Endpoints** on the **Custom Speech** menu at the top of the page. This action takes you to the **Endpoints** page, which contains a table of current custom endpoints. If you have not yet created any endpoints, the table is empty. The current locale is reflected in the table title. 

To create a deployment for a different language, select **Change Locale**. For more information about supported languages.

To create a new endpoint, select **Create New**. In the **Create Endpoint** pane, enter information in the **Name** and **Description** boxes of your custom deployment.

In the **Subscription** combo box, select the subscription that you want to use. If it is an S0 (paying) subscription, you can select concurrent requests.

You can also select whether content logging is switched on or off. That is, you're selecting whether the endpoint traffic is stored. If it is not selected, storing the traffic will be suppressed. For all logged content you can find download links under Endpoint-> Details view

In the **Acoustic Model** list, select the acoustic model that you want, and in the **Language Model** list, select the language model that you want. The choices for acoustic and language models always include the base Microsoft models. The selection of the base model limits the combinations. You cannot mix conversational base models with search and dictate base models.

> [!NOTE]
> Be sure to accept the terms of use and pricing information by selecting the check box.
>

After you have selected your acoustic and language models, select **Create**. This action returns you to the **Deployments** page. The table now includes an entry that corresponds to your new endpoint. The endpoint’s status reflects its current state while it is being created. It can take up to 30 minutes to instantiate a new endpoint with your custom models. When the status of the deployment is *Complete*, the endpoint is ready for use.

When the deployment is ready, the endpoint name becomes a link. Selecting the link displays the **Endpoint Information** page, which displays the URLs of your custom endpoint to use with either an HTTP request or the Microsoft Cognitive Services Speech Client Library, which uses web sockets.

## Next steps

For more tutorials, see:
- [Get your Speech Service trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [Create custom acoustic model](how-to-customize-acoustic-models.md)
- [Create custom language model](how-to-customize-language-model.md)
