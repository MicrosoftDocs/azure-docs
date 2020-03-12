--- 
title: Azure VMware Solution by CloudSimple - Private Cloud permission model
description: Describes the CloudSimple Private Cloud permission model, groups, and categories 
author: sharaths-cs
ms.author: b-shsury 
ms.date: 08/16/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# CloudSimple Private Cloud permission model of VMware vCenter

CloudSimple retains full administrative access to the Private Cloud environment. Each CloudSimple customer is granted sufficient administrative privileges to be able to deploy and manage the virtual machines in their environment.  If needed, you can temporarily escalated your privileges to perform administrative functions.

## Cloud Owner

When you create a Private Cloud, a **CloudOwner** user is created in the vCenter Single Sign-On domain, with **Cloud-Owner-Role** access to manage objects in the Private Cloud. This user also can set up additional [vCenter Identity Sources](set-vcenter-identity.md), and other users to the Private Cloud vCenter.

> [!NOTE]
> Default user for your CloudSimple Private Cloud vCenter is cloudowner@cloudsimple.local when a Private Cloud is created.

## User Groups

A group called **Cloud-Owner-Group** is created during the deployment of a Private Cloud. Users in this group can administer various parts of the vSphere environment on the Private Cloud. This group is automatically given  **Cloud-Owner-Role** privileges, and the  **CloudOwner** user is added as a member of this group.  CloudSimple creates additional groups with limited privileges for ease of management.  You can add any user to these pre-created groups and the privileges defined below are automatically assigned to the users in the groups.

### Pre-created Groups

