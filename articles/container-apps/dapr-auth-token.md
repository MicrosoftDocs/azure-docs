---
title: Enable Dapr applications to authenticate requests
description: Learn more about using enabling authentication tokens on your Dapr application in Azure Container Apps.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.topic: how-to 
ms.date: 04/13/2023
---

# Enable Dapr applications to authenticate requests

To enable your Dapr application to authenticate requests arriving from the Dapr sidecar, you can configure Dapr to send an API token. 

When Dapr is enabled in a pod, it generates a 128-bit API token and injects the environment variable `APP_API_TOKEN` into all containers in the pod. The token is unique for each app, app revision, and Dapr version.

When this token is present:

1. The `daprd` container reads and injects it into each call made from Dapr to your application.
1. Your application can then use that token to validate that the request is coming from Dapr. 
   - This requires the user to take action, but the Dapr SDKs can do this automatically if they detect the env var.

This is enabled by default because it should work transparently for users. Dapr will include the token in each request, but then it's up to the user to check it to authenticate the request (or not). As mentioned, if users are using the Dapr SDKs, that should be done automatically.

Also, the token is not persisted anywhere and it's rotated automatically every time a new pod is created; and this is by design.