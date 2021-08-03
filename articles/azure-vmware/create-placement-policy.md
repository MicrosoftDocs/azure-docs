---
title: Create a placement policy
description: Learn how to create a placement policy.
ms.topic: how-to 
ms.date: 8/10/2021

---



# Create a placement policy in Azure VMware Solution

In Azure VMware Solution, clusters in a private cloud are a managed resource. As a result, the cloudadmin role can't make certain changes to the cluster from the vSphere Client, including the management of Distributed Resource Scheduler (DRS) rules.

Placement policies in Azure VMware Solution allow you to control the placement of virtual machines on hosts within a cluster in your private cloud through the Azure portal. When you create a placement policy, it's comprised of a DRS rule in the specified vSphere cluster and additional logic for interoperability with Azure VMware Solution operations.

A placement policy has at least five required components: name, type, cluster, state, and at least one virtual machine. Certain policy types will also require a host to be defined. The name is a descriptive name used to identify the policy. The name of your policy is subject to the naming constraints of Azure Resources. The type defines what type of control you want to apply to the resources contained in the policy. For more information, see [Policy types](#policy-types) below.



## Prerequisites

You must have _Contributor_ level access to the private cloud to manage placement policies.






## [Section 1 heading]




## [Section 2 heading]




## [Section n heading]






## Next steps
