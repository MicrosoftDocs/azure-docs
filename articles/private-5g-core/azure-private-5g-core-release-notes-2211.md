---
title: Azure Private 5G Core 2211 release notes 
description: Discover what's new in the Azure Private 5G Core 2211 release
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 12/12/2022
---

# Azure Private 5G Core 2211 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2211 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they’re added. Before deploying this new version, please review the information contained in these release notes.  

This article applies to the AP5GC 2211 release (PMN-2211-0). This release is compatible with the ASE Pro GPU running the ASE 2210 release and is supported by the 2022-04-01-preview and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions.

## Support lifetime

Packet core versions are supported until two subsequent versions have been released (unless otherwise noted). This is typically two months after the release date. You should plan to upgrade your packet core in this time frame to avoid losing support.

## What's new

**Multiple data networks** - This release extends AP5GC to support connectivity to up to three Attached Data Networks for each Packet Core instead of one. 

The operator can provision UEs as subscribed in one or more Data Networks and apply Data Network-specific policy and QoS, allowing UEs to use multiple Layer 3 uplink networks selected based on policy or UE preference. 

Each Data Network can have its own configuration for DNS, UE IP address pools, N6 IP, and NAT. This concept also maps directly to 4G APNs. 

This feature has the following limitations: 

- Once more than a single Data Network is configured, further configuration changes require the packet core to be reinstalled. To ensure this reinstall happens only after you have made all your changes, you must follow the process for installing and modifying as described in the documentation.

- VLAN separation of Data Networks is not supported. Only Layer 3 separation is supported (meaning overlapping IP address spaces across the Data Networks are not possible). 

- Metrics are not yet reported on a per-Data Network basis.

To add data networks to an existing site, see [Modify the packet core instance in a site](modify-packet-core.md). To create a new site, see [Create a site](create-a-site.md).

## Issues fixed in the AP5GC 2211 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | 4G/5G Signaling  | In rare scenarios when a significant number of UEs are bulk-registered and send continuous data, the core may incorrectly release data sessions. This issue has been fixed in this release.  |
  | 2 | 4G/5G Signaling  | Azure Private 5G Core may perform an unnecessary PDU Session Resource Setup Transaction following a UE-initiated service request. This issue has been fixed in this release.  |
  | 3 | Local distributed tracing  | The distributed tracing web GUI fails to display and decode 'Request Type' and 'DNN' information elements in 4G/5G NAS messages. This issue has been fixed in this release.  |
  | 4 | Performance | Very rarely, CPU allocation can result in some signaling processing workloads sharing a logical CPU core with data plane processing workloads. This results in session creation failures and packet processing latency or failures at a moderate load. This issue has been fixed in this release.  |
  | 5 | Local dashboards | Azure Private 5G Core local dashboards may show incorrect values in some graphs (e.g. session counts) after a power cycle of the server. This issue has been fixed in this release.  |

## Known issues in the AP5GC 2211 release

The following table provides a summary of known issues in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Local dashboards | In deployments with multiple Data Networks, **UPF Downstream CPU Utilization** is incorrectly reported on the local dashboards when running calls using single Data Network.  | 
  | 2 | Local dashboards  | In some scenarios, the local dashboards don't show session rejection under the **Device and Session Statistics** panel if Session Establishment requests are rejected due to invalid PDU type (e.g. IPv6 when only IPv4 supported).   | 


## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases. 

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Policy configuration  | Azure Private 5G Core may ignore non-default QoS and Policy configuration when handling 4G subscribers.  | 
  | 2 | Packet forwarding  | Azure Private 5G Core may not forward buffered packets if NAT is enabled.   | 
  | 3 | Packet forwarding  | When Azure Private 5G Core has NAT enabled on a data network, approximately one in every 65,536 downlink packets sent to a UE will be emitted with an incorrect IP checksum, which will likely cause it to be dropped.  | 


## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
