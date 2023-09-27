---
title: 'Tutorial: Microsoft Entra integration with Adobe Experience Manager'
description: Learn how to configure single sign-on between Microsoft Entra ID and Adobe Experience Manager.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/16/2022
ms.author: jeedes
---
# Tutorial: Microsoft Entra integration with Adobe Experience Manager

In this tutorial, you'll learn how to integrate Adobe Experience Manager with Microsoft Entra ID. When you integrate Adobe Experience Manager with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Adobe Experience Manager.
* Enable your users to be automatically signed-in to Adobe Experience Manager with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Adobe Experience Manager single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Adobe Experience Manager supports **SP and IDP** initiated SSO

* Adobe Experience Manager supports **Just In Time** user provisioning

## Adding Adobe Experience Manager from the gallery

To configure the integration of Adobe Experience Manager into Microsoft Entra ID, you need to add Adobe Experience Manager from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Adobe Experience Manager** in the search box.
1. Select **Adobe Experience Manager** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


<a name='configure-and-test-azure-ad-sso-for-adobe-experience-manager'></a>

## Configure and test Microsoft Entra SSO for Adobe Experience Manager

Configure and test Microsoft Entra SSO with Adobe Experience Manager using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Adobe Experience Manager.

To configure and test Microsoft Entra SSO with Adobe Experience Manager, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
2. **[Configure Adobe Experience Manager SSO](#configure-adobe-experience-manager-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create Adobe Experience Manager test user](#create-adobe-experience-manager-test-user)** - to have a counterpart of Britta Simon in Adobe Experience Manager that is linked to the Microsoft Entra representation of user.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Adobe Experience Manager** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a unique value that you define on your AEM server as well.

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<AEM Server Url>/saml_login`

    > [!NOTE]
    > The Reply URL value is not real. Update Reply URL value with the actual reply URL. To get this value, contact the [Adobe Experience Manager Client support team](https://helpx.adobe.com/support/experience-manager.html) to get this value. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type your Adobe Experience Manager server URL.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

    ![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Adobe Experience Manager** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Adobe Experience Manager.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Adobe Experience Manager**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Adobe Experience Manager SSO

1. In another browser window, open the **Adobe Experience Manager** admin portal.

2. Select **Settings** > **Security** > **Users**.

    ![Screenshot that shows the Users tile in the Adobe Experience Manager.](./media/adobe-experience-manager-tutorial/user.png)

3. Select **Administrator** or any other relevant user.

    ![Screenshot that highlights the Adminisrator user.](./media/adobe-experience-manager-tutorial/administrator.png)

4. Select **Account settings** > **Manage TrustStore**.

    ![Screenshot that shows Manage TrustStore under Account settings.](./media/adobe-experience-manager-tutorial/manage-trust.png)

5. Under **Add Certificate from CER file**, click **Select Certificate File**. Browse to and select the certificate file, which you already downloaded.

    ![Screenshot that highlights the Select Certificate File button.](./media/adobe-experience-manager-tutorial/certificate-file.png)

6. The certificate is added to the TrustStore. Note the alias of the certificate.

    ![Screenshot that shows that the certificate is added to the TrustStore.](./media/adobe-experience-manager-tutorial/trust-store.png)

7. On the **Users** page, select **authentication-service**.

    ![Screenshot that highlights authentication-service on the screen.](./media/adobe-experience-manager-tutorial/authentication-service.png)

8. Select **Account settings** > **Create/Manage KeyStore**. Create KeyStore by supplying a password.

    ![Screenshot that highlights Manage KeyStore.](./media/adobe-experience-manager-tutorial/manage-key-store.png)

9. Go back to the admin screen. Then select **Settings** > **Operations** > **Web Console**.

    ![Screenshot that highlights Web Console under Operations within the Settings section.](./media/adobe-experience-manager-tutorial/web-console.png)

    This opens the configuration page.

    ![Configure the single sign-on save button.](./media/adobe-experience-manager-tutorial/configuration-page.png)

10. Find **Adobe Granite SAML 2.0 Authentication Handler**. Then select the **Add** icon.

    ![Screenshot that highlights Adobe Granite SAML 2.0 Authentication Handler.](./media/adobe-experience-manager-tutorial/saml-handler.png)

11. Take the following actions on this page.

    ![Screenshot shows for Configure Single Sign-On Save button.](./media/adobe-experience-manager-tutorial/adobe-configuration.png)

    a. In the **Path** box, enter **/**.

    b. In the **IDP URL** box, enter the **Login URL** value that you copied.

    c. In the **IDP Certificate Alias** box, enter the **Certificate Alias** value that you added in TrustStore.

    d. In the **Security Provided Entity ID** box, enter the unique **Microsoft Entra Identifier** value that you configured.

    e. In the **Assertion Consumer Service URL** box, enter the **Reply URL** value that you configured.

    f. In the **Password of Key Store** box, enter the **Password** that you set in KeyStore.

    g. In the **User Attribute ID** box, enter the **Name ID** or another user ID that's relevant in your case.

    h. Select **Autocreate CRX Users**.

    i. In the **Logout URL** box, enter the unique **Logout URL** value that you got.

    j. Select **Save**.

1. In **Apache Sling Referrer Filter** section, perform the below steps:

    ![Screenshot shows for Sling Referrer Filter.](./media/adobe-experience-manager-tutorial/allow-host.png)

    a. Ensure **allow.empty** value is set to true.

    b. Add `login.microsoftonline.com` to the **Allow Hosts**.

    c. Click **Save**.

### Create Adobe Experience Manager test user

In this section, you create a user called Britta Simon in Adobe Experience Manager. If you selected the **Autocreate CRX Users** option, users are created automatically after successful authentication.

If you want to create users manually, work with the [Adobe Experience Manager support team](https://helpx.adobe.com/support/experience-manager.html) to add the users in the Adobe Experience Manager platform.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Adobe Experience Manager Sign-on URL where you can initiate the login flow.  

* Go to Adobe Experience Manager Sign on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Adobe Experience Manager for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Adobe Experience Manager tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Adobe Experience Manager for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure Adobe Experience Manager you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
