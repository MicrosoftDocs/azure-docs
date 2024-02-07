---
title: Manage Azure Native Qumulo Scalable File Service
description: This article describes how to manage Azure Native Qumulo Scalable File Service in the Azure portal. 

ms.topic: how-to 
ms.date: 11/15/2023
ms.custom:
  - ignite-2023
---


# Manage Azure Native Qumulo Scalable File Service

This article describes how to manage your instance of Azure Native Qumulo Scalable File Service.

## Manage the Qumulo resource 

1. In the Azure portal, browse to your instance of Azure Native Qumulo Scalable File Service.

1. On the **Resource** menu, select **Overview** to see some of the settings for your Qumulo resource.

   :::image type="content" source="media/qumulo-how-to-manage/qumulo-overview.png" alt-text="Screenshot that shows selections for getting details about a Qumulo resource.":::

1. The **Resource** menu has other settings that you can examine and change. For example, selecting **IP addresses** displays the IP addresses that you can use to manage the file system.

   :::image type="content" source="media/qumulo-how-to-manage/qumulo-ip-addresses.png" alt-text="Screenshot that shows selections for displaying IP addresses associated with a file system.":::

## Configure and use the Qumulo file system

For help with configuring and using your file system, see the [Qumulo documentation hub](https://docs.qumulo.com/azure-guide/).

## Delete the Qumulo file system

To delete your Qumulo file system, you delete your deployment of Azure Native Qumulo Scalable File Service:

1. In the Azure portal, select your deployment of Azure Native Qumulo Scalable File Service.
1. On the **Resource** menu, select **Overview**.
1. Select **Delete**.
1. Confirm that you want to delete Azure Native Qumulo Scalable File Service, along with associated data and other resources attached to the service.
1. Select **Delete**. This action is not reversible. The data contained in the file system is permanently deleted.

:::image type="content" source="media/qumulo-how-to-manage/qumulo-delete.png" alt-text="Screenshot of a Qumulo overview with the delete button.":::

## Next steps
- [Quickstart: Get started with Azure Native Qumulo Scalable File Service](qumulo-create.md)
- [Troubleshoot Azure Native Qumulo Scalable File Service](qumulo-troubleshoot.md)
- Get started with Azure Native Qumulo Scalable File Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview)
