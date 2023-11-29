---
title: Feature Analysis Cloud Services vs Virtual Machine Scale Sets
description: Learn about the feature set available in Cloud Services and Virtual Machine Scale Sets
ms.topic: article
ms.service: cloud-services-extended-support
author: surbhijain
ms.author: surbhijain
ms.reviewer: mimckitt
ms.date: 11/8/2022
ms.custom: 
---
# Feature Analysis: Cloud Services (extended support) and Virtual Machine Scale Sets
This article provides a feature analysis of Cloud Services (extended support) and Virtual Machine Scale Sets. For more information on Virtual Machine Scale Sets, please visit the documentation [here](../virtual-machine-scale-sets/overview.md)


## Basic setup

| Feature |  CSES | Virtual Machine Scale Sets (Flex) | Virtual Machine Scale Sets (Uniform) | 
|---|---|---|---|
|Virtual machine type|Basic Azure PaaS VM (Microsoft.compute/cloudServices)|Standard Azure IaaS VM (Microsoft.compute/virtualmachines)|Scale Set specific VMs (Microsoft.compute /virtualmachinescalesets/virtualmachines)| 
|Maximum Instance Count (with FD guarantees)|1100|1000|3000 (1000 per Availability Zone)|
|SKUs supported|D, Dv2, Dv3, Dav4 series, Ev3, Eav4 series, G series, H series|D series, E series, F series, A series, B series, Intel, AMD; Specialty SKUs (G, H, L, M, N) are not supported|All SKUs|
|Full control over VM, NICs, Disks|Limited control over NICs and VM via CS-ES APIs. No support for Disks|Yes|Limited control with virtual machine scale sets VM API|
|RBAC Permissions Required|Compute Virtual Machine Scale Sets Write, Compute VM Write, Network|Compute Virtual Machine Scale Sets Write, Compute VM Write, Network|Compute Virtual Machine Scale Sets Write|
|Accelerated networking|No|Yes|Yes|
|Spot instances and pricing|No|Yes, you can have both Spot and Regular priority instances|Yes, instances must either be all Spot or all Regular|
|Mix operating systems|Extremely limited Windows support|Yes, Linux and Windows can reside in the same Flexible scale set|No, instances are the same operating system|
|Disk Types|No Disk Support|Managed disks only, all storage types|Managed and unmanaged disks, All Storage Types
|Disk Server Side Encryption with Customer Managed Keys|No|Yes| |
|Write Accelerator|No|No|Yes|
|Proximity Placement Groups|No|Yes, read Proximity Placement Groups documentation|Yes|
|Azure Dedicated Hosts|No|No|Yes|
|Managed Identity|No|User Assigned Identity Only|System Assigned or User Assigned|
|Azure Instance Metadata Service|No|Yes|Yes|
|Add/remove existing VM to the group|No|No|No|
|Service Fabric|No|No|Yes|
|Azure Kubernetes Service (AKS) / AKE|No|No|Yes|
|UserData|No|Yes|Yes|


## Autoscaling and instance orchestration

| Feature |  Cloud Services (extended Support) | Virtual Machine Scale Sets (Flex) | Virtual Machine Scale Sets (Uniform) | 
|---|---|---|---|
|List VMs in Set|No|Yes|Yes|
|Automatic Scaling (manual, metrics based, schedule based)|Yes|Yes|Yes|
|Auto-Remove NICs and Disks when deleting VM instances|Yes|Yes|Yes|
|Upgrade Policy (VM scale sets)|AutoUD and ManualUD policies. No support for Rolling. Cloud Services - Create Or Update - REST API (Azure Compute) | No, upgrade policy must be null or [] during create|Automatic, Rolling, Manual|
|Automatic OS Updates|Yes|No|Yes|
|Customer Defined OS Images|No|Yes|Yes|
|In Guest Security Patching|No|Yes|No|
|Terminate Notifications (VM scale sets)|No|Yes, read Terminate Notifications documentation|Yes|
|Monitor Application Health|No|Application health extension|Application health extension or Azure Load balancer probe|
|Instance Repair (VM scale sets)|No|Yes, read Instance Repair documentation|Yes|
|Instance Protection|No|No, use Azure resource lock|Yes|
|Scale In Policy|No|No|Yes|
|Get Instance View|Yes|No|Yes|
|VM Batch Operations (Start all, Stop all, delete subset, etc.)|Yes|Partial, Batch delete is supported. Other operations can be triggered on each instance using VM API)|Yes|

## High availability 

| Feature |  Cloud Services (extended Support) | Virtual Machine Scale Sets (Flex) | Virtual Machine Scale Sets (Uniform) | 
|---|---|---|---|
|Availability SLA|[SLA](https://azure.microsoft.com/support/legal/sla/cloud-services/v1_5/)|[SLA](https://azure.microsoft.com/support/legal/sla/virtual-machine-scale-sets/v1_1/)|[SLA](https://azure.microsoft.com/support/legal/sla/virtual-machine-scale-sets/v1_1/)|
|Availability Zones|No|Specify instances land across 1, 2 or 3 availability zones|Specify instances land across 1, 2 or 3 availability zones|
|Assign VM to a Specific Availability Zone|No|Yes|No|
|Fault Domain – Max Spreading (Azure will maximally spread instances)|Yes|Yes|Yes|
|Fault Domain – Fixed Spreading|5 update domains|2-3 FDs (depending on regional maximum FD Count); 1 for zonal deployments|2, 3 5 FDs 1, 5 for zonal deployments|
|Assign VM to a Specific Fault Domain|No|Yes|No|
|Update Domains|Yes|Depreciated (platform maintenance performed FD by FD)|5 update domains|
|Perform Maintenance|No|Trigger maintenance on each instance using VM API|Yes|
|VM Deallocation|No|Yes|Yes|

## Networking 

| Feature |  Cloud Services (extended Support) | Virtual Machine Scale Sets (Flex) | Virtual Machine Scale Sets (Uniform) | 
|---|---|---|---|
|Default outbound connectivity|Yes|No, must have explicit outbound connectivity|Yes|
|Azure Load Balancer Standard SKU|No|Yes|Yes|
|Application Gateway|No|Yes|Yes|
|Infiniband Networking|No|No|Yes, single placement group only|
|Azure Load Balancer Basic SKU|Yes|No|Yes|
|Network Port Forwarding|Yes (NAT Pool for role instance input endpoints)|Yes (NAT Rules for individual instances)|Yes (NAT Pool)|
|Edge Sites|No|Yes|Yes|
|Ipv6 Support|No|Yes|Yes|
|Internal Load Balancer|No |Yes|Yes|

## Backup and recovery 

| Feature |  Cloud Services (extended Support) | Virtual Machine Scale Sets (Flex) | Virtual Machine Scale Sets (Uniform) | 
|---|---|---|---|
|Azure Backup|No |Yes|No|
|Azure Site Recovery|No|Yes (via PowerShell)|No|
|Azure Alerts|Yes|Yes|Yes|
|VM Insights|No|Can be installed into individual VMs|Yes|


## Next steps 
- View the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- View [frequently asked questions](faq.yml) for Cloud Services (extended support).
