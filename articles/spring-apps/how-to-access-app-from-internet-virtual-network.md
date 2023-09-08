---
title: Expose applications on Azure Spring Apps to the internet from a public network
description: Describes how to expose applications on Azure Spring Apps to the internet from a public network.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 08/09/2022
ms.custom: devx-track-java, event-tier1-build-2022
ms.devlang: azurecli
---

# Expose applications on Azure Spring Apps to the internet from a public network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

This article describes how to expose applications on Azure Spring Apps to the internet from a public network.

You can expose applications to the internet with TLS Termination or end-to-end TLS using Application Gateway. These approaches are described in [Expose applications to the internet with TLS Termination at Application Gateway](./expose-apps-gateway-tls-termination.md) and [Expose applications with end-to-end TLS in a virtual network](./expose-apps-gateway-end-to-end-tls.md). These approaches work well, but Application Gateway can involve a complicated setup and extra expense.

If you don't want to use Application Gateway for advanced operations, you can expose your applications to the internet with one click using the Azure portal or one command using the Azure CLI. The only extra expense is a standard public IP for one Azure Spring Apps service instance, regardless of how many apps you want to expose.

## Prerequisites

- An Azure Spring Apps service instance deployed in a virtual network and an app created in it. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md).

## Assign a public fully qualified domain name (FQDN) for your application in a virtual network injection instance


### [Azure portal](#tab/azure-portal)

Use the following steps to assign a public FQDN for your application.

1. Select the Azure Spring Apps service instance deployed in your virtual network, and then open the **Apps** tab in the menu on the left.

1. Select the application to show the **Overview** page.

1. Select **Assign Public Endpoint** to assign a public FQDN to your application. Assigning an FQDN can take a few minutes.

   :::image type="content" source="media/how-to-access-app-from-internet-virtual-network/assign-public-endpoint.png" alt-text="Screenshot of Azure portal showing how to assign a public FQDN to your application." lightbox="media/how-to-access-app-from-internet-virtual-network/assign-public-endpoint.png":::

The assigned public FQDN (labeled **URL**) is now available. It can only be accessed within the public network.

### [Azure CLI](#tab/azure-CLI)

Use the following command to assign a public endpoint to your app. Be sure to replace the placeholders with your actual values.

```azurecli
az spring app update \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-instance-name> \
    --assign-public-endpoint true
```

---

## Use a public URL to access your application from both inside and outside the virtual network

You can use a public URL to access your application both inside and outside the virtual network. Follow the steps in [Access your application in a private network](./access-app-virtual-network.md) to bind the domain `.private.azuremicroservices.io` to the service runtime Subnet private IP address in your private DNS zone while keeping the **Assign Endpoint** in a disable state. You can then access the app using the **public URL** from both inside and outside the virtual network. 

## Secure traffic to the public endpoint

To ensure the security of your applications when you expose a public endpoint for them, secure the endpoint by filtering network traffic to your service with a network security group. For more information, see [Tutorial: Filter network traffic with a network security group using the Azure portal](../virtual-network/tutorial-filter-network-traffic.md). A network security group contains security rules that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources. For each rule, you can specify source and destination, port, and protocol.

> [!NOTE]
> If you couldn't access your application in a virtual network injection instance from internet after you have assigned a public FQDN, check your network security group first to see whether you have allowed such inbound traffic.

## Next steps

- [Expose applications with end-to-end TLS in a virtual network](./expose-apps-gateway-end-to-end-tls.md)
- [Troubleshooting Azure Spring Apps in virtual networks](./troubleshooting-vnet.md)
- [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md)
