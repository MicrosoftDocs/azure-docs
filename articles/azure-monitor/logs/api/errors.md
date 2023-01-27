---
title: Errors
description: This section contains a non-exhaustive list of known common errors that can occur in the Azure Monitor Log Analytics API, their causes, and possible solutions.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/29/2021
ms.topic: article
---
# Azure Monitor Log Analytics API Errors

This section contains a non-exhaustive list of known common errors, their causes, and possible solutions. It also contains successful responses which often indicate an issue with the request (such as a missing header) or otherwise unexpected behavior.

## Query Syntax Error

Code: 400 Response:

```
    {
        "error": {
            "message": "The request had some invalid properties",
            "code": "BadArgumentError",
            "innererror": {
                "code": "SyntaxError",
                "message": "Syntax Error"
            }
        }
    }
```

Details: The query string is malformed. Check for extra spaces, punctuation, or spelling errors.

## No Authentication Provided

Code: 401 Response:

```
    {
        "error": {
            "code": "AuthenticationFailed",
            "message": "Authentication failed. The 'Authorization' header is missing."
        }
    }
```

Details: Include a form of authentication with your request, such as the header "Authorization: Bearer \<token\>"

## Invalid Authentication Token

Code: 403 Response:

```
    {
        "error": {
            "code": "InvalidAuthenticationToken",
            "message": "The access token is invalid."
        }
    }
```

Details: the token is malformed or otherwise invalid. This can occur if you manually copy-paste the token and add or cut characters to the payload. Verify that the token is exactly as received from Azure AD.

## Invalid Token Audience

Code: 403 Response:

```
    {
        "error": {
            "code": "InvalidAuthenticationTokenAudience",
            "message": "The access token has been obtained from wrong audience or resource 'https://api.loganalytics.io'. It should exactly match (including forward slash) with one of the allowed audiences 'https://management.core.windows.net/','https://management.azure.com/'."
        }
    }
```

Details: this occurs if you try to use the client credentials OAuth2 flow to obtain a token for the API and then use that token via the ARM endpoint. Use one of the indicated URLs as the resource in your token request if you want to use the ARM endpoint. Alternatively, you can use the direct API endpoint with a different OAuth2 flow for authorization.

## Client Credentials to Direct API

Code: 403 Response:

```
    {
        "error": {
            "message": "The provided credentials have insufficient access to perform the requested operation",
            "code": "InsufficientAccessError",
            "innererror": {
                "code": "UnauthorizedClient",
                "message": "The service principal does not have sufficient permissions to access this resource: 997631f8-3a55-4bb2-81b2-c0972b222260"
            }
        }
    }
```

Details: This error can occur if you try to use client credentials via the direct API endpoint. If you are using the direct API endpoint, use a different OAuth2 flow for authorization. If you must use client credentials, use the ARM API endpoint.

## Insufficient Permissions

Code: 403 Response:

```
    {
        "error": {
            "message": "The provided credentials have insufficient access to perform the requested operation",
            "code": "InsufficientAccessError"
        }
    }
```

Details: The token you have presented for authorization belongs to a user who does not have sufficient access to this privilege. Verify your workspace GUID and your token request are correct, and if necessary grant IAM privileges in your workspace to the Azure AD Application you created as Contributor.

> [!NOTE]
> When using Azure AD authentication, it may take up to 60 minutes for the Azure Application Insights REST API to recognize new 
> role-based access control (RBAC) permissions. While permissions are propagating, REST API calls may fail with error code 403. 

## Bad Authorization Code

Code: 403 Response:

```
    {
        "error": "invalid_grant",
        "error_description": "AADSTS70002: Error validating credentials. AADSTS70008: The provided authorization code or refresh token is expired. Send a new interactive authorization request for this user and resource.",
        "error_codes": [
            70002,
            70008
        ]
    }
```

Details: The authorization code submitted in the token request was either stale or previously used. Reauthorize via the Azure AD authorize endpoint to get a new code.

## Path Not Found

Code: 404 Response:

```
    {
        "error": {
            "message": "The requested path does not exist",
            "code": "PathNotFoundError"
        }
    }
```

Details: the requested query path does not exist. Verify the URL spelling of the endpoint you are hitting, and that you are using a supported HTTP verb.

## Missing JSON or Content-Type

Code: 200 Response: empty body. Details: If you send a POST request that is missing either JSON body or the "Content-Type: application/json" header, we will return an empty 200 response.

## No Data in Workspace

Code: 204 Response: empty body. Details: If a workspace has no data in it, we return a 204 No Content.
