---
title: Concepts - identity and access for Azure VMware Solution by Virtustream
description: Learn about the identity and access concepts of Azure VMware Solution by Virtustream. 
services: 
author: v-jetome

ms.service: vmware-virtustream
ms.topic: conceptual
ms.date: 07/29/2019
ms.author: v-jetome
ms.custom: 

---

# Azure VMware Solution (AVS) by Virtustream identity concepts

A vCenter server and NSX-T manager are provisioned when a private cloud is deployed. You use vCenter to manage virtual machine workloads and NSX-T manager to extend the private cloud software-defined network.

Access and identity management use CloudAdmin group privileges for vCenter and restricted administrator rights for NSX-T manager. This policy ensures that your private cloud platform can be upgraded automatically, delivering the newest features and patches on a regular cadence. See the [private cloud upgrades concepts article][concepts-upgrades] for more details on private cloud upgrades.

## vCenter access and identity

Privileges in vCenter are provided through the CloudAdmin group. That group can be managed locally in vCenter, or through integration of vCenter LDAP single sign-on with Azure Active Directory. You're provided with the ability to enable that integration when you deploy a private cloud.

The CloudAdmin and CloudGlobalAdmin privileges are shown in the table below.

|  Privilege Set           | CloudAdmin | CloudGlobalAdmin | Comment |
| :---                     |    :---:   |       :---:      |   :--:  |
|  Alarms                  | A CloudAdmin user has all Alarms privileges for alarms in the Compute-ResourcePool and VMs.     |          --        |  -- |
|  Auto Deploy	           |  --  |        --        |  Virtustream does host management.  |
|  Certificates            |  --  |        --       |  Virtustream does certificate management.  |
|  Content Library         | A CloudAdmin user has privileges to create and use files in a Content Library.    |         Enabled with SSO.         |  Virtustream will distribute files in the Content Library to ESXi hosts.  |
|  Datacenter              |  --  |        --          |  Virtustream does all data center operations.  |
|  Datastore               | Datastore.AllocateSpace, Datastore.Browse, Datastore.Config, Datastore.DeleteFile, Datastore.FileManagement, Datastore.UpdateVirtualMachineMetadata     |    --    |   -- |
|  ESX Agent Manager       |  --  |         --       |  Virtustream does all operations.  |
|  Folder                  |  A CloudAdmin user has all Folder privileges.     |  --  |  --  |
|  Global                  |  Global.CancelTask, Global.GlobalTag, Global.Health, Global.LogEvent, Global.ManageCustomFields, Global.ServiceManagers, Global.SetCustomField, Global.SystemTag         |                  |    |
|  Host                    |  Host.Hbr.HbrManagement      |        --          |  Virtustream does all other Host operations.  |
|  InventoryService        |  InventoryService.Tagging      |        --          |  --  |
|  Network                 |  Network.Assign    |                  |  Virtustream does all other Network operations.  |
|  Permissions             |  --  |        --       |  Virtustream does all Permissions operations.  |
|  Profile-driven Storage  |  --  |        --       |  Virtustream does all Profile operations.  |
|  Resource                |  A CloudAdmin user has all Resource privileges.        |      --       | --   |
|  Scheduled Task          |  A CloudAdmin user has all ScheduleTask privileges.   |   --   | -- |
|  Sessions                |  Sessions.GlobalMessage, Sessions.ValidateSession      |   --   |  Virtustream does all other Sessions operations.  |
|  Storage Views           |  StorageViews.View   |        --          |  Virtustream does all other Storage View operations (Configure Service).  |
|  Tasks                   |  --  |  --   |  Virtustream manages extensions that manage tasks.  |
|  vApp                    |  A CloudAdmin user has all vApp privileges.  |  --  |  --  |
|  Virtual Machine         |  A CloudAdmin user has all VirtualMachine privileges.  |  --  |  --  |
|  vService                |  A CloudAdmin user has all vService privileges.  |  --  |  --  |

Request elevated vCenter privileges with an SR in the Azure portal.

## NSX-T Manager access and identity

You access NSX-T Manager using the "administrator" account. That account has full privileges and enables you to create and manage T1 routers, logical switches, and all services. The full privileges in NSX-T also provide you with access to the NSX-T T0 router. A change to the T0 router could result in degraded network performance of a private cloud. To meet support requirements, it's required that you open an SR in the Azure portal to request any changes to your NSX-T T0 router.
  
## Next steps

The next step is to learn about [private cloud upgrade concepts][concepts-upgrades].

<!-- LINKS - external -->

<!-- LINKS - internal -->
[concepts-upgrades]: ./concepts-upgrades.md