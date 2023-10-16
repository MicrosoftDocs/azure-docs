---
title: Map DNS names to applications in multiple Azure Spring Apps service instances in the same virtual network
description: Learn how to map DNS names to applications in multiple Azure Spring Apps service instances in the same virtual network.
author: KarlErickson
ms.author: wenhaozhang
ms.service: spring-apps
ms.topic: how-to
ms.date: 6/29/2023
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022, engagement-fy23
---

# Map DNS names to applications in multiple Azure Spring Apps service instances in the same virtual network

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows how to map Domain Name System (DNS) names to applications to access multiple Azure Spring Apps service instances in the same virtual network.

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`
- A virtual network deployed in an instance of Azure Spring Apps. For more information, see [Deploy Azure Spring Apps in your Azure virtual network (VNet injection)](./how-to-deploy-in-azure-virtual-network.md).

## Overview

This article describes the following two approaches for mapping DNS names to applications:

- Using the Microsoft-provided fully qualified domain name (FQDN).

  This approach is a relatively simple and lightweight way to map DNS names compared to the custom domain approach. This approach is recommended if you don't need a wildcard approach in your DNS zone.

  This approach requires a DNS record for each application.

- Using a custom domain.

  If you already have a custom domain or you want a wildcard approach to work in a multi-instance scenario, use this approach.

  This approach requires a DNS record for each Azure Spring Apps service instance, and a custom domain configured for each application.

As an example, this article uses `azure-spring-apps-1` and `azure-spring-apps-2` as the names of two Azure Spring Apps instances in the same virtual network.

Begin with the [Preliminary steps for DNS mapping](#preliminary-steps-for-dns-mapping) section and then proceed with your preferred approach:

- [DNS mapping with Microsoft-provided FQDN](#dns-mapping-with-a-microsoft-provided-fqdn)
- [DNS mapping with a custom domain](#dns-mapping-with-a-custom-domain)

End by testing the mapping as described in the [Access private FQDN URLs for private applications](#access-private-fqdn-for-applications) section.

## Preliminary steps for DNS mapping

Complete the steps in this section for both the FQDN and the custom domain approaches to mapping DNS names.

### Find application IP addresses

Both approaches require the IP address for each application in the Azure Spring Apps instance you want to map. Use the following steps to find the IP addresses:

#### [Azure portal](#tab/azure-portal)

1. Navigate to the virtual network you created for an Azure Spring Apps instance, and then select **Connected devices** in the navigation pane.

1. On the **Connected devices** page, search for *kubernetes-internal*.

1. In the search results, find each **Device** connected to a service runtime **Subnet** of an Azure Spring Apps service instance, and copy its **IP Address**. In the following screenshot example, the IP address of `azure-spring-apps-1` is `10.1.0.6`, and the IP address of `azure-spring-apps-2` is `10.1.2.6`.

   :::image type="content" source="media/how-to-map-dns-virtual-network/create-dns-record.png" alt-text="Screenshot of the Azure portal showing the Connected devices page for a virtual network, highlighting the devices with a service runtime subnet." lightbox="media/how-to-map-dns-virtual-network/create-dns-record.png":::

#### [Azure CLI](#tab/azure-CLI)

1. Use the following commands to define variables for your subscription, resource group, Azure Spring Apps instance, and virtual network. Customize the values based on your environment.

   ```azurecli
   export SUBSCRIPTION='<subscription-ID>'
   export RESOURCE_GROUP='<resource-group-name>'
   export AZURE_SPRING_APPS_NAME='<Azure-Spring-Apps-instance-name>'
   export VIRTUAL_NETWORK_NAME='<Azure-Spring-Apps-VNET-name>'
   ```

1. Use the following commands to set the variables for the service runtime network resource group and the IP address:

   ```azurecli
   export SERVICE_RUNTIME_RG=$(az spring show \
       --resource-group $RESOURCE_GROUP \
       --name $AZURE_SPRING_APPS_NAME \
       --query "properties.networkProfile.serviceRuntimeNetworkResourceGroup" \
       --output tsv)
   export IP_ADDRESS=$(az network lb frontend-ip list \
       --lb-name kubernetes-internal \
       --resource-group $SERVICE_RUNTIME_RG \
       --query "[0].privateIpAddress" \
       --output tsv)
   ```

---

### Create a private DNS zone

Use the following steps to create a private DNS zone for an application in the private network.

> [!NOTE]
> If you're using Microsoft Azure operated by 21Vianet, replace `private.azuremicroservices.io` with `private.microservices.azure.cn` in this article. For more information, see [Check Endpoints in Azure](/azure/china/resources-developer-guide#check-endpoints-in-azure).

#### [Azure portal](#tab/azure-portal)

1. On the Azure Home page, search for *Private DNS zones*.

1. On the **Private DNS zones** page, select **Create**.

1. Fill out the form on the **Create Private DNS zone** page. In **Instance details** for **Name**, specify `private.azuremicroservices.io` as the name of the private DNS zone.

1. Select **Review create**.

1. Select **Create**.

#### [Azure CLI](#tab/azure-CLI)

1. Use the following commands to sign in to the Azure CLI and set your active subscription:

   ```azurecli
   az login
   az account set --subscription ${SUBSCRIPTION}
   ```

1. Use the following command to create the private DNS zone.

   ```azurecli
   az network private-dns zone create \
       --resource-group $RESOURCE_GROUP \
       --name private.azuremicroservices.io
   ```

---

It may take a few minutes to create the zone.

### Link the virtual network

To link the private DNS zone you created to the virtual network, you must create a virtual network link.

#### [Azure portal](#tab/azure-portal)

Use the following steps to create this link:

1. Navigate to the private DNS zone you created named `private.azuremicroservices.io`. There might be several with that name, so determine the correct one by its resource group and subscription.

1. On the navigation pane, select **Virtual network links**, then select **Add**.

1. For the **Link name**, enter *azure-spring-apps-dns-link*.

1. For **Virtual network**, select the virtual network you created for [Prerequisites](#prerequisites).

   :::image type="content" source="media/how-to-map-dns-virtual-network/add-virtual-network-link.png" alt-text="Screenshot of the Azure portal showing the Add virtual network link page for a private DNS zone." lightbox="media/how-to-map-dns-virtual-network/add-virtual-network-link.png":::

1. Select **OK**.

#### [Azure CLI](#tab/azure-CLI)

Use the following command to create this link:

   ```azurecli
   az network private-dns link vnet create \
       --resource-group $RESOURCE_GROUP \
       --name azure-spring-apps-dns-link \
       --zone-name private.azuremicroservices.io \
       --virtual-network $VIRTUAL_NETWORK_NAME \
       --registration-enabled false
   ```

---

### Assign a private FQDN for your applications

Assign a private FQDN for your application.

#### [Azure portal](#tab/azure-portal)

Use the following steps to update your app with an assigned endpoint:

1. Navigate to the Azure Spring Apps instance deployed in your virtual network, and then select **Apps** in the navigation pane.

1. Select an application.

1. Select **Assign Endpoint** to assign a private FQDN to your application. Assigning an FQDN can take a few minutes.

   :::image type="content" source="media/how-to-map-dns-virtual-network/assign-private-endpoint.png" alt-text="Screenshot of the Azure portal showing the Overview page for an app with Assign endpoint highlighted." lightbox="media/how-to-map-dns-virtual-network/assign-private-endpoint.png":::

1. Repeat these steps for each application you want to map.

#### [Azure CLI](#tab/azure-CLI)

Use the following command to update your app with an assigned endpoint. Customize the value of your app name based on your real environment.

```azurecli
export SPRING_CLOUD_APP='<app-name>'
az spring app update \
    --resource-group $RESOURCE_GROUP \
    --name $SPRING_CLOUD_APP \
    --service $SPRING_CLOUD_NAME \
    --assign-endpoint true
