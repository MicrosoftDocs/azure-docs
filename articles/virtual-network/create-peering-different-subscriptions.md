---
title: Create a virtual network peering between different subscriptions
titleSuffix: Azure Virtual Network
description: Learn how to create a virtual network peering between virtual networks created through Resource Manager that exist in different Azure subscriptions in the same or different Azure Active Directory tenant.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 12/30/2022
ms.custom: template-how-to, FY23 content-maintenance, devx-track-azurepowershell, devx-track-azurecli, devx-track-linux
---

# Create a virtual network peering - Resource Manager, different subscriptions and Azure Active Directory tenants

In this tutorial, you learn to create a virtual network peering between virtual networks created through Resource Manager. The virtual networks exist in different subscriptions that may belong to different Azure Active Directory (Azure AD) tenants. Peering two virtual networks enables resources in different virtual networks to communicate with each other with the same bandwidth and latency as though the resources were in the same virtual network. Learn more about [Virtual network peering](virtual-network-peering-overview.md).

Depending on whether the virtual networks are in the same, or different subscriptions the steps to create a virtual network peering are different. Steps to peer networks created with the classic deployment model are different. For more information about deployment models, see [Azure deployment model](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json). 

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

    - For more information about guest users, see [Add Azure Active Directory B2B collaboration users in the Azure portal](../active-directory/external-identities/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory).

    - Each user must accept the guest user invitation from the opposite Azure Active Directory tenant.

# [**PowerShell**](#tab/create-peering-powershell)

- An Azure account(s) with two active subscriptions. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure account with permissions in both subscriptions or an account in each subscription with the proper permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).

    - To separate the duty of managing the network belonging to each tenant, add the user from each tenant as a guest in the opposite tenant and assign them the Network Contributor role to the virtual network. This procedure applies if the virtual networks are in different subscriptions and Active Directory tenants.

    - To establish a network peering when you don't intend to separate the duty of managing the network belonging to each tenant, add the user from tenant A as a guest in the opposite tenant. Then, assign them the Network Contributor role to initiate and connect the network peering from each subscription. With these permissions, the user is able to establish the network peering from each subscription.

    - For more information about guest users, see [Add Azure Active Directory B2B collaboration users in the Azure portal](../active-directory/external-identities/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory).

    - Each user must accept the guest user invitation from the opposite Azure Active Directory tenant.

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

# [**Azure CLI**](#tab/create-peering-cli)

- An Azure account(s) with two active subscriptions. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure account with permissions in both subscriptions or an account in each subscription with the proper permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).

    - To separate the duty of managing the network belonging to each tenant, add the user from each tenant as a guest in the opposite tenant and assign them the Network Contributor role to the virtual network. This procedure applies if the virtual networks are in different subscriptions and Active Directory tenants.

    - To establish a network peering when you don't intend to separate the duty of managing the network belonging to each tenant, add the user from tenant A as a guest in the opposite tenant. Then, assign them the Network Contributor role to initiate and connect the network peering from each subscription. With these permissions, the user is able to establish the network peering from each subscription.

    - For more information about guest users, see [Add Azure Active Directory B2B collaboration users in the Azure portal](../active-directory/external-identities/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory).

    - Each user must accept the guest user invitation from the opposite Azure Active Directory tenant.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

In the following steps, learn how to peer virtual networks in different subscriptions and Azure Active Directory tenants. 

You can use the same account that has permissions in both subscriptions or you can use separate accounts for each subscription to set up the peering. An account with permissions in both subscriptions can complete all of the steps without signing out and signing in to portal and assigning permissions.

The following resources and account examples are used in the steps in this article:

| User account | Resource group | Subscription | Virtual network |
| ------------ | -------------- | ------------ | --------------- |
| **UserA** | **myResourceGroupA** | **SubscriptionA** | **myVNetA** |
| **UserB** | **myResourceGroupB** | **SubscriptionB** | **myVNetB** |

## Create virtual network - myVNetA

> [!NOTE]
> If you are using a single account to complete the steps, you can skip the steps for logging out of the portal and assigning another user permissions to the virtual networks.

# [**Portal**](#tab/create-peering-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com) as **UserA**.

2. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your **SubscriptionA**. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroupA** in **Name**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNetA**. |
    | Region | Select a region. |

