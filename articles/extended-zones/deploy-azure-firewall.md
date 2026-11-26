---
title: Deploy Azure Firewall in Azure Extended Zones
description: Learn how to deploy Azure Firewall in an Azure Extended Zone using the Azure portal, Azure CLI, Azure PowerShell, or an ARM template, including Basic, Standard, and Premium SKUs, routing, and validation.
author: svaldesgzz
ms.author: svaldes
ms.reviewer: halkazwini
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 11/25/2026
---

# Deploy Azure Firewall in Azure Extended Zones

In this article, you learn how to deploy **Azure Firewall** in an **Azure Extended Zone** by using the **Azure portal**, **Azure CLI**, **Azure PowerShell**, or an **ARM template**. Use the tabs throughout the article to switch between methods; the surrounding concepts and validation steps apply to all four.

Azure Firewall in Azure Extended Zones behaves the same as Azure Firewall in global Azure regions - same SKUs (**Basic**, **Standard**, and **Premium**), Firewall Policy and rule collections, autoscaling, and availability. The difference is in the setup and deployment: you create the firewall and its associated resources with an `extendedLocation` property, which places them in the Extended Zone.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Access to an Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).
- For the CLI method, [Azure CLI](/cli/azure/install-azure-cli) with the `edgezones` extension (version 2.57.0 or higher, automatically installed when you run an az edge-zones command), and the `azure-firewall` extension (`az extension add --name azure-firewall`), or use [Azure Cloud Shell](/azure/cloud-shell/overview). Make sure your CLI is up to date by running `az upgrade`. For more information, see [How to update the Azure CLI](/cli/azure/update-azure-cli).
- For the PowerShell method, install or update the Azure PowerShell `Az` module by running `Update-Module -Name Az`. For more information, see [Install the Azure Az PowerShell module](/powershell/azure/install-azure-powershell). Placing a firewall in an Extended Zone with `New-AzFirewall -EdgeZone` requires `Az.EdgeZones` module version 0.1.0 or later and **`Az.Network` version 7.26.0 or later**. Check your installed version with `Get-Module -ListAvailable Az.Network`.

## Architecture overview

A typical Azure Firewall deployment in an Extended Zone includes the following resources:

- A virtual network with one or more workload subnets, plus the `AzureFirewallSubnet`.
- A public IP address (Standard SKU, static).
- An Azure Firewall associated with the public IP.
- A Firewall Policy with rule collections.
- A route table that forces workload traffic through the firewall via a default route.

All resources that belong to the Extended Zone use the **parent Azure region** as the `location` and the **Extended Zone name** as the `extendedLocation`. For example, the **Perth** Extended Zone uses **Australia East** as its parent region.


## Key concepts for Extended Zone firewalls

Review these points before you deploy — they apply regardless of the method you choose:

- **SKU selection.** All three SKUs (Basic, Standard, Premium) are supported. **Premium** unlocks IDPS and TLS inspection (through a Premium Firewall Policy). **Basic** requires a management subnet and a second public IP (see the next point).
- **Basic SKU requires a management NIC.** A Basic firewall performs forced tunneling and needs a dedicated **`AzureFirewallManagementSubnet`** (/26 or larger) plus a **second Standard public IP** for management traffic. Standard and Premium firewalls don't require this.
- **The Firewall Policy is regional.** Create the policy with `location` set to the parent region only — **do not** set `extendedLocation` on the policy (it returns `UnsupportedExtendedLocationType`). The Extended Zone firewall references this regional policy. The policy **tier must match** the firewall tier (Basic/Standard/Premium).
- **`AzureFirewallSubnet`** The virtual network must contain a subnet named exactly **`AzureFirewallSubnet`** (/26 or larger). In the portal you specify its address range in the create wizard; with CLI or ARM you create/define it explicitly. Create it as part of the virtual network, and **don't attach an NSG or route table to it**.
- **Use a current API version.** Use firewall and Firewall Policy **API version `2025-07-01`** (or later) for Extended Zone support.


> [!NOTE]
> FirewallSKU availability can vary by Extended Zone based on the underlying capacity. If a deployment fails with a compute allocation error, try a different SKU or contact support to confirm availability in your zone.

