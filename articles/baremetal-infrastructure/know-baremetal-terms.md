---
title: Know the terms of Azure BareMetal Infrastructure
description: Know the terms of Azure BareMetal Infrastructure.
ms.topic: conceptual
ms.subservice: workloads
ms.date: 04/06/2021
---

# Know the terms for BareMetal Infrastructure

In this article, we'll cover some important terms related to the BareMetal Infrastructure.

- **Revision**: There are two different stamp revisions for BareMetal Infrastructure (HANA Large Instance) stamps. These differ in architecture and proximity to Azure virtual machine hosts:
    - "Revision 3" (Rev 3): The original design deployed mid-2016.
    - "Revision 4.2" (Rev 4.2): A new design that provides closer proximity to Azure virtual machine hosts, with ultra-low network latency between Azure VMs and HANA Large Instances. Resources in the Azure portal are referred to as "BareMetal Infrastructure," and customers can access their resources as BareMetal instances from the Azure portal.

- **Stamp**: Defines the Microsoft internal deployment size of BareMetal instances. Before instances can be deployed, a BareMetal instance stamp consisting of compute, network, and storage racks must be deployed in a datacenter location. Such a deployment is called a BareMetal instance stamp.

- **Tenant**: A customer deploying a BareMetal instance stamp gets isolated as a *tenant.* A tenant is isolated in the networking, storage, and compute layer from other tenants. Storage and compute units assigned to the different tenants can't see each other or communicate with each other on the BareMetal instance stamp level. A customer can choose to have deployments into different tenants. Even then, there's no communication between tenants on the BareMetal instance stamp level.

## Next steps

Now that you've been introduced to important terminology of the BareMetal Infrastructure, you may want to learn about:
- More details of the [BareMetal Infrastructure](concepts-baremetal-infrastructure-overview.md).
- How to [Connect BareMetal Infrastructure instances in Azure](connect-baremetal-infrastructure.md).