5. Select **Next: IP Addresses**.

6. In **IPv4 address space**, enter **10.1.0.0/16**.

7. Select **+ Add subnet**.

8. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **mySubnet**. |
    | Subnet address range | Enter **10.1.0.0/24**. |

9. Select **Add**.

10. Select **Review + create**.

11. Select **Create**.

# [**PowerShell**](#tab/create-peering-powershell)

### Sign in to SubscriptionA

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **SubscriptionA**.

```azurepowershell-interactive
Connect-AzAccount
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **SubscriptionA** with [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

```azurepowershell-interactive
Set-AzContext -Subscription SubscriptionA
```

### Create a resource group - myResourceGroupA

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
$rsg = @{
    Name = 'myResourceGroupA'
    Location = 'westus3'
}
New-AzResourceGroup @rsg
```

### Create the virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). This example creates a default virtual network named **myVNetA** in the **West US 3** location:

```azurepowershell-interactive
$vnet = @{
    Name = 'myVNetA'
    ResourceGroupName = 'myResourceGroupA'
    Location = 'westus3'
    AddressPrefix = '10.1.0.0/16'
}
$virtualNetwork = New-AzVirtualNetwork @vnet
```
### Add a subnet

Azure deploys resources to a subnet within a virtual network, so you need to create a subnet. Create a subnet configuration named **default** with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig):

```azurepowershell-interactive
$subnet = @{
    Name = 'default'
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

### Sign in to SubscriptionA

Use [az login](/cli/azure/reference-index#az-login) to sign in to **SubscriptionA**.

```azurecli-interactive
az login
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **SubscriptionA** with [az account set](/cli/azure/account#az-account-set).

```azurecli-interactive
az account set --subscription "SubscriptionA"
```

### Create a resource group - myResourceGroupA

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create):

```azurecli-interactive
az group create \
    --name myResourceGroupA \
    --location westus3
```

### Create the virtual network

Create a virtual network and subnet with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). This example creates a default virtual network named **myVNetA** in the **West US 3** location.

```azurecli-interactive
az network vnet create \
    --resource-group myResourceGroupA\
    --location westus3 \
    --name myVNetA \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name default \
    --subnet-prefixes 10.1.0.0/24
```

---

## Assign permissions for UserB

A user account in the other subscription that you want to peer with must be added to the network you previously created. If you're using a single account for both subscriptions, you can skip this section.

# [**Portal**](#tab/create-peering-portal)

1. Remain signed in to the portal as **UserA**.

2. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **myVNetA**.

4. Select **Access control (IAM)**.

5. Select **+ Add** -> **Add role assignment**.

6. In **Add role assignment** in the **Role** tab, select **Network Contributor**.

7. Select **Next**.

8. In the **Members** tab, select **+ Select members**.

9. In **Select members** in the search box, enter **UserB**.

10. Select **Select**.

11. Select **Review + assign**.

12. Select **Review + assign**.

# [**PowerShell**](#tab/create-peering-powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to obtain the resource ID for **myVNetA**. Assign **UserB** from **SubscriptionB** to **myVNetA** with [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment). 

Use [Get-AzADUser](/powershell/module/az.resources/get-azaduser) to obtain the object ID for **UserB**.

**UserB** is used in this example for the user account. Replace this value with the display name for the user from **SubscriptionB** that you wish to assign permissions to **myVNetA**. You can skip this step if you're using the same account for both subscriptions.

```azurepowershell-interactive
$id = @{
    Name = 'myVNetA'
    ResourceGroupName = 'myResourceGroupA'
}
$vnet = Get-AzVirtualNetwork @id

$obj = Get-AzADUser -DisplayName 'UserB'

$role = @{
    ObjectId = $obj.id
    RoleDefinitionName = 'Network Contributor'
    Scope = $vnet.id
}
New-AzRoleAssignment @role
```

# [**Azure CLI**](#tab/create-peering-cli)

Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID for **myVNetA**. Assign **UserB** from **SubscriptionB** to **myVNetA** with [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create).

