---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with DocuSign | Microsoft Docs'
description: Learn how to configure single sign-on (SSO) between Azure Active Directory and DocuSign.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/09/2020
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with DocuSign

In this tutorial, you'll learn how to integrate DocuSign with Microsoft Azure Active Directory (Azure AD). When you integrate DocuSign with Azure AD, you can:

* Use Azure AD to control who has access to DocuSign.
* Enable automatic sign-in to DocuSign for your users through their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A DocuSign subscription that's single sign-on (SSO) enabled.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you'll configure and test Azure AD SSO in a test environment to verify that:

* DocuSign supports service provider **SP** initiated SSO.

* DocuSign supports **just-in-time** user provisioning.

* DocuSign supports [automatic user provisioning](./docusign-provisioning-tutorial.md).

* Once you configure DocuSign you can enforce Session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad)

## Adding DocuSign from the gallery

To configure the integration of DocuSign into Azure AD, you must add DocuSign from the gallery to your list of managed SaaS apps:

1. Sign in to the Azure portal by using a work or school account, or by using a personal Microsoft account.
1. In the navigation pane on the left, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications** and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **DocuSign** in the search box.
1. Select **DocuSign** from the results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for DocuSign

Configure and test Azure AD SSO with DocuSign by using a test user named **B.Simon**. For SSO to work, you must establish a link relationship between an Azure AD user and the corresponding user in DocuSign.

