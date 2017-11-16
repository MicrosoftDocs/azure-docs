---
title: Search with Azure Location Based Services | Microsoft Docs
description: Search nearby point of interest using Azure Location Based Services
services: location-based-services
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 11/14/2017
ms.topic: tutorial
ms.service: location-based-services

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Search nearby point of interest using Azure Location Based Services

This tutorial shows how to set up an account with Azure Location Based Services, and then use the provided APIs to search for a point of interest. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an account with Azure Location Based Services
> * Get the subscription key for your account
> * Create new web page using Map Control API
> * Use Search Service to find nearby point of interest

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

# Log in to the Azure portal
Log in to the [Azure portal](https://portal.azure.com).

<a id="createaccount"></a>

## Create an account with Azure Location Based Services

Follow these steps to create a new Location Based Services account.

1. In the upper left-hand corner of the [Azure portal](https://portal.azure.com), click **Create a resource**.
2. In the *Search the Marketplace* box, type **location based services**.
3. From the *Results*, click the **Location Based Services (preview)**. Click **Create** button that appears below the map. 
4. On the **Create Location Based Services Account** page, enter the following values:
    - The *Name* of your new account. 
    - The *Subscription* that you want to use for this account.
    - The *Resource group* name for this account. You may choose to *Create new* or *Use existing* resource group.
    - Select the *Resource group location*. At present, the default option is **Global**.
    - Select the *Pricing tier*.
    - Read the *Preview Terms* and check the checkbox to accept the terms. 
    - Finally, click the **Create** button.
   
    ![Create Location Based Services account in portal](./media/tutorial-search-location/create-lbs-account.png)


<a id="getkey"></a>

## Get the subscription key for your account

Once your Location Based Services account is successfully created, follow the steps to link it to its map search APIs:

1. Open your Location Based Services account in the portal.
2. Navigate to your account's **SETTINGS**, and then select **Keys**.
3. Copy the **Primary Key** to your clipboard. Save it locally to use in the proceeding steps. 

    ![Get Primary Key in portal](./media/tutorial-search-location/lbs-get-key.png)

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an account with Azure Location Based Services
> * Get the subscription key for your account
> * Create new web page using Map Control API
> * Use Search Service to find nearby point of interest

Proceed to the next tutorial to learn how to use the Azure Location Based Services to route to your point of interest. 
