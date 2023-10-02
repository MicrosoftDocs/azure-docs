---
title: Azure Private 5G Core 2303 release notes
description: Discover what's new in the Azure Private 5G Core 2303 release
author: liumichelle
ms.author: limichel
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 03/29/2023
---

# Azure Private 5G Core 2303 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2303 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, please review the information contained in these release notes.

This article applies to the AP5GC 2303 release (PMN-2303-0). This release is compatible with the ASE Pro 1 GPU and ASE Pro 2 running the ASE 2301 and ASE 2303 releases, and is supported by the 2022-04-01-preview and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions.

## Support lifetime

Packet core versions are supported until two subsequent versions have been released (unless otherwise noted). This is typically two months after the release date. You should plan to upgrade your packet core in this time frame to avoid losing support.

## What's new

- **VLAN separation on ASE LAN and WAN ports** - This release delivers the ability to set VLAN tags on the external interfaces used by AP5GC, namely the S1-MME, N2, S1-U, N3, SGi, and N6 interfaces. VLAN tagging can also be set per data network configured on the N6/SGi interface, enabling layer 2 separation between these networks.  For more details, see [Private mobile network design requirements](private-mobile-network-design-requirements.md).

- **Azure Stack Edge Pro 2 support** - This release (and releases going forward) officially supports compatibility with Azure Stack Edge Pro 2 devices running the ASE 2301 release (and subsequent ASE releases). This and subsequent AP5GC releases support all three models of ASE Pro 2 (Model 64G2T, Model 128G4T1GPU, and Model 256G6T2GPU). All models of the ASE Pro 2 have four ports, instead of the six ports found on the ASE Pro 1 GPU.

- **Web Proxy support** - This feature allows running AP5GC on an ASE configured to use a Web Proxy. For more details on how to configure a Web Proxy on ASE, see [Tutorial: Configure network for Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).

## Issues fixed in the AP5GC 2303 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Install/Upgrade | Modifications to the Attached Data Network resource in an existing deployment may cause service disruption unless the packet core is reinstalled. This issue has been fixed in this release.   |
  | 2 | 4G/5G Signaling | In rare scenarios of continuous high load over several days on a 4G multi-data network setup, the packet core may experience slight disruption resulting in some call failures. This issue has been fixed in this release.   |

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Packet forwarding  | AP5GC may not forward buffered packets if NAT is enabled. | Not applicable. |
  | 2 | Local dashboards  | In some scenarios, the local dashboards don't show session rejection under the **Device and Session Statistics** panel if Session Establishment requests are rejected due to invalid PDU type (e.g. IPv6 when only IPv4 supported). | Not applicable. |
  | 3 | Install/upgrade | Changing the technology type of a deployment from 4G (EPC) to 5G using upgrade or site delete and add is not supported. | Please contact support for the required steps to change the technology type. |
  | 4 | Packet forwarding | In scenarios of sustained high load (for example, continuous setup of 100s of TCP flows per second) combined with NAT pinhole exhaustion, AP5GC can encounter a memory leak, leading to a short period of service disruption resulting in some call failures. | In most cases, the system will recover automatically and be ready to handle new requests after a few seconds' disruption. UEs will need to re-establish any dropped connections. |
  | 5 | Install/Upgrade | In some cases, the packet core reports successful installation even when the underlying platform or networking is misconfigured. | Not applicable. |
  | 6 | Azure AD and web proxy | Where Azure Active Directory is used to authenticate access to Grafana/SAS, this traffic does not transmit via the web proxy when enabled on the Azure Stack Edge appliance that the packet core is running on. |

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
