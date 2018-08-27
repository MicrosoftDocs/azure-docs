---
title: How To: Manage stale devices in Azure AD | Microsoft Docs
description: Learn how device management can help you to get control over the devices that are accessing resources in your environment.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.component: devices
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 08/27/2018
ms.author: markvi
ms.reviewer: jairoc
#Customer intent: As a IT admin, I want to learn how to bring the devices that are accessing my resources under control, so that I can ensure that that my users are accessing my resources from devices that meet my standards for security and compliance.

---
# How To: Manage stale devices in Azure AD



Manage your device lifecycle in Azure AD

Howdy folks, 
I am super excited to announce that you now have a way to manage your stale devices registered in Azure AD. The device property “ApproximateLastLogonTimestamp” (activity timestamp) on all your devices is now updated to help remove the stale devices in your directory. 


## How the activity timestamp works

Azure AD uses a property called **ApproximateLastLogonTimestamp** (activity timestamp) to track sign-in activities of your devices. An evaluation of the activity timestamp is triggered by:

 
- A user using their device to access Azure AD resources such as Office 365 using device-based or app-based conditional access.

- Windows 10 devices that are either Azure AD joined or hybrid Azure AD joined when they are active on the network. 

- Intune managed devices that have checked in to the service






If the delta between the existing value of the activity timestamp and the current value is more than 14 days, the existing value is repaced with the new vlaue.
    

When a device signs-in to Azure AD, Azure AD uses Each sign-in activity of a device to Azure AD will be used to update the timestamp.





•	All device authentication sign-in activity to Azure AD will be used to update the timestamp.
•	The timestamp will be updated only when the existing value is older than 14 days using the most recent device sign-in activity.
•	This attribute can be used to filter and find devices using the timestamp. 





Learn about the type sign-ins that are used to update the activity
•	A user using their device to access Azure AD resources such as Office 365 using device-based or app-based conditional access.
•	Any Windows 10 devices that are Azure AD joined or Hybrid Azure AD joined that are active on the network. 
•	Intune managed devices that have checked in to the service
Viewing the activity timestamp
Viewing the Activity column inside the “Devices” blade on the Azure AD portal
  
Viewing the ApproximateLastLogonTimestamp using PowerShell with the Get-MsolDevice cmdlet 
  
Planning your lifecycle
•	Create your company lifecycle policy for disable/delete periods.
o	Account for the 14 days
o	Account for users going on vacation for a longer period than your lifecycle
•	Disable your devices first before any deletes.
•	Delete your devices only after they have been disabled for your defined period
o	Deletion in Azure AD is permanent
•	Review cleanup guidance
Cleanup Guidance
Before you get started
•	On-premises Windows 10 devices must be disabled/deleted on your AD domain first. AAD connect configured with Hybrid Azure AD joined devices will sync. 
•	On-premises Windows 7/8 devices are not disabled/deleted with AAD connect. Do not delete them only based on activity.
•	Do not delete System managed devices. These are generally devices such as auto-pilot once deleted cannot be re-provisioned. Review the new Gget-MmsolDevice cmdlet which excludes these devices by default. that are waiting to join.
•	Only certain roles are allowed to disable/delete the devices. The following roles are:
o	Global Administrator
o	Cloud Device Administrator (New role available now!)
o	Intune Service Administrator
	Hybrid Azure AD Joined	Azure AD Joined	Azure AD registered
