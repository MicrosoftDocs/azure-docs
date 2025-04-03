---
title: Networking in Azure Container Apps environment
description: Learn about virtual networks in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
ms.topic:  conceptual
ms.date: 04/03/2025
ms.author: cshoe
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

By default, Container Apps are integrated with the Azure network, but you have the option to provide an existing VNet as you create your environment instead. Once you create an environment with either the default Azure network or an existing VNet, the network type can't be changed.

Use an existing VNet when you need Azure networking features like:

- Network Security Groups
- Application Gateway integration
- Azure Firewall integration
- Control over outbound traffic from your container app
- Access to resources behind private endpoints in your virtual network

Use a generated VNet when you do not need these features.

If you use an existing VNet, you need to provide a subnet that is dedicated exclusively to the Container App environment you deploy. This subnet isn't available to other services. For more information see [Virtual network configuration](custom-virtual-networks.md).

### When you don't have an existing VNet

Generated VNets are:

- Publicly accessible over the internet
- Only able to communicate with internet accessible endpoints

Generated VNets only support a limited subset of networking capabilities such as:

- Ingress IP restrictions
- Container app level ingress controls

## Accessibility level

You can configure whether your container app allows public ingress or ingress only from within your VNet at the environment level.

| Accessibility level | Description |
|---|---|
| External | Allows your container app to accept public requests. External environments are deployed with a virtual IP on an external, public facing IP address. |
| Internal | Internal environments have no public endpoints and are deployed with a virtual IP (VIP) mapped to an internal IP address. The internal endpoint is an Azure internal load balancer (ILB) and IP addresses are issued from the existing VNet's list of private IP addresses. |

### <a name="public-network-access"></a>Public network access (preview)

The public network access setting determines whether your container apps environment is accessible from the public Internet. Whether you can change this setting after creating your environment depends on the environment's virtual IP configuration. The following table shows valid values for public network access, depending on your environment's virtual IP configuration.

| Virtual IP | Supported public network access | Description |
|--|--|--|
| External | `Enabled`, `Disabled`  | The container apps environment was created with an Internet-accessible endpoint. The public network access setting determines whether traffic is accepted through the public endpoint or only through private endpoints, and the public network access setting can be changed after creating the environment. |
| Internal | `Disabled` | The container apps environment was created without an Internet-accessible endpoint. The public network access setting can't be changed to accept traffic from the Internet. |

In order to create private endpoints on your Azure Container App environment, public network access must be set to `Disabled`.

Azure networking policies are supported with the public network access flag.

## Inbound features

|Feature  |Learn how to  |
|---------|---------|
|[Ingress](ingress-overview.md)<br><br>[Configure ingress](ingress-how-to.md) | Control the routing of external and internal traffic to your container app. |
|[IP restrictions](ip-restrictions.md) | Restrict inbound traffic to your container app by IP address. |
|[Client certificate authentication](client-certificate-authorization.md) | Configure client certificate authentication (also known as mutual TLS or mTLS) for your container app. |
|[Traffic splitting](traffic-splitting.md)<br><br>[Blue/Green deployment](blue-green-deployment.md) | Split incoming traffic between active revisions of your container app. |
|[Session affinity](sticky-sessions.md) | Route all requests from a client to the same replica of your container app. |
|[Cross origin resource sharing (CORS)](cors.md) | Enable CORS for your container app, which allows requests made through the browser to a domain that doesn't match the page's origin. |
|[Virtual networks](custom-virtual-networks.md) | Configure the VNet for your container app environment. |
|[DNS](dns.md) | Configure DNS for your container app environment's VNet. |
|[Private endpoint](how-to-use-private-endpoint.md) (preview) | Use a private endpoint to securely access your Azure Container App without exposing it to the public Internet. |
|[Integrate with Azure Front Door](how-to-integrate-with-azure-front-door.md) (preview) | Connect directly from Azure Front Door to your Azure Container Apps using a private link instead of the public internet. |

## Outbound features

|Feature  |Learn how to  |
|---------|---------|
|[Using Azure Firewall](using-azure-firewall.md) | Use Azure Firewall to control outbound traffic from your container app. |
|[Securing a existing VNet with an NSG](firewall-integration.md) | Secure your container app environment's VNet with a Network Security Group (NSG). |

## Environment security

:::image type="content" source="media/networking/locked-down-network.png" alt-text="Diagram of how to fully lock down your network for Container Apps.":::

You can fully secure your ingress and egress networking traffic workload profiles environment by taking the following actions:

- Create your internal container app environment in a workload profiles environment. For steps, refer to [Manage workload profiles with the Azure CLI](./workload-profiles-manage-cli.md#create).

- Integrate your Container Apps with an [Application Gateway](./waf-app-gateway.md).

- Configure UDR to route all traffic through [Azure Firewall](./user-defined-routes.md).

### <a name="private-endpoint"></a>Private endpoint (preview)

Azure private endpoint enables clients located in your private network to securely connect to your Azure Container Apps environment through Azure Private Link. A private link connection eliminates exposure to the public internet. Private endpoints use a private IP address in your Azure virtual network address space. 

This feature is supported for both Consumption and Dedicated plans in workload profile environments.

#### Tutorials
- To learn more about how to configure private endpoints in Azure Container Apps, see the [Use a private endpoint with an Azure Container Apps environment](how-to-use-private-endpoint.md) tutorial.
- Private link connectivity with Azure Front Door is supported for Azure Container Apps. Refer to [create a private link with Azure Front Door](how-to-integrate-with-azure-front-door.md) for more information.

#### Considerations
- Private endpoints on Azure Container Apps only support inbound HTTP traffic. TCP traffic isn't supported.
- To use a private endpoint with a custom domain and an *Apex domain* as the *Hostname record type*, you must configure a private DNS zone with the same name as your public DNS. In the record set, configure your private endpoint's private IP address instead of the container app environment's IP address. When you configure your custom domain with CNAME, the setup is unchanged. For more information, see [Set up custom domain with existing certificate](custom-domains-certificates.md).
- Your private endpoint's VNet can be separate from the VNet integrated with your container app.
- You can add a private endpoint to both new and existing workload profile environments.

In order to connect to your container apps through a private endpoint, you must configure a private DNS zone.

| Service | subresource | Private DNS zone name |
|--|--|--|
| Azure Container Apps (Microsoft.App/ManagedEnvironments) | managedEnvironment | privatelink.{regionName}.azurecontainerapps.io |

You can also [use private endpoints with a private connection to Azure Front Door](how-to-integrate-with-azure-front-door.md) in place of Application Gateway. This feature is in preview.

## Tutorials

|Tutorial  |Learn about how to |
|---------|---------|
|[Use a virtual network](vnet-custom.md) | Use a virtual network. |
|[Configure WAF Application Gateway](waf-app-gateway.md) | Configure a WAF application gateway. |
|[Enable User Defined Routes (UDR)](user-defined-routes.md) | Enable user defined routes (UDR). |
|[Secure an existing VNet with an NSG](firewall-integration.md) | Secure your container app environment's VNet with a Network Security Group (NSG). |
|[Use Mutual Transport Layer Security (mTLS)](mtls.md) | Build an mTLS application in Azure Container Apps. |
|[Use a private endpoint](how-to-use-private-endpoint.md) (preview) | Use a private endpoint to securely access your Azure Container App without exposing it to the public Internet. |
|[Integrate with Azure Front Door](how-to-integrate-with-azure-front-door.md) (preview) | Connect directly from Azure Front Door to your Azure Container Apps using a private link instead of the public internet. |

## Next steps

- [Networking configuration in Azure Container Apps environment](networking-configuration.md)
