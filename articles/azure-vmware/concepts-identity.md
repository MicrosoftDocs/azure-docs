---
title: Concepts - Identity and access
description: Learn about the identity and access concepts of Azure VMware Solution
ms.topic: conceptual
ms.date: 03/18/2021
---

# Azure VMware Solution identity concepts

Azure VMware Solution private clouds are provisioned with a vCenter server and NSX-T Manager. You use vCenter to manage virtual machine (VM) workloads. You use the NSX-T Manager to manage and extend the private cloud network.

The vCenter Access and identity management uses the buildin CloudAdmin group privileges. The NSX-T Manager uses restricted administrator permissions. This is by nature of the managed service and ensures that your private cloud platform upgrades with the newest features and patches as to be expected.  For more information, see [private cloud upgrades concepts article][concepts-upgrades].

## vCenter access and identity

The vCenter CloudAdmin group defines and provides the privileges in vCenter. Another option is to provide access and identity through the integration of vCenter LDAP single sign-on with Azure Active Directory. You enable that integration after you deploy your private cloud. 

The table shows **CloudAdmin** and **CloudGlobalAdmin** privileges.

|  Privilege Set           | CloudAdmin | CloudGlobalAdmin | Comment |
| :---                     |    :---:   |       :---:      |   :--:  |
|  Alarms                  | A CloudAdmin user has all Alarms privileges for alarms in the Compute-ResourcePool and VMs.     |          --        |  -- |
|  Auto Deploy             |  --  |        --        |  Microsoft does host management.  |
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

Use the *administrator* account to access NSX-T Manager. It has full privileges and lets you create and manage Tier-1 (T1) Gateways, segments (logical switches) and all services. This account also provides access to the NSX-T Tier-0 (T0) Gateway. Be mindfull on makeing such changes, since that could result in degraded network performance or no private cloud access. Open a support request in the Azure portal to request any changes to your NSX-T T0 Gateway.
  
## Next steps

Now that you've covered Azure VMware Solution access and identity concepts, you may want to learn about:

- [Private cloud upgrade concepts](concepts-upgrades.md).
- [vSphere role-based access control for Azure VMware Solution](concepts-role-based-access-control.md).
- [How to enable Azure VMware Solution resource](enable-azure-vmware-solution.md).

<!-- LINKS - external -->

<!-- LINKS - internal -->
[concepts-upgrades]: ./concepts-upgrades.md
