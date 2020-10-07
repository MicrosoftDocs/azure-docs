---
title: Manage Azure Maps Creator
description: In this article, you'll learn how to manage Azure Maps Creator.
author: anastasia-ms
ms.author: v-stharr
ms.date: 05/18/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Manage Azure Maps Creator

Azure Maps Creator lets you create private indoor map data. Using the Azure Maps API and the Indoor Maps module, you can develop interactive and dynamic indoor map web applications. Currently, Creator is only available in the United States using the S1 pricing tier.

This article takes you through the steps to create and delete a Creator resource in an Azure Maps account.

## Create Creator Resource

1. Sign in to the [Azure portal](https://portal.azure.com)

2. Select your Azure Maps account. If you can't see your Azure Maps account under the **Recent resources**, then navigate to the Azure portal menu. Select **All resources**. Find and select your Azure Maps account.

    ![Azure Maps Portal home page](./media/how-to-manage-creator/select-maps-account.png)

3. Once you're on the Azure Maps account page, navigate to the **Overview** option under **Creator**. Click  **Create**  to create an Azure Maps Creator resource.

    ![Create Azure Maps Creator page](./media/how-to-manage-creator/creator-blade-settings.png)

4. Enter the name and location for your Creator resource. Currently, Creator is only supported in the United States. Click **Review + create**.

   ![Enter Creator account information page](./media/how-to-manage-creator/creator-creation-dialog.png)

5. Review your settings and click **Create**.

    ![Confirm Creator account settings page](./media/how-to-manage-creator/creator-create-dialog.png)

6. When the deployment completes, you'll see a page with a success or a failure message.

   ![Resource deployment status page](./media/how-to-manage-creator/creator-resource-created.png)

7. Click **Go to resource**. Your Creator resource view page shows the status of your Creator resource and the chosen demographic region.

    ![Creator status page](./media/how-to-manage-creator/creator-resource-view.png)

   >[!NOTE]
   >From the Creator resource page, you can navigate back to the Azure Maps account it belongs to by clicking Azure Maps Account.

## Delete Creator Resource

To delete the Creator resource, navigate to your Azure Maps account. Select **Overview** under **Creator**. Click the **Delete** button.

>[!WARNING]
>When you delete the Creator resource of your Azure Maps account, you will also delete the datasets, tilesets, and feature statesets created using Creator services.

![Creator page with delete button](./media/how-to-manage-creator/creator-delete.png)

Click the **Delete** button and type your Creator name to confirm deletion. Once the resource is deleted, you'll see a confirmation page, like in the image below:

![Creator page with delete confirmation](./media/how-to-manage-creator/creator-confirmdelete.png)

## Authentication

Creator inherits Azure Maps Access Control (IAM) settings. All API calls for data access must be sent with authentication and authorization rules.

Creator usage data is incorporated in your Azure Maps usage charts and activity log.  For more information, see [Manage authentication in Azure Maps](https://docs.microsoft.com/azure/azure-maps/how-to-manage-authentication).

## Access to Creator services

Creator services are accessible only from within the location selected during creation. If calls are made to Creator services from outside the selected location, a user error message will be returned. To make calls from outside the selected location, the service URL must include the geographic prefix for the selected locations. For example, if Creator is created in the United States, all calls to the Conversion service must be submitted to `us.atlas.microsoft.com/conversion/convert`.

Also, all data imported into Creator should be uploaded into the same geographical location as the Creator resource. For example, if Creator is provisioned in the United Stated, all raw data should be uploaded via `us.atlas.microsoft.com/mapData/upload`.

## Next steps

Introduction to Creator for indoor mapping:

> [!div class="nextstepaction"]
> [Data Upload](creator-indoor-maps.md#upload-a-drawing-package)

> [!div class="nextstepaction"]
> [Data Conversion](creator-indoor-maps.md#convert-a-drawing-package)

> [!div class="nextstepaction"]
> [Dataset](creator-indoor-maps.md#datasets)

> [!div class="nextstepaction"]
> [Tileset](creator-indoor-maps.md#tilesets)

> [!div class="nextstepaction"]
> [Feature State set](creator-indoor-maps.md#feature-statesets)

Learn how to use the Creator to render indoor maps in your application:

> [!div class="nextstepaction"]
> [Azure Maps Creator tutorial](tutorial-creator-indoor-maps.md)

> [!div class="nextstepaction"]
> [Indoor map dynamic styling](indoor-map-dynamic-styling.md)

> [!div class="nextstepaction"]
> [Use the Indoor Maps module](how-to-use-indoor-module.md)