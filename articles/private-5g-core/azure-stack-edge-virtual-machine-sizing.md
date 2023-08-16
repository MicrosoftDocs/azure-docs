---
title: Azure Stack Edge virtual machine sizing
description: Learn about the VMs that Azure Private 5G Core uses when running on an Azure Stack Edge device.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: reference
ms.date: 01/27/2023
---

# Azure Stack Edge virtual machine sizing

The following table contains information about the VMs that Azure Private 5G Core (AP5GC) uses when running on an Azure Stack Edge (ASE) device. You can use this information, for example, to check how much space you'll have remaining on your ASE device after installing Azure Private 5G Core.

| VM detail | Flavor name | vCPUs | Memory (GB) | Disk size (GB) | VM function |
|---|---|---|---|---|---|
| Management Control Plane VM | Standard_F4s_v1 | 4 | 4 | Ephemeral - 80 | Management Control Plane to create Kubernetes clusters |
| AP5GC Cluster Control Plane VM | Standard_F4s_v1 | 4 | 4 | Ephemeral - 128 | Control Plane of the Kubernetes cluster used for AP5GC |
| AP5GC Cluster Node VM | Standard_F16s_HPN | 16 | 32 | Ephemeral - 128 </br> Persistent - 102 GB | AP5GC workload node |
| Control plane upgrade reserve |  | 4 | 4 | 0 | Used by ASE during upgrade of the control plane VM |
| **Total requirements** |  | **24** | **44** | **Ephemeral - 336** </br> **Persistent - 102** </br> **Total - 438** |  |

## Remaining usable resource on Azure Stack Edge Pro

The following resources are available within ASE after deploying AP5GC. You can use these resources, for example, to deploy additional virtual machines or storage accounts.

| Resource | Pro with GPU | Pro 2 - 64G2T | Pro 2 - 128G4T1GPU | Pro 2 - 256G6T2GPU |
|----------|--------------|---------------|--------------------|--------------------|
| vCPUs    | 12           | 4             | 4                  | 4                  |
| Memory   | 56 GB        | 3 GB          | 51 GB              | 163 GB             |
| Storage  | ~3.75 TB     | ~280 GB       | ~1.1 TB            | ~2.0 TB            |
