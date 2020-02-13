---
title: Manage IoT Central from Azure PowerShell | Microsoft Docs
description: This article describes how to create and manage your IoT Central applications from Azure PowerShell.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 07/11/2019
ms.topic: conceptual
manager: philmea
---

# Manage IoT Central from Azure PowerShell

[!INCLUDE [iot-central-selector-manage](../../../includes/iot-central-selector-manage.md)]

Instead of creating and managing IoT Central applications on the [Azure IoT Central application manager](https://aka.ms/iotcentral) website, you can use [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview) to manage your applications.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

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
  -Sku "ST1" -Template "iotc-demo@1.0.0" `
  -DisplayName "My Custom Display Name"
```

The script first creates a resource group in the east US region for the application. The following table describes the parameters used with the **New-AzIotCentralApp** command:

|Parameter         |Description |
|------------------|------------|
|ResourceGroupName |The resource group that contains the application. This resource group must already exist in your subscription. |
|Location |By default, this cmdlet uses the location from the resource group. Currently, you can create an IoT Central application in the **East US**, **West US**, **North Europe**, or **West Europe** regions, or in the **Australia** or **Asia Pacific** geographies.  |
|Name              |The name of the application in the Azure portal. |
|Subdomain         |The subdomain in the URL of the application. In the example, the application URL is https://mysubdomain.azureiotcentral.com. |
|Sku               |Currently, you can use either **ST1** or **ST2**. See [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). |
|Template          | The application template to use. For more information, see the following table: |
|DisplayName       |The name of the application as displayed in the UI. |

**Application templates**

| Template name            | Description |
| ------------------------ | ----------- |
| iotc-default@1.0.0       | Creates an empty application for you to populate with your own device templates and devices.
| iotc-pnp-preview@1.0.0   | Creates an empty Plug and Play (preview) application for you to populate with your own device templates and devices. |
| iotc-condition@1.0.0     | Creates an application with a in-store analytics – condition monitoring template. Use this template to connect and monitor store environment. |
| iotc-consumption@1.0.0   | Creates an application with water consumption monitoring template. Use this template to monitor and control water flow. |
| iotc-distribution@1.0.0  | Creates an application with a Digital distribution template. Use this template to improve warehouse output efficiency by digitalizing key assets and actions. |
| iotc-inventory@1.0.0     | Creates an application with a smart inventory management template. Use this template to automate receiving, product movement, cycle counting, and tracking of sensors. |
| iotc-logistics@1.0.0     | Creates an application with a Connected logistics template. Use this template to track your shipment in real-time across air, water and land with location and condition monitoring. |
| iotc-meter@1.0.0         | Creates an application with smart meter monitoring template. Use this template to monitor energy consumption, network status, and identify trends to improve customer support and smart meter management.  |
| iotc-patient@1.0.0       | Creates an application with continuous patient monitoring template. Use this template to extend patient care, re-admissions, and manage diseases. |
| iotc-power@1.0.0         | Creates an application with solar panel monitoring template. Use this template to monitor solar panel status, energy generation trends. |
| iotc-quality@1.0.0       | Creates an application with water quality monitoring template. Use this template to digitally monitor water quality.|
| iotc-store@1.0.0         | Creates an application with a in-store analytics – checkout template. Use this template to monitor and manage the checkout flow inside your store. |
| iotc-waste@1.0.0         | Creates an application with a Connected waste management template. Use this template to monitor waste bins and dispatch field operators. |

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
