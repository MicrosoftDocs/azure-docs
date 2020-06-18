---
title: Concepts - Role-based access control (RBAC)
description: Learn about the key capabilities of role-based access control for Azure VMware Solution (AVS) 
ms.topic: conceptual
ms.date: 06/26/2020
---

# Role-based access control (RBAC) for Azure VMware Solution (AVS)

...include rbac information here to lead into the next part of this article...

In a vCenter and ESXi on-premises deployment, the administrator has access to the vCenter administrator@vsphere.local account and may have additional Active Directory (AD) users/groups assigned. However, in a vCenter on-premises deployment on Azure VMware Solution (AVS), the administrator does not have access to the administrator user account. The AVS private cloud user doesn’t have permission to access or configure specific management components supported and managed by Microsoft, such as clusters, hosts, datastores, distributed virtual switches, and virtual machines.

In AVS, the vCenter has a built-in local user called cloudadmin assigned to the built-in role called CloudAdmin. You use the local cloudadmin user to get started with AVS and then set up additional users in AD. The CloudAdmin role has the privilege to create and manage workloads in our private cloud (virtual machines, resource pools, datastores, and networks). In AVS, the CloudAdmin has a specific set of vCenter privileges that differ with other VMware cloud solutions.   