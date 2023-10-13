---
title: Configure cross-tenant synchronization using PowerShell or Microsoft Graph API
description: Learn how to configure cross-tenant synchronization in Microsoft Entra ID using Microsoft Graph PowerShell or Microsoft Graph API.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: how-to
ms.date: 07/31/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Configure cross-tenant synchronization using PowerShell or Microsoft Graph API

This article describes the key steps to configure cross-tenant synchronization using Microsoft Graph PowerShell or Microsoft Graph API. When configured, Microsoft Entra ID automatically provisions and de-provisions B2B users in your target tenant. For detailed steps using the Microsoft Entra admin center, see [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md).

:::image type="content" source="./media/common/configure-diagram.png" alt-text="Diagram that shows cross-tenant synchronization between source tenant and target tenant." lightbox="./media/common/configure-diagram.png":::

## Prerequisites

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

- Microsoft Entra ID P1 or P2 license. For more information, see [License requirements](cross-tenant-synchronization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings.
- [Hybrid Identity Administrator](../roles/permissions-reference.md#hybrid-identity-administrator) role to configure cross-tenant synchronization.
- [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator) or [Application Administrator](../roles/permissions-reference.md#application-administrator) role to assign users to a configuration and to delete a configuration.
- [Global Administrator](../roles/permissions-reference.md#global-administrator) role to consent to required permissions.

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

- Microsoft Entra ID P1 or P2 license. For more information, see [License requirements](cross-tenant-synchronization-overview.md#license-requirements).
- [Security Administrator](../roles/permissions-reference.md#security-administrator) role to configure cross-tenant access settings.
- [Global Administrator](../roles/permissions-reference.md#global-administrator) role to consent to required permissions.

## Step 1: Sign in to the target tenant

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

# [PowerShell](#tab/ms-powershell)

1. Start PowerShell.

1. If necessary, install the [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/installation).

1. Get the tenant ID of the source and target tenants and initialize variables.

    ```powershell
    $SourceTenantId = "<SourceTenantId>"
    $TargetTenantId = "<TargetTenantId>"
    ```

1. Use the [Connect-MgGraph](/powershell/microsoftgraph/authentication-commands#using-connect-mggraph) command to sign in to the target tenant and consent to the following required permissions.

    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`

    ```powershell
    Connect-MgGraph -TenantId $TargetTenantId -Scopes "Policy.Read.All","Policy.ReadWrite.CrossTenantAccess"
    ```

# [Microsoft Graph](#tab/ms-graph)

These steps describe how to use Microsoft Graph Explorer (recommended), but you can also use Postman, or another REST API client.

1. Start [Microsoft Graph Explorer tool](https://aka.ms/ge).

1. Sign in to the target tenant.

1. Select your profile and then select **Consent to permissions**.

    :::image type="content" source="./media/cross-tenant-synchronization-configure-graph/graph-explorer-profile.png" alt-text="Screenshot of Graph Explorer profile with Consent to permissions link." lightbox="./media/cross-tenant-synchronization-configure-graph/graph-explorer-profile.png":::

1. Consent to the following required permissions.

    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`

1. Get the tenant ID of the source and target tenants. The example configuration described in this article uses the following tenant IDs.

    - Source tenant ID: {sourceTenantId}
    - Target tenant ID: {targetTenantId}

---

## Step 2: Enable user synchronization in the target tenant

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

# [PowerShell](#tab/ms-powershell)

1. In the target tenant, use the [New-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/new-mgpolicycrosstenantaccesspolicypartner) command to create a new partner configuration in a cross-tenant access policy between the target tenant and the source tenant. Use the source tenant ID in the request.

    If you get the error `New-MgPolicyCrossTenantAccessPolicyPartner_Create: Another object with the same value for property tenantId already exists`, you might already have an existing configuration. For more information, see [Symptom - New-MgPolicyCrossTenantAccessPolicyPartner_Create error](#symptom---new-mgpolicycrosstenantaccesspolicypartner_create-error).

    ```powershell
    $Params = @{
        TenantId = $SourceTenantId
    }
    New-MgPolicyCrossTenantAccessPolicyPartner -BodyParameter $Params | Format-List
    ```

    ```Output
    AutomaticUserConsentSettings : Microsoft.Graph.PowerShell.Models.MicrosoftGraphInboundOutboundPolicyConfiguration
    B2BCollaborationInbound      : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyB2BSetting
    B2BCollaborationOutbound     : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyB2BSetting
    B2BDirectConnectInbound      : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyB2BSetting
    B2BDirectConnectOutbound     : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyB2BSetting
    IdentitySynchronization      : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantIdentitySyncPolicyPartner
    InboundTrust                 : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyInboundTrust
    IsServiceProvider            :
    TenantId                     : <SourceTenantId>
    TenantRestrictions           : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyTenantRestrictions
    AdditionalProperties         : {[@odata.context, https://graph.microsoft.com/v1.0/$metadata#policies/crossTenantAccessPolicy/partners/$entity],
                                   [crossCloudMeetingConfiguration,
                                   System.Collections.Generic.Dictionary`2[System.String,System.Object]], [protectedContentSharing,
                                   System.Collections.Generic.Dictionary`2[System.String,System.Object]]}
    ```

1. Use the [Invoke-MgGraphRequest](/powershell/microsoftgraph/authentication-commands#using-invoke-mggraphrequest) command to enable user synchronization in the target tenant.

    If you get an `Request_MultipleObjectsWithSameKeyValue` error, you might already have an existing policy. For more information, see [Symptom - Request_MultipleObjectsWithSameKeyValue error](#symptom---request_multipleobjectswithsamekeyvalue-error).

    ```powershell
    $Params = @{
        userSyncInbound = @{
            isSyncAllowed = $true
        }
    }
    Invoke-MgGraphRequest -Method PUT -Uri "https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/partners/$SourceTenantId/identitySynchronization" -Body $Params
    ```

1. Use the [Get-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization](/powershell/module/microsoft.graph.identity.signins/get-mgpolicycrosstenantaccesspolicypartneridentitysynchronization) command to verify `IsSyncAllowed` is set to True.

    ```powershell
    (Get-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization -CrossTenantAccessPolicyConfigurationPartnerTenantId $SourceTenantId).UserSyncInbound
    ```
    
    ```Output
    IsSyncAllowed
    -------------
    True
    ```

# [Microsoft Graph](#tab/ms-graph)

1. In the target tenant, use the [Create crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicy-post-partners) API to create a new partner configuration in a cross-tenant access policy between the target tenant and the source tenant. Use the source tenant ID in the request.

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

1. Use the [Create identitySynchronization](/graph/api/crosstenantaccesspolicyconfigurationpartner-put-identitysynchronization) API to enable user synchronization in the target tenant.

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

---

## Step 3: Automatically redeem invitations in the target tenant

![Icon for the target tenant.](./media/common/icon-tenant-target.png)<br/>**Target tenant**

# [PowerShell](#tab/ms-powershell)

1. In the target tenant, use the [Update-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/update-mgpolicycrosstenantaccesspolicypartner) command to automatically redeem invitations and suppress consent prompts for inbound access.

    ```powershell
    $AutomaticUserConsentSettings = @{
        "InboundAllowed"="True"
    }
    Update-MgPolicyCrossTenantAccessPolicyPartner -CrossTenantAccessPolicyConfigurationPartnerTenantId $SourceTenantId -AutomaticUserConsentSettings $AutomaticUserConsentSettings
    ```

# [Microsoft Graph](#tab/ms-graph)

1. In the target tenant, use the [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update) API to automatically redeem invitations and suppress consent prompts for inbound access.

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

---

## Step 4: Sign in to the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

# [PowerShell](#tab/ms-powershell)

1. Start an instance of PowerShell.

1. Get the tenant ID of the source and target tenants and initialize variables.

    ```powershell
    $SourceTenantId = "<SourceTenantId>"
    $TargetTenantId = "<TargetTenantId>"
    ```

1. Use the [Connect-MgGraph](/powershell/microsoftgraph/authentication-commands#using-connect-mggraph) command to sign in to the source tenant and consent to the following required permissions.

    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`
    - `Application.ReadWrite.All`
    - `Directory.ReadWrite.All`
    - `AuditLog.Read.All`

    ```powershell
    Connect-MgGraph -TenantId $SourceTenantId -Scopes "Policy.Read.All","Policy.ReadWrite.CrossTenantAccess","Application.ReadWrite.All","Directory.ReadWrite.All","AuditLog.Read.All"
    ```

# [Microsoft Graph](#tab/ms-graph)

1. Start an instance of [Microsoft Graph Explorer tool](https://aka.ms/ge).

1. Sign in to the source tenant.

1. Consent to the following required permissions.

    - `Policy.Read.All`
    - `Policy.ReadWrite.CrossTenantAccess`
    - `Application.ReadWrite.All`
    - `Directory.ReadWrite.All`
    - `AuditLog.Read.All`

    If you see a **Need admin approval** page, you'll need to sign in with a user that has been assigned the Global Administrator role to consent.

---

## Step 5: Automatically redeem invitations in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

# [PowerShell](#tab/ms-powershell)

1. In the source tenant, use the [New-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/new-mgpolicycrosstenantaccesspolicypartner) command to create a new partner configuration in a cross-tenant access policy between the source tenant and the target tenant. Use the target tenant ID in the request.

    If you get the error `New-MgPolicyCrossTenantAccessPolicyPartner_Create: Another object with the same value for property tenantId already exists`, you might already have an existing configuration. For more information, see [Symptom - New-MgPolicyCrossTenantAccessPolicyPartner_Create error](#symptom---new-mgpolicycrosstenantaccesspolicypartner_create-error).

    ```powershell
    $Params = @{
        TenantId = $TargetTenantId
    }
    New-MgPolicyCrossTenantAccessPolicyPartner -BodyParameter $Params | Format-List
    ```

    ```Output
    AutomaticUserConsentSettings : Microsoft.Graph.PowerShell.Models.MicrosoftGraphInboundOutboundPolicyConfiguration
    B2BCollaborationInbound      : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyB2BSetting
    B2BCollaborationOutbound     : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyB2BSetting
    B2BDirectConnectInbound      : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyB2BSetting
    B2BDirectConnectOutbound     : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyB2BSetting
    IdentitySynchronization      : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantIdentitySyncPolicyPartner
    InboundTrust                 : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyInboundTrust
    IsServiceProvider            :
    TenantId                     : <TargetTenantId>
    TenantRestrictions           : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCrossTenantAccessPolicyTenantRestrictions
    AdditionalProperties         : {[@odata.context, https://graph.microsoft.com/v1.0/$metadata#policies/crossTenantAccessPolicy/partners/$entity],
                                   [crossCloudMeetingConfiguration,
                                   System.Collections.Generic.Dictionary`2[System.String,System.Object]], [protectedContentSharing,
                                   System.Collections.Generic.Dictionary`2[System.String,System.Object]]}
    
    ```

1. Use the [Update-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/update-mgpolicycrosstenantaccesspolicypartner) command to automatically redeem invitations and suppress consent prompts for outbound access.

    ```powershell
    $AutomaticUserConsentSettings = @{
        "OutboundAllowed"="True"
    }
    Update-MgPolicyCrossTenantAccessPolicyPartner -CrossTenantAccessPolicyConfigurationPartnerTenantId $TargetTenantId -AutomaticUserConsentSettings $AutomaticUserConsentSettings
    ```

# [Microsoft Graph](#tab/ms-graph)

1. In the source tenant, use the [Create crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicy-post-partners) API to create a new partner configuration in a cross-tenant access policy between the source tenant and the target tenant. Use the target tenant ID in the request.

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

1. Use the [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update) API to automatically redeem invitations and suppress consent prompts for outbound access.

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

---

## Step 6: Create a configuration application in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

# [PowerShell](#tab/ms-powershell)

1. In the source tenant, use the [Invoke-MgInstantiateApplicationTemplate](/powershell/module/microsoft.graph.applications/invoke-mginstantiateapplicationtemplate) command to add an instance of a configuration application from the Microsoft Entra application gallery into your tenant.

    ```powershell
    Invoke-MgInstantiateApplicationTemplate -ApplicationTemplateId "518e5f48-1fc8-4c48-9387-9fdf28b0dfe7" -DisplayName "Fabrikam"
    ```

1. Use the [Get-MgServicePrincipal](/powershell/module/microsoft.graph.applications/get-mgserviceprincipal) command to get the service principal ID and app role ID.

    ```powershell
    Get-MgServicePrincipal -Filter "DisplayName eq 'Fabrikam'" | Format-List
    ```

    ```Output
    AccountEnabled                      : True
    AddIns                              : {}
    AlternativeNames                    : {}
    AppDescription                      :
    AppDisplayName                      : Fabrikam
    AppId                               : <AppId>
    AppManagementPolicies               :
    AppOwnerOrganizationId              : <AppOwnerOrganizationId>
    AppRoleAssignedTo                   :
    AppRoleAssignmentRequired           : True
    AppRoleAssignments                  :
    AppRoles                            : {<AppRoleId>}
    ApplicationTemplateId               : 518e5f48-1fc8-4c48-9387-9fdf28b0dfe7
    ClaimsMappingPolicies               :
    CreatedObjects                      :
    CustomSecurityAttributes            : Microsoft.Graph.PowerShell.Models.MicrosoftGraphCustomSecurityAttributeValue
    DelegatedPermissionClassifications  :
    DeletedDateTime                     :
    Description                         :
    DisabledByMicrosoftStatus           :
    DisplayName                         : Fabrikam
    Endpoints                           :
    ErrorUrl                            :
    FederatedIdentityCredentials        :
    HomeRealmDiscoveryPolicies          :
    Homepage                            : https://account.activedirectory.windowsazure.com:444/applications/default.aspx?metadata=aad2aadsync|ISV9.1|primary|z
    Id                                  : <ServicePrincipalId>
    Info                                : Microsoft.Graph.PowerShell.Models.MicrosoftGraphInformationalUrl
    KeyCredentials                      : {}
    LicenseDetails                      :
    
    ...
    ```

1. Initialize a variable for the service principal ID.

    Be sure to use the service principal ID instead of the application ID.

    ```powershell
    $ServicePrincipalId = "<ServicePrincipalId>"
    ```

1. Initialize a variable for the app role ID.

    ```powershell
    $AppRoleId= "<AppRoleId>"
    ```

# [Microsoft Graph](#tab/ms-graph)

1. In the source tenant, use the [applicationTemplate: instantiate](/graph/api/applicationtemplate-instantiate) API to add an instance of a configuration application from the Microsoft Entra application gallery into your tenant.
    
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
            "id": "{id}",
            "appId": "{appId}",
            "applicationTemplateId": "518e5f48-1fc8-4c48-9387-9fdf28b0dfe7",
            "createdDateTime": "2023-07-31T23:26:24Z",
            "deletedDateTime": null,
            "displayName": "Fabrikam",
            "description": null,
            "groupMembershipClaims": null,
            "identifierUris": [],
            "isFallbackPublicClient": false,
            "signInAudience": "AzureADMyOrg",
            "tags": [],
            "tokenEncryptionKeyId": null,
            "defaultRedirectUri": null,
            "optionalClaims": null,
            "addIns": [],
            "api": {
                "acceptMappedClaims": null,
                "knownClientApplications": [],
                "requestedAccessTokenVersion": null,
                "oauth2PermissionScopes": [
                    {
                        "adminConsentDescription": "Allow the application to access Fabrikam on behalf of the signed-in user.",
                        "adminConsentDisplayName": "Access Fabrikam",
                        "id": "{id}",
                        "isEnabled": true,
                        "type": "User",
                        "userConsentDescription": "Allow the application to access Fabrikam on your behalf.",
                        "userConsentDisplayName": "Access Fabrikam",
                        "value": "user_impersonation"
                    }
                ],
                "preAuthorizedApplications": []
            },
            "appRoles": [
                {
                    "allowedMemberTypes": [
                        "User"
                    ],
                    "displayName": "msiam_access",
                    "id": "{appRoleId}",
                    "isEnabled": true,
                    "description": "msiam_access",
                    "value": null,
                    "origin": "Application"
                }
            ],
            "info": {
                "logoUrl": null,
                "marketingUrl": null,
                "privacyStatementUrl": null,
                "supportUrl": null,
                "termsOfServiceUrl": null
            },
            "keyCredentials": [],
            "parentalControlSettings": {
                "countriesBlockedForMinors": [],
                "legalAgeGroupRule": "Allow"
            },
            "passwordCredentials": [],
            "publicClient": {
                "redirectUris": []
            },
            "requiredResourceAccess": [],
            "verifiedPublisher": {
                "displayName": null,
                "verifiedPublisherId": null,
                "addedDateTime": null
            },
            "web": {
                "homePageUrl": "https://account.activedirectory.windowsazure.com:444/applications/default.aspx?metadata=aad2aadsync|ISV9.1|primary|z",
                "redirectUris": [],
                "logoutUrl": null
            }
        },
        "servicePrincipal": {
            "id": "{servicePrincipalId}",
            "deletedDateTime": null,
            "accountEnabled": true,
            "appId": "{appId}",
            "applicationTemplateId": "518e5f48-1fc8-4c48-9387-9fdf28b0dfe7",
            "appDisplayName": "Fabrikam",
            "alternativeNames": [],
            "appOwnerOrganizationId": "{appOwnerOrganizationId}",
            "displayName": "Fabrikam",
            "appRoleAssignmentRequired": true,
            "loginUrl": null,
            "logoutUrl": null,
            "homepage": "https://account.activedirectory.windowsazure.com:444/applications/default.aspx?metadata=aad2aadsync|ISV9.1|primary|z",
            "notificationEmailAddresses": [],
            "preferredSingleSignOnMode": null,
            "preferredTokenSigningKeyThumbprint": null,
            "replyUrls": [],
            "servicePrincipalNames": [
                "{appId}"
            ],
            "servicePrincipalType": "Application",
            "tags": [
                "WindowsAzureActiveDirectoryIntegratedApp"
            ],
            "tokenEncryptionKeyId": null,
            "samlSingleSignOnSettings": null,
            "addIns": [],
            "appRoles": [
                {
                    "allowedMemberTypes": [
                        "User"
                    ],
                    "displayName": "msiam_access",
                    "id": "{appRoleId}",
                    "isEnabled": true,
                    "description": "msiam_access",
                    "value": null,
                    "origin": "Application"
                }
            ],
            "info": {
                "logoUrl": null,
                "marketingUrl": null,
                "privacyStatementUrl": null,
                "supportUrl": null,
                "termsOfServiceUrl": null
            },
            "keyCredentials": [],
            "oauth2PermissionScopes": [
                {
                    "adminConsentDescription": "Allow the application to access Fabrikam on behalf of the signed-in user.",
                    "adminConsentDisplayName": "Access Fabrikam",
                    "id": "{id}",
                    "isEnabled": true,
                    "type": "User",
                    "userConsentDescription": "Allow the application to access Fabrikam on your behalf.",
                    "userConsentDisplayName": "Access Fabrikam",
                    "value": "user_impersonation"
                }
            ],
            "passwordCredentials": [],
            "verifiedPublisher": {
                "displayName": null,
                "verifiedPublisherId": null,
                "addedDateTime": null
            }
        }
    }
    ```
    
1. Save the servicePrincipalId.

    Be sure to use the service principal ID instead of the application ID.

1. Save the appRoleId.

---

## Step 7: Test the connection to the target tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

# [PowerShell](#tab/ms-powershell)

1. In the source tenant, use the [Invoke-MgGraphRequest](/powershell/microsoftgraph/authentication-commands#using-invoke-mggraphrequest) command to test the connection to the target tenant and validate the credentials.

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
    Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/servicePrincipals/$ServicePrincipalId/synchronization/jobs/validateCredentials" -Body $Params
    ```

# [Microsoft Graph](#tab/ms-graph)

1. In the source tenant, use the [synchronizationJob: validateCredentials](/graph/api/synchronization-synchronizationjob-validatecredentials) API to test the connection to the target tenant and validate the credentials.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/v1.0/servicePrincipals/{servicePrincipalId}/synchronization/jobs/validateCredentials
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

---

## Step 8: Create a provisioning job in the source tenant

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

In the source tenant, to enable provisioning, create a provisioning job.

# [PowerShell](#tab/ms-powershell)

1. Determine the synchronization template to use, such as `Azure2Azure`.

    A template has pre-configured synchronization settings. 

1. In the source tenant, use the [New-MgServicePrincipalSynchronizationJob](/powershell/module/microsoft.graph.applications/new-mgserviceprincipalsynchronizationjob) command to create a provisioning job based on a template.

    ```powershell
    New-MgServicePrincipalSynchronizationJob -ServicePrincipalId $ServicePrincipalId -TemplateId "Azure2Azure" | Format-List
    ```

    ```Output
    Id                         : <JobId>
    Schedule                   : Microsoft.Graph.PowerShell.Models.MicrosoftGraphSynchronizationSchedule
    Schema                     : Microsoft.Graph.PowerShell.Models.MicrosoftGraphSynchronizationSchema
    Status                     : Microsoft.Graph.PowerShell.Models.MicrosoftGraphSynchronizationStatus
    SynchronizationJobSettings : {AzureIngestionAttributeOptimization, LookaheadQueryEnabled}
    TemplateId                 : Azure2Azure
    AdditionalProperties       : {[@odata.context, https://graph.microsoft.com/v1.0/$metadata#servicePrincipals('<ServicePrincipalId>')/synchro
                                 nization/jobs/$entity]}
    ```

1. Initialize a variable for the job ID.

    ```powershell
    $JobId = "<JobId>"
    ```

# [Microsoft Graph](#tab/ms-graph)

1. Determine the [synchronization template](/graph/api/resources/synchronization-synchronizationtemplate) to use, such as `Azure2Azure`.

    A template has pre-configured synchronization settings. 
    
1. In the source tenant, use the [Create synchronizationJob](/graph/api/synchronization-synchronization-post-jobs) API to create a provisioning job based on a template.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/v1.0/servicePrincipals/{servicePrincipalId}/synchronization/jobs
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
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#servicePrincipals('{servicePrincipalId}')/synchronization/jobs/$entity",
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

1. Save the jobId.

---

## Step 9: Save your credentials

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

# [PowerShell](#tab/ms-powershell)

1. In the source tenant, use the [Invoke-MgGraphRequest](/powershell/microsoftgraph/authentication-commands#using-invoke-mggraphrequest) command to save your credentials.

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
    Invoke-MgGraphRequest -Method PUT -Uri "https://graph.microsoft.com/v1.0/servicePrincipals/$ServicePrincipalId/synchronization/secrets" -Body $Params
    ```

# [Microsoft Graph](#tab/ms-graph)

1. In the source tenant, use the [Add synchronization secrets](/graph/api/synchronization-serviceprincipal-put-synchronization) API to save your credentials.

    **Request**
    
    ```http
    PUT https://graph.microsoft.com/v1.0/servicePrincipals/{servicePrincipalId}/synchronization/secrets 
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

---

## Step 10: Assign a user to the configuration

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

For cross-tenant synchronization to work, at least one internal user must be assigned to the configuration.

# [PowerShell](#tab/ms-powershell)

1. In the source tenant, use the [New-MgServicePrincipalAppRoleAssignedTo](/powershell/module/microsoft.graph.applications/new-mgserviceprincipalapproleassignedto) command to assign an internal user to the configuration.

    ```powershell
    $Params = @{
        PrincipalId = "<PrincipalId>"
        ResourceId = $ServicePrincipalId
        AppRoleId = $AppRoleId
    }
    New-MgServicePrincipalAppRoleAssignedTo -ServicePrincipalId $ServicePrincipalId -BodyParameter $Params | Format-List
    ```

    ```Output
    AppRoleId            : <AppRoleId>
    CreatedDateTime      : 7/31/2023 10:27:12 PM
    DeletedDateTime      :
    Id                   : <Id>
    PrincipalDisplayName : User1
    PrincipalId          : <PrincipalId>
    PrincipalType        : User
    ResourceDisplayName  : Fabrikam
    ResourceId           : <ServicePrincipalId>
    AdditionalProperties : {[@odata.context, https://graph.microsoft.com/v1.0/$metadata#appRoleAssignments/$entity]}
    ```

# [Microsoft Graph](#tab/ms-graph)

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
        "createdDateTime": "2023-07-31T22:23:48.6541804Z",
        "principalDisplayName": "User1",
        "principalId": "{principalId}",
        "principalType": "User",
        "resourceDisplayName": "Fabrikam",
        "resourceId": "{servicePrincipalId}"
    }
    ```

---

## Step 11: Test provision on demand

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

Now that you have a configuration, you can test on-demand provisioning with one of your users.

# [PowerShell](#tab/ms-powershell)

1. In the source tenant, use the [Get-MgServicePrincipalSynchronizationJobSchema](/powershell/module/microsoft.graph.applications/get-mgserviceprincipalsynchronizationjobschema) command to get the schema rule ID.

    ```powershell
    $SynchronizationSchema = Get-MgServicePrincipalSynchronizationJobSchema -ServicePrincipalId $ServicePrincipalId -SynchronizationJobId $JobId
    $SynchronizationSchema.SynchronizationRules | Format-List
    ```

    ```Output
    ContainerFilter      : Microsoft.Graph.PowerShell.Models.MicrosoftGraphContainerFilter
    Editable             : True
    GroupFilter          : Microsoft.Graph.PowerShell.Models.MicrosoftGraphGroupFilter
    Id                   : <RuleId>
    Metadata             : {defaultSourceObjectMappings, supportsProvisionOnDemand}
    Name                 : USER_INBOUND_USER
    ObjectMappings       : {Provision Azure Active Directory Users, , , …}
    Priority             : 1
    SourceDirectoryName  : Azure Active Directory
    TargetDirectoryName  : Azure Active Directory (target tenant)
    AdditionalProperties : {}
    ```

1. Initialize a variable for the rule ID.

    ```powershell
    $RuleId = "<RuleId>"
    ```

1. Use the [New-MgServicePrincipalSynchronizationJobOnDemand](/powershell/module/microsoft.graph.applications/new-mgserviceprincipalsynchronizationjobondemand) command to provision a test user on demand.

    ```powershell
    $Params = @{
        Parameters = @(
            @{
                Subjects = @(
                    @{
                        ObjectId = "<UserObjectId>"
                        ObjectTypeName = "User"
                    }
                )
                RuleId = $RuleId
            }
        )
    }
    New-MgServicePrincipalSynchronizationJobOnDemand -ServicePrincipalId $ServicePrincipalId -SynchronizationJobId $JobId -BodyParameter $Params | Format-List
    ```

    ```Output
    Key                  : Microsoft.Identity.Health.CPP.Common.DataContracts.SyncFabric.StatusInfo
    Value                : [{"provisioningSteps":[{"name":"EntryImport","type":"Import","status":"Success","description":"Retrieved User
                           'user1@fabrikam.com' from Azure Active Directory","timestamp":"2023-07-31T22:31:15.9116590Z","details":{"objectId":
                           "<UserObjectId>","accountEnabled":"True","displayName":"User1","mailNickname":"user1","userPrincipalName":"use
                           ...
    AdditionalProperties : {[@odata.context, https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.stringKeyStringValuePair]}
    ```

# [Microsoft Graph](#tab/ms-graph)

1. In the source tenant, use the [Get synchronizationSchema](/graph/api/synchronization-synchronizationschema-get) API to get the schema rule ID.

    **Request**

    ```http
    GET https://graph.microsoft.com/v1.0/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}/schema
    ```
    
    **Response**

    ```http
    {
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#servicePrincipals('{servicePrincipalId}')/synchronization/jobs('{jobId}')/schema/$entity",
        "id": "{jobId}",
        "version": "v1.2",
        "synchronizationRules": [
            {
                "containerFilter": null,
                "editable": true,
                "groupFilter": null,
                "id": "{ruleId}",
                "name": "USER_INBOUND_USER",
                "priority": 1,
                "sourceDirectoryName": "Azure Active Directory",
                "targetDirectoryName": "Azure Active Directory (target tenant)",
                "metadata": [
    
                ...
    ```
    
1. In the source tenant, use the [synchronizationJob: provisionOnDemand](/graph/api/synchronization-synchronizationjob-provisionondemand) API to provision a test user on demand.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/v1.0/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}/provisionOnDemand
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

    **Response**

    ```http
    {
        "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#microsoft.graph.stringKeyStringValuePair",
        "key": "Microsoft.Identity.Health.CPP.Common.DataContracts.SyncFabric.StatusInfo",
        "value": "[{\"provisioningSteps\":[{\"name\":\"EntryImport\",\"type\":\"Import\",\"status\":\"Success\",\"description\":\"Retrieved User 'user1@fabrikam.com' from Azure Active Directory\",\"timestamp\":\"2023-07-31T00:00:16.7866324Z\",\"details\":{\"objectId\":\"{userObjectId}\",\"accountEnabled\":\"True\",\"displayName\":\"User1\",\"mailNickname\":\"user1\",\"userPrincipalName\":\"user1@fabrikam.com\",}
    
        ...
    ```

---

## Step 12: Start the provisioning job

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

# [PowerShell](#tab/ms-powershell)

1. Now that the provisioning job is configured, in the source tenant, use the [Start-MgServicePrincipalSynchronizationJob](/powershell/module/microsoft.graph.applications/start-mgserviceprincipalsynchronizationjob) command to start the provisioning job.

    ```powershell
    Start-MgServicePrincipalSynchronizationJob -ServicePrincipalId $ServicePrincipalId -SynchronizationJobId $JobId
    ```

# [Microsoft Graph](#tab/ms-graph)

1. Now that the provisioning job is configured, in the source tenant, use the [Start synchronizationJob](/graph/api/synchronization-synchronizationjob-start) API to start the provisioning job.

    **Request**
    
    ```http
    POST https://graph.microsoft.com/v1.0/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}/start
    ```
    
    
    **Response**
    
    ```http
    HTTP/1.1 204 No Content
    ```

---

## Step 13: Monitor provisioning

![Icon for the source tenant.](./media/common/icon-tenant-source.png)<br/>**Source tenant**

# [PowerShell](#tab/ms-powershell)

1. Now that the provisioning job is running, in the source tenant, use the [Get-MgServicePrincipalSynchronizationJob](/powershell/module/microsoft.graph.applications/get-mgserviceprincipalsynchronizationjob) command to monitor the progress of the current provisioning cycle as well as statistics to date such as the number of users and groups that have been created in the target system.

    ```powershell
    Get-MgServicePrincipalSynchronizationJob -ServicePrincipalId $ServicePrincipalId -SynchronizationJobId $JobId | Format-List
    ```

    ```Output
    Id                         : <JobId>
    Schedule                   : Microsoft.Graph.PowerShell.Models.MicrosoftGraphSynchronizationSchedule
    Schema                     : Microsoft.Graph.PowerShell.Models.MicrosoftGraphSynchronizationSchema
    Status                     : Microsoft.Graph.PowerShell.Models.MicrosoftGraphSynchronizationStatus
    SynchronizationJobSettings : {AzureIngestionAttributeOptimization, LookaheadQueryEnabled}
    TemplateId                 : Azure2Azure
    AdditionalProperties       : {[@odata.context, https://graph.microsoft.com/v1.0/$metadata#servicePrincipals('<ServicePrincipalId>')/synchro
                                 nization/jobs/$entity]}
    ```

1. In addition to monitoring the status of the provisioning job, use the [Get-MgAuditLogProvisioning](/powershell/module/microsoft.graph.reports/get-mgauditlogprovisioning) command to retrieve the provisioning logs and get all the provisioning events that occur. For example, query for a particular user and determine if they were successfully provisioned.

    ```powershell
    Get-MgAuditLogDirectoryAudit | Select -First 10 | Format-List
    ```

    ```Output
    ActivityDateTime     : 7/31/2023 12:08:17 AM
    ActivityDisplayName  : Export
    AdditionalDetails    : {Details, ErrorCode, EventName, ipaddr...}
    Category             : ProvisioningManagement
    CorrelationId        : cc519f3b-fb72-4ea2-9b7b-8f9dc271c5ec
    Id                   : Sync_cc519f3b-fb72-4ea2-9b7b-8f9dc271c5ec_L5BFV_161778479
    InitiatedBy          : Microsoft.Graph.PowerShell.Models.MicrosoftGraphAuditActivityInitiator1
    LoggedByService      : Account Provisioning
    OperationType        :
    Result               : success
    ResultReason         : User 'user2@fabrikam.com' was created in Azure Active Directory (target tenant)
    TargetResources      : {<ServicePrincipalId>, }
    AdditionalProperties : {}
    
    ActivityDateTime     : 7/31/2023 12:08:17 AM
    ActivityDisplayName  : Export
    AdditionalDetails    : {Details, ErrorCode, EventName, ipaddr...}
    Category             : ProvisioningManagement
    CorrelationId        : cc519f3b-fb72-4ea2-9b7b-8f9dc271c5ec
    Id                   : Sync_cc519f3b-fb72-4ea2-9b7b-8f9dc271c5ec_L5BFV_161778264
    InitiatedBy          : Microsoft.Graph.PowerShell.Models.MicrosoftGraphAuditActivityInitiator1
    LoggedByService      : Account Provisioning
    OperationType        :
    Result               : success
    ResultReason         : User 'user2@fabrikam.com' was updated in Azure Active Directory (target tenant)
    TargetResources      : {<ServicePrincipalId>, }
    AdditionalProperties : {}
    
    ActivityDateTime     : 7/31/2023 12:08:14 AM
    ActivityDisplayName  : Synchronization rule action
    AdditionalDetails    : {Details, ErrorCode, EventName, ipaddr...}
    Category             : ProvisioningManagement
    CorrelationId        : cc519f3b-fb72-4ea2-9b7b-8f9dc271c5ec
    Id                   : Sync_cc519f3b-fb72-4ea2-9b7b-8f9dc271c5ec_L5BFV_161778395
    InitiatedBy          : Microsoft.Graph.PowerShell.Models.MicrosoftGraphAuditActivityInitiator1
    LoggedByService      : Account Provisioning
    OperationType        :
    Result               : success
    ResultReason         : User 'user2@fabrikam.com' will be created in Azure Active Directory (target tenant) (User is active and assigned
                           in Azure Active Directory, but no matching User was found in Azure Active Directory (target tenant))
    TargetResources      : {<ServicePrincipalId>, }
    AdditionalProperties : {}
    ```

# [Microsoft Graph](#tab/ms-graph)

1. Now that the provisioning job is running, in the source tenant, use the [Get synchronizationJob](/graph/api/synchronization-synchronizationjob-get) API to monitor the progress of the current provisioning cycle as well as statistics to date such as the number of users and groups that have been created in the target system.

    **Request**
    
    ```http
    GET https://graph.microsoft.com/v1.0/servicePrincipals/{servicePrincipalId}/synchronization/jobs/{jobId}
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
    GET https://graph.microsoft.com/v1.0/auditLogs/provisioning?$filter=((contains(tolower(servicePrincipal/id), '{servicePrincipalId}') or contains(tolower(servicePrincipal/displayName), '{servicePrincipalId}')) and activityDateTime gt 2023-07-30 and activityDateTime lt 2023-07-31)&$top=500&$orderby=activityDateTime desc
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
                "activityDateTime": "2023-07-31T00:40:37Z",
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

---

## Troubleshooting tips

# [PowerShell](#tab/ms-powershell)

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

2. When you sign in with [Connect-MgGraph](/powershell/microsoftgraph/authentication-commands#using-connect-mggraph), make sure you specify the required scopes. See [Step 1: Sign in to the target tenant](#step-1-sign-in-to-the-target-tenant) and [Step 4: Sign in to the source tenant](#step-4-sign-in-to-the-source-tenant) earlier in this article.

#### Symptom - New-MgPolicyCrossTenantAccessPolicyPartner_Create error

When you try to create a new partner configuration, you receive an error message similar to the following:

```
New-MgPolicyCrossTenantAccessPolicyPartner_Create: Another object with the same value for property tenantId already exists.
```

**Cause**

You are likely trying to create a configuration or object that already exists, possibly from a previous configuration.

**Solution**

1. Verify your syntax and that you are using the correct tenant ID.

1. Use the [Get-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/get-mgpolicycrosstenantaccesspolicypartner) command to list the existing object.

1. If you have an existing object, you might need to make an update using [Update-MgPolicyCrossTenantAccessPolicyPartner](/powershell/module/microsoft.graph.identity.signins/update-mgpolicycrosstenantaccesspolicypartner)

#### Symptom - Request_MultipleObjectsWithSameKeyValue error

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

1. Use the [Get-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization](/powershell/module/microsoft.graph.identity.signins/get-mgpolicycrosstenantaccesspolicypartneridentitysynchronization) command to list the `IsSyncAllowed` setting.

    ```powershell
    (Get-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization -CrossTenantAccessPolicyConfigurationPartnerTenantId $SourceTenantId).UserSyncInbound
    ```

1. If you have an existing policy, you might need to make an update using [Update-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization](/powershell/module/microsoft.graph.identity.signins/update-mgpolicycrosstenantaccesspolicypartneridentitysynchronization) command to enable user synchronization.

    ```powershell
    $Params = @{
        userSyncInbound = @{
            isSyncAllowed = $true
        }
    }
    Update-MgPolicyCrossTenantAccessPolicyPartnerIdentitySynchronization -CrossTenantAccessPolicyConfigurationPartnerTenantId $SourceTenantId -BodyParameter $Params
    ```

# [Microsoft Graph](#tab/ms-graph)

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

2. In [Microsoft Graph Explorer tool](https://aka.ms/ge), make sure you consent to the required permissions. See [Step 1: Sign in to the target tenant](#step-1-sign-in-to-the-target-tenant) and [Step 4: Sign in to the source tenant](#step-4-sign-in-to-the-source-tenant) earlier in this article.

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

    - [Update crossTenantAccessPolicyConfigurationPartner](/graph/api/crosstenantaccesspolicyconfigurationpartner-update)
    - [Update crossTenantIdentitySyncPolicyPartner](/graph/api/crosstenantidentitysyncpolicypartner-update)

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

    - [Create identitySynchronization](/graph/api/crosstenantaccesspolicyconfigurationpartner-put-identitysynchronization)

---

## Next steps

- [Microsoft Entra synchronization API overview](/graph/api/resources/synchronization-overview)
- [Tutorial: Develop and plan provisioning for a SCIM endpoint in Microsoft Entra ID](../app-provisioning/use-scim-to-provision-users-and-groups.md)