## Deploy Azure Firewall

# [**Portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **Firewalls**. Select **Firewalls** from the results, then select **+ Create**.
1. On the **Basics** tab, enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new** and/or enter **myResourceGroup**. |
    | Name | Enter a name for the firewall. |
    | Region | Select the Extended Zone's **parent region** (for example, **Australia East**). |
    | **Edge zone** | Select **Deploy to an Azure Extended Zone**, then choose your Extended Zone (for example, **Perth**). |
    | Firewall SKU | Select **Basic**, **Standard**, or **Premium**. |
    | Firewall management | Select **Use a Firewall Policy to manage this firewall**, then **Add new** (or select an existing policy). The policy tier must follow the firewall SKU. |
    | Choose a virtual network | Select **Create new** and provide a name and address space. |
    | Subnet address space (`AzureFirewallSubnet`) | Enter a valid **/26 or larger** range for the required `AzureFirewallSubnet` (for example, `10.20.1.0/26`). |

    > [!NOTE]
    > In the Extended Zone create flow, the **Use existing** virtual network list might appear empty even when Extended Zone virtual networks exist. Select **Create new** to proceed, or attach the firewall to an existing virtual network by using the CLI or an ARM template.

1. **For the Basic SKU, or if needed for Premium or Standard SKU**, enable the management NIC when prompted:
    - Check **Enable Firewall Management NIC**.
    - Provide a **management public IP** (create new).
    - Provide the **`AzureFirewallManagementSubnet`** address range. In the Extended Zone flow this field might not be prefilled — enter a valid /26 range that doesn't overlap other subnets (for example, `10.20.3.0/26`).
1. Select **Review + create**, then **Create**.

# [**Azure CLI**](#tab/cli)

The following commands deploy a **Standard** or **Premium** firewall. Set `tier` to `Standard` or `Premium`. For **Basic**, complete the additional steps in the next section.

```azurecli-interactive
# Variables — replace with your own values
resourceGroup="myResourceGroup"
location="<parent-region>"     # e.g. australiaeast
edgeZone="<edge-zone-name>"    # e.g. perth
tier="Standard"                # Standard | Premium

az group create --name $resourceGroup --location $location

# Virtual network with a workload subnet
az network vnet create \
  --resource-group $resourceGroup --name myVNet \
  --location $location --edge-zone $edgeZone \
  --address-prefixes 10.20.0.0/16 \
  --subnet-name WorkloadSubnet --subnet-prefixes 10.20.2.0/24

# Azure Firewall subnet — must be named exactly AzureFirewallSubnet (/26 or larger)
az network vnet subnet create \
  --resource-group $resourceGroup --vnet-name myVNet \
  --name AzureFirewallSubnet --address-prefixes 10.20.1.0/26

# Public IP (Standard SKU, static)
az network public-ip create \
  --resource-group $resourceGroup --name myFirewallPip \
  --location $location --edge-zone $edgeZone \
  --sku Standard --allocation-method Static

# Firewall Policy — regional (no edge zone); tier must match the firewall tier
az network firewall policy create \
  --resource-group $resourceGroup --name myFirewallPolicy \
  --location $location --sku $tier

# Azure Firewall
az network firewall create \
  --resource-group $resourceGroup --name myFirewall \
  --location $location --edge-zone $edgeZone \
  --sku AZFW_VNet --tier $tier \
  --firewall-policy myFirewallPolicy \
  --conf-name ipconfig --vnet-name myVNet --public-ip myFirewallPip
```

**Basic SKU only** — add a management subnet and a second public IP, and include the management IP configuration on the firewall:

```azurecli-interactive
tier="Basic"

# Management subnet — must be named exactly AzureFirewallManagementSubnet
az network vnet subnet create \
  --resource-group $resourceGroup --vnet-name myVNet \
  --name AzureFirewallManagementSubnet --address-prefixes 10.20.3.0/26

# Second public IP for management traffic
az network public-ip create \
  --resource-group $resourceGroup --name myFirewallMgmtPip \
  --location $location --edge-zone $edgeZone \
  --sku Standard --allocation-method Static

# Create the Basic firewall with both data and management IP configurations
az network firewall create \
  --resource-group $resourceGroup --name myFirewall \
  --location $location --edge-zone $edgeZone \
  --sku AZFW_VNet --tier $tier \
  --firewall-policy myFirewallPolicy \
  --conf-name ipconfig --vnet-name myVNet --public-ip myFirewallPip \
  --m-conf-name mgmtipconfig --m-public-ip myFirewallMgmtPip
```

