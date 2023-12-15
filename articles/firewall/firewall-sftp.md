---
title: Access a storage account using SFTP over an Azure Firewall static public IP address
description: In this article, you use Azure PowerShell to deploy Azure Firewall to access a storage account container via SFTP.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: how-to
ms.date: 04/27/2023
ms.author: harjsing 
ms.custom: devx-track-azurepowershell
---

# Access a storage account using SFTP over an Azure Firewall static public IP address

You can use Azure Firewall to access a storage account container via SFTP. Azure PowerShell is used to deploy a firewall in a virtual network and configured with DNAT rules to translate the SFTP traffic to the storage account container. The storage account container is configured with a private endpoint to allow access from the firewall. To connect to the container, you use the firewall public IP address and the storage account container name.

:::image type="content" source="media/firewall-sftp/accessing-storage-using-sftp.png" alt-text="Diagram showing SFTP to firewall to access a storage account container.":::

In this article, you:

- Deploy the network infrastructure
- Create a firewall policy with the appropriate DNAT rule
- Deploy the firewall
- Create a storage account and container
- Configure SFTP access to the storage account container
- Create a private endpoint for the storage account container
- Test the connection to the storage account container

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This article requires the latest Azure PowerShell modules. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Login-AzAccount` to create a connection with Azure.

## Deploy the network infrastructure

First, set up some variables to use in the deployment. Replace the values with your own.

> [!TIP]
> You can use Microsoft Entra ID to find your user principal name.

```azurepowershell
$rg = "<resource-group-name>"
$location = "<location>"
$storageaccountname = "<storage-account-name>"
$staticEP = "10.0.2.10"
$SubscriptionName = "<your Azure subscription name>"
$UserPrincipalName = "<your AD user principal name>"
$ContainerName = "<container-name>"
```

Create the network infrastructure. This includes a virtual network, subnets and a public IP address for the firewall.

```azurepowershell

# Create a new resource group
New-AzResourceGroup -Name $rg -Location $location

# Create new subnets for the firewall
$FWsub = New-AzVirtualNetworkSubnetConfig -Name AzureFirewallSubnet -AddressPrefix 10.0.1.0/26
$Worksub = New-AzVirtualNetworkSubnetConfig -Name Workload-SN -AddressPrefix 10.0.2.0/24

# Create a new VNet
$testVnet = New-AzVirtualNetwork -Name test-fw-vn -ResourceGroupName $rg -Location $location -AddressPrefix 10.0.0.0/16 -Subnet $FWsub, $Worksub

# Create a public IP address for the firewall
$pip = New-AzPublicIpAddress `
    -ResourceGroupName $rg `
    -Location $location `
    -AllocationMethod Static `
    -Sku Standard `
    -Name fw-pip
```

## Create and configure the firewall policy

```azurepowershell

# Create a new firewall policy
$policy = New-AzFirewallPolicy -Name "fw-pol" -ResourceGroupName "$rg" -Location $location

# Define new rules to add
$newrule1 = New-AzFirewallPolicyNatRule -Name "dnat-rule1" -Protocol "TCP", "UDP" -SourceAddress "*" -DestinationAddress $pip.ipaddress -DestinationPort "22" -TranslatedAddress $staticEP -TranslatedPort "22"

# Add the new rules to the local rule collection object
$natrulecollection = New-AzFirewallPolicyNatRuleCollection -Name "NATRuleCollection" -Priority 100 -ActionType "Dnat" -Rule $newrule1

# Create a new rule collection group
$natrulecollectiongroup = New-AzFirewallPolicyRuleCollectionGroup -Name "rcg-01" -ResourceGroupName "$rg" -FirewallPolicyName "fw-pol" -Priority 100

# Add the new NAT rule collection to the rule collection group
$natrulecollectiongroup.Properties.RuleCollection = $natrulecollection

# Update the rule collection
Set-AzFirewallPolicyRuleCollectionGroup -Name "rcg-01 " -FirewallPolicyObject $policy -Priority 200 -RuleCollection $natrulecollectiongroup.Properties.rulecollection

```
## Deploy the firewall and configure the default route

```azurepowershell

# Create the firewall
$firewall = New-AzFirewall `
    -Name fw-01 `
    -ResourceGroupName $rg `
    -Location $location `
    -VirtualNetwork $testvnet `
    -PublicIpAddress $pip `
    -FirewallPolicyId $policy.id

# Create the route table
$routeTableDG = New-AzRouteTable `
  -Name Firewall-rt-table `
  -ResourceGroupName "$rg" `
  -location $location `
  -DisableBgpRoutePropagation

# Add the default route
Add-AzRouteConfig `
  -Name "DG-Route" `
  -RouteTable $routeTableDG `
  -AddressPrefix 0.0.0.0/0 `
  -NextHopType "VirtualAppliance" `
  -NextHopIpAddress $pip.ipaddress `
 | Set-AzRouteTable

```

