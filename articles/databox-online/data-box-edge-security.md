---
title: Data Box Edge security | Microsoft Docs
description: Describes the security and privacy features that protect your Data Box Edge device, service, and data on premises and in the cloud.
services: Data Box Edge
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 04/15/2019
ms.author: alkohli
---
# Data Box Edge security and data protection

Security is a major concern when adopting a new technology, especially if the technology is used with confidential or proprietary data. Microsoft Azure Data Box Edge solution helps ensure that only authorized entities can view, modify, or delete your data.

This article describes the Data Box Edge security features that help protect each of the solution components and the data stored on them.

The Azure Data Box Edge solution consists of four main components that interact with each other:

- **Data Box Edge/ Data Box Gateway service hosted in Azure** – The management resource that you use to create the device order, configure the device, and then track the order to completion.
- **Data Box Edge device** – The transfer device that is shipped to you to import your on-premises data into Azure.
- **Clients/hosts connected to the device** – The clients in your infrastructure that connect to the Data Box Edge device and contain data that needs to be protected.
- **Cloud storage** – The location in the Azure cloud where data is stored. This location is typically the storage account linked to the Data Box Edge resource that you created.


## Data Box Edge/Data Box Gateway service protection

The Data Box Edge/Data Box Gateway service is a management service hosted in Microsoft Azure. The service is used to configure and manage the device.

