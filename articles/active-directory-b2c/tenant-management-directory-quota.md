---
title: Manage directory size quota in Azure Active Directory B2C
titleSuffix: Azure Active Directory B2C
description: Learn how to manage directory size quota un in Azure AD B2C tenants
services: active-directory-b2c
author: alvesfabi
manager: DavidHoerster

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 05/30/2023
ms.custom: project-no-code, b2c-docs-improvements
ms.reviewer: kengaderdus
ms.author: alvesfabi
ms.subservice: B2C
---

# Manage directory size quota of your Azure Active Directory B2C tenant

It's important that you control the consumption of the directory quota to prevent errors when creating new directory objects. Directory quota has a given size that is expressed in number of objects: uer accounts, app registrations, groups, etc. are examples of the objects that consume from the directory quota. When the quota size is reached the directory will generate an error when trying to create a new object.

It's recommended that inactive user accounts are monitored and managed properly. To understand more read [this](user-manage-inactive)


## Monitor directory quota consumption of your Azure AD B2C tenant
 
1. Create an App Registration in AAD tenant behind B2C, configure a client id / secret to do client credentials flow as described [here](client-credentials-grant-flow.md)

1. Grant the app API permissions for "Organization.Read.All" Microsoft Graph API and grant admin consent.

1. Run the following PowerShell script. Replace the TenantId with your tenant ID, the ClientID with the application ID you registered, and the ClientSecret with the application registration client secret.

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

The API will respond whit the following json:
```json
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#organization(directorySizeQuota)",
    "value": [
        {
            "directorySizeQuota": {
                "used": 211802,
                "total": 300000
            }
        }
    ]
}
```

- The attribute "total" is the maximum number of objects allowed in the directory quota.

- The attribute "used" is the number of objects existing in the directory.


1. Alert if the ratio between used and total is higher that 90% 


