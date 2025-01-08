---
title: Create and associate service endpoint policies
titlesuffix: Azure Virtual Network
description: In this article, learn how to set up and associate service endpoint policies.
author: asudbring
ms.service: azure-virtual-network
ms.topic: how-to
ms.date: 08/20/2024
ms.author: allensu
ms.custom: 
  - devx-track-azurecli
  - devx-track-azurepowershell
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Create and associate service endpoint policies

Service endpoint policies enable you to filter virtual network traffic to specific Azure resources, over service endpoints. If you're not familiar with service endpoint policies, see [service endpoint policies overview](virtual-network-service-endpoint-policies-overview.md) to learn more.

 In this tutorial, you learn how to:

> [!div class="checklist"]
* Create a virtual network.
* Add a subnet and enable service endpoint for Azure Storage.
* Create two Azure Storage accounts and allow network access to it from the subnet in the virtual network.
* Create a service endpoint policy to allow access only to one of the storage accounts.
* Deploy a virtual machine (VM) to the subnet.
* Confirm access to the allowed storage account from the subnet.
* Confirm access is denied to the nonallowed storage account from the subnet.

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create a virtual network and enable service endpoint

Create a virtual network to contain the resources you create in this tutorial.

### [Portal](#tab/portal)

1. In the search box in the portal, enter **Virtual networks**. Select **Virtual networks** in the search results.

1. Select **+ Create** to create a new virtual network.

1. Enter or select the following information in the **Basics** tab of **Create virtual network**.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**.</br> Enter **test-rg** in **Name**.</br> Select **OK**. |
    | Name | Enter **vnet-1**. |
    | Region | Select **West US 2**. |

1. Select **Next**.

1. Select **Next**.

1. In the **IP addresses** tab, in **Subnets**, select the **default** subnet.

1. Enter or select the following information in **Edit subnet**.

    | Setting | Value |
    | -------| ------- |
    | Name | Enter **subnet-1**. |
    | **Service Endpoints** | |
    | **Services** |  |
    | In the pull-down menu, select **Microsoft.Storage**. |

1. Select **Save**.

1. Select **Review + Create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named *test-rg*: 

```azurepowershell-interactive
$rg = @{
    ResourceGroupName = "test-rg"
    Location = "westus2"
}
New-AzResourceGroup @rg
```

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named *vnet-1* with the address prefix *10.0.0.0/16*.

```azurepowershell-interactive
$vnet = @{
    ResourceGroupName = "test-rg"
    Location = "westus2"
    Name = "vnet-1"
    AddressPrefix = "10.0.0.0/16"
}
$virtualNetwork = New-AzVirtualNetwork @vnet
```

Create a subnet configuration with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig), and then write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork). The following example adds a subnet named _subnet-1_ to the virtual network and creates the service endpoint for *Microsoft.Storage*.

```azurepowershell-interactive
$subnet = @{
    Name = "subnet-1"
    VirtualNetwork = $virtualNetwork
    AddressPrefix = "10.0.0.0/24"
    ServiceEndpoint = "Microsoft.Storage"
}
Add-AzVirtualNetworkSubnetConfig @subnet

$virtualNetwork | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *test-rg* in the *westus2* location.

```azurecli-interactive
az group create \
  --name test-rg \
  --location westus2
```

Create a virtual network with one subnet with [az network vnet create](/cli/azure/network/vnet).

```azurecli-interactive
az network vnet create \
  --name vnet-1 \
  --resource-group test-rg \
  --address-prefix 10.0.0.0/16 \
  --subnet-name subnet-1 \
  --subnet-prefix 10.0.0.0/24
```

In this example, a service endpoint for `Microsoft.Storage` is created for the subnet *subnet-1*:

```azurecli-interactive
az network vnet subnet create \
  --vnet-name vnet-1 \
  --resource-group test-rg \
  --name subnet-1 \
  --address-prefix 10.0.0.0/24 \
  --service-endpoints Microsoft.Storage
