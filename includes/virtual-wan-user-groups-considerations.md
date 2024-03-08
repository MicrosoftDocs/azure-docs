---
author: cherylmc
ms.author: cherylmc
ms.date: 07/31/2023
ms.service: virtual-wan
ms.topic: include
---

* The maximum number of groups that can be referenced by a single P2S VPN gateway is 90. The maximum number of policy/group members (criteria used to identify which group a connecting user is a part of) in groups assigned to a gateway is 390. However, if a group is assigned to multiple connection configurations on the same gateway, this group and its members are counted multiple times towards the limits. For example, if there's a policy group with 10 members that is assigned to three VPN connection configurations on the gateway. This configuration would count as three groups with 30 total members as opposed to one group with 10 members. The total number of concurrent users connecting to a gateway is limited by the gateway scale unit and the number of IP addresses allocated to each user group and not the number of policy/group members associated with a gateway.

* Once a group has been created as part of a VPN server configuration, the name and default setting of a group can't be modified.

* Group names should be distinct.

* Groups that have lower numerical priority are processed prior to groups with higher numerical priority. If a connecting user is a member of multiple groups, the gateway considers them to be a member of the group with lower numerical priority for purposes of assigning IP addresses.

* Groups that are being used by existing point-to-site VPN gateways can't be deleted.

* You can reorder the priorities of your groups by clicking on the up-down arrow buttons corresponding to that group.
