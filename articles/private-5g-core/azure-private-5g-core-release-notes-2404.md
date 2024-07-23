---
title: Azure Private 5G Core 2404 release notes
description: Discover What's New in the Azure Private 5G Core 2404 release.
author: paulcarter
ms.author: paulcarter
ms.service: private-5g-core
ms.topic: release-notes
ms.date: 05/09/2023
---

# Azure Private 5G Core 2404 release notes

The following release notes identify the new features, critical open issues, and resolved issues for the 2404 release of Azure Private 5G Core (AP5GC). The release notes are continuously updated, with critical issues requiring a workaround added as they’re discovered. Before deploying this new version, review the information contained in these release notes.

This article applies to the AP5GC 2404 release (2404.0-3). This release is compatible with the Azure Stack Edge (ASE) Pro 1 GPU and Azure Stack Edge Pro 2 running the ASE 2403 release and supports the 2024-04-01, 2023-09-01, 2023-06-01 and 2022-11-01 [Microsoft.MobileNetwork](/rest/api/mobilenetwork) API versions. 

For more information about compatibility, see [Packet core and Azure Stack Edge compatibility](azure-stack-edge-packet-core-compatibility.md). 

For more information about new features in Azure Private 5G Core, see [What's New Guide](whats-new.md).

This release has been produced in accordance with Microsoft’s Secure Development Lifecycle, including processes for authorizing software changes, antimalware scanning, and scanning and mitigating security bugs and vulnerabilities.

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

We're excited to announce that AP5GC is now resilient to system failures when run on a two-node ASE cluster. Userplane traffic, sessions, and registrations are unaffected on failure of any single pod, physical interface, or ASE device.

### In Service Software Upgrade 

In our commitment to continuous improvement and minimizing service impact we’re excited to announce that, upgrading from this version to a future release will include the capability for In-Service Software Upgrades (ISSU).

ISSU is supported for deployments on a 2-node cluster. Software upgrades can be performed seamlessly, ensuring minimal disruption to your services. The upgrade completes with no loss of sessions or registrations and minimal packet loss and packet reordering. Should the upgrade fail, the software automatically rolls back to the previous version, also with minimal service disruption.

### Azure Resource Health 

This feature allows you to monitor the health of your control plane resource using Azure Resource Health. Azure Resource Health is a service that processes and displays health signals from your resource and displays the health in the Azure portal. This service gives you a personalized dashboard showing all the times your resource was unavailable or in a degraded state, along with recommended actions to take to restore health.

For more information, on using Azure Resource Health to monitor the health of your deployment, see [Resource Health overview](../service-health/resource-health-overview.md).

### NAS Encryption

NAS (Non-Access-Stratum) encryption configuration determines the encryption algorithm applied to the management traffic between the UEs and the AMF(5G) or MME(4G). By default, for security reasons, Packet Core deployments are configured to preferentially use NEA2/EEA2 encryption.

You can change the preferred encryption level after deployment by [modifying the packet core configuration](modify-packet-core.md).

### RADIUS Authentication

The RADIUS authentication feature enables AP5GC to perform secondary authentication via an AAA server for 4G attach and establishing a PDN/PDU session for 4G and 5G.
This feature can be enabled per DN to perform secondary authentication. PAP based secondary authentication is supported in current release.

For more information on configuration RADIUS Authentication for your deployment, see [RADIUS Authentication](security.md).

### VLAN Trunking

VLAN trunking provides a new method for configuring data networks. A single virtual network interface is used to carry all data plane traffic. The traffic is all VLAN tagged, with each DN using a separate VLAN to provide separation. Configuration to use VLAN trunking is done on both the ASE and Private Mobile Network. When AP5GC is deployed on a 2-node cluster, VLAN trunking is mandatory.

For more information on configuration of VLAN Trunking, see [Commission an AKS Cluster](commission-cluster.md?pivots=ase-pro-2#set-up-advanced-networking).

### Dual-router link redundancy

Link connectivity monitoring for High Availability now accommodates paired peer routers in a dual-redundancy topology.  You can configure this by designating two BFD peer router IP addresses per interface – if this is set then:

- Each Packet Core node establishes BFD sessions with each of these routers, rather than with the default gateway IP.
- The interface is not considered to have lost connectivity unless both IPs in the redundant pair are unreachable.

For more information on configuration of dual-routers, see [Create a site](create-a-site.md) or [Modify a site](modify-packet-core.md).

### RAN insights preview

We’re excited to announce that radio access network (RAN) insights is now in preview for AP5GC. This feature integrates third-party data from RAN vendors, collecting and displaying a subset of metrics from your Element Management Systems (EMS) as standard metrics in Azure. By leveraging Azure's capabilities, this integration offers a unified and simplified experience for monitoring and troubleshooting RAN across multiple vendors and locations. With RAN insights you will now be able to:

- View the metrics of your RAN to monitor their deployment’s performance, reliability, and connection status.
- Access geo maps for a visual overview of all connected access points along with health status and performance metrics of each radio.
- Use correlated metrics of your RAN and packet core to help diagnose and troubleshoot issues.

To learn more and get started, see [RAN Insights Concepts](ran-insights-concepts.md) and [Create a Radio Access Network Insights Resource](ran-insights-create-resource.md).

<!--# NO FIXED ISSUES IN AP5GC2404

The following table provides a summary of issues fixed in this release.

  |No.  |Feature  | Issue |  SKU Fixed In |
  |-----|---------|-------|---------------|
  | 1   |         |       |               | 
 -->

## Known issues in the AP5GC 2404 release
<!-- All known issues need a [customer facing summary](https://eng.ms/docs/strategic-missions-and-technologies/strategic-missions-and-technologies-organization/azure-for-operators/packet-core/private-mobile-network/azure-private-5g-core/cross-team/developmentprocesses/customer-facing-bug-summary)-->

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|---------|-------|---------------------|
  | 1 | Local distributed tracing | Local Dashboard Unavailable for 5-10 minutes after device failure | After the failure of a device in a two-node cluster, Azure Private 5G Core local dashboards won't be available for five to ten minutes. Once they recover, information for the time that they weren't available isn't shown. |
  | 2 | Local distributed tracing | When deployed on a two-node cluster, Azure Private 5G Core local dashboards can show an incorrect count for the number of PDU Sessions.   | |

The following table provides a summary of known issues carried over from the previous releases.

  |No.  |Feature  | Issue | Workaround/comments |
  |-----|-----|-----|-----|
  | 1 | Local distributed tracing | When a web proxy is enabled on the Azure Stack Edge appliance that the packet core is running on and Azure Active Directory is used to authenticate access to AP5GC Local Dashboards, the traffic to Azure Active Directory doesn't transmit via the web proxy. If there's a firewall blocking traffic that doesn't go via the web proxy then enabling Azure Active Directory causes the packet core install to fail. | Disable Azure Active Directory and use password based authentication to authenticate access to AP5GC Local Dashboards instead. |

## Next steps

- [Upgrade the packet core instance in a site - Azure portal](upgrade-packet-core-azure-portal.md)
- [Upgrade the packet core instance in a site - ARM template](upgrade-packet-core-arm-template.md)
