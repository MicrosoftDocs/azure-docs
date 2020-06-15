---
title: Add health probes to your AKS pods
description: This article provides information on how to add health probes (readiness and/or liveness) to AKS pods with an Application Gateway. 
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 11/4/2019
ms.author: caya
---

# Add Health Probes to your service
By default, Ingress controller will provision an HTTP GET probe for the exposed pods.
The probe properties can be customized by adding a [Readiness or Liveness Probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) to your `deployment`/`pod` spec.

## With `readinessProbe` or `livenessProbe`
```yaml
apiVersion: extensions/v1beta1
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
        image: mcr.microsoft.com/dotnet/core/samples:aspnetapp
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
* [Container Probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
* [HttpGet Action](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#httpgetaction-v1-core)

> [!NOTE]
> * `readinessProbe` and `livenessProbe` are supported when configured with `httpGet`.
> * Probing on a port other than the one exposed on the pod is currently not supported.
> * `HttpHeaders`, `InitialDelaySeconds`, `SuccessThreshold` are not supported.

##  Without `readinessProbe` or `livenessProbe`
If the above probes are not provided, then Ingress Controller make an assumption that the service is reachable on `Path` specified for `backend-path-prefix` annotation or the `path` specified in the `ingress` definition for the service.

## Default Values for Health Probe
For any property that can not be inferred by the readiness/liveness probe, Default values are set.

| Application Gateway Probe Property | Default Value |
|-|-|
| `Path` | / |
| `Host` | localhost |
| `Protocol` | HTTP |
| `Timeout` | 30 |
| `Interval` | 30 |
| `UnhealthyThreshold` | 3 |