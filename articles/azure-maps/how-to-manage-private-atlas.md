---
title: Manage your Azure Maps Private Atlas | Microsoft Azure Maps 
description: In this article, you'll learn how to use the Azure portal to manage your Private Atlas in your Microsoft Azure Maps account.
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/17/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Manage Private Atlas for your Azure Maps

Private Atlas (PA) makes it possible to create private indoor maps and develop web applications using the Azure Maps APIs and the Indoor Maps module. Private Atlas is currently available in the United States, only.

You can manage the Private Atlas for your Azure Maps account through the [Azure portal](https://ms.portal.azure.com/). After you deploy a Private Atlas, you can implement the Indoor Maps module and the Azure Maps APIs for the Private Atlas in your web application.

Your Azure Maps account must [use the S1 pricing tier](how-to-manage-pricing-tier.md) because Private Atlas isn't available for the S0 tier. You can't change your Azure Maps account to the S0 pricing tier while the Private Atlas is active. Delete your Private Atlas first, then you can switch to the S0 tier. For each Azure Maps account, you can have up to one Private Atlas.

Private Atlas inherits your Azure Maps Access Control (IAM) settings. Meaning that all your permission and roles apply to the Private Atlas. Also, your Private Atlas usage data is incorporated with your Azure Maps usage charts and activity log. The next sections show you how to create a Private Atlas, and how to delete it.

Before you begin, if you don't have an Azure subscription, [create an Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Once you make an Azure account, you need to [create an Azure Maps account](how-to-manage-account-keys.md) to access the Private Atlas resource.

## Create Private Atlas

1. Sign in to the [Azure portal](https://portal.azure.com)

2. Select your Azure Maps account. If you can't see your Azure Maps account under the **Recent resources**, then navigate to the Azure portal menu. Select **All resources**, find, and select your Azure Maps account.

    <center>

    ![ ![Select your Azure Maps account](./media/how-to-manage-private-atlas/select-your-azure-maps-account.png) ](./media/how-to-manage-private-atlas/select-your-azure-maps-account.png)

    </center>

3. Once you're on the Azure Maps account page, navigate to the **Overview** option under the **Private Atlas**.

    ![Overview Option](./media/how-to-manage-private-atlas/.png)

4. Select the **create** button to create your Private Atlas. Enter the information for your Private Atlas account and select the location for your Private Atlas. Currently, the United States is the only supported geographical location.

    ![Private Atlas Account Information form](./media/how-to-manage-private-atlas/.png)

5. It may take a few minutes to deploy your Private Atlas. When the deployment completes, you'll see a page with a success or a failure message.

    ![Deployment landing page](./media/how-to-manage-private-atlas/.png)

6. Click on **go to resource**, your Private Atlas page should look like the page in the image below. It should show the status of your Private Atlas and the chosen demographic region.

    ![Private Atlas page](./media/how-to-manage-private-atlas/.png)


## Delete Private Atlas

You can delete the Private Atlas of your Azure Maps account using the Azure portal. By deleting it, you'll also delete the data sets, tile sets, and feature state sets created using the Private Atlas APIs.

Navigate to your Azure Maps account and select **Overview** under **Private Atlas**. If you have a Private Atlas for your Azure Maps account, then you'll see a **Delete** button.

![Private Atlas page with delete button](./media/how-to-manage-private-atlas/.png)

Click the **Delete** button, and type your Private Atlas name to confirm your desire to delete it. Once the resource is erased, you'll see a confirmation page, like in the image below:

## Next steps

Learn more about the Azure Maps API services for the Private Atlas:

> [!div class="nextstepaction"]
> [Data Conversion]()

> [!div class="nextstepaction"]
> [Dataset]()

> [!div class="nextstepaction"]
> [Tileset]()

> [!div class="nextstepaction"]
> [Feature State set]()

Learn how to use the Private Atlas to render indoor maps in your application:

> [!div class="nextstepaction"]
> [Indoor data management](indoor-data-management.md)

> [!div class="nextstepaction"]
> [Indoor map dynamic styling](indoor-map-dynamic-styling.md)

> [!div class="nextstepaction"]
> [Use the Indoor Maps module](how-to-use-indoor-module.md)