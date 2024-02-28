---
title: Azure Private 5G Core 2402 release notes
description: Discover what's new in the Azure Private 5G Core 2402 release
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 02/29/2024
---

# Azure Private 5G Core 2402 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2402 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, review the information contained in these release notes.

This article applies to the AP5GC 2402 release (2402.0-1). This release is compatible with the Azure Stack Edge Pro 1 GPU and Azure Stack Edge Pro 2 running the ASE 2312 release and supports the 2023-09-01, 2023-06-01 and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions. 

For more information about compatibility, see [Packet core and Azure Stack Edge compatibility](azure-stack-edge-packet-core-compatibility.md). 


## Support lifetime

Packet core versions are supported until two subsequent versions are released (unless otherwise noted). You should plan to upgrade your packet core in this time frame to avoid losing support.

### Currently supported packet core versions
The following table shows the support status for different Packet Core releases and when they are expected to no longer be supported.

| Release | Support Status |
|---------|----------------|
| AP5GC 2402 | Supported until AP5GC 2407 is released |
| AP5GC 2310 | Supported until AP5GC 2404 is released |
| AP5GC 2308 and earlier | Out of Support |

## What's new

<TBC>

## Issues fixed in the AP5GC 2402 release

The following table provides a summary of issues fixed in this release.

<TO BE UPDATED>
  |No.  |Feature  | Issue |  SKU Fixed In |
  |-----|-----|-----|-----|----|
  | 1 | Packet Forwarding  | In scenarios of sustained high load (for example, continuous setup of 100s of TCP flows per second) in 4G setups, AP5GC might encounter an internal error, leading to a short period of service disruption resulting in some call failures. | 2310.0-4 | 
  | 2 | Packet Forwarding | An intermittent fault at the network layer causes an outage of packet forwarding | 2310.0-8 |
  | 3 | Diagnosability | During packet capture, uplink userplane packets can be omitted from packet captures | 2310.0-8 |
  | 4 | Packet Forwarding | Errors in userplane packet detection rules can cause incorrect packet handling | 2310.0-8 |
  | 5 | Diagnosability | Procedures from different subscribers appear in the same trace | 2310.0-8 |




## Known issues in the AP5GC 2402 release
<!--**TO BE UPDATED**>
  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 |  |  |  |
<-->

The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Packet Forwarding | A slight(0.01%) increase in packet drops is observed in latest AP5GC release installed on ASE Platform Pro2 with ASE-2309 for throughput higher than 3.0 Gbps. | None |
  | 2 | Local distributed tracing | In Multi PDN session establishment/Release call flows with different DNs, the distributed tracing web GUI fails to display some of 4G NAS messages (Activate/deactivate Default EPS Bearer Context Request) and some S1AP messages (ERAB request, ERAB Release). | None |
  | 3 | Local distributed tracing | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory doesn't transmit via the web proxy. If there's a firewall blocking traffic that doesn't go via the web proxy then enabling Azure Active Directory causes the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |

  

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
