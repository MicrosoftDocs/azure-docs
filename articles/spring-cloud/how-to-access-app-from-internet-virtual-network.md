---
title:  "Azure Spring Apps expose applications to the internet"
description: Access app in Azure Spring Apps in a virtual network.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: how-to
ms.date: 11/30/2021
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
ms.devlang: azurecli
---

# Expose applications to the internet easily with Azure Spring Apps feature

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

Azure Spring Apps have already provided articles which explains [how to expose applications to the internet with TLS Termination at Application Gateway](./expose-apps-gateway-tls-termination.md) and [how to expose applications to the internet with end-to-end TLS at Application Gateway](./expose-apps-gateway-end-to-end-tls.md). But the problem is that the application gateway is a bit heavy to some users, it not only requires lots of steps to set up but also needs to pay for extra expense. 

Azure Spring Apps provides a straight foward way for users to expose their applicatiosn to the internet. If you do not want to take the benefit of application gateway to do some advanced operations and only want to expose your applications to the internet, you could just use this feature.

## Prerequisites

- An Azure Spring Apps service instance deployed in a virtual network and an app created in it. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md)

## Assign public FQDN for your application in vnet injection instance

After following the procedure in Deploy Azure Spring Apps in a virtual network, you can assign a public FQDN for your application.

#### [Portal](#tab/azure-portal)

1. Select the Azure Spring Apps service instance deployed in your virtual network, and open the **Apps** tab in the menu on the left.

2. Select the application to show the **Overview** page.

3. Select **Assign Public Endpoint** to assign a public FQDN to your application. Assigning an FQDN can take a few minutes.

    ![Assign public endpoint](media/spring-cloud-access-app-vnet/assign-public-endpoint.png)

4. The assigned public FQDN (labeled **URL**) is now available. It can only be accessed within the public network.

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

## Access the application from both inside and outside the virtual network using the same url

To 

## Secure the traffic to the public endpoint

Azure Spring Apps do not provide ways to secure the public endpoint but we strongly recommend you to sufficiently secure the endpoint with a network security group inbound security rule, review [Tutorial: Filter network traffic with a network security group using the Azure portal](../virtual-network/tutorial-filter-network-traffic.md#create-a-network-security-group).