# [**PowerShell**](#tab/powershell)

The following native Azure PowerShell cmdlets create the virtual network, public IP, and Firewall Policy. Set `$tier` to `Basic`, `Standard`, or `Premium`. For **Basic**, include the management subnet and second public IP where noted.

## Configure the deployment

Replace the placeholder values with a supported Extended Zone and its parent region.

```azurepowershell-interactive
$resourceGroupName = "rg-edge-firewall-demo"
$firewallName = "azfw-edge-demo"
$virtualNetworkName = "vnet-edge-demo"
$publicIpName = "pip-edge-firewall"
$edgeZoneName = "<extended-zone-name>" # e.g. perth
$parentRegion = "<parent-region>" # e.g. austraieast
```
## Create the supporting resources

Create the resource group in the parent region:

```azurepowershell-interactive
New-AzResourceGroup `
    -Name $resourceGroupName `
    -Location $parentRegion
```

Create the virtual network and its dedicated firewall subnet in the Extended Zone:

```azurepowershell-interactive
$firewallSubnet = New-AzVirtualNetworkSubnetConfig `
    -Name "AzureFirewallSubnet" `
    -AddressPrefix "10.0.0.0/26"

$virtualNetwork = New-AzVirtualNetwork `
    -Name $virtualNetworkName `
    -ResourceGroupName $resourceGroupName `
    -Location $parentRegion `
    -AddressPrefix "10.0.0.0/16" `
    -Subnet $firewallSubnet `
    -EdgeZone $edgeZoneName
```

Create a public IP address with static allocation in the same Extended Zone. SKU type must match Firewall SKU type (Basic, Standard, or Premium):

```azurepowershell-interactive
$publicIp = New-AzPublicIpAddress `
    -Name $publicIpName `
    -ResourceGroupName $resourceGroupName `
    -Location $parentRegion `
    -AllocationMethod Static `
    -Sku Standard ` # Basic | Standard | Premium
    -EdgeZone $edgeZoneName
```

## Create an Azure Firewall

Create an Azure Firewall in the Extended Zone:

```azurepowershell-interactive
$firewall = New-AzFirewall `
    -Name $firewallName `
    -ResourceGroupName $resourceGroupName `
    -Location $parentRegion `
    -VirtualNetwork $virtualNetwork `
    -PublicIpAddress $publicIp `
    -SkuName AZFW_VNet `
    -SkuTier Standard ` # Basic | Standard | Premium
    -ThreatIntelMode Alert `
    -EdgeZone $edgeZoneName
```

> [!IMPORTANT]
> The Extended Zone parameter is `-EdgeZone`, not `-ExtendedZone`. When using `-EdgeZone`, omit `-Zone` entirely. Don't pass availability-zone values or an empty array such as `-Zone @()`. Azure Extended Zones don't support availability zones, and `New-AzFirewall` rejects the request whenever both parameters are present.


# [**ARM template**](#tab/arm)

Deploy the following resources in one template. Set the firewall and policy `tier` (`Basic`, `Standard`, or `Premium`) consistently. Keep `location` on the parent region and `extendedLocation` on the Extended Zone name for every zonal resource.

**Virtual network** — include your workload subnets and the `AzureFirewallSubnet`. For the **Basic** SKU, also include `AzureFirewallManagementSubnet`.

```json
{
  "location": "<parent-region>",
  "extendedLocation": { "type": "EdgeZone", "name": "<edge-zone-name>" }
}

