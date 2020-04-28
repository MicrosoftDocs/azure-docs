---
title: Configure learning behavior
description: Apprentice mode gives you confidence in the Personalizer service and its machine learning capabilities, and provides metrics that the service is sent information that can be learned from – without risking online traffic.
ms.topic: how-to
ms.date: 04/27/2020
---

# Configure the Personalizer learning behavior

Apprentice mode gives you confidence in the Personalizer service and its machine learning capabilities, and provides metrics that the service is sent information that can be learned from – without risking online traffic.

Configure the learning behavior on the **Configuration** page, on the **Learning behavior** tab, in the Azure portal for that Personalizer resource.

## Use an E0 Personalizer resource

In order to use Apprentice mode for your Personalizer resource, you need to create the resource in the `E0` pricing tier.  You can upgrade to the `E0` pricing tier on the **Pricing tier** page of the Personalizer resource in the Azure portal.

## Configure Apprentice mode

1. In the Azure portal, on the **Learning behavior** page for your Personalizer resource, select **Learn as an apprentice** then select **Save**.

> [!div class="mx-imgBorder"]
> ![Screenshot of configuring apprentice mode learning behavior in Azure portal](media/settings/configure-learning-behavior-azure-portal.png)

1. When using apprentice mode, the **first action sent to the Rank API** should be the action selected by your existing application logic. This allows Personalizer to return that action in the response, let you use the same response processing code for both learning behaviors.

    Change your application request to the Rank API.

    You don't need to change how you process the Rank response, or how you call or process the Reward API.

## Evaluate Apprentice mode

1. In the Azure portal, on the **Evaluations** page for your Personalizer resource, review the **Current learning behavior performance**.

    

## Next steps
