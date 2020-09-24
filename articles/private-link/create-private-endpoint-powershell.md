---
title: 'Create an Azure Private Endpoint using Azure PowerShell| Microsoft Docs'
description: Learn about Azure Private Link
services: private-link
author: malopMSFT
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure private endpoint
ms.service: private-link
ms.topic: how-to
ms.date: 09/16/2019
ms.author: allensu

---
# Create a private endpoint using Azure PowerShell
A Private Endpoint is the fundamental building block for private link in Azure. It enables Azure resources, like Virtual Machines (VMs), to communicate privately with private link resources. 

In this Quickstart, you will learn how to create a VM on an Azure Virtual Network, a logical SQL server with an Azure private endpoint using Azure PowerShell. Then, you can securely access SQL Database from the VM.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a resource group

Before you can create your resources, you must create a resource group that hosts the Virtual Network and the private endpoint with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named *myResourceGroup* in the *WestUS* location:

```azurepowershell

New-AzResourceGroup `
  -ResourceGroupName myResourceGroup `
  -Location westcentralus
```

## Create a Virtual Network
In this section, you create a virtual network and a subnet. Next, you associate the subnet to your Virtual Network.

### Create a Virtual Network

Create a Virtual network for your private endpoint with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a Virtual Network named *MyVirtualNetwork*:
 
```azurepowershell

$virtualNetwork = New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location westcentralus `
  -Name myVirtualNetwork `
  -AddressPrefix 10.0.0.0/16
```

### Add a Subnet

Azure deploys resources to a subnet within a Virtual Network, so you need to create a subnet. Create a subnet configuration named *mySubnet* with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig). The following example creates a subnet named *mySubnet* with the private endpoint network policy flag set to **Disabled**.

```azurepowershell
$subnetConfig = Add-AzVirtualNetworkSubnetConfig `
  -Name mySubnet `
  -AddressPrefix 10.0.0.0/24 `
  -PrivateEndpointNetworkPoliciesFlag "Disabled" `
  -VirtualNetwork $virtualNetwork
```

> [!CAUTION]
> It's easy to confuse the `PrivateEndpointNetworkPoliciesFlag` parameter with another available flag, `PrivateLinkServiceNetworkPoliciesFlag`, because they are both long words and have similar appearance.  Make sure you are using the right one, `PrivateEndpointNetworkPoliciesFlag`.

### Associate the Subnet to the Virtual Network

You can write the subnet configuration to the Virtual Network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork). This command creates the subnet:

```azurepowershell
$virtualNetwork | Set-AzVirtualNetwork
```

## Create a Virtual Machine

Create a VM in the Virtual Network with [New-AzVM](/powershell/module/az.compute/new-azvm). When you run the next command, you're prompted for credentials. Enter a user name and password for the VM:

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVm" `
    -Location "westcentralus" `
    -VirtualNetworkName "MyVirtualNetwork" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" `
    -OpenPorts 80,3389 `
    -AsJob  
```

The `-AsJob` option creates the VM in the background. You can continue to the next step.

When Azure starts creating the VM in the background, you'll get something like this back:

```powershell
Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
--     ----            -------------   -----         -----------     --------             -------
1      Long Running... AzureLongRun... Running       True            localhost            New-AzVM
```

## Create a logical SQL server 

Create a logical SQL server by using the New-AzSqlServer command. Remember that the name of your server must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```azurepowershell-interactive
$adminSqlLogin = "SqlAdmin"
$password = "ChangeYourAdminPassword1"

$server = New-AzSqlServer -ResourceGroupName "myResourceGroup" `
    -ServerName "myserver" `
    -Location "WestCentralUS" `
    -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $adminSqlLogin, $(ConvertTo-SecureString -String $password -AsPlainText -Force))

New-AzSqlDatabase  -ResourceGroupName "myResourceGroup" `
    -ServerName "myserver"`
    -DatabaseName "myda"`
    -RequestedServiceObjectiveName "S0" `
    -SampleName "AdventureWorksLT"