Use [az ad user list](/cli/azure/ad/user#az-ad-user-list) to obtain the object ID for **UserB**.

**UserB** is used in this example for the user account. Replace this value with the display name for the user from **SubscriptionB** that you wish to assign permissions to **myVNetA**. You can skip this step if you're using the same account for both subscriptions.

```azurecli-interactive
az ad user list --display-name UserB
```
```output
[
  {
    "businessPhones": [],
    "displayName": "UserB",
    "givenName": null,
    "id": "16d51293-ec4b-43b1-b54b-3422c108321a",
    "jobTitle": null,
    "mail": "userB@fabrikam.com",
    "mobilePhone": null,
    "officeLocation": null,
    "preferredLanguage": null,
    "surname": null,
    "userPrincipalName": "userb_fabrikam.com#EXT#@contoso.onmicrosoft.com"
  }
]
```

Make note of the object ID of **UserB** in field **id**. In this example, its **16d51293-ec4b-43b1-b54b-3422c108321a**.


```azurecli-interactive
vnetid=$(az network vnet show \
    --name myVNetA \
    --resource-group myResourceGroupA \
    --query id \
    --output tsv)

az role assignment create \
      --assignee 16d51293-ec4b-43b1-b54b-3422c108321a \
      --role "Network Contributor" \
      --scope $vnetid
```

Replace the example guid in **`--assignee`** with the real object ID for **UserB**.

---

## Obtain resource ID of myVNetA

# [**Portal**](#tab/create-peering-portal)

1. Remain signed in to the portal as **UserA**.

2. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **myVNetA**.

4. In **Settings**, select **Properties**.

5. Copy the information in the **Resource ID** field and save for the later steps. The resource ID is similar to the following example: **`/subscriptions/<Subscription Id>/resourceGroups/myResourceGroupA/providers/Microsoft.Network/virtualNetworks/myVnetA`**.

6. Sign out of the portal as **UserA**.

# [**PowerShell**](#tab/create-peering-powershell)

The resource ID of **myVNetA** is required to set up the peering connection from **myVNetB** to **myVNetA**. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to obtain the resource ID for **myVNetA**.

```azurepowershell-interactive
$id = @{
    Name = 'myVNetA'
    ResourceGroupName = 'myResourceGroupA'
}
$vnetA = Get-AzVirtualNetwork @id

$vnetA.id
``` 

# [**Azure CLI**](#tab/create-peering-cli)

The resource ID of **myVNetA** is required to set up the peering connection from **myVNetB** to **myVNetA**. Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID for **myVNetA**.

```azurecli-interactive
vnetidA=$(az network vnet show \
    --name myVNetA \
    --resource-group myResourceGroupA \
    --query id \
    --output tsv)

echo $vnetidA
``` 

---

## Create virtual network - myVNetB

In this section, you sign in as **UserB** and create a virtual network for the peering connection to **myVNetA**.

# [**Portal**](#tab/create-peering-portal)

1. Sign in to the portal as **UserB**. If you're using one account for both subscriptions, change to **SubscriptionB** in the portal.

2. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your **SubscriptionB**. |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroupB** in **Name**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNetB**. |
    | Region | Select a region. |

5. Select **Next: IP Addresses**.

6. In **IPv4 address space**, enter **10.2.0.0/16**.

7. Select **+ Add subnet**.

8. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subnet name | Enter **mySubnet**. |
    | Subnet address range | Enter **10.2.0.0/24**. |

9. Select **Add**.

10. Select **Review + create**.

11. Select **Create**.

# [**PowerShell**](#tab/create-peering-powershell)

### Sign in to SubscriptionB

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **SubscriptionB**.

```azurepowershell-interactive
Connect-AzAccount
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **SubscriptionB** with [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

```azurepowershell-interactive
Set-AzContext -Subscription SubscriptionB
```

### Create a resource group - myResourceGroupB

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup):

```azurepowershell-interactive
$rsg = @{
    Name = 'myResourceGroupB'
    Location = 'westus3'
}
New-AzResourceGroup @rsg
```

### Create the virtual network

Create a virtual network with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). This example creates a default virtual network named **myVNetB** in the **West US 3** location:

```azurepowershell-interactive
$vnet = @{
    Name = 'myVNetB'
    ResourceGroupName = 'myResourceGroupB'
    Location = 'westus3'
    AddressPrefix = '10.2.0.0/16'
}
$virtualNetwork = New-AzVirtualNetwork @vnet
```
### Add a subnet

Azure deploys resources to a subnet within a virtual network, so you need to create a subnet. Create a subnet configuration named **default** with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig):

```azurepowershell-interactive
$subnet = @{
    Name = 'default'
    VirtualNetwork = $virtualNetwork
    AddressPrefix = '10.2.0.0/24'
}
$subnetConfig = Add-AzVirtualNetworkSubnetConfig @subnet
```

### Associate the subnet to the virtual network

You can write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork). This command creates the subnet:

```azurepowershell-interactive
$virtualNetwork | Set-AzVirtualNetwork
```

# [**Azure CLI**](#tab/create-peering-cli)

### Sign in to SubscriptionB

Use [az login](/cli/azure/reference-index#az-login) to sign in to **SubscriptionA**.

```azurecli-interactive
az login
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **SubscriptionB** with [az account set](/cli/azure/account#az-account-set).

```azurecli-interactive
az account set --subscription "SubscriptionB"
```

### Create a resource group - myResourceGroupB

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create):

```azurecli-interactive
az group create \
    --name myResourceGroupB \
    --location westus3
```

### Create the virtual network

Create a virtual network and subnet with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). This example creates a default virtual network named **myVNetB** in the **West US 3** location.

