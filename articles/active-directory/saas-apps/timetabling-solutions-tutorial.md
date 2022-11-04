---
title: 'Tutorial: Azure AD SSO integration with Timetabling Solutions'
description: Learn how to configure single sign-on between Azure Active Directory and Timetabling Solutions.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/04/2022
ms.author: jeedes
---

# Tutorial: Azure AD SSO integration with Timetabling Solutions

In this tutorial, you'll learn how to integrate Timetabling Solutions with Azure Active Directory (Azure AD). When you integrate Timetabling Solutions with Azure AD, you can:

* Control in Azure AD who has access to Timetabling Solutions.
* Enable your users to be automatically signed-in to Timetabling Solutions with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Timetabling Solutions single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Timetabling Solutions supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Timetabling Solutions from the gallery

To configure the integration of Timetabling Solutions into Azure AD, you need to add Timetabling Solutions from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Timetabling Solutions** in the search box.
1. Select **Timetabling Solutions** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Timetabling Solutions

Configure and test Azure AD SSO with Timetabling Solutions using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Timetabling Solutions.

To configure and test Azure AD SSO with Timetabling Solutions, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Timetabling Solutions SSO](#configure-timetabling-solutions-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Timetabling Solutions test user](#create-timetabling-solutions-test-user)** - to have a counterpart of B.Simon in Timetabling Solutions that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Timetabling Solutions** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following step:

    In the **Sign-on URL** text box, type the URL:
    `https://auth.timetabling.education/login`

1. In the **SAML Signing Certificate** section, click **Edit** button to open **SAML Signing Certificate** dialog.

	![Screenshot shows to edit SAML Signing Certificate.](common/edit-certificate.png "Certificate")

1. In the **SAML Signing Certificate** section, copy the **Thumbprint Value** and save it on your computer.

    ![Screenshot shows to copy thumbprint value.](common/copy-thumbprint.png "Thumbprint")

1. On the **Set up Timetabling Solutions** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate U R L.](common/copy-configuration-urls.png "Metadata")

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Timetabling Solutions.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Timetabling Solutions**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Timetabling Solutions SSO

In this section, you'll populate the relevent SSO values in the Timetabling Solutions Administration Console.

1. In the [Administration Console](https://admin.timetabling.education/), select **5 Settings**, and then select the **SAML SSO** tab.
1. Perform the following steps in the **SAML SSO** section:
 
    ![Screenshot for SSO settings.](./media/timetabling-solutions-tutorial/timetabling-configuration.png)

    a. Enable SAML Integration.

    b. In the **SAML Login Path** textbox, paste the **Login URL** value, which you have copied from the Azure portal.

    c. In the **SAML Logout Path** textbox, paste the **Logout URL** value, which you have copied from the Azure portal.

    d. In the **SAML Certificate Fingerprint** textbox, paste the **Thumbprint Value**, which you have copied from the Azure portal.

    e. Enter the **Custom Domain** name.
    
    f. **Save** the settings. 


## Create Timetabling Solutions test user

In this section, you create a user called Britta Simon in the Timetabling Solutions Administration Console. 

1. In the [Administration Console](https://admin.timetabling.education/), select **1 Manage Users**, and click **Add**.
2. Enter the mandatory fields **First Name**, **Family Name** and **Email Address**. Add other apprpriate values in the non-mandatory fields.
3. Ensure **Online** is active in Status.
4. Click **Save and Next**.


> [!NOTE]
> Work with [Timetabling Solutions support team](https://www.timetabling.com.au/contact-us/) to add the users in the Timetabling Solutions platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Timetabling Solutions Sign-On URL where you can initiate the login flow. 

* Go to Timetabling Solutions Sign-On URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Timetabling Solutions tile in the My Apps, this will redirect to Timetabling Solutions Sign-On URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Timetabling Solutions you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).