```

## Create a Private Endpoint

Private Endpoint for the server in your Virtual Network with [New-AzPrivateLinkServiceConnection](/powershell/module/az.network/New-AzPrivateLinkServiceConnection): 

```azurepowershell

$privateEndpointConnection = New-AzPrivateLinkServiceConnection -Name "myConnection" `
  -PrivateLinkServiceId $server.ResourceId `
  -GroupId "sqlServer" 
 
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName  "myResourceGroup" -Name "MyVirtualNetwork"  
 
$subnet = $virtualNetwork `
  | Select -ExpandProperty subnets `
  | Where-Object  {$_.Name -eq 'mysubnet'}  
 
$privateEndpoint = New-AzPrivateEndpoint -ResourceGroupName "myResourceGroup" `
  -Name "myPrivateEndpoint" `
  -Location "westcentralus" `
  -Subnet  $subnet `
  -PrivateLinkServiceConnection $privateEndpointConnection
``` 

## Configure the Private DNS Zone 
Create a Private DNS Zone for SQL Database domain, create an association link with the Virtual Network
and create a DNS Zone Group to associate the private endpoint with the Private DNS Zone.

```azurepowershell

$zone = New-AzPrivateDnsZone -ResourceGroupName "myResourceGroup" `
  -Name "privatelink.database.windows.net" 
 
$link  = New-AzPrivateDnsVirtualNetworkLink -ResourceGroupName "myResourceGroup" `
  -ZoneName "privatelink.database.windows.net"`
  -Name "mylink" `
  -VirtualNetworkId $virtualNetwork.Id  

$config = New-AzPrivateDnsZoneConfig -Name "privatelink.database.windows.net" -PrivateDnsZoneId $zone.ResourceId

$privateDnsZoneGroup = New-AzPrivateDnsZoneGroup -ResourceGroupName "myResourceGroup" `
 -PrivateEndpointName "myPrivateEndpoint" -name "MyZoneGroup" -PrivateDnsZoneConfig $config
``` 
  
## Connect to a VM from the internet

Use [Get-AzPublicIpAddress](/powershell/module/az.network/Get-AzPublicIpAddress) to return the public IP address of a VM. This example returns the public IP address of the *myVM* VM:

```azurepowershell
Get-AzPublicIpAddress `
  -Name myPublicIpAddress `
  -ResourceGroupName myResourceGroup `
  | Select IpAddress 
```  
Open a command prompt on your local computer. Run the mstsc command. Replace <publicIpAddress> with the public IP address returned from the last step: 


> [!NOTE]
> If you've been running these commands from a PowerShell prompt on your local computer, and you're using the Az PowerShell module version 1.0 or later, you can continue in that interface.
```
mstsc /v:<publicIpAddress>
```

1. If prompted, select **Connect**. 
2. Enter the user name and password you specified when creating the VM.
  > [!NOTE]
  > You may need to select More choices > Use a different account, to specify the credentials you entered when you created the VM. 
  
3. Select **OK**. 
4. You may receive a certificate warning. If you do, select **Yes** or **Continue**. 

## Access SQL Database privately from the VM

1. In the Remote Desktop of myVM, open PowerShell.
2. Enter `nslookup myserver.database.windows.net`. Remember to replace `myserver` with your SQL server name.

    You'll receive a message similar to this:
    
    ```azurepowershell
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    myserver.privatelink.database.windows.net
    Address:  10.0.0.5
    Aliases:   myserver.database.windows.net
    ```
    
3. Install [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15).
4. In **Connect to server**, enter or select this information:

    | Setting | Value |
    | --- | --- |
    | Server type | Database Engine |
    | Server name | myserver.database.windows.net |
    | Username | Enter the username provided during creation |
    | Password | Enter the password provided during creation |
    | Remember Password | Yes |
    
5. Select **Connect**.
6. Browse **Databases** from the left menu. 
7. (Optionally) Create or query information from mydatabase.
8. Close the remote desktop connection to *myVM*. 

## Clean up resources 
When you're done using the private endpoint, SQL Database and the VM, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all the resources it has:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps
- Learn more about [Azure Private Link](private-link-overview.md)
