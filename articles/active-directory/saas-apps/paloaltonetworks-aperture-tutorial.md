---
title: 'Tutorial: Microsoft Entra integration with Palo Alto Networks - Aperture'
description: Learn how to configure single sign-on between Microsoft Entra ID and Palo Alto Networks - Aperture.
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
# Tutorial: Microsoft Entra integration with Palo Alto Networks - Aperture

In this tutorial, you'll learn how to integrate Palo Alto Networks - Aperture with Microsoft Entra ID. When you integrate Palo Alto Networks - Aperture with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Palo Alto Networks - Aperture.
* Enable your users to be automatically signed-in to Palo Alto Networks - Aperture with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Palo Alto Networks - Aperture single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* Palo Alto Networks - Aperture supports **SP** and **IDP** initiated SSO.

## Add Palo Alto Networks - Aperture from the gallery

To configure the integration of Palo Alto Networks - Aperture into Microsoft Entra ID, you need to add Palo Alto Networks - Aperture from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Palo Alto Networks - Aperture** in the search box.
1. Select **Palo Alto Networks - Aperture** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso'></a>

## Configure and test Microsoft Entra SSO

In this section, you configure and test Microsoft Entra single sign-on with Palo Alto Networks - Aperture based on a test user called **B.Simon**.
For single sign-on to work, a link relationship between a Microsoft Entra user and the related user in Palo Alto Networks - Aperture needs to be established.

To configure and test Microsoft Entra single sign-on with Palo Alto Networks - Aperture, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
	1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
2. **[Configure Palo Alto Networks - Aperture SSO](#configure-palo-alto-networks---aperture-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create Palo Alto Networks - Aperture test user](#create-palo-alto-networks---aperture-test-user)** - to have a counterpart of Britta Simon in Palo Alto Networks - Aperture that is linked to the Microsoft Entra representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Palo Alto Networks - Aperture** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<subdomain>.aperture.paloaltonetworks.com/d/users/saml/metadata`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<subdomain>.aperture.paloaltonetworks.com/d/users/saml/auth`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.aperture.paloaltonetworks.com/d/users/saml/sign_in`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Palo Alto Networks - Aperture Client support team](https://live.paloaltonetworks.com/t5/custom/page/page-id/Support) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. On the **Set up Palo Alto Networks - Aperture** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Palo Alto Networks - Aperture.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Palo Alto Networks - Aperture**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Palo Alto Networks - Aperture SSO

1. In a different web browser window, login to Palo Alto Networks - Aperture as an Administrator.

2. On the top menu bar, click **SETTINGS**.

	![The settings tab](./media/paloaltonetworks-aperture-tutorial/settings.png)

3. Navigate to **APPLICATION** section click **Authentication** form the left side of menu.

	![The Auth tab](./media/paloaltonetworks-aperture-tutorial/authentication.png)
	
4. On the **Authentication** page perform the following steps:
	
	![The authentication tab](./media/paloaltonetworks-aperture-tutorial/tab.png)

	a. Check the **Enable Single Sign-On(Supported SSP Providers are Okta, One login)** from **Single Sign-On** field.

	b. In the **Identity Provider ID** textbox, paste the value of **Microsoft Entra Identifier**.

	c. Click **Choose File** to upload the downloaded Certificate from Microsoft Entra ID in the **Identity Provider Certificate** field.

	d. In the **Identity Provider SSO URL** textbox, paste the value of **Login URL**.

	e. Review the IdP information from **Aperture Info** section and download the certificate from **Aperture Key** field.

	f. Click **Save**.


### Create Palo Alto Networks - Aperture test user

In this section, you create a user called Britta Simon in Palo Alto Networks - Aperture. Work with [Palo Alto Networks - Aperture Client support team](https://live.paloaltonetworks.com/t5/custom/page/page-id/Support) to add the users in the Palo Alto Networks - Aperture platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Palo Alto Networks - Aperture Sign on URL where you can initiate the login flow.  

* Go to Palo Alto Networks - Aperture Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Palo Alto Networks - Aperture for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Palo Alto Networks - Aperture tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Palo Alto Networks - Aperture for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure Palo Alto Networks - Aperture you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
