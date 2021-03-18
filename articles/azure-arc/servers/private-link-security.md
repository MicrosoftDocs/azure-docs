---
title: Use Azure Private Link to securely connect networks to Azure Arc enabled servers
description: Use Azure Private Link to securely connect networks to Azure Arc enabled servers
ms.topic: conceptual
ms.date: 03/18/2021
---

# Use Azure Private Link to securely connect networks to Azure Arc enabled servers

[Azure Private Link](../../private-link/private-link-overview.md) allows you to securely link Azure PaaS services to your virtual network using private endpoints. For many services, you just set up an endpoint per resource. This means you can connect your on-premises or multi-cloud servers with Azure Arc and send all traffic over an Express Route or site-to-site VPN connection instead of using public networks. Azure Arc uses a Private Link Scope model to allow multiple servers to communicate with their Azure Arc resources using a single private endpoint. This article covers when to use and how to set up an Azure Arc Private Link Scope (preview). This is available in all commercial cloud regions, it is not available in the US Government cloud today.

## Planning your Private Link setup

To connect your server to Azure Arc over a private link, you need to configure your network to accomplish the following:

1. Establish a connection between your on-premises network and an Azure virtual network using a [site-to-site VPN](../../vpn-gateway/tutorial-site-to-site-portal.md) or [Express Route circuit](../../expressroute/expressroute-howto-linkvnet-arm.md).

1. Deploy an Azure Arc Private Link Scope, which controls which servers can communicate with Azure Arc over private endpoints and associate it with your Azure virtual network using a private endpoint.

1. Update the DNS configuration on your local network to resolve the private endpoint addresses.

1. Configure your local firewall to allow access to Azure Active Directory and Azure Resource Manager. This is a temporary step and will not be required when private endpoints for these services enter preview.

1. Associate the servers registered with Azure Arc enabled servers with the private link scope.

1. Optionally, deploy private endpoints for other Azure services your server is managed with, such as Azure Monitor or Azure Automation.

This article assumes you have already set up your Express Route circuit or site-to-site VPN connection.

![Diagram of basic resource topology](./media/private-link-security/private-link-basic-topology.png)

## Part 1: Register your Azure subscription

Before you can deploy private endpoints for Azure Arc enabled servers, you need to register your Azure subscription for the preview feature. This is a one-time operation for each subscription where you want to use the Azure Arc private endpoint (preview).

1. Open the Azure Portal and click the console icon in the menu bar to open an Azure Cloud Shell instance. If you have the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell module](/powershell/azure) installed on your computer, you can use a local shell instead.

1. Check your Azure context to make sure you’re operating on the subscription containing your virtual network. Your Azure Arc enabled servers also need to be registered in this subscription. Run one of the following commands.

    **Azure CLI**

    ```azurecli
    az account show
    ```

    **PowerShell**

    ```powershell
    Get-AzContext
    ```

1. If you need to change to another subscription, use one of the following commands.

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az account set -s <SubscriptionNameOrId>
    ```

    # [PowerShell](#tab/azure-powershell)

    ```powershell
    Set-AzContext -Subscription <SubscriptionNameOrId>
    ```

    ---

1. If this is your first Arc enabled server, register the resource provider using one of the following commands.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az provider register --namespace Microsoft.HybridCompute
    ```

    # [PowerShell](#tab/azure-powershell)

    ```powershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
    ```
    ---

1. Register for access to the private endpoint (preview) (for any resource type) by running one of the following commands.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az feature register --namespace Microsoft.Network --name AllowPrivateEndpoints
    ```

    # [PowerShell](#tab/azure-powershell)

    ```powershell
    Register-AzProviderFeature -ProviderNamespace Microsoft.Network -FeatureName AllowPrivateEndpoint
    ```

    ---

1. Register for the Azure Arc private link (preview) running one of the following commands.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az feature register --namespace Microsoft.HybridCompute --name ArcServerPrivateLinkPreview
    ```

    # [PowerShell](#tab/azure-powershell)

    ```powershell
    Register-AzProviderFeature -ProviderNamespace Microsoft.HybridCompute -FeatureName ArcServerPrivateLinkPreview
    ```

    ---

Repeat steps 3-6 for any additional subscriptions where you want to test private endpoints. Email [Arc enabled servers team](email@microsoft.com) with the subscription ID(s) you registered earlier so that we can approve your request to join the preview.

When you receive a email response notifying you that your request has been approved, re-register the Azure Arc enabled servers resource providers to finish configuring the preview using one of the following commands.

# [Azure CLI](#tab/azure-cli)

```azurecli
az provider register --namespace Microsoft.HybridCompute
```

# [PowerShell](#tab/azure-powershell)

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
```

---

## Part 1: Special network configuration

Azure Arc enabled servers integrates with several Azure services to bring cloud management and governance to your hybrid servers. Most of these services already offer private endpoints, but you need to configure your firewall and routing rules to allow access to Azure Active Directory and Azure Resource Manager over the Internet until these services offer private endpoints.

There are two ways you can achieve this:

1. If your network is configured to route all Internet-bound traffic through the Azure VPN or Express Route circuit, you can configure the network security group associated with your subnet in Azure to allow outbound TCP 443 (HTTPS) access to AAD and ARM using [service tags](../../virtual-network/service-tags-overview.md). The NSG rules should look like the following:

|Setting |Azure AD rule | Azure Resource Manager rule |
|--------|--------------|-----------------------------|

