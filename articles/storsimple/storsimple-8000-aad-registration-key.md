---
title: Azure AD authentication for StorSimple 8000 in Device Manager
description: Explains how to use Azure AD-based authentication for your service, generate new registration key, and perform manual registration of the devices.
author: alkohli
ms.service: storsimple
ms.topic: conceptual
ms.date: 08/18/2022
ms.author: alkohli

---
# Use Azure Active Directory (AD) authentication for your StorSimple

[!INCLUDE [storsimple-8000-eol-banner](../../includes/storsimple-8000-eol-banner-2.md)]

## Overview

The StorSimple Device Manager service runs in Microsoft Azure and connects to multiple StorSimple devices. To date, StorSimple Device Manager service has used an Access Control service (ACS) to authenticate the service to your StorSimple device. The ACS mechanism will be deprecated soon and replaced by an Azure Active Directory (Azure AD) authentication. For more information, go to the following announcements for ACS deprecation and use of Azure AD authentication.

- [The future of Azure ACS is Azure Active Directory](https://cloudblogs.microsoft.com/enterprisemobility/2015/02/12/the-future-of-azure-acs-is-azure-active-directory/)
- [Upcoming changes to the Microsoft Access Control Service](https://azure.microsoft.com/blog/acs-access-control-service-namespace-creation-restriction/)

This article describes the details of the Azure AD authentication and the associated new service registration key and modifications to the firewall rules as applicable to the StorSimple devices. The information contained in this article is applicable to StorSimple 8000 series devices only.

The Azure AD authentication occurs in StorSimple 8000 series device running Update 5 or later. Due to the introduction of the Azure AD authentication, changes occur in:

- URL patterns for firewall rules.
- Service registration key.

These changes are discussed in detail in the following sections.

## URL changes for Azure AD authentication

To ensure that the service uses Azure AD-based authentication, all the users must include the new authentication URLs in their firewall rules.

If using StorSimple 8000 series, ensure that the following URL is included in the firewall rules:

| URL pattern                         | Cloud | Component/Functionality         |
|------------------------------------|-------|----------------------------------|
| `https://login.windows.net`        | Azure Public |Azure AD authentication service      |
| `https://login.microsoftonline.us` | US Government |Azure AD authentication service      |

For a complete list of URL patterns for StorSimple 8000 series devices, go to [URL patterns for firewall rules](storsimple-8000-system-requirements.md#url-patterns-for-firewall-rules).

If the authentication URL is not included in the firewall rules beyond the deprecation date, and the device is running Update 5, the users see a URL alert. The users need to include the new authentication URL. If the device is running a version prior to Update 5, the users see a heartbeat alert. In each case, the StorSimple device cannot authenticate with the service and the service is not able to communicate with the device.

## Device version and authentication changes

If using a StorSimple 8000 series device, use the following table to determine what action you need to take based on the device software version you are running.

| If your device is running| Take the following action                                    |
|--------------------------|------------------------|
| Update 5.0 or earlier and the device is offline. | Transport Layer Security (TLS) 1.2 is being enforced by the StorSimple Device Manager service.<br>Install Update 5.1 (or higher):<ol><li>[Connect to Windows PowerShell on the StorSimple 8000 series device](storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console), or connect directly to the appliance via serial cable.</li><li>Use [Start-HcsUpdate](/powershell/module/hcs/start-hcsupdate?view=winserver2012r2-ps&preserve-view=true) to update the device. For steps, see [Install regular updates via Windows PowerShell](storsimple-update-device.md#to-install-regular-updates-via-windows-powershell-for-storsimple). This update is non-disruptive.</li><li>If `Start-HcsUpdate` doesn’t work because of firewall issues, [install Update 5.1 (or higher) via the hotfix method](storsimple-8000-install-update-51.md#install-update-51-as-a-hotfix).</li></ol> |
| Update 5 or later and the device is offline. <br> You see an alert that the URL is not approved.|<ol><li>Modify the firewall rules to include the authentication URL. See [authentication URLs](#url-changes-for-azure-ad-authentication).</li><li>[Get the Azure AD registration key from the service](#azure-ad-based-registration-keys).</li><li>[Connect to the Windows PowerShell interface of the StorSimple 8000 series device](storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console).</li><li>Use `Redo-DeviceRegistration` cmdlet to register the device through the Windows PowerShell. Supply the key you got in the previous step.</li></ol> |
| Update 4 or earlier and the device is offline. |<ol><li>Modify the firewall rules to include the authentication URL.</li><li>[Download Update 5 through catalog server](storsimple-8000-install-update-5.md#download-updates-for-your-device).</li><li>[Apply Update 5 through the hotfix method](storsimple-8000-install-update-5.md#install-update-5-as-a-hotfix).</li><li>[Get the Azure AD registration key from the service](#azure-ad-based-registration-keys).</li><li>[Connect to the Windows PowerShell interface of the StorSimple 8000 series device](storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console).</li><li>Use `Redo-DeviceRegistration` cmdlet to register the device through the Windows PowerShell. Supply the key you got in the previous step.</li></ol> |
| Update 4 or earlier and the device is online. |Modify the firewall rules to include the authentication URL.<br> Install Update 5 through the Azure portal. |
| Factory reset to a version before Update 5.      |The portal shows an Azure AD-based registration key while the device is running older software. Follow the steps in the preceding scenario for when the device is running Update 4 or earlier. |

## Azure AD-based registration keys

Beginning Update 5 for StorSimple 8000 series devices, new Azure AD-based registration keys are used. You use the registration keys to register your StorSimple Device Manager service with the device.

You cannot use the new Azure AD service registration keys if you are using a StorSimple 8000 series device running Update 4 or earlier (includes an older device being activated now).
In this scenario, you need to regenerate the service registration key. Once you regenerate the key, the new key is used for registering all the subsequent devices. The old key is no longer valid.

- The new Azure AD registration key expires after 3 days.
- The Azure AD registration keys work only with StorSimple 8000 series devices running Update 5 or later.
- The Azure AD registration keys are longer than the corresponding ACS registration keys.

Perform the following steps to generate an Azure AD service registration key.

#### To generate the Azure AD service registration key

1. In **StorSimple Device Manager**, go to **Management &gt;** **Keys**. You can also use the search bar to search for _Keys_.
    
2. Click **Generate key**.

    ![Click regenerate](./media/storsimple-8000-aad-registration-key/aad-click-generate-registration-key.png)

3. Copy the new key. The older key will no longer work.

    ![Confirm regenerate](./media/storsimple-8000-aad-registration-key/aad-registration-key2.png)

    > [!NOTE] 
    > If you are creating a StorSimple Cloud Appliance on the service registered to your StorSimple 8000 series device, do not generate a registration key while the creation is in progress. Wait for the creation to complete and then generate the registration key.

## Next steps

* Learn more about how to deploy [StorSimple 8000 series device](storsimple-8000-deployment-walkthrough-u2.md).
