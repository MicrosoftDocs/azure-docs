---
title: Azure Private 5G Core 2308 release notes
description: Discover what's new in the Azure Private 5G Core 2308 release
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 11/16/2023
---

# Azure Private 5G Core 2308 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2308 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, review the information contained in these release notes.

This article applies to the AP5GC 2308 release (2308.0-8). This release is compatible with the Azure Stack Edge Pro 1 GPU and Azure Stack Edge Pro 2 running the ASE 2303 and ASE 2309 releases. It supports the 2023-06-01 and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions. 

For more information about compatibility, see [Packet core and Azure Stack Edge compatibility](azure-stack-edge-packet-core-compatibility.md). 

With this release, there's a new naming scheme and Packet Core versions are now called ‘2308.0-1’ rather than ‘PMN-2308.’

> [!WARNING]
> For this release, it's important that the packet core version is upgraded to the AP5GC 2308 release before the upgrading to the ASE 2309 release.  Upgrading to ASE 2309 before upgrading to Packet Core 2308.0.1 causes a total system outage.  Recovery requires you to delete and re-create the AKS cluster on your ASE.

## Support lifetime

Packet core versions are supported until two subsequent versions are released. You should plan to upgrade your packet core in this time frame to avoid losing support.

### Currently supported packet core versions
The following table shows the support status for different Packet Core releases.

| Release | Support Status |
|---------|----------------|
| AP5GC 2308 | Supported until AP5GC 2401 released |
| AP5GC 2307 | Supported until AP5GC 2310 released |
| AP5GC 2306 and earlier | Out of Support |

## What's new

### 10 DNs
In this release, the number of supported data networks (DNs) increases from three to 10, including with layer 2 traffic separation. If more than 6 DNs are required, a shared switch for access and core traffic is needed.

To add a data network to your packet core, see [Modify a packet core instance](modify-packet-core.md).

### Default MTU values
In this release, the default MTU values are changed as follows:
- UE MTU: 1440 (was 1300)
-	Access MTU: 1500 (was 1500)
-	Data MTU: 1440 (was 1500)

Customers upgrading to 2308 see a change in the MTU values on their packet core.

When the UE MTU is set to any valid value (see API Spec), then the other MTUs are set to:
- Access MTU: UE MTU + 60
- Data MTU: UE MTU
  
Rollbacks to Packet Core versions earlier than 2308 aren't possible if the UE MTU field is changed following an upgrade.

To change the UE MTU signaled by the packet core, see [Modify a packet core instance](modify-packet-core.md).

###	MTU Interop setting
In this release, the MTU Interop setting is deprecated and can't be set for Packet Core versions 2308 and above.

<!-- Issues fixed in the AP5GC2308 release-->
## Issues fixed in the AP5GC 2308 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Packet Forwarding |  If the packet forwarding component of the userplane crashes, it may not recover. If it does not, the system experiences an outage until manually recovered |
  | 2 | Packet Forwarding | An intermittent fault at the network layer causes an outage of packet forwarding |
  | 3 | Diagnosability | During packet capture, uplink userplane packets can be omitted from packet captures |
  | 4 | Packet Forwarding | Errors in userplane packet detection rules can cause incorrect packet handling | 
  

## Known issues in the AP5GC 2308 release
  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Packet Forwarding | A slight(0.01%) increase in packet drops is observed in latest AP5GC release installed on ASE Platform Pro2 with ASE-2309 for throughput higher than 3.0 Gbps. | None |
  | 2 | Local distributed tracing | In Multi PDN session establishment/Release call flows with different DNs, the distributed tracing web GUI fails to display some of 4G NAS messages (Activate/deactivate Default EPS Bearer Context Request) and some S1AP messages (ERAB request, ERAB Release). | None |
  | 3 | Local distributed tracing | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory doesn't transmit via the web proxy. If there's a firewall blocking traffic that does not go via the web proxy then enabling Azure Active Directory causes the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |
  | 4 | Packet Forwarding | In scenarios of sustained high load (for example, continuous setup of 100's of TCP flows per second) in 4G setups, AP5GC may encounter an internal error, leading to a short period of service disruption resulting in some call failures. | In most cases, the system will recover on its own and be able to handle new requests after a few seconds' disruption. For existing connections that are dropped the UEs need to re-establish the connection. |


The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Local Dashboards | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory doesn't transmit via the web proxy. If there's a firewall blocking traffic that doesn't go via the web proxy then enabling Azure Active Directory causes the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |
  

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
