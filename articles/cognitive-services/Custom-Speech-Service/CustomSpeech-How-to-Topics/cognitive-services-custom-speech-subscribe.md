---
title: Get subscription keys for the Custom Speech Service on Azure | Microsoft Docs
description: Learn how to get subscription keys for calls to the Custom Speech Service in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano
ms.service: cognitive-services
ms.component: custom-speech
ms.topic: article
ms.date: 02/08/2017
ms.author: panosper
---

# Obtain subscription keys

[!INCLUDE [Deprecation note](../../../../includes/cognitive-services-custom-speech-deprecation-note.md)]

To get started using the Azure Custom Speech Service, you first need to link your user account to an Azure subscription. Subscriptions to free and paid tiers are available. For information about the tiers, see the [pricing page](https://www.microsoft.com/cognitive-services/en-us/pricing).

## Get a subscription key
1. You can get a subscription key from the Azure portal in one of two ways:

    * Go to the [Azure portal](https://ms.portal.azure.com), and add a new Cognitive Services API by searching for _Cognitive Services_ and then selecting **Cognitive Services APIs**.

      ![Cognitive Services search](../../../media/cognitive-services/custom-speech-service/custom-speech-azure-subscription.png)

    * Or go directly to the [Cognitive Services APIs](https://ms.portal.azure.com/#create/Microsoft.CognitiveServices).

        ![Cognitive Services APIs](../../../media/cognitive-services/custom-speech-service/custom-speech-azure-subscription2.png)

    
1. Fill in the following required fields:

      a. **Account name**. Use a name that works for you. Remember this name so that you can find your Cognitive Services subscription in the resources list.

      b. **Subscription**. Select one from your Azure subscriptions.

      c. **API type**. Select **Custom Speech Service (Preview)**.

      d. **Location**. It's currently **West US**.

      e. **Pricing tier**. Select the tier that works for you. **F0** is the free tier. The quotas that are allowed are explained on the [pricing page](https://www.microsoft.com/cognitive-services/en-us/pricing).

      ![Cognitive Services account creation](../../../media/cognitive-services/custom-speech-service/custom-speech-azure-cris-blade.png)

1. You should find either a view on your dashboard or a service with the provided account name in your resources list. When you select it, you can see an overview of your service. In the list on the left, under **Resource Management**, select **Keys**. Copy **KEY 1**.

      This subscription key is required in the next steps.

      ![KEY 1](../../../media/cognitive-services/custom-speech-service/custom-speech-azure-cris-keys2.png)

      > [!NOTE]
      > Do not copy the **Subscription ID** from the overview page. You need the subscription key in the next step.
      >

      ![Overview Subscription ID](../../../media/cognitive-services/custom-speech-service/custom-speech-azure-cris-keys.png)

1. To enter your subscription key, on the ribbon at the upper right, select your user account. On the drop-down menu, select **Subscriptions**.

      ![Subscriptions menu item](../../../media/cognitive-services/custom-speech-service/custom-speech-subscription-selection.png)

    A table of subscriptions appears, which is empty the first time it opens.

    ![Subscriptions table](../../../media/cognitive-services/custom-speech-service/custom-speech-subscription-list.png)

1. Select **Add new**. Enter a name for the subscription and the subscription key. It can be either **KEY 1** (primary key) or **KEY 2** (secondary key) from your subscription.

      ![Subscription key name](../../../media/cognitive-services/custom-speech-service/custom-speech-enter-subsciption.png)

To upload data, train a model, or do a deployment, you need to link your Custom Speech Service activities to an Azure subscription. It can be either a free tier or a paid tier subscription. For more information, see the [pricing page](https://www.microsoft.com/cognitive-services/en-us/pricing).

## Get a subscription ID
To get a subscription ID, go to the Azure portal. Search for *Cognitive Services* and *Custom Speech Service*, and follow the instructions.

> [!NOTE]
> The subscription key is required later in this process.
>

## Next steps
* Start to create your [custom acoustic model](cognitive-services-custom-speech-create-acoustic-model.md).
* Start to create your [custom language model](cognitive-services-custom-speech-create-language-model.md).
