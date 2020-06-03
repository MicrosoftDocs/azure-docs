---
title: The session management REST API
description: Describes how to manage sessions
author: florianborn71
ms.author: flborn
ms.date: 02/11/2020
ms.topic: article
---

# Use the session management REST API

To use Azure Remote Rendering functionality, you need to create a *session*. Each session corresponds to a virtual machine (VM) being allocated in Azure and waiting for a client device to connect. When a device connects, the VM renders the requested data and serves the result as a video stream. During session creation, you chose which kind of server you want to run on, which determines pricing. Once the session is not needed anymore, it should be stopped. If not stopped manually, it will be shut down automatically when the session's *lease time* expires.

We provide a PowerShell script in the [ARR samples repository](https://github.com/Azure/azure-remote-rendering) in the *Scripts* folder, called *RenderingSession.ps1*, which demonstrates the use of our service. The script and its configuration are described here: [Example PowerShell scripts](../samples/powershell-example-scripts.md)

> [!TIP]
> The PowerShell commands listed on this page are meant to complement each other. If you run all scripts in sequence within the same PowerShell command prompt, they will build on top of each other.

## Regions

See the [list of available regions](../reference/regions.md) for the base URLs to send the requests to.

For the sample scripts below we chose the region *westus2*.

### Example script: Choose an endpoint

```PowerShell
$endPoint = "https://remoterendering.westus2.mixedreality.azure.com"
```

## Accounts

If you don't have a Remote Rendering account, [create one](create-an-account.md). Each resource is identified by an *accountId*, which is used throughout the session APIs.

### Example script: Set accountId and accountKey

```PowerShell
$accountId = "********-****-****-****-************"
$accountKey = "*******************************************="
```

## Common request headers

* The *Authorization* header must have the value of "`Bearer TOKEN`", where "`TOKEN`" is the authentication token [returned by the Secure Token Service](tokens.md).

### Example script: Request a token

```PowerShell
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
$webResponse = Invoke-WebRequest -Uri "https://sts.mixedreality.azure.com/accounts/$accountId/token" -Method Get -ContentType "application/json" -Headers @{ Authorization = "Bearer ${accountId}:$accountKey" }
$response = ConvertFrom-Json -InputObject $webResponse.Content
$token = $response.AccessToken;
```

## Common response headers

* The *MS-CV* header can be used by the product team to trace the call within the service.

## Create a session

This command creates a session. It returns the ID of the new session. You need the session ID for all other commands.

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*accountId*/sessions/create | POST |

**Request body:**

* maxLeaseTime (timespan): a timeout value when the VM will be decommissioned automatically
* models (array): asset container URLs to preload
* size (string): the VM size (**"standard"** or **"premium"**). See specific [VM size limitations](../reference/limits.md#overall-number-of-polygons).

**Responses:**

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 202 | - sessionId: GUID | Success |

### Example script: Create a session

```PowerShell
Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions/create" -Method Post -ContentType "application/json" -Body "{ 'maxLeaseTime': '4:0:0', 'models': [], 'size': 'standard' }" -Headers @{ Authorization = "Bearer $token" }
```

Example output:

```PowerShell
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

### Example script: Store sessionId

The response from the request above includes a **sessionId**, which you need for all followup requests.

```PowerShell
$sessionId = "d31bddca-dab7-498e-9bc9-7594bc12862f"
```

## Update a session

This command updates a session's parameters. Currently you can only extend the lease time of a session.

> [!IMPORTANT]
> The lease time is always given as a total time since the session's beginning. That means if you created a session with a lease time of one hour, and you want to extend its lease time for another hour, you have to update its maxLeaseTime to two hours.

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*accountID*/sessions/*sessionId* | PATCH |

**Request body:**

* maxLeaseTime (timespan): a timeout value when the VM will be decommissioned automatically

**Responses:**

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 200 | | Success |

### Example script: Update a session

```PowerShell
Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions/$sessionId" -Method Patch -ContentType "application/json" -Body "{ 'maxLeaseTime': '5:0:0' }" -Headers @{ Authorization = "Bearer $token" }
```

Example output:

```PowerShell
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

## Get active sessions

This command returns a list of active sessions.

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*accountId*/sessions | GET |

**Responses:**

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 200 | - sessions: array of session properties | see "Get session properties" section for a description of session properties |

### Example script: Query active sessions

```PowerShell
Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions" -Method Get -Headers @{ Authorization = "Bearer $token" }
```

Example output:

```PowerShell
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

This command returns information about a session, such as its VM hostname.

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*accountId*/sessions/*sessionId*/properties | GET |

**Responses:**

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 200 | - message: string<br/>- sessionElapsedTime: timespan<br/>- sessionHostname: string<br/>- sessionId: string<br/>- sessionMaxLeaseTime: timespan<br/>- sessionSize: enum<br/>- sessionStatus: enum | enum sessionStatus { starting, ready, stopping, stopped, expired, error}<br/>If the status is 'error' or 'expired', the message will contain more information |

### Example script: Get session properties

```PowerShell
Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions/$sessionId/properties" -Method Get -Headers @{ Authorization = "Bearer $token" }
```

Example output:

```PowerShell
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

This command stops a session. The allocated VM will be reclaimed shortly after.

| URI | Method |
|-----------|:-----------|
| /v1/accounts/*accountId*/sessions/*sessionId* | DELETE |

**Responses:**

| Status code | JSON payload | Comments |
|-----------|:-----------|:-----------|
| 204 | | Success |

### Example script: Stop a session

```PowerShell
Invoke-WebRequest -Uri "$endPoint/v1/accounts/$accountId/sessions/$sessionId" -Method Delete -Headers @{ Authorization = "Bearer $token" }
```

Example output:

```PowerShell
StatusCode        : 204
StatusDescription : No Content
Content           : {}
RawContent        : HTTP/1.1 204 No Content
                    MS-CV: YDxR5/7+K0KstH54WG443w.0
                    Date: Thu, 09 May 2019 16:45:41 GMT


Headers           : {[MS-CV, YDxR5/7+K0KstH54WG443w.0], [Date, Thu, 09 May 2019 16:45:41 GMT]}
RawContentLength  : 0
```

## Next steps

* [Example PowerShell scripts](../samples/powershell-example-scripts.md)
