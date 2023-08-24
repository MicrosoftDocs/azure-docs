---
title: Configure hybrid Azure Active Directory join
description: Learn how to configure hybrid Azure Active Directory join.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: how-to
ms.date: 10/26/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Configure hybrid Azure AD join

Bringing your devices to Azure AD maximizes user productivity through single sign-on (SSO) across your cloud and on-premises resources. You can secure access to your resources with [Conditional Access](../conditional-access/howto-conditional-access-policy-compliant-device.md) at the same time.

> [!VIDEO https://www.youtube-nocookie.com/embed/hSCVR1oJhFI]

## Prerequisites

- [Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594) version 1.1.819.0 or later.
   - Don't exclude the default device attributes from your Azure AD Connect sync configuration. To learn more about default device attributes synced to Azure AD, see [Attributes synchronized by Azure AD Connect](../hybrid/reference-connect-sync-attributes-synchronized.md#windows-10).
   - If the computer objects of the devices you want to be hybrid Azure AD joined belong to specific organizational units (OUs), configure the correct OUs to sync in Azure AD Connect. To learn more about how to sync computer objects by using Azure AD Connect, see [Organizational unit–based filtering](../hybrid/how-to-connect-sync-configure-filtering.md#organizational-unitbased-filtering).
- Global Administrator credentials for your Azure AD tenant.
- Enterprise administrator credentials for each of the on-premises Active Directory Domain Services forests.
- (**For federated domains**) At least Windows Server 2012 R2 with Active Directory Federation Services installed.
- Users can register their devices with Azure AD. More information about this setting can be found under the heading **Configure device settings**, in the article, [Configure device settings](manage-device-identities.md#configure-device-settings).

### Network connectivity requirements

Hybrid Azure AD join requires devices to have access to the following Microsoft resources from inside your organization's network:  

- `https://enterpriseregistration.windows.net`
- `https://login.microsoftonline.com`
- `https://device.login.microsoftonline.com`
- `https://autologon.microsoftazuread-sso.com` (If you use or plan to use seamless SSO)
- Your organization's Security Token Service (STS) (**For federated domains**)

> [!WARNING]
> If your organization uses proxy servers that intercept SSL traffic for scenarios like data loss prevention or Azure AD tenant restrictions, ensure that traffic to `https://device.login.microsoftonline.com` is excluded from TLS break-and-inspect. Failure to exclude this URL may cause interference with client certificate authentication, cause issues with device registration, and device-based Conditional Access.

If your organization requires access to the internet via an outbound proxy, you can use [Web Proxy Auto-Discovery (WPAD)](/previous-versions/tn-archive/cc995261(v=technet.10)) to enable Windows 10 or newer computers for device registration with Azure AD. To address issues configuring and managing WPAD, see [Troubleshooting Automatic Detection](/previous-versions/tn-archive/cc302643(v=technet.10)).

If you don't use WPAD, you can configure WinHTTP proxy settings on your computer with a Group Policy Object (GPO) beginning with Windows 10 1709. For more information, see [WinHTTP Proxy Settings deployed by GPO](/archive/blogs/netgeeks/winhttp-proxy-settings-deployed-by-gpo).

> [!NOTE]
> If you configure proxy settings on your computer by using WinHTTP settings, any computers that can't connect to the configured proxy will fail to connect to the internet.

If your organization requires access to the internet via an authenticated outbound proxy, make sure that your Windows 10 or newer computers can successfully authenticate to the outbound proxy. Because Windows 10 or newer computers run device registration by using machine context, configure outbound proxy authentication by using machine context. Follow up with your outbound proxy provider on the configuration requirements.

Verify devices can access the required Microsoft resources under the system account by using the [Test Device Registration Connectivity](/samples/azure-samples/testdeviceregconnectivity/testdeviceregconnectivity/) script.

## Managed domains

We think most organizations will deploy hybrid Azure AD join with managed domains. Managed domains use [password hash sync (PHS)](../hybrid/whatis-phs.md) or [pass-through authentication (PTA)](../hybrid/how-to-connect-pta.md) with [seamless single sign-on](../hybrid/how-to-connect-sso.md). Managed domain scenarios don't require configuring a federation server.

Configure hybrid Azure AD join by using Azure AD Connect for a managed domain:

1. Start Azure AD Connect, and then select **Configure**.
1. In **Additional tasks**, select **Configure device options**, and then select **Next**.
1. In **Overview**, select **Next**.
1. In **Connect to Azure AD**, enter the credentials of a Global Administrator for your Azure AD tenant.
1. In **Device options**, select **Configure Hybrid Azure AD join**, and then select **Next**.
1. In **Device operating systems**, select the operating systems that devices in your Active Directory environment use, and then select **Next**.
1. In **SCP configuration**, for each forest where you want Azure AD Connect to configure the SCP, complete the following steps, and then select **Next**.
   1. Select the **Forest**.
   1. Select an **Authentication Service**.
   1. Select **Add** to enter the enterprise administrator credentials.

   ![Azure AD Connect SCP configuration managed domain](./media/how-to-hybrid-join/azure-ad-connect-scp-configuration-managed.png)

1. In **Ready to configure**, select **Configure**.
1. In **Configuration complete**, select **Exit**.

## Federated domains

A federated environment should have an identity provider that supports the following requirements. If you have a federated environment using Active Directory Federation Services (AD FS), then the below requirements are already supported.

- **WIAORMULTIAUTHN claim:** This claim is required to do hybrid Azure AD join for Windows down-level devices.
- **WS-Trust protocol:** This protocol is required to authenticate Windows current hybrid Azure AD joined devices with Azure AD. When you're using AD FS, you need to enable the following WS-Trust endpoints: 
   - `/adfs/services/trust/2005/windowstransport`
   - `/adfs/services/trust/13/windowstransport`
   - `/adfs/services/trust/2005/usernamemixed`
   - `/adfs/services/trust/13/usernamemixed`
   - `/adfs/services/trust/2005/certificatemixed`
   - `/adfs/services/trust/13/certificatemixed` 

> [!WARNING] 
> Both **adfs/services/trust/2005/windowstransport** and **adfs/services/trust/13/windowstransport** should be enabled as intranet facing endpoints only and must NOT be exposed as extranet facing endpoints through the Web Application Proxy. To learn more on how to disable WS-Trust Windows endpoints, see [Disable WS-Trust Windows endpoints on the proxy](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs#disable-ws-trust-windows-endpoints-on-the-proxy-ie-from-extranet). You can see what endpoints are enabled through the AD FS management console under **Service** > **Endpoints**.

Configure hybrid Azure AD join by using Azure AD Connect for a federated environment:

1. Start Azure AD Connect, and then select **Configure**.
1. On the **Additional tasks** page, select **Configure device options**, and then select **Next**.
1. On the **Overview** page, select **Next**.
1. On the **Connect to Azure AD** page, enter the credentials of a Global Administrator for your Azure AD tenant, and then select **Next**.
1. On the **Device options** page, select **Configure Hybrid Azure AD join**, and then select **Next**.
1. On the **SCP** page, complete the following steps, and then select **Next**:
   1. Select the forest.
   1. Select the authentication service. You must select **AD FS server** unless your organization has exclusively Windows 10 or newer clients and you have configured computer/device sync, or your organization uses seamless SSO.
   1. Select **Add** to enter the enterprise administrator credentials.
   
   ![Azure AD Connect SCP configuration federated domain](./media/how-to-hybrid-join/azure-ad-connect-scp-configuration-federated.png)

1. On the **Device operating systems** page, select the operating systems that the devices in your Active Directory environment use, and then select **Next**.
1. On the **Federation configuration** page, enter the credentials of your AD FS administrator, and then select **Next**.
1. On the **Ready to configure** page, select **Configure**.
1. On the **Configuration complete** page, select **Exit**.

### Federation caveats

With Windows 10 1803 or newer, if instantaneous hybrid Azure AD join for a federated environment using AD FS fails, we rely on Azure AD Connect to sync the computer object in Azure AD that's then used to complete the device registration for hybrid Azure AD join.

## Other scenarios

Organizations can test hybrid Azure AD join on a subset of their environment before a full rollout. The steps to complete a targeted deployment can be found in the article [Hybrid Azure AD join targeted deployment](hybrid-join-control.md). Organizations should include a sample of users from varying roles and profiles in this pilot group. A targeted rollout helps identify any issues your plan may not have addressed before you enable for the entire organization.

Some organizations may not be able to use Azure AD Connect to configure AD FS. The steps to configure the claims manually can be found in the article [Configure hybrid Azure Active Directory join manually](hybrid-join-manual.md).

### US Government cloud (inclusive of GCCHigh and DoD)

For organizations in [Azure Government](https://azure.microsoft.com/global-infrastructure/government/), hybrid Azure AD join requires devices to have access to the following Microsoft resources from inside your organization's network:  

- `https://enterpriseregistration.windows.net` **and** `https://enterpriseregistration.microsoftonline.us`
- `https://login.microsoftonline.us`
- `https://device.login.microsoftonline.us`
- `https://autologon.microsoft.us` (If you use or plan to use seamless SSO)

## Troubleshoot hybrid Azure AD join

If you experience issues with completing hybrid Azure AD join for domain-joined Windows devices, see:

- [Troubleshooting devices using dsregcmd command](./troubleshoot-device-dsregcmd.md)
- [Troubleshoot hybrid Azure AD join for Windows current devices](troubleshoot-hybrid-join-windows-current.md)
- [Troubleshoot hybrid Azure AD join for Windows downlevel devices](troubleshoot-hybrid-join-windows-legacy.md)
- [Troubleshoot pending device state](/troubleshoot/azure/active-directory/pending-devices)

## Next steps

- [Downlevel device enablement](how-to-hybrid-join-downlevel.md)
- [Hybrid Azure AD join verification](how-to-hybrid-join-verify.md)
- [Use Conditional Access to require compliant or hybrid Azure AD joined device](../conditional-access/howto-conditional-access-policy-compliant-device.md)
- [Planning a Windows Hello for Business Deployment](/windows/security/identity-protection/hello-for-business/hello-planning-guide)
