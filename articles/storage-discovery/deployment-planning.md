---
title: Planning for an Azure Storage Discovery deployment
titleSuffix: Azure Storage Discovery
description: Considerations and best-practices for deploying the Azure Storage Discovery service
author: fauhse
ms.service: azure-storage-mover
ms.topic: overview
ms.date: 08/01/2025
ms.author: fauhse
---

# Planning for an Azure Storage Discovery preview deployment

Before you continue, be sure to get an [overview of the Storage Discovery service](overview.md) and the value it can provide to you.

## Make sure the service works for your scenario

Azure Storage Discovery currently surfaces insights for resources of the Azure Blob Storage service.
Coverage also includes storage accounts configured with the [hierarchical namespace feature](../storage/blobs/data-lake-storage-namespace.md) to enable [Azure Data Lake Storage](../storage/blobs/data-lake-storage-introduction.md).

Discovery currently doesn't work for [Azure Files](../storage/files/storage-files-introduction.md) or other storage types.

## Deployment basics

Your Azure Storage resources (like storage accounts) experience no transactions or performance impact when analyzing them with Azure Storage Discovery.

Deploying the service means deploying and configuring a *Storage Discovery workspace resource* into a resource group in one of your subscriptions.
The Discovery service works to compute and store insights about your Azure Blob Storage estate. These computed insights are stored in the region of the workspace you created. Other than the Storage Discovery workspace, no other infrastructure needs to be deployed.

The workspace can be configured to aggregate insights across any subscriptions in the Azure tenant the workspace is deployed in.
To generate insights about Azure Storage resources, such as storage accounts, you need to be a member of the RBAC (Role Based Access Control) Reader role for every storage resource.

