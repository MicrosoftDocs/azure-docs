---
author: cherylmc
ms.date: 12/06/2019
ms.service: expressroute
ms.topic: include
ms.author: cherylmc
---

Install the latest versions of the Azure Service Management (SM) PowerShell modules and the ExpressRoute module. You can't use the Azure CloudShell environment to run SM modules.

1. Use the instructions in the [Installing the Service Management module](/powershell/azure/servicemanagement/install-azure-ps) article to install the Azure Service Management Module. If you have the Az or RM module already installed, be sure to use '-AllowClobber'.
2. Import the installed modules. When using the following example, adjust the path to reflect the location and version of your installed PowerShell modules.

   ```powershell
   Import-Module 'C:\Program Files\WindowsPowerShell\Modules\Azure\5.3.0\Azure.psd1'
   Import-Module 'C:\Program Files\WindowsPowerShell\Modules\Azure\5.3.0\ExpressRoute\ExpressRoute.psd1'
   ```
3. To sign in to your Azure account, open your PowerShell console with elevated rights and connect to your account. Use the following example to help you connect using the Service Management module:

   ```powershell
   Add-AzureAccount
   ```