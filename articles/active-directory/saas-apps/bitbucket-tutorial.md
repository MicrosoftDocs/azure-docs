---
title: 'Tutorial: Microsoft Entra integration with SAML SSO for Bitbucket by resolution GmbH'
description: Learn how to configure single sign-on between Microsoft Entra ID and SAML SSO for Bitbucket by resolution GmbH.
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
# Tutorial: Microsoft Entra integration with SAML SSO for Bitbucket by resolution GmbH

In this tutorial, you'll learn how to integrate SAML SSO for Bitbucket by resolution GmbH with Microsoft Entra ID. When you integrate SAML SSO for Bitbucket by resolution GmbH with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access toSAML SSO for Bitbucket by resolution GmbH.
* Enable your users to be automatically signed in toSAML SSO for Bitbucket by resolution GmbH with their Microsoft Entra accounts.
* Manage your accounts in one central location: the Azure portal.


## Prerequisites

To configure Microsoft Entra integration with SAML SSO for Bitbucket by resolution GmbH, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* SAML SSO for Bitbucket by resolution GmbH single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* SAML SSO for Bitbucket by resolution GmbH supports **SP and IDP** initiated SSO
* SAML SSO for Bitbucket by resolution GmbH supports **Just In Time** user provisioning


## Add SAML SSO for Bitbucket by resolution GmbH from the gallery

To configure the integration of SAML SSO for Bitbucket by resolution GmbH into Microsoft Entra ID, you need to add SAML SSO for Bitbucket by resolution GmbH from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SAML SSO for Bitbucket by resolution GmbH** in the search box.
1. Select **SAML SSO for Bitbucket by resolution GmbH** from the results, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-saml-sso-for-bitbucket-by-resolution-gmbh'></a>

## Configure and test Microsoft Entra SSO for SAML SSO for Bitbucket by resolution GmbH

Configure and test Microsoft Entra SSO with SAML SSO for Bitbucket by resolution GmbH, by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between a Microsoft Entra user and the related user in SAML SSO for Bitbucket by resolution GmbH.

To configure and test Microsoft Entra SSO with SAML SSO for Bitbucket by resolution GmbH, perform the following steps:


1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
2. **[Configure SAML SSO for Bitbucket by resolution GmbH SSO](#configure-saml-sso-for-bitbucket-by-resolution-gmbh-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create SAML SSO for Bitbucket by resolution GmbH test user](#create-saml-sso-for-bitbucket-by-resolution-gmbh-test-user)** - to have a counterpart of Britta Simon in SAML SSO for Bitbucket by resolution GmbH that is linked to the Microsoft Entra representation of user.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

In this section, you enable Microsoft Entra SSO.
 
1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SAML SSO for Bitbucket by resolution GmbH** application integration page, find the **Manage** section and select **Single Sign-On**.
1. On the **Select a Single Sign-On Method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:


    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/samlsso`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/samlsso`

    c. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:
    
    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/samlsso`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [SAML SSO for Bitbucket by resolution GmbH Client support team](https://marketplace.atlassian.com/apps/1217045/saml-single-sign-on-sso-bitbucket?hosting=server&tab=support) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

    ![The Certificate download link](common/metadataxml.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you create a test user called B.Simon.

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

In this section, you enable B.Simon to use Azure single sign-on by granting access to SAML SSO for Bitbucket by resolution GmbH.

1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. In the applications list, select **SAML SSO for Bitbucket by resolution GmbH**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.
1. Select **Add user**. Then, in the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the list of users. Then choose **Select** at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure SAML SSO for Bitbucket by resolution GmbH SSO

1. Sign-on to your SAML SSO for Bitbucket by resolution GmbH company site as administrator.

2. On the right side of the main toolbar, click **Settings**.

3. Go to ACCOUNTS section, click on **SAML SingleSignOn** on the Menubar.

    ![The Samlsingle](./media/bitbucket-tutorial/tutorial_bitbucket_samlsingle.png)

4. On the **SAML SIngleSignOn Plugin Configuration page**, click **Add idp**. 

    ![The Add idp](./media/bitbucket-tutorial/tutorial_bitbucket_addidp.png)

5. On the **Choose your SAML Identity Provider** Page, perform the following steps:

    ![The identity provider](./media/bitbucket-tutorial/tutorial_bitbucket_identityprovider.png)

    a. Select **Idp Type** as **Microsoft Entra ID**.

    b. In the **Name** textbox, type the name.

    c. In the **Description** textbox, type the description.

    d. Click **Next**.

6. On the **Identity provider configuration page**, click **Next**.

    ![The identity config](./media/bitbucket-tutorial/tutorial_bitbucket_identityconfig.png)

7.  On the **Import SAML Idp Metadata** Page, click **Load File** to upload the **METADATA XML** file which you have downloaded previously.

    ![The idpmetadata](./media/bitbucket-tutorial/tutorial_bitbucket_idpmetadata.png)

8. Click **Next**.

9. Click **Save settings**.

    ![The save](./media/bitbucket-tutorial/tutorial_bitbucket_save.png)


## Create SAML SSO for Bitbucket by resolution GmbH test user

The objective of this section is to create a user called Britta Simon in SAML SSO for Bitbucket by resolution GmbH. SAML SSO for Bitbucket by resolution GmbH supports just-in-time provisioning and also users can be created manually, contact [SAML SSO for Bitbucket by resolution GmbH Client support team](https://marketplace.atlassian.com/plugins/com.resolution.atlasplugins.samlsso-bitbucket/server/support) as per your requirement.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to SAML SSO for Bitbucket by resolution GmbH Sign on URL where you can initiate the login flow.  

* Go to SAML SSO for Bitbucket by resolution GmbH Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the SAML SSO for Bitbucket by resolution GmbH for which you set up the SSO.

You can also use Microsoft My Apps to test the application in any mode. When you click the SAML SSO for Bitbucket by resolution GmbH tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the SAML SSO for Bitbucket by resolution GmbH for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure the SAML SSO for Bitbucket by resolution GmbH you can enforce session controls, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
