---
title: Azure Resource Manager overview
description: Describes how to use Azure Resource Manager for deployment, management, and access control of resources on Azure.
ms.topic: overview
ms.date: 11/13/2023
ms.custom: contperf-fy21q1, contperf-fy21q3-portal, devx-track-arm-template
---
# What is Azure Resource Manager?

Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure account. You use management features, like access control, locks, and tags, to secure and organize your resources after deployment.

To learn about Azure Resource Manager templates (ARM templates), see the [ARM template overview](../templates/overview.md). To learn about Bicep, see [Bicep overview](../bicep/overview.md).

## Consistent management layer

When you send a request through any of the Azure APIs, tools, or SDKs, Resource Manager receives the request. It authenticates and authorizes the request before forwarding it to the appropriate Azure service. Because all requests are handled through the same API, you see consistent results and capabilities in all the different tools.

The following image shows the role Azure Resource Manager plays in handling Azure requests.

:::image type="content" source="./media/overview/consistent-management-layer.png" alt-text="Diagram that shows the role of Azure Resource Manager in handling Azure requests." border="false":::

All capabilities that are available in the portal are also available through PowerShell, Azure CLI, REST APIs, and client SDKs. Functionality initially released through APIs will be represented in the portal within 180 days of initial release.

> [!IMPORTANT]
> Azure Resource Manager will only support Transport Layer Security (TLS) 1.2 or later by Fall 2023. For more information, see [Migrating to TLS 1.2 for Azure Resource Manager](tls-support.md).

## Terminology

If you're new to Azure Resource Manager, there are some terms you might not be familiar with.

