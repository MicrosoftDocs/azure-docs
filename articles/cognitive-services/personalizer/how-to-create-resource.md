---
title: Create Personalizer resource
description: Service configuration includes how the service treats rewards, how often the service explores, how often the model is retrained, and how much data is stored.
ms.topic: conceptual
ms.date: 10/23/2019
---

# Create Personalizer resource


## Create a resource in the Azure portal

Create a Personalizer resource for each feedback loop.

1. Sign in to [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer). The previous link takes you to the **Create** page for the Personalizer service.
1. Enter your service name, select a subscription, location, pricing tier, and resource group.
1. Select the confirmation and select **Create**.

<a name="configure-service-settings-in-the-azure-portal"></a>

## Configure service in the Azure portal

1. Sign in to the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer).
1. Find your Personalizer resource.
1. In the **Resource management** section, select **Configuration**.

    Before leaving the Azure portal, copy one of your resource keys from the **Keys** page. You will need this to use the [Personalizer SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.personalizer).

<a name="configure-reward-settings-for-the-feedback-loop-based-on-use-case"></a>

## Next steps

* [Configure](how-to-settings.md) Personalizer loop