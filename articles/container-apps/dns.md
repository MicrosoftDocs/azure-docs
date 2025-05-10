---
title: Configure a DNS for virtual networks in Azure Container Apps environments
description: Learn how to configure DNS for virtual networks in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic:  conceptual
ms.date: 10/03/2024
ms.author: cshoe
---

# DNS for virtual networks in Azure Container Apps environments

Configuring DNS in your Azure Container Apps environment's virtual network is important for the following reasons:

- DNS lets your container apps resolve domain names to IP addresses. This allows them to discover and communicate with services within and outside the virtual network. This includes services like Azure Application Gateway, Network Security Groups, and private endpoints.

- Custom DNS settings enhance security by letting you control and monitor the DNS queries made by your container apps. This helps to identify and mitigate potential security threats, by ensuring your container apps only communicate with trusted domains.

## Custom DNS

If your VNet uses a custom DNS server instead of the default Azure-provided DNS server, configure your DNS server to forward unresolved DNS queries to `168.63.129.16`. [Azure recursive resolvers](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) uses this IP address to resolve requests. When configuring your network security group (NSG) or firewall, don't block the `168.63.129.16` address, otherwise, your Container Apps environment won't function correctly.

## VNet-scope ingress

If you plan to use VNet-scope [ingress](ingress-overview.md) in an internal environment, configure your domains in one of the following ways:

1. **Non-custom domains**: If you don't plan to use a custom domain, create a private DNS zone that resolves the Container Apps environment's default domain to the static IP address of the Container Apps environment. You can use [Azure Private DNS](../dns/private-dns-overview.md) or your own DNS server.  If you use Azure Private DNS, create a private DNS Zone named as the Container App environment’s default domain (`<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io`), with an `A` record. The `A` record contains the name `*<DNS Suffix>` and the static IP address of the Container Apps environment. For more information see [Create and configure an Azure Private DNS zone](waf-app-gateway.md#create-and-configure-an-azure-private-dns-zone).

1. **Custom domains**: If you plan to use custom domains and are using an external Container Apps environment, use a publicly resolvable domain to [add a custom domain and certificate](./custom-domains-certificates.md#add-a-custom-domain-and-certificate) to the container app. If you are using an internal Container Apps environment, there is no validation for the DNS binding, as the cluster is only available from within the virtual network. Additionally, create a private DNS zone that resolves the apex domain to the static IP address of the Container Apps environment. You can use [Azure Private DNS](../dns/private-dns-overview.md) or your own DNS server. If you use Azure Private DNS, create a Private DNS Zone named as the apex domain, with an `A` record that points to the static IP address of the Container Apps environment.

The static IP address of the Container Apps environment is available in the Azure portal in  **Custom DNS suffix** of the container app page or using the Azure CLI `az containerapp env list` command.

## Next steps

> [!div class="nextstepaction"]
> [Use a virtual network](vnet-custom.md)
