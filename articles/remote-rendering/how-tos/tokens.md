---
title: Get service access tokens
description: Describes how to create tokens for accessing the ARR REST APIs
author: florianborn71
ms.author: flborn
ms.date: 02/11/2020
ms.topic: how-to
---

# Get service access tokens

Access to the ARR REST APIs is only granted for authorized users. To prove your authorization, you must send an *access token* along with REST requests. These tokens are issued by the *Secure Token Service* (STS) in exchange for an account key. Tokens have a **lifetime of 24 hours** and thus can be issued to users without giving them full access to the service.

This article describes how to create such access token.

## Prerequisites

[Create an ARR account](create-an-account.md), if you don't have one yet.

## Token service REST API

To create access tokens, the *Secure Token Service* provides a single REST API. The URL for the ARR STS service is https:\//sts.mixedreality.azure.com.

### 'Get token' request

| URI | Method |
|-----------|:-----------|
| /accounts/**accountId**/token | GET |

| Header | Value |
|--------|:------|
| Authorization | "Bearer **accountId**:**accountKey**" |

Replace *accountId* and *accountKey* with your respective data.

### 'Get token' response

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 200 | AccessToken: string | Success |

| Header | Purpose |
|--------|:------|
| MS-CV | This value can be used to trace the call within the service |

## Getting a token using PowerShell

The PowerShell code below demonstrates how to send the necessary REST request to the STS. It then prints the token to the PowerShell prompt.

```PowerShell
$accountId = "<account_id_from_portal>"
$accountKey = "<account_key_from_portal>"

[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12;
$webResponse = Invoke-WebRequest -Uri "https://sts.mixedreality.azure.com/accounts/$accountId/token" -Method Get -Headers @{ Authorization = "Bearer ${accountId}:$accountKey" }
$response = ConvertFrom-Json -InputObject $webResponse.Content

Write-Output "Token: $($response.AccessToken)"
```

The script just prints the token to the output, from where you can copy & paste it. For a real project, you should automate this process.

## Next steps

* [Example PowerShell scripts](../samples/powershell-example-scripts.md)
* [Azure Frontend APIs](../how-tos/frontend-apis.md)
* [Session management REST API](../how-tos/session-rest-api.md)
