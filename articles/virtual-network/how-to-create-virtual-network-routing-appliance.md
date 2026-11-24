---
title: Create a Routing Appliance
titleSuffix: Azure Virtual Network
description: This guide covers configuration and troubleshooting for Azure Virtual Network routing appliances.
#customer intent: As a network administrator, I want to create a routing appliance in the Azure portal so that I can manage virtual network traffic.
author: asudbring
ms.author: allensu
ms.reviewer: allensu
ms.date: 11/23/2026
ms.topic: how-to
ms.service: azure-virtual-network
ms.custom: references_regions
ai-usage: ai-assisted
---

# Create an Azure Virtual Network routing appliance

This article explains how to create a standalone Azure Virtual Network routing appliance in the Azure portal. It also describes how to configure routing appliance shared capacity by using the Azure portal, PowerShell, or Azure CLI. Standalone Azure Virtual Network routing appliances are generally available as of August 4, 2026, and are supported for production workloads. The shared capacity pool option in the portal is labeled **Preview**. Confirm feature eligibility before following the shared capacity procedure.

## Supported regions

Routing appliances are available in the following regions:

- Australia East
- Brazil South
- Brazil Southeast
- Central India
- Central US
- East Asia
- East US
- East US 2
- Germany West Central
- North Central US
- North Europe
- South Central US
- South India
- Southeast Asia
- Spain Central
- Sweden Central
- UK South
- West Central US
- West Europe
- West US
- West US 2
- West US 3

Availability of standalone routing appliances in these regions doesn't establish availability of the capacity-provider feature. Confirm regional and subscription eligibility before creating a routing appliance pool.

To get started, search for **routing appliance** in the Azure portal's search box, and then select **Azure Virtual Network routing appliances**.

:::image type="content" source="media/create-virtual-network-routing-appliance/virtual-network-appliance-1.png" alt-text="Screenshot of a search for routing appliances in the Azure portal.":::

:::image type="content" source="media/create-virtual-network-routing-appliance/virtual-network-appliance-2.png" alt-text="Screenshot of the service entry for Azure Virtual Network routing appliances in the Azure portal.":::

## Create a resource group

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **resource group**. In the search results, select **Resource groups**.

1. Select **+ Create**.

1. In **Create a resource group**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Subscription** | Select your subscription. |
    | **Resource group name** | Enter **test-rg**. |
    | **Region** | Select **(US) East US**. |

1. Select **Review + create**.

1. Select **Create**.

## Create a virtual network

1. In the portal's search box, enter **virtual network**. In the search results, select **Virtual networks**.

1. Select **+ Create**.

1. In **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **test-rg**. |
    | **Instance details** | |
    | **Virtual network name** | Enter **vnet-1**. |
    | **Region** | Select **(US) East US**. |

1. Select **Next**.

1. Select **Next**.

1. In **IP addresses**, select the **default** subnet.

1. In **Edit subnet**, for **Name**, enter **VirtualNetworkApplianceSubnet**.

1. Select **Save**.

1. Select **Review + Create**.

1. Select **Create**.

## Create a routing appliance

1. In the portal's search box, enter **routing appliance**. In the search results, select **Azure Virtual Network routing appliances**.

1. Select **+ Create**.

1. In **Create an Azure Virtual Network routing appliance**, enter or select the following information on the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** | |
    | **Subscription** | Select your subscription. |
    | **Resource group** | Select **test-rg**. |
    | **Instance details** | |
    | **Name** | Enter **vnet-appliance**. |
    | **Region** | Select **East US**. |
    | **Capacity model** | If this setting is displayed, select **Dedicated capacity**. |
    | **Capacity** | Select **50 Gbps**. Supported bandwidth tiers are 10, 50, 100, and 200 Gbps. |
    | **Virtual Network** | Select **vnet-1**. |

1. Select **Review + create**.

1. Select **Create**.

The portal creates the routing appliance in a dedicated subnet named `VirtualNetworkApplianceSubnet`. If you create multiple appliance instances, you create them in the same dedicated subnet.

**Optional**: During creation, you can choose a network security group (NSG) and route table for the routing appliance's dedicated subnet.

## Configure routing appliance shared capacity

Create a 200-Gbps capacity provider and a consumer that shares its capacity by referencing the provider's full Azure resource ID.

The 200 Gbps is shared capacity, not a per-consumer reservation. Adding consumers doesn't increase it. A capacity association doesn't add a routing hop or create routes, peerings, or route table associations.