| Group Name | Purpose | Role |
| -------- | ------- | ------ |
| Cloud-Owner-Group | Members of this group have administrative privileges to the Private Cloud vCenter | [Cloud-Owner-Role](#cloud-owner-role) |
| Cloud-Global-Cluster-Admin-Group | Members of this group have administrative privileges on the Private Cloud vCenter Cluster | [Cloud-Cluster-Admin-Role](#cloud-cluster-admin-role) |
| Cloud-Global-Storage-Admin-Group | Members of this group can manage storage on the Private Cloud vCenter | [Cloud-Storage-Admin-Role](#cloud-storage-admin-role) |
| Cloud-Global-Network-Admin-Group | Members of this group can manage network and distributed port groups on the Private Cloud vCenter | [Cloud-Network-Admin-Role](#cloud-network-admin-role) |
| Cloud-Global-VM-Admin-Group | Members of this group can manage virtual machines on the Private Cloud vCenter | [Cloud-VM-Admin-Role](#cloud-vm-admin-role) |

To grant individual users permissions to manage the Private Cloud, create user accounts add to the appropriate groups.

> [!CAUTION]
> New users must be added only to *Cloud-Owner-Group*, *Cloud-Global-Cluster-Admin-Group*, *Cloud-Global-Storage-Admin-Group*, *Cloud-Global-Network-Admin-Group* or, *Cloud-Global-VM-Admin-Group*.  Users added to *Administrators* group will be removed automatically.  Only service accounts must be added to *Administrators* group and service accounts must not be used to sign in to vSphere web UI.

## List of vCenter privileges for default roles

### Cloud-Owner-Role

| **Category** | **Privilege** |
|----------|-----------|
| **Alarms** | Acknowledge alarm <br> Create alarm <br> Disable alarm action <br> Modify alarm <br> Remove alarm <br> Set alarm status |
| **Permissions** | Modify permission |
| **Content Library** | Add library item <br> Create local library <br> Create subscribed library <br> Delete library item <br> Delete local library <br> Delete subscribed library <br> Download files <br> Evict library item <br> Evict subscribed library <br> Import storage <br> Probe subscription information <br> Read storage <br> Sync library item <br> Sync subscribed library <br> Type introspection <br> Update configuration settings <br> Update files <br> Update library <br> Update library item <br> Update local library <br> Update subscribed library <br> View configuration settings |
| **Cryptographic operations** | Add disk <br> Clone <br> Decrypt <br> Direct Access <br> Encrypt <br> Encrypt new <br> Manage KMS <br> Manage encryption policies <br> Manage keys <br> Migrate <br> Recrypt <br> Register VM <br> Register host |
| **dvPort group** | Create <br> Delete <br> Modify <br> Policy operation <br> Scope operation |
| **Datastore** | Allocate space <br> Browse datastore <br> Configure datastore <br> Low-level file operations <br> Move datastore <br> Remove datastore <br> Remove file <br> Rename datastore <br> Update virtual machine files <br> Update virtual machine metadata |
| **ESX Agent Manager** | Config <br> Modify <br> View |
| **Extension** | Register extension <br> Unregister extension <br> Update extension |
| **External stats provider**| Register <br> Unregister <br> Update |
| **Folder** | Create folder <br> Delete folder <br> Move folder <br> Rename folder |
| **Global** | Cancel task <br> Capacity planning <br> Diagnostics <br> Disable methods <br> Enable methods <br> Global tag <br> Health <br> Licenses <br> Log event <br> Manage custom attributes <br> Proxy <br> Script action <br> Service managers <br> Set custom attribute <br> System tag |
| **Health update provider** | Register <br> Unregister <br> Update |
| **Host > Configuration** | Storage partition configuration |
| **Host > Inventory** | Modify cluster |
| **vSphere Tagging** | Assign or Unassign vSphere Tag <br> Create vSphere Tag <br> Create vSphere Tag Category <br> Delete vSphere Tag <br> Delete vSphere Tag Category <br> Edit vSphere Tag <br> Edit vSphere Tag Category <br> Modify UsedBy Field For Category <br> Modify UsedBy Field For Tag |
| **Network** | Assign network <br> Configure <br> Move network <br> Remove |
| **Performance** | Modify intervals |
| **Host profile** | View |
| **Resource** | Apply recommendation <br> Assign vApp to resource pool <br> Assign virtual machine to resource pool <br> Create resource pool <br> Migrate powered off virtual machine <br> Migrate powered on virtual machine <br> Modify resource pool <br> Move resource pool <br> Query vMotion <br> Remove resource pool <br> Rename resource pool |
| **Scheduled task** | Create tasks <br> Modify task <br> Remove task <br> Run task |
| **Sessions** | Impersonate user <br> Message <br> Validate session <br> View and stop sessions |
| **Datastore cluster** | Configure a datastore cluster |
| **Profile-driven storage** | Profile-driven storage update <br> Profile-driven storage view |
| **Storage views** | Configure service <br> View |
| **Tasks** | Create task <br> Update task |
| **Transfer service**| Manage <br> Monitor |
| **vApp** | Add virtual machine <br> Assign resource pool <br> Assign vApp <br> Clone <br> Create <br> Delete <br> Export <br> Import <br> Move <br> Power off <br> Power on <br> Rename <br> Suspend <br> Unregister <br> View OVF environment <br> vApp application configuration <br> vApp instance configuration <br> vApp managedBy configuration <br> vApp resource configuration |
| **VRMPolicy** | Query VRMPolicy <br> Update VRMPolicy |
| **Virtual machine > Configuration** | Add existing disk <br> Add new disk <br> Add or remove device <br> Advanced <br> Change CPU count <br> Change resource <br> Configure managedBy <br> Disk change tracking <br> Disk lease <br> Display connection settings <br> Extend virtual disk <br> Host USB device <br> Memory <br> Modify device settings <br> Query Fault Tolerance compatibility <br> Query unowned files <br> Raw device <br> Reload from path <br> Remove disk <br> Rename <br> Reset guest information <br> Set annotation <br> Settings <br> Swapfile placement <br> Toggle fork parent <br> Unlock virtual machine <br> Upgrade virtual machine compatibility |
| **Virtual machine > Guest operations** | Guest operation alias modification <br> Guest operation alias query <br> Guest operation modifications <br> Guest operation program execution <br> Guest operation queries |
| **Virtual machine > Interaction** | Answer question <br> Backup operation on virtual machine <br> Configure CD media <br> Configure floppy media <br> Console interaction <br> Create screenshot <br> Defragment all disks <br> Device connection <br> Drag and drop <br> Guest operating system management by VIX API <br> Inject USB HID scan codes <br> Pause or Unpause <br> Perform wipe or shrink operations <br> Power off <br> Power on <br> Record session on virtual machine <br> Replay session on virtual machine <br> Reset <br> Resume Fault Tolerance <br> Suspend <br> Suspend Fault Tolerance <br> Test failover <br> Test restart Secondary VM <br> Turn off Fault Tolerance <br> Turn on Fault Tolerance <br> VMware Tools install |
| **Virtual machine > Inventory** | Create from existing <br> Create new <br> Move <br> Register <br> Remove <br> Unregister |
| **Virtual machine > Provisioning** | Allow disk access <br> Allow file access <br> Allow read-only disk access <br> Allow virtual machine download <br> Allow virtual machine files upload <br> Clone template <br> Clone virtual machine <br> Create template from virtual machine <br> Customize <br> Deploy template <br> Mark as template <br> Mark as virtual machine <br> Modify customization specification <br> Promote disks <br> Read customization specifications |
| **Virtual machine > Service configuration** | Allow notifications <br> Allow polling of global event notifications <br> Manage service configurations <br> Modify service configuration <br> Query service configurations <br> Read service configuration |
| **Virtual machine > Snapshot management** | Create snapshot <br> Remove snapshot <br> Rename snapshot <br> Revert to snapshot	|
| **Virtual machine > vSphere Replication** | Configure replication <br> Manage replication <br> Monitor replication |
| **vService** | Create dependency <br> Destroy dependency <br> Reconfigure dependency configuration <br> Update dependency |

### Cloud-Cluster-Admin-Role

| **Category** | **Privilege** |
|----------|-----------|
| **Datastore** | Allocate space <br> Browse datastore <br> Configure datastore <br> Low-level file operations <br> Remove datastore <br> Rename datastore <br> Update virtual machine files <br> Update virtual machine metadata |
| **Folder** | Create folder <br> Delete folder <br> Move folder <br> Rename folder |
| **Host > Configuration**  | Storage partition configuration |
| **vSphere Tagging** | Assign or Unassign vSphere Tag <br> Create vSphere Tag <br> Create vSphere Tag Category <br> Delete vSphere Tag <br> Delete vSphere Tag Category <br> Edit vSphere Tag <br> Edit vSphere Tag Category <br> Modify UsedBy Field For Category <br> Modify UsedBy Field For Tag |
| **Network** | Assign network |
| **Resource** | Apply recommendation <br> Assign vApp to resource pool <br> Assign virtual machine to resource pool <br> Create resource pool <br> Migrate powered off virtual machine <br> Migrate powered on virtual machine <br> Modify resource pool <br> Move resource pool <br> Query vMotion <br> Remove resource pool <br> Rename resource pool |
| **vApp** | Add virtual machine <br> Assign resource pool <br> Assign vApp <br> Clone <br> Create <br> Delete <br> Export <br> Import <br> Move <br> Power off <br> Power on <br> Rename <br> Suspend <br> Unregister <br> View OVF environment <br> vApp application configuration <br> vApp instance configuration <br> vApp managedBy configuration <br> vApp resource configuration |
| **VRMPolicy** | Query VRMPolicy <br> Update VRMPolicy |
| **Virtual machine > Configuration** | Add existing disk <br> Add new disk <br> Add or remove device <br> Advanced <br> Change CPU count <br> Change resource <br> Configure managedBy <br> Disk change tracking <br> Disk lease <br> Display connection settings <br> Extend virtual disk <br> Host USB device <br> Memory <br> Modify device settings <br> Query Fault Tolerance compatibility <br> Query unowned files <br> Raw device <br> Reload from path <br> Remove disk <br> Rename <br> Reset guest information <br> Set annotation <br> Settings <br> Swapfile placement <br> Toggle fork parent <br> Unlock virtual machine <br> Upgrade virtual machine compatibility |
| **Virtual machine > Guest operations** | Guest operation alias modification <br> Guest operation alias query <br> Guest operation modifications <br> Guest operation program execution <br> Guest operation queries |
| **Virtual machine > Interaction** | Answer question <br> Backup operation on virtual machine <br> Configure CD media <br> Configure floppy media <br> Console interaction <br> Create screenshot <br> Defragment all disks <br> Device connection <br> Drag and drop <br> Guest operating system management by VIX API <br> Inject USB HID scan codes <br> Pause or Unpause <br> Perform wipe or shrink operations <br> Power off <br> Power on <br> Record session on virtual machine <br> Replay session on virtual machine <br> Reset <br> Resume Fault Tolerance <br> Suspend <br> Suspend Fault Tolerance <br> Test failover <br> Test restart Secondary VM <br> Turn off Fault Tolerance <br> Turn on Fault Tolerance <br> VMware Tools install
| **Virtual machine > Inventory** | Create from existing <br> Create new <br> Move <br> Register <br> Remove <br> Unregister |
| **Virtual machine > Provisioning** | Allow disk access <br> Allow file access <br> Allow read-only disk access <br> Allow virtual machine download <br> Allow virtual machine files upload <br> Clone template <br> Clone virtual machine <br> Create template from virtual machine <br> Customize <br> Deploy template <br> Mark as template <br> Mark as virtual machine <br> Modify customization specification <br> Promote disks  <br> Read customization specifications |
| **Virtual machine > Service configuration** | Allow notifications <br> Allow polling of global event notifications <br> Manage service configurations <br> Modify service configuration <br> Query service configurations <br> Read service configuration
| **Virtual machine > Snapshot management** | Create snapshot <br> Remove snapshot <br> Rename snapshot <br> Revert to snapshot |
| **Virtual machine > vSphere Replication** | Configure replication <br> Manage replication <br> Monitor replication |
| **vService** | Create dependency <br> Destroy dependency <br> Reconfigure dependency configuration <br> Update dependency |

### Cloud-Storage-Admin-Role

| **Category** | **Privilege** |
|----------|-----------|
| **Datastore** | Allocate space <br> Browse datastore <br> Configure datastore <br> Low-level file operations <br> Remove datastore <br> Rename datastore <br> Update virtual machine files <br> Update virtual machine metadata |
| **Host > Configuration** | Storage partition configuration |
| **Datastore cluster** | Configure a datastore cluster	|
| **Profile-driven storage** | Profile-driven storage update <br> Profile-driven storage view |
| **Storage views** | Configure service <br> View |

### Cloud-Network-Admin-Role

| **Category** | **Privilege** |
|----------|-----------|
| **dvPort group** | Create <br> Delete <br> Modify <br> Policy operation <br> Scope operation |
| **Network** | Assign network <br> Configure <br> Move network <br> Remove |
| **Virtual machine > Configuration** | Modify device settings |

### Cloud-VM-Admin-Role

| **Category** | **Privilege** |
|----------|-----------|
| **Datastore** | Allocate space <br> Browse datastore |
| **Network** | Assign network |
| **Resource** | Assign virtual machine to resource pool <br> Migrate powered off virtual machine <br> Migrate powered on virtual machine
| **vApp** | Export <br> Import |
| **Virtual machine > Configuration** | Add existing disk <br> Add new disk <br> Add or remove device <br> Advanced <br> Change CPU count <br> Change resource <br> Configure managedBy <br> Disk change tracking <br> Disk lease <br> Display connection settings <br> Extend virtual disk <br> Host USB device <br> Memory <br> Modify device settings <br> Query Fault Tolerance compatibility <br> Query unowned files <br> Raw device <br> Reload from path <br> Remove disk <br> Rename <br> Reset guest information <br> Set annotation <br> Settings <br> Swapfile placement <br> Toggle fork parent <br> Unlock virtual machine <br> Upgrade virtual machine compatibility |
| **Virtual machine >Guest operations** | Guest operation alias modification <br> Guest operation alias query <br> Guest operation modifications <br> Guest operation program execution <br> Guest operation queries	|
| **Virtual machine >Interaction** | Answer question <br> Backup operation on virtual machine <br> Configure CD media <br> Configure floppy media <br> Console interaction <br> Create screenshot <br> Defragment all disks <br> Device connection <br> Drag and drop <br> Guest operating system management by VIX API <br> Inject USB HID scan codes <br> Pause or Unpause <br> Perform wipe or shrink operations <br> Power off <br> Power on <br> Record session on virtual machine <br> Replay session on virtual machine <br> Reset <br> Resume Fault Tolerance <br> Suspend <br> Suspend Fault Tolerance <br> Test failover <br> Test restart Secondary VM <br> Turn off Fault Tolerance <br> Turn on Fault Tolerance <br> VMware Tools install |
| **Virtual machine >Inventory** | Create from existing <br> Create new <br> Move <br> Register <br> Remove <br> Unregister |
| **Virtual machine >Provisioning** | Allow disk access <br> Allow file access <br> Allow read-only disk access <br> Allow virtual machine download <br> Allow virtual machine files upload <br> Clone template <br> Clone virtual machine <br> Create template from virtual machine <br> Customize <br> Deploy template <br> Mark as template <br> Mark as virtual machine <br> Modify customization specification <br> Promote disks <br> Read customization specifications |
| **Virtual machine >Service configuration** | Allow notifications <br> Allow polling of global event notifications <br> Manage service configurations <br> Modify service configuration <br> Query service configurations <br> Read service configuration
| **Virtual machine >Snapshot management** | Create snapshot <br> Remove snapshot <br> Rename snapshot <br> Revert to snapshot |
| **Virtual machine >vSphere Replication** | Configure replication <br> Manage replication <br> Monitor replication |
| **vService** | Create dependency <br> Destroy dependency <br> Reconfigure dependency configuration <br> Update dependency |
