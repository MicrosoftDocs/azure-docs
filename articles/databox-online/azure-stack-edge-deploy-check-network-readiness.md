---
title: Run the Azure Stack Network Readiness Checker (NRC) tool
description: Pre-quality network before deploying Azure Stack Edge devices.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/19/2021
ms.author: alkohli

# Customer intent: As an IT admin, I want to expedite deployment of Azure Stack devices by checking network settings in advance.
---

# Run Network Readiness Tool for Azure Stack Edge

Use the Azure Stack Network Readiness Checker tool to make sure your network meets all requirements before you deploy an Azure Stack Edge device.<!--Add a bit more detail about what's checked?--> This can reduce deployment time and avoid Support calls.<!--Marketing or friendly advice?-->

The Network Readiness Tool is a PowerShell module that checks XX, XX, on the network. You can run the tool on a Windows or Linux computer on the network where you'll deploy your Azure Stack Edge devices.<!--Oversimplified? OS requirements? Check PowerShell requirements.-->

The Network Readiness Tool runs a series of mandatory and optional tests to find out whether the network is ready for Azure Stack Edge deployments. You can run a full set of tests or skip the tests you don't need.<!--It's not clear whether the settings or the tests are "Mandatory." Format line includes all tests for both -RunTests and -SkipTests. Get detail from config tutorials for network and device; tool spec; some notes from Vibha.-->

|Test               |Checks for   |Mandatory setting?| 
|-------------------|-------------|------------------|
|LinkLayer          |             |Mandatory         |
|IPConfig           |             |Mandatory         |
|DnsServer          |             |Mandatory         |
|TimeServer         |             |Mandatory         |
|DuplicateIP        |             |Mandatory         |
|Proxy              |             |Mandatory         |
|AzureEndpoint      |             |Mandatory         |
|WindowsUpdateServer|             |Mandatory         |
|DnsRegistration    |             |Mandatory         |
|                   |             |Optional          |
|                   |             |Optional          |
|                   |             |Optional          |

## Prerequisites

Before you begin, make sure you have:

- A computer running on the network where you'll deploy the Azure Stack device<!--No section needed?-->
- Network and device settings<!--Short list, with full discussion in "Parameters"-->
- PowerShell 7.0
- Azure Stack Network Readiness Checker tool (Microsoft.AzureStack.ReadinessChecker module)

### Connect Windows client to network

You will test the network settings on a Windows client on the network that you will use for the Azure Stack Edge device.

### Get network, device settings

When you run the tool, you'll need to provide the following network and device settings:<!--Short list. Details in parameter definitions for the tool.-->

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



