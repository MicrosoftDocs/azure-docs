---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with OrgVitality SSO | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and OrgVitality SSO.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/22/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with OrgVitality SSO

In this tutorial, you'll learn how to integrate OrgVitality SSO with Azure Active Directory (Azure AD). When you integrate OrgVitality SSO with Azure AD, you can:

* Control in Azure AD who has access to OrgVitality SSO.
* Enable your users to be automatically signed-in to OrgVitality SSO with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* OrgVitality SSO single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* OrgVitality SSO supports **IDP** initiated SSO.

## Add OrgVitality SSO from the gallery

To configure the integration of OrgVitality SSO into Azure AD, you need to add OrgVitality SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **OrgVitality SSO** in the search box.
1. Select **OrgVitality SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for OrgVitality SSO

Configure and test Azure AD SSO with OrgVitality SSO using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in OrgVitality SSO.

To configure and test Azure AD SSO with OrgVitality SSO, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure OrgVitality SSO](#configure-orgvitality-sso)** - to configure the single sign-on settings on application side.
    1. **[Create OrgVitality SSO test user](#create-orgvitality-sso-test-user)** - to have a counterpart of B.Simon in OrgVitality SSO that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **OrgVitality SSO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://rpt.orgvitality.com/<COMPANY_NAME>/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://rpt.orgvitality.com/<COMPANY_NAME>Auth/default.aspx`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier and Reply URL. Contact [OrgVitality SSO support team](https://orgvitality.com/contact-us/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Your OrgVitality SSO application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **nameidentifier** is mapped with **user.userprincipalname**. OrgVitality SSO application expects **nameidentifier** to be mapped with **user.employeeid**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/default-attributes.png)

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up OrgVitality SSO** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to OrgVitality SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **OrgVitality SSO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure OrgVitality SSO

To configure single sign-on on **OrgVitality SSO** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [OrgVitality SSO support team](https://orgvitality.com/contact-us/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create OrgVitality SSO test user

In this section, you create a user called Britta Simon in OrgVitality SSO. Work with [OrgVitality SSO support team](https://orgvitality.com/contact-us/) to add the users in the OrgVitality SSO platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the OrgVitality SSO for which you set up the SSO.

* You can use Microsoft My Apps. When you click the OrgVitality SSO tile in the My Apps, you should be automatically signed in to the OrgVitality SSO for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure OrgVitality SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).