---
title: Networking configuration in Azure Container Apps environment
description: Learn how to configure networking in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  conceptual
ms.date: 04/03/2025
ms.author: cshoe
---

# Networking configuration in Azure Container Apps environment

Azure Container Apps run in the context of an environment, with its own virtual network (VNet). This VNet creates a secure boundary around your Azure Container Apps [environment](environment.md). This article tells you how to configure your VNet.

## HTTP edge proxy behavior

Azure Container Apps uses an edge HTTP proxy that terminates Transport Layer Security (TLS) and routes requests to each application.

HTTP applications scale based on the number of HTTP requests and connections. Envoy routes internal traffic inside clusters.

Downstream connections support HTTP1.1 and HTTP2 and Envoy automatically detects and upgrades connections if the client connection requires an upgrade.

Upstream connections are defined by setting the `transport` property on the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) object.

### Ingress configuration

Under the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) section, you can configure the following settings:

- Ingress: You can enable or disable ingress for your container app.

- Ingress traffic: You can accept traffic to your container app from anywhere, or you can limit it to traffic from within the same Container Apps environment.

- Traffic split rules: You can define traffic splitting rules between different revisions of your application. For more information, see [Traffic splitting](traffic-splitting.md).

For more information about different networking scenarios, see [Ingress in Azure Container Apps](ingress-overview.md).

## Portal dependencies

For every app in Azure Container Apps, there are two URLs.

The Container Apps runtime initially generates a fully qualified domain name (FQDN) used to access your app. See the *Application Url* in the *Overview* window of your container app in the Azure portal for the FQDN of your container app.

A second URL is also generated for you. This location grants access to the log streaming service and the console. If necessary, you may need to add `https://azurecontainerapps.dev/` to the allowlist of your firewall or proxy.

## Ports and IP addresses

The following ports are exposed for inbound connections.

| Protocol | Port(s) |
|--|--|
| HTTP/HTTPS | 80, 443 |

IP addresses are broken down into the following types:

