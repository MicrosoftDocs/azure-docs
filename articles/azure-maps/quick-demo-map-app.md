---
title: 'Quickstart: Interactive map search with Azure Maps'
description: 'Quickstart: Learn how to create interactive, searchable maps. See how to create an Azure Maps account, get a primary key, and use the Web SDK to set up map applications'
author: anastasia-ms
ms.author: v-stharr
ms.date: 7/10/2020
ms.topic: quickstart
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---

# Quickstart: Create an interactive search map with Azure Maps

This article shows you how to use Azure Maps to create a map that gives users an interactive search experience. It walks you through these basic steps:

* Create your own Azure Maps account.
* Get your primary key to use in the demo web application.
* Download and open the demo map application.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Sign in to the [Azure portal](https://portal.azure.com).

<a id="createaccount"></a>

## Create an Azure Maps account

Create a new Azure Maps account with the following steps:

1. In the upper left-hand corner of the [Azure portal](https://portal.azure.com), click **Create a resource**.
2. In the *Search the Marketplace* box, type **Azure Maps**.
3. From the *Results*, select **Azure Maps**. Click **Create** button that appears below the map.
4. On the **Create Maps Account** page, enter the following values:
    * The *Subscription* that you want to use for this account.
    * The *Resource group* name for this account. You may choose to *Create new* or *Use existing* resource group.
    * The *Name* of your new account.
    * The *Pricing tier* for this account.
    * Read the *License* and *Privacy Statement*, and check the checkbox to accept the terms.
    * Click the **Create** button.

    :::image type="content" source="./media/quick-demo-map-app/create-account.png" alt-text="Create Maps account in portal":::

<a id="getkey"></a>

## Get the primary key for your account

Once your Maps account is successfully created, retrieve the primary key that enables you to query the Maps APIs.

1. Open your Maps account in the portal.
2. In the settings section, select **Authentication**.
3. Copy the **Primary Key** to your clipboard. Save it locally to use later in this tutorial.

>[!NOTE]
> If you use the subscription key instead of the primary key, your map won't render properly. Also, for security purposes, it is recommended that you rotate between your primary and secondary keys. To rotate keys, update your app to use the secondary key, deploy, then press the cycle/refresh button beside the primary key to generate a new primary key. The old primary key will be disabled. For more information on key rotation, see [Set up Azure Key Vault with key rotation and auditing](../key-vault/secrets/tutorial-rotation-dual.md)

:::image type="content" source="./media/quick-demo-map-app/get-key.png" alt-text="Get Primary Key Azure Maps key in Azure portal":::

## Download the demo application

1. Go to [interactiveSearch.html](https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/master/AzureMapsCodeSamples/Tutorials/interactiveSearch.html). Copy the content of the file.
2. Save the contents of this file locally as **AzureMapDemo.html**. Open it in a text editor.
3. Search for the string `<Your Azure Maps Key>`. Replace it with the **Primary Key** value from the preceding section.

## Open the demo application

1. Open the file **AzureMapDemo.html** in a browser of your choice.
2. Observe the map shown of the City of Los Angeles. Zoom in and out to see how the map automatically renders with more or less information depending on the zoom level.
3. Change the default center of the map. In the **AzureMapDemo.html** file, search for the variable named **center**. Replace the longitude, latitude pair value for this variable with the new values **[-74.0060, 40.7128]**. Save the file and refresh your browser.
4. Try out the interactive search experience. In the search box on the upper-left corner of the demo web application, search for **restaurants**.
5. Move your mouse over the list of addresses and locations that appear below the search box. Notice how the corresponding pin on the map pops out information about that location. For privacy of private businesses, fictitious names and addresses are shown.

    :::image type="content" source="./media/quick-demo-map-app/interactive-search.png" alt-text="Interactive map search web application":::


## Clean up resources

>[!WARNING]
>The tutorials listed in the [Next Steps](#next-steps) section detail how to use and configure Azure Maps with your account. Don't clean up the resources created in this quickstart if you plan to continue to the tutorials.

If you don't plan to continue to the tutorials, take these steps to clean up the resources:

1. Close the browser that runs the **AzureMapDemo.html** web application.
2. Navigate to the Azure portal page. Select **All resources** from the main portal page. Or, click on the menu icon in the upper left-hand corner. Select **All resources**.
3. Click on your Azure Maps account. At the top of the page, click **Delete**.

For more code examples and an interactive coding experience, see these guides:

[Find an address with Azure Maps search service](how-to-search-for-address.md)

[Use the Azure Maps Map Control](how-to-use-map-control.md)

## Next steps

In this quickstart, you created your Azure Maps account and created a demo application. Take a look at the following tutorials to learn more about Azure Maps:

> [!div class="nextstepaction"]
> [Search nearby points of interest with Azure Maps](tutorial-search-location.md)