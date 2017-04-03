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

#Cortana Prebuilt App

In addition to allowing you to build your own applications, LUIS also provides selected models from Microsoft Cortana personal assistant as a pre-built application. This is an "as-is" application; the intents and entities in this application cannot be edited or integrated into other LUIS applications. If you’d like your client to have access to both this pre-built application and your own LUIS application, then your client will have to make two separate HTTP calls.

The pre-built personal assistant application is available in these cultures (locales): English, French, Italian, Spanish and Chinese.

**To use Cortana Prebuilt App:**

 1. On **My Apps** page, click **Cortana prebuilt apps** and select your language, English for example. The following dialog box appears:
![Use Cortana prebuilt app](/Content/en-us/LUIS/Images/use-cortana.JPG)
 2. In **Query**, type the utterance you want to interpret. For example, type "set up an appointment at 2:00 pm tomorrow for 90 minutes called discuss budget"
 3. From the **Subscription Key** list, select the subscription key to be used for this endpoint hit to Cortana app. 
 4. Click the generated endpoint URL to access the endpoint and get the result of the query. The screenshot below shows the result returned in JSON format for the example utterance: "set up an appointment at 2:00 pm tomorrow for 90 minutes called discuss budget"
 ![Cortana Query Result](/Content/en-us/LUIS/Images/Cortana-JSON-Result.JPG)
