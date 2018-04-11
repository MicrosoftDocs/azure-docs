---
title: Interactive Map Search with Azure Maps | Microsoft Docs
description: Azure Quickstart - Launch a demo interactive map search using Azure Maps
services: location-based-services
keywords: 
author: kgremban
ms.author: kgremban
ms.date: 04/03/2018
ms.topic: quickstart
ms.service: location-based-services

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Launch a demo interactive map search using Azure Maps

This article demonstrates the capabilities of Azure Maps to perform an interactive search using Azure Maps. It also walks you through the basic steps of creating your own Maps account and getting your account's key to use in the demo web application. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Create a Maps account and get account key

1. In the upper left-hand corner of the [Azure portal](https://portal.azure.com), click **Create a resource**.
2. In the *Search the Marketplace* box, type **Maps**.
3. From the *Results*, select **Maps**. Click **Create** button that appears below the map. 
4. On the **Create Maps Account** page, enter the *Name* for your new account, select the *Subscription* to use, and enter the name of a new or existing *Resource group*. Select the location for your resource group, accept the *Preview Terms*, and click **Create**.

    ![Create Maps account in portal](./media/quick-demo-map-app/create-lbs-account.png)

5. Once your account is successfully created, open it and navigate to the account's **SETTINGS**. Click **Keys** to obtain the primary and secondary keys for your Azure Maps account. Copy the **Primary Key** value to your local clipboard to use in the following section. 

## Download the demo application for Azure Maps

1. Download the <a href="https://raw.githubusercontent.com/Azure-Samples/location-based-services-samples/master/src/interactiveSearch.html" download> **interactiveSearch.html** </a> file.
2. In the file, search for the string `<insert-key>`, and replace it with the **Primary Key** value obtained in the preceding section. 


## Launch the demo application for Azure Maps

1. Open the file **interactiveSearch.html** in a browser of your choice.
2. Observe the map shown of Los Angeles city. The city is determined by the value of the `[longitude, latitude]` pair given to the JavaScript variable named **center** in the *interactiveSearch.html*. You can change these coordinates to any other city of your choice. For example, New York city's coordinates are *[-74.0060, 40.7128]*.
3. In the search box on the upper left corner of the demo web application, enter any location type or address that you want to search. 
4. Move your mouse over the list of addresses/locations that appear below the search box, and notice how the corresponding pin on the map pops out information about that location. For example, a sample launch of this web application and a search for *restaurants* leads to the following. Please note that for privacy of private businesses, fictitious names and addresses are shown. 

    ![Interactive Search web application](./media/quick-demo-map-app/lbs-interactive-search.png)


## Clean up resources

The tutorials go in details about how to use and configure the Azure Maps for your account. If you plan to continue on to work with the tutorials, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the browser running the **interactiveSearch.html** web application.
2. From the left-hand menu in the Azure portal, click **All resources** and then select your Maps account. At the top of the **All resources** blade, click **Delete**.

## Next steps

In this Quickstart, you’ve created your Azure Maps account, and launched a demo app using your account. To learn how to create your own application using the Azure Maps APIs, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Tutorial to user Azure Map and Search](./tutorial-search-location.md)
