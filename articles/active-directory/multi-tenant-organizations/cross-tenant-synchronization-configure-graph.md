---
title: Configure cross-tenant synchronization using Microsoft Graph API (preview)
description: Learn how to configure cross-tenant synchronization in Azure Active Directory using Microsoft Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: how-to
ms.date: 04/15/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Configure cross-tenant synchronization using Microsoft Graph API (preview)

> [!IMPORTANT]
> Cross-tenant synchronization is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article describes the key steps to configure cross-tenant synchronization using Microsoft Graph API. When configured, Azure AD automatically provisions and de-provisions B2B users in your target tenant. For detailed steps using the Azure portal, see [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md).

:::image type="content" source="./media/common/configure-diagram.png" alt-text="Diagram that shows cross-tenant synchronization between source tenant and target tenant." lightbox="./media/common/configure-diagram.png":::

## Prerequisites

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

- Azure AD Premium P1 or P2 license. For more information, see [License requirements](cross-tenant-synchronization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings.
- [Hybrid Identity Administrator](../roles/permissions-reference.md#hybrid-identity-administrator) role to configure cross-tenant synchronization.
- [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator) or [Application Administrator](../roles/permissions-reference.md#application-administrator) role to assign users to a configuration and to delete a configuration.
- [Global Administrator](../roles/permissions-reference.md#global-administrator) role to consent to required permissions.

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

- Azure AD Premium P1 or P2 license. For more information, see [License requirements](cross-tenant-synchronization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings.
- [Global Administrator](../roles/permissions-reference.md#global-administrator) role to consent to required permissions.

## Step 1: Sign in to tenants and consent to permissions

![Icon for the source tenant.](./media/common/icon-tenant-source.png) ![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Source and target tenants**

These steps describe how to use Microsoft Graph Explorer (recommended), but you can also use Postman, or another REST API client.

1. Start [Microsoft Graph Explorer tool](https://aka.ms/ge).

1. Sign in to the source tenant.

1. Select your profile and then select **Consent to permissions**.

    :::image type="content" source="./media/cross-tenant-synchronization-configure-graph/graph-explorer-profile.png" alt-text="Screenshot of Graph Explorer profile with Consent to permissions link." lightbox="./media/cross-tenant-synchronization-configure-graph/graph-explorer-profile.png":::

1. Consent to the following required permissions:

    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`
    - `Application.ReadWrite.All`
    - `Directory.ReadWrite.All`

    If you see a **Need admin approval** page, you'll need to sign in with a user that has been assigned the Global Administrator role to consent.

1. Start another instance of [Microsoft Graph Explorer tool](https://aka.ms/ge).

1. Sign in to the target tenant.

1. Consent to the following required permissions:

    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`

1. Get the tenant ID of the source and target tenants. The example configuration described in this article uses the following tenant IDs:

    - Source tenant ID: {sourceTenantId}
    - Target tenant ID: {targetTenantId}

## Step 2: Enable user synchronization in the target tenant

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

1. In the target tenant, use the [Create crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicy-post-partners?view=graph-rest-beta&preserve-view=true) API to create a new partner configuration in a cross-tenant access policy between the target tenant and the source tenant. Use the source tenant ID in the request.

    If you get an `Request_MultipleObjectsWithSameKeyValue` error, you might already have an existing configuration. For more information, see [Symptom - Request_MultipleObjectsWithSameKeyValue error](#symptom---request_multipleobjectswithsamekeyvalue-error).

    **Request**

    ```http
    POST https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners
    Content-Type: application/json
    
    {
      "tenantId": "{sourceTenantId}"
    }
    ```
    
    **Response**
    
    ```http
    HTTP/1.1 201 Created
    Content-Type: application/json
    
    {
      "@odata.context": "https://graph.microsoft.com/beta/$metadata#policies/crossTenantAccessPolicy/partners/$entity",
      "tenantId": "{sourceTenantId}",
      "isServiceProvider": null,
      "inboundTrust": null,
      "b2bCollaborationOutbound": null,
      "b2bCollaborationInbound": null,
      "b2bDirectConnectOutbound": null,
      "b2bDirectConnectInbound": null,
      "tenantRestrictions": null,
      "crossCloudMeetingConfiguration":
      {
        "inboundAllowed": null,
        "outboundAllowed": null
      },
      "automaticUserConsentSettings":
      {
        "inboundAllowed": null,
        "outboundAllowed": null
      }
    }
    ```

1. Use the [Create identitySynchronization](/graph/api/crosstenantaccesspolicyconfigurationpartner-put-identitysynchronization?view=graph-rest-beta&preserve-view=true) API to enable user synchronization in the target tenant.

    If you get an `Request_MultipleObjectsWithSameKeyValue` error, you might already have an existing policy. For more information, see [Symptom - Request_MultipleObjectsWithSameKeyValue error](#symptom---request_multipleobjectswithsamekeyvalue-error).

    **Request**
    
    ```http
    PUT https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners/{sourceTenantId}/identitySynchronization
    Content-type: application/json
    
    {
       "displayName": "Fabrikam",
       "userSyncInbound": 
        {
          "isSyncAllowed": true
        }
    }
    ```
    
    **Response**
    
    ```http
    HTTP/1.1 204 No Content
    ```

## Step 3: Automatically redeem invitations in the target tenant

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

1. In the target tenant, use the [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update?view=graph-rest-beta&preserve-view=true) API to automatically redeem invitations and suppress consent prompts for inbound access.

    **Request**
    
    ```http
    PATCH https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners/{sourceTenantId}
    Content-Type: application/json
    
    {
        "inboundTrust": null,
        "automaticUserConsentSettings":
        {
            "inboundAllowed": true
        }
    }
    ```
    
    **Response**
    
    ```http
    HTTP/1.1 204 No Content
    ```

## Step 4: Automatically redeem invitations in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

1. In the source tenant, use the [Create crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicy-post-partners?view=graph-rest-beta&preserve-view=true) API to create a new partner configuration in a cross-tenant access policy between the source tenant and the target tenant. Use the target tenant ID in the request.

    If you get an `Request_MultipleObjectsWithSameKeyValue` error, you might already have an existing configuration. For more information, see [Symptom - Request_MultipleObjectsWithSameKeyValue error](#symptom---request_multipleobjectswithsamekeyvalue-error).

    **Request**

    ```http
    POST https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners
    Content-Type: application/json
    
    {
      "tenantId": "{targetTenantId}"
    }
    ```
    
    **Response**
    
    ```http
    HTTP/1.1 201 Created
    Content-Type: application/json
    
    {
      "@odata.context": "https://graph.microsoft.com/beta/$metadata#policies/crossTenantAccessPolicy/partners/$entity",
      "tenantId": "{targetTenantId}",
      "isServiceProvider": null,
      "inboundTrust": null,
      "b2bCollaborationOutbound": null,
      "b2bCollaborationInbound": null,
      "b2bDirectConnectOutbound": null,
      "b2bDirectConnectInbound": null,
      "tenantRestrictions": null,
      "crossCloudMeetingConfiguration":
      {
        "inboundAllowed": null,
        "outboundAllowed": null
      },
      "automaticUserConsentSettings":
      {
        "inboundAllowed": null,
        "outboundAllowed": null
      }
    }
    ```

1. Use the [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update?view=graph-rest-beta&preserve-view=true) API to automatically redeem invitations and suppress consent prompts for outbound access.

    **Request**
    
    ```http
    PATCH https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners/{targetTenantId}
    Content-Type: application/json
    
    {
        "automaticUserConsentSettings":
        {
            "outboundAllowed": true
        }
    }
    ```
    
    **Response**
    
    ```http
    HTTP/1.1 204 No Content
    ```

## Step 5: Create a configuration application in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

1. In the source tenant, use the [applicationTemplate: instantiate](/graph/api/applicationtemplate-instantiate?view=graph-rest-beta&preserve-view=true) API to add an instance of a configuration application from the Azure AD application gallery into your tenant.
    
    **Request**
    
    ```http
    POST https://graph.microsoft.com/beta/applicationTemplates/518e5f48-1fc8-4c48-9387-9fdf28b0dfe7/instantiate
    Content-type: application/json
    
    {
      "displayName": "Fabrikam"
    }
    ```
    
    **Response**
    
    ```http
    HTTP/1.1 201 Created
    Content-type: application/json
    
    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#microsoft.graph.applicationServicePrincipal",
        "application": {
            "objectId": "{objectId}",
            "appId": "{appId}",
            "applicationTemplateId": "518e5f48-1fc8-4c48-9387-9fdf28b0dfe7",
            "displayName": "Fabrikam",
            "homepage": "{homepage}",
            "identifierUris": [],
            "publicClient": null,
            "replyUrls": [],
            "logoutUrl": null,
            "samlMetadataUrl": null,
            "errorUrl": null,
            "groupMembershipClaims": null,
            "availableToOtherTenants": false,
            "requiredResourceAccess": []
        },
        "servicePrincipal": {
            "objectId": "{objectId}",
            "deletionTimestamp": null,
            "accountEnabled": true,
            "appId": "{appId}",
            "appDisplayName": "Fabrikam",
            "applicationTemplateId": "518e5f48-1fc8-4c48-9387-9fdf28b0dfe7",
            "appOwnerTenantId": "{targetTenantId}",
            "appRoleAssignmentRequired": true,
            "displayName": "Fabrikam",
            "errorUrl": null,
            "loginUrl": null,
            "logoutUrl": null,
            "homepage": "{homepage}",
            "samlMetadataUrl": null,
            "microsoftFirstParty": null,
            "publisherName": "{tenantDisplayName}",
            "preferredSingleSignOnMode": null,
            "preferredTokenSigningKeyThumbprint": null,
            "preferredTokenSigningKeyEndDateTime": null,
            "replyUrls": [],
            "servicePrincipalNames": [
                "{appId}"
            ],
            "tags": [
                "WindowsAzureActiveDirectoryIntegratedApp"
            ],
            "notificationEmailAddresses": [],
            "samlSingleSignOnSettings": null,
            "keyCredentials": [],
            "passwordCredentials": []
        }
    }
    ```

1. Save the service principal object ID.

## Step 6: Test the connection to the target tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

1. Get the service principal object ID from the previous step.

    Be sure to use the service principal object ID instead of the application ID.

2. In the source tenant, use the [synchronizationJob: validateCredentials](/graph/api/synchronization-synchronizationjob-validatecredentials?view=graph-rest-beta&preserve-view=true) API to test the connection to the target tenant and validate the credentials.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/jobs/validateCredentials
    Content-Type: application/json
    
    {
        "useSavedCredentials": false,
        "templateId": "Azure2Azure",
        "credentials": [
            {
                "key": "CompanyId",
                "value": "{targetTenantId}"
            },
            {
                "key": "AuthenticationType",
                "value": "SyncPolicy"
            }
        ]
    }
    ```

    **Response**
    
    ```http
    HTTP/1.1 204 No Content
    ```

## Step 7: Create a provisioning job in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

In the source tenant, to enable provisioning, create a provisioning job.

1. Determine the [synchronization template](/graph/api/resources/synchronization-synchronizationtemplate?view=graph-rest-beta&preserve-view=true) to use, such as `Azure2Azure`.

    A template has pre-configured synchronization settings. 
    
1. In the source tenant, use the [Create synchronizationJob](/graph/api/synchronization-synchronizationjob-post?view=graph-rest-beta&preserve-view=true) API to create a provisioning job based on a template.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/jobs
    Content-type: application/json
    
    { 
        "templateId": "Azure2Azure"
    }
    ```
    
    **Response**
    
    ```http
    HTTP/1.1 201 Created
    Content-type: application/json
    
    {
        "@odata.context": "https://graph.microsoft.com/beta/$metadata#servicePrincipals('{servicePrincipalId}')/synchronization/jobs/$entity",
        "id": "{jobId}",
        "templateId": "Azure2Azure",
        "schedule": {
            "expiration": null,
            "interval": "PT40M",
            "state": "Disabled"
        },
        "status": {
            "countSuccessiveCompleteFailures": 0,
            "escrowsPruned": false,
            "code": "Paused",
            "lastExecution": null,
            "lastSuccessfulExecution": null,
            "lastSuccessfulExecutionWithExports": null,
            "quarantine": null,
            "steadyStateFirstAchievedTime": "0001-01-01T00:00:00Z",
            "steadyStateLastAchievedTime": "0001-01-01T00:00:00Z",
            "troubleshootingUrl": null,
            "progress": [],
            "synchronizedEntryCountByType": []
        },
        "synchronizationJobSettings": [
            {
                "name": "AzureIngestionAttributeOptimization",
                "value": "False"
            },
            {
                "name": "LookaheadQueryEnabled",
                "value": "False"
            }
        ]
    }
    ```

## Step 8: Save your credentials

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

1. In the source tenant, use the [synchronization: secrets](/graph/api/synchronization-synchronization-secrets?view=graph-rest-beta&preserve-view=true) API to save your credentials.

    **Request**
    
    ```http
    PUT https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/secrets 
    Content-Type: application/json
    
    { 
        "value": [ 
            { 
                "key": "CompanyId", 
                "value": "{targetTenantId}" 
            },
            {
                "key": "AuthenticationType",
                "value": "SyncPolicy"
            },
            {
                "key": "SyncNotificationSettings",
                "value": "{\"Enabled\":false,\"DeleteThresholdEnabled\":false,\"HumanResourcesLookaheadQueryEnabled\":false}"
            },
            {
                "key": "SyncAll",
                "value": "false"
            }
        ]
    }
    ```
    
    **Response**
    
    ```http
    HTTP/1.1 204 No Content
    ```

## Step 9: Assign a user to the configuration

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

For cross-tenant synchronization to work, at least one internal user must be assigned to the configuration.

1. In the source tenant, use the [Grant an appRoleAssignment for a service principal](/graph/api/serviceprincipal-post-approleassignedto) API to assign an internal user to the configuration.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/v1.0/servicePrincipals/{servicePrincipalId}/appRoleAssignedTo
    Content-type: application/json
    
    {
        "appRoleId": "{appRoleId}",
        "resourceId": "{servicePrincipalId}",
        "principalId": "{principalId}"
    }
    ```

    **Response**
    
    ```http
    HTTP/1.1 201 Created
    Content-Type: application/json
    {
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#servicePrincipals('{servicePrincipalId}')/appRoleAssignedTo/$entity",
        "id": "{keyId}",
        "deletedDateTime": null,
        "appRoleId": "{appRoleId}",
        "createdDateTime": "2022-11-27T22:23:48.6541804Z",
        "principalDisplayName": "User1",
        "principalId": "{principalId}",
        "principalType": "User",
        "resourceDisplayName": "Fabrikam",
        "resourceId": "{servicePrincipalId}"
    }
    ```

## Step 10: Test provision on demand

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

Now that you have a configuration, you can test on-demand provisioning with one of your users.

1. In the source tenant, use the [synchronizationJob: provisionOnDemand](/graph/api/synchronization-synchronizationjob-provision-on-demand?view=graph-rest-beta&preserve-view=true) API to provision a test user on demand.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}/provisionOnDemand
    Content-Type: application/json

    {
        "parameters": [
            {
                "ruleId": "{ruleId}",
                "subjects": [
                    {
                        "objectId": "{userObjectId}",
                        "objectTypeName": "User"
                    }
                ]
            }
        ]
    }
    ```

## Step 11: Start the provisioning job

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

1. Now that the provisioning job is configured, in the source tenant, use the [Start synchronizationJob](/graph/api/synchronization-synchronizationjob-start?view=graph-rest-beta&preserve-view=true) API to start the provisioning job.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}/start
    ```
    
    
    **Response**
    
    ```http
    HTTP/1.1 204 No Content
    ```

## Step 12: Monitor provisioning

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

1. Now that the provisioning job is running, in the source tenant, use the [Get synchronizationJob](/graph/api/synchronization-synchronizationjob-get?view=graph-rest-beta&preserve-view=true) API to monitor the progress of the current provisioning cycle as well as statistics to date such as the number of users and groups that have been created in the target system.

    **Request**
    
    ```http
    GET https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}
    ```
    
    **Response**
    
    ```http
    HTTP/1.1 200 OK
    Content-type: application/json
    
    {
        "id": "{jobId}",
        "templateId": "Azure2Azure",
        "schedule": {
            "expiration": null,
            "interval": "PT40M",
            "state": "Active"
        },
        "status": {
            "countSuccessiveCompleteFailures": 0,
            "escrowsPruned": false,
            "code": "NotRun",
            "lastSuccessfulExecution": null,
            "lastSuccessfulExecutionWithExports": null,
            "quarantine": null,
            "steadyStateFirstAchievedTime": "0001-01-01T00:00:00Z",
            "steadyStateLastAchievedTime": "0001-01-01T00:00:00Z",
            "troubleshootingUrl": "",
            "lastExecution": {
                "activityIdentifier": null,
                "countEntitled": 0,
                "countEntitledForProvisioning": 0,
                "countEscrowed": 0,
                "countEscrowedRaw": 0,
                "countExported": 0,
                "countExports": 0,
                "countImported": 0,
                "countImportedDeltas": 0,
                "countImportedReferenceDeltas": 0,
                "state": "Failed",
                "timeBegan": "0001-01-01T00:00:00Z",
                "timeEnded": "0001-01-01T00:00:00Z",
                "error": {
                    "code": "None",
                    "message": "",
                    "tenantActionable": false
                }
            },
            "progress": [],
            "synchronizedEntryCountByType": []
        },
        "synchronizationJobSettings": [
            {
                "name": "AzureIngestionAttributeOptimization",
                "value": "False"
            },
            {
                "name": "LookaheadQueryEnabled",
                "value": "False"
            }
        ]
    }
    ```

1. In addition to monitoring the status of the provisioning job, use the [List provisioningObjectSummary](/graph/api/provisioningobjectsummary-list) API to retrieve the provisioning logs and get all the provisioning events that occur. For example, query for a particular user and determine if they were successfully provisioned.

    **Request**
    
    ```http
    GET https://graph.microsoft.com/v1.0/auditLogs/provisioning?$filter=((contains(tolower(servicePrincipal/id), '{servicePrincipalId}') or contains(tolower(servicePrincipal/displayName), '{servicePrincipalId}')) and activityDateTime gt 2022-12-10 and activityDateTime lt 2022-12-11)&$top=500&$orderby=activityDateTime desc
    ```
    
    **Response**

    The response object shown here has been shortened for readability.   

    ```http
    HTTP/1.1 200 OK
    Content-type: application/json
    
    {
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#auditLogs/provisioning",
        "value": [
            {
                "id": "{id}",
                "activityDateTime": "2022-12-11T00:40:37Z",
                "tenantId": "{targetTenantId}",
                "jobId": "{jobId}",
                "cycleId": "{cycleId}",
                "changeId": "{changeId}",
                "provisioningAction": "create",
                "durationInMilliseconds": 4375,
                "servicePrincipal": {
                    "id": "{servicePrincipalId}",
                    "displayName": "Fabrikam"
                },
                "sourceSystem": {
                    "id": "{id}",
                    "displayName": "Azure Active Directory",
                    "details": {}
                },
                "targetSystem": {
                    "id": "{id}",
                    "displayName": "Azure Active Directory (target tenant)",
                    "details": {
                        "ApplicationId": "{applicationId}",
                        "ServicePrincipalId": "{servicePrincipalId}",
                        "ServicePrincipalDisplayName": "Fabrikam"
                    }
                },
                "initiatedBy": {
                    "id": "",
                    "displayName": "Azure AD Provisioning Service",
                    "initiatorType": "system"
                },
                "sourceIdentity": {
                    "id": "{sourceUserObjectId}",
                    "displayName": "User4",
                    "identityType": "User",
                    "details": {
                        "id": "{sourceUserObjectId}",
                        "odatatype": "User",
                        "DisplayName": "User4",
                        "UserPrincipalName": "user4@fabrikam.com"
                    }
                },
                "targetIdentity": {
                    "id": "{targetUserObjectId}",
                    "displayName": "",
                    "identityType": "User",
                    "details": {}
                },
                "provisioningStatusInfo": {
                    "status": "success",
                    "errorInformation": null
                },
            "provisioningSteps": [
                {
                    "name": "EntryImportAdd",
                    "provisioningStepType": "import",
                    "status": "success",
                    "description": "Received User 'user4@fabrikam.com' change of type (Add) from Azure Active Directory",
                    "details": {
                        "objectId": "{sourceUserObjectId}",
                        "accountEnabled": "True",
                        "department": "Marketing",
                        "displayName": "User4",
                        "mailNickname": "user4",
                        "userPrincipalName": "user4@fabrikam.com",
                        "netId": "{netId}",
                        "showInAddressList": "",
                        "alternativeSecurityIds": "None",
                        "IsSoftDeleted": "False",
                        "appRoleAssignments": "msiam_access"
                    }
                },
                {
                    "name": "EntrySynchronizationScoping",
                    "provisioningStepType": "scoping",
                    "status": "success",
                    "description": "Determine if User in scope by evaluating against each scoping filter",
                    "details": {
                        "Active in the source system": "True",
                        "Assigned to the application": "True",
                        "User has the required role": "True",
                        "Scoping filter evaluation passed": "True",
                        "ScopeEvaluationResult": "{\"Marketing department filter.department EQUALS 'Marketing'\":true}"
                    }
                },
    
                ...
    
            }
        ]
    }
    ```

## Troubleshooting tips

#### Symptom - Insufficient privileges error

When you try to perform an action, you receive an error message similar to the following:

```
code: Authorization_RequestDenied
message: Insufficient privileges to complete the operation.
```

**Cause**

Either the signed-in user doesn't have sufficient privileges, or you need to consent to one of the required permissions.

**Solution**

1. Make sure you're assigned the required roles. See [Prerequisites](#prerequisites) earlier in this article.

2. In [Microsoft Graph Explorer tool](https://aka.ms/ge), make sure you consent to the required permissions. See [Step 1: Sign in to tenants and consent to permissions](#step-1-sign-in-to-tenants-and-consent-to-permissions) earlier in this article.

#### Symptom - Request_MultipleObjectsWithSameKeyValue error

When you try to make a Graph API call, you receive an error message similar to the following:

```
code: Request_MultipleObjectsWithSameKeyValue
message: Another object with the same value for property tenantId already exists.
message: A conflicting object with one or more of the specified property values is present in the directory.
```

**Cause**

You are likely trying to create a configuration or object that already exists, possibly from a previous configuration.

**Solution**

1. Verify your request syntax and that you are using the correct tenant ID.

1. Make a `GET` request to list the existing object.

1. If you have an existing object, instead of making a create request using `POST` or `PUT`, you might need to make an update request using `PATCH`, such as:

    - [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update?view=graph-rest-beta&preserve-view=true)
    - [Update crossTenantIdentitySyncPolicyPartner](/graph/api/crosstenantidentitysyncpolicypartner-update?view=graph-rest-beta&preserve-view=true)

#### Symptom - Directory_ObjectNotFound error

When you try to make a Graph API call, you receive an error message similar to the following:

```
code: Directory_ObjectNotFound
message: Unable to read the company information from the directory.
```

**Cause**

You are likely trying to update an object that doesn't exist using `PATCH`.

**Solution**

1. Verify your request syntax and that you are using the correct tenant ID.

1. Make a `GET` request to verify the object doesn't exist.

1. If object doesn't exist, instead of making an update request using `PATCH`, you might need to make a create request using `POST` or `PUT`, such as:

    - [Create identitySynchronization](/graph/api/crosstenantaccesspolicyconfigurationpartner-put-identitysynchronization?view=graph-rest-beta&preserve-view=true)

## Next steps

- [Azure AD synchronization API overview](/graph/api/resources/synchronization-overview?view=graph-rest-beta&preserve-view=true)
- [Tutorial: Develop and plan provisioning for a SCIM endpoint in Azure Active Directory](../app-provisioning/use-scim-to-provision-users-and-groups.md)
