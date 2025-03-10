---
title: Configure an application security group with a private endpoint
titleSuffix: Azure Private Link
description: Learn how to create a private endpoint with an application security group (ASG) or apply an ASG to an existing private endpoint.
author: abell
ms.author: abell
ms.service: azure-private-link
ms.topic: how-to 
ms.date: 02/18/2024
ms.custom: template-how-to, devx-track-azurepowershell, devx-track-azurecli
---

# Configure an application security group with a private endpoint

Azure Private Link private endpoints support application security groups (ASGs) for network security. You can associate private endpoints with an existing ASG in your current infrastructure alongside virtual machines and other network resources.

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure web app with a Premium V2 tier or higher app service plan deployed in your Azure subscription.

    - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md).
    - The example web app in this article is named **myWebApp1979**. Replace the example with your web app name.

- An existing ASG in your subscription. For more information about ASGs, see [Application security groups](../virtual-network/application-security-groups.md).
    - The example ASG used in this article is named **myASG**. Replace the example with your application security group.

- An existing Azure virtual network and subnet in your subscription. For more information about creating a virtual network, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

    - The example virtual network used in this article is named **myVNet**. Replace the example with your virtual network.

- The latest version of the Azure CLI, installed.

   - Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the most recent [release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).
   - If you don't have the latest version of the Azure CLI, update it by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

If you choose to install and use PowerShell locally, this article requires Azure PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a private endpoint with an ASG

You can associate an ASG with a private endpoint when it's created. The following procedures demonstrate how to associate an ASG with a private endpoint when it's created.

# [**Portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints** in the search results.

1. Select **+ Create** in **Private endpoints**.

1. On the **Basics** tab of **Create a private endpoint**, enter or select the following information:

    | Value | Setting |
    | ----- | ------- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select your resource group. </br> In this example, it's **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myPrivateEndpoint**. |
    | Region | Select **East US**. |

1. Select **Next: Resource** at the bottom of the page.

1. On the **Resource** tab, enter or select the following information:

    | Value | Setting |
    | ----- | ------- |
    | Connection method | Select **Connect to an Azure resource in my directory.** |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.Web/sites**. |
    | Resource | Select **mywebapp1979**. |
    | Target subresource | Select **sites**. |

1. Select **Next: Virtual Network** at the bottom of the page.

1. On the **Virtual Network** tab, enter or select the following information:

    | Value | Setting |
    | ----- | ------- |
    | **Networking** |   |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select your subnet. </br> In this example, it's **myVNet/myBackendSubnet(10.0.0.0/24)**. |
    | Enable network policies for all private endpoints in this subnet. | Leave the default selected. |
    | **Application security group** |   |
    | Application security group | Select **myASG**. |

1. Select **Next: DNS** at the bottom of the page.

1. Select **Next: Tags** at the bottom of the page.

1. Select **Next: Review + create**.

1. Select **Create**.

# [**PowerShell**](#tab/powershell)

```azurepowershell-interactive
## Place the previously created webapp into a variable. ##
$webapp = Get-AzWebApp -ResourceGroupName myResourceGroup -Name myWebApp1979

## Create the private endpoint connection. ## 
$pec = @{
    Name = 'myConnection'
    PrivateLinkServiceId = $webapp.ID
    GroupID = 'sites'
}
$privateEndpointConnection = New-AzPrivateLinkServiceConnection @pec

## Place the virtual network you created previously into a variable. ##
$vnet = Get-AzVirtualNetwork -ResourceGroupName 'myResourceGroup' -Name 'myVNet'

## Place the application security group you created previously into a variable. ##
$asg = Get-AzApplicationSecurityGroup -ResourceGroupName 'myResourceGroup' -Name 'myASG'

## Create the private endpoint. ##
$pe = @{
    ResourceGroupName = 'myResourceGroup'
    Name = 'myPrivateEndpoint'
    Location = 'eastus'
    Subnet = $vnet.Subnets[0]
    PrivateLinkServiceConnection = $privateEndpointConnection
    ApplicationSecurityGroup = $asg
}
New-AzPrivateEndpoint @pe
```

# [**CLI**](#tab/cli)

```azurecli-interactive
id=$(az webapp list \
    --resource-group myResourceGroup \
    --query '[].[id]' \
    --output tsv)

asgid=$(az network asg show \
    --name myASG \
    --resource-group myResourceGroup \
    --query id \
    --output tsv)

az network private-endpoint create \
    --connection-name myConnection \
    --name myPrivateEndpoint \
    --private-connection-resource-id $id \
    --resource-group myResourceGroup \
    --subnet myBackendSubnet \
    --asg id=$asgid \
    --group-id sites \
    --vnet-name myVNet    
```
---

## Associate an ASG with an existing private endpoint

You can associate an ASG with an existing private endpoint. The following procedures demonstrate how to associate an ASG with an existing private endpoint.

> [!IMPORTANT]
> You must have a previously deployed private endpoint to proceed with the steps in this section. The example endpoint used in this section is named **myPrivateEndpoint**. Replace the example with your private endpoint.

# [**Portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Private endpoint**. Select **Private endpoints** in the search results.

1. In **Private endpoints**, select **myPrivateEndpoint**.

1. In **myPrivateEndpoint**, in **Settings**, select **Application security groups**.

1. In **Application security groups**, select **myASG** in the dropdown box.

1. Select **Save**.

# [**PowerShell**](#tab/powershell)

Associating an ASG with an existing private endpoint with Azure PowerShell is currently unsupported.

# [**CLI**](#tab/cli)

```azurecli-interactive
asgid=$(az network asg show \
    --name myASG \
    --resource-group myResourceGroup \
    --query id \
    --output tsv)

az network private-endpoint asg add \
    --resource-group myResourceGroup \
    --endpoint-name myPrivateEndpoint \
    --asg-id $asgid
```
---

## Next steps

For more information about Azure Private Link, see:

- [What is Azure Private Link?](private-link-overview.md)