- Access to the Data Box Edge/Data Box Gateway service requires your organization to have an Enterprise Agreement (EA) or a Cloud Solution Provider (CSP) subscription. For more information, go to [Sign up for an Azure subscription](https://azure.microsoft.com/resources/videos/sign-up-for-microsoft-azure/)!
- Because your management service is hosted in Azure, it is protected by the Azure security features. For more information about the security features provided by Microsoft Azure, go to the [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/security/).
- For SDK management operations, encryption key is available for your Data Box Edge/ Data Box Gateway resource under **Device properties**. You can view the encryption key only if you have permissions for the Resource Graph API.

## Data Box Edge device protection

The Data Box Edge device is an on-premises device that helps transform the data by processing it locally and then sending it to Azure. Your device:

- Needs an activation key to access the Data Box Edge/Data Box Gateway service.
- Is protected at all times by a device password.
- Is a locked-down device. The device BMC and BIOS are password-protected with limited user-access for the BIOS.
- Has secure boot enabled.
- Runs Windows Defender Device Guard. Device Guard allows you to run only trusted applications that you define in your code integrity policies.
- Has a key inside of the front cover that can be used to lock the device. We recommend that after you configure the device, open the cover. Locate the key, and then lock the cover to prevent any unauthorized access to data disks located in the front of the device.

### Protect the device via activation key

Only an authorized Data Box Edge device is allowed to join the Data Box Edge/Data Box Gateway service that you created in your Azure subscription. To authorize a device, you must use an activation key to activate the device with the Data Box Edge/Data Box Gateway service. For more information, go to [Get an activation key](data-box-edge-deploy-prep.md#get-the-activation-key).

The activation key that you use:

- Is an Azure Active Directory (AAD) based authentication key.
- Expires after three days.
- Isn't used after device activation.
 
After a device is activated, it uses tokens to communicate with Microsoft Azure.

### Protect the device via password

Passwords ensure that your data is accessible to authorized users only. Data Box Edge and Data Box Gateway devices boot up in a locked state.

You can:

- Connect to the local web UI of the device via a browser and then provide a password to sign into the device.
- Remotely connect to the device PowerShell interface over HTTP. Remote management is turned on by default. You can then provide the device password to sign into the device. For more information, go to [Connect remotely to your Data Box Edge device](data-box-edge-connect-powershell-interface.md#connect-to-the-powershell-interface).

Keep the following best practices in mind:

- The Data Box Edge service cannot retrieve existing passwords: it can only reset them via the Azure portal. We recommend that you store all passwords in a secure place so that you do not have to reset a password if it is forgotten. If you reset a password, be sure to notify all the users before you reset it.
- Use the local web UI to [change the password](data-box-gateway-manage-access-power-connectivity-mode.md#manage-device-access). If you change the password, be sure to notify all remote access users so that they do not experience a sign in failure.
- You can access the Windows PowerShell interface of your device remotely over HTTP. As a security best practice, you should use HTTP only on trusted networks.
- Ensure that device passwords are strong and well-protected. Follow the [Password best practices](https://docs.microsoft.com/azure/security/azure-security-identity-management-best-practices#enable-password-management).

## Protect the data

This section describes the Data Box Edge security features that protect the data in transit and stored data.

### Protect data at rest

For the data-at-rest:

- For the data-at-rest, Data Box Edge uses BitLocker XTS AES-256 encryption to protect the local data.
- For the data that resides in shares, the access to the shares is restricted.

    - For SMB clients that access the share data, they need user credentials associated with the share. These credentials are defined at the time of share creation.
    - For NFS clients that access the shares, the IP addresses of the clients need to be added at the time of share creation.


### Protect data in flight

For the data-in-flight:

- For data that goes between the device and Azure, standard TLS 1.2 is used. There is no fallback to TLS 1.1 and earlier. The agent communication will be blocked if TLS 1.2 is not supported. The TLS 1.2 is also required for portal and SDK management operations.
- When the clients access your device through the local web UI in a browser, standard TLS 1.2 is used as the default secure protocol.

    - The best practice is to configure your browser to use TLS 1.2.
    - If the browser does not support TLS 1.2, you can use TLS 1.1 or TLS 1.0.
- To protect the data when you copy it from your data servers, we recommend that you use SMB 3.0 with encryption.

### Protect data via storage accounts

Your device is associated with a storage account that is used as a destination for your data in Azure. Access to the storage account is controlled by the subscription and two 512-bit storage access keys associated with that storage account.

One of the keys is used for authentication when the Data Box Edge device accesses the storage account. The other key is held in reserve, allowing you to rotate the keys periodically.

For security reasons, many datacenters require key rotation. We recommend that you follow these best practices for key rotation:

- Your storage account key is similar to the root password for your storage account. Carefully protect your account key. Don't distribute the password to other users, hard code it, or save it anywhere in plaintext that is accessible to others.
- [Regenerate your account key](../storage/common/storage-account-manage.md#regenerate-access-keys) using the Azure portal if you believe it may have been compromised.
- Rotate and then [Sync your storage account keys](data-box-gateway-manage-shares.md#sync-storage-keys) regularly to help ensure that your storage account is not accessed by unauthorized users.
- Periodically, your Azure administrator should change or regenerate the primary or secondary key by using the Storage section of the Azure portal to directly access the storage account.


## Manage personal information

The Data Box Edge/ Data Box Gateway service collects personal information in the following key instances:

- **Order details** – Once the order is created, the shipping address, email, contact information of users is stored in the Azure portal. The information saved includes:
  - Contact name
  - Phone number
  - Email
  - Street address
  - City
  - Zip/postal code
  - State
  - Country/Province/Region
  - Shipping tracking number

    The order details are encrypted and stored in the service. The service retains the information until you delete the resource or order explicitly. Moreover, the deletion of resource and the corresponding order is blocked from the time the device is shipped until the device returns to Microsoft.

- **Shipping address** – After the order is placed, Data Box service provides the shipping address to third-party carriers such as UPS.

- **Share users** - Users on your device can also access the data residing on the shares. A list of users who can access the share data is displayed and can be viewed. This list is also deleted when the shares are deleted. To view the list of users who can access or delete a share, follow the steps in [Manage shares on the Data Box Edge](data-box-gateway-manage-shares.md).

For more information, review the Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trustcenter).

## Next steps

[Deploy your Data Box Edge device](data-box-edge-deploy-prep.md).

