---
title: 'Tutorial: Azure AD SSO integration with Predictix Ordering'
description: In this tutorial, you'll learn how to configure single sign-on between Azure Active Directory and Predictix Ordering.
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
# Tutorial: Azure AD SSO integration with Predictix Ordering

In this tutorial, you'll learn how to integrate Predictix Ordering with Azure Active Directory (Azure AD). When you integrate Predictix Ordering with Azure AD, you can:

* Control in Azure AD who has access to Predictix Ordering.
* Enable your users to be automatically signed-in to Predictix Ordering with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Predictix Ordering, you need to have:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/pricing/free-trial/).
* A Predictix Ordering subscription that has single sign-on enabled.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you'll configure and test Azure AD single sign-on in a test environment.

* Predictix Ordering supports SP-initiated SSO.

## Add Predictix Ordering from the gallery

To configure the integration of Predictix Ordering into Azure AD, you need to add Predictix Ordering from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Predictix Ordering** in the search box.
1. Select **Predictix Ordering** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Predictix Ordering

Configure and test Azure AD SSO with Predictix Ordering using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Predictix Ordering.

To configure and test Azure AD SSO with Predictix Ordering, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
   1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
   1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Predictix Ordering SSO](#configure-predictix-ordering-sso)** - to configure the single sign-on settings on application side.
   1. **[Create a Predictix Ordering test user](#create-a-predictix-ordering-test-user)** - to have a counterpart of B.Simon in Predictix Ordering that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Predictix Ordering** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. In the **Basic SAML Configuration** dialog box, perform the following steps:
    
     a. In the **Identifier (Entity ID)** box, type a URL using one of the following patterns:
    
    | **Identifier** |
    |--------|
    | `https://<companyname-pricing>.dev.ordering.predictix.com` |
    | `https://<companyname-pricing>.ordering.predictix.com` |
  
	b. In the **Sign on URL** box, type a URL using the following pattern:
    `https://<companyname-pricing>.ordering.predictix.com/sso/request`

	> [!NOTE]
	> These values are placeholders. Update these values with the actual Identifier and Sign on URL. Contact the [Predictix Ordering support team](https://www.predix.io/support/) to get the values. You can also refer to the patterns shown in the **Basic SAML Configuration** dialog box in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select the **Download** link next to **Certificate (Base64)**, per your requirements, and save the certificate on your computer:

	![Certificate download link](common/certificatebase64.png)

6. In the **Set up Predictix Ordering** section, copy the appropriate URLs, based on your requirements:

	![Copy the configuration URLs](common/copy-configuration-urls.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Predictix Ordering.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Predictix Ordering**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Predictix Ordering SSO

To configure single sign-on on the Predictix Ordering side, you need to send the certificate that you downloaded and the URLs that you copied from the Azure portal to the [Predictix Ordering support team](https://www.predix.io/support/). This team ensures the SAML SSO connection is set properly on both sides.

### Create a Predictix Ordering test user

Next, you need to create a user named Britta Simon in Predictix Ordering. Work with the [Predictix Ordering support team](https://www.predix.io/support/) to add users. Users need to be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Predictix Ordering Sign-on URL where you can initiate the login flow. 

* Go to Predictix Ordering Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Predictix Ordering tile in the My Apps, this will redirect to Predictix Ordering Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Predictix Ordering you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).