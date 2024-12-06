---
title: Add health probes to your AKS pods
description: This article provides information on how to add readiness or liveness health probes to AKS pods by using Application Gateway. 
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 9/17/2024
ms.author: greglin
---

# Add health probes to your AKS pods

By default, the Application Gateway Ingress Controller (AGIC) provisions an HTTP `GET` probe for exposed Azure Kubernetes Service (AKS) pods. You can customize the probe properties by adding a [readiness or liveness probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) to your deployment or pod specification.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution. For more information, see [Custom health probe for Application Gateway for Containers](for-containers/custom-health-probe.md).

## Code for adding a readiness or liveness probe

```yaml
apiVersion: networking.k8s.io/v1
kind: Deployment
metadata:
  name: aspnetapp
spec:
  replicas: 3
  template:
    metadata:
      labels:
        service: site
    spec:
      containers:
      - name: aspnetapp
        image: mcr.microsoft.com/dotnet/samples:aspnetapp
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
          periodSeconds: 3
          timeoutSeconds: 1
```

For more information, see the [Kubernetes API reference](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#httpgetaction-v1-core).

> [!NOTE]
> - `readinessProbe` and `livenessProbe` are supported when you configure them with `httpGet`.
> - Probing on a port other than the one exposed on the pod is currently not supported.
> - `HttpHeaders`, `InitialDelaySeconds`, and `SuccessThreshold` aren't supported.

If the code doesn't include a readiness or liveness probe, the ingress controller makes an assumption that the service is reachable on either:

- The `Path` value that's specified for `backend-path-prefix` annotation
- The `path` value that's specified in the `ingress` definition for the service

## Default values for the health probe

Any property that the readiness or liveness probe can't infer uses the following default values.

| Application Gateway probe property | Default value |
|-|-|
| `Path` | `/` |
| `Host` | `localhost` |
| `Protocol` | `HTTP` |
| `Timeout` | `30` |
| `Interval` | `30` |
| `UnhealthyThreshold` | `3` |

## Related content

- [Application Gateway for Containers](for-containers/overview.md)
