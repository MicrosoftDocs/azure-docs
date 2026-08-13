---
title: Manage IP Addresses with Azure Virtual Network Manager
description: Manage IP addresses in Azure Virtual Network Manager to prevent overlapping CIDR ranges. Learn how to create pools, allocate CIDRs, and delegate IPAM access.
author: mbender-ms
ms.author: mbender
ms.reviewer: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 07/29/2026
ms.custom:
  - references_regions
  - sfi-image-nochange
#customer intent: As a cloud network engineer, I want to set up IP address management (IPAM) in my network manager instance, so that I can centrally plan and track address space for my organization.
---

# Manage IP addresses with Azure Virtual Network Manager

[!INCLUDE [virtual-network-manager-ipam](../../includes/virtual-network-manager-ipam.md)]

Azure Virtual Network Manager enables you to manage IP addresses by creating and assigning IP address pools to your virtual networks. This article shows you how to create and assign IP address pools to your virtual networks by using IP address management (IPAM) in Azure Virtual Network Manager.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- An existing network manager instance. If you don't have a network manager instance, see [Create a network manager instance](create-virtual-network-manager-portal.md).
- A virtual network that you want to associate with an IP address pool.
- To create and manage IP address pools, you need the **Network Contributor** role on the network manager. Classic Admin and legacy authorization aren't supported.
- To delegate pool access, you need the `Microsoft.Authorization/roleAssignments/write` permission at the pool scope or higher, such as **Role Based Access Control Administrator**. For more information, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

## Create an IP address pool

In this step, you create an IP address pool for your virtual network.

1. In the Azure portal, search for and select **Network managers**.
1. Select your network manager instance.
1. In the left menu, under **IP address management**, select **IP address pools**.
1. Select **+ Create** or **Create** to create a new IP address pool.
1. In the **Create an IP address pool** window, enter the following information:

    | Field | Description |
    | --- | --- |
    | **Name** | Enter a name for the IP address pool. |
    | **Display name** | Optionally, enter a friendly display name for the pool. |
    | **Region** | Select the Azure region for the pool. |
    | **Description** | Optionally, enter a description for the IP address pool. |
    | **Parent pool** | For a root pool, select **None**. For a child pool, select the parent pool. |

    :::image type="content" source="media/how-to-manage-ip-addresses/create-root-pool.png" alt-text="Screenshot showing settings for creating a root IP address pool." :::

1. Select **Next** or the **IP addresses** tab.
1. Under **Starting address**, enter the IP address range for the pool.

    :::image type="content" source="media/how-to-manage-ip-addresses/set-pool-ip-range-thumb.png" alt-text="Screenshot of IP address range settings for a root pool." lightbox="media/how-to-manage-ip-addresses/set-pool-ip-range.png":::

1. Select **Review + create** and then **Create** to create the IP address pool.
1. After Azure creates the pool, open it and verify that **Pool address space** shows the range you entered.
1. Repeat these steps for another root or child pool.

## Associate a virtual network with an IP address pool

In this step, you associate an existing virtual network with an IP address pool on the pool's **Allocations** page.

1. Browse to your network manager instance and select your IP address pool.
1. From the left menu, select **Allocations** under **Settings** or select **Allocate**.
1. In the **Allocations** window, select **+ Create** > **Associate resources**. The **Associate resources** option allocates a CIDR to an existing virtual network.
1. In the **Select resources** window, select the virtual networks you want to associate with the IP address pool and then choose **Select**.
1. Verify the virtual network is listed.

   :::image type="content" source="media/how-to-manage-ip-addresses/ip-address-pool-allocation-statistics.png" alt-text="Screenshot of IP address pool allocations and statistics.":::

> [!NOTE]
> In addition to associating resources, you can allocate address spaces to a child pool or a static CIDR block from the pool's **Allocations** page.

## Create static CIDR blocks for a pool

