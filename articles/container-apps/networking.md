---
title: Networking in Azure Container Apps environment
description: Learn about virtual networks in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 06/02/2025
ms.author: cshoe
ms.custom:
  - build-2025
---

# Networking in Azure Container Apps environment

Azure Container Apps operate in the context of an [environment](environment.md), which runs its own virtual network. As you create an environment, there are a few key considerations that inform the networking capabilities of your container apps:

- [Environment type](#environment-selection)
- [Virtual network type](#virtual-network-type)
- [Accessibility level](#accessibility-level)

## Environment selection

Container Apps has two different [environment types](environment.md#types), which share many of the same networking characteristics with some key differences.

| Environment type | Supported plan types | Description | 
|---|---|---|
| Workload profiles | Consumption, Dedicated | Supports user defined routes (UDR), egress through NAT Gateway, and creating private endpoints on the container app environment. The minimum required subnet size is `/27`. | 
| Consumption only | Consumption | Doesn't support user defined routes (UDR), egress through NAT Gateway, peering through a remote gateway, or other custom egress. The minimum required subnet size is `/23`. | 

For more information see [Environment types](/azure/container-apps/structure#environment-types).

## Virtual network type

By default, Container Apps are integrated with the Azure network, which is publicly accessible over the internet and only able to communicate with internet accessible endpoints. You also have the option to provide an existing VNet as you create your environment instead. Once you create an environment with either the default Azure network or an existing VNet, the network type can't be changed.

Use an existing VNet when you need Azure networking features like:

- Network Security Groups
- Application Gateway integration
- Azure Firewall integration
- Control over outbound traffic from your container app
- Access to resources behind private endpoints in your virtual network

If you use an existing VNet, you need to provide a subnet that is dedicated exclusively to the Container App environment you deploy. This subnet isn't available to other services. For more information see [Virtual network configuration](custom-virtual-networks.md).

## Accessibility level

You can configure whether your container app allows public ingress or ingress only from within your VNet at the environment level.

| Accessibility level | Description |
|---|---|
| External | Allows your container app to accept public requests. External environments are deployed with a virtual IP on an external, public facing IP address. |
| Internal | Internal environments have no public endpoints and are deployed with a virtual IP (VIP) mapped to an internal IP address. The internal endpoint is an Azure internal load balancer (ILB) and IP addresses are issued from the existing VNet's list of private IP addresses. |

### <a name="public-network-access"></a>Public network access

The public network access setting determines whether your container apps environment is accessible from the public Internet. Whether you can change this setting after creating your environment depends on the environment's virtual IP configuration. The following table shows valid values for public network access, depending on your environment's virtual IP configuration.

| Virtual IP | Supported public network access | Description |
|--|--|--|
| External | `Enabled`, `Disabled`  | The container apps environment was created with an Internet-accessible endpoint. The public network access setting determines whether traffic is accepted through the public endpoint or only through private endpoints, and the public network access setting can be changed after creating the environment. |
| Internal | `Disabled` | The container apps environment was created without an Internet-accessible endpoint. The public network access setting can't be changed to accept traffic from the Internet. |

In order to create private endpoints on your Azure Container App environment, public network access must be set to `Disabled`.

Azure networking policies are supported with the public network access flag.

### Ingress configuration

Under the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) section, you can configure the following settings:

- Ingress: You can enable or disable ingress for your container app.

- Ingress traffic: You can accept traffic to your container app from anywhere, or you can limit it to traffic from within the same Container Apps environment.

- Traffic split rules: You can define traffic splitting rules between different revisions of your application. For more information, see [Traffic splitting](traffic-splitting.md).

For more information about different networking scenarios, see [Ingress in Azure Container Apps](ingress-overview.md).

## Inbound features

|Feature |Learn how to |
|---------|---------|
|[Ingress](ingress-overview.md)<br><br>[Configure ingress](ingress-how-to.md) | Control the routing of external and internal traffic to your container app. |
|[Premium ingress](ingress-environment-configuration.md) | Configure advanced ingress settings such as workload profile support for ingress and idle timeout. |
|[IP restrictions](ip-restrictions.md) | Restrict inbound traffic to your container app by IP address. |
|[Client certificate authentication](client-certificate-authorization.md) | Configure client certificate authentication (also known as mutual TLS or mTLS) for your container app. |
|[Traffic splitting](traffic-splitting.md)<br><br>[Blue/Green deployment](blue-green-deployment.md) | Split incoming traffic between active revisions of your container app. |
|[Session affinity](sticky-sessions.md) | Route all requests from a client to the same replica of your container app. |
|[Cross origin resource sharing (CORS)](cors.md) | Enable CORS for your container app, which allows requests made through the browser to a domain that doesn't match the page's origin. |
|[Path-based routing](rule-based-routing.md) | Use rules to route requests to different container apps in your environment, depending on the path of each request. |
|[Virtual networks](custom-virtual-networks.md) | Configure the VNet for your container app environment. |
|[DNS](dns.md) | Configure DNS for your container app environment's VNet. |
|[Private endpoint](how-to-use-private-endpoint.md) | Use a private endpoint to securely access your Azure Container App without exposing it to the public Internet. |
|[Integrate with Azure Front Door](how-to-integrate-with-azure-front-door.md) | Connect directly from Azure Front Door to your Azure Container Apps using a private link instead of the public internet. |

## Outbound features

|Feature |Learn how to |
|---------|---------|
|[Using Azure Firewall](using-azure-firewall.md) | Use Azure Firewall to control outbound traffic from your container app. |
|[Securing a existing VNet with an NSG](firewall-integration.md) | Secure your container app environment's VNet with a Network Security Group (NSG). |
|[NAT gateway integration](custom-virtual-networks.md#nat-gateway-integration)| Use NAT Gateway to simplify outbound internet connectivity in your virtual network in a workload profiles environment. |

## Tutorials

|Tutorial |Learn how to |
|---------|---------|
|[Use a virtual network](vnet-custom.md) | Use a virtual network. |
|[Configure WAF Application Gateway](waf-app-gateway.md) | Configure a WAF application gateway. |
|[Enable User Defined Routes (UDR)](user-defined-routes.md) | Enable user defined routes (UDR). |
|[Secure an existing VNet with an NSG](firewall-integration.md) | Secure your container app environment's VNet with a Network Security Group (NSG). |
|[Use Mutual Transport Layer Security (mTLS)](mtls.md) | Build an mTLS application in Azure Container Apps. |
|[Use a private endpoint](how-to-use-private-endpoint.md) | Use a private endpoint to securely access your Azure Container App without exposing it to the public Internet. |
|[Integrate with Azure Front Door](how-to-integrate-with-azure-front-door.md) | Connect directly from Azure Front Door to your Azure Container Apps using a private link instead of the public internet. |

### Environment security

:::image type="content" source="media/networking/locked-down-network.png" alt-text="Diagram of how to fully lock down your network for Container Apps.":::

You can fully secure your ingress and egress networking traffic workload profiles environment by taking the following actions:

- Create your internal container app environment in a workload profiles environment. For steps, refer to [Manage workload profiles with the Azure CLI](./workload-profiles-manage-cli.md#create).

- Integrate your Container Apps with an [Application Gateway](./waf-app-gateway.md).

- Configure UDR to route all traffic through [Azure Firewall](./user-defined-routes.md).

## HTTP edge proxy behavior

Azure Container Apps uses an edge HTTP proxy that terminates Transport Layer Security (TLS) and routes requests to each application.

HTTP applications scale based on the number of HTTP requests and connections. Envoy routes internal traffic inside clusters.

Downstream connections support HTTP1.1 and HTTP2 and Envoy automatically detects and upgrades connections if the client connection requires an upgrade.

Upstream connections are defined by setting the `transport` property on the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) object.

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

## Next steps

- [Networking configuration in Azure Container Apps environment](environment-level-networking.md)
