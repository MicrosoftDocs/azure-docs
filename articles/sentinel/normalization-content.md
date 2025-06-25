---
title: Advanced Security Information Model (ASIM) security content | Microsoft Docs
description: This article outlines the Microsoft Sentinel security content that uses the Advanced Security Information Model (ASIM).
author: oshezaf
ms.topic: reference
ms.date: 06/25/2025
ms.author: ofshezaf


#Customer intent: As a security analyst, I want to use ASIM-supported content in Microsoft Sentinel so that I can enhance threat detection and response capabilities using normalized security data.

---

# Advanced Security Information Model (ASIM) security content  (Public preview)

Normalized security content in Microsoft Sentinel includes analytics rules, hunting queries, and workbooks that work with unifying normalization parsers.

<a name="builtin"></a>You can find normalized, built-in content in Microsoft Sentinel galleries and [solutions](sentinel-solutions-catalog.md), create your own normalized content, or modify existing content to use normalized data.

This article lists built-in Microsoft Sentinel content that has been configured to support the Advanced Security Information Model (ASIM).  While links to the Microsoft Sentinel GitHub repository are provided below as a reference, you can also find these rules in the [Microsoft Sentinel Analytics rule gallery](detect-threats-built-in.md). Use the linked GitHub pages to copy any relevant hunting queries.

To understand how normalized content fits within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

