---
title: Manage Microsoft Azure Maps Creator
description: In this article, you'll learn how to manage Microsoft Azure Maps Creator.
author: anastasia-ms
ms.author: v-stharr
ms.date: 05/18/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps

---

# Manage Azure Maps Creator

You can use Azure Maps Creator to create private indoor map data. Using the Azure Maps API and the Indoor Maps module, you can develop interactive and dynamic indoor map web applications. For pricing information, see [Choose the right pricing tier in Azure Maps](choose-pricing-tier.md).

This article takes you through the steps to create and delete a Creator resource in an Azure Maps account.

## Create Creator resource

1. Sign in to the [Azure portal](https://portal.azure.com)

2. Navigate to the Azure portal menu. Select **All resources**, and then select your Azure Maps account.

      :::image type="content" border="true" source="./media/how-to-manage-creator/select-all-resources.png" alt-text="Select Azure Maps account":::

3. In the navigation pane, select **Creator overview**, and then select **Create**.

    :::image type="content" border="true" source="./media/how-to-manage-creator/creator-blade-settings.png" alt-text="Create Azure Maps Creator page":::

4. Enter the name, location, and map provisioning storage units for your Creator resource. Currently, Creator is supported only in the United States. Select **Review + create**.

   :::image type="content" source="./media/how-to-manage-creator/creator-creation-dialog.png" alt-text="Enter Creator account information page":::

5. Review your settings, and then select **Create**.

    :::image type="content" source="./media/how-to-manage-creator/creator-create-dialog.png" alt-text="Confirm Creator account settings page":::

    After the deployment completes, you'll see a page with a success or a failure message.

    :::image type="content" source="./media/how-to-manage-creator/creator-resource-created.png" alt-text="Resource deployment status page":::

6. Select **Go to resource**. Your Creator resource view page shows the status of your Creator resource and the chosen demographic region.
      :::image type="content" source="./media/how-to-manage-creator/creator-resource-view.png" alt-text="Creator status page":::

   >[!NOTE]
   >To return to the Azure Maps account, select **Azure Maps Account** in the navigation pane.

## Delete Creator resource

To delete the Creator resource:

1. In your Azure Maps account, select **Overview** under **Creator**.

2. Select **Delete**.

    >[!WARNING]
    >When you delete the Creator resource of your Azure Maps account, you also delete the conversions, datasets, tilesets, and feature statesets that were created using Creator services.

     :::image type="content" source="./media/how-to-manage-creator/creator-delete.png" alt-text="Creator page with delete button":::

3. You'll be asked to confirm deletion by typing in the name of your Creator resource. After the resource is deleted, you see a confirmation page that looks like the following:

     :::image type="content" source="./media/how-to-manage-creator/creator-confirm-delete.png" alt-text="Creator page with delete confirmation":::

## Authentication

Creator inherits Azure Maps Access Control (IAM) settings. All API calls for data access must be sent with authentication and authorization rules.

Creator usage data is incorporated in your Azure Maps usage charts and activity log.  For more information, see [Manage authentication in Azure Maps](./how-to-manage-authentication.md).

>[!Important]
>We recommend using:
>
> * Azure Active Directory (Azure AD) in all solutions that are built with an Azure Maps account using Creator services. For more information, on Azure AD, see [Azure AD authentication](azure-maps-authentication.md#azure-ad-authentication).
>
>* Role-based access control settings (RBAC). Using these settings, map makers can act as the Azure Maps Data Contributor role, and Creator map data users can act as the Azure Maps Data Reader role. For more information, see [Authorization with role-based access control](azure-maps-authentication.md#authorization-with-role-based-access-control).

## Access to Creator services

Creator services and services that use data hosted in Creator (for example, Render service), are accessible at a geographical URL. The geographical URL is determined by the location selected during creation. For example, if Creator is created in a region in the United States geographical location, all calls to the Conversion service must be submitted to `us.atlas.microsoft.com/conversions`. To view mappings of region to geographical location, [see Creator service geographic scope](creator-geographic-scope.md).

Also, all data imported into Creator should be uploaded into the same geographical location as the Creator resource. For example, if Creator is provisioned in the United States, all raw data should be uploaded via `us.atlas.microsoft.com/mapData/upload`.

## Next steps

Introduction to Creator services for indoor mapping:

> [!div class="nextstepaction"]
> [Data upload](creator-indoor-maps.md#upload-a-drawing-package)

> [!div class="nextstepaction"]
> [Data conversion](creator-indoor-maps.md#convert-a-drawing-package)

> [!div class="nextstepaction"]
> [Dataset](creator-indoor-maps.md#datasets)

> [!div class="nextstepaction"]
> [Tileset](creator-indoor-maps.md#tilesets)

> [!div class="nextstepaction"]
> [Feature State set](creator-indoor-maps.md#feature-statesets)

Learn how to use the Creator services to render indoor maps in your application:

> [!div class="nextstepaction"]
> [Azure Maps Creator tutorial](tutorial-creator-indoor-maps.md)

> [!div class="nextstepaction"]
> [Indoor map dynamic styling](indoor-map-dynamic-styling.md)

> [!div class="nextstepaction"]
> [Use the Indoor Maps module](how-to-use-indoor-module.md)
