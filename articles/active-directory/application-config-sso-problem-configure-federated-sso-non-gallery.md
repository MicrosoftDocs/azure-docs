---
title: Problem configuring federated single sign-on for a non-gallery application | Microsoft Docs
description: Address some of the common problems you may encounter when configuring federated single sign-on to your custom SAML application that is not listed in the Azure AD Application Gallery
services: active-directory
documentationcenter: ''
author: ajamess
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/04/2017
ms.author: asteen

---

# Problem configuring federated single sign-on for a non-gallery application

If you encounter a problem when configuring an application. Verify you have followed all the steps in the article [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery.](https://docs.microsoft.com/azure/active-directory/active-directory-saas-custom-apps)

## Can’t add another instance of the application

To add a second instance of an application, you need to be able to:

-   Configure a unique identifier for the second instance. You won’t be able to configure the same identifier used for the first instance.

-   Configure a different certificate than the one used for the first instance.

If the application doesn’t support any of the above. Then, you won’t be able to configure a second instance.

## Where do I set the EntityID (User Identifier) format

You won’t be able to select the EntityID (User Identifier) format that Azure AD sends to the application in the response after user authentication.

Azure AD select the format for the NameID attribute (User Identifier) based on the value selected or the format requested by the application in the SAML AuthRequest. For more information visit the article [Single Sign-On SAML protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference#authnrequest) under the section NameIDPolicy,

## Where do I get the application metadata or certificate from Azure AD

To download the application metadata or certificate from Azure AD, follow the steps below:

1.  Open the [**Azure Portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **More services** at the bottom of the main left hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you have configured single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left hand navigation menu.

8.  Go to **SAML Signing Certificate** section, then click **Download** column value. Depending on what the application requires configuring single sign-on, you see either the option to download the Metadata XML or the Certificate.

Azure AD doesn’t provide a URL to get the metadata. The metadata can only be retrieved as a XML file.

## Next steps
[Managing Applications with Azure Active Directory](active-directory-enable-sso-scenario.md)
