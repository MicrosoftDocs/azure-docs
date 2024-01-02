---
title: Planning for an Azure Storage Mover deployment
description: Considerations and best-practices for achieving your migration goals with the Azure Storage Mover service
services: storage-mover
author: stevenmatthew
ms.service: azure-storage-mover
ms.author: shaas
ms.topic: conceptual
ms.date: 03/27/2023
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed
EDIT PASS: not started

!########################################################
-->

# Plan a successful Azure Storage Mover deployment

Deploying Azure Storage Mover in one of your Azure subscriptions is the first step in realizing your migration goals. Azure Storage Mover can help you migrate your files and folders into Azure Storage. This article discusses the important decisions and best practices for a Storage Mover deployment.

## Make sure the service works for your scenario

Azure Storage Mover aspires to work for a wide range of migration scenarios. However, the service is relatively new and therefore presently supports a limited number of migration scenarios. Ensure that the service works for your specific scenario by consulting the [supported sources and targets section](service-overview.md#supported-sources-and-targets) in the [Azure Storage Mover overview article](service-overview.md).

## Deployment basics

A deployment of Azure Storage Mover consists out of cloud service components and one or more migration agents you run in your environment, close to the source storage.

A storage mover resource comprises the cloud service component. This resource is deployed within your choice of Azure subscription and resource group. Identify a subscription in the same Microsoft Entra tenant as the Azure storage accounts you want to migrate into.

> [!NOTE]
> An Azure storage mover resource can orchestrate migrations into Azure Storage in other subscriptions, as long as they are governed by the same Microsoft Entra tenant.

## Select an Azure region for your deployment

When you deploy an Azure storage mover resource, you also need to choose a region. The region you select only determines where control messages are sent and metadata about your migration is stored. The data that is migrated, is sent directly from the agent to the target in Azure Storage. Your files never travel through the Storage Mover service or the resource in that region. That means the proximity between source, agent, and target storage is more important for migration performance than the location of your storage mover resource.

:::image type="content" source="media/across-articles/data-vs-management-path.png" alt-text="A diagram illustrating a migration's path by showing two arrows. The first arrow represents data traveling to a storage account from the source and agent, and a second arrow represents the management and control info to the storage mover resource and service." lightbox="media/across-articles/data-vs-management-path-large.png":::

In most cases, deploying only a single storage mover resource is the best option, even when you need to migrate files located in other countries/regions. One or more migration agents are registered to a storage mover resource. An agent can only be used by the storage mover to which it's registered. The agents themselves should be located close to the source storage, even if that means registering  agents deployed in other countries/regions to a storage mover resource located across the globe.

Only deploy multiple storage mover resources if you have distinct sets of migration agents. Having separate storage mover resources and agents allows you to keep permissions separate for the admins managing their part of the source or target storage.

Deploying a Storage Mover agent as an Azure VM hasn't been tested and is currently not supported.

## Getting your subscription ready

Your subscription must be in the same Microsoft Entra tenant as the target Azure storage accounts you want to migrate into. When you've decided on an Azure subscription and resource group for your storage mover resource, you need to prepare a few things depending on how you deploy and which actions you or another admin perform.

### Resource provider namespaces

Before a service is used for the first time in an Azure subscription, its resource provider namespace must be registered once with the chosen subscription. Azure Storage Mover has the same requirement. A subscription *Owner* or *Contributor* can perform this action. Performing this registration action before the actual storage mover resource deployment enables admins with less access to deploy and use the Storage Mover service and the resources it depends on.

> [!IMPORTANT]
> The subscription must be registered with the resource provider namespaces *Microsoft.StorageMover* and *Microsoft.HybridCompute*.

Register a resource provider:

- [via the Azure portal](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal)
- [via Azure PowerShell](../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell)
- [via Azure CLI](../azure-resource-manager/management/resource-providers-and-types.md#azure-cli)

> [!TIP]
> When you deploy a storage mover resource as a subscription *Owner* or *Contributor* through the Azure portal, your subscription is automatically registered with both of these resource provider namespaces. You'll only have to perform the registration manually when using Azure PowerShell or CLI.

Once a subscription is enabled for both of these resource provider namespaces, it remains enabled until manually unregistered. You can even delete the last storage mover resource and your subscription still remains enabled. Subsequent storage mover resource deployments then require reduced permissions from an admin. The following section contains a breakdown of different management scenarios and their required permissions.

## Permissions

Azure Storage Mover requires special care for the permissions an admin needs for various management scenarios. The service exclusively uses [Role Based Access Control (RBAC)](../role-based-access-control/overview.md) for management actions (control plane) and for target storage access (data plane).

|Scenario |Minimal RBAC role assignments needed                                             |
|:--------|--------------------------------------------------------------------------------:|
|Register a resource provider namespace with a subscription|	Subscription: `Contributor`	|
|Deploy a storage mover resource <br />*([Both RP namespaces already registered](#resource-provider-namespaces))*|	Subscription: `Reader` <br />Resource group: `Contributor` |
|Register an agent <br />*([Both RP namespaces already registered](#resource-provider-namespaces))*| Subscription: `Reader` <br />Resource group: `Contributor` <br />Storage mover: `Contributor`	|
|Start a migration <br />*(first time this agent is used for this target)* | Subscription: `Reader` <br />Resource group: `Contributor` <br />Storage mover: `Contributor` <br />Target storage account: `Owner`	|
|Rerun a migration <br /> *(second + n time this agent is used for this target)*| Subscription: `Reader` <br />Resource group: `Contributor` <br />Target storage mover: `Contributor` <br />Target storage account: *none*	|

If you want to learn more about how the agent gets access to migrate the data, review the [agent authentication and authorization](agent-register.md#authentication-and-authorization) section in the [agent registration article](agent-register.md).

## Next steps
<!-- Add a context sentence for the following links -->
These articles can help you become more familiar with the Storage Mover service.

- [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Deploying a Storage Mover resource](storage-mover-create.md)
- [Deploying a Storage Mover agent](agent-deploy.md)
