---
title: List of Microsoft Sentinel Advanced Security Information Model (ASIM) parsers | Microsoft Docs
description: This article lists Advanced Security Information Model (ASIM) parsers.
author: oshezaf
ms.topic: reference
ms.date: 05/02/2022
ms.author: ofshezaf
--- 

# List of Microsoft Sentinel Advanced Security Information Model (ASIM) parsers (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This document provides a list of Advanced Security Information Model (ASIM) parsers. For an overview of ASIM parsers refer to the [parsers overview](normalization-parsers-overview.md). To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
## Authentication parsers

- **Windows sign-ins**
    - Collected using the Log Analytics Agent or Azure Monitor Agent.
    - Collected using either the Security Events connectors to the SecurityEvent table or using the WEF connector to the WindowsEvent table.
    - Reported as Security Events (4624, 4625, 4634, and 4647).
    - reported by Microsoft 365 Defender for Endpoint, collected using the Microsoft 365 Defender connector.
- **Linux sign-ins** 
    - reported by Microsoft 365 Defender for Endpoint, collected using the Microsoft 365 Defender connector.
    - reported by Microsoft Defender to IoT Endpoint.
- **Azure Active Directory sign-ins**, collected using the Azure Active Directory connector. Separate parsers are provided for regular, Non-Interactive, Managed Identities and Service Principles Sign-ins.
- **AWS sign-ins**, collected using the AWS CloudTrail connector.
- **Okta authentication**, collected using the Okta connector.
 
Deploy the parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/ASimAuthentication).

## DNS parsers

Microsoft Sentinel provides the following out-of-the-box, product-specific DNS parsers:

| **Source** | **Built-in parsers** | **Workspace deployed parsers** | 
| --- | --------------------------- | ------------------------------ | 
|**Microsoft DNS Server**<br>Collected by the DNS connector<br> and the Log Analytics Agent | `_ASim_Dns_MicrosoftOMS` (regular) <br> `_Im_Dns_MicrosoftOMS` (filtering) <br><br>  | `ASimDnsMicrosoftOMS` (regular) <br>`vimDnsMicrosoftOMS` (filtering) <br><br> |
| **Microsoft DNS Server**<br>Collected by NXlog| `_ASim_Dns_MicrosoftNXlog` (regular)<br>`_Im_Dns_MicrosoftNXlog` (filtering)| `ASimDnsMicrosoftNXlog` (regular)<br> `vimDnsMicrosoftNXlog` (filtering)|
| **Azure Firewall** | `_ASim_Dns_AzureFirewall` (regular)<br> `_Im_Dns_AzureFirewall` (filtering) | `ASimDnsAzureFirewall` (regular)<br>`vimDnsAzureFirewall` (filtering) |
| **Sysmon for Windows**  (event 22)<br> Collected by the Log Analytics Agent<br> or the Azure Monitor Agent,<br>supporting both the<br> `Event` and `WindowsEvent` tables | `_ASim_Dns_MicrosoftSysmon` (regular)<br> `_Im_Dns_MicrosoftSysmon` (filtering)  | `ASimDnsMicrosoftSysmon` (regular)<br> `vimDnsMicrosoftSysmon` (filtering) |
| **Cisco Umbrella**  | `_ASim_Dns_CiscoUmbrella` (regular)<br> `_Im_Dns_CiscoUmbrella` (filtering)  | `ASimDnsCiscoUmbrella` (regular)<br> `vimDnsCiscoUmbrella` (filtering) |
| **Infoblox NIOS**<br><br>The InfoBlox parsers<br>require [configuring the relevant sources](normalization-manage-parsers.md#configure-the-sources-relevant-to-a-source-specific-parser).<br> Use `InfobloxNIOS` as the source type. | `_ASim_Dns_InfobloxNIOS` (regular)<br> `_Im_Dns_InfobloxNIOS` (filtering) | `ASimDnsInfobloxNIOS` (regular)<br> `vimDnsInfobloxNIOS` (filtering) |
| **GCP DNS** | `_ASim_Dns_Gcp` (regular)<br> `_Im_Dns_Gcp`  (filtering) | `ASimDnsGcp` (regular)<br> `vimDnsGcp`  (filtering) |
| **Corelight Zeek DNS events** | `_ASim_Dns_CorelightZeek` (regular)<br> `_Im_Dns_CorelightZeek`  (filtering) |  `ASimDnsCorelightZeek` (regular)<br> `vimDnsCorelightZeek`  (filtering) |
| **Vectra AI** |`_ASim_Dns_VectraIA` (regular)<br> `_Im_Dns_VectraIA` (filtering)  | `AsimDnsVectraAI` (regular)<br> `vimDnsVectraAI` (filtering)  |
| **Zscaler ZIA** |`_ASim_Dns_ZscalerZIA` (regular)<br> `_Im_Dns_ZscalerZIA` (filtering)  | `AsimDnsZscalerZIA` (regular)<br> `vimDnsSzcalerZIA` (filtering)  |
||||

Deploy the workspace deployed parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/AsimDNS).

