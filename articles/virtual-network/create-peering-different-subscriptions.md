---
title: Create a virtual network peering between different subscriptions
titleSuffix: Azure Virtual Network
description: Learn how to create a virtual network peering between virtual networks created through Resource Manager that exist in different Azure subscriptions in the same or different Azure Active Directory tenant.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to
ms.date: 12/28/2022
ms.custom: template-how-to, FY23 content-maintenance
---

# Create a virtual network peering - Resource Manager, different subscriptions and Azure Active Directory tenants

In this tutorial, you learn to create a virtual network peering between virtual networks created through Resource Manager. The virtual networks exist in different subscriptions that may belong to different Azure Active Directory (Azure AD) tenants. Peering two virtual networks enables resources in different virtual networks to communicate with each other with the same bandwidth and latency as though the resources were in the same virtual network. Learn more about [Virtual network peering](virtual-network-peering-overview.md).

The steps to create a virtual network peering are different, depending on whether the virtual networks are in the same, or different, subscriptions, and which [Azure deployment model](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json) the virtual networks are created through. Learn how to create a virtual network peering in other scenarios by selecting the scenario from the following table:

|Azure deployment model  | Azure subscription  |
|--------- |---------|
|[Both Resource Manager](tutorial-connect-virtual-networks-portal.md) |Same|
|[One Resource Manager, one classic](create-peering-different-deployment-models.md) |Same|
|[One Resource Manager, one classic](create-peering-different-deployment-models-subscriptions.md) |Different|

A virtual network peering cannot be created between two virtual networks deployed through the classic deployment model. If you need to connect virtual networks that were both created through the classic deployment model, you can use an Azure [VPN Gateway](../vpn-gateway/tutorial-site-to-site-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) to connect the virtual networks.

This tutorial peers virtual networks in the same region. You can also peer virtual networks in different [supported regions](virtual-network-manage-peering.md#cross-region). It's recommended that you familiarize yourself with the [peering requirements and constraints](virtual-network-manage-peering.md#requirements-and-constraints) before peering virtual networks.

## Prerequisites

- An Azure account(s) with two active subscriptions. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure account with permissions in both subscriptions or an account in each subscription with the proper permissions to create a virtual network peering. For a list of permissions, see [Virtual network peering permissions](virtual-network-manage-peering.md#permissions).

    - If the virtual networks are in different subscriptions, and the subscriptions are associated with different Azure Active Directory tenants, add the user from each Active Directory tenant as a [guest user](../active-directory/external-identities/add-users-administrator.md?toc=%2fazure%2fvirtual-network%2ftoc.json#add-guest-users-to-the-directory) in the opposite Azure Active Directory tenant.

    - Each user must accept the guest user invitation from the opposite Azure Active Directory tenant.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

- This how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create virtual network peering

In the following steps, you'll learn how to peer virtual networks in different subscriptions and Azure Active Directory tenants. 

You can use the same account that has permissions in both subscriptions or you can use separate accounts for each subscription to setup the peering. An account with permissions in both subscriptions can complete all of the steps without signing out and signing in to portal and assigning permissions.

The following resources and account examples are used in the steps in this article:

| User account | Subscription | Virtual network |
| ------------ | ------------ | --------------- |
| **UserA** | **SubscriptionA** | **myVNetA** |
| **UserB** | **SubscriptionB** | **myVNetB** |

# [**Portal**](#tab/create-peering-portal)

> [!NOTE]
> If you are using a single account to complete the steps, you can skip the steps for logging out of the portal and assigning another user permissions to the virtual networks.

1. Sign-in to the [Azure portal](https://.portal.azure.com) as **UserA**.

2. In the search box a the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

3. Select **+ Create**.

4. 




# [**PowerShell**](#tab/create-peering-powershell)

# [**Azure CLI**](#tab/create-peering-powershell)


---

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)
