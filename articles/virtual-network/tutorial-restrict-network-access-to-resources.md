---
title: 'Tutorial: Restrict access to PaaS resources with service endpoints - Azure portal'
description: In this tutorial, you learn how to limit and restrict network access to Azure resources, such as an Azure Storage, with virtual network service endpoints using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: tutorial
ms.date: 08/15/2024
ms.custom: template-tutorial, devx-track-azurecli, devx-track-azurepowershell
# Customer intent: I want only resources in a virtual network subnet to access an Azure PaaS resource, such as an Azure Storage account.
---

# Tutorial: Restrict network access to PaaS resources with virtual network service endpoints using the Azure portal

Virtual network service endpoints enable you to limit network access to some Azure service resources to a virtual network subnet. You can also remove internet access to the resources. Service endpoints provide direct connection from your virtual network to supported Azure services, allowing you to use your virtual network's private address space to access the Azure services. Traffic destined to Azure resources through service endpoints always stays on the Microsoft Azure backbone network.

:::image type="content" source="./media/tutorial-restrict-network-access-to-resources/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-connect-virtual-networks-portal/resources-diagram.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network with one subnet
> * Add a subnet and enable a service endpoint
> * Create an Azure resource and allow network access to it from only a subnet
> * Deploy a virtual machine (VM) to each subnet
> * Confirm access to a resource from a subnet
> * Confirm access is denied to a resource from a subnet and the internet

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

### [PowerShell](#tab/powershell)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Enable a service endpoint

### [Portal](#tab/portal)

[!INCLUDE [virtual-network-create-with-bastion.md](~/reusable-content/ce-skilling/azure/includes/virtual-network-create-with-bastion.md)]

Service endpoints are enabled per service, per subnet. 

1. In the search box at the top of the portal page, search for **Virtual network**. Select **Virtual networks** in the search results.

1. In **Virtual networks**, select **vnet-1**.

1. In the **Settings** section of **vnet-1**, select **Subnets**.

1. Select **+ Subnet**.

1. On the **Add subnet** page, enter or select the following information:

    | Setting | Value |
    | --- | --- |
    | Name | **subnet-private** |
    | Subnet address range | Leave the default of **10.0.2.0/24**. |
    | **SERVICE ENDPOINTS** |  |
    | Services| Select **Microsoft.Storage**|

1. Select **Save**.

