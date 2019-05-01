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
ms.date: 05/01/2019
ms.author: monhaber
---

# Endpoint Protection solutions Discovery and Health Assessment by Azure Security Center

## Overview

Endpoint Protection evaluation in Azure Security Center is capable of detect and provide health assessment of [supported](https://docs.microsoft.com/en-us/azure/security-center/security-center-os-coverage#supported-platforms-for-windows-computers-and-vms) versions of Microsoft and non-Microsoft solutions. 
This document elaborates how the discovery and health assessment is performed and how you can troubleshoot.
       

## Windows Defender

### Discovery

1. Run [Get-MpComputerStatus](https://docs.microsoft.com/en-us/powershell/module/defender/get-mpcomputerstatus?view=win10-ps) and result exists
2. Check for `AMServiceEnabled : True`


### Health Assessment
1. Run [Get-MpComputerStatus](https://docs.microsoft.com/en-us/powershell/module/defender/get-mpcomputerstatus?view=win10-ps)
1. No real time protection status checks all conditions below

  AMServiceEnabled   	           : True

  AntispywareEnabled              : True

  RealTimeProtectionEnabled       : True

  BehaviorMonitorEnabled          : True

  IoavProtectionEnabled           : True
  
  OnAccessProtectionEnabled       : True

3. Check Signature Update status

  AntispywareSignatureAge        >= 7 days

  AntivirusSignatureAge          >= 7 days

## Microsoft System Center Endpoint Protection

### Discovery
1. Import SCEPMpModule "$env:ProgramFiles\Microsoft Security Client\MpProvider\MpProvider.psd1"
2. Run Get-MProtComputerStatus and result exists
3. Check `AMServiceEnabled = true`

### Health Assessment
1. Run Get-MprotComputerStatus 
2. Real time protection status checks all conditions below
   
  AMServiceEnabled   	            : True

  AntispywareEnabled              : True

  RealTimeProtectionEnabled       : True

  BehaviorMonitorEnabled          : True

  IoavProtectionEnabled           : True

  OnAccessProtectionEnabled       : True

3. Check Signature Update status

  AntispywareSignatureAge        >= 7 days

  AntivirusSignatureAge          >= 7 days

## Trend Micro
For Trend Micro, Azure Security Center check only Discovery. No health assessment

### Discovery

1. HKLM:\SOFTWARE\TrendMicro\Deep Security Agent exists 
2. HKLM:\SOFTWARE\TrendMicro\Deep Security Agent\InstallationFolder exists 
3. dsq_query.cmd file is found in Installation Folder
4. Run dsa_query.cmd
5. Component.AM.mode: on - Trend Micro Deep Security Agent detected    

### Threat status
For Trend Micro, there are threat detection and health discovery. You can treat them as 2 different events.
we will first check is there any threat detected on the machine by querying event id 9501 in Deep Security Agent event log.
If yes, we will send an event like below:

Protection status will always be 550 if there is threat detected
protectionRank = 550 
protectionStatus = Threat Detected
protectionStatusDetails = At least one threat detected

if scan action for the threat is unknown
threatRank = 470 
threatStatus = Unknown
threatStatusDetails = Unknown

if scan action for the threat is delete
threatRank = 370 
threatStatus = Remediated
threatStatusDetails = Remediated

If customers would like to see is there any threat detected on the machine, they can filter log by protectionRank = 550

### Health Assessment
Then we will collect one more record for the current protection status of the machine
Threat status and rank are always unknown for Trend Micro in this event. 

## Symantec Endpoint Protection
For Symantec, windows registry values are used for detection and health assessment

### Discovery
1. HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"

2. HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1 

Or 

1. HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"

2. HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1

### Health Assessment
Real time protection enabled is evaluated based on following checks,
1. Check Symantec Version >= 12, registry location: HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion" -Value "PRODUCTVERSION";
2. Check Real Time Protection status - HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\AV\Storages\Filesystem\RealTimeScan\OnOff == 1
3. Check Signature Update status - HKLM\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LatestVirusDefsDate <= 7 days
4. Check Full Scan status - HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LastSuccessfulScanDateTime <= 7 days
5. Find signature version number
	 Path to signature version for Symantec 12: Registry Paths+ "CurrentVersion\SharedDefs" -Value "SRTSP"
	 Path to signature version for Symantec 14: Registry Paths+ "CurrentVersion\SharedDefs\SDSDefs" -Value "SRTSP"

Registry Paths:
 "HKLM:\Software\Symantec\Symantec Endpoint Protection\" + $Path;
 "HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\" + $Path

## McAfee Endpoint Protection for Windows
For McAfee, windows registry values are used for detection and health assessment

### Discovery
1. HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion exists

2. HKLM:\SOFTWARE\McAfee\AVSolution\MCSHIELDGLOBAL\GLOBAL\enableoas = 1


### Health Assessment
1. McAfee Verion HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion >= 10
2. Find Signature Version at HKLM:\Software\McAfee\AVSolution\DS\DS -Value "dwContentMajorVersion"
3. Find Signature date at HKLM:\Software\McAfee\AVSolution\DS\DS -Value "szContentCreationDate" >= 7 days
4. Find Scan date at HKLM:\Software\McAfee\Endpoint\AV\ODS -Value "LastFullScanOdsRunTime" >= 7 days

## McAfee Endpoint Protection for Linux
For McAfee Linux, commands and logs are used for detection and health assessment

### Discovery
1. File /opt/isec/ens/threatprevention/bin/isecav exits
2. Successfully run "/opt/isec/ens/threatprevention/bin/isecav --version"
3. From the output from command in step 2 : McAfee name = McAfee Endpoint Security for Linux Threat Prevention
4. From the output from command in step 2 : McAfee version >= 10

### Health Assessment
1. Run "/opt/isec/ens/threatprevention/bin/isecav --version" to get mcafeeVersion, datVersion, datTime, engineVersion
2. Run "/opt/isec/ens/threatprevention/bin/isecav --listtask" to get Quick scan, Full scan and DAT and engine Update time.
   One of the scan needs >= 7 days, DAT and engine Update time >= 7 days
3. Run "/opt/isec/ens/threatprevention/bin/isecav --getoasconfig --summary" to get On Access Scan status and GTI status
   On Access Scan = On
4. Run "/opt/isec/ens/threatprevention/bin/isecav --getapstatus" to get Access Protection

## Sophos Anti-Virus for Linux
For Sophos Linux, commands and logs are used for detection and health assessment

### Discovery
1. File /opt/sophos-av/bin/savdstatus exits or search for customized location "find / -iname savdstatus | grep /bin/savdstatus"
2. Successfully run "/opt/sophos-av/bin/savdstatus --version"
3. From the output from command in step 2 : Sophos name = Sophos Anti-Virus
4. From the output from command in step 2 : Sophos version >= 9

### Health Assessment
1. Run "/opt/sophos-av/bin/savdstatus --version" to get Sophos buildRevision, threatDetectionEngine, threatData, threatCount, threatDataRelease and lastUpdate 
2. Run "/opt/sophos-av/bin/savdstatus --lastupdate" to get lastUpdate >= 7 days
3. Run "/opt/sophos-av/bin/savdstatus -v" to get On access scanning status and it is not equal to "On-access scanning is not running"
4. Run "/opt/sophos-av/bin/savconfig get LiveProtection" to check it is enabled or not
5. Run "/opt/sophos-av/bin/savdstatus --rms" to get remote managment status
6. Run "/opt/sophos-av/bin/savlog --maxage=7 | grep "scan finished" | tail -1" to get On demand scan date within past 7 days
   Run "/opt/sophos-av/bin/savlog --maxage=7 | grep -i "Scheduled scan .* completed" | tail -1" to get scheduled scan date within past 7 days
   One of On demand scan and scheduled scan needs to be happened within past 7 days

   
## Troubleshoot and support

### Troubleshoot

Microsoft Antimalware extension logs are available at - %Systemdrive%\WindowsAzure\Logs\Plugins\Microsoft.Azure.Security.IaaSAntimalware(Or PaaSAntimalware)\1.5.5.x(version#)\CommandExecution.log



### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/en-us/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/en-us/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/en-us/support/faq/).
