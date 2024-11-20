---
title: Enable multiple-namespace support for Application Gateway Ingress Controller
description: This article provides information on how to enable support for multiple namespaces in a Kubernetes cluster by using the Application Gateway Ingress Controller. 
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 08/01/2023
ms.author: greglin
---

# Enable multiple-namespace support in an AKS cluster by using AGIC

[Kubernetes namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) make it possible for a Kubernetes cluster to be partitioned and allocated to subgroups of a larger team. These subgroups can then deploy and manage infrastructure with finer controls of resources, security, and configuration. Kubernetes allows for one or more ingress resources to be defined independently within each namespace.

As of version 0.7, the [Application Gateway Kubernetes Ingress Controller](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/master/README.md) (AGIC) can ingest events from and observe multiple namespaces. If an Azure Kubernetes Service (AKS) administrator decides to use [Azure Application Gateway](https://azure.microsoft.com/services/application-gateway/) as an ingress, all namespaces use the same deployment of Application Gateway. A single installation of AGIC monitors accessible namespaces and configures the Application Gateway deployment that it's associated with.

Version 0.7 of AGIC continues to exclusively observe the `default` namespace, unless you explicitly change it to one or more different namespaces in the Helm configuration.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution.

## Enable multiple-namespace support

1. Modify the [helm-config.yaml](#sample-helm-configuration-file) file in one of the following ways:

   - Delete the `watchNamespace` key entirely from [helm-config.yaml](#sample-helm-configuration-file). AGIC observes all namespaces.
   - Set `watchNamespace` to an empty string. AGIC observes all namespaces.
   - Add multiple namespaces separated by a comma (for example, `watchNamespace: default,secondNamespace`). AGIC observes these namespaces exclusively.
2. Apply Helm template changes by running `helm install -f helm-config.yaml application-gateway-kubernetes-ingress/ingress-azure`.

After you deploy AGIC with the ability to observe multiple namespaces, it performs the following actions:

- Lists ingress resources from all accessible namespaces
- Filters to ingress resources annotated with `kubernetes.io/ingress.class: azure/application-gateway`
- Composes a combined [Application Gateway configuration](https://github.com/Azure/azure-sdk-for-go/blob/37f3f4162dfce955ef5225ead57216cf8c1b2c70/services/network/mgmt/2016-06-01/network/models.go#L1710-L1744)
- Applies the configuration to the associated Application Gateway deployment via [Azure Resource Manager](../azure-resource-manager/management/overview.md)

## Handle conflicting configurations

Multiple-namespaced [ingress resources](https://kubernetes.io/docs/concepts/services-networking/ingress/#the-ingress-resource) could instruct AGIC to create conflicting configurations for a single Application Gateway deployment. That is, two ingresses could claim the same domain.

At the top of the hierarchy, AGIC could create *listeners* (IP address, port, and host) and *routing rules* (binding listener, backend pool, and HTTP settings). Multiple namespaces and ingresses could share them.

On the other hand, AGIC could create paths, backend pools, HTTP settings, and TLS certificates for one namespace only and remove duplicates.

For example, consider the following duplicate ingress resources defined in the `staging` and `production` namespaces for `www.contoso.com`:

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

Despite the two ingress resources demanding traffic for `www.contoso.com` to be routed to the respective Kubernetes namespaces, only one backend can service the traffic. AGIC creates a configuration on a "first in, first out" basis for one of the resources. If two ingress resources are created at the same time, the one earlier in the alphabet takes precedence. Based on this property, AGIC creates settings for the `production` ingress. Application Gateway is configured with the following resources:

- Listener: `fl-www.contoso.com-80`
- Routing rule: `rr-www.contoso.com-80`
- Backend pool: `pool-production-contoso-web-service-80-bp-80`
- HTTP settings: `bp-production-contoso-web-service-80-80-websocket-ingress`
- Health probe: `pb-production-contoso-web-service-80-websocket-ingress`

> [!NOTE]
> Except for *listener* and *routing rule*, the created Application Gateway resources include the name of the namespace (`production`) for which AGIC  created them.

If the two ingress resources are introduced into the AKS cluster at different points in time, AGIC is likely to end up in a scenario where it reconfigures Application Gateway and reroutes traffic from `namespace-B` to `namespace-A`.

For example, if you add `staging` first, AGIC configures Application Gateway to route traffic to the staging backend pool. At a later stage, introducing `production` ingress causes AGIC to reprogram Application Gateway, which starts routing traffic to the `production` backend pool.

## Restrict access to namespaces

By default, AGIC configures Application Gateway based on annotated ingress within any namespace. If you want to limit this behavior, you have the following options:

- Limit the namespaces by explicitly defining namespaces that AGIC should observe via the `watchNamespace` YAML key in [helm-config.yaml](#sample-helm-configuration-file).
- Use [Role and RoleBinding objects](/azure/aks/azure-ad-rbac) to limit AGIC to specific namespaces.

## Sample Helm configuration file

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
    # result in Ingress Controller observing all accessible namespaces.
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

## Related content

- [Application Gateway for Containers](for-containers/overview.md)
