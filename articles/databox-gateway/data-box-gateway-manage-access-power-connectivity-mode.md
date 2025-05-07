---
title: Azure Data Box Gateway device access, power, and connectivity mode
description: Describes how to manage access, power, and connectivity mode for the Azure Data Box Gateway device that helps transfer data to Azure
services: databox
author: stevenmatthew

ms.service: azure-data-box-gateway
ms.topic: how-to
ms.date: 10/14/2020
ms.author: shaas 
ms.custom:
---

# Manage access, power, and connectivity mode for your Azure Data Box Gateway

This article describes how to manage the access, power, and connectivity mode for your Azure Data Box Gateway. These operations are performed via the local web UI or the Azure portal. 

In this article, you learn how to:

> [!div class="checklist"]
>
> * Manage device access
> * Manage connectivity mode
> * Manage power

## Manage device access

The access to your Data Box Gateway device is controlled by the use of a device password. You can change the password via the local web UI. You can also reset the device password in the Azure portal.

### Change device password

Follow these steps in the local UI to change the device password.

1. In the local web UI, go to **Maintenance > Password change**.
2. Enter the current password and then the new password. The supplied password must be between 8 and 16 characters. The password must have 3 of the following characters: uppercase, lowercase, numeric, and special characters. Confirm the new password.

    ![Change password](media/data-box-gateway-manage-access-power-connectivity-mode/change-password-1.png)

3. Click **Change password**.
 
### Reset device password

The reset workflow does not require the user to recall the old password and is useful when the password is lost. This workflow is performed in the Azure portal.

1. In the Azure portal, go to **Overview > Reset admin password**.

    ![Reset password](media/data-box-gateway-manage-access-power-connectivity-mode/reset-password-1.png)

 
2. Enter the new password and then confirm it. The supplied password must be between 8 and 16 characters. The password must have 3 of the following characters: uppercase, lowercase, numeric, and special characters. Click **Reset**.

    ![Reset password 2](media/data-box-gateway-manage-access-power-connectivity-mode/reset-password-2.png)

## Manage resource access

To create your Azure Data Box Gateway, IoT Hub, and Azure Storage resource, you need permissions as a contributor or higher at a resource group level. You also need the corresponding resource providers to be registered. For any operations that involve activation key and credentials, permissions to Azure Active Directory Graph API are also required. These are described in the following sections.

### Manage Microsoft Graph API permissions

When generating the activation key for the device, or performing any operations that require credentials, you need permissions to Microsoft Graph API. The operations that need credentials could be:

-  Creating a share with an associated storage account.
-  Creating a user who can access the shares on the device.

You should have `User` access on the Active Directory tenant so you can `Read all directory objects`. A Guest user doesn't have permissions to `Read all directory objects`. If you're a guest, operations like generating an activation key, creating a share on your device, and creating a user will fail.

For more information on how to provide access to users to Microsoft Graph API, see [Overview of Microsoft Graph permissions](/graph/permissions-overview).

### Register resource providers

To provision a resource in Azure (in the Azure Resource Manager model), you need a resource provider that supports the creation of that resource. For example, to provision a virtual machine, you should have a 'Microsoft.Compute' resource provider available in the subscription.
 
Resource providers are registered on the level of the subscription. By default, any new Azure subscription is pre-registered with a list of commonly used resource providers. The resource provider for 'Microsoft.DataBoxEdge' is not included in this list.

You don't need to grant access permissions at the subscription level for users to be able to create resources like 'Microsoft.DataBoxEdge' within resource groups that they have owner rights on, as long as the resource providers for these resources are already registered.

Before you try to create any resource, make sure the resource provider is registered in the subscription. If the resource provider is not registered, you'll need to make sure that the user creating the new resource has enough rights to register the required resource provider at the subscription level. If you haven't done this as well, then you'll see the following error:

*The subscription \<Subscription name> doesn't have permissions to register the resource provider(s): Microsoft.DataBoxEdge.*


To get a list of registered resource providers in the current subscription, run the following command:

```PowerShell
Get-AzResourceProvider -ListAvailable |where {$_.Registrationstate -eq "Registered"}
```

For a Data Box Gateway device, `Microsoft.DataBoxEdge` should be registered. To register `Microsoft.DataBoxEdge`, the subscription admin should run the following command:

```PowerShell
Register-AzResourceProvider -ProviderNamespace Microsoft.DataBoxEdge
```

For more information on how to register a resource provider, see [Resolve errors for resource provider registration](../azure-resource-manager/templates/error-register-resource-provider.md).

## Manage connectivity mode

Apart from the default normal mode, your device can also run in partially disconnected or disconnected mode:

- **Partially disconnected** – In this mode, the device cannot upload any data to the shares. However, it can be managed via the Azure portal.

    This mode is typically used to minimize network bandwidth consumption when on a metered satellite network. Minimal network consumption may still occur for device monitoring operations.

- **Disconnected** – In this mode, the device is fully disconnected from the cloud, and both cloud uploads and downloads are disabled. The device can only be managed via the local web UI.

    This mode is typically used when you want to take your device offline.

To change the device mode, follow these steps:

1. In the local web UI of your device, go to **Configuration > Cloud settings**.
2. Disable the **Cloud upload and download**.
3. To run the device in partially disconnected mode, enable **Azure portal management**.

    ![Connectivity mode](media/data-box-gateway-manage-access-power-connectivity-mode/connectivity-mode-1.png)
 
4. To run the device in disconnected mode, disable **Azure portal management**. Now the device can only be managed via the local web UI.

    ![Connectivity mode 2](media/data-box-gateway-manage-access-power-connectivity-mode/connectivity-mode-2.png)

## Manage power

You can shut down or restart your virtual device using the local web UI. We recommend that before you restart the device, you take the shares offline on the host and then the device. This action minimizes any possibility of data corruption.

1. In the local web UI, go to **Maintenance > Power settings**.
2. Click **Shutdown** or **Restart** depending on what you intend to do.

    ![Power settings](media/data-box-gateway-manage-access-power-connectivity-mode/shut-down-restart-1.png)

3. When prompted for confirmation, click **Yes** to proceed.

> [!NOTE]
> If you shut down the virtual device, you will need to start the device through the hypervisor management.
