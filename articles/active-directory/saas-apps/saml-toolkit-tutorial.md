---
title: 'Tutorial: Azure AD SSO integration with Azure AD SAML Toolkit'
description: Learn how to configure single sign-on between Azure Active Directory and Azure AD SAML Toolkit.
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

# Tutorial: Azure AD SSO integration with Azure AD SAML Toolkit

In this tutorial, you'll learn how to integrate Azure AD SAML Toolkit with Azure Active Directory (Azure AD). When you integrate Azure AD SAML Toolkit with Azure AD, you can:

* Control in Azure AD who has access to Azure AD SAML Toolkit.
* Enable your users to be automatically signed-in to Azure AD SAML Toolkit with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Azure AD SAML Toolkit single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Azure AD SAML Toolkit supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Azure AD SAML Toolkit from the gallery

To configure the integration of Azure AD SAML Toolkit into Azure AD, you need to add Azure AD SAML Toolkit from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Azure AD SAML Toolkit** in the search box.
1. Select **Azure AD SAML Toolkit** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Azure AD SAML Toolkit

Configure and test Azure AD SSO with Azure AD SAML Toolkit using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Azure AD SAML Toolkit.

To configure and test Azure AD SSO with Azure AD SAML Toolkit, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Azure AD SAML Toolkit SSO](#configure-azure-ad-saml-toolkit-sso)** - to configure the single sign-on settings on application side.
    * **[Create Azure AD SAML Toolkit test user](#create-azure-ad-saml-toolkit-test-user)** - to have a counterpart of B.Simon in Azure AD SAML Toolkit that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Azure AD SAML Toolkit** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Reply URL** text box, type the URL:
    `https://samltoolkit.azurewebsites.net/SAML/Consume`

    b. In the **Sign on URL** text box, type the URL:
    `https://samltoolkit.azurewebsites.net/`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Raw)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificateraw.png)

1. On the **Set up Azure AD SAML Toolkit** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Azure AD SAML Toolkit.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Azure AD SAML Toolkit**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Azure AD SAML Toolkit SSO

1. Open a new web browser window, if you have not registered in the Azure AD SAML Toolkit website, first register by clicking on the **Register**. If you have registered already, sign into your Azure AD SAML Toolkit company site using the registered sign-in credentials.

	![Azure AD SAML Toolkit Register](./media/saml-toolkit-tutorial/register.png)

1. Click on the **SAML Configuration**.

	![Azure AD SAML Toolkit SAML Configuration](./media/saml-toolkit-tutorial/saml-configure.png)

1. Click **Create**.

	![Azure AD SAML Toolkit](./media/saml-toolkit-tutorial/createsso.png)

1. On the **SAML SSO Configuration** page, perform the following steps:

	![Azure AD SAML Toolkit Create SSO Configuration](./media/saml-toolkit-tutorial/fill-details.png)

	1. In the **Login URL** textbox, paste the **Login URL** value, which you have copied from the Azure portal.

	1. In the **Azure AD Identifier** textbox, paste the **Azure AD Identifier** value, which you have copied from the Azure portal.

	1. In the **Logout URL** textbox, paste the **Logout URL** value, which you have copied from the Azure portal.

	1. Click **Choose File** and upload the **Certificate (Raw)** file which you have downloaded from the Azure portal.

	1. Click **Create**.

    1. Copy Sign-on URL, Identifier and ACS URL values on SAML Toolkit SSO configuration page and paste into respected textboxes in the **Basic SAML Configuration section** in the Azure portal.

### Create Azure AD SAML Toolkit test user

In this section, a user called B.Simon is created in Azure AD SAML Toolkit. Please create a test user in the tool by registering a new user and provide all the user details. 

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Azure AD SAML Toolkit Sign-on URL where you can initiate the login flow. 

* Go to Azure AD SAML Toolkit Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Azure AD SAML Toolkit tile in the My Apps, this will redirect to Azure AD SAML Toolkit Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Azure AD SAML Toolkit you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
