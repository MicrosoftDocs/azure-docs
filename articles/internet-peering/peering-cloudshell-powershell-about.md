---
title: include file
description: include file
services: internet-peering
author: prmitiki

ms.service: internet-peering
ms.topic: include
ms.date: 11/27/2019
ms.author: prmitiki

---

To run the cmdlets, you can use Azure Cloud Shell, a free interactive shell. It has common Azure tools preinstalled and configured to use with your account. Just click the **Copy** to copy the code, paste it into the Cloud Shell, and then press enter to run it. There are a few ways to launch the Cloud Shell:

<!--
|  |   |
|-----------------------------------------------|---|
| Click **Try It** in the upper right corner of a code block. | ![Cloud Shell in this article](../media/cloud-shell-powershell-try-it.png) |
| Open Cloud Shell in your browser. | [![https://shell.azure.com/powershell](../media/launchcloudshell.png)](https://shell.azure.com/powershell) |
| Click the **Cloud Shell** button on the menu in the upper right of the Azure portal. | [![Cloud Shell in the portal](../media/cloud-shell-menu.png)](https://portal.azure.com) |
|  |  |
-->

|  |   |
|-----------------------------------------------|---|
| Open Cloud Shell in your browser. | [![https://shell.azure.com/powershell](../media/launchcloudshell.png)](https://shell.azure.com/powershell) |
| Click the **Cloud Shell** button on the menu in the upper right of the Azure portal. | [![Cloud Shell in the portal](../media/cloud-shell-menu.png)](https://portal.azure.com) |
|  |  |

<!--
If you are using CloudShell please ensure you are using Az.Peering Module version 0.1.1 or higher. If Az.Peering Module version 0.1.0 is installed you can move to 0.1.1 by using the following command.

```powershell
Install-Module -Name Az.Peering -RequiredVersion 0.1.1 -AllowClobber
Import-Module Az.Peering
```

Verify the module version
```powershell
Get-Module
```
-->

If you don't want to use Azure CloudShell, you can install PowerShell locally instead. If you choose to install and use PowerShell locally, be sure to install the latest version of the Azure Resource Manager PowerShell cmdlets. PowerShell cmdlets are updated frequently and you typically need to update your PowerShell cmdlets to get the latest feature functionality, failing which, you may encounter issues.

To find the version of PowerShell that you are running locally, use the 'Get-Module -ListAvailable Az' cmdlet. To update, see [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/azurerm/install-azurerm-ps). For more information, see [How to install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/azurerm/overview).

If you are using PowerShell on macOS then please follow the steps in [Installing PowerShell Core on macOS.](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-macos?view=powershell-6)