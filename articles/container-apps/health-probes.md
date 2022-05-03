---
title: Health probes in Azure Container Apps
description: Check startup, liveness, and readiness with Azure Container Apps health probes
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/30/2022
ms.author: cshoe
---

# Health probes in Azure Container Apps

Health probes in Azure Container Apps are based on [Kubernetes health probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/). You can set up probes using either TCP or HTTP(S) exclusively.

Container Apps support the following probes:

- [Liveness](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-liveness-command): Reports the overall health of your replica.
- [Startup](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes): Delay reporting on a liveness or readiness state for slower apps with a startup probe.
- [Readiness](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes): Signals that a replica is ready to accept traffic.

For a full listing of the specification supported in Azure Container Apps, refer to [Azure Rest API specs](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/app/resource-manager/Microsoft.App/stable/2022-03-01/CommonDefinitions.json#L119-L236).

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

TCP probes wait for a connection to be established with the server to indicate success. A probe failure is registered if no connection is made.

## Restrictions

- You can only add one of each probe type per container.
- `exec` probes aren't supported.
- Port values must be integers; named ports aren't supported.
- gRPC is not supported.

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
              }]
          },
          "initialDelaySeconds": 7,
          "periodSeconds": 3
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
              }]
          },
          "initialDelaySeconds": 3,
          "periodSeconds": 3
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
              value: "liveness probe"
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
              value: "startup probe"
        initialDelaySeconds: 3
        periodSeconds: 3
...
```

---

The optional [failureThreshold](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) setting defines the number of attempts Kubernetes tries if the probe if execution fails. Attempts that exceed the `failureThreshold` amount cause different results for each probe. Refer to [Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) for details.

## Next steps

> [!div class="nextstepaction"]
> [Monitor an app](monitor.md)
