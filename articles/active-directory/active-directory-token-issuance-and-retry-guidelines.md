<properties
	pageTitle="Token Issuance and Retry Guidelines | Microsoft Azure"
	description="Token Issuance and Retry Guildelines"
	services="active-directory"
	documentationCenter=".net"
	authors="priyamohanram"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="01/21/2016"
	ms.author="priyamo"/>

# Token Issuance and Retry Guildelines

Azure Active Directory supports several token issuance endpoints that clients can query. This article defines guidelines for implementing retry logic for these endpoints to handle an unexpected network or server failure.

## Error-Handling Scenarios

Failures that respond to retries typically return an HTTP 500-series error codes for a request to an Azure AD endpoint. In some scenarios, the client is an application or service that makes automated requests to Azure AD. In other scenarios, such as web-based federation that uses the WS-Federation protocol, the client is a web browser and the end-user must retry manually.

## Retry guidelines

### Implement retry logic based on HTTP 500-series error responses

Retry logic is strongly recommended when Active Directory Access Control Service (ACS) returns HTTP 500-series errors. This includes:

- HTTP Error 500 - Internal Server error
- HTTP Error 502 - Bad Gateway
- HTTP Error 503 - Service unavailable
- HTTP Error 504 - Gateway Timeout

Although individual HTTP codes can be listed explicitly in the retry logic, it is sufficient to invoke retry logic if any HTTP 500-series error is returned.

Typically, retry logic is not recommended when HTTP 400-series error codes are returned. A 400-series HTTP error response code from ACS means the request is invalid and needs to be revised.

Retry logic should be triggered by HTTP error codes, such as HTTP 504 (External server timeout) or the HTTP 500 error code series, and not by ACS error codes, such as ACS90005. ACS error codes are informational and subject to change.

### Retries should use a back-off timer for optimal flow control

When a client receives an HTTP 500-series error, the client should wait before retrying the request. For best results, it is recommended that this period of time increase with each subsequent retry. This approach allows transient errors to be resolved quickly while optimizing the request rate for transient network or server issues that take longer to resolve.

For example, use an exponential back-off timer where the delay before retry increases exponentially with each instance, such as Retry 1: 1 second, Retry 2: 2 seconds, Retry 3: 4 seconds, and so on.

Adjust the number of retries and the time between each retry based on your user experience requirements. However, we recommend up to five retries over a period of five minutes. Failures caused by a timeout take longer to resolve.
