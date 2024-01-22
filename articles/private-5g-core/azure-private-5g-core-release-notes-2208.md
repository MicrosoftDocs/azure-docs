---
title: Azure Private 5G Core 2208 release notes 
description: Discover what's new in the Azure Private 5G Core 2208 release
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 09/23/2022
---

# Azure Private 5G Core 2208 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2208 release for the Azure Private 5G Core. The release notes are continuously updated, and critical issues requiring a workaround are added here as they're discovered. Before deploying this new version, carefully review the information contained in these release notes.

This article applies to the Azure Private 5G Core 2208 version (PMN-4-16). This release is compatible with the Azure Stack Edge Pro GPU running the 2207 release and is supported by the 2022-04-01-preview [Microsoft.MobileNetwork API version](/rest/api/mobilenetwork).

## What's new

- **NRF removal** - Azure Private 5G Core no longer includes the NRF network function (NF). Since peer NFs are statically configured and there's no longer the need to perform NF discovery, this change simplifies the solution, decreases the attack surface, and reduces the latency.

## Issues fixed in the 2208 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 |  4G/5G signaling  | In some scenarios, Azure Private 5G Core may fail to resume N2 or S1-MME connectivity if the system is restarted. This issue is fixed in this release. |
  | 2 | Local distributed tracing  | Azure Private 5G Core local distributed tracing web GUI may show an authentication error when accessed from multiple browser windows by a single user. This issue has been fixed in this release.   |
  | 3 | Local dashboards  | Azure Private 5G Core local dashboards display a higher value than the true value for multiple graphs due to lines being vertically stacked rather than overlaid. This issue has been fixed in this release.   |
  | 4 | Local dashboards  | In rare scenarios, Azure Private 5G Core local dashboards lose older data. This issue has been fixed in this release.  |
  | 5 | Local distributed tracing  | Azure Private 5G Core local distributed tracing dashboard shows wrong representation of the user equipment (UE) registration type. This has now been improved to provide a plain text message detailing the UE registration type.  |
  | 6 | 4G/5G signaling  | If a UE reuses the same protocol data unit (PDU) session ID as an existing session, an error may occur. This issue has been fixed as part of support for network-initiated session release.  |
  | 7 | Local dashboards  | In the event of a system restart, Azure Private 5G Core local dashboard passwords were reset to the default value. This issue has been fixed in this release.   |

## Known issues in the 2208 release

The following table provides a summary of known issues in this release.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | 4G/5G signaling  | In rare scenarios, Azure Private 5G Core may lose the copy of subscriber data stored at the edge, resulting in a loss of service until the edge is reinstalled.  | Reprovision SIM policies and SIMs.  |
  | 2 | 4G/5G signaling  | In rare scenarios, Azure Private 5G Core may fail to notify a UE of downlink data that arrives while the UE is idle.  | Toggle airplane mode **on/off** on the UE. The downlink data will then transmit to the UE correctly.  |
  | 3 | Local dashboards  | Azure Private 5G Core local dashboards don't automatically refresh to show the latest data.  | Manually refresh the web browser to refresh the dashboard contents.  |
  | 4 | Local dashboards  | Azure Private 5G Core local dashboard configuration may be lost during a configuration change.  | Manually reset the local dashboard password and recreate any custom dashboards.   |
  | 5 | Policy configuration  | Azure Private 5G Core may ignore non-default quality of service (QoS) and policy configuration when handling 4G subscribers.  | Not applicable.   |
  | 6 | Packet forwarding  | Azure Private 5G Core may not forward buffered packets if NAT is enabled.  | Not applicable. |
  | 7 | 4G/5G signaling  | Azure Private 5G Core may, with low periodicity, reject a small number of attach requests.  | The attach requests should be reattempted. |
  | 8 | 4G/5G signaling  | Azure Private 5G Core will incorrectly accept Stream Control Transmission Protocol (SCTP) connections on the wrong N2 IP address.  | Connect to Packet Core's N2 interface on the correct IP and port.  |
  | 9 | 4G/5G signaling  | Azure Private 5G Core may perform an unnecessary PDU Session Resource Setup Transaction following a UE initiated service request.  | Not applicable. |
  | 10 | 4G/5G signaling  | In rare scenarios, Azure Private 5G Core may corrupt the internal state of a packet data session, resulting in subsequent changes to that packet data session failing.  | Reinstall the Packet Core.  |
  | 11 | 4G/5G signaling  | In scenarios when the establishment of a PDU session has failed, Azure Private 5G Core may not automatically release the session, and the UE may need to re-register.  | The UE should re-register.  |
  | 12 | 4G/5G signaling  | 4G UEs that require both circuit switched (CS) and packet switched (PS) network availability to successfully attach to Azure Private 5G Core may disconnect after a successful attach.  | Update/enhance the UEs to support PS only networks if possible, as CS isn't supported by Azure Private 5G Core. If it isn't possible to reconfigure the UEs, customer support can apply a low-level configuration tweak to Azure Private 5G Core to let these UEs believe there's a CS network available.  |
  | 13 | Packet forwarding  | When Azure Private 5G Core has NAT enabled on a data network, approximately one in every 65,536 downlink packets sent to a UE will be emitted with an incorrect IP checksum, which will likely cause it to be dropped.  | 

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
