---
title: Create a virtual network peering between different subscriptions
titleSuffix: Azure Virtual Network
description: Learn how to create a virtual network peering between virtual networks created through Resource Manager that exist in different Azure subscriptions in the same or different Microsoft Entra tenant.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 08/23/2023
ms.custom: template-how-to, FY23 content-maintenance, devx-track-azurepowershell, devx-track-azurecli, devx-track-linux
---

# Create a virtual network peering - Resource Manager, different subscriptions and Microsoft Entra tenants

In this tutorial, you learn to create a virtual network peering between virtual networks created through Resource Manager. The virtual networks exist in different subscriptions that may belong to different Microsoft Entra tenants. Peering two virtual networks enables resources in different virtual networks to communicate with each other with the same bandwidth and latency as though the resources were in the same virtual network. Learn more about [Virtual network peering](virtual-network-peering-overview.md).

Depending on whether, the virtual networks are in the same, or different subscriptions the steps to create a virtual network peering are different. Steps to peer networks created with the classic deployment model are different. For more information about deployment models, see [Azure deployment model](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json). 

Learn how to create a virtual network peering in other scenarios by selecting the scenario from the following table:

|Azure deployment model  | Azure subscription  |
|--------- |---------|
|[Both Resource Manager](tutorial-connect-virtual-networks-portal.md) |Same|
|[One Resource Manager, one classic](create-peering-different-deployment-models.md) |Same|
|[One Resource Manager, one classic](create-peering-different-deployment-models-subscriptions.md) |Different|

A virtual network peering can't be created between two virtual networks deployed through the classic deployment model. If you need to connect virtual networks that were both created through the classic deployment model, you can use an Azure [VPN Gateway](../vpn-gateway/tutorial-site-to-site-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) to connect the virtual networks.

This tutorial peers virtual networks in the same region. You can also peer virtual networks in different [supported regions](virtual-network-manage-peering.md#cross-region). It's recommended that you familiarize yourself with the [peering requirements and constraints](virtual-network-manage-peering.md#requirements-and-constraints) before peering virtual networks.

## Prerequisites

# [**Portal**](#tab/create-peering-portal)

- An Azure account(s) with two active subscriptions. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure account with permissions in both subscriptions or an account in each subscription with the proper permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).

    - To separate the duty of managing the network belonging to each tenant, add the user from each tenant as a guest in the opposite tenant and assign them the Network Contributor role to the virtual network. This procedure applies if the virtual networks are in different subscriptions and Active Directory tenants.

    - To establish a network peering when you don't intend to separate the duty of managing the network belonging to each tenant, add the user from tenant A as a guest in the opposite tenant. Then, assign them the Network Contributor role to initiate and connect the network peering from each subscription. With these permissions, the user is able to establish the network peering from each subscription.

    - For more information about guest users, see [Add Microsoft Entra B2B collaboration users in the Azure portal](../active-directory/external-identities/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory).

    - Each user must accept the guest user invitation from the opposite Microsoft Entra tenant.

- Sign-in to the [Azure portal](https://portal.azure.com).

# [**PowerShell**](#tab/create-peering-powershell)

- An Azure account(s) with two active subscriptions. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure account with permissions in both subscriptions or an account in each subscription with the proper permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).

    - To separate the duty of managing the network belonging to each tenant, add the user from each tenant as a guest in the opposite tenant and assign them the Network Contributor role to the virtual network. This procedure applies if the virtual networks are in different subscriptions and Active Directory tenants.

    - To establish a network peering when you don't intend to separate the duty of managing the network belonging to each tenant, add the user from tenant A as a guest in the opposite tenant. Then, assign them the Network Contributor role to initiate and connect the network peering from each subscription. With these permissions, the user is able to establish the network peering from each subscription.

    - For more information about guest users, see [Add Microsoft Entra B2B collaboration users in the Azure portal](../active-directory/external-identities/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory).

    - Each user must accept the guest user invitation from the opposite Microsoft Entra tenant.

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

# [**Azure CLI**](#tab/create-peering-cli)

