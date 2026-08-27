---
title: Shared responsibility model for Azure Enclave
description: Learn which platform-managed tasks Azure Enclave handles for you, and which configuration and workload tasks you're responsible for as a customer.
author: aserfass-msft
ms.author: aserfass
ms.topic: overview
ms.service: azure-enclave
ai-usage: ai-assisted
ms.date: 8/5/2026
---

# Shared responsibility model for Azure Enclave

Azure Enclave follows the Azure [shared responsibility model](/azure/security/fundamentals/shared-responsibility): Azure Enclave manages the isolation boundary and its supporting infrastructure, while you manage access, configuration, and the workloads you deploy inside that boundary. Understanding where that line falls helps you avoid configuration drift and unexpected connectivity or policy failures.

## Azure Enclave responsibilities

Azure Enclave creates and continuously manages the following on your behalf:

- **Virtual networks and subnets**: Azure Enclave creates and owns the enclave Virtual Network and its subnets. On every update to the enclave, Azure Enclave re-reads the live network state and refreshes subnet configuration against its own managed configuration.
- **Virtual WAN hub creation**: Azure Enclave creates the Virtual WAN hubs for each [dedicated hub](./what-dedicated-hub.md) and [transit hub](./what-transit-hub.md) you create, along with firewall policy and rule collection groups.
- **Network security groups (NSGs)**: Azure Enclave creates and manages the NSGs attached to enclave subnets.
- **Azure Bastion**: When you enable Bastion for an enclave, Azure Enclave deploys and manages the Bastion host, its dedicated subnet, and the associated public IP address.
- **Monitoring infrastructure**: Azure Enclave creates the Log Analytics workspace, managed identities used for policy enforcement and flow log collection, and related diagnostic settings.
- **Managed resource group (MRG) protections**: Azure Enclave applies deny assignments at the MRG scope that block unauthorized writes to platform-managed resources, including the enclave Virtual Network.
- **Guardrail policy assignments**: Azure Enclave assigns and manages the Azure Policy guardrails applied to managed resource groups. You can't create, modify, or delete these policy assignments directly.
- **Maintenance mode enforcement**: Azure Enclave evaluates and enforces the maintenance mode state (`mode` and `justification`) that temporarily relaxes deny assignment restrictions for approved maintenance tasks.
- **Enclave connections**: Azure Enclave manages the firewall and NSG rules that implement enclave connections and endpoints based on the rules you define.

## Customer responsibilities

You're responsible for the following tasks:

- **Role-based access control (RBAC)**: Assign roles and manage access to your communities, enclaves, workloads, and workload resources.
- **Configuration**: Approvals, permissions, IP address sizing, and other configuration choices you make when you create or update Azure Enclave resources.
- **Workloads**: Create and maintain the workloads and Azure resources you deploy (for example, inside workload resource groups).
- **Linking workload resource groups**: Choose which new or existing (brownfield) resource groups to link to a workload, and ensure you have the required permissions on any existing resource group you link.
- **Managing maintenance mode**: Submit a maintenance mode request with the mode, justification, and principals that need temporary access, when you need to perform a privileged maintenance task.

## Don't manage these platform resources yourself

Some enclave resources look like ordinary Azure resources, but Azure Enclave treats them as part of its managed, authoritative state. Making changes to these resources outside of the Azure Enclave management experience can cause configuration drift and break enclave functionality:

> [!IMPORTANT]
>
> Don't edit the enclave Virtual Network, its subnets, or their delegations directly through the Azure portal, Azure CLI, or ARM/Bicep templates outside of Azure Enclave. Azure Enclave reconciles subnet delegations to its own managed configuration on every update, so manual changes can be silently overwritten or cause enclave endpoints and enclave connections to fail to provision or resolve.

Deny assignments also block most direct writes to managed resource group resources, and enabling maintenance mode allows a curated set of actions rather than a full unblock. For the exact list of actions each maintenance mode level allows, see [maintenance mode](./maintenance-mode.md). If you need to make a change that deny assignments block and that isn't covered by maintenance mode, work with Azure support rather than attempting a workaround.

## Next steps

- [What is an enclave?](./what-enclave.md)
- [What is a workload?](./what-workload.md)
- [Best practices](./best-practices.md)
- [Understand resource groups](./azure-enclave-resource-groups.md)
- [Maintenance mode](./maintenance-mode.md)
- [Access controls in enclaves](./access-controls-enclaves.md)
