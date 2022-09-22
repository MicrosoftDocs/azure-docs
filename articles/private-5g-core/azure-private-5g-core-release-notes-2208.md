---
title: Azure Private 5G Core 2208 release notes 
description: Discover what's new in the Azure Private 5G Core 2208 release
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 09/23/2022
---

# Azure Private 5G Core 2208 release notes

The following release notes identify the new features, critical open issues and resolved issues for the 2208 release for the Azure Private 5G Core. The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they’re added. Before deploying this new version, please carefully review the information contained in these release notes.

This article applies to the AP5GC 2208 version (SKU 4.16). This release is compatible with the ASE Pro GPU running the 2207 release and is supported by the 2022-04-01-preview Microsoft.MobileNetwork API version.

## What's new

- **NRF removal** - This change removes the NRF network function which simplifies the solution, decreases the attack surface, reduces the latency, as peer NFs are statically configured and there is no longer the need to perform NF discovery.

## Issues fixed in the 2208 release

The following table provides a summary of issues fixed in this release. 

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 |  4G/5G Signaling  | In some scenarios, Azure Private 5G Core may fail to resume N2 or S1-MME connectivity if the system is restarted. This issue is fixed in this release. |
  | 2 | Local distributed tracing  | Azure Private 5G Core local distributed tracing web GUI may show an authentication error when accessed from multiple browser windows by a single user. This issue has been fixed in this release.   |
  | 3 | Local dashboards  | Azure Private 5G Core local dashboards display a higher value than the true value for multiple graphs due to lines being vertically stacked rather than overlaid. This issue has been fixed in this release.   |
  | 4 | Local dashboards  | In rare scenarios Azure Private 5G Core local dashboards lose older data. This issue has been fixed in this release.  |
  | 5 | Local distributed tracing  | Azure Private 5G Core local distributed tracing dashboard shows wrong representation of UE registration type - this has now been improved to provide a plain text message detailing the UE registration type.  |
  | 6 | 4G/5G Signaling  | If a UE reuses the same PDU Session ID as an existing session, an error may occur, this issue has been fixed as part of support for network-initiated session release.  |
  | 7 | Local dashboards  | In the event of a system restart, Azure Private 5G Core local dashboard passwords were reset to the default value. This issue has been fixed in this release.   |

## Known issues in the 2208 release

The following table provides a summary of known issues in this release.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | 4G/5G Signaling  | In rare scenarios, Azure Private 5G Core may lose the copy of subscriber data stored at the edge, resulting in a loss of service until the edge is reinstalled.  | Re-provision SIM policies and SIMs  |
  | 2 | 4G/5G Signaling  | In rare scenarios, Azure Private 5G Core may fail to notify a UE of downlink data which arrives while the UE is idle.  | Toggle airplane mode on/off on the UE and the downlink data will transmit to the UE correctly.  |
  | 3 | Local dashboards  | Azure Private 5G Core local dashboards do not automatically refresh to show the latest data.  | Manually refresh the web browser to refresh the dashboard contents.  |
  | 4 | Local dashboards  | Azure Private 5G Core local dashboard configuration may be lost during a configuration change.  | Manually reset the local dashboard password and recreate any custom dashboards.   |
  | 5 | Policy configuration  | Azure Private 5G Core may ignore non-default QoS and Policy configuration when handling 4G subscribers.  | This configuration issue will be resolved in a future release.   |
  | 6 | Packet forwarding  | Azure Private 5G Core may not forward buffered packets if NAT is enabled  |  |
  | 7 | 4G/5G Signaling  | Azure Private 5G Core may, with low periodicity, reject a small number of attach requests.  | The attach requests should be re-attempted |
  | 8 | 4G/5G Signaling  | Azure Private 5G Core will incorrectly accept SCTP connections on the wrong N2 IP address.  | Connect to Packet Core's N2 interface on the correct IP and port.  |
  | 9 | 4G/5G Signaling  | Azure Private 5G Core may perform an unnecessary PDU Session Resource Setup Transaction following a UE initiated service request  |  |
  | 10 | 4G/5G Signaling  | In rare scenarios, Azure Private 5G Core may corrupt the internal state of a packet data session, resulting in subsequent changes to that packet data session failing  | Reinstall the Packet Core  |
  | 11 | 4G/5G Signaling  | In scenarios when the establishment of a PDU session has failed, Azure Private 5G Core may not automatically release the session, and the UE may need to re-register.  | The UE should re-register.  |
  | 12 | 4G/5G Signaling  | 4G UEs which require both CS (circuit switched - not supported by AP5GC) and PS (packet switched) network availability to successfully attach to Azure Private 5G Core, may disconnect themselves immediately after a successful attach.  | UEs should support PS only networks - update/enhance the UEs if possible. If it is not possible to reconfigure the UEs, customer support can apply a low-level configuration tweak to Azure Private 5G Core to let these UEs believe there is a CS network available.  |