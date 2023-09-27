---
title: 'Tutorial: Microsoft Entra integration with E Sales Manager Remix'
description: Learn how to configure single sign-on between Microsoft Entra ID and E Sales Manager Remix.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---
# Integrate Microsoft Entra ID with E Sales Manager Remix

In this tutorial, you learn how to integrate Microsoft Entra ID with E Sales Manager Remix.

By integrating Microsoft Entra ID with E Sales Manager Remix, you get the following benefits:

- You can control in Microsoft Entra ID who has access to E Sales Manager Remix.
- You can enable your users to get signed in automatically to E Sales Manager Remix (single sign-on, or SSO) with their Microsoft Entra accounts.
- You can manage your accounts in one central location, the Azure portal.

To learn more about SaaS app integration with Microsoft Entra ID, see [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Microsoft Entra integration with E Sales Manager Remix, you need the following items:

- A Microsoft Entra subscription
- An E Sales Manager Remix SSO-enabled subscription

> [!NOTE]
> When you test the steps in this tutorial, we recommend that you do *not* use a production environment.

To test the steps in this tutorial, follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have a Microsoft Entra trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Microsoft Entra single sign-on in a test environment. 

The scenario outlined in this tutorial consists of two main building blocks:

* Adding E Sales Manager Remix from the gallery
* Configuring and testing Microsoft Entra single sign-on

## Add E Sales Manager Remix from the gallery
To configure the integration of Microsoft Entra ID with E Sales Manager Remix, add E Sales Manager Remix from the gallery to your list of managed SaaS apps by doing the following:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

	![The "Enterprise applications" window][2]
	
1. To add a new application, select **New application** at the top of the window.

	![The New application button][3]

1. In the search box, type **E Sales Manager Remix**, select **E Sales Manager Remix** in the results list, and then select **Add**.

	![E Sales Manager Remix in the results list](./media/esalesmanagerremix-tutorial/tutorial_esalesmanagerremix_addfromgallery.png)

<a name='configure-and-test-azure-ad-single-sign-on'></a>

## Configure and test Microsoft Entra single sign-on

In this section, you configure and test Microsoft Entra single sign-on with E Sales Manager Remix, based on a test user called "Britta Simon."

For single sign-on to work, Microsoft Entra ID needs to identify the E Sales Manager Remix user and its counterpart in Microsoft Entra ID. In other words, a link relationship between a Microsoft Entra user and the same user in E Sales Manager Remix must be established.

To configure and test Microsoft Entra single sign-on with E Sales Manager Remix, complete the building blocks in the next five sections:

<a name='configure-azure-ad-single-sign-on'></a>

### Configure Microsoft Entra single sign-on

Enable Microsoft Entra single sign-on in the Azure portal and configure single sign-on in your E Sales Manager Remix application by doing the following:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **E Sales Manager Remix** application integration page, select **Single sign-on**.

	![The "Single sign-on" link][4]

1. In the **Single sign-on** window, in the **Single Sign-on Mode** box, select **SAML-based Sign-on**.
 
	![The "Single sign-on" window](./media/esalesmanagerremix-tutorial/tutorial_esalesmanagerremix_samlbase.png)

1. Under **E Sales Manager Remix Domain and URLs**, do the following:

	![E Sales Manager Remix Domain and URLs single sign-on information](./media/esalesmanagerremix-tutorial/tutorial_esalesmanagerremix_url.png)

    a. In the **Sign-on URL** box, type a URL in the following format: *https://\<Server-Based-URL>/\<sub-domain>/esales-pc*.

	b. In the **Identifier** box, type a URL in the following format: *https://\<Server-Based-URL>/\<sub-domain>/*.

	c. Note the **Identifier** value for later use in this tutorial.
	
	> [!NOTE] 
	> The preceding values are not real. Update them with the actual sign-in URL and identifier. To obtain the values, contact [E Sales Manager Remix Client support team](mailto:esupport@softbrain.co.jp).

1. Under **SAML Signing Certificate**, select **Certificate (Base64)**, and then save the certificate file on your computer.

	![The Certificate (Base64) download link](./media/esalesmanagerremix-tutorial/tutorial_esalesmanagerremix_certificate.png) 

1. Select the **View and edit all other user attributes** check box, and then select the **emailaddress** attribute.
	
	![The User Attributes window](./media/esalesmanagerremix-tutorial/configure1.png)

    The **Edit Attribute** window opens.

1. Copy the **Namespace** and **Name** values. Generate the value in the pattern *\<Namespace>/\<Name>*, and save it for later use in this tutorial.

	![The Edit Attribute window](./media/esalesmanagerremix-tutorial/configure2.png)

1. Under **E Sales Manager Remix Configuration**, select **Configure E Sales Manager Remix**.

	![Screenshot that shows the "E Sales Manager Remix Configuration" section with "Configure E Sales Manager Remix" selected.](./media/esalesmanagerremix-tutorial/tutorial_esalesmanagerremix_configure.png) 

    The **Configure sign-on** window opens.

1. In the **Quick Reference** section, copy the sign-out URL and the SAML single sign-on service URL.

1. Select **Save**.

	![The Save button](./media/esalesmanagerremix-tutorial/tutorial_general_400.png)

1. Sign in to your E Sales Manager Remix application as an administrator.

1. At the top right, select **To Administrator Menu**.

	![The "To Administrator Menu" command](./media/esalesmanagerremix-tutorial/configure4.png)

1. In the left pane, select **System settings** > **Cooperation with external system**.

	![The "System settings" and "Cooperation with external system" links](./media/esalesmanagerremix-tutorial/configure5.png)
	
1. In the **Cooperation with external system** window, select **SAML**.

	![The "Cooperation with external system" window](./media/esalesmanagerremix-tutorial/configure6.png)

1. Under **SAML authentication setting**, do the following:

	![The "SAML authentication setting" section](./media/esalesmanagerremix-tutorial/configure3.png)
	
	a. Select the **PC version** check box.
	
	b. In the **Collaboration item** section, in the drop-down list, select **email**.

	c. In the **Collaboration item** box, paste the claim value that you copied earlier (that is, **`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`**).

	d. In the **Issuer (entity ID)** box, paste the identifier value that you copied earlier from the **E Sales Manager Remix Domain and URLs** section.

	e. To upload your downloaded certificate, select **File selection**.

	f. In the **ID provider login URL** box, paste the SAML single sign-on service URL that you copied earlier.

	g. In **Identity Provider Logout URL** box, paste the sign-out URL value that you copied earlier.

	h. Select **Setting complete**.

> [!TIP]
> As you're setting up the app, you can read a concise version of the preceding instructions in the [Azure portal](https://portal.azure.com). After you've added the app in the **Active Directory** > **Enterprise Applications** section, select the **Single Sign-On** tab, and then access the embedded documentation in the **Configuration** section at the bottom. For more information about the embedded documentation feature, see [Microsoft Entra ID embedded documentation](https://go.microsoft.com/fwlink/?linkid=845985).
> 

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you create test user.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.
 
### Create an E Sales Manager Remix test user

1. Sign on to your E Sales Manager Remix application as an administrator.

1. Select **To Administrator Menu** from the menu at the top right.

	![E Sales Manager Remix Configuration](./media/esalesmanagerremix-tutorial/configure4.png)

1. Select **Your company's settings** > **Maintenance of departments and employees**, and then select **Employees registered**.

	![The "Employees registered" tab](./media/esalesmanagerremix-tutorial/user1.png)

1. In the **New employee registration** section, do the following:
	
	![The "New employee registration" section](./media/esalesmanagerremix-tutorial/user2.png)

	a. In the **Employee Name** box, type the name of the user (for example, **Britta**).

	b. Complete the remaining required fields.
	
	c. If you enable SAML, the administrator cannot sign in from the sign-in page. Grant administrator sign-in privileges to the user by selecting the **Admin Login** check box.

	d. Select **Registration**.

1. In the future, to sign in as an administrator, sign in as the user who has administrator permissions and then, at the top right, select **To Administrator Menu**.

	![The "To Administrator Menu" command](./media/esalesmanagerremix-tutorial/configure4.png)

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you enable user Britta Simon to use Azure single sign-on by granting access to E Sales Manager Remix. To do so, do the following: 

![Assign the user role][200] 

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

	![The "Enterprise applications" and "All applications" links][201] 

1. In the **Applications** list, select **E Sales Manager Remix**.

	![The E Sales Manager Remix link](./media/esalesmanagerremix-tutorial/tutorial_esalesmanagerremix_app.png)  

1. In the left pane, select **Users and groups**.

	![The "Users and groups" link][202]

1. Select **Add** and then, in the **Add Assignment** pane, select **Users and groups**.

	![The Add Assignment pane][203]

1. In the **Users and groups** window, in the **Users** list, select **Britta Simon**.

1. Select the **Select** button.

1. In the **Add Assignment** window, select **Assign**.
	
### Test single sign-on

In this section, you test your Microsoft Entra single sign-on configuration by using the Access Panel.

When you select the E Sales Manager Remix tile in the Access Panel, you should be signed in automatically to your E Sales Manager Remix application.

For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510). 

## Additional resources

* [List of tutorials about integrating SaaS apps with Microsoft Entra ID](tutorial-list.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/esalesmanagerremix-tutorial/tutorial_general_01.png
[2]: ./media/esalesmanagerremix-tutorial/tutorial_general_02.png
[3]: ./media/esalesmanagerremix-tutorial/tutorial_general_03.png
[4]: ./media/esalesmanagerremix-tutorial/tutorial_general_04.png

[100]: ./media/esalesmanagerremix-tutorial/tutorial_general_100.png

[200]: ./media/esalesmanagerremix-tutorial/tutorial_general_200.png
[201]: ./media/esalesmanagerremix-tutorial/tutorial_general_201.png
[202]: ./media/esalesmanagerremix-tutorial/tutorial_general_202.png
[203]: ./media/esalesmanagerremix-tutorial/tutorial_general_203.png
