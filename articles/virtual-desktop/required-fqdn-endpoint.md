---
title: Required FQDNs and endpoints for Azure Virtual Desktop
description: A list of FQDNs and endpoints you must allow, ensuring your Azure Virtual Desktop deployment works as intended.
ms.topic: conceptual
author: dougeby
ms.author: avdcontent
ms.date: 11/21/2024
---

# Required FQDNs and endpoints for Azure Virtual Desktop

In order to deploy Azure Virtual Desktop and for your users to connect, you must allow specific FQDNs and endpoints. Users also need to be able to connect to certain FQDNs and endpoints to access their Azure Virtual Desktop resources. This article lists the required FQDNs and endpoints you need to allow for your session hosts and users.

These FQDNs and endpoints could be blocked if you're using a firewall, such as [Azure Firewall](../firewall/protect-azure-virtual-desktop.md), or proxy service. For guidance on using a proxy service with Azure Virtual Desktop, see [Proxy service guidelines for Azure Virtual Desktop](proxy-server-support.md).

You can check that your session host VMs can connect to these FQDNs and endpoints by following the steps to run the *Azure Virtual Desktop Agent URL Tool* in [Check access to required FQDNs and endpoints for Azure Virtual Desktop](check-access-validate-required-fqdn-endpoint.md). The Azure Virtual Desktop Agent URL Tool validates each FQDN and endpoint and show whether your session hosts can access them.

> [!IMPORTANT]
> - Microsoft doesn't support Azure Virtual Desktop deployments where the FQDNs and endpoints listed in this article are blocked.
>
> - This article doesn't include FQDNs and endpoints for other services such as Microsoft Entra ID, Office 365, custom DNS providers or time services. Microsoft Entra FQDNs and endpoints can be found under ID *56*, *59* and *125* in [Office 365 URLs and IP address ranges](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online).

## Service tags and FQDN tags

