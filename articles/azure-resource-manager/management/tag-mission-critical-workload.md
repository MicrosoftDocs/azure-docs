---
title: Mission Critical Workload Labeling
description: Understand how to label mission critical workloads in Azure for Microsoft workload assessments
ms.topic: conceptual
ms.date: 03/20/2025
---
# Mission Critical Workload Labeling

Azure provides a robust, scalable cloud platform with various tools and services to help you manage and optimize your resources. One essential practice to ensure the efficiency and resiliency of your workload is tagging resources appropriately. This document outlines how to tag resources in an Azure tenant for identifying mission-critical workloads and determining potential resiliency improvements. Tagging your resources streamlines the onboarding of your workload definition for Microsoft assessments, providing a more concisely targeted review.

## Understanding Azure tags

For an introduction to tagging of Azure resources and to learn about requirements and limitations refer to the following article.

[Use tags to organize your Azure resources and management hierarchy - Azure Resource Manager | Microsoft Learn](/azure/azure-resource-manager/management/tag-resources)

## Why identify mission critical workloads?

Identifying mission critical related resources brings numerous benefits including resource management, cost management and optimization, security, automation and workload optimization. By tagging these resources, you can group them as part of a mission-critical workload. These tags help in accurately identifying and managing these essential workloads. You can read more about tagging usage here [Resource naming and tagging decision guide - Cloud Adoption Framework | Microsoft Learn](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming-and-tagging-decision-guide).

This article aligns with workload optimization, where tagging can help inform of opportunities to improve resiliency and further enhance your Service Level Objectives.

*This documentation supports a Microsoft assessment of your environment using the tagging approach described. Your Microsoft contact reviews this tagging approach with you at the beginning of the assessment. If you don't have an engagement with Microsoft, you can still follow the guidance to realize the benefits outlined earlier.*

## Mission critical predefined tags

To enable use by Microsoft in a workload assessment, the tags used for mission critical workloads must use the following tag name and adhere to the value format.

**Important:**

- Tag values must **NOT** contain numeric or non-English characters.
- Tag values must conform to this RegEx pattern: ^[A-Za-z]+-[A-Za-z]+

  | **Tag Name** | **Value Type** | **Purpose** | **Value Format** |
  |---|---|---|---|
  | **Azure.MissionCriticalWorkload** | String | Workload | DeptName-WorkloadName |
  | **Azure.MissionCriticalWorkload** | String | SharedServices | SharedServices-Service |

### Examples

#### Mission critical workload #1

| **Workload Component** | **Tag Name** | **Tag Value** |
|---|---|---|
| **Workload A** | Azure.MissionCriticalWorkload | Finance-Workload |
| **Shared Services** | Azure.MissionCriticalWorkload | SharedServices-ExpressRoute |

#### Mission critical workload #2

| **Workload Component** | **Tag Name** | **Tag Value** |
|---|---|---|
| **Workload B** | Azure.MissionCriticalWorkload | HR-Workload |
| **Shared Services** | Azure.MissionCriticalWorkload | SharedServices-Firewall |
| **Shared Services** | Azure.MissionCriticalWorkload | SharedServices-ExpressRoute |

## Identify your mission critical workload resources

The term workload refers to a collection of application resources that support a common business goal or the execution of a common business process, with multiple services, such as APIs and data stores, working together to deliver specific end-to-end functionality.

Mission critical workload resources are often spread across multiple resource groups and subscriptions. Regardless of the resource location, each resource within the mission critical workload should be included in the workload definition and tagged appropriately.

In a scenario where a mission critical workload depends on a service that is shared across multiple workloads, such as an ExpressRoute gateway or an Azure Firewall, the shared resources should also be included in the workload definition and tagged appropriately. See the example in the previous section for tag values to be used on shared services.

For further insights into defining a workload, refer to the following article.

[Azure Well-Architected Framework workloads - Microsoft Azure Well-Architected Framework | Microsoft Learn](/azure/well-architected/workloads)

## How to apply Azure tags

Tagging of mission critical workloads requires that tags be applied to each of the individual Azure resources that make up the workload. Tags can be applied to resources in the Azure portal, with Azure Policy, or via automation tools. Review the following guidance to determine the approach that works best for your organization.

- Azure portal: [Tag resources, resource groups, and subscriptions with Azure portal - Azure Resource Manager | Microsoft Learn](/azure/azure-resource-manager/management/tag-resources-portal)
- Azure Policy: [Policy definitions for tagging resources - Azure Resource Manager | Microsoft Learn](/azure/azure-resource-manager/management/tag-policies)
- Azure PowerShell: [Tag resources, resource groups, and subscriptions with Azure PowerShell - Azure Resource Manager | Microsoft Learn](/azure/azure-resource-manager/management/tag-resources-powershell)
- Azure CLI: [Tag resources, resource groups, and subscriptions with Azure CLI - Azure Resource Manager | Microsoft Learn](/azure/azure-resource-manager/management/tag-resources-cli)
- Bicep: [Tag resources, resource groups, and subscriptions with Bicep - Azure Resource Manager | Microsoft Learn](/azure/azure-resource-manager/management/tag-resources-bicep)
- Terraform: [Microsoft.Resources/tags - Bicep, ARM template & Terraform AzAPI reference | Microsoft Learn](/azure/templates/microsoft.resources/tags)
