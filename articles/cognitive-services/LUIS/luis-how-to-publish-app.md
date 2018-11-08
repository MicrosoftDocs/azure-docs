---
title: Publish your LUIS app to the prediction endpoint
titleSuffix: Azure Cognitive Services 
description: When you finish building and testing your active LUIS app, make it available to your client application by publishing it to the endpoint.
services: cognitive-services
titleSuffix: Azure Cognitive Services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: conceptual
ms.date: 09/10/2018
ms.author: diberry
---

# Publish your trained app

When you finish building and testing your active LUIS app, make it available to your client application by publishing it to the endpoint. 

<a name="publish-your-trained-app-to-an-http-endpoint"></a>

## Publishing

To publish to the endpoint, select **Publish** in the top, right panel. 

![Top, right nav bar](./media/luis-how-to-publish-app/publish-top-nav-bar.png)

Select the correct slot when the pop-up window displays: staging or production. By using two publishing slots, this allows you to have two different versions with published endpoints or the same version on two different endpoints. 

The app is published to all regions associated with the LUIS resources added in the LUIS portal. For example, for an app created on [www.luis.ai](https://www.luis.ai), if you create a LUIS resource in **westus** and add it to the app as a resource, the app is published in that region. For more information about LUIS regions, see [Regions](luis-reference-regions.md).
 
![Publishing pop-up window](./media/luis-how-to-publish-app/publish-pop-up.png)

When your app is successfully published, a green success notification appears at the top of the browser. The green notification bar also includes a link to the endpoints. 

![Publishing pop-up window](./media/luis-how-to-publish-app/publish-success.png)

If you need the endpoint URL, select the link. You can also get to the endpoint URLs by selecting **Manage** in the top menu, then select **Keys and Endpoints** in the left menu. 

## Configuring publish settings

Configure publish settings by selecting **Manage** in the top, right navigation, then selecting **Publish Settings**. 

![Publish settings](./media/luis-how-to-publish-app/publish-settings.png)

### Publish after enabling sentiment analysis

<a name="enable-sentiment-analysis"></a>

Sentiment analysis allows LUIS to integrate with [Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/) to provide sentiment and key phrase analysis. 

You do not have to provide a Text Analytics key and there is no billing charge for this service to your Azure account. Once you check this setting, it is persistent. 

Sentiment data is a score between 1 and 0 indicating the positive (closer to 1) or negative (closer to 0) sentiment of the data.

For more information about the JSON endpoint response with sentiment analysis, see [Sentiment analysis](luis-concept-data-extraction.md#sentiment-analysis)



## Next steps

* See [Manage keys](./luis-how-to-manage-keys.md) to add keys to Azure subscription key to LUIS and how to set the Bing Spell Check key and include all intents in results.
* See [Train and test your app](luis-interactive-test.md) for instructions on how to test your published app in the test console.

