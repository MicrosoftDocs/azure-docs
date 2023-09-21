---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with ServiceNow | Microsoft Docs'
description: Learn how to configure single sign-on between Microsoft Entra ID and ServiceNow.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/25/2023
ms.author: jeedes
---

# Tutorial: Microsoft Entra single sign-on (SSO) integration with ServiceNow

In this tutorial, you'll learn how to integrate ServiceNow with Microsoft Entra ID. When you integrate ServiceNow with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to ServiceNow.
* Enable your users to be automatically signed-in to ServiceNow with their Microsoft Entra accounts.
* Manage your accounts in one central location: the Azure portal.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4Jao6]

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A ServiceNow single sign-on (SSO) enabled subscription.
* For ServiceNow, an instance or tenant of ServiceNow supports Calgary, Kingston, London, Madrid, New York, Orlando, Paris and San Diego versions or later.
* For ServiceNow Express, an instance of ServiceNow Express, Helsinki version or later.
* The ServiceNow tenant must have the [Multiple Provider Single Sign On Plugin](https://old.wiki/index.php/Multiple_Provider_Single_Sign-On#gsc.tab=0) enabled.
* For automatic configuration, enable the multi-provider plugin for ServiceNow.
* To install the ServiceNow Agent (Mobile) application, go to the appropriate store, and search for the ServiceNow Agent application. Then download it.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment. 

* ServiceNow supports **SP** initiated SSO.

* ServiceNow supports [Automated user provisioning](servicenow-provisioning-tutorial.md).

* You can configure the ServiceNow Agent (Mobile) application with Microsoft Entra ID for enabling SSO. It supports both Android and iOS users. In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

## Add ServiceNow from the gallery

To configure the integration of ServiceNow into Microsoft Entra ID, you need to add ServiceNow from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, enter **ServiceNow** in the search box.
1. Select **ServiceNow** from results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-servicenow'></a>

## Configure and test Microsoft Entra SSO for ServiceNow

Configure and test Microsoft Entra SSO with ServiceNow by using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in ServiceNow.

To configure and test Microsoft Entra SSO with ServiceNow, perform the following steps:

1. [Configure Microsoft Entra SSO](#configure-azure-ad-sso) to enable your users to use this feature.
	1. [Create a Microsoft Entra test user](#create-an-azure-ad-test-user) to test Microsoft Entra single sign-on with B.Simon.
	1. [Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Microsoft Entra single sign-on.
	1. [Configure Microsoft Entra SSO for ServiceNow Express](#configure-azure-ad-sso-for-servicenow-express) to enable your users to use this feature.
2. [Configure ServiceNow](#configure-servicenow) to configure the SSO settings on the application side.
	1. [Create a ServiceNow test user](#create-servicenow-test-user) to have a counterpart of B.Simon in ServiceNow, linked to the Microsoft Entra representation of the user.
	1. [Configure ServiceNow Express SSO](#configure-servicenow-express-sso) to configure the single sign-on settings on the application side.	
3. [Test SSO](#test-sso) to verify whether the configuration works.
4. [Test SSO for ServiceNow Agent (Mobile)](#test-sso-for-servicenow-agent-mobile) to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ServiceNow** application integration page, find the **Manage** section. Select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pen icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up Single Sign-On with SAML page, with pen icon highlighted](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, perform the following steps:

	a. In **Sign on URL**, enter one of the following URL patterns:

	| Sign on URL|
	|----------|
	| `https://<instancename>.service-now.com/navpage.do` |
	| `https://<instance-name>.service-now.com/login_with_sso.do?glide_sso_id=<sys_id of the sso configuration>` | 
    |
    
    > [!NOTE]
    >  Please copy the sys_id value from **Configure ServiceNow** section which is explained later in the tutorial.

    b. In **Identifier (Entity ID)**, enter a URL that uses the following pattern:
    `https://<instance-name>.service-now.com`

	c. For **Reply URL**, enter one of the following URL patterns:

	| Reply URL|
	|----------|
	| `https://<instancename>.service-now.com/navpage.do` |
	| `https://<instancename>.service-now.com/consumer.do` |
	|

	d. In **Logout URL**, enter a URL that uses the following pattern:
	`https://<instancename>.service-now.com/navpage.do`

	> [!NOTE]
	> If "/ " is added in the Identifier value, please remove that manually.

	> [!NOTE]
	> These values aren't real. You need to update these values with the actual sign-on URL, Reply URL, Logout URL and identifier, which is explained later in the tutorial. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)**. 

   ![Screenshot of the SAML Signing Certificate section, with Download highlighted](common/certificatebase64.png)

   a. Select the copy button to copy **App Federation Metadata Url**, and paste it into Notepad. This URL will be used later in the tutorial.

	b. Select **Download** to download **Certificate(Base64)**, and then save the certificate file on your computer.

1. In the **Set up ServiceNow** section, copy the appropriate URLs, based on your requirement.

   ![Screenshot of Set up ServiceNow section, with URLs highlighted](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user, called B.Simon,.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to ServiceNow.

1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. In the applications list, select **ServiceNow**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.
1. Select **Add user**. In the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the users list, and then choose **Select**.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select **Assign**.

<a name='configure-azure-ad-sso-for-servicenow-express'></a>

### Configure Microsoft Entra SSO for ServiceNow Express

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ServiceNow** application integration page, select **single sign-on**.

    ![Screenshot of ServiceNow application integration page, with Single sign-on highlighted](common/select-sso.png)

2. In the **Select a single sign-on method** dialog box, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Screenshot of Select a single sign-on method, with SAML highlighted](common/select-saml-option.png)

3. On the **Set up single sign-on with SAML** page, select the pen icon to open the **Basic SAML Configuration** dialog box.

	![Screenshot of Set up single sign-on with SAML page, with pen icon highlighted](common/edit-urls.png)

4. In the **Basic SAML Configuration** section, perform the following steps:

	a. For **Sign on URL**, enter one of the following URL patterns:

	| Sign on URL |
	|-----------|
	|  `https://<instance-name>.service-now.com/login_with_sso.do?glide_sso_id=<sys_id of the sso configuration>` |
	| `https://<instancename>.service-now.com/consumer.do` |
	|

    b. For **Identifier (Entity ID)**, enter a URL that uses the following pattern:
    `https://<instance-name>.service-now.com`

	c. For **Reply URL**, enter one of the following URL patterns:

	| Reply URL |
	|-----------|
	| `https://<instancename>.service-now.com/navpage.do` |
	| `https://<instancename>.service-now.com/consumer.do` |
	|

	d. In **Logout URL**, enter a URL that uses the following pattern:
	`https://<instancename>.service-now.com/navpage.do`
	
	> [!NOTE]
	> If "/ " is added in the Identifier value, please remove that manually.

	> [!NOTE]
	> These values aren't real. You need to update these values with the actual sign-on URL, Reply URL, Logout URL and identifier, which is explained later in the tutorial. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

5. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, select **Download** to download the **Certificate (Base64)** from the specified options, as per your requirement. Save it on your computer.

	![Screenshot of SAML Signing Certificate section, with Download highlighted](common/certificatebase64.png)

6. You can have Microsoft Entra ID automatically configure ServiceNow for SAML-based authentication. To enable this service, go to the **Set up ServiceNow** section, and select **View step-by-step instructions** to open the **Configure sign-on** window.

	![Screenshot of Set up ServiceNow section, with View step-by-step instructions highlighted](./media/servicenow-tutorial/tutorial-servicenow-configure.png)

7. In the **Configure sign-on** form, enter your ServiceNow instance name, admin username, and admin password. Select **Configure Now**. The admin username provided must have the **security_admin** role assigned in ServiceNow for this to work. Otherwise, to manually configure ServiceNow to use Microsoft Entra ID as a SAML Identity Provider, select **Manually configure single sign-on**. Copy the **Logout URL, Microsoft Entra Identifier, and Login URL** from the Quick Reference section.

	![Screenshot of Configure sign-on form, with Configure Now highlighted](./media/servicenow-tutorial/configure.png "Configure app URL")

## Configure ServiceNow

1. Sign on to your ServiceNow application as an administrator.

1. Activate the **Integration - Multiple Provider single sign-on Installer** plug-in by following these steps:

	a. In the left pane, search for the **System Definition** section from the search box, and then select **Plugins**.

	![Screenshot of System Definition section, with System Definition and Plugins highlighted](./media/servicenow-tutorial/tutorial-servicenow-03.png "Activate plugin")

	b. Search for **Integration - Multiple Provider single sign-on Installer** then, **Install** and **activate** it.

	 ![Screenshot of System Plugins page, with Integration - Multiple Provider Single Sign-On Installer highlighted](./media/servicenow-tutorial/tutorial-servicenow-04.png "Activate plugin")

1. In the left pane, search for the **Multi-Provider SSO** section from the search bar, and then select **Properties** in the **Administration**.

	![Screenshot of Multi-Provider SSO section, with Multi-Provider SSO and Properties highlighted](./media/servicenow-tutorial/tutorial-servicenow-06.png "Configure app URL")

1. In the **Multiple Provider SSO Properties** dialog box, perform the following steps:

	![Screenshot of Multiple Provider SSO Properties dialog box](./media/servicenow-tutorial/multi-provider.png "Configure app URL")

	* For **Enable multiple provider SSO**, select **Yes**.
  
	* For **Enable Auto Importing of users from all identity providers into the user table**, select **Yes**.

	* For **Enable debug logging for the multiple provider SSO integration**, select **Yes**.

	* For **The field on the user table that...**, enter **email**.
  
	* Select **Save**.

1. You can configure ServiceNow automatically or manually. To configure ServiceNow automatically, follow these steps:

	1. Return to the **ServiceNow** single sign-on page.

	1. One-click configure service is provided for ServiceNow. To enable this service, go to the **ServiceNow Configuration** section, and select **Configure ServiceNow** to open the **Configure sign-on** window.

		![Screenshot of Set up ServiceNow, with View step-by-step instructions highlighted](./media/servicenow-tutorial/tutorial-servicenow-configure.png)

	1. In the **Configure sign-on** form, enter your ServiceNow instance name, admin username, and admin password. Select **Configure Now**. The admin username provided must have the **security-admin** role assigned in ServiceNow for this to work. Otherwise, to manually configure ServiceNow to use Microsoft Entra ID as a SAML Identity Provider, select **Manually configure single sign-on**. Copy the **Sign-Out URL, SAML Entity ID, and SAML single sign-on Service URL** from the Quick Reference section.

		![Screenshot of Configure sign-on form, with Configure Now highlighted](./media/servicenow-tutorial/configure.png "Configure app URL")

	1. Sign on to your ServiceNow application as an administrator.

	   * In the automatic configuration, all the necessary settings are configured on the **ServiceNow** side, but the **X.509 Certificate** isn't enabled by default and give the **Single Sign-On Script** value as **MultiSSOv2_SAML2_custom**. You have to map it manually to your identity provider in ServiceNow. Follow these steps:

	     1. In the left pane, search for the **Multi-Provider SSO** section from the search box, and select **Identity Providers**.

		    ![Screenshot of Multi-Provider SSO section, with Identity Providers highlighted](./media/servicenow-tutorial/tutorial-servicenow-07.png "Configure single sign-on")

	     1. Select the automatically generated identity provider.

		    ![Screenshot of identity providers, with automatically generated identity provider highlighted](./media/servicenow-tutorial/tutorial-servicenow-08.png "Configure single sign-on")

	     1.  On the **Identity Provider** section, perform the following steps:

		     ![Screenshot of Identity Provider section](./media/servicenow-tutorial/automatic-config.png "Configure single sign-on")

		       a. Right click on the grey bar at the top of the screen and click **Copy sys_id** and use this value to the **Sign on URL** in **Basic SAML Configuration** section.

			   b. For **Name**, enter a name for your configuration (for example, **Microsoft Azure Federated single sign-on**).

		       c. Copy the **ServiceNow Homepage** value, and paste it in **Sign-on URL** in the **ServiceNow Basic SAML Configuration** section.

			    > [!NOTE]
			    > The ServiceNow instance homepage is a concatenation of your **ServiceNow tenant URL** and **/navpage.do** (for example:`https://fabrikam.service-now.com/navpage.do`).

		      d. Copy the **Entity ID / Issuer** value, and paste it in **Identifier** in the **ServiceNow Basic SAML Configuration** section.

		      e. Confirm that **NameID Policy** is set to `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified` value. 

			  f. Click on **Advanced** and give the **Single Sign-On Script** value as **MultiSSOv2_SAML2_custom**.

	     1. Scroll down to the **X.509 Certificate** section, and select **Edit**.

		     ![Screenshot of X.509 Certificate section, with Edit highlighted](./media/servicenow-tutorial/tutorial-servicenow-09.png "Configure single sign-on")

	     1. Select the certificate, and select the right arrow icon to add the certificate

		    ![Screenshot of Collection, with certificate and right arrow icon highlighted](./media/servicenow-tutorial/tutorial-servicenow-11.png "Configure single sign-on")

	      1. Select **Save**.

	      1. At the upper-right corner of the page, select **Test Connection**.

		     ![Screenshot of page, with Test Connection highlighted](./media/servicenow-tutorial/tutorial-activate-2.png "Activate plugin")

		     > [!NOTE]
		     > If the Test Connection is failing and you are not able to activate this connection then ServiceNow does offer the override switch. You have to enter **Sys_properties.LIST** in the **Search Navigation** and it will open the new page of System Properties. Here you have to create a new property with the name as **glide.authenticate.multisso.test.connection.mandatory** with **datatype** as **True/False** and then set the **value** as **False**.

		     > ![Screenshot of Test connection page](./media/servicenow-tutorial/test-connection-fail.png "Configure single sign-on")
		
	      1. When asked for your credentials, enter them. You'll see the following page. The **SSO Logout Test Results** error is expected. Ignore the error and select  **Activate**.

		     ![Screenshot of credentials page](./media/servicenow-tutorial/servicenow-activate.png "Configure single sign-on")
  
1. To configure **ServiceNow** manually, follow these steps:

	1. Sign on to your ServiceNow application as an administrator.

	1. In the left pane, select **Identity Providers**.

		![Screenshot of Multi-Provider SSO, with Identity Providers highlighted](./media/servicenow-tutorial/tutorial-servicenow-07.png "Configure single sign-on")

	1. In the **Identity Providers** dialog box, select **New**.

		![Screenshot of Identity Providers dialog box, with New highlighted](./media/servicenow-tutorial/new-button.png "Configure single sign-on")

	1. In the **Identity Providers** dialog box, select **SAML**.

		![Screenshot of Identity Providers dialog box, with SAML highlighted](./media/servicenow-tutorial/kind-of-sso.png "Configure single sign-on")

	1. In **Import Identity Provider Metadata**, perform the following steps:

		![Screenshot of Import Identity Provider Metadata, with URL and Import highlighted](./media/servicenow-tutorial/idp.png "Configure single sign-on")

		1. Enter the **App Federation Metadata Url** that you've copied.

		1. Select **Import**.

	1. It reads the IdP metadata URL, and populates all the fields information.

		![Screenshot of Identity Provider](./media/servicenow-tutorial/identity-provider.png "Configure single sign-on")

		a. Right click on the grey bar at the top of the screen and click **Copy sys_id** and use this value to the **Sign on URL** in **Basic SAML Configuration** section.
		
		b.  For **Name**, enter a name for your configuration (for example, **Microsoft Azure Federated single sign-on**).

		c. Copy the **ServiceNow Homepage** value. Paste it in **Sign-on URL** in the **ServiceNow Basic SAML Configuration** section.

		> [!NOTE]
		> The ServiceNow instance homepage is a concatenation of your **ServiceNow tenant URL** and **/navpage.do** (for example:`https://fabrikam.service-now.com/navpage.do`).

		d. Copy the **Entity ID / Issuer** value. Paste it in **Identifier** in **ServiceNow Basic SAML Configuration** section.

		e. Confirm that **NameID Policy** is set to `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified` value.

		f. Select **Advanced**. In **User Field**, enter **email**.

		> [!NOTE]
		> You can configure Microsoft Entra ID to emit either the Microsoft Entra user ID (user principal name) or the email address as the unique identifier in the SAML token. Do this by going to the **ServiceNow** > **Attributes** > **Single sign-on** section of the Azure portal, and mapping the desired field to the **nameidentifier** attribute. The value stored for the selected attribute in Microsoft Entra ID (for example, user principal name) must match the value stored in ServiceNow for the entered field (for example, user_name).

		g. Select **Test Connection** at the upper-right corner of the page.

		> [!NOTE]
		> If the Test Connection is failing and you are not able to activate this connection then ServiceNow does offer the override switch. You have to enter **Sys_properties.LIST** in the **Search Navigation** and it will open the new page of System Properties. Here you have to create a new property with the name as **glide.authenticate.multisso.test.connection.mandatory** with **datatype** as **True/False** and then set the **value** as **False**.

		  > ![Screenshot of Test connection](./media/servicenow-tutorial/test-connection-fail.png "Configure single sign-on")

		h. When asked for your credentials, enter them. You'll see the following page. The **SSO Logout Test Results** error is expected. Ignore the error and select  **Activate**.

		  ![credentials](./media/servicenow-tutorial/servicenow-activate.png "Configure single sign-on")

### Create ServiceNow test user

The objective of this section is to create a user called B.Simon in ServiceNow. ServiceNow supports automatic user provisioning, which is enabled by default.

> [!NOTE]
> If you need to create a user manually, contact the [ServiceNow Client support team](https://support.servicenow.com/now).

### Configure ServiceNow Express SSO

1. Sign on to your ServiceNow Express application as an administrator.

2. In the left pane, select **Single Sign-On**.

	![Screenshot of ServiceNow Express application, with Single Sign-On highlighted](./media/servicenow-tutorial/ic7694980ex.png "Configure app URL")

3. In the **Single Sign-On** dialog box, select the configuration icon on the upper right, and set the following properties:

	![Screenshot of Single Sign-On dialog box](./media/servicenow-tutorial/ic7694981ex.png "Configure app URL")

	a. Toggle **Enable multiple provider SSO** to the right.

	b. Toggle **Enable debug logging for the multiple provider SSO integration** to the right.

	c. In **The field on the user table that...**, enter **user_name**.

4. In the **Single Sign-On** dialog box, select **Add New Certificate**.

	![Screenshot of Single Sign-On dialog box, with Add New Certificate highlighted](./media/servicenow-tutorial/ic7694973ex.png "Configure single sign-on")

5. In the **X.509 Certificates** dialog box, perform the following steps:

	![Screenshot of X.509 Certificates dialog box](./media/servicenow-tutorial/certificate.png "Configure single sign-on")

	a. For **Name**, enter a name for your configuration (for example: **TestSAML2.0**).

	b. Select **Active**.

	c. For **Format**, select **PEM**.

	d. For **Type**, select **Trust Store Cert**.

	e. Open your Base64 encoded certificate downloaded from Azure portal in Notepad. Copy the content of it into your clipboard, and then paste it to the **PEM Certificate** text box.

	f. Select **Update**

6. In the **Single Sign-On** dialog box, select **Add New IdP**.

	![Screenshot of Single Sign-On dialog box, with Add New IdP highlighted](./media/servicenow-tutorial/ic7694976ex.png "Configure single sign-on")

7. In the **Add New Identity Provider** dialog box, under **Configure Identity Provider**, perform the following steps:

	![Screenshot of Add New Identity Provider dialog box](./media/servicenow-tutorial/new-identity-provider.png "Configure single sign-on")

	a. For **Name**, enter a name for your configuration (for example: **SAML 2.0**).

	b. For **Identity Provider URL**, paste the value of the identity provider ID that you copied.

	c. For **Identity Provider's AuthnRequest**, paste the value of the authentication request URL that you copied.

	d. For **Identity Provider's SingleLogoutRequest**, paste the value of the logout URL that you copied.

	e. For **Identity Provider Certificate**, select the certificate you created in the previous step.

8. Select **Advanced Settings**. Under **Additional Identity Provider Properties**, perform the following steps:

	![Screenshot of Add New Identity Provider dialog box, with Advanced Settings highlighted](./media/servicenow-tutorial/advanced-settings.png "Configure single sign-on")

	a. For **Protocol Binding for the IDP's SingleLogoutRequest**, enter **urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect**.

	b. For **NameID Policy**, enter **urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified**.

	c. For **AuthnContextClassRef Method**, enter `http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password`.

	d. For **Create an AuthnContextClass**, toggle it to off (unselected).

9. Under **Additional Service Provider Properties**, perform the following steps:

	![Screenshot of Add New Identity Provider dialog box, with various properties highlighted](./media/servicenow-tutorial/service-provider.png "Configure single sign-on")

	a. For **ServiceNow Homepage**, enter the URL of your ServiceNow instance homepage.

	> [!NOTE]
	> The ServiceNow instance homepage is a concatenation of your **ServiceNow tenant URL** and **/navpage.do** (for example: `https://fabrikam.service-now.com/navpage.do`).

	b. For **Entity ID / Issuer**, enter the URL of your ServiceNow tenant.

	c. For **Audience URI**, enter the URL of your ServiceNow tenant.

	d. For **Clock Skew**, enter **60**.

	e. For **User Field**, enter **email**.

	> [!NOTE]
	> You can configure Microsoft Entra ID to emit either the Microsoft Entra user ID (user principal name) or the email address as the unique identifier in the SAML token. Do this by going to the **ServiceNow** > **Attributes** > **Single sign-on** section of the Azure portal, and mapping the desired field to the **nameidentifier** attribute. The value stored for the selected attribute in Microsoft Entra ID (for example, user principal name) must match the value stored in ServiceNow for the entered field (for example, user_name).

	f. Select **Save**.

## Test SSO

When you select the ServiceNow tile in the Access Panel, you should be automatically signed in to the ServiceNow for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Test SSO for ServiceNow Agent (Mobile)

1. Open your **ServiceNow Agent (Mobile)** application, and perform the following steps:

	b. Enter your ServiceNow instance address, nickname and select **Save and Login**.

	![Screenshot of Add Instance page, with Continue highlighted](./media/servicenow-tutorial/mobile-instance.png)

	c. On the **Log in** page, perform the following steps:

	![Screenshot of Log in page, with Use external login highlighted](./media/servicenow-tutorial/mobile-login.png)

	*  Enter **Username**, like B.simon@contoso.com.

	*  Select **Use external login**. You're redirected to the Microsoft Entra ID page for sign-in.

	*  Enter your credentials. If there is any third-party authentication, or any other security feature enabled, the user must respond accordingly. The application **Home page** appears.

		![Screenshot of the application home page](./media/servicenow-tutorial/mobile-landing-page.png)

## Next Steps

Once you configure the ServiceNow you can enforce session controls, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
