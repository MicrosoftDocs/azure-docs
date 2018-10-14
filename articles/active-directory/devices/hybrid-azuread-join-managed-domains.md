---
title: How to configure hybrid Azure Active Directory joined devices | Microsoft Docs
description: Learn how to configure hybrid Azure Active Directory joined devices.
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
ms.topic: tutorial
ms.date: 08/25/2018
ms.author: markvi
ms.reviewer: sandeo

#Customer intent: As a IT admin, I want to setup hybrid Azure AD joined devices so that I can automatically bring AD domain-joined devices under control

---
# Tutorial: Configure hybrid Azure Active Directory join for managed domains

In a similar way to a user, a device is becoming another identity you want to protect and also use to protect your resources at any time and location. You can accomplish this goal by bringing your devices' identities to Azure AD using one of the following methods:

- Azure AD join
- Hybrid Azure AD join
- Azure AD registration

By bringing your devices to Azure AD, you maximize your users' productivity through single sign-on (SSO) across your cloud and on-premises resources. At the same time, you can secure access to your cloud and on-premises resources with [conditional access](../active-directory-conditional-access-azure-portal.md).

In this tutorial, you learn how to configure hybrid Azure AD join for devices in managed domains.

> [!div class="checklist"]
> * Configure hybrid Azure AD join
> * Enable Windows down-level devices
> * Verify joined devices 
> * Troubleshoot 


## Prerequisites

This tutorial assumes that you are familiar with:
    
-  [Introduction to device management in Azure Active Directory](../device-management-introduction.md)
    
-  [How to plan your hybrid Azure Active Directory join implementation](hybrid-azuread-join-plan.md)

-  [How to control the hybrid Azure AD join of your devices](hybrid-azuread-join-control.md)
  

To configure the scenario in this article, you need the [latest version of Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594) (1.1.819.0 or higher) to be installed. 

Verify that Azure AD Connect has synchronized the computer objects of the devices you want to be hybrid Azure AD joined to Azure AD. If the computer objects belong to specific organizational units (OU), then these OUs need to be configured for synchronization in Azure AD connect as well.

Beginning with version 1.1.819.0, Azure AD Connect provides you with a wizard to configure hybrid Azure AD join. The wizard enables you to significantly simplify the configuration process. The related wizard configures the service connection points (SCP) for device registration.

The configuration steps in this article are based on this wizard. 

Hybrid Azure AD join requires the devices to have access to the following Microsoft resources from inside your organization's network:  

- https://enterpriseregistration.windows.net
- https://login.microsoftonline.com
- https://device.login.microsoftonline.com
- https://autologon.microsoftazuread-sso.com (If you are using or planning to use Seamless SSO)

