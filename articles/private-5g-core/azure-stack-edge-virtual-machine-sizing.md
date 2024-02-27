---
title: Service limits and resource usage
description: Learn about the limits and resource usage of your Azure Private 5G Core deployment when running on an Azure Stack Edge device.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: reference
ms.date: 02/27/2024
---

# Service limits and resource usage

This article describes the maximum supported limits of the Azure Private 5G Core solution and the hardware resources required. You should use this information to help choose the appropriate AP5GC service package and Azure Stack Edge hardware for your needs.

## Service limits

The following table lists the maximum supported a range of parameters in an Azure Private 5G Core deployment. While these are tested and supported limits, other factors may affect what is achievable. For example, usage patterns, UE types and third party network elements may impact one or more of these parameters. It is important to test the limits of your deployment before launching a live service.

If you require higher throughput for your scenario, please contact us to discuss your needs.

| Element                | Maximum supported |
|------------------------|-------------------|
| PDU sessions           | Enterprise radios typically support up to 1000 simultaneous PDU sessions per radio. |
| Bandwidth              | See [Azure Private 5G Core pricing](https://azure.microsoft.com/en-us/pricing/details/private-5g-core/). |
| RAN                    | 200 per ASE |
| UEs                    | 10,000 across all sites |
| SIMs                   | 1000 per site |
| SIM provisioning       | 1000 per API call |
| Radios (gNB/eNB/CU)    | 20 per site |

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