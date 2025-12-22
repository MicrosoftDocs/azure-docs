---
title: Configure file upload in IoT Hub
description: How to use the Azure portal to configure your IoT hub to enable file uploads from connected devices. Includes information about configuring the destination Azure storage account.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 12/01/2025
zone_pivot_groups: service-portal-azcli-powershell
---

# Configure IoT Hub file uploads using the Azure portal

Configuring file uploads in your IoT hub enables your connected devices to upload files to an Azure storage account. This article shows you how to configure file uploads on your IoT hub using the Azure portal, Azure CLI, and Azure PowerShell.

To use the [file upload functionality in IoT Hub](iot-hub-devguide-file-upload.md), you must first associate an Azure storage account and blob container with your IoT hub. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files. In addition to the storage account and blob container, you can set the time-to-live for the SAS URI and the type of authentication that IoT Hub uses with Azure storage. You can also configure settings for the optional file upload notifications that IoT Hub can deliver to backend services.

:::zone pivot="azure-portal"

[!INCLUDE [iot-hub-configure-file-portal](../../includes/iot-hub-configure-file-upload-portal.md)]

:::zone-end

:::zone pivot="azure-cli"

[!INCLUDE [iot-hub-configure-file-cli](../../includes/iot-hub-configure-file-upload-cli.md)]

:::zone-end

:::zone pivot="powershell"

[!INCLUDE [iot-hub-configure-file-powershell](../../includes/iot-hub-configure-file-upload-powershell.md)]

:::zone-end


