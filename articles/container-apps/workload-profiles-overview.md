---
title: Workload profiles in Azure Container Apps
description: Learn how to select a workload profile for your container app
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 11/04/2025
ms.author: cshoe
ms.custom:
  - references_regions
  - ignite-2023
  - ignite-2024
  - build-2025
  - ignite-2025
---

# Workload profiles in Azure Container Apps

A workload profile determines the type and amount of compute and memory resources available to container apps deployed in an Azure Container Apps environment. You can configure different profiles to fit the different needs of your applications.

## Profile types

Azure Container Apps supports three workload profile types: Consumption, Dedicated, and Flex.

Each profile type determines how your apps scale, the level of resource isolation, and how you're billed.

- **Consumption profiles** use a serverless architecture. Apps on this profile automatically scale in and out on-demand and optionally scale to zero when idle. You pay only for the resources your running apps use. The serverless-oriented billing also applies to serverless GPUs for specialized workloads. Since you pay only for the resources your apps use, the Consumption profile is well-suited for apps that experience large bursts of requests or scenarios where the workloads level is unpredictable.

- **Dedicated profiles** run on reserved compute resources in your own dedicated pool. You select the size and type of virtual machine, deploy multiple apps per profile, and pay per-profile instance. Dedicated profiles can be more cost-effective for steady workloads and support general purpose, memory-optimized, and GPU use cases.

- **Flexible profile** (preview) blends the billing and setup simplicity of the *Consumption* profile with many of the performance characteristics of the Dedicated profiles. Flexible profiles are billed like a Consumption profile plus the dedicated management fee, run in a single‑tenant compute pool, offer planned maintenance windows, and dedicated networking and access to larger replica sizes. Flexible profiles require a subnet of at least `/25`. Apps running on the Flexible profile are not able to scale to zero.

Each Container Apps environment includes a default Consumption profile. You can add Dedicated or Consumption GPU profiles and, when available, Flexible profiles to meet your application's needs.

> [!NOTE]
> The Flexible profile is currently only available in the following regions: Central US EUAP, East US2 EUAP, East Asia, and West Central US.

## Workload profile form factors

Different workload profile types offer different **form factors** such as general purpose, memory‑optimized, GPU, or blended.

| Profile type | Form factors | Description | Potential use |
|--|--|--|--|
| **Consumption** | General purpose | Automatically added to new environments and runs on serverless Consumption infrastructure. | Apps that don't require specific hardware requirements. |
| **Consumption** | GPU | Scale‑to‑zero serverless GPUs are available in regions like West US, Australia East, and Sweden Central. To see a full list of available regions, see [serverless GPU supported regions](./gpu-serverless-overview.md#supported-regions) | Apps that require GPU acceleration. |
| **Dedicated** | General purpose | Profiles with a balance of CPU and memory resources. | Apps that require larger amounts of CPU or memory. |
| **Dedicated** | Memory optimized | Profiles with increased memory resources for in‑memory data or machine‑learning models. | Apps with high memory requirements. |
| **Dedicated** | GPU | Profiles with GPU‑enabled compute are available in select regions only. **GPU‑enabled Dedicated profiles must be configured when creating an environment.**| Apps that require GPU acceleration and dedicated hardware. |

> [!NOTE]
> When using GPU‑enabled profiles, ensure your application runs the latest version of [CUDA](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/cuda).

## Profile details

The following tables summarize the available workload profiles by **profile type**, grouping similar sizes together to help you decide which option is best for you. The *vCPU* and *memory* fields show the range of resources across profile sizes.

### Consumption profile details

| Profile names | vCPU range | Memory range | GPU type | Regions | Allocation |
|--|--|--|--|--|--|
| **Consumption** | 0.25-4 | 0.5-8 GiB |  | All supported regions | per replica |
| **Consumption-GPU-NC24-A100, Consumption-GPU-NC8as-T4** | 8–24 | 56–220 GiB | NVIDIA T4, A100 | To see a full list of available regions, see [serverless GPU supported regions](./gpu-serverless-overview.md#supported-regions) | per replica |

All Consumption profiles support serverless scaling and are billed based on per‑replica usage.

### Dedicated profile details

| Classification | Profile names | vCPU range | Memory range | GPU type | Regions | Allocation |
|--|--|--|--|--|--|
| General Purpose | **D4, D8, D16, D32** | 4–32 | 16–128 GiB | None | All supported regions | per node |
| Memory Optimized | **E4, E8, E16, E32** | 4–32 | 32–256 GiB | None | All supported regions | per node |
| [Confidential Compute](./security.md#confidential-compute-preview) |**DC4, DC8, DC16, DC32, DC48, DC64, DC96** | 4-96 | 16-384 GiB | None | UAENorth | per node |
| GPU | **NC24-A100, NC48-A100, NC96-A100** | 24–96 | 220–880 GiB | A100 | West US 3, North Europe | per node |

> [!NOTE]
> GPU‑enabled Dedicated profiles allocate capacity on a per‑case basis. [You must submit a support ticket to request the required capacity](/azure/container-apps/quotas#gpu-quotas).

### Flexible profile details (preview)

| Profile names | vCPU range | Memory range | Regions | Allocation |
|--|--|--|--|--|
| **Flexible** | 0.25-4 | 0.5-16 GiB | Central US (EUAP), East US2 (EUAP), East Asia, West Central US | per replica |

## Resource consumption and scaling

You can limit the memory and CPU usage for each app within a workload profile. As multiple apps can share a single profile instance, you might need to adjust the profile’s memory settings to ensure adequate resources for all apps.

Keep in mind that the total resources available to your apps are slightly less than the profile’s allocation, as the runtime reserves some compute resources. When demand increases beyond the current resources, the system automatically adds more profile instances. As demand decreases, the system removes instances. You can control scaling by setting minimum and maximum instance counts. Billing is based on the number of running profile instances.

## Networking

Workload profile environments expose extra networking features, such as user‑defined routes, to secure ingress and egress traffic. See the [networking](./networking.md) documentation for details.

## Next steps

- [Manage workload profiles with the CLI](/cli/azure/containerapp/env/workload-profile#az-containerapp-env-workload-profile-add)
