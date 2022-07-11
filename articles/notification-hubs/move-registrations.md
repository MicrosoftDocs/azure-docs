---
title: Move Azure Notification Hubs resources from one region to another 
description: Learn how to move Azure Notification Hubs resources to a different Azure region. 
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
ms.topic: how-to
ms.date: 09/07/2021
ms.custom: template-how-to
---

# Move resources between Azure regions

This article describes how to move Azure Notification Hubs resources to a different Azure region. At a high level, the process is:

1. Create a destination namespace with a different name.
1. Export the registrations from the previous namespace.
1. Import the registrations into the new namespace in the desired region.

## Overview

In some scenarios, you might need to move service resources between Azure regions for various business reasons. They might move to a newly available region, you might want to deploy features or services available only in a specific region, move due to internal policy or compliance requirements, or to solve capacity issues.

Azure Notification Hubs namespace names are unique, and registrations are per hub, so to perform such a move, you must create a new hub in the desired region, then move the registrations along with all other relevant data to the newly created namespace.

## Create a Notification Hubs namespace with a different name

Follow these steps to create a new Notification Hubs namespace. Fill in all the required information in the **Basics** tab, including the desired destination region for the namespace.

[!INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]

Once the new namespace has been created, ensure that you set the PNS credentials in the new namespace and create equivalent policies in the new namespace.

## Export/import registrations

Once the new namespace has been created in the region to which you want to move the resource, export all the registrations in bulk and import them into the new namespace. To do so, see [Export and import Azure Notification Hubs registrations in bulk](export-modify-registrations-bulk.md).

## Delete the previous namespace (optional)

After completing the registration export from your old namespace to the new namespace, if desired you can delete the old namespace.

1. Go to the existing namespace in the previous region.

2. Click **Delete**, and then re-enter the namespace name in the **Delete namespace** pane.

3. Click **Delete** at the bottom of the **Delete namespace** pane.

## Next steps

The following articles are examples of other services that have a region-move article in place.

- [Move NSGs to another region](../virtual-network/move-across-regions-nsg-portal.md)
- [Move public IP addresses to another region](../virtual-network/move-across-regions-publicip-portal.md)
- [Move a storage account to another region](../storage/common/storage-account-move.md?tabs=azure-portal&toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
- [Move resources across regions (from resource group)](../resource-mover/move-region-within-resource-group.md)
