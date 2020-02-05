---
title: The session management REST API
description: Describes how to manage sessions
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: article
ms.service: azure-remote-rendering
---

# The session management REST API

Once an asset has been converted, a session should be created to render it. The creation will allocate a virtual machine (VM) with a public IP a client can connect to. Once the VM is not needed anymore, the session must be stopped to free up resources.

We provide a PowerShell script which demonstrates the use of our service.
The RenderingSession.ps1 can be found in the Scripts directory of the arrclient repo.

The script and its configuration are described here: [Example PowerShell scripts](../samples/powershell-example-scripts.md)

## Environments

| Environment | Base URL |
|-----------|:-----------|
| Production West US 2 | https://remoterendering.westus2.mixedreality.azure.com |
| Production West Europe | https://remoterendering.westeurope.mixedreality.azure.com |

Example:

```powershell
PS> $endPoint = "https://remoterendering.westus2.mixedreality.azure.com"
```

## Accounts

If you don't have a Remote Rendering account, [create one](create-an-account.md). Each resource is identified by an *account ID* and the *account ID* is used throughout the session APIs.

### Examples

```powershell
PS> $accountId = "********-****-****-****-************"
PS> $accountKey = "*******************************************="
```

## Common request headers

- The *Authorization* header must have the value of "Bearer [token]", where [token] is the authentication token returned by the Secure Token Service, see [getting a token](tokens.md).

```powershell
PS> [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
PS> $webResponse = Invoke-WebRequest -Uri "https://sts.mixedreality.azure.com/accounts/$accountId/token" -Method Get -ContentType "application/json" -Headers @{ Authorization = "Bearer ${accountId}:$accountKey" }
PS> $response = ConvertFrom-Json -InputObject $webResponse.Content
PS> $token = $response.AccessToken;
```

## Common response headers

- The *MS-CV* header can be used by the product team to trace the call within the service

## Creating a session

Creates a session by allocating a VM. Returns the ID of the session created.

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*account ID*/sessions/create | POST |

### Request body

- maxLeaseTime (timespan): a timeout value when the VM will be decommissioned automatically
- models (array): asset containers URLs to preload
- size (string): the VM size (for example "small", "big")

### Responses

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 202 | - session ID: GUID | Success |

### Examples

```powershell
PS> Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions/create" -Method Post -ContentType "application/json" -Body "{ 'maxLeaseTime': '4:0:0', 'models': [], 'size': 'small' }" -Headers @{ Authorization = "Bearer $token" }


StatusCode        : 202
StatusDescription : Accepted
Content           : {"sessionId":"d31bddca-dab7-498e-9bc9-7594bc12862f"}
RawContent        : HTTP/1.1 202 Accepted
                    MS-CV: 5EqPJ1VdTUakDJZc6/ZhTg.0
                    Content-Length: 52
                    Content-Type: application/json; charset=utf-8
                    Date: Thu, 09 May 2019 16:17:50 GMT
                    Location: accounts/11111111-1111-1111-11...
Forms             : {}
Headers           : {[MS-CV, 5EqPJ1VdTUakDJZc6/ZhTg.0], [Content-Length, 52], [Content-Type, application/json;
                    charset=utf-8], [Date, Thu, 09 May 2019 16:17:50 GMT]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 52
```

Use the *session ID* to get properties of a session and stop a session.

```powershell
PS> $sessionId = "d31bddca-dab7-498e-9bc9-7594bc12862f"
```

## Updating a session

