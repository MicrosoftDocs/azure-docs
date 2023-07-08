---
title: 'Tutorial: Azure AD SSO integration with Zero Networks'
description: Learn how to configure single sign-on between Azure Active Directory and Zero Networks.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/07/2023
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with Zero Networks

In this tutorial, you'll learn how to integrate Zero Networks with Azure Active Directory (Azure AD). When you integrate Zero Networks with Azure AD, you can:

* Control in Azure AD who has access to Zero Networks.
* Enable your users to be automatically signed-in to Zero Networks with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Zero Networks single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure Azure AD SSO for the Zero Networks Admin Portal and Access Portal.

* Zero Networks supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Zero Networks from the gallery

To configure the integration of Zero Networks into Azure AD, you need to add Zero Networks from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using a Microsoft work or school account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Zero Networks** in the search box.
1. Select **Zero Networks** from results panel and select **Create** to add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, go back to **Azure Active Directory**, click **Enterprise Applications** select the **Zero Networks** application, in the **Manage** section select **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following step.

	a. In the **Identifier (Entity ID)** text box, type the URL:
    `https://portal.zeronetworks.com/api/v1/sso/azure/metadata`
     
	b. In the **Reply URL (Assertion Consumer Service URL)** text box, type the URL:
    `https://portal.zeronetworks.com/api/v1/sso/azure/acs`
	
	c. In the **Sign on URL** text box, type the URL:
    `https://portal.zeronetworks.com/#/login`      	

1. On the **Set up single sign-on with SAML** page, in the **SAML Certificates** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Zero Networks** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

## Configure Zero Networks SSO

1. Log in to the Zero Networks Admin Portal as an administrator.

1. Navigate to **Settings** > **Identity Providers**.

1. Click on **Microsoft Azure** and perform the following steps.
    
    ![Screenshot shows settings of SSO configuration.](./media/zero-networks-tutorial/settings.png "Account")

    1. In the **Login URL** textbox, paste the **Login URL** value which you have copied from the Azure portal.

    1. In the **Logout URL** textbox, paste the **Logout URL** value which you have copied from the Azure portal.

    1. Open the downloaded **Certificate (Base64)** from the Azure portal into Notepad and paste the content into the **Certificate(Base64)** textbox.

    1. Click **Save**.

## Configure user assignment requirement

1. In the Azure portal, on the **Zero Networks** application integration page, find the **Manage** section and select **Properties**.
1. Change **User assignment required?** to **No**.

![Screenshot for User assignment required.](./media/zero-networks-tutorial/user-assignment.png)

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Zero Networks Sign-on URL where you can initiate the login flow. 

* Go to Zero Networks Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Zero Networks tile in the My Apps, this will redirect to Zero Networks Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).