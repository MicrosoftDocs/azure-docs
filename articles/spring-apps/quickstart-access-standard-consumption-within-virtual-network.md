---
title: Quickstart - Access applications using Azure Spring Apps Standard consumption and dedicated plan in a virtual network
description: Learn how to access applications in a virtual network that are using the Azure Spring Apps Standard consumption and dedicated plan.
author: KarlErickson
ms.author: haojianzhong
ms.service: spring-apps
ms.topic: quickstart
ms.date: 06/21/2023
ms.custom: devx-track-java
---

# Quickstart: Access applications using Azure Spring Apps Standard consumption and dedicated plan in a virtual network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ❌ Basic/Standard ❌ Enterprise

This article describes how to access your application in a virtual network using Azure Spring Apps Standard consumption and dedicated plan.

When you create an Azure Container Apps environment in an existing virtual network, you can access all the apps inside the environment only within that virtual network. In addition, when you create an instance of Azure Spring Apps inside the Azure Container Apps environment, you can access the applications in the Azure Spring Apps instance only from the virtual network. For more information, see [Provide a virtual network to an internal Azure Container Apps environments](../container-apps/vnet-custom-internal.md?tabs=bash&pivots=azure-portal).

## Create a private DNS zone

Create a private DNS zone named as the default domain of the Azure Container Apps environment - `<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io` - with an A record.

Use the following command to get the default domain of Azure Container Apps environment.

```azurecli
az containerapp env show \
    --resource-group <resource-group-name> \
    --name <Azure-Container-Apps-environment-name> \
    --query 'properties.defaultDomain'
```

Use the following command to create a Private DNS Zone for applications in the virtual network.

```azurecli
az network private-dns zone create \
    --resource-group <resource-group-name> \
    --name <private-dns-zone-name>
```

## Create an A record

Create an A record that contains the name `<DNS Suffix>` and the static IP address of the Azure Container Apps environment.

Use the following command to get the static IP address for an Azure Container Apps environment.

```azurecli
az containerapp env show \
    --resource-group <resource-group-name> \
    --name <Azure-Container-Apps-environment-name> \
    --query 'properties.staticIp'
```

Use the following command to create the A record:

```azurecli
az network private-dns record-set a add-record \
    --resource-group <resource-group-name> \
    --zone-name <private-dns-zone-name> \
    --record-set-name '*' \
    --ipv4-address <static-ip>
```

## Link the virtual network

Use the following command to create a virtual network link to the private DNS zone of the virtual network.

```azurecli
az network private-dns link vnet create \
    --resource-group <resource-group-name> \
    --name <link-name> \
    --zone-name <private-dns-zone-name> \
    --virtual-network <virtual-network-name> \
    --registration-enabled false
```

## Access the application

Now you can access an application in an Azure Spring Apps instance within your virtual network, using the URL of the application.

## Clean up resources

Be sure to delete the resources you created in this article when you no longer need them. To delete the resources, just delete the resource group that contains them. You can delete the resource group using the Azure portal. Alternatively, to delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Set up autoscale for applications in Azure Spring Apps Standard consumption and dedicated plan](./quickstart-apps-autoscale-standard-consumption.md)
