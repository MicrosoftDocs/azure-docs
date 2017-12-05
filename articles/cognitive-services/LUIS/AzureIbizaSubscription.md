---
title: Creating LUIS subscription keys on Azure | Microsoft Docs
description: In this article, you create a metered key for your LUIS account to provide unlimited traffic to your endpoint following a payment plan.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/01/2017
ms.author: cahann
---

# Subscription Keys on Azure
When you need more endpoint access than the [programmatic key](manage-keys.md#programmatic-key) quota, you must create an Azure subscription for the LUIS service. The Azure subscription creates metered access keys to your endpoint following a payment plan. See [Cognitive Services Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/?v=17.23h) for pricing information. 

The metered plan allows endpoint requests to your LUIS account at a specific rate. If the rate of requests is higher than the allowed rate of your metered account per minute or per month, requests receive an http error of "429: Too Many Requests." 

## Create your LUIS service

1. Sign in to **[Microsoft Azure](https://ms.portal.azure.com/)** 
2. Click the green **+** sign in the upper left-hand panel and search for “LUIS” in the marketplace, then click on **Language Understanding** and follow the **create experience** to create a LUIS subscription account. 

    ![Azure Search](./media/luis-azure-subscription/azure-search.png) 

3. Configure the subscription with settings including account name, pricing tiers, etc. 

    ![Azure API Choice](./media/luis-azure-subscription/azure-api-choice.png) 

    > [!NOTE]
    > * You need to remember the name of the Azure service you created in order to select it on the [LUIS.ai](https://www.luis.ai) publish page. 
    > * Only one free-tier LUIS service is allowed per subscription. If you already have this free-tier in another region, you must delete it from that region to create it in different region.

4. Once you create the LUIS service, you can view the access keys generated in **Resource Management->Keys**.  

    ![Azure Keys](./media/luis-azure-subscription/azure-keys.png)

## Use Azure LUIS service in luis.ai
In order to use the access keys you created in Azure, you need to log in to [luis.ai](https://www.luis.ai) and add the new LUIS service as part of [publishing your app](./PublishApp.md). You do not need the key values, you only need your unique LUIS subscription name. 

## Next steps

See [Manage your keys](./Manage-Keys.md) for more information about how to add and manage your Azure LUIS subscription keys in your **[luis.ai account](https://www.luis.ai)**.
 