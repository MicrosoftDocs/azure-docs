---
title: Enable multiple namespace support for Application Gateway Ingress Controller
description: This article provides information on how to enable multiple namespace support in a Kubernetes cluster with an Application Gateway Ingress Controller. 
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 08/01/2023
ms.author: greglin
---

# Enable multiple Namespace support in an AKS cluster with Application Gateway Ingress Controller

## Motivation

[Kubernetes Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) make it possible for a Kubernetes cluster to be partitioned and allocated to subgroups of a larger team. These subteams can then deploy and manage infrastructure with finer controls of resources, security, configuration etc. Kubernetes allows for one or more ingress resources to be defined independently within each namespace.

As of version 0.7 [Azure Application Gateway Kubernetes IngressController](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/master/README.md) (AGIC) can ingest events from and observe multiple namespaces. Should the AKS administrator decide to use [Application Gateway](https://azure.microsoft.com/services/application-gateway/) as an ingress, all namespaces use the same instance of Application Gateway. A single installation of Ingress Controller monitors accessible namespaces and configures the Application Gateway it's associated with.

Version 0.7 of AGIC continues to exclusively observe the `default` namespace, unless this is explicitly changed to one or more different namespaces in the Helm configuration. See the following section.

> [!TIP]
> Also see [What is Application Gateway for Containers?](for-containers/overview.md) currently in public preview.

## Enable multiple namespace support

To enable multiple namespace support:
1. modify the [helm-config.yaml](#sample-helm-config-file) file in one of the following ways:
   - delete the `watchNamespace` key entirely from [helm-config.yaml](#sample-helm-config-file) - AGIC observes all namespaces
   - set `watchNamespace` to an empty string - AGIC observes all namespaces
   - add multiple namespaces separated by a comma (`watchNamespace: default,secondNamespace`) - AGIC observes these namespaces exclusively
2. apply  Helm template changes with: `helm install -f helm-config.yaml application-gateway-kubernetes-ingress/ingress-azure`

Once deployed with the ability to observe multiple namespaces, AGIC performs the following actions:
  - lists ingress resources from all accessible namespaces
  - filters to ingress resources annotated with `kubernetes.io/ingress.class: azure/application-gateway`
  - composes combined [Application Gateway config](https://github.com/Azure/azure-sdk-for-go/blob/37f3f4162dfce955ef5225ead57216cf8c1b2c70/services/network/mgmt/2016-06-01/network/models.go#L1710-L1744)
  - applies the config to the associated Application Gateway via [ARM](../azure-resource-manager/management/overview.md)

## Conflicting Configurations

Multiple namespaced [ingress resources](https://kubernetes.io/docs/concepts/services-networking/ingress/#the-ingress-resource) could instruct AGIC to create conflicting configurations for a single Application Gateway. (Two ingresses claiming the same domain for instance.)

At the top of the hierarchy - **listeners** (IP address, port, and host) and **routing rules** (binding listener, backend pool, and HTTP settings) could be created and shared by multiple namespaces/ingresses.

On the other hand - paths, backend pools, HTTP settings, and TLS certificates could be created by one namespace only and duplicates are removed.

For example, consider the following duplicate ingress resources defined namespaces `staging` and `production` for `www.contoso.com`:

```yaml
apiVersion: networking.k8s.io/v1
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
apiVersion: networking.k8s.io/v1
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

Despite the two ingress resources demanding traffic for `www.contoso.com` to be routed to the respective Kubernetes namespaces, only one backend can service the traffic. AGIC creates a configuration based on a "first in, first out" basis for one of the resources. If two ingresses resources are created at the same time, the one earlier in the alphabet takes precedence. Based on this property, settings are created for the `production` ingress. Application Gateway is configured with the following resources:

  - Listener: `fl-www.contoso.com-80`
  - Routing Rule: `rr-www.contoso.com-80`
  - Backend Pool: `pool-production-contoso-web-service-80-bp-80`
  - HTTP Settings: `bp-production-contoso-web-service-80-80-websocket-ingress`
  - Health Probe: `pb-production-contoso-web-service-80-websocket-ingress`

> [!NOTE]
> Except for *listener* and *routing rule*, the Application Gateway resources created include the name of the namespace (`production`) for which they were created.

If the two ingress resources are introduced into the AKS cluster at different points in time, it's likely for AGIC to end up in a scenario where it reconfigures Application Gateway and reroutes traffic from `namespace-B` to `namespace-A`.

For example, if you added `staging` first, AGIC configures Application Gateway to route traffic to the staging backend pool. At a later stage, introducing `production` ingress causes AGIC to reprogram Application Gateway, which starts routing traffic to the `production` backend pool.

## Restrict Access to Namespaces

By default AGIC configures Application Gateway based on annotated Ingress within any namespace. Should you want to limit this behavior you have the following options:
  - limit the namespaces, by explicitly defining namespaces AGIC should observe via the `watchNamespace` YAML key in [helm-config.yaml](#sample-helm-config-file)
  - use [Role/RoleBinding](../aks/azure-ad-rbac.md) to limit AGIC to specific namespaces

## Sample Helm config file

```yaml
    # This file contains the essential configs for the ingress controller helm chart

    # Verbosity level of the App Gateway Ingress Controller
    verbosityLevel: 3
    
    ################################################################################
    # Specify which application gateway the ingress controller manages
    #
    appgw:
        subscriptionId: <subscriptionId>
        resourceGroup: <resourceGroupName>
        name: <applicationGatewayName>
    
        # Setting appgw.shared to "true" creates an AzureIngressProhibitedTarget CRD.
        # This prohibits AGIC from applying config for any host/path.
        # Use "kubectl get AzureIngressProhibitedTargets" to view and change this.
        shared: false
    
    ################################################################################
    # Specify which kubernetes namespace the ingress controller watches
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
    #    secretJSON: <<Generate this value with: "az ad sp create-for-rbac --subscription <subscription-uuid> --role Contributor --sdk-auth | base64 -w0" >>
    
    ################################################################################
    # Specify if the cluster is Kubernetes RBAC enabled or not
    rbac:
        enabled: false # true/false
    
    # Specify aks cluster related information. THIS IS BEING DEPRECATED.
    aksClusterConfiguration:
        apiServerAddress: <aks-api-server-address>
```