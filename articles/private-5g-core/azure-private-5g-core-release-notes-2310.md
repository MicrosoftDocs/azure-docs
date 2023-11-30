---
title: Azure Private 5G Core 2310 release notes
description: Discover what's new in the Azure Private 5G Core 2310 release
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 11/07/2023
---

# Azure Private 5G Core 2310 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2308 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, review the information contained in these release notes.

This article applies to the AP5GC 2310 release (2310.0-X). This release is compatible with the Azure Stack Edge Pro 1 GPU and Azure Stack Edge Pro 2 running the ASE 2309 release and supports the 2023-09-01, 2023-06-01 and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions. 

For more information about compatibility, see [Packet core and Azure Stack Edge compatibility](azure-stack-edge-packet-core-compatibility.md). 


## Support lifetime

Packet core versions are supported until two subsequent versions are released (unless otherwise noted). You should plan to upgrade your packet core in this time frame to avoid losing support.

### Currently supported packet core versions
The following table shows the support status for different Packet Core releases and when they are expected to no longer be supported.

| Release | Support Status |
|---------|----------------|
| AP5GC 2310 | Supported until AP5GC 2403 is released |
| AP5GC 2308 | Supported until AP5GC 2401 is released |
| AP5GC 2307 and earlier | Out of Support |

## What's new

### Optional N2/N3/S1/N6 gateway
This feature makes the N2, N3 and N6 gateways optional during the network configuration of an ASE if the RAN and Packet Core are on the same subnet. This feature provides flexibility to use AP5GC without gateways if there's direct connectivity available with the RAN and/or DN.

### Improved software download time
This feature improves overall AP5GC software download time by reducing the size of underlying software packages. The overall size of the software image is reduced by around 40%.

### Per-UE information in Azure portal and API
This feature allows you to view UE-level information in the Azure portal, including a list of SIMs with high level information and a detailed view for each SIM. This information is the current snapshot of the UE in the system and can be fetched on-demand with a throttling period of 5 min. See [Manage existing SIMs for Azure Private 5G Core - Azure portal](manage-existing-sims.md).

### Per gNB metrics in Azure portal
This feature categorizes a few metrics based on the RAN identifier, for example UL/DL bandwidth etc. These metrics are exposed via Azure monitor under Packet Core Control Plane and Packet Core Data Plane resources. These metrics can be used to correlate the RAN and packet core metrics and troubleshoot.

### Combined 4G/5G on a single packet core
This feature allows a packet core that supports both 4G and 5G networks on a single Mobile Network site. You can deploy a RAN network with both 4G and 5G radios and connect to a single packet core.


## Issues fixed in the AP5GC 2310 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Packet Forwarding  | In scenarios of sustained high load (for example, continuous setup of 100s of TCP flows per second) in 4G setups, AP5GC might encounter an internal error, leading to a short period of service disruption resulting in some call failures. |


## Known issues in the AP5GC 2310 release
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
