---
title: Azure Private 5G Core 2302 release notes 
description: Discover what's new in the Azure Private 5G Core 2302 release
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 01/31/2023
---

# Azure Private 5G Core 2302 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2302 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, please review the information contained in these release notes.

This article applies to the AP5GC 2302 release (PMN-2302-0). This release is compatible with the ASE Pro GPU running the ASE 2301 release, and is supported by the 2022-04-01-preview and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions.

## Support lifetime

Packet core versions are supported until two subsequent versions have been released (unless otherwise noted). This is typically two months after the release date. You should plan to upgrade your packet core in this time frame to avoid losing support.

## What's new

- **Rollback** - This feature allows you to easily revert to a previous packet core version if you encounter issues after upgrading the packet core. For details, see [Rollback (portal)](upgrade-packet-core-azure-portal.md#rollback) or [Rollback (ARM)](upgrade-packet-core-arm-template.md#rollback).

## Issues fixed in the AP5GC 2302 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Packet forwarding | When Azure Private 5G Core has NAT enabled on a data network, approximately one in every 65,536 downlink packets sent to a UE will be emitted with an incorrect IP checksum, which will likely cause them to be dropped. This issue has been fixed in this release.    |

## Known issues in the AP5GC 2302 release

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | 4G/5G signaling | Modifications to the Attached Data Network resource in an existing deployment may cause service disruption unless the packet core is reinstalled. | Reinstall the packet core. |
  | 2 | Packet forwarding | In scenarios of sustained high load (for example, continuous setup of 100s of TCP flows per second) combined with NAT pinhole exhaustion, AP5GC can encounter a memory leak, leading to a short period of service disruption resulting in some call failures. | In most cases, the system will recover automatically and be ready to handle new requests after a few seconds' disruption. UEs will need to re-establish any dropped connections. |
  | 3 | 4G/5G signaling | In some cases the Azure Private 5G Core reports successful installation even when the underlying platform or networking is misconfigured. | Not applicable. |

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases. 

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Packet forwarding  | Azure Private 5G Core may not forward buffered packets if NAT is enabled. | Not applicable. |
  | 2 | Local dashboards  | In some scenarios, the local dashboards don't show session rejection under the **Device and Session Statistics** panel if Session Establishment requests are rejected due to invalid PDU type (e.g. IPv6 when only IPv4 supported). | Not applicable. |
  | 3 | 4G/5G signaling  | In rare scenarios of continuous high load over several days on a 4G multi-data network setup, the packet core may experience slight disruption resulting in some call failures. | The packet core will resume operations within a few seconds. |
  | 4 | Install/upgrade | Changing the technology type of a deployment from 4G (EPC) to 5G using upgrade or site delete and add is not supported. | Please contact support for the required steps to change the technology type. |

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
