---
title: How to manage stale devices in Microsoft Entra ID
description: Learn how to remove stale devices from your database of registered devices in Microsoft Entra ID.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 09/27/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: spunukol

ms.collection: M365-identity-device-management
#Customer intent: As an IT admin, I want to understand how I can get rid of stale devices, so that I can I can cleanup my device registration data.
---
# How To: Manage stale devices in Microsoft Entra ID

Ideally, to complete the lifecycle, registered devices should be unregistered when they aren't needed anymore. Because of lost, stolen, broken devices, or OS reinstallations you'll typically have some stale devices in your environment. As an IT admin, you probably want a method to remove stale devices, so that you can focus your resources on managing devices that actually require management.

In this article, you learn how to efficiently manage stale devices in your environment.

## What is a stale device?

A stale device is a device that has been registered with Microsoft Entra ID but hasn't been used to access any cloud apps for a specific timeframe. Stale devices have an impact on your ability to manage and support your devices and users in the tenant because: 

- Duplicate devices can make it difficult for your helpdesk staff to identify which device is currently active.
- An increased number of devices creates unnecessary device writebacks increasing the time for Microsoft Entra Connect syncs.
- As a general hygiene and to meet compliance, you may want to have a clean state of devices. 

Stale devices in Microsoft Entra ID can interfere with the general lifecycle policies for devices in your organization.

## Detect stale devices

Because a stale device is defined as a registered device that hasn't been used to access any cloud apps for a specific timeframe, detecting stale devices requires a timestamp-related property. In Microsoft Entra ID, this property is called **ApproximateLastLogonTimestamp** or **activity timestamp**. If the delta between now and the value of the **activity timestamp** exceeds the timeframe you've defined for active devices, a device is considered to be stale. This **activity timestamp** is now in public preview.

## How is the value of the activity timestamp managed?  

The evaluation of the activity timestamp is triggered by an authentication attempt of a device. Microsoft Entra ID evaluates the activity timestamp when:

- A Conditional Access policies requiring [managed devices](../conditional-access/concept-conditional-access-grant.md) or [approved client apps](../conditional-access/howto-policy-approved-app-or-app-protection.md) has been triggered.
- Windows 10 or newer devices that are either Microsoft Entra joined or Microsoft Entra hybrid joined are active on the network. 
- Intune managed devices have checked in to the service.

If the delta between the existing value of the activity timestamp and the current value is more than 14 days (+/-5 day variance), the existing value is replaced with the new value.

## How do I get the activity timestamp?

You have two options to retrieve the value of the activity timestamp:

- The **Activity** column on the all devices page.

    :::image type="content" source="./media/manage-stale-devices/01.png" alt-text="Screenshot listing the name, owner, and other information of devices. One column lists the activity time stamp." border="false":::

- The [Get-AzureADDevice](/powershell/module/azuread/get-azureaddevice) cmdlet.

    :::image type="content" source="./media/manage-stale-devices/02.png" alt-text="Screenshot showing command-line output. One line is highlighted and lists a time stamp for the ApproximateLastLogonTimeStamp value." border="false":::

## Plan the cleanup of your stale devices

To efficiently clean up stale devices in your environment, you should define a related policy. This policy helps you to ensure that you capture all considerations that are related to stale devices. The following sections provide you with examples for common policy considerations. 

> [!CAUTION]
> If your organization uses BitLocker drive encryption, you should ensure that BitLocker recovery keys are either backed up or no longer needed before deleting devices. Failure to do this may cause loss of data.

### Cleanup account

To update a device in Microsoft Entra ID, you need an account that has one of the following roles assigned:

- Global Administrator
- Cloud Device Administrator
- Intune Service Administrator

In your cleanup policy, select accounts that have the required roles assigned. 

### Timeframe

Define a timeframe that is your indicator for a stale device. When defining your timeframe, factor the window noted for updating the activity timestamp into your value. For example, you shouldn't consider a timestamp that is younger than 21 days (includes variance) as an indicator for a stale device. There are scenarios that can make a device look like stale while it isn't. For example, the owner of the affected device can be on vacation or on a sick leave that exceeds your timeframe for stale devices.

### Disable devices

