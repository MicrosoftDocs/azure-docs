---
title: Create placement policy
description: Learn how to create a placement policy in Azure VMware Solution to control the placement of virtual machines (VMs) on hosts within a cluster through the Azure portal.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 04/07/2022

#Customer intent: As an Azure service administrator, I want to control the placement of virtual machines on hosts within a cluster in my private cloud. 

---

# Create a placement policy in Azure VMware Solution

In Azure VMware Solution, clusters in a private cloud are a managed resource. As a result, the CloudAdmin role can't make certain changes to the cluster from the vSphere Client, including the management of Distributed Resource Scheduler (DRS) rules.

The placement policy feature is available in all Azure VMware Solution regions. 
Placement policies let you control the placement of virtual machines (VMs) on hosts within a cluster through the Azure portal. 
When you create a placement policy, it includes a DRS rule in the specified vSphere cluster. 
It also includes additional logic for interoperability with Azure VMware Solution operations.

A placement policy has at least five required components: 

- **Name** - Defines the name of the policy and is subject to the naming constraints of [Azure Resources](../azure-resource-manager/management/resource-name-rules.md).

- **Type** - Defines the type of control you want to apply to the resources contained in the policy.

- **Cluster** - Defines the cluster for the policy. The scope of a placement policy is a vSphere cluster, so only resources from the same cluster may be part of the same placement policy.

