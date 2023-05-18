---
title: Configure cross-tenant synchronization using PowerShell or Microsoft Graph API
description: Learn how to configure cross-tenant synchronization in Azure Active Directory using Microsoft Graph PowerShell or Microsoft Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: how-to
ms.date: 05/14/2023
ms.author: rolyon
ms.custom: it-pro
zone_pivot_groups: multi-tenant-organizations-powershell-graph

#Customer intent: As a dev, devops, or it admin, I want to
---

# Configure cross-tenant synchronization using PowerShell or Microsoft Graph API

::: zone pivot="ms-powershell"
> [!IMPORTANT]
> Configuring cross-tenant synchronization using Microsoft Graph PowerShell is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
::: zone-end

This article describes the key steps to configure cross-tenant synchronization using Microsoft Graph PowerShell or Microsoft Graph API. When configured, Azure AD automatically provisions and de-provisions B2B users in your target tenant. For detailed steps using the Azure portal, see [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md).

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

::: zone pivot="ms-powershell"
1. Start PowerShell.

1. If necessary, install the [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation?branch=main).

1. Get the tenant ID of the source and target tenants and initialize variables:

    ```powershell
    $SourceTenantId = "<SourceTenantId>"
    $TargetTenantId = "<TargetTenantId>"
    ```