It isn't advisable to immediately delete a device that appears to be stale because you can't undo a deletion if there's a false positive. As a best practice, disable a device for a grace period before deleting it. In your policy, define a timeframe to disable a device before deleting it.

### MDM-controlled devices

If your device is under control of Intune or any other MDM solution, retire the device in the management system before disabling or deleting it. For more information, see the article [Remove devices by using wipe, retire, or manually unenrolling the device](/mem/intune/remote-actions/devices-wipe).

### System-managed devices

Don't delete system-managed devices. These devices are generally devices such as Autopilot. Once deleted, these devices can't be reprovisioned.

<a name='hybrid-azure-ad-joined-devices'></a>

### Microsoft Entra hybrid joined devices

Your Microsoft Entra hybrid joined devices should follow your policies for on-premises stale device management. 

To clean up Microsoft Entra ID:

- **Windows 10 or newer devices** - Disable or delete Windows 10 or newer devices in your on-premises AD, and let Microsoft Entra Connect synchronize the changed device status to Microsoft Entra ID.
- **Windows 7/8** - Disable or delete Windows 7/8 devices in your on-premises AD first. You can't use Microsoft Entra Connect to disable or delete Windows 7/8 devices in Microsoft Entra ID. Instead, when you make the change in your on-premises, you must disable/delete in Microsoft Entra ID.

> [!NOTE]
> - Deleting devices in your on-premises Active Directory or Microsoft Entra ID does not remove registration on the client. It will only prevent access to resources using device as an identity (such as Conditional Access). Read additional information on how to [remove registration on the client](faq.yml).
> - Deleting a Windows 10 or newer device only in Microsoft Entra ID will re-synchronize the device from your on-premises using Microsoft Entra Connect but as a new object in "Pending" state. A re-registration is required on the device.
> - Removing the device from sync scope for Windows 10 or newer /Server 2016 devices will delete the Microsoft Entra device. Adding it back to sync scope will place a new object in "Pending" state. A re-registration of the device is required.
> - If you are not using Microsoft Entra Connect for Windows 10 or newer devices to synchronize (e.g. ONLY using AD FS for registration), you must manage lifecycle similar to Windows 7/8 devices.

<a name='azure-ad-joined-devices'></a>

### Microsoft Entra joined devices

Disable or delete Microsoft Entra joined devices in the Microsoft Entra ID.

> [!NOTE]
> - Deleting a Microsoft Entra device does not remove registration on the client. It will only prevent access to resources using device as an identity (e.g Conditional Access). 
> - Read more on [how to unjoin on Microsoft Entra ID](faq.yml) 

<a name='azure-ad-registered-devices'></a>

### Microsoft Entra registered devices

Disable or delete Microsoft Entra registered devices in the Microsoft Entra ID.

> [!NOTE]
> - Deleting a Microsoft Entra registered device in Microsoft Entra ID does not remove registration on the client. It will only prevent access to resources using device as an identity (e.g. Conditional Access).
> - Read more on [how to remove a registration on the client](faq.yml)

## Clean up stale devices  

While you can clean up stale devices in the Microsoft Entra admin center, it's more efficient to handle this process using a PowerShell script. Use the latest PowerShell V2 module to use the timestamp filter and to filter out system-managed devices such as Autopilot.

A typical routine consists of the following steps:

1. Connect to Microsoft Entra ID using the [Connect-AzureAD](/powershell/module/azuread/connect-azuread) cmdlet
1. Get the list of devices
1. Disable the device using the [Set-AzureADDevice](/powershell/module/azuread/set-azureaddevice) cmdlet (disable by using -AccountEnabled option). 
1. Wait for the grace period of however many days you choose before deleting the device.
1. Remove the device using the [Remove-AzureADDevice](/powershell/module/azuread/remove-azureaddevice) cmdlet.

### Get the list of devices

To get all devices and store the returned data in a CSV file:

```PowerShell
Get-AzureADDevice -All:$true | select-object -Property AccountEnabled, DeviceId, DeviceOSType, DeviceOSVersion, DisplayName, DeviceTrustType, ApproximateLastLogonTimestamp | export-csv devicelist-summary.csv -NoTypeInformation
```

