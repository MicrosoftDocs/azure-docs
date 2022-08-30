---
title: Planning for an Azure Storage Mover deployment
description: Considerations and best-practices for achieving your migration goals with the Azure Storage Mover service
services: storage-mover
author: stevenmatthew
ms.service: storage-mover
ms.author: shaas
ms.topic: conceptual
ms.date: 08/29/2022
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: Finish minimal RBAC permissions table

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->


# Plan a successful Azure Storage Mover deployment
<!-- Lead with a light intro that describes what the article covers. Answer the fundamental "why would I want to know this information?" question. Keep it short. -->

Deploying Azure Storage Mover in one of your Azure subscriptions is the first step in realizing your migration goals. Azure Storage Mover can help you with the migration of your files and folders into Azure Storage. This article discusses the important decisions and best practices for a Storage Mover deployment.

<!-- 
3. H2s

##Docs Required## 

Give each H2 a heading that sets expectations for the content that follows. Follow the H2 headings with a sentence about how the section contributes to the whole. 

Prescriptively direct the customer through the procedure end-to-end. Don't link to other content (until 'next steps'), but include whatever the customer needs to complete the scenario in the article. -->

## Make sure the service works for your scenario

Azure Storage Mover aspires to work for a wide range of migration scenarios. However, the service is new, currently in public preview, and supports limited migration scenarios. Check out the [supported sources and targets section](service-overview.md#supported-sources-and-targets) in the [Azure Storage Mover overview article](service-overview.md) to make sure the service works for you.

## Deployment basics

A deployment of Azure Storage Mover consists out of cloud service components and one or more migration agents you run in your environment, close to the source storage.

The cloud service component is represented by a storage mover resource, deployed in your choice of Azure subscription and resource group. Identify a subscription in the same Azure Active Directory (AAD) tenant as the Azure storage accounts you want to migrate into.

> [!NOTE]
> An Azure storage mover resource can orchestrate migrations into Azure Storage in other subscriptions, as long as they are governed by the same Azure Active Directory tenant.

## Select an Azure region for your deployment

When you deploy an Azure storage mover resource, you'll also need to decide on a region. The region you select only determines where control messages are sent and metadata about your migration is stored. The data that is migrated, is sent directly from the agent to the target in Azure Storage. Your files never travel through the Storage Mover service or the resource in that region. That means the proximity between source, agent, and target storage is more important for migration performance than the location of your storage mover resource.

:::image type="content" source="media/resource-hierarchy/data-vs-management-path.png" alt-text="Illustrating the previous paragraph by showing two arrows. The first arrow for data traveling to a storage account from the source/agent and a second arrow for only the management/control info to the storage mover resource/service." lightbox="media/resource-hierarchy/data-vs-management-path-large.png":::

In most cases, deploying only a single storage mover resource is the best option, even when you need to migrate files located in other countries. You'll register one or more migration agents to a storage mover resource - and an agent can only be used for migrations by the storage mover it is registered with. The agents themselves should be located close to the source storage, even if that means registering  agents deployed in other countries to a storage mover resource located across the globe.

Only deploy multiple storage mover resources if you have distinct sets of migration agents. Having separate storage mover resources and agents allows you to keep permissions separate for the admins managing their part of the source or target storage.

Deploying a Storage Mover agent as an Azure VM has not been tested and is currently not supported.

## Getting your subscription ready

When you've decided on an Azure subscription and resource group for your storage mover resource, you'll need to prepare a few things depending on how you deploy and which actions you or another admin will perform.

### Resource provider namespaces

Before a service is used for the very first time in an Azure subscription, it's resource provider namespace must be registered once with the chosen subscription. Azure Storage Mover has the same requirement. A subscription *Owner* or *Contributor* can perform this action. Performing this registration action before the actual storage mover resource deployment enables admins with less access to deploy and use the Storage Mover service and the resources it depends on. 

> [!IMPORTANT]
> The subscription must be registered with the resource provider namespaces *Microsoft.StorageMover* and *Microsoft.HybridCompute*.

Register a resource provider:

- [via the Azure portal](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal)
- [via Azure PowerShell](../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell)
- [via Azure CLI](../azure-resource-manager/management/resource-providers-and-types.md#azure-cli)

> [!TIP]
> When you deploy a storage mover resource as a subscription *Owner* or *Contributor* through the Azure portal, your subscription is automatically registered with both of these resource provider namespaces. You'll only have to perform the registration manually when using Azure PowerShell or CLI.

Once a subscription is enabled for both of these resource provider namespaces, it will remain enabled until manually unregistered. You can even delete the last storage mover resource and your subscription still remains enabled. Subsequent storage mover resource deployments then require significantly reduced permissions from an admin. The following section contains a breakdown of different management scenarios and their minimally required permissions.

## Permissions

Azure Storage Mover requires special care for the permissions an admin needs for various management scenarios. The service exclusively uses [Role Based Access Control (RBAC)](../role-based-access-control/overview.md) for management actions (control plane) and for target storage access (data plane).




<!-- FINISH TABLE: Permissions not yet tested - UNCONFIRMED -->

|Scenario |Minimal RBAC role assignments needed                                             |
|:--------|--------------------------------------------------------------------------------:|
|Register a resource provider namespace with a subscription|	Subscription: `Contributor`	|
|Deploy a storage mover resource </br>*([Both RP namespaces already registered](#resource-provider-namespaces))*|	Subscription: `Reader` </br>Resource group: `Contributor` |
|Register an agent </br>*([Both RP namespaces already registered](#resource-provider-namespaces))*| Subscription: `Reader` </br>Resource group: `Contributor` </br>Storage mover: `Owner`	|
|Start a migration </br>*(first time this agent is used for this target)* | Subscription: `Reader` </br>Resource group: `Contributor` </br>Storage mover: `Contributor` </br>Target storage account: `Owner`	|
|Re-run a migration </br> *(second + n time this agent is used for this target)*| Subscription: `Reader` </br>Resource group: `Contributor` </br>Target storage mover: `Contributor` </br>Storage account: *none*	|




If you want to learn more about how the agent gets access to migrate the data, review the [agent authentication and authorization](agent-register.md#authentication-and-authorization) section.

<!-- 
4. Next steps
##Docs Required##

We must provide at least one next step, but should provide no more than three. This should be relevant to the learning path and provide context so the customer can determine why they would click the link.-->

## Next steps
<!-- Add a context sentence for the following links -->
These articles can help you become more familiar with the Storage Mover service.
- [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Deploying a Storage Mover resource](resource-create.md)
- [Deploying a Storage Mover agent](agent-deploy.md)