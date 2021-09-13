---
title: 'Tutorial: Azure Active Directory integration with LoginRadius | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and LoginRadius.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/27/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with LoginRadius

In this tutorial, you'll learn how to integrate LoginRadius with Azure Active Directory (Azure AD). When you integrate LoginRadius with Azure AD, you can:

* Control in Azure AD who has access to LoginRadius.
* Enable your users to be automatically signed-in to LoginRadius with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with LoginRadius, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* A LoginRadius single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* LoginRadius supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add LoginRadius from the gallery

To configure the integration of LoginRadius into Azure AD, you need to add LoginRadius from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **LoginRadius** in the search box.
1. Select **LoginRadius** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for LoginRadius

Configure and test Azure AD SSO with LoginRadius using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in LoginRadius.

To configure and test Azure AD SSO with LoginRadius, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure LoginRadius SSO](#configure-loginradius-sso)** - to configure the single sign-on settings on application side.
    1. **[Create LoginRadius test user](#create-loginradius-test-user)** - to have a counterpart of B.Simon in LoginRadius that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **LoginRadius** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

   1. In the **Identifier (Entity ID)** text box, enter the URL `https://lr.hub.loginradius.com/`

   1. In the **Reply URL (Assertion Consumer Service URL)** textbox, enter the LoginRadius ACS URL `https://lr.hub.loginradius.com/saml/serviceprovider/AdfsACS.aspx` 

   1. In the **Sign on URL** text box, enter the URL `https://secure.loginradius.com/login`

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. In the **Set up LoginRadius** section, copy the appropriate URL(s) as per your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user 

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to LoginRadius.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **LoginRadius**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure LoginRadius SSO

In this section, you enable Azure AD single sign-on in the LoginRadius Admin Console.

1. Log in to your LoginRadius [Admin Console](https://adminconsole.loginradius.com/login) account.

2. Go to your **Team Management** section in the [LoginRadius Admin Console](https://secure.loginradius.com/account/team).

3. Select the **Single Sign-On** tab, and then select **Azure AD**:

   ![Screenshot that shows the single-sign-on menu in the LoginRadius Team Management console](./media/loginradius-tutorial/azure-ad.png)

4. In the Azure AD setup page, complete the following steps:

   ![Screenshot that shows Azure Active Directory configuration in the LoginRadius Team Management console](./media/loginradius-tutorial/single-sign-on.png)

  	1. In **ID Provider Location**, enter the SIGN-ON ENDPOINT, which you get from your Azure AD account.

	1. In **ID Provider Logout URL**, enter the SIGN-OUT ENDPOINT, which you get from your Azure AD account.
 
  	1. In **ID Provider Certificate**, enter the Azure AD certificate, which you get from your Azure AD account. Enter the certificate value with the header and footer. Example: `-----BEGIN CERTIFICATE-----<certifciate value>-----END CERTIFICATE-----`

  	1. In **Service Provider Certificate** and **Server Provider Certificate Key**, enter your certificate and key. 

       You can create a self-signed certificate by running the following commands on the command line (Linux/Mac):

       - Command to get the certificate key for SP: `openssl genrsa -out lr.hub.loginradius.com.key 2048`

       - Command to get the certificate for SP: `openssl req -new -x509 -key lr.hub.loginradius.com.key -out lr.hub.loginradius.com.cert -days 3650 -subj /CN=lr.hub.loginradius.com`

	   > [!NOTE]
	   > Be sure to enter the certificate and certificate key values with the header and footer:
	   > - Certificate value example format: `-----BEGIN CERTIFICATE-----<certifciate value>-----END CERTIFICATE-----`
	   > - Certificate key value example format: `-----BEGIN RSA PRIVATE KEY-----<certifciate key value>-----END RSA PRIVATE KEY-----`

5. In the **Data Mapping** section, select the fields (SP fields) and enter the corresponding Azure AD fields(IdP fields).

	Following are some listed field names for Azure AD.

	| Fields    | Profile Key                                                          |
	| --------- | -------------------------------------------------------------------- |
	| Email     | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` |
	| FirstName | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`    |
	| LastName  | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname`      |

	> [!NOTE]
	> The **Email** field mapping is required. **FirstName** and **LastName** field mappings are optional.

### Create LoginRadius test user

1. Log in to your LoginRadius [Admin Console](https://adminconsole.loginradius.com/login) account.

2. Go to your team management section in the LoginRadius Admin Console.

   ![Screenshot that shows the LoginRadius Admin Console](./media/loginradius-tutorial/team-management.png)

3. Select **Add Team Member** in the side menu to open the form. 

4. In the **Add Team Member** form, you create a user called Britta Simon in your LoginRadius site by providing the user's details and assigning the permissions you want the user to have. To know more about the permissions based on roles, see the [Role Access Permissions](https://www.loginradius.com/docs/api/v2/admin-console/team-management/manage-team-members#roleaccesspermissions0) section of the LoginRadius [Manage Team Members](https://www.loginradius.com/docs/api/v2/admin-console/team-management/manage-team-members#roleaccesspermissions0) document. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using MyApps.

1. In a browser, go to https://accounts.loginradius.com/auth.aspx and select **Fed SSO log in**.
2. Enter your LoginRadius app name, and then select **Login**.
3. It should open a pop-up for asking you to sign in to your Azure AD account.
4. After the authentication, your pop-up will close and you will be logged in to the LoginRadius Admin Console.

## Next steps

Once you configure LoginRadius you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
