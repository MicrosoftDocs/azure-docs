---
title: Know the terms of Azure BareMetal Infrastructure
description: Know the terms of Azure BareMetal Infrastructure.
ms.topic: conceptual
ms.date: 1/4/2021
ms.subservice: baremetal-infrastructure
---

# Know the terms for BareMetal Infrastructure

In this article, we'll cover some important BareMetal terms.

- **Revision**: There's an original stamp revision known as Revision 3 (Rev 3), and two different stamp revisions for BareMetal Instance stamps. Each stamp differs in architecture and proximity to Azure virtual machine hosts:
    - **Revision 4** (Rev 4): a newer design that provides closer proximity to the Azure virtual machine (VM) hosts and lowers the latency between Azure VMs and BareMetal Instance units. 
    - **Revision 4.2** (Rev 4.2): the latest rebranded BareMetal Infrastructure using the existing Rev 4 architecture. Rev 4 provides closer proximity to the Azure virtual machine (VM) hosts. It has significant improvements in network latency between Azure VMs and BareMetal instance units deployed in Rev 4 stamps or rows. You can access and manage your BareMetal instances through the Azure portal.    

- **Stamp**: Defines the Microsoft internal deployment size of BareMetal Instances. Before instance units can get deployed, a BareMetal Instance stamp consisting of compute, network, and storage racks must be deployed in a datacenter location. Such a deployment is called a BareMetal Instance stamp or from Revision 4.2.

- **Tenant**: A customer deployed in BareMetal Instance stamp gets isolated into a *tenant.* A tenant is isolated in the networking, storage, and compute layer from other tenants. Storage and compute units assigned to the different tenants can't see each other or communicate with each other on the BareMetal Instance stamp level. A customer can choose to have deployments into different tenants. Even then, there's no communication between tenants on the BareMetal Instance stamp level.

## Next steps
Learn more about the [BareMetal Infrastructure](concepts-baremetal-infrastructure-overview.md) or how to [identify and interact with BareMetal Instance units](connect-baremetal-infrastructure.md). 