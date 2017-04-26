---
title: Customizing claims issued in the SAML token for pre-integrated apps in Azure Active Directory | Microsoft Docs
description: Learn how to custom the claims issued in the SAML token for pre-integrated apps in Azure Active Directory
services: active-directory
documentationcenter: ''
author: asmalser-msft
manager: femila
editor: ''

ms.assetid: f1daad62-ac8a-44cd-ac76-e97455e47803
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/26/2016
ms.author: asmalser

---
# Customizing claims issued in the SAML token for pre-integrated apps in Azure Active Directory
Today Azure Active Directory supports thousands of pre-integrated applications in the Azure AD Application Gallery, including over 150 that support single sign-on using the SAML 2.0 protocol. When a user authenticates to an application through Azure AD using SAML, Azure AD sends a token to the application (via an HTTP 302 redirect). And then, the application validates and uses the token to log the user in instead of prompting for a username and password. These SAML tokens contain pieces of information about the user known as "claims".

In identity-speak, a “claim” is information that an identity provider states about a user inside the token they issue for that user. In a [SAML token](http://en.wikipedia.org/wiki/SAML_2.0), this data is typically contained in the SAML Attribute Statement, and the user’s unique ID is typically represented in the SAML Subject.

By default, Azure AD issues a SAML token to your application that contains a NameIdentifier claim, with a value of the user’s username in Azure AD. this value can uniquely identify the user. The SAML token also contains additional claims containing the user’s email address, first name, and last name.

To view or edit the claims issued in the SAML token to the application, open the application record in Azure classic portal and select the **Attributes** tab underneath the application.

![Attributes tab][1]

There are two possible reasons why you might need to edit the claims issued in the SAML token:
* The application has been written to require a different set of claim URIs or claim values 
* Your application has been deployed in a way that requires the NameIdentifier claim to be something other than the username (AKA user principal name) stored in Azure Active Directory. 

You can edit any of the default claim values. Select the pencil-shaped icon that appears on the right whenever you mouse over one of the rows in the SAML token attributes table. You can also remove claims (other than NameIdentifier) using the **X** icon, and add new claims using the **Add user attribute** button.

## Editing the NameIdentifier claim
To solve the problem where the application has been deployed using a different username, click the pencil icon next to the NameIdentifier claim. This action provides a dialog with several different options:

![Edit User Attribute][2]

In the **Attribute Value** menu, select **user.mail** to set the NameIdentifier claim to be the user’s email address in the directory. Or, select **user.onpremisessamaccountname** to set to the user’s SAM Account Name that has been synced from on-premise Azure AD.

You can also use the special ExtractMailPrefix() function to remove the domain suffix from either the email address or the user principal name. And then, only the first part of the user name being passed through (for example, "joe_smith" instead of joe_smith@contoso.com).

![Edit User Attribute][3]

## Adding claims
When adding a claim, you can specify the attribute name (which doesn’t strictly need to follow a URI pattern as per the SAML spec). Set the value to any user attribute that is stored in the directory.

![Add User Attribute][4]

For example, you need to send the department that the user belongs to in their organization as a claim (such as, Sales). You can enter whatever claim value is expected by the application, and then select **user.department** as the value.

If for a given user there is no value stored for a selected attribute, then that claim is not being issued in the token.

**Note:** The **user.onpremisesecurityidentifier** and **user.onpremisesamaccountname** are only supported when synchronizing user data from on-premise Active Directory using the [Azure AD Connect tool](../active-directory-aadconnect.md).

## Next steps
* [Article Index for Application Management in Azure Active Directory](../active-directory-apps-index.md)
* [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](../active-directory-saas-custom-apps.md)
* [Troubleshooting SAML-Based Single Sign-On](active-directory-saml-debugging.md)

<!--Image references-->
[1]: ../media/active-directory-saml-claims-customization/claimscustomization1.png
[2]: ../media/active-directory-saml-claims-customization/claimscustomization2.png
[3]: ../media/active-directory-saml-claims-customization/claimscustomization3.png
[4]: ../media/active-directory-saml-claims-customization/claimscustomization4.png