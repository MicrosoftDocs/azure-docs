---
title: Get subscription keys for the Custom Speech Service | Microsoft Docs
description: Learn how to get subscription keys for calls to the Custom Speech Service in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano

ms.service: cognitive-services
ms.technology: custom-speech-service
ms.topic: article
ms.date: 02/08/2017
ms.author: panosper
---

## Obtaining Subscription Keys
To get started using the Custom Speech Service, you first need to link your user account to an Azure subscription. Subscriptions to **free** and **paid** tiers are available. For information about the tiers, please visit the [pricing page](https://www.microsoft.com/cognitive-services/en-us/pricing).

Please follow the steps to get a subscription key from Azure portal:

  * Either go to [Azure portal](https://ms.portal.azure.com) and add a new _Cognitive Service API_ by searching for '_Cognitive Services_'

      ![try](../Images/AzureSubscription.png)

    and then selecting '_Cognitive Services APIs_'

     ![try](../Images/AzureSubscription2.png)

    * or go directly to the [Cognitive Services APIs](https://ms.portal.azure.com/#create/Microsoft.CognitiveServices) blade.
    * Now, fill in the required fields:
      *   For the _Account name_ use something which works for you. This name you have to remember to find your Cognitive Service subscription within the all resources list.
      *   For _Subscription_ select one from your Azure subcriptions
      *   As _API type_ please select 'Custom Speech Service (Preview)'
      *   _Location_ is currently 'West US'
      *   For _Pricing tier_ select the one which works for you. F0 is the free tier with given quotas as explained on the [pricing page](https://www.microsoft.com/cognitive-services/en-us/pricing)

      ![try](../Images/AzureCRISBlade.png)

    * Now, you should either find a blade on your dashboard or a service with the provided _Account name_ in your resources list. When you select it you can see an overview of your service. In the list of the left side ribbon you can find under _Resource Management_ a menu item called _Keys_. Clicking this item brings you to the page showing your subscription keys. Please copy **'KEY 1'**.

      This subscription key is required in the next steps.

      ![try](../Images/AzureCRISKeys2.png)

      One remark, please do not copy the 'Subscription ID' from the overview page. We need the subscription key in the next step!

      ![try](../Images/AzureCRISKeys.png)

    * To enter your subscription key, click on your user account in the right side of the top ribbon and click on _Subscriptions_ in the drop-down menu.

      ![try](../Images/SubscriptionSelection.png)

    * This brings you to a table of subscriptions, which will be empty the first time.

      ![try](../Images/SubscriptionList.png)

    * Click on _Add new_. Enter a name for the subscription and the subscription key. This can either be the **'KEY 1'** (primary key) or the **'KEY 2'** (secondary key) from your subscription.

      ![try](../Images/EnterSubsciption.png)

In order to be able to upload data, to train a model or to do a deployment you need to link your Custom Speech Service activities to an Azure subscription. This can either be a free-tier or paid tier subscription. For further information please visit the [pricing page](https://www.microsoft.com/cognitive-services/en-us/pricing).
To get a subscription id please go to your Azure portal and search for cognitive services and Custom Speech Service and follow the instructions there.

[!Note]: The subscription key is required later in this process.

### Related Links:
* [Pricing Options for Microsoft Cognitive APIs](https://www.microsoft.com/cognitive-services/en-us/pricing)
