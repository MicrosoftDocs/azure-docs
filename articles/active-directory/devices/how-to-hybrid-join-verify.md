---
title: Verify Microsoft Entra hybrid join state
description: Verify configurations for Microsoft Entra hybrid joined devices

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 02/27/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Verify Microsoft Entra hybrid join

Here are three ways to locate and verify the hybrid joined device state:

## Locally on the device

1. Open Windows PowerShell.
2. Enter `dsregcmd /status`.
3. Verify that both **AzureAdJoined** and **DomainJoined** are set to **YES**.
4. You can use the **DeviceId** and compare the status on the service using either the Microsoft Entra admin center or PowerShell.

For downlevel devices, see the article [Troubleshooting Microsoft Entra hybrid joined down-level devices](troubleshoot-hybrid-join-windows-legacy.md#step-1-retrieve-the-registration-status)

## Using the Microsoft Entra admin center

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com)ntra.microsoft.com) as at least a [Cloud Device Administrator](../roles/permissions-reference.md#cloud-device-administrator).
1. Browse to **Identity** > **Devices** > **All devices**.
1. If the **Registered** column says **Pending**, then Microsoft Entra hybrid join hasn't completed. In federated environments, this state happens only if it failed to register and Microsoft Entra Connect is configured to sync the devices. Wait for Microsoft Entra Connect to complete a sync cycle.
1. If the **Registered** column contains a **date/time**, then Microsoft Entra hybrid join has completed.

## Using PowerShell

Verify the device registration state in your Azure tenant by using **[Get-MsolDevice](/powershell/module/msonline/get-msoldevice)**. This cmdlet is in the [Azure Active Directory PowerShell module](/powershell/azure/active-directory/install-msonlinev1).

When you use the **Get-MSolDevice** cmdlet to check the service details:

- An object with the **device ID** that matches the ID on the Windows client must exist.
- The value for **DeviceTrustType** is **Domain Joined**. This setting is equivalent to the **Microsoft Entra hybrid joined** state on the **Devices** page in the Microsoft Entra admin center.
- For devices that are used in Conditional Access, the value for **Enabled** is **True** and **DeviceTrustLevel** is **Managed**.

1. Open Windows PowerShell as an administrator.
2. Enter `Connect-MsolService` to connect to your Azure tenant.

<a name='count-all-hybrid-azure-ad-joined-devices-excluding-pending-state'></a>

### Count all Microsoft Entra hybrid joined devices (excluding **Pending** state)

```azurepowershell
(Get-MsolDevice -All -IncludeSystemManagedDevices | where {($_.DeviceTrustType -eq 'Domain Joined') -and (([string]($_.AlternativeSecurityIds)).StartsWith("X509:"))}).count
```

<a name='count-all-hybrid-azure-ad-joined-devices-with-pending-state'></a>

### Count all Microsoft Entra hybrid joined devices with **Pending** state

```azurepowershell
(Get-MsolDevice -All -IncludeSystemManagedDevices | where {($_.DeviceTrustType -eq 'Domain Joined') -and (-not([string]($_.AlternativeSecurityIds)).StartsWith("X509:"))}).count
```

<a name='list-all-hybrid-azure-ad-joined-devices'></a>

### List all Microsoft Entra hybrid joined devices

```azurepowershell
Get-MsolDevice -All -IncludeSystemManagedDevices | where {($_.DeviceTrustType -eq 'Domain Joined') -and (([string]($_.AlternativeSecurityIds)).StartsWith("X509:"))}
```

<a name='list-all-hybrid-azure-ad-joined-devices-with-pending-state'></a>

### List all Microsoft Entra hybrid joined devices with **Pending** state

```azurepowershell
Get-MsolDevice -All -IncludeSystemManagedDevices | where {($_.DeviceTrustType -eq 'Domain Joined') -and (-not([string]($_.AlternativeSecurityIds)).StartsWith("X509:"))}
```

### List details of a single device:

1. Enter `get-msoldevice -deviceId <deviceId>` (This **DeviceId** is obtained locally on the device).
2. Verify that **Enabled** is set to **True**.

## Next steps

- [Downlevel device enablement](how-to-hybrid-join-downlevel.md)
- [Configure Microsoft Entra hybrid join](how-to-hybrid-join.md)
- [Troubleshoot pending device state](/troubleshoot/azure/active-directory/pending-devices)
