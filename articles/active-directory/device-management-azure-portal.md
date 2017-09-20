---
title: Managing devices using the Azure portal - preview | Microsoft Docs
description: Learn how to use the Azure portal to manage devices.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/24/2017
ms.author: markvi
ms.reviewer: jairoc

---
# Managing devices using the Azure portal - preview

>[!NOTE]
>This capability currently is in public preview. Be prepared to revert or remove any changes. The feature is available in any Azure Active Directory (Azure AD) subscription during public preview. However, when the feature becomes generally available, some aspects of the feature might require an Azure Active Directory premium subscription.


With device management in Azure Active Directory (Azure AD), you can ensure that your users are accessing your resources from devices that meet your standards for security and compliance. 

This topic:

- Assumes that you are familiar with the [introduction to device management in Azure Active Directory](device-management-introduction.md)

- Provides you with information about managing your devices using the Azure portal


To manage devices in the Azure portal, you need to click **Devices** in the **Manage** section of the the **Azure Active Directory** blade.

![Manage an Intune device](./media/device-management-azure-portal/11.png)




## Configure device settings

To manage your devices using the Azure portal, they need to be either registered or joined to Azure AD. As an administrator, you can fine-tune the process of registering and joining devices by configuring the device settings.

![Manage an Intune device](./media/device-management-azure-portal/22.png)


The device settings blade enables you to configure:

- **Users may join devices to Azure AD** - This settings enables you to select the users who can join devices to Azure AD. The default is **All**.

- **Additional local administrators on Azure AD joined devices** - You can select the users that are granted local administrator rights on a device. Users added here are added to the *Device Administrators* role in Azure AD. Global administrators in Azure AD and device owners are granted local administrator rights by default. 
This option is a premium edition capability available through products such as Azure AD Premium or the Enterprise Mobility Suite (EMS). 

- **Users may register their devices with Azure AD** - You need to configure this setting to allow devices to be registered with Azure AD. If you select **None**, devices are not allowed to register when they are not Azure AD joined or hybrid Azure AD joined. Enrollment with Microsoft Intune or Mobile Device Management (MDM) for Office 365 requires registration. If you have configured either of these services, **ALL** is selected and **NONE** is not available..

- **Require Multi-Factor Auth to join devices** - You can choose whether users are required to provide a second authentication factor to join their device to Azure AD. The default is **No**. We recommend requiring multi-factor authentication when registering a device. Before you enable multi-factor authentication for this service, you must ensure that multi-factor authentication is configured for the users that register their devices. For more information on different Azure multi-factor authentication services, see [getting started with Azure multi-factor authentication](../multi-factor-authentication/multi-factor-authentication-get-started.md). 

- **Maximum number of devices** - This setting enables you to select the maximum number of devices that a user can have in Azure AD. If a user reaches this quota, they are not be able to add additional devices until one or more of the existing devices are removed. The device quote is counted for all devices that are either Azure AD joined or Azure AD registered today. The default value is **20**.

- **Users may sync settings and app data across devices** - By default, this setting is set to **NONE**. Selecting specific users or groups or ALL allows the user’s settings and app data to sync across their Windows 10 devices. Learn more on how sync works in Windows 10.
This option is a premium capability available through products such as Azure AD Premium or the Enterprise Mobility Suite (EMS).
 
    ![Manage an Intune device](./media/device-management-azure-portal/21.png)




## Locate devices

As an administrator, in the Azure portal, you have two options to locate registered and joined devices:

- **All devices** in the **Manage** section of the **Devices** blade  

    ![All devices](./media/device-management-azure-portal/41.png)


- **Devices** in the **Manage** section of a **User** blade
 
    ![All devices](./media/device-management-azure-portal/43.png)



With both options, you can get to a view that:


- Enables you to search for devices using the display name as filter.

- Provides you with detailed overview of registered and joined devices

- Enables you to perform common device management tasks
   

![All devices](./media/device-management-azure-portal/51.png)


## Device management tasks

As an administrator, you can manage the registered or joined devices. This section provides you with information about common device management tasks.


**Manage an Intune device** - If you are an Intune administrator, you can manage devices marked as **Microsoft Intune**. An administrator can see additional device 

![Manage an Intune device](./media/device-management-azure-portal/31.png)


**Enable / disable an Azure AD device**

To enable or disable a device, you need to be a global administrator in Azure  AD. Disabling a device prevents a device from accessing your Azure AD resources.  To disable the device, you can either click *…* click the device for additional details.

 
![Manage an Intune device](./media/device-management-azure-portal/33.png)

Disabling a device changes the state in the **ENABLED** column to **No**.

![Disable a device](./media/device-management-azure-portal/32.png)


**Delete an Azure AD device** - To delete a device, you need to be a global administrator in Azure AD.  
Deleting a device:
 
- Prevents a device from accessing your Azure AD resources 

- Removes all details that are attached to the device, for example, BitLocker keys for Windows devices  

- Represents a non-recoverable activity and is not recommended unless it is required

If a device is managed by another management authority (e.g. Microsoft Intune), please make sure that the device has been wiped / retired before deleting the device in Azure AD.

You can either select “…” to delete the device or click on the device for additional details
 
![Delete a device](./media/device-management-azure-portal/34.png)


**View or copy device ID** - You can use a device ID to verify the device ID details on the device or using PowerShell during troubleshooting. To access the copy option, click the device.

![View a device ID](./media/device-management-azure-portal/35.png)
  

**View or copy BitLocker keys** - If you are an administrator, you can view and copy the BitLocker keys to help users to recover their encrypted drive. These keys are only available for Windows devices that are encrypted and have their keys stored in Azure AD. You can copy these keys when accessing details of the device.
 
![View BitLocker keys](./media/device-management-azure-portal/36.png)



## Audit logs


The device activities are available through the activity logs. This includes activities triggered by the device registration service or by the user:

- Device creation and adding owners/users on the device

- Changes to device settings

- Device operations such as deleting or updating a device
 
Your entry point to the auditing data is **Audit logs** in the **Activity** section of the **Devices* blade.

![Audit logs](./media/device-management-azure-portal/61.png)


An audit log has a default list view that shows:

- the date and time of the occurrence

- the targets

- the initiator / actor (who) of an activity

- the activity (what)

![Audit logs](./media/device-management-azure-portal/63.png)

You can customize the list view by clicking **Columns** in the toolbar.
 
![Audit logs](./media/device-management-azure-portal/64.png)


To narrow down the reported data to a level that works for you, you can filter the audit data using the following fields:

- Catergory
- Activity resource type
- Activity
- Date range
- Target
- Initiated By (Actor)

In addition to the filters, you can search for specific entries.

![Audit logs](./media/device-management-azure-portal/65.png)

## Next steps

* [Introduction to device management in Azure Active Directory](device-management-introduction.md)



