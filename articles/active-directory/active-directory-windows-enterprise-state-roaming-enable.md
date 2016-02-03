<properties
    pageTitle="Enable Enterprise State Roaming in Azure Active Directory | Microsoft Azure"
    description="Frequently asked questions about Enterprise State Roaming settings in Windows devices. Enterprise State Roaming provides users with a unified experience across their Windows devices and reduces the time needed for configuring a new device."
    services="active-directory"
    keywords="enterprise state roaming, windows cloud, how to enable enterprise state roaming"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor="curtand"/>

<tags
    ms.service="active-directory"  
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/04/2016"
	ms.author="femila"/>

 

# Enable Enterprise State Roaming in Azure Active Directory

Enterprise State Roaming is available to any organization with a Premium Azure Active Directory (Azure AD) subscription. For more details on how to get an Azure AD subscription, see the [Azure AD product page](https://azure.microsoft.com/services/active-directory).

When you enable Enterprise State Roaming, your organization will be automatically granted licenses for a free subscription to Azure Rights Management. This free subscription is limited to encrypting and decrypting enterprise settings data only; you must have a paid subscription to use the full capabilities of Azure Rights Management. 

After obtaining an Azure AD subscription, follow these steps to enable Enterprise State Roaming:
 
1. Login to the Azure classic portal. 
2. On the left, select **ACTIVE DIRECTORY**, and then select the directory for which you want to enable Enterprise State Roaming.
![](./media/active-directory-enterprise-state-roaming/active-directory-enterprise-state-roaming.png)	 
3. Go to the **Configure** tab on the top.
![](./media/active-directory-enterprise-state-roaming/active-directory-enterprise-state-roaming-configure.png)
4.	Scroll down the page and select **Users may Sync settings and enterprise app data**, and then click **Save**.
![](./media/active-directory-enterprise-state-roaming/active-directory-enterprise-state-roaming-select-all-sync-settings.png)

For a Windows 10 device to roam settings with the Enterprise State Roaming service, the device must authenticate using an Azure AD identity. For devices that are joined to Azure AD, the user’s primary login is the Azure AD identity, so no extra configuration is required. For devices that use a traditional on-premises Active Directory, the IT admin must connect the on-premises Active Directory to Azure AD using [Azure AD Connect](active-directory-aadconnect.md) and then must configure Group Policy to force client devices to automatically sync user data with Azure.

## Sync data storage
Enterprise State Roaming data is hosted in one or more [Azure regions](https://azure.microsoft.com/regions/) that best aligns with the country value set in the Azure AD instance. For example, customers who have their country value set to “France” will be hosted in one or more of the Azure regions within Europe, while customers who set their country value in Azure AD to “US” will have their data hosted in one or more of the Azure regions within the US. The country value is set as part of the Azure AD domain creation process and cannot be subsequently modified. 

If you need more details on data storage location, please file a ticket with [Azure support](https://azure.microsoft.com/support/options/).

## Manage Enterprise State Roaming
Azure AD tenant administrators can enable and disable Enterprise State Roaming in the Azure classic portal.
![](./media/active-directory-enterprise-state-roaming/active-directory-enterprise-state-roaming-manage.png)

Tenant administrators can also view a per-user sync status report, and they can limit settings sync to specific security groups.

##Data retention
Data synced to Azure via Enterprise State Roaming will be retained indefinitely unless a manual delete operation is performed or the data in question is determined to be stale.
 
- **Manually deleting data**: If the Azure AD admin wants to manually delete settings data, the admin can file a ticket with [Azure support](https://azure.microsoft.com/support/options/).
 
 - **User deletion**: When a user is deleted in Azure AD, the user account will be put into a disabled state for 30 days. After 30 days, the account will be deleted, and the associated settings data is subject to deletion. 
 - **Tenant (directory) deletion**: Deleting an entire directory in Azure AD is an immediate operation. All the settings data associated with that directory will then be subject to deletion. 
 - **Settings deletion**: If the Azure AD admin wants to immediately delete a specific user’s settings data, the admin can file a ticket with Azure support. 
- **Stale data**: Data that has not been accessed for one year (“the retention period”) will be treated as stale and may be deleted from Azure. The stale data may be a specific set of Windows/application settings or all settings for a user. For example: 
 - If no devices access a particular settings collection (e.g., an application is removed from the device, or a settings group such as “Theme” is disabled for all of a user’s devices), then that collection will become stale after the retention period and may be deleted. 
 - If a user has turned off settings sync on all his/her devices, then none of the settings data will be accessed, and all the settings data for that user will become stale and may be deleted after the retention period. 
 - If the Azure AD directory admin turns off Enterprise State Roaming for the entire directory, then all users in that directory will stop syncing settings, and all settings data for all users will become stale and may be deleted after the retention period. 

- **Recovering deleted data**: 
The data retention policy is not configurable. Once the data has been permanently deleted, it will not be recoverable. However, it’s important to note that the settings data will only be deleted from Azure, not the end-user device. If any device later reconnects to the Enterprise State Roaming service, the settings will again be synced and stored in Azure.

## Related topics
- [Enterprise State Roaming overview](active-directory-windows-enterprise-state-roaming-overview.md)
- [Settings and data roaming FAQ](active-directory-windows-enterprise-state-roaming-faqs.md)
- [Group Policy and MDM settings for settings sync](active-directory-windows-enterprise-state-roaming-group-policy-settings.md)
- [Windows 10 roaming settings reference](active-directory-windows-enterprise-state-roaming-windows-settings-reference.md)
