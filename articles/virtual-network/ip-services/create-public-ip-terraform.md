---
title: 'Quickstart: Create a public IP - Terraform'
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP address using Terraform
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.topic: quickstart
ms.date: 05/12/2025
ms.custom: mode-api, devx-track-terraform 
---

# Quickstart: Create a public IP address using Terraform

In this quickstart, you learn how to create an Azure public IP address. Public IP addresses in Azure are used for public connections to Azure resources. Public IP addresses are available in two SKUs: basic, and standard. Two tiers of public IP addresses are available: regional, and global. The routing preference of a public IP address is set when created. Internet routing and Microsoft Network routing are the available choices.

:::image type="content" source="./media/create-public-ip-portal/public-ip-example-resources.png" alt-text="Diagram of an example use of a public IP address. A public IP address is assigned to a load balancer.":::

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random pet name for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a standard zone-redundant public IPv4 address named **myStandardPublicIP**
> * Create a basic static public IPv4 address named **myBasicPublicIP**
> * Create a standard zonal public IPv4 address in Zone 2 named **myZonalStandardPublicIP**
> * Create a non-zonal IP address named **myNonZonalStandardPublicIP**
> * Create a standard static public IPv4 address named **myRoutingPreferenceStandardPublicIP** that supports the Routing Preference feature
> * Create a standard static public IPv4 address named **myGlobalTierStandardPublicIP** that supports the Global Tier feature

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-public-ip). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-public-ip/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip/main.tf" range="1-10":::

## Create public IP

# [Standard SKU](#tab/create-public-ip-standard)

>[!NOTE]
>Standard SKU public IP is recommended for production workloads. For more information about SKUs, see **[Public IP addresses](public-ip-addresses.md)**.
>
>The following command snippet works for API version **2020-08-01** or **later**. For more information about the API version currently being used, see [Resource Providers and Types](../../azure-resource-manager/management/resource-providers-and-types.md).

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip/main.tf" range="12-22":::

> [!IMPORTANT]
> For versions of the API older than 2020-08-01, omit the `zone` field to create a zone-redundant IP address. 
>

# [Basic SKU](#tab/create-public-ip-basic)

In this section, you create a basic IP. Basic public IPs don't support availability zones.

The following code snippet creates an IPv6 address. For an IPv6 address, set the `ip_version` value to **IPv6**. 

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip/main.tf" range="24-33":::

If it's acceptable for the IP address to change over time, dynamic IP assignment can be selected by changing the `allocation_method` value to **Dynamic**. 

>[!NOTE]
> A basic IPv6 address must always be dynamic.

---

## Create a zonal or no-zone IP address

In this section, you learn how to create a zonal and a non-zone public IP address.

# [Zonal](#tab/create-public-ip-zonal)

The following code snippet creates a standard zonal public IPv4 address in Zone 2 named **myZonalStandardPublicIP**.

To create an IPv6 address, set the `ip_version` value to **IPv6**.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip/main.tf" range="35-45":::

>[!NOTE]
>For more information about availability zones, see [What are availability zones?](../../reliability/availability-zones-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

# [Non-zonal](#tab/create-public-ip-non-zonal)

The following code snippet creates a standard public IPv4 address as a non-zonal resource named **myNonZonalStandardPublicIP**. 

>[!NOTE]
>The following command works for API version 2020-08-01 or later. For more information about the API version currently being used, see [Resource Providers and Types](../../azure-resource-manager/management/resource-providers-and-types.md).

To create an IPv6 address, set the `ip_version` value to **IPv6**.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip/main.tf" range="47-56":::

The removal of the `zone` field is valid in all regions. 

The removal of the `zone` field is the default selection for standard public IP addresses in regions without [Availability Zones](../../reliability/availability-zones-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

---

## Routing Preference and Tier

Standard SKU static public IPv4 addresses support Routing Preference or the Global Tier feature.

# [Routing Preference](#tab/routing-preference)

By default, the routing preference for public IP addresses is set to **Microsoft network**, which delivers traffic over Microsoft's global wide area network to the user. 

The selection of **Internet** minimizes travel on Microsoft's network, instead using the transit ISP network to deliver traffic at a cost-optimized rate. 

For more information on routing preference, see [What is routing preference (preview)?](routing-preference-overview.md).

The following code snippet creates a new standard zone-redundant public IPv4 address with a routing preference of type **Internet**:

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip/main.tf" range="58-73":::

# [Tier](#tab/tier)

Public IP addresses are associated with a single region. The **Global** tier spans an IP address across multiple regions. **Global** tier is required for the frontends of cross-region load balancers. 

For more information, see [Cross-region load balancer](../../load-balancer/cross-region-overview.md).

The following code snippet creates a global IPv4 address. This address can be associated with the frontend of a cross-region load balancer.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip/main.tf" range="75-85":::

>[!NOTE]
>Global tier addresses don't support Availability Zones.

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Create public IP prefix using the Azure CLI](create-public-ip-prefix-cli.md)
