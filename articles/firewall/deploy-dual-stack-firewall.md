---
title: Deploy Azure Firewall in dual stack mode (preview)
description: Learn how to deploy, upgrade, and manage Azure Firewall with IPv6 and dual stack support, including configuration steps, limitations, and policy rules.
author: ZarrVenkat
ms.topic: how-to
ms.date: 07/16/2026
ms.author: derastogi
ms.service: azure-firewall
service: firewall
---

# Deploy Azure Firewall in dual stack mode (preview)

Azure Firewall and Azure Firewall policy support IPv6. You can configure IPv6 subnets, address spaces, public IPv6 addresses, user-defined routes (UDRs), and network rules to manage IPv6 traffic. You can deploy a firewall in IPv4-only mode or in dual stack mode (IPv4 and IPv6). IPv6-only firewalls aren't supported.

This article shows you how to upgrade an existing firewall to dual stack mode and deploy a new dual stack firewall.

> [!IMPORTANT]
> IPv6 support on Azure Firewall is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported scenarios and limitations

Azure Firewall's IPv6 support is designed for specific use cases and has certain constraints. Review the following supported scenarios and limitations before you deploy.

### Supported scenarios

- **Network rules**: Azure Firewall fully supports IPv6 traffic in network rules. You can create rules to allow or deny IPv6 traffic.
- **DNS proxy**: Azure Firewall can be configured as a DNS proxy in IPv6 networks.

> [!NOTE]
> For all outbound connections from the virtual network, Azure Firewall applies source network address translation (SNAT) by using the firewall instance's IP address. If the destination address is within the IANA-defined unique local address (ULA) range (`fc00::/7`), SNAT isn't applied. This behavior is by design and can't be changed.

### Limitations

- Classic Azure Firewall isn't supported.
- Virtual hub (vHub) Firewall isn't supported.
- Application and DNAT rules aren't supported yet.
- Threat intelligence, IDPS, Explicit Proxy, and IP Groups based scenarios aren't supported.
- Reverting a dual stack firewall back to IPv4-only mode isn't supported. This temporary limitation will be removed when dual stack support becomes generally available.

> [!NOTE]
> Existing features compatible with IPv4-only firewall continue to support IPv4 in dual-stack firewall as well. The preceding limitations apply only to IPv6.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to get started.

## Configure dual stack on an existing Azure Firewall

To upgrade an existing Azure Firewall from IPv4-only to dual stack mode (IPv4 and IPv6):

1. Add an IPv6 address space to the virtual network.
1. Add an IPv6 subnet prefix to the `AzureFirewallSubnet`.
1. Create a public IPv6 address.
1. Add the public IPv6 address to your firewall configuration.
1. Add network rules for IPv6 traffic as needed.

> [!IMPORTANT]
> After you upgrade a firewall to dual stack mode, you can't revert it back to IPv4-only mode. This temporary limitation will be removed when dual stack support becomes generally available.

Use the following tabs to add IPv6 support to a firewall that's already deployed.

### [Portal](#tab/portal)

1. Open your virtual network in the Azure portal, select **Address space**, and add the IPv6 prefix (for example, `79f7:d56c:e9bc:8000::/49`). Save your changes.

    :::image type="content" source="media/deploy-dual-stack-firewall/update-vnet-configuration.png" alt-text="Screenshot of updating VNET configuration with IPv6 address space.":::

1. Open your virtual network, select **Subnets**, choose **AzureFirewallSubnet**, and add the IPv6 address prefix (for example, `fd00:c1d0:3f1f:1::/64`) alongside the existing IPv4 prefix. Save your changes.

    :::image type="content" source="media/deploy-dual-stack-firewall/update-firewall-subnet.png" alt-text="Screenshot of updating firewall subnet to include IPv6 subnet.":::

1. Create the public IPv6 address resource, and then attach it to the firewall configuration.

    :::image type="content" source="media/deploy-dual-stack-firewall/update-firewall-configuration.png" alt-text="Screenshot of updating the firewall to include an IPv6 public IP.":::
    
### [PowerShell](#tab/powershell)

