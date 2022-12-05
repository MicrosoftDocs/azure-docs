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
- **PostgreSQL** sign-in logs.
 
Deploy the parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/ASimAuthentication).

## DNS parsers

Microsoft Sentinel provides the following out-of-the-box, product-specific DNS parsers:

| **Source** | **Notes** | **Parser**
| --- | --------------------------- | ---------- |
| **Normalized DNS Logs** | Any event normalized at ingestion to the `ASimDnsActivityLogs` table. The DNS connector for the Azure Monitor Agent uses the `ASimDnsActivityLogs` table and is supported by the `_Im_Dns_Native` parser. | `_Im_Dns_Native` |
| **Azure Firewall** | | `_Im_Dns_AzureFirewallVxx` |
| **Cisco Umbrella**  | | `_Im_Dns_CiscoUmbrellaVxx` |
| **Corelight Zeek** | | `_Im_Dns_CorelightZeekVxx` |
| **GCP DNS** | | `_Im_Dns_GcpVxx` |
| - **Infoblox NIOS**<br> - **BIND**<br> - **BlucCat** | The same parsers support multiple sources. | `_Im_Dns_InfobloxNIOSVxx` |
| **Microsoft DNS Server** | Collected using:<br>- DNS connector for the Log Analytics Agent<br>- DNS connector for the Azure Monitor Agent<br>- NXlog | <br>`_Im_Dns_MicrosoftOMSVxx`<br>See Normalized DNS logs.<br>`_Im_Dns_MicrosoftNXlogVxx` | 
| **Sysmon for Windows**  (event 22) | Collected using:<br>- the Log Analytics Agent<br>- the Azure Monitor Agent<br><br>For both agents, both collecting to the<br> `Event` and `WindowsEvent` tables are supported. | `_Im_Dns_MicrosoftSysmonVxx` |
| **Vectra AI** | |`_Im_Dns_VectraIAVxx`  |
| **Zscaler ZIA** | | `_Im_Dns_ZscalerZIAVxx` |
||||

Deploy the workspace deployed parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/AsimDNS).

## File Activity parsers

Microsoft Sentinel provides the following out-of-the-box, product-specific File Activity parsers:

- **Windows file activity**
    - Reported by **Windows (event 4663)**:
        - Collected using the Log Analytics Agent based Security Events connector to the SecurityEvent table.
        - Collected using the Azure Monitor Agent based Security Events connector to the SecurityEvent table.
        - Collected using the Azure Monitor Agent based WEF (Windows Event Forwarding) connector to the WindowsEvent table.
    - Reported using **Sysmon file activity events** (Events 11, 23, and 26):
        - Collected using the Log Analytics Agent to the Event table.
        - Collected using the Azure Monitor Agent based WEF (Windows Event Forwarding) connector to the WindowsEvent table.
    - Reported by **Microsoft 365 Defender for Endpoint**, collected using the Microsoft 365 Defender connector.
- **Microsoft Office 365 SharePoint and OneDrive events**, collected using the Office Activity connector.
- **Azure Storage**, including Blob, File, Queue, and Table Storage.

Deploy the parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/ASimFileEvent).

## Network Session parsers

Microsoft Sentinel provides the following out-of-the-box, product-specific Network Session parsers:

| **Source** | **Notes** | **Parser** | 
| --- | --------------------------- | ------------------------------ | 
| **Normalized Network Session Logs** | Any event normalized at ingestion to the `ASimNetworkSessionLogs` table. The Firewall connector for the Azure Monitor Agent uses the `ASimNetworkSessionLogs` table and is supported by the `_Im_NetworkSession_Native` parser. | `_Im_NetworkSession_Native` |
| **AppGate SDP** | IP connection logs collected using Syslog. | `_Im_NetworkSession_AppGateSDPVxx` |
| **AWS VPC logs** | Collected using the AWS S3 connector. | `_Im_NetworkSession_AWSVPCVxx` |
| **Azure Firewall logs** | |`_Im_NetworkSession_AzureFirewallVxx`|
| **Azure Monitor VMConnection** | Collected as part of the Azure Monitor [VM Insights solution](../azure-monitor/vm/vminsights-overview.md). | `_Im_NetworkSession_VMConnectionVxx`  |
| **Azure Network Security Groups (NSG) logs** | Collected as part of the Azure Monitor [VM Insights solution](../azure-monitor/vm/vminsights-overview.md). | `_Im_NetworkSession_AzureNSGVxx` |
| **Checkpoint Firewall-1** | Collected using CEF. | `_Im_NetworkSession_CheckPointFirewallVxx` |
| **Cisco ASA** | Collected using the CEF connector. | `_Im_NetworkSession_CiscoASAVxx` |
| **Cisco Meraki** | Collected using the Cisco Meraki API connector. | `_Im_NetworkSession_CiscoMerakiVxx` |
| **Corelight Zeek** | Collected using the Corelight Zeek connector. | `_im_NetworkSession_CorelightZeekVxx` |
| **Fortigate FortiOS** | IP connection logs collected using Syslog. | `_Im_NetworkSession_FortinetFortiGateVxx` |
| **Microsoft 365 Defender for Endpoint** | | `_Im_NetworkSession_Microsoft365DefenderVxx`|
| **Microsoft Defender for IoT micro agent** | | `_Im_NetworkSession_MD4IoTAgentVxx` |
| **Microsoft Defender for IoT sensor** | | `_Im_NetworkSession_MD4IoTSensorVxx` * |
| **Palo Alto PanOS traffic logs** | Collected using CEF. | `_Im_NetworkSession_PaloAltoCEFVxx` |
| **Sysmon for Linux**  (event 3) | Collected using the Log Analytics Agent<br> or the Azure Monitor Agent. |`_Im_NetworkSession_LinuxSysmonVxx`  |
| **Vectra AI** | | `_Im_NetworkSession_VectraIAVxx`  |
| **Windows Firewall logs** | Collected as Windows events using the Log Analytics Agent (Event table) or Azure Monitor Agent (WindowsEvent table). Supports Windows events 5150 to 5159. | `_Im_NetworkSession_MicrosoftWindowsEventFirewallVxx`|
| **Watchguard FirewareOW** | Collected using Syslog. | `_Im_NetworkSession_WatchGuardFirewareOSVxx` |
| **Zscaler ZIA firewall logs** | Collected using CEF. | `_Im_NetworkSessionZscalerZIAVxx` |

Note that the parsers marked with (*) are available for deployment from GitHub and are not yet built into workspaces.

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

| **Source** | **Notes** | **Parser** | 
| --- | --------------------------- | ------------------------------ | 
| **Squid Proxy** | | `_Im_WebSession_SquidProxyVxx` |
| **Vectra AI Streams** | | `_Im_WebSession_VectraAIVxx`  |
| **Zscaler ZIA** | Collected using CEF | `_Im_WebSessionZscalerZIAVxx` |


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
