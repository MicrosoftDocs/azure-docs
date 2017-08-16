---
title: How to configure hybrid Azure Active Directory joined devices | Microsoft Docs
description: Learn how to configure hybrid Azure Active Directory joined devices.
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
ms.date: 08/15/2017
ms.author: markvi
ms.reviewer: jairoc

---
# Managing devices using the Azure portal

With device management in Azure Active Directory (Azure AD), you can ensure that your users are accessing your resources from devices that meet your standards for security and compliance. For more details, see [Introduction to device management in Azure Active Directory](device-management-introduction.md).

This topic provides you with information about managing your devices using the Azure portal.




## Device management tasks

This section provides you with information about common device management tasks.

**Search for a device** - You can search for devices using the display name as filter.



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








## Next steps

* [Introduction to device management in Azure Active Directory](device-management-introduction.md)



<!--Image references-->
[1]: ./media/active-directory-conditional-access-automatic-device-registration-setup/12.png
