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
ms.date: 04/14/2019
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with LoginRadius

In this tutorial, you learn how to integrate LoginRadius with Azure Active Directory (Azure AD).

Integrating LoginRadius with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to LoginRadius.
* You can enable your users to be automatically signed-in to LoginRadius (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with LoginRadius, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* A LoginRadius single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* LoginRadius supports **SP** initiated SSO

## Adding LoginRadius from the gallery

To configure the integration of LoginRadius into Azure AD, you need to add LoginRadius from the gallery to your list of managed SaaS apps.

**To add LoginRadius from the gallery:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, select the **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise Applications**, and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button:

	![The New application button](common/add-new-app.png)

4. In the search box, enter **LoginRadius**, select **LoginRadius** in the result panel, and then select the **Add** button to add the application.

	![LoginRadius in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with LoginRadius based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in LoginRadius needs to be established.

To configure and test Azure AD single sign-on with LoginRadius, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure LoginRadius Single Sign-On](#configure-loginradius-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create LoginRadius test user](#create-loginradius-test-user)** - to have a counterpart of Britta Simon in LoginRadius that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with LoginRadius, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **LoginRadius** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** pane, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, select the **Edit** icon to open the **Basic SAML Configuration** pane.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section:

   ![LoginRadius Domain and URLs single sign-on information](common/sp-identifier.png)

   1. In the **Sign on URL** text box, enter the URL `https://secure.loginradius.com/login`

   1. In the **Identifier (Entity ID)** text box, enter the URL `https://lr.hub.loginradius.com/`

   1. In the **Reply URL (Assertion Consumer Service URL)** textbox, enter the LoginRadius ACS URL `https://lr.hub.loginradius.com/saml/serviceprovider/AdfsACS.aspx` 

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. In the **Set up LoginRadius** section, copy the appropriate URL(s) as per your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

   - Login URL

   - Azure AD Identifier

   - Logout URL

## Configure LoginRadius Single Sign-On

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

### Create an Azure AD test user 

The objective of this section is to create a test user called Britta Simon in the Azure portal.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In **User** properties, perform the following steps.

   ![The User dialog box](common/user-properties.png)

   1. In the **Name** field, enter **BrittaSimon**.
  
   1. In the **User name** field, enter `brittasimon@yourcompanydomain.extension`. For example, BrittaSimon@contoso.com.

   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.

   1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to LoginRadius.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **LoginRadius**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **LoginRadius**.

	![The LoginRadius link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Select the **Add user** button, then select **Users and groups** in the **Add Assignment** pane.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** pane, select **Britta Simon** in the **Users** list, then choose the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion, in the **Select Role** pane, select the appropriate role for the user from the list. Then, choose the **Select** button at the bottom of the screen.

7. In the **Add Assignment** pane, select the **Assign** button.

### Create LoginRadius test user

1. Log in to your LoginRadius [Admin Console](https://adminconsole.loginradius.com/login) account.

2. Go to your team management section in the LoginRadius Admin Console.

   ![Screenshot that shows the LoginRadius Admin Console](./media/loginradius-tutorial/team-management.png)
3. Select **Add Team Member** in the side menu to open the form. 

4. In the **Add Team Member** form, you create a user called Britta Simon in your LoginRadius site by providing the user's details and assigning the permissions you want the user to have. To know more about the permissions based on roles, see the [Role Access Permissions](https://www.loginradius.com/docs/api/v2/admin-console/team-management/manage-team-members#roleaccesspermissions0) section of the LoginRadius [Manage Team Members](https://www.loginradius.com/docs/api/v2/admin-console/team-management/manage-team-members#roleaccesspermissions0) document. Users must be created and activated before you use single sign-on.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

1. In a browser, go to https://accounts.loginradius.com/auth.aspx and select **Fed SSO log in**.
2. Enter your LoginRadius app name, and then select **Login**.
3. It should open a pop-up for asking you to sign in to your Azure AD account.
4. After the authentication, your pop-up will close and you will be logged in to the LoginRadius Admin Console.

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)
