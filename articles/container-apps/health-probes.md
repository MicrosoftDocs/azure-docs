---
title: Health probes in Azure Container Apps
description: Check startup, liveness, and readiness with Azure Container Apps health probes
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022, ignite-2022
ms.topic: conceptual
ms.date: 10/28/2022
ms.author: cshoe
---

# Health probes in Azure Container Apps

Health probes in Azure Container Apps are based on [Kubernetes health probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/). You can set up probes using either TCP or HTTP(S) exclusively.

Container Apps support the following probes:

- **Liveness**: Reports the overall health of your replica.
- **Readiness**: Signals that a replica is ready to accept traffic.
- **Startup**: Delay reporting on a liveness or readiness state for slower apps with a startup probe.


For a full listing of the specification supported in Azure Container Apps, refer to [Azure REST API specs](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/app/resource-manager/Microsoft.App/stable/2022-03-01/CommonDefinitions.json#L119-L236).

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

The `...` placeholders denote omitted code. Refer to [Container Apps ARM template API specification](./azure-resource-manager-api-spec.md) for full ARM template details.

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

The optional `failureThreshold` setting defines the number of attempts Container Apps tries if the probe if execution fails. Attempts that exceed the `failureThreshold` amount cause different results for each probe.

## Default configuration

If ingress is enabled, the following default probes are automatically added to the main app container if none is defined for each type.

| Probe type | Default values |
| -- | -- |
| Startup | Protocol: TCP<br>Port: ingress target port<br>Timeout: 1 second<br>Period: 1 second<br>Initial delay: 1 second<br>Success threshold: 1<br>Failure threshold: `timeoutSeconds` |
| Readiness | Protocol: TCP<br>Port: ingress target port<br>Timeout: 5 seconds<br>Period: 5 seconds<br>Initial delay: 3 seconds<br>Success threshold: 1<br>Failure threshold: `timeoutSeconds / 5` |
| Liveness | Protocol: TCP<br>Port: ingress target port |

If your app takes an extended amount of time to start, which is very common in Java, you often need to customize the probes so your container won't crash.

The following example demonstrates how to configure the liveness and readiness probes in order to extend the startup times.

```json
"probes": [
       {
        "type": "liveness",
        "failureThreshold": 3,
        "periodSeconds": 10,
        "successThreshold": 1,
        "tcpSocket": {
          "port": 80
        },
        "timeoutSeconds": 1
       },
       {
         "type": "readiness",
         "failureThreshold": 48,
         "initialDelaySeconds": 3,
         "periodSeconds": 5,
         "successThreshold": 1,
         "tcpSocket": {
           "port": 80
          },
          "timeoutSeconds": 5
       }
```

## Next steps

> [!div class="nextstepaction"]
> [Application logging](logging.md)
