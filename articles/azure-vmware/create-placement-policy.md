---
title: Create a placement policy
description: Learn how to create a placement policy in Azure VMware Solution to control the placement of virtual machines (VMs) on hosts within a cluster through the Azure portal.
ms.topic: how-to 
ms.date: 8/16/2021

#Customer intent: As an Azure service administrator, I want to control the placement of virtual machines on hosts within a cluster in my private cloud. 

---

# Create a placement policy in Azure VMware Solution

>[!IMPORTANT]
>Azure VMware Solution placement policy (Preview) is currently in preview. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In Azure VMware Solution, clusters in a private cloud are a managed resource. As a result, the cloudadmin role can't make certain changes to the cluster from the vSphere Client, including the management of Distributed Resource Scheduler (DRS) rules.

Placement policies in Azure VMware Solution let you control the placement of virtual machines (VMs) on hosts within a cluster through the Azure portal. When you create a placement policy, it includes a DRS rule in the specified vSphere cluster. It also includes additional logic for interoperability with Azure VMware Solution operations.

A placement policy has at least five required components: 

- **Name** - Defines the name of the policy and is subject to the naming constraints of [Azure Resources](../azure-resource-manager/management/resource-name-rules.md).

- **Type** - Defines the type of control you want to apply to the resources contained in the policy.

- **Cluster** - Defines the cluster for the policy. The scope of a placement policy is a vSphere cluster, so only resources from the same cluster may be part of the same placement policy.

