---
title: Run the Azure Stack Network Readiness Checker (NRC) tool
description: Pre-quality network before deploying Azure Stack Edge devices.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: howto
ms.date: 03/19/2021
ms.author: alkohli

# Customer intent: As an IT admin, I want to expedite deployment of Azure Stack devices by checking network settings in advance.
---

# Run Network Readiness Tool for Azure Stack Edge

Use the Azure Stack Network Readiness Checker tool to make sure your network meets all requirements before you deploy an Azure Stack Edge device.<!--Add a bit more detail about what's checked?--> This can reduce depoloyment time and avoid Support calls.<!--Marketing or friendly advice?-->

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

1. Install PowerShell 7.0 on the client. For guidance, see [What's new in PowerShell 7.0](https://docs.microsoft.com/en-us/powershell/scripting/whats-new/what-s-new-in-powershell-70?view=powershell-7.1).<!--Have them optionally check the installed version?-->

### Install the Network Readiness Checker (NRC)

Install the Azure Stack Edge Network Readiness tool on the client computer:

1. Go to the [Microsoft.AzureStack.ReadinessChecker](https://github.com/Azure-Samples/azure-stack-edge-order) in the PowerShell Gallery. You can install the module in PowerShell, use Azure Automation, or do a manual download.<!--"Install Module" method, default method, installs to a default location. Is that location required for a PowerShell module? -->

## Run a Network Readiness Check

1. Open PowerShell.<!--Is it necessary to run the script as an Administrator? The script is just looking around. But it is an unsigned script (?) that requires confirmation.-->

3. XXXX<!--The tool is a PowerShell module. Once they install it, do they need to worry about where they are when they run the command?-->

4. Run the tool. To run `New-AzStackEdgeMultiOrder.ps1`, you would type the following:

STOPPING HERE. The rest is 

#### Usage notes

You'll need to provide XXX when you run the tool. 

#### Parameter info

- `-Devicefqdn`: XXX<!--Get parameter background from "Deploy" tutorials for the network and device.-->
- `-TimeServer`: XXX
- `-Proxy`: XXX
- `-SkipTests`: XXX (Mandatory vs. Optional tests)
- `-WindowsUpdateServer`: XXX
- `-OutPath`: XXX

## Sample tool output

The following is sample output from running THE TOOL. SUMMARY OF KEY NETWORK CHARACTERISTICS.

## Sample logfile

XXX

## Sample report
