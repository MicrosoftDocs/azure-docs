--- 
title: Forbidden actions during elevated access
description: VMware Engine reverts the changes to ensure that service remains uninterrupted when VMware Engine detects any of the following forbidden actions.
titleSuffix: Azure VMware Solution by CloudSimple
ms.date: 10/28/2020 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
author: divka78  
ms.author: dikamath 
---

# Forbidden actions during elevated access

During the elevation time interval, some actions are forbidden. When VMware Engine detects any of the following forbidden actions, VMware Engine reverts the changes to ensure that service remains uninterrupted.

## Cluster actions

- Removing a cluster from vCenter.
- Changing vSphere High Availability (HA) on a cluster.
- Adding a host to the cluster from vCenter.
- Removing a host from the cluster from vCenter.

## Host actions

- Removing datastores on an ESXi host.
- Uninstalling vCenter agent from host.
- Modifying the host configuration.
- Making any changes to the host profiles.
- Placing a host in maintenance mode.

## Network actions

- Deleting the default distributed virtual switch (DVS) in a private cloud.
- Removing a host from the default DVS.
- Importing any DVS setting.
- Reconfiguring any DVS setting.
- Upgrading any DVS.
- Deleting the management portgroup.
- Editing the management portgroup.

## Roles and permissions actions

- Creating a global role.
- Modifying or deleting permission to any management objects.
- Modifying or removing any default roles.
- Increase the privileges of a role to higher than of Cloud-Owner-Role.

## Other actions

- Removing any default licenses:
  - vCenter Server
  - ESXi nodes
  - NSX-T
  - HCX
- Modifying or deleting the management resource pool.
- Cloning management VMs.


## Next steps
[CloudSimple maintenance and updates](cloudsimple-maintenance-updates.md) 