- **State** - Defines if the policy is enabled or disabled. In certain scenarios, a policy might be disabled automatically when a conflicting rule gets created. For more information, see [Considerations](#considerations) below.

- **Virtual machine** - Defines the VMs and hosts for the policy. Depending on the type of rule you create, your policy may require you to specify some number of VMs and hosts. For more information, see [Placement policy types](#placement-policy-types) below.


## Prerequisites

You must have _Contributor_ level access to the private cloud to manage placement policies.



## Placement policy types

### VM-VM policies

**VM-VM** policies specify if selected VMs should run on the same host or kept on separate hosts.  In addition to choosing a name and cluster for the policy, **VM-VM** policies requires that you select at least two VMs to assign. The assignment of hosts isn't required or permitted for this policy type.

- **VM-VM Affinity** policies instruct DRS to try keeping the specified VMs together on the same host. It's useful for performance reasons, for example.

- **VM-VM Anti-Affinity** policies instruct DRS to try keeping the specified VMs apart from each other on separate hosts. It's useful in scenarios where a problem with one host doesn't affect multiple VMs within the same policy.


### VM-Host policies

**VM-Host** policies specify if selected VMs can run on selected hosts.  To avoid interference with platform-managed operations such as host maintenance mode and host replacement, **VM-Host** policies in Azure VMware Solution are always preferential (also known as "should" rules). Accordingly, **VM-Host** policies [may not be honored in certain scenarios](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.resmgmt.doc/GUID-793013E2-0976-43B7-9A00-340FA76859D0.html). For more information, see [Monitor the operation of a policy](#monitor-the-operation-of-a-policy) below.

Certain platform operations dynamically update the list of hosts defined in **VM-Host** policies. For example, when you delete a host that is a member of a placement policy, the host is removed if more than one host is part of that policy. Also, if a host is part of a policy and needs to be replaced as part of a platform-managed operation, the policy is updated dynamically with the new host.

In addition to choosing a name and cluster for the policy, a **VM-Host** policy requires that you select at least one VM and one host to assign to the policy.

- **VM-Host Affinity** policies instruct DRS to try running the specified VMs on the hosts defined.

- **VM-Host Anti-Affinity** policies instruct DRS to try running the specified VMs on hosts other than those defined.




## Considerations



### Cluster scale in

Azure VMware Solution attempts to prevent certain DRS rule violations from occurring when performing cluster scale-in operations.

You can't remove the last host from a VM-Host policy. However, if you need to remove the last host from the policy, you can remediate this by adding another host to the policy before removing the host from the cluster. Alternatively, you can delete the placement policy before removing the host.

You can't have a VM-VM Anti Affinity policy with more VMs than the number of hosts in a cluster. If removing a host would result in fewer hosts in the cluster than VMs, you'll receive an error preventing the operation. You can remediate this by first removing VMs from the rule and then removing the host from the cluster.


### Rule conflicts

If DRS rule conflicts are detected when you create a VM-VM policy, it results in that policy being created in a disabled state following standard [VMware DRS Rule behavior](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.resmgmt.doc/GUID-69C738B6-5FC8-4189-9CB5-DD90A5A05979.html). For more information on viewing rule conflicts, see [Monitor the operation of a policy](#monitor-the-operation-of-a-policy) below.



## Create a placement policy

Make sure to review the requirements for the [policy type](#placement-policy-types).

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies** > **+ Create**.

   >[!TIP]
   >You may also select the Cluster from the Placement Policy overview pane and then select **Create**.
   >
   >:::image type="content" source="media/placement-policies/create-placement-policy-cluster.png" alt-text="Screenshot showing an alternative option for creating a placement policy.":::



   :::image type="content" source="media/placement-policies/create-placement-policy.png" alt-text="Screenshot showing how to start the process to create a VM-VM placement policy." lightbox="media/placement-policies/create-placement-policy.png":::


1. Provide a descriptive name, select the policy type, and select the cluster where the policy is created. Then select **Enable**.

   >[!WARNING]
   >If you disable the policy, then the policy and the underlying DRS rule are created, but the policy actions are ignored until you enable the policy. 

   :::image type="content" source="media/placement-policies/create-placement-policy-vm-vm-affinity-1.png" alt-text="Screenshot showing the placement policy options." lightbox="media/placement-policies/create-placement-policy-vm-vm-affinity-1.png":::   

1. If you selected **VM-Host affinity** or **VM-Host anti-affinity** as the type, your policy requires a host to be selected. Select **+ Add host** and the hosts to include in the policy. You can select multiple hosts.

   :::image type="content" source="media/placement-policies/create-placement-policy-vm-host-affinity-2.png" alt-text="Screenshot showing the list of hosts to select.":::

1. Select **+ Add virtual machine** and the VMs to include in the policy. You can select multiple VMs.

   :::image type="content" source="media/placement-policies/create-placement-policy-vm-vm-affinity-2.png" alt-text="Screenshot showing the list of VMs to select.":::

1. Once you've finished adding the VMs you want, select **Add virtual machine**. 

1. Select **Next: Review and create** to review your policy. 

1. Select **Create policy**. If you want to make changes, select **Back: Basics**.

   :::image type="content" source="media/placement-policies/create-placement-policy-vm-vm-affinity-3.png" alt-text="Screenshot showing the placement policy settings before it's created.":::

1. After the placement policy gets created, select **Refresh** to see it in the list.

   :::image type="content" source="media/placement-policies/create-placement-policy-8.png" alt-text="Screenshot showing the placement policy as Enabled after it's created." lightbox="media/placement-policies/create-placement-policy-8.png":::



## Edit a placement policy

You can change the state of a policy, add a new resource, or unassign an existing resource.

### Change the policy state

You can change the state of a policy to **Enabled** or **Disabled**. 

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies**.

1. For the policy you want to edit, select **More** (...) and then select **Edit**.

   >[!TIP]
   >You can disable a policy from the Placement policy overview by selecting **Disable** from the Settings drop-down. You can't enable a policy from the Settings drop-down.

   :::image type="content" source="media/placement-policies/edit-placement-policy.png" alt-text="Screenshot showing how to edit a placement policy." lightbox="media/placement-policies/edit-placement-policy.png":::

1.	If the policy is enabled but you want to disable it, select **Disabled** and then select **Disabled** on the confirmation message. Otherwise, if the policy is disabled and you want to enable it, select **Enable**.

1.	Select **Review + update**. 
 
1.	Review the changes and select **Update policy**. If you want to make changes, select **Back: Basics**.


### Update the resources in a policy

You can add new resources, such as a VM or a host, to a policy or remove existing ones. 

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies**.

1. For the policy you want to edit, select **More** (...) and then **Edit**.

   :::image type="content" source="media/placement-policies/edit-placement-policy.png" alt-text="Screenshot showing how to edit the resources in a placement policy." lightbox="media/placement-policies/edit-placement-policy.png":::

   - To remove an existing resource, select the resource or resources you want to remove. Select **Unassign**, which removes the resource or resources from the list.

      :::image type="content" source="media/placement-policies/edit-placement-policy-unassign.png" alt-text="Screenshot showing how to remove an existing resource from a placement policy.":::

   - To add a new resource, select **Edit virtual machine** or **Edit host**, select the resource you'd like to add, and then select **Save**. 

1. Select **Next : Review and update**. 

1. Review the changes and select **Update policy**.  If you want to make changes, select **Back : Basics**.



## Delete a policy

You can delete a placement policy and its corresponding DRS rule. 

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies**.

1. For the policy you want to edit, select **More** (...) and then select **Delete**.

   :::image type="content" source="media/placement-policies/delete-placement-policy.png" alt-text="Screenshot showing how to delete a placement policy." lightbox="media/placement-policies/delete-placement-policy.png":::

1. Select **Delete** on the confirmation message.



## Monitor the operation of a policy

Use the vSphere Client to monitor the operation of a placement policy's corresponding DRS rule. 

As a holder of the cloudadmin role, you can view, but not edit, the DRS rules created by a placement policy on the cluster's Configure tab under VM/Host Rules. It lets you view additional information, such as if the DRS rules are in a conflict state.

Additionally, you can monitor various DRS rule operations, such as recommendations and faults, from the cluster's Monitor tab.