To configure and test Azure AD SSO with DocuSign, perform the following steps:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) so that your users can use this feature.
    1. [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with B.Simon.
    1. [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Azure AD single sign-on.
1. [Configure DocuSign SSO](#configure-docusign-sso) to configure the single sign-on settings on the application side.
    1. [Create a DocuSign test user](#create-docusign-test-user) to generate a counterpart of B.Simon in DocuSign that's linked to the Azure AD representation of the user.
1. [Test SSO](#test-sso) to verify that the configuration works.

## Configure Azure AD SSO

To enable Azure AD SSO in the Azure portal, follow these steps:

1. In the Azure portal, on the **DocuSign** application integration page, find the **Manage** section, and then select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, follow these steps:

	a. In the **Sign on URL** textbox, enter a URL using the following pattern:

    `https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2/login/sp/<IDPID>`

    b. In the **Identifier (Entity ID)** textbox, enter a URL using the following pattern:

    `https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2`

    c. In the **Reply URL** textbox, enter anyone of the following URL patterns:
    
    | Reply URL |
    |-------------|
    |`https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2/login/<IDPID>`|
    |`https://<subdomain>.docusign.net/SAML/`|

	> [!NOTE]
	> These bracketed values are placeholders. Replace them with the values in the actual sign-on URL, Identifier and Reply URL. These details are explained in the "View SAML 2.0 Endpoints" section later in this tutorial.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)**. Select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. In the **Set up DocuSign** section, copy the appropriate URL (or URLs) based on your requirements.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user named B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. At the top of the screen, select **New user**.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter **B.Simon**.  
   1. In the **User name** field, enter `<username>@<companydomain>.<extension>`. For example: `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then make note of the value that's displayed in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll grant B.Simon access to DocuSign so that this user can use Azure single sign-on.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **DocuSign**.
1. On the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, and then in the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the **Users** list, and then press the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure DocuSign SSO

1. To automate the configuration in DocuSign, you must install the My Apps Secure Sign-in browser extension by selecting **Install the extension**.

    ![My apps extension](common/install-myappssecure-extension.png)

2. After you add the extension to the browser, select **Setup DocuSign**. You're directed to the DocuSign application. From there, provide the admin credentials to sign in to DocuSign. The browser extension automatically configures the application and automates steps 3 through 5.

    ![Setup configuration](common/setup-sso.png)

3. If you want to set up DocuSign manually, open a new web browser window and sign in to your DocuSign company site as an administrator.

4. In the upper-right corner of the page, select the profile logo, and then select **Go to Admin**.
  
    ![Go to Admin under Profile][51]

5. On your domain solutions page, select **Domains**.

    ![Domain Solutions/Domains][50]

6. In the **Domains** section, select **CLAIM DOMAIN**.

    ![Claim Domain option][52]

7. In the **Claim a Domain** dialog box, in the **Domain Name** box, type your company domain, and then select **CLAIM**. Make sure you verify the domain and that its status is active.

    ![Claim a Domain/Domain Name dialog][53]

8. On the domain solutions page, select **Identity Providers**.
  
    ![Identity Providers option][54]

9. In the **Identity Providers** section, select **ADD IDENTITY PROVIDER**.

    ![Add Identity Provider option][55]

10. On the **Identity Provider Settings** page, follow these steps:

    ![Identity Provider Settings fields][56]

    a. In the **Name** box, type a unique name for your configuration. Don't use spaces.

    b. In the **Identity Provider Issuer box**, paste the **Azure AD Identifier** value, which you copied from the Azure portal.

    c. In the **Identity Provider Login URL** box, paste the **Login URL** value, which you copied from Azure portal.

    d. In the **Identity Provider Logout URL** box, paste the value of **Logout URL**, which you  copied from Azure portal.

    e. Select **Sign AuthN request**.

    f. For **Send AuthN request by**, select **POST**.

    g. For **Send logout request by**, select **GET**.

    h. In the **Custom Attribute Mapping** section, select **ADD NEW MAPPING**.

       ![Custom Attribute Mapping UI][62]

    i. Choose the field you want to map to the Azure AD claim. In this example, the **emailaddress** claim is mapped with the value of `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`. That's the default claim name from Azure AD for the email claim. Select **SAVE**.

       ![Custom Attribute Mapping fields][57]

       > [!NOTE]
       > Use the appropriate **User identifier** to map the user from Azure AD to DocuSign user mapping. Select the proper field, and enter the appropriate value based on your organization settings.

    j. In the **Identity Provider Certificates** section, select **ADD CERTIFICATE**, upload the certificate you downloaded from Azure AD portal, and select **SAVE**.

       ![Identity Provider Certificates/Add Certificate][58]

    k. In the **Identity Providers** section, select **ACTIONS**, and then select **Endpoints**.

       ![Identity Providers/Endpoints][59]

    l. In the **View SAML 2.0 Endpoints** section of the DocuSign admin portal, follow these steps:

       ![View SAML 2.0 Endpoints][60]
       
       1. Copy the **Service Provider Issuer URL**, and then paste it into the **Identifier** box in **Basic SAML Configuration** section in the Azure portal.
       
       1. Copy the **Service Provider Assertion Consumer Service URL**, and then paste it into the **Reply URL** box in **Basic SAML Configuration** section in the Azure portal.
       
       1. Copy the **Service Provider Login URL**, and then paste it into the **Sign On URL** box in **Basic SAML Configuration** section in the Azure portal. At the end of the **Service Provider Login URL** you will get the IDPID value.

       1. Select **Close**.

### Create DocuSign test user

In this section, a user named B.Simon is created in DocuSign. DocuSign supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in DocuSign, a new one is created after authentication.

> [!Note]
> If you need to create a user manually, contact the [DocuSign support team](https://support.docusign.com/).

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

1. Click on **Test this application** in Azure portal. This will redirect to DocuSign Sign-on URL where you can initiate the login flow. 

2. Go to DocuSign Sign-on URL directly and initiate the login flow from there.

3. You can use Microsoft Access Panel. When you click the DocuSign tile in the Access Panel, you should be automatically signed in to the DocuSign for which you set up the SSO. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/my-apps-portal-end-user-access.md).


## Next Steps

Once you configure DocuSign you can enforce Session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad)

<!--Image references-->

[50]: ./media/docusign-tutorial/tutorial_docusign_18.png
[51]: ./media/docusign-tutorial/tutorial_docusign_21.png
[52]: ./media/docusign-tutorial/tutorial_docusign_22.png
[53]: ./media/docusign-tutorial/tutorial_docusign_23.png
[54]: ./media/docusign-tutorial/tutorial_docusign_19.png
[55]: ./media/docusign-tutorial/tutorial_docusign_20.png
[56]: ./media/docusign-tutorial/tutorial_docusign_24.png
[57]: ./media/docusign-tutorial/tutorial_docusign_25.png
[58]: ./media/docusign-tutorial/tutorial_docusign_26.png
[59]: ./media/docusign-tutorial/tutorial_docusign_27.png
[60]: ./media/docusign-tutorial/tutorial_docusign_28.png
[61]: ./media/docusign-tutorial/tutorial_docusign_29.png
[62]: ./media/docusign-tutorial/tutorial_docusign_30.png