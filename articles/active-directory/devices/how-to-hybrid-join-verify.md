---
title: Verify hybrid Azure Active Directory join state
description: Verify configurations for hybrid Azure AD joined devices

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 02/27/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Verify hybrid Azure AD join

Here are three ways to locate and verify the hybrid joined device state:

## Locally on the device

1. Open Windows PowerShell.
2. Enter `dsregcmd /status`.
3. Verify that both **AzureAdJoined** and **DomainJoined** are set to **YES**.
4. You can use the **DeviceId** and compare the status on the service using either the Azure portal or PowerShell.

For downlevel devices, see the article [Troubleshooting hybrid Azure Active Directory joined down-level devices](troubleshoot-hybrid-join-windows-legacy.md#step-1-retrieve-the-registration-status)

## Using the Azure portal

1. Go to the devices page using a [direct link](https://portal.azure.com/#blade/Microsoft_AAD_IAM/DevicesMenuBlade/Devices).
2. Information on how to locate a device can be found in [How to manage device identities using the Azure portal](./manage-device-identities.md).
3. If the **Registered** column says **Pending**, then hybrid Azure AD join hasn't completed. In federated environments, this state happens only if it failed to register and Azure AD Connect is configured to sync the devices. Wait for Azure AD Connect to complete a sync cycle.
4. If the **Registered** column contains a **date/time**, then hybrid Azure AD join has completed.

## Using PowerShell

Verify the device registration state in your Azure tenant by using **[Get-MsolDevice](/powershell/module/msonline/get-msoldevice)**. This cmdlet is in the [Azure Active Directory PowerShell module](/powershell/azure/active-directory/install-msonlinev1).

When you use the **Get-MSolDevice** cmdlet to check the service details:

- An object with the **device ID** that matches the ID on the Windows client must exist.
- The value for **DeviceTrustType** is **Domain Joined**. This setting is equivalent to the **Hybrid Azure AD joined** state on the **Devices** page in the Azure AD portal.
- For devices that are used in Conditional Access, the value for **Enabled** is **True** and **DeviceTrustLevel** is **Managed**.

1. Open Windows PowerShell as an administrator.
2. Enter `Connect-MsolService` to connect to your Azure tenant.

### Count all Hybrid Azure AD joined devices (excluding **Pending** state)

```azurepowershell
(Get-MsolDevice -All -IncludeSystemManagedDevices | where {($_.DeviceTrustType -eq 'Domain Joined') -and (([string]($_.AlternativeSecurityIds)).StartsWith("X509:"))}).count
```

### Count all Hybrid Azure AD joined devices with **Pending** state

```azurepowershell
(Get-MsolDevice -All -IncludeSystemManagedDevices | where {($_.DeviceTrustType -eq 'Domain Joined') -and (-not([string]($_.AlternativeSecurityIds)).StartsWith("X509:"))}).count
```

### List all Hybrid Azure AD joined devices

```azurepowershell
Get-MsolDevice -All -IncludeSystemManagedDevices | where {($_.DeviceTrustType -eq 'Domain Joined') -and (([string]($_.AlternativeSecurityIds)).StartsWith("X509:"))}
```

### List all Hybrid Azure AD joined devices with **Pending** state

```azurepowershell
Get-MsolDevice -All -IncludeSystemManagedDevices | where {($_.DeviceTrustType -eq 'Domain Joined') -and (-not([string]($_.AlternativeSecurityIds)).StartsWith("X509:"))}
```

### List details of a single device:

1. Enter `get-msoldevice -deviceId <deviceId>` (This **DeviceId** is obtained locally on the device).
2. Verify that **Enabled** is set to **True**.

## Next steps

- [Downlevel device enablement](how-to-hybrid-join-downlevel.md)
- [Configure hybrid Azure AD join](how-to-hybrid-join.md)
- [Troubleshoot pending device state](/troubleshoot/azure/active-directory/pending-devices)
