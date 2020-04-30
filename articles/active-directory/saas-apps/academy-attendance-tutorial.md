---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Academy Attendance | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Academy Attendance.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: dced51f8-079f-45c2-936b-8b1dd790bfb5
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 10/21/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Academy Attendance

In this tutorial, you'll learn how to integrate Academy Attendance with Azure Active Directory (Azure AD). When you integrate Academy Attendance with Azure AD, you can:

* Control in Azure AD who has access to Academy Attendance.
* Enable your users to be automatically signed-in to Academy Attendance with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Academy Attendance single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Academy Attendance supports **SP** initiated SSO


* Academy Attendance supports **Just In Time** user provisioning


## Adding Academy Attendance from the gallery

To configure the integration of Academy Attendance into Azure AD, you need to add Academy Attendance from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Academy Attendance** in the search box.
1. Select **Academy Attendance** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for Academy Attendance

Configure and test Azure AD SSO with Academy Attendance using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Academy Attendance.

To configure and test Azure AD SSO with Academy Attendance, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Academy Attendance SSO](#configure-academy-attendance-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Academy Attendance test user](#create-academy-attendance-test-user)** - to have a counterpart of B.Simon in Academy Attendance that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Academy Attendance** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.aattendance.com/sso/saml2/login?idp=<IDP_NAME>`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.aattendance.com/sso/saml2/metadata?idp=<IDP_NAME>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Academy Attendance Client support team](mailto:support@yournextconcepts.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Your Academy Attendance application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/edit-attribute.png)

	> [!NOTE]
	> Academy Attendance supports two roles for users: **Lecturer** and **Student**. Set up these roles in Azure AD so that users can be assigned the appropriate roles. Please refer to [this](https://docs.microsoft.com/azure/active-directory/develop/active-directory-enterprise-app-role-management) doc which explains how to create custom roles in Azure AD.

1. In addition to above, Academy Attendance application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirement.

	| Name |  Source Attribute|
	| --------- | --------------- |
	| role      | user.assignedroles |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Academy Attendance** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Academy Attendance.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Academy Attendance**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Academy Attendance SSO

To configure single sign-on on **Academy Attendance** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Academy Attendance support team](mailto:support@yournextconcepts.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Academy Attendance test user

In this section, a user called Britta Simon is created in Academy Attendance. Academy Attendance supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Academy Attendance, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Academy Attendance tile in the Access Panel, you should be automatically signed in to the Academy Attendance for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Academy Attendance with Azure AD](https://aad.portal.azure.com/)