```

---

## DNS mapping with a Microsoft-provided FQDN

Using this approach, you must create a DNS record for each application as a requirement when using the Microsoft-provided fully qualified domain name (FQDN). For a core understanding of this process, see [Access your application in a private network](access-app-virtual-network.md).

When an application in an Azure Spring Apps service instance with assigned endpoint is deployed in the virtual network, the endpoint is a private FQDN. By default, the fully qualified domain name is unique for each app across service instances. The FQDN format is `<service-name>-<app-name>.private.azuremicroservices.io`.

### Create DNS records for all the applications

To use the private DNS zone to translate and resolve DNS names, you must create an "A" type record in the zone for each of your applications. In this example, the app name is `hello-vnet` and the Azure Springs Apps service instance name is `azure-spring-apps-1`.

You need the IP address for each application. Copy it as described in the [Find the IP for your application](access-app-virtual-network.md#find-the-ip-for-your-application) section of [Access your application in a private network](access-app-virtual-network.md). In this example, the IP address is `10.1.0.6`.

#### [Azure portal](#tab/azure-portal)

Use the following steps to create a DNS record:

1. Navigate to the private DNS zone you created earlier: `private.azuremicroservices.io`

1. Select **Record set**.

1. In the **Add record set** pane, enter the values from the following table.

   | Setting    | Value                            |
   |------------|----------------------------------|
   | Name       | *azure-spring-apps-1-hello-vnet* |
   | Type       | **A**                            |
   | TTL        | 1                                |
   | TTL unit   | **Hours**                        |
   | IP address | (paste from the clipboard)       |

1. Select **OK**.

   :::image type="content" source="media/how-to-map-dns-virtual-network/private-dns-zone-add-record-fqdn.png" alt-text="Screenshot of the Azure portal showing the Add record set pane in a Private DNS zone." lightbox="media/how-to-map-dns-virtual-network/private-dns-zone-add-record-fqdn.png":::

#### [Azure CLI](#tab/azure-CLI)

Use the following command to create a DNS record:

```azurecli
az network private-dns record-set a add-record \
    --resource-group $RESOURCE_GROUP \
    --zone-name private.azuremicroservices.io \
    --record-set-name 'azure-spring-apps-1-hello-vnet' \
    --ipv4-address $IP_ADDRESS
