---
title: Azure Data Box Gateway security | Microsoft Docs
description: Describes the security and privacy features that protect your Azure Data Box Gateway virtual device, service, and data, on-premises and in the cloud.
services: databox
author: alkohli

ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 04/16/2019
ms.author: alkohli
---

# Azure Data Box Gateway security and data protection

Security is a major concern when you're adopting a new technology, especially if the technology is used with confidential or proprietary data. Azure Data Box Gateway helps you ensure that only authorized entities can view, modify, or delete your data.

This article describes the Azure Data Box Gateway security features that help protect each of the solution components and the data stored in them.

The Data Box Gateway solution consists of four main components that interact with each other:

- **Data Box Gateway service, hosted in Azure**. The management resource that you use to create the device order, configure the device, and then track the order to completion.
- **Data Box Gateway device**. The virtual device that you provision in the hypervisor of the system that you provide. This virtual device is used to import your on-premises data into Azure.
- **Clients/hosts connected to the device**. The clients in your infrastructure that connect to the Data Box Gateway device and contain data that needs to be protected.
- **Cloud storage**. The location in the Azure cloud platform where data is stored. This location is typically the storage account linked to the Data Box Gateway resource that you create.


## Data Box Gateway service protection

The Data Box Gateway service is a management service that's hosted in Azure. The service is used to configure and manage the device.

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-service-protection.md)]

## Data Box Gateway device protection

The Data Box Gateway device is a virtual device that's provisioned in the hypervisor of an on-premises system that you provide. The device helps send data to Azure. Your device:

- Needs an activation key to access the Data Box Edge/Data Box Gateway service.
- Is protected at all times by a device password.
<!---  secure boot enabled.
- Runs Windows Defender Device Guard. Device Guard allows you to run only trusted applications that you define in your code integrity policies.-->

### Protect the device via activation key

Only an authorized Data Box Gateway device is allowed to join the Data Box Gateway service that you create in your Azure subscription. To authorize a device, you need to use an activation key to activate the device with the Data Box Gateway service.

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-activation-key.md)]

For more information, see [Get an activation key](data-box-gateway-deploy-prep.md#get-the-activation-key).

### Protect the device via password

Passwords ensure that only authorized users can access your data. Data Box Gateway devices boot up in a locked state.

You can:

- Connect to the local web UI of the device via a browser and then provide a password to sign in to the device.
- Remotely connect to the device's PowerShell interface over HTTP. Remote management is turned on by default. You can then provide the device password to sign in to the device. For more information, see [Connect remotely to your Data Box Gateway device](data-box-gateway-connect-powershell-interface.md#connect-to-the-powershell-interface).

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-password-best-practices.md)]
- Use the local web UI to [change the password](data-box-gateway-manage-access-power-connectivity-mode.md#manage-device-access). If you change the password, be sure to notify all remote access users so that they don't have problems signing in.


## Protect your data

This section describes the Data Box Gateway security features that protect in-transit and stored data.

### Protect data at rest

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-data-rest.md)]

### Protect data in flight

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-data-flight.md)]

### Protect data via storage accounts

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-protect-data-storage-accounts.md)]
- Rotate and then [sync your storage account keys](data-box-gateway-manage-shares.md#sync-storage-keys) regularly to help protect your storage account from unauthorized users.

## Manage personal information

The Data Box Gateway service collects personal information in the following scenarios:

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-manage-personal-data.md)]

To view the list of users who can access or delete a share, follow the steps in [Manage shares on the Data Box Gateway](data-box-gateway-manage-shares.md).

For more information, review the Microsoft privacy policy on the [Trust Center](https://www.microsoft.com/trustcenter).

## Next steps

[Deploy your Data Box Gateway device](data-box-gateway-deploy-prep.md)
