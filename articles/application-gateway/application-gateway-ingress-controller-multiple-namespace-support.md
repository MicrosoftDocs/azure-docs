---
title: Enabling multiple namespace support for Application Gateway Ingress Controller
description: This article provides information on how to enable multiple namespace support in a Kubernetes cluster with an Application Gateway Ingress Controller. 
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 10/23/2019
ms.author: caya
---

# Enabling multiple Namespace support in an AKS cluster with Application Gateway Ingress Controller

#### Motivation
Kubernetes [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
make it possible for a Kubernetes cluster to be partitioned and allocated to
sub-groups of a larger team. These sub-teams can then deploy and manage
infrastructure with finer controls of resources, security, configuration etc.
Kubernetes allows for one or more ingress resources to be defined independently
within each namespace.

As of version 0.7 [Azure Application Gateway Kubernetes
IngressController](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/master/README.md)
(AGIC) can ingest events from and observe multiple namespaces. Should the AKS
administrator decide to use [App
Gateway](https://azure.microsoft.com/services/application-gateway/) as an
ingress, all namespaces will use the same instance of Application Gateway. A single
installation of Ingress Controller will monitor accessible namespaces and will
configure the Application Gateway it is associated with.

Version 0.7 of AGIC will continue to exclusively observe the `default`
namespace, unless this is explicitly changed to one or more different
namespaces in the Helm configuration (see section below).

#### Enable multiple namespace support
To enable multiple namespace support:
1. modify the [helm-config.yaml](../examples/sample-helm-config.yaml) file in one of the following ways:
   - delete the `watchNamespace` key entirely from [helm-config.yaml](../examples/sample-helm-config.yaml) - AGIC will observe all namespaces
   - set `watchNamespace` to an empty string - AGIC will observe all namespaces
   - add multiple namespaces separated by a comma (`watchNamespace: default,secondNamespace`) - AGIC will observe these namespaces exclusively
2. apply  Helm template changes with: `helm install -f helm-config.yaml application-gateway-kubernetes-ingress/ingress-azure`

Once deployed with the ability to observe multiple namespaces, AGIC will:
  - list ingress resources from all accessible namespaces
  - filter to ingress resources annotated with `kubernetes.io/ingress.class: azure/application-gateway`
  - compose combined [Application Gateway config](https://github.com/Azure/azure-sdk-for-go/blob/37f3f4162dfce955ef5225ead57216cf8c1b2c70/services/network/mgmt/2016-06-01/network/models.go#L1710-L1744)
  - apply the config to the associated Application Gateway via [ARM](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview)

#### Conflicting Configurations
Multiple namespaced [ingress resources](https://kubernetes.io/docs/concepts/services-networking/ingress/#the-ingress-resource)
could instruct AGIC to create conflicting configurations for a single Application Gateway. (Two ingresses claiming the same
domain for instance.)

At the top of the hierarchy - **listeners** (IP address, port, and host) and **routing rules** (binding listener,
backend pool and HTTP settings) could be created and shared by multiple namespaces/ingresses.

On the other hand - paths, backend pools, HTTP settings, and TLS certificates could be created by one namespace only
and duplicates will removed..

For example, consider the following duplicate ingress resources defined
namespaces `staging` and `production` for `www.contoso.com`:
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: websocket-ingress
  namespace: staging
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
spec:
  rules:
    - host: www.contoso.com
      http:
        paths:
          - backend:
              serviceName: web-service
              servicePort: 80
```

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: websocket-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
spec:
  rules:
    - host: www.contoso.com
      http:
        paths:
          - backend:
              serviceName: web-service
              servicePort: 80
```

Despite the two ingress resources demanding traffic for `www.contoso.com` to be
routed to the respective Kubernetes namespaces, only one backend can service
the traffic. AGIC would create a configuration on "first come, first served"
basis for one of the resources. If two ingresses resources are created at the
same time, the one earlier in the alphabet will take
precedence. From the example above we will only be able to create settings for
the `production` ingress. Application Gateway will be configured with the following
resources:

  - Listener: `fl-www.contoso.com-80`
  - Routing Rule: `rr-www.contoso.com-80`
  - Backend Pool: `pool-production-contoso-web-service-80-bp-80`
  - HTTP Settings: `bp-production-contoso-web-service-80-80-websocket-ingress`
  - Health Probe: `pb-production-contoso-web-service-80-websocket-ingress`

Note that except for *listener* and *routing rule*, the Application Gateway resources created include the name
of the namespace (`production`) for which they were created.

If the two ingress resources are introduced into the AKS cluster at different
points in time, it is likely for AGIC to end up in a scenario where it
reconfigures Application Gateway and re-routes traffic from `namespace-B` to
`namespace-A`.

For example if you added `staging` first, AGIC will configure App Gwy to route
traffic to the staging backend pool. At a later stage, introducing `production`
ingress, will cause AGIC to reprogram App Gwy, which will start routing traffic
to the `production` backend pool.

#### Restricting Access to Namespaces
By default AGIC will configure Application Gateway based on annotated Ingress within
any namespace. Should you want to limit this behaviour you have the following
options:
  - limit the namespaces, by explicitly defining namespaces AGIC should observe via the `watchNamespace` YAML key in [helm-config.yaml](../examples/sample-helm-config.yaml)
  - use [Role/RoleBinding](https://docs.microsoft.com/azure/aks/azure-ad-rbac) to limit AGIC to specific namespaces