```

---

## Restrict network access for the subnet

Create a network security group and rules that restrict network access for the subnet.

### Create a network security group

### [Portal](#tab/portal)

1. In the search box in the portal, enter **Network security groups**. Select **Network security groups** in the search results.

1. Select **+ Create** to create a new network security group.

1. In the **Basics** tab of **Create network security group**, enter, or select the following information.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | Name | Enter **nsg-1**. |
    | Region | Select **West US 2**. |

1. Select **Review + Create**.

1. Select **Create**.

### Create network security group rules

1. In the search box in the portal, enter **Network security groups**. Select **Network security groups** in the search results.

1. Select **nsg-1**.

1. Expand **Settings**. Select **Outbound security rules**.

1. Select **+ Add** to add a new outbound security rule.

1. In **Add outbound security rule**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Source | Select **Service Tag**. |
    | Source service tag | Select **VirtualNetwork**. |
    | Source port ranges | Enter **\***. |
    | Destination | Select **Service Tag**. |
    | Destination service tag | Select **Storage**. |
    | Service | Select **Custom**. |
    | Destination port ranges | Enter **\***. |
    | Protocol | Select **Any**. |
    | Action | Select **Allow**. |
    | Priority | Enter **100**. |
    | Name | Enter **allow-storage-all**. |

1. Select **Add**.

1. Select **+ Add** to add another outbound security rule.

1. In **Add outbound security rule**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Source | Select **Service Tag**. |
    | Source service tag | Select **VirtualNetwork**. |
    | Source port ranges | Enter **\***. |
    | Destination | Select **Service Tag**. |
    | Destination service tag | Select **Internet**. |
    | Service | Select **Custom**. |
    | Destination port ranges | Enter **\***. |
    | Protocol | Select **Any**. |
    | Action | Select **Deny**. |
    | Priority | Enter **110**. |
    | Name | Enter **deny-internet-all**. |

1. Select **Add**.

1. Expand **Settings**. Select **Subnets**.

1. Select **Associate**.

1. In **Associate subnet**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Virtual network | Select **vnet-1 (test-rg)**. |
    | Subnet | Select **subnet-1**. |

1. Select **OK**.

### [PowerShell](#tab/powershell)

Create network security group security rules with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig). The following rule allows outbound access to the public IP addresses assigned to the Azure Storage service: 

```azurepowershell-interactive
$r1 = @{
    Name = "Allow-Storage-All"
    Access = "Allow"
    DestinationAddressPrefix = "Storage"
    DestinationPortRange = "*"
    Direction = "Outbound"
    Priority = 100
    Protocol = "*"
    SourceAddressPrefix = "VirtualNetwork"
    SourcePortRange = "*"
}
$rule1 = New-AzNetworkSecurityRuleConfig @r1
```

The following rule denies access to all public IP addresses. The previous rule overrides this rule, due to its higher priority, which allows access to the public IP addresses of Azure Storage.

```azurepowershell-interactive
$r2 = @{
    Name = "Deny-Internet-All"
    Access = "Deny"
    DestinationAddressPrefix = "Internet"
    DestinationPortRange = "*"
    Direction = "Outbound"
    Priority = 110
    Protocol = "*"
    SourceAddressPrefix = "VirtualNetwork"
    SourcePortRange = "*"
}
$rule2 = New-AzNetworkSecurityRuleConfig @r2
```

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup). The following example creates a network security group named *nsg-1*.

```azurepowershell-interactive
$securityRules = @($rule1, $rule2)

$nsgParams = @{
    ResourceGroupName = "test-rg"
    Location = "westus2"
    Name = "nsg-1"
    SecurityRules = $securityRules
}
$nsg = New-AzNetworkSecurityGroup @nsgParams
```

Associate the network security group to the *subnet-1* subnet with [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) and then write the subnet configuration to the virtual network. The following example associates the *nsg-1* network security group to the *subnet-1* subnet:

```azurepowershell-interactive
$subnetConfig = @{
    VirtualNetwork = $VirtualNetwork
    Name = "subnet-1"
    AddressPrefix = "10.0.0.0/24"
    ServiceEndpoint = "Microsoft.Storage"
    NetworkSecurityGroup = $nsg
}
Set-AzVirtualNetworkSubnetConfig @subnetConfig

$virtualNetwork | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Create a network security group with [az network nsg create](/cli/azure/network/nsg). The following example creates a network security group named *nsg-1*.

```azurecli-interactive
az network nsg create \
  --resource-group test-rg \
  --name nsg-1
```

Associate the network security group to the *subnet-1* subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet). The following example associates the *nsg-1* network security group to the *subnet-1* subnet:

```azurecli-interactive
az network vnet subnet update \
  --vnet-name vnet-1 \
  --name subnet-1 \
  --resource-group test-rg \
  --network-security-group nsg-1
```