In this step, you create a static CIDR block for a pool. This block helps you allocate space that's outside Azure or used by Azure resources that IPAM doesn't support. For example, you can allocate a CIDR in the pool to address space in your on-premises environment, a Virtual WAN hub, or Azure VMware Private Cloud.

1. Browse to your IP address pool.
1. Select **Allocate** or **Allocations** under **Settings**.
1. In **Allocations**, select **+ Create** > **Allocate static CIDRs**.
1. In **Allocate static CIDRs from pool**, enter the following information:

    | Field | Description |
    | --- | --- |
    | **Name** | Enter a name for the static CIDR block. |
    | **Description** | Optionally, enter a description for the static CIDR block. |
    | **Starting address** | Enter the first IP address in the range. |
    | **Size** | Select the CIDR prefix and address count. |
    | **Address range** | Verify the calculated address range. |

    :::image type="content" source="media/how-to-manage-ip-addresses/create-static-cidr-reservation.png" alt-text="Screenshot of Allocate static CIDR from pool window with address range for CIDR reservation.":::

1. Select **Allocate**.

## Review allocation usage

In this step, you review the address space and allocations for the IP address pool.

1. Browse to your IP address pool.
1. Select **Allocations** under **Settings**.
1. In the **Allocations** window, you can review all of the statistics for the address pool, including:

    | Field | Description |
    | --- | --- |
    | **Pool address space** | The total address space in the pool. |
    | **Allocated address space** | The address ranges allocated to child pools, resources, and static CIDRs. |
    | **Available address space** | The address ranges that remain available for allocation. |
    | **Available address count** | The number of IP addresses that remain available. |
    | **IP allocation** | The percentage and number of addresses allocated from the pool. |

    :::image type="content" source="media/how-to-manage-ip-addresses/review-ip-address-pool-allocations.png" alt-text="Screenshot of an IP address pool's allocations and statistics for the pool.":::

1. For each allocation, you can review the following information:

    | Field | Description |
    | --- | --- |
    | **Name** | The name of the allocated resource or static CIDR. |
    | **Address space** | The CIDR allocated from the pool. |
    | **Address count** | The number of addresses in the allocation. |
    | **Status** | The current allocation status. |

    :::image type="content" source="media/how-to-manage-ip-addresses/review-ip-address-pool-allocations-by-resource.png" alt-text="Screenshot showing details for individual IP address pool allocations.":::

## Delegate permissions for IP address management (IPAM)

In this step, assign the **IPAM Pool User** role so another user can view and allocate address space from the pool. This role doesn't grant permission to modify the pool itself. For more information, see [Azure role-based access control (RBAC)](../role-based-access-control/check-access.md).

1. Browse to your IP address pool.
1. In the left menu, select **Access control (IAM)**.
1. In the **Access control (IAM)** window, select **+ Add** > **Add role assignment**.
1. Under **Role**, select **IPAM Pool User** through the search bar under the **Job function roles** tab, and then select **Next**.
1. On the **Members** tab, select how you want to assign access to the role. You can assign access to a user, group, or service principal, or you can use a managed identity.
1. Choose **+ Select members** and then **Select** the user, group, service principal, or managed identity that you want to assign the role to.
1. Select **Review + assign** and then **Assign** to delegate permissions to the user.

> [!NOTE]
> If the assigned user can't discover the pool or virtual networks, also grant the **Network Manager Read** role at the network manager scope.

## Create a virtual network with a nonoverlapping CIDR range

In this step, you create a virtual network with a nonoverlapping CIDR range by allowing IPAM to automatically provide the CIDR.

# [Azure portal](#tab/azureportal)

1. In the Azure portal, search for and select **Virtual networks**.
1. Select **+ Create**.
1. On the **Basics** tab, enter the following information:

    | Field | Description |
    | --- | --- |
    | **Subscription** | Select the subscription managed by a Network Manager management scope. |
    | **Resource group** | Select the resource group for the virtual network. |
    | **Name** | Enter a name for the virtual network. |
    | **Region** | Select the region for the virtual network.|

