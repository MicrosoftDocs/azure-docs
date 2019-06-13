---
title: Configure hybrid Azure Active Directory join for managed domains | Microsoft Docs
description: Learn how to configure hybrid Azure Active Directory join for managed domains.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: tutorial
ms.date: 05/14/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sandeo

#Customer intent: As an IT admin, I want to setup hybrid Azure AD joined devices for managed domains so that I can automatically create and manage device identities in Azure AD for my AD domain-joined computers

ms.collection: M365-identity-device-management
---
# Tutorial: Configure hybrid Azure Active Directory join for managed domains

In a similar way to a user, a device is another core identity you want to protect and also use it to protect your resources at any time and from any location. You can accomplish this goal by bringing and managing device identities in Azure AD using one of the following methods:

- Azure AD join
- Hybrid Azure AD join
- Azure AD registration

By bringing your devices to Azure AD, you maximize your users' productivity through single sign-on (SSO) across your cloud and on-premises resources. At the same time, you can secure access to your cloud and on-premises resources with [conditional access](../active-directory-conditional-access-azure-portal.md).

In this tutorial, you learn how to configure hybrid Azure AD join for AD domain-joined computers devices in a managed environment. 

A managed environment can be deployed either through [Password Hash Sync (PHS)](https://docs.microsoft.com/azure/active-directory/hybrid/whatis-phs) or [Pass Through Authentication (PTA)](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-pta) with [Seamless Single Sign On](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sso).
These scenarios don't require you to configure a federation server for authentication.

> [!div class="checklist"]
> * Configure hybrid Azure AD join
> * Enable Windows down-level devices
> * Verify joined devices
> * Troubleshoot

## Prerequisites

This tutorial assumes that you are familiar with:

- [Introduction to device identity management in Azure Active Directory](../device-management-introduction.md)
- [How to plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md)
- [How to do controlled validation of hybrid Azure AD join](hybrid-azuread-join-control.md)

> [!NOTE]
> Azure AD does not support smartcards or certificates in managed domains.

To configure the scenario in this article, you need the [latest version of Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594) (1.1.819.0 or higher) to be installed.

Verify that Azure AD Connect has synchronized the computer objects of the devices you want to be hybrid Azure AD joined to Azure AD. If the computer objects belong to specific organizational units (OU), then these OUs need to be configured for synchronization in Azure AD connect as well. To learn more on how to synchronize computer objects using Azure AD Connect, see the article on [Configure filtering using Azure AD Connect](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sync-configure-filtering#organizational-unitbased-filtering).

Beginning with version 1.1.819.0, Azure AD Connect provides you with a wizard to configure hybrid Azure AD join. The wizard enables you to significantly simplify the configuration process. The related wizard configures the service connection points (SCP) for device registration.

The configuration steps in this article are based on this wizard.

Hybrid Azure AD join requires the devices to have access to the following Microsoft resources from inside your organization's network:  

- `https://enterpriseregistration.windows.net`
- `https://login.microsoftonline.com`
- `https://device.login.microsoftonline.com`
- `https://autologon.microsoftazuread-sso.com` (If you are using or planning to use Seamless SSO)

If your organization requires access to the Internet via an outbound proxy, Microsoft recommends [implementing Web Proxy Auto-Discovery (WPAD)](https://docs.microsoft.com/previous-versions/tn-archive/cc995261(v%3dtechnet.10)) to enable Windows 10 computers to do device registration with Azure AD. If you are encountering issues with configuring and managing WPAD, go to [troubleshooting automatic detection](https://docs.microsoft.com/previous-versions/tn-archive/cc302643(v=technet.10)). 

If you are not using WPAD and need to configure proxy settings on your computer, you can do so starting with Windows 10 1709, by [configuring WinHTTP settings using a group policy object (GPO)](https://blogs.technet.microsoft.com/netgeeks/2018/06/19/winhttp-proxy-settings-deployed-by-gpo/).

> [!NOTE]
> If you configure proxy settings on your computer using WinHTTP settings, then any computers that are unable to connect to the configured proxy will fail to connect to the internet.

If your organization requires access to the Internet via an authenticated outbound proxy, you must make sure that your Windows 10 computers can successfully authenticate to the outbound proxy. Because Windows 10 computers run device registration using machine context, it is necessary to configure outbound proxy authentication using machine context. Follow up with your outbound proxy provider on the configuration requirements.

## Configure hybrid Azure AD join

To configure a hybrid Azure AD join using Azure AD Connect, you need:

- The credentials of a global administrator for your Azure AD tenant.  
- The enterprise administrator credentials for each of the forests.

**To configure a hybrid Azure AD join using Azure AD Connect:**

1. Launch Azure AD Connect, and then click **Configure**.

   ![Welcome](./media/hybrid-azuread-join-managed-domains/11.png)

1. On the **Additional tasks** page, select **Configure device options**, and then click **Next**.

   ![Additional tasks](./media/hybrid-azuread-join-managed-domains/12.png)

1. On the **Overview** page, click **Next**.

   ![Overview](./media/hybrid-azuread-join-managed-domains/13.png)

1. On the **Connect to Azure AD** page, enter the credentials of a global administrator for your Azure AD tenant.  

   ![Connect to Azure AD](./media/hybrid-azuread-join-managed-domains/14.png)

1. On the **Device options** page, select **Configure Hybrid Azure AD join**, and then click **Next**.

   ![Device options](./media/hybrid-azuread-join-managed-domains/15.png)

1. On the **SCP** page, for each forest you want Azure AD Connect to configure the SCP, perform the following steps, and then click **Next**:

   ![SCP](./media/hybrid-azuread-join-managed-domains/16.png)

   1. Select the forest.
   1. Select the authentication service.
   1. Click **Add** to enter the enterprise administrator credentials.

1. On the **Device operating systems** page, select the operating systems used by devices in your Active Directory environment, and then click **Next**.

   ![Device operating system](./media/hybrid-azuread-join-managed-domains/17.png)

1. On the **Ready to configure** page, click **Configure**.

   ![Ready to configure](./media/hybrid-azuread-join-managed-domains/19.png)

1. On the **Configuration complete** page, click **Exit**.

   ![Configuration complete](./media/hybrid-azuread-join-managed-domains/20.png)

## Enable Windows down-level devices

If some of your domain-joined devices are Windows down-level devices, you need to:

- Configure the local intranet settings for device registration
- Configure Seamless Single Sign-On (SSO)
- install Microsoft Workplace Join for Windows down-level computers

### Configure the local intranet settings for device registration

To successfully complete hybrid Azure AD join of your Windows down-level devices, and to avoid certificate prompts when devices authenticate to Azure AD you can push a policy to your domain-joined devices to add the following URLs to the Local Intranet zone in Internet Explorer:

- `https://device.login.microsoftonline.com`
- `https://autologon.microsoftazuread-sso.com`

Additionally, you need to enable **Allow updates to status bar via script** in the user’s local intranet zone.

### Configure Seamless SSO

To successfully complete hybrid Azure AD join of your Windows down-level devices in a managed domain that is using [Password Hash Sync (PHS)](https://docs.microsoft.com/azure/active-directory/hybrid/whatis-phs) or [Pass Through Authentication (PTA)](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-pta) as your Azure AD cloud authentication method, you must also [configure Seamless SSO](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sso-quick-start#step-2-enable-the-feature).

### Install Microsoft Workplace Join for Windows down-level computers

To register Windows down-level devices, organizations must install [Microsoft Workplace Join for non-Windows 10 computers](https://www.microsoft.com/download/details.aspx?id=53554) available on the Microsoft Download Center.

You can deploy the package by using a software distribution system like [System Center Configuration Manager](https://www.microsoft.com/cloud-platform/system-center-configuration-manager). The package supports the standard silent installation options with the quiet parameter. The current branch of Configuration Manager offers benefits over earlier versions, like the ability to track completed registrations.

The installer creates a scheduled task on the system that runs in the user context. The task is triggered when the user signs in to Windows. The task silently joins the device with Azure AD with the user credentials after authenticating with Azure AD.

## Verify the registration

To verify the device registration state in your Azure tenant, you can use the **[Get-MsolDevice](https://docs.microsoft.com/powershell/msonline/v1/get-msoldevice)** cmdlet in the **[Azure Active Directory PowerShell module](/powershell/azure/install-msonlinev1?view=azureadps-2.0)**.

When using the **Get-MSolDevice** cmdlet to check the service details:

- An object with the **device ID** that matches the ID on the Windows client must exist.
- The value for **DeviceTrustType** must be **Domain Joined**. This is equivalent to the **Hybrid Azure AD joined** state on the Devices page in the Azure AD portal.
- The value for **Enabled** must be **True** and **DeviceTrustLevel** must be **Managed** for devices that are used in conditional access.

**To check the service details:**

1. Open **Windows PowerShell** as administrator.
1. Type `Connect-MsolService` to connect to your Azure tenant.  
1. Type `get-msoldevice -deviceId <deviceId>`.
1. Verify that **Enabled** is set to **True**.

## Troubleshoot your implementation

If you are experiencing issues with completing hybrid Azure AD join for domain joined Windows devices, see:

- [Troubleshooting Hybrid Azure AD join for Windows current devices](troubleshoot-hybrid-join-windows-current.md)
- [Troubleshooting Hybrid Azure AD join for Windows down-level devices](troubleshoot-hybrid-join-windows-legacy.md)

## Next steps

- For more information about managing device identities in the Azure AD portal, see [managing device identities using the Azure portal](device-management-azure-portal.md).
