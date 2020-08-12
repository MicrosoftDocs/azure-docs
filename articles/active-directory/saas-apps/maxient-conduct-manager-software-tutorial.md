---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Maxient Conduct Manager Software | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Maxient Conduct Manager Software.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 85e71b76-cac3-4ce6-a35f-796d2cb7bdb5
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 12/18/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Maxient Conduct Manager Software

In this tutorial, you'll learn how to integrate Maxient Conduct Manager Software with Azure Active Directory (Azure AD). When you integrate Maxient Conduct Manager Software with Azure AD, you can:

* Utilize Azure AD to authenticate your users for the Maxient Conduct Manager Software
* Enable your users to be automatically signed-in to Maxient Conduct Manager Software with their Azure AD accounts.


To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Maxient Conduct Manager Software single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you will configure your Azure AD for use with Maxient Conduct Manager Software.


* Maxient Conduct Manager Software supports **SP and IDP** initiated SSO

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding Maxient Conduct Manager Software from the gallery

To configure the integration of Maxient Conduct Manager Software into Azure AD, you need to add Maxient Conduct Manager Software from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Maxient Conduct Manager Software** in the search box.
1. Select **Maxient Conduct Manager Software** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for Maxient Conduct Manager Software

Configure and test Azure AD SSO with Maxient Conduct Manager Software. For SSO to work, you need to establish a connection between Azure AD and the Maxient Conduct Manager Software.

To configure and test Azure AD SSO with Maxient Conduct Manager Software, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to authenticate for use with the Maxient Conduct Manager Software
    1. **[Assign all users to use Maxient](#assign-all-users-to-be-able-to-authenticate-for-the-maxient-conduct-manager-software)** - to allow everyone at your institution to be able to authenticate.
1. **[Test Azure AD Setup With Maxient](#test-with-maxient)** - to verify whether the configuration works, and the correct attributes are being released

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Maxient Conduct Manager Software** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section the application is pre-configured in **IDP** initiated mode and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://cm.maxient.com/<SCHOOLCODE>`

    > [!NOTE]
    > The value is not real. Update the value with the actual Sign-on URL. Work with your Maxient Implementation/Support representative to get the value.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.  You will need to provide your Maxient Implementation/Support representative with this URL.

	![The Certificate download link](common/copy-metadataurl.png)

### Assign All Users to be Able to Authenticate for the Maxient Conduct Manager Software

In this section, you will grant access for all accounts to authenticate using the Azure system for the Maxient Conduct Manager Software.  It is important to note that this step is **REQUIRED** for Maxient to function properly.  Maxient leverages your Azure AD system to *authenticate* users. The *authorization* of users is performed within the Maxient system for the particular function they’re trying to perform. Maxient does not use attributes from your directory to make those decisions.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Maxient Conduct Manager Software**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select all users (or the appropriate groups) and **assign** them to be able to authenticate with Maxient.

## Test with Maxient 

If a support ticket has not already been opened with a Maxient Implementation/Support representative, send an email to [support@maxient.com](mailto:support@maxient.com) with the subject "Campus Based Authentication/Azure Setup - \<\<School Name\>\>". In the body of the email, provide the **App Federation Metadata Url**. Maxient staff will respond with a test link to verify the proper attributes are being released.  
	
## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Maxient Conduct Manager Software with Azure AD](https://aad.portal.azure.com/)

