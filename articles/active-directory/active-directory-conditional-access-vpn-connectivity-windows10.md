---
title: Azure Active Directory conditional access for virtual private network connectivity (preview)| Microsoft Docs
description: 'Learn how Azure Active Directory conditional access for virtual private network connectivity works. '
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: 51a1ee61-3ffe-4f65-b8de-ff21903e1e74
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/01/2017
ms.author: markvi
ms.reviewer: jairoc

---
# Azure Active Directory conditional access for virtual private network connectivity (preview)

With [Azure Active Directory (Azure AD) conditional access](active-directory-conditional-access-azure-portal.md), you can fine-tune how authorized users can access your resources. Azure AD conditional access for virtual private network (VPN) connectivity enables you to use conditional access to protect your VPN connections.


To configure Azure AD conditional access for VPN connectivity, you need to complete the following steps: 

1.	Configure your VPN server
2.	Configure your VPN client 
3.	Configure your conditional access policy
4.	Verification


## Before you begin

This topic assumes that you are familiar with the following topics:

- [Conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md)
- [VPN and conditional access](https://docs.microsoft.com/windows/access-protection/vpn/vpn-conditional-access)

You might also want to take a look at [Enhancing remote access in Windows 10 with an automatic VPN profile](https://www.microsoft.com/itshowcase/Article/Content/894/Enhancing-remote-access-in-Windows-10-with-an-automatic-VPN-profile) to gain insights on how Microsoft has implemented this feature.   


## Prerequisites

To configure Azure Active Directory conditional access for virtual private network connectivity, you need to have a VPN server configured. 



## Step 1 - Configure your VPN server 

The objective of this step is to configure root certificates for VPN authentication with Azure AD. To configure conditional access for virtual private network connectivity, you need to:

1. Create a VPN certificate in the Azure portal
2. Download the VPN certificate
2. Deploy the certificate to your VPN server

The VPN certificate is the issuer used by Azure AD to sign certificates issued to Windows 10 clients when authenticating to Azure AD for VPN connectivity. Imagine, that the token the Windows 10 client requests is a certificate that then presents to the application which in this case is the VPN server.

![Conditional access](./media/active-directory-conditional-access-vpn-connectivity-windows10/06.png)

In the Azure portal, you can create two certificates to manage the transitions when a certificate is about to expire. When you create a certificate, you can choose whether the certificate is the primary primary certificate. The primary certificate is the one that is actually used during the authentication to sign the certificate for the 
connection.


**To create a VPN certificate:**

1. Sign-in to your [Azure portal](https://portal.azure.com) as global administrator.

2. On the left navbar, click **Azure Active Directory**. 

    ![VPN connectivity](./media/active-directory-conditional-access-vpn-connectivity-windows10/01.png)

3. On the **Azure Active Directory** page, in the **Manage** section, click **Conditional access**.

    ![VPN connectivity](./media/active-directory-conditional-access-azure-portal-get-started/02.png)

4. On the **Conditional access** page, in the **Manage** section, click **VPN connectivity (preview)**.

    ![VPN connectivity](./media/active-directory-conditional-access-vpn-connectivity-windows10/03.png)

5. On the **VPN connectivity** page, click **New certificate**.

    ![VPN connectivity](./media/active-directory-conditional-access-vpn-connectivity-windows10/04.png)

6. On the **New** page, perform the following steps:

    ![VPN connectivity](./media/active-directory-conditional-access-vpn-connectivity-windows10/05.png)

    a. As **duration**, select **1 year**.

    b. As **Primary**, select **Yes**.

    c. Click **Create**.

7. On the VPN connectivity page, click **Download certificate**.


At this point, you are ready to deploy you newly created certificate to your VPN server. On your VPN Server, you need to add the downloaded certificate as a *trusted root CA for VPN authentication*.

For Windows RRAS based deployments, on your NPS Server, you need to add the root cert into the *Enterprise NTauth* store running the following commands:

1. `certutil -dspublish <CACERT> RootCA`
2. `certutil -dspublish <CACERT> NtAuthCA`



## Step 2 - Configure your VPN client 

In this step, you need to configure your VPN client connectivity profile as outlined in [VPN and conditional access](https://docs.microsoft.com/windows/access-protection/vpn/vpn-conditional-access).


## Step 3 - Configure your conditional access policy

This section provides you with instructions for configuring your conditional access policy for VPN connectivity.

**To configure the conditional access policy:** 

1. On the **Conditional Access** page, in the toolbar on the top, click **Add**.

    ![Conditional access](./media/active-directory-conditional-access-vpn-connectivity-windows10/07.png)

2. On the **New** page, in the **Name** textbox, type a name for your policy, for example, **VPN policy**.

    ![Conditional access](./media/active-directory-conditional-access-vpn-connectivity-windows10/08.png)

5. In the **Assignment** section, click **Users and groups**.

    ![Conditional access](./media/active-directory-conditional-access-vpn-connectivity-windows10/09.png)

6. On the **Users and groups** page, perform the following steps:

    ![Conditional access](./media/active-directory-conditional-access-vpn-connectivity-windows10/10.png)

    a. Click **Select users and groups**.

    b. Click **Select**.

    c. On the **Select** page, select your test user, and then click **Select**.

    d. On the **Users and groups** page, click **Done**.

7. On the **New** page, perform the following steps.

    ![Conditional access](./media/active-directory-conditional-access-vpn-connectivity-windows10/11.png)

    a. In the **Assignments** section, click **Cloud apps**.

    b. On the **Cloud apps** page, click **Select apps**, and then click **Select**.

    c. On the **Select** page, in the **Applications** textbox, type **vpn**.

    d. Select **VPN Server**.

    e. Click **Select**.


13. On the **New** page, to open the **Grant** page, in the **Controls** section, click **Grant**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/13.png)

14. On the **Grant** page, perform the following steps:

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/14.png)

    a. Select **Require multi-factor authentication**.

    b. Click **Select**.

15. On the **New** page, under **Enable policy**, click **On**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/15.png)

16. On the **New** page, click **Create**.



## Next steps

To gain insights on how Microsoft has implemented this feature, see [enhancing remote access in Windows 10 with an automatic VPN profile](https://www.microsoft.com/itshowcase/Article/Content/894/Enhancing-remote-access-in-Windows-10-with-an-automatic-VPN-profile).    

