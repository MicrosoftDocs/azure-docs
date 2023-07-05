---
title: Azure Private 5G Core 2209 release notes 
description: Discover what's new in the Azure Private 5G Core 2209 release
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 09/30/2022
---

# Azure Private 5G Core 2209 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2209 release for the Azure Private 5G Core. The release notes are continuously updated, and critical issues requiring a workaround are added here as they're discovered. Before deploying this new version, carefully review the information contained in these release notes.

This article applies to the Azure Private 5G Core 2209 release (PMN-4-17-2). This release is compatible with the Azure Stack Edge Pro GPU running the 2209 release and is supported by the 2022-04-01-preview [Microsoft.MobileNetwork API version](/rest/api/mobilenetwork).

## What's new

- **Updated template for Log Analytics** - There is a new version of the Log Analytics Dashboard Quickstart template. This is required to view metrics on Packet Core versions 4.17 and above. To continue using your Log Analytics Dashboard, you must redeploy it with the new template. See [Create an overview Log Analytics dashboard using an ARM template](./create-overview-dashboard.md).

> [!NOTE]
> Monitoring Azure Private 5G Core with Log Analytics is no longer supported. Use [Azure Monitor platform metrics](monitor-private-5g-core-with-platform-metrics.md) instead.

## Issues fixed in the 2209 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Reboot | In some cases, Azure Private 5G Core 4G deployments may not start up correctly after a reboot/power cycle and reject all traffic. This issue has been fixed in this release. |
  | 2 | Reboot | When the Azure Private 5G Core instance is rebooted, all subscriber data may be lost from the edge. This issue has been fixed in this release.   |
  | 3 | 4G/5G Signaling  | In rare scenarios, Azure Private 5G Core may lose the copy of subscriber data stored at the edge, resulting in a loss of service until the edge is reinstalled. This issue has been fixed in this release.  |
  | 4 | Local dashboards  | Azure Private 5G Core local dashboards don't update to show data from the time period selected in the time filter on the top right of the page. This issue has been fixed in this release.  |
  | 5 | 4G/5G Signaling  | In rare scenarios, Azure Private 5G Core may fail to notify a UE of downlink data that arrives while the UE is idle. This issue has been fixed in this release.  |
  | 6 | Local dashboards  | Azure Private 5G Core local dashboard configuration may be lost during a configuration change. This issue has been fixed in this release.  |
  | 7 | Local dashboards  | Azure Private 5G Core local dashboards don't automatically refresh to show the latest data. This issue has been fixed in this release.  |

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Local dashboards  | Azure Private 5G Core local dashboards may show incorrect values in some graphs (for example, session counts) after a power cycle of the Azure Stack Edge server.  | Not applicable. |
  | 2 | Packet forwarding  | Azure Private 5G Core drops N3 data packets received from a gNodeB if they have specific flags set in the GTP-UPacket Header, resulting in the traffic from the user equipment (UE) never reaching the server on the N6 side. Specifically, the *Sequence Number* or *N-PDU* GTP-U header flags being set cause this issue.  | Configure the gNodeB to not set these problem flags.  |
  | 3 | Local dashboards  | The distributed tracing web GUI fails to display and decode some fields of 4G/5G NAS messages. Specifically, the *Request Type* and *DNN* information elements.  | Messages will have to be viewed from separate packet capture if needed.  |
  | 4 | Performance  | It has been observed very rarely that CPU allocation on an Azure Private 5G Packet Core deployment can result in some signaling processing workloads sharing a logical CPU core with data plane processing workloads, resulting in session creation failures or packet processing latency/failures at a moderate load.  | Redeploying the Azure Private 5G Packet Core may resolve the problematic CPU allocation.  |
  | 5 | 4G/5G Signaling  | Azure Private 5G Core may, with low periodicity, reject a small number of attach requests.  | The attach requests should be reattempted. |
  | 6 | 4G/5G Signaling  | 4G UEs that require both circuit switched (CS) and packet switched (PS) network availability to successfully attach to Azure Private 5G Core may disconnect immediately after a successful attach.  | Update/enhance the UEs to support PS only networks if possible, as CS isn't supported by Azure Private 5G Core. If it isn't possible to reconfigure the UEs, customer support can apply a low-level configuration tweak to Azure Private 5G Core to let these UEs believe there's a CS network available. |
  | 7 | Policy configuration  | Azure Private 5G Core may ignore non-default quality of service (QoS) and policy configuration when handling 4G subscribers.  | Not applicable. |
  | 8 | Packet forwarding  | Azure Private 5G Core may not forward buffered packets if NAT is enabled.  | Not applicable. |
  | 9 | 4G/5G Signaling  | Azure Private 5G Core will incorrectly accept SCTP connections on the wrong N2 IP address.  | Connect to Packet Core's N2 interface on the correct IP and port.  |
  | 10 | 4G/5G Signaling  | Azure Private 5G Core may perform an unnecessary PDU session resource setup transaction following a UE initiated service request.  | Not applicable. |
  | 11 | 4G/5G Signaling  | In rare scenarios, Azure Private 5G Core may corrupt the internal state of a packet data session, resulting in subsequent changes to that packet data session failing.  | Reinstall the packet core.  |
  | 12 | 4G/5G Signaling  | In scenarios when the establishment of a PDU session has failed, Azure Private 5G Core may not automatically release the session, and the UE may need to re-register.  | The UE should re-register.  |
  | 13 | 4G/5G Signaling  | In rare scenarios, due to a race condition triggered during a RAN disconnect/re-connect sequence, Azure Private 5G Core may fail to process incoming requests from the eNodeB or gNodeB.   | Reinstall the packet core.  |
  | 14 | Local dashboards  | On the packet core dashboards, the 4G interface panel doesn’t display the data.  | Select each panel’s edit button and select Data source again as Prometheus and select refresh to see the data. |
  | 15 | 4G/5G Signaling  | In rare scenarios when a significant number of UEs are bulk registered and send continuous data , the core may incorrectly release data sessions. | If sessions are released, UEs may need to re-connect with the system to use data services.  |
  | 16 | Packet forwarding  | When Azure Private 5G Core has NAT enabled on a data network, approximately one in every 65,536 downlink packets sent to a UE will be emitted with an incorrect IP checksum, which will likely cause it to be dropped.  | 

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)