- **State** - Defines if the policy is enabled or disabled. In certain scenarios, a policy might be disabled automatically when a conflicting rule gets created. For more information, see [Considerations](#considerations) below.

- **Virtual machine** - Defines the VMs and hosts for the policy. Depending on the type of rule you create, your policy may require you to specify some number of VMs and hosts. For more information, see [Placement policy types](#placement-policy-types) below.


## Prerequisite

You must have _Contributor_ level access to the private cloud to manage placement policies.


## Placement policy types

### VM-VM policies

**VM-VM** policies specify if selected VMs should run on the same host or must be kept on separate hosts. 
In addition to choosing a name and cluster for the policy, **VM-VM** policies require that you select at least two VMs to assign. 
The assignment of hosts isn't required or permitted for this policy type.

- **VM-VM Affinity** policies instruct DRS to try to keeping the specified VMs together on the same host. It's useful for performance reasons, for example.

- **VM-VM Anti-Affinity** policies instruct DRS to try keeping the specified VMs apart from each other on separate hosts. It's useful in availability scenarios where a problem with one host doesn't affect multiple VMs within the same policy.


### VM-Host policies

**VM-Host** policies specify if selected VMs can run on selected hosts.  To avoid interference with platform-managed operations such as host maintenance mode and host replacement, **VM-Host** policies in Azure VMware Solution are always preferential (also known as "should" rules). Accordingly, **VM-Host** policies [may not be honored in certain scenarios](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.resmgmt.doc/GUID-793013E2-0976-43B7-9A00-340FA76859D0.html). For more information, see [Monitor the operation of a policy](#monitor-the-operation-of-a-policy) below.

Certain platform operations dynamically update the list of hosts defined in **VM-Host** policies. For example, when you delete a host that is a member of a placement policy, the host is removed if more than one host is part of that policy. Also, if a host is part of a policy and needs to be replaced as part of a platform-managed operation, the policy is updated dynamically with the new host.

In addition to choosing a name and cluster for the policy, a **VM-Host** policy requires that you select at least one VM and one host to assign to the policy.

- **VM-Host Affinity** policies instruct DRS to try running the specified VMs on the hosts defined.

- **VM-Host Anti-Affinity** policies instruct DRS to try running the specified VMs on hosts other than those defined.


## Considerations

### Cluster scale in

Azure VMware Solution attempts to prevent certain DRS rule violations from occurring when performing cluster scale-in operations.

You can't remove the last host from a VM-Host policy. However, if you need to remove the last host from the policy, you can remediate it by adding another host to the policy before removing the host from the cluster. Alternatively, you can delete the placement policy before removing the host.

You can't have a VM-VM Anti Affinity policy with more VMs than the number of hosts in a cluster. If removing a host would result in fewer hosts in the cluster than VMs, you'll receive an error preventing the operation. You can remediate it by first removing VMs from the rule and then removing the host from the cluster.


### Rule conflicts

If DRS rule conflicts are detected when you create a VM-VM policy, it results in that policy being created in a disabled state following standard [VMware DRS Rule behavior](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.resmgmt.doc/GUID-69C738B6-5FC8-4189-9CB5-DD90A5A05979.html). For more information on viewing rule conflicts, see [Monitor the operation of a policy](#monitor-the-operation-of-a-policy) below.



## Create a placement policy

There is no defined limit to the number of policies that you create. However, the more placement constraints you create, the more challenging it is for vSphere DRS to effectively move virtual machines within the cluster and provide the resources needed by the workloads.      

Make sure to review the requirements for the [policy type](#placement-policy-types).

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies** > **+ Create**.

   >[!TIP]
   >You may also select the Cluster from the Placement Policy overview pane and then select **Create**.
   >



1. Provide a descriptive name, select the policy type, and select the cluster where the policy is created. Then select **Enabled**.

   >[!WARNING]
   >If you disable the policy, then the policy and the underlying DRS rule are created, but the policy actions are ignored until you enable the policy. 


1. If you selected **VM-Host affinity** or **VM-Host anti-affinity** as the type, select **+ Add hosts** and the hosts to include in the policy. You can select multiple hosts.

   >[!NOTE]
   >The select hosts pane shows how many VM-Host policies are associated with the host and the total number of VMs contained in those associated policies.
   >

1. Select **+ Add virtual machine** and the VMs to include in the policy. You can select multiple VMs.

   
   >[!NOTE]
   >The select hosts pane shows how many VM-Host policies are associated with the host and the total number of VMs contained in those associated policies. 

1. Once you've finished adding the VMs you want, select **Add virtual machines**. 

1. Select **Next: Review and create** to review your policy. 

1. Select **Create policy**. If you want to make changes, select **Back: Basics**.

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

1.	If the policy is enabled but you want to disable it, select **Disabled** and then select **Disabled** on the confirmation message. Otherwise, if the policy is disabled and you want to enable it, select **Enable**.

1.	Select **Review + update**. 
 
1.	Review the changes and select **Update policy**. If you want to make changes, select **Back: Basics**.


### Update the resources in a policy

You can add new resources, such as a VM or a host, to a policy or remove existing ones. 

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies**.

1. For the policy you want to edit, select **More** (...) and then **Edit**.   
To remove an existing resource, select one or more resources you want to remove and select **Unassign**.    
To add a new resource, select **Edit virtual machine** or **Edit host**, select the resource you'd like to add, and then select **Save**. 

1. Select **Next : Review and update**. 

1. Review the changes and select **Update policy**.  If you want to make changes, select **Back : Basics**.


## Delete a policy

You can delete a placement policy and its corresponding DRS rule. 

1. In your Azure VMware Solution private cloud, under **Manage**, select **Placement policies**.

1. For the policy you want to edit, select **More** (...) and then select **Delete**.
1. Select **Delete** on the confirmation message.

## Monitor the operation of a policy

Use the vSphere Client to monitor the operation of a placement policy's corresponding DRS rule. 

As a holder of the CloudAdmin role, you can view, but not edit, the DRS rules created by a placement policy on the cluster's Configure tab under VM/Host Rules. It lets you view additional information, such as if the DRS rules are in a conflict state.

Additionally, you can monitor various DRS rule operations, such as recommendations and faults, from the cluster's Monitor tab.

## Restrict VM Movement

For certain extremely sensitive applications vMotion may cause unexpected service interruptions or disruptions. 
For these types of applications, it may be desirable to restrict VM movement to manually-initiated vMotion only. 
With the Restrict VM movement Placement Policy, DRS-initiated vMotions can be disabled. 
For most workloads this is not necessary and may cause unintended performance impacts due to noisy neighbors on the same host. 

### Enable Restricted VM movement for specific VMs

1. Navigate to Manage Placement policies and click Restrict VM movement. 
1. Select the VM or VMs you want to restrict, then click Select.
1. The VM or VMS you selected appears in the VMs with restricted movement tab.   
In the vSphere Client, a VM override will be created to set DRS to partially automated for that VM.    
DRS will no longer migrate the VM automatically.    
Manual vMotion of the VM and automatic initial placement of the VM will continue to function.  

## FAQs

### Are placement policies the same as DRS affinity rules?
Yes, and no. While vSphere DRS implements the current set of policies, we have simplified the experience. Modifying VM groups and Host groups are a cumbersome operation, especially as hosts are ephemeral in nature and could be replaced in a cloud environment. As hosts are replaced in the vSphere inventory in an on-premises environment, the vSphere admin must modify the host group to ensure that the desired VM-Host placement constraints remain in effect. Placement policies in Azure VMware Solution update the Host groups when a host is rotated or changed. Similarly, if you scale in a cluster, the Host Group is automatically updated, as applicable. This eliminates the overhead of managing the Host Groups for the customer.


### As this is an existing functionality available in vCenter, why can't I use it directly? 

Azure VMware Solution provides a VMware private cloud in Azure. In this managed VMware infrastructure, Microsoft manages the clusters, hosts, datastores, and distributed virtual switches in the private cloud. At the same time, the tenant is responsible for managing the workloads deployed on the private cloud. As a result, the tenant administering the private cloud [does not have the same set of privileges](concepts-identity.md) as available to the VMware administrator in an on-premises deployment. 

Further, the lack of the desired granularity in the vSphere privileges presents some challenges when managing the placement of the workloads on the private cloud. For example, vSphere DRS rules commonly used on-premises to define affinity and anti-affinity rules can't be used as-is in an Azure VMware Solution environment, as some of those rules can block day-to-day operation the private cloud. Placement Policies provides a way to define those rules using the Azure VMware Solution portal, thereby circumventing the need to use DRS rules. Coupled with a simplified experience, they also ensure that the rules don't impact the day-to-day infrastructure maintenance and operation activities. 

###  What is the difference between the VM-Host affinity policy and Restrict VM movement?

A VM-Host affinity policy is used to restrict the movement of VMs to a group of hosts included in the VM-Host affinity policy. Thus, a VM can be vMotioned within the set of hosts selected in the VM-Host affinity policy. Alternatively, **Restrict VM movement** ensures that the selected VM remains on the host on which it currently resides.

###  What caveats should I know about?

The VM-Host **MUST** rules aren't supported because they block maintenance operations. 

VM-Host **SHOULD** rules are preferential rules, where vSphere DRS tries to accommodate the rules to the extent possible. Occasionally, vSphere DRS may vMotion VMs subjected to the VM-Host **SHOULD** rules to ensure that the workloads get the resources they need. It's a standard vSphere DRS behavior, and the Placement policies feature does not change the underlying vSphere DRS behavior.

If you create conflicting rules, those conflicts may show up on the vCenter Server, and the newly defined rules may not take effect. It's a standard vSphere DRS behavior, the logs for which can be observed in the vCenter Server.