1. Select the **IP addresses** tab or **Next** > **Next**.
1. On the **IP addresses** tab, select the **Allocate using IP address pools** checkbox.
1. In the **Select an IP address pool** window, select the IP address pool that you want to associate with the virtual network and then choose **Save**. You can select at most one IPv4 pool and one IPv6 pool for association to a single virtual network.

    :::image type="content" source="media/how-to-manage-ip-addresses/virtual-network-create-select-ip-address-pool-thumb.png" alt-text="Screenshot of Select an IP address pool with IP address pool selected." lightbox="media/how-to-manage-ip-addresses/virtual-network-create-select-ip-address-pool.png":::

1. From the dropdown menu next to your IP address pool, select the size for the virtual network.

    :::image type="content" source="media/how-to-manage-ip-addresses/virtual-network-create-select-address-space-size.png" alt-text="Screenshot of Create virtual network window with IP address size selection.":::

1. Select **Review + create** and then **Create** to create the virtual network.

# [Azure Resource Manager template](#tab/armtemplate)

In this step, you create a virtual network with a nonoverlapping CIDR range by using an Azure Resource Manager template.

1. Sign in to Azure and search for **Deploy a custom template**.
1. In **Custom deployment**, select **Build your own template in the editor**.
1. Copy the following template into the editor:

    ```json
       {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "virtualNetworkName": {
                "defaultValue": "virtual-network",
                "type": "String",
                "metadata": {
                    "description": "VNet name"
                }
            },
            "location": {
                "defaultValue": "[resourceGroup().location]",
                "type": "String",
                "metadata": {
                    "description": "Location for all resources."
                }
            },
            "poolResourceID": {
                "defaultValue": "/subscriptions/<subscriptionId>/resourceGroups/resourceGroupName/providers/Microsoft.Network/networkManagers/<networkManagerName>/ipamPools/<ipAddressPoolName>",
                "type": "String",
                "metadata": {
                    "description": "Enter the Resource ID for your IP Address Pool. You can find this in the JSON View in the resource's overview window."
                }
            },
            "numberOfIPAddresses": {
                "defaultValue": "256",
                "type": "String",
                "metadata": {
                    "description": "Enter the number of IP addresses for the virtual network."
                }
            }
        },
        "resources": [
            {
                "type": "Microsoft.Network/virtualNetworks",
                "apiVersion": "2024-01-01",
                "name": "[parameters('virtualNetworkName')]",
                "location": "[parameters('location')]",
                "properties": {
                    "addressSpace": {
                        "ipamPoolPrefixAllocations": [
                            {
                                "pool": {
                                    "id": "[parameters('poolResourceID')]"
                                },
                                "numberOfIpAddresses": "[parameters('numberOfIPAddresses')]"
                            }
                        ]
                    }
                }
            }
        ]
    }

    ```

1. In **Custom deployment**, enter or select the following information:

    | Field | Description |
    | --- | --- |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select the resource group for the virtual network. In this example, the resource group is **resource-group**. |
    | **Region** | Select the deployment region. |
    | **Virtual Network Name** | Enter a name for the virtual network. The template defaults to **virtual-network**. |
    | **Location** | Keep the default resource group location, or enter a supported Azure location name. |
    | **Pool Resource ID** | Enter the complete resource ID of the IP address pool. |
    | **Number of IP Addresses** | Enter the number of addresses to allocate, such as `256`. |

    :::image type="content" source="media/how-to-manage-ip-addresses/custom-deployment-template.png" alt-text="Screenshot of custom deployment page with values.":::

1. Select **Review + create** and then **Create** to create the virtual network.

---

## Next steps

> [!div class="nextstepaction"]
> [What is IP address management (IPAM) in Azure Virtual Network Manager](./concept-ip-address-management.md)

