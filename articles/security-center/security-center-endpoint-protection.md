---
title: Endpoint Protection solutions Discovery and Health Assesment
description: How the Endpoint Protection solutions are discovery and identified as healthy.
services: security- center 
documentationcenter: na
author: monhaber 
manager: barbkess 
editor: ''

ms.assetid: 2730a2f5-20bc-4027-a1c2-db9ed0539532
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/20/2019
ms.author: monhaber
---

# Endpoint Protection Assessment and Recommendations by Azure Security Center

## Overview

Endpoint Protection assessment and recommendation in Azure Security Center detects and provides health assessment of  [supported](https://docs.microsoft.com/en-us/azure/security-center/security-center-os-coverage#supported-platforms-for-windows-computers-and-vms) versions of Endpoint Protection solutions. This document explains how Azure Security Center runs the following two recommendations for Endpoint Protection solutions.

* Install endpoint protection solutions on your virtual machine
* Resolve endpoint protection health issues on your machines

## Windows Defender

* The Install endpoint protection solutions on virtual machine recommendation appears when [Get-MpComputerStatus](https://docs.microsoft.com/en-us/powershell/module/defender/get-mpcomputerstatus?view=win10-ps) ran and the result was AMServiceEnabled  : False

* The Resolve endpoint protection health issues on your machines recommendation appears when  [Get-MpComputerStatus](https://docs.microsoft.com/en-us/powershell/module/defender/get-mpcomputerstatus?view=win10-ps) ran and either or both of the following occurred:

        * At least one of the following properties is false:
            'AMServiceEnabled'
            'AntispywareEnabled'
            'RealTimeProtectionEnabled'
            'BehaviorMonitorEnabled'
            'IoavProtectionEnabled'
            'OnAccessProtectionEnabled'

        * If one or both of the following properties is greater or equal to 7. 

            'AntispywareSignatureAge'
            'AntivirusSignatureAge'

## Microsoft System Center Endpoint Protection

* The **Install endpoint protection solutions on virtual machine** recommendation appears after importing **SCEPMpModule  ("$env:ProgramFiles\Microsoft Security Client\MpProvider\MpProvider.psd1" )**, and running **Get-MProtComputerStatus, results with AMServiceEnabled = false**

* The **Resolve endpoint protection health issues on your machines** recommendation appears if the following checks when **Get-MprotComputerStatus** ran and either or both of the following occurred:

* At least one of the following properties is false:
      'AMServiceEnabled'
      'AntispywareEnabled'
      'RealTimeProtectionEnabled'
      'BehaviorMonitorEnabled'
      'IoavProtectionEnabled'
      'OnAccessProtectionEnabled'
      
* If one or both of the following Signature Updates is greater or equal to 7. 
AntispywareSignatureAge
AntivirusSignatureAge 

## Trend Micro

* The Install endpoint protection solutions on virtual machine recommendation appears if one or more of the following checks are not met:
    * **HKLM:\SOFTWARE\TrendMicro\Deep Security Agent** exists
    * **HKLM:\SOFTWARE\TrendMicro\Deep Security Agent\InstallationFolder** exists
    * The **dsq_query.cmd** file is found in the Installation Folder
    * Running **dsa_query.cmd** results with **Component.AM.mode: on - Trend Micro Deep Security Agent detected**

## Symantec Endpoint Protection
The **Install endpoint protection solutions on virtual machine** recommendation appears if any of the following checks are not met:
* **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"**

* **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1**

Or

* **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"**

* **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1**

The Resolve endpoint protection health issues on your machines will appear if any of the following checks are not met:  

* Check Symantec Version >= 12:  Registry location: **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion" -Value "PRODUCTVERSION"**

* Check Real Time Protection status: **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\AV\Storages\Filesystem\RealTimeScan\OnOff == 1**

* Check Signature Update status: **HKLM\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LatestVirusDefsDate <= 7 days**

* Check Full Scan status: **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LastSuccessfulScanDateTime <= 7 days**

* Find signature version number Path to signature version for Symantec 12: **Registry Paths+ "CurrentVersion\SharedDefs" -Value "SRTSP"** 

* Path to signature version for Symantec 14: **Registry Paths+ "CurrentVersion\SharedDefs\SDSDefs" -Value "SRTSP"**

Registry Paths:

**"HKLM:\Software\Symantec\Symantec Endpoint Protection" + $Path;**
**"HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection" + $Path**

## McAfee Endpoint Protection for Windows

The **Install endpoint protection solutions on virtual machine** recommendation appear if the following checks are not met:

* **HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion** exists

* **HKLM:\SOFTWARE\McAfee\AVSolution\MCSHIELDGLOBAL\GLOBAL\enableoas = 1**

The Resolve endpoint protection health issues on your machines will appear if following checks are not met:

* McAfee Version: **HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion >= 10**

* Find Signature Version: **HKLM:\Software\McAfee\AVSolution\DS\DS -Value "dwContentMajorVersion"**

* Find Signature date: **HKLM:\Software\McAfee\AVSolution\DS\DS -Value "szContentCreationDate" >= 7 days**

* Find Scan date: **HKLM:\Software\McAfee\Endpoint\AV\ODS -Value "LastFullScanOdsRunTime" >= 7 days**

## McAfee Endpoint Security for Linux Threat Prevention
The Install endpoint protection solutions on virtual machine recommendation appears if one or both of the following checks are not met:

* File **/opt/isec/ens/threatprevention/bin/isecav** exits

* Successfully ran **"/opt/isec/ens/threatprevention/bin/isecav --version"** and the output is: **McAfee name = McAfee Endpoint Security** for Linux Threat Prevention and **McAfee version >= 10**

The Resolve endpoint protection health issues on your machines recommendation appears if one or both of the following checks are not met:

* Running **"/opt/isec/ens/threatprevention/bin/isecav --version"** results with **mcafeeVersion**, **datVersion**, **datTime**, **engineVersion**
* Running **"/opt/isec/ens/threatprevention/bin/isecav --listtask"** to get **Quick scan**, **Full scan** and **DAT** and **engine Update time**. One of the scan **>= 7 days**, DAT and **engine Update time >= 7 days**
* Run **"/opt/isec/ens/threatprevention/bin/isecav --getoasconfig --summary"** to get **On Access Scan** status and **GTI status On Access Scan = On**
* Run **"/opt/isec/ens/threatprevention/bin/isecav --getapstatus"** to get **Access Protection**

## Sophos Antivirus for Linux

The Install endpoint protection solutions on virtual machine appears if  one or more of the following checks are not met:

* File **/opt/sophos-av/bin/savdstatus** exits or search for customized location **"readlink $(which savscan)"**
* Successfully ran **"/opt/sophos-av/bin/savdstatus --version"**, and **Sophos name = Sophos Anti-Virus and Sophos version >= 9**

The Resolve endpoint protection health issues on your machines recommendation appears if one or more of the following checks are not met:

* Running **"/opt/sophos-av/bin/savdstatus --version"** gets **Sophos buildRevision**, **threatDetectionEngine**, **threatData**, **threatCount**, **threatDataRelease** and **lastUpdate**

* Running **"/opt/sophos-av/bin/savdstatus --lastupdate"** gets **lastUpdate >= 7 days**

* Running **"/opt/sophos-av/bin/savdstatus -v"** gets **On access scanning** status and it is not equal to **"On-access scanning is not running"**

* Running **"/opt/sophos-av/bin/savconfig** gets **LiveProtection"** and is not enabled

* Running **"/opt/sophos-av/bin/savdstatus --rms"** gets **remote management status**

* Running **"/opt/sophos-av/bin/savlog --maxage=7 | grep "scan finished" | tail -1"** gets On demand scan date within past 7 days 

* Running **"/opt/sophos-av/bin/savlog --maxage=7 | grep -i "Scheduled scan .* completed" | tail -1"** gets scheduled scan date within past 7 days One of On demand scan and scheduled scan needs to be happened within past 7 days

## Troubleshoot and support

### Troubleshoot

Microsoft Antimalware extension logs are available at:  
**%Systemdrive%\WindowsAzure\Logs\Plugins\Microsoft.Azure.Security.IaaSAntimalware(Or PaaSAntimalware)\1.5.5.x(version#)\CommandExecution.log**

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/en-us/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/en-us/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/en-us/support/faq/).
