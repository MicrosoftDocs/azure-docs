---
title: Create a NetApp Elastic account in Azure NetApp Files
description: Learn how to access Azure NetApp Files and create a NetApp account so that you can set up an Elastic service level capacity pool and create a volume.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 01/26/2026
ms.author: anfdocs
# Customer intent: As an IT administrator, I want to create an Elastic zone-redundant NetApp account in Azure NetApp Files, so that I can set up a capacity pool and manage storage volumes effectively.
---

# Create a NetApp Elastic account in Azure NetApp Files (preview)

Creating a NetApp account enables you to set up a capacity pool so that you can create a volume. You use the Azure NetApp Files pane to create a new NetApp account.

## Before you begin

* You must register your subscription for using the NetApp Resource Provider. For more information, see [Register the NetApp Resource Provider](azure-netapp-files-register.md).
* There are two types of NetApp accounts. If you plan to use Elastic zone-redundant storage, you must use a [NetApp Elastic account](elastic-zone-redundant-concept.md).

## Register for the Elastic zone-redundant storage

Elastic zone-redundant storage is currently in preview. To register for Elastic zone-redundant storage, submit a [waitlist request](https://forms.cloud.microsoft/r/RcEfunRDrz).

Waitlists requests are reviewed weekly. An Azure NetApp Files representative will contact you after your request has been reviewed. 

## Create an Elastic account

1. Log in to the Azure portal.
1. Access the Azure NetApp Files pane by using one of the following methods:
   * Search for **Azure NetApp Files** in the Azure portal search box.
   * Select **All services** in the navigation, and then filter to Azure NetApp Files.

   To make the Azure NetApp Files pane a favorite, select the star icon next to it.

1. Select **+ Create** to create a new NetApp account.
1. Provide the following information: 
    * Enter a **Name** for the NetApp account. 
    * Select the **Subscription** the NetApp account belongs to. 
    * Assign or create the **Resource group**. 
    * Select the **Region**. Ensure you select a [supported region](elastic-zone-redundant-concept.md#supported-regions).
    * Select **NetApp Elastic account** to designate the account for Elastic zone-redundant storage. 

    :::image type="content" source="./media/shared/elastic-account.png" alt-text="Screenshot of application volume group creation menu." lightbox="./media/shared/elastic-account.png":::

1. To finalize account creation, select **Create**. 

## Next steps 

* [Understand the Elastic zone-redundant storage](elastic-zone-redundant-concept.md)
* [Create an Elastic service level capacity pool](elastic-capacity-pool-task.md)
