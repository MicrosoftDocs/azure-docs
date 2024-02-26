---
title: Azure Private 5G Core 2210 release notes 
description: Discover what's new in the Azure Private 5G Core 2210 release
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 11/01/2022
---

# Azure Private 5G Core 2210 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2210 release for the Azure Private 5G Core (AP5GC) packet core. The release notes are continuously updated, and critical issues requiring a workaround are added here as they're discovered. Before deploying this new version, carefully review the information contained in these release notes.

This article applies to the AP5GC 2210 release (PMN-4-18-0). This release is compatible with the ASE Pro GPU running the ASE 2209 release and is supported by the 2022-04-01-preview [Microsoft.MobileNetwork API version](/rest/api/mobilenetwork).

## Issues fixed in the AP5GC 2210 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | 4G/5G Signaling | Azure Private 5G Core will incorrectly accept SCTP connections on the wrong N2 IP address. This issue has been fixed in this release. |
  | 2 | 4G/5G Signaling | In rare scenarios, due to a race condition triggered during a RAN disconnect/re-connect sequence, Azure Private 5G Core may fail to process incoming requests from the eNodeB or gNodeB. This issue has been fixed in this release. |
  | 3 | 4G/5G Signaling  | In rare scenarios, Azure Private 5G Core may corrupt the internal state of a packet data session, resulting in subsequent changes to that packet data session failing. This issue has been fixed in this release. |
  | 4 | Packet forwarding  | Azure Private 5G Core drops N3 data packets received from a gNodeB if they have specific flags set in the GTP-UPacket Header, resulting in the traffic from the user equipment (UE) never reaching the server on the N6 side. Specifically, the *Sequence Number* or *N-PDU* GTP-U header flags being set cause this issue. |
  | 5 | Policy | In a specific scenario if the ASE 2209 release is reinstalled, the SIM and policy records from the first installation are retained on the ASE. This issue has been fixed in this release. |
  | 6 | 4G/5G Signaling  | In scenarios when the establishment of a PDU session has failed, Azure Private 5G Core may not automatically release the session, and the UE may need to re-register. This issue has been fixed in this release. |

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Policy configuration  | Azure Private 5G Core may ignore non-default quality of service (QoS) and policy configuration when handling 4G subscribers.  | Not applicable. |
  | 2 | Packet forwarding  | Azure Private 5G Core may not forward buffered packets if NAT is enabled.  | Not applicable. |
  | 3 | 4G/5G Signaling  | Azure Private 5G Core may perform an unnecessary PDU session resource setup transaction following a UE initiated service request.  | Not applicable. |
  | 4 | 4G/5G Signaling  | In rare scenarios when a significant number of UEs are bulk registered and send continuous data, the core may incorrectly release data sessions. | If sessions are released, UEs may need to re-connect with the system to use data services.  |
  | 5 | Local dashboards  | Azure Private 5G Core local dashboards may show incorrect values in some graphs (for example, session counts) after a power cycle of the Azure Stack Edge server.  | Not applicable. |
  | 6 | Local dashboards  | The distributed tracing web GUI fails to display and decode some fields of 4G/5G NAS messages. Specifically, the *Request Type* and *DNN* information elements.  | Messages will have to be viewed from separate packet capture if needed.  |
  | 7 | Performance  | It has been observed very rarely that CPU allocation on an Azure Private 5G Packet Core deployment can result in some signaling processing workloads sharing a logical CPU core with data plane processing workloads, resulting in session creation failures or packet processing latency/failures at a moderate load.  | Redeploying the Azure Private 5G Packet Core may resolve the problematic CPU allocation.  |
  | 8 | Packet forwarding  | When Azure Private 5G Core has NAT enabled on a data network, approximately one in every 65,536 downlink packets sent to a UE will be emitted with an incorrect IP checksum, which will likely cause it to be dropped.  | 

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
