---
title: Azure Firewall SNAT private IP address ranges
description: Learn how to configure SNAT private IP address ranges and auto-learn SNAT routes in Azure Firewall.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 08/31/2026
ms.custom:
  - devx-track-azurepowershell
  - devx-track-azurecli
  - devx-track-arm-template
  - sfi-image-nochange
# Customer intent: "As a network administrator, I want to configure SNAT private IP address ranges in Azure Firewall, so that I can control how outbound traffic is translated to public IP addresses and optimize security for my network setup."
---

# Azure Firewall SNAT private IP address ranges

Azure Firewall provides SNAT capability for all outbound traffic to public IP addresses. By default, Azure Firewall doesn't use SNAT with network rules when the destination IP address is in a private IP address range per [IANA RFC 1918](https://tools.ietf.org/html/rfc1918) or shared address space per [IANA RFC 6598](https://tools.ietf.org/html/rfc6598). Application rules always use SNAT through a [transparent proxy](https://wikipedia.org/wiki/Proxy_server#Transparent_proxy) regardless of the destination IP address.

This default behavior is suitable when routing traffic directly to the Internet. However, there are scenarios where you might need to override the default SNAT behavior:

- If you enable [forced tunneling](forced-tunneling.md), Azure Firewall SNATs Internet-bound traffic to one of the firewall's private IP addresses in AzureFirewallSubnet, hiding the source from your on-premises firewall.
- If your organization uses registered IP address ranges outside of IANA RFC 1918 or IANA RFC 6598 for private networks, Azure Firewall SNATs the traffic to one of the firewall's private IP addresses in AzureFirewallSubnet. You can configure Azure Firewall to **not** SNAT your public IP address range. For example, specify an individual IP address as `x.x.x.x` or a range of IP addresses as `x.x.x.x/24`.

You can change Azure Firewall SNAT behavior in the following ways:

