---
title: Azure Private 5G Core 2308 release notes
description: Discover what's new in the Azure Private 5G Core 2308 release
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 07/11/2023
---

# Azure Private 5G Core 2310 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2308 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, review the information contained in these release notes.

This article applies to the AP5GC 2310 release (2310.0-X). This release is compatible with the Azure Stack Edge Pro 1 GPU and Azure Stack Edge Pro 2 running the ASE 2309 release and supports the 2023-09-01, 2023-06-01 and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions. 

For more information about compatibility, see [Packet core and Azure Stack Edge compatibility](azure-stack-edge-packet-core-compatibility.md). 


## Support lifetime

Packet core versions are supported until two subsequent versions are released (unless otherwise noted), which is typically two months after the release date. You should plan to upgrade your packet core in this time frame to avoid losing support.

### Currently supported packet core versions
The following table shows the support status for different Packet Core releases.

| Release | Support Status |
|---------|----------------|
| AP5GC 2310 | Supported until AP5GC 2401 released |
| AP5GC 2308 | Supported until AP5GC 2311 released |
| AP5GC 2307 and earlier | Out of Support |

## What's new

### Optional N2/N3/S1/N6 gateway
This feature makes the N2, N3 and N6 gateways as optional during the network configuration of an ASE if the RAN and Packet Core are on the same subnet. This feature provides flexibility to the customers to use AP5GC without gateways if there's direct connectivity available with RAN and/or DN.

### Improved Software Download Time
This feature improves overall AP5GC Software download time by reducing the size of underlying software packages, with overall size of the software image reduced by around 40%.

### Per-UE information in Azure portal + API
This feature enables the customer to view UE level information in the Azure portal that includes UE list with high level information and a detailed view for each UE. This information is the current snapshot of the UE in the system and can be fetched on-demand with a throttling period of 5 min.

### Per gNB metrics in Azure portal
This feature categorizes a few metrics based on the RAN identifier, for example UL/DL bandwidth etc and are exposed to customer via Azure monitor under PCCP and PCDP resources. These metrics shall be used to correlate the RAN & Packet Core metrics and troubleshoot.

### Combined 4G/5G on a single packet core
This feature allows a packet core which supports both 4G and 5G networks on a single Mobile Network Site. Customers can deploy a RAN network with both 4G and 5G radios and to connect to a single packet core.


## Issues fixed in the AP5GC 2310 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Packet Forwarding  | In scenarios of sustained high load (for example, continuous setup of 100's of TCP flows per second) in 4G setups, AP5GC may encounter an internal error, leading to a short period of service disruption resulting in some call failures. |


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
  | 3 | Local distributed tracing | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory doesn't transmit via the web proxy. If there's a firewall blocking traffic that does not go via the web proxy then enabling Azure Active Directory causes the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |

  

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
