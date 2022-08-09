---
title:  Expose applications to the internet from a public network
description: This article describes how to expose applications to the internet from a public network.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: how-to
ms.date: 08/09/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
ms.devlang: azurecli
---

# Expose applications on Azure Spring Apps to the internet from a public network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

This article describes how to expose applications on Azure Spring Apps to the internet from a public network.

You can expose application to the internet with TLS Termination or end-to-end TLS using Application Gateway, as described in [Expose applications to the internet with TLS Termination at Application Gateway](./expose-apps-gateway-tls-termination.md) and [Expose applications with end-to-end TLS in a virtual network](./expose-apps-gateway-end-to-end-tls.md). These approaches work well, but Application Gateway can involve a complicated setup and extra expense.

If you don't want to use Application Gateway for advanced operations, you can expose your applications to the internet with one click on Azure portal or one command on the Azure command using the approach described in this article. The only extra expense is a standard public IP for one Azure Spring Apps service, no matter how many apps you want to expose.

## Prerequisites

- An Azure Spring Apps service instance deployed in a virtual network and an app created in it. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md).

## Assign public FQDN for your application in vnet injection instance

After following the steps in  [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md), you can assign a public FQDN for your application.

#### [Portal](#tab/azure-portal)

1. Select the Azure Spring Apps service instance deployed in your virtual network, and then open the **Apps** tab in the menu on the left.

1. Select the application to show the **Overview** page.

1. Select **Assign Public Endpoint** to assign a public FQDN to your application. Assigning an FQDN can take a few minutes.

   :::image type="content" source="media/how-to-access-app-from-internet-virtual-network/assign-public-endpoint.png" alt-text="Screenshot of Azure portal showing how to assign a public FQDN to your application." lightbox="media/how-to-access-app-from-internet-virtual-network/assign-public-endpoint.png":::

The assigned public FQDN (labeled **URL**) is now available. It can only be accessed within the public network.

#### [CLI](#tab/azure-CLI)

Update your app to assign an public endpoint to it. Customize the value of your app name based on your real environment.

```azurecli
SPRING_CLOUD_APP='your spring cloud app'
az spring app update \
    --resource-group $RESOURCE_GROUP \
    --name $SPRING_CLOUD_APP \
    --service $SPRING_CLOUD_NAME \
    --assign-public-endpoint true
```

## Access the application from both inside and outside the virtual network using the Public URL

To make the engineering work much easier, we provide the ability to let the **public URL** could be accessed both inside or outside the virtual network. To achieve that, follow [Access your application in a private network](./access-app-virtual-network.md) to bind the domain *.private.azuremicroservices.io to the service runtime Subnet private IP address in your private dns zone but keep the **Assign Endpoint** in disable state. Under that condition, the **public URL** could used to access the app from both inside and outside the virtual network. 

## Secure the traffic to the public endpoint

To ensure the security of your applications when you expose public endpoint for them, we strongly recommend you to sufficiently secure the endpoint by filtering network traffic to your service with network security group, review [Tutorial: Filter network traffic with a network security group using the Azure portal](../virtual-network/tutorial-filter-network-traffic.md#create-a-network-security-group). A network security group contains security rules that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources. For each rule, you can specify source and destination, port, and protocol.

> [!NOTE]
>
> If you could not access your application in vnet injection instance from internet after you have assigned a public FQDN, please check your network security group first to see whether you have allowed such inbound traffic.
>

## Next steps

- [Exposing applications with end-to-end TLS in a virtual network](./expose-apps-gateway-end-to-end-tls.md)
- [Troubleshooting Azure Spring Apps in VNET](./troubleshooting-vnet.md)
- [Customer Responsibilities for Running Azure Spring Apps in VNET](./vnet-customer-responsibilities.md)