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

We're deprecating the VM insights DCR deployment policies and replacing them with new policies because of a race condition issue. The deprecated policies will continue to work on existing assignments, but will no longer be available for new assignments. If you're using deprecated policies, we recommend you migrate to the new policies as soon as possible. 

This article explains how to migrate from deprecated VM insights policies to their replacement policies.

## Prerequisites

- An existing user-assigned managed identity. 

## Deprecated VM insights policies

These policies are deprecated and will be removed in 2026. We recommend you migrate to the replacement policies as soon as possible:

- [[Preview]: Deploy a VMInsights Data Collection Rule and Data Collection Rule Association for Arc Machines in the Resource Group](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7c4214e9-ea57-487a-b38e-310ec09bc21d)
- [[Preview]: Deploy a VMInsights Data Collection Rule and Data Collection Rule Association for all the VMs in the Resource Group](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fa0f27bdc-5b15-4810-b81d-7c4df9df1a37) 
- [[Preview]: Deploy a VMInsights Data Collection Rule and Data Collection Rule Association for all the virtual machine scale sets in the Resource Group](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fc7f3bf36-b807-4f18-82dc-f480ad713635) 


## New VM insights policies

These policies replace the deprecated policies: 

- [Configure Linux Machines to be associated with a Data Collection Rule or a Data Collection Endpoint](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2ea82cdd-f2e8-4500-af75-67a2e084ca74) 
- [Configure Windows Machines to be associated with a Data Collection Rule or a Data Collection Endpoint](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2feab1f514-22e3-42e3-9a1f-e1dc9199355c)

## Migrate from deprecated VM insights policies to replacement policies

1. [Download the Azure Monitor Agent-based VM insights data collection rule templates](https://github.com/Azure/AzureMonitorForVMs-ArmTemplates/releases/download/vmi_ama_ga/DeployDcr.zip).  

1. Deploy the VM insights data collection rule using an ARM template, as described in [Quickstart: Create and deploy ARM templates by using the Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md#edit-and-deploy-the-template).

    1. Select **Build your own template in the editor** > **Load file** to upload the template you downloaded in the previous step.

        - To collect only VM insights performance metrics, deploy the `ama-vmi-default-perf-dcr` data collection rule by uploading the **DeployDcr**>**PerfOnlyDcr**>**DeployDcrTemplate** file. 
        - To collect VM insights performance metrics and Service Map data, deploy the `ama-vmi-default-perfAndda-dcr` data collection rule by uploading the **DeployDcr**>**PerfAndMapDcr**>**DeployDcrTemplate** file.

    1. When the data collection rule deployment is complete, select **Go to resource** > **JSON View** and copy the data collection rule's **Resource ID**.

1. Select one of the [new VM insights policies for Windows and Linux VMs](#new-vm-insights-policies).
1. Select **Assign**.
1. In the **Scope** field on the **Basics** tab, select your subscription and the resource group that contains the VMs you want to monitor.
1. In the **Data Collection Rule Resource Id** field on the **Parameters** tab, paste the resource ID of the data collection rule you created in the previous step.
1. On the **Remediation** tab: 
    1. In the **Scope** field, select your subscription and the resource group that contains your user-assigned managed identity.
    2. Set **Type of managed identity** to **User Assigned Managed Identity** and select your user-assigned identity. 

## Next steps

Learn how to:
- [View VM insights Map](vminsights-maps.md) to see application dependencies. 
- [View Azure VM performance](vminsights-performance.md) to identify bottlenecks and overall utilization of your VM's performance.
