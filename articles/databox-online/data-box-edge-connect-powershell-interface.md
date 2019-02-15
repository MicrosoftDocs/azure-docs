---
title: Connect to and manage Microsoft Azure Data Box Edge device via the Windows PowerShell interface | Microsoft Docs
description: Describes how to connect to and then manage Data Box Edge via the Windows PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/14/2019
ms.author: alkohli
---
# Manage Azure Data Box Edge via Windows PowerShell

Azure Data Box Edge is a storage solution that allows you to process data and send it over the network to Azure. This article describes some of the configuration and management tasks for your Data Box Edge device. You can manage your Data Box Edge using the Azure portal UI, the local web UI, and the Windows PowerShell interface of the device.

This article focuses on the tasks that you can perform using the PowerShell interface. Use the PowerShell interface to get Azure container logs, reset the device, generate a log package for Microsoft Support, and run diagnostic tests.

This article includes the following procedures:

- Connect to the PowerShell interface
- Start a support session
- Create a support package
- Upload certificate
- Reset the device
- View device information
- Get container logs

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

## Deactivate your device

[!INCLUDE [Deactivate your device](../../includes/data-box-edge-gateway-deactivate-device.md)]

## Recover your device 
 
[!INCLUDE [Recover your device](../../includes/data-box-edge-gateway-get-bitlocker-key.md)]


## Next steps

- Deploy [Azure Data Box Edge](https://aka.ms/dbe-docs) in Azure portal.