Windows 10	1.	Follow your on-premises stale device management
2.	AAD Connect will sync if configuredDisable->Delete
in Azure AD	1.	Use Activity to Disable->Delete in Azure AD	1.	Use Activity to Disable -> Delete in Azure AD
*On-premises AD domain-joined computers must by Hybrid Azure AD joined
Windows 10 w/ Intune or other MDM application	1.	Retire in Intune or your MDM platform first
2.	Follow steps for Windows 10 Hybrid Azure AD Joined	1.	Retire in Intune or your MDM platform first
2.	Follow steps for Windows 10 Azure AD Joined	1.	Retire in Intune or your MDM platform first
2.	Follow steps for Windows 10 Azure AD registered
Windows 7/8	1.	Follow your on-premises stale device management
2.	Disable->Delete in Azure AD (Look for all devices w/name)
Not applicable	Not applicable
Mobile	Not applicable	1.	Use Activity to Disable->Delete in Azure AD
*Available only for W10 mobile	1.	Use Activity to Disable->Delete in Azure AD
Mobile w/Intune or other MDM application	Not applicable	1.	Retire in Intune or your MDM platform first
2.	Use Activity to Disable->Delete in Azure AD
*Available only for W10 mobile	1.	Retire in Intune or your MDM platform first
2.	Follow steps for Mobile Azure AD registered

Using PowerShell v1
Note: You must use the latest v1 PowerShell to use the timestamp filter, filter out system managed devices such as auto-pilot.
Two new options have been introduced with updates to the v1 MSOnline PowerShell (version 1.1.183.17) that can be found here.
-LogonTimeBefore 
Used for filtering based on the timestamp
-IncludeSystemManagedDevices
Used to find all devices that include system managed such as Auto-pilot.

Get started with your device lifecycle 
Steps you will normally perform
1.	Connect to service with PowerShell
2.	Get the list of devices using the timestamp
3.	Disable the device
4.	Remove the device
Note: if you have a lot of devices in your directory, use the timestamp filter to scope the devices down to a smaller number first
1.	Connect to Azure AD
Connect-MsolService
2.	Get all devices
Sample cmdlet to output devices to a csv file for review
Get-MsolDevice -all | select-object -Property Enabled, DeviceId, DisplayName, DeviceTrustType, Approxi
mateLastLogonTimestamp | export-csv devicelist-summary.csv
3.	Get all devices with a timestamp older than specific date
Sample cmdlet to output devices using a timestamp filter to a csv file for review
$dt = [datetime]’2017/01/01’
Get-MsolDevice -all -LogonTimeBefore $dt | select-object -Property Enabled, DeviceId, DisplayName, DeviceTrustType, ApproximateLastLogonTimestamp | export-csv devicelist-olderthan-Jan-1-2017-summary.csv
4.	Use disable/remove PowerShell cmdlets on the devices identified 
Ddisable-MmsolDdevice 
Reremove-MmsolDdevice 

Common questions
Why is the timestamp not updated more frequently?
This timestamp is being updated to support device lifecycle scenarios. This is not an audit. Use the sign-in audit logs for more frequent updates on the device.
How do I know all the type of devices joined?
Learn more of the different types of devices using Introduction to Ddevices in Azure AD overview.
What will happen if you disable a device?
Any authentication where a device is being used to authenticate to Azure AD will be denied. Some common examples are:
•	On Azure AD joined devices, a user will not be able to log in to the device. 
•	On mobile devices, a user will not be able to access Azure AD resources such as Office 365. 
•	On Hybrid Azure AD joined devices, a user may be able to log in to the local domain but will not be able to access Azure AD resources such as Office 365.

Tell us how this feature works for you.

Shantaram Punukollu
Azure AD Identity PM











## Next steps

- To get an overview of how to manage device in the Azure portal, see [managing devices using the Azure portal](device-management-azure-portal.md)

- To learn more about device-based conditional access, see [configure Azure Active Directory device-based conditional access policies](../conditional-access/require-managed-devices.md).

- To setup:
    - Azure Active Directory registered Windows 10 devices, see [how to configure Azure Active Directory registered Windows 10 devices](../user-help/device-management-azuread-registered-devices-windows10-setup.md)
    - Azure Active Directory joined devices, see [how to configure Azure Active Directory joined devices](../user-help/device-management-azuread-joined-devices-setup.md)
    - Hybrid Azure AD joined devices, see [How to plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md).


