---
title: Problem configuring federated single sign-on for a non-gallery application | Microsoft Docs
description: Address some of the common problems you may encounter when configuring federated single sign-on to your custom SAML application that is not listed in the Azure AD Application Gallery
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: mimart

ms.collection: M365-identity-device-management
---

# Problem configuring federated single sign-on for a non-gallery application

If you encounter a problem when configuring an application. Verify you have followed all the steps in the article [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery.](https://docs.microsoft.com/azure/active-directory/application-config-sso-how-to-configure-federated-sso-non-gallery)

## Can’t add another instance of the application

To add a second instance of an application, you need to be able to:

-   Configure a unique identifier for the second instance. You cannot configure the same identifier used for the first instance.

-   Configure a different certificate than the one used for the first instance.

If the application doesn’t support any of the preceding, you cannot configure a second instance.

## Where do I set the EntityID (User Identifier) format

You cannot select the EntityID (User Identifier) format that Azure AD sends to the application in the response after user authentication.

Azure AD selects the format for the NameID attribute (User Identifier) based on the value selected or the format requested by the application in the SAML AuthRequest. For more information visit the article [Single Sign-On SAML protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference#authnrequest) under the section NameIDPolicy,

## Where do I get the application metadata or certificate from Azure AD

To download the application metadata or certificate from Azure AD, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you have configured single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Go to **SAML Signing Certificate** section, then click **Download** column value. Depending on what the application requires configuring single sign-on, you see either the option to download the Metadata XML or the Certificate.

Azure AD doesn’t provide a URL to get the metadata. The metadata can only be retrieved as an XML file.

## Don't know how to customize SAML claims sent to an application

To learn how to customize the SAML attribute claims sent to your application, see [Claims mapping in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-claims-mapping) for more information.

## Next steps
[Managing Applications with Azure Active Directory](what-is-application-management.md)
