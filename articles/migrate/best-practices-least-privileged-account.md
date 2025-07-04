---
title: Security Best Practices for Least Privileged Accounts in Azure Migrate.
description: Learn how to securely configure Azure Migrate Appliance with least privilege access by setting up read-only VMware roles with guest operations and scoped permissions, enabling efficient workload discovery, software inventory, and agentless migration..
author: molishv
ms.author: molir
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/04/2025
monikerRange: migrate
ms.custom:
  - build-2025
# Customer intent: As a cloud migration specialist, I want to implement security best practices for deploying the migration appliance, so that I can ensure a secure and efficient migration process while protecting sensitive data.
---

# Credentials-Best Practices for Least Privileged Accounts in Azure Migrate

Azure Migrate Appliance is a lightweight tool that discovers on-premises servers and sends their configuration and performance data to Azure. It also performs software inventory, agentless dependency analysis, and detects workloads like web apps and SQL/MySQL Server instances. To use these features, users add server and guest credentials in the Appliance Config Manager. Following the principle of least privilege helps keep the setup secure and efficient.

## Discovery of VMware estate:  

vCenter account permissions:  

1. **Discovery of server metadata**: To discover basic server configurations in a VMware environment, you need read-only permissions.
    - **Read-only**: Use either the built-in read-only role or create a copy of it.
1. To discover server metadata and enable software inventory, dependency analysis, and performance assessments.
    - **Read-only**- Use the built-in read-only role or create a copy of it. 
    - **Guest operations** - Add guest operations privileges to the read-only role.
1. Scoped discovery of VMware servers:  
    - To discover specific VMs, **assign read permissions at the individual VMs**. To discover all VMs in a folder, assign read permissions at the folder level and turn on the 'propagate to children' option.
    - Assign guest operations permissions to the vCenter account along with read permissions to enable software inventory, dependency analysis, and performance assessments.
    - Give **read-only access to all parent objects that host the virtual machines**, such as the host, cluster, hosts folder, clusters folder, and data center. You don’t need to apply these permissions to all child objects.
    - In the vSphere client, check that read permissions are set on parent objects in both the Hosts and *Clusters* view and the *VMs & Templates* view.
1. Perform agentless migration: To perform agentless migration, ensure the vCenter account used by the Azure Migrate appliance has permissions at all required levels—datacenter, cluster, host, VM, and datastore. Apply permissions at each level to avoid replication errors.

    | Privilege Name in the vSphere Client  | The purpose for the privilege  | Required On | Privilege Name in the API  |
    | --- | --- | --- | --- |
    | Browse datastore  | Allow browsing of VM log files to troubleshoot snapshot creation and deletion.  | Data stores  | Datastore.Browse  |
    | Low level file operations  | Allow read/write/delete/rename operations in the datastore browser to troubleshoot snapshot creation and deletion. |Data stores  | Datastore.FileManagement  |
    | Change Configuration - Toggle disk change tracking  | Allow enable or disable change tracking of VM disks to pull changed blocks of data between snapshots.  | Virtual machines  | VirtualMachine.Config.ChangeTracking  |
    | Change Configuration - Acquire disk lease  | Allow disk lease operations for a VM to read the disk using the VMware vSphere Virtual Disk Development Kit (VDDK).  | Virtual machines  | VirtualMachine.Config.DiskLease |
    | Provisioning - Allow read-only disk access  | Allow read-only disk access: Allow opening a disk on a VM to read the disk using the VDDK. | Virtual machines  | VirtualMachine.Provisioning.DiskRandomRead  |
    | Provisioning - Allow disk access  | Allow opening a disk on a VM to read the disk using the VDDK.  | Virtual machines  | VirtualMachine.Provisioning.DiskRandomAccess  |
    | Provisioning - Allow virtual machine download  | Allow virtual machine download: Allows read operations on files associated with a VM to download the logs and troubleshoot if failure occurs.  | Root host or vCenter Server  | VirtualMachine.Provisioning.GetVmFiles  |
    | Snapshot management  | Allow Discovery, Software Inventory, and Dependency Mapping on VMs.  | Virtual machines  | VirtualMachine.State.*  |
    | Guest operations  | Allow creation and management of VM snapshots for replication. | Virtual machines | VirtualMachine.GuestOperations.*  |
    | Interaction Power Off | Allow the VM to be powered off during migration to Azure.  | Virtual machines | VirtualMachine.Interact.PowerOff  |

## Enable Guest Discovery with Server Credentials

Quick guest discovery: For quick discovery of software inventory, server dependencies, and database instances, you need the following permissions:

| Use case  | Discovered Metadata  | Credentials needed  |
| --- | --- | --- | --- |
| Quick guest discovery  | Software inventory <br /><br /> Server dependencies (limited data)* <br /><br />Inventory of Database instances  | Windows <br /><br /> Linux | Local guest user account <br /><br /> Any non-sudo guest user account |

* Limitations:  

You can use a Windows guest or a Linux non-sudo user account to get dependency mapping data, but the following limitation can happen.

With least privileged accounts, you might not collect process information (like process name or app name) for some processes that run with higher privileges. These processes will show as **Unknown** processes under the machine in the single server view.

In-depth guest discovery:

| Use case  | Discovered Metadata  | Credentials needed | 
| --- | --- | --- | 
| In-depth guest discovery  | Software inventory <br /><br /> Server dependencies (full data) <br /><br /> Inventory of Database instances <br /><br /> We apps like .NET, Java Tomcat  | Windows <br /<br /> Linux  | Administrator <br /><br /> Following sudo permissions are required to identify server dependencies. <br /><br />
`/usr/bin/netstat, /usr/bin/ls` <br /><br /> If netstat is not available, sudo permissions on ss is required.<br /><br /> For Java webapps discovery (Tomcat servers), the user should have read and execute (r-x) permissions on all Catalina homes.<br >/<br /> Execute the following command to find out all catalina homes:<br /><br />
`ps -ef | grep catalina.home` <br /><br /> Here is a sample command to up least privileged user: <br /><br />
`setfacl -m u:johndoe:rx <catalina/home/path>` |