1. Update the virtual network (VNET) to add an IPv6 address space using [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) and [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork).

    Retrieve the existing VNET:

    ```powershell-interactive
    $vnet = Get-AzVirtualNetwork -Name "test-vnet" -ResourceGroupName "test-rg"
    ```

    Add the IPv6 address space:

    ```powershell-interactive
    $vnet.AddressSpace.AddressPrefixes.Add("fd00:c1d0:3f1f::/48")
    $vnet | Set-AzVirtualNetwork
    ```

1. Update the AzureFirewallSubnet to add an IPv6 subnet prefix using [Set-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/set-azvirtualnetworksubnetconfig).

    ```powershell-interactive
    Set-AzVirtualNetworkSubnetConfig -Name "AzureFirewallSubnet" `
        -VirtualNetwork $vnet `
        -AddressPrefix @("10.0.0.0/24", "fd00:c1d0:3f1f:1::/64")
    $vnet | Set-AzVirtualNetwork
    ```

1. Create and attach an IPv6 public IP using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) and [Set-AzFirewall](/powershell/module/az.network/set-azfirewall).

    ```powershell-interactive
    $publicIpV6 = New-AzPublicIpAddress `
        -ResourceGroupName "test-rg" `
        -Location "southcentralus" `
        -Name "test-v6pip" `
        -AllocationMethod Static `
        -Sku Standard `
        -IpAddressVersion IPv6
    $azFw = Get-AzFirewall -Name "test-fw" -ResourceGroupName "test-rg"
    $azFw.AddPublicIpAddress($publicIpV6)
    $azFw | Set-AzFirewall
    ```

### [CLI](#tab/cli)

1. Add an IPv6 address space to your existing VNET by using [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update):

    ```azurecli-interactive
    az network vnet update --resource-group test-rg --name test-vnet \
         --address-prefixes 10.0.0.0/16 fd00:c1d0:3f1f::/48
    ```

    This command updates the virtual network to include both the original IPv4 address space and the new IPv6 address space.

1. Update the AzureFirewallSubnet to include an IPv6 subnet by using [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update):

    ```azurecli-interactive
    az network vnet subnet update \
        --resource-group test-rg \
        --vnet-name test-vnet \
        --name AzureFirewallSubnet \
        --address-prefixes 10.0.0.0/24 fd00:c1d0:3f1f:1::/64
    ```

    This command adds the IPv6 subnet prefix (`fd00:c1d0:3f1f:1::/64`) alongside the existing IPv4 prefix (`10.0.0.0/24`) for the Azure Firewall subnet.

