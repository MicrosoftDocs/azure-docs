---
title: Plan your Azure Active Directory join deployment
description: Explains the steps that are required to implement Azure AD joined devices in your environment.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 01/24/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# How to: Plan your Azure AD join implementation

You can join devices directly to Azure Active Directory (Azure AD) without the need to join to on-premises Active Directory while keeping your users productive and secure. Azure AD join is enterprise-ready for both at-scale and scoped deployments. Single sign-on (SSO) access to on-premises resources is also available to devices that are Azure AD joined. For more information, see [How SSO to on-premises resources works on Azure AD joined devices](device-sso-to-on-premises-resources.md).

This article provides you with the information you need to plan your Azure AD join implementation.

## Prerequisites

This article assumes that you're familiar with the [Introduction to device management in Azure Active Directory](./overview.md).

## Plan your implementation

To plan your Azure AD join implementation, you should familiarize yourself with:

> [!div class="checklist"]
> - Review your scenarios
> - Review your identity infrastructure
> - Assess your device management
> - Understand considerations for applications and resources
> - Understand your provisioning options
> - Configure enterprise state roaming
> - Configure Conditional Access

## Review your scenarios 

Azure AD join enables you to transition towards a cloud-first model with Windows. If you're planning to modernize your devices management and reduce device-related IT costs, Azure AD join provides a great foundation towards achieving those goals.  
 
Consider Azure AD join if your goals align with the following criteria:

- You're adopting Microsoft 365 as the productivity suite for your users.
- You want to manage devices with a cloud device management solution.
- You want to simplify device provisioning for geographically distributed users.
- You plan to modernize your application infrastructure.

## Review your identity infrastructure  

Azure AD join works in managed and federated environments. We think most organizations will deploy managed domains. Managed domain scenarios don't require configuring and managing a federation server like Active Directory Federation Services (AD FS).

### Managed environment

A managed environment can be deployed either through [Password Hash Sync](../hybrid/how-to-connect-password-hash-synchronization.md) or [Pass Through Authentication](../hybrid/how-to-connect-pta-quick-start.md) with Seamless Single Sign On.

### Federated environment

A federated environment should have an identity provider that supports both WS-Trust and WS-Fed protocols:

- **WS-Fed:** This protocol is required to join a device to Azure AD.
- **WS-Trust:** This protocol is required to sign in to an Azure AD joined device.

When you're using AD FS, you need to enable the following WS-Trust endpoints:
 `/adfs/services/trust/2005/usernamemixed`
 `/adfs/services/trust/13/usernamemixed`
 `/adfs/services/trust/2005/certificatemixed`
 `/adfs/services/trust/13/certificatemixed`

If your identity provider doesn't support these protocols, Azure AD join doesn't work natively. 

