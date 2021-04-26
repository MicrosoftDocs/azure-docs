---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Equinix Federation App | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Equinix Federation App.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/22/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Equinix Federation App

In this tutorial, you'll learn how to integrate Equinix Federation App with Azure Active Directory (Azure AD). When you integrate Equinix Federation App with Azure AD, you can do the following:

* Control in Azure AD who has access to Equinix Federation App.
* Enable your users to be automatically signed-in to Equinix Federation App with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Equinix Federation App single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Equinix Federation App supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding Equinix Federation App from the gallery

To configure the integration of Equinix Federation App into Azure AD, you need to add Equinix Federation App from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Equinix Federation App** in the search box.
1. Select **Equinix Federation App** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Equinix Federation App

Configure and test Azure AD SSO with Equinix Federation App using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Equinix Federation App.

To configure and test Azure AD SSO with Equinix Federation App, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Equinix Federation App SSO](#configure-equinix-federation-app-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Equinix Federation App test user](#create-equinix-federation-app-test-user)** - to have a counterpart of B.Simon in Equinix Federation App that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Equinix Federation App** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<customerprefix>customerportal.equinix.com`

	> [!NOTE]
	> The Sign on URL value is not real. Update the value with the actual Sign on URL. Contact [Equinix Federation App Client support team](mailto:prodsecops@equinix.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Equinix Federation App** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Equinix Federation App.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Equinix Federation App**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Equinix Federation App SSO

To configure Single Sign-On on **Equinix Federation App** side, please the follow the [link](https://docs.equinix.com/Content/ECPortal/ssf/ssf.htm).

### Create Equinix Federation App test user

In this section, you create a user called Britta Simon in Equinix Federation App. Work with [Equinix Federation App support team](mailto:prodsecops@equinix.com) to add the users in the Equinix Federation App platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

Go to Equinix Federation App Sign-on URL directly, and initiate the login flow from there.

 > [!NOTE]
 > If you attempt to test your Azure application by using the **Test this application** link or by clicking the Equinix Federation App tile, it will not work, as that is IdP-initiated SSO, which Equinix does not support by default.  For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Equinix Federation App you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).


