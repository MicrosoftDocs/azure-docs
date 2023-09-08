---
title: Endpoint protection recommendations
description: How the endpoint protection solutions are discovered and identified as healthy.
ms.topic: conceptual
ms.author: dacurwin
author: dcurwin
ms.date: 06/15/2023
---
# Endpoint protection assessment and recommendations in Microsoft Defender for Cloud

Microsoft Defender for Cloud provides health assessments of [supported](supported-machines-endpoint-solutions-clouds-servers.md#endpoint-supported) versions of Endpoint protection solutions. This article explains the scenarios that lead Defender for Cloud to generate the following two recommendations:

- [Endpoint protection should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439)
- [Endpoint protection health issues should be resolved on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000)

> [!TIP]
> At the end of 2021, we revised the recommendation that installs endpoint protection. One of the changes affects how the recommendation displays machines that are powered off. In the previous version, machines that were turned off appeared in the 'Not applicable' list. In the newer recommendation, they don't appear in any of the resources lists (healthy, unhealthy, or not applicable).

## Windows Defender

- Defender for Cloud recommends **Endpoint protection should be installed on your machines** when [Get-MpComputerStatus](/powershell/module/defender/get-mpcomputerstatus) runs and the result is **AMServiceEnabled: False**

- Defender for Cloud recommends **Endpoint protection health issues should be resolved on your machines** when [Get-MpComputerStatus](/powershell/module/defender/get-mpcomputerstatus) runs and any of the following occurs:

  * Any of the following properties are false:

    - **AMServiceEnabled**
    - **AntispywareEnabled**
    - **RealTimeProtectionEnabled**
    - **BehaviorMonitorEnabled**
    - **IoavProtectionEnabled**
    - **OnAccessProtectionEnabled**

  * If one or both of the following properties are 7 or more:

    - **AntispywareSignatureAge**
    - **AntivirusSignatureAge**

## Microsoft System Center endpoint protection

* Defender for Cloud recommends **Endpoint protection should be installed on your machines** when importing **SCEPMpModule ("$env:ProgramFiles\Microsoft Security Client\MpProvider\MpProvider.psd1")** and running **Get-MProtComputerStatus** results in **AMServiceEnabled = false**.

* Defender for Cloud recommends **Endpoint protection health issues should be resolved on your machines** when **Get-MprotComputerStatus** runs and any of the following occurs:

  * At least one of the following properties is false:

    - **AMServiceEnabled**
    - **AntispywareEnabled**
    - **RealTimeProtectionEnabled**
    - **BehaviorMonitorEnabled**
    - **IoavProtectionEnabled**
    - **OnAccessProtectionEnabled**

  * If one or both of the following Signature Updates are greater or equal to 7:

    * **AntispywareSignatureAge**
    * **AntivirusSignatureAge**

## Trend Micro

* Defender for Cloud recommends **Endpoint protection should be installed on your machines** when any of the following checks aren't met:
    - **HKLM:\SOFTWARE\TrendMicro\Deep Security Agent** exists
    - **HKLM:\SOFTWARE\TrendMicro\Deep Security Agent\InstallationFolder** exists
    - The **dsa_query.cmd** file is found in the Installation Folder
    - Running **dsa_query.cmd** results with **Component.AM.mode: on - Trend Micro Deep Security Agent detected**

## Symantec endpoint protection
Defender for Cloud recommends **Endpoint protection should be installed on your machines** when any of the following checks aren't met:

- **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"**
- **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1**

Or

- **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"**
- **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1**

Defender for Cloud recommends **Endpoint protection health issues should be resolved on your machines** when any of the following checks aren't met:

- Check Symantec Version >= 12: Registry location: **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion" -Value "PRODUCTVERSION"**
- Check Real-Time Protection status: **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\AV\Storages\Filesystem\RealTimeScan\OnOff == 1**
- Check Signature Update status: **HKLM\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LatestVirusDefsDate <= 7 days**
- Check Full Scan status: **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LastSuccessfulScanDateTime <= 7 days**
- Find signature version number Path to signature version for Symantec 12: **Registry Paths+ "CurrentVersion\SharedDefs" -Value "SRTSP"** 
- Path to signature version for Symantec 14: **Registry Paths+ "CurrentVersion\SharedDefs\SDSDefs" -Value "SRTSP"**

Registry Paths:
- **"HKLM:\Software\Symantec\Symantec Endpoint Protection" + $Path;**
- **"HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection" + $Path**

## McAfee endpoint protection for Windows

Defender for Cloud recommends **Endpoint protection should be installed on your machines** when any of the following checks aren't met:

- **HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion** exists
- **HKLM:\SOFTWARE\McAfee\AVSolution\MCSHIELDGLOBAL\GLOBAL\enableoas = 1**

Defender for Cloud recommends **Endpoint protection health issues should be resolved on your machines** when any of the following checks aren't met:

- McAfee Version: **HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion >= 10**
- Find Signature Version: **HKLM:\Software\McAfee\AVSolution\DS\DS -Value "dwContentMajorVersion"**
- Find Signature date: **HKLM:\Software\McAfee\AVSolution\DS\DS -Value "szContentCreationDate" >= 7 days**
- Find Scan date: **HKLM:\Software\McAfee\Endpoint\AV\ODS -Value "LastFullScanOdsRunTime" >= 7 days**

## McAfee Endpoint Security for Linux Threat Prevention 

Defender for Cloud recommends **Endpoint protection should be installed on your machines** when any of the following checks aren't met:

- File **/opt/McAfee/ens/tp/bin/mfetpcli** exists
- **"/opt/McAfee/ens/tp/bin/mfetpcli --version"** output is: **McAfee name = McAfee Endpoint Security for Linux Threat Prevention and McAfee version >= 10**

Defender for Cloud recommends **Endpoint protection health issues should be resolved on your machines** when any of the following checks aren't met:

- **"/opt/McAfee/ens/tp/bin/mfetpcli --listtask"** returns **Quick scan, Full scan** and both of the scans <= 7 days
- **"/opt/McAfee/ens/tp/bin/mfetpcli --listtask"** returns **DAT and engine Update time** and both of them <= 7 days
- **"/opt/McAfee/ens/tp/bin/mfetpcli --getoasconfig --summary"** returns **On Access Scan** status

## Sophos Antivirus for Linux 

Defender for Cloud recommends **Endpoint protection should be installed on your machines** when any of the following checks aren't met:
- File **/opt/sophos-av/bin/savdstatus** exits or search for customized location **"readlink $(which savscan)"**
- **"/opt/sophos-av/bin/savdstatus --version"** returns Sophos name = **Sophos Anti-Virus and Sophos version >= 9**

Defender for Cloud recommends **Endpoint protection health issues should be resolved on your machines** when any of the following checks aren't met:
- **"/opt/sophos-av/bin/savlog --maxage=7 | grep -i "Scheduled scan .\* completed" | tail -1"**, returns a value
- **"/opt/sophos-av/bin/savlog --maxage=7 | grep "scan finished"** | tail -1", returns a value
- **"/opt/sophos-av/bin/savdstatus --lastupdate"** returns lastUpdate, which should be <= 7 days 
- **"/opt/sophos-av/bin/savdstatus -v"** is equal to **"On-access scanning is running"** 
- **"/opt/sophos-av/bin/savconfig get LiveProtection"** returns enabled

## Troubleshoot and support

### Troubleshoot

Microsoft Antimalware extension logs are available at:
**%Systemdrive%\WindowsAzure\Logs\Plugins\Microsoft.Azure.Security.IaaSAntimalware(Or PaaSAntimalware)\1.5.5.x(version#)\CommandExecution.log**

### Support

For more help, contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Or file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support common questions](https://azure.microsoft.com/support/faq/).
