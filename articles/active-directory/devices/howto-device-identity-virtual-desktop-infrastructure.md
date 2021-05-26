---
title: Device identity and desktop virtualization - Azure Active Directory
description: Learn how VDI and Azure AD device identities can be used together

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 09/14/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sandeo

# Customer intent: As an administrator, I want to provide staff with secured workstations to reduce the risk of breach due to misconfiguration or compromise.

ms.collection: M365-identity-device-management
---
# Device identity and desktop virtualization

Administrators commonly deploy virtual desktop infrastructure (VDI) platforms hosting Windows operating systems in their organizations. Administrators deploy VDI to:

- Streamline management.
- Reduce costs through consolidation and centralization of resources.
- Deliver end-users mobility and the freedom to access virtual desktops anytime, from anywhere, on any device.

There are two primary types of virtual desktops:

- Persistent
- Non-persistent

Persistent versions use a unique desktop image for each user or a pool of users. These unique desktops can be customized and saved for future use. 

Non-persistent versions use a collection of desktops that users can access on an as needed basis. These non-persistent desktops are reverted to their original state, in case of Windows current<sup>1</sup> this happens when a virtual machine goes through a shutdown/restart/OS reset process and in case of Windows down-level<sup>2</sup> this happens when a user signs out.

There has been a rise in non-persistent VDI deployments as remote work continues to be the new norm. As customers deploy non-persistent VDI, it is important to ensure that you manage device churn that could be caused due to frequent device registration without having a proper strategy for device lifecycle management.

> [!IMPORTANT]
> Failure to manage device churn, can lead to pressure increase on your tenant quota usage consumption and potential risk of service interruption, if you run out of tenant quota. You should follow the guidance documented below when deploying non persistent VDI environments to avoid this situation.

This article will cover Microsoft's guidance to administrators on support for device identity and VDI. For more information about device identity, see the article [What is a device identity](overview.md).

## Supported scenarios

Before configuring device identities in Azure AD for your VDI environment, familiarize yourself with the supported scenarios. The table below illustrates which provisioning scenarios are supported. Provisioning in this context implies that an administrator can configure device identities at scale without requiring any end-user interaction.

| Device identity type | Identity infrastructure | Windows devices | VDI platform version | Supported |
| --- | --- | --- | --- | --- |
| Hybrid Azure AD joined | Federated<sup>3</sup> | Windows current and Windows down-level | Persistent | Yes |
|   |   | Windows current | Non-Persistent | Yes<sup>5</sup> |
|   |   | Windows down-level | Non-Persistent | Yes<sup>6</sup> |
|   | Managed<sup>4</sup> | Windows current and Windows down-level | Persistent | Yes |
|   |   | Windows current | Non-Persistent | No |
|   |   | Windows down-level | Non-Persistent | Yes<sup>6</sup> |
| Azure AD joined | Federated | Windows current | Persistent | No |
|   |   |   | Non-Persistent | No |
|   | Managed | Windows current | Persistent | No |
|   |   |   | Non-Persistent | No |
| Azure AD registered | Federated/Managed | Windows current/Windows down-level | Persistent/Non-Persistent | Not Applicable |

