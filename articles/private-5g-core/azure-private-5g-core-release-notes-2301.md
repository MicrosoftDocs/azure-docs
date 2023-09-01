---
title: Azure Private 5G Core 2301 release notes 
description: Discover what's new in the Azure Private 5G Core 2301 release
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 01/31/2023
---

# Azure Private 5G Core 2301 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2301 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they’re added. Before deploying this new version, please review the information contained in these release notes.

This article applies to the AP5GC 2301 release (PMN-2301-0). This release is compatible with the ASE Pro GPU running the ASE 2210 and ASE 2301 releases, and is supported by the 2022-04-01-preview and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions.

## Support lifetime

Packet core versions are supported until two subsequent versions have been released (unless otherwise noted). This is typically two months after the release date. You should plan to upgrade your packet core in this time frame to avoid losing support.

## What's new

- **Azure Active Directory based login to SAS and Grafana** - Azure Private 5G Core provides the distributed tracing and packet core dashboards tools for monitoring your deployment at the edge. With this new feature available as part of this AP5GC release, you can access these tools using Azure Active Directory (Azure AD) authentication. We recommend setting up Azure AD authentication to improve security in your deployment, although the existing local username and password mechanism is also available. 

  For details on configuring Azure AD based login after creating a site, see [Enable Azure Active Directory (Azure AD) for local monitoring tools](enable-azure-active-directory.md). You can also change the authentication type for existing sites by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

- **Multiple attached data networks improvements** – These improvements remove the need for additional manual steps when deploying or editing configuration for multiple data networks for your packet core. Additional guidance for configuring multiple data networks is also provided. All other support for multiple data network functionality remains as per the 2211 release. 

- **User plane packet capture** - This feature delivers a new debugging tool for use during system turn-up. The tool allows you to capture packet trace on N3 and N6 interfaces in order to debug network connectivity. For more details, see [Perform data plane packet capture for a packet core instance](data-plane-packet-capture.md).

## Issues fixed in the AP5GC 2301 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Local dashboards | In deployments with multiple Data Networks, **UPF Downstream CPU Utilization** is incorrectly reported on the local dashboards when running calls using single Data Network. This issue has been fixed in this release.   |

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases. 

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Policy configuration  | Azure Private 5G Core may ignore non-default QoS and Policy configuration when handling 4G subscribers. | Not applicable. |
  | 2 | Packet forwarding  | Azure Private 5G Core may not forward buffered packets if NAT is enabled. | Not applicable. |
  | 3 | Local dashboards  | In some scenarios, the local dashboards don't show session rejection under the **Device and Session Statistics** panel if Session Establishment requests are rejected due to invalid PDU type (e.g. IPv6 when only IPv4 supported). | Not applicable. |
  | 4 | Packet forwarding  | When Azure Private 5G Core has NAT enabled on a data network, approximately one in every 65,536 downlink packets sent to a UE will be emitted with an incorrect IP checksum, which will likely cause it to be dropped. | Not applicable. | 
  | 5 | Install/upgrade | Changing the technology type of a deployment from 4G (EPC) to 5G using upgrade or site delete and add is not supported. | Please contact support for the required steps to change the technology type. |

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
