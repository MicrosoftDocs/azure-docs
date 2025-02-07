---
author: cherylmc
ms.author: cherylmc
ms.date: 07/31/2023
ms.service: azure-virtual-wan
ms.topic: include
---

* Maximum Groups: A single P2S VPN gateway can reference up to **90 groups.**

* Maximum Members: The total number of policy/group members across all groups assigned to a gateway is **390**.
  
* Multiple Assignments: If a group is assigned to multiple connection configurations on the same gateway, it and its members are counted multiple times.
  Example: A policy group with 10 members assigned to three VPN connection configurations counts as three groups with 30 members, not one group with 10 members.
  
* Concurrent Users: The total number of concurrent users is determined by the gateway’s scale unit and the number of IP addresses allocated to each user group.
It is **not** determined by the number of policy/group members associated with the gateway.

* Once a group has been created as part of a VPN server configuration, the name and default setting of a group can't be modified.

* Group names should be distinct.

* Groups that have lower numerical priority are processed prior to groups with higher numerical priority. If a connecting user is a member of multiple groups, the gateway considers them to be a member of the group with lower numerical priority for purposes of assigning IP addresses.

* Groups that are being used by existing point-to-site VPN gateways can't be deleted.

* You can reorder the priorities of your groups by clicking on the up-down arrow buttons corresponding to that group.