{
  "type": "Microsoft.Network/virtualNetworks",
  "apiVersion": "2025-09-01",
  "name": "[parameters('vnetName')]",
  "location": "[parameters('location')]",
  "extendedLocation": { "type": "EdgeZone", "name": "[parameters('edgeZoneName')]" },
  "properties": {
    "addressSpace": { "addressPrefixes": [ "[parameters('vnetAddressPrefix')]" ] },
    "subnets": [
      {
        "name": "[parameters('workloadSubnetName')]",
        "properties": { "addressPrefix": "[parameters('workloadSubnetPrefix')]" }
      },
      {
        "name": "AzureFirewallSubnet",
        "properties": { "addressPrefix": "[parameters('firewallSubnetPrefix')]" }
      }
    ]
  }
}
```

> [!NOTE]
> For the **Basic** SKU, add a third subnet named `AzureFirewallManagementSubnet` (/26 or larger) to the `subnets` array.

**Public IP** — Standard SKU, static. For the **Basic** SKU, deploy a **second** public IP for management traffic.

```json
{
  "type": "Microsoft.Network/publicIPAddresses",
  "apiVersion": "2025-07-01", // Later versions supported as well.
  "name": "[parameters('publicIpName')]",
  "location": "[parameters('location')]",
  "extendedLocation": { "type": "EdgeZone", "name": "[parameters('edgeZoneName')]" },
  "sku": { "name": "Standard" },
  "properties": { "publicIPAllocationMethod": "Static" }
}
```

**Firewall Policy** — regional. Do **not** set `extendedLocation`; set the `tier` to match the firewall.

```json
{
  "type": "Microsoft.Network/firewallPolicies",
  "apiVersion": "2025-07-01", // Later versions supported as well.,
  "name": "[parameters('firewallPolicyName')]",
  "location": "[parameters('location')]",
  "properties": { "sku": { "tier": "[parameters('firewallSkuTier')]" } }
}
```

**Azure Firewall** — associate the public IP and attach the policy. For the **Basic** SKU, add the `managementIpConfiguration` block shown after the snippet.

```json
{
  "type": "Microsoft.Network/azureFirewalls",
  "apiVersion": "2025-07-01", // Later versions supported as well.
  "name": "[parameters('firewallName')]",
  "location": "[parameters('location')]",
  "extendedLocation": { "type": "EdgeZone", "name": "[parameters('edgeZoneName')]" },
  "properties": {
    "sku": {
      "name": "AZFW_VNet",
      "tier": "[parameters('firewallSkuTier')]"
    },
    "firewallPolicy": {
      "id": "[resourceId('Microsoft.Network/firewallPolicies', parameters('firewallPolicyName'))]"
    },
    "ipConfigurations": [
      {
        "name": "ipconfig",
        "properties": {
          "publicIPAddress": {
            "id": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIpName'))]"
          },
          "subnet": {
            "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), 'AzureFirewallSubnet')]"
          }
        }
      }
    ]
  }
}
```

For the **Basic** SKU, add the management IP configuration alongside `ipConfigurations`, referencing the management subnet and the second public IP:

```json
"managementIpConfiguration": {
  "name": "mgmtipconfig",
  "properties": {
    "publicIPAddress": {
      "id": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('managementPublicIpName'))]"
    },
    "subnet": {
      "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), 'AzureFirewallManagementSubnet')]"
    }
  }
}
```

---

## Configure routing

Force workload traffic through the firewall by adding a default route (`0.0.0.0/0`) with next hop **Virtual appliance** set to the firewall's **private IP**, then associate the route table with your workload subnets. Don't associate the route table with `AzureFirewallSubnet`.

# [**Portal**](#tab/portal)

1. In the portal, create a **Route table** in the same region and Extended Zone as the firewall.
1. Open the route table, select **Routes**, and then select **+ Add**:
    - **Address prefix**: `0.0.0.0/0`
    - **Next hop type**: **Virtual appliance**
    - **Next hop address**: the firewall's **private IP** (from the firewall **Overview**).
1. Open **Subnets**, select **+ Associate**, and then select your **workload subnet**.

# [**Azure CLI**](#tab/cli)

```azurecli-interactive
# Get the firewall private IP
fwPrivateIp=$(az network firewall show \
  --resource-group $resourceGroup --name myFirewall \
  --query "ipConfigurations[0].privateIpAddress" -o tsv)