1. Use the [Connect-MgGraph](/powershell/microsoftgraph/authentication-commands?branch=main#using-connect-mggraph) command to sign in to the source tenant and consent to the following required permissions:

    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`
    - `Application.ReadWrite.All`
    - `Directory.ReadWrite.All`

    ```powershell
    Connect-MgGraph -TenantId $SourceTenantId -Scopes "Policy.Read.All","Policy.ReadWrite.CrossTenantAccess","Application.ReadWrite.All","Directory.ReadWrite.All"
    ```

1. Use the [Select-MgProfile](/powershell/microsoftgraph/authentication-commands?branch=main#using-select-mgprofile) command to change to the beta version:

    ```powershell
    Select-MgProfile -Name "beta"
    ```

1. Start another instance of PowerShell.

1. Get the tenant ID of the source and target tenants and initialize variables:

    ```powershell
    $SourceTenantId = "<SourceTenantId>"
    $TargetTenantId = "<TargetTenantId>"
    ```

1. Use the [Connect-MgGraph](/powershell/microsoftgraph/authentication-commands?branch=main#using-connect-mggraph) command to sign in to the target tenant and consent to the following required permissions:

    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`

    ```powershell
    Connect-MgGraph -TenantId $TargetTenantId -Scopes "Policy.Read.All","Policy.ReadWrite.CrossTenantAccess"
    ```

1. Use the [Select-MgProfile](/powershell/microsoftgraph/authentication-commands?branch=main#using-select-mgprofile) command to change to the beta version:

    ```powershell
    Select-MgProfile -Name "beta"
    ```
::: zone-end

::: zone pivot="ms-graph"
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
::: zone-end

## Step 2: Enable user synchronization in the target tenant

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

::: zone pivot="ms-powershell"
1. In the target tenant, use the [New-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/new-mgpolicycrosstenantaccesspolicypartner?view=graph-powershell-beta&preserve-view=true&branch=main) command to create a new partner configuration in a cross-tenant access policy between the target tenant and the source tenant. Use the source tenant ID in the request.

    If you get the error `New-MgPolicyCrossTenantAccessPolicyPartner_Create: Another object with the same value for property tenantId already exists`, you might already have an existing configuration. For more information, see [Symptom - New-MgPolicyCrossTenantAccessPolicyPartner_Create error](#symptom---new-mgpolicycrosstenantaccesspolicypartner_create-error).

    ```powershell
    $Params = @{
    	TenantId = $SourceTenantId
    }
    New-MgPolicyCrossTenantAccessPolicyPartner -BodyParameter $Params
    ```

    ```Output
    IsServiceProvider TenantId
    ----------------- --------
                      <SourceTenantId>
    ```

1. Use the [Invoke-MgGraphRequest](/powershell/microsoftgraph/authentication-commands?branch=main#using-invoke-mggraphrequest) command to enable user synchronization in the target tenant.

    If you get an `Request_MultipleObjectsWithSameKeyValue` error, you might already have an existing policy. For more information, see [Symptom - Request_MultipleObjectsWithSameKeyValue error](#symptom---request_multipleobjectswithsamekeyvalue-error).

    ```powershell
    $Params = @{
	    userSyncInbound = @{
		    isSyncAllowed = $true
	    }
    }
    Invoke-MgGraphRequest -Method PUT -Uri "https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/partners/$SourceTenantId/identitySynchronization" -Body $Params
    ```

1. Use the [Get-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization](/powershell/module/microsoft.graph.identity.signins/get-mgpolicycrosstenantaccesspolicypartneridentitysynchronization?view=graph-powershell-beta&preserve-view=true&branch=main) command to verify `IsSyncAllowed` is set to True.

    ```powershell
    (Get-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization -CrossTenantAccessPolicyConfigurationPartnerTenantId $SourceTenantId).UserSyncInbound
    ```
    
    ```Output
    IsSyncAllowed
    -------------
    True
    ```
::: zone-end

::: zone pivot="ms-graph"
1. In the target tenant, use the [Create crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicy-post-partners?branch=main) API to create a new partner configuration in a cross-tenant access policy between the target tenant and the source tenant. Use the source tenant ID in the request.

    If you get an `Request_MultipleObjectsWithSameKeyValue` error, you might already have an existing configuration. For more information, see [Symptom - Request_MultipleObjectsWithSameKeyValue error](#symptom---request_multipleobjectswithsamekeyvalue-error).

    **Request**

    ```http
    POST https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/partners
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
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#policies/crossTenantAccessPolicy/partners/$entity",
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

1. Use the [Create identitySynchronization](/graph/api/crosstenantaccesspolicyconfigurationpartner-put-identitysynchronization?branch=main) API to enable user synchronization in the target tenant.

    If you get an `Request_MultipleObjectsWithSameKeyValue` error, you might already have an existing policy. For more information, see [Symptom - Request_MultipleObjectsWithSameKeyValue error](#symptom---request_multipleobjectswithsamekeyvalue-error).

    **Request**
    
    ```http
    PUT https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/partners/{sourceTenantId}/identitySynchronization
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
::: zone-end

## Step 3: Automatically redeem invitations in the target tenant

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

::: zone pivot="ms-powershell"
1. In the target tenant, use the [Update-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/update-mgpolicycrosstenantaccesspolicypartner?view=graph-powershell-beta&preserve-view=true&branch=main) command to automatically redeem invitations and suppress consent prompts for inbound access.

    ```powershell
    $AutomaticUserConsentSettings = @{
        "InboundAllowed"="True"
    }
    Update-MgPolicyCrossTenantAccessPolicyPartner -CrossTenantAccessPolicyConfigurationPartnerTenantId $SourceTenantId -AutomaticUserConsentSettings $AutomaticUserConsentSettings
    ```
::: zone-end

::: zone pivot="ms-graph"
1. In the target tenant, use the [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update?branch=main) API to automatically redeem invitations and suppress consent prompts for inbound access.

    **Request**
    
    ```http
    PATCH https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/partners/{sourceTenantId}
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
::: zone-end

## Step 4: Automatically redeem invitations in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

::: zone pivot="ms-powershell"
1. In the source tenant, use the [New-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/new-mgpolicycrosstenantaccesspolicypartner?view=graph-powershell-beta&preserve-view=true&branch=main) command to create a new partner configuration in a cross-tenant access policy between the source tenant and the target tenant. Use the target tenant ID in the request.

    If you get the error `New-MgPolicyCrossTenantAccessPolicyPartner_Create: Another object with the same value for property tenantId already exists`, you might already have an existing configuration. For more information, see [Symptom - New-MgPolicyCrossTenantAccessPolicyPartner_Create error](#symptom---new-mgpolicycrosstenantaccesspolicypartner_create-error).

    ```powershell
    $Params = @{
        TenantId = $TargetTenantId
    }
    New-MgPolicyCrossTenantAccessPolicyPartner -BodyParameter $Params
    ```

    ```Output
    IsServiceProvider TenantId
    ----------------- --------
                      <TargetTenantId>
    ```

1. Use the [Update-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/update-mgpolicycrosstenantaccesspolicypartner?view=graph-powershell-beta&preserve-view=true&branch=main) command to automatically redeem invitations and suppress consent prompts for outbound access.

    ```powershell
    $AutomaticUserConsentSettings = @{
        "OutboundAllowed"="True"
    }
    Update-MgPolicyCrossTenantAccessPolicyPartner -CrossTenantAccessPolicyConfigurationPartnerTenantId $TargetTenantId -AutomaticUserConsentSettings $AutomaticUserConsentSettings
    ```
::: zone-end

::: zone pivot="ms-graph"
1. In the source tenant, use the [Create crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicy-post-partners?branch=main) API to create a new partner configuration in a cross-tenant access policy between the source tenant and the target tenant. Use the target tenant ID in the request.

    If you get an `Request_MultipleObjectsWithSameKeyValue` error, you might already have an existing configuration. For more information, see [Symptom - Request_MultipleObjectsWithSameKeyValue error](#symptom---request_multipleobjectswithsamekeyvalue-error).

    **Request**

    ```http
    POST https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/partners
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
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#policies/crossTenantAccessPolicy/partners/$entity",
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

1. Use the [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update?branch=main) API to automatically redeem invitations and suppress consent prompts for outbound access.

    **Request**
    
    ```http
    PATCH https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/partners/{targetTenantId}
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
::: zone-end

## Step 5: Create a configuration application in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

::: zone pivot="ms-powershell"
1. In the source tenant, use the [Invoke-MgInstantiateApplicationTemplate](/powershell/module/microsoft.graph.applications/invoke-mginstantiateapplicationtemplate?view=graph-powershell-beta&preserve-view=true&branch=main) command to add an instance of a configuration application from the Azure AD application gallery into your tenant.

    ```powershell
    Invoke-MgInstantiateApplicationTemplate -ApplicationTemplateId "518e5f48-1fc8-4c48-9387-9fdf28b0dfe7" -DisplayName "Fabrikam"
    ```

1. Use the [Get-MgServicePrincipal](/powershell/module/microsoft.graph.applications/get-mgserviceprincipal?branch=main) command to get the service principal ID.

    ```powershell
    Get-MgServicePrincipal -Filter "DisplayName eq 'Fabrikam'"
    ```

    ```Output
    Id                      DisplayName AppId      SignInAudience PublisherName
    --                      ----------- -----      -------------- -------------
    <ServicePrincipalId>    Fabrikam    <AppId>    AzureADMyOrg   Contoso
    ```
::: zone-end

::: zone pivot="ms-graph"
1. In the source tenant, use the [applicationTemplate: instantiate](/graph/api/applicationtemplate-instantiate?branch=main) API to add an instance of a configuration application from the Azure AD application gallery into your tenant.
    
    **Request**
    
    ```http
    POST https://graph.microsoft.com/v1.0/applicationTemplates/518e5f48-1fc8-4c48-9387-9fdf28b0dfe7/instantiate
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
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.applicationServicePrincipal",
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
::: zone-end

## Step 6: Test the connection to the target tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

::: zone pivot="ms-powershell"

1. Initialize a variable with the service principal ID from the previous step.

    Be sure to use the service principal ID instead of the application ID.

    ```powershell
    $ServicePrincipalId = "<ServicePrincipalId>"
    ```

1. In the source tenant, use the [Invoke-MgGraphRequest](/powershell/microsoftgraph/authentication-commands?branch=main#using-invoke-mggraphrequest) command to test the connection to the target tenant and validate the credentials.

    ```powershell
    $Params = @{
        "useSavedCredentials" = $false
        "templateId" = "Azure2Azure"
        "credentials" = @(
            @{
                "key" = "CompanyId"
                "value" = $TargetTenantId
            }
            @{
                "key" = "AuthenticationType"
                "value" = "SyncPolicy"
            }
        )
    }
    Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/beta/servicePrincipals/$ServicePrincipalId/synchronization/jobs/validateCredentials" -Body $Params
    ```
::: zone-end

::: zone pivot="ms-graph"
1. Get the service principal object ID from the previous step.

    Be sure to use the service principal object ID instead of the application ID.

1. In the source tenant, use the [synchronizationJob: validateCredentials](/graph/api/synchronization-synchronizationjob-validatecredentials?branch=main) API to test the connection to the target tenant and validate the credentials.

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
::: zone-end

## Step 7: Create a provisioning job in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

In the source tenant, to enable provisioning, create a provisioning job.

::: zone pivot="ms-powershell"
1. Determine the synchronization template to use, such as `Azure2Azure`.

    A template has pre-configured synchronization settings. 

1. In the source tenant, use the [New-MgServicePrincipalSynchronizationJob](/powershell/module/microsoft.graph.applications/new-mgserviceprincipalsynchronizationjob?view=graph-powershell-beta&preserve-view=true&branch=main) command to create a provisioning job based on a template.

    ```powershell
    New-MgServicePrincipalSynchronizationJob -ServicePrincipalId $ServicePrincipalId -TemplateId "Azure2Azure"
    ```

    ```Output
    Id         TemplateId
    --         ----------
    {JobId}    Azure2Azure
    ```
::: zone-end

::: zone pivot="ms-graph"
1. Determine the [synchronization template](/graph/api/resources/synchronization-synchronizationtemplate?branch=main) to use, such as `Azure2Azure`.

    A template has pre-configured synchronization settings. 
    
1. In the source tenant, use the [Create synchronizationJob](/graph/api/synchronization-synchronizationjob-post?branch=main) API to create a provisioning job based on a template.

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
::: zone-end

## Step 8: Save your credentials

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

::: zone pivot="ms-powershell"
1. In the source tenant, use the [Invoke-MgGraphRequest](/powershell/microsoftgraph/authentication-commands?branch=main#using-invoke-mggraphrequest) command to save your credentials.

    ```powershell
    $Params = @{
    	"value" = @(
    		@{
    			"key" = "AuthenticationType"
    			"value" = "SyncPolicy"
    		}
    		@{
    			"key" = "CompanyId"
    			"value" = $TargetTenantId
    		}
    	)
    }
    Invoke-MgGraphRequest -Method PUT -Uri "https://graph.microsoft.com/beta/servicePrincipals/$ServicePrincipalId/synchronization/secrets" -Body $Params
    ```
::: zone-end

::: zone pivot="ms-graph"
1. In the source tenant, use the [Add synchronization secrets](/graph/api/synchronization-synchronization-secrets?branch=main) API to save your credentials.

    **Request**
    
    ```http
    PUT https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/secrets 
    Content-Type: application/json
    
    { 
        "value": [ 
            {
                "key": "AuthenticationType",
                "value": "SyncPolicy"
            },
            { 
                "key": "CompanyId", 
                "value": "{targetTenantId}" 
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
::: zone-end

## Step 9: Assign a user to the configuration

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

For cross-tenant synchronization to work, at least one internal user must be assigned to the configuration.

::: zone pivot="ms-powershell"
1. In the source tenant, use the [New-MgServicePrincipalAppRoleAssignedTo](/powershell/module/microsoft.graph.applications/new-mgserviceprincipalapproleassignedto?branch=main) command to assign an internal user to the configuration.

    ```powershell
    $Params = @{
    	PrincipalId = "<PrincipalId>"
    	ResourceId = $ServicePrincipalId
    	AppRoleId = "<AppRoleId>"
    }
    New-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalId $ServicePrincipalId -BodyParameter $Params
    ```
::: zone-end

::: zone pivot="ms-graph"
1. In the source tenant, use the [Grant an appRoleAssignment for a service principal](/graph/api/serviceprincipal-post-approleassignedto?branch=main) API to assign an internal user to the configuration.

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
::: zone-end

## Step 10: Test provision on demand

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

Now that you have a configuration, you can test on-demand provisioning with one of your users.

::: zone pivot="ms-powershell"
1. In the source tenant, use the [New-MgApplicationSynchronizationJobOnDemand](/powershell/module/microsoft.graph.applications/new-mgapplicationsynchronizationjobondemand?view=graph-powershell-beta&preserve-view=true&branch=main) command to provision a test user on demand.

    ```powershell
    $Params = @{
    	RuleId = "<RuleId>"
        Subjects = @(
            @{
                ObjectId = "<UserObjectId>"
                ObjectTypeName = "User"
            }
        )
    }
    New-MgApplicationSynchronizationJobOnDemand -ApplicationId $ServicePrincipalId -SynchronizationJobId $JobId -BodyParameter $Params
    ```
::: zone-end

::: zone pivot="ms-graph"
1. In the source tenant, use the [synchronizationJob: provisionOnDemand](/graph/api/synchronization-synchronizationjob-provision-on-demand?branch=main) API to provision a test user on demand.

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
::: zone-end

## Step 11: Start the provisioning job

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

::: zone pivot="ms-powershell"
1. Now that the provisioning job is configured, in the source tenant, use the [Start-MgServicePrincipalSynchronizationJob](/powershell/module/microsoft.graph.applications/start-mgserviceprincipalsynchronizationjob?view=graph-powershell-beta&preserve-view=true&branch=main) command to start the provisioning job.

    ```powershell
    Start-MgServicePrincipalSynchronizationJob -ServicePrincipalId $ServicePrincipalId -SynchronizationJobId $JobId
    ```
::: zone-end

::: zone pivot="ms-graph"
1. Now that the provisioning job is configured, in the source tenant, use the [Start synchronizationJob](/graph/api/synchronization-synchronizationjob-start?branch=main) API to start the provisioning job.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/beta/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}/start
    ```
    
    
    **Response**
    
    ```http
    HTTP/1.1 204 No Content
    ```
::: zone-end

## Step 12: Monitor provisioning

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

::: zone pivot="ms-powershell"
1. Now that the provisioning job is running, in the source tenant, use the [Get-MgServicePrincipalSynchronizationJob](/powershell/module/microsoft.graph.applications/get-mgserviceprincipalsynchronizationjob?view=graph-powershell-beta&preserve-view=true&branch=main) command to monitor the progress of the current provisioning cycle as well as statistics to date such as the number of users and groups that have been created in the target system.

    ```powershell
    Get-MgServicePrincipalSynchronizationJob -ServicePrincipalId $ServicePrincipalId -SynchronizationJobId $JobId
    ```

1. In addition to monitoring the status of the provisioning job, use the [Get-MgAuditLogProvisioning](/powershell/module/microsoft.graph.reports/get-mgauditlogprovisioning?view=graph-powershell-beta&preserve-view=true&branch=main) command to retrieve the provisioning logs and get all the provisioning events that occur. For example, query for a particular user and determine if they were successfully provisioned.

    ```powershell
    Get-MgAuditLogProvisioning
    ```
::: zone-end

::: zone pivot="ms-graph"
1. Now that the provisioning job is running, in the source tenant, use the [Get synchronizationJob](/graph/api/synchronization-synchronizationjob-get?branch=main) API to monitor the progress of the current provisioning cycle as well as statistics to date such as the number of users and groups that have been created in the target system.

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

1. In addition to monitoring the status of the provisioning job, use the [List provisioningObjectSummary](/graph/api/provisioningobjectsummary-list?branch=main) API to retrieve the provisioning logs and get all the provisioning events that occur. For example, query for a particular user and determine if they were successfully provisioned.

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
::: zone-end

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

::: zone pivot="ms-powershell"
2. When you sign in with [Connect-MgGraph](/powershell/microsoftgraph/authentication-commands?branch=main#using-connect-mggraph), make sure you specify the required scopes. See [Step 1: Sign in to tenants and consent to permissions](#step-1-sign-in-to-tenants-and-consent-to-permissions) earlier in this article.
::: zone-end

::: zone pivot="ms-graph"
2. In [Microsoft Graph Explorer tool](https://aka.ms/ge), make sure you consent to the required permissions. See [Step 1: Sign in to tenants and consent to permissions](#step-1-sign-in-to-tenants-and-consent-to-permissions) earlier in this article.
::: zone-end

::: zone pivot="ms-powershell"
#### Symptom - New-MgPolicyCrossTenantAccessPolicyPartner_Create error

When you try to create a new partner configuration, you receive an error message similar to the following:

```
New-MgPolicyCrossTenantAccessPolicyPartner_Create: Another object with the same value for property tenantId already exists.
```

**Cause**

You are likely trying to create a configuration or object that already exists, possibly from a previous configuration.

**Solution**

1. Verify your syntax and that you are using the correct tenant ID.

1. Use the [Get-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/get-mgpolicycrosstenantaccesspolicypartner?view=graph-powershell-beta&preserve-view=true&branch=main) command to list the existing object.

1. If you have an existing object, you might need to make an update using [Update-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/update-mgpolicycrosstenantaccesspolicypartner?view=graph-powershell-beta&preserve-view=true&branch=main)
::: zone-end

#### Symptom - Request_MultipleObjectsWithSameKeyValue error

::: zone pivot="ms-powershell"
When you try to enable user synchronization, you receive an error message similar to the following:

```
Invoke-MgGraphRequest: PUT https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/partners/<SourceTenantId>/identitySynchronization
HTTP/1.1 409 Conflict
...
{"error":{"code":"Request_MultipleObjectsWithSameKeyValue","message":"A conflicting object with one or more of the specified property values is present in the directory.","details":[{"code":"ConflictingObjects","message":"A conflicting object with one or more of the specified property values is present in the directory.", ... }}}
```

**Cause**

You are likely trying to create a policy that already exists, possibly from a previous configuration.

**Solution**

1. Verify your syntax and that you are using the correct tenant ID.

1. Use the [Get-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization](/powershell/module/microsoft.graph.identity.signins/get-mgpolicycrosstenantaccesspolicypartneridentitysynchronization?view=graph-powershell-beta&preserve-view=true&branch=main) command to list the `IsSyncAllowed` setting.

    ```powershell
    (Get-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization -CrossTenantAccessPolicyConfigurationPartnerTenantId $SourceTenantId).UserSyncInbound
    ```

1. If you have an existing policy, you might need to make an update using [Update-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization](/powershell/module/microsoft.graph.identity.signins/update-mgpolicycrosstenantaccesspolicypartneridentitysynchronization?view=graph-powershell-beta&preserve-view=true&branch=main) command to enable user synchronization.

    ```powershell
    $Params = @{
	    userSyncInbound = @{
		    isSyncAllowed = $true
	    }
    }
    Update-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization -CrossTenantAccessPolicyConfigurationPartnerTenantId $SourceTenantId -BodyParameter $Params
    ```
::: zone-end

::: zone pivot="ms-graph"
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

    - [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update?branch=main)
    - [Update crossTenantIdentitySyncPolicyPartner](/graph/api/crosstenantidentitysyncpolicypartner-update?branch=main)

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

    - [Create identitySynchronization](/graph/api/crosstenantaccesspolicyconfigurationpartner-put-identitysynchronization?branch=main)
::: zone-end

## Next steps

- [Azure AD synchronization API overview](/graph/api/resources/synchronization-overview?branch=main)
- [Tutorial: Develop and plan provisioning for a SCIM endpoint in Azure Active Directory](../app-provisioning/use-scim-to-provision-users-and-groups.md)
