---
title: Azure Active Directory SSO integration with Deem Mobile
description: Learn how to configure single sign-on between Azure Active Directory and Deem Mobile.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 07/07/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Deem Mobile

In this article, you'll learn how to integrate Deem Mobile with Azure Active Directory (Azure AD). Deem Mobile is designed for anyone who wants business travel to be fast and easy.  With full functionality to book flights, hotels, rental cars, and even Uber for Business. When you integrate Deem Mobile with Azure AD, you can:

* Control in Azure AD who has access to Deem Mobile.
* Enable your users to be automatically signed-in to Deem Mobile with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Deem Mobile in a test environment. Deem Mobile supports both **SP** and **IDP** initiated single sign-on.

## Prerequisites

To integrate Azure Active Directory with Deem Mobile, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Deem Mobile single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Deem Mobile application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Deem Mobile from the Azure AD gallery

Add Deem Mobile from the Azure AD application gallery to configure single sign-on with Deem Mobile. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Deem Mobile** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   [ ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration") ](common/edit-urls.png#lightbox)

1. On the **Basic SAML Configuration** section, perform the following steps:
    
    1. In the **Identifier** textDeem Mobile, type a value using one of the following patterns:
        
        | **Identifier** |
        |------------|
        | `<Deem_CustomerDomainName>-mobile` |
        | `<Deem_CustomerDomainName>:mobile` |

    1. In the **Reply URL** textbox, type the URL:
    `https://go.deem.com/idp/ACS.saml2`

    > [!Note]
    >  The Identifier value is not real. Update this value with the actual Identifier. Contact [Deem Mobile support team](mailto:customer.success@deem.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Your Deem Mobile application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **Unique User Identifier** is **user.userprincipalname** but Deem Mobile expects this to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration.

	[ ![Screenshot shows the image of token attributes configuration.](common/default-attributes.png "Image") ](common/default-attributes.png#lightbox)
    
1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    [ ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate") ](common/copy-metadataurl.png#lightbox)

## Configure Deem Mobile SSO

To configure single sign-on on **Deem Mobile** side, you need to send the **App Federation Metadata Url** to [Deem Mobile support team](mailto:customer.success@deem.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Deem Mobile test user

In this section, you create a user called Britta Simon in Deem Mobile. Work with [Deem Mobile support team](mailto:customer.success@deem.com) to add the users in the Deem Mobile platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Deem Mobile for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Deem Mobile tile in the My Apps, you should be automatically signed in to the Deem Mobile for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Deem Mobile you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).