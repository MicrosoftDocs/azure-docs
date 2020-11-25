---
author: mmacy
ms.author: marsma
ms.date: 11/25/2020
ms.service: active-directory
ms.subservice: develop
ms.topic: include
# Purpose:
# Ingested by Microsoft identity platform articles in /articles/active-directory/develop/* that document the error handling retries for the different platforms.
#
# Usage:
# Paste the below (without the hashtags) into your article.
#
# 
#[!INCLUDE [PREVIEW BOILERPLATE](../../../includes/active-directory-develop-error-handling-retries.md)]
#

---
## Retrying after errors and exceptions

You're expected to implement your own retry policies when calling MSAL. MSAL makes HTTP calls to the Azure AD service, and occasionally failures can occur. For example the network can go down or the server is overloaded.  

### HTTP error codes 500-600

MSAL.NET implements a simple retry-once mechanism for errors with HTTP error codes 500-600.

### HTTP 429

When the Service Token Server (STS) is overloaded with too many requests, it returns HTTP error 429 with a hint about how long until you can try again in the `Retry-After` response field.