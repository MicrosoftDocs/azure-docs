---
title: Required URLs for Azure Virtual Desktop
description: A list of URLs you must unblock to ensure your Azure Virtual Desktop deployment works as intended.
author: Heidilohr
ms.topic: conceptual
ms.date: 08/30/2022
ms.author: helohr
manager: femila
---

# Required URLs for Azure Virtual Desktop

In order to deploy and make Azure Virtual Desktop available to your users, you must allow specific URLs that your session host virtual machines (VMs) can access them anytime. Users also need to be able to connect to certain URLs to access their Azure Virtual Desktop resources. This article lists the required URLs you need to allow for your session hosts and users. These URLs could be blocked if you're using [Azure Firewall](../firewall/protect-azure-virtual-desktop.md) or a third-party firewall or [proxy service](proxy-server-support.md). Azure Virtual Desktop doesn't support deployments that block the URLs listed in this article.

>[!IMPORTANT]
>Proxy Services that perform the following are not recommended with Azure Virtual Desktop. See the above link or Table of Contents regarding Proxy Support Guidelines for further details.  
>1. SSL Termination (Break and Inspect)
>2. Require Authentication

You can validate that your session host VMs can connect to these URLs by following the steps to run the [Required URL Check tool](required-url-check-tool.md). The Required URL Check tool will validate each URL and show whether your session host VMs can access them. You can only use for deployments in the Azure public cloud, it does not check access for sovereign clouds.

## Session host virtual machines

The following table is the list of URLs your session host VMs need to access for Azure Virtual Desktop. Select the relevant tab based on which cloud you're using.

# [Azure cloud](#tab/azure)

