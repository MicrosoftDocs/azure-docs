---
title: Azure Active Directory SSO integration with SpedTrack
description: Learn how to configure single sign-on between Azure Active Directory and SpedTrack.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 12/19/2022
ms.author: jeedes

---

# Azure Active Directory SSO integration with SpedTrack

In this article, you'll learn how to integrate SpedTrack with Azure Active Directory (Azure AD). SpedTrack provides a comprehensive web-based solution for school districts to manage their Special Services departments. When you integrate SpedTrack with Azure AD, you can:

* Control in Azure AD who has access to SpedTrack.
* Enable your users to be automatically signed-in to SpedTrack with their Azure AD accounts.

You'll configure and test Azure AD single sign-on for SpedTrack in a test environment. SpedTrack supports both **SP** and **IDP** initiated single sign-on.

## Prerequisites

To integrate Azure Active Directory with SpedTrack, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SpedTrack single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the SpedTrack application from the Azure AD gallery. A user within your tenant will need to be assigned to the application. This test user will need to exist within SpedTrack also. 

### Add SpedTrack from the Azure AD gallery

Add SpedTrack from the Azure AD application gallery to configure single sign-on with SpedTrack. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Assign an Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal. This test user will also need to be created within SpedTrack with a matching email.

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **SpedTrack** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file** then perform the following steps:

	a. Click **Upload metadata file**.

    ![Screenshot shows how to upload metadata file.](common/upload-metadata.png "File")

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![Screenshot shows how to choose and browse metadata file.](common/browse-upload-metadata.png "Folder")

	c. After the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Basic SAML Configuration section.

	d. In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.spedtrack.com/Login.aspx`

1. If needed, fill the values manually that copied from the SpedTrack in the **Basic SAML Configuration** section by clicking pencil icon.

    a. In the **Identifier** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.spedtrack.com`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.spedtrack.com/SSO/AssertionConsumerService.aspx`

1. If you want to configure **SP** initiated SSO, then perform the following step:  

    In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.spedtrack.com/Login.aspx`

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

## Configure SpedTrack SSO

1. Log in to your SpedTrack company site as an administrator.

1. Navigate to **Admin > District Setup > Single Sign-On**.

1. Click **Edit Config** and select **Azure** as your **IdP Provider**.

1. Download the SP Metadata file or copy the values of Identifier, Reply URL, Sign on URL and Logout URL. 

1. Select **Upload Metadata** to upload the **Federation Metadata XML** file, which you've downloaded from the Azure portal.

1. **Save** the changes within SpedTrack after uploading the file. 

### Create SpedTrack test user

In this section, you create a user called Britta Simon in SpedTrack. Work with [SpedTrack support team](mailto:support@spedtrack.com) to add the users in the SpedTrack platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Ensure the user being tested was allowed access to the application and exists within SpedTrack.
* Within SpedTrack navigate to **Admin > District Setup > Single Sign-On**. Click on **Test Config**. 

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the SpedTrack for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the SpedTrack tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the SpedTrack for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure SpedTrack you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).