- An Azure account(s) with two active subscriptions. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure account with permissions in both subscriptions or an account in each subscription with the proper permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).

    - To separate the duty of managing the network belonging to each tenant, add the user from each tenant as a guest in the opposite tenant and assign them the Network Contributor role to the virtual network. This procedure applies if the virtual networks are in different subscriptions and Active Directory tenants.

    - To establish a network peering when you don't intend to separate the duty of managing the network belonging to each tenant, add the user from tenant A as a guest in the opposite tenant. Then, assign them the Network Contributor role to initiate and connect the network peering from each subscription. With these permissions, the user is able to establish the network peering from each subscription.

    - For more information about guest users, see [Add Microsoft Entra B2B collaboration users in the Azure portal](../active-directory/external-identities/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory).

    - Each user must accept the guest user invitation from the opposite Microsoft Entra tenant.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

In the following steps, learn how to peer virtual networks in different subscriptions and Microsoft Entra tenants. 

You can use the same account that has permissions in both subscriptions or you can use separate accounts for each subscription to set up the peering. An account with permissions in both subscriptions can complete all of the steps without signing out and signing in to portal and assigning permissions.

The following resources and account examples are used in the steps in this article:

| User account | Resource group | Subscription | Virtual network |
| ------------ | -------------- | ------------ | --------------- |
| **user-1** | **test-rg** | **subscription-1** | **vnet-1** |
| **user-2** | **test-rg-2** | **subscription-2** | **vnet-2** |

## Create virtual network - vnet-1

> [!NOTE]
> If you are using a single account to complete the steps, you can skip the steps for logging out of the portal and assigning another user permissions to the virtual networks.

# [**Portal**](#tab/create-peering-portal)

<a name="create-virtual-network"></a>

[!INCLUDE [virtual-network-create-tabs.md](../../includes/virtual-network-create-tabs.md)]

# [**PowerShell**](#tab/create-peering-powershell)

### Sign in to subscription-1

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **subscription-1**.

```azurepowershell-interactive
Connect-AzAccount
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **subscription-1** with [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

```azurepowershell-interactive
Set-AzContext -Subscription subscription-1
```

### Create a resource group - test-rg

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
$rsg = @{
    Name = 'test-rg'
    Location = 'eastus2'
}
New-AzResourceGroup @rsg
```

### Create the virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). This example creates a subnet-1 virtual network named **vnet-1** in the **West US 3** location:

```azurepowershell-interactive
$vnet = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
    Location = 'eastus2'
    AddressPrefix = '10.0.0.0/16'
}
$virtualNetwork = New-AzVirtualNetwork @vnet
```
### Add a subnet

Azure deploys resources to a subnet within a virtual network, so you need to create a subnet. Create a subnet configuration named **subnet-1** with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig):

```azurepowershell-interactive
$subnet = @{
    Name = 'subnet-1'
    VirtualNetwork = $virtualNetwork
    AddressPrefix = '10.0.0.0/24'
}
$subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
```

### Associate the subnet to the virtual network

You can write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork). This command creates the subnet:

```azurepowershell-interactive
$virtualNetwork | Set-AzVirtualNetwork
```

# [**Azure CLI**](#tab/create-peering-cli)

### Sign in to subscription-1

