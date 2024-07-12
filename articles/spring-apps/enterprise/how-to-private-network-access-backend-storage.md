---
title: Configure private network access for backend storage in your virtual network (Preview)
description: Learn how to configure private network access to backend storage in your virtual network.
author: KarlErickson
ms.author: haozhan
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/01/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Configure private network access for backend storage in your virtual network (Preview)

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard ✔️ Enterprise

This article explains how to configure private network access to backend storage for your application within your virtual network.

When you deploy an application in an Azure Spring Apps service instance with virtual network injection, the service instance relies on backend storage for housing associated assets, including JAR files and logs. While the default configuration routes traffic to this backend storage over the public network, you can turn on the private storage access feature. This feature enables you to direct the traffic through your private network, enhancing security, and potentially improving performance.

> [!NOTE]
> This feature applies to an Azure Spring Apps virtual network injected service instance only.
>
> Before you enable this feature for your Azure Spring Apps service instance, ensure that there are at least two available IP addresses in the service runtime subnet.
>
> Enabling or disabling this feature changes the DNS resolution to the backend storage. For a short period of time, you might experience deployments that fail to establish a connection to the backend storage or are unable to resolve their endpoint during the update.
>
> After you enable this feature, the backend storage is only accessible privately, so you have to deploy your application within the virtual network.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.56.0 or higher.
- An existing Azure Spring Apps service instance deployed to a virtual network. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md).

## Enable private storage access when you create a new Azure Spring Apps instance

When you create an Azure Spring Apps instance in the virtual network, use the following command to pass the argument `--enable-private-storage-access true` to enable private storage access. For more information, see [Deploy Azure Spring Apps in a virtual network](how-to-deploy-in-azure-virtual-network.md).

```azurecli
az spring create \
    --resource-group "<resource-group>" \
    --name "<Azure-Spring-Apps-instance-name>" \
    --vnet "<virtual-network-name>" \
    --service-runtime-subnet "<service-runtime-subnet>" \
    --app-subnet "<apps-subnet>" \
    --location "<location>" \
    --enable-private-storage-access true
```

One more resource group is created in your subscription to host the private link resources for the Azure Spring Apps instance. This resource group is named `ap-res_{service instance name}_{service instance region}`.

There are two sets of private link resources deployed in the resource group, each composed of the following Azure resources:

- A private endpoint that represents the backend storage account's private endpoint.
- A network interface (NIC) that maintains a private IP address within the service runtime subnet.
- A private DNS zone that's deployed for your virtual network, with a DNS A record also created for the storage account within this DNS zone.

> [!IMPORTANT]
> The resource groups are fully managed by the Azure Spring Apps service. Don't manually delete or modify any resource inside these resource groups.

## Enable or disable private storage access for an existing Azure Spring Apps instance

Use the following command to update an existing Azure Spring Apps instance to enable or disable private storage access:

```azurecli
az spring update \
    --resource-group "<resource-group>" \
    --name "<Azure-Spring-Apps-instance-name>" \
    --enable-private-storage-access <true-or-false>
```

## Extra costs

The Azure Spring Apps instance doesn't incur charges for this feature. However, you're billed for the private link resources hosted in your subscription that support this feature. For more information, see [Azure Private Link Pricing](https://azure.microsoft.com/pricing/details/private-link/) and [Azure DNS Pricing](https://azure.microsoft.com/pricing/details/dns/).

## Use custom DNS servers

If you're using a custom domain name system (DNS) server and the Azure DNS IP `168.63.129.16` isn't configured as the upstream DNS server, you must manually bind all the DNS records of the private DNS zones shown in the resource group `ap-res_{service instance name}_{service instance region}` to resolve the private IP addresses.

## Next step

[Customer responsibilities for running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md)