> [!IMPORTANT]
> To get accurate insights, you need to configure your workspace for resources you have permissions to.<br> The [permissions section](#permissions) in this article has important details you should review.

## Getting your subscription ready

You need to choose a subscription governed by the same Azure tenant as the Azure Storage resources (such as storage accounts) you want to receive insights for. When you decided on an Azure subscription and resource group for your Storage Discovery workspace, review the following sections to ensure your subscription is prepared.

### Resource provider namespace

Before a service is used for the first time in an Azure subscription, its resource provider namespace must be registered once with the chosen subscription. Azure Storage Discovery has the same requirement. A subscription *Owner* or *Contributor* can perform this action. Performing this registration action before the actual Storage Discovery workspace deployment enables admins with fewer rights to deploy and use the Storage Discovery service.

> [!IMPORTANT]
> The subscription must be registered with the resource provider namespaces *Microsoft.StorageDiscovery*.

Register a resource provider:

- [via the Azure portal](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal)
- [via Azure PowerShell](../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell)
- [via Azure CLI](../azure-resource-manager/management/resource-providers-and-types.md#azure-cli)

> [!TIP]
> When you deploy a Storage Discovery workspace as a subscription *Owner* or *Contributor* through the Azure portal, your subscription is automatically registered with this resource provider namespace. You only need to perform the registration manually when using Azure PowerShell or CLI.

Once a subscription is enabled for this resource provider namespace, it remains enabled until manually unregistered. You can even delete the last Storage Discovery workspace and your subscription still remains enabled. Subsequent Storage Discovery workspace deployments then require reduced permissions from an admin. The following section contains a breakdown of different management scenarios and their required permissions.

### Decide on the number of workspaces you need

A Storage Discovery workspace needs to be configured with *scopes*. The management components article shares [details about workspace scopes](management-components.md).
Scopes are logical groups of storage resources. For instance, a scope can refer to all the storage resources of a specific workload or department that you want to get insights for separately. 

Since you can only configure a limited number of scopes in a workspace, you may need more than one workspace to cover your insights reporting needs.

If a workspace is to be used for higher-level insights, you can create one with one scope for your entire Azure Storage estate and then add scopes for each department.
If a workspace is designated to provide insights for specific workloads, then you can create a workspace containing a scope for each workload.

> [!IMPORTANT]
> During the Azure Storage Discovery preview period, the Discovery service covers only storage accounts located in select regions. <br>The [Understand region limitations](#understand-region-limitations) section in this article has details.

### Review your Azure resource tags

You can select which storage resources are included in a [workspace scope](management-components.md) by first selecting specific subscriptions or resource groups, and then filtering the storage resources within them by [Azure resource tags](../azure-resource-manager/management/tag-resources.md).
It's important that you familiarize yourself with the available resource tags on your storage resources. Ensure they're consistently applied and then catalog them for building the scopes in your workspace. Plan the scopes you need in order to have insights available per department, workload, or other grouping you have a use for.

## Select an Azure region for your deployment

When you deploy a Storage Discovery workspace, you need to choose a region. The region you select determines where the computed insights about your Azure Storage resources are stored. You can still capture insights for Azure Storage resources that are located in other regions. A general best practice is to choose the region for your workspace according to metadata residency requirements that apply to you and in closer proximity to your location. Visualizing your insights from a workspace closer to you can have a slight performance advantage.

Storage Discovery workspaces can be created in the following regions. More regions are added throughout the preview period.

[!INCLUDE [control-plane-regions](includes/control-plane-regions.md)]

## Understand region limitations

While a Storage Discovery workspace can cover storage accounts from other subscriptions and resource groups, and even other regions, there's an important region limitation you need to be aware of for a successful Storage Discovery deployment.

The Discovery service covers only storage accounts located in the following regions:
<br><br>
[!INCLUDE [data-plane-regions](includes/data-plane-regions.md)]
<br>

> [!WARNING]
> The Discovery service currently can't consider storage accounts located in regions not included in the previously listed locations. Including storage accounts from unsupported regions in a scope can lead to an incomplete set of insights. A short-term limitation of the preview period.

## Permissions

Permissions are managed via the familiar Azure [Role Based Access Control](../role-based-access-control/overview.md) (RBAC).
This sections covers:
* Permission to the storage resources you want to get insights for from the Discovery service.
* Permission considerations for a workspace resource.

### Permissions to your storage resources

During the creation of a Storage Discovery workspace, you configure the [workspace root](management-components.md). The [management components](management-components.md) article provides more details for this configuration.
In the workspace root, you list at least one and at most 100 Azure resources of different types:
- subscriptions
- resource groups
- storage accounts

The person deploying the workspace must have at least the RBAC role assignment *Reader* for every resource in the workspace root.
*Reader* is the minimum permission level required. *Contributor* and *Owner* are also supported.

It's possible that you see a subscription listed in the Azure portal, for which you don't have this direct *Reader* role assignment. When you can see a resource you don't have a role assignment to, then most likely you have permissions to a sub resource in this subscription. In this case, the existence of this "parent" was revealed to you, but you have no rights on the subscription resource itself. This example can be extended to resource groups as well. Missing a *Reader* or higher direct role assignment disqualifies an Azure resource from being the basis (root) of a workspace.

Permissions are only validated when a workspace is created. Any change to permissions of the Azure account that created the workspace, including its deletion, has no effect on the workspace or the Discovery service functionality.

### Permission considerations for a workspace resource

The Azure Storage Discovery workspace stores the computed insights for your storage estate. You can access reports in the Azure portal, or use these insights via the Azure Copilot. In order to access insights stored in a workspace, a user must have at least the RBAC role *Reader* on the workspace. *Contributor* and *Owner* role assignments also work. You can provide insights-access to another user by assigning them one of the three previously listed roles on the workspace.


|Scenario |Minimal RBAC role assignments needed                                             |
|:--------|--------------------------------------------------------------------------------:|
|Register a resource provider namespace with a subscription|	Subscription: `Contributor`	|
|Deploy a Storage Discovery workspace <br>*([Resource provider namespace already registered](#resource-provider-namespace))*|	Resource group: `Contributor` |
|Share the Storage Discovery insights with another person | Storage Discovery workspace: `Reader`|
|Enable a person to make changes to the workspace configuration| Storage Discovery workspace: `Contributor`|
|Enable a person to share these insights with others | Storage Discovery workspace: `Owner`|

> [!CAUTION]
> When you provide other users access to a workspace, you're disclosing all insights of the workspace. Other users might not be privileged to know about the existence of the Azure resources or insights about the data they store. Providing access to a workspace doesn't provide access to an individual storage account, resource group, or subscription. Individual resources remain governed by RBAC.

## Next steps

- [Review the Storage Discovery management components](management-components.md)
- [Understand Storage Discovery pricing](pricing.md)
- [Create a Storage Discovery workspace](create-workspace.md)
