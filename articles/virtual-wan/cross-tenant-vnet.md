---
title: 'Connect cross-tenant virtual networks to a hub: PowerShell'
titleSuffix: Azure Virtual WAN
description: This article helps you connect cross-tenant virtual networks to a virtual hub by using PowerShell.
services: virtual-wan
author: wtnlee

ms.service: virtual-wan
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 08/24/2023
ms.author: wellee
---
# Connect cross-tenant virtual networks to a Virtual WAN hub

This article helps you use Azure Virtual WAN to connect a virtual network to a virtual hub in a different tenant. This architecture is useful if you have client workloads that must be connected to be the same network but are on different tenants. For example, as shown in the following diagram, you can connect a non-Contoso virtual network (the remote tenant) to a Contoso virtual hub (the parent tenant).

:::image type="content" source="./media/cross-tenant-vnet/connectivity.png" alt-text="Diagram that shows a routing configuration with a parent tenant and a remote tenant." :::

In this article, you learn how to:

* Add another tenant as a Contributor on your Azure subscription.
* Connect a cross-tenant virtual network to a virtual hub.

The steps for this configuration use a combination of the Azure portal and PowerShell. However, the feature itself is available in PowerShell and the Azure CLI only.

>[!NOTE]
> You can manage cross-tenant virtual network connections only through PowerShell or the Azure CLI. You *cannot* manage cross-tenant virtual network connections in the Azure portal.

## Before you begin

### Prerequisites

To use the steps in this article, you must have the following configuration already set up in your environment:

* A virtual WAN and virtual hub in your parent subscription
* A virtual network configured in a subscription in a different (remote) tenant

Make sure that the virtual network address space in the remote tenant doesn't overlap with any other address space within any other virtual networks already connected to the parent virtual hub.

### Working with Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell.md)]

## <a name="rights"></a>Assign permissions

1. In the subscription of the virtual network in the remote tenant, add the Contributor role assignment to the administrator (the user who administers the virtual hub). Contributor permissions will enable the administrator to modify and access the virtual networks in the remote tenant. 

   You can use either PowerShell or the Azure portal to assign this role. See the following articles for steps:

   * [Assign Azure roles using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)
   * [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md)

1. Run the following command to add the remote tenant subscription and the parent tenant subscription to the current session of PowerShell. If you're signed in to the parent, you need to run the command for only the remote tenant.

   ```azurepowershell-interactive
   Connect-AzAccount -SubscriptionId "[subscription ID]" -TenantId "[tenant ID]"
   ```

1. Verify that the role assignment is successful. Sign in to Azure PowerShell by using the parent credentials and run the following command:

   ```azurepowershell-interactive
   Get-AzSubscription
   ```

   If the permissions have successfully propagated to the parent and have been added to the session, the subscriptions owned by the parent and the remote tenant will both appear in the output of the command.

## <a name="connect"></a>Connect a virtual network to a hub

In the following steps, you'll use commands to switch between the context of the two subscriptions as you link the virtual network to the virtual hub. Replace the example values to reflect your own environment.

1. Make sure you're in the context of your remote account:

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionId "[remote ID]"
   ```

1. Create a local variable to store the metadata of the virtual network that you want to connect to the hub:

   ```azurepowershell-interactive
   $remote = Get-AzVirtualNetwork -Name "[vnet name]" -ResourceGroupName "[resource group name]"
   ```

1. Switch back to the parent account:

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionId "[parent ID]"
   ```

1. Connect the virtual network to the hub:

   ```azurepowershell-interactive
   New-AzVirtualHubVnetConnection -ResourceGroupName "[parent resource group name]" -VirtualHubName "[virtual hub name]" -Name "[name of connection]" -RemoteVirtualNetwork $remote
   ```

You can view the new connection in either PowerShell or the Azure portal:

* In the PowerShell console, the metadata from the newly formed connection will appear if the connection was successfully formed.
* In the Azure portal, go to the virtual hub and select **Connectivity** > **Virtual Network Connections**. You can then view the pointer to the connection. To see the actual resource, you'll need the proper permissions.

## Scenario: Add static routes to a virtual network hub connection

In the following steps, you'll use commands to add a static route to the virtual hub's default route table and a virtual network connection to point to a next-hop IP address (that is, an NVA appliance). Replace the example values to reflect your own environment.

>[!NOTE]
>- Before you run the commands, make sure you have access and are authorized to the remote subscription.
>- The destination prefix can be one CIDR or multiple ones. For a single CIDR, use this format: `@("10.19.2.0/24")`. For multiple CIDRs, use this format: `@("10.19.2.0/24", "10.40.0.0/16")`.

1. Make sure you're in the context of your parent account: 

    ```azurepowershell-interactive
    Select-AzSubscription -SubscriptionId "[parent ID]" 
    ```

2. Add a route in the virtual hub's default route table without a specific IP address.

    1. Get the connection details:

       ```azurepowershell-interactive
       $hubVnetConnection = Get-AzVirtualHubVnetConnection -Name "[HubconnectionName]" -ParentResourceName "[Hub Name]" -ResourceGroupName "[resource group name]"
       ``` 
    1. Add a static route to the virtual hub's route table. (The next hop is a virtual network connection.)       

       ```azurepowershell-interactive
       $Route2 = New-AzVHubRoute -Name "[Route Name]" -Destination “[@("Destination prefix")]” -DestinationType "CIDR" -NextHop $hubVnetConnection.Id -NextHopType "ResourceId"
       ```
    1. Update the hub's current default route table:
      
       ```azurepowershell-interactive
       Update-AzVHubRouteTable -ResourceGroupName "[resource group name]"-VirtualHubName [“Hub Name”] -Name "defaultRouteTable" -Route @($Route2)
       ```
    
    1. Update the route in the virtual network connection to specify the next hop as an IP address.

       > [!NOTE]
       > The route name should be the same as the one you used when you added a static route earlier. Otherwise, you'll create two routes in the routing table: one without an IP address and one with an IP address.

       ```azurepowershell-interactive
       $newroute = New-AzStaticRoute -Name "[Route Name]"  -AddressPrefix "[@("Destination prefix")]" -NextHopIpAddress "[Destination NVA IP address]"

       $newroutingconfig = New-AzRoutingConfiguration -AssociatedRouteTable $hubVnetConnection.RoutingConfiguration.AssociatedRouteTable.id -Id $hubVnetConnection.RoutingConfiguration.PropagatedRouteTables.Ids[0].id -Label @("default") -StaticRoute @($newroute)

       Update-AzVirtualHubVnetConnection -ResourceGroupName $rgname -VirtualHubName "[Hub Name]" -Name "[Virtual hub connection name]" -RoutingConfiguration $newroutingconfig

       ```
       
       This update command removes the previous manual configuration route in your routing table.
       
    1. Verify that the static route is established to a next-hop IP address.

       ```azurepowershell-interactive
       Get-AzVirtualHubVnetConnection -ResourceGroupName "[Resource group]" -VirtualHubName "[virtual hub name]" -Name "[Virtual hub connection name]"
       ```

## <a name="troubleshoot"></a>Troubleshoot

* Verify that the metadata in `$remote` (from the [preceding section](#connect)) matches the information from the Azure portal.
* Verify permissions by using the IAM settings of the remote tenant resource group, or by using Azure PowerShell commands (`Get-AzSubscription`).
* Make sure quotes are included around the names of resource groups or any other environment-specific variables (for example, `"VirtualHub1"` or `"VirtualNetwork1"`).

## Next steps

- For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
