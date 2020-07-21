---
title: Concepts - Role-based access control (RBAC)
description: Learn about the key capabilities of role-based access control for Azure VMware Solution (AVS) 
ms.topic: conceptual
ms.date: 06/30/2020
---

# Role-based access control (RBAC) for Azure VMware Solution (AVS)

In a vCenter and ESXi on-premises deployment, the administrator has access to the vCenter administrator@vsphere.local account and may have additional Active Directory (AD) users/groups assigned. However, in an Azure VMware Solution (AVS) deployment, the administrator doesn't have access to the administrator user account but can assign AD users and groups to the CloudAdmin role on vCenter.  Also, the AVS private cloud user doesn't have permission to access or configure specific management components supported and managed by Microsoft, such as clusters, hosts, datastores, and distributed virtual switches.


In AVS, vCenter has a built-in local user called cloudadmin that is assigned to the built-in CloudAdmin role. The local cloudadmin user is used to set up additional users in AD. The CloudAdmin role, in general, has the privilege to create and manage workloads in your private cloud (virtual machines, resource pools, datastores, and networks). The CloudAdmin role in AVS has a specific set of vCenter privileges that differ from other VMware cloud solutions.   

> [!NOTE]
> AVS currently does not offer custom roles on vCenter or the AVS portal. 

## AVS CloudAdmin role on vCenter

You can view the privileges granted to the AVS CloudAdmin role on your AVS private cloud vCenter.

1. Log into the SDDC vSphere Client and go to **Menu** > **Administration**.
1. Under **Access Control**, select **Roles**.
1. From the list of roles, select **CloudAdmin** and then select **Privileges**. 

   :::image type="content" source="media/rbac-cloudadmin-role-privileges.png" alt-text="How to view the CloudAdmin role privileges in vSphere Client":::

The CloudAdmin role in AVS has the following privileges on vCenter. Refer to the [VMware product documentation](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-ED56F3C4-77D0-49E3-88B6-B99B8B437B62.html) for a detailed explanation of each privilege.

