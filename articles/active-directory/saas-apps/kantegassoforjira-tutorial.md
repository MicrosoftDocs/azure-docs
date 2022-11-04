---
title: 'Tutorial: Integrate Azure Active Directory with Kantega SSO for JIRA | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Jira using Kantega SSO.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/04/2022
ms.author: jeedes
---
# Tutorial: Integrate Azure Active Directory with Kantega SSO for JIRA

This tutorial will walk you through the steps of configuring single sign-on for your Azure AD users in Jira. To achieve this, we will be using the Kantega SSO app. Using this configuration, you will be able to:

* Control which users have Jira access from Azure AD.
* Automatically sign in to Jira when you have an active Azure AD session.
* Manage your accounts in one central location - the Azure portal.

Read more on the official [Kantega SSO documentation](https://kantega-sso.atlassian.net/wiki/spaces/KSE/pages/895844483/Azure+AD).

## Prerequisites

To follow this tutorial, you need:

* An active Azure AD subscription. You can set up a [free account](https://azure.microsoft.com/free/).
* A Jira Data Center instance. You can [try it for free](https://www.atlassian.com/software/jira/download/data-center).
* Kantega SSO app for Jira from Atlassian Marketplace. You can [try it for free](https://marketplace.atlassian.com/apps/1211923/k-sso-saml-kerberos-openid-oidc-oauth-for-jira?tab=overview&hosting=datacenter).

## Scenario description

In this tutorial, you will configure and test single sign-on with Azure AD in a Jira test environment.

* Kantega SSO supports **SAML and OIDC**.
* Kantega SSO supports **SP and IDP** initiated SSO.
* Kantega SSO supports Automated user provisioning and deprovisioning (recommended).
* Kantega SSO supports Just-in-Time user provisioning.

## Add Kantega SSO for JIRA from the gallery

To configure the integration of Kantega SSO for JIRA into Azure AD, you need to add Kantega SSO for JIRA from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **Kantega SSO for JIRA** in the search box.
1. Select **Kantega SSO for JIRA** from the results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Kantega SSO for JIRA

Configure and test Azure AD SSO with Kantega SSO for JIRA using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Kantega SSO for JIRA.

To configure and test Azure AD SSO with Kantega SSO for JIRA, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Kantega SSO for JIRA SSO](#configure-kantega-sso-for-jira-sso)** - to configure the single sign-on settings on the application side.
    1. **[Create Kantega SSO for JIRA test user](#create-kantega-sso-for-jira-test-user)** - to have a counterpart of B.Simon in Kantega SSO for JIRA linked to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Kantega SSO for JIRA** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<UNIQUE_ID>/login`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<UNIQUE_ID>/login`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<UNIQUE_ID>/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. These values are received during the configuration of the Jira plugin.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up Kantega SSO for JIRA** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the displayed value in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Kantega SSO for JIRA.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Kantega SSO for JIRA**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you expect a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see the "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Kantega SSO for JIRA SSO

Kantega SSO can be configured to use either SAML or OIDC as SSO protocol. Choose one of the following guides: 

* [Kantega SSO setup guide for Azure AD with SAML](https://kantega-sso.atlassian.net/wiki/spaces/KSE/pages/896696394/Azure+AD+SAML)
* [Kantega SSO setup guide for Azure AD with OIDC](https://kantega-sso.atlassian.net/wiki/spaces/KSE/pages/896598077/Azure+AD+OIDC)

### Create Kantega SSO for JIRA test user

To enable Azure AD users to sign in to Kantega SSO for JIRA, you must provision them. The application supports Just-in-Time user provisioning, automatic user provisioning using SCIM, or you can set up users manually. Read more about the [different provisioning options](https://kantega-sso.atlassian.net/wiki/spaces/KSE/pages/1769694/User+provisioning).

## Test SSO

In this section, you test your Azure AD single sign-on configuration with the following options. 

#### SP initiated:

* Click on **Test this application** in the Azure portal. This will redirect to Kantega SSO for JIRA Sign-on URL, where you can initiate the login flow.  

* Go to Kantega SSO for JIRA Sign-on URL directly and initiate the login flow.

#### IDP initiated:

* Click on **Test this application** in the Azure portal, and you should be automatically signed in to the Kantega SSO for JIRA, for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Kantega SSO for JIRA tile in the My Apps, you will be redirected to the application sign-on page for initiating the login flow if configured in SP mode. If configured in IDP mode, you should be automatically signed in to the Kantega SSO for JIRA, for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Kantega SSO for JIRA, you can enforce session control, which protects the exfiltration and infiltration of your organization's sensitive data in real-time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).