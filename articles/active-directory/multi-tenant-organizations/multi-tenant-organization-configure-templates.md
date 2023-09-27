---
title: Configure multi-tenant organization templates using Microsoft Graph API (Preview)
description: Learn how to configure multi-tenant organization templates in Microsoft Entra ID using the Microsoft Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: how-to
ms.date: 09/22/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Configure multi-tenant organization templates using the Microsoft Graph API (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Product Terms](https://aka.ms/EntraPreviewsTermsOfUse) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article describes how to configure a policy template for your multi-tenant organization.

## Prerequisites

- For license information, see [License requirements](./multi-tenant-organization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings and templates for the multi-tenant organization.
- [Global Administrator](../roles/permissions-reference.md#global-administrator) role to consent to required permissions.

## Cross-tenant access policy partner template

The [cross-tenant access partner configuration](../external-identities/cross-tenant-access-settings-b2b-collaboration.md) handles trust settings and automatic user consent settings between partner tenants. For example, you can use these settings to trust multi-factor authentication claims for inbound users from the target partner tenant. With the template in an unconfigured state, partner configurations for partner tenants in the multi-tenant organization won't be amended, with all trust settings passed through from default settings. However, if you configure the template, then partner configurations will be amended corresponding to the policy template. 

### Configure inbound and outbound automatic redemption

To specify which trust settings and automatic user consent settings to apply to your policy template, use the [Update multiTenantOrganizationPartnerConfigurationTemplate](/graph/api/multitenantorganizationpartnerconfigurationtemplate-update) API. If you create or join a multi-tenant organization using the Microsoft 365 admin center, this configuration is handled automatically.

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

To apply this template only to new multi-tenant organization members and exclude existing partners, set the `templateApplicationLevel` parameter to new partners only.

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
    "templateApplicationLevel": "newPartners"
}
```

### Disable the template completely

To disable the template completely, set the `templateApplicationLevel` parameter to null.

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
    "templateApplicationLevel": ""
}
```

### Reset the template

To reset the template to its default state (decline all trust and automatic user consent), use the [multiTenantOrganizationPartnerConfigurationTemplate: resetToDefaultSettings](/graph/api/multitenantorganizationpartnerconfigurationtemplate-resettodefaultsettings) API.

```http
POST https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/templates/multiTenantOrganizationPartnerConfiguration/resetToDefaultSettings
```

## Cross-tenant synchronization template

The identity synchronization policy governs [cross-tenant synchronization](cross-tenant-synchronization-overview.md), which allows you to share users and groups across tenants in your organization. You can use these settings to allow inbound user synchronization. With the template in an unconfigured state, the identity synchronization policy for partner tenants in the multi-tenant organization won't be amended. However, if you configure the template, then the identity synchronization policy will be amended corresponding to the policy template.

### Configure inbound user synchronization

To allow inbound user synchronization in the policy template, use the [Update multiTenantOrganizationIdentitySyncPolicyTemplate](/graph/api/multitenantorganizationidentitysyncpolicytemplate-update) API. If you create or join a multi-tenant organization using the Microsoft 365 admin center, this configuration is handled automatically.

**Request**

```http
PATCH https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/templates/multiTenantOrganizationIdentitySynchronization

{
    "userSyncInbound": {
        "isSyncAllowed": true
    },
    "templateApplicationLevel": "newPartners,existingPartners"
}
```

### Disable the template for existing partners

To apply this template only to new multi-tenant organization members and exclude existing partners, set the `templateApplicationLevel` parameter to new partners only.

**Request**

```http
PATCH https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/templates/multiTenantOrganizationIdentitySynchronization

{
    "userSyncInbound": {
        "isSyncAllowed": true
    },
    "templateApplicationLevel": "newPartners"
}
```

### Disable the template completely

To disable the template completely, set the `templateApplicationLevel` parameter to null.

**Request**

```http
PATCH https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/templates/multiTenantOrganizationIdentitySynchronization

{
    "userSyncInbound": {
        "isSyncAllowed": true
    },
    "templateApplicationLevel": ""
}
```

### Reset the template

To reset the template to its default state (decline inbound synchronization), use the [multiTenantOrganizationIdentitySyncPolicyTemplate: resetToDefaultSettings](/graph/api/multitenantorganizationidentitysyncpolicytemplate-resettodefaultsettings) API.

**Request**

```http
POST https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/templates/multiTenantOrganizationIdentitySynchronization/resetToDefaultSettings
```
    
## Next steps

- [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md)