| Privilege | Description |
| --------- | ----------- |
| **Alarms** | Acknowledge alarm<br />Create alarm<br />Disable alarm action<br />Modify alarm<br />Remove alarm<br />Set alarm status |
| **Permissions** | Modify permissions |
| **Content Library** | Add library item<br />Create a subscription for a published library<br />Create local library<br />Create subscribed library<br />Delete library item<br />Delete local library<br />Delete subscribed library<br />Delete subscription of a published library<br />Download files<br />Evict library items<br />Evict subscribed library<br />Import storage<br />Probe subscription information<br />Publish a library item to its subscribers<br />Publish a library to its subscribers<br />Read storage<br />Sync library item<br />Sync subscribed library<br />Type introspection<br />Update configuration settings<br />Update files<br />Update library<br />Update library item<br />Update local library<br />Update subscribed library<br />Update subscription of a published library<br />View configuration settings |
| **Cryptographic operations** | Direct access |
| **Datastore** | Allocate space<br />Browse datastore<br />Configure datastore<br />Low-level file operations<br />Remove files<br />Update virtual machine metadata |
| **Folder** | Create folder<br />Delete folder<br />Move folder<br />Rename folder |
| **Global** | Cancel task<br />Global tag<br />Health<br />Log event<br />Manage custom attributes<br />Service managers<br />Set custom attribute<br />System tag |
| **Host** | vSphere Replication<br />&#160;&#160;&#160;&#160;Manage replication |
| **vSphere tagging** | Assign and unassign vSphere tag<br />Create vSphere tag<br />Create vSphere tag category<br />Delete vSphere tag<br />Delete vSphere tag category<br />Edit vSphere tag<br />Edit vSphere tag category<br />Modify UsedBy field for category<br />Modify UsedBy field for tag |
| **Network** | Assign network |
| **Resource** | Apply recommendation<br />Assign vApp to resource pool<br />Assign virtual machine to resource pool<br />Create resource pool<br />Migrate powered off virtual machine<br />Migrate powered on virtual machine<br />Modify resource pool<br />Move resource pool<br />Query vMotion<br />Remove resource pool<br />Rename resource pool |
| **Scheduled task** | Create task<br />Modify task<br />Remove task<br />Run task |
| **Sessions** | Message<br />Validate session |
| **Profile** | Profile driven storage view |
| **Storage view** | View |
| **vApp** | Add virtual machine<br />Assign resource pool<br />Assign vApp<br />Clone<br />Create<br />Delete<br />Export<br />Import<br />Move<br />Power off<br />Power on<br />Rename<br />Suspend<br />Unregister<br />View OVF environment<br />vApp application configuration<br />vApp instance configuration<br />vApp managedBy configuration<br />vApp resource configuration |
| **Virtual machine** | Change Configuration<br />&#160;&#160;&#160;&#160;Acquire disk lease<br />&#160;&#160;&#160;&#160;Add existing disk<br />&#160;&#160;&#160;&#160;Add new disk<br />&#160;&#160;&#160;&#160;Add or remove device<br />&#160;&#160;&#160;&#160;Advanced configuration<br />&#160;&#160;&#160;&#160;Change CPU count<br />&#160;&#160;&#160;&#160;Change memory<br />&#160;&#160;&#160;&#160;Change settings<br />&#160;&#160;&#160;&#160;Change swapfile placement<br />&#160;&#160;&#160;&#160;Change resource<br />&#160;&#160;&#160;&#160;Configure host USB device<br />&#160;&#160;&#160;&#160;Configure raw device<br />&#160;&#160;&#160;&#160;Configure managedBy<br />&#160;&#160;&#160;&#160;Display connection settings<br />&#160;&#160;&#160;&#160;Extend virtual disk<br />&#160;&#160;&#160;&#160;Modify device settings<br />&#160;&#160;&#160;&#160;Query fault tolerance compatibility<br />&#160;&#160;&#160;&#160;Query unowned files<br />&#160;&#160;&#160;&#160;Reload from paths<br />&#160;&#160;&#160;&#160;Remove disk<br />&#160;&#160;&#160;&#160;Rename<br />&#160;&#160;&#160;&#160;Reset guest information<br />&#160;&#160;&#160;&#160;Set annotation<br />&#160;&#160;&#160;&#160;Toggle disk change tracking<br />&#160;&#160;&#160;&#160;Toggle fork parent<br />&#160;&#160;&#160;&#160;Upgrade virtual machine compatibility<br />Edit inventory<br />&#160;&#160;&#160;&#160;Create from existing<br />&#160;&#160;&#160;&#160;Create new<br />&#160;&#160;&#160;&#160;Move<br />&#160;&#160;&#160;&#160;Register<br />&#160;&#160;&#160;&#160;Remove<br />&#160;&#160;&#160;&#160;Unregister<br />Guest operations<br />&#160;&#160;&#160;&#160;Guest operation alias modification<br />&#160;&#160;&#160;&#160;Guest operation alias query<br />&#160;&#160;&#160;&#160;Guest operation modifications<br />&#160;&#160;&#160;&#160;Guest operation program execution<br />&#160;&#160;&#160;&#160;Guest operation queries<br />Interaction<br />&#160;&#160;&#160;&#160;Answer question<br />&#160;&#160;&#160;&#160;Back up operation on virtual machine<br />&#160;&#160;&#160;&#160;Configure CD media<br />&#160;&#160;&#160;&#160;Configure floppy media<br />&#160;&#160;&#160;&#160;Connect devices<br />&#160;&#160;&#160;&#160;Console interaction<br />&#160;&#160;&#160;&#160;Create screenshot<br />&#160;&#160;&#160;&#160;Defragment all disks<br />&#160;&#160;&#160;&#160;Drag and drop<br />&#160;&#160;&#160;&#160;Guest operating system management by VIX API<br />&#160;&#160;&#160;&#160;Inject USB HID scan codes<br />&#160;&#160;&#160;&#160;Install VMware tools<br />&#160;&#160;&#160;&#160;Pause or Unpause<br />&#160;&#160;&#160;&#160;Perform wipe or shrink operations<br />&#160;&#160;&#160;&#160;Power off<br />&#160;&#160;&#160;&#160;Power on<br />&#160;&#160;&#160;&#160;Record session on virtual machine<br />&#160;&#160;&#160;&#160;Replay session on virtual machine<br />&#160;&#160;&#160;&#160;Suspend<br />&#160;&#160;&#160;&#160;Suspend fault tolerance<br />&#160;&#160;&#160;&#160;Test failover<br />&#160;&#160;&#160;&#160;Test restart secondary VM<br />&#160;&#160;&#160;&#160;Turn off fault tolerance<br />&#160;&#160;&#160;&#160;Turn on fault tolerance<br />Provisioning<br />&#160;&#160;&#160;&#160;Allow disk access<br />&#160;&#160;&#160;&#160;Allow file access<br />&#160;&#160;&#160;&#160;Allow read-only disk access<br />&#160;&#160;&#160;&#160;Allow virtual machine download<br />&#160;&#160;&#160;&#160;Clone template<br />&#160;&#160;&#160;&#160;Clone virtual machine<br />&#160;&#160;&#160;&#160;Create template from virtual machine<br />&#160;&#160;&#160;&#160;Customize guest<br />&#160;&#160;&#160;&#160;Deploy template<br />&#160;&#160;&#160;&#160;Mark as template<br />&#160;&#160;&#160;&#160;Modify customization specification<br />&#160;&#160;&#160;&#160;Promote disks<br />&#160;&#160;&#160;&#160;Read customization specifications<br />Service configuration<br />&#160;&#160;&#160;&#160;Allow notifications<br />&#160;&#160;&#160;&#160;Allow polling of global event notifications<br />&#160;&#160;&#160;&#160;Manage service configuration<br />&#160;&#160;&#160;&#160;Modify service configuration<br />&#160;&#160;&#160;&#160;Query service configurations<br />&#160;&#160;&#160;&#160;Read service configuration<br />Snapshot management<br />&#160;&#160;&#160;&#160;Create snapshot<br />&#160;&#160;&#160;&#160;Remove snapshot<br />&#160;&#160;&#160;&#160;Rename snapshot<br />&#160;&#160;&#160;&#160;Revert snapshot<br />vSphere Replication<br />&#160;&#160;&#160;&#160;Configure replication<br />&#160;&#160;&#160;&#160;Manage replication<br />&#160;&#160;&#160;&#160;Monitor replication |
| **vService** | Create dependency<br />Destroy dependency<br />Reconfigure dependency configuration<br />Update dependency |



## Next steps

Refer to the [VMware product documentation](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-ED56F3C4-77D0-49E3-88B6-B99B8B437B62.html) for a detailed explanation of each privilege.

<!-- LINKS - internal -->

<!-- LINKS - external-->
[VMware product documentation]: https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-ED56F3C4-77D0-49E3-88B6-B99B8B437B62.html

