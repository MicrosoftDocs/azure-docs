---
title: Manage inactive users in Azure Active Directory B2C
titleSuffix: Azure Active Directory B2C
description: Learn how to manage inactive users and remove unused accounts 
services: active-directory-b2c
author: alvesfabi
manager: DavidHoerster

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/15/2023
ms.custom: b2c-docs-improvements
ms.reviewer: kengaderdus
ms.author: falves
ms.subservice: B2C
---

# Manage inactive users in your Azure Active Directory B2C tenant

We recommend that you monitor your user accounts. Monitoring your user accounts enables you to discover inactive user accounts, which consume your Azure Active Directory (AD) B2C directory quota. Monitoring user accounts also help you to reduce the overall attack surface. 

## List inactive users in your Azure AD B2C tenant
 
1. Use the steps in [Register an application](client-credentials-grant-flow.md#step-2-register-an-application) to register an app in your tenant, which uses client credentials flow. Record the **Application (client) ID** for use in a later. 

1. Use the steps in [Create a client secret](client-credentials-grant-flow.md#step-2-register-an-application) to configure a client secret for your app. Record the secret's **Value**. You will use this value for configuration in a later step.

1. For your app to call Microsoft Graph API, you need to grant it the required permissions. To do so, use the steps in [Grant API access](microsoft-graph-get-started.md?tabs=app-reg-ga#grant-api-access), but only grant **User.Read.All** and **AuditLog.Read.All** permissions.

1. Run the following PowerShell script. Replace: 

   1. `[TenantId]` with your Azure AD B2C tenant ID. Learn [how to read your tenant ID](tenant-management-read-tenant-name.md#get-your-tenant-id) 
   
   1. `[ClientID]` with the Application (client) ID that you copied earlier.
   
   1. `[ClientSecret]` with the application client secret value that you copied earlier.

```ps
$tenantId = "[TenantId]"
$clientId = "[ClientID]"
$clientSecret = "[ClientSecret]"

## Use Client Credentials flow to get token to call Graph API
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", "application/x-www-form-urlencoded")
$body = "grant_type=client_credentials&client_id=" +  $clientId + "&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=" + $clientSecret
$endpoint = "https://login.microsoftonline.com/" + $tenantId + "/oauth2/v2.0/token"
$response = Invoke-RestMethod $endpoint -Method "POST" -Headers $headers -Body $body

## Call Graph API using token obtained in previous step
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Authorization", "Bearer " + $response.access_token)
$response = Invoke-RestMethod 'https://graph.microsoft.com/beta/users?$select=displayName,signInActivity' -Method 'GET' -Headers $headers
$response | ConvertTo-Json
```

The following JSON shows an example of the results:

```json
{
    "@odata.context":  "https://graph.microsoft.com/beta/$metadata#users(displayName,signInActivity)",
    "value":  [
        {
            "id":  "[object id]",
            "displayName":  "Martin Balaz",
            "signInActivity":  "@{lastSignInDateTime=2023-03-28T20:08:07Z; lastSignInRequestId=c43ac6b5-c644-456f-832d-ea323bf1cf00; lastNonInteractiveSignInDateTime=; lastNonInteractiveSignInRequestId=}"
        },
        {
            "id":  "[object id]",
            "displayName":  "Takuya Miura",
            "signInActivity":  "@{lastSignInDateTime=2023-03-28T20:08:26Z; lastSignInRequestId=3f546eba-ba9b-4bc4-9bd3-b5b6fa5fce00; lastNonInteractiveSignInDateTime=; lastNonInteractiveSignInRequestId=}"
        }
    ]
}
```

The attribute lastSignInDateTime shows the last sign in date.

## Delete inactive users in your Azure AD B2C tenant

To delete a user in your Azure AD B2C tenant, you need to call the [Delete a user](/graph/api/user-delete) Microsoft Graph API. To call this API you need to grant your app **User.ReadWrite.All** Microsoft Graph API permission as explained earlier.

>[!NOTE]
>DELETE /graph/api/user-delete

The following PowerShell script reads all users with sign in date before a given date, then attempts to delete them. Before you run it, replace the `[TenantId]`, `[ClientID]` and `[ClientSecret]` placeholders with appropriate values as explained earlier. Also replace `[Date]` with a date that you consider appropriate to determine if a user is considered inactive. For example: 2023-04-30T00:00:00Z

```ps
$tenantId = "[TenantId]"
$clientId = "[ClientID]"
$clientSecret = "[ClientSecret]"

## Use Client Credentials flow to get token to call Graph API
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", "application/x-www-form-urlencoded")
$body = "grant_type=client_credentials&client_id=" +  $clientId + "&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=" + $clientSecret
$endpoint = "https://login.microsoftonline.com/" + $tenantId + "/oauth2/v2.0/token"
$response = Invoke-RestMethod $endpoint -Method "POST" -Headers $headers -Body $body
# $response | ConvertTo-Json

## Call Graph API using token obtained in previous step
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Authorization", "Bearer " + $response.access_token)
$response = Invoke-RestMethod 'https://graph.microsoft.com/beta/users?$select=displayName,signInActivity&$filter=signInActivity/lastSignInDateTime le [Date]' -Method 'GET' -Headers $headers
$response | ConvertTo-Json

## Call Graph API to delete the users obtained in the previous query
foreach ($value in $response.value) {
    $deleteEndpoint = "https://graph.microsoft.com/v1.0/users/" + $value.id
    $deleteResponse = Invoke-RestMethod $deleteEndpoint -Method 'DELETE' -Headers $headers
}
```
