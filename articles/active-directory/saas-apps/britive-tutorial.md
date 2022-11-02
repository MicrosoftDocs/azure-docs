---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Britive | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Britive.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/20/2021
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Britive

In this tutorial, you'll learn how to integrate Britive with Azure Active Directory (Azure AD). When you integrate Britive with Azure AD, you can:

* Control in Azure AD who has access to Britive.
* Enable your users to be automatically signed-in to Britive with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Britive single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Britive supports **SP** initiated SSO.
* Britive supports [Automated user provisioning](britive-provisioning-tutorial.md).

## Adding Britive from the gallery

To configure the integration of Britive into Azure AD, you need to add Britive from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Britive** in the search box.
1. Select **Britive** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Britive

Configure and test Azure AD SSO with Britive using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Britive.

To configure and test Azure AD SSO with Britive, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Britive SSO](#configure-britive-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Britive test user](#create-britive-test-user)** - to have a counterpart of B.Simon in Britive that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Britive** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<TENANTNAME>.britive-app.com/sso`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `urn:amazon:cognito:sp:<UNIQUE_ID>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier, which are explained later in this tutorial. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Britive** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Britive.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Britive**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Britive SSO

1. In a different web browser window, sign into Britive website as an administrator.

1. Click on **Admin Settings Icon** and select **Security**.

    ![Screenshot shows the Britive website with Settings and Security selected.](./media/britive-tutorial/security.png)

1. Select **SSO Configuration** and perform the following steps:

    ![Screenshot shows S S O Configuration where you enter the information in this step.](./media/britive-tutorial/configuration.png)

    a. Copy **Audience/Entity ID** value and paste it into the **Identifier (Entity ID)** text box in the **Basic SAML Configuration** section in the Azure portal.

    b. Copy **Initiate SSO URL** value and paste it into the **Sign on URL** text box in the **Basic SAML Configuration** section in the Azure portal.

    c. Click on **UPLOAD SAML METADATA** to upload the downloaded metadata XML file from Azure portal. After uploading the metadata file the above values will be auto populated and save changes.

### Create Britive test user

1. In a different web browser window, sign into Britive website as an administrator.

1. Click on **Admin Settings Icon** and select **User Administration**.

    ![Screenshot shows the Britive website with Settings and User Administration selected.](./media/britive-tutorial/user.png)

1. Click on **ADD USER**.

    ![Screenshot shows the ADD USER button.](./media/britive-tutorial/add-user.png)

1. Fill all the necessary details of the user according your organization requirement and click **ADD USER**.

    ![Screenshot shows the Ad a User page where you enter user information.](./media/britive-tutorial/user-fields.png)

> [!NOTE]
>Britive also supports automatic user provisioning, you can find more details [here](./britive-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Britive Sign-on URL where you can initiate the login flow. 

* Go to Britive Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Britive tile in the My Apps, this will redirect to Britive Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Britive you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
