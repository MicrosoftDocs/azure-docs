---
title: What is Azure Resource Manager?
description: This overview describes how to use Azure Resource Manager to deploy, manage, and control access to Azure resources.
ms.topic: overview
ms.date: 08/04/2026
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

* **resource group** - A container that holds related resources for an Azure solution. The resource group includes those resources that you want to manage as a group. You decide which resources belong in a resource group based on what makes the most sense for your organization. See [What is a resource group?](#resource-groups)

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

* The resources in a resource group can be located in different regions than the resource group, but we recommend that you use the same location. See [What location should I use for my resource group?](#which-location-should-i-use-for-my-resource-group)

* A resource group can be used to scope access control for administrative actions. You can use Azure [policies](../../governance/policy/overview.md), [roles](/azure/role-based-access-control/role-assignments-portal), or [resource locks](lock-resources.md) to manage a resource group.

* You can [apply tags](tag-resources.md) to a resource group. The resources in the resource group don't inherit those tags.

* A resource can connect to resources in other resource groups. This scenario is common when the two resources are related but don't share the same lifecycle. For example, you can have a web app that connects to a database in a different resource group.

* When you delete a resource group, all resources in the resource group are also deleted. For information about how Resource Manager orchestrates those deletions, see [Azure Resource Manager resource group and resource deletion](delete-resource-group.md).

* You can deploy up to 800 instances of a resource type in each resource group. Some resource types are [exempt from the 800 instance limit](resources-without-resource-group-limit.md). For more information, see [resource group limits](azure-subscription-service-limits.md#azure-resource-group-limits).

* Some resources can exist outside of a resource group. These resources are deployed to the [subscription](../templates/deploy-to-subscription.md), [management group](../templates/deploy-to-management-group.md), or [tenant](../templates/deploy-to-tenant.md). Only specific resource types are supported at these scopes.

* To create a resource group, use the [Azure portal](manage-resource-groups-portal.md#create-resource-groups), [PowerShell](manage-resource-groups-powershell.md#create-resource-groups), the [Azure CLI](manage-resource-groups-cli.md#create-resource-groups), or an [ARM template](../templates/deploy-to-subscription.md#resource-groups).

## Which location should I use for my resource group?

When you create a resource group, you need to provide a location for that resource group. You might wonder why a resource group needs a location and why the resource group location matters if resources can have locations outside of a resource group.

The resource group stores metadata about resources. When you specify a location for the resource group, you're also specifying where that metadata is stored. For compliance reasons, you might need to ensure that your data is stored in a particular region.

Routing [control plane operations](./control-plane-and-data-plane.md) that target resources in the resource group through the resource group's location helps the resource group remain in a consistent state. When you select a resource group location, select a location close to where your control operations originate - typically the location closest to you. This routing requirement applies only to ARM control plane operations (such as creating, updating, or deleting resources via the Azure Resource Manager API). It doesn't affect data plane requests sent directly to your resource endpoints, such as HTTP requests to a web app or read/write operations to a storage account.

Most Resource Manager regions have a designated backup region. If a resource group's region has a backup region and is temporarily unavailable, Resource Manager automatically reroutes ARM control plane requests to the backup region. This failover is transparent - you use the same API endpoints without any changes. A backup region can serve more than one primary region, and Resource Manager backup assignments might differ from Azure region pairs.

Resource Manager uses availability zones for resilience to zone failures in the small number of regions that don't have a suitable backup region, but doesn't provide cross-region failover. During a region-wide failure, affected management operations might remain unavailable until the region recovers.

Resource Manager failover covers only ARM control plane operations routed through the resource group. It doesn't cover data plane access to the resources themselves. Data plane access to resources deployed into unavailable regions is affected regardless of where its resource group is located. To reduce the impact of regional outages, locate your resources and resource group in the same region. See the [Azure Resource Graph table and resource type reference](../../governance/resource-graph/reference/supported-tables-resources.md#resources) list to view the resources and metadata that Resource Manager manages.

For more information about how Resource Manager achieves resilience across regions and availability zones, see [Reliability in Azure Resource Manager](/azure/reliability/reliability-resource-manager).

For guidance on building reliable solutions in Azure, see the [Azure service reliability guides](/azure/reliability/overview-reliability-guidance).

## Resiliency of Resource Manager

Resource Manager is designed for resiliency and availability. Resource Manager and control plane operations (requests sent to `management.azure.com`) in the REST API:

* Distribute across regions. Most Resource Manager regions have a designated backup region. If a resource group's region is unavailable, Resource Manager can reroute control plane requests to its backup region. A small number of regions don't have a cross-region backup.

* Distribute across availability zones in locations that have multiple availability zones. If one availability zone becomes unavailable, Resource Manager can route control plane requests through infrastructure in another availability zone.

* Do not depend on one logical datacenter.

* Are not taken down for maintenance activities.

This resiliency applies to the Resource Manager portion of a control plane operation. After Resource Manager forwards a request, the operation also depends on the target resource provider and resource.


Using the global endpoint `management.azure.com` is recommended for Azure Resource Manager routing because it enables DNS-based traffic distribution, automatic failover, and optimal routing to the closest or healthiest region, which improves latency and reliability for users worldwide.
Global endpoints typically result in faster response times, as users are directed to the nearest available region, reducing network hops and delays.

For more information, see [Reliability in Azure Resource Manager](/azure/reliability/reliability-resource-manager).

## Resolve concurrent operations

Concurrent resource updates can cause unexpected results. When two or more operations try to update the same resource at the same time, Resource Manager detects the conflict, allows only one operation to complete successfully, blocks the other operations, and returns an error. This resolution ensures that your updates are conclusive and reliable. You know the status of your resources and avoid any inconsistency or data loss.

For example, if you have two requests (A and B) that try to update the same resource at the same time and request A finishes before request B, then request A succeeds and request B fails. Request B returns the 409 error. After getting that error code, you can get the updated status of the resource and determine if you want to send request B again.

## Next steps

* To learn about limits that are applied across Azure services, see [Azure subscription and service limits, quotas, and constraints](azure-subscription-service-limits.md).
* To learn about moving resources, see [Move resources to new resource group or subscription](move-resource-group-and-subscription.md).
* To learn about tagging resources, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).
* To learn about locking resources, see [Lock your Azure resources to protect your infrastructure](lock-resources.md).