## File Activity parsers

Microsoft Sentinel provides the following out-of-the-box, product-specific File Activity parsers:

- **Sysmon file activity events** (Events 11, 23, and 26), collected using the Log Analytics Agent or Azure Monitor Agent.
- **Microsoft Office 365 SharePoint and OneDrive events**, collected using the Office Activity connector.
- **Microsoft 365 Defender for Endpoint file events**
- **Azure Storage**, including Blob, File, Queue, and Table Storage.

Deploy the parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/ASimFileEvent).

## Network Session parsers

Microsoft Sentinel provides the following out-of-the-box, product-specific Network Session parsers:

| **Source** | **Built-in parsers** | **Workspace deployed parsers** | 
| --- | --------------------------- | ------------------------------ | 
| **AWS VPC logs** collected using the AWS S3 connector |`_ASim_NetworkSession_AWSVPC` (regular)<br> `_Im_NetworkSession_AWSVPC` (filtering)  | `ASimNetworkSessionAWSVPC` (regular)<br> `vimNetworkSessionAWSVPC` (filtering)  |
| **Azure Firewall logs** |`_ASim_NetworkSession_AzureFirewall` (regular)<br> `_Im_NetworkSession_AzureFirewall` (filtering)  | `ASimNetworkSessionAzureFirewall` (regular)<br> `vimNetworkSessionAzureFirewall` (filtering)  |
| **Azure Monitor VMConnection** collected as part of the Azure Monitor [VM Insights solution](../azure-monitor/vm/vminsights-overview.md) |`_ASim_NetworkSession_VMConnection` (regular)<br> `_Im_NetworkSession_VMConnection` (filtering)  | `ASimNetworkSessionVMConnection` (regular)<br> `vimNetworkSessionVMConnection` (filtering)  |
| **Azure Network Security Groups (NSG) logs** collected as part of the Azure Monitor [VM Insights solution](../azure-monitor/vm/vminsights-overview.md) |`_ASim_NetworkSession_AzureNSG` (regular)<br> `_Im_NetworkSession_AzureNSG` (filtering)  | `ASimNetworkSessionAzureNSG` (regular)<br> `vimNetworkSessionAzureNSG` (filtering)  |
| **Microsoft 365 Defender for Endpoint** | `_ASim_NetworkSession_Microsoft365Defender` (regular)<br><br>`_Im_NetworkSession_Microsoft365Defender` (filtering) | `ASimNetworkSessionMicrosoft365Defender` (regular)<br><br> `vimNetworkSessionMicrosoft365Defender` (filtering) |
| **Microsoft Defender for IoT - Endpoint** |`_ASim_NetworkSession_MD4IoT` (regular)<br><br>`_Im_NetworkSession_MD4IoT` (filtering) | `ASimNetworkSessionMD4IoT` (regular)<br><br> `vimNetworkSessionMD4IoT` (filtering) |
| **Palo Alto PanOS traffic logs** collected using CEF |`_ASim_NetworkSession_PaloAltoCEF` (regular)<br> `_Im_NetworkSession_PaloAltoCEF` (filtering)  | `ASimNetworkSessionPaloAltoCEF` (regular)<br> `vimNetworkSessionPaloAltoCEF` (filtering)  |
| **Sysmon for Linux**  (event 3)<br> Collected using the Log Analytics Agent<br> or the Azure Monitor Agent |`_ASim_NetworkSession_LinuxSysmon` (regular)<br><br>`_Im_NetworkSession_LinuxSysmon` (filtering) | `ASimNetworkSessionLinuxSysmon` (regular)<br><br> `vimNetworkSessionLinuxSysmon` (filtering) |
| **Vectra AI** |`_ASim_NetworkSession_VectraIA` (regular)<br> `_Im_NetworkSession_VectraIA` (filtering)  | `AsimNetworkSessionVectraAI` (regular)<br> `vimNetworkSessionVectraAI` (filtering)  |
| **Windows Firewall logs**<br>Collected as Windows events using the Log Analytics Agent (Event table) or Azure Monitor Agent (WindowsEvent table). Supports Windows events 5150 to 5159. |`_ASim_NetworkSession_`<br>`MicrosoftWindowsEventFirewall` (regular)<br><br>`_Im_NetworkSession_`<br>`MicrosoftWindowsEventFirewall` (filtering) | `ASimNetworkSession`<br>`MicrosoftWindowsEventFirewall` (regular)<br><br> `vimNetworkSession`<br>`MicrosoftWindowsEventFirewall` (filtering) |
| **Zscaler ZIA firewall logs** |`_ASim_NetworkSessionZscalerZIA` (regular)<br> `_Im_NetworkSessionZscalerZIA` (filtering)  | `AsimNetworkSessionZscalerZIA` (regular)<br> `vimNetowrkSessionSzcalerZIA` (filtering)  |

