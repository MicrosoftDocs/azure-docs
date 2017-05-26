---
title: Get started with conditional access in Azure Active Directory | Microsoft Docs
description: Test conditional access using a location condition.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: 
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/04/2017
ms.author: markvi

---
# Get started with conditional access in Azure Active Directory

Conditional access is a capability of Azure Active Directory that enables you to define conditions under which authorized users can access your apps. 

This topic provides you with instructions for testing a conditional access based on a location condition in your environment.  


## Scenario description

One common requirement in many organizations is to only require multi-factor authentication for access to apps that is not performed from the corporate intranet. With Azure Active Directory, you can easily accomplish this goal by configuring a location-based conditional access policy. This topic provides you with detailed instructions for configuring a related policy. The policy leverages [Trusted IPs](../multi-factor-authentication/multi-factor-authentication-whats-next.md#trusted-ips) to distinguish between access attempts made from the corporate's intranet and all other locations.


## Prerequisites

The scenario outlined in this topic assumes that you are familiar with the concepts outlined in [Azure Active Directory conditional access](active-directory-conditional-access-azure-portal.md).

To test this scenario, you need to:

- Create a test user 

- Assign an Azure AD Premium license to the test user

- Configure a managed app and assign your test user to it

- Configure trusted IPs

If you need more details about Trusted IPs, see [Trusted IPs](../multi-factor-authentication/multi-factor-authentication-whats-next.md#trusted-ips).


## Policy configuration steps

**To configure your conditional access policy, do:**

1. In the Azure portal, on the left navbar, click **Azure Active Directory**. 

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/01.png)

2. On the **Azure Active Directory** blade, in the **Manage** section, click **Conditional access**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/02.png)
 
3. On the **Conditional Access** blade, to open the **New** blade, in the toolbar on the top, click **Add**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/03.png)

4. On the **New** blade, in the **Name** textbox, type a name for your policy.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/04.png)

5. In the **Assignment** section, click **Users and groups**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/05.png)

6. On the **Users and groups** blade, perform the following steps:

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/06.png)

    a. Click **Select users and groups**.

    b. Click **Select**.

    c. On the **Select** blade, select your test user, and then click **Select**.

    d. On the **Users and groups** blade, click **Done**.

7. On the **New** blade, to open the **Cloud apps** blade, in the **Assignment** section, click **Cloud apps**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/07.png)

8. On the **Cloud apps** blade, perform the following steps:

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/08.png)

    a. Click **Select apps**.

    b. Click **Select**.

    c. On the **Select** blade, select your cloud app, and then click **Select**.

    d. On the **Cloud apps** blade, click **Done**.

9. On the **New** blade, to open the **Conditions** blade, in the **Assignment** section, click **Conditions**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/09.png)

10. On the **Conditions** blade, to open the **Locations** blade, click **Locations**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/10.png)

11. On the **Locations** blade, perform the following steps:

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/11.png)

    a. Under **Configure**, click **Yes**.

    b. Under **Include**, click **All locations**.

    c. Click **Exclude**, and then click **All trusted IPs**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/12.png)

    d. Click **Done**.

12. On the **Conditions** blade, click **Done**.

13. On the **New** blade, to open the **Grant** blade, in the **Controls** section, click **Grant**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/13.png)

14. On the **Grant** blade, perform the following steps:

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/14.png)

    a. Select **Require multi-factor authentication**.

    b. Click **Select**.

15. On the **New** blade, under **Enable policy**, click **On**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/15.png)

16. On the **New** blade, click **Create**.


## Testing the policy

To test your policy, you should access your app from a device that: 

1. Has an IP address that is within your configured Trusted IPs 

1. Has an IP address that is not within your configured Trusted IPs

Multi-factor authentication should only be required during a connection attempt that was made from a device that is not within your configured Trusted IPs. 


## Next steps

If you would like to learn more about conditional access, see [Azure Active Directory conditional access](active-directory-conditional-access-azure-portal.md).