```azurecli-interactive
az network vnet create \
    --resource-group myResourceGroupB\
    --location westus3 \
    --name myVNetB \
    --address-prefixes 10.2.0.0/16 \
    --subnet-name default \
    --subnet-prefixes 10.2.0.0/24
```

---

## Assign permissions for UserA

A user account in the other subscription that you want to peer with must be added to the network you previously created. If you're using a single account for both subscriptions, you can skip this section.

# [**Portal**](#tab/create-peering-portal)

1. Remain signed in to the portal as **UserB**.

2. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **myVNetB**.

4. Select **Access control (IAM)**.

5. Select **+ Add** -> **Add role assignment**.

6. In **Add role assignment** in the **Role** tab, select **Network Contributor**.

7. Select **Next**.

8. In the **Members** tab, select **+ Select members**.

9. In **Select members** in the search box, enter **UserA**.

10. Select **Select**.

11. Select **Review + assign**.

12. Select **Review + assign**.

# [**PowerShell**](#tab/create-peering-powershell)

Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to obtain the resource ID for **myVNetA**. Assign **UserA** from **SubscriptionA** to **myVNetB** with [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment). 

Use [Get-AzADUser](/powershell/module/az.resources/get-azaduser) to obtain the object ID for **UserA**.

**UserA** is used in this example for the user account. Replace this value with the display name for the user from **SubscriptionA** that you wish to assign permissions to **myVNetB**. You can skip this step if you're using the same account for both subscriptions.

```azurepowershell-interactive
$id = @{
    Name = 'myVNetB'
    ResourceGroupName = 'myResourceGroupB'
}
$vnet = Get-AzVirtualNetwork @id

$obj = Get-AzADUser -DisplayName 'UserA'

$role = @{
    ObjectId = $obj.id
    RoleDefinitionName = 'Network Contributor'
    Scope = $vnet.id
}
New-AzRoleAssignment @role
```

# [**Azure CLI**](#tab/create-peering-cli)

Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID for **myVNetB**. Assign **UserA** from **SubscriptionA** to **myVNetB** with [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create). 

