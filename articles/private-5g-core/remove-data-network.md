---
title: Remove a Azure Private 5G Core data network
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to remove a data network from your private mobile network.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 01/07/2023
---

# Remove a data network from your AP5GC deployment

In this how-to guide, you'll learn how to remove a data network from your private mobile network. This involves deleting the data network, modifying the packet core's custom location temporarily, deleting the data network from the resource group, and reinstating the packet core's custom location configuration.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- You must already have one or more data networks in your AP5GC deployment.
- The data network that you want to delete must have no SIM policies associated with it. If the data network has one or more associated SIM policies data network removal will be prevented.

## Delete the data network from the packet core

1. Navigate to the **Packet Core Control Plane**.
1. Select **Modify packet core**.
1. Select the **Data networks** tab.
1. Toggle **Enable changes to configuration that require a reinstall to take effect** to **Enabled**.
1. Select the checkbox for the data network you want to delete.
1. Select **Delete**.
1. Select **Modify**.

## Remove the Azure Arc Custom Location from the packet core

Once the deletion of the data network has completed:

1. Navigate to the **Packet Core Control Plane**.
1. Select **Modify packet core**.
1. Make a note of the current **Azure Arc Custom Location**.
1. Change the **Azure Arc Custom Location** dropdown menu to **None**.
1. Select **Modify**.

## Check that the previous steps have completed correctly

Navigate to the **Packet Core Control Plane** and ensure the **Essentials** tab shows that:

- **Azure Arc Custom Location** shows **Configure a custom location**.
- **Packet core installation state** shows **Uninstalled**.

If either of the fields are not as expected, repeat the [Delete the data network from the packet core](#delete-the-data-network-from-the-packet-core) and [Remove the Azure Arc Custom Location from the packet core](#remove-the-azure-arc-custom-location-from-the-packet-core) as required.

## Remove the data network from the resource group

1. Navigate to your AP5GC resource group.
1. Select the checkbox for the data network resource you want to delete.
1. Select **Delete**

## Restore the Azure Arc Custom Location on the packet core

1. Navigate to the **Packet Core Control Plane**.
1. Select **Modify packet core**.
1. Change the **Azure Arc Custom Location** dropdown menu to the custom location noted during [Remove the Azure Arc Custom Location from the packet core](#remove-the-azure-arc-custom-location-from-the-packet-core).
1. Select **Modify**.
