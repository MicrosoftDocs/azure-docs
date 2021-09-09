---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with cloudtamer.io | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and cloudtamer.io.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/26/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with cloudtamer.io

In this tutorial, you'll learn how to integrate cloudtamer.io with Azure Active Directory (Azure AD). When you integrate cloudtamer.io with Azure AD, you can:

* Control in Azure AD who has access to cloudtamer.io.
* Enable your users to be automatically signed-in to cloudtamer.io with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* cloudtamer.io single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* cloudtamer.io supports **SP and IDP** initiated SSO.
* cloudtamer.io supports **Just In Time** user provisioning.


## Adding cloudtamer.io from the gallery

To configure the integration of cloudtamer.io into Azure AD, you need to add cloudtamer.io from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **cloudtamer.io** in the search box.
1. Select **cloudtamer.io** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for cloudtamer.io

Configure and test Azure AD SSO with cloudtamer.io using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in cloudtamer.io.

To configure and test Azure AD SSO with cloudtamer.io, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure cloudtamer.io SSO](#configure-cloudtamerio-sso)** - to configure the single sign-on settings on application side.
    1. **[Create cloudtamer.io test user](#create-cloudtamerio-test-user)** - to have a counterpart of B.Simon in cloudtamer.io that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Begin cloudtamer.io SSO Configuration

1. Log in to cloudtamer.io website as an administrator.

1. Click on **+** plus icon at the top right corner and select **IDMS**.

    ![Screenshot for IDMS create.](./media/cloudtamer-io-tutorial/idms-creation.png)

1. Select **SAML 2.0** as the IDMS Type.

1. Leave this screen open and copy values from this screen into the Azure AD configuration.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **cloudtamer.io** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, paste the **SERVICE PROVIDER ISSUER (ENTITY ID)** from cloudtamer.io into this box.

    b. In the **Reply URL** text box, paste the **SERVICE PROVIDER ACS URL** from cloudtamer.io into this box.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, paste the **SERVICE PROVIDER ACS URL** from cloudtamer.io into this box.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up cloudtamer.io** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to cloudtamer.io.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **cloudtamer.io**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure cloudtamer.io SSO

1. Perform the following steps in the **Add IDMS** page:

    ![Screenshot for IDMS adding.](./media/cloudtamer-io-tutorial/configuration.png)

    a. In the **IDMS Name** give a name that the users will recognize from the Login screen.

    b. In the **IDENTITY PROVIDER ISSUER (ENTITY ID)** textbox, paste the **Identifier** value which you have copied from the Azure portal.

    c. Open the downloaded **Federation Metadata XML** from the Azure portal into Notepad and paste the content into the **IDENTITY PROVIDER METADATA** textbox.

    d. Copy **SERVICE PROVIDER ISSUER (ENTITY ID)** value, paste this value into the **Identifier** text box in the Basic SAML Configuration section in the Azure portal.

    e. Copy **SERVICE PROVIDER ACS URL** value, paste this value into the **Reply URL** text box in the Basic SAML Configuration section in the Azure portal.

    f. Under Assertion Mapping, enter the following values:

    | Field | Value |
    |-----------|-------|
    | First Name | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname` |
    | Last Name | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname` |
    | Email | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name` |
    |  Username | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name` |
    |

1. Click **Create IDMS**.


### Create cloudtamer.io test user

In this section, a user called Britta Simon is created in cloudtamer.io. cloudtamer.io supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in cloudtamer.io, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to cloudtamer.io Sign on URL where you can initiate the login flow.  

* Go to cloudtamer.io Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the cloudtamer.io for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the cloudtamer.io tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the cloudtamer.io for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure cloudtamer.io you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).


