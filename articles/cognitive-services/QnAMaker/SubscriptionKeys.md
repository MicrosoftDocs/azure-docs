---
title: Authentication and subscription keys for QnA Maker | Microsoft Docs
description: Get authentication and subscription keys that are used to track your QnA Maker tool usage.
services: cognitive-services
author: pchoudhari
manager: rsrikan

ms.service: cognitive-services
ms.technology: qnamaker
ms.topic: article
ms.date: 12/08/2016
ms.author: pchoudh
---

# Authentication & Subscription keys
You will need a [Microsoft account](https://www.microsoft.com/en-us/account/) if you don't already have one, to sign in to the portal.

You will receive a unique pair of keys. The second one is just a spare. Please do not share the secret keys with anyone.

These subscription keys are used to track your usage of the service and need to be part of every request, as mentioned in the API section.
To view your subscription keys, go to Settings.

![alt text](./Images/kbSubscription.png)

Here you can view and also refresh your subscription keys, if you suspect they have been compromised.

![alt text](./Images/kbSubscriptionKey.png)

Since currently the QnA Maker is a free to use tool, we have the following restrictions of usage per subscription key: **10,000 transactions per month, 10 per minute.** Beyond this your requests will be throttled.
