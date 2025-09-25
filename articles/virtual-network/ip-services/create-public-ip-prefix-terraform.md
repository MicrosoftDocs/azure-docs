---
title: 'Quickstart: Create a public IP address prefix - Terraform'
titleSuffix: Azure Virtual Network
description: Learn how to create a public IP address prefix using Terraform.
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: quickstart
ms.date: 02/18/2025
ms.custom: mode-api, devx-track-terraform 
# Customer intent: As a cloud engineer, I want to create and manage public IP address prefixes using Terraform, so that I can efficiently assign static IP addresses to my Azure resources.
---

# Quickstart: Create a public IP address prefix using Terraform

Learn about a public IP address prefix and how to create, change, and delete one. A public IP address prefix is a contiguous range of standard SKU public IP addresses. 

When you create a public IP address resource, you can assign a static public IP address from the prefix and associate the address to virtual machines, load balancers, or other resources. For more information, see [Public IP address prefix overview](public-ip-address-prefix.md).

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random pet name for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a standard zone-redundant public IPv4 address prefix named **myIPv4**
> * Create a standard zonal public IPv4 address named **myIPv4Zonal**
> * Create a standard non-zonal public IPv4 address named **myIPv4NonZonal**
> * Create a standard public IPv4 address named **myIPv4RPInternet** that supports the Routing Preference feature
> * Create a standard zone-redundant public IPv6 address prefix named **myIPv6**
> * Create a standard zonal public IPv6 address named **myIPv6Zonal**
> * Create a standard non-zonal public IPv6 address named **myIPv6NonZonal**
> * Create a static public IP IPv4 address from an IP prefix
> * Create a static public IP IPv6 address from an IP prefix

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-public-ip-prefix). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-virtual-network-public-ip-prefix/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="1-10":::

## Create a public IP address prefix

In this section, you create a zone redundant, a zonal, and a non-zonal public IP prefix using Azure PowerShell. 

The prefixes in the examples are:

* **IPv4** - /28 (16 addresses)

* **IPv6** - /124 (16 addresses)

For more information on available prefix sizes, see [Prefix sizes](public-ip-address-prefix.md#prefix-sizes).

## IPv4

# [Zone redundant IPv4 prefix](#tab/ipv4-zone-redundant)

To create an IPv4 public IP prefix, specify **IPv4** as the `ip_version` value. To create a zone redundant IPv4 prefix, specify **["1", "2", "3"]** as the `zone` value.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="12-22" highlight="7-8,10":::

# [Zonal IPv4 prefix](#tab/ipv4-zonal)

To create an IPv4 public IP prefix, specify **IPv4** as the `ip_version` value. To create a zonal IP prefix in zone 2, specify **["2"]** as the `zone` value.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="24-34"  highlight="7-8,10":::

>[!NOTE]
>For more information about availability zones, see [What are availability zones?](../../reliability/availability-zones-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

# [Non-zonal IPv4 prefix](#tab/ipv4-non-zonal)

To create an IPv4 public IP prefix, specify **IPv4** as the `ip_version` value. To create a non-zonal IP prefix, omit the `zone` field.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="36-44"  highlight="7-8":::

The omission of the `zone` field is valid in all regions.  

The omission of the `zone` field is the default selection for standard public IP addresses in regions without [Availability Zones](../../reliability/availability-zones-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

---

# [Routing Preference Internet IPv4 prefix](#tab/ipv4-routing-pref)

To create an IPv4 public IP prefix with routing preference set to Internet, add **RoutingPreference=Internet** to the `tags` block.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="46-58"  highlight="7-8,10-12":::

---

## IPv6

# [Zone redundant IPv6 prefix](#tab/ipv6-zone-redundant)

To create an IPv6 public IP prefix, specify **IPv6** as the `ip_version` value. To create a zone redundant IPv6 prefix, specify **["1", "2", "3"]** as the `zone` value.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="60-70"  highlight="7-8,10":::

# [Zonal IPv6 prefix](#tab/ipv6-zonal)

To create an IPv6 public IP prefix, specify **IPv6** as the `ip_version` value. To create a zone redundant IPv6 prefix, specify **["2"]** as the `zone` value.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="72-82"  highlight="7-8,10":::

>[!NOTE]
>For more information about availability zones, see [What are availability zones?](../../reliability/availability-zones-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

# [Non-zonal IPv6 prefix](#tab/ipv6-non-zonal)

To create an IPv6 public IP prefix, specify **IPv6** as the `ip_version` value. To create a non-zonal IP prefix, omit the `zone` field.

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="84-92"  highlight="7-8":::

The omission of the `zone` field is valid in all regions.  

The omission of the `zone` field is the default selection for standard public IP addresses in regions without [Availability Zones](../../reliability/availability-zones-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

---

## Create a static public IP address from a prefix

Once you create a prefix, you can create static IP addresses from the prefix. In this section, you see how to create a prefix and then create an address that points to the prefix.

# [IPv4 address](#tab/ipv4-address)

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="107-115,93-105"  highlight="2,21":::

# [IPv6 address](#tab/ipv6-address)

:::code language="terraform" source="~/terraform_samples/quickstart/101-virtual-network-public-ip-prefix/main.tf" range="130-138, 116-128"  highlight="2,21":::

---

>[!NOTE]
>Only static public IP addresses created with the standard SKU can be assigned from the prefix's range. To learn more about public IP address SKUs, see [public IP address](public-ip-addresses.md#public-ip-addresses).

## Delete a prefix

In this section, you learn how to delete a prefix at the command line.

# [Azure CLI](#tab/azure-cli)

To delete a public IP prefix, use [az network public-ip prefix delete](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-delete).

```azurecli
  az network public-ip prefix delete \
    --resource-group <resource_group_name>
    --name <public_ip_prefix_name> \
```

# [Azure PowerShell](#tab/azure-powershell)

To delete a public IP prefix, use [Remove-AzPublicIpPrefix](/powershell/module/az.network/remove-azpublicipprefix).

```azurepowershell
Remove-AzPublicIpPrefix -ResourceGroupName <resource_group_name> `
                        -Name <public_ip_prefix_name>
```

>[!NOTE]
>If addresses within the prefix are associated with public IP address resources, delete the public IP address resources first. For more information about deleting a public IP address, see [delete a public IP address](virtual-network-public-ip-address.md#view-modify-settings-for-or-delete-a-public-ip-address).

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Create a public IP using Terraform](create-public-ip-terraform.md)
