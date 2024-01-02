---
title: Access an app in Azure Spring Apps in a virtual network
description: Shows how to access an app in Azure Spring Apps in a virtual network.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 11/30/2021
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
ms.devlang: azurecli
---

# Access an app in Azure Spring Apps in a virtual network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article explains how to access an endpoint for your application in a private network.

When you assign an endpoint on an application in an Azure Spring Apps service instance deployed in your virtual network, the endpoint uses a private fully qualified domain name (FQDN). The domain is only accessible in the private network. Apps and services use the application endpoint. They include the *Test Endpoint* described in the [View apps and deployments](./how-to-staging-environment.md#view-apps-and-deployments) section of [Set up a staging environment in Azure Spring Apps](./how-to-staging-environment.md). *Log streaming*, described in [Stream Azure Spring Apps app logs in real-time](./how-to-log-streaming.md), also works only within the private network.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- (Optional) [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.
- An existing application in an Azure Spring Apps service instance deployed to a virtual network. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md).

## Find the IP for your application

### [Azure portal](#tab/azure-portal)

Use the following steps to find the IP address for your application.

1. Go to the Azure Spring Apps service **Networking** page.

1. Select the **Vnet injection** tab.

1. In the **General info** section, find **Endpoint** and copy the **IP Address** value. The example in the following screenshot uses the IP address `10.0.1.6`:

   :::image type="content" source="media/spring-cloud-access-app-vnet/find-ip-address.png" alt-text="Screenshot of the Azure portal that shows the Vnet injection Endpoint information." lightbox="media/spring-cloud-access-app-vnet/find-ip-address.png":::

### [Azure CLI](#tab/azure-CLI)

Use the following steps to initialize the local environment and find the IP address for your application.

1. Use the following commands to define various environment variables. Be sure to replace the placeholders with your actual values.

   ```azurecli
   export SUBSCRIPTION='<subscription-ID>'
   export RESOURCE_GROUP='<resource-group-name>'
   export AZURE_SPRING_APPS_INSTANCE_NAME='<Azure-Spring-Apps-instance-name>'
   export VIRTUAL_NETWORK_NAME='<Azure-Spring-Apps-virtual-network-name>'
   export APP_NAME='<application-name>'
   ```

1. Use the following commands to sign in to the Azure CLI and choose your active subscription:

   ```azurecli
   az login
   az account set --subscription ${SUBSCRIPTION}
   ```

1. Use the following commands to find the IP address for your application.

   ```azurecli
   export SERVICE_RUNTIME_RG=$(az spring show \
       --resource-group $RESOURCE_GROUP \
       --name $AZURE_SPRING_APPS_INSTANCE_NAME \
       --query "properties.networkProfile.serviceRuntimeNetworkResourceGroup" \
       --output tsv)
   export IP_ADDRESS=$(az network lb frontend-ip list \
       --lb-name kubernetes-internal \
       --resource-group $SERVICE_RUNTIME_RG \
       --query "[0].privateIPAddress" \
       --output tsv)
   echo $IP_ADDRESS
   ```

---

## Add a DNS for the IP

