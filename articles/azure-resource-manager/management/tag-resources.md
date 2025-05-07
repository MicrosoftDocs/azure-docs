---
title: Use tags to organize your Azure resources and management hierarchy 
description: Understand how to tag Azure resources, resource groups, and subscriptions for logical organization. Learn about the conditions and limitations of using tags with Azure resources.
ms.topic: conceptual
ms.date: 02/06/2025
---

# Use tags to organize your Azure resources and management hierarchy

Tags are metadata elements that you apply to your Azure resources. They are key-value pairs that help you identify resources based on settings that are relevant to your organization. If you want to track the deployment environment for your resources, add a key named `Environment`. To identify the resources deployed to production, give them a value of `Production`. The full key-value pair is `Environment = Production`.

This article describes the conditions and limitations for using tags. 

## Tag usage and recommendations

You can apply tags to your Azure resources, resource groups, and subscriptions but not to management groups.

For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).

Resource tags support all cost-accruing services. To ensure that cost-accruing services are provisioned with a tag, use one of the [tag policies](tag-policies.md).  

> [!WARNING]
> Tags are stored as plain text. Do not add sensitive values to tags. Sensitive values could be exposed through many methods, including cost reports, commands that return existing tag definitions, deployment histories, exported templates, and monitoring logs.

> [!WARNING]
> Be careful when using non-English language in your tags. It can cause decoding progress failure while loading your virtual machine's metadata from IMDS (Instance Metadata Service).

> [!IMPORTANT]
> Tag names are case-insensitive for operations. An operation updates or retrieves a tag with a tag name, regardless of the casing. However, the resource provider might keep the casing you provide for the tag name. You see that casing in cost reports.
>
> Tag values are case-sensitive.

[!INCLUDE [Handle personal data](~/reusable-content/ce-skilling/azure/includes/gdpr-intro-sentence.md)]

## Required access

There are two ways to get the required access to tag resources:

- You can have write access to the `Microsoft.Resources/tags` resource type. This access lets you tag any resource, even if you don't have access to the resource itself. The [Tag Contributor](../../role-based-access-control/built-in-roles.md#tag-contributor) role grants this access. For example, this role can't apply tags to resources or resource groups through the Azure portal. However, it can apply tags to subscriptions through the Azure portal. It supports all tag operations through Azure PowerShell and REST API.

- You can have write access to the resource itself. The [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role grants the required access to apply tags to any entity. To apply tags to only one resource type, use the Contributor role for that resource. To apply tags to virtual machines, use the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) role.

## Inherit tags

Resources don't inherit the tags you apply to a resource group or a subscription. To apply tags from a subscription or resource group to the resources, see [Assign policy definitions for tag compliance](tag-policies.md).

You can group costs for an Azure resource by using the **cm-resource-parent** tag. This tag lets you review tagged costs in Microsoft Cost Management without having to use filters. The key for this tag is `cm-resource-parent` and its value is the resource ID of the Azure resource you want to group costs by. For example, to group costs by an Azure Virtual Desktop host pool, provide the resource ID of the host pool. For more information, see [Group related resources in the Resources view](../../cost-management-billing/costs/group-filter.md#group-related-resources-in-the-resources-view).

## Tags and billing

Use tags to group your billing data. For example, if you're running multiple virtual machines for different organizations, use the tags to group usage by cost center. You can also use tags to categorize costs by runtime environment, including the billing usage for virtual machines running in the production environment.

To retrieve information about tags, download the usage file from the Azure portal. For more information, see [Download or view your Azure billing invoice](../../cost-management-billing/manage/download-azure-invoice-daily-usage-date.md). For services that support tags with billing, the tags appear in the **Tags** column.

For REST API operations, see the [Azure Billing REST API](/rest/api/billing/) overview.

## Unique tags pagination

When you call the [Unique tags API](/rest/api/resources/tags/list), there's a limit to the size of each API response page. A tag that has a large set of unique values requires the API to fetch the next page to retrieve the remaining set of values. When the results are divided over multiple pages, the API response shows the tag key again to indicate that the values are still under this key.  

This behavior can cause some tools like the Azure portal to show the tag key twice.

## Limitations

The following limitations apply to tags:

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).

* Each resource type might have specific requirements when working with tags. For example, you can only update tags on virtual machine extensions when the virtual machine is running. If you receive an error message while trying to update a tag, follow the instructions in the message.

* Each resource, resource group, and subscription can have a maximum of 50 tag name-value pairs. If you need to apply more tags than the maximum allowed number, use a JSON string for the tag value. The JSON string can contain many of the values that you apply to a single tag name. A resource group or subscription can contain many resources that each have 50 tag name-value pairs.

* The tag name has a limit of 512 characters and the tag value has a limit of 256 characters. For storage accounts, the tag name has a limit of 128 characters and the tag value has a limit of 256 characters.

* Classic resources such as Cloud Services don't support tags.

* Azure IP Groups and Azure Firewall policies don't support PATCH operations. Therefore, PATCH API method operations can't update tags through the Azure portal. Instead, use the update commands for those resources. For example, you can update tags for an IP group with the [`az network ip-group update`](/cli/azure/network/ip-group) command.

* Tag names can't contain these characters: `<`, `>`, `%`, `&`, `\`, `?`, `/`

   > [!NOTE]
   > * Azure DNS zones don't support the use of spaces or parentheses in the tag or a tag that starts with a number. Azure DNS tag names don't support special and Unicode characters. The value can contain all characters.
   >
   > * Traffic Manager doesn't support the use of spaces, `#`, or `:` in the tag name. The tag name can't start with a number.
   >
   > * Azure Front Door doesn't support the use of `#` or `:` in the tag name.
   >
   > * The following Azure resources only support 15 tags:
   >     * Azure Automation
   >     * Azure Content Delivery Network
   >     * Azure Public DNS (Zone and A records)
   >     * Azure Private DNS (Zone and A records)
   >     * Azure Log Analytics saved search

## Next steps

For more information on how to work with tags, see:

* [Azure portal](tag-resources-portal.md)
* [Azure CLI](tag-resources-cli.md)
* [Azure PowerShell](tag-resources-powershell.md)
* [Python](tag-resources-python.md)
* [ARM templates](tag-resources-templates.md)
* [Bicep](tag-resources-bicep.md)
