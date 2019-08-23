---
title: Manage IoT Central from Azure PowerShell | Microsoft Docs
description: Manage IoT Central from Azure PowerShell.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 07/11/2019
ms.topic: conceptual
manager: philmea
---

# Manage IoT Central from Azure PowerShell

[!INCLUDE [iot-central-selector-manage](../../includes/iot-central-selector-manage.md)]

Instead of creating and managing IoT Central applications from the IoT Central [Application Manager](https://aka.ms/iotcentral) page, you can use [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) to manage your applications.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you prefer to run Azure PowerShell on your local machine, see [Install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps). When you run Azure PowerShell locally, use the **Connect-AzAccount** cmdlet to sign in to Azure before you try the cmdlets in this article.

## Install the IoT Central module

Run the following command to check the [IoT Central module](https://docs.microsoft.com/powershell/module/az.iotcentral/) is installed in your PowerShell environment:

```powershell
Get-InstalledModule -name Az.I*
```

If the list of installed modules doesn't include **Az.IotCentral**, run the following command:

```powershell
Install-Module Az.IotCentral
```

## Create an application

Use the [New-AzIotCentralApp](https://docs.microsoft.com/powershell/module/az.iotcentral/New-AzIotCentralApp) cmdlet to create an IoT Central application in your Azure subscription. For example:

```powershell
# Create a resource group for the IoT Central application
New-AzResourceGroup -ResourceGroupName "MyIoTCentralResourceGroup" `
  -Location "East US"
```

```powershell
# Create an IoT Central application
New-AzIotCentralApp -ResourceGroupName "MyIoTCentralResourceGroup" `
  -Name "myiotcentralapp" -Subdomain "mysubdomain" `
  -Sku "S1" -Template "iotc-demo@1.0.0" `
  -DisplayName "My Custom Display Name"
```

The script first creates a resource group in the east US region for the application. The following table describes the parameters used with the **New-AzIotCentralApp** command:

|Parameter         |Description |
|------------------|------------|
|ResourceGroupName |The resource group that contains the application. This resource group must already exist in your subscription. |
|Location |By default, this cmdlet uses the location from the resource group. Currently, you can create an IoT Central application in the **East US**, **West US**, **North Europe**, or **West Europe** regions. |
|Name              |The name of the application in the Azure portal. |
|Subdomain         |The subdomain in the URL of the application. In the example, the application URL is https://mysubdomain.azureiotcentral.com. |
|Sku               |Currently, the only value is **S1** (standard tier). See [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). |
|Template          | The application template to use. For more information, see the following table: |
|DisplayName       |The name of the application as displayed in the UI. |

**Application templates**

|Template name  |Description |
|---------------|------------|
|iotc-default@1.0.0 |Creates an empty application for you to populate with your own device templates and devices. |
|iotc-demo@1.0.0    |Creates an application that includes a device template already created for a Refrigerated Vending Machine. Use this template to get started exploring Azure IoT Central. |
|iotc-devkit-sample@1.0.0 |Creates an application with device templates ready for you to connect an MXChip or Raspberry Pi device. Use this template if you're a device developer experimenting with any of these devices. |

## View your IoT Central applications

Use the [Get-AzIotCentralApp](https://docs.microsoft.com/powershell/module/az.iotcentral/Get-AzIotCentralApp) cmdlet to list your IoT Central applications and view metadata.

## Modify an application

Use the [Set-AzIotCentralApp](https://docs.microsoft.com/powershell/module/az.iotcentral/set-aziotcentralapp) cmdlet to update the metadata of an IoT Central application. For example, to change the display name of your application:

```powershell
Set-AzIotCentralApp -Name "myiotcentralapp" `
  -ResourceGroupName "MyIoTCentralResourceGroup" `
  -DisplayName "My new display name"
```

## Remove an application

Use the [Remove-AzIotCentralApp](https://docs.microsoft.com/powershell/module/az.iotcentral/Remove-AzIotCentralApp) cmdlet to delete an IoT Central application. For example:

```powershell
Remove-AzIotCentralApp -ResourceGroupName "MyIoTCentralResourceGroup" `
 -Name "myiotcentralapp"
```

## Next steps

Now that you've learned how to manage Azure IoT Central applications from Azure PowerShell, here is the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)
