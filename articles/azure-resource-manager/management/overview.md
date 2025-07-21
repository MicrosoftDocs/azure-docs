---
title: What is Azure Resource Manager?
description: This overview describes how to use Azure Resource Manager to deploy, manage, and control access to Azure resources.
ms.topic: overview
ms.date: 02/06/2025
ms.custom: devx-track-arm-template
---

# What is Azure Resource Manager?

Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that helps you to create, update, and delete resources in your Azure account. You use management features like access control, locks, and tags to secure and organize your resources after deployment.

The following video covers basic Resource Manager concepts:

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=d257e6ec-abab-47f4-a209-22049e7a40b4]

## Consistent management layer

When you send a request through any of the Azure APIs, tools, or SDKs, Resource Manager receives the request. It authenticates and authorizes the request before forwarding it to the appropriate Azure service. Because all requests are handled through the same API, you see consistent results and capabilities in all the different tools.

The following diagram shows the role that Resource Manager plays during Azure requests:

:::image type="content" source="./media/overview/consistent-management-layer.png" alt-text="Diagram that shows the role of Resource Manager during Azure requests." border="false":::

All capabilities that are available in the Azure portal are also available through PowerShell, the Azure CLI, REST APIs, and client SDKs. When APIs introduce new functionality, this reflects in the portal within 180 days of initial release.

> [!IMPORTANT]
> Resource Manager will stop supporting protocols older than TLS 1.2 on March 1, 2025. For more information, see [Migrating to TLS 1.2 for Azure Resource Manager](tls-support.md).

## Terminology

If you're new to Resource Manager, you might not be familiar the following terms:

* **resource** - A manageable item that's available through Azure. Examples of resources include virtual machines, storage accounts, web apps, databases, and virtual networks. Resource groups, subscriptions, management groups, and tags are also resources.

