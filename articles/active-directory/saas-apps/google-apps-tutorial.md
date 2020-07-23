---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Google Cloud (G Suite) Connector | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Google Cloud (G Suite) Connector.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 38a6ca75-7fd0-4cdc-9b9f-fae080c5a016
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 05/06/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Google Cloud (G Suite) Connector

In this tutorial, you'll learn how to integrate Google Cloud (G Suite) Connector with Azure Active Directory (Azure AD). When you integrate Google Cloud (G Suite) Connector with Azure AD, you can:

* Control in Azure AD who has access to Google Cloud (G Suite) Connector.
* Enable your users to be automatically signed-in to Google Cloud (G Suite) Connector with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

- An Azure AD subscription.
- Google Cloud (G Suite) Connector single sign-on (SSO) enabled subscription.
- A Google Apps subscription or Google Cloud Platform subscription.

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment. This document was created using the new user Single-Sign-on experience. If you are still using the old one, the setup will look different. You can enable the new experience in the Single Sign-on settings of G-Suite application. Go to **Azure AD, Enterprise applications**, select **Google Cloud (G Suite) Connector**, select **Single Sign-on** and then click on **Try out our new experience**.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

## Frequently Asked Questions

1. **Q: Does this integration support Google Cloud Platform SSO integration with Azure AD?**

	A: Yes. Google Cloud Platform and Google Apps share the same authentication platform. So to do the GCP integration you need to configure the SSO with Google Apps.

