---
title: Creating LUIS subscription keys on Azure | Microsoft Docs
description: In this article, you create a metered key for your LUIS account to provide unlimited traffic to your endpoint following a payment plan.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---

# Creating Subscription Keys on Azure

For unlimited traffic to your HTTP endpoint, you must create an Azure subscription for the Luis service. The Azure subscription creates metered access keys to your endpoint following a payment plan. See [Cognitive Services Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/?v=17.23h) for pricing information. 

The metered plan allows requests to your Luis account at a specific rate. If the rate of requests is higher than the allowed rate of your metered account per minute or per month, requests receive an http error of "429: Too Many Requests." 

To create your key, follow these steps: 

1. Sign in to the **[Microsoft Azure portal](https://ms.portal.azure.com/)** 
2. Click the green **+** sign in the upper left-hand panel and search for “Luis” in the marketplace, then click on **Language Understanding Intelligent Service (preview)** and follow the **create experience** to create a Luis subscription account. 

    ![Azure Search](./Images/azure_search.png) 

3. Configure the subscription with settings including account name, pricing tiers, etc. 

    ![Azure API Choice](./Images/azure_apiChoice.png) 

4. Once you have created the Luis subscription account, you can view the access keys generated in the **Resource Management->Keys** blade. Test your access keys in your **[Luis.ai account](https://www.luis.ai)**, or by following the Luis documentation to create a new endpoint application. 

    ![Azure Keys](./Images/azure_keys.png)

## Using Luis access keys in Luis.ai
In order to use the access keys  step 4, you need to change from the StarterKey to one of the new access keys as part of [publishing your app](./PublishApp.md).

Please see [Manage your keys](./Manage-Keys.md) for more information about how to manage your Azure Luis subscription keys in your **[Luis.ai account](https://www.luis.ai)**. 