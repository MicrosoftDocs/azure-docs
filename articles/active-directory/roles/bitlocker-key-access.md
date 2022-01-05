---
title: Block self-service BitLocker key access (Preview)
description: Block self-service BitLocker key access (Preview) in Azure Active Directory
services: active-directory
author: rolyon
manager: KarenH444
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 01/07/2022
ms.author: rolyon
ms.reviewer: 
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Block self-service BitLocker key access (Preview)

> [!IMPORTANT]
> Blocking self-service BitLocker key access is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

If don't want registered owners of a device to have access to their BitLocker keys, you can block their self-service BitLocker key access. Blocking self-service BitLocker key access applies to the entire tenant. Administrators who have been assigned roles to read BitLocker keys on the tenant will still be able to read their keys.

## Prerequisites

- Privileged Role Administrator or Global Administrator

## Microsoft Graph API

Currently, the only way to block self-service BitLocker access for a tenant is by using the Microsoft Graph API.

1. If you haven't already, [grant admin consent when using Graph Explorer for Microsoft Graph API](prerequisites.md#graph-explorer).

1. Sign in to the [Graph Explorer tool](https://aka.ms/ge).

1. Select **Modify permissions (Preview)**

1. Find the **Policy.ReadWrite.Authorization** permission and select **Consent**.
 
1. Set the operation to **PATCH**.

1. Set the version to **v1.0**.

1. Set the URI to  `https://graph.microsoft.com/v1.0/policies/authorizationPolicy`.

1. Set the request body to the following:

    ```http
    {
        "defaultUserRolePermissions": {
            "allowedToReadBitLockerKeysForOwnedDevice": false
        }
    }
    ```

1. Select **Run query**.

1. Verify an HTTP 204 status is received.

#### Allow self-service BitLocker key access

To allow self-service BitLocker key access, follow the previous steps with the following request body.

```http
{
    "defaultUserRolePermissions": {
        "allowedToReadBitLockerKeysForOwnedDevice": true
    }
}
```

## Next steps

- [Device management permissions for Azure AD custom roles](custom-device-permissions.md)
