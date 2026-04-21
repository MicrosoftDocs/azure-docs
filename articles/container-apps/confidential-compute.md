---
title: Confidential compute in Azure Container Apps (Preview)
description: Learn about confidential compute features in Azure Container Apps.
services: container-apps
author: jefmarti
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 04/21/2026
ms.author: jefmarti
---

# Confidential compute in Azure Container Apps (Preview)

Azure Container Apps supports confidential compute through dedicated workload profiles that run containerized workloads on hardware‑based Trusted Execution Environments (TEEs). Confidential compute is a platform capability that does not require application-level code changes.

> [!IMPORTANT]
> Confidential compute is currently available as a public preview and is supported only in specific regions and workload profile configurations.

## Benefits

Confidential compute complements Azure encryption at rest and encryption in transit by protecting data while it is being processed. When running on a confidential compute workload profile, your workloads get:

- **Hardware‑based isolation** using Trusted Execution Environments.
- **Encryption of data in memory** while workloads are running.
- **Protection against unauthorized access** to data in use, including access from infrastructure operators.

These guarantees are provided and enforced by the Azure platform and the underlying confidential VM infrastructure. For more information, see [Azure confidential computing](/azure/confidential-computing/).

## When to use confidential compute

Use confidential compute in Azure Container Apps when:

- Your workloads process highly sensitive or regulated data.
- Protecting data while it is being processed is a requirement.
- You want the security benefits of confidential computing without managing infrastructure or modifying application code.

## How it works

Confidential compute is enabled at the workload profile level, not at the individual container app or revision level. When you add a DC‑series dedicated workload profile to your environment, any container apps deployed to that profile automatically run on confidential compute infrastructure backed by confidential VM SKUs.

There is no per-app or per-container setting to configure. You deploy container apps using the same images, tooling, and workflows as non‑confidential workloads. No special container runtime configuration or SDKs are required.

## Enable confidential compute

Confidential compute is enabled when all of the following conditions are met:

1. You create an Azure Container Apps environment in a supported region.
1. You add a dedicated workload profile that uses a DC‑series workload profile type.
1. You deploy container apps to that workload profile.

For steps on adding and managing workload profiles, see [Manage workload profiles with the Azure CLI](workload-profiles-manage-cli.md).

## Supported workload profiles

Confidential compute is available only on DC‑series dedicated workload profiles. Supported sizes include:

- DC4
- DC8
- DC16
- DC32
- DC48
- DC64
- DC96

Availability of these workload profiles is region dependent. Not all regions with DC‑series profiles support confidential compute. See [Supported regions](#supported-regions) for the current list of regions where confidential compute is available.

## Supported regions

Confidential compute for Azure Container Apps is currently available in the following regions:

- UAE North
- Germany West Central
- Korea Central

## Related content

- [Security overview in Azure Container Apps](security.md)
- [Workload profiles overview](workload-profiles-overview.md)
- [Azure confidential computing](/azure/confidential-computing/)
