---
title: Create a placement policy
description: Learn how to create a placement policy.
ms.topic: how-to 
ms.date: 8/10/2021

---



# Create a placement policy in Azure VMware Solution

In Azure VMware Solution, clusters in a private cloud are a managed resource. As a result, the cloudadmin role can't make certain changes to the cluster from the vSphere Client, including the management of Distributed Resource Scheduler (DRS) rules.

Placement policies in Azure VMware Solution allow you to control the placement of virtual machines on hosts within a cluster in your private cloud through the Azure portal. When you create a placement policy, it's comprised of a DRS rule in the specified vSphere cluster and additional logic for interoperability with Azure VMware Solution operations.

A placement policy has at least five required components: 

- **Name** - used to identify the policy and is subject to the naming constraints of [Azure Resources]().

- **Type** - defines the type of control you want to apply to the resources contained in the policy.

- **Cluster** - defines which cluster the policy should be applied to. The scope of a placement policy is a vSphere cluster, so only resources from the same cluster may be part of the same placement policy.

- **State** - defines whether the policy is enabled or disabled. In certain scenarios, a policy might be disabled automatically when a conflicting rule is created. For more information, see [Considerations](#considerations) below.

- **Virtual machine** - Depending on the type of rule you create, your policy may require you to specify some number of virtual machines (VMs) and hosts.  For more information, see [Placement policy types](#placement-policy-types) below.



## Prerequisites

You must have _Contributor_ level access to the private cloud to manage placement policies.






## Placement policy types




:::row:::
   :::column span="":::
      ### VM to VM policies
      content...
   :::column-end:::
   :::column span="":::
      VM to host policies
      content...
   :::column-end:::
:::row-end:::



## [Section 2 heading]




## [Section n heading]






## Next steps