Deploy the workspace deployed parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/AsimNetworkSession).

## Process Event parsers

Microsoft Sentinel provides the following built-in, product-specific Process Event parsers:

- **Security Events process creation (Event 4688)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Security Events process termination (Event 4689)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon process creation (Event 1)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon process termination (Event 5)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Microsoft 365 Defender for Endpoint process creation**

Deploy Process Event parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/AsimProcessEvent).

## Registry Event parsers

Microsoft Sentinel provides the following built-in, product-specific Registry Event parsers:

- **Security Events registry update (Event 4657**), collected using the Log Analytics Agent or Azure Monitor Agent
- **Sysmon registry monitoring events (Events 12, 13, and 14)**, collected using the Log Analytics Agent or Azure Monitor Agent
- **Microsoft 365 Defender for Endpoint registry events**

Deploy Registry Event parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/AsimRegistryEvent).

## Web Session parsers

Microsoft Sentinel provides the following out-of-the-box, product-specific Web Session parsers:

| **Source** | **Built-in parsers** | **Workspace deployed parsers** | 
| --- | --------------------------- | ------------------------------ | 
|**Squid Proxy** | `_ASim_WebSession_SquidProxy` (regular) <br> `_Im_WebSession_SquidProxy` (filtering) <br><br>  | `ASimWebSessionSquidProxy` (regular) <br>`vimWebSessionSquidProxy` (filtering) <br><br> |
| **Zscaler ZIA** |`_ASim_WebSessionZscalerZIA` (regular)<br> `_Im_WebSessionZscalerZIA` (filtering)  | `AsimWebSessionZscalerZIA` (regular)<br> `vimWebSessionSzcalerZIA` (filtering)  |


These parsers can be deployed from the [Microsoft Sentinel GitHub repository](https://aka.ms/DeployASIM).

## <a name="next-steps"></a>Next steps

Learn more about ASIM parsers:

- [Use ASIM parsers](normalization-about-parsers.md)
- [Develop custom ASIM parsers](normalization-develop-parsers.md)
- [Manage ASIM parsers](normalization-manage-parsers.md)

Learn more about ASIM: 

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