- To configure Azure Firewall to **never** SNAT traffic processed by network rules regardless of the destination IP address, use **0.0.0.0/0** as your private IP address range. With this configuration, Azure Firewall can't route traffic directly to the Internet.
- To configure the firewall to **always** SNAT traffic processed by network rules regardless of the destination address, use **255.255.255.255/32** as your private IP address range.
- To configure Azure Firewall to [automatically learn](#auto-learn-snat-routes) registered and private IP address ranges at regular intervals, enable auto-learn SNAT routes. Learned address ranges are treated as internal and traffic destined to these ranges isn't SNATed.

> [!IMPORTANT]
> - The private address range configuration only applies to network rules. Application rules always use SNAT.
> - If you want to specify your own private IP address ranges and keep the default IANA RFC 1918 address ranges, make sure your custom list still includes the IANA RFC 1918 range.

The following table shows the supported configuration methods. Firewalls associated with a firewall policy must specify the range in the policy and not use `AdditionalProperties`.

| Method | Classic rules | Firewall policy |
|---|---|---|
| Azure PowerShell | Supported | Not supported |
| Azure CLI | Supported | Not supported |
| ARM template | Supported | Supported |
| Azure portal | Supported | Supported |

## Configure SNAT private IP address ranges

Choose your configuration method. Azure PowerShell and Azure CLI only support classic rules. To configure SNAT ranges with a firewall policy, use an ARM template or the Azure portal.

### [Azure PowerShell](#tab/powershell)

Use Azure PowerShell to specify private IP address ranges for the firewall.

> [!NOTE]
> The firewall `PrivateRange` property is ignored for firewalls associated with a Firewall Policy. You must use the `SNAT` property in `firewallPolicies` as described on the **ARM template** tab.

#### New firewall

For a new firewall that uses classic rules, create the firewall by using [New-AzFirewall](/powershell/module/az.network/new-azfirewall):

```azurepowershell
$azFw = @{
   Name               = '<fw-name>'
   ResourceGroupName  = '<resourcegroup-name>'
   Location           = '<location>'
   VirtualNetworkName = '<vnet-name>'
   PublicIpName       = '<public-ip-name>'
   PrivateRange       = @("IANAPrivateRanges", "192.168.1.0/24", "192.168.1.10")
}

New-AzFirewall @azFw
```

> [!NOTE]
> - Deploying Azure Firewall by using `New-AzFirewall` requires an existing virtual network and public IP address. For a full deployment guide, see [Deploy and configure Azure Firewall using Azure PowerShell](deploy-ps.md).
> - `IANAPrivateRanges` expands to the current defaults on Azure Firewall while the other ranges are added to it. To keep the `IANAPrivateRanges` default in your private range specification, it must remain in your `PrivateRange` specification as shown in the example.

#### Existing firewall

To configure an existing firewall that uses classic rules, get the firewall by using [Get-AzFirewall](/powershell/module/az.network/get-azfirewall) and update it by using [Set-AzFirewall](/powershell/module/az.network/set-azfirewall):

```azurepowershell
$azfw = Get-AzFirewall -Name '<fw-name>' -ResourceGroupName '<resourcegroup-name>'
$azfw.PrivateRange = @("IANAPrivateRanges", "192.168.1.0/24", "192.168.1.10")
Set-AzFirewall -AzureFirewall $azfw
```

### [Azure CLI](#tab/cli)

Use Azure CLI to specify private IP address ranges for the firewall.

> [!NOTE]
> The CLI `--private-ranges` option only applies to firewalls that use classic rules. For firewalls associated with a firewall policy, use an ARM template or the Azure portal to configure SNAT ranges.

#### New firewall

For a new firewall that uses classic rules, create the firewall by using [az network firewall create](/cli/azure/network/firewall#az-network-firewall-create):

```azurecli-interactive
az network firewall create \
-n <fw-name> \
-g <resourcegroup-name> \
--private-ranges 192.168.1.0/24 192.168.1.10 IANAPrivateRanges
```

> [!NOTE]
> - Deploying Azure Firewall by using the Azure CLI command `az network firewall create` requires extra configuration steps to create public IP addresses and IP configuration. For a full deployment guide, see [Deploy and configure Azure Firewall using Azure CLI](deploy-cli.md).
> - Azure Firewall expands `IANAPrivateRanges` to the current defaults and adds the other ranges to it. To keep the `IANAPrivateRanges` default in your private range specification, include it in your `private-ranges` specification as shown in the example.

#### Existing firewall

To configure an existing firewall that uses classic rules, update the firewall by using [az network firewall update](/cli/azure/network/firewall#az-network-firewall-update):

```azurecli-interactive
az network firewall update \
-n <fw-name> \
-g <resourcegroup-name> \
--private-ranges 192.168.1.0/24 192.168.1.10 IANAPrivateRanges
```

### [ARM template](#tab/arm)

#### Classic rules

To configure SNAT during ARM template deployment, add the following code to the `additionalProperties` property:

```json
"additionalProperties": {
   "Network.SNAT.PrivateRanges": "IANAPrivateRanges, IPRange1, IPRange2"
},
```

#### Firewall policy

Azure Firewalls associated with a firewall policy support SNAT private ranges starting with API version 2020-11-01. Use a template to update the SNAT private range on the Firewall Policy. The following sample configures the firewall to **always** SNAT network traffic:

```json
{
   "type": "Microsoft.Network/firewallPolicies",
   "apiVersion": "2024-05-01",
   "name": "[parameters('firewallPolicies_DatabasePolicy_name')]",
   "location": "eastus",
   "properties": {
      "sku": {
         "tier": "Standard"
      },
      "snat": {
         "privateRanges": "[255.255.255.255/32]"
      }
   }
}
```

### [Azure portal](#tab/portal)

#### Classic rules

Use the Azure portal to specify private IP address ranges for the firewall.

1. Select your resource group, and then select your firewall.
1. On the **Overview** pane, under **Private IP Ranges**, select the default value **IANA RFC 1918**.

   The **Edit Private IP Prefixes** page opens:

1. By default, Azure Firewall configures **IANAPrivateRanges**.
1. Edit the private IP address ranges for your environment and then select **Save**.

#### Firewall policy

1. Select your resource group, and then select your firewall policy.
1. Select **Private IP ranges (SNAT)** in the **Settings** column.
1. Select the conditions to perform SNAT for your environment under **Perform SNAT** to customize the SNAT configuration.
1. Select **Apply**.

---

## Auto-learn SNAT routes

You can configure Azure Firewall to auto-learn both registered and private ranges every 30 minutes. These learned address ranges are internal to the network, so traffic to destinations in the learned ranges isn't SNATed. Both virtual network (VNet) deployments and secured virtual hub (vHub) deployments support auto-learn SNAT routes.

> [!NOTE]
> - Auto-learn SNAT requires Azure Firewall to be associated with Azure Route Server.
> - For VNet deployments, you must deploy Azure Route Server in the same virtual network as Azure Firewall.
> - For vHub deployments, Azure Route Server is already deployed and associated by default.
> - For both deployment models, you must enable auto-learn SNAT in the Azure Firewall Policy after the association is complete.
> - For more information about Azure Firewall architecture options, see [What are the Azure Firewall Manager architecture options?](../firewall-manager/vhubs-and-vnets.md)

### VNet firewall

For VNet deployments, you need to deploy and associate Azure Route Server before enabling auto-learn SNAT routes.

**Prerequisites:**

- A subnet named **RouteServerSubnet** in your firewall virtual network with a size of at least /27.
- Azure Route Server deployed in the same virtual network as your firewall. For deployment steps, see [Quickstart: Create and configure Route Server by using the Azure portal](../route-server/quickstart-configure-route-server-portal.md).

#### [Azure CLI](#tab/cli)

Azure CLI doesn't support configuring auto-learn SNAT routes. Use an ARM template, Azure PowerShell, or the Azure portal.

#### [ARM template](#tab/arm)

Use the following JSON to enable auto-learn in a firewall policy:

```json
{
   "type": "Microsoft.Network/firewallPolicies",
   "apiVersion": "2024-05-01",
   "name": "[parameters('firewallPolicies_DatabasePolicy_name')]",
   "location": "eastus",
   "properties": {
      "sku": {
         "tier": "Standard"
      },
      "snat": {
         "autoLearnPrivateRanges": "Enabled"
      }
   }
}
```

Use the following JSON to associate an Azure Route Server with the firewall:

```json
{
   "type": "Microsoft.Network/azureFirewalls",
   "apiVersion": "2024-05-01",
   "name": "[parameters('azureFirewalls_testFW_name')]",
   "location": "eastus",
   "properties": {
      "sku": {
         "name": "AZFW_VNet",
         "tier": "Standard"
      },
      "threatIntelMode": "Alert",
      "additionalProperties": {
         "Network.RouteServerInfo.RouteServerID": "[parameters('virtualHubs_TestRouteServer_externalid')]"
      }
   }
}
```

#### [Azure PowerShell](#tab/powershell)

In the following examples, replace the variable names (`$azureFirewallName`, `$rgname`, `$location`, etc.) with your own values.

1. Create a new firewall with a Route Server ID by using [New-AzFirewall](/powershell/module/az.network/new-azfirewall).

   ```azurepowershell
   # Specify the Route Server resource ID
   $routeServerId="/subscriptions/your_sub/resourceGroups/testRG/providers/Microsoft.Network/virtualHubs/TestRS"

   # Create the firewall
   $azureFirewall = New-AzFirewall -Name $azureFirewallName `
       -ResourceGroupName $rgname `
       -Location $location `
       -RouteServerId $routeServerId

   # Verify the Route Server ID is set
   Get-AzFirewall -Name $azureFirewallName -ResourceGroupName $rgname
   ```

1. Associate a Route Server with an existing firewall by using [Get-AzFirewall](/powershell/module/az.network/get-azfirewall) and [Set-AzFirewall](/powershell/module/az.network/set-azfirewall).

   ```azurepowershell
   # Specify the Route Server resource ID
   $routeServerId="/subscriptions/your_sub/resourceGroups/testRG/providers/Microsoft.Network/virtualHubs/TestRS"

   # Get the firewall
   $azFirewall = Get-AzFirewall -Name $azureFirewallName -ResourceGroupName $rgname

   # Associate the Route Server and update the firewall
   $azFirewall.RouteServerId = $routeServerId
   Set-AzFirewall -AzureFirewall $azFirewall

   # Verify the Route Server ID is updated
   Get-AzFirewall -Name $azureFirewallName -ResourceGroupName $rgname
   ```

1. Create a new firewall policy with auto-learn enabled by using [New-AzFirewallPolicySnat](/powershell/module/az.network/new-azfirewallpolicysnat) and [New-AzFirewallPolicy](/powershell/module/az.network/new-azfirewallpolicy).

   ```azurepowershell
   # Include AutoLearnPrivateRange to enable auto-learn
   $snat = New-AzFirewallPolicySnat -PrivateRange $privateRange -AutoLearnPrivateRange

   # Create the firewall policy with SNAT configuration
   $azureFirewallPolicy = New-AzFirewallPolicy -Name $azureFirewallPolicyName `
       -ResourceGroupName $rgname `
       -Location $location `
       -Snat $snat

   # Verify the firewall policy
   Get-AzFirewallPolicy -Name $azureFirewallPolicyName -ResourceGroupName $rgname
   ```

1. Update an existing firewall policy with SNAT by using [New-AzFirewallPolicySnat](/powershell/module/az.network/new-azfirewallpolicysnat) and [Set-AzFirewallPolicy](/powershell/module/az.network/set-azfirewallpolicy).

   ```azurepowershell
   $snat = New-AzFirewallPolicySnat -PrivateRange $privateRange2 -AutoLearnPrivateRange

   # Update the firewall policy
   $azureFirewallPolicy.Snat = $snat
   Set-AzFirewallPolicy -InputObject $azureFirewallPolicy

   # Verify the update
   Get-AzFirewallPolicy -Name $azureFirewallPolicyName -ResourceGroupName $rgname
   ```

1. Verify the learned prefixes by using [Get-AzFirewallLearnedIpPrefix](/powershell/module/az.network/get-azfirewalllearnedipprefix).

   ```azurepowershell
   Get-AzFirewallLearnedIpPrefix -Name $azureFirewallName -ResourceGroupName $rgname
   ```

#### [Azure portal](#tab/portal)

To configure auto-learn SNAT routes on your VNet firewall by using the Azure portal:

1. Select your firewall, and then select **Learned SNAT IP Prefixes**. Add the route server.
1. Select your firewall policy, and then select **Private IP ranges (SNAT)**. Enable **Auto-learn IP prefixes**, and then select **Apply**.
1. To verify, go back to your firewall and select **Learned SNAT IP Prefixes** to view the learned routes.

---

### vHub firewall

For vHub deployments, Azure Route Server is already deployed and associated by default. You only need to enable auto-learn in your firewall policy.

#### [Azure CLI](#tab/cli)

Azure CLI doesn't support configuring auto-learn SNAT routes. Use an ARM template, Azure PowerShell, or the Azure portal.

#### [ARM template](#tab/arm)

Use the following JSON to enable auto-learn in a firewall policy. For vHub deployments, you don't need to manually associate Azure Route Server.

```json
{
   "type": "Microsoft.Network/firewallPolicies",
   "apiVersion": "2024-05-01",
   "name": "[parameters('firewallPolicies_DatabasePolicy_name')]",
   "location": "eastus",
   "properties": {
      "sku": {
         "tier": "Standard"
      },
      "snat": {
         "autoLearnPrivateRanges": "Enabled"
      }
   }
}
```

#### [Azure PowerShell](#tab/powershell)

In the following examples, replace the variable names (`$azureFirewallName`, `$rgname`, `$location`, etc.) with your own values.

1. Create a new firewall policy with auto-learn enabled by using [New-AzFirewallPolicySnat](/powershell/module/az.network/new-azfirewallpolicysnat) and [New-AzFirewallPolicy](/powershell/module/az.network/new-azfirewallpolicy).

   ```azurepowershell
   # Include AutoLearnPrivateRange to enable auto-learn
   $snat = New-AzFirewallPolicySnat -PrivateRange $privateRange -AutoLearnPrivateRange

   # Create the firewall policy with SNAT configuration
   $azureFirewallPolicy = New-AzFirewallPolicy -Name $azureFirewallPolicyName `
       -ResourceGroupName $rgname `
       -Location $location `
       -Snat $snat

   # Verify the firewall policy
   Get-AzFirewallPolicy -Name $azureFirewallPolicyName -ResourceGroupName $rgname
   ```

1. Update an existing firewall policy with SNAT by using [New-AzFirewallPolicySnat](/powershell/module/az.network/new-azfirewallpolicysnat) and [Set-AzFirewallPolicy](/powershell/module/az.network/set-azfirewallpolicy).

   ```azurepowershell
   $snat = New-AzFirewallPolicySnat -PrivateRange $privateRange2 -AutoLearnPrivateRange

   # Update the firewall policy
   $azureFirewallPolicy.Snat = $snat
   Set-AzFirewallPolicy -InputObject $azureFirewallPolicy

   # Verify the update
   Get-AzFirewallPolicy -Name $azureFirewallPolicyName -ResourceGroupName $rgname
   ```

1. Get the virtual hub by using [Get-AzVirtualHub](/powershell/module/az.network/get-azvirtualhub) and the firewall policy by using [Get-AzFirewallPolicy](/powershell/module/az.network/get-azfirewallpolicy).

   ```azurepowershell
   $Hub = Get-AzVirtualHub -ResourceGroupName $rgname -Name $virtualHubName
   $azureFirewallPolicy = Get-AzFirewallPolicy -Name $azureFirewallPolicyName -ResourceGroupName $rgname
   ```

1. Create a public IP configuration by using [New-AzFirewallHubPublicIpAddress](/powershell/module/az.network/new-azfirewallhubpublicipaddress) and [New-AzFirewallHubIpAddress](/powershell/module/az.network/new-azfirewallhubipaddress).

   ```azurepowershell
   $azureFirewallPIPs = New-AzFirewallHubPublicIpAddress -Count 1
   $azureFirewallHubIPs = New-AzFirewallHubIpAddress -PublicIP $azureFirewallPIPs
   ```

1. Create the vHub firewall with the auto-learn policy by using [New-AzFirewall](/powershell/module/az.network/new-azfirewall).

   ```azurepowershell
   $azureFirewall = New-AzFirewall -Name $azureFirewallName `
       -ResourceGroupName $rgname `
       -Location $location `
       -VirtualHubId $Hub.Id `
       -FirewallPolicyId $azureFirewallPolicy.Id `
       -SkuName "AZFW_Hub" `
       -HubIPAddress $azureFirewallHubIPs `
       -SkuTier $FirewallTier
   ```

1. Verify the learned prefixes by using [Get-AzFirewallLearnedIpPrefix](/powershell/module/az.network/get-azfirewalllearnedipprefix).

   ```azurepowershell
   Get-AzFirewallLearnedIpPrefix -Name $azureFirewallName -ResourceGroupName $rgname
   ```

#### [Azure portal](#tab/portal)

Because Azure Route Server is already deployed in secured virtual hub environments, you only need to enable the feature in your firewall policy:

1. Select your firewall policy, and then select **Private IP ranges (SNAT)**. Enable **Auto-learn IP prefixes**, and then select **Apply**.
1. To verify, go back to your firewall and select **Learned SNAT IP Prefixes** to view the learned routes.

---

## Next steps

- [Azure Firewall forced tunneling](forced-tunneling.md)
- [What is Azure Route Server?](../route-server/overview.md)
- [What are the Azure Firewall Manager architecture options?](../firewall-manager/vhubs-and-vnets.md)
