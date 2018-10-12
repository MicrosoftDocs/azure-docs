---
title: Customize claims issued in the SAML token for enterprise applications in Azure AD | Microsoft Docs
description: Learn how to customize the claims issued in the SAML token for enterprise applications in Azure AD.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: f1daad62-ac8a-44cd-ac76-e97455e47803
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/11/2018
ms.author: celested
ms.reviewer: jeedes
ms.custom: aaddev
---

# How to: Customize claims issued in the SAML token for enterprise applications

Today Azure Active Directory (Azure AD) supports single sign on with most enterprise applications, including both applications pre-integrated in the Azure AD app gallery as well as custom applications. When a user authenticates to an application through Azure AD using the SAML 2.0 protocol, Azure AD sends a token to the application (via an HTTP POST). And then, the application validates and uses the token to log the user in instead of prompting for a username and password. These SAML tokens contain pieces of information about the user known as "claims".

A *claim* is information that an identity provider states about a user inside the token they issue for that user. In [SAML token](http://en.wikipedia.org/wiki/SAML_2.0), this data is typically contained in the SAML Attribute Statement. The user’s unique ID is typically represented in the SAML Subject also called as Name Identifier.

By default, Azure AD issues a SAML token to your application that contains a NameIdentifier claim, with a value of the user’s username (AKA user principal name) in Azure AD. this value can uniquely identify the user. The SAML token also contains additional claims containing the user’s email address, first name, and last name.

To view or edit the claims issued in the SAML token to the application, open the application in Azure portal. Then select the **View and edit all other user attributes** checkbox in the **User Attributes** section of the application.

![User Attributes section][1]

There are two possible reasons why you might need to edit the claims issued in the SAML token:
* The application has been written to require a different set of claim URIs or claim values.
* The application has been deployed in a way that requires the NameIdentifier claim to be something other than the username (AKA user principal name) stored in Azure AD.

You can edit any of the default claim values. Select the claim row in the SAML token attributes table. This opens the **Edit Attribute** section and then you can edit claim name, value, and namespace associated with the claim.

![Edit User Attribute][2]

You can also remove claims (other than NameIdentifier) using the context menu, which opens by clicking on the **...** icon. You can also add new claims using the **Add attribute** button.

![Edit User Attribute][3]

## Editing the NameIdentifier claim
To solve the problem where the application has been deployed using a different username, click on the **User Identifier** drop down in the **User Attributes** section. This action provides a dialog with several different options:

![Edit User Attribute][4]

In the drop-down, select **user.mail** to set the NameIdentifier claim to be the user’s email address in the directory. Or, select **user.onpremisessamaccountname** to set to the user’s SAM Account Name that has been synced from on-premises Azure AD.

You can also use the special **ExtractMailPrefix()** function to remove the domain suffix from either the email address, SAM Account Name, or the user principal name. This extracts only the first part of the user name being passed through (for example, "joe_smith" instead of joe_smith@contoso.com).

![Edit User Attribute][5]

We have now also added the **join()** function to join the verified domain with the user identifier value. when you select the join() function in the **User Identifier**
First select the user identifier as like email address or user principal name and then in the second drop-down select your verified domain. If you select the email address with the verified domain, then Azure AD extracts the username from the first value joe_smith from joe_smith@contoso.com and appends it with contoso.onmicrosoft.com. See the following example:

![Edit User Attribute][6]

## Adding claims
When adding a claim, you can specify the attribute name (which doesn’t strictly need to follow a URI pattern as per the SAML spec). Set the value to any user attribute that is stored in the directory.

![Add User Attribute][7]

For example, you need to send the department that the user belongs to in their organization as a claim (such as, Sales). Enter the claim name as expected by the application, and then select **user.department** as the value.

> [!NOTE]
> If for a given user there is no value stored for a selected attribute, then that claim is not being issued in the token.

> [!TIP]
> The **user.onpremisesecurityidentifier** and **user.onpremisesamaccountname** are only supported when synchronizing user data from on-premises Active Directory using the [Azure AD Connect tool](../hybrid/whatis-hybrid-identity.md).

## Restricted claims

There are some restricted claims in SAML. If you add these claims, then Azure AD will not send these claims. Following are the SAML restricted claim set:

	| Claim type (URI) |
	| ------------------- |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/expiration |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/expired |
	| http://schemas.microsoft.com/identity/claims/accesstoken |
	| http://schemas.microsoft.com/identity/claims/openid2_id |
	| http://schemas.microsoft.com/identity/claims/identityprovider |
	| http://schemas.microsoft.com/identity/claims/objectidentifier |
	| http://schemas.microsoft.com/identity/claims/puid |
	| http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier[MR1] |
	| http://schemas.microsoft.com/identity/claims/tenantid |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationinstant |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/authenticationmethod |
	| http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/groups |
	| http://schemas.microsoft.com/claims/groups.link |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/role |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/wids |
	| http://schemas.microsoft.com/2014/09/devicecontext/claims/iscompliant |
	| http://schemas.microsoft.com/2014/02/devicecontext/claims/isknown |
	| http://schemas.microsoft.com/2012/01/devicecontext/claims/ismanaged |
	| http://schemas.microsoft.com/2014/03/psso |
	| http://schemas.microsoft.com/claims/authnmethodsreferences |
	| http://schemas.xmlsoap.org/ws/2009/09/identity/claims/actor |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/samlissuername |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/confirmationkey |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/primarygroupsid |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid |
	| http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authorizationdecision |
	| http://schemas.xmlsoap.org/ws/2005/05/identity/claims/authentication |
	| http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarygroupsid |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlyprimarysid |
	| http://schemas.xmlsoap.org/ws/2005/05/identity/claims/denyonlysid |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/denyonlywindowsdevicegroup |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdeviceclaim |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsdevicegroup |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsfqbnversion |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/windowssubauthority |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsuserclaim |
	| http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname |
	| http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid |
	| http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn |
	| http://schemas.microsoft.com/ws/2008/06/identity/claims/ispersistent |
	| http://schemas.xmlsoap.org/ws/2005/05/identity/claims/privatepersonalidentifier |
	| http://schemas.microsoft.com/identity/claims/scope |

## Next steps

* [Application management in Azure AD](../manage-apps/what-is-application-management.md)
* [Configuring single sign-on to applications that are not in the Azure AD application gallery](../manage-apps/configure-federated-single-sign-on-non-gallery-applications.md)
* [Troubleshooting SAML-Based Single Sign-On](howto-v1-debug-saml-sso-issues.md)

<!--Image references-->
[1]: ./media/active-directory-saml-claims-customization/user-attribute-section.png
[2]: ./media/active-directory-saml-claims-customization/edit-claim-name-value.png
[3]: ./media/active-directory-saml-claims-customization/delete-claim.png
[4]: ./media/active-directory-saml-claims-customization/user-identifier.png
[5]: ./media/active-directory-saml-claims-customization/extractemailprefix-function.png
[6]: ./media/active-directory-saml-claims-customization/join-function.png
[7]: ./media/active-directory-saml-claims-customization/add-attribute.png
