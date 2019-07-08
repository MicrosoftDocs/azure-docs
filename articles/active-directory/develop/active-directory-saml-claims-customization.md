---
title: Customize claims issued in the SAML token for enterprise applications in Azure AD | Microsoft Docs
description: Learn how to customize the claims issued in the SAML token for enterprise applications in Azure AD.
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG
editor: ''

ms.assetid: f1daad62-ac8a-44cd-ac76-e97455e47803
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/03/2019
ms.author: ryanwi
ms.reviewer: luleon, paulgarn, jeedes
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# How to: Customize claims issued in the SAML token for enterprise applications

Today, Azure Active Directory (Azure AD) supports single sign-on (SSO) with most enterprise applications, including both applications pre-integrated in the Azure AD app gallery as well as custom applications. When a user authenticates to an application through Azure AD using the SAML 2.0 protocol, Azure AD sends a token to the application (via an HTTP POST). And then, the application validates and uses the token to log the user in instead of prompting for a username and password. These SAML tokens contain pieces of information about the user known as *claims*.

A *claim* is information that an identity provider states about a user inside the token they issue for that user. In [SAML token](https://en.wikipedia.org/wiki/SAML_2.0), this data is typically contained in the SAML Attribute Statement. The user’s unique ID is typically represented in the SAML Subject also called as Name Identifier.

By default, Azure AD issues a SAML token to your application that contains a `NameIdentifier` claim with a value of the user’s username (also known as the user principal name) in Azure AD, which can uniquely identify the user. The SAML token also contains additional claims containing the user’s email address, first name, and last name.

To view or edit the claims issued in the SAML token to the application, open the application in Azure portal. Then open the **User Attributes & Claims** section.

![Open the User Attributes & Claims section in the Azure portal](./media/active-directory-saml-claims-customization/sso-saml-user-attributes-claims.png)

There are two possible reasons why you might need to edit the claims issued in the SAML token:

* The application requires the `NameIdentifier` or NameID claim to be something other than the username (or user principal name) stored in Azure AD.
* The application has been written to require a different set of claim URIs or claim values.

## Editing NameID

To edit the NameID (name identifier value):

1. Open the **Name identifier value** page.
1. Select the attribute or transformation you want to apply to the attribute. Optionally, you can specify the format you want the NameID claim to have.

   ![Edit the NameID (name identifier) value](./media/active-directory-saml-claims-customization/saml-sso-manage-user-claims.png)

### NameID format

If the SAML request contains the element NameIDPolicy with a specific format, then Azure AD will honor the format in the request.

If the SAML request doesn't contain an element for NameIDPolicy, then Azure AD will issue the NameID with the  format you specify. If no format is specified Azure AD will use the default source format associated with the claim source selected.

From the **Choose name identifier format** dropdown, you can select one of the following options.

| NameID format | Description |
|---------------|-------------|
| **Default** | Azure AD will use the default source format. |
| **Persistent** | Azure AD will use Persistent as the NameID format. |
| **EmailAddress** | Azure AD will use EmailAddress as the NameID format. |
| **Unspecified** | Azure AD will use Unspecified as the NameID format. |
| **Transient** | Azure AD will use Transient as the NameID format. |

To learn more about the NameIDPolicy attribute, see [Single Sign-On SAML protocol](single-sign-on-saml-protocol.md).

### Attributes

Select the desired source for the `NameIdentifier` (or NameID) claim. You can select from the following options.

| Name | Description |
|------|-------------|
| Email | Email address of the user |
| userprincipalName | User principal name (UPN) of the user |
| onpremisessamaccount | SAM account name that has been synced from on-premises Azure AD |
| objectid | objectid of the user in Azure AD |
| employeeid | employeeid of the user |
| Directory extensions | Directory extensions [synced from on-premises Active Directory using Azure AD Connect Sync](../hybrid/how-to-connect-sync-feature-directory-extensions.md) |
| Extension Attributes 1-15 | On-premises extension attributes used to extend the Azure AD schema |

For more info, see [Table 3: Valid ID values per source](active-directory-claims-mapping.md#table-3-valid-id-values-per-source).

### Special claims - Transformations

You can also use the claims transformations functions.

| Function | Description |
|----------|-------------|
| **ExtractMailPrefix()** | Removes the domain suffix from either the email address or the user principal name. This extracts only the first part of the user name being passed through (for example, "joe_smith" instead of joe_smith@contoso.com). |
| **Join()** | Joins an attribute with a verified domain. If the selected user identifier value has a domain, it will extract the username to append the selected verified domain. For example, if you select the email (joe_smith@contoso.com) as the user identifier value and select contoso.onmicrosoft.com as the verified domain, this will result in joe_smith@contoso.onmicrosoft.com. |
| **ToLower()** | Converts the characters of the selected attribute into lowercase characters. |
| **ToUpper()** | Converts the characters of the selected attribute into uppercase characters. |

## Adding application-specific claims

To add application-specific claims:

1. In **User Attributes & Claims**, select **Add new claim** to open the **Manage user claims** page.
1. Enter the **name** of the claims. The value doesn't strictly need to follow a URI pattern, per the SAML spec. If you need a URI pattern, you can put that in the **Namespace** field.
1. Select the **Source** where the claim is going to retrieve its value. You can select a user attribute from the source attribute dropdown or apply a transformation to the user attribute before emitting it as a claim.

### Application-specific claims - Transformations

You can also use the claims transformations functions.

| Function | Description |
|----------|-------------|
| **ExtractMailPrefix()** | Removes the domain suffix from either the email address or the user principal name. This extracts only the first part of the user name being passed through (for example, "joe_smith" instead of joe_smith@contoso.com). |
| **Join()** | Creates a new value by joining two attributes. Optionally, you can use a separator between the two attributes. |
| **ToLower()** | Converts the characters of the selected attribute into lowercase characters. |
| **ToUpper()** | Converts the characters of the selected attribute into uppercase characters. |
| **Contains()** | Outputs an attribute or constant if the input matches the specified value. Otherwise, you can specify another output if there’s no match.<br/>For example, if you want to emit a claim where the value is the user’s email address if it contains the domain “@contoso.com”, otherwise you want to output the user principal name. To do this, you would configure the following values:<br/>*Parameter 1(input)*: user.email<br/>*Value*: "@contoso.com"<br/>Parameter 2 (output): user.email<br/>Parameter 3 (output if there's no match): user.userprincipalname |
| **EndWith()** | Outputs an attribute or constant if the input ends with the specified value. Otherwise, you can specify another output if there’s no match.<br/>For example, if you want to emit a claim where the value is the user’s employeeid if the employeeid ends with “000”, otherwise you want to output an extension attribute. To do this, you would configure the following values:<br/>*Parameter 1(input)*: user.employeeid<br/>*Value*: "000"<br/>Parameter 2 (output): user.employeeid<br/>Parameter 3 (output if there's no match): user.extensionattribute1 |
| **StartWith()** | Outputs an attribute or constant if the input starts with the specified value. Otherwise, you can specify another output if there’s no match.<br/>For example, if you want to emit a claim where the value is the user’s employeeid if the country/region starts with "US", otherwise you want to output an extension attribute. To do this, you would configure the following values:<br/>*Parameter 1(input)*: user.country<br/>*Value*: "US"<br/>Parameter 2 (output): user.employeeid<br/>Parameter 3 (output if there's no match): user.extensionattribute1 |
| **Extract() - After matching** | Returns the substring after it matches the specified value.<br/>For example, if the input's value is "Finance_BSimon", the matching value is "Finance_", then the claim's output is "BSimon". |
| **Extract() - Before matching** | Returns the substring until it matches the specified value.<br/>For example, if the input's value is "BSimon_US", the matching value is "_US", then the claim's output is "BSimon". |
| **Extract() - Between matching** | Returns the substring until it matches the specified value.<br/>For example, if the input's value is "Finance_BSimon_US", the first matching value is "Finance_", the second matching value is "_US", then the claim's output is "BSimon". |
| **ExtractAlpha() - Prefix** | Returns the prefix alphabetical part of the string.<br/>For example, if the input's value is "BSimon_123", then it returns "BSimon". |
| **ExtractAlpha() - Suffix** | Returns the suffix alphabetical part of the string.<br/>For example, if the input's value is "123_Simon", then it returns "Simon". |
| **ExtractNumeric() - Prefix** | Returns the prefix numerical part of the string.<br/>For example, if the input's value is "123_BSimon", then it returns "123". |
| **ExtractNumeric() - Suffix** | Returns the suffix numerical part of the string.<br/>For example, if the input's value is "BSimon_123", then it returns "123". |
| **IfEmpty()** | Outputs an attribute or constant if the input is null or empty.<br/>For example, if you want to output an attribute stored in an extensionattribute if the employeeid for a given user is empty. To do this, you would configure the following values:<br/>Parameter 1(input): user.employeeid<br/>Parameter 2 (output): user.extensionattribute1<br/>Parameter 3 (output if there's no match): user.employeeid |
| **IfNotEmpty()** | Outputs an attribute or constant if the input is not null or empty.<br/>For example, if you want to output an attribute stored in an extensionattribute if the employeeid for a given user is not empty. To do this, you would configure the following values:<br/>Parameter 1(input): user.employeeid<br/>Parameter 2 (output): user.extensionattribute1 |

If you need additional transformations, submit your idea in the [feedback forum in Azure AD](https://feedback.azure.com/forums/169401-azure-active-directory?category_id=160599) under the *SaaS application* category.

## Next steps

* [Application management in Azure AD](../manage-apps/what-is-application-management.md)
* [Configure single sign-on on applications that are not in the Azure AD application gallery](../manage-apps/configure-federated-single-sign-on-non-gallery-applications.md)
* [Troubleshoot SAML-based single sign-on](howto-v1-debug-saml-sso-issues.md)
