---
title: Configure multi-tenant organization templates using Microsoft Graph API (Preview)
description: Learn how to configure multi-tenant organization templates in Azure Active Directory using the Microsoft Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: how-to
ms.date: 06/30/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Configure multi-tenant organization templates using the Microsoft Graph API (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article describes how to configure a policy template for your multi-tenant organization.

## Prerequisites

- Azure AD Premium P1 or P2 license. For more information, see [License requirements](./multi-tenant-organization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings and manage the multi-tenant organization.
- [Global Administrator](../roles/permissions-reference.md#global-administrator) role to consent to required permissions.

## Cross-tenant access policy partner template

### Configuring inbound and outbound automatic redemption

This step is performed automatically when you create or join a multi-tenant organization in the Microsoft 365 admin center. If you created or joined your multi-tenant organization using a different method, such as the Microsoft Graph API, follow these steps to automatically redeem invitations.

1. Check if you have any existing cross-tenant access policy partner configuration for the target tenants using the [Get crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-get?view=graph-rest-beta&preserve-view=true) API. If you do, you'll need to remove them.


    **Request**

    ```http
    GET https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners/{targetTenantId}
    ```

1. If applicable, remove the stale cross-tenant access policy partner configurations for the target tenant in your tenant using the [Delete crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-delete?view=graph-rest-beta&preserve-view=true) API.

    **Request**

    ```http
    DELETE https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners/{targetTenantId}
    ```

1. Now, you can create a cross-tenant access policy partner template using the [Update multiTenantOrganizationPartnerConfigurationTemplate](/graph/api/multitenantorganizationpartnerconfigurationtemplate-update?branch=pr-en-us-21123) API.


    **Request**

    ```http
    PATCH https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/templates/multiTenantOrganizationPartnerConfiguration

    {
        "inboundTrust": {
            "isMfaAccepted": true,
            "isCompliantDeviceAccepted": true,
            "isHybridAzureADJoinedDeviceAccepted": true
        },
        "automaticUserConsentSettings": {
            "inboundAllowed": true,
            "outboundAllowed": true
        },
        "templateApplicationLevel": "newPartners,existingPartners"
    }
    ```

### Disable the template for existing partners

You can choose to apply this template only to new members, and exclude existing partners by using the `templateApplicationLevel` parameter, and setting it for new partners only.

```http
"templateApplicationLevel": "newPartners"
```

### Disable the template completely

You can choose to disable the template completely by using the `templateApplicationLevel` parameter and setting it to null.

```http
"templateApplicationLevel": ""
```

### Reset the template

You can reset the template to its default state using the [multiTenantOrganizationPartnerConfigurationTemplate: resetToDefaultSettings](/graph/api/multitenantorganizationpartnerconfigurationtemplate-resettodefaultsettings?branch=pr-en-us-21123) API.

```http
POST https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/templates/multiTenantOrganizationPartnerConfiguration/resetToDefaultSettings
```

## Cross-tenant synchronization template

### Configure inbound user synchronization

This step is performed automatically when you create or join a multi-tenant organization in the Microsoft 365 admin center. If you created or joined your multi-tenant organization using a different method, such as the Microsoft Graph API, follow these steps to allow inbound user synchronization.


1. First, check if you have any existing synchronization partner configurations for the target tenants using the [Get crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-get?view=graph-rest-beta&preserve-view=true) API. If you do, you'll need to remove them.

    **Request**

    ```http
    GET https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners/{targetTenantId}
    ```
    
1. If applicable, remove any stale synchronization partner configurations for the target tenant in your tenant using the [Delete crossTenantIdentitySyncPolicyPartner](/graph/api/crosstenantidentitysyncpolicypartner-delete?view=graph-rest-beta&preserve-view=true) API.

    **Request**

    ```http
    DELETE https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners/{targetTenantId}/identitySynchronization
    ```
    
1. Now, you can create a user synchronization template using the [Update multiTenantOrganizationIdentitySyncPolicyTemplate](/graph/api/multitenantorganizationidentitysyncpolicytemplate-update?branch=pr-en-us-21123) API.

    **Request**

    ```http
    PATCH https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/templates/multiTenantOrganizationIdentitySynchronization

    {
        "templateApplicationLevel": "newPartners,existingPartners",
        "userSyncInbound": {
            "isSyncAllowed": true
        }
    }
    ```
    
### Reset the template

To reset the template to its default state, use the [multiTenantOrganizationIdentitySyncPolicyTemplate: resetToDefaultSettings](/graph/api/multitenantorganizationidentitysyncpolicytemplate-resettodefaultsettings?branch=pr-en-us-21123) API.

**Request**

```http
POST https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/templates/multiTenantOrganizationIdentitySynchronization/resetToDefaultSettings
```
    
## Next steps

- [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md)