az network route-table create \
  --resource-group $resourceGroup --name myRouteTable \
  --location $location --edge-zone $edgeZone

az network route-table route create \
  --resource-group $resourceGroup --route-table-name myRouteTable \
  --name default-to-firewall \
  --address-prefix 0.0.0.0/0 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address $fwPrivateIp

az network vnet subnet update \
  --resource-group $resourceGroup --vnet-name myVNet \
  --name WorkloadSubnet --route-table myRouteTable
```

# [**PowerShell**](#tab/powershell)

```azurepowershell-interactive
# Get the firewall private IP
$fw = Get-AzFirewall -ResourceGroupName $resourceGroup -Name "myFirewall"
$fwPrivateIp = $fw.IpConfigurations[0].PrivateIPAddress

# Route table + default route to the firewall
# Note: New-AzRouteTable doesn't expose -EdgeZone. If your scenario requires the
# route table to be placed in the Extended Zone, use the ARM template tab instead.
$routeTable = New-AzRouteTable -ResourceGroupName $resourceGroup -Name "myRouteTable" -Location $location
Add-AzRouteConfig -RouteTable $routeTable -Name "default-to-firewall" `
  -AddressPrefix "0.0.0.0/0" -NextHopType "VirtualAppliance" -NextHopIpAddress $fwPrivateIp | Out-Null
$routeTable | Set-AzRouteTable

# Associate the route table with the workload subnet
$vnet = Get-AzVirtualNetwork -ResourceGroupName $resourceGroup -Name "myVNet"
Set-AzVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name "WorkloadSubnet" `
  -AddressPrefix "10.20.2.0/24" -RouteTableId $routeTable.Id | Out-Null
$vnet | Set-AzVirtualNetwork
```

# [**ARM template**](#tab/arm)

```json
{
  "type": "Microsoft.Network/routeTables",
  "apiVersion": "2025-07-01", // Later versions supported as well.,
  "name": "[parameters('routeTableName')]",
  "location": "[parameters('location')]",
  "extendedLocation": { "type": "EdgeZone", "name": "[parameters('edgeZoneName')]" },
  "properties": {
    "routes": [
      {
        "name": "default-to-firewall",
        "properties": {
          "addressPrefix": "0.0.0.0/0",
          "nextHopType": "VirtualAppliance",
          "nextHopIpAddress": "[parameters('firewallPrivateIp')]"
        }
      }
    ]
  }
}
```

Associate the route table with your workload subnet (set the subnet's `routeTable` property). Don't associate it with `AzureFirewallSubnet`.

---

## Validate the deployment

After deploying all resources, verify the following:

1. **Resource placement**: the firewall, public IP, and virtual network all show the correct Extended Zone.
1. **`AzureFirewallSubnet`**: it exists in the virtual network's subnet list. For the Basic SKU, confirm `AzureFirewallManagementSubnet` and the second public IP also exist.
1. **Routing**: the route table is associated with your workload subnets, and `0.0.0.0/0` points to the firewall's private IP.
1. **Policy**: the Firewall Policy is attached and contains the expected rule collections and allow/deny behavior. Confirm the policy tier matches the firewall SKU.
1. **Traffic flow**: traffic from workload VMs is processed by the firewall according to the configured rules.

## Clean up resources

# [**Portal**](#tab/portal)

When you no longer need the resources, delete the resource group and all resources it contains:

1. In the search box at the top of the portal, enter **myResourceGroup**. Select **myResourceGroup** from the results.
1. Select **Delete resource group**.
1. In **Delete a resource group**, enter **myResourceGroup**, and then select **Delete**.

# [**Azure CLI**](#tab/cli)

```azurecli-interactive
az group delete --name $resourceGroup --yes --no-wait
```

# [**PowerShell**](#tab/powershell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name $resourceGroup -Force -AsJob
```

# [**ARM template**](#tab/arm)

Delete the resource group that contains the deployed resources:

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

---

## Related content

- [Azure Firewall Policy overview](/azure/firewall/policy-rule-sets)
- [Request access to an Azure Extended Zone](request-access.md)
- [Frequently asked questions](faq.md)
