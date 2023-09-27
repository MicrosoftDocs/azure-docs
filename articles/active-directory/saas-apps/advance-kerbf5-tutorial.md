---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with F5'
description: In this article, learn the steps you need to perform to integrate F5 with Microsoft Entra ID.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with F5

In this tutorial, you'll learn how to integrate F5 with Microsoft Entra ID. When you integrate F5 with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to F5.
* Enable your users to be automatically signed-in to F5 with their Microsoft Entra accounts.
* Manage your accounts in one central location.

To learn more about SaaS app integration with Microsoft Entra ID, see [What is application access and single sign-on with Microsoft Entra ID](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* F5 single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

F5 supports **SP and IDP** initiated SSO.

F5 SSO can be configured in three different ways:

- [Configure F5 single sign-on for Advanced Kerberos application](#configure-f5-single-sign-on-for-advanced-kerberos-application)

- [Configure F5 single sign-on for Header Based application](headerf5-tutorial.md)

- [Configure F5 single sign-on for Kerberos application](kerbf5-tutorial.md)

## Adding F5 from the gallery

To configure the integration of F5 into Microsoft Entra ID, you need to add F5 from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **F5** in the search box.
1. Select **F5** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-single-sign-on-for-f5'></a>

## Configure and test Microsoft Entra single sign-on for F5

Configure and test Microsoft Entra SSO with F5 using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in F5.

To configure and test Microsoft Entra SSO with F5, complete the following building blocks:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure F5-SSO](#configure-f5-sso)** - to configure the single sign-on settings on application side.
    1. **[Create F5 test user](#create-f5-test-user)** - to have a counterpart of B.Simon in F5 that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **F5** > **Single sign-on**.
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
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [F5 Client support team](https://support.f5.com/csp/knowledge-center/software/BIG-IP?module=BIG-IP%20APM45) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![The Certificate download link](common/metadataxml.png)

1. On the **Set up F5** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to F5.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **F5**.
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

    ![Screenshot that highlights the Import button for importing the Metadata Certificate.](./media/advance-kerbf5-tutorial/configure01.png)
 
1. To setup the SAML IDP, go to **Access > Federation > SAML Service Provider > Create > From Metadata**.

    ![Screenshot that highlights how to create the SAML IDP from metadata.](./media/advance-kerbf5-tutorial/configure02.png)

    ![Screenshot that shows the Create New SAML IdP Connector screen.](./media/advance-kerbf5-tutorial/configure03.png)
 
    ![F5 (Advanced Kerberos) configuration](./media/advance-kerbf5-tutorial/configure04.png)

    ![Screenshot that shows the Single Sign On Service Settings screen.](./media/advance-kerbf5-tutorial/configure05.png)
 
1. Specify the Certificate uploaded from Task 3

    ![Screenshot that shows the Edit SAML IdP Connector screen.](./media/advance-kerbf5-tutorial/configure06.png)

    ![Screenshot that shows the Single Logout Service Settings screen.](./media/advance-kerbf5-tutorial/configure07.png)

 1. To setup the SAML SP, go to **Access > Federation > SAML Service Federation > Local SP Services > Create**.

    ![Screenshot that shows the screen where you create a local SP service.](./media/advance-kerbf5-tutorial/configure08.png)
 
1. Click **OK**.

1. Select the SP Configuration and Click **Bind/UnBind IdP Connectors**.

     ![Screenshot that shows the SAML Service Provider.](./media/advance-kerbf5-tutorial/configure09.png)
 
 
1. Click on **Add New Row** and Select the **External IdP connector** created in previous step.

    ![Screenshot that highlights the Add New Row button.](./media/advance-kerbf5-tutorial/configure10.png)
 
1. For configuring Kerberos SSO, **Access > Single Sign-on > Kerberos**

    >[!Note]
    >You will need the Kerberos Delegation Account to be created and specified. Refer KCD Section ( Refer Appendix for Variable References)

    *    Username Source
    `session.saml.last.attr.name.http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`

    *    User Realm Source
    `session.logon.last.domain`

    ![Screenshot that highlights Access > Single Sign On.](./media/advance-kerbf5-tutorial/configure11.png)

1. For configuring Access Profile, **Access > Profile/Policies > Access Profile (per session policies)**.

    ![Screenshot that highlights the Properties tab under the Profiles/Policies menu option.](./media/advance-kerbf5-tutorial/configure12.png)

    ![Screenshot that shows the SSO/Auth Domains tab.](./media/advance-kerbf5-tutorial/configure13.png)

    ![Screenshot that shows the Access Policy tab.](./media/advance-kerbf5-tutorial/configure14.png)

    ![Screenshot that shows the Properties tab on the Access Policy.](./media/advance-kerbf5-tutorial/configure15.png)

    ![Screenshot that shows the properties for Variable Assign.](./media/advance-kerbf5-tutorial/configure16.png)
 
    * session.logon.last.usernameUPN   expr {[mcget {session.saml.last.identity}]}

    * session.ad.lastactualdomain  TEXT superdemo.live

    ![Screenshot that shows the AD Query properties.](./media/advance-kerbf5-tutorial/configure17.png)

    * (userPrincipalName=%{session.logon.last.usernameUPN})

    ![Screenshot that shows the Branch Rules tab and the Check Account rule.](./media/advance-kerbf5-tutorial/configure18.png)

    ![Screenshot that shows the custom variable and custom expression text boxes.](./media/advance-kerbf5-tutorial/configure19.png)

    * session.logon.last.username  expr { "[mcget {session.ad.last.attr.sAMAccountName}]" }

    ![Screenshot that shows the values in the SSO Token Name and SSO Token Password fields.](./media/advance-kerbf5-tutorial/configure20.png)

    * mcget {session.logon.last.username}
    * mcget {session.logon.last.password}

1. For adding new node, go to **Local Traffic > Nodes > Node List > +**.

    ![Screenshot that highlights Local Traffic > Nodes.](./media/advance-kerbf5-tutorial/configure21.png)
 
1. To create a new Pool, go to **Local Traffic > Pools > Pool List > Create**.

     ![Screenshot that highlights Local Traffic > Pools.](./media/advance-kerbf5-tutorial/configure22.png)

 1. To create a new virtual server, go to **Local Traffic > Virtual Servers > Virtual Server List > +**.

    ![Screenshot that highlights Local Traffic > Virtual Servers.](./media/advance-kerbf5-tutorial/configure23.png)

1. Specify the Access Profile Created in Previous Step.

    ![Screenshot that shows where you specify the access profile that you created.](./media/advance-kerbf5-tutorial/configure24.png) 

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

        ![Screenshot that shows the APM Delegatio Account Properties > Delegation tab.](./media/advance-kerbf5-tutorial/configure25.png)

1. Provide the details as mentioned in the above reference document under [this](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-authentication-single-sign-on-11-5-0/2.html)

1. Appendix- SAML – F5 BIG-IP Variable mappings shown below:

    ![Screenshot that shows the Overview > Active Sessions tab.](./media/advance-kerbf5-tutorial/configure26.png)

    ![Screenshot that shows the variables and session keys.](./media/advance-kerbf5-tutorial/configure27.png) 

1. Below is the whole list of default SAML Attributes. GivenName is represented using the following string.
`session.saml.last.attr.name.http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`

| Session | Attribute |
| -- | -- |
| eb46b6b6.session.saml.last.assertionID | `<TENANT ID>` |
| eb46b6b6.session.saml.last.assertionIssueInstant    | `<ID>` |
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

In this section, you test your Microsoft Entra single sign-on configuration using the Access Panel.

When you click the F5 tile in the Access Panel, you should be automatically signed in to the F5 for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Microsoft Entra ID](./tutorial-list.md)

- [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)



- [Configure F5 single sign-on for Header Based application](headerf5-tutorial.md)

- [Configure F5 single sign-on for Kerberos application](kerbf5-tutorial.md)

- [F5 BIG-IP APM and Microsoft Entra integration for secure hybrid access](../manage-apps/f5-integration.md)

- [Tutorial to deploy F5 BIG-IP Virtual Edition VM in Azure IaaS for secure hybrid access](../manage-apps/f5-bigip-deployment-guide.md)

- [Tutorial for Microsoft Entra single sign-on integration with F5 BIG-IP for Password-less VPN](../manage-apps/f5-passwordless-vpn.md)
