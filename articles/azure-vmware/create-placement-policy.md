---
title: Create a placement policy
description: Learn how to create a placement policy.
ms.topic: how-to 
ms.date: 8/10/2021

#Customer intent: As an Azure service administrator, I want < what? > so that < why? >.

---

# Create a placement policy in Azure VMware Solution

In Azure VMware Solution, clusters in a private cloud are a managed resource. As a result, the cloudadmin role can't make certain changes to the cluster from the vSphere Client, including the management of Distributed Resource Scheduler (DRS) rules.

Placement policies in Azure VMware Solution allow you to control the placement of virtual machines on hosts within a cluster in your private cloud through the Azure portal. When you create a placement policy, it's comprised of a DRS rule in the specified vSphere cluster and additional logic for interoperability with Azure VMware Solution operations.

A placement policy has at least five required components: 

- **Name** - Defines the name of the policy and is subject to the naming constraints of [Azure Resources]().

- **Type** - Defines the type of control you want to apply to the resources contained in the policy.

- **Cluster** - Defines which cluster the policy should be applied to. The scope of a placement policy is a vSphere cluster, so only resources from the same cluster may be part of the same placement policy.

- **State** - Defines whether the policy is enabled or disabled. In certain scenarios, a policy might be disabled automatically when a conflicting rule is created. For more information, see [Considerations](#considerations) below.

- **Virtual machine** - Defines the virtual machines (VMs) and hosts for the policy. Depending on the type of rule you create, your policy may require you to specify some number of virtual machines (VMs) and hosts. For more information, see [Placement policy types](#placement-policy-types) below.



## Prerequisites

You must have _Contributor_ level access to the private cloud to manage placement policies.



## Placement policy types

### VM to VM policies

VM to VM policies specify whether selected virtual machines should run on the same host or be kept on separate hosts.

In addition to choosing a name and cluster for the policy, a VM to VM policy requires you to select at least two virtual machines to assign to the policy. The assignment of hosts is not required or permitted for this policy type.

A VM-VM Affinity policy instructs DRS to try to keep the specified virtual machines together on the same host. This can be useful for performance reasons, for example.

A VM-VM Anti-Affinity policy instructs DRS to try to keep the specified virtual machines apart from each other on separate hosts. This can be useful in scenarios where a problem occurring with one host doesn’t affect multiple virtual machines within the same policy.


### VM to host policies

VM to Host polices are used to specify whether or not selected virtual machines can run on selected hosts. 
In order to avoid interference with platform managed operations such as host maintenance mode and host replacement, VM to host policies in Azure VMware Solution are always preferential (also known as "should" rules). Accordingly, VM to Host policies may not be honored in certain scenarios. See the monitoring section for more information.

Certain platform operations will dynamically update the list of hosts defined in VM to Host policies. For example, when you delete a host that is a member of a placement policy, the host will be removed from policy if more than one host is part of that policy. Also, if a host is part of a policy and needs to be replaced as part of platform managed operation, the policy is updated dynamically with the new host.

In addition to choosing a name and cluster for the policy, a VM to Host policy requires you to select at least one virtual machine and one host to assign to the policy.

A VM-Host Affinity policy instructs DRS to try to run the specified virtual machines on the hosts defined in the policy.

A VM-Host Anti-Affinity policy instructs DRS to try to run the specified virtual machines on hosts other than those defined in the policy.




## Considerations



### Host replacement


### Cluster scale in

AVS will attempt to prevent certain DRS rule violations from occurring when performing cluster scale-in operations.
You can't remove the last host from a VM-Host policy. If you need to remove the last host from the policy, you can remediate this by adding another host to the policy prior to removing the host from the cluster. Alternatively, you can delete the placement policy prior to removing the host. 

You can't have a VM-VM Anti Affinity policy with more virtual machines than number of hosts in cluster. If the removal of a host would result in fewer hosts in the cluster than virtual machines, then you will receive an error preventing the operation. You can remediate this by first removing virtual machines from the rule and then removing the host from the cluster.


### Rule conflicts

Portal will flag these on creation and will disable a conflicting rule (add more info).

## Create a policy



## Edit a policy


### Change the policy state


### Update the resources in a policy


## Delete a policy


## Monitor the operation of a policy






## Next steps
