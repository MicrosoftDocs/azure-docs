---
title: Enable multiple namespace supports for Application Gateway Ingress Controller
description: This article provides information on how to enable multiple namespace support in a Kubernetes cluster with an Application Gateway Ingress Controller. 
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: how-to
ms.date: 11/4/2019
ms.author: caya
---

# Enable multiple Namespace support in an AKS cluster with Application Gateway Ingress Controller

## Motivation
Kubernetes [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
make it possible for a Kubernetes cluster to be partitioned and allocated to
subgroups of a larger team. These subteams can then deploy and manage
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

## Enable multiple namespace support
To enable multiple namespace support:
1. modify the [helm-config.yaml](#sample-helm-config-file) file in one of the following ways:
   - delete the `watchNamespace` key entirely from [helm-config.yaml](#sample-helm-config-file) - AGIC will observe all namespaces
   - set `watchNamespace` to an empty string - AGIC will observe all namespaces
   - add multiple namespaces separated by a comma (`watchNamespace: default,secondNamespace`) - AGIC will observe these namespaces exclusively
2. apply  Helm template changes with: `helm install -f helm-config.yaml application-gateway-kubernetes-ingress/ingress-azure`

Once deployed with the ability to observe multiple namespaces, AGIC will:
  - list ingress resources from all accessible namespaces
  - filter to ingress resources annotated with `kubernetes.io/ingress.class: azure/application-gateway`
  - compose combined [Application Gateway config](https://github.com/Azure/azure-sdk-for-go/blob/37f3f4162dfce955ef5225ead57216cf8c1b2c70/services/network/mgmt/2016-06-01/network/models.go#L1710-L1744)
  - apply the config to the associated Application Gateway via [ARM](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview)

## Conflicting Configurations
Multiple namespaced [ingress resources](https://kubernetes.io/docs/concepts/services-networking/ingress/#the-ingress-resource)
could instruct AGIC to create conflicting configurations for a single Application Gateway. (Two ingresses claiming the same
domain for instance.)

At the top of the hierarchy - **listeners** (IP address, port, and host) and **routing rules** (binding listener,
backend pool, and HTTP settings) could be created and shared by multiple namespaces/ingresses.

On the other hand - paths, backend pools, HTTP settings, and TLS certificates could be created by one namespace only
and duplicates will be removed.

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

For example if you added `staging` first, AGIC will configure Application Gateway to route
traffic to the staging backend pool. At a later stage, introducing `production`
ingress, will cause AGIC to reprogram Application Gateway, which will start routing traffic
to the `production` backend pool.

## Restrict Access to Namespaces
By default AGIC will configure Application Gateway based on annotated Ingress within
any namespace. Should you want to limit this behavior you have the following
options:
  - limit the namespaces, by explicitly defining namespaces AGIC should observe via the `watchNamespace` YAML key in [helm-config.yaml](#sample-helm-config-file)
  - use [Role/RoleBinding](https://docs.microsoft.com/azure/aks/azure-ad-rbac) to limit AGIC to specific namespaces

## Sample Helm config file

```yaml
    # This file contains the essential configs for the ingress controller helm chart

    # Verbosity level of the App Gateway Ingress Controller
    verbosityLevel: 3
    
    ################################################################################
    # Specify which application gateway the ingress controller will manage
    #
    appgw:
        subscriptionId: <subscriptionId>
        resourceGroup: <resourceGroupName>
        name: <applicationGatewayName>
    
        # Setting appgw.shared to "true" will create an AzureIngressProhibitedTarget CRD.
        # This prohibits AGIC from applying config for any host/path.
        # Use "kubectl get AzureIngressProhibitedTargets" to view and change this.
        shared: false
    
    ################################################################################
    # Specify which kubernetes namespace the ingress controller will watch
    # Default value is "default"
    # Leaving this variable out or setting it to blank or empty string would
    # result in Ingress Controller observing all acessible namespaces.
    #
    # kubernetes:
    #   watchNamespace: <namespace>
    
    ################################################################################
    # Specify the authentication with Azure Resource Manager
    #
    # Two authentication methods are available:
    # - Option 1: AAD-Pod-Identity (https://github.com/Azure/aad-pod-identity)
    armAuth:
        type: aadPodIdentity
        identityResourceID: <identityResourceId>
        identityClientID:  <identityClientId>
    
    ## Alternatively you can use Service Principal credentials
    # armAuth:
    #    type: servicePrincipal
    #    secretJSON: <<Generate this value with: "az ad sp create-for-rbac --subscription <subscription-uuid> --sdk-auth | base64 -w0" >>
    
    ################################################################################
    # Specify if the cluster is RBAC enabled or not
    rbac:
        enabled: false # true/false
    
    # Specify aks cluster related information. THIS IS BEING DEPRECATED.
    aksClusterConfiguration:
        apiServerAddress: <aks-api-server-address>
```