> [!NOTE]
> Currently, Azure AD join does not work with [AD FS 2019 configured with external authentication providers as the primary authentication method](/windows-server/identity/ad-fs/operations/additional-authentication-methods-ad-fs#enable-external-authentication-methods-as-primary). Azure AD join defaults to password authentication as the primary method, which results in authentication failures in this scenario

### User configuration

If you create users in your:

- **On-premises Active Directory**, you need to synchronize them to Azure AD using [Azure AD Connect](../hybrid/how-to-connect-sync-whatis.md). 
- **Azure AD**, no extra setup is required.

On-premises user principal names (UPNs) that are different from Azure AD UPNs aren't supported on Azure AD joined devices. If your users use an on-premises UPN, you should plan to switch to using their primary UPN in Azure AD.

UPN changes are only supported starting Windows 10 2004 update. Users on devices with this update won't have any issues after changing their UPNs. For devices before the Windows 10 2004 update, users would have SSO and Conditional Access issues on their devices. They need to sign in to Windows through the "Other user" tile using their new UPN to resolve this issue. 

## Assess your device management

### Supported devices

Azure AD join:

- Supports Windows 10 and Windows 11 devices. 
- Isn't supported on previous versions of Windows or other operating systems. If you have Windows 7/8.1 devices, you must upgrade at least to Windows 10 to deploy Azure AD join.
- Is supported for FIPS-compliant TPM 2.0 but not supported for TPM 1.2. If your devices have FIPS-compliant TPM 1.2, you must disable them before proceeding with Azure AD join. Microsoft doesn't provide any tools for disabling FIPS mode for TPMs as it is dependent on the TPM manufacturer. Contact your hardware OEM for support.
 
**Recommendation:** Always use the latest Windows release to take advantage of updated features.

### Management platform

Device management for Azure AD joined devices is based on a mobile device management (MDM) platform such as Intune, and MDM CSPs. Starting in Windows 10 there's a built-in MDM agent that works with all compatible MDM solutions.

> [!NOTE]
> Group policies are not supported in Azure AD joined devices as they are not connected to on-premises Active Directory. Management of Azure AD joined devices is only possible through MDM

There are two approaches for managing Azure AD joined devices:

- **MDM-only** - A device is exclusively managed by an MDM provider like Intune. All policies are delivered as part of the MDM enrollment process. For Azure AD Premium or EMS customers, MDM enrollment is an automated step that is part of an Azure AD join.
- **Co-management** -  A device is managed by an MDM provider and Microsoft Configuration Manager. In this approach, the Microsoft Configuration Manager agent is installed on an MDM-managed device to administer certain aspects.

If you're using Group Policies, evaluate your GPO and MDM policy parity by using [Group Policy analytics](/mem/intune/configuration/group-policy-analytics) in Microsoft Intune. 

Review supported and unsupported policies to determine whether you can use an MDM solution instead of Group policies. For unsupported policies, consider the following questions:

- Are the unsupported policies necessary for Azure AD joined devices or users?
- Are the unsupported policies applicable in a cloud-driven deployment?

If your MDM solution isn't available through the Azure AD app gallery, you can add it following the process 
outlined in [Azure Active Directory integration with MDM](/windows/client-management/mdm/azure-active-directory-integration-with-mdm). 

Through co-management, you can use Microsoft Configuration Manager to manage certain aspects of your devices while policies are delivered through your MDM platform. Microsoft Intune enables co-management with Microsoft Configuration Manager. For more information on co-management for Windows 10 or newer devices, see [What is co-management?](/configmgr/core/clients/manage/co-management-overview). If you use an MDM product other than Intune, check with your MDM provider on applicable co-management scenarios.

**Recommendation:** Consider MDM only management for Azure AD joined devices.

## Understand considerations for applications and resources

We recommend migrating applications from on-premises to cloud for a better user experience and access control. Azure AD joined devices can seamlessly provide access to both, on-premises and cloud applications. For more information, see [How SSO to on-premises resources works on Azure AD joined devices](device-sso-to-on-premises-resources.md).

The following sections list considerations for different types of applications and resources.

### Cloud-based applications

If an application is added to Azure AD app gallery, users get SSO through Azure AD joined devices. No other configuration is required. Users get SSO on both, Microsoft Edge and Chrome browsers. For Chrome, you need to deploy the [Windows 10 Accounts extension](https://chrome.google.com/webstore/detail/windows-10-accounts/ppnbnpeolgkicgegkbkbjmhlideopiji). 

All Win32 applications that:

- Rely on Web Account Manager (WAM) for token requests also get SSO on Azure AD joined devices. 
- Don't rely on WAM may prompt users for authentication. 

### On-premises web applications

If your apps are custom built and/or hosted on-premises, you need to add them to your browser’s trusted sites to:

- Enable Windows integrated authentication to work 
- Provide a no-prompt SSO experience to users. 

If you use AD FS, see [Verify and manage single sign-on with AD FS](/previous-versions/azure/azure-services/jj151809(v%3dazure.100)). 

**Recommendation:** Consider hosting in the cloud (for example, Azure) and integrating with Azure AD for a better experience.

### On-premises applications relying on legacy protocols

Users get SSO from Azure AD joined devices if the device has access to a domain controller. 

> [!NOTE]
> Azure AD joined devices can seamlessly provide access to both, on-premises and cloud applications. For more information, see [How SSO to on-premises resources works on Azure AD joined devices](device-sso-to-on-premises-resources.md).

**Recommendation:** Deploy [Azure AD App proxy](../app-proxy/application-proxy.md) to enable secure access for these applications.

### On-premises network shares

Your users have SSO from Azure AD joined devices when a device has access to an on-premises domain controller. [Learn how this works](device-sso-to-on-premises-resources.md)

### Printers

We recommend deploying [Universal Print](/universal-print/fundamentals/universal-print-whatis) to have a cloud-based print management solution without any on-premises dependencies. 

###	On-premises applications relying on machine authentication

Azure AD joined devices don't support on-premises applications relying on machine authentication. 

**Recommendation:** Consider retiring these applications and moving to their modern alternatives.

### Remote Desktop Services

Remote desktop connection to an Azure AD joined devices requires the host machine to be either Azure AD joined or hybrid Azure AD joined. Remote desktop from an unjoined or non-Windows device isn't supported. For more information, see [Connect to remote Azure AD joined pc](/windows/client-management/connect-to-remote-aadj-pc)

Starting with the Windows 10 2004 update, users can also use remote desktop from an Azure AD registered Windows 10 or newer device to another Azure AD joined device. 

### RADIUS and Wi-Fi authentication

Currently, Azure AD joined devices don't support RADIUS authentication for connecting to Wi-Fi access points, since RADIUS relies on presence of an on-premises computer object. As an alternative, you can use certificates pushed via Intune or user credentials to authenticate to Wi-Fi. 

## Understand your provisioning options
**Note**: Azure AD joined devices can’t be deployed using  System Preparation Tool (Sysprep) or similar imaging tools

You can provision Azure AD joined devices using the following approaches:

- **Self-service in OOBE/Settings** - In the self-service mode, users go through the Azure AD join process either during Windows Out of Box Experience (OOBE) or from Windows Settings. For more information, see [Join your work device to your organization's network](https://support.microsoft.com/account-billing/join-your-work-device-to-your-work-or-school-network-ef4d6adb-5095-4e51-829e-5457430f3973). 
- **Windows Autopilot** - Windows Autopilot enables preconfiguration of devices for a smoother Azure AD join experience in OOBE. For more information, see the [Overview of Windows Autopilot](/windows/deployment/windows-autopilot/windows-10-autopilot). 
- **Bulk enrollment** - Bulk enrollment enables an administrator driven Azure AD join by using a bulk provisioning tool to configure devices. For more information, see [Bulk enrollment for Windows devices](/intune/windows-bulk-enroll).
 
Here’s a comparison of these three approaches 
 
| Element | Self-service setup | Windows Autopilot | Bulk enrollment |
| --- | --- | --- | --- |
| Require user interaction to set up | Yes | Yes | No |
| Require IT effort | No | Yes | Yes |
| Applicable flows | OOBE & Settings | OOBE only | OOBE only |
| Local admin rights to primary user | Yes, by default | Configurable | No |
| Require device OEM support | No | Yes | No |
| Supported versions | 1511+ | 1709+ | 1703+ |
 
Choose your deployment approach or approaches by reviewing the previous table and reviewing the following considerations for adopting either approach:  

- Are your users tech savvy to go through the setup themselves? 
   - Self-service can work best for these users. Consider Windows Autopilot to enhance the user experience.  
- Are your users remote or within corporate premises? 
   - Self-service or Autopilot work best for remote users for a hassle-free setup. 
- Do you prefer a user driven or an admin-managed configuration? 
   - Bulk enrollment works better for admin-driven deployment to set up devices before handing over to users.     
- Do you purchase devices from 1-2 OEMS, or do you have a wide distribution of OEM devices?  
   - If purchasing from limited OEMs who also support Autopilot, you can benefit from tighter integration with Autopilot. 

## Configure your device settings

The Azure portal allows you to control the deployment of Azure AD joined devices in your organization. To configure the related settings, on the **Azure Active Directory page**, select `Devices > Device settings`. [Learn more](manage-device-identities.md)

### Users may join devices to Azure AD

Set this option to **All** or **Selected** based on the scope of your deployment and who you want to set up an Azure AD joined device. 

![Users may join devices to Azure AD](./media/device-join-plan/01.png)

### Additional local administrators on Azure AD joined devices

Choose **Selected** and selects the users you want to add to the local administrators’ group on all Azure AD joined devices. 

![Additional local administrators on Azure AD joined devices](./media/device-join-plan/02.png)

### Require multifactor authentication (MFA) to join devices

Select **“Yes** if you require users to do MFA while joining devices to Azure AD.

![Require multifactor Auth to join devices](./media/device-join-plan/03.png)

**Recommendation:** Use the user action [Register or join devices](../conditional-access/concept-conditional-access-cloud-apps.md#user-actions) in Conditional Access for enforcing MFA for joining devices.

## Configure your mobility settings

Before you can configure your mobility settings, you may have to add an MDM provider, first.

**To add an MDM provider**:

1. On the **Azure Active Directory page**, in the **Manage** section, select `Mobility (MDM and MAM)`. 
1. Select **Add application**.
1. Select your MDM provider from the list.

   :::image type="content" source="./media/device-join-plan/04.png" alt-text="Screenshot of the Azure Active Directory Add an application page. Several M D M providers are listed." border="false":::

Select your MDM provider to configure the related settings. 

### MDM user scope

Select **Some** or **All** based on the scope of your deployment. 

![MDM user scope](./media/device-join-plan/05.png)

Based on your scope, one of the following happens: 

- **User is in MDM scope**: If you have an Azure AD Premium subscription, MDM enrollment is automated along with Azure AD join. All scoped users must have an appropriate license for your MDM. If MDM enrollment fails in this scenario, Azure AD join will also be rolled back.
- **User is not in MDM scope**: If users aren't in MDM scope, Azure AD join completes without any MDM enrollment. This scope results in an unmanaged device.

### MDM URLs

There are three URLs that are related to your MDM configuration:

- MDM terms of use URL
- MDM discovery URL 
- MDM compliance URL

:::image type="content" source="./media/device-join-plan/06.png" alt-text="Screenshot of part of the Azure Active Directory M D M configuration section, with U R L fields for M D M terms of use, discovery, and compliance." border="false":::

Each URL has a predefined default value. If these fields are empty, contact your MDM provider for more information.

### MAM settings

MAM doesn't apply to Azure AD join. 

## Configure enterprise state roaming

If you want to enable state roaming to Azure AD so that users can sync their settings across devices, see [Enable Enterprise State Roaming in Azure Active Directory](enterprise-state-roaming-enable.md). 

**Recommendation**: Enable this setting even for hybrid Azure AD joined devices.

## Configure Conditional Access

If you have an MDM provider configured for your Azure AD joined devices, the provider flags the device as compliant as soon as the device is under management. 

![Compliant device](./media/device-join-plan/46.png)

You can use this implementation to [require managed devices for cloud app access with Conditional Access](../conditional-access/require-managed-devices.md).

## Next steps

- [Join a new Windows 10 device to Azure AD during a first run](device-join-out-of-box.md)
- [Join your work device to your organization's network](https://support.microsoft.com/account-billing/join-your-work-device-to-your-work-or-school-network-ef4d6adb-5095-4e51-829e-5457430f3973)
- [Planning a Windows Hello for Business Deployment](/windows/security/identity-protection/hello-for-business/hello-planning-guide)
