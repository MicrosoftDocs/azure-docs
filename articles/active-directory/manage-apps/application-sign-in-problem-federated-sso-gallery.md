---
title: Problems signing in to a gallery application configured for federated single sign-on | Microsoft Docs
description: Guidance for the specific errors when signing into an application you have configured for SAML-based federated single sign-on with Azure AD
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: barbkess
ms.reviewer: asteen

---

# Problems signing in to a gallery application configured for federated single sign-on

To troubleshoot your problem, you need to verify the application configuration in Azure AD as follow:

-   You have followed all the configuration steps for the Azure AD gallery application.

-   The Identifier and Reply URL configured in AAD match they expected values in the application

-   You have assigned users to the application

## Application not found in directory

*Error AADSTS70001: Application with Identifier ‘https://contoso.com’ was not found in the directory*.

**Possible cause**

The Issuer attribute sends from the application to Azure AD in the SAML request doesn’t match the Identifier value configured in the application Azure AD.

**Resolution**

Ensure that the Issuer attribute in the SAML request it’s matching the Identifier value configured in Azure AD:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Go to **Domain and URLs** section. Verify that the value in the Identifier textbox is matching the value for the identifier value displayed in the error.

After you have updated the Identifier value in Azure AD and it’s matching the value sends by the application in the SAML request, you should be able to sign in to the application.

## The reply address does not match the reply addresses configured for the application.

*Error AADSTS50011: The reply address ‘https://contoso.com’ does not match the reply addresses configured for the application*

**Possible cause**

The AssertionConsumerServiceURL value in the SAML request doesn't match the Reply URL value or pattern configured in Azure AD. The AssertionConsumerServiceURL value in the SAML request is the URL you see in the error.

**Resolution**

Ensure that the AssertionConsumerServiceURL value in the SAML request it's matching the Reply URL value configured in Azure AD.

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Go to **Domain and URLs** section. Verify or update the value in the Reply URL textbox to match the AssertionConsumerServiceURL value in the SAML request. 	
	* If you don't see the Reply URL textbox, select the **Show advanced URL settings** checkbox.

After you have updated the Reply URL value in Azure AD and it’s matching the value sends by the application in the SAML request, you should be able to sign in to the application.

## User not assigned a role

*Error AADSTS50105: The signed in user 'brian@contoso.com' is not assigned to a role for the application*.

**Possible cause**

The user has not been granted access to the application in Azure AD.

**Resolution**

To assign one or more users to an application directly, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to assign a user to from the list.

7.  Once the application loads, click **Users and Groups** from the application’s left-hand navigation menu.

8.  Click the **Add** button on top of the **Users and Groups** list to open the **Add Assignment** pane.

9.  click the **Users and groups** selector from the **Add Assignment** pane.

10. Type in the **full name** or **email address** of the user you are interested in assigning into the **Search by name or email address** search box.

11. Hover over the **user** in the list to reveal a **checkbox**. Click the checkbox next to the user’s profile photo or logo to add your user to the **Selected** list.

12. **Optional:** If you would like to **add more than one user**, type in another **full name** or **email address** into the **Search by name or email address** search box, and click the checkbox to add this user to the **Selected** list.

13. When you are finished selecting users, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the users you have selected.

15. Click the **Assign** button to assign the application to the selected users.

After a short period of time, the users you have selected be able to launch these applications using the methods described in the solution description section.

## Not a valid SAML Request

*Error AADSTS75005: The request is not a valid Saml2 protocol message.*

**Possible cause**

Azure AD doesn’t support the SAML Request sent by the application for Single Sign-on. Some common issues are:

-   Missing required fields in the SAML request

-   SAML request encoded method

**Resolution**

1.  Capture SAML request. follow the tutorial [How to debug SAML-based single sign-on to applications in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-debugging) to learn how to capture the SAML request.

2.  Contact the application vendor and share:

   -   SAML request

   -   [Azure AD Single Sign-on SAML protocol requirements](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference)

They should validate they support the Azure AD SAML implementation for Single Sign-on.

## No resource in requiredResourceAccess list

*Error AADSTS65005:The client application has requested access to resource '00000002-0000-0000-c000-000000000000'. This request has failed because the client has not specified this resource in its requiredResourceAccess list*.

**Possible cause**

The application object is corrupted.

**Resolution: option 1**

To solve the problem, add the unique Identifier value in the Azure AD configuration. To add a Identifier value, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you have configured single sign-on.

7.  Once the application loads, click on the **Single sign-on** from the application’s left-hand navigation menu

8.  Under the **Domain and URL** section, check on the **Show advanced URL settings**.

9.  in the **Identifier** textbox type a unique identifier for the application.

10. **Save** the configuration.


**Resolution option 2**

If option 1 above did not work for you, try removing the application from the directory. Then, add and reconfigure the application, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on

7.  Click **Delete** at the top-left of the application **Overview** pane.

8.  Refresh Azure AD and Add the application from the Azure AD gallery. Then, Configure the application

<span id="_Hlk477190176" class="anchor"></span>After reconfiguring the application, you should be able to sign in to the application.

## Certificate or key not configured

*Error AADSTS50003: No signing key configured.*

**Possible cause**

The application object is corrupted and Azure AD doesn’t recognize the certificate configured for the application.

**Resolution**

To delete and create a new certificate, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

 * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  click **Create new certificate** under the **SAML signing Certificate** section.

9.  Select Expiration date. Then, click **Save.**

10. Check **Make new certificate active** to override the active certificate. Then, click **Save** at the top of the pane and accept to activate the rollover certificate.

11. Under the **SAML Signing Certificate** section, click **remove** to remove the **Unused** certificate.

## Problem when customizing the SAML claims sent to an application

To learn how to customize the SAML attribute claims sent to your application, see [Claims mapping in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-claims-mapping) for more information.

## Next steps
[How to debug SAML-based single sign-on to applications in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-debugging)
