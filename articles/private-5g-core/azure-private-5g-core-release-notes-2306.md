---
title: Azure Private 5G Core 2306 release notes
description: Discover what's new in the Azure Private 5G Core 2306 release
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 07/03/2023
---

# Azure Private 5G Core 2306 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2306 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, please review the information contained in these release notes.

This article applies to the AP5GC 2306 release (PMN-2306-0). This release is compatible with the ASE Pro 1 GPU and ASE Pro 2 running the ASE 2303 release, and supports the 2022-04-01-preview and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions.

## Support lifetime

Packet core versions are supported until two subsequent versions have been released (unless otherwise noted). This is typically two months after the release date. You should plan to upgrade your packet core in this time frame to avoid losing support.

## What's new
- **Reduced service interruption from configuration changes** – This enhancement allows most AP5GC configuration to be changed in the portal and applied without requiring a reinstall of the packet core. Most configuration changes that previously required a reinstall to take effect now only triggers a short service interruption.
  
  The following configuration can now be changed without reinstalling the packet core:
  - Adding an attached data network
  - Modifying attached data network configuration: 
    - Dynamic UE IP pool prefixes
    - Static UE IP pool prefixes
    - Network address and port translation parameters
    - DNS addresses

To change your packet core configuration, see [Modify a packet core instance](modify-packet-core.md).

<!-- removed issues fixed section as none in this release
## Issues fixed in the AP5GC 2306 release

None in this release
-->
<!--The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 |  |  |
  | 2 |  |  |
  | 3 |  |  | 
-->
## Known issues in the AP5GC 2306 release

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Local distributed tracing | The distributed tracing web GUI fails to display & decode some fields of 4G NAS messages. Specifically, 'Initial Context Setup Request' and 'Attach Accept messages' information elements. | Not applicable. |
  | 2 | 4G/5G Signaling | Removal of static or dynamic UE IP pool as part of attached data network modification on an existing AP5GC setup still requires reinstall of packet core. | Not applicable. |  

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Packet forwarding  | AP5GC may not forward buffered packets if NAT is enabled. | Not applicable. |
  | 2 | Install/Upgrade | In some cases, the packet core reports successful installation even when the underlying platform or networking is misconfigured. | Not applicable. |
  | 3 | Local Dashboards | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory doesn't transmit via the web proxy. If there's a firewall blocking traffic that doesn't go via the web proxy then enabling Azure Active Directory causes the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |
  | 4 | 4G/5G Signaling | AP5GC may intermittently fail to recover after underlying platform is rebooted and may require another reboot to recover. | Not applicable. |  

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
