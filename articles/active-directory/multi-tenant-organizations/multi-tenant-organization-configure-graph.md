---
title: Configure a multi-tenant organization using the Microsoft Graph API (Preview)
description: Learn how to configure a multi-tenant organization in Microsoft Entra ID using the Microsoft Graph API.
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

# Configure a multi-tenant organization using the Microsoft Graph API (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Product Terms](https://aka.ms/EntraPreviewsTermsOfUse) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article describes the key steps to configure a multi-tenant organization using the Microsoft Graph API. This article uses an example owner tenant named *Cairo* and two member tenants named *Berlin* and *Athens*.

If you instead want to use the Microsoft 365 admin center to configure a multi-tenant organization, see [Set up a multi-tenant org in Microsoft 365 (Preview)](/microsoft-365/enterprise/set-up-multi-tenant-org) and [Join or leave a multi-tenant organization in Microsoft 365 (Preview)](/microsoft-365/enterprise/join-leave-multi-tenant-org). To learn how to configure Microsoft Teams for your multi-tenant organization, see [The new Microsoft Teams desktop client](/microsoftteams/new-teams-desktop-admin).

## Prerequisites

![Icon for the owner tenant.](./media/common/icon-tenant-owner.png)<br/>**Owner tenant**

- For license information, see [License requirements](./multi-tenant-organization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings and templates for the multi-tenant organization.
- [Global Administrator](../roles/permissions-reference.md#global-administrator) role to consent to required permissions.

![Icon for the member tenant.](./media/common/icon-tenant-member.png)<br/>**Member tenant**

- For license information, see [License requirements](./multi-tenant-organization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings and templates for the multi-tenant organization.
- [Global Administrator](../roles/permissions-reference.md#global-administrator) role to consent to required permissions.

## Step 1: Sign in to the owner tenant

![Icon for the owner tenant.](./media/common/icon-tenant-owner.png)<br/>**Owner tenant**

These steps describe how to use Microsoft Graph Explorer (recommended), but you can also use Postman, or another REST API client.

1. Start [Microsoft Graph Explorer tool](https://aka.ms/ge).

1. Sign in to the owner tenant.

1. Select your profile and then select **Consent to permissions**.

1. Consent to the following required permissions.

    - `MultiTenantOrganization.ReadWrite.All`
    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`
    - `Application.ReadWrite.All`
    - `Directory.ReadWrite.All`

## Step 2: Create a multi-tenant organization

![Icon for the owner tenant.](./media/common/icon-tenant-owner.png)<br/>**Owner tenant**

1. In the owner tenant, use the [Create multiTenantOrganization](/graph/api/tenantrelationship-put-multitenantorganization) API to create your multi-tenant organization. This operation can take a few minutes.

    **Request**

    ```http
    PUT https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization
    {
        "displayName": "Cairo"
    }
    ```

1. Use the [Get multiTenantOrganization](/graph/api/multitenantorganization-get) API to check that the operation has completed before proceeding.

    **Request**

    ```http
    GET https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization
    ```
    
    **Response**

    ```http
    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#tenantRelationships/multiTenantOrganization/$entity",
        "id": "{mtoId}",
        "createdDateTime": "2023-04-05T08:27:10Z",
        "displayName": "Cairo",
        "description": null
    }
    ```

## Step 3: Add tenants

![Icon for the owner tenant.](./media/common/icon-tenant-owner.png)<br/>**Owner tenant**

1. In the owner tenant, use the [Add multiTenantOrganizationMember](/graph/api/multitenantorganization-post-tenants) API to add tenants to your multi-tenant organization.

    **Request**

    ```http
    POST https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants
    {
        "tenantId": "{memberTenantIdB}",
        "displayName": "Berlin"
    }
    ```

    **Request**

    ```http
    POST https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants
    {
        "tenantId": "{memberTenantIdA}",
        "displayName": "Athens"
    }
    ```

1. Use the [List multiTenantOrganizationMembers](/graph/api/multitenantorganization-list-tenants) API to verify that the operation has completed before proceeding.

    **Request**

    ```http
    GET https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants
    ```

    **Response**

    ```http
    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#tenantRelationships/multiTenantOrganization/tenants"
        "value": [
            {
                "tenantId": "{ownerTenantId}",
                "displayName": "Cairo",
                "addedDateTime": "2023-04-05T08:27:10Z",
                "joinedDateTime": null,
                "addedByTenantId": "{ownerTenantId}",
                "role": "owner",
                "state": "active",
                "transitionDetails": null
            },
            {
                "tenantId": "{memberTenantIdB}",
                "displayName": "Berlin",
                "addedDateTime": "2023-04-05T08:30:44Z",
                "joinedDateTime": null,
                "addedByTenantId": "{ownerTenantId}",
                "role": "member",
                "state": "pending",
                "transitionDetails": {
                    "desiredState": "active",
                    "desiredRole": "member",
                    "status": "notStarted",
                    "details": null
                }
            },
            {
                "tenantId": "{memberTenantIdA}",
                "displayName": "Athens",
                "addedDateTime": "2023-04-05T08:31:03Z",
                "joinedDateTime": null,
                "addedByTenantId": "{ownerTenantId}",
                "role": "member",
                "state": "pending",
                "transitionDetails": {
                    "desiredState": "active",
                    "desiredRole": "member",
                    "status": "notStarted",
                    "details": null
                }
            }
        ]
    }
    ```

## Step 4: (Optional) Change the role of a tenant

![Icon for the owner tenant.](./media/common/icon-tenant-owner.png)<br/>**Owner tenant**

By default, tenants added to the multi-tenant organization are member tenants. Optionally, you can change them to owner tenants, which allow them to add other tenants to the multi-tenant organization. You can also change an owner tenant to a member tenant.

1. In the owner tenant, use the [Update multiTenantOrganizationMember](/graph/api/multitenantorganizationmember-update) API to change a member tenant to an owner tenant.

    **Request**

    ```http
    PATCH https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdB}
    {
        "role": "owner"
    }
    ```

1. Use the [Get multiTenantOrganizationMember](/graph/api/multitenantorganizationmember-get) API to verify the change.

    **Request**

    ```http
    GET https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdB}
    ```

    **Response**

    ```http
    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#tenantRelationships/multiTenantOrganization/tenants/$entity",
        "tenantId": "{memberTenantIdB}",
        "displayName": "Berlin",
        "addedDateTime": "2023-04-05T08:30:44Z",
        "joinedDateTime": null,
        "addedByTenantId": "{ownerTenantId}",
        "role": "member",
        "state": "pending",
        "transitionDetails": {
            "desiredState": "active",
            "desiredRole": "owner",
            "status": "notStarted",
            "details": null
        } 
    }
    ```

1. Use the [Update multiTenantOrganizationMember](/graph/api/multitenantorganizationmember-update) API to change an owner tenant to a member tenant.

    **Request**

    ```http
    PATCH https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdB}
    {
        "role": "member"
    }
    ```

## Step 5: (Optional) Remove a member tenant

![Icon for the owner tenant.](./media/common/icon-tenant-owner.png)<br/>**Owner tenant**

You can remove any member tenant, including your own. You can't remove owner tenants. Also, you can't remove the original creator tenant, even if it has been changed from owner to member.

1. In the owner tenant, use the [Remove multiTenantOrganizationMember](/graph/api/multitenantorganization-delete-tenants) API to remove any member tenant. This operation takes a few minutes.

    **Request**

    ```http
    DELETE https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdD}
    ```
    
1. Use the [Get multiTenantOrganizationMember](/graph/api/multitenantorganizationmember-get) API to verify the change.

    **Request**

    ```http
    GET beta https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdD}
    ```
    
    If you check immediately after calling the remove API, it will show a response similar to the following.

    **Response**

    ```http
    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#tenantRelationships/multiTenantOrganization/tenants/$entity",
        "tenantId": "{memberTenantIdD}",
        "displayName": "Denver",
        "addedDateTime": "2023-04-05T08:40:52Z",
        "joinedDateTime": null,
        "addedByTenantId": "{ownerTenantId}",
        "role": "member",
        "state": "pending",
        "transitionDetails": {
            "desiredState": "removed",
            "desiredRole": "member",
            "status": "notStarted",
            "details": null
        }
    }
    ```

    After the remove operation completes, the response is similar to the following. This is an expected error message. It indicates that the tenant has been removed from the multi-tenant organization.

    **Response**

    ```http
    {
        "error": {
            "code": "Directory_ObjectNotFound",
            "message": "Unable to read the company information from the directory.",
            "innerError": {
                "date": "2023-04-05T08:44:07",
                "request-id": "75216961-c21d-49ed-8c1f-2cfe51f920f1",
                "client-request-id": "30129b19-51e8-41ed-8ba0-1501bac03802"
            }
        }
    }
    ```
## Step 6: Wait

![Icon for the member tenant.](./media/common/icon-tenant-member.png)<br/>**Member tenant**

- To allow for asynchronous processing, wait a **minimum of 2 hours** between creation and joining a multi-tenant organization.

## Step 7: Sign in to a member tenant

![Icon for the member tenant.](./media/common/icon-tenant-member.png)<br/>**Member tenant**

The Cairo tenant created a multi-tenant organization and added the Berlin and Athens tenants. In these steps you sign in to the Berlin tenant and join the multi-tenant organization created by Cairo.

1. Start [Microsoft Graph Explorer tool](https://aka.ms/ge).

1. Sign in to the member tenant.

1. Select your profile and then select **Consent to permissions**.

1. Consent to the following required permissions.

    - `MultiTenantOrganization.ReadWrite.All`
    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`
    - `Application.ReadWrite.All`
    - `Directory.ReadWrite.All`

