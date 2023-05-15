---
title: Tag resources, resource groups, and subscriptions for logical organization
description: Describes the conditions and limitations for using tags with Azure resources.
ms.topic: conceptual
ms.date: 04/19/2023
---

# Use tags to organize your Azure resources and management hierarchy

Tags are metadata elements that you apply to your Azure resources. They're key-value pairs that help you identify resources based on settings that are relevant to your organization. If you want to track the deployment environment for your resources, add a key named `Environment`. To identify the resources deployed to production, give them a value of `Production`. The fully-formed key-value pair is `Environment = Production`.

This article describes the conditions and limitations for using tags. For steps on how to work with tags, see:

* [Portal](tag-resources-portal.md)
* [Azure CLI](tag-resources-cli.md)
* [Azure PowerShell](tag-resources-powershell.md)
* [Python](tag-resources-python.md)
* [ARM templates](tag-resources-templates.md)
* [Bicep](tag-resources-bicep.md)

## Tag usage and recommendations

You can apply tags to your Azure resources, resource groups, and subscriptions.

For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).

Resource tags support all cost-accruing services. To ensure that cost-accruing services are provisioned with a tag, use one of the [tag policies](tag-policies.md).  

> [!WARNING]
> Tags are stored as plain text. Never add sensitive values to tags. Sensitive values could be exposed through many methods, including cost reports, commands that return existing tag definitions, deployment histories, exported templates, and monitoring logs.

> [!WARNING]
> Please be careful while using non-English language in your tags. It can cause decoding progress failure while loading your VM's metadata from IMDS (Instance Metadata Service).

> [!IMPORTANT]
> Tag names are case-insensitive for operations. A tag with a tag name, regardless of the casing, is updated or retrieved. However, the resource provider might keep the casing you provide for the tag name. You'll see that casing in cost reports.
>
> Tag values are case-sensitive.

[!INCLUDE [Handle personal data](../../../includes/gdpr-intro-sentence.md)]

## Required access

There are two ways to get the required access to tag resources.

- You can have write access to the `Microsoft.Resources/tags` resource type. This access lets you tag any resource, even if you don't have access to the resource itself. The [Tag Contributor](../../role-based-access-control/built-in-roles.md#tag-contributor) role grants this access. The tag contributor role, for example, can't apply tags to resources or resource groups through the portal. It can, however, apply tags to subscriptions through the portal. It supports all tag operations through Azure PowerShell and REST API.

- You can have write access to the resource itself. The [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role grants the required access to apply tags to any entity. To apply tags to only one resource type, use the contributor role for that resource. To apply tags to virtual machines, for example, use the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor).

## Inherit tags

Resources don't inherit the tags you apply to a resource group or a subscription. To apply tags from a subscription or resource group to the resources, see [Azure Policies - tags](tag-policies.md).

## Tags and billing

You can use tags to group your billing data. If you're running multiple VMs for different organizations, for example, use the tags to group usage by cost center. You can also use tags to categorize costs by runtime environment, such as the billing usage for VMs running in the production environment.

You can retrieve information about tags by downloading the usage file available from the Azure portal. For more information, see [Download or view your Azure billing invoice and daily usage data](../../cost-management-billing/manage/download-azure-invoice-daily-usage-date.md). For services that support tags with billing, the tags appear in the **Tags** column.

For REST API operations, see [Azure Billing REST API Reference](/rest/api/billing/).

## Limitations

The following limitations apply to tags:

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* Each resource, resource group, and subscription can have a maximum of 50 tag name-value pairs. If you need to apply more tags than the maximum allowed number, use a JSON string for the tag value. The JSON string can contain many of the values that you apply to a single tag name. A resource group or subscription can contain many resources that each have 50 tag name-value pairs.
* The tag name has a limit of 512 characters and the tag value has a limit of 256 characters. For storage accounts, the tag name has a limit of 128 characters and the tag value has a limit of 256 characters.
* Classic resources such as Cloud Services don't support tags.
* Azure IP Groups and Azure Firewall Policies don't support PATCH operations. PATCH API method operations, therefore, can't update tags through the portal. Instead, you can use the update commands for those resources. You can update tags for an IP group, for example, with the [az network ip-group update](/cli/azure/network/ip-group#az-network-ip-group-update) command.
* Tag names can't contain these characters: `<`, `>`, `%`, `&`, `\`, `?`, `/`

   > [!NOTE]
   > * Azure Domain Name System (DNS) zones don't support the use of spaces in the tag or a tag that starts with a number. Azure DNS tag names don't support special and unicode characters. The value can contain all characters.
   >
   > * Traffic Manager doesn't support the use of spaces, `#` or `:` in the tag name. The tag name can't start with a number.
   >
   > * Azure Front Door doesn't support the use of `#` or `:` in the tag name.
   >
   > * The following Azure resources only support 15 tags:
   >     * Azure Automation
   >     * Azure Content Delivery Network (CDN)
   >     * Azure DNS (Zone and A records)
   >     * Azure Log Analytics Saved Search

## Next steps

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
* For steps on how to work with tags, see:

  * [Portal](tag-resources-portal.md)
  * [Azure CLI](tag-resources-cli.md)
  * [Azure PowerShell](tag-resources-powershell.md)
  * [Python](tag-resources-python.md)
  * [ARM templates](tag-resources-templates.md)
  * [Bicep](tag-resources-bicep.md)
