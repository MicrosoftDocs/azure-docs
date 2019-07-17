---
title: Concepts - Identity and access for Azure VMware Solution by Virtustream
description: Learn about the identity and access concepts of Azure VMware Solution by Virtustream. 
services: 
author: v-jetome

ms.service: vmware-virtustream
ms.topic: conceptual
ms.date: 07/22/2019
ms.author: v-jetome
ms.custom: 

---

# Azure VMware Solution (AVS) by Virtustream Identity Concepts

You can access vCenter and NSX-T Manager once a private cloud has been provisioned. You are provided with the capability to manage workloads in vCenter and extend the software defined network in NSX-T. All other private cloud administration is performed by Virtustream. Access and identity management use CloudAdmin group privileges for vCenter and restricted administrator rights for NSX-T manager. This policy ensures that your private cloud platform can be upgraded automatically, delivering the newest features and patches on a regular cadence. See the [private cloud upgrades concepts article][concepts-upgrades] for more details on private cloud upgrades. 

Identity management for vCenter can be integrated with Azure AD.

## vCenter access and identity

Privileges in vCenter are provided through the CloudAdmin group. That group can be managed locally in vCenter, or through integration of vCenter LDAP single sign-on with Azure Active Directory. You are provided with the ability to enable that integration when you deploy a private cloud.

The CloudAdmin and CloudGlobalAdmin privileges are shown in the table below.

|  Privilege Set           | CloudAdmin | CloudGlobalAdmin | Comment |
| :---                     |    :---:   |       :---:      |   :--:  |
|  Alarms                  | A CloudAdmin user has all Alarms privileges for alarms in the Compute-ResourcePool and VMs.     |          --        |  -- |
|  Auto Deploy	           |  --  |        --        |  Virtustream performs host management.  |
|  Certificates            |  --  |        --       |  Virtustream performs certificate management.  |
|  Content Library         | A CloudAdmin user has privileges to create and use files in a Content Library.    |         Enabled with SSO.         |  Virtustream will distribute files in the Content Library to ESXi hosts.  |
|  Datacenter              |  --  |        --          |  Virtustream performs all data center operations.  |
|  Datastore               | Datastore.AllocateSpace, Datastore.Browse, Datastore.Config, Datastore.DeleteFile, Datastore.FileManagement, Datastore.UpdateVirtualMachineMetadata     |    --    |   -- |
|  ESX Agent Manager       |  --  |         --       |  Virtustream performs all operations.  |
|  Folder                  |  A CloudAdmin user has all Folder privileges.     |  --  |  --  |
|  Global                  |  Global.CancelTask, Global.GlobalTag, Global.Health, Global.LogEvent, Global.ManageCustomFields, Global.ServiceManagers, Global.SetCustomField, Global.SystemTag         |                  |    |
|  Host                    |  Host.Hbr.HbrManagement      |        --          |  Virtustream performs all other Host operations.  |
|  InventoryService        |  InventoryService.Tagging      |        --          |  --  |
|  Network                 |  Network.Assign    |                  |  Virtustream performs all other Network operations.  |
|  Permissions             |  --  |        --       |  Virtustream performs all Permissions operations.  |
|  Profile-driven Storage  |  --  |        --       |  Virtustream performs all Profile operations.  |
|  Resource                |  A CloudAdmin user has all Resource privileges.        |      --       | --   |
|  Scheduled Task          |  A CloudAdmin user has all ScheduleTask privileges.   |   --   | -- |
|  Sessions                |  Sessions.GlobalMessage, Sessions.ValidateSession      |   --   |  Virtustream performs all other Sessions operations.  |
|  Storage Views           |  StorageViews.View   |        --          |  Virtustream performs all other Storage View operations (Configure Service).  |
|  Tasks                   |  --  |  --   |  Virtustream manages extensions that manage tasks.  |
|  vApp                    |  A CloudAdmin user has all vApp privileges.  |  --  |  --  |
|  Virtual Machine         |  A CloudAdmin user has all VirtualMachine privileges.  |  --  |  --  |
|  vService                |  A CloudAdmin user has all vService privileges.  |  --  |  --  |

Request elevated vCenter privileges with an SR in the Azure portal.

## NSX-T Manager access and identity

In the current version of AVS by Virtustream, you access NSX-T Manager using the "administrator" account. You'll have all the privileges to create and manage T1 routers, logical switches, and a number of services running in the private cloud NSX-T software-defined network. The elevated privileges in NSX-T also provide you with access to the NSX-T T0 router and Edge-node VMs (EVMs). It's critical to note any change to the T0 router or EVMs could result in degraded network access and operation of a private cloud. It's recommended that only Virtustream perform work on the NSX-T T0 router and the Edge-node VMs. You can open an SR in the Azure portal to request changes.
  
## Next steps

The next step is to learn about [private cloud upgrade concepts][concepts-upgrades].

<!-- LINKS - external -->

<!-- LINKS - internal -->
[concepts-upgrades]: ./concepts-upgrades.md