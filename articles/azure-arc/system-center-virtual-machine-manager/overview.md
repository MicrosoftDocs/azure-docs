---
title:  Overview of the Azure Connected System Center Virtual Machine Manager 
description: This article provides a detailed overview of the Azure Arc-enabled System Center Virtual Machine Manager.
ms.date: 11/27/2023
ms.topic: conceptual
ms.services: azure-arc
ms.subservice: azure-arc-scvmm
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
keywords: "VMM, Arc, Azure"
ms.custom: references_regions
---

# Overview of Arc-enabled System Center Virtual Machine Manager

Azure Arc-enabled System Center Virtual Machine Manager (SCVMM) empowers System Center customers to connect their VMM environment to Azure and perform VM self-service operations from Azure portal. Azure Arc-enabled SCVMM extends the Azure control plane to SCVMM managed infrastructure, enabling the use of Azure security, governance, and management capabilities consistently across System Center managed estate and Azure.

Azure Arc-enabled System Center Virtual Machine Manager also allows you to manage your hybrid environment consistently and perform self-service VM operations through Azure portal. For Microsoft Azure Pack customers, this solution is intended as an alternative to perform VM self-service operations.

Arc-enabled System Center VMM allows you to:

- Perform various VM lifecycle operations such as start, stop, pause, and delete VMs on SCVMM managed VMs directly from Azure.
- Empower developers and application teams to self-serve VM operations on demand using [Azure role-based access control (RBAC)](https://learn.microsoft.com/azure/role-based-access-control/overview).
- Browse your VMM resources (VMs, templates, VM networks, and storage) in Azure, providing you with a single pane view for your infrastructure across both environments.
- Discover and onboard existing SCVMM managed VMs to Azure.
- Install the Arc-connected machine agents at scale on SCVMM VMs to [govern, protect, configure, and monitor them](../servers/overview.md#supported-cloud-operations).

## Onboard resources to Azure management at scale

Azure services such as Microsoft Defender for Cloud, Azure Monitor, Azure Update Manager, and Azure Policy provide a rich set of capabilities to secure, monitor, patch, and govern off-Azure resources via Arc.

By using Arc-enabled SCVMM's capabilities to discover your SCVMM managed estate and install the Arc agent at scale, you can simplify onboarding your entire System Center estate to these services.

## How does it work?

To Arc-enable a System Center VMM management server, deploy [Azure Arc resource bridge](../resource-bridge/overview.md) in the VMM environment. Arc resource bridge is a virtual appliance that connects VMM management server to Azure. Azure Arc resource bridge enables you to represent the SCVMM resources (clouds, VMs, templates etc.) in Azure and do various operations on them.

## Architecture

The following image shows the architecture for the Arc-enabled SCVMM:

:::image type="content" source="media/architecture/arc-scvmm-architecture-inline.png" alt-text="Screenshot of Arc enabled SCVMM - architecture." lightbox="media/architecture/arc-scvmm-architecture-expanded.png":::

## How is Arc-enabled SCVMM different from Arc-enabled Servers

- Azure Arc-enabled servers interact on the guest operating system level, with no awareness of the underlying infrastructure fabric and the virtualization platform that they're running on. Since Arc-enabled servers also support bare-metal machines, there might, in fact, not even be a host hypervisor in some cases.
- Azure Arc-enabled SCVMM is a superset of Arc-enabled servers that extends management capabilities beyond the guest operating system to the VM itself. This provides lifecycle management and CRUD (Create, Read, Update, and Delete) operations on an SCVMM VM. These lifecycle management capabilities are exposed in the Azure portal and look and feel just like a regular Azure VM. Azure Arc-enabled SCVMM also provides guest operating system management, in fact, it uses the same components as Azure Arc-enabled servers.

You have the flexibility to start with either option, or incorporate the other one later without any disruption. With both options, you'll enjoy the same consistent experience.

### Supported scenarios

The following scenarios are supported in Azure Arc-enabled SCVMM:

- SCVMM administrators can connect a VMM instance to Azure and browse the SCVMM virtual machine inventory in Azure.
- Administrators can use the Azure portal to browse SCVMM inventory and register SCVMM cloud, virtual machines, VM networks, and VM templates into Azure.
- Administrators can provide app teams/developers fine-grained permissions on those SCVMM resources through Azure RBAC.
- App teams can use Azure interfaces (portal, CLI, or REST API) to manage the lifecycle of on-premises VMs they use for deploying their applications (CRUD, Start/Stop/Restart).
- Administrators can install Arc agents on SCVMM VMs at-scale and install corresponding extensions to use Azure management services like Microsoft Defender for Cloud, Azure Update Manager, Azure Monitor, etc.  

### Supported VMM versions

Azure Arc-enabled SCVMM works with VMM 2019 and 2022 versions and supports SCVMM management servers with a maximum of 15,000 VMs.

### Supported regions

Azure Arc-enabled SCVMM is currently supported in the following regions:

- East US
- East US2
- West US2
- West US3
- Central US
- South Central US
- UK South
- North Europe
- West Europe
- Sweden Central
- Southeast Asia
- Australia East

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

[Create an Azure Arc VM](create-virtual-machine.md)
