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

>[!NOTE]
> Please note that cross-tenant Virtual Network connections can only be managed through PowerShell or CLI. You **cannot** manage cross-tenant Virtual Network Connections in Azure portal.
> 
## Before You Begin

### Prerequisites

To use the steps in this article, you must have the following configuration already set up in your environment:

* A virtual WAN and virtual hub in your parent subscription.
* A virtual network configured in a subscription in a different (remote) tenant.
* Make sure that the VNet address space in the remote tenant does not overlap with any other address space within any other VNets already connected to the parent virtual hub.

### Working with Azure PowerShell

[!INCLUDE [PowerShell](../../includes/vpn-gateway-cloud-shell-powershell.md)]

## <a name="rights"></a>Assign permissions

In order for the user administering the parent subscription with the virtual hub to be able to modify and access the virtual networks in the remote tenant, you need to assign **Contributor** permissions to this user. Assigning **Contributor** permissions to this user is done in the subscription of the VNET in the remote tenant.

1. Add the **Contributor** role assignment to the administrator (the one used to administer the virtual WAN hub). You can use either PowerShell, or the Azure portal to assign this role. See the following **Add or remove role assignments** articles for steps:

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

## Scenario: add static routes to virtual network hub connection
In the following steps, you will add a static route to the virtual hub default route table and virtual network connection to point to a next hop ip address (i.e NVA appliance). 
- Replace the example values to reflect your own environment.

1.	Make sure you are in the context of your parent account by running the following command: 

 ```azurepowershell-interactive
Select-AzSubscription -SubscriptionId "[parent ID]" 
```

2.	Add route in the Virtual hub default route table without a specific ip address and next hop as the virtual hub connection by: 

    2.1 get the connection details:
      ```azurepowershell-interactive
    $hubVnetConnection = Get-AzVirtualHubVnetConnection -Name "[HubconnectionName]" -ParentResourceName "[Hub Name]" -ResourceGroupName "[resource group name]"
      ``` 
    2.2 add a static route to the virtual hub route table (next hop is hub vnet connection): 
      ```azurepowershell-interactive
    $Route2 = New-AzVHubRoute -Name "[Route Name]" -Destination “[@("Destination prefix")]” -DestinationType "CIDR" -NextHop $hubVnetConnection.Id -NextHopType "ResourceId"
      ```
    2.3 update the current hub default route table:
      ```azurepowershell-interactive
    Update-AzVHubRouteTable -ResourceGroupName "[resource group name]"-VirtualHubName [“Hub Name”] -Name "defaultRouteTable" -Route @($Route2)
      ```
      ## Customize static routes to specify next hop as an IP address for the virtual hub connection.

    2.4 update the route in the vnethub connection:
      ```azurepowershell-interactive
    $newroute = New-AzStaticRoute -Name "[Route Name]"  -AddressPrefix "[@("Destination prefix")]" -NextHopIpAddress "[Destination NVA IP address]"

    $newroutingconfig = New-AzRoutingConfiguration -AssociatedRouteTable $hubVnetConnection.RoutingConfiguration.AssociatedRouteTable.id -Id $hubVnetConnection.RoutingConfiguration.PropagatedRouteTables.Ids[0].id -Label @("default") -StaticRoute @($newroute)

    Update-AzVirtualHubVnetConnection -ResourceGroupName $rgname -VirtualHubName "[Hub Name]" -Name "[Virtual hub connection name]" -RoutingConfiguration $newroutingconfig

      ```
    2.5 verify static route is established to a next hop IP address:

      ```azurepowershell-interactive
    Get-AzVirtualHubVnetConnection -ResourceGroupName "[Resource group]" -VirtualHubName "[virtual hub name]" -Name "[Virtual hub connection name]"
      ```


>[!NOTE]
>- In step 2.2 and 2.4 the route name should be same otherwise it will create two routes one without ip address one with ip address in the routing table.
>- If you run 2.5 it will remove the previous manual config route in your routing table.
>- Make sure you have access and are authorized to the remote subscription as well when running the above.
>- Destination prefix can be one CIDR or multiple ones
>- Please use this format @("10.19.2.0/24") or @("10.19.2.0/24", "10.40.0.0/16") for multiple CIDR
>


   
## <a name="troubleshoot"></a>Troubleshooting

* Verify that the metadata in $remote (from the preceding [section](#connect)) matches the information from the Azure portal.
* You can verify permissions using the IAM settings of the remote tenant resource group, or using Azure PowerShell commands (Get-AzSubscription).
* Make sure quotes are included around the names of resource groups or any other environment-specific variables (eg. "VirtualHub1" or "VirtualNetwork1").

## Next steps

For more information about Virtual WAN, see:

* The Virtual WAN [FAQ](virtual-wan-faq.md)
