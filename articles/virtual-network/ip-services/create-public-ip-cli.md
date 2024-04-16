---
title: 'Quickstart: Create a public IP - Azure CLI'
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP address using the Azure CLI
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.topic: quickstart
ms.date: 08/24/2023
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Create a public IP address using the Azure CLI

In this quickstart, you learn how to create an Azure public IP address. Public IP addresses in Azure are used for public connections to Azure resources. Public IP addresses are available in two SKUs: basic, and standard. Two tiers of public IP addresses are available: regional, and global. The routing preference of a public IP address is set when created. Internet routing and Microsoft Network routing are the available choices.

:::image type="content" source="./media/create-public-ip-portal/public-ip-example-resources.png" alt-text="Diagram of an example use of a public IP address. A public IP address is assigned to a load balancer.":::

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **QuickStartCreateIP-rg** in the **eastus2** location.

```azurecli-interactive
  az group create \
    --name QuickStartCreateIP-rg \
    --location eastus2
```
## Create public IP

# [**Standard SKU**](#tab/create-public-ip-standard)

>[!NOTE]
>Standard SKU public IP is recommended for production workloads.  For more information about SKUs, see **[Public IP addresses](public-ip-addresses.md)**.
>
>The following command works for API version **2020-08-01** or **later**.  For more information about the API version currently being used, please refer to [Resource Providers and Types](../../azure-resource-manager/management/resource-providers-and-types.md).

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a standard zone-redundant public IPv4 address named **myStandardPublicIP** in **QuickStartCreateIP-rg**.  

To create an IPv6 address, modify the **`--version`** parameter to **IPv6**.

```azurecli-interactive
  az network public-ip create \
    --resource-group QuickStartCreateIP-rg \
    --name myStandardPublicIP \
    --version IPv4 \
    --sku Standard \
    --zone 1 2 3
```
> [!IMPORTANT]
> For versions of the API older than 2020-08-01, execute the command without specifying a **`--zone`** parameter to create a zone-redundant IP address. 
>

# [**Basic SKU**](#tab/create-public-ip-basic)

In this section, you create a basic IP. Basic public IPs don't support availability zones.

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a basic static public IPv4 address named **myBasicPublicIP** in **QuickStartCreateIP-rg**.

To create an IPv6 address, modify the **`--version`** parameter to **IPv6**. 

```azurecli-interactive
  az network public-ip create \
    --resource-group QuickStartCreateIP-rg \
    --name myBasicPublicIP \
    --version IPv4 \
    --sku Basic \
    --allocation-method Static
```
If it's acceptable for the IP address to change over time, **Dynamic** IP assignment can be selected by changing the **`--allocation-method`** to **Dynamic**. 

>[!NOTE]
> A basic IPv6 address must always be 'Dynamic'.

---

## Create a zonal or no-zone IP address

In this section, you learn how to create a zonal or no-zone public IP address.

# [**Zonal**](#tab/create-public-ip-zonal)

To create a standard zonal public IPv4 address in Zone 2 named **myStandardPublicIP** in **QuickStartCreateIP-rg**, use the following command.

To create an IPv6 address, modify the **`--version`** parameter to **IPv6**.

```azurecli-interactive
  az network public-ip create \
    --resource-group QuickStartCreateIP-rgLB \
    --name myStandardPublicIP-zonal \
    --version IPv4 \
    --sku Standard \
    --zone 2
```

>[!NOTE]
>The above options for zones are only valid selections in regions with [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

# [**Non-zonal**](#tab/create-public-ip-non-zonal)

In this section, you create a non-zonal IP address.  

>[!NOTE]
>The following command works for API version 2020-08-01 or later.  For more information about the API version currently being used, please refer to [Resource Providers and Types](../../azure-resource-manager/management/resource-providers-and-types.md).

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a standard public IPv4 address as a non-zonal resource named **myStandardPublicIP-nozone** in **QuickStartCreateIP-rg**. 

To create an IPv6 address, modify the **`--version`** parameter to **IPv6**.

```azurecli-interactive
  az network public-ip create \
    --resource-group QuickStartCreateIP-rg \
    --name myStandardPublicIP-nozone \
    --version IPv4 \
    --sku Standard
```
The removal of the **`--zone`** parameter in the command is valid in all regions.  

The removal of the **`--zone`** parameter is the default selection for standard public IP addresses in regions without [Availability Zones](../../availability-zones/az-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json#availability-zones).

---

## Routing Preference and Tier

Standard SKU static public IPv4 addresses support Routing Preference or the Global Tier feature.

# [**Routing Preference**](#tab/routing-preference)

By default, the routing preference for public IP addresses is set to **Microsoft network**, which delivers traffic over Microsoft's global wide area network to the user.  

The selection of **Internet** minimizes travel on Microsoft's network, instead using the transit ISP network to deliver traffic at a cost-optimized rate.  

For more information on routing preference, see [What is routing preference (preview)?](routing-preference-overview.md).

The command creates a new standard zone-redundant public IPv4 address with a routing preference of type **Internet**:

```azurecli-interactive
  az network public-ip create \
    --resource-group QuickStartCreateIP-rg \
    --name myStandardPublicIP-RP \
    --version IPv4 \
    --ip-tags 'RoutingPreference=Internet' \
    --sku Standard \
    --zone 1 2 3
```

# [**Tier**](#tab/tier)

Public IP addresses are associated with a single region. The **Global** tier spans an IP address across multiple regions. **Global** tier is required for the frontends of cross-region load balancers.  

For more information, see [Cross-region load balancer](../../load-balancer/cross-region-overview.md).

The following command creates a global IPv4 address. This address can be associated with the frontend of a cross-region load balancer.

```azurecli-interactive
  az network public-ip create \
    --resource-group QuickStartCreateIP-rg \
    --name myStandardPublicIP-Global \
    --version IPv4 \
    --tier global \
    --sku Standard \
```
>[!NOTE]
>Global tier addresses don't support Availability Zones.

---

## Clean up resources

If you're not going to continue to use this application, delete the public IP address with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.

2. In the search results, select **Resource groups**.

3. Select **QuickStartCreateIP-rg**.

4. Select **Delete resource group**.

5. Enter **QuickStartCreateIP-rg** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

Advance to the next article to learn how to create a public IP prefix:
> [!div class="nextstepaction"]
> [Create public IP prefix using the Azure CLI](create-public-ip-prefix-cli.md)
