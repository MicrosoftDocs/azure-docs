---
author: cherylmc
ms.author: cherylmc
ms.date: 09/19/2022
ms.service: virtual-wan
ms.topic: include
---

- The maximum number of groups that can be referenced by a single Point-to-site VPN Gateway is 90. The maximum number of members in groups assigned to a Gateway is 390. However, if a group is assigned to multiple connection configurations on the same Gateway, this group and its members are counted multiple times towards the limits. For example, if there's a policy group with 10 members that is assigned to three VPN connection configurations on the Gateway. This configuration would count as three groups with 30 total members as opposed to one group with 10 members.
- Once a group has been created as part of a VPN server configuration, the name and default setting of a group can't be modified.  
- Group names should be distinct.
- Groups that have lower numerical priority are processed prior to groups with higher numerical priority. If a connecting user is a member of multiple groups, the gateway will consider them to be a member of the group with lower numerical priority for purposes of assigning IP addresses.
- Groups that are being used by existing point-to-site VPN gateways can't be deleted.  
- You can reorder the priorities of your groups by clicking on the up-down arrow buttons corresponding to that group.
- During the public preview, modifications of the VPN server configuration (for example, adding/removing members, changing priorities) aren't automatically propagated to the gateway. To ensure the gateway uses the latest version of the VPN server configuration, change the address pools associated to your VPN connection configurations.
- Address pools can't overlap with address pools used in other connection configurations (same or different gateways) in the same virtual WAN. Address pools also can't overlap with virtual network address spaces, virtual hub address spaces, or on-premises addresses.