2. **Q: Are Chromebooks and other Chrome devices compatible with Azure AD single sign-on?**
  
    A: Yes, users are able to sign into their Chromebook devices using their Azure AD credentials. See this [Google Cloud (G Suite) Connector support article](https://support.google.com/chrome/a/answer/6060880) for information on why users may get prompted for credentials twice.

3. **Q: If I enable single sign-on, will users be able to use their Azure AD credentials to sign into any Google product, such as Google Classroom, GMail, Google Drive, YouTube, and so on?**

    A: Yes, depending on [which Google Cloud (G Suite) Connector](https://support.google.com/a/answer/182442?hl=en&ref_topic=1227583) you choose to enable or disable for your organization.

4. **Q: Can I enable single sign-on for only a subset of my Google Cloud (G Suite) Connector users?**

    A: No, turning on single sign-on immediately requires all your Google Cloud (G Suite) Connector users to authenticate with their Azure AD credentials. Because Google Cloud (G Suite) Connector doesn't support having multiple identity providers, the identity provider for your Google Cloud (G Suite) Connector environment can either be Azure AD or Google -- but not both at the same time.

5. **Q: If a user is signed in through Windows, are they automatically authenticate to Google Cloud (G Suite) Connector without getting prompted for a password?**

    A: There are two options for enabling this scenario. First, users could sign into Windows 10 devices via [Azure Active Directory Join](../device-management-introduction.md). Alternatively, users could sign into Windows devices that are domain-joined to an on-premises Active Directory that has been enabled for single sign-on to Azure AD via an [Active Directory Federation Services (AD FS)](../hybrid/plan-connect-user-signin.md) deployment. Both options require you to perform the steps in the following tutorial to enable single sign-on between Azure AD and Google Cloud (G Suite) Connector.

6. **Q: What should I do when I get an "invalid email" error message?**

	A: For this setup, the email attribute is required for the users to be able to sign-in. This attribute cannot be set manually.

	The email attribute is autopopulated for any user with a valid Exchange license. If user is not email-enabled, this error will be received as the application needs to get this attribute to give access.

	You can go to portal.office.com with an Admin account, then click in the Admin center, billing, subscriptions, select your Office 365 Subscription and then click on assign to users, select the users you want to check their subscription and in the right pane, click on edit licenses.

	Once the O365 license is assigned, it may take some minutes to be applied. After that, the user.mail attribute will be autopopulated and the issue should be resolved.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Google Cloud (G Suite) Connector supports **SP** initiated SSO

* Google Cloud (G Suite) Connector supports [**Automated** user provisioning](https://docs.microsoft.com/azure/active-directory/saas-apps/google-apps-provisioning-tutorial)
* Once you configure Google Cloud (G Suite) Connector you can enforce Session Control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session Control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

## Adding Google Cloud (G Suite) Connector from the gallery

To configure the integration of Google Cloud (G Suite) Connector into Azure AD, you need to add Google Cloud (G Suite) Connector from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Google Cloud (G Suite) Connector** in the search box.
1. Select **Google Cloud (G Suite) Connector** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Google Cloud (G Suite) Connector

Configure and test Azure AD SSO with Google Cloud (G Suite) Connector using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Google Cloud (G Suite) Connector.

To configure and test Azure AD SSO with Google Cloud (G Suite) Connector, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Google Cloud (G Suite) Connector SSO](#configure-google-cloud-g-suite-connector-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Google Cloud (G Suite) Connector test user](#create-google-cloud-g-suite-connector-test-user)** - to have a counterpart of B.Simon in Google Cloud (G Suite) Connector that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Google Cloud (G Suite) Connector** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you want to configure for the **Gmail** perform the following steps:

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://www.google.com/a/<yourdomain.com>/ServiceLogin?continue=https://mail.google.com`

    b. In the **Identifier** textbox, type a URL using the following pattern:

    ```http
    google.com/a/<yourdomain.com>
    google.com
    https://google.com
    https://google.com/a/<yourdomain.com>
    ```

    c. In the **Reply URL** textbox, type a URL using the following pattern: 

    ```http
    https://www.google.com
    https://www.google.com/a/<yourdomain.com>
    ```

1. On the **Basic SAML Configuration** section, if you want to configure for the **Google Cloud Platform** perform the following steps:

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://www.google.com/a/<yourdomain.com>/ServiceLogin?continue=https://console.cloud.google.com`

    b. In the **Identifier** textbox, type a URL using the following pattern:
	
    ```http
    google.com/a/<yourdomain.com>
    google.com
    https://google.com
    https://google.com/a/<yourdomain.com>
    ```
    
    c. In the **Reply URL** textbox, type a URL using the following pattern: 
    
    ```http
    https://www.google.com
    https://www.google.com/a/<yourdomain.com>
    ```

    > [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Google Cloud (G Suite) Connector doesn't provide Entity ID/Identifier value on Single Sign On configuration so when you uncheck the **domain specific issuer** option the Identifier value will be `google.com`. If you check the **domain specific issuer** option it will be `google.com/a/<yourdomainname.com>`. To check/uncheck the **domain specific issuer** option you need to go to the **Configure Google Cloud (G Suite) Connector SSO** section which is explained later in the tutorial. For more information contact [Google Cloud (G Suite) Connector Client support team](https://www.google.com/contact/).

1. Your Google Cloud (G Suite) Connector application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **Unique User Identifier** is **user.userprincipalname** but Google Cloud (G Suite) Connector expects this to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration.

	![image](common/default-attributes.png)


1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Google Cloud (G Suite) Connector** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Google Cloud (G Suite) Connector.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Google Cloud (G Suite) Connector**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Google Cloud (G Suite) Connector SSO

1. Open a new tab in your browser, and sign into the [Google Cloud (G Suite) Connector Admin Console](https://admin.google.com/) using your administrator account.

2. Click **Security**. If you don't see the link, it may be hidden under the **More Controls** menu at the bottom of the screen.

    ![Click Security.][10]

3. On the **Security** page, click **Set up single sign-on (SSO).**

    ![Click SSO.][11]

4. Perform the following configuration changes:

    ![Configure SSO][12]

    a. Select **Setup SSO with third-party identity provider**.

    b. In the **Sign-in page URL** field in Google Cloud (G Suite) Connector, paste the value of **Login URL** which you have copied from Azure portal.

    c. In the **Sign-out page URL** field in Google Cloud (G Suite) Connector, paste the value of **Logout URL** which you have copied from Azure portal.

    d. In the **Change password URL** field in Google Cloud (G Suite) Connector, paste the value of **Change password URL** which you have copied from Azure portal.

    e. In Google Cloud (G Suite) Connector, for the **Verification certificate**, upload the certificate that you have downloaded from Azure portal.

	f. Check/Uncheck the **Use a domain specific issuer** option as per the note mentioned in the above **Basic SAML Configuration** section in the Azure AD.

    g. Click **Save Changes**.

### Create Google Cloud (G Suite) Connector test user

The objective of this section is to [create a user in Google Cloud (G Suite) Connector](https://support.google.com/a/answer/33310?hl=en) called B.Simon. After the user has manually been created in Google Cloud (G Suite) Connector, the user will now be able to sign in using their Office 365 login credentials.

Google Cloud (G Suite) Connector also supports automatic user provisioning. To configure automatic user provisioning, you must first [configure Google Cloud (G Suite) Connector for automatic user provisioning](https://docs.microsoft.com/azure/active-directory/saas-apps/google-apps-provisioning-tutorial).

> [!NOTE]
> Make sure that your user already exists in Google Cloud (G Suite) Connector if provisioning in Azure AD has not been turned on before testing Single Sign-on.

> [!NOTE]
> If you need to create a user manually, contact the [Google support team](https://www.google.com/contact/).

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Google Cloud (G Suite) Connector tile in the Access Panel, you should be automatically signed in to the Google Cloud (G Suite) Connector for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Configure User Provisioning](https://docs.microsoft.com/azure/active-directory/saas-apps/google-apps-provisioning-tutorial)

- [Try Google Cloud (G Suite) Connector with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Google Cloud (G Suite) Connector with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/protect-gsuite)

<!--Image references-->

[10]: ./media/google-apps-tutorial/gapps-security.png
[11]: ./media/google-apps-tutorial/security-gapps.png
[12]: ./media/google-apps-tutorial/gapps-sso-config.png