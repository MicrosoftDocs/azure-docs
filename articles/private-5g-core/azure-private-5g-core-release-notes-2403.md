---
title: Azure Private 5G Core 2403 release notes
description: Discover what's new in the Azure Private 5G Core 2403 release.
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 04/04/2023
---

# Azure Private 5G Core 2403 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2403 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, review the information contained in these release notes.

This article applies to the AP5GC 2403 release (2403.0-4). This release is compatible with the Azure Stack Edge (ASE) Pro 1 GPU and Azure Stack Edge Pro 2 running the ASE 2403 release and supports the 2023-09-01, 2023-06-01 and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions. 

For more information about compatibility, see [Packet core and Azure Stack Edge compatibility](azure-stack-edge-packet-core-compatibility.md). 

For more information about new features in Azure Private 5G Core, see [What's New Guide](whats-new.md).

## Support lifetime

Packet core versions are supported until two subsequent versions are released (unless otherwise noted). You should plan to upgrade your packet core in this time frame to avoid losing support.

### Currently supported packet core versions
The following table shows the support status for different Packet Core releases and when they're expected to no longer be supported.

| Release | Support Status |
|---------|----------------|
| AP5GC 2403 | Supported until AP5GC 2407 is released |
| AP5GC 2310 | Supported until AP5GC 2404 is released |
| AP5GC 2308 and earlier | Out of Support |

## What's new

### TCP Maximum Segment Size (MSS) Clamping

TCP session initial setup messages that include a Maximum Segment Size (MSS) value, which controls the size limit of packets transmitted during the session. The packet core now automatically sets this value, where necessary, to ensure packets aren't too large for the core to transmit. This reduces packet loss due to oversized packets arriving at the core's interfaces, and reduces the need for fragmentation and reassembly, which are costly procedures.

### Improved Packet Core Scaling 

In this release, the maximum supported limits for a range of parameters in an Azure Private 5G Core deployment increase. Testing confirms these limits, but other factors could affect what is achievable in a given scenario. 
The following table lists the new maximum supported limits.

| Element                | Maximum supported |
|------------------------|-------------------|
| PDU sessions           | Enterprise radios typically support up to 1000 simultaneous PDU sessions per radio |
| Bandwidth              | Over 25 Gbps per ASE |
| RAN nodes (eNB/gNB)    | 200 per packet core |
| Active UEs             | 10,000 per deployment (all sites) |
| SIMs                   | 20,000 per ASE |
| SIM provisioning       | 10,000 per JSON file via Azure portal, 4 MB per REST API call  |

For more information, see [Service Limits](azure-stack-edge-virtual-machine-sizing.md#service-limits).

## Issues fixed in the AP5GC 2403 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |  SKU Fixed In |
  |-----|---------|-------|---------------|
  | 1 | Local distributed tracing | In Multi PDN session establishment/Release call flows with different DNs, the distributed tracing web GUI fails to display some of 4G NAS messages (Activate/deactivate Default EPS Bearer Context Request) and some S1AP messages (ERAB request, ERAB Release). | 2403.0-2 |
  | 2 | Packet Forwarding | A slight(0.01%) increase in packet drops is observed in latest AP5GC release installed on ASE Platform Pro 2 with ASE-2309 for throughput higher than 3.0 Gbps. | 2403.0-2 |
  | 3 | Security | [CVE-2024-20685](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-20685) | 2403.0-2 |
  | 4 | Packet Forwarding | GTP Echo requests are rejected by the packet core on the N3 reference point, causing an outage of packet forwarding. | 2403.0-4 |

## Known issues in the AP5GC 2403 release
<!--**TO BE UPDATED**>
  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|
  | 1 |  |  |  |
<-->

The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Local distributed tracing | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory doesn't transmit via the web proxy. If there's a firewall blocking traffic that doesn't go via the web proxy then enabling Azure Active Directory causes the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