* **resource** - A manageable item that is available through Azure. Virtual machines, storage accounts, web apps, databases, and virtual networks are examples of resources. Resource groups, subscriptions, management groups, and tags are also examples of resources.
* **resource group** - A container that holds related resources for an Azure solution. The resource group includes those resources that you want to manage as a group. You decide which resources belong in a resource group based on what makes the most sense for your organization. See [What is a resource group?](#resource-groups).
* **resource provider** - A service that supplies Azure resources. For example, a common resource provider is `Microsoft.Compute`, which supplies the virtual machine resource. `Microsoft.Storage` is another common resource provider. See [Resource providers and types](resource-providers-and-types.md).
* **declarative syntax** - Syntax that lets you state "Here's what I intend to create" without having to write the sequence of programming commands to create it. ARM templates and Bicep files are examples of declarative syntax. In those files, you define the properties for the infrastructure to deploy to Azure.
* **ARM template** - A JavaScript Object Notation (JSON) file that defines one or more resources to deploy to a resource group, subscription, management group, or tenant. The template can be used to deploy the resources consistently and repeatedly. See [Template deployment overview](../templates/overview.md).
* **Bicep file** - A file for declaratively deploying Azure resources. Bicep is a language that's been designed to provide the best authoring experience for infrastructure as code solutions in Azure. See [Bicep overview](../bicep/overview.md).

For more definitions of Azure terminology, see [Azure fundamental concepts](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts).

## The benefits of using Resource Manager

With Resource Manager, you can:

* Manage your infrastructure through declarative templates rather than scripts.

* Deploy, manage, and monitor all the resources for your solution as a group, rather than handling these resources individually.

* Redeploy your solution throughout the development lifecycle and have confidence your resources are deployed in a consistent state.

* Define the dependencies between resources so they're deployed in the correct order.

* Apply access control to all services because Azure role-based access control (Azure RBAC) is natively integrated into the management platform.

* Apply tags to resources to logically organize all the resources in your subscription.

* Clarify your organization's billing by viewing costs for a group of resources sharing the same tag.

## Understand scope

Azure provides four levels of scope: [management groups](../../governance/management-groups/overview.md), subscriptions, [resource groups](#resource-groups), and resources. The following image shows an example of these layers.

:::image type="content" source="./media/overview/scope-levels.png" alt-text="Diagram that illustrates the four levels of scope in Azure: management groups, subscriptions, resource groups, and resources." border="false":::

You apply management settings at any of these levels of scope. The level you select determines how widely the setting is applied. Lower levels inherit settings from higher levels. For example, when you apply a [policy](../../governance/policy/overview.md) to the subscription, the policy is applied to all resource groups and resources in your subscription. When you apply a policy on the resource group, that policy is applied to the resource group and all its resources. However, another resource group doesn't have that policy assignment.

For information about managing identities and access, see [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md).

You can deploy templates to tenants, management groups, subscriptions, or resource groups.

## <a name="resource-groups"></a>What is a resource group?

A resource group is a container that enables you to manage related resources for an Azure solution. By using the resource group, you can coordinate changes to the related resources. For example, you can deploy an update to the resource group and have confidence that the resources are updated in a coordinated operation. Or, when you're finished with the solution, you can delete the resource group and know that all of the resources are deleted.

There are some important factors to consider when defining your resource group:

* All the resources in your resource group should share the same lifecycle. You deploy, update, and delete them together. If one resource, such as a server, needs to exist on a different deployment cycle it should be in another resource group.

* Each resource can exist in only one resource group.

* You can add or remove a resource to a resource group at any time.

* You can move a resource from one resource group to another group. For more information, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).

* The resources in a resource group can be located in different regions than the resource group.

* When you create a resource group, you need to provide a location for that resource group. 

  You may be wondering, "Why does a resource group need a location? And, if the resources can have different locations than the resource group, why does the resource group location matter at all?"

  The resource group stores metadata about the resources. When you specify a location for the resource group, you're specifying where that metadata is stored. For compliance reasons, you may need to ensure that your data is stored in a particular region.

  To ensure state consistency for the resource group, all [control plane operations](./control-plane-and-data-plane.md) are routed through the resource group's location. When selecting a resource group location, we recommend that you select a location close to where your control operations originate. Typically, this location is the one closest to your current location. This routing requirement only applies to control plane operations for the resource group. It doesn't affect requests that are sent to your applications.
  
  If a resource group's region is temporarily unavailable, you may not be able to update resources in the resource group because the metadata is unavailable. The resources in other regions will still function as expected, but you may not be able to update them. This condition may also apply to global resources like Azure DNS, Azure DNS Private Zones, Azure Traffic Manager, and Azure Front Door. You can view which types have their metadata managed by Azure Resource Manager via the [list of types for the Azure Resource Graph resources table](../../governance/resource-graph/reference/supported-tables-resources.md#resources).
   
  For more information about building reliable applications, see [Designing reliable Azure applications](/azure/architecture/checklist/resiliency-per-service).

* A resource group can be used to scope access control for administrative actions. To manage a resource group, you can assign [Azure Policies](../../governance/policy/overview.md), [Azure roles](../../role-based-access-control/role-assignments-portal.md), or [resource locks](lock-resources.md).

* You can [apply tags](tag-resources.md) to a resource group. The resources in the resource group don't inherit those tags.

* A resource can connect to resources in other resource groups. This scenario is common when the two resources are related but don't share the same lifecycle. For example, you can have a web app that connects to a database in a different resource group.

* When you delete a resource group, all resources in the resource group are also deleted. For information about how Azure Resource Manager orchestrates those deletions, see [Azure Resource Manager resource group and resource deletion](delete-resource-group.md).

* You can deploy up to 800 instances of a resource type in each resource group. Some resource types are [exempt from the 800 instance limit](resources-without-resource-group-limit.md). For more information, see [resource group limits](azure-subscription-service-limits.md#resource-group-limits).

* Some resources can exist outside of a resource group. These resources are deployed to the [subscription](../templates/deploy-to-subscription.md), [management group](../templates/deploy-to-management-group.md), or [tenant](../templates/deploy-to-tenant.md). Only specific resource types are supported at these scopes.

* To create a resource group, you can use the [portal](manage-resource-groups-portal.md#create-resource-groups), [PowerShell](manage-resource-groups-powershell.md#create-resource-groups), [Azure CLI](manage-resource-groups-cli.md#create-resource-groups), or an [ARM template](../templates/deploy-to-subscription.md#resource-groups).

## Resiliency of Azure Resource Manager

The Azure Resource Manager service is designed for resiliency and continuous availability. Resource Manager and control plane operations (requests sent to `management.azure.com`) in the REST API are:

* Distributed across regions. Azure Resource Manager has a separate instance in each region of Azure, meaning that a failure of the Azure Resource Manager instance in one region doesn't affect the availability of Azure Resource Manager or other Azure services in another region. Although Azure Resource Manager is distributed across regions, some services are regional. This distinction means that while the initial handling of the control plane operation is resilient, the request may be susceptible to regional outages when forwarded to the service.

* Distributed across Availability Zones (and regions) in locations that have multiple Availability Zones. This distribution ensures that when a region loses one or more zones, Azure Resource Manager can either fail over to another zone or to another region to continue to provide control plane capability for the resources.

* Not dependent on a single logical data center.

* Never taken down for maintenance activities.

This resiliency applies to services that receive requests through Resource Manager. For example, Key Vault benefits from this resiliency.

### Resource group location alignment
To reduce the likelihood of being impacted by region outages, if they occur, it's recommended to co-locate your resources with their resource group in the same region together. 
The resource group location is used to determine the location where Azure Resource Manager will store metadata related to all the resources within the resource group, which is then used for routing and caching. For instance, when you list your resources at the subscription or resource group scopes, Azure Resource Manager responds based off this cache.
When the resource group's region is unavailable, Azure Resource Manager may be unable to update your resource's metadata and may block your write calls. By co-locating your resource and resource group region, you can reduce your chance of being affected by region unavailability since your resource and resource management metadata will all be stored in one region instead of multiple.

## Next steps

* To learn about limits that are applied across Azure services, see [Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md).

* To learn about moving resources, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).

* To learn about tagging resources, see [Use tags to organize your Azure resources](tag-resources.md).

* To learn about locking resources, see [Lock resources to prevent unexpected changes](lock-resources.md).
