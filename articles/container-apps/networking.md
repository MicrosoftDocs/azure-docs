---
title: Networking architecture in Azure Container Apps
description: Learn how to configure virtual networks in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic:  conceptual
ms.date: 05/06/2022
ms.author: cshoe
---

# Networking architecture in Azure Container Apps

Azure Container Apps run in the context of an [environment](environment.md), which is supported by a virtual network (VNET). When you create an environment, you can provide a custom VNET, otherwise a VNET is automatically generated for you. Generated VNETs are inaccessible to you as they're created in Microsoft's tenant. To take full control over your VNET, provide an existing VNET to Container Apps as you create your environment.

The following articles feature step-by-step instructions for creating Container Apps environments with different accessibility levels.

| Accessibility level | Description |
|--|--|
| [External](vnet-custom.md) | Container Apps environments deployed as external resources are available for public requests. External environments are deployed with a virtual IP on an external, public facing IP address. |
| [Internal](vnet-custom-internal.md) | When set to internal, the environment has no public endpoint. Internal environments are deployed with a virtual IP (VIP) mapped to an internal IP address. The internal endpoint is an Azure internal load balancer (ILB) and IP addresses are issued from the custom VNET's list of private IP addresses. |

## Custom VNET configuration

As you create a custom VNET, keep in mind the following situations:

- If you want your container app to restrict all outside access, create an [internal Container Apps environment](vnet-custom-internal.md).

- When you provide your own VNET, you need to provide a subnet that is dedicated to the Container App Environment you will deploy. This subnet cannot be used by other services.

- Network addresses are assigned from a subnet range you define as the environment is created.

  - You can define the subnet range used by the Container Apps environment.
  - Once the environment is created, the subnet range is immutable.
  - Each [revision](revisions.md) is assigned an IP address in the subnet.
  - You can restrict inbound requests to the environment exclusively to the VNET by deploying the environment as [internal](vnet-custom-internal.md).

As you begin to design the network around your container app, refer to [Plan virtual networks](../virtual-network/virtual-network-vnet-plan-design-arm.md) for important concerns surrounding running virtual networks on Azure.

:::image type="content" source="media/networking/azure-container-apps-virtual-network.png" alt-text="Diagram of how Azure Container Apps environments use an existing V NET, or you can provide your own.":::

<!--
https://docs.microsoft.com/azure/azure-functions/functions-networking-options

https://techcommunity.microsoft.com/t5/apps-on-azure-blog/azure-container-apps-virtual-network-integration/ba-p/3096932
-->

## HTTP edge proxy behavior

Azure Container Apps uses [Envoy proxy](https://www.envoyproxy.io/) as an edge HTTP proxy. TLS is terminated on the edge and requests are routed based on their traffic split rules and routes traffic to the correct application.

HTTP applications scale based on the number of HTTP requests and connections. Envoy routes internal traffic inside clusters. Downstream connections support HTTP1.1 and HTTP2 and Envoy automatically detects and upgrades the connection should the client connection be upgraded. Upstream connection is defined by setting the `transport` property on the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) object.

### Ingress configuration

Under the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) section, you can configure the following settings:

- **Accessibility level**: You can set your container app as externally or internally accessible in the environment. An environment variable `CONTAINER_APP_ENV_DNS_SUFFIX` is used to automatically resolve the FQDN suffix for your environment.

- **Traffic split rules**: You can define traffic split rules between different revisions of your application.

### Scenarios

The following scenarios describe configuration settings for common use cases.

#### Rapid iteration

In situations where you're frequently iterating development of your container app, you can set traffic rules to always shift all traffic to the latest deployed revision.

The following example routes all traffic to the latest deployed revision:

```json
"ingress": { 
  "traffic": [
    {
      "latestRevision": true,
      "weight": 100
    }
  ]
}
```

Once you're satisfied with the latest revision, you can lock traffic to that revision by updating the `ingress` settings to:

```json
"ingress": { 
  "traffic": [
    {
      "latestRevision": false, // optional
      "revisionName": "myapp--knowngoodrevision",
      "weight": 100
    }
  ]
}
```

