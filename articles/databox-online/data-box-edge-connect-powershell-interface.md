---
title: Connect to and manage Microsoft Azure Data Box Edge device via the Windows PowerShell interface | Microsoft Docs
description: Describes how to connect to and then manage Data Box Edge via the Windows PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 03/05/2019
ms.author: alkohli
---
# Manage an Azure Data Box Edge device via Windows PowerShell (preview)

Azure Data Box Edge solution lets you process data and send it over the network to Azure. This article describes some of the configuration and management tasks for your Data Box Edge device. You can use the Azure portal, local web UI, or the Windows PowerShell interface to manage your device.

This article focuses on the tasks you do using the PowerShell interface.

This article includes the following procedures:

- Connect to the PowerShell interface
- Start a support session
- Create a support package
- Upload certificate
- Reset the device
- View device information
- Get compute logs
- Monitor and troubleshoot compute modules

> [!IMPORTANT]
> Azure Data Box Edge is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Connect to the PowerShell interface

[!INCLUDE [Connect to admin runspace](../../includes/data-box-edge-gateway-connect-minishell.md)]

## Start a support session

[!INCLUDE [Connect to support runspace](../../includes/data-box-edge-gateway-connect-support.md)]

## Create a support package

[!INCLUDE [Create a support package](../../includes/data-box-edge-gateway-create-support-package.md)]

## Upload certificate

[!INCLUDE [Upload certificate](../../includes/data-box-edge-gateway-upload-certificate.md)]

## View device information
 
[!INCLUDE [View device information](../../includes/data-box-edge-gateway-view-device-info.md)]

## Reset your device

[!INCLUDE [Reset your device](../../includes/data-box-edge-gateway-deactivate-device.md)]

## Get compute logs

If the compute role is configured on your device, you can also get the compute logs via the PowerShell interface.

1. [Connect to the PowerShell interface](#connect-to-the-powershell-interface).
2. Use the `Get-AzureDataBoxEdgeComputeRoleLogs` to get the compute logs for your device.

    The following example shows the usage of this cmdlet:

    ```
    Get-AzureDataBoxEdgeComputeRoleLogs -Path "\\hcsfs\logs\myacct" -Credential "username/password" -RoleInstanceName "IotRole" -FullLogCollection
    ```
    Here is a description of the parameters used for the cmdlet: 
    - `Path`: Provide a network path to the share where you want to create the compute log package.
    - `Credential`: Provide the username and password for the network share.
    - `RoleInstanceName`: Provide this string `IotRole` for this parameter.
    - `FullLogCollection`: This parameter ensures that the log package will contain all the compute logs. By default, the log package contains only a subset of logs.


## Next steps

- Deploy [Azure Data Box Edge](data-box-edge-deploy-prep.md) in Azure portal.
