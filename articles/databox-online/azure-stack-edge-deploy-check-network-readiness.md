---
title: Check network readiness before deploying an Azure Stack Edge with GPU device.<!--Verify SKUs.-->
description: Pre-quality network before deploying Azure Stack Edge devices.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/22/2021
ms.author: alkohli

# Customer intent: As an IT admin, I want to expedite deployment of Azure Stack devices by checking network settings in advance.
---

# Check network readiness for Azure Stack Edge devices

This article describes how to check network readiness for Azure Stack Edge using the Network Readiness Tool before you deploy devices. Qualifying your network in advance can help you reduce deployment time and avoid Support calls.

The Azure Stack Network Readiness Checker is a PowerShell tool that runs a series of tests to check mandatory and optional settings on the network where an Azure Stack Edge device will be deployed. You can run the tool from any computer on the network.<!--OS requirements will be PowerShell 7.0 requirements?--> The tool checks returns Pass/Fail status for each setting, and also saves a log and a report file.

The Network Readiness Checker tool includes the following tests. You can choose which tests to run.

|Test               |Checks for   |Required setting? | 
|-------------------|-------------|------------------|
|LinkLayer          |             |Required          |
|IPConfig           |             |Required          |
|DnsServer          |One or more. |Required          |
|TimeServer         |             |Required          |
|DuplicateIP        |             |Required          |
|Proxy              |If using a proxy server.  |Optional         |
|AzureEndpoint      |             |Required         |
|WindowsUpdateServer|Mandatory for the purpose of this test?  |Required         |
|DnsRegistration    |             |Required         |

## Prerequisites

Before you begin, make sure you have:

- Prepare your network using [Deployment checklist for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-checklist.md). 
- Make sure you have access to a client computer that is running on the network where you'll deploy your devices.<!--WHERE'S THE WORK ITEM? This article becomes a prerequisite for "Connect" tutorial. Also mention this article in the "Get checklist" tutorial.-->
- Install PowerShell 7.0 on the client computer. For guidance, see [What's new in PowerShell 7.0](/powershell/scripting/whats-new/what-s-new-in-powershell-70.md?view=powershell-7.1&preserve-view=true).
- Install the Azure Stack Network Readiness Checker tool [Microsoft.AzureStack.ReadinessChecker](https://github.com/Azure-Samples/azure-stack-edge-order) from the PowerShell Gallery. 

### Install PowerShell

1. Install PowerShell 7.0 on the client. For guidance, see [What's new in PowerShell 7.0](/powershell/scripting/whats-new/what-s-new-in-powershell-70.md?view=powershell-7.1&preserve-view=true).<!--Have them optionally check the installed version?-->

### Install the Network Readiness Checker (NRC)

Install the Azure Stack Edge Network Readiness tool on the client computer:

1. Go to the [Microsoft.AzureStack.ReadinessChecker](https://github.com/Azure-Samples/azure-stack-edge-order) in the PowerShell Gallery. You can install the module in PowerShell, use Azure Automation, or do a manual download.<!--"Install Module" method, default method, installs to a default location. Is that location required for a PowerShell module? -->

## Run a Network Readiness Check

1. Open PowerShell.<!--Is it necessary to run the script as an Administrator? The script is just looking around. But it is an unsigned script (?) that requires confirmation.-->

3. XXXX<!--The tool is a PowerShell module. Once they install it, do they need to worry about where they are when they run the command?-->

4. Run the tool. To run `New-AzStackEdgeMultiOrder.ps1`, you would type the following:

#### Usage notes

You'll need to provide XXX when you run the tool. <!--Not yet written.-->

#### Parameter info

- `-Devicefqdn`: XXX<!--Get parameter background from "Deploy" tutorials for the network and device.-->
- `-TimeServer`: XXX
- `-Proxy`: XXX
- `-SkipTests`: XXX (Mandatory vs. Optional tests)
- `-WindowsUpdateServer`: XXX
- `-OutPath`: XXX

## Sample tool output

The following is sample output from running THE TOOL. SUMMARY OF KEY RESULTS.<!--Text below has not been anonymized. Raw data from test run.-->

```powershell
PS C:\Users\Administrator> Invoke-AzsNetworkValidation -DnsServer '10.50.10.50', '10.50.50.50' -DeviceFqdn 'vibhan-dtp.northamerica.corp.microsoft.com' -TimeServer 'pool.ntp.org' -Proxy 'http://10.57.48.80:8080' -SkipTests DuplicateIP -WindowsUpdateServer "http://storsimpleprod.frontendprodmt.selfhost.corp.microsoft.com" -OutputPath C:\vibhan


Invoke-AzsNetworkValidation v1.2100.1396.426 started.
The following tests will be executed: LinkLayer, IPConfig, DnsServer, TimeServer, AzureEndpoint, WindowsUpdateServer, DnsRegistration, Proxy
Validating input parameters
Validating Azure Stack Edge Network Readiness
        Link Layer: OK
        IP Configuration: OK
 Using network adapter name 'vEthernet (corp-1g-Static)', description 'Hyper-V Virtual Ethernet Adapter'
        DNS Server 10.50.10.50: OK
        DNS Server 10.50.50.50: OK
        Time Server pool.ntp.org: OK
        Proxy Server 10.57.48.80: OK
        Azure ARM Endpoint: OK
        Azure Graph Endpoint: OK
        Azure Login Endpoint: OK
        Azure ManagementService Endpoint: OK
        Windows Update Server storsimpleprod.frontendprodmt.selfhost.corp.microsoft.com port 80: Fail
        DNS Registration for vibhan-dtp.northamerica.corp.microsoft.com: OK
        DNS Registration for login.vibhan-dtp.northamerica.corp.microsoft.com: Fail
        DNS Registration for management.vibhan-dtp.northamerica.corp.microsoft.com: Fail
        DNS Registration for *.blob.vibhan-dtp.northamerica.corp.microsoft.com: Fail
        DNS Registration for compute.vibhan-dtp.northamerica.corp.microsoft.com: Fail

Log location (contains PII): C:\vibhan\AzsReadinessChecker.log
Report location (contains PII): C:\vibhan\AzsReadinessCheckerReport.json
Invoke-AzsNetworkValidation Completed
```



