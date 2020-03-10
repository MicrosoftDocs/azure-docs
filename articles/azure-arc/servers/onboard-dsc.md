---
title: Install Connected Machine agent using Windows PowerShell DSC
description: In this article, you learn how to connect machines to Azure using Azure Arc for servers (preview) using Windows PowerShell DSC.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 03/10/2020
ms.topic: conceptual
---

# How to install the Connected Machine agent using Windows PowerShell Desired State Configuration

Using [Windows PowerShell Desired State Configuration](https://docs.microsoft.com/powershell/scripting/dsc/getting-started/winGettingStarted?view=powershell-7) (DSC), you can automate software installation and configuration for a computer. This article describes how to use DSC to install the Azure Arc for servers Connected Machine agent on hybrid Windows machines.

## Requirements

- Windows PowerShell version 4.0 or higher

- The [AzureConnectedMachineDsc](https://www.powershellgallery.com/packages/AzureConnectedMachineDsc/1.0.1.0) DSC module 

## Install the ConnectedMachine DSC module

1. To manually install the module, download the source code and unzip the contents of the project directory to the
`$env:ProgramFiles\WindowsPowerShell\Modules folder`. Or, run the following command to install from the PowerShell gallery using PowerShellGet (in PowerShell 5.0):

    ```powershell
    Find-Module -Name AzureConnectedMachineDsc -Repository PSGallery | Install-Module
    ```

2. To confirm installation, run the following command and ensure you see the Azure Connected Machine DSC resources available.

    ```powershell
    Get-DscResource -Module AzureConnectedMachineDsc
    ```

   In the output, you should see something similar to the following:

   ![Confirmation of Connected Machine DSC module installation example](./media/onboad-dsc/confirm-module-installation.png)

## Install the agent and connect to Azure

The resources in this module are designed to manage the Azure Connected Machine Agent configuration. Also included is a configuration MOF document `AzureConnectedMachineAgent.ps1`, found in the `AzureConnectedMachineDsc\examples` folder, uses community resources to automate the download and installation, and to establish the connection with Azure Arc. This configuration document performs similar steps described in the [Connect hybrid machines to Azure from the Azure portal](onboard-portal.md) article.

If the machine needs to communicate through a proxy server to the service, after you install the agent you need to run a command that's described [here](onboard-portal.md#configure-the-agent-proxy-setting). This sets the proxy server system environment variable `https_proxy`. Instead of running the command manually, you can perform this step with DSC by using the ComputeManagementDsc module.

>[!NOTE]
To allow DSC to run, Windows needs to be configured to receive PowerShell remote commands even when you're running a localhost configuration. To easily configure your environment correctly, just run `Set-WsManQuickConfig -Force` in an elevated PowerShell Terminal.
>

Configuration documents (MOF files) can be applied to the machine using the `Start-DscConfiguration` cmdlet.

PowerShell script:

```powershell
& .\examples\AzureConnectedMachineAgent.ps1
```

The script parameters include:

- **TenantID**: The id (guid) of the Azure tenant
- **SubscriptionId**: The id (guid) of the Azure subscription
- **ResourceGroup**: The name of the resource group where the connect machine resource should be created
- **Location**: The Azure location where the connected machine resource should be created
- **Tags**: String array of tags that should be applied to the connected machine resource
- **Credential**: A PowerShell credential object with the AppId and Secret used to register machines at scale

The Azure Connected Machine Agent supports connecting through an http proxy service.  For more information on the proxy details, see the
documentation for Azure Connect Machine Agent.

## Adding to existing configurations

This resource can be added to existing DSC configurations to represent an end-to-end configuration
for a machine.  For example, you might wish to add this resource to a configuration that sets
secure operating system settings.

The **CompsiteResource** module from the PowerShell Gallery can be used to create a composite
resource of the example configuration, to further simplify combining configurations.

