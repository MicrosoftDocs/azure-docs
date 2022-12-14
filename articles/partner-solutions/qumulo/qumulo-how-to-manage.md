---
title: Manage your Azure Native Qumulo Scalable File Service integration
description: This article describes how to manage Azure Native Qumulo Scalable File Service on the Azure portal. 

ms.topic: how-to #Required; leave this attribute/value as-is.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
ms.date: 12/31/2022
---


# How to Manage the Azure Native Qumulo Scalable File Service

This article describes how to manage Azure Native Qumulo Scalable File Service.

## Resource overview

To see the details of you of your Qumulo resource, select **Overview** in the Resource menu on the left.

   :::image type="content" source="media/qumulo-how-to-manage/image5.png" alt-text="Screenshot of a Qumulo instance with overview selected in the Resource menu.":::
   Screenshot

These details include the following: 

<!-- This doesn't match the screenshot. I would rather not mention these as it creates a doc maintenance problem. -->

- **Resource group**
- Qumulo Core Web UI Login URL
- Location of the filesystem
- Virtual network and subnet details
- Subscription
- Marketplace Status of the service
- Pricing plan
- Storage type

Selecting the **IP addresses** in the Resource menu displays the IP addresses associated with the filesystem that can be used to use and manage the file system.

  Screenshot
:::image type="content" source="media/qumulo-how-to-manage/qumulo-ip-addresses.png" alt-text="Screenshot showing IP Addresses selected in the Resource menu.":::

## Using Qumulo

See [Qumulo’s documentation hub](https://docs.qumulo.com/cloud-guide/) for help configuring and using your file system.

## Delete the Qumulo FileSystem

To delete a deployment of Azure Native Qumulo File System service.

1. Using the portal, select your deployment of Azure Native Qumulo File System Service.
1. Select the **Overview** on the left.
1. Select **Delete**.
1. Confirm that you want to delete the Azure Native Qumulo File System Service along with associated data and other resources attached to the service.
1. Click **Delete**. This action is not reversible. The data contained in the file system is permanently deleted.


:::image type="content" source="media/qumulo-how-to-manage/qumulo-delete.png" alt-text="Screenshot of Qumulo overview with the delete symbol highlighted with red box.":::
  Screenshot

## Next Steps
- [QuickStart: Get started with Azure Native Qumulo Scalable File Service](qumulo-create.md)
- [Troubleshoot Azure Native Qumulo Scalable File Service](qumulo-troubleshoot.md)
