---
title: Create a placement policy
description: Learn how to create a placement policy.
ms.topic: how-to 
ms.date: 8/10/2021

#Customer intent: As an Azure service administrator, I want control the placement of virtual machines on hosts within a cluster in my private cloud. 

---

# Create a placement policy in Azure VMware Solution

In Azure VMware Solution, clusters in a private cloud are a managed resource. As a result, the cloudadmin role can't make certain changes to the cluster from the vSphere Client, including the management of Distributed Resource Scheduler (DRS) rules.

Placement policies in Azure VMware Solution let you control the placement of virtual machines (VMs) on hosts within a cluster in your private cloud through the Azure portal. When you create a placement policy, it's comprised of a DRS rule in the specified vSphere cluster and additional logic for interoperability with Azure VMware Solution operations.

A placement policy has at least five required components: 

- **Name** - Defines the name of the policy and is subject to the naming constraints of [Azure Resources](../azure-resource-manager/management/resource-name-rules.md).

- **Type** - Defines the type of control you want to apply to the resources contained in the policy.

- **Cluster** - Defines the cluster for the policy. The scope of a placement policy is a vSphere cluster, so only resources from the same cluster may be part of the same placement policy.

- **State** - Defines whether the policy is enabled or disabled. In certain scenarios, a policy might be disabled automatically when a conflicting rule gets created. For more information, see [Considerations](#considerations) below.

- **Virtual machine** - Defines the VMs and hosts for the policy. Depending on the type of rule you create, your policy may require you to specify some number of VMs and hosts. For more information, see [Placement policy types](#placement-policy-types) below.


## Prerequisites

You must have _Contributor_ level access to the private cloud to manage placement policies.



## Placement policy types

### VM-VM policies

**VM-VM** policies specify whether selected VMs should run on the same host or be kept on separate hosts.  In addition to choosing a name and cluster for the policy, **VM-VM** policies requires that you select at least two VMs to assign. The assignment of hosts is not required or permitted for this policy type.

- **VM-VM Affinity** policies instruct DRS to try keeping the specified VMs together on the same host. It's useful for performance reasons, for example.

- **VM-VM Anti-Affinity** policies instruct DRS to try keeping the specified VMs apart from each other on separate hosts. It's useful in scenarios where a problem with one host doesn't affect multiple VMs within the same policy.


### VM-Host policies

**VM-Host** policies specify whether or not selected VMs can run on selected hosts.  To avoid interference with platform-managed operations such as host maintenance mode and host replacement, **VM-Host** policies in Azure VMware Solution are always preferential (also known as "should" rules). Accordingly, **VM-Host** policies may not be honored in certain scenarios. For more information, see [Monitor the operation of a policy](#monitor-the-operation-of-a-policy) below.

Certain platform operations will dynamically update the list of hosts defined in **VM-Host** policies. For example, when you delete a host that is a member of a placement policy, the host is removed if more than one host is part of that policy. Also, if a host is part of a policy and needs to be replaced as part of a platform-managed operation, the policy is updated dynamically with the new host.

In addition to choosing a name and cluster for the policy, a **VM-Host** policy requires that you select at least one VM and one host to assign to the policy.

- **VM-Host Affinity** policies instruct DRS to try running the specified VMs on the hosts defined.

- **VM-Host Anti-Affinity** policies instruct DRS to try running the specified VMs on hosts other than those defined.




## Considerations



### Cluster scale in

Azure VMware Solution attempts to prevent certain DRS rule violations from occurring when performing cluster scale-in operations.

You can't to have a VM-VM Anti Affinity policy with more VMs than the number of hosts in a cluster. If removing a host would result in fewer hosts in the cluster than VMs, you'll receive an error preventing the operation. You can remediate this by first removing VMs from the rule and then removing the host from the cluster.


### Rule conflicts

If DRS rule conflicts are detected when you create a VM-VM policy, it results in that policy being created in a disabled state following standard [VMware DRS Rule behavior](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.resmgmt.doc/GUID-69C738B6-5FC8-4189-9CB5-DD90A5A05979.html). For more information on viewing rule conflicts, see [Monitor the operation of a policy](#monitor-the-operation-of-a-policy) below.



## Create a policy

>[!NOTE]
>Make sure to review the requirements for the [policy type](#placement-policy-types).

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies** > **Add placement policy**.

   :::image type="content" source="media/placement-policies/add-placement-policy-1.png" alt-text="Screenshot showing " lightbox="media/placement-policies/add-placement-policy-1.png":::

1. Provide a descriptive name, select the policy type, and then select the cluster where the policy is being created.

   :::image type="content" source="media/placement-policies/add-placement-policy-2.png" alt-text="Screenshot showing the Create new policy options.":::

   >[!NOTE]
   >You may also select the Cluster from the Placement Policy overview pane before selecting ‘+ Add placement policy’

1. Select **Yes** to Enable the policy.  

   >[!TIP]
   >If you select **No**, the policy and underlying DRS rule are created, but the policy actions are ignored until you enable the policy. 

1. Select **Add virtual machine** and then select the VMs to include in the policy. You can select multiple VMs.

   :::image type="content" source="media/placement-policies/placement-policy-select-virtual-machine.png" alt-text="Screenshot showing the list of virtual machines to select.":::   

1. If you see the **Add host** option, your policy type requires a host to be selected.  Select **Add host** and select the host to include in the policy. You can select multiple hosts.

   >[!NOTE]
   >Associated policies & virtual machines blurb next to host - explain 

1. Select **Next: Review + create** to review your policy. 

   >[!TIP]
   >If you want to make changes, select **Back : Basics**.

1. Select **Create policy**. 




## Edit a policy

You can change the state of a policy, add a new VM, or unassign an existing VM.

### Change the policy state

You can change the state of a policy to enabled or disabled. 

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies**.

1. For the policy you want to edit, select **Settings** (:::image type="icon" source="media/icon-cog-wheel.png":::) and then select **Edit**.

   >[!TIP]
   >You can disable a policy directly by selecting **Disable**. 

1. Select either the **Enable** or **Disable** option and then select **Review + update**. 

   >[!TIP]
   >If you want to make changes, select **Back : Basics**.

1. Review the changes and select **Update**.  



### Update the resources in a policy

You can add new resources to a policy or remove existing ones. 

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies**.

1. For the policy you want to edit, select **Settings** (:::image type="icon" source="media/icon-cog-wheel.png":::) and then select **Edit**.

   - To remove an existing resource, select the VM and then select **Unassign**.  You can remove multiple resources.

   - To add a new resource, select **Edit virtual machine** or **Edit host**, select the resource you'd like to add, and then select **Save**. 

1. Select **Next : Review + update**. 

   >[!TIP]
   >If you want to make changes, select **Back : Basics**.

1. Review the changes and select **Update**.  



## Delete a policy

You can delete a placement policy and its corresponding DRS rule. 

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies**.

1. For the policy you want to edit, select **Settings** (:::image type="icon" source="media/icon-cog-wheel.png":::) and then select **Delete**.

1. Select **Delete** on the confirmation message.



## Monitor the operation of a policy

Use the vSphere Client to monitor the operation of a placement policy's corresponding DRS rule. 

As a holder of the cloudadmin role, you can view, but not edit, the DRS rules created by a placement policy on the cluster's Configure tab under VM/Host Rules. This allows you to view some additional information, such as whether the DRS rules are in a conflict state.

Additionally, you can monitor various DRS rule operations, such as recommendations and faults, from the cluster's Monitor tab.


## Next steps

[what could we put here for the next steps?]