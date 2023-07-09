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

We've recently deprecated some VM insights policies and introduced new policies that replace them. If you are using the deprecated policies, we recommend you migrate to the new policies as soon as possible.  

This article explains how to migrate from deprecated VM insights policies to their replacement policies.

## Prerequisites

- An existing user-assigned managed identity. 

## Deprecated VM insights policies

- [Preview]: Deploy a VMInsights Data Collection Rule and Data Collection Rule Association for Arc Machines in the Resource Group
- Deploy a VMInsights Data Collection Rule and Data Collection Rule Association for all the VMs in the Resource Group 
- [Preview]: Deploy a VMInsights Data Collection Rule and Data Collection Rule Association for all the VMSS in the Resource Group 


## Replacement VM insights policies

- Configure Linux Machines to be associated with a Data Collection Rule or a Data Collection Endpoint 
- Configure Windows Machines to be associated with a Data Collection Rule or a Data Collection Endpoint

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
