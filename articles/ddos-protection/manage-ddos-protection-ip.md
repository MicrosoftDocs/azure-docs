---
title: Manage Azure DDoS IP Protection using the Azure portal
description: Learn how to use Azure DDoS IP Protection to mitigate an attack.
services: ddos-protection
documentationcenter: na
author: AbdullahBell
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: ddos-protection
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services

ms.custom: fasttrack-edit
ms.date: 09/23/2022
ms.author: abell


---

# Quickstart: Create and configure Azure DDoS IP Protection

Get started with Azure DDoS IP Protection by using the Azure portal.
In this quickstart, you'll enable DDoS IP protection and link it to a public IP address.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Sign in to the Azure portal at https://portal.azure.com. Ensure that your account is assigned to the [network contributor](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json#network-contributor) role or to a [custom role](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) that is assigned the appropriate actions listed in the how-to guide on [Permissions](manage-permissions.md).

## Enable DDoS IP Protection on a public IP address

1. Select **Create a resource** in the upper left corner of the Azure portal.
1. Select **Networking**, and then select **Public IP address**.
1. Select **Create**.
1. Enter or select the following values.

    | Setting                 | Value                       |
    | ---                     | ---                         |
    | IP Version              | Select IPv4              |    
    | SKU                     | Select **Standard**         |
    | Tier                   | Select **Regional**     |
    | Name                    | Enter **myStandardPublicIP**          |
    | IP address assignment   | Locked as **Static**                |
    | Routing Preference     | Select **Microsoft network**. |
    | Idle Timeout (minutes)  | Leave the default of **4**.        |
    | DNS name label          | Leave the value blank.    |
    | Subscription            | Select your subscription   |
    | Resource group          | Select **Create new**, enter **MyResourceGroup**. </br> Select **OK**. |
    | Location                | Select **(US) East US 2**     |
    | Availability Zone       | Select **No Zone** |

1. Select **Create**.

### Enable DDoS IP Protection for an existing IP Address


## Validate and test

First, check the details of your DDoS IP protection plan:

1. Select **All services** on the top, left of the portal.
1. Enter *DDoS* in the **Filter** box. When **DDoS protection plans** appear in the results, select it.
1. Select your DDoS protection plan from the list.

The _MyVnet_ virtual network should be listed.

## View protected resources
Under **Protected resources**, you can view your protected virtual networks and public IP addresses, or add more virtual networks to your DDoS protection plan:



## Clean up resources

You can keep your resources for the next tutorial. If no longer needed, delete the _MyResourceGroup_ resource group. When you delete the resource group, you also remove DDoS IP Protection and all its related resources.

   >[!WARNING]
   >This action is irreversible.

1. In the Azure portal, search for and select **Resource groups**, or select **Resource groups** from the Azure portal menu.

1. Filter or scroll down to find the _MyResourceGroup_ resource group.

1. Select the resource group, then select **Delete resource group**.

1. Type the resource group name to verify, and then select **Delete**.

To disable DDoS IP protection for a public IP address:

1. Enter the name of the IP address you want to disable DDoS IP Protection for in the **Search resources, services, and docs box** at the top of the portal. When the name of the virtual network appears in the search results, select it.
1. Under **DDoS IP Protection**, select **Disable**.


## Next steps

To learn how to view and configure telemetry for your DDoS protection plan, continue to the tutorials.

> [!div class="nextstepaction"]
> [View and configure DDoS protection telemetry](telemetry.md)
