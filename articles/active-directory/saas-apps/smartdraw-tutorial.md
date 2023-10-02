---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with SmartDraw'
description: Learn how to configure single sign-on between Microsoft Entra ID and SmartDraw.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with SmartDraw

In this tutorial, you'll learn how to integrate SmartDraw with Microsoft Entra ID. When you integrate SmartDraw with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to SmartDraw.
* Enable your users to be automatically signed-in to SmartDraw with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SmartDraw single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* SmartDraw supports **SP and IDP** initiated SSO.
* SmartDraw supports **Just In Time** user provisioning.

## Add SmartDraw from the gallery

To configure the integration of SmartDraw into Microsoft Entra ID, you need to add SmartDraw from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SmartDraw** in the search box.
1. Select **SmartDraw** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-smartdraw'></a>

## Configure and test Microsoft Entra SSO for SmartDraw

Configure and test Microsoft Entra SSO with SmartDraw using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in SmartDraw.

To configure and test Microsoft Entra SSO with SmartDraw, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure SmartDraw SSO](#configure-smartdraw-sso)** - to configure the single sign-on settings on application side.
    1. **[Create SmartDraw test user](#create-smartdraw-test-user)** - to have a counterpart of B.Simon in SmartDraw that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SmartDraw** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://cloud.smartdraw.com/sso/saml/login/<DOMAIN>`

    > [!NOTE]
	> The Sign-on URL value is not real. You will update the Sign-on URL value with the actual Sign-on URL, which is explained later in the tutorial. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Click **Save**.

1. SmartDraw application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, SmartDraw application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name | Source Attribute|
	| ---------------| --------------- |
	| FirstName | user.givenname |
	| LastName | user.surname |
	| Email | user.mail |
	| Groups | user.groups |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up SmartDraw** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable B.Simon to use single sign-on by granting access to SmartDraw.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SmartDraw**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SmartDraw SSO




1. In a different web browser window, sign in to your SmartDraw company site as an administrator

1. Click on **Single Sign-On** under Manage your SmartDraw License.

	![Screenshot shows the Manage your SmartDraw License dialog box where you can select Single Sign-On.](./media/smartdraw-tutorial/single-sign-on.png)

1. On the Configuration page, perform the following steps:

	![Screenshot shows the Configuration page where you can enter the values described.](./media/smartdraw-tutorial/configuration.png)

	a. In the **Your Domain (like acme.com)** textbox, type your domain.

	b. Copy the **Your SP Initiated Login Url will be** for your instance and paste it in Sign-on URL textbox in **Basic SAML Configuration** on Azure portal.

	c. In the **Security Groups to Allow SmartDraw Access** textbox, type **Everyone**.

	d. In the **Your SAML Issuer Url** textbox, paste the value of **Microsoft Entra Identifier** which you copied previously.

	e. In Notepad, open the Metadata XML file that you downloaded, copy its content, and then paste it into the **Your SAML MetaData** box.

	f. Click **Save Configuration**	

### Create SmartDraw test user

In this section, a user called B.Simon is created in SmartDraw. SmartDraw supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in SmartDraw, a new one is created after authentication.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to SmartDraw Sign on URL where you can initiate the login flow.  

* Go to SmartDraw Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the SmartDraw for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the SmartDraw tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the SmartDraw for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure SmartDraw you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
