---
title: Azure Stack Edge virtual machine sizing
description: Learn about the VMs that Azure Private 5G Core uses when running on an Azure Stack Edge device.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: reference
ms.date: 09/29/2023
---

# Azure Stack Edge virtual machine sizing

The following tables list the hardware resources that Azure Private 5G Core (AP5GC) uses when running on supported Azure Stack Edge (ASE) devices. You can use this information to check how much space you'll have remaining on your ASE device after installing Azure Private 5G Core.

> [!NOTE]
> An extra four vCPUs are used by the ASE control plane during upgrade of the packet core. The control plane software can contend with the operating system and other workloads, so we do not recommend reserving these four vCPUs. They are not included in the tables.

## Azure Stack Edge Pro with GPU

| Resources         | vCPUs | RAM (GiB) | Storage    |
|-------------------|-------|-----------|------------|
| Available         | 40    | 96        | ~ 4.19 TB  |
| AP5GC VMs         | 16    | 32        | 208 GB ephemeral </br> 102 GB persistent |
| AKS control plane | 8     | 12        | 128 GB ephemeral |
| **Remaining**     | **16**| **52**    | **~ 3.75 TB**  |

For the full device specifications, see [Technical specifications and compliance for Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-technical-specifications-compliance).

## Azure Stack Edge Pro 2 - 64G2T

| Resources         | vCPUs | RAM (GiB) | Storage  |
|-------------------|-------|-----------|----------|
| Available         | 32    | 48        | 720 GB   |
| AP5GC VMs         | 16    | 32        | 208 GB ephemeral </br> 102 GB persistent |
| AKS control plane | 8     | 12        | 128 GB ephemeral |
| **Remaining**     | **8** | **4**     | **~ 280 GB** |

For the full device specifications, see [Technical specifications and compliance for Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-technical-specifications-compliance?tabs=sku-a).

## Azure Stack Edge Pro 2 - 128G4T1GPU

| Resources         | vCPUs | RAM (GiB) | Storage  |
|-------------------|-------|-----------|----------|
| Available         | 32    | 96        | 1.6 TB   |
| AP5GC VMs         | 16    | 32        | 208 GB ephemeral </br> 102 GB persistent |
| AKS control plane | 8     | 12        | 128 GB ephemeral |
| **Remaining**     | **8** | **52**    | **~ 1.1 TB** |

For the full device specifications, see [Technical specifications and compliance for Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-technical-specifications-compliance?tabs=sku-b).

## Azure Stack Edge Pro 2 - 256G6T2GPU 

| Resources         | vCPUs | RAM (GiB) | Storage |
|-------------------|-------|-----------|---------|
| Available         | 32    | 224       | 2.5 TB  |
| AP5GC VMs         | 16    | 32        | 208 GB ephemeral </br> 102 GB persistent |
| AKS control plane | 8     | 12        | 128 GB ephemeral |
| **Remaining**     | **8** | **180**   | **~ 2.0 TB** |

For the full device specifications, see [Technical specifications and compliance for Azure Stack Edge Pro 2](/azure/databox-online/azure-stack-edge-pro-2-technical-specifications-compliance?tabs=sku-c).