Use [az sign-in](/cli/azure/reference-index#az-login) to sign in to **subscription-1**.

```azurecli-interactive
az login
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **subscription-1** with [az account set](/cli/azure/account#az-account-set).

```azurecli-interactive
az account set --subscription "subscription-1"
```

### Create a resource group - test-rg

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create):

```azurecli-interactive
az group create \
    --name test-rg \
    --location eastus2
```

### Create the virtual network

Create a virtual network and subnet with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). This example creates a subnet-1 virtual network named **vnet-1** in the **West US 3** location.

```azurecli-interactive
az network vnet create \
    --resource-group test-rg\
    --location eastus2 \
    --name vnet-1 \
    --address-prefixes 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.0.0.0/24
```

---

## Assign permissions for user-2

A user account in the other subscription that you want to peer with must be added to the network you previously created. If you're using a single account for both subscriptions, you can skip this section.

# [**Portal**](#tab/create-peering-portal)

1. Remain signed in to the portal as **user-1**.

1. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-1**.

1. Select **Access control (IAM)**.

1. Select **+ Add** -> **Add role assignment**.

1. In **Add role assignment** in the **Role** tab, select **Network Contributor**.

1. Select **Next**.

1. In the **Members** tab, select **+ Select members**.

1. In **Select members** in the search box, enter **user-2**.

1. Select **Select**.

1. Select **Review + assign**.

1. Select **Review + assign**.

# [**PowerShell**](#tab/create-peering-powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to obtain the resource ID for **vnet-1**. Assign **user-2** from **subscription-2** to **vnet-1** with [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment). 

Use [Get-AzADUser](/powershell/module/az.resources/get-azaduser) to obtain the object ID for **user-2**.

**user-2** is used in this example for the user account. Replace this value with the display name for the user from **subscription-2** that you wish to assign permissions to **vnet-1**. You can skip this step if you're using the same account for both subscriptions.

```azurepowershell-interactive
$id = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnet = Get-AzVirtualNetwork @id

$obj = Get-AzADUser -DisplayName 'user-2'

$role = @{
    ObjectId = $obj.id
    RoleDefinitionName = 'Network Contributor'
    Scope = $vnet.id
}
New-AzRoleAssignment @role
```

# [**Azure CLI**](#tab/create-peering-cli)

Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID for **vnet-1**. Assign **user-2** from **subscription-2** to **vnet-1** with [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create).

Use [az ad user list](/cli/azure/ad/user#az-ad-user-list) to obtain the object ID for **user-2**.

**user-2** is used in this example for the user account. Replace this value with the display name for the user from **subscription-2** that you wish to assign permissions to **vnet-1**. You can skip this step if you're using the same account for both subscriptions.

```azurecli-interactive
az ad user list --display-name user-2
```
```output
[
  {
    "businessPhones": [],
    "displayName": "user-2",
    "givenName": null,
    "id": "16d51293-ec4b-43b1-b54b-3422c108321a",
    "jobTitle": null,
    "mail": "user-2@fabrikam.com",
    "mobilePhone": null,
    "officeLocation": null,
    "preferredLanguage": null,
    "surname": null,
    "userPrincipalName": "user-2_fabrikam.com#EXT#@contoso.onmicrosoft.com"
  }
]
```

Make note of the object ID of **user-2** in field **id**. In this example, its **16d51293-ec4b-43b1-b54b-3422c108321a**.


```azurecli-interactive
vnetid=$(az network vnet show \
    --name vnet-1 \
    --resource-group test-rg \
    --query id \
    --output tsv)

az role assignment create \
      --assignee 16d51293-ec4b-43b1-b54b-3422c108321a \
      --role "Network Contributor" \
      --scope $vnetid
```

Replace the example guid in **`--assignee`** with the real object ID for **user-2**.

---

## Obtain resource ID of vnet-1

# [**Portal**](#tab/create-peering-portal)

1. Remain signed in to the portal as **user-1**.

1. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-1**.

1. In **Settings**, select **Properties**.

1. Copy the information in the **Resource ID** field and save for the later steps. The resource ID is similar to the following example: **`/subscriptions/<Subscription Id>/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/vnet-1`**.

1. Sign out of the portal as **user-1**.

# [**PowerShell**](#tab/create-peering-powershell)

The resource ID of **vnet-1** is required to set up the peering connection from **vnet-2** to **vnet-1**. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to obtain the resource ID for **vnet-1**.

```azurepowershell-interactive
$id = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnetA = Get-AzVirtualNetwork @id

$vnetA.id
``` 

# [**Azure CLI**](#tab/create-peering-cli)

The resource ID of **vnet-1** is required to set up the peering connection from **vnet-2** to **vnet-1**. Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID for **vnet-1**.

```azurecli-interactive
vnetidA=$(az network vnet show \
    --name vnet-1 \
    --resource-group test-rg \
    --query id \
    --output tsv)

echo $vnetidA
``` 

---

## Create virtual network - vnet-2

In this section, you sign in as **user-2** and create a virtual network for the peering connection to **vnet-1**.

# [**Portal**](#tab/create-peering-portal)

Repeat the steps in the [previous section](#create-virtual-network) to create a second virtual network with the following values:

| Setting | Value |
| --- | --- |
| Subscription | **subscription-2** |
| Resource group | **test-rg-2** |
| Name | **vnet-2** |
| Address space | **10.1.0.0/16** |
| Subnet name | **subnet-1** |
| Subnet address range | **10.1.0.0/24** |

# [**PowerShell**](#tab/create-peering-powershell)

### Sign in to subscription-2

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **subscription-2**.

```azurepowershell-interactive
Connect-AzAccount
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **subscription-2** with [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

```azurepowershell-interactive
Set-AzContext -Subscription subscription-2
```

### Create a resource group - test-rg-2

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
$rsg = @{
    Name = 'test-rg-2'
    Location = 'eastus2'
}
New-AzResourceGroup @rsg
```

### Create the virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). This example creates a subnet-1 virtual network named **vnet-2** in the **West US 3** location:

```azurepowershell-interactive
$vnet = @{
    Name = 'vnet-2'
    ResourceGroupName = 'test-rg-2'
    Location = 'eastus2'
    AddressPrefix = '10.1.0.0/16'
}
$virtualNetwork = New-AzVirtualNetwork @vnet
```
### Add a subnet

Azure deploys resources to a subnet within a virtual network, so you need to create a subnet. Create a subnet configuration named **subnet-1** with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig):

```azurepowershell-interactive
$subnet = @{
    Name = 'subnet-1'
    VirtualNetwork = $virtualNetwork
    AddressPrefix = '10.1.0.0/24'
}
$subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
```

### Associate the subnet to the virtual network

You can write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork). This command creates the subnet:

```azurepowershell-interactive
$virtualNetwork | Set-AzVirtualNetwork
```

# [**Azure CLI**](#tab/create-peering-cli)

### Sign in to subscription-2

Use [az sign-in](/cli/azure/reference-index#az-login) to sign in to **subscription-1**.

```azurecli-interactive
az login
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **subscription-2** with [az account set](/cli/azure/account#az-account-set).

```azurecli-interactive
az account set --subscription "subscription-2"
```

### Create a resource group - test-rg-2

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create):

```azurecli-interactive
az group create \
    --name test-rg-2 \
    --location eastus2
```

### Create the virtual network

Create a virtual network and subnet with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). This example creates a subnet-1 virtual network named **vnet-2** in the **West US 3** location.

```azurecli-interactive
az network vnet create \
    --resource-group test-rg-2\
    --location eastus2 \
    --name vnet-2 \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.1.0.0/24
```

---

## Assign permissions for user-1

A user account in the other subscription that you want to peer with must be added to the network you previously created. If you're using a single account for both subscriptions, you can skip this section.

# [**Portal**](#tab/create-peering-portal)

1. Remain signed in to the portal as **user-2**.

1. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-2**.

1. Select **Access control (IAM)**.

1. Select **+ Add** -> **Add role assignment**.

1. In **Add role assignment** in the **Role** tab, select **Network Contributor**.

1. Select **Next**.

1. In the **Members** tab, select **+ Select members**.

1. In **Select members** in the search box, enter **user-1**.

1. Select **Select**.

1. Select **Review + assign**.

1. Select **Review + assign**.

# [**PowerShell**](#tab/create-peering-powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to obtain the resource ID for **vnet-1**. Assign **user-1** from **subscription-1** to **vnet-2** with [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment). 

Use [Get-AzADUser](/powershell/module/az.resources/get-azaduser) to obtain the object ID for **user-1**.

**user-1** is used in this example for the user account. Replace this value with the display name for the user from **subscription-1** that you wish to assign permissions to **vnet-2**. You can skip this step if you're using the same account for both subscriptions.

```azurepowershell-interactive
$id = @{
    Name = 'vnet-2'
    ResourceGroupName = 'test-rg-2'
}
$vnet = Get-AzVirtualNetwork @id

$obj = Get-AzADUser -DisplayName 'user-1'

$role = @{
    ObjectId = $obj.id
    RoleDefinitionName = 'Network Contributor'
    Scope = $vnet.id
}
New-AzRoleAssignment @role
```

# [**Azure CLI**](#tab/create-peering-cli)

Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID for **vnet-2**. Assign **user-1** from **subscription-1** to **vnet-2** with [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create). 

Use [az ad user list](/cli/azure/ad/user#az-ad-user-list) to obtain the object ID for **user-1**.

**user-1** is used in this example for the user account. Replace this value with the display name for the user from **subscription-1** that you wish to assign permissions to **vnet-2**. You can skip this step if you're using the same account for both subscriptions.

```azurecli-interactive
az ad user list --display-name user-1
```

```output
[
  {
    "businessPhones": [],
    "displayName": "user-1",
    "givenName": null,
    "id": "ee0645cc-e439-4ffc-b956-79577e473969",
    "jobTitle": null,
    "mail": "user-1@contoso.com",
    "mobilePhone": null,
    "officeLocation": null,
    "preferredLanguage": null,
    "surname": null,
    "userPrincipalName": "user-1_contoso.com#EXT#@fabrikam.onmicrosoft.com"
  }
]
```

Make note of the object ID of **user-1** in field **id**. In this example, it's **ee0645cc-e439-4ffc-b956-79577e473969**.

```azurecli-interactive
vnetid=$(az network vnet show \
    --name vnet-2 \
    --resource-group test-rg-2 \
    --query id \
    --output tsv)

az role assignment create \
      --assignee ee0645cc-e439-4ffc-b956-79577e473969 \
      --role "Network Contributor" \
      --scope $vnetid
```

---

## Obtain resource ID of vnet-2

The resource ID of **vnet-2** is required to set up the peering connection from **vnet-1** to **vnet-2**. Use the following steps to obtain the resource ID of **vnet-2**.
# [**Portal**](#tab/create-peering-portal)

1. Remain signed in to the portal as **user-2**.

1. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-2**.

1. In **Settings**, select **Properties**.

1. Copy the information in the **Resource ID** field and save for the later steps. The resource ID is similar to the following example: **`/subscriptions/<Subscription Id>/resourceGroups/test-rg-2/providers/Microsoft.Network/virtualNetworks/vnet-2`**.

1. Sign out of the portal as **user-2**.

# [**PowerShell**](#tab/create-peering-powershell)

The resource ID of **vnet-2** is required to set up the peering connection from **vnet-1** to **vnet-2**. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to obtain the resource ID for **vnet-2**.

```azurepowershell-interactive
$id = @{
    Name = 'vnet-2'
    ResourceGroupName = 'test-rg-2'
}
$vnetB = Get-AzVirtualNetwork @id

$vnetB.id
```

# [**Azure CLI**](#tab/create-peering-cli)

The resource ID of **vnet-2** is required to set up the peering connection from **vnet-1** to **vnet-2**. Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID for **vnet-2**.

```azurecli-interactive
vnetidB=$(az network vnet show \
    --name vnet-2 \
    --resource-group test-rg-2 \
    --query id \
    --output tsv)

echo $vnetidB
``` 

---

## Create peering connection - vnet-1 to vnet-2

You need the **Resource ID** for **vnet-2** from the previous steps to set up the peering connection.

# [**Portal**](#tab/create-peering-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) as **user-1**. If you're using one account for both subscriptions, change to **subscription-1** in the portal.

1. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-1**.

1. Select **Peerings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- |
    | **This virtual network** |  |
    | Peering link name | Enter **vnet-1-to-vnet-2**. |
    | Allow access to remote virtual network | Leave the default of selected.  |
    | Allow traffic to remote virtual network | Select the checkbox. |
    | Allow traffic forwarded from the remote virtual network (allow gateway transit) | Leave the default of cleared. |
    | Use remote virtual network gateway or route server | Leave the default of cleared. |
    | **Remote virtual network** |  |
    | Peering link name | Leave blank. |
    | Virtual network deployment model | Select **Resource manager**. |
    | Select the box for **I know my resource ID**. |   |
    | Resource ID | Enter or paste the **Resource ID** for **vnet-2**. |

1. In the pull-down box, select the **Directory** that corresponds with **vnet-2** and **user-2**.

1. Select **Authenticate**.

    :::image type="content" source="./media/create-peering-different-subscriptions/vnet-1-to-vnet-2-peering.png" alt-text="Screenshot of peering from vnet-1 to vnet-2.":::

1. Select **Add**.

1. Sign out of the portal as **user-1**.

# [**PowerShell**](#tab/create-peering-powershell)

### Sign in to subscription-1

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **subscription-1**.

```azurepowershell-interactive
Connect-AzAccount
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **subscription-1** with [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

```azurepowershell-interactive
Set-AzContext -Subscription subscription-1
```

### Sign in to subscription-2

Authenticate to **subscription-2** so that the peering can be set up.

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **subscription-2**.

```azurepowershell-interactive
Connect-AzAccount
```

### Change to subscription-1 (optional)

You may have to switch back to **subscription-1** to continue with the actions in **subscription-1**.

Change context to **subscription-1**.

```azurepowershell-interactive
Set-AzContext -Subscription subscription-1
```

### Create peering connection

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering connection between **vnet-1** and **vnet-2**.

```azurepowershell-interactive
$netA = @{
    Name = 'vnet-1'
    ResourceGroupName = 'test-rg'
}
$vnetA = Get-AzVirtualNetwork @netA

$peer = @{
    Name = 'vnet-1-to-vnet-2'
    VirtualNetwork = $vnetA
    RemoteVirtualNetworkId = '/subscriptions/<subscription-2-Id>/resourceGroups/test-rg-2/providers/Microsoft.Network/virtualNetworks/vnet-2'
}
Add-AzVirtualNetworkPeering @peer
```

Use [Get-AzVirtualNetworkPeering](/powershell/module/az.network/get-azvirtualnetworkpeering) to obtain the status of the peering connections from **vnet-1** to **vnet-2**.

```azurepowershell-interactive
$status = @{
    ResourceGroupName =  'test-rg'
    VirtualNetworkName = 'vnet-1'
}
Get-AzVirtualNetworkPeering @status | Format-Table VirtualNetworkName, PeeringState
```

```powershell
PS /home/azureuser> Get-AzVirtualNetworkPeering @status | Format-Table VirtualNetworkName, PeeringState

VirtualNetworkName PeeringState
------------------ ------------
vnet-1            Initiated
```

# [**Azure CLI**](#tab/create-peering-cli)

### Sign in to subscription-1

Use [az sign-in](/cli/azure/reference-index#az-login) to sign in to **subscription-1**.

```azurecli-interactive
az login
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **subscription-1** with [az account set](/cli/azure/account#az-account-set).

```azurecli-interactive
az account set --subscription "subscription-1"
```

### Sign in to subscription-2

Authenticate to **subscription-2** so that the peering can be set up.

Use [az sign-in](/cli/azure/reference-index#az-login) to sign in to **subscription-2**.

```azurecli-interactive
az login
```

### Change to subscription-1 (optional)

You may have to switch back to **subscription-1** to continue with the actions in **subscription-1**.

Change context to **subscription-1**.

```azurecli-interactive
az account set --subscription "subscription-1"
```

### Create peering connection

Use [az network vnet peering create](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering connection between **vnet-1** and **vnet-2**.

```azurecli-interactive
az network vnet peering create \
    --name vnet-1-to-vnet-2 \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --remote-vnet /subscriptions/<subscription-2-Id>/resourceGroups/test-rg-2/providers/Microsoft.Network/VirtualNetworks/vnet-2 \
    --allow-vnet-access
```

Use [az network vnet peering list](/cli/azure/network/vnet/peering#az-network-vnet-peering-list) to obtain the status of the peering connections from **vnet-1** to **vnet-2**.

```azurecli-interactive
az network vnet peering list \
    --resource-group test-rg \
    --vnet-name vnet-1 \
    --output table
```

---

The peering connection shows in **Peerings** in a **Initiated** state. To complete the peer, a corresponding connection must be set up in **vnet-2**.

## Create peering connection - vnet-2 to vnet-1

You need the **Resource IDs** for **vnet-1** from the previous steps to set up the peering connection.

# [**Portal**](#tab/create-peering-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) as **user-2**. If you're using one account for both subscriptions, change to **subscription-2** in the portal.

1. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **vnet-2**.

1. Select **Peerings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- |
    | **This virtual network** |  |
    | Peering link name | Enter **vnet-2-to-vnet-1**. |
    | Allow access to remote virtual network | Leave the default of selected.  |
    | Allow traffic to remote virtual network | Select the checkbox. |
    | Allow traffic forwarded from the remote virtual network (allow gateway transit) | Leave the default of cleared. |
    | Use remote virtual network gateway or route server | Leave the default of cleared. |
    | **Remote virtual network** |  |
    | Peering link name | Leave blank. |
    | Virtual network deployment model | Select **Resource manager**. |
    | Select the box for **I know my resource ID**. |   |
    | Resource ID | Enter or paste the **Resource ID** for **vnet-1**. |

1. In the pull-down box, select the **Directory** that corresponds with **vnet-1** and **user-1**.

1. Select **Authenticate**.

    :::image type="content" source="./media/create-peering-different-subscriptions/vnet-2-to-vnet-1-peering.png" alt-text="Screenshot of peering from vnet-2 to vnet-1.":::

1. Select **Add**.

# [**PowerShell**](#tab/create-peering-powershell)

### Sign in to subscription-2

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **subscription-2**.

```azurepowershell-interactive
Connect-AzAccount
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **subscription-2** with [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

```azurepowershell-interactive
Set-AzContext -Subscription subscription-2
```

## Sign in to subscription-1

Authenticate to **subscription-1** so that the peering can be set up.

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **subscription-1**.

```azurepowershell-interactive
Connect-AzAccount
```

### Change to subscription-2 (optional)

You may have to switch back to **subscription-2** to continue with the actions in **subscription-2**.

Change context to **subscription-2**.

```azurepowershell-interactive
Set-AzContext -Subscription subscription-2
```

### Create peering connection

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering connection between **vnet-2** and **vnet-1**.

```azurepowershell-interactive
$netB = @{
    Name = 'vnet-2'
    ResourceGroupName = 'test-rg-2'
}
$vnetB = Get-AzVirtualNetwork @netB

$peer = @{
    Name = 'vnet-2-to-vnet-1'
    VirtualNetwork = $vnetB
    RemoteVirtualNetworkId = '/subscriptions/<subscription-1-Id>/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/vnet-1'
}
Add-AzVirtualNetworkPeering @peer
```

User [Get-AzVirtualNetworkPeering](/powershell/module/az.network/get-azvirtualnetworkpeering) to obtain the status of the peering connections from **vnet-2** to **vnet-1**.

```azurepowershell-interactive
$status = @{
    ResourceGroupName =  'test-rg-2'
    VirtualNetworkName = 'vnet-2'
}
Get-AzVirtualNetworkPeering @status | Format-Table VirtualNetworkName, PeeringState
```

```powershell
PS /home/azureuser> Get-AzVirtualNetworkPeering @status | Format-Table VirtualNetworkName, PeeringState

VirtualNetworkName PeeringState
------------------ ------------
vnet-2            Connected
```

# [**Azure CLI**](#tab/create-peering-cli)

### Sign in to subscription-2

Use [az sign-in](/cli/azure/reference-index#az-login) to sign in to **subscription-2**.

```azurecli-interactive
az login
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **subscription-2** with [az account set](/cli/azure/account#az-account-set).

```azurecli-interactive
az account set --subscription "subscription-2"
```

### Sign in to subscription-1

Authenticate to **subscription-1** so that the peering can be set up.

Use [az sign-in](/cli/azure/reference-index#az-login) to sign in to **subscription-1**.

```azurecli-interactive
az login
```

### Change to subscription-2 (optional)

You may have to switch back to **subscription-2** to continue with the actions in **subscription-2**.

Change context to **subscription-2**.

```azurecli-interactive
az account set --subscription "subscription-2"
```

### Create peering connection

Use [az network vnet peering create](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering connection between **vnet-2** and **vnet-1**.

```azurecli-interactive
az network vnet peering create \
    --name vnet-2-to-vnet-1 \
    --resource-group test-rg-2 \
    --vnet-name vnet-2 \
    --remote-vnet /subscriptions/<subscription-1-Id>/resourceGroups/test-rg/providers/Microsoft.Network/VirtualNetworks/vnet-1 \
    --allow-vnet-access
```

Use [az network vnet peering list](/cli/azure/network/vnet/peering#az-network-vnet-peering-list) to obtain the status of the peering connections from **vnet-2** to **vnet-1**.

```azurecli-interactive
az network vnet peering list \
    --resource-group test-rg-2 \
    --vnet-name vnet-2 \
    --output table
```
---

The peering is successfully established after you see **Connected** in the **Peering status** column for both virtual networks in the peering. Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using subnet-1 Azure name resolution for the virtual networks, the resources in the virtual networks aren't able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server or use Azure DNS.

For more information about using your own DNS for name resolution, see, [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

For more information about Azure DNS, see [What is Azure DNS?](../dns/dns-overview.md).

## Next steps

- Thoroughly familiarize yourself with important [virtual network peering constraints and behaviors](virtual-network-manage-peering.md#requirements-and-constraints) before creating a virtual network peering for production use.

- Learn about all [virtual network peering settings](virtual-network-manage-peering.md#create-a-peering).

- Learn how to [create a hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke#virtual-network-peering) with virtual network peering.
