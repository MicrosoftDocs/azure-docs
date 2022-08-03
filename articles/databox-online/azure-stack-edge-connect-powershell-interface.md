---
title: Connect to and manage Microsoft Azure Stack Edge Pro FPGA device via the Windows PowerShell interface
description: Describes Azure Stack Edge Pro FPGA connection and management via Windows PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 04/14/2022
ms.author: alkohli
---
# Manage an Azure Stack Edge Pro FPGA device via Windows PowerShell

Azure Stack Edge Pro FPGA solution lets you process data and send it over the network to Azure. This article describes some of the configuration and management tasks for your Azure Stack Edge Pro FPGA device. You can use the Azure portal, local web UI, or the Windows PowerShell interface to manage your device.

This article focuses on the tasks you do using the PowerShell interface. 

This article includes the following procedures:

- Connect to the PowerShell interface
- Create a support package
- Upload certificate
- Reset the device
- View device information
- Get compute logs
- Monitor and troubleshoot compute modules

## Connect to the PowerShell interface

[!INCLUDE [Connect to admin runspace](../../includes/data-box-edge-gateway-connect-minishell.md)]

## Create a support package

[!INCLUDE [Create a support package](../../includes/data-box-edge-gateway-create-support-package.md)]

## Upload certificate

[!INCLUDE [Upload certificate](../../includes/data-box-edge-gateway-upload-certificate.md)]

You can also upload IoT Edge certificates to enable a secure connection between your IoT Edge device and the downstream devices that may connect to it. There are three files (*.pem* format) that you need to install:

- Root CA certificate or the owner CA
- Device CA certificate
- Device private key 

The following example shows the usage of this cmdlet to install IoT Edge certificates:

```
Set-HcsCertificate -Scope IotEdge -RootCACertificateFilePath "\\hcfs\root-ca-cert.pem" -DeviceCertificateFilePath "\\hcfs\device-ca-cert.pem\" -DeviceKeyFilePath "\\hcfs\device-private-key.pem" -Credential "username"
```
When you run this cmdlet, you will be prompted to provide the password for the network share.

For more information on certificates, go to [Azure IoT Edge certificates](../iot-edge/iot-edge-certs.md) or [Install certificates on a gateway](../iot-edge/how-to-create-transparent-gateway.md).

## View device information
 
[!INCLUDE [View device information](../../includes/data-box-edge-gateway-view-device-info.md)]

## Reset your device

[!INCLUDE [Reset your device](../../includes/data-box-edge-gateway-deactivate-device.md)]

## Get compute logs

If the compute role is configured on your device, you can also get the compute logs via the PowerShell interface.

1. [Connect to the PowerShell interface](#connect-to-the-powershell-interface).
2. Use the `Get-AzureDataBoxEdgeComputeRoleLogs` to get the compute logs for your device.

    The following example shows the usage of this cmdlet:

    ```powershell
    Get-AzureDataBoxEdgeComputeRoleLogs -Path "\\hcsfs\logs\myacct" -Credential "username" -FullLogCollection
    ```

    Here is a description of the parameters used for the cmdlet:
    - `Path`: Provide a network path to the share where you want to create the compute log package.
    - `Credential`: Provide the username for the network share. When you run this cmdlet, you will need to provide the share password.
    - `FullLogCollection`: This parameter ensures that the log package will contain all the compute logs. By default, the log package contains only a subset of logs.

## Monitor and troubleshoot compute modules

[!INCLUDE [Monitor and troubleshoot compute modules](../../includes/azure-stack-edge-monitor-troubleshoot-compute.md)]

## Exit the remote session

To exit the remote PowerShell session, close the PowerShell window.

## Next steps

- Deploy [Azure Stack Edge Pro FPGA](azure-stack-edge-deploy-prep.md) in Azure portal.