> [!CAUTION]
> Before enabling a service endpoint for an existing subnet that has resources in it, see [Change subnet settings](virtual-network-manage-subnet.md#change-subnet-settings).

### [PowerShell](#tab/powershell)

## Create a virtual network

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named *test-rg*: 

```azurepowershell-interactive
New-AzResourceGroup -ResourceGroupName test-rg -Location westus2
```

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named *vnet-1* with the address prefix *10.0.0.0/16*.

```azurepowershell-interactive
$virtualNetwork = New-AzVirtualNetwork `
  -ResourceGroupName test-rg `
  -Location westus2 `
  -Name vnet-1 `
  -AddressPrefix 10.0.0.0/16
```

Create a subnet configuration with [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig). The following example creates a subnet configuration for a subnet named *subnet-public*:

```azurepowershell-interactive
$subnetConfigPublic = Add-AzVirtualNetworkSubnetConfig `
  -Name subnet-public `
  -AddressPrefix 10.0.0.0/24 `
  -VirtualNetwork $virtualNetwork
```

Create the subnet in the virtual network by writing the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork):

```azurepowershell-interactive
$virtualNetwork | Set-AzVirtualNetwork
```

Create an additional subnet in the virtual network. In this example, a subnet named *subnet-private* is created with a service endpoint for *Microsoft.Storage*: 

```azurepowershell-interactive
$subnetConfigPrivate = Add-AzVirtualNetworkSubnetConfig `
  -Name subnet-private `
  -AddressPrefix 10.0.1.0/24 `
  -VirtualNetwork $virtualNetwork `
  -ServiceEndpoint Microsoft.Storage

$virtualNetwork | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

## Create a virtual network

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
  --subnet-name subnet-public \
  --subnet-prefix 10.0.0.0/24
```

You can enable service endpoints only for services that support service endpoints. View service endpoint-enabled services available in an Azure location with [az network vnet list-endpoint-services](/cli/azure/network/vnet). The following example returns a list of service-endpoint-enabled services available in the *westus2* region. The list of services returned will grow over time, as more Azure services become service endpoint enabled.

```azurecli-interactive
az network vnet list-endpoint-services \
  --location westus2 \
  --out table
```

Create another subnet in the virtual network with [az network vnet subnet create](/cli/azure/network/vnet/subnet). In this example, a service endpoint for `Microsoft.Storage` is created for the subnet: 

```azurecli-interactive
az network vnet subnet create \
  --vnet-name vnet-1 \
  --resource-group test-rg \
  --name subnet-private \
  --address-prefix 10.0.1.0/24 \
  --service-endpoints Microsoft.Storage
```

---

## Restrict network access for a subnet

### [Portal](#tab/portal)

By default, all virtual machine instances in a subnet can communicate with any resources. You can limit communication to and from all resources in a subnet by creating a network security group, and associating it to the subnet.

1. In the search box at the top of the portal page, search for **Network security group**. Select **Network security groups** in the search results.

1. In **Network security groups**, select **+ Create**.

1. In the **Basics** tab of **Create network security group**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **nsg-storage**. |
    | Region | Select **East US 2**. |

1. Select **Review + create**, then select **Create**.

### [PowerShell](#tab/powershell)

Create a network security group with [New-AzNetworkSecurityGroup](/powershell/module/az.network/new-aznetworksecuritygroup). The following example creates a network security group named *nsg-private*.

```azurepowershell-interactive
$nsg = New-AzNetworkSecurityGroup `
  -ResourceGroupName test-rg `
  -Location westus2 `
  -Name nsg-private `
  -SecurityRules $rule1,$rule2,$rule3
```

### [CLI](#tab/cli)

Create a network security group with [az network nsg create](/cli/azure/network/nsg). The following example creates a network security group named *nsg-private*.

```azurecli-interactive
az network nsg create \
  --resource-group test-rg \
  --name nsg-private
```

---

### Create outbound NSG rules

### [Portal](#tab/portal)

1. In the search box at the top of the portal page, search for **Network security group**. Select **Network security groups** in the search results.

1. Select **nsg-storage**.

1. Select **Outbound security rules** in **Settings**.

1. Select **+ Add**.

1. Create a rule that allows outbound communication to the Azure Storage service. Enter or select the following information in **Add outbound security rule**:

    | Setting | Value |
    | ------- | ----- |
    | Source | Select **Service Tag**. |
    | Source service tag | Select **VirtualNetwork**. |
    | Source port ranges | Leave the default of **\***. |
    | Destination | Select **Service Tag**. |
    | Destination service tag | Select **Storage**. |
    | Service | Leave default of **Custom**. |
    | Destination port ranges | Enter **445**. </br> SMB protocol is used to connect to a file share created in a later step. |
    | Protocol | Select **Any**. |
    | Action | Select **Allow**. |
    | Priority | Leave the default of **100**. |
    | Name | Enter **allow-storage-all**. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-outbound-storage-rule.png" alt-text="Screenshot of creating an outbound security to access storage.":::

1. Select **+ Add**.

1. Create another outbound security rule that denies communication to the internet. This rule overrides a default rule in all network security groups that allows outbound internet communication. Complete the previous steps with the following values in **Add outbound security rule**:

    | Setting | Value |
    | ------- | ----- |
    | Source | Select **Service Tag**. |
    | Source service tag | Select **VirtualNetwork**. |
    | Source port ranges | Leave the default of **\***. |
    | Destination | Select **Service Tag**. |
    | Destination service tag | Select **Internet**. |
    | Service | Leave default of **Custom**. |
    | Destination port ranges | Enter **\***. |
    | Protocol | Select **Any**. |
    | Action | Select **Deny**. |
    | Priority | Leave the default **110**. |
    | Name | Enter **deny-internet-all**. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/create-outbound-internet-rule.png" alt-text="Screenshot of creating an outbound security to block internet access.":::

1. Select **Add**.

1. In the search box at the top of the portal page, search for **Network security group**. Select **Network security groups** in the search results.

1. Select **nsg-storage**.

1. Select **Subnets** in **Settings**.

1. Select **+ Associate**.

1. In **Associate subnet**, select **vnet-1** in **Virtual network**. Select **subnet-private** in **Subnet**. 

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/associate-nsg-private-subnet.png" alt-text="Screenshot of private subnet associated with network security group.":::

1. Select **OK**.

### [PowerShell](#tab/powershell)

Create network security group security rules with [New-AzNetworkSecurityRuleConfig](/powershell/module/az.network/new-aznetworksecurityruleconfig). The following rule allows outbound access to the public IP addresses assigned to the Azure Storage service: 

```azurepowershell-interactive
$rule1 = New-AzNetworkSecurityRuleConfig `
  -Name Allow-Storage-All `
  -Access Allow `
  -DestinationAddressPrefix Storage `
  -DestinationPortRange * `
  -Direction Outbound `
  -Priority 100 `
  -Protocol * `
  -SourceAddressPrefix VirtualNetwork `
  -SourcePortRange *
```

The following rule denies access to all public IP addresses. The previous rule overrides this rule, due to its higher priority, which allows access to the public IP addresses of Azure Storage.

```azurepowershell-interactive
$rule2 = New-AzNetworkSecurityRuleConfig `
  -Name Deny-Internet-All `
  -Access Deny `
  -DestinationAddressPrefix Internet `
  -DestinationPortRange * `
  -Direction Outbound `
  -Priority 110 `
  -Protocol * `
  -SourceAddressPrefix VirtualNetwork `
  -SourcePortRange *
```

The following rule allows Remote Desktop Protocol (RDP) traffic inbound to the subnet from anywhere. Remote desktop connections are allowed to the subnet, so that you can confirm network access to a resource in a later step.

```azurepowershell-interactive
$rule3 = New-AzNetworkSecurityRuleConfig `
  -Name Allow-RDP-All `
  -Access Allow `
  -DestinationAddressPrefix VirtualNetwork `
  -DestinationPortRange 3389 `
  -Direction Inbound `
  -Priority 120 `
  -Protocol * `
  -SourceAddressPrefix * `
  -SourcePortRange *
```

Associate the network security group to the *subnet-private* subnet with [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig) and then write the subnet configuration to the virtual network. The following example associates the *nsg-private* network security group to the *subnet-private* subnet:

```azurepowershell-interactive
Set-AzVirtualNetworkSubnetConfig `
  -VirtualNetwork $VirtualNetwork `
  -Name subnet-private `
  -AddressPrefix 10.0.1.0/24 `
  -ServiceEndpoint Microsoft.Storage `
  -NetworkSecurityGroup $nsg

$virtualNetwork | Set-AzVirtualNetwork
```

### [CLI](#tab/cli)

Create security rules with [az network nsg rule create](/cli/azure/network/nsg/rule). The rule that follows allows outbound access to the public IP addresses assigned to the Azure Storage service: 

```azurecli-interactive
az network nsg rule create \
  --resource-group test-rg \
  --nsg-name nsg-private \
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
  --nsg-name nsg-private \
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

The following rule allows SSH traffic inbound to the subnet from anywhere. The rule overrides a default security rule that denies all inbound traffic from the internet. SSH is allowed to the subnet so that connectivity can be tested in a later step.

```azurecli-interactive
az network nsg rule create \
  --resource-group test-rg \
  --nsg-name nsg-private \
  --name Allow-SSH-All \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --priority 120 \
  --source-address-prefix "*" \
  --source-port-range "*" \
  --destination-address-prefix "VirtualNetwork" \
  --destination-port-range "22"
```

Associate the network security group to the *subnet-private* subnet with [az network vnet subnet update](/cli/azure/network/vnet/subnet). The following example associates the *nsg-private* network security group to the *subnet-private* subnet:

```azurecli-interactive
az network vnet subnet update \
  --vnet-name vnet-1 \
  --name subnet-private \
  --resource-group test-rg \
  --network-security-group nsg-private
```

---

## Restrict network access to a resource

### [Portal](#tab/portal)

The steps required to restrict network access to resources created through Azure services, which are enabled for service endpoints vary across services. See the documentation for individual services for specific steps for each service. The rest of this tutorial includes steps to restrict network access for an Azure Storage account, as an example.

[!INCLUDE [create-storage-account.md](~/reusable-content/ce-skilling/azure/includes/create-storage-account.md)]

### [PowerShell](#tab/powershell)

Create an Azure storage account with [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount). Replace `<replace-with-your-unique-storage-account-name>` with a name that is unique across all Azure locations, between 3-24 characters in length, using only numbers and lower-case letters.

```azurepowershell-interactive
$storageAcctName = '<replace-with-your-unique-storage-account-name>'

New-AzStorageAccount `
  -Location westus2 `
  -Name $storageAcctName `
  -ResourceGroupName test-rg `
  -SkuName Standard_LRS `
  -Kind StorageV2
```

After the storage account is created, retrieve the key for the storage account into a variable with [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey):

```azurepowershell-interactive
$storageAcctKey = (Get-AzStorageAccountKey `
  -ResourceGroupName test-rg `
  -AccountName $storageAcctName).Value[0]
```

For the purposes of this tutorial, the connection string is used to connect to the storage account. Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a high degree of trust in the application, and carries risks that aren't present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

For more information about connecting to a storage account using a managed identity, see [Use a managed identity to access Azure Storage](/entra/identity/managed-identities-azure-resources/tutorial-linux-managed-identities-vm-access?pivots=identity-linux-mi-vm-access-storage).

The key is used to create a file share in a later step. Enter `$storageAcctKey` and note the value, as you'll also need to manually enter it in a later step when you map the file share to a drive in a VM.

### [CLI](#tab/cli)

The steps necessary to restrict network access to resources created through Azure services enabled for service endpoints varies across services. See the documentation for individual services for specific steps for each service. The remainder of this article includes steps to restrict network access for an Azure Storage account, as an example.

### Create a storage account

Create an Azure storage account with [az storage account create](/cli/azure/storage/account). Replace `<replace-with-your-unique-storage-account-name>` with a name that is unique across all Azure locations, between 3-24 characters in length, using only numbers and lower-case letters.

```azurecli-interactive
storageAcctName="<replace-with-your-unique-storage-account-name>"

az storage account create \
  --name $storageAcctName \
  --resource-group test-rg \
  --sku Standard_LRS \
  --kind StorageV2
```

After the storage account is created, retrieve the connection string for the storage account into a variable with [az storage account show-connection-string](/cli/azure/storage/account). The connection string is used to create a file share in a later step.

For the purposes of this tutorial, the connection string is used to connect to the storage account. Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a high degree of trust in the application, and carries risks that aren't present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

For more information about connecting to a storage account using a managed identity, see [Use a managed identity to access Azure Storage](/entra/identity/managed-identities-azure-resources/tutorial-linux-managed-identities-vm-access?pivots=identity-linux-mi-vm-access-storage).

```azurecli-interactive
saConnectionString=$(az storage account show-connection-string \
  --name $storageAcctName \
  --resource-group test-rg \
  --query 'connectionString' \
  --out tsv)
```

---

### Create a file share in the storage account

### [Portal](#tab/portal)

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. In **Storage accounts**, select the storage account you created in the previous step.

1. In **Data storage**, select **File shares**.

1. Select **+ File share**.

1. Enter or select the following information in **New file share**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **file-share**. |
    | Tier | Leave the default of **Transaction optimized**. |

1. Select **Next: Backup**.

1. Deselect **Enable backup**.

1. Select **Review + create**, then select **Create**.

### [PowerShell](#tab/powershell)

Create a context for your storage account and key with [New-AzStorageContext](/powershell/module/az.storage/new-AzStoragecontext). The context encapsulates the storage account name and account key:

```azurepowershell-interactive
$storageContext = New-AzStorageContext $storageAcctName $storageAcctKey
```

Create a file share with [New-AzStorageShare](/powershell/module/az.storage/new-azstorageshare):

```azurepowershell-interactive
$share = New-AzStorageShare file-share -Context $storageContext
```

### [CLI](#tab/cli)

Create a file share in the storage account with [az storage share create](/cli/azure/storage/share). In a later step, this file share is mounted to confirm network access to it.

```azurecli-interactive
az storage share create \
  --name file-share \
  --quota 2048 \
  --connection-string $saConnectionString > /dev/null
```

---

## Restrict network access to a subnet

### [Portal](#tab/portal)

By default, storage accounts accept network connections from clients in any network, including the internet. You can restrict network access from the internet, and all other subnets in all virtual networks (except the **subnet-private** subnet in the **vnet-1** virtual network.) 

To restrict network access to a subnet:

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. Select your storage account.

1. In **Security + networking**, select **Networking**.

1. In the **Firewalls and virtual networks** tab, select **Enabled from selected virtual networks and IP addresses** in **Public network access**.

1. In **Virtual networks**, select **+ Add existing virtual network**.

1. In **Add networks**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription. |
    | Virtual networks | Select **vnet-1**. |
    | Subnets | Select **subnet-private**. |

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/restrict-network-access.png" alt-text="Screenshot of restriction of storage account to the subnet and virtual network created previously.":::

1. Select **Add**.

1. Select **Save** to save the virtual network configurations.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/restrict-network-access-save.png" alt-text="Screenshot of storage account screen and confirmation of subnet restriction.":::

### [PowerShell](#tab/powershell)

By default, storage accounts accept network connections from clients in any network. To limit access to selected networks, change the default action to *Deny* with [Update-AzStorageAccountNetworkRuleSet](/powershell/module/az.storage/update-azstorageaccountnetworkruleset). Once network access is denied, the storage account is not accessible from any network.

```azurepowershell-interactive
Update-AzStorageAccountNetworkRuleSet  `
  -ResourceGroupName "test-rg" `
  -Name $storageAcctName `
  -DefaultAction Deny
```

Retrieve the created virtual network with [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and then retrieve the private subnet object into a variable with [Get-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/get-azvirtualnetworksubnetconfig):

```azurepowershell-interactive
$privateSubnet = Get-AzVirtualNetwork `
  -ResourceGroupName "test-rg" `
  -Name "vnet-1" `
  | Get-AzVirtualNetworkSubnetConfig `
  -Name "subnet-private"
```

Allow network access to the storage account from the *subnet-private* subnet with [Add-AzStorageAccountNetworkRule](/powershell/module/az.network/add-aznetworksecurityruleconfig).

```azurepowershell-interactive
Add-AzStorageAccountNetworkRule `
  -ResourceGroupName "test-rg" `
  -Name $storageAcctName `
  -VirtualNetworkResourceId $privateSubnet.Id
```

### [CLI](#tab/cli)

By default, storage accounts accept network connections from clients in any network. To limit access to selected networks, change the default action to *Deny* with [az storage account update](/cli/azure/storage/account). Once network access is denied, the storage account isn't accessible from any network.

```azurecli-interactive
az storage account update \
  --name $storageAcctName \
  --resource-group test-rg \
  --default-action Deny
```

Allow network access to the storage account from the *subnet-private* subnet with [az storage account network-rule add](/cli/azure/storage/account/network-rule).

```azurecli-interactive
az storage account network-rule add \
  --resource-group test-rg \
  --account-name $storageAcctName \
  --vnet-name vnet-1 \
  --subnet subnet-private
```

---

## Deploy virtual machines to subnets

### [Portal](#tab/portal)

To test network access to a storage account, deploy a virtual machine to each subnet.

[!INCLUDE [create-test-virtual-machine.md](~/reusable-content/ce-skilling/azure/includes/create-test-virtual-machine.md)]

### Create the second virtual machine

1. Repeat the steps in the previous section to create a second virtual machine. Replace the following values in **Create a virtual machine**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual machine name | Enter **vm-private**. |
    | Subnet | Select **subnet-private**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

    > [!WARNING]
    > Do not continue to the next step until the deployment is completed.

### [PowerShell](#tab/powershell)

### Create the first virtual machine

Create a virtual machine in the *subnet-public* subnet with [New-AzVM](/powershell/module/az.compute/new-azvm). When running the command that follows, you are prompted for credentials. The values that you enter are configured as the user name and password for the VM. The `-AsJob` option creates the VM in the background, so that you can continue to the next step.

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "test-rg" `
    -Location "WestUS2" `
    -VirtualNetworkName "vnet-1" `
    -SubnetName "subnet-public" `
    -Name "vm-public" `
    -AsJob
```

Output similar to the following example output is returned:

```powershell
Id     Name            PSJobTypeName   State         HasMoreData     Location             Command                  
--     ----            -------------   -----         -----------     --------             -------                  
1      Long Running... AzureLongRun... Running       True            localhost            New-AzVM     
```

### Create the second virtual machine

Create a virtual machine in the *subnet-private* subnet:

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "test-rg" `
    -Location "East US" `
    -VirtualNetworkName "vnet-1" `
    -SubnetName "subnet-private" `
    -Name "vm-private" `
```

It takes a few minutes for Azure to create the VM. Do not continue to the next step until Azure finishes creating the VM and returns output to PowerShell.

### [CLI](#tab/cli)

To test network access to a storage account, deploy a VM to each subnet.

### Create the first virtual machine

Create a VM in the *subnet-public* subnet with [az vm create](/cli/azure/vm). If SSH keys don't already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option.

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-public \
  --image Ubuntu2204 \
  --vnet-name vnet-1 \
  --subnet subnet-public \
  --admin-username azureuser \
  --generate-ssh-keys
```

The VM takes a few minutes to create. After the VM is created, the Azure CLI shows information similar to the following example: 

```output 
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm-public",
  "location": "westus2",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "203.0.113.24",
  "resourceGroup": "test-rg"
}
```

### Create the second virtual machine

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-private \
  --image Ubuntu2204 \
  --vnet-name vnet-1 \
  --subnet subnet-private \
  --admin-username azureuser \
  --generate-ssh-keys
```

The VM takes a few minutes to create.

---

## Confirm access to storage account

### [Portal](#tab/portal)

The virtual machine you created earlier that is assigned to the **subnet-private** subnet is used to confirm access to the storage account. The virtual machine you created in the previous section that is assigned to the **subnet-1** subnet is used to confirm that access to the storage account is blocked.

### Get storage account access key

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. In **Storage accounts**, select your storage account.

1. In **Security + networking**, select **Access keys**.

1. Copy the value of **key1**. You may need to select the **Show** button to display the key.

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/storage-account-access-key.png" alt-text="Screenshot of storage account access key.":::

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-private**.

1. Select **Bastion** in **Operations**.

1. Enter the username and password you specified when creating the virtual machine. Select **Connect**.

1. Open Windows PowerShell. Use the following script to map the Azure file share to drive Z. 

    * Replace `<storage-account-key>` with the key you copied in the previous step. 

    * Replace `<storage-account-name>` with the name of your storage account. In this example, it's **storage8675**.

   ```powershell
    $key = @{
        String = "<storage-account-key>"
    }
    $acctKey = ConvertTo-SecureString @key -AsPlainText -Force
    
    $cred = @{
        ArgumentList = "Azure\<storage-account-name>", $acctKey
    }
    $credential = New-Object System.Management.Automation.PSCredential @cred

    $map = @{
        Name = "Z"
        PSProvider = "FileSystem"
        Root = "\\<storage-account-name>.file.core.windows.net\file-share"
        Credential = $credential
    }
    New-PSDrive @map
   ```

   PowerShell returns output similar to the following example output:

   ```output
   Name        Used (GB)     Free (GB) Provider      Root
   ----        ---------     --------- --------      ----
   Z                                      FileSystem    \\storage8675.file.core.windows.net\f...
   ```

   The Azure file share successfully mapped to the Z drive.

1. Close the Bastion connection to **vm-private**.

### [PowerShell](#tab/powershell)

Use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to return the public IP address of a VM. The following example returns the public IP address of the *vm-private" `* VM:

```azurepowershell-interactive
Get-AzPublicIpAddress `
  -Name vm-private" ` `
  -ResourceGroupName test-rg `
  | Select IpAddress
```

Replace `<publicIpAddress>` in the following command, with the public IP address returned from the previous command, and then enter the following command:

```powershell
mstsc /v:<publicIpAddress>
```

A Remote Desktop Protocol (.rdp) file is created and downloaded to your computer. Open the downloaded rdp file. If prompted, select **Connect**. Enter the user name and password you specified when creating the VM. You may need to select **More choices**, then **Use a different account**, to specify the credentials you entered when you created the VM. Select **OK**. You may receive a certificate warning during the sign-in process. If you receive the warning, select **Yes** or **Continue**, to proceed with the connection.

On the *vm-private" `* VM, map the Azure file share to drive Z using PowerShell. Before running the commands that follow, replace `<storage-account-key>` and `<storage-account-name>` with values from you supplied or retrieved in [Create a storage account](#create-a-storage-account).

```powershell
$acctKey = ConvertTo-SecureString -String "<storage-account-key>" -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential -ArgumentList "Azure\<storage-account-name>", $acctKey
New-PSDrive -Name Z -PSProvider FileSystem -Root "\\<storage-account-name>.file.core.windows.net\my-file-share" -Credential $credential
```

PowerShell returns output similar to the following example output:

```powershell
Name           Used (GB)     Free (GB) Provider      Root
----           ---------     --------- --------      ----
Z                                      FileSystem    \\vnt.file.core.windows.net\my-f...
```

The Azure file share successfully mapped to the Z drive.

Confirm that the VM has no outbound connectivity to any other public IP addresses:

```powershell
ping bing.com
```

You receive no replies, because the network security group associated to the *Private* subnet does not allow outbound access to public IP addresses other than the addresses assigned to the Azure Storage service.

Close the remote desktop session to the *vm-private" `* VM.

### [CLI](#tab/cli)

SSH into the *vm-private* VM.

Run the following command to store the IP address of the VM as an environment variable:

```bash
export IP_ADDRESS=$(az vm show --show-details --resource-group test-rg --name vm-private --query publicIps --output tsv)
```

```bash 
ssh -o StrictHostKeyChecking=no azureuser@$IP_ADDRESS
```

Create a folder for a mount point:

```bash
sudo mkdir /mnt/file-share
```

Mount the Azure file share to the directory you created. Before running the following command, replace `<storage-account-name>` with the account name and `<storage-account-key>` with the key you retrieved in [Create a storage account](#create-a-storage-account).

```bash
sudo mount --types cifs //<storage-account-name>.file.core.windows.net/my-file-share /mnt/file-share --options vers=3.0,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino
```

You receive the `user@vm-private:~$` prompt. The Azure file share successfully mounted to */mnt/file-share*.

Confirm that the VM has no outbound connectivity to any other public IP addresses:

```bash
ping bing.com -c 4
```

You receive no replies, because the network security group associated to the *subnet-private* subnet doesn't allow outbound access to public IP addresses other than the addresses assigned to the Azure Storage service.

Exit the SSH session to the *vm-private* VM.

---

## Confirm access is denied to storage account

### [Portal](#tab/portal)

### From vm-1

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. Select **Bastion** in **Operations**.

1. Enter the username and password you specified when creating the virtual machine. Select **Connect**.

1. Repeat the previous command to attempt to map the drive to the file share in the storage account. You may need to copy the storage account access key again for this procedure:

    ```powershell
    $key = @{
        String = "<storage-account-key>"
    }
    $acctKey = ConvertTo-SecureString @key -AsPlainText -Force
    
    $cred = @{
        ArgumentList = "Azure\<storage-account-name>", $acctKey
    }
    $credential = New-Object System.Management.Automation.PSCredential @cred

    $map = @{
        Name = "Z"
        PSProvider = "FileSystem"
        Root = "\\<storage-account-name>.file.core.windows.net\file-share"
        Credential = $credential
    }
    New-PSDrive @map
   ```
    
1. You should receive the following error message:

    ```output
    New-PSDrive : Access is denied
    At line:1 char:5
    +     New-PSDrive @map
    +     ~~~~~~~~~~~~~~~~
        + CategoryInfo          : InvalidOperation: (Z:PSDriveInfo) [New-PSDrive], Win32Exception
        + FullyQualifiedErrorId : CouldNotMapNetworkDrive,Microsoft.PowerShell.Commands.NewPSDriveCommand
    ```

4. Close the Bastion connection to **vm-1**.

### From a local machine

1. In the search box at the top of the portal, enter **Storage account**. Select **Storage accounts** in the search results.

1. In **Storage accounts**, select your storage account.

1. In **Data storage**, select **File shares**.

1. Select **file-share**.

1. Select **Browse** in the left-hand menu.

1. You should receive the following error message:

    :::image type="content" source="./media/tutorial-restrict-network-access-to-resources/access-denied-error.png" alt-text="Screenshot of access denied error message.":::

>[!NOTE] 
> The access is denied because your computer isn't in the **subnet-private** subnet of the **vnet-1** virtual network.

### [PowerShell](#tab/powershell)

Get the public IP address of the *vm-public* VM:

```azurepowershell-interactive
Get-AzPublicIpAddress `
  -Name vm-public `
  -ResourceGroupName test-rg `
  | Select IpAddress
```

Replace `<publicIpAddress>` in the following command, with the public IP address returned from the previous command, and then enter the following command: 

```powershell
mstsc /v:<publicIpAddress>
```

On the *vm-public* VM, attempt to map the Azure file share to drive Z. Before running the commands that follow, replace `<storage-account-key>` and `<storage-account-name>` with values from you supplied or retrieved in [Create a storage account](#create-a-storage-account).

```powershell
$acctKey = ConvertTo-SecureString -String "<storage-account-key>" -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential -ArgumentList "Azure\<storage-account-name>", $acctKey
New-PSDrive -Name Z -PSProvider FileSystem -Root "\\<storage-account-name>.file.core.windows.net\file-share" -Credential $credential
```

Access to the share is denied, and you receive a `New-PSDrive : Access is denied` error. Access is denied because the *vm-public* VM is deployed in the *subnet-public* subnet. The *subnet-public* subnet does not have a service endpoint enabled for Azure Storage, and the storage account only allows network access from the *subnet-private* subnet, not the *subnet-public* subnet.

Close the remote desktop session to the *vm-public* VM.

From your computer, attempt to view the file shares in the storage account with the following command:

```powershell-interactive
Get-AzStorageFile `
  -ShareName file-share `
  -Context $storageContext
```

Access is denied, and you receive a *Get-AzStorageFile : The remote server returned an error: (403) Forbidden. HTTP Status Code: 403 - HTTP Error Message: This request is not authorized to perform this operation* error, because your computer is not in the *subnet-private* subnet of the *vnet-1* virtual network.

### [CLI](#tab/cli)

SSH into the *vm-public* VM.

Run the following command to store the IP address of the VM as an environment variable:

```bash
export IP_ADDRESS=$(az vm show --show-details --resource-group test-rg --name vm-public --query publicIps --output tsv)
```

```bash 
ssh -o StrictHostKeyChecking=no azureuser@$IP_ADDRESS
```

Create a directory for a mount point:

```bash
sudo mkdir /mnt/file-share
```

Attempt to mount the Azure file share to the directory you created. This article assumes you deployed the latest version of Ubuntu. If you're using earlier versions of Ubuntu, see [Mount on Linux](../storage/files/storage-how-to-use-files-linux.md?toc=%2fazure%2fvirtual-network%2ftoc.json) for more instructions about mounting file shares. Before running the following command, replace `<storage-account-name>` with the account name and `<storage-account-key>` with the key you retrieved in [Create a storage account](#create-a-storage-account):

```bash
sudo mount --types cifs //storage-account-name>.file.core.windows.net/file-share /mnt/file-share --options vers=3.0,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino
```

Access is denied, and you receive a `mount error(13): Permission denied` error, because the *vm-public* VM is deployed within the *subnet-public* subnet. The *subnet-public* subnet doesn't have a service endpoint enabled for Azure Storage, and the storage account only allows network access from the *subnet-private* subnet, not the *subnet-public* subnet.

Exit the SSH session to the *vm-public* VM.

From your computer, attempt to view the shares in your storage account with [az storage share list](/cli/azure/storage/share). Replace `<account-name>` and `<account-key>` with the storage account name and key from [Create a storage account](#create-a-storage-account):

```azurecli-interactive
az storage share list \
  --account-name <account-name> \
  --account-key <account-key>
```

Access is denied and you receive a **This request isn't authorized to perform this operation** error, because your computer isn't in the *subnet-private* subnet of the *vnet-1* virtual network.

---

### [Portal](#tab/portal)

[!INCLUDE [portal-clean-up.md](~/reusable-content/ce-skilling/azure/includes/portal-clean-up.md)]

### [PowerShell](#tab/powershell)

When no longer needed, you can use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all of the resources it contains:

```azurepowershell-interactive 
Remove-AzResourceGroup -Name test-rg -Force
```

### [CLI](#tab/cli)

## Clean up resources

When no longer needed, use [az group delete](/cli/azure) to remove the resource group and all of the resources it contains.

```azurecli-interactive 
az group delete \
    --name test-rg \
    --yes \
    --no-wait
```

---

## Next steps

In this tutorial:

* You enabled a service endpoint for a virtual network subnet.

* You learned that you can enable service endpoints for resources deployed from multiple Azure services.

* You created an Azure Storage account and restricted the network access to the storage account to only resources within a virtual network subnet. 

To learn more about service endpoints, see [Service endpoints overview](virtual-network-service-endpoints-overview.md) and [Manage subnets](virtual-network-manage-subnet.md).

If you have multiple virtual networks in your account, you may want to establish connectivity between them so that resources can communicate with each other. To learn how to connect virtual networks, advance to the next tutorial.

> [!div class="nextstepaction"]
> [Connect virtual networks](./tutorial-connect-virtual-networks-portal.md)
