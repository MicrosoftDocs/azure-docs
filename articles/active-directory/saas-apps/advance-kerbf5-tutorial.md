---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with F5 | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and F5.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 9c5fb47a-1c5d-437a-b4c1-dbf739eaf5e3
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 11/11/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with F5

In this tutorial, you'll learn how to integrate F5 with Azure Active Directory (Azure AD). When you integrate F5 with Azure AD, you can:

* Control in Azure AD who has access to F5.
* Enable your users to be automatically signed-in to F5 with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* F5 single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* F5 supports **SP and IDP** initiated SSO
* F5 SSO can be configured in three different ways.

- [Configure F5 single sign-on for Advanced Kerberos application](#configure-f5-single-sign-on-for-advanced-kerberos-application)

- [Configure F5 single sign-on for Header Based application](headerf5-tutorial.md)

- [Configure F5 single sign-on for Kerberos application](kerbf5-tutorial.md)

## Adding F5 from the gallery

To configure the integration of F5 into Azure AD, you need to add F5 from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **F5** in the search box.
1. Select **F5** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for F5

Configure and test Azure AD SSO with F5 using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in F5.

To configure and test Azure AD SSO with F5, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure F5-SSO](#configure-f5-sso)** - to configure the single sign-on settings on application side.
    1. **[Create F5 test user](#create-f5-test-user)** - to have a counterpart of B.Simon in F5 that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **F5** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<YourCustomFQDN>.f5.com/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<YourCustomFQDN>.f5.com/`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<YourCustomFQDN>.f5.com/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [F5 Client support team](https://support.f5.com/csp/knowledge-center/software/BIG-IP?module=BIG-IP%20APM45) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up F5** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to F5.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **F5**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure F5 SSO

- [Configure F5 single sign-on for Header Based application](headerf5-tutorial.md)

- [Configure F5 single sign-on for Kerberos application](kerbf5-tutorial.md)

### Configure F5 single sign-on for Advanced Kerberos application

1. Open a new web browser window and sign into your F5 (Advanced Kerberos) company site as an administrator and perform the following steps:

1. You need to import the Metadata Certificate into the F5 (Advanced Kerberos) which will be used later in the setup process. Go to **System > Certificate Management > Traffic Certificate Management >> SSL Certificate List**. Click on **Import** of the right-hand corner.

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure01.png)
 
1. To setup the SAML IDP, go to **Access > Federation > SAML Service Provider > Create > From Metadata**.

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure02.png)

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure03.png)
 
    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure04.png)

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure05.png)
 
1. Specify the Certificate uploaded from Task 3

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure06.png)

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure07.png)

 1. To setup the SAML SP, go to **Access > Federation > SAML Service Federation > Local SP Services > Create**.

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure08.png)
 
1. Click **OK**.

1. Select the SP Configuration and Click **Bind/UnBind IdP Connectors**.

     ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure09.png)
 
 
1. Click on **Add New Row** and Select the **External IdP connector** created in previous step.

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure10.png)
 
1. For configuring Kerberos SSO, **Access > Single Sign-on > Kerberos**

    >[!Note]
    >You will need the Kerberos Delegation Account to be created and specified. Refer KCD Section ( Refer Appendix for Variable References)

    •	Username Source
    `session.saml.last.attr.name.http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`

    •	User Realm Source
    `session.logon.last.domain`

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure11.png)

1. For configuring Access Profile, **Access > Profile/Policies > Access Profile (per session policies)**.

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure12.png)

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure13.png)

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure14.png)

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure15.png)

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure16.png)
 
    * session.logon.last.usernameUPN   expr {[mcget {session.saml.last.identity}]}

    * session.ad.lastactualdomain  TEXT superdemo.live

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure17.png)

    * (userPrincipalName=%{session.logon.last.usernameUPN})

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure18.png)

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure19.png)

    * session.logon.last.username  expr { "[mcget {session.ad.last.attr.sAMAccountName}]" }

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure20.png)

    * mcget {session.logon.last.username}
    * mcget {session.logon.last.password}

1. For adding new node, go to **Local Traffic > Nodes > Node List > +**.

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure21.png)
 
1. To create a new Pool, go to **Local Traffic > Pools > Pool List > Create**.

     ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure22.png)

 1. To create a new virtual server, go to **Local Traffic > Virtual Servers > Virtual Server List > +**.

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure23.png)

1. Specify the Access Profile Created in Previous Step.

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure24.png) 

### Setting up Kerberos Delegation 

