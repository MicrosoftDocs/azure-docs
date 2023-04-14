---
title: Enable token authentication for Dapr requests
description: Learn more about enabling token authentication for Dapr requests to your container app in Azure Container Apps.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: how-to 
ms.date: 04/14/2023
---

# Enable token authentication for Dapr requests

To enable your [Dapr application][dapr] to authenticate requests arriving from the Dapr sidecar, you can configure Dapr to send an API token. 

By default, when Dapr is enabled in a pod, it generates a 128-bit API token and injects the environment variable `APP_API_TOKEN` into all containers in the pod. The token is included as either:
- An HTTP header, or
- gRPC metadata

The token is unique for each app, app revision, and Dapr version. When this token is present:

1. The `daprd` container reads and injects it into each call made from Dapr to your application.
1. Your application can then use that token to validate that the request is coming from Dapr. 
   - If using an SDK: The Dapr SDKs do this automatically if they detect the environment variable.
   - If not using an SDK: This requires the user to take action, but 

In addition, the token is not persisted anywhere and is rotated automatically every time a new pod is created.

## Prerequisites

[Dapr-enabled Azure Container App][dapr-aca]

## Authenticate requests from Dapr

# [With Dapr SDKs](#tab/sdk)

If you're using the Dapr SDKs, your container app is already authenticating requests from Dapr.

# [Without an SDK](#tab/nosdk)

If you're not using the Dapr SDKs and want to validate that the requests come from Dapr, check the HTTP header or gRPC metadata property.

### HTTP

In your code, look for the HTTP header `dapr-api-token` in incoming requests:

```sh
dapr-api-token: <token>
```

### gRPC

When using gRPC protocol, inspect the incoming calls for the API token on the gRPC metadata:

```sh
dapr-api-token[0].
```

---


## Next steps

[Learn more about the Dapr integration with Azure Container Apps.][dapr-aca]


<!-- Links Internal -->

[dapr-aca]: ./dapr-overview.md

<!-- Links External -->

[dapr]: https://docs.dapr.io/