| Type | Description |
|--|--|
| Public inbound IP address | Used for application traffic in an external deployment, and management traffic in both internal and external deployments. |
| Outbound public IP | Used as the "from" IP for outbound connections that leave the virtual network. These connections aren't routed down a VPN. Outbound IPs may change over time. Using a NAT gateway or other proxy for outbound traffic from a Container Apps environment is only supported in a [workload profiles environment](workload-profiles-overview.md). |
| Internal load balancer IP address | This address only exists in an [internal environment](networking.md#accessibility-level). |

## Managed resources

When you deploy an internal or an external environment into your own network, a new resource group is created in the Azure subscription where your environment is hosted. This resource group contains infrastructure components managed by the Azure Container Apps platform. Don't modify the services in this group or the resource group itself.

# [Workload profiles environment](#tab/workload-profiles-env)

The name of the resource group created in the Azure subscription where your environment is hosted is prefixed with `ME_` by default, and the resource group name *can* be customized as you create your container app environment.

For external environments, the resource group contains a public IP address used specifically for inbound connectivity to your external environment and a load balancer. For internal environments, the resource group only contains a [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/).

In addition to the standard [Azure Container Apps billing](./billing.md), you're billed for:

- One standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for egress if using an internal or external environment, plus one standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for ingress if using an external environment. If you need more public IPs for egress due to SNAT issues, [open a support ticket to request an override](https://azure.microsoft.com/support/create-ticket/).

- One standard [load balancer](https://azure.microsoft.com/pricing/details/load-balancer/).

- The cost of data processed (in GBs) includes both ingress and egress for management operations.

# [Consumption only environment](#tab/consumption-only-env)

The name of the resource group created in the Azure subscription where your environment is hosted is prefixed with `MC_` by default, and the resource group name *can't* be customized when you create a container app. The resource group contains public IP addresses used specifically for outbound connectivity from your environment and a load balancer.

In addition to the standard [Azure Container Apps billing](./billing.md), you're billed for:

- One standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for egress. If you need more IPs for egress due to Source Network Address Translation (SNAT) issues, [open a support ticket to request an override](https://azure.microsoft.com/support/create-ticket/).

- Two standard [load balancers](https://azure.microsoft.com/pricing/details/load-balancer/) if using an internal environment, or one standard [load balancer](https://azure.microsoft.com/pricing/details/load-balancer/) if using an external environment. Each load balancer has fewer than six rules. The cost of data processed (in GBs) includes both ingress and egress for management operations.

---

## <a name="peer-to-peer-encryption"></a> Peer-to-peer encryption in the Azure Container Apps environment

Azure Container Apps supports peer-to-peer TLS encryption within the environment. Enabling this feature encrypts all network traffic within the environment with a private certificate that is valid within the Azure Container Apps environment scope. Azure Container Apps automatically manages these certificates.

> [!NOTE]
> By default, peer-to-peer encryption is disabled. Enabling peer-to-peer encryption for your applications may increase response latency and reduce maximum throughput in high-load scenarios.

The following example shows an environment with peer-to-peer encryption enabled.
:::image type="content" source="media/networking/peer-to-peer-encryption-traffic-diagram.png" alt-text="Diagram of how traffic is encrypted/decrypted with peer-to-peer encryption enabled.":::

<sup>1</sup> Inbound TLS traffic is terminated at the ingress proxy on the edge of the environment.

<sup>2</sup> Traffic to and from the ingress proxy within the environment is TLS encrypted with a private certificate and decrypted by the receiver. 

<sup>3</sup> Calls made from app A to app B's FQDN are first sent to the edge ingress proxy, and are TLS encrypted.

<sup>4</sup> Calls made from app A to app B using app B's app name are sent directly to app B and are TLS encrypted. Calls between apps and [Java components](./java-overview.md#java-components-support) are treated in the same way as app to app communication and TLS encrypted.

Applications within a Container Apps environment are automatically authenticated. However, the Container Apps runtime doesn't support authorization for access control between applications using the built-in peer-to-peer encryption.

When your apps are communicating with a client outside of the environment, two-way authentication with mTLS is supported. To learn more, see [configure client certificates](client-certificate-authorization.md).

# [Azure CLI](#tab/azure-cli)

You can enable peer-to-peer encryption using the following commands.

On create:

```azurecli
az containerapp env create \
    --name <ENVIRONMENT_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --location <LOCATION> \
    --enable-peer-to-peer-encryption
```

For an existing container app:

```azurecli
az containerapp env update \
    --name <ENVIRONMENT_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --enable-peer-to-peer-encryption
```

# [ARM template](#tab/arm-template)

You can enable peer-to-peer encryption in the ARM template for Container Apps environments using the following configuration.

```json
{
  ...
  "properties": {
       "peerTrafficConfiguration":{
            "encryption": {
                "enabled": "true|false"
            }
        }
  ...
}
```

---

## Rule-based routing (preview)

With rule-based routing, you create a fully qualified domain name (FQDN) on your container apps environment. You then use rules to route requests to this FQDN to different container apps, depending on the path of each request. This offers the following benefits.

- Isolation: By routing different paths to different container apps, you can deploy and update individual components without affecting the entire application.

- Scalability: With rule-based routing, you can scale individual container apps independently based on the traffic each container app receives.

- Custom Routing Rules: You can, for example, redirect users to different versions of your application or implement A/B testing.

- Security: You can implement security measures tailored to each container app. This helps you to reduce the attack surface of your application.

To learn how to configure rule-based routing on your container apps environment, see [Use rule-based routing](rule-based-routing.md).

## Related content

- [Configuring virtual networks Azure Container Apps environments](custom-virtual-networks.md)
- [Integrate a virtual network with an internal Azure Container Apps environment](vnet-custom-internal.md)

## Next steps

> [!div class="nextstepaction"]
> [Ingress in Azure Container Apps](ingress-overview.md)
