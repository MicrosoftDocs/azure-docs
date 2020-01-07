---
title: Getting a token
description: Tutorial how to get access to Remote Rendering service REST APIs via tokens
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: tutorial
ms.service: azure-remote-rendering
---

# Getting a token

Tokens are used to gain access to the Remote rendering service REST APIs. The tokens are issued by the STS (Secure Token Service) in exchange for an account key. The STS URL is https://sts.mixedreality.azure.com.

## Accounts:
If you don't have a Remote rendering account, [create one](../how-tos/create-an-account.md). Each resource is identified by an *account ID* and an *account Key*.

### Examples:
```powershell
PS> $accountId = "********-****-****-****-************"
PS> $accountKey = "*******************************************="
```

## Common request headers:
- The *Authorization* header must have the value of "Bearer [accountId]:[accountKey]", where [accountId] is the account ID and [accountKey] is the account key you will find in the portal

## Common response headers:
- The *MS-CV* header can be used by the product team to trace the call within the service

## Getting a token
Creates a token to be used to access other services.

| URI | Method |
|-----------|:-----------:|
| /accounts/*account ID*/token | GET |

### Responses
| Status code | JSON payload | Comments |
|-----------|:-----------:|:-----------:|
| 200 | - AccessToken: string | Success |

### Examples:
```powershell
PS> [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
PS> $webResponse = Invoke-WebRequest -Uri "https://sts.mixedreality.azure.com/accounts/$accountId/token" -Method Get -ContentType "application/json" -Headers @{ Authorization = "Bearer ${accountId}:$accountKey" }
PS> $webResponse

StatusCode        : 200
StatusDescription : OK
Content           : {"AccessToken":"***********************************************************************************
                    ...
RawContent        : HTTP/1.1 200 OK
                    MS-CV: /DMroLWtg0mqA0cyUriPkQ.0
                    X-Content-Type-Options: nosniff
                    Content-Length: 1200
                    Content-Type: application/json; charset=utf-8
                    Date: Mon, 26 Aug 2019 22:50:21 GMT

                    {"AccessT...
Forms             : {}
Headers           : {[MS-CV, /DMroLWtg0mqA0cyUriPkQ.0], [X-Content-Type-Options, nosniff], [Content-Length, 1200],
                    [Content-Type, application/json; charset=utf-8]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 1200

PS> $response = ConvertFrom-Json -InputObject $webResponse.Content
PS> $token = $response.AccessToken
```