>[!Note]
>For more details refer [here](https://www.f5.com/pdf/deployment-guides/kerberos-constrained-delegation-dg.pdf)

* **Step 1: Create a Delegation Account**

    * Example
    ```
    Domain Name : superdemo.live
    Sam Account Name : big-ipuser

    New-ADUser -Name "APM Delegation Account" -UserPrincipalName host/big-ipuser.superdemo.live@superdemo.live -SamAccountName "big-ipuser" -PasswordNeverExpires $true -Enabled $true -AccountPassword (Read-Host -AsSecureString "Password!1234")
    ```

* **Step 2: Set SPN (on the APM Delegation Account)**

    *  Example
    ```
    setspn –A host/big-ipuser.superdemo.live big-ipuser
    ```

* **Step 3: SPN Delegation ( for the App Service Account)**

    * Setup the appropriate Delegation for the F5 Delegation Account.
    * In the example below, APM Delegation account is being configured for KCD for FRP-App1.superdemo.live app.

        ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure25.png)

1. Provide the details as mentioned in the above reference document under [this](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-authentication-single-sign-on-11-5-0/2.html)

1. Appendix- SAML – F5 BIG-IP Variable mappings shown below:

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure26.png)

    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure27.png) 

1. Below is the whole list of default SAML Attributes. GivenName is represented using the following string.
`session.saml.last.attr.name.http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`

| | |
| -- | -- |
| eb46b6b6.session.saml.last.assertionID | `<TENANT ID>` |
| eb46b6b6.session.saml.last.assertionIssueInstant	| `<ID>` |
| eb46b6b6.session.saml.last.assertionIssuer | `https://sts.windows.net/<TENANT ID>`/ |
| eb46b6b6.session.saml.last.attr.name.http:\//schemas.microsoft.com/claims/authnmethodsreferences | `http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password` |
| eb46b6b6.session.saml.last.attr.name.http:\//schemas.microsoft.com/identity/claims/displayname | user0 |
| eb46b6b6.session.saml.last.attr.name.http:\//schemas.microsoft.com/identity/claims/identityprovider | `https://sts.windows.net/<TENANT ID>/` |
| eb46b6b6.session.saml.last.attr.name.http:\//schemas.microsoft.com/identity/claims/objectidentifier | `<TENANT ID>` |
| eb46b6b6.session.saml.last.attr.name.http:\//schemas.microsoft.com/identity/claims/tenantid | `<TENANT ID>` |
| eb46b6b6.session.saml.last.attr.name.http:\//schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress | `user0@superdemo.live` |
| eb46b6b6.session.saml.last.attr.name.http:\//schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname | user0 |
| eb46b6b6.session.saml.last.attr.name.http:\//schemas.xmlsoap.org/ws/2005/05/identity/claims/name | `user0@superdemo.live` |
| eb46b6b6.session.saml.last.attr.name.http:\//schemas.xmlsoap.org/ws/2005/05/identity/claims/surname | 0 |
| eb46b6b6.session.saml.last.audience | `https://kerbapp.superdemo.live` |
| eb46b6b6.session.saml.last.authNContextClassRef | urn:oasis:names:tc:SAML:2.0:ac:classes:Password |
| eb46b6b6.session.saml.last.authNInstant | `<ID>` |
| eb46b6b6.session.saml.last.identity | `user0@superdemo.live` |
| eb46b6b6.session.saml.last.inResponseTo | `<TENANT ID>` |
| eb46b6b6.session.saml.last.nameIDValue | `user0@superdemo.live` |
| eb46b6b6.session.saml.last.nameIdFormat | urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress |
| eb46b6b6.session.saml.last.responseDestination | `https://kerbapp.superdemo.live/saml/sp/profile/post/acs` |
| eb46b6b6.session.saml.last.responseId | `<TENANT ID>` |
| eb46b6b6.session.saml.last.responseIssueInstant | `<ID>` |
| eb46b6b6.session.saml.last.responseIssuer | `https://sts.windows.net/<TENANT ID>/` |
| eb46b6b6.session.saml.last.result | 1 |
| eb46b6b6.session.saml.last.samlVersion | 2.0 |
| eb46b6b6.session.saml.last.sessionIndex | `<TENANT ID>` |
| eb46b6b6.session.saml.last.statusValue | urn:oasis:names:tc:SAML:2.0:status:Success |
| eb46b6b6.session.saml.last.subjectConfirmDataNotOnOrAfter | `<ID>` |
| eb46b6b6.session.saml.last.subjectConfirmDataRecipient | `https://kerbapp.superdemo.live/saml/sp/profile/post/acs` |
| eb46b6b6.session.saml.last.subjectConfirmMethod | urn:oasis:names:tc:SAML:2.0:cm:bearer |
| eb46b6b6.session.saml.last.validityNotBefore | `<ID>` |
| eb46b6b6.session.saml.last.validityNotOnOrAfter | `<ID>` |

### Create F5 test user

In this section, you create a user called B.Simon in F5. Work with [F5 Client support team](https://support.f5.com/csp/knowledge-center/software/BIG-IP?module=BIG-IP%20APM45) to add the users in the F5 platform. Users must be created and activated before you use single sign-on. 

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the F5 tile in the Access Panel, you should be automatically signed in to the F5 for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try F5 with Azure AD](https://aad.portal.azure.com/)

- [Configure F5 single sign-on for Header Based application](headerf5-tutorial.md)

- [Configure F5 single sign-on for Kerberos application](kerbf5-tutorial.md)

