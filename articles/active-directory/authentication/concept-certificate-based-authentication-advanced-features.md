---
title:  Advanced features for Azure Active Directory certificate-based authentication
description: Learn about advanced features for Azure Active Directory certificate-based authentication

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/29/2022


ms.author: justinha
author: vimrang
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Advanced features for Azure AD certificate-based authentication 

This topic covers how to use one certificate for multiple accounts and support for external identities who use certificate-based authentication (CBA).

## Using one certificate for multiple accounts 

The certificateUserIds attribute is a unique constraint multivalued attribute. An admin can use multiple bindings and add appropriate values to the multivalued certificateUserIds attribute to authenticate multiple accounts by using one certificate.

The lookup for the Azure AD user object happens when the user enters their Azure AD User Principal Name (UPN). If it's Windows sign-in, Windows sends the UPN to Azure AD. The username bindings are used to validate the certificate to successfully authenticate the user. Also, if the admin has configured multiple bindings, Azure AD will evaluate all the bindings until a successful authentication, or all the bindings are evaluated. This helps the admin use specific configurations to use one certificate for multiple accounts.

### Scoping 1:M to specific users

Since 1:M is not a feature that all users should be allowed to use, tenant admins should scope it to only the users who need 1:M support. This is an important security configuration that admins should follow. By default, the tenant admin would configure all the user accounts to hold values for all bindings so users other than 1:M scope can't use one certificate to multiple accounts.
 
For example, if the tenant admin wants a certificate to _only_ be used for Bob's productivity account and block the use of that certificate on other accounts, they would configure Bob's productivity account to hold all of the values available in the username mapping policy. 

In this example, to lock Bob's certificate to only Bob's productivity account, use the [certificateUserIds](concept-certificate-based-authentication-certificateuserids.md) attribute because it has a unique constraint, and no other user account can have the same values.
 
Here are the values for UPN and certificateUserIDs for Bob's productivity account:
 
Azure AD User Principal Name = Bob.Smith@Contoso.com <br>
certificateUserIDs = [ x509:\<PN>Bob.Smith@Contoso.com , x509:\<SKI>89b0f468c1abea65ec22f0a882b8fda6fdd6750p]

By default, Azure AD CBA has a single user binding configured. The UPN attribute is the Subject Alternative Name of a certificate presented to Azure AD. Some administrators require the ability for Azure AD to be able to map a single certificate to multiple Azure AD accounts. We refer to this as 1:M mapping. Azure AD CBA supports 1:M mapping. Administrators can add mapping methods to the policy. 

For example, Bob has a regular productivity account that he uses for his everyday tasks. Let's say Bob is also a software developer who uses a developer account to access test environments. The organization issues a single, high-assurance certificate to Bob and wants him to use this same certificate for both his productivity and developer accounts. 

To set up this 1:M mapping in Azure AD CBA, configure the policy values in the following table. 

|Description| Values |
|--------------------------|--------------------------------------|
|Certificate Information | Principal Name in SAN = Bob.Smith@contoso.com <br> Certificate's Subject Key Identifier (SKI) = 89b0f468c1abea65ec22f0a882b8fda6fdd6750p |
|Bobs Productivity Account| AAD User Principal Name = Bob.Smith@contoso.com <br> certificateUserIDs = Empty|
|Bobs Developer Account| AAD UserPrincipalName = Bob.Smith-dev@contoso.com <br> certificateUserIds = x509:\<SKI>89b0f468c1abea65ec22f0a882b8fda6fdd6750p |
|Tenant User Binding Policy | Priority 1 Principal Name in SAN -> Azure AD UPN <br> Priority 2 Certificate SKI -> certificateUserIds |

The preceding configuration would allow the same certificate to be used by Bob for both his productivity and developer account. Because of fallback support for bindings, Bob's productivity account will be authenticated by the UPN binding policy and Bob's developer account will be authenticated by the SKI binding policy.


## External identity support

An external identity can't perform multifactor authentication (MFA) to the resource tenant with Azure AD CBA. Instead, have the user perform MFA using CBA in the home tenant, and set up cross tenant settings for the resource tenant to trust MFA from the home tenant.

For more information about how to enable **Trust multi-factor authentication from Azure AD tenants**, see [Configure B2B collaboration cross-tenant access](../external-identities/cross-tenant-access-settings-b2b-collaboration.md#to-change-inbound-trust-settings-for-mfa-and-device-claims).

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Azure AD CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Azure AD CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
