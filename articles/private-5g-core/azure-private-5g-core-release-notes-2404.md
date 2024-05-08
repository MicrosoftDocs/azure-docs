---
title: Azure Private 5G Core 2404 release notes
description: Discover what's new in the Azure Private 5G Core 2404 release.
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 05/09/2023
---

# Azure Private 5G Core 2404 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2404 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, review the information contained in these release notes.

This article applies to the AP5GC 2404 release (2404.0-2). This release is compatible with the Azure Stack Edge (ASE) Pro 1 GPU and Azure Stack Edge Pro 2 running the ASE 2403 release and supports the 2023-09-01, 2023-06-01 and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions. 

For more information about compatibility, see [Packet core and Azure Stack Edge compatibility](azure-stack-edge-packet-core-compatibility.md). 

For more information about new features in Azure Private 5G Core, see [What's New Guide](whats-new.md).

## Support lifetime

Packet core versions are supported until two subsequent versions are released (unless otherwise noted). You should plan to upgrade your packet core in this time frame to avoid losing support.

### Currently supported packet core versions
The following table shows the support status for different Packet Core releases and when they're expected to no longer be supported.

| Release | Support Status |
|---------|----------------|
| AP5GC 2404 | Supported until AP5GC 2410 is released |
| AP5GC 2403 | Supported until AP5GC 2408 is released |
| AP5GC 2310 and earlier | Out of Support |

## What's new

### High Availability

***TBC***.

### In Service Software Upgrade 

In our commitment to continuous improvement and minimizing service impact, we’re excited to announce that future release updates of
either of both AP5GC and ASE will include the capability for In-Service Software Upgrades (ISSU). This means that during a designated maintenance window, software upgrades can be performed seamlessly, ensuring minimal disruption to your services.

### Azure Resource Health 

This feature allows you to monitor the health of your control plane resource using Azure Resource Health, a service which processes and displays health signals from your resource and displays the health in the Azure portal. This gives you a personalised dashboard showing all the times your resource has been unavailable or in a degraded state, along with recommended actions to take to restore health.
For more information, see [Resource Health overview](https://learn.microsoft.com/en-us/azure/service-health/resource-health-overview).

## Issues fixed in the AP5GC 2404 release

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |  SKU Fixed In |
  |-----|---------|-------|---------------|
  | 1   |         |       |               | 
  
## Known issues in the AP5GC 2404 release
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
