---
title: Know the terms of Azure BareMetal Infrastructure
description: Know the terms of Azure BareMetal Infrastructure.
ms.topic: conceptual
ms.date: 12/31/2020
---

# Know the terms for BareMetal Infrastructure

In this article, we'll cover some important BareMetal terms.

- **Revision**: There are two different stamp revisions for BareMetal Instance stamps. Each version differs in architecture and proximity to Azure virtual machine hosts:
	- **Revision 3** (Rev 3): is the original design.
	- **Revision 4** (Rev 4): is a new design that provides closer proximity to the Azure virtual machine (VM) hosts and lowers the latency between Azure VMs and BareMetal Instance units. 
	- **Revision 4.2** (Rev 4.2): is the latest rebranded BareMetal Infrastructure that uses the existing Rev 4 architecture. You can access and manage your BareMetal instances through the Azure portal.  

- **Stamp**: Defines the Microsoft internal deployment size of BareMetal Instances. Before instance units can get deployed, a BareMetal Instance stamp consisting out of compute, network, and storage racks must be deployed in a datacenter location. Such a deployment is called a BareMetal Instance stamp or from Revision 4.2.

- **Tenant**: A customer deployed in BareMetal Instance stamp gets isolated into a *tenant.* A tenant is isolated in the networking, storage, and compute layer from other tenants. Storage and compute units assigned to the different tenants can't see each other or communicate with each other on the BareMetal Instance stamp level. A customer can choose to have deployments into different tenants. Even then, there's no communication between tenants on the BareMetal Instance stamp level.

## Next steps
Learn how to identify and interact with BareMetal Instance units through the [Azure portal](workloads/sap/baremetal-infrastructure-portal.md).


 