#### Update existing revision

Consider a situation where you have a known good revision that's serving 100% of your traffic, but you want to issue an update to your app. You can deploy and test new revisions using their direct endpoints without affecting the main revision serving the app.

Once you're satisfied with the updated revision, you can shift a portion of traffic to the new revision for testing and verification.

The following configuration demonstrates how to move 20% of traffic over to the updated revision:

```json
"ingress": {
  "traffic": [
    {
      "revisionName": "myapp--knowngoodrevision",
      "weight": 80
    },
    {
      "revisionName": "myapp--newerrevision",
      "weight": 20
    }
  ]
}
```

#### Staging microservices

When building microservices, you may want to maintain production and staging endpoints for the same app. Use labels to ensure that traffic doesn't switch between different revisions.

The following example demonstrates how to apply labels to different revisions.

```json
"ingress": { 
  "traffic": [
    {
      "revisionName": "myapp--knowngoodrevision",
      "weight": 100
    },
    {
      "revisionName": "myapp--98fdgt",
      "weight": 0,
      "label": "staging"
    }
  ]
}
```

## Portal dependencies

For every app in Azure Container Apps, there are two URLs.

The first URL is generated by Container Apps and is used to access your app. See the *Application Url* in the *Overview* window of your container app in the Azure portal for the fully qualified domain name (FQDN) of your container app.

The second URL grants access to the log streaming service and the console. If necessary, you may need to add `https://azurecontainerapps.dev/` to the allowlist of your firewall or proxy.

## Ports and IP addresses

>[!NOTE]
> The subnet associated with a Container App Environment requires a CIDR prefix of /23.

The following ports are exposed for inbound connections.

| Use | Port(s) |
|--|--|
| HTTP/HTTPS | 80, 443 |

Container Apps reserves 60 IPs in your VNET, and the amount may grow as your container environment scales.

IP addresses are broken down into the following types:

| Type | Description |
|--|--|
| Public inbound IP address | Used for app traffic in an external deployment, and management traffic in both internal and external deployments. |
| Outbound public IP | Used as the "from" IP for outbound connections that leave the virtual network. These connections aren't routed down a VPN. |
| Internal load balancer IP address | This address only exists in an internal deployment. |
| App-assigned IP-based TLS/SSL addresses | These addresses are only possible with an external deployment, and when IP-based TLS/SSL binding is configured. |

## Restrictions

Subnet address ranges can't overlap with the following reserved ranges:

- 169.254.0.0/16
- 172.30.0.0/16
- 172.31.0.0/16
- 192.0.2.0/24

## Subnet

As a Container Apps environment is created, you provide resource IDs for a single subnet.

If you're using the CLI, the parameter to define the subnet resource ID is `infrastructure-subnet-resource-id`. The subnet hosts infrastructure components and user app containers.

If you're using the Azure CLI and the [platformReservedCidr](vnet-custom-internal.md#networking-parameters) range is defined, both subnets must not overlap with the IP range defined in `platformReservedCidr`.

## Routes

There's no forced tunneling in Container Apps routes.

## Managed resources

When you deploy an internal or an external environment into your own network, a new resource group prefixed with `MC_` is created in the Azure subscription where your environment is hosted. This resource group contains infrastructure components managed by the Azure Container Apps platform, and shouldn't be modified. The resource group contains Public IP addresses used specifically for outbound connectivity from your environment and a load balancer. In addition to the [Azure Container Apps billing](./billing.md), you will be billed for the following:
- Three standard static [public IPs](https://azure.microsoft.com/pricing/details/ip-addresses/) if using an internal environment, or four standard static [public IPs](https://azure.microsoft.com/pricing/details/ip-addresses/) if using an external environment.
- Two standard [Load Balancers](https://azure.microsoft.com/pricing/details/load-balancer/) if using an internal environment, or one standard [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/) if using an external environment. Each load balancer has less than six rules. The cost of data processed (GB) includes both ingress and egress for management operations.


## Next steps

- [Deploy with an external environment](vnet-custom.md)
- [Deploy with an internal environment](vnet-custom-internal.md)