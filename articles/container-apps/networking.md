---
title: Networking in an Azure Container Apps Environment
description: Learn about virtual networks in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: concept-article
ms.date: 06/25/2025
ms.author: cshoe
ms.custom:
  - build-2025
  - sfi-image-nochange
---

# Networking in an Azure Container Apps environment

Azure Container Apps operates in the context of an [environment](environment.md), which runs its own virtual network. As you create an environment, a few key considerations inform the networking capabilities of your container apps: environment type, virtual network type, and accessibility level.

## Environment selection

Container Apps has two [environment types](environment.md#types). They share many of the same networking characteristics, with some key differences.

| Environment type | Supported plan types | Description |
| --- | --- | --- |
| Workload profiles (default) | Consumption, Dedicated | Supports user-defined routes (UDRs), egress through Azure NAT Gateway, and creating private endpoints in the container app environment. The minimum required subnet size is `/27`. |
| Consumption only (legacy) | Consumption | Doesn't support UDRs, egress through Azure NAT Gateway, peering through a remote gateway, or other custom egress. The minimum required subnet size is `/23`. |

For more information, see [Environment types](/azure/container-apps/structure#environment-types).

## Virtual network type

By default, Container Apps is integrated with the Azure network, which is publicly accessible over the internet and can communicate only with internet-accessible endpoints. You also have the option to provide an existing virtual network as you create your environment instead. After you create an environment with either the default Azure network or an existing virtual network, you can't change the network type.

Use an existing virtual network when you need Azure networking features like:

- Network security groups.
- Azure Application Gateway integration.
- Azure Firewall integration.
- Control over outbound traffic from your container app.
- Access to resources behind private endpoints in your virtual network.

If you use an existing virtual network, you need to provide a subnet that's dedicated exclusively to the Container Apps environment that you deploy. This subnet isn't available to other services. For more information, see [Virtual network configuration](custom-virtual-networks.md).

## Accessibility level

You can configure whether your container app allows public ingress or ingress only from within your virtual network at the environment level.

| Accessibility level | Description |
| --- | --- |
| External | Your container app can accept public requests. External environments are deployed with a virtual IP on an external, public-facing IP address. |
| Internal | Internal environments have no public endpoints and are deployed with a virtual IP mapped to an internal IP address. The internal endpoint is an Azure internal load balancer. IP addresses are issued from the existing virtual network's list of private IP addresses. |

### <a name="public-network-access"></a>Public network access

The setting for public network access determines whether your Container Apps environment is accessible from the public internet. Whether you can change this setting after creating your environment depends on the environment's virtual IP configuration. The following table shows valid values for public network access, depending on your environment's virtual IP configuration.

| Virtual IP | Supported public network access | Description |
| --- | --- | --- |
| External | `Enabled`, `Disabled` | The Container Apps environment was created with an internet-accessible endpoint. The setting for public network access determines whether traffic is accepted through the public endpoint or only through private endpoints. You can change this setting after you create the environment. |
| Internal | `Disabled` | The Container Apps environment was created without an internet-accessible endpoint. You can't change the setting for public network access to accept traffic from the internet. |

To create private endpoints in your Container Apps environment, you must set public network access to `Disabled`.

Azure networking policies are supported with the flag for public network access.

### Ingress configuration

In the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) section, you can configure the following settings:

- Enable or disable ingress for your container app.

- Accept traffic to your container app from anywhere or from only within the same Container Apps environment.

- Define traffic-splitting rules between revisions of your application. For more information, see [Traffic splitting](traffic-splitting.md).

For more information about networking scenarios, see [Ingress in Azure Container Apps](ingress-overview.md).

## Inbound features

| Feature | Learn how to |
| ------- | ------------ |
| [Ingress](ingress-overview.md)<br><br>[Configure ingress](ingress-how-to.md) | Control the routing of external and internal traffic to your container app. |
| [Premium ingress](ingress-environment-configuration.md) | Configure advanced ingress settings, such as workload profile support for ingress and idle timeout. |
| [IP restrictions](ip-restrictions.md) | Restrict inbound traffic to your container app by IP address. |
| [Client certificate authentication](client-certificate-authorization.md) | Configure client certificate authentication (also known as mutual TLS or mTLS) for your container app. |
| [Traffic splitting](traffic-splitting.md)<br><br>[Blue/Green deployment](blue-green-deployment.md) | Split incoming traffic between active revisions of your container app. |
| [Session affinity](sticky-sessions.md) | Route all requests from a client to the same replica of your container app. |
| [Cross-origin resource sharing (CORS)](cors.md) | Enable CORS for your container app, which allows requests made through the browser to a domain that doesn't match the page's origin. |
| [Path-based routing](rule-based-routing.md) | Use rules to route requests to different container apps in your environment, depending on the path of each request. |
| [Virtual networks](custom-virtual-networks.md) | Configure the virtual network for your Container Apps environment. |
| [DNS](private-endpoints-with-dns.md#dns) | Configure DNS for your Container Apps environment's virtual network. |
| [Private endpoint](how-to-use-private-endpoint.md) | Use a private endpoint to securely access your container app without exposing it to the public internet. |
| [Integrate with Azure Front Door](how-to-integrate-with-azure-front-door.md) | Connect directly from Azure Front Door to a container app by using a private link instead of the public internet. |

## Outbound features

| Feature | Learn how to |
| ------- | ------------ |
| [Using Azure Firewall](use-azure-firewall.md) | Use Azure Firewall to control outbound traffic from your container app. |
| [Virtual networks](custom-virtual-networks.md) | Configure the virtual network for your Container Apps environment. |
| [Securing a existing virtual network with a network security group](firewall-integration.md) | Help secure your Container Apps environment's virtual network by using a network security group. |
| [Azure NAT gateway integration](custom-virtual-networks.md#azure-nat-gateway-integration) | Use Azure NAT Gateway to simplify outbound internet connectivity in your virtual network in a workload profile environment. |

## How-to articles

| Article | Learn how to |
| -------- | ------------ |
| [Provide a virtual network to an Azure Container Apps environment](vnet-custom.md) | Use a virtual network. |
| [Protect Azure Container Apps with Web Application Firewall on Application Gateway](waf-app-gateway.md) | Configure Azure Web Application Firewall on Azure Application Gateway. |
| [Control outbound traffic in Azure Container Apps with user-defined routes](user-defined-routes.md) | Enable UDRs. |
| [Use mTLS in Azure Container Apps](mtls.md) | Build an mTLS application in Container Apps. |
| [Use a private endpoint with an Azure Container Apps environment](how-to-use-private-endpoint.md) | Use a private endpoint to securely access your container app without exposing it to the public internet. |
| [Create a private link to a container app with Azure Front Door](how-to-integrate-with-azure-front-door.md) | Connect directly from Azure Front Door to a container app by using a private link instead of the public internet. |

### Environment security

:::image type="content" source="media/networking/locked-down-network.png" alt-text="Diagram of how to help secure your network for Container Apps.":::

You can help secure your workload profile environment for ingress and egress networking traffic by taking the following actions:

- Create your internal Container Apps environment in a workload profile environment. For steps, refer to [Manage workload profiles with the Azure CLI](./workload-profiles-manage-cli.md#create).

- Integrate Container Apps with [Application Gateway](./waf-app-gateway.md).

- Configure a UDR to route all traffic through [Azure Firewall](./user-defined-routes.md).

## HTTP edge proxy behavior

Azure Container Apps uses an edge HTTP proxy that terminates TLS and routes requests to each application.

HTTP applications scale based on the number of HTTP requests and connections. Envoy routes internal traffic inside clusters.

Downstream connections support HTTP/1.1 and HTTP/2. Envoy automatically detects and upgrades connections if the client connection requires an upgrade.

You define upstream connections by setting the `transport` property on the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) object.

## Portal dependencies

For every app in Container Apps, there are two URLs.

The Container Apps runtime initially generates a fully qualified domain name (FQDN) that's used to access your app. To get the FQDN of your container app, go to your container app in the Azure portal. On the **Overview** pane, the FQDN is the **Application Url** value.

A second URL is also generated for you. This location grants access to the log-streaming service and the console. If necessary, add `https://azurecontainerapps.dev/` to the allow list of your firewall or proxy.

## Ports and IP addresses

The following ports are exposed for inbound connections:

| Protocol | Ports |
| --- | --- |
| HTTP/HTTPS | 80, 443 |

IP addresses have the following types:

| Type | Description |
| --- | --- |
| Public inbound IP | Used for application traffic in an external deployment, and for management traffic in both internal and external deployments. |
| Outbound public IP | Used as the "from" IP for outbound connections that leave the virtual network. These connections aren't routed down a VPN. Outbound IPs might change over time. Using Azure NAT Gateway or another proxy for outbound traffic from a Container Apps environment is supported only in a [workload profile environment](workload-profiles-overview.md). |
| Internal load balancer IP | Exists only in an [internal environment](networking.md#accessibility-level). |

## Related content

- [Ingress in Azure Container Apps](ingress-overview.md)
