<properties 
   pageTitle="How to Create Routes and Enable IP Forwarding in Azure"
   description="Learn how to manage UDRs and IP forwarding"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/10/2015"
   ms.author="telmos" />

# How to create routes and enable IP Forwarding in Azure
You can use virtual appliances in Azure to handle traffic in your Azure virtual network. However, you need to create routes that will allow VMs and cloud services in your virtual network to send packets to your virtual appliance, instead of the desired destination for the packet. You also need to enable IP forwarding on the virtual appliance VM so it can receive and forward packets that are not addressed to the actual virtual appliance VM. 

## How to manage routes
You can add, remove, and change routes in Azure by using PowerShell. Before you can create a route, you must create a route table to host the route.

### How to create a route table
To create a route table named *FrontEndSubnetRouteTable*, run the following PowerShell command:

	```powershell
	New-AzureRouteTable -Name FrontEndSubnetRouteTable `
		-Location uscentral `
		-Label "Route table for front end subnet"
	```

The output of the command above should look like the following:

	Name                      Location   Label                          
	----                      --------   -----                          
	FrontEndSubnetRouteTable  West US    Route table for front end subnet

### How to add a route to a route table
To add a route that sets *10.1.1.10* as the next hop for the *10.2.0.0/16* subnet in the route table created above, run the following PowerShell command:

	```powershell
	Get-AzureRouteTable FrontEndSubnetRouteTable `
		|Set-AzureRoute -RouteName FirewallRoute -AddressPrefix 10.2.0.0/16 `
		-NextHopType VirtualAppliance `
		-NextHopIpAddress 10.1.1.10
	```

The output of the command above should look like the following:

	Name     : FrontEndSubnetRouteTable
	Location : Central US
	Label    : Route table for frontend subnet
	Routes   : 
	           Name                 Address Prefix    Next hop type        Next hop IP address
	           ----                 --------------    -------------        -------------------
	           firewallroute        10.2.0.0/16       VirtualAppliance     10.1.1.10    

### How to associate a route to a subnet
A route table must be associated with one or more subnets for it to be used. To associate the *FrontEndSubnetRouteTable* route table to a subnet named *FrontEndSubnet* in the virtual network *ProductionVnet*, run the following PowerShell command:

	```powershell
	Set-AzureSubnetRouteTable -VirtualNetworkName ProductionVnet `
		-SubnetName FrontEndSubnet `
		-RouteTableName FrontEndSubnetRouteTable
	```

### How to see the applied routes in a VM
You can query Azure to see the actual routes applied for a specific VM or role instance. The routes shown include default routes that Azure provides, as well as routes advertised by a VPN Gateway. The limit of routes shown is 800.

To see routes associated to the primary NIC on a VM named *FWAppliance1*, run the following PowerShell command:

	```powershell
	Get-AzureVM -Name FWAppliance1 -ServiceName ProductionVMs `
		| Get-AzureEffectiveRouteTable
	```

The output of the command above should look like the following:

	Effective routes : 
	                   Name            Address Prefix    Next hop type    Next hop IP address Status   Source     
	                   ----            --------------    -------------    ------------------- ------   ------     
	                                   {10.0.0.0/8}      VNETLocal                            Active   Default    
	                                   {0.0.0.0/0}       Internet                             Active   Default    
	                                   {25.0.0.0/8}      Null                                 Active   Default    
	                                   {100.64.0.0/10}   Null                                 Active   Default    
	                                   {172.16.0.0/12}   Null                                 Active   Default    
	                                   {192.168.0.0/16}  Null                                 Active   Default    
	                   firewallroute   {10.2.0.0/16}     Null             10.1.1.10           Active   User      

To see routes associated to a secondary NIC named *backendnic* on a VM named *FWAppliance1*, run the following PowerShell command:

	```powershell
	Get-AzureVM -Name FWAppliance1 -ServiceName ProductionVMs `
		| Get-AzureEffectiveRouteTable -NetworkInterfaceName backendnic
	```

To see routes associated to the primary NIC on a role instance named *myRole* that is part of a cloud service named *ProductionVMs*, run the following PowerShell command:

	```powershell
	Get-AzureEffectiveRouteTable -ServiceName ProductionVMs `
		-RoleInstanceName myRole
	```

## How to manage IP Forwarding
As previously mentioned, you need to enable IP forwarding on any VM or role instance that will act as a virtual appliance. 

### How to enable IP Forwarding
To enable IP forwarding in a VM named *FWAppliance1*, run the following PowerShell command:

```powershell
Get-AzureVM -Name FWAppliance1 -ServiceName ProductionVMs `
	| Set-AzureIPForwarding -Enable
```

To enable IP forwarding in a role instance named *FWAppliance* in a cloud service named *DMZService*, run the following PowerShell command:

```powershell
Set-AzureIPForwarding -ServiceName DMZService `
	-RoleName FWAppliance -Enable
```

### How to disable IP Forwarding
To disable IP forwarding in a VM named *FWAppliance1*, run the following PowerShell command:

```powershell
Get-AzureVM -Name FWAppliance1 -ServiceName ProductionVMs `
	| Set-AzureIPForwarding -Disable
```

To disable IP forwarding in a role instance named *FWAppliance* in a cloud service named *DMZService*, run the following PowerShell command:

```powershell
Set-AzureIPForwarding -ServiceName DMZService `
	-RoleName FWAppliance -Disable
```

### How to view status of IP Forwarding
To view the status of IP forwarding on a VM named *FWAppliance1*, run the following PowerShell command:

```powershell
Get-AzureVM -Name FWAppliance1 -ServiceName ProductionVMs `
	| Get-AzureIPForwarding
``` 