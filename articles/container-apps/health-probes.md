---
title: Heath probes in Azure Container Apps
description: Check startup, liveness, and readiness with Azure Container Apps health probes
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/30/2022
ms.author: cshoe
---

# Heath probes in Azure Container Apps

Health probes in Azure Container Apps are based on [Kubernetes health probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/). You can set up probes using either TCP or HTTP(S), but `exec` probes aren't supported.

Container Apps support the following probes:

- [Liveness](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-liveness-command): Reports the overall health of your replica.
- [Startup](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes): Delay reporting on a liveness state for slower apps with a startup probe.
- [Readiness](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes): Signals that a replica is ready to accept traffic.

> [!NOTE]
> The referenced Kubernetes documentation often refers to the `kublet` command line tool, which is not available to you in Container Apps. Probes in Container Apps are implemented as either HTTP(S) or TCP endpoints exclusively.

## HTTP probes

HTTP probes allow you to implement custom logic to check the status of application dependencies before reporting a healthy status. Configure your health probe endpoints to respond with an HTTP status code greater than or equal to `200` and less than `400` to indicate success. Any other response code outside this range indicates a failure.

The following example demonstrates how to implement a liveness endpoint in JavaScript.

```javascript
const express = require('express');
const app = express();

app.get('/liveness', (req, res) => {
  let isSystemStable = false;
  
  // check for database availability
  // check filesystem structure
  //  etc.

  // set isSystemStable to true if all checks pass

  if (isSystemStable) {
    res.status(200); // Success
  } else {
    res.status(503); // Service unavailable
  }
})
```

## TCP probes

TCP probes listen for a response from the server. If no response is recognized, then the probe returns a failure.

## Restrictions

- You can only add one of each probe type per container.
- `exec` probes aren't supported.

## Examples

The following code listing shows how you can define health probes for your containers.

The `...` placeholders denote omitted code. Refer to [Container Apps Preview ARM template API specification](./azure-resource-manager-api-spec.md) for full ARM template details.

# [ARM template](#tab/arm-template)

```json
{
  ...
  "containers":[
    {
      "image":"nginx",
      "name":"web",
      "probes": [
        {
          "type": "liveness",
          "httpGet": {
            "path": "/health",
            "port": 8080,
            "httpHeaders": [
              {
                "name": "Custom-Header",
                "value": "liveness probe"
              }],
            "initialDelaySeconds": 7,
            "periodSeconds": 3
          }
        },
        {
          "type": "readiness",
          "tcpSocket": {
            "port": 8081
          },
          "initialDelaySeconds": 10,
          "periodSeconds": 3
        },
        {
          "type": "startup",
          "httpGet": {
            "path": "/startup",
            "port": 8080,
            "httpHeaders": [
              {
                "name": "Custom-Header",
                "value": "startup probe"
              }],
            "initialDelaySeconds": 3,
            "periodSeconds": 3
          }
        }]
    }]
  ...
}
```

# [YAML](#tab/yaml)

```yml
...
containers:
  - image: nginx
    name: web
    probes:
      - type: liveness
        httpGet:
          path: "/health"
          port: 8080
          httpHeaders:
            - name: Custom-Header
              value: liveness probe
          initialDelaySeconds: 7
          periodSeconds: 3
      - type: readiness
        tcpSocket:
          port: 8081
        initialDelaySeconds: 10
        periodSeconds: 3
      - type: startup
        httpGet:
          path: "/startup"
          port: 8080
          httpHeaders:
            - name: Custom-Header
              value: startup probe
          initialDelaySeconds: 3
          periodSeconds: 3
...
```

---

## Next steps

> [!div class="nextstepaction"]
> [Monitor an app](monitor.md)