## Step 8: Join the multi-tenant organization

![Icon for the member tenant.](./media/common/icon-tenant-member.png)<br/>**Member tenant**

1. In the member tenant, use the [Update multiTenantOrganizationJoinRequestRecord](/graph/api/multitenantorganizationjoinrequestrecord-update) API to join the multi-tenant organization.

    **Request**

    ```http
    PATCH beta https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/joinRequest
    {
        "addedByTenantId": "{ownerTenantId}"
    }
    ```

1. Use the [Get multiTenantOrganizationJoinRequestRecord](/graph/api/multitenantorganizationjoinrequestrecord-get) API to verify the join. 

    **Request**

    ```http
    GET https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/joinRequest
    ```

    This operation takes a few minutes. If you check immediately after calling the API to join, the response will be similar to the following.

    **Response**

    ```http
    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#tenantRelationships/multiTenantOrganization/joinRequest/$entity",
        "id": "aa87e8a4-9c88-4e67-971d-79c9e43319a3",
        "addedByTenantId": "{ownerTenantId}",
        "memberState": "active",
        "role": "member",
        "transitionDetails": {
            "desiredMemberState": "active",
            "status": "notStarted",
            "details": ""
        }
    }
    ```

    After the join operation completes, the response is similar to the following.

    **Response**

    ```http
    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#tenantRelationships/multiTenantOrganization/joinRequest/$entity",
        "id": "aa87e8a4-9c88-4e67-971d-79c9e43319a3",
        "addedByTenantId": "{ownerTenantId}",
        "memberState": "active",
        "role": "member",
        "transitionDetails": null
    }
    ```