Updates the session parameters. Currently you can only extend a lease. The session is identified by its ID (returned by the service when the session is created).

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*account ID*/sessions/*session ID* | PATCH |

### Request body

- maxLeaseTime (timespan): a timeout value when the VM will be decommissioned automatically

### Responses

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 200 | | Success |

### Examples

```powershell
PS> Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions/$sessionId" -Method Patch -ContentType "application/json" -Body "{ 'maxLeaseTime': '5:0:0' }" -Headers @{ Authorization = "Bearer $token" }


StatusCode        : 200
StatusDescription : OK
Content           : {}
RawContent        : HTTP/1.1 200 OK
                    MS-CV: Fe+yXCJumky82wuoedzDTA.0
                    Content-Length: 0
                    Date: Thu, 09 May 2019 16:27:31 GMT


Headers           : {[MS-CV, Fe+yXCJumky82wuoedzDTA.0], [Content-Length, 0], [Date, Thu, 09 May 2019 16:27:31 GMT]}
RawContentLength  : 0
```

## Get current sessions

Provides a list of current sessions

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*account ID*/sessions | GET |

### Responses

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 200 | - sessions: array of session properties | see "Get session properties" section for a description of session properties |

### Examples

```powershell
PS> Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions" -Method Get -Headers @{ Authorization = "Bearer $token" }


StatusCode        : 200
StatusDescription : OK
Content           : []
RawContent        : HTTP/1.1 200 OK
                    MS-CV: WfB9Cs5YeE6S28qYkp7Bhw.1
                    Content-Length: 15
                    Content-Type: application/json; charset=utf-8
                    Date: Thu, 25 Jul 2019 16:23:50 GMT

                    {"sessions":[]}
Forms             : {}
Headers           : {[MS-CV, WfB9Cs5YeE6S28qYkp7Bhw.1], [Content-Length, 2], [Content-Type, application/json;
                    charset=utf-8], [Date, Thu, 25 Jul 2019 16:23:50 GMT]}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 2
```

## Get sessions properties

Provides information about the session (VM hostname, etc.). The session is identified by its ID (returned by the service when the session is created).

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*account ID*/sessions/*session ID*/properties | GET |

### Responses

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 200 | - message: string<br/>- sessionElapsedTime: timespan<br/>- sessionHostname: string<br/>- sessionId: string<br/>- sessionMaxLeaseTime: timespan<br/>- sessionSize: enum<br/>- sessionStatus: enum | enum sessionStatus { starting, ready, stopping, stopped, expired, error}<br/>If the status is 'error' or 'expired', the message will contain more information |

### Examples

```powershell
PS> Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions/$sessionId/properties" -Method Get -Headers @{ Authorization = "Bearer $token" }


StatusCode        : 200
StatusDescription : OK
Content           : {"message":null,"sessionElapsedTime":"00:00:01","sessionHostname":"5018fee8-817e-4366-9179-556af79a4240.remoterenderingvm.westeurope.mixedreality.azure.com","sessionId":"e13d2c44-63e0-4591-991e-f9e05e599a93","sessionMaxLeaseTime":"04:00:00","sessionStatus":"Ready"}
RawContent        : HTTP/1.1 200 OK
                    MS-CV: CMXegpZRMECH4pbOW2j5GA.0
                    Content-Length: 60
                    Content-Type: application/json; charset=utf-8
                    Date: Thu, 09 May 2019 16:30:38 GMT

                    {"message":null,...
Forms             : {}
Headers           : {[MS-CV, CMXegpZRMECH4pbOW2j5GA.0], [Content-Length, 60], [Content-Type, application/json;
                    charset=utf-8], [Date, Thu, 09 May 2019 16:30:38 GMT]}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 60
```

## Stop a session

Stops a session and reclaims resources. The session is identified by its ID (returned by the service when the session is created).

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*account ID*/sessions/*session ID* | DELETE |

### Responses

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 204 | | Success |

### Examples

```powershell
PS> Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions/$sessionId" -Method Delete -Headers @{ Authorization = "Bearer $token" }


StatusCode        : 204
StatusDescription : No Content
Content           : {}
RawContent        : HTTP/1.1 204 No Content
                    MS-CV: YDxR5/7+K0KstH54WG443w.0
                    Date: Thu, 09 May 2019 16:45:41 GMT


Headers           : {[MS-CV, YDxR5/7+K0KstH54WG443w.0], [Date, Thu, 09 May 2019 16:45:41 GMT]}
RawContentLength  : 0
```
