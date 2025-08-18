---
title: Configure ingress in an Azure Container Apps environment
description: Learn how to configure ingress in an Azure Container Apps environment.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 05/12/2025
ms.author: cshoe
ms.custom:
  - build-2025
---

# Configure ingress for an Azure Container Apps environment

Azure Container Apps run in the context of an environment, with its own virtual network (VNet). This VNet creates a secure boundary around your Azure Container Apps [environment](environment.md).

Ingress configuration in Azure Container Apps determines how external network traffic reaches your applications. Configuring ingress enables you to control traffic routing, improve application performance, and implement advanced deployment strategies. This article guides you through the ingress configuration options available in Azure Container Apps and helps you choose the right settings for your workloads.

An Azure Container Apps environment includes a scalable edge ingress proxy responsible for the following features:

- [Transport Layer Security (TLS) termination](networking.md#http-edge-proxy-behavior), which decrypts TLS traffic as it enters the environment. This operation shifts the work of decryption away from your container apps, reducing their resource consumption and improving their performance.

- [Load balancing and traffic splitting](traffic-splitting.md) between active container app revisions. Having control over where you direct incoming traffic allows you to implement patterns like [blue-green deployment](blue-green-deployment.md) and conduct [A/B testing](https://wikipedia.org/wiki/A/B_testing).

- [Session affinity](./sticky-sessions.md), which helps you build stateful applications that require a consistent connection to the same container app replica.

The following diagram shows an example environment with the ingress proxy routing traffic to two container apps.

:::image type="content" source="media/networking/peer-to-peer-encryption-traffic-diagram.png" alt-text="Diagram of how the ingress proxy routes traffic to your container apps.":::

By default, Azure Container Apps creates your container app environment with the default ingress mode. If your application needs to operate at high scale levels, you can set the ingress mode to premium.

## Default ingress mode

With the default ingress mode, your Container Apps environment has two ingress proxy instances. Container apps creates more instances as needed, up to a maximum of 10. Each instance is allocated up to 1 vCPU core and 2 GB of memory.

In the default ingress mode, no billing is applied for scaling the ingress proxy or for the vCPU cores and allocated memory.

## Premium ingress mode

The default ingress mode could become a bottleneck in high scale environments. As an alternative, the premium ingress mode includes advanced features to ensure your ingress keeps up with traffic demands.

These features include:

- Workload profile support: Ingress proxy instances run in a [workload profile](workload-profiles-overview.md) of your choice. You have control over the number of vCPU cores and memory resources available to the proxy.

- Configurable scale range rules: Proxy scale range rules are configurable so you can make sure you have as many instances as your application requires.

- Advanced settings: You can configure advanced settings such as idle time-outs for ingress proxy instances.

To decide between default and premium ingress mode, you evaluate the resources consumed by the proxy instance considering the requests served. Start by looking at vCPU cores and memory resources consumed by the proxy instance. If your environment sustains the maximum ingress proxy count (default 10) for any extended period, consider switching to premium ingress mode. For more information, see [metrics](metrics.md).

### Workload profile

You can select a workload profile to provide dedicated nodes for your ingress proxy instances that scale to your needs. The D4-D32 workload profile types are recommended. Each ingress proxy instance is allocated 1 vCPU core. For more information, see [Workload profiles in Azure Container Apps](workload-profiles-overview.md).

The workload profile:

- Must not be the Consumption workload profile.
- Must not be shared with container apps or jobs.
- Must not be deleted while you're using it for your ingress proxy.

Running your ingress proxy in a workload profile is billed at the rate for that workload profile. For more information, see [billing](billing.md#consumption-dedicated).

You can also configure the number of workload profile nodes. A workload profile is a scalable pool of nodes. Each node contains multiple ingress proxy instances. The number of nodes scales based on vCPU and memory utilization. The minimum number of node instances is two.

### Scaling

The ingress proxy scales independently from your container app scaling.

When your ingress proxy reaches high vCPU or memory utilization, Container Apps creates more ingress proxy instances. When utilization decreases, the extra ingress proxy instances are removed.

Your minimum and maximum ingress proxy instances are determined as follows:

- Minimum: There are a minimum of two node instances.

- Maximum: Your maximum node instances multiplied by your vCPU cores. For example, if you have 50 maximum node instances and 4 vCPU cores, you have a maximum of 200 ingress proxy instances.

The ingress proxy instances are spread among the available workload profile nodes.

### Advanced ingress settings

With the premium ingress mode enabled, you can also configure the following settings:

| Setting | Description | Minimum | Maximum | Default |
|---|---|---|---|---|
| Termination grace period | The amount of time (in seconds) for the container app to finish processing requests before they're canceled during shutdown. | 0 | 3,600 | 500 |
| Idle request timeout | Idle request time-out in minutes. | 1 | 60 | 4 |
| Request header count | Increase this setting if you have clients that send a large number of request headers. | 1 | N/A | 100 |

You should only increase these settings as needed, because raising them could lead to your ingress proxy instances consuming more resources for longer periods of time, becoming more vulnerable to resource exhaustion and denial of service attacks.

## Configure ingress

You can configure the ingress for your environment after you create it.

1. Browse to your environment in the Azure portal.
1. Select **Networking**.
1. Select **Ingress settings**.
1. Configure your ingress settings as follows.

    | Setting | Value |
    |---|---|
    | Ingress Mode| Select [**Default**](#default-ingress-mode) or [**Premium**](#premium-ingress-mode). |
    | Workload profile size | Select a size from [**D4** to **D32**](#workload-profile). |
    | Minimum node instances | Enter the [minimum workload profile node instances](#workload-profile). |
    | Maximum node instances | Enter the [maximum workload profile node instances](#workload-profile). |
    | Termination grace period |Enter the [termination grace period in minutes](#advanced-ingress-settings). |
    | Idle request timeout| Enter the [idle request time-out in minutes](#advanced-ingress-settings). |
    | Request header count | Enter the [request header count](#advanced-ingress-settings). |

1. Select **Apply**.

## Rule-based routing (preview)

With rule-based routing, you create a fully qualified domain name (FQDN) on your container apps environment. You then use rules to route requests to this FQDN to different container apps, depending on the path of each request. This offers the following benefits.

- Isolation: By routing different paths to different container apps, you can deploy and update individual components without affecting the entire application.

- Scalability: With rule-based routing, you can scale individual container apps independently based on the traffic each container app receives.

- Custom Routing Rules: You can, for example, redirect users to different versions of your application or implement A/B testing.

- Security: You can implement security measures tailored to each container app. This helps you to reduce the attack surface of your application.

To learn how to configure rule-based routing on your container apps environment, see [Use rule-based routing](rule-based-routing.md).

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

## Related content

- [Ingress in Azure Container Apps](ingress-overview.md)
- [Networking in Azure Container Apps](networking.md)
- [Configuring virtual networks Azure Container Apps environments](custom-virtual-networks.md)
- [Integrate a virtual network with an internal Azure Container Apps environment](vnet-custom-internal.md)
