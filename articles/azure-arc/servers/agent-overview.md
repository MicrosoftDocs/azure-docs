---
title:  Overview of the Connected Machine Windows agent
description: This article provides a detailed overview of the Azure Arc for servers agent available which support monitoring virtual machines hosted in hybrid environments.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 04/27/2020
ms.topic: conceptual
---

# Overview of Azure Arc for servers agent

The Azure Arc for servers Connected Machine agent enables you to manage your Windows and Linux machines hosted outside of Azure on your corporate network or other cloud provider. This article provides a detailed overview of the agent, system and network requirements, and the different deployment methods.

## Download agents

You can download the Azure Connected Machine agent package for Windows and Linux from the locations listed below.

- [Windows agent Windows Installer package](https://aka.ms/AzureConnectedMachineAgent) from the Microsoft Download Center.
- Linux agent package is distributed from Microsoft's [package repository](https://packages.microsoft.com/) using the preferred package format for the distribution (.RPM or .DEB).

>[!NOTE]
>During this preview, only one package has been released, which is suitable for Ubuntu 16.04 or 18.04.

The Azure Connected Machine agent for Windows and Linux can be upgraded to the latest release manually or automatically depending on your requirements. For more information, see [here](manage-agent.md).

## Windows agent overview

The Connected Machine agent for Windows can be installed by using one of the following three methods:

* Double-click the file `AzureConnectedMachineAgent.msi`.
* Manually by running the Windows Installer package `AzureConnectedMachineAgent.msi` from the Command shell.
* From a PowerShell session using the scripted method.

### Installation folders

During installation of the agent, two folders are created to support it:

* Support files are installed by default in `C:\Program Files\AzureConnectedMachineAgent`.
* Configuration files are installed in `%ProgramData%\AzureConnectedMachineAgent`.

### Services installed

The following Windows services are created on the target machine during installation of the agent.

|Service name | Display name | Process name | Description | 
|-------------|--------------|--------------|-------------|
| himds | Azure Hybrid Instance Metadata Service | himds.exe | This service implements the Azure Instance Metadata service (IMDS) to track the machine.|
| DscService | Guest Configuration Service | dsc_service.exe | This is the Desired State Configuration (DSC v2) codebase used inside Azure to implement In-Guest Policy.|

### Log files
 
There are four log files available for troubleshooting. They are described in the following table.

|Log | Location | Description |
|----|----------|-------------|
|himds.log | %ProgramData%\AzureConnectedMachineAgent\Log | Records details of the agents (himds) service and interaction with Azure. |
|azcmagent.log | %ProgramData%\AzureConnectedMachineAgent\Log | Contains the output of the azcmagent tool commands, when the verbose (-v) argument is used. |
|gc_agent.log | %ProgramData%\GuestConfig\gc_agent_logs | Records details of the DSC service activity, in particular the connectivity between the himds service and Azure Policy.|
|gc_agent_telemetry.txt | %ProgramData%\GuestConfig\gc_agent_logs | Records details about DSC service telemetry / verbose logging.|

If the agent fails to start after setup is finished, check the %ProgramData%\AzureConnectedMachineAgentAgent\logs\himds.log for detailed error information. 

## Installation and configuration

Connecting machines in your hybrid environment directly with Azure can be accomplished using different methods depending on your requirements. The following table highlights each method to determine which works best for your organization.

| Method | Description |
|--------|-------------|
| Interactively | Manually install the agent on a single or small number of machines following the steps in [Connect machines from Azure portal](onboard-portal.md).<br> From the Azure portal, you can generate a script and execute it on the machine to automate the install and configuration steps of the agent.|
| At scale | Install and configure the agent for multiple machines following the [Connect machines using a Service Principal](onboard-service-principal.md).<br> This method creates a service principal to connect machines non-interactively.|
| At scale | Install and configure the agent for multiple machines following the method [Using Windows PowerShell DSC](onboard-dsc.md).<br> This method uses a service principal to connect machines non-interactively with PowerShell DSC. |