---
title: Azure Data Box Edge security | Microsoft Docs
description: Describes the security and privacy features that protect your Azure Data Box Edge device, service, and data on premises and in the cloud.
services: Data Box Edge
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 04/15/2019
ms.author: alkohli
---
# Azure Data Box Edge security and data protection

Security is a major concern when adopting a new technology, especially if the technology is used with confidential or proprietary data. Microsoft Azure Data Box Edge solution helps ensure that only authorized entities can view, modify, or delete your data.

This article describes the Data Box Edge security features that help protect each of the solution components and the data stored on them.

The Azure Data Box Edge solution consists of four main components that interact with each other:

- **Data Box Edge service hosted in Azure** – The management resource that you use to create the device order, configure the device, and then track the order to completion.
- **Data Box Edge device** – The transfer device that is shipped to you to import your on-premises data into Azure.
- **Clients/hosts connected to the device** – The clients in your infrastructure that connect to the Data Box Edge device and contain data that needs to be protected.
- **Cloud storage** – The location in the Azure cloud where data is stored. This location is typically the storage account linked to the Data Box Edge resource that you created.

## Data Box Edge service protection

The Data Box Edge service is a management service hosted in Microsoft Azure. The service is used to configure and manage the device.

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-service-protection.md)]

## Data Box Edge device protection

The Data Box Edge device is an on-premises device that helps transform the data by processing it locally and then sending it to Azure. Your device:

- Needs an activation key to access the Data Box Edge service.
- Is protected at all times by a device password.
- Is a locked-down device. The device BMC and BIOS are password-protected with limited user-access for the BIOS.
- Has secure boot enabled.
- Runs Windows Defender Device Guard. Device Guard allows you to run only trusted applications that you define in your code integrity policies.

### Protect the device via activation key

Only an authorized Data Box Edge device is allowed to join the Data Box Edge service that you created in your Azure subscription. To authorize a device, you must use an activation key to activate the device with the Data Box Edge service.

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-activation-key.md)]

For more information, go to [Get an activation key](data-box-edge-deploy-prep.md#get-the-activation-key).

### Protect the device via password

Passwords ensure that your data is accessible to authorized users only. Data Box Edge devices boot up in a locked state.

You can:

- Connect to the local web UI of the device via a browser and then provide a password to sign into the device.
- Remotely connect to the device PowerShell interface over HTTP. Remote management is turned on by default. You can then provide the device password to sign into the device. For more information, go to [Connect remotely to your Data Box Edge device](data-box-edge-connect-powershell-interface.md#connect-to-the-powershell-interface).

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-password-best-practices.md)]
- Use the local web UI to [change the password](data-box-edge-manage-access-power-connectivity-mode.md#manage-device-access). If you change the password, be sure to notify all remote access users so that they do not experience a sign in failure.

## Protect the data

This section describes the Data Box Edge security features that protect the data in transit and stored data.

### Protect data at rest

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-data-rest.md)]

### Protect data in flight

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-data-flight.md)]

### Protect data via storage accounts

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-protect-data-storage-accounts.md)]
- Rotate and then [Sync your storage account keys](data-box-edge-manage-shares.md#sync-storage-keys) regularly to help ensure that your storage account is not accessed by unauthorized users.

## Manage personal information

The Data Box Edge service collects personal information in the following key instances:

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-manage-personal-data.md)]

To view the list of users who can access or delete a share, follow the steps in [Manage shares on the Data Box Edge](data-box-edge-manage-shares.md).

For more information, review the Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trustcenter).

## Next steps

[Deploy your Data Box Edge device](data-box-edge-deploy-prep.md).
