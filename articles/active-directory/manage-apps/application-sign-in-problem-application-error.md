---
title: Error message appears on app page after you sign in | Microsoft Docs
description: How to resolve issues with Azure AD sign in when the app returns an error message.
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

# An app page shows an error message after the user signs in

In this scenario, Azure Active Directory (Azure AD) signs the user in. But the application displays an error message and doesn't let the user finish the sign-in flow. The problem is that the app didn't accept the response that Azure AD issued.

There can be several reasons why the app doesn’t accept the response from Azure AD. If the error message doesn't clearly identify what's missing from the response, try the following:

-   If the app is the Azure AD gallery, verify that you followed the steps in [How to debug SAML-based single sign-on to applications in Azure AD](https://azure.microsoft.com/documentation/articles/active-directory-saml-debugging).

-   Use a tool like [Fiddler](https://www.telerik.com/fiddler) to capture the SAML request, response, and token.

-   Send the SAML response to the app vendor and ask them what's missing.

## Missing attributes in the SAML response

To add an attribute in the Azure AD configuration that will be sent in the Azure AD response, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator or co-admin.

2. At the top of the navigation pane on the left side, select **All services** to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your apps.

   > [!NOTE]
   > If you don't see the app that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to "All Applications."

6. Select the application that you want to configure for single sign-on.

7. After the app loads, select **Single sign-on** in the navigation pane.

8. In the **User Attributes** section, select **View and edit all other user attributes**. Here you can change which attributes to send to the app in the SAML token when users sign in.

   To add an attribute:

   1. Select **Add attribute**. Enter the **Name**, and select the **Value** from the drop-down list.

   1.  Select **Save**. You'll see the new attribute in the table.

9. Save the configuration.

   The next time that the user signs in to the app, Azure AD will send the new attribute in the SAML response.

## The app expects a different User Identifier value or format

Signing in to the app fails because the SAML response is missing an attribute such as a role, or because the app expects a different format for the **EntityID** attribute.

## How to add an attribute to the Azure AD app configuration

To change the User Identifier value, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator or co-admin.

2. Select **All services** at the top of the navigation pane on the left side to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your apps.

   > [!NOTE]
   > If you don't see the app that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to "All Applications."

6. Select the app that you want to configure for SSO.

7. After the app loads, select **Single sign-on** in the navigation pane.

8. Under **User attributes**, select the unique identifier for the users from the **User Identifier** drop-down list.

## Change EntityID (User Identifier) format

If the application expects another format for the **EntityID** (User Identifier) attribute, you won’t be able to select the **EntityID** format that Azure AD sends to the app in the response after user authentication.

Azure AD selects the format for the **NameID** attribute (User Identifier) based on the value that's selected or the format that's requested by the app in the SAML AuthRequest. For more information, see the "NameIDPolicy" section of [Single sign-on SAML protocol](https://docs.microsoft.com/en-us/azure/active-directory/develop/single-sign-on-saml-protocol#nameidpolicy).

## The app expects a different signature method for the SAML response

To change which parts of the SAML token are digitally signed by Azure AD, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator or co-admin.

2. Select **All services** at the top of the navigation pane on the left side to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your apps.

   > [!NOTE]
   > If you don't see the application that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to "All Applications."

6. Select the application that you want to configure for single sign-on.

7. After the application loads, select **Single sign-on** in the navigation pane.

8. Under **SAML Signing Certificate**, select  **Show advanced certificate signing settings**.

9. Select the **Signing Option** that the app expects from among these options:

   * **Sign SAML response**
   * **Sign SAML response and assertion**
   * **Sign SAML assertion**

   The next time that the user signs in to the app, Azure AD will sign the part of the SAML response that you selected.

## The app expects the SHA-1 signing algorithm

By default, Azure AD signs the SAML token by using the most-secure algorithm. We recommend that you don't change the signing algorithm to *SHA-1* unless the app requires SHA-1.

To change the signing algorithm, follow these steps:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a global administrator or co-admin.

2. Select **All services** at the top of the navigation pane on the left side to open the Azure AD extension.

3. Type **Azure Active Directory** in the filter search box, and then select **Azure Active Directory**.

4. Select **Enterprise Applications** in the Azure AD navigation pane.

5. Select **All Applications** to view a list of your applications.

   > [!NOTE]
   > If you don't see the application that you want, use the **Filter** control at the top of the **All Applications List**. Set the **Show** option to "All Applications."

6. Select the app that you want to configure for single sign-on.

7. After the app loads, select **Single sign-on** from the navigation pane on the left side of the app.

8. Select **Show advanced certificate signing settings** under **SAML Signing Certificate**.

9. Select **SHA-1** as the **Signing Algorithm**.

   The next time that the user signs in to the app, Azure AD will sign the SAML token by using the SHA-1 algorithm.

## Next steps
[How to debug SAML-based single sign-on to applications in Azure AD](https://azure.microsoft.com/documentation/articles/active-directory-saml-debugging).