Create security rules with [az network nsg rule create](/cli/azure/network/nsg/rule). The rule that follows allows outbound access to the public IP addresses assigned to the Azure Storage service:

```azurecli-interactive
az network nsg rule create \
  --resource-group test-rg \
  --nsg-name nsg-1 \
  --name Allow-Storage-All \
  --access Allow \
  --protocol "*" \
  --direction Outbound \
  --priority 100 \
  --source-address-prefix "VirtualNetwork" \
  --source-port-range "*" \
  --destination-address-prefix "Storage" \
  --destination-port-range "*"
```

Each network security group contains several [default security rules](./network-security-groups-overview.md#default-security-rules). The rule that follows overrides a default security rule that allows outbound access to all public IP addresses. The `destination-address-prefix "Internet"` option denies outbound access to all public IP addresses. The previous rule overrides this rule, due to its higher priority, which allows access to the public IP addresses of Azure Storage.

```azurecli-interactive
az network nsg rule create \
  --resource-group test-rg \
  --nsg-name nsg-1 \
  --name Deny-Internet-All \
  --access Deny \
  --protocol "*" \
  --direction Outbound \
  --priority 110 \
  --source-address-prefix "VirtualNetwork" \
  --source-port-range "*" \
  --destination-address-prefix "Internet" \
  --destination-port-range "*"
```

---

## Restrict network access to Azure Storage accounts

The steps necessary to restrict network access to resources created through Azure services enabled for service endpoints varies across services. See the documentation for individual services for specific steps for each service. The remainder of this article includes steps to restrict network access for an Azure Storage account, as an example.

### Create two storage accounts

### [Portal](#tab/portal)

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **+ Create** to create a new storage account.

1. In **Create a storage account**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** | |
    | Storage account name | Enter **allowedaccount(random-number)**.</br> **Note: The storage account name must be unique. Add a random number to the end of the name `allowedaccount`**. |
    | Region | Select **West US 2**. |
    | Performance | Select **Standard**. |
    | Redundancy | Select **Locally-redundant storage (LRS)**. |

1. Select **Next** until you reach the **Data protection** tab.

1. In **Recovery**, deselect all of the options.

1. Select **Review + Create**.

1. Select **Create**.

1. Repeat the previous steps to create another storage account with the following information.

    | Setting | Value |
    | -------| ------- |
    | Storage account name | Enter **deniedaccount(random-number)**. |

### [PowerShell](#tab/powershell)

Create the allowed Azure storage account with [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount).

```azurepowershell-interactive
$storageAcctParams = @{
    Location = 'westus2'
    Name = 'allowedaccount'
    ResourceGroupName = 'test-rg'
    SkuName = 'Standard_LRS'
    Kind = 'StorageV2'
}
New-AzStorageAccount @storageAcctParams
```

Use the same command to create the denied Azure storage account, but change the name to `deniedaccount`.

```azurepowershell-interactive
$storageAcctParams = @{
    Location = 'westus2'
    Name = 'deniedaccount'
    ResourceGroupName = 'test-rg'
    SkuName = 'Standard_LRS'
    Kind = 'StorageV2'
}
New-AzStorageAccount @storageAcctParams
```

### [CLI](#tab/cli)

Create two Azure storage accounts with [az storage account create](/cli/azure/storage/account).

```azurecli-interactive
storageAcctName1="allowedaccount"

az storage account create \
  --name $storageAcctName1 \
  --resource-group test-rg \
  --sku Standard_LRS \
  --kind StorageV2
```

Use the same command to create the denied Azure storage account, but change the name to `deniedaccount`.

```azurecli-interactive
storageAcctName2="deniedaccount"

az storage account create \
  --name $storageAcctName2 \
  --resource-group test-rg \
  --sku Standard_LRS \
  --kind StorageV2
```

---

### Create file shares

### [Portal](#tab/portal)

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **allowedaccount(random-number)**.

1. Expand the **Data storage** section and select **File shares**.

1. Select **+ File share**.

1. In **New file share**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Name | Enter **file-share**. |

1. Leave the rest of the settings as default and select **Review + create**.

1. Select **Create**.

1. Repeat the previous steps to create a file share in **deniedaccount(random-number)**.

### [PowerShell](#tab/powershell)

### Create allowed storage account file share

Use [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) to get the storage account key for the allowed storage account. You'll use this key in the next step to create a file share in the allowed storage account.

```azurepowershell-interactive
$storageAcctName1 = "allowedaccount"
$storageAcctParams1 = @{
    ResourceGroupName = "test-rg"
    AccountName = $storageAcctName1
}
$storageAcctKey1 = (Get-AzStorageAccountKey @storageAcctParams1).Value[0]
```

Create a context for your storage account and key with [New-AzStorageContext](/powershell/module/az.storage/new-AzStoragecontext). The context encapsulates the storage account name and account key.

```azurepowershell-interactive
$storageContext1 = New-AzStorageContext $storageAcctName1 $storageAcctKey1
```

Create a file share with [New-AzStorageShare](/powershell/module/az.storage/new-azstorageshare).

```azurepowershell-interactive
$share1 = New-AzStorageShare file-share -Context $storageContext1
```

### Create denied storage account file share

Use [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey) to get the storage account key for the allowed storage account. You'll use this key in the next step to create a file share in the denied storage account.

```azurepowershell-interactive
$storageAcctName2 = "deniedaccount"
$storageAcctParams2 = @{
    ResourceGroupName = "test-rg"
    AccountName = $storageAcctName2
}
$storageAcctKey2 = (Get-AzStorageAccountKey @storageAcctParams2).Value[0]
```

Create a context for your storage account and key with [New-AzStorageContext](/powershell/module/az.storage/new-AzStoragecontext). The context encapsulates the storage account name and account key.

```azurepowershell-interactive
$storageContext2= New-AzStorageContext $storageAcctName2 $storageAcctKey2
```

Create a file share with [New-AzStorageShare](/powershell/module/az.storage/new-azstorageshare).

```azurepowershell-interactive
$share2 = New-AzStorageShare file-share -Context $storageContext2
```

### [CLI](#tab/cli)

### Create allowed storage account file share

Retrieve the connection string for the storage accounts into a variable with [az storage account show-connection-string](/cli/azure/storage/account). The connection string is used to create a file share in a later step.

```azurecli-interactive
saConnectionString1=$(az storage account show-connection-string \
  --name $storageAcctName1 \
  --resource-group test-rg \
  --query 'connectionString' \
  --out tsv)
```

Create a file share in the storage account with [az storage share create](/cli/azure/storage/share). In a later step, this file share is mounted to confirm network access to it.

```azurecli-interactive
az storage share create \
  --name file-share \
  --quota 2048 \
  --connection-string $saConnectionString1 > /dev/null
```

### Create denied storage account file share

Retrieve the connection string for the storage accounts into a variable with [az storage account show-connection-string](/cli/azure/storage/account). The connection string is used to create a file share in a later step.

```azurecli-interactive
saConnectionString2=$(az storage account show-connection-string \
  --name $storageAcctName2 \
  --resource-group test-rg \
  --query 'connectionString' \
  --out tsv)
```

Create a file share in the storage account with [az storage share create](/cli/azure/storage/share). In a later step, this file share is mounted to confirm network access to it.

```azurecli-interactive
az storage share create \
  --name file-share \
  --quota 2048 \
  --connection-string $saConnectionString2 > /dev/null
```

---

### Deny all network access to storage accounts

By default, storage accounts accept network connections from clients in any network. To restrict network access to the storage accounts, you can configure the storage account to accept connections only from specific networks. In this example, you configure the storage account to accept connections only from the virtual network subnet you created earlier.

### [Portal](#tab/portal)

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **allowedaccount(random-number)**.

1. Expand **Security + networking** and select **Networking**.

1. In **Firewalls and virtual networks**, in **Public network access**, select **Enabled from selected virtual networks and IP addresses**.

1. In **Virtual networks**, select **+ Add existing virtual network**.

1. In **Add networks**, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | Subscription | Select your subscription. |
    | Virtual networks | Select **vnet-1**. |
    | Subnets | Select **subnet-1**. |

1. Select **Add**.

1. Select **Save**.

1. Repeat the previous steps to deny network access to **deniedaccount(random-number)**.

### [PowerShell](#tab/powershell)

Use [Update-AzStorageAccountNetworkRuleSet](/powershell/module/az.storage/update-azstorageaccountnetworkruleset) to deny access to the storage accounts except from the virtual network and subnet you created earlier. Once network access is denied, the storage account isn't accessible from any network.

```azurepowershell-interactive
$storageAcctParams1 = @{
    ResourceGroupName = "test-rg"
    Name = $storageAcctName1
    DefaultAction = "Deny"
}
Update-AzStorageAccountNetworkRuleSet @storageAcctParams1

$storageAcctParams2 = @{
    ResourceGroupName = "test-rg"
    Name = $storageAcctName2
    DefaultAction = "Deny"
}
Update-AzStorageAccountNetworkRuleSet @storageAcctParams2
```

### Enable network access only from the virtual network subnet

Retrieve the created virtual network with [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and then retrieve the private subnet object into a variable with [Get-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/get-azvirtualnetworksubnetconfig):

```azurepowershell-interactive
$privateSubnetParams = @{
    ResourceGroupName = "test-rg"
    Name = "vnet-1"
}
$privateSubnet = Get-AzVirtualNetwork @privateSubnetParams | Get-AzVirtualNetworkSubnetConfig -Name "subnet-1"
```

Allow network access to the storage account from the *subnet-1* subnet with [Add-AzStorageAccountNetworkRule](/powershell/module/az.network/add-aznetworksecurityruleconfig).

```azurepowershell-interactive
$networkRuleParams1 = @{
    ResourceGroupName = "test-rg"
    Name = $storageAcctName1
    VirtualNetworkResourceId = $privateSubnet.Id
}
Add-AzStorageAccountNetworkRule @networkRuleParams1

$networkRuleParams2 = @{
    ResourceGroupName = "test-rg"
    Name = $storageAcctName2
    VirtualNetworkResourceId = $privateSubnet.Id
}
Add-AzStorageAccountNetworkRule @networkRuleParams2
```

### [CLI](#tab/cli)

By default, storage accounts accept network connections from clients in any network. To limit access to selected networks, change the default action to *Deny* with [az storage account update](/cli/azure/storage/account). Once network access is denied, the storage account isn't accessible from any network.

```azurecli-interactive
az storage account update \
  --name $storageAcctName1 \
  --resource-group test-rg \
  --default-action Deny

az storage account update \
  --name $storageAcctName2 \
  --resource-group test-rg \
  --default-action Deny
```

### Enable network access only from the virtual network subnet

Allow network access to the storage account from the *subnet-1* subnet with [az storage account network-rule add](/cli/azure/storage/account/network-rule).

```azurecli-interactive
az storage account network-rule add \
  --resource-group test-rg \
  --account-name $storageAcctName1 \
  --vnet-name vnet-1 \
  --subnet subnet-1

az storage account network-rule add \
  --resource-group test-rg \
  --account-name $storageAcctName2 \
  --vnet-name vnet-1 \
  --subnet subnet-1
```

---

## Apply policy to allow access to valid storage account

You can create a service endpoint policy. The policy ensures users in the virtual network can only access safe and allowed Azure Storage accounts. This policy contains a list of allowed storage accounts applied to the virtual network subnet that is connected to storage via service endpoints.

### Create a service endpoint policy

This section creates the policy definition with the list of allowed resources for access over service endpoint.

### [Portal](#tab/portal)

1. In the search box in the portal, enter **Service endpoint policy**. Select **Service endpoint policies** in the search results.

1. Select **+ Create** to create a new service endpoint policy.

1. Enter or select the following information in the **Basics** tab of **Create a service endpoint policy**.

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** | |
    | Name | Enter **service-endpoint-policy**. |
    | Location | Select **West US 2**. |

1. Select **Next: Policy definitions**.

1. Select **+ Add a resource** in **Resources**.

1. In **Add a resource**, enter or select the following information:

    | Setting | Value |
    | -------| ------- |
    | Service | Select **Microsoft.Storage**. |
    | Scope | Select **Single account** |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | Resource | Select **allowedaccount(random-number)** |

1. Select **Add**.

1. Select **Review + Create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

To retrieve the resource ID for the first (allowed) storage account, use [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount).

```azurepowershell-interactive
$storageAcctParams1 = @{
    ResourceGroupName = "test-rg"
    Name = $storageAcctName1
}
$resourceId = (Get-AzStorageAccount @storageAcctParams1).id
```

To create the policy definition to allow the previous resource, use [New-AzServiceEndpointPolicyDefinition](/powershell/module/az.network/new-azserviceendpointpolicydefinition) .

```azurepowershell-interactive
$policyDefinitionParams = @{
    Name = "policy-definition"
    Description = "Service Endpoint Policy Definition"
    Service = "Microsoft.Storage"
    ServiceResource = $resourceId
}
$policyDefinition = New-AzServiceEndpointPolicyDefinition @policyDefinitionParams
```

Use [New-AzServiceEndpointPolicy](/powershell/module/az.network/new-azserviceendpointpolicy) to create the service endpoint policy with the policy definition.

```azurepowershell-interactive
$sepolicyParams = @{
    ResourceGroupName = "test-rg"
    Name = "service-endpoint-policy"
    Location = "westus2"
    ServiceEndpointPolicyDefinition = $policyDefinition
}
$sepolicy = New-AzServiceEndpointPolicy @sepolicyParams
```

### [CLI](#tab/cli)

Service endpoint policies are applied over service endpoints. Start by creating a service endpoint policy. Then create the policy definitions under this policy for Azure Storage accounts to be approved for this subnet

Use [az storage account show](/cli/azure/storage/account) to get the resource ID for the storage account that is allowed.

```azurecli-interactive
serviceResourceId=$(az storage account show --name allowedaccount --query id --output tsv)
```

Create a service endpoint policy

```azurecli-interactive
az network service-endpoint policy create \
  --resource-group test-rg \
  --name service-endpoint-policy \
  --location westus2
```

Create and add a policy definition for allowing the previous Azure Storage account to the service endpoint policy

```azurecli-interactive
az network service-endpoint policy-definition create \
  --resource-group test-rg \
  --policy-name service-endpoint-policy \
  --name policy-definition \
  --service "Microsoft.Storage" \
  --service-resources $serviceResourceId
```

---

## Associate a service endpoint policy to a subnet

After creating the service endpoint policy, you'll associate it with the target subnet with the service endpoint configuration for Azure Storage.

### [Portal](#tab/portal)

1. In the search box in the portal, enter **Service endpoint policy**. Select **Service endpoint policies** in the search results.

1. Select **service-endpoint-policy**.

1. Expand **Settings** and select **Associated subnets**.

1. Select **+ Edit subnet association**.

1. In **Edit subnet association**, select **vnet-1** and **subnet-1**.

1. Select **Apply**.

### [PowerShell](#tab/powershell)

Use [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) to associate the service endpoint policy to the subnet.

```azurepowershell-interactive
$subnetConfigParams = @{
    VirtualNetwork = $VirtualNetwork
    Name = "subnet-1"
    AddressPrefix = "10.0.0.0/24"
    NetworkSecurityGroup = $nsg
    ServiceEndpoint = "Microsoft.Storage"
    ServiceEndpointPolicy = $sepolicy
}
Set-AzVirtualNetworkSubnetConfig @subnetConfigParams

$virtualNetwork | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet) to associate the service endpoint policy to the subnet.

```azurecli-interactive
az network vnet subnet update \
  --vnet-name vnet-1 \
  --resource-group test-rg \
  --name subnet-1 \
  --service-endpoints Microsoft.Storage \
  --service-endpoint-policy service-endpoint-policy
```

---

>[!WARNING] 
> Ensure that all the resources accessed from the subnet are added to the policy definition before associating the policy to the given subnet. Once the policy is associated, only access to the *allow listed* resources will be allowed over service endpoints. 
>
> Ensure that no managed Azure services exist in the subnet that is being associated to the service endpoint policy.
>
> Access to Azure Storage resources in all regions will be restricted as per Service Endpoint Policy from this subnet.

## Validate access restriction to Azure Storage accounts

To test network access to a storage account, deploy a VM in the subnet.

### Deploy the virtual machine

### [Portal](#tab/portal)

1. In the search box in the portal, enter **Virtual machines**. Select **Virtual machines** in the search results.

1. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information:

    | Setting | Value |
    | -------| ------- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** | |
    | Virtual machine name | Enter **vm-1**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
    | Size | Select a size. |
    | **Administrator account** | |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Enter the password again. |
    | **Inbound port rules** | |

1. Select **Next: Disks**, then select **Next: Networking**.

1. In the **Networking** tab, enter or select the following information.

    | Setting | Value |
    | -------| ------- |
    | **Network interface** | |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1 (10.0.0.0/24)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

1. Leave the rest of the settings as default and select **Review + Create**.

1. Select **Create**.

### [PowerShell](#tab/powershell)

Create a virtual machine in the *subnet-1* subnet with [New-AzVM](/powershell/module/az.compute/new-azvm). When running the command that follows, you're prompted for credentials. The values that you enter are configured as the user name and password for the VM.

```azurepowershell-interactive
$vmParams = @{
    ResourceGroupName = "test-rg"
    Location = "westus2"
    VirtualNetworkName = "vnet-1"
    SubnetName = "subnet-1"
    Name = "vm-1"
}
New-AzVm @vmParams
```

### [CLI](#tab/cli)

Create a VM in the *subnet-1* subnet with [az vm create](/cli/azure/vm).

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-1 \
  --image Win2022Datacenter \
  --admin-username azureuser \
  --vnet-name vnet-1 \
  --subnet subnet-1
```

---

Wait for the virtual machine to finish deploying before continuing on to the next steps.

### Confirm access to the *allowed* storage account

1. Sign-in to the [Azure portal](https://portal.azure.com/).

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **allowedaccount(random-number)**.

1. Expand **Security + networking** and select **Access keys**.

1. Copy the **key1** value. You use this key to map a drive to the storage account from the virtual machine you created earlier.

1. In the search box in the portal, enter **Virtual machines**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. Expand **Operations**. Select **Run command**.

1. Select **RunPowerShellScript**.

1. Paste the following script in **Run Command Script**.

    ```powershell
    ## Enter the storage account key for the allowed storage account that you recorded earlier.
    $storageAcctKey1 = (pasted from procedure above)
    $acctKey = ConvertTo-SecureString -String $storageAcctKey1 -AsPlainText -Force
    ## Replace the login account with the name of the storage account you created.
    $credential = New-Object System.Management.Automation.PSCredential -ArgumentList ("Azure\allowedaccount"), $acctKey
    ## Replace the storage account name with the name of the storage account you created.
    New-PSDrive -Name Z -PSProvider FileSystem -Root "\\allowedaccount.file.core.windows.net\file-share" -Credential $credential
    ```

1. Select **Run**.

1. If the drive map is successful, the output in the **Output** box looks similar to the following example:

    ```output
    Name           Used (GB)     Free (GB) Provider      Root
    ----           ---------     --------- --------      ----
    Z                                      FileSystem    \\allowedaccount.file.core.windows.net\fil..
    ```

### Confirm access is denied to the *denied* storage account

1. In the search box in the portal, enter **Storage accounts**. Select **Storage accounts** in the search results.

1. Select **deniedaccount(random-number)**.

1. Expand **Security + networking** and select **Access keys**.

1. Copy the **key1** value. You use this key to map a drive to the storage account from the virtual machine you created earlier.

1. In the search box in the portal, enter **Virtual machines**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. Expand **Operations**. Select **Run command**.

1. Select **RunPowerShellScript**.

1. Paste the following script in **Run Command Script**.

    ```powershell
    ## Enter the storage account key for the denied storage account that you recorded earlier.
    $storageAcctKey2 = (pasted from procedure above)
    $acctKey = ConvertTo-SecureString -String $storageAcctKey2 -AsPlainText -Force
    ## Replace the login account with the name of the storage account you created.
    $credential = New-Object System.Management.Automation.PSCredential -ArgumentList ("Azure\deniedaccount"), $acctKey
    ## Replace the storage account name with the name of the storage account you created.
    New-PSDrive -Name Z -PSProvider FileSystem -Root "\\deniedaccount.file.core.windows.net\file-share" -Credential $credential
    ```

1. Select **Run**.

1. You receive the following error message in the **Output** box:

    ```output
    New-PSDrive : Access is denied
    At line:1 char:1
    + New-PSDrive -Name Z -PSProvider FileSystem -Root "\\deniedaccount8675 ...
    + ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (Z:PSDriveInfo) [New-PSDrive], Win32Exception
    + FullyQualifiedErrorId : CouldNotMapNetworkDrive,Microsoft.PowerShell.Commands.NewPSDriveCommand
    ```
1. The drive map is denied because of the service endpoint policy that restricts access to the storage account.

### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

When no longer needed, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive
$params = @{
    Name = "test-rg"
    Force = $true
}
Remove-AzResourceGroup @params
```

### [CLI](#tab/cli)

When no longer needed, use [az group delete](/cli/azure/group) to remove the resource group and all of the resources it contains.

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes \
    --no-wait
```

---

## Next steps
In this tutorial, you created a service endpoint policy and associated it to a subnet. To learn more about service endpoint policies, see [service endpoint policies overview.](virtual-network-service-endpoint-policies-overview.md)
