---
title:  Configure private network access for backend storage in your virtual network
description: Learn how to configure private network access to backend storage in your virtual network
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 01/10/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Configure private network access for backend storage in your virtual network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard ✔️ Enterprise

This article explains how to configure private network access to backend storage for your application within your virtual network.

When deploying an application within an Azure Spring Apps VNet injection service instance, the Azure Spring Apps service instance utilizes backend storage to store related assets (such as JAR files and logs). By default, traffic to the backend storage occurs over the public network. You can modify this behavior to route traffic through your private network instead.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a free account before you begin.
- Azure CLI version 2.XX.0 or higher.
- An existing application in an Azure Spring Apps service instance deployed to a virtual network. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md).

## Enable Private Storage Access when creating a new Azure Spring Apps instance

Use the following command to enable private storage access when you create an Azure Spring Apps instance in the virtual network.

```azurecli
az spring create \
    --resource-group "$RESOURCE_GROUP" 
    --name "$AZURE_SPRING_APPS_INSTANCE_NAME" 
    --vnet "$VIRTUAL_NETWORK_NAME"
    --service-runtime-subnet "$SERVICE_RUNTIME_SUBNET" 
    --app-subnet "$APPS_SUBNET"
    --location "$LOCATION"
    --enable-private-storage-access true
```

After the deployment, one more resource group is created in your subscription to host the private link resources for the Azure Spring Apps instance. The resource group is named as `ap-res_{service instance name}_{service instance region}`.

   :::image type="content" source="media/how-to-private-network-access-backend-storage/ap-res-rg.png" alt-text="Screenshot of the Azure portal Resource Group page showing the private link resource details." lightbox="media/how-to-private-network-access-backend-storage/ap-res-rg.png":::

> [!IMPORTANT]
> The resource groups are fully managed by the Azure Spring Apps service. Do *not* manually delete or modify any resource inside.

## Enable or Disable Private Storage Access for an existing Azure Spring Apps instance

Use the following command to update an existing Azure Spring Apps instance to enable or disable private storage access.

```azurecli
az spring update \
    --resource-group "$RESOURCE_GROUP" 
    --name "$AZURE_SPRING_APPS_INSTANCE_NAME" 
    --enable-private-storage-access true/false
```

> [!IMPORTANT]
> Due to the backend storage is accessed privately after enabling this feature, you should deploy your application within your virtual network.

## FAQs

### IP Address may be Exhausted in Smaller Subnet Ranges

To enable private access to underlying storage within your virtual network, the Azure Spring Apps service requires four IP addresses allocated from the service runtime subnet. Please ensure that there are at least four available IP addresses in the service runtime subnet before enabling this feature.

### Is This Feature Billable?

The Azure Spring Apps instance does not incur charges for this feature. However, you will be billed for the private link resources hosted in your subscription that support this feature. For more details, refer to the [Azure Private Link Pricing](https://azure.microsoft.com/en-us/pricing/details/private-link/).

### Using Custom DNS Servers

If you are using a custom DNS server and the Azure DNS IP `168.63.129.16` is not configured as the upstream DNS server, you should manually bind all the DNS records of private DNS zones shown in the resource group `ap-res_{service instance name}_{service instance region}` to resolve the private IP addresses.

### Mitigate Possibly Issue caused by DNS cache

We have not observed any obvious downtime caused by DNS cache after enabling or disabling the private storage access feature. If you encounter any issues caused by DNS cache, please try flushing the DNS settings. For more information, see [How to flush DNS settings changes in Azure Spring Apps](how-to-use-flush-dns-settings.md).

## Next steps

- [Customer Responsibilities for Running Azure Spring Apps in VNET](vnet-customer-responsibilities.md)