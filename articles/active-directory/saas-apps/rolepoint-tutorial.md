---
title: 'Tutorial: Azure AD SSO integration with RolePoint'
description: In this tutorial, you'll learn how to configure single sign-on between Azure Active Directory and RolePoint.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/28/2022
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with RolePoint

In this tutorial, you'll learn how to integrate RolePoint with Azure Active Directory (Azure AD). When you integrate RolePoint with Azure AD, you can:

* Control in Azure AD who has access to RolePoint.
* Enable your users to be automatically signed-in to RolePoint with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with RolePoint, you need to have:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* A RolePoint subscription with single sign-on enabled.

## Scenario description

In this tutorial, you'll configure and test Azure AD single sign-on in a test environment.

* RolePoint supports SP-initiated SSO.

## Add RolePoint from the gallery

To configure the integration of RolePoint into Azure AD, you need to add RolePoint from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **RolePoint** in the search box.
1. Select **RolePoint** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for RolePoint

Configure and test Azure AD SSO with RolePoint using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in RolePoint.

To configure and test Azure AD SSO with RolePoint, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure RolePoint SSO](#configure-rolepoint-sso)** - to configure the single sign-on settings on application side.
    1. **[Create RolePoint test user](#create-rolepoint-test-user)** - to have a counterpart of B.Simon in RolePoint that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **RolePoint** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. In the **Basic SAML Configuration** dialog box, perform the following steps:

    1. In the **Identifier (Entity ID)** box, type a URL using the following pattern:

       `https://app.rolepoint.com/<instancename>`

    1. In the **Sign on URL** box, type a URL using the following pattern:

       `https://<subdomain>.rolepoint.com/login`   

	> [!NOTE]
	> These values are placeholders. You need to use the actual Identifier and Sign on URL. We suggest that you use a unique string value in the identifier. Contact the [RolePoint support team](mailto:info@rolepoint.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** dialog box in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select the **Download** link next to **Federation Metadata XML**, per your requirements, and save the file on your computer.

	![Certificate download link](common/metadataxml.png)

6. In the **Set up RolePoint** section, copy the appropriate URLs, based on your requirements:

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to RolePoint.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **RolePoint**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure RolePoint SSO

To set up single sign-on on the RolePoint side, you need to work with the [RolePoint support team](mailto:info@rolepoint.com). Send this team the Federation Metadata XML file and the URLs that you got from the Azure portal. They'll configure RolePoint to ensure the SAML SSO connection is set properly on both sides.

### Create RolePoint test user

Next, you need to create a user named Britta Simon in RolePoint. Work with the [RolePoint support team](mailto:info@rolepoint.com) to add users to RolePoint. Users need to be created and activated before you can use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to RolePoint Sign-on URL where you can initiate the login flow. 

* Go to RolePoint Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the RolePoint tile in the My Apps, this will redirect to RolePoint Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure RolePoint you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).