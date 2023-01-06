---
title: Azure Arc network requirements
description: A consolidated list of network requirements for Azure Arc features and Azure Arc-enabled services. Lists endpoints, ports, and protocols.
ms.date: 03/01/2022
ms.topic: reference
---

# Azure Arc network requirements

This article lists the endpoints, ports, and protocols required for Azure Arc-enabled services and features.

## Arc Kubernetes endpoints

Connectivity to the Arc Kubernetes endpoints is required for all Kubernetes based Arc offerings, including:

- Azure Arc-enabled Kubernetes
- Azure Arc-enabled App services
- Azure Arc-enabled Machine Learning

[!INCLUDE [network-requirements](kubernetes/includes/network-requirements.md)]

## Azure Arc-enabled data services

This section describes additional requirements specific to Azure Arc-enabled data services, in addition to the Arc Kubernetes endpoints listed above.

[!INCLUDE [network-requirements](data/includes/network-requirements.md)]

## Azure Arc-enabled servers

Connectivity to Arc-enabled server endpoints is required for:

- Azure Arc-enabled SQL Server
- Azure Arc resource bridge (preview)
- Azure Arc-enabled VMware vSphere (preview)
- Azure Arc-enabled System Center Virtual Machine Manager (preview)

[!INCLUDE [network-requirements](servers/includes/network-requirements.md)]

## Azure Arc resource bridge (preview)

This section describes additional networking requirements specific to deploying Azure Arc resource bridge (preview) in your enterprise. These additional requirements also apply to Azure Arc-enabled VMware vSphere (preview) and Azure Arc-enabled System Center Virtual Machine Manager (preview).

[!INCLUDE [network-requirements](resource-bridge/includes/network-requirements.md)]