```

---

Repeat these steps as needed to add a DNS record for other applications.

## DNS mapping with a custom domain

Using this approach, you only need to add a DNS record for each Azure Spring Apps instance, but you must configure the custom domain for each application. For a core understanding of this process, see [Map an existing custom domain to Azure Spring Apps](how-to-custom-domain.md).

This example reuses the private DNS zone `private.azuremicroservices.io` to add a custom domain related DNS record. The private FQDN has the format `<app-name>.<service-name>.private.azuremicroservices.io`.

Technically, you can use any private fully qualified domain name you want. In that case, you have to create a new private DNS zone corresponding to the fully qualified domain name you choose.

### Map your custom domain to an app in an Azure Spring Apps instance

Use the following steps to map your custom domain to each of the applications in the Azure Spring Apps instance:

#### [Azure portal](#tab/Azure-portal)

1. Open the Azure Spring Apps instance and select **Apps** in the navigation pane.
1. On the **Apps** page, select an application.
1. Select **Custom domain** in the navigation pane.
1. Select **Add Custom domain**.
1. On the **Add custom domain** pane, enter the FQDN you want to use and make sure it corresponds to the certificate to use for TLS/SSL binding later. This example uses `hello-vnet.azure-spring-apps-1.private.azuremicroservices.io`. You can disregard the CNAME part.
1. Select **Validate**.
1. If validated, select **Add**.

   :::image type="content" source="./media/how-to-map-dns-virtual-network/add-custom-domain.png" alt-text="Screenshot of the Azure portal showing the Add custom domain pane for an app in an Azure Spring Apps instance." lightbox="./media/how-to-map-dns-virtual-network/add-custom-domain.png":::

When the custom domain is successfully mapped to the app, it appears in the custom domain table.

   :::image type="content" source="./media/how-to-map-dns-virtual-network/custom-domain-table.png" alt-text="Screenshot of the Azure portal showing the custom domain table in the Custom domain page for an app." lightbox="./media/how-to-map-dns-virtual-network/custom-domain-table.png":::

#### [Azure CLI](#tab/Azure-CLI)

1. Use the following command to bind a custom domain to an app:

   ```azurecli
   az spring app custom-domain bind \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --domain-name <fqdn-domain-name> \
       --app <app-name>
   ```

1. Use the following command to list all custom domains of an app:

   ```azurecli
   az spring app custom-domain list \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --app <app-name> \
   ```

---

> [!NOTE]
> A **TLS/SSL state** value of **Not Secure** for your custom domain means that it's not yet bound to a TLS/SSL certificate. Any HTTPS request from a browser to your custom domain will receive an error or warning.

### Add TLS/SSL binding

Before doing this step, make sure you've prepared your certificates and imported them into Azure Spring Apps. For more information, see [Map an existing custom domain to Azure Spring Apps](how-to-custom-domain.md).

#### [Azure portal](#tab/Azure-portal)

Use the following steps to update the custom domain of an app with a certificate:

1. Open the Azure Spring Apps instance and select **Apps** in the navigation pane.
1. On the **Apps** page, select an application.
1. Select **Custom domain** in the navigation pane.
1. Select the ellipsis (**...**) button for a custom domain and then select **Bind TLS/SSL**.
1. On the **TLS/SSL binding pane**, select **Certificate** and then select or import the certificate.
1. Select **Save**.

   :::image type="content" source="./media/how-to-map-dns-virtual-network/add-ssl-binding.png" alt-text="Screenshot of the Azure portal showing the TLS/SSL binding pane on the Custom domain page for an app." lightbox="./media/how-to-map-dns-virtual-network/add-ssl-binding.png":::

After you successfully add TLS/SSL binding, the domain state will be secure, as shown by a **TLS/SSL state** value of **Healthy**.

:::image type="content" source="./media/how-to-map-dns-virtual-network/secured-domain-state.png" alt-text="Screenshot of the Azure portal showing a custom domain in a healthy state on the Custom domain page." lightbox="./media/how-to-map-dns-virtual-network/secured-domain-state.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to update the custom domain of an app with a certificate:

```azurecli
az spring app custom-domain update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --domain-name <domain-name> \
    --certificate <cert-name> \
    --app <app-name> 