For an overview, see [Routing appliance shared capacity](virtual-network-routing-appliance-overview.md#routing-appliance-shared-capacity).

This procedure creates `provider-vna` and `consumer-vna`; it doesn't modify existing standalone appliances.

### Prerequisites

- An Azure subscription with `Microsoft.Network/AllowVirtualNetworkApplianceCapacityProvider` and the `Microsoft.Network` resource provider registered. See [Set up features in an Azure subscription](../azure-resource-manager/management/preview-features.md).
- An existing resource group and two virtual networks in the same region. This example uses `test-rg`, `eastus`, `provider-vnet`, and `consumer-vnet`.
- Shared capacity support in your subscription and region. Only the 200-Gbps provider tier is supported, with up to 31 consumers per provider. Each consumer can reference only one provider.
- A subnet named `VirtualNetworkApplianceSubnet` in each virtual network. See [Create a virtual network](#create-a-virtual-network). The commands use existing networks and subnets; they don't create them or the resource group.
- Permission to create, read, and delete the appliance resources and read their virtual networks and subnets.
- For PowerShell, versions of `Az.Accounts`, `Az.Resources`, and `Az.Network` that support `New-AzVirtualNetworkAppliance -CapacityProviderId`.
- For Azure CLI, a version that supports `az network virtual-network-appliance create --capacity-provider`. Check the command's help to confirm support.

Sign in to the [Azure portal](https://portal.azure.com), or use `Connect-AzAccount` and `Set-AzContext` for PowerShell or `az login` and `az account set` for Azure CLI. Select your subscription and replace the example names and region as needed.

> [!IMPORTANT]
> Check your resource quota before deployment. Size shared capacity for combined demand, including simultaneous peaks and growth. Shared capacity doesn't guarantee individual throughput, bursting, equal sharing, or automatic expansion.

### Deploy and verify the appliances

Choose a method and run its steps in order. For command-line examples, use the same shell session.

### [Azure portal](#tab/portal)

#### Create the capacity provider

1. In the Azure portal, open the **Create an Azure Virtual Network routing appliance** page. Supported from API version 2026-03-01.
1. On **Basics**, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | **Subscription** | Select your feature-enabled subscription. |
    | **Resource group** | Select **test-rg**. |
    | **Name** | Enter **provider-vna**. |
    | **Region** | Select **East US**. |
    | **Capacity model** | Select **Dedicated capacity**. |

1. Set the bandwidth to **200 Gbps**, the supported capacity provider tier.
1. For **Virtual network**, select **provider-vnet**. Use its **VirtualNetworkApplianceSubnet** subnet for the appliance.
1. Select **Review + create**, review the configuration, and select **Create**.
1. Wait for deployment to complete before creating the consumer.

To use an existing provider, confirm that provisioning succeeded, it's in the same region, and it has 200 Gbps of capacity and fewer than 31 consumers. Select it when you create the consumer.

#### Create the consumer

1. Open the **Create an Azure Virtual Network routing appliance** page again.
1. On **Basics**, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | **Subscription** | Select the same subscription as the provider. |
    | **Resource group** | Select **test-rg**. |
    | **Name** | Enter **consumer-vna**. |
    | **Region** | Select **East US**. |
    | **Capacity model** | Select **Shared capacity pool (Preview)**. |
    | **Capacity Provider** | Select **provider-vna**, or the existing provider you chose. |
    | **Virtual network** | Select **consumer-vnet**. |

1. Use the **VirtualNetworkApplianceSubnet** subnet in **consumer-vnet** for the appliance.
1. Select **Review + create** and confirm that the consumer uses the intended provider and virtual network.
1. Select **Create** and wait for deployment to complete.

**Shared capacity pool (Preview)** is equivalent to bandwidth `0` with a provider reference in PowerShell or Azure CLI.

#### Verify the deployment

1. Confirm that both deployments succeeded.
1. Open **consumer-vna** and verify its virtual network and provider reference. If these properties aren't visible, use the PowerShell or Azure CLI verification commands.
1. Continue to **Configure and test routing** to validate the traffic path.

### [PowerShell](#tab/powershell)

#### Retrieve the existing subnets

```azurepowershell
Import-Module Az.Network -ErrorAction Stop

$rg = "test-rg"
$location = "eastus"

$providerVnet = Get-AzVirtualNetwork `
    -Name "provider-vnet" `
    -ResourceGroupName $rg `
    -ErrorAction Stop
$providerSubnet = Get-AzVirtualNetworkSubnetConfig `
    -Name "VirtualNetworkApplianceSubnet" `
    -VirtualNetwork $providerVnet `
    -ErrorAction Stop

$consumerVnet = Get-AzVirtualNetwork `
    -Name "consumer-vnet" `
    -ResourceGroupName $rg `
    -ErrorAction Stop
$consumerSubnet = Get-AzVirtualNetworkSubnetConfig `
    -Name "VirtualNetworkApplianceSubnet" `
    -VirtualNetwork $consumerVnet `
    -ErrorAction Stop
```

#### Create the capacity provider

Create `provider-vna` with 200 Gbps of capacity:

```azurepowershell
$provider = New-AzVirtualNetworkAppliance `
    -Name "provider-vna" `
    -ResourceGroupName $rg `
    -Location $location `
    -SubnetId $providerSubnet.Id `
    -Bandwidth "200" `
    -ErrorAction Stop

Get-AzVirtualNetworkAppliance `
    -Name "provider-vna" `
    -ResourceGroupName $rg `
    -ErrorAction Stop |
    ConvertTo-Json -Depth 10
```

Confirm that provisioning succeeded before creating the consumer.

To use an existing provider, assign the result of `Get-AzVirtualNetworkAppliance -Name "provider-vna" -ResourceGroupName $rg -ErrorAction Stop` to `$provider`.

#### Create the consumer

Use the consumer subnet, set bandwidth to `"0"`, and pass the provider's resource ID to `-CapacityProviderId`:

```azurepowershell
$consumer = New-AzVirtualNetworkAppliance `
    -Name "consumer-vna" `
    -ResourceGroupName $rg `
    -Location $location `
    -SubnetId $consumerSubnet.Id `
    -Bandwidth "0" `
    -CapacityProviderId $provider.Id `
    -ErrorAction Stop
```

#### Verify the saved consumer

Retrieve the consumer from Azure:

```azurepowershell
Get-AzVirtualNetworkAppliance `
    -Name "consumer-vna" `
    -ResourceGroupName $rg `
    -ErrorAction Stop |
    ConvertTo-Json -Depth 10
```

Verify that provisioning succeeded, bandwidth is `0`, and the consumer references the expected provider and subnet in `consumer-vnet`.

### [Azure CLI](#tab/cli)

Run these examples in Bash, not PowerShell.

#### Retrieve the existing subnet IDs

The `set -e` command stops a Bash script if a command fails.

```azurecli
set -e

rg="test-rg"
location="eastus"

providerSubnetId=$(az network vnet subnet show \
    --resource-group "$rg" \
    --vnet-name provider-vnet \
    --name VirtualNetworkApplianceSubnet \
    --query id \
    --output tsv)

consumerSubnetId=$(az network vnet subnet show \
    --resource-group "$rg" \
    --vnet-name consumer-vnet \
    --name VirtualNetworkApplianceSubnet \
    --query id \
    --output tsv)
```

#### Create the capacity provider

Create `provider-vna` with 200 Gbps of capacity, and then retrieve its full resource ID:

```azurecli
az network virtual-network-appliance create \
    --name provider-vna \
    --resource-group "$rg" \
    --location "$location" \
    --subnet "id=$providerSubnetId" \
    --bandwidth-in-gbps 200

az network virtual-network-appliance show \
    --name provider-vna \
    --resource-group "$rg" \
    --output json

providerId=$(az network virtual-network-appliance show \
    --name provider-vna \
    --resource-group "$rg" \
    --query id \
    --output tsv)
```

Confirm that provisioning succeeded before creating the consumer.

To use an existing provider, run only the `show` commands.

#### Create the consumer

Set bandwidth to `0` and provide an object containing the provider's `id`:

```azurecli
az network virtual-network-appliance create \
    --name consumer-vna \
    --resource-group "$rg" \
    --location "$location" \
    --subnet "id=$consumerSubnetId" \
    --bandwidth-in-gbps 0 \
    --capacity-provider "id=$providerId"
```

Don't pass a bare resource ID to `--capacity-provider`.

#### Verify the saved consumer

```azurecli
az network virtual-network-appliance show \
    --name consumer-vna \
    --resource-group "$rg" \
    --output json
```

Verify that provisioning succeeded, bandwidth is `0`, and the consumer references the expected provider and subnet in `consumer-vnet`.

---

### Configure and test routing

Configure routing separately from the capacity provider association.

1. Configure route tables, peerings, and security rules for your topology. See [Common routing patterns](virtual-network-routing-appliance-overview.md#common-routing-patterns-hub-and-spoke).
1. Check the [effective routes](diagnose-network-routing-problem.md) on workload network interfaces for the expected next hop.
1. Test connectivity and throughput between the source and destination networks under representative combined load.
1. Review the applicable metrics in [Monitor the routing appliance](#monitor-the-routing-appliance) to confirm that traffic reaches the intended appliances.
1. Validate high availability and failure behavior for your topology.

Successful provisioning doesn't verify connectivity or throughput. Consumer bandwidth `0` selects shared capacity; it doesn't disable forwarding or measure traffic.

### Troubleshoot shared capacity configuration

| Symptom | Action |
| --- | --- |
| `-CapacityProviderId` or `--capacity-provider` isn't recognized | Use a tool version that supports the parameter. |
| Feature or region validation fails | Check feature and resource-provider registration, subscription eligibility, region support, and provider capacity availability. |
| The consumer can't reference the provider | Check the provider's full resource ID, provisioning state, region, 200-Gbps tier, consumer count, and permissions. In Azure CLI, pass an object containing `id`. |
| The consumer has bandwidth `0` | This value selects shared capacity. Verify the provider reference; don't substitute a standalone bandwidth tier. |
| Provisioning succeeds, but connectivity fails | Check routes, peerings, subnet security rules, and the traffic path. |

### Clean up the shared capacity appliances

> [!WARNING]
> Stop required traffic before deleting appliances. Delete all dependent consumers before deleting the provider. The PowerShell and Azure CLI commands delete resources without prompting.

### [Azure portal](#tab/portal)

1. In the Azure portal, open the **test-rg** resource group.
1. Open **consumer-vna**, select **Delete**, and complete the confirmation.
1. Wait for the consumer deletion to complete.
1. Open **provider-vna**, select **Delete**, and complete the confirmation.

Don't delete the resource group if you want to keep its virtual networks, subnets, or other resources.

### [PowerShell](#tab/powershell)

```azurepowershell
Remove-AzVirtualNetworkAppliance `
    -Name "consumer-vna" `
    -ResourceGroupName $rg `
    -Force `
    -ErrorAction Stop

Remove-AzVirtualNetworkAppliance `
    -Name "provider-vna" `
    -ResourceGroupName $rg `
    -Force `
    -ErrorAction Stop
```

### [Azure CLI](#tab/cli)

```azurecli
az network virtual-network-appliance delete \
    --name consumer-vna \
    --resource-group "$rg" \
    --yes

az network virtual-network-appliance delete \
    --name provider-vna \
    --resource-group "$rg" \
    --yes
```

---

Deleting the appliance preserves virtual networks, subnets, and feature registration.

## Scale and performance

Each standalone routing appliance instance has a fixed bandwidth tier. The tier determines the maximum connection establishment rate and the number of concurrent flows the instance supports:

| Bandwidth tier | Max connections per second | Max concurrent flows |
|----------------|----------------------------|----------------------|
| 10 Gbps        | 100,000                    | 1,000,000            |
| 50 Gbps        | 250,000                    | 2,000,000            |
| 100 Gbps       | 600,000                    | 4,000,000            |
| 200 Gbps       | 1,500,000                  | 8,000,000            |

Shared capacity consumers use bandwidth `0` and a capacity-provider reference rather than a standalone bandwidth tier. A bandwidth value of `0` selects shared capacity. It doesn't establish a throughput or flow limit for an individual consumer. Don't interpret the standalone tier table as a per-consumer capacity guarantee.

You can't resize an existing standalone instance. To change its bandwidth tier, delete the appliance and create a new one with the tier you need. The capacity-provider configuration doesn't establish support for in-place resizing.

## Monitor the routing appliance

You can view metrics in Azure Monitor as soon as you create the appliance, with no diagnostic configuration required. Select the **Metrics** tab on the routing appliance resource to view bytes sent and received, packets sent and received, inbound and outbound flow counts, and inbound and outbound flow creation rates. You can also set alerts on throughput thresholds, flow counts, and anomalous flow creation rates.

## Troubleshoot

### Creation fails in a region or with an allocation error

Confirm that you're deploying to one of the supported regions listed earlier in this article. If the request returns a validation error for an unsupported region, choose a supported region. If it returns an allocation failure, capacity isn't currently available in that region for the requested bandwidth tier. Retry with a lower tier, choose another region, or try again later. Also confirm that you didn't reach the limit of two routing appliances per subscription per region.

For shared capacity, confirm feature eligibility and applicable provider and consumer quotas separately. Don't replace a consumer's bandwidth `0` with a standalone tier or reduce a provider below the supported provider capacity to work around a deployment failure. See [Troubleshoot shared capacity configuration](#troubleshoot-shared-capacity-configuration).

### Appliance isn't getting traffic as expected

- Verify that user-defined routes use the next hop type **Virtual appliance** and point to the routing appliance's private IP address, and that IP forwarding is enabled on the relevant peerings.
- Verify that network security groups and route tables attached to the appliance subnet, or to the source and destination subnets, match your intended routing and security configuration.
- Use Azure Monitor metrics on the appliance to confirm whether traffic is reaching it. Per-flow logging isn't available, so use virtual network flow logs on the workload subnets to validate connectivity and rule matches.