If you have your own DNS solution for your virtual network, like Active Directory Domain Controller, Infoblox, or another, you need to point the domain `*.private.azuremicroservices.io` to the [IP address](#find-the-ip-for-your-application). Otherwise, use the following instructions to create an **Azure Private DNS Zone** in your subscription to translate/resolve the private fully qualified domain name (FQDN) to its IP address.

> [!NOTE]
> If you're using Microsoft Azure operated by 21Vianet, be sure to replace `private.azuremicroservices.io` with `private.microservices.azure.cn` in this article. For more information, see the [Check Endpoints in Azure](/azure/china/resources-developer-guide#check-endpoints-in-azure) section of the [Azure China developer guide](/azure/china/resources-developer-guide).

## Create a private DNS zone

### [Azure portal](#tab/azure-portal)

Use the following steps to create a private DNS zone for an application in the private network:

1. Open the Azure portal. Using the search box, search for *Private DNS zones*. Select **Private DNS zones** from the search results.

1. On the **Private DNS zones** page, select **Add**.

1. Fill out the form on the **Create Private DNS zone** page. Enter *private.azuremicroservices.io* as the **Name** of the zone.

1. Select **Review + Create**.

1. Select **Create**.

### [Azure CLI](#tab/azure-CLI)

Use the following command to create the private DNS zone:

```azurecli
az network private-dns zone create \
    --resource-group $RESOURCE_GROUP \
    --name private.azuremicroservices.io
```

---

It might take a few minutes to create the zone.

## Link the virtual network

To link the private DNS zone to the virtual network, you need to create a virtual network link.

### [Azure portal](#tab/azure-portal)

Use the following steps to link the private DNS zone you created to the virtual network holding your Azure Spring Apps service:

1. Select the private DNS zone resource you created - for example, **private.azuremicroservices.io**.

1. Select **Virtual network links**, and then select **Add**.

1. For **Link name**, enter *azure-spring-apps-dns-link*.

1. For **Virtual network**, select the virtual network you created previously.

   :::image type="content" source="media/spring-cloud-access-app-vnet/add-virtual-network-link.png" alt-text="Screenshot of the Azure portal that shows the Add virtual network link page." lightbox="media/spring-cloud-access-app-vnet/add-virtual-network-link.png":::

1. Select **OK**.

### [Azure CLI](#tab/azure-CLI)

Use the following command to link the private DNS zone you created to the virtual network holding your Azure Spring Apps service:

```azurecli
az network private-dns link vnet create \
    --resource-group $RESOURCE_GROUP \
    --name azure-spring-apps-dns-link \
    --zone-name private.azuremicroservices.io \
    --virtual-network $VIRTUAL_NETWORK_NAME \
    --registration-enabled false
```

---

## Create DNS record

You must create an "A" type record in the private DNS zone.

### [Azure portal](#tab/azure-portal)

Use the following steps to use the private DNS zone to translate/resolve DNS.

1. Select the private DNS zone resource you created - for example, **private.azuremicroservices.io**.

1. Select **Record set**.

1. In **Add record set**, enter or select the following information:

   | Setting    | Value                                                                                                               |
   |------------|---------------------------------------------------------------------------------------------------------------------|
   | Name       | Enter *\**.                                                                                                         |
   | Type       | Select **A**.                                                                                                       |
   | TTL        | Enter *1*.                                                                                                          |
   | TTL unit   | Select **Hours**.                                                                                                   |
   | IP address | Enter the [IP address](#find-the-ip-for-your-application). The following screenshot uses the IP address *10.1.0.7*. |

   :::image type="content" source="media/spring-cloud-access-app-vnet/private-dns-zone-add-record.png" alt-text="Screenshot of the Azure portal that shows the Add record set page." lightbox="media/spring-cloud-access-app-vnet/private-dns-zone-add-record.png":::

1. Select **OK**.

### [Azure CLI](#tab/azure-CLI)

Use the following commands to create the A record in your DNS zone:

```azurecli
az network private-dns record-set a add-record \
    --resource-group $RESOURCE_GROUP \
    --zone-name private.azuremicroservices.io \
    --record-set-name '*' \
    --ipv4-address $IP_ADDRESS
```

---

## Assign a private FQDN for your application

You can assign a private FQDN for your application after you deploy Azure Spring Apps in a virtual network. For more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md).

### [Azure portal](#tab/azure-portal)

Use the following steps to assign a private FQDN:

1. Select the Azure Spring Apps service instance deployed in your virtual network, and open the **Apps** tab.

1. Select the application to open the **Overview** page.

1. Select **Assign Endpoint** to assign a private FQDN to your application. Assigning an FQDN can take a few minutes.

   :::image type="content" source="media/spring-cloud-access-app-vnet/assign-private-endpoint.png" alt-text="Screenshot of the Azure portal that shows the Overview page with Assign endpoint highlighted." lightbox="media/spring-cloud-access-app-vnet/assign-private-endpoint.png":::

1. The assigned private FQDN (labeled **URL**) is now available. You can only access the URL within the private network, but not on the internet.

### [Azure CLI](#tab/azure-CLI)

Use the following command to assign an endpoint to your application:

```azurecli
az spring app update \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --service $AZURE_SPRING_APPS_INSTANCE_NAME \
    --assign-endpoint true
```

---

## Access the application's private FQDN

After the assignment, you can access the application's private FQDN in the private network. For example, you can create a jumpbox machine in the same virtual network or in a peered virtual network. Then, on that jumpbox or virtual machine, you can access the private FQDN.

:::image type="content" source="media/spring-cloud-access-app-vnet/access-private-endpoint.png" alt-text="Screenshot of the sample application in a browser window with the private FQDN highlighted in the URL." lightbox="media/spring-cloud-access-app-vnet/access-private-endpoint.png":::

## Clean up resources

If you plan to continue working with subsequent articles, you might want to leave these resources in place. When you no longer need them, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using the Azure CLI, use the following command:

```azurecli
az group delete --name $RESOURCE_GROUP
```

## Next steps

- [Expose applications with end-to-end TLS in a virtual network](./expose-apps-gateway-end-to-end-tls.md)
- [Troubleshooting Azure Spring Apps in virtual networks](./troubleshooting-vnet.md)
- [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md)
