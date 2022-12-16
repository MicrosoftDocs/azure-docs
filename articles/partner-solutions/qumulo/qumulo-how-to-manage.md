---
title: Manage Azure Native Qumulo Scalable File Service
description: This article describes how to manage Azure Native Qumulo Scalable File Service in the Azure portal. 

ms.topic: how-to #Required; leave this attribute/value as-is.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
ms.date: 12/31/2022
---


# Manage Azure Native Qumulo Scalable File Service

This article describes how to manage your instance of Azure Native Qumulo Scalable File Service.

## Get information about a resource

To see the details of your Qumulo resource in the Azure portal, select **Overview** on the **Resource** menu.

:::image type="content" source="media/qumulo-how-to-manage/image5.png" alt-text="Screenshot that shows selections for getting details about a Qumulo resource.":::
   
These details include: 

<!-- This doesn't match the screenshot. I would rather not mention these as it creates a doc maintenance problem. -->

- Login URL for the Qumulo Core Web UI
- Location of the file system
- Virtual network and subnet details
- Subscription
- Azure Marketplace status of the service
- Pricing plan
- Storage type

To display the IP addresses that you can use to manage the file system, select **IP addresses** on the **Resource** menu.

:::image type="content" source="media/qumulo-how-to-manage/qumulo-ip-addresses.png" alt-text="Screenshot that shows selections for displaying IP addresses associated with a file system.":::

## Configure and use the Qumulo file system

For help with configuring and using your file system, see the [Qumulo documentation hub](https://docs.qumulo.com/cloud-guide/).

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