[Service tags](../virtual-network/service-tags-overview.md) represent groups of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules. Service tags can be used in rules for [Network Security Groups](../virtual-network/network-security-groups-overview.md) (NSGs) and [Azure Firewall](../firewall/service-tags.md) to restrict outbound network access. Service tags can be also used in [User Defined Routes](../virtual-network/virtual-networks-udr-overview.md#user-defined) (UDRs) to customize traffic routing behavior. 

Azure Firewall also supports [FQDN tags](../firewall/fqdn-tags.md), which represent a group of fully qualified domain names (FQDNs) associated with well known Azure and other Microsoft services. Azure Virtual Desktop doesn't have a list of IP address ranges that you can unblock instead of FQDNs to allow network traffic. If you're using a Next Generation Firewall (NGFW), you need to use a dynamic list made for Azure IP addresses to make sure you can connect. For more information, see [Use Azure Firewall to protect Azure Virtual Desktop deployments](../firewall/protect-azure-virtual-desktop.md).

Azure Virtual Desktop has both a service tag and FQDN tag entry available. We recommend you use service tags and FQDN tags to simplify your Azure network configuration. 

## Session host virtual machines

The following table is the list of FQDNs and endpoints your session host VMs need to access for Azure Virtual Desktop. All entries are outbound; you don't need to open inbound ports for Azure Virtual Desktop. Select the relevant tab based on which cloud you're using.

# [Azure cloud](#tab/azure)

| Address | Protocol | Outbound port | Purpose | Service tag |
|--|--|--|--|--|
| `login.microsoftonline.com` | TCP | 443 | Authentication to Microsoft Online Services | `AzureActiveDirectory` |
| `*.wvd.microsoft.com` | TCP | 443 | Service traffic | `WindowsVirtualDesktop` |
| `catalogartifact.azureedge.net` | TCP | 443 | Azure Marketplace | `AzureFrontDoor.Frontend` |
| `*.prod.warm.ingest.monitor.core.windows.net` | TCP | 443 | Agent traffic<br />[Diagnostic output](diagnostics-log-analytics.md) | `AzureMonitor` |
| `gcs.prod.monitoring.core.windows.net` | TCP | 443 | Agent traffic | `AzureMonitor` |
| `azkms.core.windows.net` | TCP | 1688 | Windows activation | `Internet` |
| `mrsglobalsteus2prod.blob.core.windows.net` | TCP | 443 | Agent and side-by-side (SXS) stack updates | `Storage` |
| `wvdportalstorageblob.blob.core.windows.net` | TCP | 443 | Azure portal support | `AzureCloud` |
| `169.254.169.254` | TCP | 80 | [Azure Instance Metadata service endpoint](/azure/virtual-machines/windows/instance-metadata-service) | N/A |
| `168.63.129.16` | TCP | 80 | [Session host health monitoring](../virtual-network/network-security-groups-overview.md#azure-platform-considerations) | N/A |
| `oneocsp.microsoft.com` | TCP | 80 | Certificates | `AzureFrontDoor.FirstParty` |
| `www.microsoft.com` | TCP | 80 | Certificates | N/A |
|`ctldl.windowsupdate.com`| TCP| 80| Certificates|N/A|
| `aka.ms` | TCP | 443 | Microsoft URL shortener, used during session host deployment on Azure Local | N/A |

The following table lists optional FQDNs and endpoints that your session host virtual machines might also need to access for other services:

| Address | Protocol | Outbound port | Purpose | Service tag |
|--|--|--|--|--|
| `login.windows.net` | TCP | 443 | Sign in to Microsoft Online Services and Microsoft 365 | `AzureActiveDirectory` |
| `*.events.data.microsoft.com` | TCP | 443 | Telemetry Service | N/A |
| `www.msftconnecttest.com` | TCP | 80 | Detects if the session host is connected to the internet | N/A |
| `*.prod.do.dsp.mp.microsoft.com` | TCP | 443 | Windows Update | N/A |
| `*.sfx.ms` | TCP | 443 | Updates for OneDrive client software | N/A |
| `*.digicert.com` | TCP | 80 | Certificate revocation check | N/A |
| `*.azure-dns.com` | TCP | 443 | Azure DNS resolution | N/A |
| `*.azure-dns.net` | TCP | 443 | Azure DNS resolution | N/A |
| `*eh.servicebus.windows.net` | TCP | 443 | Diagnostic settings | `EventHub` |

# [Azure for US Government](#tab/azure-for-us-government)

| Address | Protocol | Outbound port | Purpose | Service tag |
|--|--|--|--|--|
| `login.microsoftonline.us` | TCP | 443 | Authentication to Microsoft Online Services | `AzureActiveDirectory` |
| `*.wvd.azure.us` | TCP | 443 | Service traffic | `WindowsVirtualDesktop` |
| `*.prod.warm.ingest.monitor.core.usgovcloudapi.net` | TCP | 443 | Agent traffic<br />[Diagnostic output](diagnostics-log-analytics.md) | `AzureMonitor` |
| `gcs.monitoring.core.usgovcloudapi.net` | TCP | 443 | Agent traffic | `AzureMonitor` |
| `azkms.core.usgovcloudapi.net` | TCP | 1688 | Windows activation | `Internet` |
| `mrsglobalstugviffx.blob.core.usgovcloudapi.net` | TCP | 443 | Agent and side-by-side (SXS) stack updates | `AzureCloud` |
| `wvdportalstorageblob.blob.core.usgovcloudapi.net` | TCP | 443 | Azure portal support | `AzureCloud` |
| `169.254.169.254` | TCP | 80 | [Azure Instance Metadata service endpoint](/azure/virtual-machines/windows/instance-metadata-service) | N/A |
| `168.63.129.16` | TCP | 80 | [Session host health monitoring](../virtual-network/network-security-groups-overview.md#azure-platform-considerations) | N/A |
| `ctdl.windowsupdate.com` | TCP | 80 | Certificates | N/A |
| `ocsp.msocsp.com` | TCP | 80 | Certificates | N/A |

The following table lists optional FQDNs and endpoints that your session host virtual machines might also need to access for other services:

| Address | Protocol | Outbound port | Purpose | Service tag |
|--|--|--|--|--|
| `*.events.data.microsoft.com` | TCP | 443 | Telemetry Service | N/A |
| `www.msftconnecttest.com` | TCP | 80 | Detects if the session host is connected to the internet | N/A |
| `*.prod.do.dsp.mp.microsoft.com` | TCP | 443 | Windows Update | N/A |
| `oneclient.sfx.ms` | TCP | 443 | Updates for OneDrive client software | N/A |
| `*.digicert.com` | TCP | 80 | Certificate revocation check | N/A |
| `*.azure-dns.com` | TCP | 443 | Azure DNS resolution | N/A |
| `*.azure-dns.net` | TCP | 443 | Azure DNS resolution | N/A |
| `*eh.servicebus.windows.net` | TCP | 443 | Diagnostic settings | `EventHub` |

---

> [!TIP]
> You must use the wildcard character (\*) for FQDNs involving **service traffic**.
>
> For **agent traffic**, if you prefer not to use a wildcard, here's how to find specific FQDNs to allow:
>
> 1. Ensure your session hosts are registered to a host pool.
> 1. On a session host, open **Event viewer**, then go to **Windows logs** > **Application** > **WVD-Agent** and look for event ID **3701**.
> 1. Unblock the FQDNs that you find under event ID 3701. The FQDNs under event ID 3701 are region-specific. You need to repeat this process with the relevant FQDNs for each Azure region you want to deploy your session hosts in.

## End user devices

Any device on which you use one of the [Remote Desktop clients](users/connect-windows.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) to connect to Azure Virtual Desktop must have access to the following FQDNs and endpoints. Allowing these FQDNs and endpoints is essential for a reliable client experience. Blocking access to these FQDNs and endpoints isn't supported and affects service functionality.

Select the relevant tab based on which cloud you're using.

# [Azure cloud](#tab/azure)

| Address | Protocol | Outbound port | Purpose | Client(s) |
|--|--|--|--|--|
| `login.microsoftonline.com` | TCP | 443 | Authentication to Microsoft Online Services | All |
| `*.wvd.microsoft.com` | TCP | 443 | Service traffic | All |
| `*.servicebus.windows.net` | TCP | 443 | Troubleshooting data | All |
| `go.microsoft.com` | TCP | 443 | Microsoft FWLinks | All |
| `aka.ms` | TCP | 443 | Microsoft URL shortener | All |
| `learn.microsoft.com` | TCP | 443 | Documentation | All |
| `privacy.microsoft.com` | TCP | 443 | Privacy statement | All |
| `*.cdn.office.net` | TCP | 443 | Automatic updates | [Windows Desktop](users/connect-windows.md) |
| `graph.microsoft.com` | TCP | 443 | Service traffic | All |
| `windows.cloud.microsoft` | TCP | 443 | Connection center | All |
| `windows365.microsoft.com` | TCP | 443 | Service traffic | All |
| `ecs.office.com` | TCP | 443 | Connection center | All |
| `*.events.data.microsoft.com` | TCP | 443 | Client telemetry | All |

# [Azure for US Government](#tab/azure-for-us-government)

| Address | Protocol | Outbound port | Purpose | Client(s) |
|--|--|--|--|--|
| `login.microsoftonline.us` | TCP | 443 | Authentication to Microsoft Online Services | All |
| `*.wvd.azure.us` | TCP | 443 | Service traffic | All |
| `*.servicebus.usgovcloudapi.net` | TCP | 443 | Troubleshooting data | All |
| `go.microsoft.com` | TCP | 443 | Microsoft FWLinks | All |
| `aka.ms` | TCP | 443 | Microsoft URL shortener | All |
| `learn.microsoft.com` | TCP | 443 | Documentation | All |
| `privacy.microsoft.com` | TCP | 443 | Privacy statement | All |
| `*.cdn.office.net` | TCP | 443 | Automatic updates | [Windows Desktop](users/connect-windows.md) |
| `graph.microsoft.com` | TCP | 443 | Service traffic | All |
| `windows.cloud.microsoft` | TCP | 443 | Connection center | All |
| `windows365.microsoft.com` | TCP | 443 | Service traffic | All |
| `ecs.office.com` | TCP | 443 | Connection center | All |

---

If you're on a closed network with restricted internet access, you might also need to allow the FQDNs listed here for certificate checks: [Azure Certificate Authority details | Microsoft Learn](../security/fundamentals/azure-CA-details.md#certificate-downloads-and-revocation-lists).

## Next steps

- [Check access to required FQDNs and endpoints for Azure Virtual Desktop](check-access-validate-required-fqdn-endpoint.md).

- To learn how to unblock these FQDNs and endpoints in Azure Firewall, see [Use Azure Firewall to protect Azure Virtual Desktop](../firewall/protect-azure-virtual-desktop.md).

- For more information about network connectivity, see [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md)