Use [az ad user list](/cli/azure/ad/user#az-ad-user-list) to obtain the object ID for **UserA**.

**UserA** is used in this example for the user account. Replace this value with the display name for the user from **SubscriptionA** that you wish to assign permissions to **myVNetB**. You can skip this step if you're using the same account for both subscriptions.

```azurecli-interactive
az ad user list --display-name UserA
```

```output
[
  {
    "businessPhones": [],
    "displayName": "UserA",
    "givenName": null,
    "id": "ee0645cc-e439-4ffc-b956-79577e473969",
    "jobTitle": null,
    "mail": "userA@contoso.com",
    "mobilePhone": null,
    "officeLocation": null,
    "preferredLanguage": null,
    "surname": null,
    "userPrincipalName": "usera_contoso.com#EXT#@fabrikam.onmicrosoft.com"
  }
]
```

Make note of the object ID of **UserA** in field **id**. In this example, it's **ee0645cc-e439-4ffc-b956-79577e473969**.

```azurecli-interactive
vnetid=$(az network vnet show \
    --name myVNetB \
    --resource-group myResourceGroupB \
    --query id \
    --output tsv)

az role assignment create \
      --assignee ee0645cc-e439-4ffc-b956-79577e473969 \
      --role "Network Contributor" \
      --scope $vnetid
```

---

## Obtain resource ID of myVNetB

The resource ID of **myVNetB** is required to set up the peering connection from **myVNetA** to **myVNetB**. Use the following steps to obtain the resource ID of **myVNetB**.
# [**Portal**](#tab/create-peering-portal)

1. Remain signed in to the portal as **UserB**.

2. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **myVNetB**.

4. In **Settings**, select **Properties**.

5. Copy the information in the **Resource ID** field and save for the later steps. The resource ID is similar to the following example: **`/subscriptions/<Subscription Id>/resourceGroups/myResourceGroupB/providers/Microsoft.Network/virtualNetworks/myVnetB`**.

6. Sign out of the portal as **UserB**.

# [**PowerShell**](#tab/create-peering-powershell)

The resource ID of **myVNetB** is required to set up the peering connection from **myVNetA** to **myVNetB**. Use [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) to obtain the resource ID for **myVNetB**.

```azurepowershell-interactive
$id = @{
    Name = 'myVNetB'
    ResourceGroupName = 'myResourceGroupB'
}
$vnetB = Get-AzVirtualNetwork @id

$vnetB.id
```

# [**Azure CLI**](#tab/create-peering-cli)

The resource ID of **myVNetB** is required to set up the peering connection from **myVNetA** to **myVNetB**. Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID for **myVNetB**.

```azurecli-interactive
vnetidB=$(az network vnet show \
    --name myVNetB \
    --resource-group myResourceGroupB \
    --query id \
    --output tsv)

echo $vnetidB
``` 

---

## Create peering connection - myVNetA to myVNetB

You need the **Resource ID** for **myVNetB** from the previous steps to set up the peering connection.

# [**Portal**](#tab/create-peering-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) as **UserA**. If you're using one account for both subscriptions, change to **SubscriptionA** in the portal.

2. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **myVNetA**.

4. Select **Peerings**.

5. Select **+ Add**.

6. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- |
    | **This virtual network** |  |
    | Peering link name | Enter **myVNetAToMyVNetB**. |
    | Traffic to remote virtual network | Leave the default of **Allow (default)**. |
    | Traffic forwarded from remote virtual network | Leave the default of **Allow (default)**. |
    | Virtual network gateway or Route Server | Leave the default of **None (default)**. |
    | **Remote virtual network** |  |
    | Peering link name | Leave blank. |
    | Virtual network deployment model | Select **Resource manager**. |
    | Select the box for **I know my resource ID**. |   |
    | Resource ID | Enter or paste the **Resource ID** for **myVNetB**. |

7. In the pull-down box, select the **Directory** that corresponds with **myVNetB** and **UserB**.

8. Select **Authenticate**.

9. Select **Add**.

10. Sign out of the portal as **UserA**.

# [**PowerShell**](#tab/create-peering-powershell)

### Sign in to SubscriptionA

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **SubscriptionA**.

```azurepowershell-interactive
Connect-AzAccount
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **SubscriptionA** with [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

```azurepowershell-interactive
Set-AzContext -Subscription SubscriptionA
```

### Sign in to SubscriptionB

Authenticate to **SubscriptionB** so that the peering can be set up.

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **SubscriptionB**.

```azurepowershell-interactive
Connect-AzAccount
```

### Change to SubscriptionA (optional)

You may have to switch back to **SubscriptionA** to continue with the actions in **SubscriptionA**.

Change context to **SubscriptionA**.

```azurepowershell-interactive
Set-AzContext -Subscription SubscriptionA
```

### Create peering connection

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering connection between **myVNetA** and **myVNetB**.

```azurepowershell-interactive
$netA = @{
    Name = 'myVNetA'
    ResourceGroupName = 'myResourceGroupA'
}
$vnetA = Get-AzVirtualNetwork @netA

$peer = @{
    Name = 'myVNetAToMyVNetB'
    VirtualNetwork = $vnetA
    RemoteVirtualNetworkId = '/subscriptions/<SubscriptionB-Id>/resourceGroups/myResourceGroupB/providers/Microsoft.Network/virtualNetworks/myVnetB'
}
Add-AzVirtualNetworkPeering @peer
```

Use [Get-AzVirtualNetworkPeering](/powershell/module/az.network/get-azvirtualnetworkpeering) to obtain the status of the peering connections from **myVNetA** to **myVNetB**.

```azurepowershell-interactive
$status = @{
    ResourceGroupName =  'myResourceGroupA'
    VirtualNetworkName = 'myVNetA'
}
Get-AzVirtualNetworkPeering @status | Format-Table VirtualNetworkName, PeeringState
```

```powershell
PS /home/azureuser> Get-AzVirtualNetworkPeering @status | Format-Table VirtualNetworkName, PeeringState

VirtualNetworkName PeeringState
------------------ ------------
myVNetA            Initiated
```

# [**Azure CLI**](#tab/create-peering-cli)

### Sign in to SubscriptionA

Use [az login](/cli/azure/reference-index#az-login) to sign in to **SubscriptionA**.

```azurecli-interactive
az login
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **SubscriptionA** with [az account set](/cli/azure/account#az-account-set).

```azurecli-interactive
az account set --subscription "SubscriptionA"
```

### Sign in to SubscriptionB

Authenticate to **SubscriptionB** so that the peering can be set up.

Use [az login](/cli/azure/reference-index#az-login) to sign in to **SubscriptionB**.

```azurecli-interactive
az login
```

### Change to SubscriptionA (optional)

You may have to switch back to **SubscriptionA** to continue with the actions in **SubscriptionA**.

Change context to **SubscriptionA**.

```azurecli-interactive
az account set --subscription "SubscriptionA"
```

### Create peering connection

Use [az network vnet peering create](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering connection between **myVNetA** and **myVNetB**.

```azurecli-interactive
az network vnet peering create \
    --name myVNetAToMyVNetB \
    --resource-group myResourceGroupA \
    --vnet-name myVNetA \
    --remote-vnet /subscriptions/<SubscriptionB-Id>/resourceGroups/myResourceGroupB/providers/Microsoft.Network/VirtualNetworks/myVNetB \
    --allow-vnet-access
```

Use [az network vnet peering list](/cli/azure/network/vnet/peering#az-network-vnet-peering-list) to obtain the status of the peering connections from **myVNetA** to **myVNetB**.

```azurecli-interactive
az network vnet peering list \
    --resource-group myResourceGroupA \
    --vnet-name myVNetA \
    --output table
```

---

The peering connection shows in **Peerings** in a **Initiated** state. To complete the peer, a corresponding connection must be set up in **myVNetB**.

## Create peering connection - myVNetB to myVNetA

You need the **Resource IDs** for **myVNetA** from the previous steps to set up the peering connection.

# [**Portal**](#tab/create-peering-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) as **UserB**. If you're using one account for both subscriptions, change to **SubscriptionB** in the portal.

2. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **myVNetB**.

4. Select **Peerings**.

5. Select **+ Add**.

6. Enter or select the following information in **Add peering**:

    | Setting | Value |
    | ------- | ----- |
    | **This virtual network** |  |
    | Peering link name | Enter **myVNetBToMyVNetA**. |
    | Traffic to remote virtual network | Leave the default of **Allow (default)**. |
    | Traffic forwarded from remote virtual network | Leave the default of **Allow (default)**. |
    | Virtual network gateway or Route Server | Leave the default of **None (default)**. |
    | **Remote virtual network** |  |
    | Peering link name | Leave blank. |
    | Virtual network deployment model | Select **Resource manager**. |
    | Select the box for **I know my resource ID**. |   |
    | Resource ID | Enter or paste the **Resource ID** for **myVNetA**. |

7. In the pull-down box, select the **Directory** that corresponds with **myVNetA** and **UserA**.

8. Select **Authenticate**.

9. Select **Add**.

# [**PowerShell**](#tab/create-peering-powershell)

### Sign in to SubscriptionB

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **SubscriptionB**.

```azurepowershell-interactive
Connect-AzAccount
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **SubscriptionB** with [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

```azurepowershell-interactive
Set-AzContext -Subscription SubscriptionB
```

## Sign in to SubscriptionA

Authenticate to **SubscriptionA** so that the peering can be set up.

Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to **SubscriptionA**.

```azurepowershell-interactive
Connect-AzAccount
```

### Change to SubscriptionB (optional)

You may have to switch back to **SubscriptionB** to continue with the actions in **SubscriptionB**.

Change context to **SubscriptionB**.

```azurepowershell-interactive
Set-AzContext -Subscription SubscriptionB
```

### Create peering connection

Use [Add-AzVirtualNetworkPeering](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering connection between **myVNetB** and **myVNetA**.

```azurepowershell-interactive
$netB = @{
    Name = 'myVNetB'
    ResourceGroupName = 'myResourceGroupB'
}
$vnetB = Get-AzVirtualNetwork @netB

$peer = @{
    Name = 'myVNetBToMyVNetA'
    VirtualNetwork = $vnetB
    RemoteVirtualNetworkId = '/subscriptions/<SubscriptionA-Id>/resourceGroups/myResourceGroupA/providers/Microsoft.Network/virtualNetworks/myVNetA'
}
Add-AzVirtualNetworkPeering @peer
```

User [Get-AzVirtualNetworkPeering](/powershell/module/az.network/get-azvirtualnetworkpeering) to obtain the status of the peering connections from **myVNetB** to **myVNetA**.

```azurepowershell-interactive
$status = @{
    ResourceGroupName =  'myResourceGroupB'
    VirtualNetworkName = 'myVNetB'
}
Get-AzVirtualNetworkPeering @status | Format-Table VirtualNetworkName, PeeringState
```

```powershell
PS /home/azureuser> Get-AzVirtualNetworkPeering @status | Format-Table VirtualNetworkName, PeeringState

VirtualNetworkName PeeringState
------------------ ------------
myVNetB            Connected
```

# [**Azure CLI**](#tab/create-peering-cli)

### Sign in to SubscriptionB

Use [az login](/cli/azure/reference-index#az-login) to sign in to **SubscriptionB**.

```azurecli-interactive
az login
```

If you're using one account for both subscriptions, sign in to that account and change the subscription context to **SubscriptionB** with [az account set](/cli/azure/account#az-account-set).

```azurecli-interactive
az account set --subscription "SubscriptionB"
```

### Sign in to SubscriptionA

Authenticate to **SubscriptionA** so that the peering can be set up.

Use [az login](/cli/azure/reference-index#az-login) to sign in to **SubscriptionA**.

```azurecli-interactive
az login
```

### Change to SubscriptionB (optional)

You may have to switch back to **SubscriptionB** to continue with the actions in **SubscriptionB**.

Change context to **SubscriptionB**.

```azurecli-interactive
az account set --subscription "SubscriptionB"
```

### Create peering connection

Use [az network vnet peering create](/powershell/module/az.network/add-azvirtualnetworkpeering) to create a peering connection between **myVNetB** and **myVNetA**.

```azurecli-interactive
az network vnet peering create \
    --name myVNetBToMyVNetA \
    --resource-group myResourceGroupB \
    --vnet-name myVNetB \
    --remote-vnet /subscriptions/<SubscriptionA-Id>/resourceGroups/myResourceGroupA/providers/Microsoft.Network/VirtualNetworks/myVNetA \
    --allow-vnet-access
```

Use [az network vnet peering list](/cli/azure/network/vnet/peering#az-network-vnet-peering-list) to obtain the status of the peering connections from **myVNetB** to **myVNetA**.

```azurecli-interactive
az network vnet peering list \
    --resource-group myResourceGroupB \
    --vnet-name myVNetB \
    --output table
```
---

The peering is successfully established after you see **Connected** in the **Peering status** column for both virtual networks in the peering. Any Azure resources you create in either virtual network are now able to communicate with each other through their IP addresses. If you're using default Azure name resolution for the virtual networks, the resources in the virtual networks aren't able to resolve names across the virtual networks. If you want to resolve names across virtual networks in a peering, you must create your own DNS server or use Azure DNS.

For more information about using your own DNS for name resolution, see, [Name resolution using your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

For more information about Azure DNS, see [What is Azure DNS?](../dns/dns-overview.md).

## Next steps

- Thoroughly familiarize yourself with important [virtual network peering constraints and behaviors](virtual-network-manage-peering.md#requirements-and-constraints) before creating a virtual network peering for production use.

- Learn about all [virtual network peering settings](virtual-network-manage-peering.md#create-a-peering).

- Learn how to [create a hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke#virtual-network-peering) with virtual network peering.
