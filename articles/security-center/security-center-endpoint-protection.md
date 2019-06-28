---
title: Endpoint protection solutions discovery and health assessment in Azure Security Center | Microsoft Docs
description: How the endpoint protection solutions are discovered and identified as healthy.
services: security-center 
documentationcenter: na
author: monhaber 
manager: barbkess 

ms.assetid: 2730a2f5-20bc-4027-a1c2-db9ed0539532
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/23/2019
ms.author: v-mohabe
---

# Endpoint protection assessment and recommendations in Azure Security Center

Endpoint protection assessment and recommendations in Azure Security Center detects and provides health assessment of  [supported](https://docs.microsoft.com/azure/security-center/security-center-os-coverage#supported-platforms-for-windows-computers-and-vms) versions of Endpoint protection solutions. This topic explains the scenarios that generate the following two recommendations for Endpoint protection solutions by Azure Security Center.

* **Install endpoint protection solutions on your virtual machine**
* **Resolve endpoint protection health issues on your machines**

## Windows Defender

* The **"Install endpoint protection solutions on virtual machine"** recommendation is generated when [Get-MpComputerStatus](https://docs.microsoft.com/powershell/module/defender/get-mpcomputerstatus?view=win10-ps) runs and the result is **AMServiceEnabled: False**

* The **"Resolve endpoint protection health issues on your machines"** recommendation is generated when  [Get-MpComputerStatus](https://docs.microsoft.com/powershell/module/defender/get-mpcomputerstatus?view=win10-ps) runs and either or both of the following occurs:

  * At least one of the following properties is false:

     **AMServiceEnabled**

     **AntispywareEnabled**

     **RealTimeProtectionEnabled**

     **BehaviorMonitorEnabled**

     **IoavProtectionEnabled**

     **OnAccessProtectionEnabled**

  * If one or both of the following properties is greater or equal to 7.

     **AntispywareSignatureAge**

     **AntivirusSignatureAge**

## Microsoft System Center endpoint protection

* The **"Install endpoint protection solutions on virtual machine"** recommendation is generated when importing **SCEPMpModule  ("$env:ProgramFiles\Microsoft Security Client\MpProvider\MpProvider.psd1" )** and running **Get-MProtComputerStatus** results with **AMServiceEnabled = false**

* The **"Resolve endpoint protection health issues on your machines"** recommendation is generated when **Get-MprotComputerStatus** runs and either or both of the following occurs:

    * At least one of the following properties is false:

       **AMServiceEnabled**
    
       **AntispywareEnabled**
    
       **RealTimeProtectionEnabled**
    
       **BehaviorMonitorEnabled**
    
       **IoavProtectionEnabled**
    
       **OnAccessProtectionEnabled**
          
    * If one or both of the following Signature Updates is greater or equal to 7. 

       **AntispywareSignatureAge**
    
       **AntivirusSignatureAge**

## Trend Micro

* The **"Install endpoint protection solutions on virtual machine"** recommendation is generated if one or more of the following checks aren't met:
    * **HKLM:\SOFTWARE\TrendMicro\Deep Security Agent** exists
    * **HKLM:\SOFTWARE\TrendMicro\Deep Security Agent\InstallationFolder** exists
    * The **dsq_query.cmd** file is found in the Installation Folder
    * Running **dsa_query.cmd** results with **Component.AM.mode: on - Trend Micro Deep Security Agent detected**

## Symantec endpoint protection
The **"Install endpoint protection solutions on virtual machine"** recommendation is generated if any of the following checks aren't met:

* **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"**

* **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1**

Or

* **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\PRODUCTNAME = "Symantec Endpoint Protection"**

* **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\ASRunningStatus = 1**

The **"Resolve endpoint protection health issues on your machines"** recommendation is generated if any of the following checks aren't met:  

* Check Symantec Version >= 12:  Registry location: **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion" -Value "PRODUCTVERSION"**

* Check Real Time Protection status: **HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection\AV\Storages\Filesystem\RealTimeScan\OnOff == 1**

* Check Signature Update status: **HKLM\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LatestVirusDefsDate <= 7 days**

* Check Full Scan status: **HKLM:\Software\Symantec\Symantec Endpoint Protection\CurrentVersion\public-opstate\LastSuccessfulScanDateTime <= 7 days**

* Find signature version number Path to signature version for Symantec 12: **Registry Paths+ "CurrentVersion\SharedDefs" -Value "SRTSP"** 

* Path to signature version for Symantec 14: **Registry Paths+ "CurrentVersion\SharedDefs\SDSDefs" -Value "SRTSP"**

Registry Paths:

**"HKLM:\Software\Symantec\Symantec Endpoint Protection" + $Path;**
**"HKLM:\Software\Wow6432Node\Symantec\Symantec Endpoint Protection" + $Path**

## McAfee endpoint protection for Windows

The **"Install endpoint protection solutions on virtual machine"** recommendation is generated if the following checks aren't met:

* **HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion** exists

* **HKLM:\SOFTWARE\McAfee\AVSolution\MCSHIELDGLOBAL\GLOBAL\enableoas = 1**

The **"Resolve endpoint protection health issues on your machines"** recommendation is generated if the following checks aren't met:

* McAfee Version: **HKLM:\SOFTWARE\McAfee\Endpoint\AV\ProductVersion >= 10**

* Find Signature Version: **HKLM:\Software\McAfee\AVSolution\DS\DS -Value "dwContentMajorVersion"**

* Find Signature date: **HKLM:\Software\McAfee\AVSolution\DS\DS -Value "szContentCreationDate" >= 7 days**

* Find Scan date: **HKLM:\Software\McAfee\Endpoint\AV\ODS -Value "LastFullScanOdsRunTime" >= 7 days**

## Troubleshoot and support

### Troubleshoot

Microsoft Antimalware extension logs are available at:  
**%Systemdrive%\WindowsAzure\Logs\Plugins\Microsoft.Azure.Security.IaaSAntimalware(Or PaaSAntimalware)\1.5.5.x(version#)\CommandExecution.log**

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Or, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).
