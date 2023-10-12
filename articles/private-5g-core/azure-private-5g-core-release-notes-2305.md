---
title: Azure Private 5G Core 2305 release notes
description: Discover what's new in the Azure Private 5G Core 2305 release
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 05/31/2023
---

# Azure Private 5G Core 2305 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2305 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, please review the information contained in these release notes.

This article applies to the AP5GC 2305 release (PMN-2305-0). This release is compatible with the ASE Pro 1 GPU and ASE Pro 2 running the ASE 2303 release, and is supported by the 2022-04-01-preview and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions.

## Support lifetime

Packet core versions are supported until two subsequent versions have been released (unless otherwise noted). This is typically two months after the release date. You should plan to upgrade your packet core in this time frame to avoid losing support.

## What's new

- **User-Plane Inactivity Detection** - Starting from AP5GC 2305, a user-plane inactivity timer with a value of 600 seconds is configured for 5G sessions. If there is no traffic for 600 seconds and RAN-initiated Access Network release has not occurred, the Packet Core will release Access Network resources.

- **UE (user equipment) to UE internal forwarding** - This release delivers the ability for AP5GC to internally forward UE data traffic destined to another UE in the same Data Network (without going via an external router).

  If you're currently using the default service with allow-all SIM policy along with NAT enabled for the Data Network, or with an external router with deny rules for this traffic, you might have UE to UE traffic forwarding blocked. If you want to continue this blocking behavior with AP5GC 2305, see [Configure UE to UE internal forwarding](configure-internal-forwarding.md).

  If you're not using the default service with allow-all SIM policy and want to allow UE-UE internal forwarding, see [Configure UE to UE internal forwarding](configure-internal-forwarding.md).

- **Event Hubs feed of UE Usage** - This feature enhances AP5GC to provide an Azure Event Hubs feed of UE Data Usage events. You can integrate with Event Hubs to build reports on how your private 4G/5G network is being used or carry out other data processing using the information in these events.  If you want to enable this feature for your deployment, contact your support representative.

## Issues fixed in the AP5GC 2305 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Packet forwarding | In scenarios of sustained high load (e.g. continuous setup of hundreds of TCP flows per second) combined with NAT pin-hole exhaustion, AP5GC can encounter a memory leak, leading to a short period of service disruption resulting in some call failures. This issue has been fixed in this release. |
  | 2 | Install/Upgrade | Changing the technology type of a deployment from 4G (EPC) to 5G using the upgrade or site delete/add sequence is not supported. This issue has been fixed in this release. |
  | 3 | Local dashboards | In some scenarios, the Azure Private 5G Core local dashboards don't show session rejection under the **Device and Session Statistics** panel if "Session Establishment" requests are rejected due to invalid PDU type (e.g. IPv6 when only IPv4 is supported). This issue has been fixed in this release. |

## Known issues in the AP5GC 2305 release

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Local Dashboards | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory does not transmit via the web proxy. If there is a firewall blocking traffic that does not go via the web proxy then enabling Azure Active Directory will cause the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |
  | 2 | Reboot | AP5GC may intermittently fail to recover after the underlying platform is rebooted and may require another reboot to recover. | Not applicable. |

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Packet forwarding  | AP5GC may not forward buffered packets if NAT is enabled. | Not applicable. |
  | 2 | Install/Upgrade | In some cases, the packet core reports successful installation even when the underlying platform or networking is misconfigured. | Not applicable. |

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
