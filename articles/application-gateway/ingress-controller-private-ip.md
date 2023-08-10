---
title: Use private IP address for internal routing for an ingress endpoint 
description: This article provides information on how to use private IPs for internal routing and thus exposing the Ingress endpoint within a cluster to the rest of the VNet. 
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 07/23/2023
ms.author: greglin
---

# Use private IP for internal routing for an Ingress endpoint 

This feature exposes the ingress endpoint within the `Virtual Network` using a private IP.

> [!TIP]
> Also see [What is Application Gateway for Containers?](for-containers/overview.md) currently in public preview.

## Prerequisites  
Application Gateway with a [Private IP configuration](./configure-application-gateway-with-private-frontend-ip.md)

There are two ways to configure the controller to use Private IP for ingress,

## Assign to a particular ingress
To expose a particular ingress over Private IP, use annotation [`appgw.ingress.kubernetes.io/use-private-ip`](./ingress-controller-annotations.md#use-private-ip) in Ingress.

### Usage
```yaml
appgw.ingress.kubernetes.io/use-private-ip: "true"
```

For Application Gateways without a Private IP, Ingresses annotated with `appgw.ingress.kubernetes.io/use-private-ip: "true"` is ignored. This is indicated in the ingress event and AGIC pod log.

* Error as indicated in the Ingress Event

    ```output
    Events:
    Type     Reason       Age               From                                                                     Message
    ----     ------       ----              ----                                                                     -------
    Warning  NoPrivateIP  2m (x17 over 2m)  azure/application-gateway, prod-ingress-azure-5c9b6fcd4-bctcb  Ingress default/hello-world-ingress requires Application Gateway 
    applicationgateway3026 has a private IP address
    ```

* Error as indicated in AGIC Logs

    ```output
    E0730 18:57:37.914749       1 prune.go:65] Ingress default/hello-world-ingress requires Application Gateway applicationgateway3026 has a private IP address
    ```


## Assign Globally
In case, requirement is to restrict all Ingresses to be exposed over Private IP, use `appgw.usePrivateIP: true` in `helm` config.

### Usage
```yaml
appgw:
    subscriptionId: <subscriptionId>
    resourceGroup: <resourceGroupName>
    name: <applicationGatewayName>
    usePrivateIP: true
```

This makes the ingress controller filter the IP address configurations for a Private IP when configuring the frontend listeners on the Application Gateway.
AGIC can panic and crash if `usePrivateIP: true` and no Private IP is assigned.

> [!NOTE]
> Application Gateway v2 SKU requires a Public IP. Should you require Application Gateway to be private, Attach a [`Network Security Group`](../virtual-network/network-security-groups-overview.md) to the Application Gateway's subnet to restrict traffic.
