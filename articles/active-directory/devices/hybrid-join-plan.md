---
title: Plan your hybrid Azure Active Directory join deployment
description: Explains the steps that are required to implement hybrid Azure AD joined devices in your environment.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: conceptual
ms.date: 01/24/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Plan your hybrid Azure Active Directory join implementation

If you have an on-premises Active Directory Domain Services (AD DS) environment and you want to join your AD DS domain-joined computers to Azure AD, you can accomplish this task by doing hybrid Azure AD join.

> [!TIP]
> SSO access to on-premises resources is also available to devices that are Azure AD joined. For more information, see [How SSO to on-premises resources works on Azure AD joined devices](device-sso-to-on-premises-resources.md).

## Prerequisites

This article assumes that you're familiar with the [Introduction to device identity management in Azure Active Directory](./overview.md).

> [!NOTE]
> The minimum required domain controller version for Windows 10 or newer hybrid Azure AD join is Windows Server 2008 R2.

Hybrid Azure AD joined devices require network line of sight to your domain controllers periodically. Without this connection, devices become unusable.

Scenarios that break without line of sight to your domain controllers include:

- Device password change
- User password change (Cached credentials)
- TPM reset

## Plan your implementation

To plan your hybrid Azure AD implementation, you should familiarize yourself with:

> [!div class="checklist"]
> - Review supported devices
> - Review things you should know
> - Review targeted deployment of hybrid Azure AD join
> - Select your scenario based on your identity infrastructure
> - Review on-premises AD UPN support for hybrid Azure AD join

## Review supported devices

Hybrid Azure AD join supports a broad range of Windows devices. Because the configuration for devices running older versions of Windows requires other steps, the supported devices are grouped into two categories:

### Windows current devices

- Windows 11
- Windows 10
- Windows Server 2016
  - **Note**: Azure National cloud customers require version 1803
- Windows Server 2019

For devices running the Windows desktop operating system, supported versions are listed in this article [Windows 10 release information](/windows/release-information/). As a best practice, Microsoft recommends you upgrade to the latest version of Windows.

### Windows down-level devices

