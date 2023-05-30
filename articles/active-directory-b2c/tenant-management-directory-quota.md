---
title: Manage directory size quota in Azure Active Directory B2C
titleSuffix: Azure Active Directory B2C
description: Learn how to manage directory size quota un in Azure AD B2C tenants and remove unused accounts 
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

It's recommended to monitor the directory quota consumption as explained below.

# Monitor directory quota consumption of your Azure AD B2C tenant
 
1. Create an App Registration in AAD tenant behind B2C, configure a client id / secret to do client credentials flow as described [here](https://learn.microsoft.com/en-us/azure/active-directory-b2c/client-credentials-grant-flow?pivots=b2c-custom-policy)

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


## Python sample

[NEED TO POINT TO THE REPO]


# Manage inactive users 

It's recommended that inactive user accounts are monitored and managed properly. To reduce the number of objects and the overall attack surface area it's recommended to delete inactive accounts if possible. You can run the a Graph API to check for the last sign-in date using the following command. Then, for example, you can delete users that the last sign-in date is greater than a year.

# List and delete inactive users in your Azure AD B2C tenant
 
1. Create an App Registration in AAD tenant behind B2C, configure a client id / secret to do client credentials flow as described [here](https://learn.microsoft.com/en-us/azure/active-directory-b2c/client-credentials-grant-flow?pivots=b2c-custom-policy) (You can use the same app registration created in the step above with the API permissions mentioned below) 

1. Grant the app API permissions for "User.Read.All" and "AuditLog.Read.All" Microsoft Graph API and grant admin consent.

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

The following JSON shows an example of the results:

```json
{
    "@odata.context":  "https://graph.microsoft.com/beta/$metadata#users(displayName,signInActivity)",
    "value":  [
        {
            "id":  "178a7baa-1768-449a-bc5a-103f5ca6670a",
            "displayName":  "Test User 16",
            "signInActivity":  "@{lastSignInDateTime=2023-03-28T20:08:07Z; lastSignInRequestId=c43ac6b5-c644-456f-832d-ea323bf1cf00; lastNonInteractiveSignInDateTime=; lastNonInteractiveSignInRequestId=}"
        },
        {
            "id":  "e4d91330-c1f3-4c35-ba26-230515c51761",
            "displayName":  "Test User 18",
            "signInActivity":  "@{lastSignInDateTime=2023-03-28T20:08:26Z; lastSignInRequestId=3f546eba-ba9b-4bc4-9bd3-b5b6fa5fce00; lastNonInteractiveSignInDateTime=; lastNonInteractiveSignInRequestId=}"
        }
    ]
}
```

The attribute lastSignInDateTime shows the last sign in date.

1. Delete inactive users

To delete an user in your Azure AD B2C tenant you need to call the following Graph API 

```url
DELETE https://graph.microsoft.com/v1.0/users/{user-id}
```

Use the value if the "id" attributed obtained in the previous step for each user to be deleted.

This delete step can be included in the powershell script. You need to add the scope User.ReadWriteAll to the app registration.

>[!NOTE]
>The following script will attempt to delete users from your directory - please review before executing.


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
$response = Invoke-RestMethod 'https://graph.microsoft.com/beta/users?$select=displayName,signInActivity&$filter=signInActivity/lastSignInDateTime le 2023-04-30T00:00:00Z' -Method 'GET' -Headers $headers
$response | ConvertTo-Json

## Call Graph API to delete the users obtained in the previous query
foreach ($value in $response.value) {
    $deleteEndpoint = "https://graph.microsoft.com/v1.0/users/" + $value.id
    $deleteResponse = Invoke-RestMethod $deleteEndpoint -Method 'DELETE' -Headers $headers
}
```

You can find more information [here](https://learn.microsoft.com/en-us/graph/api/user-delete?view=graph-rest-1.0&tabs=http) 

Multiple requests for this API can be combined using the Json Batching mechanism described [here](https://learn.microsoft.com/en-us/graph/json-batching)

