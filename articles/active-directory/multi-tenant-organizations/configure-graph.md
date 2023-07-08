---
title: Configure a multi-tenant organization using Microsoft Graph API (Preview)
description: Learn how to configure a multi-tenant organization in Azure Active Directory using Microsoft Graph API.
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

# Configure a multi-tenant organization using Microsoft Graph API (Preview)

> [!IMPORTANT]
> Multi-tenant organization is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article describes the key steps to configure a multi-tenant organization using Microsoft Graph API.

This article uses an example owner tenant named *Cairo* and two member tenants named *Berlin* and *Athens*.

## Prerequisites


## Step 1: Sign in to the owner tenant

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

1. Use the [Create multiTenantOrganization](/graph/api/tenantrelationship-put-multitenantorganization?branch=pr-en-us-21123) API to create your multi-tenant organization. This operation can take a few minutes.

    **Request**

    ```http
    PUT https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization
    {
        "displayName": "Cairo"
    }
    ```

1. Use the [Get multiTenantOrganization](/graph/api/multitenantorganization-get?branch=pr-en-us-21123) API to check that the operation has completed before proceeding.

    **Request**

    ```http
    GET https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization
    ```
    
    **Response**

    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#tenantRelationships/multiTenantOrganization/$entity",
        "id": "{mtoId}",
        "createdDateTime": "2023-04-05T08:27:10Z",
        "displayName": "Cairo",
        "description": null
    }

## Step 3: Add tenants

1. Use the [Create multiTenantOrganizationMember](/graph/api/multitenantorganization-post-tenants?branch=pr-en-us-21123) API to add tenants to your multi-tenant organization.

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

1. Use the [List multiTenantOrganizationMembers](/graph/api/multitenantorganization-list-tenants?branch=pr-en-us-21123) API to verify that the operation has completed before proceeding.

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

By default, tenants added to the multi-tenant organization are member tenants. Optionally, you can change them to owner tenants, which will allow them to add other tenants to the multi-tenant organization. You can also change an owner tenant to a member tenant.

1. Use the [Update multiTenantOrganizationMember](/graph/api/multitenantorganizationmember-update?branch=pr-en-us-21123) API to change a member tenant to an owner tenant.

    **Request**

    ```http
    PATCH https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdB}
    {
        "role": "owner"
    }
    ```

1. Use the [Get multiTenantOrganizationMember](/graph/api/multitenantorganizationmember-get?branch=pr-en-us-21123) API to verify the change.

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

1. Use the [Update multiTenantOrganizationMember](/graph/api/multitenantorganizationmember-update?branch=pr-en-us-21123) API to change an owner tenant to a member tenant.

    **Request**

    ```http
    PATCH https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdB}
    {
        "role": "member"
    }
    ```

## Step 5: (Optional) Remove a member tenant

You can remove any member tenant, including your own. You can't remove owner tenants. Also, you can't remove the original creator tenant, even if it has been changed from owner to member.

1. Use the [Delete multiTenantOrganizationMember](/graph/api/multitenantorganization-delete-tenants?branch=pr-en-us-21123) API to remove any member tenant. This operation will take a few minutes.

    **Request**

    ```http
    DELETE https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/tenants/{memberTenantIdD}
    ```
    
1. Use the [Get multiTenantOrganizationMember](/graph/api/multitenantorganizationmember-get?branch=pr-en-us-21123) API to verify the change.

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

## Step 6: Sign in to a member tenant

The Cairo tenant created an multi-tenant organization and added the Berlin and Athens tenants. In these steps you sign in to the Berlin tenant and join the multi-tenant organization created by Cairo.

1. Start [Microsoft Graph Explorer tool](https://aka.ms/ge).

1. Sign in to the member tenant.

1. Select your profile and then select **Consent to permissions**.

1. Consent to the following required permissions.

    - `MultiTenantOrganization.ReadWrite.All`
    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`
    - `Application.ReadWrite.All`
    - `Directory.ReadWrite.All`

## Step 7: Unconfigure TRV2

1. Use the [Update crossTenantAccessPolicyConfigurationDefault](/graph/api/crosstenantaccesspolicyconfigurationdefault-update) to un-configure tenant restrictions version 2 (TRV2). 

    **Request**

    ```http
    PATCH https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/default
    {
        "tenantRestrictions": {
            "devices": null,
            "usersAndGroups": {
                "accessType": "blocked",
                "targets": [ {
                    "target": "AllUsers",
                    "targetType": "user"
                } ]
            },
            "applications": {
                "accessType": "blocked",
                "targets": [ {
                    "target": "AllApplications",
                    "targetType": "application"
                } ]
            }
        }
    }
    ```

1. In the unlikely case of any tenant-specific partner configuration having a patched tenantRestrictions attribute, you need to reset that attribute back to null as well.

## Step 8: Join the multi-tenant organization

1. Use the [Update multiTenantOrganizationJoinRequestRecord](/graph/api/multitenantorganizationjoinrequestrecord-update?branch=pr-en-us-21123) API to join the multi-tenant organization.

    **Request**

    ```http
    PATCH beta https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/joinRequest
    {
        "addedByTenantId": "{ownerTenantId}"
    }
    ```

1. Use the [Get multiTenantOrganizationJoinRequestRecord](/graph/api/multitenantorganizationjoinrequestrecord-get?branch=pr-en-us-21123) API to verify the join. 

    **Request**

    ```http
    GET https://graph.microsoft.com/beta/tenantRelationships/multiTenantOrganization/joinRequest
    ```

    This operation will take a few minutes to process. If you check immediately after calling the API to join, the response will be similar to the following.

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

1. Use the [List multiTenantOrganizationMembers](/graph/api/multitenantorganization-list-tenants?branch=pr-en-us-21123) API to check the multi-tenant organization itself. It should reflect the join operation.

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

## Next steps

