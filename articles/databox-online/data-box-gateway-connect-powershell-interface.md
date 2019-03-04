---
title: Connect to and manage Microsoft Azure Data Box Gateway device via the Windows PowerShell interface | Microsoft Docs
description: Describes how to connect to and then manage Data Box Gateway via the Windows PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 03/04/2019
ms.author: alkohli
---
# Manage Azure Data Box Gateway via Windows PowerShell

Azure Data Box Gateway solution lets you send data over the network to Azure. This article describes some of the configuration and management tasks for your Data Box Gateway device. You can use the Azure portal, local web UI, or the Windows PowerShell interface to manage your device.

This article focuses on the tasks you do using the PowerShell interface.

This article includes the following procedures:

- Connect to the PowerShell interface
- Start a support session
- Create a support package
- Upload certificate
- Boot up in non-DHCP environment
- View device information


## Connect to the PowerShell interface

[!INCLUDE [Connect to admin runspace](../../includes/data-box-edge-gateway-connect-minishell.md)]

## Start a support session

[!INCLUDE [Connect to support runspace](../../includes/data-box-edge-gateway-connect-support.md)]

## Create a support package

[!INCLUDE [Create a support package](../../includes/data-box-edge-gateway-create-support-package.md)]

## Upload certificate

[!INCLUDE [Upload certificate](../../includes/data-box-edge-gateway-upload-certificate.md)]

## Boot up in non-DHCP environment

[!INCLUDE [Boot up in non-DHCP environment](../../includes/data-box-edge-gateway-boot-non-dhcp.md)]

## View device information

[!INCLUDE [View device information](../../includes/data-box-edge-gateway-view-device-info.md)]

## Next steps

- Deploy [Azure Data Box Edge](https://aka.ms/dbe-docs) in Azure portal.