1. Use the [List multiTenantOrganizationMembers](/graph/api/multitenantorganization-list-tenants) API to check the multi-tenant organization itself. It should reflect the join operation.

    **Request**

    ```http
    GET https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants
    ```

    **Response**
    
    ```http
    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#tenantRelationships/multiTenantOrganization/tenants",
        "value": [
            {
                "tenantId": "{memberTenantIdA}",
                "displayName": "Athens",
                "addedDateTime": "2023-04-05T10:14:35Z",
                "joinedDateTime": null,
                "addedByTenantId": "{ownerTenantId}",
                "role": "member",
                "state": "active",
                "transitionDetails": null
            },
            {
                "tenantId": "{memberTenantIdB}",
                "displayName": "Berlin",
                "addedDateTime": "2023-04-05T08:30:44Z",
                "joinedDateTime": null,
                "addedByTenantId": "{ownerTenantId}",
                "role": "member",
                "state": "active",
                "transitionDetails": null
            },
            {
                "tenantId": "{ownerTenantId}",
                "displayName": "Cairo",
                "addedDateTime": "2023-04-05T08:27:10Z",
                "joinedDateTime": null,
                "addedByTenantId": "{ownerTenantId}",
                "role": "owner",
                "state": "active",
                "transitionDetails": null
            }
        ]
    }
    ```

1. To allow for asynchronous processing, wait **up to 4 hours** before joining a multi-tenant organization is completed.

## Step 9: (Optional) Leave the multi-tenant organization

![Icon for the member tenant.](./media/common/icon-tenant-member.png)<br/>**Member tenant**

You can leave a multi-tenant organization that you have joined. The process for removing your own tenant from the multi-tenant organization is the same as the process for removing another tenant from the multi-tenant organization.

If your tenant is the only multi-tenant organization owner, you must designate a new tenant to be the multi-tenant organization owner. For steps, see [Step 4: (Optional) Change the role of a tenant](#step-4-optional-change-the-role-of-a-tenant) 

- In the tenant, use the [Remove multiTenantOrganizationMember](/graph/api/multitenantorganization-delete-tenants) API to remove the tenant. This operation takes a few minutes.

    **Request**

    ```http
    DELETE https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdD}
    ```

## Step 10: (Optional) Delete the multi-tenant organization

![Icon for the owner tenant.](./media/common/icon-tenant-owner.png)<br/>**Owner tenant**

You delete a multi-tenant organization by removing all tenants. The process for removing the final owner tenant is the same as the process for removing all other member tenants.

- In the final owner tenant, use the [Remove multiTenantOrganizationMember](/graph/api/multitenantorganization-delete-tenants) API to remove the tenant. This operation takes a few minutes.

    **Request**

    ```http
    DELETE https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdD}
    ```

## Next steps

- [Set up a multi-tenant org in Microsoft 365 (Preview)](/microsoft-365/enterprise/set-up-multi-tenant-org)
- [Synchronize users in multi-tenant organizations in Microsoft 365 (Preview)](/microsoft-365/enterprise/sync-users-multi-tenant-orgs)
- [The new Microsoft Teams desktop client](/microsoftteams/new-teams-desktop-admin)
- [Configure multi-tenant organization templates using the Microsoft Graph API (Preview)](./multi-tenant-organization-configure-templates.md)
