---
title: Error message on application page after you sign in | Microsoft Docs
description: How to resolve issues with Azure AD sign in when the application returns an error message
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
ms.reviewer: asteen

ms.collection: M365-identity-device-management
---

# An error message appears on an application page after sign in

In this scenario, Azure Active Directory (Azure AD) signed the user in. But the application displays an error message and doesn't let the user finish the sign-in flow. The application didn't accept the response that's issued by Azure AD.

There are some possible reasons why the application didn’t accept the response from Azure AD. If the error message doesn't clearly identify what's missing in the response, do the following:

-   If the application is the Azure AD Gallery, verify that you followed all the steps in the article [How to debug SAML-based single sign-on to applications in Azure AD](https://azure.microsoft.com/documentation/articles/active-directory-saml-debugging).

-   Use a tool like [Fiddler](https://www.telerik.com/fiddler) to capture the SAML request, response, and token.

-   Share the SAML response with the application vendor to learn what's missing.

## Missing attributes in the SAML response

To add an attribute in the Azure AD configuration to be sent in the Azure AD response, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator or coadministrator.

2. At the top of the navigation pane. on the left side, select **All services** to open the *Azure Active Directory Extension*.

3. Type **Azure Active Directory** in the filter search box, and select **Azure Active Directory**.

4. Select **Enterprise Applications** from the Azure AD navigation panel on the left side.

5. Select **All Applications** to view a list of all your applications.

   > [!NOTE]
   > If you don't see the application that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to **All Applications**

6. Select the application that you want to configure single sign-on.

7. AFter the application loads, select **Single sign-on** from the navigation menu.

8. In the **User Attributes** section, select **View and edit all other user attributes under** to edit the attributes to send to the application in the SAML token when users sign in.

   To add an attribute:

   1. Select **Add attribute**. Enter the **Name** and select the **Value** from the drop-down list.

   1.  Select **Save.** You'll then see the new attribute in the table.

9. Save the configuration.

The next time that the user signs in to the application, Azure AD will send the new attribute in the SAML response.

## The application expects a different User Identifier value or format

The signing-in to the application fails because the SAML response is missing attributes such as roles or because the applications expect a different format for the EntityID attribute.

## How to add an attribute to the Azure AD application configuration

To change the User Identifier value, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator or coadministrator.

2. Select **All services** at the top of the navigation panel on the left side to open the Azure Active Directory Extension.

3. Type **“Azure Active Directory**” in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** from the Azure AD navigation menu pane on the left side.

5. Select **All Applications** to view a list of all your applications.

   > [!NOTE]
   > If you don't see the application that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to **All Applications**

6. Select the application that you want to configure single sign-on for.

7. after the application loads, select **Single sign-on** from the navigation panel on the left side.

8. Under **User attributes**, select the unique identifier for your users from the **User Identifier** drop-down list.

## Change EntityID (User Identifier) format

If the application expects another format for the EntityID attribute, you won’t be able to select the EntityID (User Identifier) format that Azure AD sends to the application in the response after user authentication.

Azure AD selects the format for the NameID attribute (User Identifier) based on the value that's selected or the format that's requested by the application in the SAML AuthRequest. For more information, see the "NameIDPolicy" section of [Single Sign-On SAML protocol](https://docs.microsoft.com/en-us/azure/active-directory/develop/single-sign-on-saml-protocol#nameidpolicy).

## The application expects a different signature method for the SAML response

To change which parts of the SAML token are digitally signed by Azure AD, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a Global Administrator or Coadministrator.

2. Select **All services** at the top of the main left-hand navigation menu to open the Azure Active Directory Extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** from the Azure AD menu on the left side.

5. Select **All Applications** to view a list of all your applications.

   > [!NOTE]
   > If you don't see the application that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to **All Applications**

6. Select the application that you want to configure single sign-on for.

7. After the application loads, select **Single sign-on** from the navigation menu on the left side.

8. Under **SAML Signing Certificate**, select  **Show advanced certificate signing settings**.

9. Select the **Signing Option** that the app expects:

   * **Sign SAML response**
   * **Sign SAML response and assertion**
   * **Sign SAML assertion**

The next time that the user signs in to the application, Azure AD signs the part of the SAML response that you selected.

## The application expects the SHA-1 signing algorithm 

By default, Azure AD signs the SAML token by using the most-secure algorithm. We recommend that you don't change the signing algorithm to SHA-1 unless the application requires SHA-1.

To change the signing algorithm, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator or coadmininstrator

2. Select **All services** at the top of the navigation menu on the left side to open the Azure Active Directory Extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** from the Azure AD navigation menu on the left side.

5. Select **All Applications** to view a list of all your applications.

   > [!NOTE]
   > If you don't see the application that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to **All Applications**

6. Select the application that you want to configure single sign-on for.

7. after the application loads, select **Single sign-on** from the navigation menu on the left side of the app.

8. Select **Show advanced certificate signing settings** under **SAML Signing Certificate**.

9. Select **SHA-1** as the **Signing Algorithm**.

The next time the user signs in to the application, Azure AD signs the SAML token by using SHA-1 algorithm.

## Next steps
[How to debug SAML-based single sign-on to applications in Azure AD](https://azure.microsoft.com/documentation/articles/active-directory-saml-debugging)
