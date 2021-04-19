---
title: Know the terms of Azure BareMetal Infrastructure
description: Know the terms of Azure BareMetal Infrastructure.
ms.topic: conceptual
ms.subservice: workloads
ms.date: 04/06/2021
---

# Know the terms for BareMetal Infrastructure

In this article, we'll cover some important terms related to the BareMetal Infrastructure.

- **Revision**: There's an original stamp revision known as Revision 3 (Rev 3), and two additional stamp revisions for BareMetal instance stamps. Each stamp differs in architecture and proximity to Azure virtual machine hosts:
    - **Revision 4** (Rev 4): A newer design that provides closer proximity to the Azure virtual machine (VM) hosts and lowers the latency between Azure VMs and SAP HANA instances. 
    - **Revision 4.2** (Rev 4.2): The latest rebranded BareMetal Infrastructure using the existing Rev 4 architecture. Rev 4 provides closer proximity to the Azure virtual machine (VM) hosts. It has significant improvements in network latency between Azure VMs and BareMetal instances deployed in Rev 4 stamps or rows. You can access and manage your BareMetal instances through the Azure portal.    

- **Stamp**: Defines the Microsoft internal deployment size of BareMetal instances. Before instances can be deployed, a BareMetal instance stamp consisting of compute, network, and storage racks must be deployed in a datacenter location. Such a deployment is called a BareMetal instance stamp.

- **Tenant**: A customer deploying a BareMetal instance stamp gets isolated as a *tenant.* A tenant is isolated in the networking, storage, and compute layer from other tenants. Storage and compute units assigned to the different tenants can't see each other or communicate with each other on the BareMetal instance stamp level. A customer can choose to have deployments into different tenants. Even then, there's no communication between tenants on the BareMetal instance stamp level.

## Next steps

Now that you've been introduced to important terminology of the BareMetal Infrastructure, you may want to learn about:
- More details of the [BareMetal Infrastructure](concepts-baremetal-infrastructure-overview.md).
- How to [Connect BareMetal Infrastructure instances in Azure](connect-baremetal-infrastructure.md).

