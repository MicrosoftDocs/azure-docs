---
title: Azure Private 5G Core 2307 release notes
description: Discover what's new in the Azure Private 5G Core 2307 release
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 07/31/2023
---

# Azure Private 5G Core 2307 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2307 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, review the information contained in these release notes.

This article applies to the AP5GC 2307 release (PMN-2307-0). This release is compatible with the ASE Pro 1 GPU and ASE Pro 2 running the ASE 2303 release, and supports the 2023-06-01, 2022-11-01-preview and 2022-04-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions.

## Support lifetime

Packet core versions are supported until two subsequent versions have been released (unless otherwise noted). This is typically two months after the release date. You should plan to upgrade your packet core in this time frame to avoid losing support.

## What's new
### UE usage tracking
The UE usage tracking messages in Azure Event Hubs are now encoded in AVRO file container format, which enables you to consume these events via Power BI or Azure Stream Analytics (ASA). If you want to enable this feature for your deployment, contact your support representative.

### Unknown User cause code mapping in 4G deployments
In this release the 4G NAS EMM cause code for “unknown user” (subscriber not provisioned on AP5GC) changes to “no-suitable-cells-in-ta-15” by default. This provides better interworking in scenarios where a single PLMN is used for multiple, independent mobile networks.

## Issues fixed in the AP5GC 2307 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |
  |-----|-----|-----|
  | 1 | Local distributed tracing | The distributed tracing web GUI fails to display & decode some fields of 4G NAS messages. Specifically, 'Initial Context Setup Request' and 'Attach Accept messages' information elements.
  | 2 | 4G/5G Signaling | Removal of static or dynamic UE IP pool as part of attached data network modification on an existing AP5GC setup still requires reinstall of packet core.
  | 3 | Install/Upgrade | In some cases, the packet core reports successful installation even when the underlying platform or networking is misconfigured. 
  | 4 | 4G/5G Signaling | AP5GC may intermittently fail to recover after underlying platform is rebooted and may require another reboot to recover.
  | 5 | Packet Forwarding | Azure Private 5G Core may not forward buffered packets if NAT is enabled | 

## Known issues in the AP5GC 2307 release
  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Azure Active Directory | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory does not transmit via the web proxy. If there's a firewall blocking traffic that does not go via the web proxy then enabling Azure Active Directory causes the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |
  | 2 | Install/Upgrade | Transient issues with the Arc Connected Kubernetes Cluster resource might trigger errors in packet core operations such as upgrade, rollback or reinstall.  | Check the availability of the Kubernetes cluster resource: navigate to the resource in the Portal and check the Resource Health. Ensure it's available and retry the operation. |  

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Local Dashboards | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory doesn't transmit via the web proxy. If there's a firewall blocking traffic that doesn't go via the web proxy then enabling Azure Active Directory causes the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |
  

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
