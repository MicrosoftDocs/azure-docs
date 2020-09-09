---
title: Azure Monitor for VMs health
description: 
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/08/2020

---

# Azure Monitor for VMs guest health
Azure Monitor for VMs guest health feature provides simple view of basic parameters of the VM including CPU utilization, memory usage and remaining disk free space. Critical/warning thresholds can be set by user to receive alerts when one or more of the basic parameters of virtual machine cross these thresholds.

## Overview

Enabling guest VM health monitoring includes the following steps (automation for these steps is described later in the document):

1. Create Azure Monitor Agent Data Collection Rule (DCR) object;
2. Associate DCR created on step 1 to target virtual machine by creating Data Collection Rule Association
3. Enable managed identity on target virtual machine;
4. Deploy Azure Monitor Agent on target virtual machine;
5. Deploy Azure Monitor Guest VM Health Agent on target virtual machine.

## Pre-requisites
Private preview has the following limitations and requirements.

1. Virtual machine must be onboarded to Azure Monitor for Virtual Machines
2. Virtual machine __must not__ be also participating in Azure Security Center private preview (agents are temporarily incompatible)
3. Virtual machine must be running in Azure Cloud (no Azure Arc support for private preview)
4. Virtual Machine must run one of the following operating systems: Ubuntu 16.04 LTS, Ubuntu 18.04 LTS, Windows Server 2012 or later
5. Virtual machine must be located in East US or West Europe region
6. Log Analytics workspace of the virtual machine must be located in East US, East US 2 EUAP or West Europe region
7. User executing onboarding steps must have a minimum __Contributor__ level access to the subscription where virtual machine and data collection rule reside

## Register required ARM Resource Providers for your subscription

Register the following ARM Resource Providers for your subscription:
- Microsoft.WorkloadMonitor
- Microsoft.Insights

Register providers by running the following commands in Azure Resource Manager (ARM). Replace "[subscriptionId]" with subscription id where your VM is residing.

Use armclient, postman or another method to make authenticated call to ARM:

POST https://management.azure.com/subscriptions/[subscriptionId]/providers/Microsoft.WorkloadMonitor/register?api-version=2019-10-01

POST https://management.azure.com/subscriptions/[subscriptionId]/providers/Microsoft.Insights/register?api-version=2019-10-01

The following document has more information on registering Resource Providers: [https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types)

## Create Azure Monitor Data Collection Rule (DCR)
Azure Monitor Agent Data Collection Rule (Azure object) must be created in order for health data to start flowing. DCR must be created in the same region as target Log Analytics workspace of the VM. It is recommended to have one DCR containing VM Health rules per subscription and all DCRs in a dedicated resource group such as `AzureMonitor-DataCollectionRules`.

Create DCR using `Health.DataCollectionRule.template.json` Azure Resource Manager (ARM) template. Run template in the subscription and resource group where DCR is to be created. Provide the following values to template parameters:

- __Default Health Data Collection Rule Name__ - leave default;
- __Destination Workspace Resource Id__ - Log Analytics workspace used for VM data collection (can be seen in portal under Monitor/Virtual Machines). Note: see pre-requisites above to ensure workspace region is supported by this preview;
- __Data Collection Rule Location__ - region code (ex: eastus, westeurope) of the DCR. Must match region of Log Analytics workspace.

## Enable VM Heath on the virtual machine

You can onboard one or more VMs once Data Collection Rule was set up per above instructions. Use `Health.VirtualMachine.template.json` ARM template and provide the following parameters running template in subscription and resource group where target virtual machine is located:

- __Virtual Machine Name__ - target VM name;
- __Virtual Machine Location__ - region code where VM is located (ex: eastus, westeurope). Note: see pre-requisites above to ensure VM region is supported by this preview;
- __Virtual Machine OS Type__ - target VM operating system type Windows/Linux;
- __Data Collection Rule Association Name__ - leave default;
- __Health Data Collection Rule Resource Id__ - data collection rule ARM resource id (ex: /subscriptions/11111111-2222-3333-4444-3a360a90861e/resourceGroups/AzureMonitor-DataCollectionRules/providers/Microsoft.Insights/dataCollectionRules/Microsoft-VMInsights-Health)
- __Health Extension Version__ - VM health agent extension version - choose "private-preview".

## UX

Access UX preview at this link: [https://aka.ms/vminsights/features/healthPreview](https://aka.ms/vminsights/features/healthPreview).

## Scenarios to explore

1. Onboard VM, check out at-scale view in Azure Portal (Monitor/Virtual Machines), group view by health state
2. Onboard VM, generate CPU or memory pressure, check VM alerts
3. Onboard VM, add disk drive/filesystem, emulate out-of-disk event (reconfigure disk with high required free space %) on several disks
4. Set up warning and critical alerts for a monitor. Create pressure, confirm alert changes severity when monitor transitions from warning to critical and back
5. Enable and disable monitors (disable monitoring on all current and future attached disk drives _except_ root filesystem or logical drive C:)

## Questions/feedback?

Contact [ask-vmh@microsoft.com](mailto:ask-vmh@microsoft.com) if you have any questions or want to provide feedback around guest VM health functionality.