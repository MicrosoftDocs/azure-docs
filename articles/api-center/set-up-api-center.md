---
title: Quickstart - Create your Azure API center - portal
description: In this quickstart, use the Azure portal to set up an API center for API discovery, reuse, and governance. 
author: dlepow
ms.service: api-center
ms.topic: quickstart
ms.date: 04/19/2024
ms.author: danlep 
---

# Quickstart: Create your API center - portal

[!INCLUDE [quickstart-intro](includes/quickstart-intro.md)]

[!INCLUDE [quickstart-prerequisites](includes/quickstart-prerequisites.md)]

## Register the Microsoft.ApiCenter provider

If you haven't already, you need to register the **Microsoft.ApiCenter** resource provider in your subscription. You only need to register the resource provider once. 

To register the resource provider using the portal:

1. [Sign in](https://portal.azure.com) to the Azure portal.

1. In the search bar, enter *Subscriptions* and select **Subscriptions**.

1. Select the subscription where you want to create the API center.

1. In the left menu, under **Resources**, select **Resource providers**.

1. Search for **Microsoft.ApiCenter** in the list of resource providers. If it's not registered, select **Register**.

## Create an API center

1. [Sign in](https://portal.azure.com) to the Azure portal.

1. In the search bar, enter *API Centers*. 

1. Select **+ Create**. 

1. On the **Basics** tab, select or enter the following settings: 

    1. Select your Azure subscription. 

    1. Select an existing resource group, or select **Create new** to create a new one. 

    1. Enter a **Name** for your API center. It must be unique in the region where you're creating your API center. 

    1. In **Region**, select one of the [available regions](overview.md#available-regions) for Azure API Center, for example, *West Europe*. 
    
    1. In **Pricing plan**, select the pricing plan that meets your needs. 

1. Optionally, on the **Tags** tab, add one or more name/value pairs to help you categorize your Azure resources.

1. Select **Review + create**. 

1. After validation completes, select **Create**.

After deployment, your API center is ready to use!

[!INCLUDE [quickstart-next-steps](includes/quickstart-next-steps.md)]