> [!TIP]
> Also watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM). For more information, see [Next steps](#next-steps).
>

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Authentication security content

The following built-in authentication content is supported for ASIM normalization.

### Analytics rules

 - [Potential Password Spray Attack (Uses Authentication Normalization)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimAuthentication/imAuthPasswordSpray.yaml)
 - [Brute force attack against user credentials (Uses Authentication Normalization)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimAuthentication/imAuthBruteForce.yaml)
 - [User login from different countries/regions within 3 hours (Uses Authentication Normalization)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimAuthentication/imAuthSigninsMultipleCountries.yaml)
 - [Sign-ins from IPs that attempt sign-ins to disabled accounts (Uses Authentication Normalization)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimAuthentication/imSigninAttemptsByIPviaDisabledAccounts.yaml)

## File Activity security content

The following built-in file activity content is supported for ASIM normalization.

- [Legacy IOC Based Threat Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-ioclegacy?tab=Overview)

### Analytics Rules

- [SUNBURST and SUPERNOVA backdoor hashes (Normalized File Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimFileEvent/imFileESolarWindsSunburstSupernova.yaml)


## Registry activity security content

The following built-in registry activity content is supported for ASIM normalization.

### Analytics rules

- [Potential Fodhelper UAC Bypass (ASIM Version)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/PotentialFodhelperUACBypass(ASIMVersion).yaml)

### Hunting queries

- [Persisting Via IFEO Registry Key](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Endpoint%20Threat%20Protection%20Essentials/Hunting%20Queries/PersistViaIFEORegistryKey.yaml)



## DNS query security content

The following built-in DNS query content is supported for ASIM normalization.


|Solutions |Analytics rules  |
|---------|---------|
|[DNS Essentials](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-dns-domain?tab=Overview) <br> [Log4j Vulnerability Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-apachelog4jvulnerability?tab=Overview) <br> [Legacy IOC Based Threat Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-ioclegacy?tab=Overview)   |  [(Preview) TI map Domain entity to DNS Events (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Threat%20Intelligence/Analytic%20Rules/imDns_DomainEntity_DnsEvents.yaml) <br> [(Preview) TI map IP entity to DNS Events (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Threat%20Intelligence/Analytic%20Rules/imDns_IPEntity_DnsEvents.yaml) <br> [Potential DGA detected (ASimDNS)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDns_HighNXDomainCount_detection.yaml) <br> [Excessive NXDOMAIN DNS Queries (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDns_ExcessiveNXDOMAINDNSQueries.yaml) <br> [DNS events related to mining pools (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDNS_Miners.yaml) <br> [DNS events related to ToR proxies (ASIM DNS Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDNS_TorProxies.yaml) <br> [Known Forest Blizzard group domains - July 2019](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ForestBlizzardJuly2019IOCs.yaml)        |



## Network session security content

The following built-in network session related content is supported for ASIM normalization.


|Solutions  |Analytics rules |Hunting queries |
|---------|---------|---------|
|[Network Session Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-networksession?tab=Overview) <br>[Log4j Vulnerability Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-apachelog4jvulnerability?tab=Overview) <br> [Legacy IOC Based Threat Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-ioclegacy?tab=Overview)     |  [Log4j vulnerability exploit aka Log4Shell IP IOC](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Apache%20Log4j%20Vulnerability%20Detection/Analytic%20Rules/Log4J_IPIOC_Dec112021.yaml)<br>[Excessive number of failed connections from a single source (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Network%20Session%20Essentials/Analytic%20Rules/ExcessiveHTTPFailuresFromSource.yaml)<br>[Potential beaconing activity (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Network%20Session%20Essentials/Analytic%20Rules/PossibleBeaconingActivity.yaml) <br> [(Preview) TI map IP entity to Network Session Events (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Threat%20Intelligence/Analytic%20Rules/IPEntity_imNetworkSession.yaml)<br> [Port scan detected  (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Network%20Session%20Essentials/Analytic%20Rules/PortScan.yaml) <br> [Known Forest Blizzard group domains - July 2019](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ForestBlizzardJuly2019IOCs.yaml)        |[Connection from external IP to OMI related Ports](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Legacy%20IOC%20based%20Threat%20Protection/Hunting%20Queries/NetworkConnectiontoOMIPorts.yaml) |



## Process activity security content

The following built-in process activity content is supported for ASIM normalization.


|Solutions  |Analytics rules |Hunting queries |
|---------|---------|---------|
| [Endpoint Threat Protection Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-endpointthreat?tab=Overview) <br>[Legacy IOC Based Threat Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-ioclegacy?tab=Overview) | [Probable AdFind Recon Tool Usage (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_AdFind_Usage.yaml) <br> [Base64 encoded Windows process command-lines (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_base64_encoded_pefile.yaml) <br> [Malware in the recycle bin (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_malware_in_recyclebin.yaml) <br>[Midnight Blizzard - suspicious rundll32.exe execution of vbscript (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_MidnightBlizzard_SuspiciousRundll32Exec.yaml) <br>[SUNBURST suspicious SolarWinds child processes (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimProcess/imProcess_SolarWinds_SUNBURST_Process-IOCs.yaml) | [Cscript script daily summary breakdown (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_cscript_summary.yaml) <br>[Enumeration of users and groups (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_enumeration_user_and_group.yaml) <br>[Exchange PowerShell Snapin Added (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_ExchangePowerShellSnapin.yaml) <br>[Host Exporting Mailbox and Removing Export (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_HostExportingMailboxAndRemovingExport.yaml) <br>[Invoke-PowerShellTcpOneLine Usage (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Invoke-PowerShellTcpOneLine.yaml) <br>[Nishang Reverse TCP Shell in Base64 (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_NishangReverseTCPShellBase64.yaml) <br>[Summary of users created using uncommon/undocumented commandline switches (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_persistence_create_account.yaml) <br>[Powercat Download (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_PowerCatDownload.yaml) <br>[PowerShell downloads (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_powershell_downloads.yaml) <br> [Entropy for Processes for a given Host (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_ProcessEntropy.yaml) <br>[SolarWinds Inventory (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_SolarWindsInventory.yaml) <br>[Suspicious enumeration using Adfind tool (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Suspicious_enumeration_using_adfind.yaml)<br>[Windows System Shutdown/Reboot (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Windows%20System%20Shutdown-Reboot(T1529).yaml) <br> [Certutil (LOLBins and LOLScripts, Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_Certutil-LOLBins.yaml) <br>[Rundll32 (LOLBins and LOLScripts, Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/inProcess_SignedBinaryProxyExecutionRundll32.yaml) <br>[Uncommon processes - bottom 5% (Normalized Process Events)](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/ASimProcess/imProcess_uncommon_processes.yaml) <br>[Unicode Obfuscation in Command Line](https://github.com/Azure/Azure-Sentinel/blob/master/Hunting%20Queries/MultipleDataSources/UnicodeObfuscationInCommandLine.yaml)|


## Web session security content

The following built-in web session related content is supported for ASIM normalization.

|Solutions  |Analytics rules |
|---------|---------|
| [Log4j Vulnerability Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-apachelog4jvulnerability?tab=Overview) <br> [Threat Intelligence](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-threatintelligence-taxii?tab=Overview) | [(Preview) TI map Domain entity to Web Session Events (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Threat%20Intelligence/Analytic%20Rules/DomainEntity_imWebSession.yaml) <br> [(Preview) TI map IP entity to Web Session Events (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Threat%20Intelligence/Analytic%20Rules/IPEntity_imWebSession.yaml) <br> [Potential communication with a Domain Generation Algorithm (DGA) based hostname (ASIM Network Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/PossibleDGAContacts.yaml) <br> [A client made a web request to a potentially harmful file (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/PotentiallyHarmfulFileTypes.yaml) <br> [A host is potentially running a crypto miner (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/UnusualUACryptoMiners.yaml) <br> [A host is potentially running a hacking tool (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/UnusualUAHackTool.yaml) <br> [A host is potentially running PowerShell to send HTTP(S) requests (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/UnusualUAPowershell.yaml) <br> [Discord CDN Risky File Download  (ASIM Web Session Schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/DiscordCDNRiskyFileDownload_ASim.yaml) <br>[Excessive number of HTTP authentication failures from a source (ASIM Web Session schema)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimWebSession/ExcessiveNetworkFailuresFromSource.yaml) <br> [User agent search for log4j exploitation attempt](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Apache%20Log4j%20Vulnerability%20Detection/Analytic%20Rules/UserAgentSearch_log4j.yaml) |



## <a name="next-steps"></a>Next steps

This article discusses the Advanced Security Information Model (ASIM) content.

For more information, see:

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-about-parsers.md)
- [Using the Advanced Security Information Model (ASIM)](normalization-about-parsers.md)
- [Modifying Microsoft Sentinel content to use the Advanced Security Information Model (ASIM) parsers](normalization-modify-content.md)