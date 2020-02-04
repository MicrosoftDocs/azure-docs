---
title: Supported Microsoft Graph operations
titleSuffix: Azure AD B2C
description: An index of the Microsoft Graph operations supported for the management of Azure AD B2C resources, including users, user flows, identity providers, custom policies, and policy keys.
services: B2C
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 02/08/2020
ms.author: marsma
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

The following operations allow you to manage your Azure AD B2C Trust Framework Policies, known as [custom policies](custom-policy-overview.md).

- [List all trust framework policies configured in a tenant](https://docs.microsoft.com/graph/api/trustframework-list-trustframeworkpolicies.md)
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

Azure AD B2C provides a directory that can hold 100 custom attributes per user. For user flows, these extension properties are [managed by using the Azure portal](custom-policy-custom-attributes.md). For custom policies, Azure AD B2C creates the property for you the first time the policy writes a value to the extension property.

With Microsoft Graph, you can [list the extension properties](https://docs.microsoft.com/graph/api/application-list-extensionproperty) registered for your application.

## Audit logs

To download Azure AD B2C audit log events with the Microsoft Graph API, filter the logs on the `B2C` category. To filter by category, use the `filter` query string parameter when you call Microsoft Graph reporting API endpoint. You can [get the list of audit logs generated by Azure Active Directory](https://docs.microsoft.com/graph/api/directoryaudit-list).

The following example returns the list of audit log events generated by Azure Active Directory B2C.

```HTTP
GET https://graph.microsoft.com/v1.0/auditLogs/directoryAudits?$filter=loggedByService eq 'B2C' and activityDateTime gt 2019-09-10T02:28:17Z
```