| Address | Outbound TCP port | Purpose | Service tag |
|---|---|---|---|
| `login.microsoftonline.com` | 443 | Authentication to Microsoft Online Services |
| `*.wvd.microsoft.com` | 443 | Service traffic | WindowsVirtualDesktop |
| `*.prod.warm.ingest.monitor.core.windows.net` | 443 | Agent traffic<br />[Diagnostic output](diagnostics-log-analytics.md) | AzureMonitor |
| `catalogartifact.azureedge.net` | 443 | Azure Marketplace | AzureFrontDoor.Frontend |
| `gcs.prod.monitoring.core.windows.net` | 443 | Agent traffic | AzureCloud |
| `kms.core.windows.net` | 1688 | Windows activation | Internet |
| `azkms.core.windows.net` | 1688 | Windows activation | Internet |
| `mrsglobalsteus2prod.blob.core.windows.net` | 443 | Agent and side-by-side (SXS) stack updates | AzureCloud |
| `wvdportalstorageblob.blob.core.windows.net` | 443 | Azure portal support | AzureCloud |
| `169.254.169.254` | 80 | [Azure Instance Metadata service endpoint](../virtual-machines/windows/instance-metadata-service.md) | N/A |
| `168.63.129.16` | 80 | [Session host health monitoring](../virtual-network/network-security-groups-overview.md#azure-platform-considerations) | N/A |
| `oneocsp.microsoft.com` | 80 | Certificates | N/A |
| `www.microsoft.com` | 80 | Certificates | N/A |

> [!IMPORTANT]
> We've finished transitioning the URLs we use for Agent traffic. We no longer support the following URLs. To prevent your session host VMs from showing a *Needs Assistance* status due to this, you must allow the URL `*.prod.warm.ingest.monitor.core.windows.net` if you haven't already. You should also remove the following URLs if you explicitly allowed them before the change:
> 
> | Address | Outbound TCP port | Purpose | Service tag |
> |--|--|--|--|
> | `production.diagnostics.monitoring.core.windows.net` | 443 | Agent traffic | AzureCloud |
> | `*xt.blob.core.windows.net` | 443 | Agent traffic | AzureCloud |
> | `*eh.servicebus.windows.net` | 443 | Agent traffic | AzureCloud |
> | `*xt.table.core.windows.net` | 443 | Agent traffic | AzureCloud |
> | `*xt.queue.core.windows.net` | 443 | Agent traffic | AzureCloud |

The following table lists optional URLs that your session host virtual machines might also need to access for other services:

| Address | Outbound TCP port | Purpose |
|--|--|--|
| `login.windows.net` | 443 | Sign in to Microsoft Online Services and Microsoft 365 |
| `*.events.data.microsoft.com` | 443 | Telemetry Service |
| `www.msftconnecttest.com` | 443 | Detects if the session host is connected to the internet |
| `*.prod.do.dsp.mp.microsoft.com` | 443 | Windows Update |
| `*.sfx.ms` | 443 | Updates for OneDrive client software |
| `*.digicert.com` | 443 | Certificate revocation check |
| `*.azure-dns.com` | 443 | Azure DNS resolution |
| `*.azure-dns.net` | 443 | Azure DNS resolution |

# [Azure for US Government](#tab/azure-for-us-government)

| Address | Outbound TCP port | Purpose | Service tag |
|--|--|--|--|
| `login.microsoftonline.us` | 443 | Authentication to Microsoft Online Services |
| `*.wvd.azure.us` | 443 | Service traffic | WindowsVirtualDesktop |
| `*.prod.warm.ingest.monitor.core.usgovcloudapi.net` | 443 | Agent traffic<br />[Diagnostic output](diagnostics-log-analytics.md) | AzureMonitor |
| `gcs.monitoring.core.usgovcloudapi.net` | 443 | Agent traffic | AzureCloud |
| `kms.core.usgovcloudapi.net` | 1688 | Windows activation | Internet |
| `mrsglobalstugviffx.blob.core.usgovcloudapi.net` | 443 | Agent and side-by-side (SXS) stack updates | AzureCloud |
| `wvdportalstorageblob.blob.core.usgovcloudapi.net` | 443 | Azure portal support | AzureCloud |
| `169.254.169.254` | 80 | [Azure Instance Metadata service endpoint](../virtual-machines/windows/instance-metadata-service.md) | N/A |
| `168.63.129.16` | 80 | [Session host health monitoring](../virtual-network/network-security-groups-overview.md#azure-platform-considerations) | N/A |
| `ocsp.msocsp.com` | 80 | Certificates | N/A |

> [!IMPORTANT]
> We've finished transitioning the URLs we use for Agent traffic. We no longer support the following URLs. To prevent your session host VMs from showing a *Needs Assistance* status due to this, you must allow the URL `*.prod.warm.ingest.monitor.core.usgovcloudapi.net`, if you haven't already. You should also remove the following URLs if you explicitly allowed them before the change:
> 
> | Address | Outbound TCP port | Purpose | Service tag |
> |--|--|--|--|
> | `monitoring.core.usgovcloudapi.net` | 443 | Agent traffic | AzureCloud |
> | `fairfax.warmpath.usgovcloudapi.net` | 443 | Agent traffic | AzureCloud |
> | `*xt.blob.core.usgovcloudapi.net` | 443 | Agent traffic | AzureCloud |
> | `*.servicebus.usgovcloudapi.net` | 443 | Agent traffic | AzureCloud |
> | `*xt.table.core.usgovcloudapi.net` | 443 | Agent traffic | AzureCloud |

The following table lists optional URLs that your session host virtual machines might also need to access for other services:

| Address | Outbound TCP port | Purpose |
|--|--|--|
| `*.events.data.microsoft.com` | 443 | Telemetry Service |
| `www.msftconnecttest.com` | 443 | Detects if the session host is connected to the internet |
| `*.prod.do.dsp.mp.microsoft.com` | 443 | Windows Update |
| `oneclient.sfx.ms` | 443 | Updates for OneDrive client software |
| `*.digicert.com` | 443 | Certificate revocation check |
| `*.azure-dns.com` | 443 | Azure DNS resolution |
| `*.azure-dns.net` | 443 | Azure DNS resolution |

---

> [!TIP]
> You must use the wildcard character (\*) for URLs involving service traffic. If you prefer not to use this for agent-related traffic, here's how to find those specific URLs to use without specifying wildcards:
>
> 1. Ensure your session host virtual machines are registered to a host pool.
> 1. Open **Event viewer**, then go to **Windows logs** > **Application** > **WVD-Agent** and look for event ID **3701**.
> 1. Unblock the URLs that you find under event ID 3701. The URLs under event ID 3701 are region-specific. You'll need to repeat this process with the relevant URLs for each Azure region you want to deploy your session host virtual machines in.

This list doesn't include URLs for other services like Microsoft Entra ID or Office 365. Microsoft Entra URLs can be found under ID 56, 59 and 125 in [Office 365 URLs and IP address ranges](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online).

### Service tags and FQDN tags

A [virtual network service tag](../virtual-network/service-tags-overview.md) represents a group of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules. Service tags can be used in both Network Security Group ([NSG](../virtual-network/network-security-groups-overview.md)) and [Azure Firewall](../firewall/service-tags.md) rules to restrict outbound network access. Service tags can be also used in User Defined Route ([UDR](../virtual-network/virtual-networks-udr-overview.md#user-defined)) to customize traffic routing behavior. 

Azure Firewall supports Azure Virtual Desktop as a [FQDN tag](../firewall/fqdn-tags.md). For more information, see [Use Azure Firewall to protect Azure Virtual Desktop deployments](../firewall/protect-azure-virtual-desktop.md).

We recommend you use FQDN tags or service tags instead of URLs to prevent service issues. The listed URLs and tags only correspond to Azure Virtual Desktop sites and resources. They don't include URLs for other services like Microsoft Entra ID. For other services, see [Available service tags](../virtual-network/service-tags-overview.md#available-service-tags).

Azure Virtual Desktop currently doesn't have a list of IP address ranges that you can unblock to allow network traffic. We only support unblocking specific URLs. If you're using a Next Generation Firewall (NGFW), you'll need to use a dynamic list specifically made for Azure IPs to make sure you can connect.

## Remote Desktop clients

Any [Remote Desktop clients](users/connect-windows.md?toc=/azure/virtual-desktop/toc.json&bc=/azure/virtual-desktop/breadcrumb/toc.json) you use to connect to Azure Virtual Desktop must have access to the following URLs. Select the relevant tab based on which cloud you're using. Opening these URLs is essential for a reliable client experience. Blocking access to these URLs is unsupported and will affect service functionality.

# [Azure cloud](#tab/azure)

| Address | Outbound TCP port | Purpose | Client(s) |
|--|--|--|--|
| `login.microsoftonline.com` | 443 | Authentication to Microsoft Online Services | All |
| `*.wvd.microsoft.com` | 443 | Service traffic | All |
| `*.servicebus.windows.net` | 443 | Troubleshooting data | All |
| `go.microsoft.com` | 443 | Microsoft FWLinks | All |
| `aka.ms` | 443 | Microsoft URL shortener | All |
| `learn.microsoft.com` | 443 | Documentation | All |
| `privacy.microsoft.com` | 443 | Privacy statement | All |
| `query.prod.cms.rt.microsoft.com` | 443 | Download an MSI to update the client. Required for auto-updates. | [Windows Desktop](users/connect-windows.md) |

# [Azure for US Government](#tab/azure-for-us-government)

| Address | Outbound TCP port | Purpose | Client(s) |
|--|--|--|--|
| `login.microsoftonline.us` | 443 | Authentication to Microsoft Online Services | All |
| `*.wvd.azure.us` | 443 | Service traffic | All |
| `*.servicebus.usgovcloudapi.net` | 443 | Troubleshooting data | All |
| `go.microsoft.com` | 443 | Microsoft FWLinks | All |
| `aka.ms` | 443 | Microsoft URL shortener | All |
| `learn.microsoft.com` | 443 | Documentation | All |
| `privacy.microsoft.com` | 443 | Privacy statement | All |
| `query.prod.cms.rt.microsoft.com` | 443 | Download an MSI to update the client. Required for auto-updates. | [Windows Desktop](users/connect-windows.md) |

---

These URLs only correspond to client sites and resources. This list doesn't include URLs for other services like Microsoft Entra ID or Office 365. Microsoft Entra URLs can be found under IDs 56, 59 and 125 in [Office 365 URLs and IP address ranges](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online).

## Next steps

To learn how to unblock these URLs in Azure Firewall for your Azure Virtual Desktop deployment, see [Use Azure Firewall to protect Azure Virtual Desktop](../firewall/protect-azure-virtual-desktop.md).
