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

The resources in this module are designed to manage the Azure Connected Machine Agent configuration. Also included is a configuration MOF document, found in the `AzureConnectedMachineDsc\examples` folder, uses community resources to automate the download and installation, and to establish the connection with Azure Arc. This configuration document performs similar steps described in the [Connect hybrid machines to Azure from the Azure portal](onboard-portal.md) article.

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

The Azure Connected Machine Agent supports connecting through an http proxy service. The
proxy details are provided to the agent using envionment variables, which could also be managed by DSC
using the ComputeManagementDsc module.  For more information on the proxy details, see the
documentation for Azure Connect Machine Agent.

## Adding to existing configurations

This resource can be added to existing DSC configurations to represent an end-to-end configuration
for a machine.  For example, you might wish to add this resource to a configuration that sets
secure operating system settings.

The **CompsiteResource** module from the PowerShell Gallery can be used to create a composite
resource of the example configuration, to further simplify combining configurations.