## Create a storage account and container

```azurepowershell

New-AzStorageAccount -ResourceGroupName $rg -Name $StorageAccountName -SkuName Standard_LRS -Location $location -EnableHierarchicalNamespace $true -PublicNetworkAccess enabled

# Get the subscription and user information
$subscriptionId = (Get-AzSubscription -SubscriptionName "$SubscriptionName").SubscriptionId
$user = Get-AzADUser -UserPrincipalName $UserPrincipalName

# Give the user contributor role
New-AzRoleAssignment -ObjectId $user.id -RoleDefinitionName "Storage Blob Data Contributor" -Scope "/subscriptions/$subscriptionId/resourceGroups/$rg/providers/Microsoft.Storage/storageAccounts/$StorageAccountName"

#Create the container and then disable public network access
$ctx = New-AzStorageContext -StorageAccountName $StorageAccountName
New-AzStorageContainer -Name $ContainerName -Context $ctx
Set-AzStorageAccount -ResourceGroupName $rg -Name $StorageAccountName -PublicNetworkAccess disabled -Force
```

### Configure SFTP access to the storage account container

```azurepowershell

Set-AzStorageAccount `
    -ResourceGroupName $rg `
    -Name $StorageAccountName `
    -EnableSftp $true

$permissionScopeBlob = New-AzStorageLocalUserPermissionScope `
    -Permission rwdlc `
    -Service blob `
    -ResourceName $ContainerName

$localuser = Set-AzStorageLocalUser `
    -ResourceGroupName $rg `
    -AccountName $StorageAccountName `
    -UserName testuser `
    -PermissionScope $permissionScopeBlob

$localuserPassword = New-AzStorageLocalUserSshPassword `
    -ResourceGroupName $rg `
    -StorageAccountName $StorageAccountName `
    -UserName testuser

# Examine and manually save the password

$localuserPassword

```

## Create a private endpoint for the storage account container

```azurepowershell

# Place the previously created storage account into a variable
$storage = Get-AzStorageAccount -ResourceGroupName $rg -Name $StorageAccountName

# Create the private endpoint connection
$pec = @{
    Name = 'Connection01'
    PrivateLinkServiceId = $storage.ID
    GroupID = 'blob'
}

$privateEndpointConnection = New-AzPrivateLinkServiceConnection @pec


# Create the static IP configuration
$ip = @{
    Name = 'myIPconfig'
    GroupId = 'blob'
    MemberName = 'blob'
    PrivateIPAddress = $staticEP
}

$ipconfig = New-AzPrivateEndpointIpConfiguration @ip

# Create the private endpoint
$pe = @{
    ResourceGroupName = $rg
    Name = 'StorageEP'
    Location = 'eastus'
    Subnet = $testvnet.Subnets[1]
    PrivateLinkServiceConnection = $privateEndpointConnection
    IpConfiguration = $ipconfig
}

New-AzPrivateEndpoint @pe

```
## Test the SFTP connection

Now, test to ensure you can connect to the storage account container using SFTP. You can use any SFTP client to test the connection. In this example, we use sftp from a command prompt.

For example, for a storage account named `teststorageaccount`, a container named `testcontainer`, a local account named `testuser`, and a firewall public IP address of `13.68.216.252`, you would use the following command:

```
sftp teststorageaccount.testcontainer.testuser@13.68.216.252
```

Enter the password you saved earlier when prompted.


You should see something similar to the following output:

```
> sftp vehstore101.container01.testuser@13.68.216.252
teststorageaccount.testcontainer.testuser@13.68.216.252's password:
Connected to 13.68.216.252.
sftp>
```

You should now be connected to the storage account container using SFTP. You can use `put` and `get` commands to upload and download files. Use `ls` to list the files in the container, and `lls` to list the files in the local directory.

## Clean up resources

When no longer needed, you can use the following command to remove the resource group, firewall, firewall policy, and all related resources.

```azurepowershell

Remove-AzResourceGroup -Name $rg -Force

```

## Next steps

- [Deploy Azure Firewall to inspect traffic to a private endpoint](https://techcommunity.microsoft.com/t5/azure-network-security-blog/deploy-azure-firewall-to-inspect-traffic-to-a-private-endpoint/ba-p/3714575)
- [Azure Firewall FTP support](ftp-support.md)
