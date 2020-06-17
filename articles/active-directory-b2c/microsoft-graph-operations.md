---
title: Supported Microsoft Graph operations
titleSuffix: Azure AD B2C
description: An index of the Microsoft Graph operations supported for the management of Azure AD B2C resources, including users, user flows, identity providers, custom policies, policy keys, and more.
services: B2C
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 02/20/2020
ms.author: mimart
ms.subservice: B2C
---
# Microsoft Graph operations available for Azure AD B2C

The following Microsoft Graph API operations are supported for the management of Azure AD B2C resources, including users, identity providers, user flows, custom policies, and policy keys.

Each link in the following sections targets the corresponding page within the Microsoft Graph API reference for that operation.

## User management

- [List users](https://docs.microsoft.com/graph/api/user-list)
- [Create a consumer user](https://docs.microsoft.com/graph/api/user-post-users)
- [Get a user](https://docs.microsoft.com/graph/api/user-get)
- [Update a user](https://docs.microsoft.com/graph/api/user-update)
- [Delete a user](https://docs.microsoft.com/graph/api/user-delete)

For more information about managing Azure AD B2C user accounts with the Microsoft Graph API, see [Manage Azure AD B2C user accounts with Microsoft Graph](manage-user-accounts-graph-api.md).

## Identity providers (user flow)

Manage the identity providers available to your user flows in your Azure AD B2C tenant.

- [List identity providers registered in the Azure AD B2C tenant](https://docs.microsoft.com/graph/api/identityprovider-list)
- [Create an identity provider](https://docs.microsoft.com/graph/api/identityprovider-post-identityproviders)
- [Get an identity provider](https://docs.microsoft.com/graph/api/identityprovider-get)
- [Update identity provider](https://docs.microsoft.com/graph/api/identityprovider-update)
- [Delete an identity provider](https://docs.microsoft.com/graph/api/identityprovider-delete)

## User flow

Configure pre-built policies for sign-up, sign-in, combined sign-up and sign-in, password reset, and profile update.

- [List user flows](https://docs.microsoft.com/graph/api/identityuserflow-list)
- [Create a user flow](https://docs.microsoft.com/graph/api/identityuserflow-post-userflows)
- [Get a user flow](https://docs.microsoft.com/graph/api/identityuserflow-get)
- [Delete a user flow](https://docs.microsoft.com/graph/api/identityuserflow-delete)

## Custom policies

The following operations allow you to manage your Azure AD B2C Trust Framework policies, known as [custom policies](custom-policy-overview.md).

- [List all trust framework policies configured in a tenant](https://docs.microsoft.com/graph/api/trustframework-list-trustframeworkpolicies)
- [Create trust framework policy](https://docs.microsoft.com/graph/api/trustframework-post-trustframeworkpolicy)
- [Read properties of an existing trust framework policy](https://docs.microsoft.com/graph/api/trustframeworkpolicy-get)
- [Update or create trust framework policy.](https://docs.microsoft.com/graph/api/trustframework-put-trustframeworkpolicy)
- [Delete an existing trust framework policy](https://docs.microsoft.com/graph/api/trustframeworkpolicy-delete)

## Policy keys

The Identity Experience Framework stores the secrets referenced in a custom policy to establish trust between components. These secrets can be symmetric or asymmetric keys/values. In the Azure portal, these entities are shown as **Policy keys**.

The top-level resource for policy keys in the Microsoft Graph API is the [Trusted Framework Keyset](https://docs.microsoft.com/graph/api/resources/trustframeworkkeyset). Each **Keyset** contains at least one **Key**. To create a key, first create an empty keyset, and then generate a key in the keyset. You can create a manual secret, upload a certificate, or a PKCS12 key. The key can be a generated secret, a string you define (such as the Facebook application secret), or a certificate you upload. If a keyset has multiple keys, only one of the keys is active.

### Trust Framework policy keyset

- [List the trust framework keysets](https://docs.microsoft.com/graph/api/trustframework-list-keysets)
- [Create a trust framework keysets](https://docs.microsoft.com/graph/api/trustframework-post-keysets)
- [Get a keyset](https://docs.microsoft.com/graph/api/trustframeworkkeyset-get)
- [Update a trust framework keysets](https://docs.microsoft.com/graph/api/trustframeworkkeyset-update)
- [Delete a trust framework keysets](https://docs.microsoft.com/graph/api/trustframeworkkeyset-delete)

### Trust Framework policy key

- [Get currently active key in the keyset](https://docs.microsoft.com/graph/api/trustframeworkkeyset-getactivekey)
- [Generate a key in keyset](https://docs.microsoft.com/graph/api/trustframeworkkeyset-generatekey)
- [Upload a string based secret](https://docs.microsoft.com/graph/api/trustframeworkkeyset-uploadsecret)
- [Upload a X.509 certificate](https://docs.microsoft.com/graph/api/trustframeworkkeyset-uploadcertificate)
- [Upload a PKCS12 format certificate](https://docs.microsoft.com/graph/api/trustframeworkkeyset-uploadpkcs12)

## Applications

- [List applications](https://docs.microsoft.com/graph/api/application-list)
- [Create an application](https://docs.microsoft.com/graph/api/resources/application)
- [Update application](https://docs.microsoft.com/graph/api/application-update)
- [Create servicePrincipal](https://docs.microsoft.com/graph/api/resources/serviceprincipal)
- [Create oauth2Permission Grant](https://docs.microsoft.com/graph/api/resources/oauth2permissiongrant)
- [Delete application](https://docs.microsoft.com/graph/api/application-delete)

## Application extension properties

- [List extension properties](https://docs.microsoft.com/graph/api/application-list-extensionproperty)

Azure AD B2C provides a directory that can hold 100 custom attributes per user. For user flows, these extension properties are [managed by using the Azure portal](custom-policy-custom-attributes.md). For custom policies, Azure AD B2C creates the property for you the first time the policy writes a value to the extension property.

## Audit logs

- [List audit logs](https://docs.microsoft.com/graph/api/directoryaudit-list)

For more information about accessing Azure AD B2C audit logs with the Microsoft Graph API, see [Accessing Azure AD B2C audit logs](view-audit-logs.md).
