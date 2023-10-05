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

When you assign an endpoint to an application in an Azure Spring Apps service instance deployed in your virtual network, the endpoint uses a private fully qualified domain name (FQDN). The domain is only accessible in the private network, whereas apps and services use the application endpoint. *Test Endpoint* and *Log streaming* also works only within the private network.

For more information, see [Stream Azure Spring Apps app logs in real-time](./how-to-log-streaming.md) and the [View apps and deployments](./how-to-staging-environment.md#view-apps-and-deployments) section of [Set up a staging environment in Azure Spring Apps](./how-to-staging-environment.md).

## Find the IP for your application

#### [Azure portal](#tab/azure-portal)

Use the following steps to find the IP address of your application.

1. Go to the Azure Spring Apps service **Networking** page.

1. Select the **Vnet injection** tab.

1. In the **General info** section, find **Endpoint** and copy the **IP Address** value. The following screenshot uses the IP address *10.0.1.6*.

   :::image type="content" source="media/spring-cloud-access-app-vnet/find-ip-address.png" alt-text="Screenshot of the Azure portal that shows the Vnet injection Endpoint information." lightbox="media/spring-cloud-access-app-vnet/find-ip-address.png":::

#### [Azure CLI](#tab/azure-CLI)

Find the IP address for your Spring cloud services. Use the following command to customize the value of your Azure Spring Apps instance name based on your real environment.

```azurecli
export SPRING_CLOUD_NAME='spring-cloud-name'
export SERVICE_RUNTIME_RG=$(az spring show \
    --resource-group $RESOURCE_GROUP \
    --name $SPRING_CLOUD_NAME \
    --query "properties.networkProfile.serviceRuntimeNetworkResourceGroup" \
    --output tsv)
export IP_ADDRESS=$(az network lb frontend-ip list \
    --lb-name kubernetes-internal \
    --resource-group $SERVICE_RUNTIME_RG \
    --query "[0].privateIPAddress" \
    --output tsv)
```

---

## Add a DNS for the IP

If you have your own DNS solution for your virtual network, like Active Directory Domain Controller, Infoblox, or another, you need to point the domain `*.private.azuremicroservices.io` to the [IP address](#find-the-ip-for-your-application). Otherwise, use the following instructions to create an **Azure Private DNS Zone** in your subscription to translate/resolve the private fully qualified domain name (FQDN) to its IP address.

> [!NOTE]
> If you're using Microsoft Azure operated by 21Vianet, be sure to replace `private.azuremicroservices.io` with `private.microservices.azure.cn` in this article. For more information, see the [Check Endpoints in Azure](/azure/china/resources-developer-guide#check-endpoints-in-azure) section of [Azure China developer guide](/azure/china/resources-developer-guide).

## Create a private DNS zone

Use the following steps to create a private DNS zone for an application in the private network.

#### [Azure portal](#tab/azure-portal)

1. Open the Azure portal. Search for **Private DNS zones** and then select **Private DNS zones** from the results.

1. On the **Private DNS zones** page, select **Add**.

1. Fill out the form on the **Create Private DNS zone** page. Enter *private.azuremicroservices.io* as the **Name** of the zone.

1. Select **Review + Create**.

1. Select **Create**.

#### [Azure CLI](#tab/azure-CLI)

1. Define variables for your subscription, resource group, and Azure Spring Apps instance. Customize the values based on your real environment.

   ```azurecli
   export SUBSCRIPTION='subscription-id'
   export RESOURCE_GROUP='my-resource-group'
   export VIRTUAL_NETWORK_NAME='azure-spring-apps-vnet'
   ```

1. Sign in to the Azure CLI and choose your active subscription.

   ```azurecli
   az login
   az account set --subscription ${SUBSCRIPTION}
   ```

1. Create the private DNS zone.

   ```azurecli
   az network private-dns zone create \
       --resource-group $RESOURCE_GROUP \
       --name private.azuremicroservices.io
   ```

---

It may take a few minutes to create the zone.

## Link the virtual network

To link the private DNS zone to the virtual network, you need to create a virtual network link.

#### [Azure portal](#tab/azure-portal)

1. Select the private DNS zone resource you created - for example, **private.azuremicroservices.io**.

1. On the left pane, select **Virtual network links**, and then select **Add**.

1. Enter *azure-spring-apps-dns-link* for the **Link name**.

1. For **Virtual network**, select the virtual network you created. For more information, see [Deploy Azure Spring Apps in your Azure virtual network (VNet injection)](./how-to-deploy-in-azure-virtual-network.md).

   :::image type="content" source="media/spring-cloud-access-app-vnet/add-virtual-network-link.png" alt-text="Screenshot of the Azure portal that shows the Add virtual network link page." lightbox="media/spring-cloud-access-app-vnet/add-virtual-network-link.png":::    

1. Select **OK**.

#### [Azure CLI](#tab/azure-CLI)

Use the following command to link the private DNS zone you created to the virtual network holding your Azure Spring Apps service.

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

Use the following steps to use the private DNS zone to translate/resolve DNS. You must create an "A" type record in the zone.

#### [Azure portal](#tab/azure-portal)

1. Select the private DNS zone resource you created - for example, **private.azuremicroservices.io**.

1. Select **Record set**.

1. In **Add record set**, enter or select the following information:

   | Setting    | Value                                                                                                               |
   |------------|---------------------------------------------------------------------------------------------------------------------|
   | Name       | Enter *\**                                                                                                          |
   | Type       | Select **A**                                                                                                        |
   | TTL        | Enter *1*                                                                                                           |
   | TTL unit   | Select **Hours**                                                                                                    |
   | IP address | Enter the [IP address](#find-the-ip-for-your-application). The following screenshot uses the IP address *10.1.0.7*. |

1. Select **OK**.

   :::image type="content" source="media/spring-cloud-access-app-vnet/private-dns-zone-add-record.png" alt-text="Screenshot of the Azure portal that shows the Add record set page." lightbox="media/spring-cloud-access-app-vnet/private-dns-zone-add-record.png":::    

#### [Azure CLI](#tab/azure-CLI)

Use the following command and the [IP address](#find-the-ip-for-your-application) to create the A record in your DNS zone.

```azurecli
az network private-dns record-set a add-record \
    --resource-group $RESOURCE_GROUP \
    --zone-name private.azuremicroservices.io \
    --record-set-name '*' \
    --ipv4-address $IP_ADDRESS
```

---

## Assign private FQDN for your application

After you deploy Azure Spring Apps in a virtual network, you can assign a private FQDN for your application. Fore more information, see [Deploy Azure Spring Apps in a virtual network](./how-to-deploy-in-azure-virtual-network.md). 

#### [Azure portal](#tab/azure-portal)

1. Select the Azure Spring Apps service instance deployed in your virtual network, and open the **Apps** tab in the menu on the left.

1. Select the application to open the **Overview** page.

1. Select **Assign Endpoint** to assign a private FQDN to your application. Assigning an FQDN can take a few minutes.

   :::image type="content" source="media/spring-cloud-access-app-vnet/assign-private-endpoint.png" alt-text="Screenshot of the Azure portal that shows the Overview page with the Assign endpoint selected." lightbox="media/spring-cloud-access-app-vnet/assign-private-endpoint.png":::

1. The assigned private FQDN (labeled **URL**) is now available. You can only access the URL within the private network, but not on the internet.

#### [Azure CLI](#tab/azure-CLI)

Update your app to assign an endpoint to it. Use the following command to customize the value of your app name based on your real environment.

```azurecli
export SPRING_CLOUD_APP='your spring cloud app'
az spring app update \
    --resource-group $RESOURCE_GROUP \
    --name $SPRING_CLOUD_APP \
    --service $SPRING_CLOUD_NAME \
    --assign-endpoint true
```

---

## Access application private FQDN

You can access the application's private FQDN in a private network. For example, you can create a jumpbox machine in the same virtual network or in a peered virtual network. Then, on that jumpbox or virtual machine, you can access the private FQDN.

:::image type="content" source="media/spring-cloud-access-app-vnet/access-private-endpoint.png" alt-text="Screenshot of the sample application that shows the URL within the private network." lightbox="media/spring-cloud-access-app-vnet/access-private-endpoint.png":::

## Clean up resources

You can delete the Azure resource group, which includes all the resources in the resource group. Use the following steps to delete the entire resource group, including the newly created service:

```azurecli
az group delete --name $RESOURCE_GROUP
```

## Next steps

- [Expose applications with end-to-end TLS in a virtual network](./expose-apps-gateway-end-to-end-tls.md)
- [Troubleshooting Azure Spring Apps in virtual networks](./troubleshooting-vnet.md)
- [Customer Responsibilities for Running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md)