- Windows 8.1
- Windows 7 support ended on January 14, 2020. For more information, see [Support for Windows 7 has ended](https://support.microsoft.com/en-us/help/4057281/windows-7-support-ended-on-january-14-2020)
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2 for support information on Windows Server 2008 and 2008 R2, see [Prepare for Windows Server 2008 end of support](https://www.microsoft.com/cloud-platform/windows-server-2008)

As a first planning step, you should review your environment and determine whether you need to support Windows down-level devices.

## Review things you should know

### Unsupported scenarios

- Hybrid Azure AD join isn't supported for Windows Server running the Domain Controller (DC) role.
- Hybrid Azure AD join isn't supported on Windows down-level devices when using credential roaming or user profile roaming or mandatory profile.
- Server Core OS doesn't support any type of device registration.
- User State Migration Tool (USMT) doesn't work with device registration.

### OS imaging considerations

- If you're relying on the System Preparation Tool (Sysprep) and if you're using a **pre-Windows 10 1809** image for installation, make sure that image isn't from a device that is already registered with Azure AD as hybrid Azure AD joined.

- If you're relying on a Virtual Machine (VM) snapshot to create more VMs, make sure that snapshot isn't from a VM that is already registered with Azure AD as hybrid Azure AD joined.

- If you're using [Unified Write Filter](/windows-hardware/customize/enterprise/unified-write-filter) and similar technologies that clear changes to the disk at reboot, they must be applied after the device is hybrid Azure AD joined. Enabling such technologies before completion of hybrid Azure AD join will result in the device getting unjoined on every reboot.

### Handling devices with Azure AD registered state

If your Windows 10 or newer domain joined devices are [Azure AD registered](concept-device-registration.md) to your tenant, it could lead to a dual state of hybrid Azure AD joined and Azure AD registered device. We recommend upgrading to Windows 10 1803 (with KB4489894 applied) or newer to automatically address this scenario. In pre-1803 releases, you'll need to remove the Azure AD registered state manually before enabling hybrid Azure AD join. In 1803 and above releases, the following changes have been made to avoid this dual state:

- Any existing Azure AD registered state for a user would be automatically removed <i>after the device is hybrid Azure AD joined and the same user logs in</i>. For example, if User A had an Azure AD registered state on the device, the dual state for User A is cleaned up only when User A logs in to the device. If there are multiple users on the same device, the dual state is cleaned up individually when those users log in. After an admin removes the Azure AD registered state, Windows 10 will unenroll the device from Intune or other MDM, if the enrollment happened as part of the Azure AD registration via auto-enrollment.
- Azure AD registered state on any local accounts on the device isn’t impacted by this change. Only applicable to domain accounts. Azure AD registered state on local accounts isn't removed automatically even after user logon, since the user isn't a domain user.
- You can prevent your domain joined device from being Azure AD registered by adding the following registry value to HKLM\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin: "BlockAADWorkplaceJoin"=dword:00000001.
- In Windows 10 1803, if you have Windows Hello for Business configured, the user needs to reconfigure Windows Hello for Business after the dual state cleanup. This issue has been addressed with KB4512509.

> [!NOTE]
> Even though Windows 10 and Windows 11 automatically remove the Azure AD registered state locally, the device object in Azure AD is not immediately deleted if it is managed by Intune. You can validate the removal of Azure AD registered state by running dsregcmd /status and consider the device not to be Azure AD registered based on that.

### Hybrid Azure AD join for single forest, multiple Azure AD tenants

To register devices as hybrid Azure AD join to respective tenants, organizations need to ensure that the  Service Connection Points (SCP) configuration is done on the devices and not in AD. More details on how to accomplish this task can be found in the article [Hybrid Azure AD join targeted deployment](hybrid-join-control.md). It's important for organizations to understand that certain Azure AD capabilities won't work in a single forest, multiple Azure AD tenants configurations.

- [Device writeback](../hybrid/how-to-connect-device-writeback.md) won't work. This configuration affects [Device based Conditional Access for on-premises apps that are federated using ADFS](/windows-server/identity/ad-fs/operations/configure-device-based-conditional-access-on-premises). This configuration also affects [Windows Hello for Business deployment when using the Hybrid Cert Trust model](/windows/security/identity-protection/hello-for-business/hello-hybrid-cert-trust).
- [Groups writeback](../hybrid/how-to-connect-group-writeback.md) won't work. This configuration affects writeback of Office 365 Groups to a forest with Exchange installed.
- [Seamless SSO](../hybrid/how-to-connect-sso.md) won't work. This configuration affects SSO scenarios that organizations may be using on cross OS or browser platforms, for example iOS or Linux with Firefox, Safari, or Chrome without the Windows 10 extension.
- [Hybrid Azure AD join for Windows down-level devices in managed environment](./hybrid-azuread-join-managed-domains.md#enable-windows-down-level-devices) won't work. For example, hybrid Azure AD join on Windows Server 2012 R2 in a managed environment requires Seamless SSO and since Seamless SSO won't work, hybrid Azure AD join for such a setup won't work.
- [On-premises Azure AD Password Protection](../authentication/concept-password-ban-bad-on-premises.md) won't work. This configuration affects the ability to do password changes and password reset events against on-premises Active Directory Domain Services (AD DS) domain controllers using the same global and custom banned password lists that are stored in Azure AD.

### Other considerations

- If your environment uses virtual desktop infrastructure (VDI), see [Device identity and desktop virtualization](./howto-device-identity-virtual-desktop-infrastructure.md).

- Hybrid Azure AD join is supported for FIPS-compliant TPM 2.0 and not supported for TPM 1.2. If your devices have FIPS-compliant TPM 1.2, you must disable them before proceeding with hybrid Azure AD join. Microsoft doesn't provide any tools for disabling FIPS mode for TPMs as it is dependent on the TPM manufacturer. Contact your hardware OEM for support.

- Starting from Windows 10 1903 release, TPMs 1.2 aren't used with hybrid Azure AD join and devices with those TPMs will be considered as if they don't have a TPM.

- UPN changes are only supported starting Windows 10 2004 update. For devices before the Windows 10 2004 update, users could have SSO and Conditional Access issues on their devices. To resolve this issue, you need to unjoin the device from Azure AD (run "dsregcmd /leave" with elevated privileges) and rejoin (happens automatically). However, users signing in with Windows Hello for Business don't face this issue.

## Review targeted hybrid Azure AD join

Organizations may want to do a targeted rollout of hybrid Azure AD join before enabling it for their entire organization. Review the article [Hybrid Azure AD join targeted deployment](hybrid-join-control.md) to understand how to accomplish it.

> [!WARNING]
> Organizations should include a sample of users from varying roles and profiles in their pilot group. A targeted rollout will help identify any issues your plan may not have addressed before you enable for the entire organization.

## Select your scenario based on your identity infrastructure

Hybrid Azure AD join works with both, managed and federated environments depending on whether the UPN is routable or non-routable. See bottom of the page for table on supported scenarios.

### Managed environment

A managed environment can be deployed either through [Password Hash Sync (PHS)](../hybrid/whatis-phs.md) or [Pass Through Authentication (PTA)](../hybrid/how-to-connect-pta.md) with [Seamless Single Sign On](../hybrid/how-to-connect-sso.md).

These scenarios don't require you to configure a federation server for authentication.

> [!NOTE]
> [Cloud authentication using Staged rollout](../hybrid/how-to-connect-staged-rollout.md) is only supported starting at the Windows 10 1903 update.


### Federated environment

A federated environment should have an identity provider that supports the following requirements. If you have a federated environment using Active Directory Federation Services (AD FS), then the below requirements are already supported.

- **WIAORMULTIAUTHN claim:** This claim is required to do hybrid Azure AD join for Windows down-level devices.
- **WS-Trust protocol:** This protocol is required to authenticate Windows current hybrid Azure AD joined devices with Azure AD.
When you're using AD FS, you need to enable the following WS-Trust endpoints:
  `/adfs/services/trust/2005/windowstransport`
  `/adfs/services/trust/13/windowstransport`
  `/adfs/services/trust/2005/usernamemixed`
  `/adfs/services/trust/13/usernamemixed`
  `/adfs/services/trust/2005/certificatemixed`
  `/adfs/services/trust/13/certificatemixed`

> [!WARNING]
> Both **adfs/services/trust/2005/windowstransport** or **adfs/services/trust/13/windowstransport** should be enabled as intranet facing endpoints only and must NOT be exposed as extranet facing endpoints through the Web Application Proxy. To learn more on how to disable WS-Trust Windows endpoints, see [Disable WS-Trust Windows endpoints on the proxy](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#disable-ws-trust-windows-endpoints-on-the-proxy-ie-from-extranet). You can see what endpoints are enabled through the AD FS management console under **Service** > **Endpoints**.

Beginning with version 1.1.819.0, Azure AD Connect provides you with a wizard to configure hybrid Azure AD join. The wizard enables you to significantly simplify the configuration process. If installing the required version of Azure AD Connect isn't an option for you, see [how to manually configure device registration](hybrid-join-manual.md).

## Review on-premises AD users UPN support for hybrid Azure AD join

Sometimes, on-premises AD users UPNs are different from your Azure AD UPNs. In these cases, Windows 10 or newer hybrid Azure AD join provides limited support for on-premises AD UPNs based on the [authentication method](../hybrid/choose-ad-authn.md), domain type, and Windows version. There are two types of on-premises AD UPNs that can exist in your environment:

- Routable users UPN: A routable UPN has a valid verified domain that is registered with a domain registrar. For example, if contoso.com is the primary domain in Azure AD, contoso.org is the primary domain in on-premises AD owned by Contoso and [verified in Azure AD](../fundamentals/add-custom-domain.md).
- Non-routable users UPN: A non-routable UPN doesn't have a verified domain and is applicable only within your organization's private network. For example, if contoso.com is the primary domain in Azure AD and contoso.local is the primary domain in on-premises AD but isn't a verifiable domain in the internet and only used within Contoso's network.

> [!NOTE]
> The information in this section applies only to an on-premises users UPN. It isn't applicable to an on-premises computer domain suffix (example: computer1.contoso.local).

The following table provides details on support for these on-premises AD UPNs in Windows 10 hybrid Azure AD join

| Type of on-premises AD UPN | Domain type | Windows 10 version | Description |
| ----- | ----- | ----- | ----- |
| Routable | Federated | From 1703 release | Generally available |
| Non-routable | Federated | From 1803 release | Generally available |
| Routable | Managed | From 1803 release | Generally available, Azure AD SSPR on Windows lock screen isn't supported in environments where the on-premises UPN is different from the Azure AD UPN. The on-premises UPN must be synced to the `onPremisesUserPrincipalName` attribute in Azure AD |
| Non-routable | Managed | Not supported | |

## Next steps

- [Configure hybrid Azure AD join](how-to-hybrid-join.md)
