---
title: Access applications using Azure Spring Apps Standard consumption plan im a virtual network
description: Learn how to access applications in a virtual network that are using the Azure Spring Apps Standard consumption plan.
author: karlerickson
ms.author: haojianzhong
ms.service: spring-apps
ms.topic: how-to
ms.date: 03/14/2023
ms.custom: devx-track-java
---

# Access applications using Azure Spring Apps Standard consumption plan in a virtual network

This article describes how to access your application in a virtual network using Azure Spring Apps Standard Consumption plan.

When you an Azure Container Apps environment in an existing virtual network, all the apps inside the environment can be accessed only within that virtual network. For more information see [Provide a virtual network to an internal Azure Container Apps environments](/azure/container-apps/vnet-custom-internal?tabs=bash&pivots=azure-portal).

## Create a private DNS zone

Create a private DNS zone named as the Container App Environment’s default domain `<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io`, with an A record.

Use the following command to get the default domain of Azure Container Apps Environment.

```azurecli
az containerapp env show \
    --name <manage environment name> \
    --resource-group <resource group> \
    --query 'properties.defaultDomain'
```

Use the following command to create a Private DNS Zone for applications in the virtual network.

```azurecli
az network private-dns zone create \
    --resource-group <resource group> \
    --name <private dns zone name>
```

## Create an A record

Create an A record that contains the name `<DNS Suffix>` and the static IP address of the Azure Container Apps Environment.

Get the static IP address for an Azure Container Apps Environment.

```azurecli
az containerapp env show \
    --name <manage environment name> \
    --resource-group <resource group> \
    --query 'properties.staticIp'
```

Get the A record:

```azurecli
az network private-dns record-set a add-record \
    --resource-group <resource group> \
    --zone-name <private dns zone name> \
    --record-set-name '*' \
    --ipv4-address <static ip>
```

## Link the virtual network

Create a virtual network link to link to the private DNS zone of the virtual network.

```azurecli
az network private-dns link vnet create \
    --resource-group <resource group> \
    --name <link name> \
    --zone-name <private dns zone name> \
    --virtual-network <name of the virtual network> \
    --registration-enabled false
```

## Access the application

Now you can access the spring application within your virtual network, using the url of the spring application.

## Next steps
