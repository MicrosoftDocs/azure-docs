---
title: <page title displayed in search results. Include the brand Azure. Up to 60 characters> | Microsoft Docs
description: <article description that is displayed in search results. 115 - 145 characters.>
services: cognitive-services
author: <author's GitHub user alias, with correct capitalization>
manager: <MSFT alias of the author's manager>

ms.service: cognitive-services
ms.technology: <use folder name, all lower-case>
ms.topic: article
ms.date: mm/dd/yyyy
ms.author: <author's microsoft alias, one value only, alias only>
---

#Creating Subscription Keys Via Azure

For unlimited traffic to your HTTP endpoint, you must create a metered key for your account on LUIS. Metered keys provide unlimited traffic to your endpoint following a payment plan. To create your key, follow these steps: 

1. Sign in to the **[Microsoft Azure Portal](https://ms.portal.azure.com/)** 
2. Click the green **+** sign in the upper left-hand panel and search for “Cognitive Services” in the marketplace, then click on **Cognitive Services APIs** and follow the **create experience** to create an API account you are interested in. 

![Azure Search](./Images/azure_search.png) 

  3.Choose the API you are interested in by clicking on the **API Type** to create a subscription. In this case, choose the **Language Understanding Intelligent Service (LUIS)** option. Configure the subscription with settings including account name, pricing tiers, etc. 

![Azure API Choice](./Images/azure_apiChoice.png) 

  4.Once you have created the API account, you can view the keys generated in the **Settings->Keys** blade. These can be tested in your existing application or by following the LUIS documentation to create a new application. 

![Azure Keys](./Images/azure_keys.png)

When you have created your key, you can add it to your account via the application settings/configuration dialog, found in any application. 
