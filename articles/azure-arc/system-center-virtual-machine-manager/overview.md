---
title:  Overview of the Azure Connected System Center Virtual Machine Manager (preview)
description: This article provides a detailed overview of the Azure Arc-enabled System Center Virtual Machine Manager (preview).
ms.date: 07/24/2023
ms.topic: conceptual
ms.services: azure-arc
ms.subservice: azure-arc-scvmm
author: jyothisuri
ms.author: jsuri
keywords: "VMM, Arc, Azure"
ms.custom: references_regions
---

# Overview of Arc-enabled System Center Virtual Machine Manager (preview)

Azure Arc-enabled System Center Virtual Machine Manager (SCVMM) empowers System Center customers to connect their VMM environment to Azure and perform VM self-service operations from Azure portal. With Azure Arc-enabled SCVMM, you get a consistent management experience across Azure.

Azure Arc-enabled System Center Virtual Machine Manager allows you to manage your Hybrid environment and perform self-service VM operations through Azure portal. For Microsoft Azure Pack customers, this solution is intended as an alternative to perform VM self-service operations.

Arc-enabled System Center VMM allows you to:

-	Perform various VM lifecycle operations such as start, stop, pause, and delete VMs on VMM managed VMs directly from Azure.
-	Empower developers and application teams to self-serve VM operations on-demand using [Azure role-based access control (RBAC)](../../role-based-access-control/overview.md).
-	Browse your VMM resources (VMs, templates, VM networks, and storage) in Azure, providing you a single pane view for your infrastructure across both environments.
-	Discover and onboard existing SCVMM managed VMs to Azure.

## How does it work?

To Arc-enable a System Center VMM management server, deploy [Azure Arc resource bridge](../resource-bridge/overview.md) (preview) in the VMM environment. Arc resource bridge is a virtual appliance that connects VMM management server to Azure. Azure Arc resource bridge (preview) enables you to represent the SCVMM resources (clouds, VMs, templates etc.) in Azure and do various operations on them.

## Architecture

The following image shows the architecture for the Arc-enabled SCVMM:

:::image type="content" source="media/architecture/arc-scvmm-architecture.png" alt-text="Screenshot of Arc enabled SCVMM - architecture.":::

### Supported VMM versions

Azure Arc-enabled SCVMM works with VMM 2016, 2019 and 2022 versions and supports SCVMM management servers with a maximum of 3500 VMS.

### Supported scenarios

The following scenarios are supported in Azure Arc-enabled SCVMM (preview):

- SCVMM administrators can connect a VMM instance to Azure and browse the SCVMM virtual machine inventory in Azure.
- Administrators can use the Azure portal to browse SCVMM inventory and register SCVMM cloud, virtual machines, VM networks, and VM templates into Azure.
- Administrators can provide app teams/developers fine-grained permissions on those SCVMM resources through Azure RBAC.
- App teams can use Azure interfaces (portal, CLI, or REST API) to manage the lifecycle of on-premises VMs they use for deploying their applications (CRUD, Start/Stop/Restart).

### Supported regions

Azure Arc-enabled SCVMM (preview) is currently supported in the following regions:

- East US
- West US2
- East US2
- West Europe
- North Europe

### Resource bridge networking requirements

The following firewall URL exceptions are needed for the Azure Arc resource bridge VM:

[!INCLUDE [network-requirements](../resource-bridge/includes/network-requirements.md)]

In addition, SCVMM requires the following exception:

| **Service** | **Port** | **URL** | **Direction** | **Notes**|
| --- | --- | --- | --- | --- |
| SCVMM management Server | 443 | URL of the SCVMM management server | Appliance VM IP and control plane endpoint need outbound connection. | Used by the SCVMM server to communicate with the Appliance VM and the control plane. |

[!INCLUDE [network-requirement-principles](../includes/network-requirement-principles.md)]

For a complete list of network requirements for Azure Arc features and Azure Arc-enabled services, see [Azure Arc network requirements (Consolidated)](../network-requirements-consolidated.md).

## Data Residency

Azure Arc-enabled SCVMM doesn't store/process customer data outside the region the customer deploys the service instance in.

## Next steps

[See how to create a Azure Arc VM](create-virtual-machine.md)