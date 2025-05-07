---
title: Manage Microsoft Azure Maps Creator
titleSuffix:  Microsoft Azure Maps Creator
description: This article demonstrates how to manage Microsoft Azure Maps Creator.
author: faterceros
ms.author: aterceros
ms.date: 01/20/2022
ms.topic: how-to
ms.service: azure-maps
ms.subservice: creator
---

# Manage Azure Maps Creator

> [!NOTE]
>
> **Azure Maps Creator retirement**
>
> The Azure Maps Creator indoor map service is now deprecated and will be retired on 9/30/25. For more information, see [End of Life Announcement of Azure Maps Creator](https://aka.ms/AzureMapsCreatorDeprecation).

You can use Azure Maps Creator to create private indoor map data. Using the Azure Maps API and the Indoor Maps module, you can develop interactive and dynamic indoor map web applications. For pricing information, see the *Creator* section in [Azure Maps pricing].

This article takes you through the steps to create and delete a Creator resource in an Azure Maps account.

## Create Creator resource

1. Sign in to the [Azure portal].

2. Navigate to the Azure portal menu. Select **All resources**, and then select your Azure Maps account.

      :::image type="content" border="true" source="./media/how-to-manage-creator/select-all-resources.png" alt-text="A screenshot of the Azure portal showing the All resources selected in the Azure Services section of the page.":::

3. In the navigation pane, select **Creator**, then select the **Create** button.

    :::image type="content" border="true" source="./media/how-to-manage-creator/creator-blade-settings.png" alt-text="A screenshot of the Azure Maps Account page showing the Creator page with the Create button highlighted.":::

4. Enter the name, location, and map provisioning storage units for your Creator resource, then select **Review + create**.

   :::image type="content" source="./media/how-to-manage-creator/creator-creation-dialog.png" alt-text="A screenshot of the Azure Maps Create a Creator resource page showing the Creator name, storage units and location fields with suggested values and the Review + create button highlighted.":::

5. Review your settings, and then select **Create**. After the deployment completes, you'll see a page with a success or a failure message.

6. Select **Go to resource**. Your Creator resource view page shows the status of your Creator resource and the chosen demographic region.

   >[!NOTE]
   >To return to the Azure Maps account, select **Azure Maps Account** in the navigation pane.

## Delete Creator resource

To delete the Creator resource:

1. In your Azure Maps account, select **Creator**.

2. Select **Delete**.

    >[!WARNING]
    >When you delete the Creator resource of your Azure Maps account, you also delete the conversions, datasets and tilesets that were created using Creator services. Once a Creator resource is deleted, it cannot be undone.

     :::image type="content" source="./media/how-to-manage-creator/creator-delete.png" alt-text="A screenshot of the Azure Maps Creator Resource page with the delete button highlighted.":::

3. You're prompted to confirm deletion by typing in the name of your Creator resource. After the resource is deleted, you see a confirmation page that looks like the following example:

     :::image type="content" source="./media/how-to-manage-creator/creator-confirm-delete.png" alt-text="A screenshot of the Azure Maps Creator Resource deletion confirmation page.":::

## Authentication

Creator inherits Azure Maps Access Control (IAM) settings. All API calls for data access must be sent with authentication and authorization rules.

Creator usage data is incorporated in your Azure Maps usage charts and activity log.  For more information, see [Manage authentication in Azure Maps].

>[!Important]
>We recommend using:
>
> * Microsoft Entra ID in all solutions that are built with an Azure Maps account using Creator services. For more information, on Microsoft Entra ID, see [Microsoft Entra authentication].
>
>* Role-based access control settings (RBAC). Using these settings, map makers can act as the Azure Maps Data Contributor role, and Creator map data users can act as the Azure Maps Data Reader role. For more information, see [Authorization with role-based access control].

## Access to Creator services

Creator services and services that use data hosted in Creator (for example, Render service), are accessible at a geographical URL. The geographical URL determines the location selected during creation. For example, if Creator is created in a region in the United States geographical location, all calls to the Conversion service must be submitted to `us.atlas.microsoft.com/conversions`. To view mappings of region to geographical location, [see Creator service geographic scope].

## Next steps

Introduction to Creator services for indoor mapping:

> [!div class="nextstepaction"]
> [Upload a drawing package]

> [!div class="nextstepaction"]
> [Data conversion]

> [!div class="nextstepaction"]
> [Dataset]

> [!div class="nextstepaction"]
> [Tileset]

Learn how to use the Creator services to render indoor maps in your application:

> [!div class="nextstepaction"]
> [Use the Indoor Maps module]

[Authorization with role-based access control]: azure-maps-authentication.md#authorization-with-role-based-access-control
[Microsoft Entra authentication]: azure-maps-authentication.md#microsoft-entra-authentication
[Azure Maps pricing]: https://aka.ms/CreatorPricing
[Azure portal]: https://portal.azure.com
[Data conversion]: creator-indoor-maps.md#convert-a-drawing-package
[Dataset]: creator-indoor-maps.md#datasets
[Manage authentication in Azure Maps]: how-to-manage-authentication.md
[see Creator service geographic scope]: creator-geographic-scope.md
[Tileset]: creator-indoor-maps.md#tilesets
[Upload a drawing package]: creator-indoor-maps.md#upload-a-drawing-package
[Use the Indoor Maps module]: how-to-use-indoor-module.md
