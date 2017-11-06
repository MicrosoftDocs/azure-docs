---
title: Azure Active Directory conditional access for VPN connectivity (preview)| Microsoft Docs
description: 'Learn how Azure Active Directory conditional access for VPN connectivity works. '
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
# Azure Active Directory conditional access for VPN connectivity (preview)

With [Azure Active Directory (Azure AD) conditional access](active-directory-conditional-access-azure-portal.md), you can fine-tune how authorized users access your resources. With Azure AD conditional access for virtual private network (VPN) connectivity, you can help protect your VPN connections.


To configure conditional access for VPN connectivity, you need to complete the following steps: 

1.	Configure your VPN server.
2.	Configure your VPN client.
3.	Configure your conditional access policy.


## Before you begin

This topic assumes that you're familiar with the following topics:

- [Conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md)
- [VPN and conditional access](https://docs.microsoft.com/windows/access-protection/vpn/vpn-conditional-access)

To gain insights on how Microsoft implements this feature, see [Enhancing remote access in Windows 10 with an automatic VPN profile](https://www.microsoft.com/itshowcase/Article/Content/894/Enhancing-remote-access-in-Windows-10-with-an-automatic-VPN-profile).   


## Prerequisites

To configure Azure Active Directory conditional access for VPN connectivity, you need to have a VPN server configured. 



## Step 1: Configure your VPN server 

This step configures root certificates for VPN authentication with Azure AD. To configure conditional access for VPN connectivity, you need to:

1. Create a VPN certificate in the Azure portal.
2. Download the VPN certificate.
2. Deploy the certificate to your VPN server.

Azure AD uses the VPN certificate to sign certificates issued to Windows 10 clients when authenticating to Azure AD for VPN connectivity. The token that the Windows 10 client requests is a certificate that it then presents to the application, which in this case is the VPN server.

![Download certificate for conditional access](./media/active-directory-conditional-access-vpn-connectivity-windows10/06.png)

In the Azure portal, you can create two certificates to manage the transition when one certificate is about to expire. When you create a certificate, you can choose whether it is the primary certificate, which is used during the authentication to sign the certificate for the connection.

To create a VPN certificate:

1. Sign in to your [Azure portal](https://portal.azure.com) as a global administrator.

2. On the left menu, click **Azure Active Directory**. 

    ![Select Azure Active Directory](./media/active-directory-conditional-access-vpn-connectivity-windows10/01.png)

3. On the **Azure Active Directory** page, in the **Manage** section, click **Conditional access**.

    ![Select Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/02.png)

4. On the **Conditional access** page, in the **Manage** section, click **VPN connectivity (preview)**.

    ![Select VPN connectivity](./media/active-directory-conditional-access-vpn-connectivity-windows10/03.png)

5. On the **VPN connectivity** page, click **New certificate**.

    ![Select new certificate](./media/active-directory-conditional-access-vpn-connectivity-windows10/04.png)

6. On the **New** page, perform the following steps:

    ![Select duration and primary](./media/active-directory-conditional-access-vpn-connectivity-windows10/05.png)

    a. For **Select duration**, select **1 year**.

    b. For **Primary**, select **Yes**.

    c. Click **Create**.

7. On the VPN connectivity page, click **Download certificate**.


You're now ready to deploy your newly created certificate to your VPN server. On your VPN server, add the downloaded certificate as a *trusted root CA for VPN authentication*.

For Windows RRAS-based deployments, on your NPS server, add the root certificate into the *Enterprise NTauth* store by running the following commands:

1. `certutil -dspublish <CACERT> RootCA`
2. `certutil -dspublish <CACERT> NtAuthCA`



## Step 2: Configure your VPN client 

In this step, you configure your VPN client connectivity profile as outlined in [VPN and conditional access](https://docs.microsoft.com/windows/access-protection/vpn/vpn-conditional-access).


## Step 3: Configure your conditional access policy

This section provides you with instructions for configuring your conditional access policy for VPN connectivity.


1. On the **Conditional Access** page, in the toolbar on the top, click **Add**.

    ![Select add on conditional access page](./media/active-directory-conditional-access-vpn-connectivity-windows10/07.png)

2. On the **New** page, in the **Name** box, type a name for your policy. For example, type **VPN policy**.

    ![Add name for policy on conditional access page](./media/active-directory-conditional-access-vpn-connectivity-windows10/08.png)

5. In the **Assignment** section, click **Users and groups**.

    ![Select users and groups](./media/active-directory-conditional-access-vpn-connectivity-windows10/09.png)

6. On the **Users and groups** page, perform the following steps:

    ![Select test user](./media/active-directory-conditional-access-vpn-connectivity-windows10/10.png)

    a. Click **Select users and groups**.

    b. Click **Select**.

    c. On the **Select** page, select your test user, and then click **Select**.

    d. On the **Users and groups** page, click **Done**.

7. On the **New** page, perform the following steps:

    ![Select cloud apps](./media/active-directory-conditional-access-vpn-connectivity-windows10/11.png)

    a. In the **Assignments** section, click **Cloud apps**.

    b. On the **Cloud apps** page, click **Select apps**, and then click **Select**.

    c. On the **Select** page, in the **Applications** box, type **vpn**.

    d. Select **VPN Server**.

    e. Click **Select**.


13. On the **New** page, to open the **Grant** page, in the **Controls** section, click **Grant**.

    ![Select grant](./media/active-directory-conditional-access-azure-portal-get-started/13.png)

14. On the **Grant** page, perform the following steps:

    ![Select require multi-factor authentication](./media/active-directory-conditional-access-azure-portal-get-started/14.png)

    a. Select **Require multi-factor authentication**.

    b. Click **Select**.

15. On the **New** page, under **Enable policy**, click **On**.

    ![Enable policy](./media/active-directory-conditional-access-azure-portal-get-started/15.png)

16. On the **New** page, click **Create**.



## Next steps

To gain insights into how Microsoft implements this feature, see [Enhancing remote access in Windows 10 with an automatic VPN profile](https://www.microsoft.com/itshowcase/Article/Content/894/Enhancing-remote-access-in-Windows-10-with-an-automatic-VPN-profile).    

