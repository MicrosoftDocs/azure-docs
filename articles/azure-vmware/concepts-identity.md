---
title: Concepts - Identity and access
description: Learn about the identity and access concepts of Azure VMware Solution (AVS)
ms.topic: conceptual
ms.date: 05/04/2020
---

# Azure VMware Solution (AVS) identity concepts

A vCenter server and NSX-T manager are provisioned when a private cloud is deployed. You use vCenter to manage virtual machine workloads and NSX-T manager to extend the private cloud software-defined network.

Access and identity management use CloudAdmin group privileges for vCenter and restricted administrator rights for NSX-T manager. This policy ensures that your private cloud platform can be upgraded automatically. This delivers the newest features and patches on a regular basis. See the [private cloud upgrades concepts article][concepts-upgrades] for more details on private cloud upgrades.

## vCenter access and identity

Privileges in vCenter are provided through the CloudAdmin group. That group can be managed locally in vCenter, or through integration of vCenter LDAP single sign-on with Azure Active Directory. You're provided with the ability to enable that integration after you deploy a private cloud.

The CloudAdmin and CloudGlobalAdmin privileges are shown in the table below.

|  Privilege Set           | CloudAdmin | CloudGlobalAdmin | Comment |
| :---                     |    :---:   |       :---:      |   :--:  |
|  Alarms                  | A CloudAdmin user has all Alarms privileges for alarms in the Compute-ResourcePool and VMs.     |          --        |  -- |
|  Auto Deploy	           |  --  |        --        |  Microsoft does host management.  |
|  Certificates            |  --  |        --       |  Microsoft does certificate management.  |
|  Content Library         | A CloudAdmin user has privileges to create and use files in a Content Library.    |         Enabled with SSO.         |  Microsoft will distribute files in the Content Library to ESXi hosts.  |
|  Datacenter              |  --  |        --          |  Microsoft does all data center operations.  |
|  Datastore               | Datastore.AllocateSpace, Datastore.Browse, Datastore.Config, Datastore.DeleteFile, Datastore.FileManagement, Datastore.UpdateVirtualMachineMetadata     |    --    |   -- |
|  ESX Agent Manager       |  --  |         --       |  Microsoft does all operations.  |
|  Folder                  |  A CloudAdmin user has all Folder privileges.     |  --  |  --  |
|  Global                  |  Global.CancelTask, Global.GlobalTag, Global.Health, Global.LogEvent, Global.ManageCustomFields, Global.ServiceManagers, Global.SetCustomField, Global.SystemTag         |                  |    |
|  Host                    |  Host.Hbr.HbrManagement      |        --          |  Microsoft does all other Host operations.  |
|  InventoryService        |  InventoryService.Tagging      |        --          |  --  |
|  Network                 |  Network.Assign    |                  |  Microsoft does all other Network operations.  |
|  Permissions             |  --  |        --       |  Microsoft does all Permissions operations.  |
|  Profile-driven Storage  |  --  |        --       |  Microsoft does all Profile operations.  |
|  Resource                |  A CloudAdmin user has all Resource privileges.        |      --       | --   |
|  Scheduled Task          |  A CloudAdmin user has all ScheduleTask privileges.   |   --   | -- |
|  Sessions                |  Sessions.GlobalMessage, Sessions.ValidateSession      |   --   |  Microsoft does all other Sessions operations.  |
|  Storage Views           |  StorageViews.View   |        --          |  Microsoft does all other Storage View operations (Configure Service).  |
|  Tasks                   |  --  |  --   |  Microsoft manages extensions that manage tasks.  |
|  vApp                    |  A CloudAdmin user has all vApp privileges.  |  --  |  --  |
|  Virtual Machine         |  A CloudAdmin user has all VirtualMachine privileges.  |  --  |  --  |
|  vService                |  A CloudAdmin user has all vService privileges.  |  --  |  --  |

## NSX-T Manager access and identity

You access NSX-T Manager using the "administrator" account. That account has full privileges and enables you to create and manage T1 routers, logical switches, and all services. The full privileges in NSX-T also provide you with access to the NSX-T T0 router. A change to the T0 router could result in degraded network performance or a loss of access to a private cloud. To meet support requirements, it's required that you open an support request in the Azure portal to request any changes to your NSX-T T0 router.
  
## Next steps

The next step is to learn about [private cloud upgrade concepts][concepts-upgrades].

<!-- LINKS - external -->

<!-- LINKS - internal -->
[concepts-upgrades]: ./concepts-upgrades.md