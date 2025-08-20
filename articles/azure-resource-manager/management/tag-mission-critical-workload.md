---
title: Label mission-critical workloads 
description: Learn how to label mission-critical workloads in Azure to assess Microsoft workloads.
ms.topic: conceptual
ms.date: 04/14/2025
---

# Label mission-critical workloads

Azure provides a robust, scalable cloud platform with various tools and services to help you manage and optimize your resources. This document outlines how to tag resources in an Azure tenant to identify mission-critical workloads and determine potential resiliency improvements. Tagging your resources streamlines how your workload definitions are onboarded for Microsoft assessments, providing a more concisely targeted review.

## Understand Azure tags

For an introduction about tagging Azure resources and to learn about requirements and limitations, refer to [Use tags to organize your Azure resources and management hierarchy](/azure/azure-resource-manager/management/tag-resources).

## Why identify mission-critical workloads?

The term _workload_ refers to a collection of application resources that support a common business goal or the execution of a common business process with multiple services, such as APIs and data stores, that work together to deliver specific end-to-end functionality.

Mission-critical workload resources are often spread across multiple resource groups and subscriptions. Regardless of the resource location, each resource within a mission-critical workload should be included in the workload definition and tagged appropriately.

Identifying related mission-critical resources has benefits that include resource management, cost management and optimization, security, automation, and workload optimization. By tagging resources, you to group them into a mission-critical workload where tags accurately identify and manage these essential workloads.

In a scenario where a mission-critical workload depends on a service that's shared across multiple workloads, such as an Azure ExpressRoute gateway or an Azure Firewall, the shared resources should also be included in the workload definition and tagged appropriately. See the examples in the following section for how to tag values on shared services.

This article aligns with workload optimization, and tagging can identify opportunities to improve resiliency and further enhance your Service Level Objectives.

*This documentation recommends the tagging approach described to support a Microsoft assessment of your environment. Your Microsoft contact reviews this tagging approach with you at the beginning of the assessment. If you don't have an engagement with Microsoft, you can still follow the guidance to realize the benefits outlined earlier.*

## Mission-critical workload tags

To enable use by Microsoft in a workload assessment, existing tags that accurately identify the workload can be used. If the workload doesn't already have tags, refer to the following examples to guide the creation of new tags.

  | **Tag Name** | **Value Type** | **Purpose** | **Value Format** |
  |---|---|---|---|
  | **Az.MissionCriticalWorkload** | String | Workload | DeptName-WorkloadName |
  | **Az.MissionCriticalWorkload** | String | SharedServices | SharedServices-Service |

### Examples

#### Mission-critical workload #1

| **Workload Component** | **Tag Name** | **Tag Value** |
|---|---|---|
| **Workload A** | Az.MissionCriticalWorkload | Finance-Workload |
| **Shared Services** | Az.MissionCriticalWorkload | SharedServices-ExpressRoute |

#### Mission-critical workload #2

| **Workload Component** | **Tag Name** | **Tag Value** |
|---|---|---|
| **Workload B** | Az.MissionCriticalWorkload | HR-Workload |
| **Shared Services** | Az.MissionCriticalWorkload | SharedServices-Firewall |
| **Shared Services** | Az.MissionCriticalWorkload | SharedServices-ExpressRoute |

## How to apply Azure tags

Tagging mission-critical workloads requires that tags be applied to each Azure resource that makes up a workload. Tags can be applied to resources in the Azure portal, with Azure Policy, or via automation tools. Review the following guidance to determine the approach that works best for your organization:

- Azure portal: [Apply tags with Azure portal](/azure/azure-resource-manager/management/tag-resources-portal)
- Azure Policy: [Assign policy definitions for tag compliance](/azure/azure-resource-manager/management/tag-policies)
- Azure PowerShell: [Apply tags with Azure PowerShell](/azure/azure-resource-manager/management/tag-resources-powershell)
- Azure CLI: [Apply tags with Azure CLI](/azure/azure-resource-manager/management/tag-resources-cli)
- Bicep: [Apply tags with Bicep](/azure/azure-resource-manager/management/tag-resources-bicep)
- Terraform: [Microsoft.Resources/tags](/azure/templates/microsoft.resources/tags?pivots=deployment-language-terraform)

## Next steps

- For more information about defining workloads, see [Azure Well-Architected Framework workloads](/azure/well-architected/workloads).
- To learn more about using tags, see the Azure Cloud Adoption Framework [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming-and-tagging-decision-guide).
