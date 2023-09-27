---
title: Manage directory size quota in Azure Active Directory B2C
titleSuffix: Azure Active Directory B2C
description: Learn how to manage directory size quota in your Azure AD B2C tenant
services: active-directory-b2c
author: alvesfabi
manager: DavidHoerster

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 06/15/2023
ms.custom: project-no-code, b2c-docs-improvements
ms.reviewer: kengaderdus
ms.author: falves
ms.subservice: B2C
---

# Manage directory size quota of your Azure Active Directory B2C tenant

It's important that you monitor how you use your Azure AD B2C directory quota. Directory quota has a given size that is expressed in number of objects. These objects include user accounts, app registrations, groups, etc. When the number of objects in your tenant reach quota size, the directory will generate an error when trying to create a new object.


## Monitor directory quota usage in your Azure AD B2C tenant
 
1. Use the steps in [Register an application](client-credentials-grant-flow.md#step-2-register-an-application) to register an app in your tenant, which uses client credentials flow. Record the **Application (client) ID** for use in a later. 

1. Use the steps in [Create a client secret](client-credentials-grant-flow.md#step-2-register-an-application) to configure a client secret for your app. Record the secret's **Value**. You'll use this value for configuration in a later step.

1. For your app to call Microsoft Graph API, you need to grant it the required permissions. To do so, use the steps in [Grant API access](microsoft-graph-get-started.md?tabs=app-reg-ga#grant-api-access), but only grant **Organization.Read.All** permission.

1. Run the following PowerShell script. Replace the placeholder: 

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
$response = Invoke-RestMethod 'https://graph.microsoft.com/beta/organization?$select=directorySizeQuota' -Method 'GET' -Headers $headers
$response | ConvertTo-Json
```

The response from the API call looks similar to the following json:
```json
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#organization(directorySizeQuota)",
    "value": [
        {
            "directorySizeQuota": {
                "used": 211802,
                "total": 50000000
            }
        }
    ]
}
```

- The attribute `total` is the maximum number of objects allowed in the directory.

- The attribute `used` is the number of objects you already have in the directory.

If your tenant usage is higher that 80%, you can remove inactive users or request for a quota increase.


## Request increase directory quota size

You can request to increase the quota size by [contacting support](find-help-open-support-ticket.md) 
