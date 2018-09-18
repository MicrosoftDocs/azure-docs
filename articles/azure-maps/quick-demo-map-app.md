---
title: Interactive Map Search with Azure Maps | Microsoft Docs
description: Azure Quickstart - Launch a demo interactive map search using Azure Maps
author: dsk-2015
ms.author: dkshir
ms.date: 09/10/2018
ms.topic: quickstart
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Launch an interactive search map using Azure Maps

This article demonstrates the capabilities of Azure Maps to create a map that gives users an interactive search experience. It walks you through the basic steps of creating your own Maps account and getting your account key to use in the demo web application.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Create an account and get your key

1. In the upper left-hand corner of the [Azure portal](https://portal.azure.com), click **Create a resource**.
2. In the *Search the Marketplace* box, type **Maps**.
3. From the *Results*, select **Maps**. Click **Create** button that appears below the map.
4. On the **Create Maps Account** page, enter the following values:
    - The *Name* of your new account.
    - The *Subscription* that you want to use for this account.
    - The *Resource group* for this account. You may choose to *Create new* or *Use existing* resource group.
    - Select the *Resource group location*.
    - Read the *License* and *Privacy Statement*, and check the checkbox to accept the terms.
    - Finally, click the **Create** button.

    ![Create Maps account in portal](./media/quick-demo-map-app/create-account.png)

5. Once your account is successfully created, open it and find the settings section of the account menu. Click **Keys** to view the primary and secondary keys for your Azure Maps account. Copy the **Primary Key** value to your local clipboard to use in the following section.

## Download the application

1. Download or copy the contents of the file [interactiveSearch.html](https://github.com/Azure-Samples/azure-maps-samples/blob/master/src/interactiveSearch.html).
2. Save the contents of this file locally as **AzureMapDemo.html** and open it in a text editor.
3. Search for the string `<insert-key>`, and replace it with the **Primary Key** value obtained in the preceding section.

## Launch the application

1. Open the file **AzureMapDemo.html** in a browser of your choice.
2. Observe the map shown of Los Angeles city. Zoom in and out to see how the map automatically renders with more or less information depending on the zoom level. 
3. Change the default center of the map. In the **AzureMapDemo.html** file, search for the variable named **center**. Replace the longitude, latitude pair value for this variable with the new values **[-74.0060, 40.7128]**. Save the file and refresh your browser.
4. Try out the interactive search experience. In the search box on the upper left corner of the demo web application, search for **restaurants**.
5. Move your mouse over the list of addresses/locations that appear below the search box, and notice how the corresponding pin on the map pops out information about that location. For privacy of private businesses, fictitious names and addresses are shown.

    ![Interactive Search web application](./media/quick-demo-map-app/interactive-search.png)

## Clean up resources

The tutorials go into detail about how to use and configure Maps with your account. If you plan to continue to the tutorials, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart.

1. Close the browser running the **AzureMapDemo.html** web application.
2. From the left-hand menu in the Azure portal, click **All resources** and then select your Maps account. At the top of the **All resources** blade, click **Delete**.

## Next steps

In this Quickstart, you created your Maps account and launched a demo app. To learn how to create your own application using the Maps APIs, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Search for points of interest with Maps](./tutorial-search-location.md)

For more code examples and an interactive coding experience, see below How-to guides.

> [!div class="nextstepaction"]
> [How to search for an address using Azure Maps REST APIs](./how-to-search-for-address.md)

> [!div class="nextstepaction"]
> [How to use Azure Maps map control](./how-to-use-map-control.md)
