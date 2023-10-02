---
title: Azure Stack Edge Pro FPGA security
description: Describes the security and privacy features that protect your Azure Stack Edge Pro FPGA device, service, and data on-premises and in the cloud.
services: Data Box Edge
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 08/21/2019
ms.author: alkohli
---
# Azure Stack Edge security and data protection

Security is a major concern when you're adopting a new technology, especially if the technology is used with confidential or proprietary data. Azure Stack Edge helps you ensure that only authorized entities can view, modify, or delete your data.

This article describes the Azure Stack Edge security features that help protect each of the solution components and the data stored in them.

Azure Stack Edge consists of four main components that interact with each other:

- **Azure Stack Edge service, hosted in Azure**. The management resource that you use to create the device order, configure the device, and then track the order to completion.
- **Azure Stack Edge Pro FPGA device**. The transfer device that's shipped to you so you can import your on-premises data into Azure.
- **Clients/hosts connected to the device**. The clients in your infrastructure that connect to the Azure Stack Edge Pro FPGA device and contain data that needs to be protected.
- **Cloud storage**. The location in the Azure cloud platform where data is stored. This location is typically the storage account linked to the Azure Stack Edge resource that you create.

## Azure Stack Edge service protection

The Azure Stack Edge service is a management service that's hosted in Azure. The service is used to configure and manage the device.

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-service-protection.md)]

## Azure Stack Edge device protection

The Azure Stack Edge device is an on-premises device that helps transform your data by processing it locally and then sending it to Azure. Your device:

- Needs an activation key to access the Azure Stack Edge service.
- Is protected at all times by a device password.
- Is a locked-down device. The device BMC and BIOS are password-protected. The BIOS is protected by limited user-access.
- Has secure boot enabled.
- Runs Windows Defender Device Guard. Device Guard lets you run only trusted applications that you define in your code-integrity policies.

### Protect the device via activation key

Only an authorized Azure Stack Edge device is allowed to join the Azure Stack Edge service that you create in your Azure subscription. To authorize a device, you need to use an activation key to activate the device with the Azure Stack Edge service.

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-activation-key.md)]

For more information, see [Get an activation key](azure-stack-edge-deploy-prep.md#get-the-activation-key).

### Protect the device via password

Passwords ensure that only authorized users can access your data. Azure Stack Edge devices boot up in a locked state.

You can:

- Connect to the local web UI of the device via a browser and then provide a password to sign in to the device.
- Remotely connect to the device PowerShell interface over HTTP. Remote management is turned on by default. You can then provide the device password to sign in to the device. For more information, see [Connect remotely to your Azure Stack Edge Pro FPGA device](azure-stack-edge-connect-powershell-interface.md#connect-to-the-powershell-interface).

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-password-best-practices.md)]
- Use the local web UI to [change the password](azure-stack-edge-manage-access-power-connectivity-mode.md#manage-device-access). If you change the password, be sure to notify all remote access users so they don't have problems signing in.

## Protect your data

This section describes the Azure Stack Edge Pro FPGA security features that protect in-transit and stored data.

### Protect data at rest

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-data-rest.md)]
- BitLocker XTS-AES 256-bit encryption is used to protect local data.


### Protect data in flight

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-data-flight.md)]

### Protect data via storage accounts

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-protect-data-storage-accounts.md)]
- Rotate and then [sync your storage account keys](azure-stack-edge-manage-shares.md#sync-storage-keys) regularly to help protect your storage account from unauthorized users.

## Manage personal information

The Azure Stack Edge service collects personal information in the following scenarios:

[!INCLUDE [data-box-edge-gateway-data-rest](../../includes/data-box-edge-gateway-manage-personal-data.md)]

To view the list of users who can access or delete a share, follow the steps in [Manage shares on the Azure Stack Edge Pro FPGA](azure-stack-edge-manage-shares.md).

For more information, review the Microsoft privacy policy on the [Trust Center](https://www.microsoft.com/trust-center).

## Next steps

[Deploy your Azure Stack Edge Pro FPGA device](azure-stack-edge-deploy-prep.md)
