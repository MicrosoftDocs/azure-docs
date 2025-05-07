---
title: Use private IP address for internal routing for an ingress endpoint
description: This article provides information on how to use private IPs for internal routing to expose the ingress endpoint within a cluster to the rest of the virtual network.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 07/23/2023
ms.author: greglin
---

# Use a private IP for internal routing for an ingress endpoint

You can use a private IP address for internal routing to expose an ingress endpoint within a cluster to the rest of a virtual network.

There are two ways to configure a controller to use a private IP for ingress: assigning the private IP to a particular ingress or assigning it globally.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution.

## Prerequisites

To complete the tasks in this article, you need Azure Application Gateway with a [private IP configuration](./configure-application-gateway-with-private-frontend-ip.md).

## Assign to a particular ingress

To expose a particular ingress over private IP, use the annotation [`appgw.ingress.kubernetes.io/use-private-ip`](./ingress-controller-annotations.md#use-private-ip) in the ingress:

```yaml
appgw.ingress.kubernetes.io/use-private-ip: "true"
```

For Application Gateway deployments without a private IP, ingresses annotated with `appgw.ingress.kubernetes.io/use-private-ip: "true"` are ignored. The ingress event and the Application Gateway Ingress Controller (AGIC) pod log indicate this problem:

- Here's the error as indicated in the ingress event:

    ```output
    Events:
    Type     Reason       Age               From                                                                     Message
    ----     ------       ----              ----                                                                     -------
    Warning  NoPrivateIP  2m (x17 over 2m)  azure/application-gateway, prod-ingress-azure-5c9b6fcd4-bctcb  Ingress default/hello-world-ingress requires Application Gateway
    applicationgateway3026 has a private IP address
    ```

- Here's the error as indicated in AGIC logs:

    ```output
    E0730 18:57:37.914749       1 prune.go:65] Ingress default/hello-world-ingress requires Application Gateway applicationgateway3026 has a private IP address
    ```

## Assign globally

If you need to restrict all ingresses to be exposed over private IP, use `appgw.usePrivateIP: true` in the `helm` configuration:

```yaml
appgw:
    subscriptionId: <subscriptionId>
    resourceGroup: <resourceGroupName>
    name: <applicationGatewayName>
    usePrivateIP: true
```

This code makes the ingress controller filter the IP address configurations for a private IP when it's configuring the frontend listeners on the Application Gateway deployment. AGIC can stop working if the value of `usePrivateIP` is `true` and no private IP is assigned.

> [!NOTE]
> Application Gateway v2 requires a public IP. If you require Application Gateway to be private, attach a [network security group](../virtual-network/network-security-groups-overview.md) to the Application Gateway deployment's subnet to restrict traffic.

## Related content

- [Application Gateway for Containers](for-containers/overview.md)
