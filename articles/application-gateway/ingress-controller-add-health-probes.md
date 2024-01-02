---
title: Add health probes to your AKS pods
description: This article provides information on how to add health probes (readiness and/or liveness) to AKS pods with an Application Gateway. 
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 06/10/2022
ms.author: greglin
---

# Add Health Probes to your service
By default, Ingress controller will provision an HTTP GET probe for the exposed pods.
The probe properties can be customized by adding a [Readiness or Liveness Probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) to your `deployment`/`pod` spec.

## With `readinessProbe` or `livenessProbe`
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

Kubernetes API Reference:
* [Container Probes](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#httpgetaction-v1-core)

> [!NOTE]
> * `readinessProbe` and `livenessProbe` are supported when configured with `httpGet`.
> * Probing on a port other than the one exposed on the pod is currently not supported.
> * `HttpHeaders`, `InitialDelaySeconds`, `SuccessThreshold` aren't supported.

##  Without `readinessProbe` or `livenessProbe`
If the above probes aren't provided, then the Ingress Controller makes an assumption that the service is reachable on the `Path` specified for `backend-path-prefix` annotation, or the `path` specified in the `ingress` definition for the service.

## Default Values for Health Probe
For any property that can't be inferred by the readiness/liveness probe, default values are set.

| Application Gateway Probe Property | Default Value |
|-|-|
| `Path` | / |
| `Host` | localhost |
| `Protocol` | HTTP |
| `Timeout` | 30 |
| `Interval` | 30 |
| `UnhealthyThreshold` | 3 |
