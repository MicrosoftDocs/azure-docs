---
title: Best practices for using and administering Azure Modeling and Simulation Workbench
description: Learn best practices and helpful guidance when working with Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: best-practice
ms.date: 10/06/2024

#customer intent: As a user of Azure Modeling and Simulation Workbench, I want to learn best practices so that I can efficiently and effectively use and administer.

---

# Best practices for Azure Modeling and Simulation Workbench

The Azure Modeling and Simulation Workbench is a cloud-based collaboration platform that provides secure, isolated chambers to allow enterprises to work in the cloud. Modeling and Simulation Workbench provides a large selection of powerful, virtual machines (VM) and high-performance scalable storage and provides control and oversight to what users can export from the platform.

This best practices article provides both users and administrators guidance on how to get the most from the platform, control costs, and work effectively.

## Control costs with chamber idle mode

When a chamber won't be used in the immediate future, [place it into idle mode](./how-to-guide-chamber-idle.md). Idling a chamber significantly reduces costs. For more information, see the [pricing guide](https://azure.microsoft.com/pricing/details/modeling-and-simulation-workbench/#pricing). Idle mode doesn't delete your VMs or storage, but does terminate desktop sessions and chamber license servers.

## Review user allocation to chambers to control cost

Modeling and Simulation Workbench prices chamber access through 10-Pack user connectivity. If your user count increases beyond a multiple of 10, another user pack is added. Review your user allocations to ensure your costs are optimized. For more information, see the [pricing guide](https://azure.microsoft.com/pricing/details/modeling-and-simulation-workbench/#pricing).

## Use an Azure naming resource convention

Depending on complexity, workbenches can have many resources. Adopting a naming convention can help you effectively manage your deployment. The Azure Cloud Adoption Framework has a [naming convention](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming) to help you get started.

## Key Vaults best practices

Modeling and Simulation Workbench uses [Key Vaults](/azure/key-vault/general/basic-concepts) to store authentication identifiers. See the [Azure Key Vault best practices guide](/azure/key-vault/general/best-practices) for other guidance on effectively using a Key Vault in Azure.

### Use separate Key Vault to broaden security perimeters

Use separate Key Vault for every workbench or assigned group of administrators to help keep your deployment secure. If user credentials or a perimeter is breached, a separate key vault for workbenches can reduce impact.

### Assign two or more Key Vault Secrets Officers

The role of **Secrets Officers** is assigned to the **Workbench Owner** who is tasked with creating and administering the workbench environment. Designating at least two secrets officers can reduce downtime if secrets need to be administered and one administrator isn't available. Consider using Azure Groups to assign this role.

## Use the right storage for the task

Modeling and Simulation Workbench offers several types and tiers for storage. For more information, see the [storage overview](./concept-storage.md).

* Don't save or perform critical work in home directories. Home directories are deleted anytime users are dropped from chambers. Additionally, if you delete users to manage user pack costs, those home directories are deleted. Home directories are intended for resource files or temporary work.
* Chamber storage is the best place to store vital data and perform application workloads. Chamber storage is high-performance with two different performance tiers and scalable. You can learn how to manage chamber storage in [chamber storage how-to](./how-to-guide-manage-chamber-storage.md).
* Don't place information that shouldn't be shared with other chambers in shared storage. Shared storage is visible to all users of the member chambers.
* If you plan on idling the chamber and are looking to save cost, create a standard tier of chamber storage and move all files there.

## Using application registrations in Microsoft Entra and Modeling and Simulation Workbench

### Choose a meaningful management approach for application registrations

Application registrations can easily accumulate in an organization and be forgotten, becoming difficult to manage. Use a meaningful name for application registrations made for Modeling and Simulation Workbench to identify it later. Assign at least two or more owners or consider using an Azure Group to assign ownership.

### Manage application registration secrets

Use a reasonable expiration date for the application secret created. Refer to your organizations rules on application password lifetime.

### Reuse application registrations across related deployments

Application registrations are authentication brokers for the Modeling and Simulation Workbench. Identity and Access Management (IAM) at the chamber level is responsible for this access. You can use fewer application registrations where it makes sense to do so based on region, user base, project, or security boundaries.

### Delete redirect URIs when deleting connectors

Connectors generate two distinct redirect URIs when created. Anytime you're deleting or rebuilding a connector, delete the associated redirect URI from the application registration.

## Related content

* [Manage chamber storage in Azure Modeling and Simulation Workbench](how-to-guide-manage-chamber-storage.md)
* [Manage users in Azure Modeling and Simulation Workbench](how-to-guide-manage-users.md)
* [Manage chamber idle mode](how-to-guide-chamber-idle.md)
