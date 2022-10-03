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

The Azure AD user object lookup happens with the Azure AD UPN the user enters (or, in case of Windows sign-in, the Azure AD UPN that Windows sends) and the username bindings is used to validate the certificate to successfully authenticate the user. Also, if the admin has configured multiple bindings, Azure AD will evaluate all the bindings until a successful authentication, or all the bindings are evaluated. This helps the admin use specific configurations to achieve one certificate to multiple accounts.

**Scoping 1:M to specific users**

Since 1:M is not a feature that all users should be allowed to use, tenant admins should scope to just the users that would need 1:M support. This is an important security configuration that admins should follow. By default, the tenant admin would configure all the user accounts to hold values for all bindings so users other than 1:M scope cannot use one certificate to multiple accounts.
 
Say, if the tenant admin wishes for that certificate to ONLY be used for Bob productivity account and block the use of the certificate on other accounts, they would configure Bob's productivity account to hold all of the values available in the username mapping policy. 

In this example, to lock Bob's certificate to only Bob's productivity account as certificateUserIds attribute has unique constraint and no other user account can have the same values.
 
**Bobs Productivity Account**
 
AAD User Principal Name = Bob.Smith@Contoso.com <br>
certificateUserIDs = [ x509:\<PN\>Bob.Smith@Contoso.com , x509:\<SKI\>89b0f468c1abea65ec22f0a882b8fda6fdd6750p]

By default, Azure AD CBA has a single user binding configured. The Principal Name attribute in the Subject Alternative Name of a certificate presented to Azure AD. Some administrators require the ability for Azure AD to be able to map a single certificate to multiple Azure AD accounts. We refer to this as 1:M mapping. Azure AD CBA supports this implementation via administrators adding additional mapping methods to the policy. 

An example of this would be a developer use case. For example, Bob has a regular productivity account that is used to accomplish his everyday tasks and a developer account to use when he is doing task related to his developer job roles. The organization issues a single high assurance certificate to Bob and wishes for him to be able to use this same certificate for both his productivity and developer accounts. 

This 1:M implementation could be implemented in Azure AD CBA by configuring the policy as follows. 

|Description| Values |
|--------------------------|--------------------------------------|
|Certificate Information | Principal Name in SAN = Bob.Smith@contoso.com <br> Certificate's Subject Key Identifier (SKI) = 89b0f468c1abea65ec22f0a882b8fda6fdd6750p |
|Bobs Productivity Account| AAD User Principal Name = Bob.Smith@contoso.com <br> certificateUserIDs = Empty|
|Bobs Developer Account| AAD UserPrincipalName = Bob.Smith-dev@contoso.com <br> certificateUserIds = x509:\<SKI\>89b0f468c1abea65ec22f0a882b8fda6fdd6750p |
|Tenant User Binding Policy | Priority 1 Principal Name in SAN -> Azure AD UPN <br> Priority 2 Certificate SKI -> certificateUserIds |

The above configuration would allow the same certificate to be used by Bob for both his productivity and developer account. Since we have fallback support for bindings, Bob's productivity account will be authenticated by UPN binding policy and Bob's developer account will be authenticated by SKI binding policy 


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