If your organization requires access to the Internet via an outbound proxy, starting with Windows 10 1709, you can [configure proxy settings on your computer using a group policy object (GPO)](https://blogs.technet.microsoft.com/netgeeks/2018/06/19/winhttp-proxy-settings-deployed-by-gpo/). If your computer is running anything older than Windows 10 1709, you must implement Web Proxy Auto-Discovery (WPAD) to enable Windows 10 computers to do device registration with Azure AD. 

If your organization requires access to the Internet via an authenticated outbound proxy, you must make sure that your Windows 10 computers can successfully authenticate to the outbound proxy. Because Windows 10 computers run device registration using machine context, it is necessary to configure outbound proxy authentication using machine context. Follow up with your outbound proxy provider on the configuration requirements. 



## Configure hybrid Azure AD join

To configure a hybrid Azure AD join using Azure AD Connect, you need:

- The credentials of a global administrator for your Azure AD tenant.  

- The enterprise administrator credentials for each of the forests.


**To configure a hybrid Azure AD join using Azure AD Connect:**

1. Launch Azure AD Connect, and then click **Configure**.

    ![Welcome](./media/hybrid-azuread-join-managed-domains/11.png)

2. On the **Additional tasks** page, select **Configure device options**, and then click **Next**. 

    ![Additional tasks](./media/hybrid-azuread-join-managed-domains/12.png)

3. On the **Overview** page, click **Next**. 

    ![Overview](./media/hybrid-azuread-join-managed-domains/13.png)

4. On the **Connect to Azure AD** page, enter the credentials of a global administrator for your Azure AD tenant.  

    ![Connect to Azure AD](./media/hybrid-azuread-join-managed-domains/14.png)

5. On the **Device options** page, select **Configure Hybrid Azure AD join**, and then click **Next**. 

    ![Device options](./media/hybrid-azuread-join-managed-domains/15.png)

6. On the **SCP** page, for each forest you want Azure AD Connect to configure the SCP, perform the following steps, and then click **Next**: 

    ![SCP](./media/hybrid-azuread-join-managed-domains/16.png)

    a. Select the forest.

    b. Select the authentication service.

    c. Click **Add** to enter the enterprise administrator credentials.


7. On the **Device operating systems** page, select the operating systems used by devices in your Active Directory environment, and then click **Next**. 

    ![Device operating system](./media/hybrid-azuread-join-managed-domains/17.png)


8. On the **Ready to configure** page, click **Configure**. 

    ![Ready to configure](./media/hybrid-azuread-join-managed-domains/19.png)

9. On the **Configuration complete** page, click **Exit**. 

    ![Configuration complete](./media/hybrid-azuread-join-managed-domains/20.png)




## Enable Windows down-level devices

If some of your domain-joined devices are Windows down-level devices, you need to:

- Update device settings
 
- Configure the local intranet settings for device registration

### Update device settings 

To register Windows down-level devices, you need to make sure that the device settings to allow users to register devices in Azure AD are set. In the Azure portal, you can find this setting  under:

`Home > [Name of your tenant] > Devices - Device settings`  


    
The following policy must be set to **All**: **Users may register their devices with Azure AD**

![Register devices](media/hybrid-azuread-join-managed-domains/23.png)



### Configure the local intranet settings for device registration

To successfully complete hybrid Azure AD join of your Windows down-level devices, and to avoid certificate prompts when devices authenticate to Azure AD you can push a policy to your domain-joined devices to add the following URLs to the Local Intranet zone in Internet Explorer:

- `https://device.login.microsoftonline.com`

- `https://autologon.microsoftazuread-sso.com`.

Additionally, you need to enable **Allow updates to status bar via script** in the user’s local intranet zone.

## Verify the registration

To verify the device registration state in your Azure tenant, you can use the **[Get-MsolDevice](https://docs.microsoft.com/powershell/msonline/v1/get-msoldevice)** cmdlet in the **[Azure Active Directory PowerShell module](/powershell/azure/install-msonlinev1?view=azureadps-2.0)**.

When using the **Get-MSolDevice** cmdlet to check the service details:

- An object with the **device id** that matches the ID on the Windows client must exist.
- The value for **DeviceTrustType** must be **Domain Joined**. This is equivalent to the **Hybrid Azure AD joined** state on the Devices page in the Azure AD portal.
- The value for **Enabled** must be **True** and **DeviceTrustLevel** must be **Managed** for devices that are used in conditional access. 


**To check the service details:**

1. Open **Windows PowerShell** as administrator.

2. Type `Connect-MsolService` to connect to your Azure tenant.  

3. Type `get-msoldevice -deviceId <deviceId>`.

6. Verify that **Enabled** is set to **True**.





## Troubleshoot your implementation

If you are experiencing issues with completing hybrid Azure AD join for domain joined Windows devices, see:

- [Troubleshooting Hybrid Azure AD join for Windows current devices](troubleshoot-hybrid-join-windows-current.md)
- [Troubleshooting Hybrid Azure AD join for Windows down-level devices](troubleshoot-hybrid-join-windows-legacy.md)


## Next steps

> [!div class="nextstepaction"]
> [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)
> [Configure hybrid Azure Active Directory join manually](hybrid-azuread-join-manual-steps.md)

