---
title: Assessment checks for endpoint detection and response
description: How the endpoint protection solutions are discovered, identified, and maintained for optimal security.
ms.topic: concept-article
ms.author: dacurwin
author: dcurwin
ms.date: 03/13/2024
#customer intent: As a reader, I want to understand the assessment checks for endpoint detection and response solutions so that I can ensure the security of my systems.
---

# Assessment checks for endpoint detection and response solutions (MMA)

Microsoft Defender for Cloud provides health assessments of [supported](supported-machines-endpoint-solutions-clouds-servers.md#endpoint-supported) versions of Endpoint protection solutions. This article explains the scenarios that lead Defender for Cloud to generate the following two recommendations:

- [Endpoint protection should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439)
- [Endpoint protection health issues should be resolved on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000)

> [!NOTE]
> As the Log Analytics agent (also known as MMA) is set to retire in [August 2024](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/), all Defender for Servers features that currently depend on it, including those described on this page, will be available through either [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md) or [agentless scanning](concept-agentless-data-collection.md), before the retirement date. For more information about the roadmap for each of the features that are currently rely on Log Analytics Agent, see [this announcement](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation).

> [!TIP]
> At the end of 2021, we revised the recommendation that installs endpoint protection. One of the changes affects how the recommendation displays machines that are powered off. In the previous version, machines that were turned off appeared in the 'Not applicable' list. In the newer recommendation, they don't appear in any of the resources lists (healthy, unhealthy, or not applicable).

## Windows Defender

The table explains the scenarios that lead Defender for Cloud to generate the following two recommendations for Windows Defender:

| Recommendation | Appears when |
|--|--|
| **Endpoint protection should be installed on your machines** | [Get-MpComputerStatus](/powershell/module/defender/get-mpcomputerstatus) runs and the result is **AMServiceEnabled: False** |
| **Endpoint protection health issues should be resolved on your machines** | [Get-MpComputerStatus](/powershell/module/defender/get-mpcomputerstatus) runs and any of the following occurs: <br><br> Any of the following properties are false: <br><br> - **AMServiceEnabled** <br> - **AntispywareEnabled** <br> - **RealTimeProtectionEnabled** <br> - **BehaviorMonitorEnabled** <br> - **IoavProtectionEnabled** <br> - **OnAccessProtectionEnabled** <br> <br> If one or both of the following properties are 7 or more: <br><br> - **AntispywareSignatureAge** <br> - **AntivirusSignatureAge** |

## Microsoft System Center endpoint protection

The table explains the scenarios that lead Defender for Cloud to generate the following two recommendations for Microsoft System Center endpoint protection:

| Recommendation | Appears when |
|--|--|
| **Endpoint protection should be installed on your machines** | importing **SCEPMpModule ("$env:ProgramFiles\Microsoft Security Client\MpProvider\MpProvider.psd1")** and running **Get-MProtComputerStatus** results in **AMServiceEnabled = false** |
| **Endpoint protection health issues should be resolved on your machines** | **Get-MprotComputerStatus** runs and any of the following occurs: <br><br> At least one of the following properties is false: <br><br> - **AMServiceEnabled** <br> - **AntispywareEnabled** <br> - **RealTimeProtectionEnabled** <br> - **BehaviorMonitorEnabled** <br> - **IoavProtectionEnabled** <br> - **OnAccessProtectionEnabled** <br><br> If one or both of the following Signature Updates are greater or equal to 7: <br><br> - **AntispywareSignatureAge** <br> - **AntivirusSignatureAge** |

## Trend Micro

The table explains the scenarios that lead Defender for Cloud to generate the following two recommendations for Trend Micro:

| Recommendation | Appears when |
|--|--|
| **Endpoint protection should be installed on your machines** | any of the following checks aren't met: <br><br> - **HKLM:\SOFTWARE\TrendMicro\Deep Security Agent** exists <br> - **HKLM:\SOFTWARE\TrendMicro\Deep Security Agent\InstallationFolder** exists <br> - The **dsa_query.cmd** file is found in the Installation Folder <br> - Running **dsa_query.cmd** results with **Component.AM.mode: on - Trend Micro Deep Security Agent detected** |

## Symantec endpoint protection

The table explains the scenarios that lead Defender for Cloud to generate the following two recommendations for Symantec endpoint protection:

| Recommendation | Appears when |
|--|--|
| **Endpoint protection should be installed on your machines** | any of the following checks aren't met: <br> <br> - **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"** <br> - **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1** <br> Or <br> - **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"** <br> - **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1**|
| **Endpoint protection health issues should be resolved on your machines** | any of the following checks aren't met: <br> <br> - Check Symantec Version >= 12: Registry location: **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion" -Value "PRODUCTVERSION"** <br> - Check Real-Time Protection status: **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\AV\Storages\Filesystem\RealTimeScan\OnOff == 1** <br> - Check Signature Update status: **HKLM\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LatestVirusDefsDate <= 7 days** <br> - Check Full Scan status: **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LastSuccessfulScanDateTime <= 7 days** <br> - Find signature version number Path to signature version for Symantec 12: **Registry Paths+ "CurrentVersion\SharedDefs" -Value "SRTSP"** <br> - Path to signature version for Symantec 14: **Registry Paths+ "CurrentVersion\SharedDefs\SDSDefs" -Value "SRTSP"** <br><br> Registry Paths: <br> <br> - **"HKLM:\Software\Symantec\Symantec Endpoint Protection" + $Path;** <br> - **"HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection" + $Path** |

## McAfee endpoint protection for Windows

The table explains the scenarios that lead Defender for Cloud to generate the following two recommendations for McAfee endpoint protection for Windows:

| Recommendation | Appears when |
|--|--| 
| **Endpoint protection should be installed on your machines** | any of the following checks aren't met: <br><br> - **HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion** exists <br> - **HKLM:\SOFTWARE\McAfee\AVSolution\MCSHIELDGLOBAL\GLOBAL\enableoas = 1**|
| **Endpoint protection health issues should be resolved on your machines** | any of the following checks aren't met: <br> <br> - McAfee Version: **HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion >= 10** <br> - Find Signature Version: **HKLM:\Software\McAfee\AVSolution\DS\DS -Value "dwContentMajorVersion"** <br> - Find Signature date: **HKLM:\Software\McAfee\AVSolution\DS\DS -Value "szContentCreationDate" >= 7 days** <br> - Find Scan date: **HKLM:\Software\McAfee\Endpoint\AV\ODS -Value "LastFullScanOdsRunTime" >= 7 days** |

## McAfee Endpoint Security for Linux Threat Prevention

The table explains the scenarios that lead Defender for Cloud to generate the following two recommendations for McAfee Endpoint Security for Linux Threat Prevention:

| Recommendation | Appears when |
|--|--|  
| **Endpoint protection should be installed on your machines** | any of the following checks aren't met: <br> <br> - File **/opt/McAfee/ens/tp/bin/mfetpcli** exists <br> - **"/opt/McAfee/ens/tp/bin/mfetpcli --version"** output is: **McAfee name = McAfee Endpoint Security for Linux Threat Prevention and McAfee version >= 10** |
| **Endpoint protection health issues should be resolved on your machines** | any of the following checks aren't met: <br> <br> - **"/opt/McAfee/ens/tp/bin/mfetpcli --listtask"** returns **Quick scan, Full scan** and both of the scans <= 7 days <br> - **"/opt/McAfee/ens/tp/bin/mfetpcli --listtask"** returns **DAT and engine Update time** and both of them <= 7 days <br> - **"/opt/McAfee/ens/tp/bin/mfetpcli --getoasconfig --summary"** returns **On Access Scan** status |

## Sophos Antivirus for Linux

The table explains the scenarios that lead Defender for Cloud to generate the following two recommendations for Sophos Antivirus for Linux:

| Recommendation | Appears when |
|--|--|
| **Endpoint protection should be installed on your machines** | any of the following checks aren't met: <br> <br> - File **/opt/sophos-av/bin/savdstatus** exits or search for customized location **"readlink $(which savscan)"** <br> - **"/opt/sophos-av/bin/savdstatus --version"** returns Sophos name = **Sophos Anti-Virus and Sophos version >= 9** |
| **Endpoint protection health issues should be resolved on your machines** | any of the following checks aren't met: <br> <br> - **"/opt/sophos-av/bin/savlog --maxage=7 \| grep -i "Scheduled scan .\* completed" \| tail -1"**, returns a value <br> - **"/opt/sophos-av/bin/savlog --maxage=7 \| grep "scan finished"** \| tail -1", returns a value <br> - **"/opt/sophos-av/bin/savdstatus --lastupdate"** returns lastUpdate, which should be <= 7 days <br> - **"/opt/sophos-av/bin/savdstatus -v"** is equal to **"On-access scanning is running"** <br> - **"/opt/sophos-av/bin/savconfig get LiveProtection"** returns enabled | 

## Troubleshoot and support

### Troubleshoot

Microsoft Antimalware extension logs are available at:
**%Systemdrive%\WindowsAzure\Logs\Plugins\Microsoft.Azure.Security.IaaSAntimalware(Or PaaSAntimalware)\1.5.5.x(version#)\CommandExecution.log**

### Support

For more help, contact the Azure experts in [Azure Community Support](https://azure.microsoft.com/support/community/). Or file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support common questions](https://azure.microsoft.com/support/faq/).
