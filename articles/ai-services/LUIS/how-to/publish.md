---
title: Publish
description:  Learn how to publish.
ms.service: azure-ai-language
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: azure-ai-luis
ms.topic: how-to
ms.date: 12/14/2021
---

# Publish your active, trained app

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


When you finish building, training, and testing your active LUIS app, you make it available to your client application by publishing it to an endpoint.

## Publishing

1. Sign in to the [LUIS portal](https://www.luis.ai/), and select your  **Subscription**  and  **Authoring resource**  to see the apps assigned to that authoring resource.
2. Open your app by selecting its name on  **My Apps**  page.
3. To publish to the endpoint, select  **Publish**  in the top-right corner of the panel.

    :::image type="content" source="../media/luis-how-to-publish-app/publish-top-nav-bar.png" alt-text="A screenshot showing the navigation bar at the top of the screen, with the publish button in the top-right." lightbox="../media/luis-how-to-publish-app/publish-top-nav-bar.png":::

1. Select your settings for the published prediction endpoint, then select  **Publish**.

:::image type="content" source="../media/luis-how-to-publish-app/publish-pop-up.png" alt-text="Select publish settings then select Publish button" lightbox="../media/luis-how-to-publish-app/publish-pop-up.png":::

## Publishing slots 

Select the correct slot when the pop-up window displays:

* Staging
* Production

By using both publishing slots, you can have two different versions of your app available at the published endpoints, or the same version on two different endpoints.

## Publish in more than one region

The app is published to all regions associated with the LUIS prediction resources. You can find your LUIS prediction resources in the LUIS portal by clicking **Manage** from the top navigation menu, and selecting  [Azure Resources](../luis-how-to-azure-subscription.md#assign-luis-resources).

For example, if you add 2 prediction resources to an application in two regions, **westus**  and  **eastus** , and add these to the app as resources, the app is published in both regions. For more information about LUIS regions, see [Regions](../luis-reference-regions.md).

## Configure publish settings

After you select the slot, configure the publish settings for:

* Sentiment analysis: 
Sentiment analysis allows LUIS to integrate with the Language service to provide sentiment and key phrase analysis. You do not have to provide a Language service key and there is no billing charge for this service to your Azure account. See [Sentiment analysis](../luis-reference-prebuilt-sentiment.md) for more information about the sentiment analysis JSON endpoint response.

* Speech priming:
Speech priming is the process of sending the LUIS model output to the Speech service prior to converting the text to speech. This allows the speech service to provide speech conversion more accurately for your model. This allows for Speech and LUIS requests and responses in one call by making one speech call and getting back a LUIS response. It provides less latency overall.

After you publish, these settings are available for review from the  **Manage**  section's  **Publish settings**  page. You can change the settings with every publish. If you cancel a publish, any changes you made during the publish are also canceled.

## When your app is published

When your app is successfully published, a success notification Will appear at the top of the browser. The notification also includes a link to the endpoints.

If you need the endpoint URL, select the link or select  **Manage**  in the top menu, then select  **Azure Resources**  in the left menu.


## Next steps

- See [Manage keys](../luis-how-to-azure-subscription.md) to add keys to LUIS.
- See [Train and test your app](train-test.md) for instructions on how to test your published app in the test console.
