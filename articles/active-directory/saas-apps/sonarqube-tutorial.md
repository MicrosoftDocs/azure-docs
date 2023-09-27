---
title: 'Tutorial: Microsoft Entra SSO integration with SonarQube'
description: Learn how to configure single sign-on between Microsoft Entra ID and SonarQube.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/28/2023
ms.author: jeedes
---

# Tutorial: Microsoft Entra SSO integration with SonarQube

In this tutorial, you'll learn how to integrate SonarQube with Microsoft Entra ID. When you integrate SonarQube with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to SonarQube.
* Enable your users to be automatically signed-in to SonarQube with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SonarQube single sign-on (SSO) enabled subscription.

> [!NOTE]
> Help on installing SonarQube can be found in the [online documentation](https://docs.sonarqube.org/latest/setup/install-server/).

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* SonarQube supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add SonarQube from the gallery

To configure the integration of SonarQube into Microsoft Entra ID, you need to add SonarQube from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SonarQube** in the search box.
1. Select **SonarQube** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-sonarqube'></a>

## Configure and test Microsoft Entra SSO for SonarQube

Configure and test Microsoft Entra SSO with SonarQube using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in SonarQube.

To configure and test Microsoft Entra SSO with SonarQube, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure SonarQube SSO](#configure-sonarqube-sso)** - to configure the single sign-on settings on application side.
    1. **[Create SonarQube test user](#create-sonarqube-test-user)** - to have a counterpart of B.Simon in SonarQube that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SonarQube** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Reply URL** text box, type a URL using the following pattern:
	` https://sonar.<companyspecificurl>.io/oauth2/callback/saml`

    b. In the **Sign-on URL** text box, type one of the following URLs:

	* **For Production Environment**

    	`https://servicessonar.corp.microsoft.com/`

	* **For Dev Environment**

		`https://servicescode-dev.westus.cloudapp.azure.com`

	> [!NOTE]
	> This value is not real. Update the value with actual Reply URL which are explained later in the tutorial.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up SonarQube** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to SonarQube.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SonarQube**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SonarQube SSO

1. Open a new web browser window and sign into your SonarQube company site as an administrator.

1. Click on **Administration > Configuration > Security** and go to the **SAML Plugin** perform the following steps.

1. Copy the following details from the IdP metadata and paste them into the corresponding text fields in the SonarQube plugin.
	1. IdP Entity ID
	2. Login URL
	3. X.509 Certificate 

1. Save all the details.

	![saml plugin IDP](./media/sonarqube-tutorial/metadata.png)

1. On the **SAML** page, perform the following steps:

	![Sonarqube configuration](./media/sonarqube-tutorial/configuration.png)

	a. Toggle the **Enabled** option to **yes**.

	b. In **Application ID** text box, enter the name like **sonarqube**.

	c. In **Provider Name** text box, enter the name like **SAML**.

	d. In **Provider ID** text box, paste the value of **Microsoft Entra Identifier**.

	e. In **SAML login url** text box, paste the value of **Login URL**.

	f. Open the Base64 encoded certificate in notepad, copy its content and paste it into the **Provider certificate** text box.

	g. In **SAML user login attribute** text box, enter the value `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`.

	h. In **SAML user name attribute** text box, enter the value `http://schemas.microsoft.com/identity/claims/displayname`.

	i. In **SAML user email attribute** text box, enter the value `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`.

	j. Click **Save**.

### Create SonarQube test user

In this section, you create a user called B.Simon in SonarQube. Work with [SonarQube Client support team](https://sonarsource.com/company/contact/) to add the users in the SonarQube platform. Users must be created and activated before you use single sign-on. 

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to SonarQube Sign-on URL where you can initiate the login flow. 

* Go to SonarQube Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the SonarQube tile in the My Apps, this will redirect to SonarQube Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

* Once you configure SonarQube, you can enforce session controls, which protect exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extend from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