If you have a large number of devices in your directory, use the timestamp filter to narrow down the number of returned devices. To get all devices that haven't logged on in 90 days and store the returned data in a CSV file: 

```PowerShell
$dt = (Get-Date).AddDays(-90)
Get-AzureADDevice -All:$true | Where {$_.ApproximateLastLogonTimeStamp -le $dt} | select-object -Property AccountEnabled, DeviceId, DeviceOSType, DeviceOSVersion, DisplayName, DeviceTrustType, ApproximateLastLogonTimestamp | export-csv devicelist-olderthan-90days-summary.csv -NoTypeInformation
```

> [!WARNING]
> [Some active devices may have a blank time stamp.](#why-is-the-timestamp-not-updated-more-frequently)

#### Set devices to disabled

Using the same commands we can pipe the output to the set command to disable the devices over a certain age.

```powershell
$dt = (Get-Date).AddDays(-90)
$Devices = Get-AzureADDevice -All:$true | Where {$_.ApproximateLastLogonTimeStamp -le $dt}
foreach ($Device in $Devices) {
Set-AzureADDevice -ObjectId $Device.ObjectId -AccountEnabled $false
}
```

### Delete devices

> [!CAUTION]
> The `Remove-AzureADDevice` cmdlet does not provide a warning. Running this command will delete devices without prompting. **There is no way to recover deleted devices**.

Before deleting any devices, back up any BitLocker recovery keys you may need in the future. There's no way to recover BitLocker recovery keys after deleting the associated device.

Building on the [disable devices example](#disable-devices) we look for disabled devices, now inactive for 120 days, and pipe the output to `Remove-AzureADDevice` to delete those devices.

```powershell
$dt = (Get-Date).AddDays(-120)
$Devices = Get-AzureADDevice -All:$true | Where {($_.ApproximateLastLogonTimeStamp -le $dt) -and ($_.AccountEnabled -eq $false)}
foreach ($Device in $Devices) {
Remove-AzureADDevice -ObjectId $Device.ObjectId
}
```

## What you should know

### Why is the timestamp not updated more frequently?

The timestamp is updated to support device lifecycle scenarios. This attribute isn't an audit. Use the sign-in audit logs for more frequent updates on the device. Some active devices may have a blank time stamp.

### Why should I worry about my BitLocker keys?

When configured, BitLocker keys for Windows 10 or newer devices are stored on the device object in Microsoft Entra ID. If you delete a stale device, you also delete the BitLocker keys that are stored on the device. Confirm that your cleanup policy aligns with the actual lifecycle of your device before deleting a stale device. 

### Why should I worry about Windows Autopilot devices?

When you delete a Microsoft Entra device that was associated with a Windows Autopilot object the following three scenarios can occur if the device will be repurposed in future:

- With Windows Autopilot user-driven deployments without using pre-provisioning, a new Microsoft Entra device will be created, but it won’t be tagged with the ZTDID.
- With Windows Autopilot self-deploying mode deployments, they'll fail because an associate Microsoft Entra device can’t be found.  (This failure is a security mechanism to make sure that no “imposter” devices try to join Microsoft Entra ID with no credentials.) The failure will indicate a ZTDID mismatch.
- With Windows Autopilot pre-provisioning deployments, they'll fail because an associated Microsoft Entra device can’t be found. (Behind the scenes, pre-provisioning deployments use the same self-deploying mode process, so they enforce the same security mechanisms.)

### How do I know all the type of devices joined?

To learn more about the different types, see the [device management overview](overview.md).

### What happens when I disable a device?

Any authentication where a device is being used to authenticate to Microsoft Entra ID are denied. Common examples are:

- **Microsoft Entra hybrid joined device** - Users might be able to use the device to sign-in to their on-premises domain. However, they can't access Microsoft Entra resources such as Microsoft 365.
- **Microsoft Entra joined device** - Users can't use the device to sign in. 
- **Mobile devices** - User can't access Microsoft Entra resources such as Microsoft 365. 

## Next steps

Devices managed with Intune can be retired or wiped, for more information see the article [Remove devices by using wipe, retire, or manually unenrolling the device](/mem/intune/remote-actions/devices-wipe).

To get an overview of how to manage devices, see [managing device identities](manage-device-identities.md)
