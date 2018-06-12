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

For unlimited traffic to your HTTP endpoint, you must create an Azure subscription for the LUIS service. The Azure subscription creates metered access keys to your endpoint following a payment plan. See [Cognitive Services Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/?v=17.23h) for pricing information. 

The metered plan allows requests to your LUIS account at a specific rate. If the rate of requests is higher than the allowed rate of your metered account per minute or per month, requests receive an http error of "429: Too Many Requests." 

To create your key, follow these steps: 

1. Sign in to the **[Microsoft Azure portal](https://ms.portal.azure.com/)** 
2. Click the green **+** sign in the upper left-hand panel and search for “LUIS” in the marketplace, then click on **Language Understanding Intelligent Service (preview)** and follow the **create experience** to create a LUIS subscription account. 

    ![Azure Search](./media/luis-azure-subscription/azure-search.png) 

3. Configure the subscription with settings including account name, pricing tiers, etc. 

    ![Azure API Choice](./media/luis-azure-subscription/azure-api-choice.png) 

4. Once you have created the LUIS subscription account, you can view the access keys generated in the **Resource Management->Keys** blade. Test your access keys in your **[luis.ai account](https://www.luis.ai)**, or by following the LUIS documentation to create a new endpoint application. 

    ![Azure Keys](./media/luis-azure-subscription/azure-keys.png)

## Using LUIS access keys in luis.ai
In order to use the access keys you created in Azure, you need to log in to [luis.ai](https://www.luis.ai) and add the new access keys as part of [publishing your app](./PublishApp.md).

## Next steps

See [Manage your keys](./Manage-Keys.md) for more information about how to add and manage your Azure LUIS subscription keys in your **[luis.ai account](https://www.luis.ai)**.
 