1. Create a public IPv6 address by using [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) and attach it to the firewall by using [az network firewall ip-config create](/cli/azure/network/firewall/ip-config#az-network-firewall-ip-config-create):

    ```azurecli-interactive
    az network public-ip create \
        --resource-group test-rg \
        --name test-v6pip \
        --location southcentralus \
        --sku Standard \
        --version IPv6 \
        --allocation-method Static \
        --zone 1 2 3

    az network firewall ip-config create \
        --firewall-name test-fw \
        --name fw-ip6-config \
        --resource-group test-rg \
        --public-ip-address test-v6pip
    ```

***

## Create a dual stack Azure Firewall

### [Portal](#tab/portal)

1. In the deployment flow for Azure Firewall, enter the IPv6 address space, enter the IPv6 subnet prefix, and add a new or existing IPv6 public IP address to the new Azure Firewall.

    :::image type="content" source="media/deploy-dual-stack-firewall/dual-mode-configuration.png" alt-text="Screenshot of dual stack configuration for a new Azure Firewall in the Azure portal.":::

### [PowerShell](#tab/powershell)

To set up a dual stack firewall by using PowerShell:

1. Create a resource group by using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet.

    ```powershell-interactive
    New-AzResourceGroup -Name "test-rg" -Location "southcentralus"
    ```

1. Create the firewall subnet and virtual network by using the [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) and [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) cmdlets.

    ```powershell-interactive
    $FWsub = New-AzVirtualNetworkSubnetConfig `
        -Name "AzureFirewallSubnet" `
        -AddressPrefix @("10.0.1.0/26", "fd00:c1d0:3f1f:1::/64")

    $vnet = New-AzVirtualNetwork `
        -Name "test-vnet" `
        -ResourceGroupName "test-rg" `
        -Location "southcentralus" `
        -AddressPrefix @("10.0.0.0/16", "fd00:c1d0:3f1f::/48") `
        -Subnet $FWsub
    ```

1. Create public IPv4 and IPv6 addresses by using the [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) cmdlet.

    ```powershell-interactive
    $publicIpV4 = New-AzPublicIpAddress `
        -ResourceGroupName "test-rg" `
        -Location "southcentralus" `
        -Name "v4pip" `
        -AllocationMethod Static `
        -Sku Standard

    $publicIpV6 = New-AzPublicIpAddress `
        -ResourceGroupName "test-rg" `
        -Location "southcentralus" `
        -Name "v6pip" `
        -AllocationMethod Static `
        -Sku Standard `
        -IpAddressVersion IPv6
    ```

1. Create a firewall policy by using the [New-AzFirewallPolicy](/powershell/module/az.network/new-azfirewallpolicy) cmdlet.

    ```powershell-interactive
    $fwPolicy = New-AzFirewallPolicy -Name "fw-policy" -ResourceGroupName "test-rg" -Location "southcentralus" -SkuTier "Premium"
    ```

1. Create the dual stack firewall by using the [New-AzFirewall](/powershell/module/az.network/new-azfirewall) cmdlet.

    ```powershell-interactive
    $Azfw = New-AzFirewall -Name "firewall-test" `
        -ResourceGroupName "test-rg" `
        -Location "southcentralus" `
        -VirtualNetwork $vnet `
        -PublicIpAddress @($publicIpV4, $publicIpV6) `
        -Sku AZFW_VNet `
        -SkuTier Premium `
        -FirewallPolicyId $fwPolicy.Id
    ```

### [CLI](#tab/cli)

To set up a dual stack firewall by using the Azure CLI:

1. Create a resource group by using [az group create](/cli/azure/group#az-group-create).

    ```azurecli-interactive
    az group create --name test-rg --location southcentralus
    ```

1. Create the virtual network and firewall subnet by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) and [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create).

    ```azurecli-interactive
    az network vnet create --resource-group test-rg --name test-vnet --location southcentralus --address-prefixes 10.0.0.0/16 fd00:c1d0:3f1f::/48

    az network vnet subnet create --resource-group test-rg --vnet-name test-vnet --name AzureFirewallSubnet --address-prefixes 10.0.0.0/24 fd00:c1d0:3f1f:1::/64
    ```

1. Create the IPv4 and IPv6 public IP addresses by using [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create).

    ```azurecli-interactive
    az network public-ip create --resource-group test-rg --name test-v4pip --location southcentralus --sku Standard --version IPv4 --allocation-method Static --zone 1 2 3

    az network public-ip create --resource-group test-rg --name test-v6pip --location southcentralus --sku Standard --version IPv6 --allocation-method Static --zone 1 2 3
    ```

1. Create the firewall policy by using [az network firewall policy create](/cli/azure/network/firewall/policy#az-network-firewall-policy-create).

    ```azurecli-interactive
    az network firewall policy create --name test-fw-policy --resource-group test-rg --location southcentralus --sku Premium
    ```

1. Create the firewall and attach the IPv4 and IPv6 public IP addresses by using [az network firewall create](/cli/azure/network/firewall#az-network-firewall-create) and [az network firewall ip-config create](/cli/azure/network/firewall/ip-config#az-network-firewall-ip-config-create).

    ```azurecli-interactive
    az network firewall create --name test-fw --resource-group test-rg --location southcentralus --sku AZFW_VNet --tier Premium --firewall-policy test-fw-policy

    az network firewall ip-config create --firewall-name test-fw --name fw-ip-config --resource-group test-rg --public-ip-address test-v4pip --vnet-name test-vnet

    az network firewall ip-config create --firewall-name test-fw --name fw-ip6-config --resource-group test-rg --public-ip-address test-v6pip
    ```

***

## Related content

> [!div class="nextstepaction"]
> [Deploy Azure Firewall with multiple public IP addresses using PowerShell](deploy-multi-public-ip-powershell.md)
