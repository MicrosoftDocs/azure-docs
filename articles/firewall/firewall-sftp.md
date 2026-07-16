---
title: Access a storage account using SFTP over an Azure Firewall static public IP address
description: Access a storage account container via SFTP by using Azure Firewall and Azure PowerShell.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
ms.custom: devx-track-azurepowershell
# Customer intent: As a cloud administrator, I want to configure a secure SFTP connection to an Azure storage account via Azure Firewall, so that I can manage and transfer files securely while ensuring compliance with network security protocols.
---

# Access a storage account by using SFTP over an Azure Firewall static public IP address

Use Azure Firewall to access a storage account container through SFTP. Use Azure PowerShell to deploy a firewall in a virtual network and configure it with DNAT rules to translate the SFTP traffic to the storage account container. Configure the storage account container with a private endpoint to allow access from the firewall. To connect to the container, use the firewall public IP address and the storage account container name.

:::image type="content" source="media/firewall-sftp/accessing-storage-using-sftp.png" alt-text="Diagram that shows a customer connecting via SFTP to Azure Firewall, which routes traffic through a private endpoint to a storage account container." lightbox="media/firewall-sftp/accessing-storage-using-sftp.png":::

In this article, you:

- Deploy the network infrastructure.
- Create a firewall policy with the appropriate DNAT rule.
- Deploy the firewall.
- Create a storage account and container.
- Configure SFTP access to the storage account container.
- Create a private endpoint for the storage account container.
- Test the connection to the storage account container.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

This article requires the latest Azure PowerShell modules. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

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

Create the network infrastructure. This step includes creating a virtual network, subnets, and a public IP address for the firewall.

```azurepowershell
# Create a new resource group
New-AzResourceGroup `
    -Name $rg `
    -Location $location

# Create new subnets for the firewall
$FWsub = New-AzVirtualNetworkSubnetConfig `
    -Name AzureFirewallSubnet `
    -AddressPrefix 10.0.1.0/26
$Worksub = New-AzVirtualNetworkSubnetConfig `
    -Name Workload-SN `
    -AddressPrefix 10.0.2.0/24

# Create a new VNet
$testVnet = New-AzVirtualNetwork `
    -Name test-fw-vn `
    -ResourceGroupName $rg `
    -Location $location `
    -AddressPrefix 10.0.0.0/16 `
    -Subnet $FWsub, $Worksub

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
$policy = New-AzFirewallPolicy `
    -Name "fw-pol" `
    -ResourceGroupName $rg `
    -Location $location

# Define new rules to add
$newrule1 = New-AzFirewallPolicyNatRule `
    -Name "dnat-rule1" `
    -Protocol "TCP", "UDP" `
    -SourceAddress "*" `
    -DestinationAddress $pip.IpAddress `
    -DestinationPort "22" `
    -TranslatedAddress $staticEP `
    -TranslatedPort "22"

# Add the new rules to the local rule collection object
$natrulecollection = New-AzFirewallPolicyNatRuleCollection `
    -Name "NATRuleCollection" `
    -Priority 100 `
    -ActionType "Dnat" `
    -Rule $newrule1

# Create a new rule collection group
$natrulecollectiongroup = New-AzFirewallPolicyRuleCollectionGroup `
    -Name "rcg-01" `
    -ResourceGroupName $rg `
    -FirewallPolicyName "fw-pol" `
    -Priority 100

# Add the new NAT rule collection to the rule collection group
$natrulecollectiongroup.Properties.RuleCollection = $natrulecollection

# Update the rule collection
Set-AzFirewallPolicyRuleCollectionGroup `
    -Name "rcg-01" `
    -FirewallPolicyObject $policy `
    -Priority 200 `
    -RuleCollection $natrulecollectiongroup.Properties.RuleCollection
```

## Deploy the firewall

```azurepowershell
# Create the firewall
$firewall = New-AzFirewall `
    -Name fw-01 `
    -ResourceGroupName $rg `
    -Location $location `
    -VirtualNetwork $testVnet `
    -PublicIpAddress $pip `
    -FirewallPolicyId $policy.id
```

## Create a storage account and container

```azurepowershell
New-AzStorageAccount `
    -ResourceGroupName $rg `
    -Name $StorageAccountName `
    -SkuName Standard_LRS `
    -Location $location `
    -EnableHierarchicalNamespace $true `
    -PublicNetworkAccess Enabled

# Get the subscription and user information
$subscriptionId = (Get-AzSubscription `
    -SubscriptionName $SubscriptionName).SubscriptionId
$user = Get-AzADUser `
    -UserPrincipalName $UserPrincipalName

# Give the user contributor role
New-AzRoleAssignment `
    -ObjectId $user.Id `
    -RoleDefinitionName "Storage Blob Data Contributor" `
    -Scope "/subscriptions/$subscriptionId/resourceGroups/$rg/providers/Microsoft.Storage/storageAccounts/$StorageAccountName"

# Create the container and then disable public network access
$ctx = New-AzStorageContext -StorageAccountName $StorageAccountName
New-AzStorageContainer `
    -Name $ContainerName `
    -Context $ctx
Set-AzStorageAccount `
    -ResourceGroupName $rg `
    -Name $StorageAccountName `
    -PublicNetworkAccess Disabled `
    -Force
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
$storage = Get-AzStorageAccount `
    -ResourceGroupName $rg `
    -Name $StorageAccountName

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
    Location = $location
    Subnet = $testVnet.Subnets[1]
    PrivateLinkServiceConnection = $privateEndpointConnection
    IpConfiguration = $ipconfig
}

New-AzPrivateEndpoint @pe
```

## Test the SFTP connection

Now, test the connection to make sure you can connect to the storage account container by using SFTP. You can use any SFTP client to test the connection. In this example, use `sftp` from a command prompt.

For example, for a storage account named `teststorageaccount`, a container named `testcontainer`, a local account named `testuser`, and a firewall public IP address of `13.68.216.252`, use the following command:

```
sftp teststorageaccount.testcontainer.testuser@13.68.216.252
```

Enter the password you saved earlier when prompted.

You see something similar to the following output:

```
> sftp vehstore101.container01.testuser@13.68.216.252
teststorageaccount.testcontainer.testuser@13.68.216.252's password:
Connected to 13.68.216.252.
sftp>
```

You're now connected to the storage account container by using SFTP. You can use `put` and `get` commands to upload and download files. Use `ls` to list the files in the container, and `lls` to list the files in the local directory.

## Clean up resources

When you no longer need the resources, use the following command to remove the resource group, firewall, firewall policy, and all related resources.

```azurepowershell
Remove-AzResourceGroup -Name $rg -Force
```

## Next steps

- [Deploy Azure Firewall to inspect traffic to a private endpoint](https://techcommunity.microsoft.com/t5/azure-network-security-blog/deploy-azure-firewall-to-inspect-traffic-to-a-private-endpoint/ba-p/3714575)
- [Azure Firewall FTP support](ftp-support.md)
