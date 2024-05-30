---
title: Service limits and resource usage
description: Learn about the limits and resource usage of your Azure Private 5G Core deployment when running on an Azure Stack Edge device.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: reference
ms.date: 04/24/2024
---

# Service limits and resource usage

This article describes the maximum supported limits of the Azure Private 5G Core solution and the hardware resources required. You should use this information to help choose the appropriate AP5GC service package and Azure Stack Edge hardware for your needs. Refer to [Azure Private 5G Core pricing](https://azure.microsoft.com/pricing/details/private-5g-core/) and [Azure Stack Edge pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/) for the package options and overage rates.

## Service limits

The following table lists the maximum supported limits for a range of parameters in an Azure Private 5G Core deployment. These limits have been confirmed through testing, but other factors may affect what is achievable in a given scenario. For example, usage patterns, UE types and third-party network elements may impact one or more of these parameters. It is important to test the limits of your deployment before launching a live service.

| Element                | Maximum supported | Additional limits in a Highly Available (HA) deployment |
|------------------------|-------------------|-------------------|
| PDU sessions           | 10,000 per Packet Core |       |
| Bandwidth              | Over 25 Gbps combined uplink and downlink per Packet Core |       |
| RAN nodes (eNB/gNB)    | 200 per Packet Core | 50 per Packet Core |
| Active UEs             | 10,000 per Packet Core |  |
| SIMs                   | 20,000 per Mobile Network |       |
| SIM provisioning       | 10,000 per JSON file via Azure portal, 4MB per REST API call |       |

Your chosen service package may define lower limits, with overage charges for exceeding them - see [Azure Private 5G Core pricing](https://azure.microsoft.com/pricing/details/private-5g-core/) for details. If you require higher throughput for your use case, please contact us to discuss your needs.

> [!NOTE]
> Management plane operations are handled by Azure Resource Manager (ARM) and are subject to rate limits. [Understand how Azure Resource Manager throttles requests](/azure/azure-resource-manager/management/request-limits-and-throttling).

## Azure Stack Edge virtual machine sizing

The following table lists the hardware resources that Azure Private 5G Core (AP5GC) uses when running on supported Azure Stack Edge (ASE) devices.

| VM detail | Flavor name | vCPUs | Memory (GiB) | Disk size (GB) | VM function |
|---|---|---|---|---|---|
| Management Control Plane VM | Standard_F4s_v1    | 4            | 4  | Ephemeral - 80                            | Management Control Plane to create Kubernetes clusters |
| AP5GC Cluster Control Plane VM | Standard_F4s_v1 | 4            | 4  | Ephemeral - 128                           | Control Plane of the Kubernetes cluster used for AP5GC |
| AP5GC Cluster Node VM | Standard_F16s_HPN        | 16           | 32 | Ephemeral - 128 </br> Persistent - 102 GB | AP5GC workload node |
| Control plane upgrade reserve |                  | 0 (see note) | 4  | 0                                         | Used by ASE during upgrade of the control plane VM |
| **Total requirements** |                         | **24**       | **44** | **Ephemeral - 336** </br> **Persistent - 102** </br> **Total - 438** |  |

> [!NOTE]
> An additional four vCPUs are used during ASE upgrade. We do not recommend reserving these additional vCPUs because the ASE control plane software can contend with other workloads.

## Remaining usable resources

The following table lists the resources available on supported ASE devices after deploying AP5GC. You can use these resources to deploy additional virtual machines or storage accounts, for example.

| Resource | Pro with GPU | Pro 2 - 64G2T | Pro 2 - 128G4T1GPU | Pro 2 - 256G6T2GPU |
|----------|--------------|---------------|--------------------|--------------------|
| vCPUs    | 16           | 8             | 8                  | 8                  |
| Memory   | 52 GiB       | 4 GiB         | 52 GiB             | 180 GiB            |
| Storage  | ~ 3.75 TB    | ~ 280 GB      | ~ 1.1 TB           | ~ 2.0 TB           |

For the full device specifications, see:

- [Technical specifications and compliance for Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-technical-specifications-compliance)
- [Technical specifications and compliance for Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-technical-specifications-compliance)