---
title: Call a web API from a daemon app - Microsoft identity platform | Azure
description: Learn how to build a daemon app that calls web APIs
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a daemon app that can call web APIs using the Microsoft identity platform for developers.
---

# Daemon app that calls web APIs - call a web API from the app

A daemon app can call a web API from a .NET daemon application or call several pre-approved web APIs.

## Calling a web API daemon application

Here is how to use the token to call an API:

# [.NET](#tab/dotnet)

[!INCLUDE [Call web API in .NET](../../../includes/active-directory-develop-scenarios-call-apis-dotnet.md)]

# [Python](#tab/python)

```Python
endpoint = "url to the API"
http_headers = {'Authorization': 'Bearer ' + result['access_token'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'}
data = requests.get(endpoint, headers=http_headers, stream=False).json()
```

# [Java](#tab/java)

```Java
HttpURLConnection conn = (HttpURLConnection) url.openConnection();

// Set the appropriate header fields in the request header.
conn.setRequestProperty("Authorization", "Bearer " + accessToken);
conn.setRequestProperty("Accept", "application/json");

String response = HttpClientHelper.getResponseStringFromConn(conn);

int responseCode = conn.getResponseCode();
if(responseCode != HttpURLConnection.HTTP_OK) {
    throw new IOException(response);
}

JSONObject responseObject = HttpClientHelper.processResponse(responseCode, response);
```

---

## Calling several APIs

For daemon apps, the web APIs that you call need to be pre-approved. There won't be any incremental consent with daemon apps (there's no user interaction). The tenant admin needs to pre-consent the application and all the API permissions. If you want to call several APIs, you'll need to acquire a token for each resource, each time calling `AcquireTokenForClient`. MSAL will use the application token cache to avoid unnecessary service calls.

## Next steps

# [.NET](#tab/dotnet)

> [!div class="nextstepaction"]
> [Daemon app - move to production](https://docs.microsoft.com/azure/active-directory/develop/scenario-daemon-production?tabs=dotnet)

# [Python](#tab/python)

> [!div class="nextstepaction"]
> [Daemon app - move to production](https://docs.microsoft.com/azure/active-directory/develop/scenario-daemon-production?tabs=python)

# [Java](#tab/java)

> [!div class="nextstepaction"]
> [Daemon app - move to production](https://docs.microsoft.com/azure/active-directory/develop/scenario-daemon-production?tabs=java)

---