```

---

### Configure the custom domain for all applications

To use the private DNS zone to translate and resolve DNS names, you must create an "A" type record in the zone for each of your Azure Spring Apps service instances. In this example, the app name is `hello-vnet` and the Azure Springs Apps service instance name is `azure-spring-apps-1`.

You need the IP address for each application. Copy it as described in the [Find the IP for your application](access-app-virtual-network.md#find-the-ip-for-your-application) section of [Access your application in a private network](access-app-virtual-network.md). In this example, the IP address is `10.1.0.6`.

#### [Azure portal](#tab/azure-portal)

Use the following steps to create the A record in your DNS zone:

1. Navigate to the private DNS zone you created earlier: `private.azuremicroservices.io`

1. Select **Record set**.

1. In the **Add record set** pane, enter the values from the following table.

   | Setting    | Value                            |
   |------------|----------------------------------|
   | Name       | *\*.azure-spring-apps-1*         |
   | Type       | **A**                            |
   | TTL        | 1                                |
   | TTL unit   | **Hours**                        |
   | IP address | (paste from the clipboard)       |

1. Select **OK**.

   :::image type="content" source="media/how-to-map-dns-virtual-network/private-dns-zone-add-record-custom-domain.png" alt-text="Screenshot of the Azure portal showing Overview page for a private DNS zone with the add record set pane open." lightbox="media/how-to-map-dns-virtual-network/private-dns-zone-add-record-custom-domain.png":::

#### [Azure CLI](#tab/azure-CLI)

Use the following command to create the A record in your DNS zone:

```azurecli
az network private-dns record-set a add-record \
    --resource-group $RESOURCE_GROUP \
    --zone-name private.azuremicroservices.io \
    --record-set-name '*.azure-spring-apps-1' \
    --ipv4-address $IP_ADDRESS
```

---

Repeat as needed to configure the custom domain for other applications.

## Access private FQDN for applications

After the FQDN assignments and DNS mappings for both approaches, you can access all the applications' private FQDN in the private network. For example, you can create a jumpbox or virtual machine in the same virtual network or in a peered virtual network and have access to all the private FQDNs of the applications.

The following examples show the FQDN approach:

- `https://hello-vnet.azure-spring-apps-1.private.azuremicroservices.io`
- `https://hello-vnet.azure-spring-apps-2.private.azuremicroservices.io`

The following examples show the custom domain approach:

- `https://azure-spring-apps-1-hello-vnet.private.azuremicroservices.io`
- `https://azure-spring-apps-2-hello-vnet.private.azuremicroservices.io`

The following screenshot shows the URL for a Spring application using an FQDN:

:::image type="content" source="media/how-to-map-dns-virtual-network/access-private-endpoint-fqdn.png" alt-text="Screenshot of a Spring application accessed by a URL using an FQDN." lightbox="media/how-to-map-dns-virtual-network/access-private-endpoint-fqdn.png":::

The following screenshot shows the URL for a Spring application using a custom domain:

:::image type="content" source="media/how-to-map-dns-virtual-network/access-private-endpoint-custom-domain.png" alt-text="Screenshot of a Spring application accessed by a URL using a custom domain." lightbox="media/how-to-map-dns-virtual-network/access-private-endpoint-custom-domain.png":::

## Clean up resources

If you plan to continue working with subsequent articles, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following command:

```azurecli
az group delete --name $RESOURCE_GROUP
```

## Next steps

- [Deploy Azure Spring Apps in your Azure virtual network (VNet injection)](./how-to-deploy-in-azure-virtual-network.md)
- [Access your application in a private network](access-app-virtual-network.md)
