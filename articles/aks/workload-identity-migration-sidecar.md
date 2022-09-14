---
title: Configure your Azure Kubernetes Service (AKS) cluster with a Workload Identity Sidecar
description: In this Azure Kubernetes Service (AKS) article, you learn how to configure your Azure Kubernetes Service pod to use the Workload Identity Sidecar.
services: container-service
ms.topic: article
ms.date: 09/13/2022
---

# Managed identity with workload identity sidecar

To ensure a smooth transition using the new API and minimize downtime for your applications, there are two pod annotations you use to configure the behavior when exchanging the service account token for an Azure AD access token. They are:

* `azure.workload.identity/inject-proxy-sidecar`
* `azure.workload.identity/proxy-sidecar-port`

The following is an example pod YAML configuration file 
```yml
apiVersion: v1
kind: Pod
metadata:
  name: httpbin-pod
  labels:
    app: httpbin
spec:
  serviceAccountName: workload-identity-sa
  initContainers:
  - name: init-networking
    image: mcr.microsoft.com/oss/azure/workload-identity/proxy-init:v0.13.0
    securityContext:
      capabilities:
        add:
        - NET_ADMIN
        drop:
        - ALL
      privileged: true
      runAsUser: 0
    env:
    - name: PROXY_PORT
      value: "8000"
  containers:
  - name: nginx
    image: nginx:alpine
    ports:
    - containerPort: 80
  - name: proxy
    image: azure.workload.identity/proxy-sidecar-port
    ports:
    - containerPort: 8000
```

## Next steps