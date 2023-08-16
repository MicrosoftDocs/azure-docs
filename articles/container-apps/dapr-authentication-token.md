---
title: Enable token authentication for Dapr requests
description: Learn more about enabling token authentication for Dapr requests to your container app in Azure Container Apps.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: how-to 
ms.date: 05/16/2023
---

# Enable token authentication for Dapr requests

When [Dapr][dapr] is enabled for your application in Azure Container Apps, it injects the environment variable `APP_API_TOKEN` into your app's container. Dapr includes the same token in all requests sent to your app, as either:

- An HTTP header (`dapr-api-token`)
- A gRPC metadata option (`dapr-api-token[0]`)

The token is randomly generated and unique per each app and app revision. It can also change at any time. Your application should read the token from the `APP_API_TOKEN` environment variable when it starts up to ensure that it's using the correct token.

You can use this token to authenticate that calls coming into your application are actually coming from the Dapr sidecar, even when listening on public endpoints.

1. The `daprd` container reads and injects it into each call made from Dapr to your application.
1. Your application can then use that token to validate that the request is coming from Dapr. 

## Prerequisites

[Dapr-enabled Azure Container App][dapr-aca]

## Authenticate requests from Dapr

# [With Dapr SDKs](#tab/sdk)

If you're using a [Dapr SDK](https://docs.dapr.io/developing-applications/sdks/), the Dapr SDKs automatically validates the token in all incoming requests from Dapr, rejecting calls that don't include the correct token. You don't need to perform any other action.

Incoming requests that don't include the token, or include an incorrect token, are rejected automatically.

# [Without an SDK](#tab/nosdk)

If you're not using a Dapr SDK, you need to check the HTTP header or gRPC metadata property in all incoming requests in order to validate that they're created by the Dapr sidecar.

### HTTP

In your code, look for the HTTP header `dapr-api-token` in incoming requests:

```sh
dapr-api-token: <token>
```

### gRPC

When using the gRPC protocol, inspect the incoming calls for the API token on the gRPC metadata:

```sh
dapr-api-token[0]
```

---


## Next steps

[Learn more about the Dapr integration with Azure Container Apps.][dapr-aca]


<!-- Links Internal -->

[dapr-aca]: ./dapr-overview.md

<!-- Links External -->

[dapr]: https://docs.dapr.io/