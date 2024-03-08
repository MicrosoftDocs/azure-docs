---
title: Azure Monitor Log Analytics API errors
description: This section contains a non-exhaustive list of known common errors that can occur in the Azure Monitor Log Analytics API, their causes, and possible solutions.
ms.date: 11/29/2021
author: guywi-ms
ms.author: guywild
ms.topic: article
---
# Azure Monitor Log Analytics API errors

This section contains a non-exhaustive list of known common errors, their causes, and possible solutions. It also contains successful responses, which often indicate an issue with the request (such as a missing header) or otherwise unexpected behavior.

## Query syntax error

400 response:

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

The query string is malformed. Check for extra spaces, punctuation, or spelling errors.

## No authentication provided

401 response:

```
    {
        "error": {
            "code": "AuthenticationFailed",
            "message": "Authentication failed. The 'Authorization' header is missing."
        }
    }
```

Include a form of authentication with your request, such as the header `"Authorization: Bearer \<token\>"`.

## Invalid authentication token

403 response:

```
    {
        "error": {
            "code": "InvalidAuthenticationToken",
            "message": "The access token is invalid."
        }
    }
```

The token is malformed or otherwise invalid. This error can occur if you manually copy and paste the token and add or cut characters to the payload. Verify that the token is exactly as received from Microsoft Entra ID.

## Invalid token audience

403 response:

```
    {
        "error": {
            "code": "InvalidAuthenticationTokenAudience",
            "message": "The access token has been obtained from wrong audience or resource 'https://api.loganalytics.io'. It should exactly match (including forward slash) with one of the allowed audiences 'https://management.core.windows.net/','https://management.azure.com/'."
        }
    }
```

This error occurs if you try to use the client credentials OAuth2 flow to obtain a token for the API and then use that token via the Azure Resource Manager endpoint. Use one of the indicated URLs as the resource in your token request if you want to use the Azure Resource Manager endpoint. Alternatively, you can use the direct API endpoint with a different OAuth2 flow for authorization.

## Client credentials to direct API

403 response:

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

This error can occur if you try to use client credentials via the direct API endpoint. If you're using the direct API endpoint, use a different OAuth2 flow for authorization. If you must use client credentials, use the Azure Resource Manager API endpoint.

## Insufficient permissions

403 response:

```
    {
        "error": {
            "message": "The provided credentials have insufficient access to perform the requested operation",
            "code": "InsufficientAccessError"
        }
    }
```

The token you've presented for authorization belongs to a user who doesn't have sufficient access to this privilege. Verify that your workspace GUID and your token request are correct. If necessary, grant IAM privileges in your workspace to the Microsoft Entra application you created as Contributor.

> [!NOTE]
> When you use Microsoft Entra authentication, it might take up to 60 minutes for the Application Insights REST API to recognize new role-based access control permissions. While permissions are propagating, REST API calls might fail with error code 403.

## Bad authorization code

403 response:

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

The authorization code submitted in the token request was either stale or previously used. Reauthorize via the Microsoft Entra authorize endpoint to get a new code.

## Path not found

404 response:

```
    {
        "error": {
            "message": "The requested path does not exist",
            "code": "PathNotFoundError"
        }
    }
```

The requested query path doesn't exist. Verify the URL spelling of the endpoint you're hitting and that you're using a supported HTTP verb.

## Missing JSON or Content-Type

200 response: Empty body

If you send a POST request that's missing either JSON body or the `"Content-Type: application/json"` header, we return an empty 200 response.

## No data in workspace

204 response: Empty body

If a workspace has no data in it, we return 204 No Content.