* **resource group** - A container that holds related resources for an Azure solution. The resource group includes those resources that you want to manage as a group. You decide which resources belong in a resource group based on what makes the most sense for your organization. See [What is a resource group?](#resource-groups).

* **resource provider** - A service that supplies Azure resources. For example, a common resource provider is `Microsoft.Compute`, which supplies the virtual machine resource. `Microsoft.Storage` is another common resource provider. See [Azure resource providers and types](resource-providers-and-types.md).

* **declarative syntax** - Syntax that lets you state, "Here's what I intend to create," without having to write the sequence of programming commands to create it. ARM templates and Bicep files are examples of declarative syntax. In those files, you define the properties for the infrastructure to deploy to Azure.

* **ARM template** - A JavaScript Object Notation (JSON) file that defines one or more resources to deploy to a resource group, subscription, management group, or tenant. Use the template to deploy the resources consistently and repeatedly. See [What are ARM templates?](../templates/overview.md) for an overview of how to deploy templates.

* **Bicep file** - A file for declaratively deploying Azure resources. Bicep is a language that was designed to provide the best authoring experience for infrastructure-as-code solutions in Azure. See [What is Bicep?](../bicep/overview.md) to learn more about Bicep.

* **extension resource** - A resource that adds to another resource's capabilities. For example, a role assignment is an extension resource. You apply a role assignment to any other resource to specify access. See [Extension resources](./extension-resource-types.md).

For more Azure terminology definitions, see [Azure fundamental concepts](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts).

## The benefits of using Resource Manager

With Resource Manager, you can:

* Manage your infrastructure through declarative templates rather than scripts.

* Deploy, manage, and monitor all the resources for your solution as a group, rather than handling these resources individually.

* Redeploy your solution throughout the development lifecycle and have confidence your resources are deployed in a consistent state.

* Define the dependencies between resources so they're deployed in the correct order.

* Apply access control to all services because Azure role-based access control (Azure RBAC) is natively integrated into the management platform.

* Apply tags to resources to logically organize all the resources in your subscription.

* Clarify your organization's billing by viewing costs for a group of resources that share the same tag.

## Understand scope

Azure provides four levels of management scope: [management groups](../../governance/management-groups/overview.md), subscriptions, [resource groups](#resource-groups), and resources. The following diagram visualizes these layers:

:::image type="content" source="./media/overview/scope-levels.png" alt-text="Diagram that illustrates the four levels of scope in Azure: management groups, subscriptions, resource groups, and resources." border="false":::

You apply management settings at any of these levels of scope. The level you select determines how widely the setting is applied. Lower levels inherit settings from higher levels. For example, when you apply a [policy](../../governance/policy/overview.md) to the subscription, the policy is applied to all resource groups and resources in your subscription. When you apply a policy on the resource group, that policy is applied to the resource group and all its resources. However, another resource group doesn't have that policy assignment.

See [What is Microsoft Entra ID?](../../active-directory/fundamentals/active-directory-whatis.md) to learn more about managing identities and access in Azure.

You can deploy templates to tenants, management groups, subscriptions, or resource groups.

## <a name="resource-groups"></a>What is a resource group?

A resource group is a container that you use to manage related resources for an Azure solution. Using a resource group can help you to coordinate changes between resources that are related. For example, you can deploy an update to the resource group and have confidence that the resources are updated in a coordinated operation. Or, when you're finished with the solution, you can delete the resource group and know that all of the resources are deleted.

There are some important considerations when defining your resource group:

* All resources in your resource group should share the same lifecycle. You deploy, update, and delete them together. For example, a server is one resource. If it needs to exist on a different deployment cycle, it should be in another resource group.

* Each resource can exist in only one resource group.

* You can add or remove a resource to a resource group at any time.

* You can move a resource from one resource group to another group. For more information, see [Move Azure resources to new resource group or subscription](move-resource-group-and-subscription.md).

* The resources in a resource group can be located in different regions than the resource group, but we recommend that you use the same location. See [What location should I use for my resource group?](#which-location-should-i-use-for-my-resource-group).

* A resource group can be used to scope access control for administrative actions. You can use Azure [policies](../../governance/policy/overview.md), [roles](../../role-based-access-control/role-assignments-portal.yml), or [resource locks](lock-resources.md) to manage a resource group.

* You can [apply tags](tag-resources.md) to a resource group. The resources in the resource group don't inherit those tags.

* A resource can connect to resources in other resource groups. This scenario is common when the two resources are related but don't share the same lifecycle. For example, you can have a web app that connects to a database in a different resource group.

* When you delete a resource group, all resources in the resource group are also deleted. For information about how Resource Manager orchestrates those deletions, see [Azure Resource Manager resource group and resource deletion](delete-resource-group.md).

* You can deploy up to 800 instances of a resource type in each resource group. Some resource types are [exempt from the 800 instance limit](resources-without-resource-group-limit.md). For more information, see [resource group limits](azure-subscription-service-limits.md#azure-resource-group-limits).

* Some resources can exist outside of a resource group. These resources are deployed to the [subscription](../templates/deploy-to-subscription.md), [management group](../templates/deploy-to-management-group.md), or [tenant](../templates/deploy-to-tenant.md). Only specific resource types are supported at these scopes.

* To create a resource group, use the [Azure portal](manage-resource-groups-portal.md#create-resource-groups), [PowerShell](manage-resource-groups-powershell.md#create-resource-groups), the [Azure CLI](manage-resource-groups-cli.md#create-resource-groups), or an [ARM template](../templates/deploy-to-subscription.md#resource-groups).

## Which location should I use for my resource group?

When you create a resource group, you need to provide a location for that resource group.

You might wonder why a resource group needs a location and why the resource group location matters if resources can have locations outside of a resource group.

The resource group stores metadata about resources. When you specify a location for the resource group, you're also specifying where that metadata is stored. For compliance reasons, you might need to ensure that your data is stored in a particular region.

Routing all [control plane operations](./control-plane-and-data-plane.md) through the resource group's location can help the resource group to remain in a consistent state. When selecting a resource group location, it's recommended that you select a location close to where your control operations originate. Typically, this location is the one closest to you. This routing requirement only applies to control plane operations for the resource group. It doesn't affect requests that are sent to your applications.

If a resource group's region is temporarily unavailable, your resource requests will failover to a secondary region. However, if multiple regions are experiencing an outage or the resource's location is also unavailable, you may still be impacted. To reduce the impact of regional outages, it's recommended that you locate your resources and resource group in the same region. See the [Azure Resource Graph table and resource type reference](../../governance/resource-graph/reference/supported-tables-resources.md#resources) list to view the resources and metadata that Resource Manager manages.

Azure Resource Manager enhances reliability during regional outages, ensuring high availability for both reads and writes with minimal disruption to customers. Service interruptions would only occur in the rare event that both the primary and backup regions of the resource group are affected.

For more information about building reliable applications, see the [Resiliency checklist for specific Azure services](/azure/architecture/checklist/resiliency-per-service).

## Resiliency of Resource Manager

Resource Manager is designed for resiliency and continuous availability. Resource Manager and control plane operations (requests sent to `management.azure.com`) in the REST API:

* Distribute across regions. Resource Manager has a separate instance in each Azure region, meaning that if a Resource Manager instance fails in one region, this doesn't affect the service's availability in another region; the same applies to other Azure services. Although Resource Manager is distributed across regions, some services are regional. This distinction means that while the initial handling of the control plane operation is resilient, the request might be susceptible to regional outages when forwarded to the service.

* Distribute across availability zones (and regions) in locations that have multiple availability zones. This distribution ensures that when a region loses one or more zones, Resource Manager can fail over to another zone or region. It continues to provide control plane capability for the resources.

* Do not depend on one logical datacenter.

* Are not taken down for maintenance activities.

This resiliency applies to services that receive requests through Resource Manager. Azure Key Vault is one service that benefits from this consistency.

## Resolve concurrent operations

Concurrent resource updates can cause unexpected results. When two or more operations try to update the same resource at the same time, Resource Manager detects the conflict, allows only one operation to complete successfully, blocks the other operations, and returns an error. This resolution ensures that your updates are conclusive and reliable; you know the status of your resources and avoid any inconsistency or data loss.  

For example, if you have two requests (A and B) that try to update the same resource at the same time and request A finishes before request B, then request A succeeds and request B fails. Request B returns the 409 error. After getting that error code, you can get the updated status of the resource and determine if you want to send request B again.

## Next steps

* To learn about limits that are applied across Azure services, see [Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md).
* To learn about moving resources, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).
* To learn about tagging resources, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).
* To learn about locking resources, see [Lock your Azure resources to protect your infrastructure](lock-resources.md).
