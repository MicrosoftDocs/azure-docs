---
title: Configure private endpoints and DNS for virtual networks in Azure Container Apps environments
description: Learn how to configure private endpoints and DNS for virtual networks in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  conceptual
ms.date: 06/16/2025
ms.author: cshoe
---

# Private endpoints and DNS for virtual networks in Azure Container Apps environments

Azure private endpoint enables clients located in your private network to securely connect to your Azure Container Apps environment through Azure Private Link. A private link connection eliminates exposure to the public internet. Private endpoints use a private IP address in your Azure virtual network address space and is typically configured with a private DNS zone.

Private endpoints are supported for both Consumption and Dedicated plans in workload profile environments.

### Billing

Private endpoints incur additional charges. When you enable a private endpoint in Azure Container Apps, you're billed for the following:

1. **Azure Private Link** - Billing for the [Azure Private Link resource itself](https://azure.microsoft.com/pricing/details/private-link/).
1. **Azure Container Apps** - Billing for the dedicated private endpoint infrastructure for Azure Container Apps which appears as a separate **"Dedicated Plan Management"** charge and applies to both Consumption and Dedicated plans.

### Tutorials
- To learn more about how to configure private endpoints in Azure Container Apps, see the [Use a private endpoint with an Azure Container Apps environment](how-to-use-private-endpoint.md) tutorial.
- Private link connectivity with Azure Front Door is supported for Azure Container Apps. Refer to [create a private link with Azure Front Door](./how-to-integrate-with-azure-front-door.md) for more information.

### Considerations

- To use a private endpoint, you must disable [public network access](networking.md#public-network-access). By default, public network access is enabled, which means private endpoints are disabled.
- To use a private endpoint with a custom domain and an *Apex domain* as the *Hostname record type*, you must configure a private DNS zone with the same name as your public DNS. In the record set, configure your private endpoint's private IP address instead of the container app environment's IP address. When you configure your custom domain with CNAME, the setup is unchanged. For more information, see [Set up custom domain with existing certificate](custom-domains-certificates.md).
- Your private endpoint's VNet can be separate from the VNet integrated with your container app.
- You can add a private endpoint to both new and existing workload profile environments.

In order to connect to your container apps through a private endpoint, you must configure a private DNS zone.

| Service | subresource | Private DNS zone name |
|--|--|--|
| Azure Container Apps (Microsoft.App/ManagedEnvironments) | managedEnvironment | privatelink.{regionName}.azurecontainerapps.io |

You can also [use private endpoints with a private connection to Azure Front Door](how-to-integrate-with-azure-front-door.md) in place of Application Gateway.

## DNS

Configuring DNS in your Azure Container Apps environment's virtual network is important for the following reasons:

- DNS lets your container apps resolve domain names to IP addresses. This allows them to discover and communicate with services within and outside the virtual network. This includes services like Azure Application Gateway, Network Security Groups, and private endpoints.

- Custom DNS settings enhance security by letting you control and monitor the DNS queries made by your container apps. This helps to identify and mitigate potential security threats, by ensuring your container apps only communicate with trusted domains.

### Custom DNS

If your VNet uses a custom DNS server instead of the default Azure-provided DNS server, configure your DNS server to forward unresolved DNS queries to `168.63.129.16`. [Azure recursive resolvers](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) uses this IP address to resolve requests. When configuring your network security group (NSG) or firewall, don't block the `168.63.129.16` address, otherwise, your Container Apps environment won't function correctly.

### VNet-scope ingress

If you plan to use VNet-scope [ingress](ingress-overview.md) in an internal environment, configure your domains in one of the following ways:

1. **Non-custom domains**: If you don't plan to use a custom domain, create a private DNS zone that resolves the Container Apps environment's default domain to the static IP address of the Container Apps environment. You can use [Azure Private DNS](../dns/private-dns-overview.md) or your own DNS server.  If you use Azure Private DNS, create a private DNS Zone named as the Container App environment’s default domain (`<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io`), with an `A` record. The `A` record contains the name `*<DNS Suffix>` and the static IP address of the Container Apps environment. For more information, see [Create and configure an Azure Private DNS zone](waf-app-gateway.md#create-and-configure-an-azure-private-dns-zone).

1. **Custom domains**: If you plan to use custom domains and are using an external Container Apps environment, use a publicly resolvable domain to [add a custom domain and certificate](./custom-domains-certificates.md#add-a-custom-domain-and-certificate) to the container app. If you're using an internal Container Apps environment, there is no validation for the DNS binding, as the cluster is only available from within the virtual network. Additionally, create a private DNS zone that resolves the apex domain to the static IP address of the Container Apps environment. You can use [Azure Private DNS](../dns/private-dns-overview.md) or your own DNS server. If you use Azure Private DNS, create a Private DNS Zone named as the apex domain, with an `A` record that points to the static IP address of the Container Apps environment.

The static IP address of the Container Apps environment is available in the Azure portal in  **Custom DNS suffix** of the container app page or using the Azure CLI `az containerapp env list` command.

## Next steps

> [!div class="nextstepaction"]
> [Use a virtual network](vnet-custom.md)
