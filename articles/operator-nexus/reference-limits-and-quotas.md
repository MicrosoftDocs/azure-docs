---
title: Azure Operator Nexus - Limits and Quotas
description: Limits and quotas that apply to Azure Operator Nexus.
author: mukeshdua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 06/28/2023
ms.custom: template-reference
---

# Azure Operator Nexus limits and quotas

This document provides an overview of the resource limits that apply to the components used in the Nexus solution, encompassing the resources created within Azure cloud and in on-premises instance. It outlines the specific limitations and restrictions that operators should be aware of when deploying and managing the Nexus instance across these environments.

Understanding these resource limits is crucial for optimizing resource utilization and ensuring the smooth operation of the Nexus solution. It's also essential to be aware of any restrictions or constraints that may apply to the creation of these resources to ensure compliance and avoid any potential issues or disruptions.

## Azure-specific requirements

In addition to the hardware and software resources available in the customer's on-premises instance, the Azure Operator Nexus also incorporates essential components that must be created within the Azure cloud environment. These components, such as the Network Fabric Controller and Cluster Manager, are integral to the overall functionality and management of the Azure Nexus Operator on-premises instance. These controllers are built utilizing a diverse range of Azure services. Prior to creating these resources in the Azure cloud environment, Operators should thoroughly review and confirm the specific limits and quotas that are in effect. It's crucial to ensure compliance with these limitations to enable successful deployment and operation of the Azure Operator Nexus solution.

Some of these Azure services have adjustable limits. When a service doesn't have adjustable limits, the default and the maximum limits are the same. The limit can be raised above the default limit but not above the maximum limit. If you want to raise the limit or quota above the default limit, open an online customer support request.

The terms soft limit and hard limit often are used informally to describe the current, adjustable limit (soft limit) and the maximum limit (hard limit).

Some of these limits also apply at Azure region level.

> [!NOTE]
> It’s highly recommended that Operators create and use a separate Azure subscription for Azure Nexus Operator and not mix it up with other Azure use cases under the same subscription.

### Network Fabric

The creation of the Network Fabric related resources is subject to the following resource limits:

| Resource Type               | Notes |
| --------------------------- | -------------------------|
| Network Fabric Controllers  | Today, its creation depends on underlying Azure components as mentioned in the supporting table under section "Other Azure Resources" |
| Network Fabrics             | Up to 20 Network Fabric resources per Network Fabric Controller [To be updated] |
| Network Devices             | Up to BOM-specified Network devices per Network Fabric |
| Network Racks               | Up to BOM-specified racks per Network Fabric |
| Layer 2 Isolation domains   | 3500 isolation domains per Nexus instance |
| Layer 3 Isolation domains   | 200 isolation domains per Nexus instance |
| Route policies              | 400 route policies per Nexus instance |
| Isolation domain MTU | 1500 - 9200 |

> [!NOTE]
> * The number of Nexus instances a pair of NFC + CM can handle has been set to 20 based on some theoretical study for ExpressRoute. These numbers will be refined after more testing. 
> * Some of these limits are yet to be introduced and are not applied by default today.

### Network Cloud
The creation of the Network Cloud specific resources is subject to the following resource limits:

| Resource Type               | Notes |
| --------------------------- | -------------------------|
| Cluster Manager             |	1:1 mapping with Network Fabric Controller |
| Cluster                     |	Up to 20 Nexus Cluster instances per Cluster Manager (within same region) |
| Racks                       |	Up to BOM-specified Compute Racks per Nexus Cluster |
| Bare Metal Machines         |	Up to BOM-specified BareMetal machines per Rack |
| Storage Appliances          |	Up to BOM-specified Storage appliances per Nexus Cluster instance |
| NKS Cluster                |	Depends on selection of VM flavor and number of nodes per NKS cluster |
| Layer 2 Networks            | 3500 per Nexus instance |
| Layer 3 Networks            | 200 per Nexus instance |
| Trunked Networks            | 3500 per Nexus instance |
| Cloud Service Networks      |	100 per Nexus instance |

> [!NOTE]
> * The number of Nexus instances a pair of NFC + CM can handle has been set to 20 based on some theoretical study for ExpressRoute. These numbers will be refined post GA after some further testing. 
> * Some of these limits are yet to be introduced and are not applied by default today.

### Other Azure resources
There are several Azure resources that are required to build up Network Fabric Controllers and Cluster Manager. The table here outlines the Azure services that Operators must ensure that they have adequate capacity available for creation for each Network Fabric Controller and Cluster Manager pair.

| Resource Type	              | # of vCPUs |
| --------------------------- | -------------------------|
| Virtual Machine             |	32 (D4_v2), 120 (DS4_v2), 4 (D2s_v3) |

> [!NOTE]
> The number of vCPUs and the family SKUs required are subject to change.

The table here briefly mentions other Azure resources that are necessary. However, by utilizing a dedicated subscription for Azure Operator Nexus, operators can alleviate concerns about their quotas.

| Resource Type                | Notes |
| ---------------------------- | -------------------------|
| Subscription	               | [Subscription limits](../azure-resource-manager/management/azure-subscription-service-limits.md) |
| Resource Group               | [Resource Group Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#resource-group-limits). There's a max limit for RG per subscription. Operators need to make appropriate consideration for how they want to manage Resource Groups for NKS clusters vs Virtual machines per Nexus instance. |
| VM Flavors	               | Customer generally has VM flavor quota in each region within subscription. You need to ensure that you can still create VMs per the requirements. |
| AKS Clusters	               | [AKS Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-kubernetes-service-limits) |
| Virtual Networks	           | [Virtual Network Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits) |
| Managed Identity             | [Managed Identity Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#managed-identity-limits) |
| ExpressRoute                 | [ExpressRoute Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#expressroute-limits) |
| Virtual Network Gateway	   | [Virtual Network Gateway Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits) |
| Azure Key Vault	           | [Key Vault Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#key-vault-limits) |
| Storage Account	           | [Storage Account Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#standard-storage-account-limits) |
| Load Balancers (Standard)	   | [Load Balancer Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#load-balancer) |
| Public IP Address (Standard) | [Public IP Address Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#publicip-address) |
| Azure Monitor Metrics	       | [Azure Monitor Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-monitor-limits) |
| Log Analytics Workspace	   | [Log Analytics Workspace Limits](../azure-monitor/service-limits.md#log-analytics-workspaces) |
