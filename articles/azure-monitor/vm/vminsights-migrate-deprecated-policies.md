---
title: Migrate from deprecated VM insights policies
description: This article explains how to migrate from deprecated VM insights policies to their replacement policies.
ms.topic: how-to
author: guywi-ms
ms.author: guywild
ms.reviewer: Rahul.Bagaria
ms.date: 07/09/2023

---

# Migrate from deprecated VM insights policies

We're deprecating some VM insights policies and introducing new policies that replace them. If you're using deprecated policies, we recommend you migrate to the new policies as soon as possible.  

This article explains how to migrate from deprecated VM insights policies to their replacement policies.

## Prerequisites

- An existing user-assigned managed identity. 

## Deprecated VM insights policies

These policies are deprecated and will be removed in the future. We recommend you migrate to the replacement policies as soon as possible:

- [[Preview]: Deploy a VMInsights Data Collection Rule and Data Collection Rule Association for Arc Machines in the Resource Group](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7c4214e9-ea57-487a-b38e-310ec09bc21d)
- [[Preview]: Deploy a VMInsights Data Collection Rule and Data Collection Rule Association for all the VMs in the Resource Group](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fa0f27bdc-5b15-4810-b81d-7c4df9df1a37) 
- [[Preview]: Deploy a VMInsights Data Collection Rule and Data Collection Rule Association for all the VMSS in the Resource Group](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fc7f3bf36-b807-4f18-82dc-f480ad713635) 


## Replacement VM insights policies

These policies replace the deprecated policies. 

- [Configure Linux Machines to be associated with a Data Collection Rule or a Data Collection Endpoint](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2ea82cdd-f2e8-4500-af75-67a2e084ca74) 
- [Configure Windows Machines to be associated with a Data Collection Rule or a Data Collection Endpoint](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2feab1f514-22e3-42e3-9a1f-e1dc9199355c)

## Migrate from deprecated VM insights policies to replacement policies


1. Configure a VM insights data collection rule using an ARM template, as described in [Quickstart: Create and deploy ARM templates by using the Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

    Use one of these existing templates:  
    - DCR: ama-vmi-default-perf-dcr under OnbordingTemplates/DeployDcr/PerfOnlyDcr/DeployDcrTemplate.json that only collect VMI performance metrics
    - DCR: ama-vmi-default-perfAndda-dcr under OnbordingTemplates/DeployDcr/PerfAndMapDcr/DeployDcrTemplate.json that only collect VMI performance metrics and Service Map data from Dependency Agent. 

    Note the resource ID of the data collection rule.

1. Assign a [replacement policy](#replacement-vm-insights-policies): 

    1. Set scope to the resource group that contains the VMs you want to monitor.
    1. Set the **Data Collection Rule Resource Id or Data Collection Endpoint Resource Id** parameter to the resource ID of the data collection rule you created in the previous step.
    1. On the **Remediation** tab, set **Type of managed identity** to **User Assigned Managed Identity** and select an existing user assigned identity. 

## Next steps

Learn how to:
- [View VM insights Map](vminsights-maps.md) to see application dependencies. 
- [View Azure VM performance](vminsights-performance.md) to identify bottlenecks and overall utilization of your VM's performance.
