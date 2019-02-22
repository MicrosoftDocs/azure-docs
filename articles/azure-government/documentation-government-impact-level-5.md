---
title: Azure Government Overview | Microsoft Docs
description: 'This article provides guidance for Azure Government Cloud configurations required to implement Impact Level 5 workloads for the DoD'
services: azure-government
cloud: gov
documentationcenter: ''
author: dumartin
manager: zakramer

ms.service: azure-government
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 02/22/2019
ms.author: dumartin

#Customer intent: As a DoD mission owner I want to know how to implement a workload at Impact Level 5 in Microsoft Azure Government
---

# Overview

Azure Government supports applications that support Impact Level 5 (IL5) data, as defined in the [US Department of Defense Cloud Security Requirements Guide (SRG)](https://iase.disa.mil/cloud_security/Lists/Cloud%20SRG/AllItems.aspx), in all regions. IL5 workloads have a higher degree of impact to the US Department of Defense and must be secured to a higher standard.  When supporting these workloads on Azure Government, their isolation requirements can be met in different ways. The guidance below will address configurations and settings for the isolation required to support IL5 data.  This document will be updated as new implementations are enabled and as new services are accredited for IL5 data by DISA. 

## Background

In January 2017, the Impact Level 5 Provisional Authorization (PA) for Azure Government was the first provided to a Hyper Scale cloud provider.  This covered two regions of Azure Government (USDoD Central and USDoD East) that were dedicated to the DoD.  Based on mission owner feedback and evolving security capabilities, Microsoft has partnered with DISA to expand the IL5 PA in December 2018 to cover all 6 Azure Government regions while still honoring the isolation requirements needed by the Department of Defense.

Azure Government remains the only Hyper Scale cloud provider to have PaaS accredited at IL5.

## Principles and Approach

To include a service in Impact Level 5 scope, there are two key areas that will be addressed � Storage Isolation and Compute Isolation.  We are focusing on how these services can isolate the compute and storage of Impact Level 5 data.  The SRG allows for a shared management and network infrastructure.

### Compute Isolation

The SRG focuses on physical segmentation of compute when processing data for Impact Level 5.  This focuses on ensure that the following do not occur:

1. A virtual machine that compromises the physical host cannot impact a DoD workload
2. A workload that compromises the service infrastructure cannot impact a DoD workload

To remove the risk of runtime attacks and ensure operational workloads are not compromised from other workloads on the same host all Impact Level 5 VMs should be provisioned on dedicated physical nodes.

There are cases where services do not allow the execution of code or does not directly process data.  In these cases, they will need to be secured against other virtual machines but within the workload there is no additional isolation.

### Storage Isolation

In the most recent PA for Azure Government, DISA has approved logical separation of IL5 from other data using cryptographic means.  In Azure this means encryption using keys that are maintained in Azure Key Vault and managed by the mission owner. 

When applying this to services the following evaluation:

- If a service only host IL5 data, then the service can control the key on behalf of the end users but must use a dedicated key to protect L5 data from all other data in the cloud.
- If a service will host IL5 and non-DoD data, then the service must expose the option for application storing IL5 data to use their own key that is stored in Azure Key Vault.  This gives consumers of the service the ability to implement cryptographic separation.

This ensures all key material for decrypting data is stored separately of the data itself and done so with a hardware key management solution.

# Azure Storage

Azure Storage consists of multiple data features: Blob storage, File storage, Table storage, and Queue storage. Blob storage supports both standard and premium storage, with premium storage using only SSDs for the fastest performance possible. Storage also includes configurations which modify these storage types, such as hot and cool to provide appropriate speed-of-availability for data scenarios. The below outlines which features of storage currently support IL5 workloads.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Blobs** | X | X | X | X | X | X |
| **Files** | X | X | X | X | X | X |
| **Tables** |   |   |   |   | X | X |
| **Queues** |   |   |   |   | X | X |

When deploying in these regions you must follow the steps for using **Storage Encryption with Key Vault Managed Keys**

## Storage Encryption with Key Vault Managed Keys

To implement Impact Level 5 compliant controls on an Azure Storage account running in Azure Government outside of the dedicated DoD regions, Encryption at Rest must be implemented with the customer-managed key option enabled (also known as bring-your-own-key).

For more information on how to enable this Azure Storage Encryption feature, please review the supporting documentation [found here](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption-customer-managed-keys).

**Important note:** When using this encryption method, it is important that it is enabled BEFORE content is added to the storage account. Any content added prior will not be encrypted with the selected key, and only encrypted using standard encryption at rest provided by Azure Storage.

# Azure Compute

Microsoft Azure Virtual Machines can be used through multiple deployment mediums. This includes single Virtual Machines as well as Virtual Machines deployed using Azure&#39;s VM Scale Sets feature.

| **Service** | **USGov VA** | **USGov IA** | **USGov TX** | **USGov AZ** | **USDoD East** | **USDoD Cent** |
| --- | --- | --- | --- | --- | --- | --- |
| **Virtual Machines** | X | X | X | X | X | X |
| **Virtual Machine Scale Sets (VMSS)** | X | X | X | X | X | X |

When deploying in these regions you must use **Dedicated Virtual Machines** and **Disk Encryption for Virtual Machines**

When deploying in these regions you must use a **Dedicated Virtual Machines** and **Disk Encryption for VMSS**

**Note:** Disk Encryption is always recommended regardless of the deployment location and SKU.

## Dedicated Virtual Machines

Specific VM types when deployed consume the entire physical host for that VM. These VMs provide the necessary level of isolation required to support IL5 workloads when deployed outside of the dedicated DoD regions.  In addition to deploying on these hosts, the underlying storage and disks for these virtual machines must be configured with encryption at rest.

Each of the above VM types can be deployed leveraging VMSS to provide proper compute isolation with all the benefits of VMSS in place. When configuring your scale set, select the appropriate SKU. To encrypt the data at rest, see the next section for supportable encryption options.

Current

VM SKUs that offer necessary compute isolation include specific offerings from our VM families:

| VM Family\*\* | VM SKU |
| --- | --- |
| D-Series - General Purpose | Standard\_DS15\_v2, Standard\_D15\_v2 |
| Memory Optimized | Standard\_E64is\_v3, Standard\_E64i\_v3 |
| Compute Optimized | Standard\_F72s\_v2 |
| Large Memory Optimized | Standard\_M128ms |
| GPU Enabled VMs | Standard\_NV24 |

**Note:** As new hardware generations become available, some VM types may require reconfiguration (scale up or migration to a new VM SKU) to ensure they remain on properly dedicated hardware. This document will be updated to reflect any changes.

## Disk Encryption for Virtual Machines

The storage supporting these Virtual Machines can be encrypted in one of two ways to support necessary encryption standards.

- Leverage Azure Disk Encryption to encrypt the drives using DM-Crypt (Linux) or BitLocker (Windows):
  - [Enable Azure Disk Encryption for Linux](https://docs.microsoft.com/en-us/azure/security/azure-security-disk-encryption-linux)
  - [Enable Azure Disk Encryption for Windows](https://docs.microsoft.com/en-us/azure/security/azure-security-disk-encryption-windows)
- Leverage Azure Storage Service Encryption for Storage Accounts with your own key to encrypt the storage account that holds the disks:
  - [Storage Service Encryption with Customer Managed Keys](https://docs.microsoft.com/en-us/azure/storage/common/storage-service-encryption-customer-managed-keys)

## Disk Encryption using Virtual Machine Scale Sets (VMSS)

The disks that support Virtual Machine Scale Sets can be encrypted using Azure Disk Encryption:

- [Encrypt Disks with Virtual Machine Scale Sets](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-encrypt-disks-ps)

## Enforcement

To help support the consistent implementation of this guidance, we have provided a set of scripts to enforce policies or configurations that ensure these requirements are properly applied.  These can be downloaded [here](https://tbd.com), in our GitHub samples.
