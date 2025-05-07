---
title: Use Windows PowerShell to connect to and manage Azure Data Box Gateway device
description: Describes how to connect to and then manage Data Box Gateway via the Windows PowerShell interface.
services: databox
author: stevenmatthew

ms.service: azure-data-box-gateway
ms.topic: how-to
ms.date: 10/20/2020
ms.author: shaas
---
# Manage an Azure Data Box Gateway device via Windows PowerShell

Azure Data Box Gateway solution lets you send data over the network to Azure. This article describes some of the configuration and management tasks for your Data Box Gateway device. You can use the Azure portal, local web UI, or the Windows PowerShell interface to manage your device.

This article focuses on the tasks you do using the PowerShell interface.

This article includes the following procedures:

- Connect to the PowerShell interface
- Create a support package
- Upload certificate
- Boot up in non-DHCP environment
- View device information

## Connect to the PowerShell interface

[!INCLUDE [Connect to admin runspace](../../includes/data-box-gateway-connect-minishell.md)]

## Create a support package

[!INCLUDE [Create a support package](../../includes/data-box-gateway-create-support-package.md)]

## Upload certificate

[!INCLUDE [Upload certificate](../../includes/data-box-gateway-upload-certificate.md)]

## Boot up in non-DHCP environment

[!INCLUDE [Boot up in non-DHCP environment](../../includes/data-box-gateway-boot-non-dhcp.md)]

## View device information

[!INCLUDE [View device information](../../includes/data-box-gateway-view-device-info.md)]

## Next steps

- Deploy [Azure Data Box Gateway](data-box-gateway-deploy-prep.md) in Azure portal.
