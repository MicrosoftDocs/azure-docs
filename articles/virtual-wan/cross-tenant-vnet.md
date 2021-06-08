---
title: 'Connect cross-tenant VNets to a hub:PowerShell'
titleSuffix: Azure Virtual WAN
description: This article helps you connect cross-tenant VNets to a virtual hub using PowerShell.
services: virtual-wan
author: wtnlee

ms.service: virtual-wan
ms.topic: how-to
ms.date: 09/28/2020
ms.author: wellee

---
# Connect cross-tenant VNets to a Virtual Wan hub

This article helps you use Virtual WAN to connect a VNet to a virtual  hub in a different tenant. This architecture is useful if you have client workloads that must be connected to be the same network, but are on different tenants. For example, as shown in the following diagram, you can connect a non-Contoso VNet (the Remote Tenant) to a Contoso virtual  hub (the Parent Tenant).

:::image type="content" source="./media/cross-tenant-vnet/connectivity.png" alt-text="Set up routing configuration" :::

In this article, you learn how to:

* Add another tenant as a Contributor on your Azure subscription.
* Connect a cross tenant VNet to a virtual hub.

The steps for this configuration are performed using a combination of the Azure portal and PowerShell. However, the feature itself is available in PowerShell and CLI only.

## Before You Begin

### Prerequisites

To use the steps in this article, you must have the following configuration already set up in your environment:

* A virtual WAN and virtual hub in your parent subscription.
* A virtual network configured in a subscription in a different (remote) tenant.
* Make sure that the VNet address space in the remote tenant does not overlap with any other address space within any other VNets already connected to the parent virtual hub.

### Working with Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell.md)]

## <a name="rights"></a>Assign permissions

In order for the parent subscription with the virtual hub to modify and access the virtual networks in the remote tenant, you need to assign **Contributor** permissions to your parent subscription from the remote tenant subscription.

1. Add the **Contributor** role assignment to the parent account (the one with the virtual WAN hub). You can use either PowerShell, or the Azure portal to assign this role. See the following **Add or remove role assignments** articles for steps:

   * [PowerShell](../role-based-access-control/role-assignments-powershell.md)
   * [Portal](../role-based-access-control/role-assignments-portal.md)

1. Next, add the remote tenant subscription and the parent tenant subscription to the current session of PowerShell. Run the following command. If you are signed into the parent, you only need to run the command for the remote tenant.

   ```azurepowershell-interactive
   Connect-AzAccount -SubscriptionId "[subscription ID]" -TenantId "[tenant ID]"
   ```

1. Verify that the role assignment is successful by logging into Azure PowerShell using the parent credentials, and running the following command:

   ```azurepowershell-interactive
   Get-AzSubscription
   ```

1. If the permissions have successfully propagated to the parent and have been added to the session, the subscription owned by the parent **and** remote tenant will both show up in the output of the command.

## <a name="connect"></a>Connect VNet to hub

In the following steps, you will switch between the context of the two subscriptions as you link the virtual network to the virtual hub. Replace the example values to reflect your own environment.

1. Make sure you are in the context of your remote account by running the following command:

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionId "[remote ID]"
   ```

1. Create a local variable to store the metadata of the virtual network that you want to connect to the hub.

   ```azurepowershell-interactive
   $remote = Get-AzVirtualNetwork -Name "[vnet name]" -ResourceGroupName "[resource group name]"
   ```

1. Switch back over to the parent account.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionId "[parent ID]"
   ```

1. Connect the VNet to the hub.

   ```azurepowershell-interactive
   New-AzVirtualHubVnetConnection -ResourceGroupName "[parent resource group name]" -VirtualHubName "[virtual hub name]" -Name "[name of connection]" -RemoteVirtualNetwork $remote
   ```

1. You can view the new connection in either PowerShell, or the Azure portal.

   * **PowerShell:** The metadata from the newly formed connection will show in the PowerShell console if the connection was successfully formed.
   * **Azure portal:** Navigate to the virtual hub, **Connectivity -> Virtual Network Connections**. You can view the pointer to the connection. To see the actual resource you will need the proper permissions.
   
## <a name="troubleshoot"></a>Troubleshooting

* Verify that the metadata in $remote (from the preceding [section](#connect)) matches the information from the Azure portal.
* You can verify permissions using the IAM settings of the remote tenant resource group, or using Azure PowerShell commands (Get-AzSubscription).
* Make sure quotes are included around the names of resource groups or any other environment-specific variables (eg. "VirtualHub1" or "VirtualNetwork1").

## Next steps

For more information about Virtual WAN, see:

* The Virtual WAN [FAQ](virtual-wan-faq.md)