<sup>1</sup> **Windows current** devices represent Windows 10, Windows Server 2016 v1803 or higher, and Windows Server 2019.
<sup>2</sup> **Windows down-level** devices represent Windows 7, Windows 8.1, Windows Server 2008 R2, Windows Server 2012, and Windows Server 2012 R2. For support information on Windows 7, see [Support for Windows 7 is ending](https://www.microsoft.com/microsoft-365/windows/end-of-windows-7-support). For support information on Windows Server 2008 R2, see [Prepare for Windows Server 2008 end of support](https://www.microsoft.com/cloud-platform/windows-server-2008).

<sup>3</sup> A **Federated** identity infrastructure environment represents an environment with an identity provider such as AD FS or other third-party IDP.

<sup>4</sup> A **Managed** identity infrastructure environment represents an environment with Azure AD as the identity provider deployed with either [password hash sync (PHS)](../hybrid/whatis-phs.md) or [pass-through authentication (PTA)](../hybrid/how-to-connect-pta.md) with [seamless single sign-on](../hybrid/how-to-connect-sso.md).

<sup>5</sup> **Non-Persistence support for Windows current** requires additional consideration as documented below in guidance section. This scenario requires Windows 10 1803,  Windows Server 2019 or Windows Server (Semi-annual channel) starting version 1803

<sup>6</sup> **Non-Persistence support for Windows down-level** requires additional consideration as documented below in guidance section.


## Microsoft’s guidance

Administrators should reference the following articles, based on their identity infrastructure, to learn how to configure hybrid Azure AD join.

- [Configure hybrid Azure Active Directory join for federated environment](hybrid-azuread-join-federated-domains.md)
- [Configure hybrid Azure Active Directory join for managed environment](hybrid-azuread-join-managed-domains.md)

### Non-persistent VDI

When deploying non-persistent VDI, Microsoft recommends that IT administrators implement the guidance below. Failure to do so will result in your directory having lots of stale Hybrid Azure AD joined devices that were registered from your non-persistent VDI platform resulting in increased pressure on your tenant quota and risk of service interruption due to running out of tenant quota.

- If you are relying on the System Preparation Tool (sysprep.exe) and if you are using a pre-Windows 10 1809 image for installation, make sure that image is not from a device that is already registered with Azure AD as hybrid Azure AD joined.
- If you are relying on a Virtual Machine (VM) snapshot to create additional VMs, make sure that snapshot is not from a VM that is already registered with Azure AD as Hybrid Azure AD join.
- Create and use a prefix for the display name (e.g. NPVDI-) of the computer that indicates the desktop as non-persistent VDI-based.
- For Windows down-level:
   - Implement **autoworkplacejoin /leave** command as part of logoff script. This command should be triggered in the context of the user and should be execute before the user has logged off completely and while there is still network connectivity.
- For Windows current in a Federated environment (e.g. AD FS):
   - Implement **dsregcmd /join** as part of VM boot sequence/order and before user signs in.
   - **DO NOT** execute dsregcmd /leave as part of VM shutdown/restart process.
- Define and implement process for [managing stale devices](manage-stale-devices.md).
   - Once you have a strategy to identify your non-persistent Hybrid Azure AD joined devices (e.g. using computer display name prefix), you should be more aggressive on the clean-up of these devices to ensure your directory does not get consumed with lots of stale devices.
   - For non-persistent VDI deployments on Windows current and down-level, you should delete devices that have **ApproximateLastLogonTimestamp** of older than 15 days.

> [!NOTE]
> When using non-persistent VDI, if you want to prevent a device join state ensure the following registry key is set:  
> `HKLM\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin: "BlockAADWorkplaceJoin"=dword:00000001`    
>
> Ensure you are running Windows 10, version 1803 or higher.  
>
> Roaming any data under the path `%localappdata%` is not supported. If you choose to move content under `%localappdata%`, make sure that the content of the following folders and registry keys **never** leaves the device under any condition. For example: Profile migration tools must skip the following folders and keys:
>
> * `%localappdata%\Packages\Microsoft.AAD.BrokerPlugin_cw5n1h2txyewy`
> * `%localappdata%\Packages\Microsoft.Windows.CloudExperienceHost_cw5n1h2txyewy`
> * `%localappdata%\Packages\<any app package>\AC\TokenBroker`
> * `%localappdata%\Microsoft\TokenBroker`
> * `HKEY_CURRENT_USER\SOFTWARE\Microsoft\IdentityCRL`
> * `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\AAD`
>


### Persistent VDI

When deploying persistent VDI, Microsoft recommends that IT administrators implement the guidance below. Failure to do so will result in deployment and authentication issues. 

- If you are relying on the System Preparation Tool (sysprep.exe) and if you are using a pre-Windows 10 1809 image for installation, make sure that image is not from a device that is already registered with Azure AD as hybrid Azure AD joined.
- If you are relying on a Virtual Machine (VM) snapshot to create additional VMs, make sure that snapshot is not from a VM that is already registered with Azure AD as Hybrid Azure AD join.

In addition, we recommend you to implement process for [managing stale devices](manage-stale-devices.md). This will ensure your directory does not get consumed with lots of stale devices if you periodically reset your VMs.
 
## Next steps

[Configuring hybrid Azure Active Directory join for federated environment](hybrid-azuread-join-federated-domains.md)
