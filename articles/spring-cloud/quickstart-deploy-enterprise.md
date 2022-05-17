---
title: "Quickstart - Build and deploy apps to Azure Spring Apps Enterprise tier"
description: Describes app deployment to Azure Spring Apps Enterprise tier.
author: KarlErickson
ms.author: asirveda; paly@vmware.com
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java
---

# Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise tier

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to build and deploy applications to Azure Spring Apps using the Enterprise tier.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Apps Enterprise tier. For more information, see [View Azure Spring Apps Enterprise tier Offer in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Download the sample app

Use the following commands to download the sample:

   ```bash
   git clone https://github.com/Azure-Samples/acme-fitness-store
   cd acme-fitness-store
   ```

## Provision a service instance

Use the following steps to provision an Azure Spring Apps service instance.

1. Update Azure CLI with the Azure Spring Apps extension using the following command:

   ```azurecli
   az extension update --name spring-cloud
   ```

1. Sign in to the Azure CLI and choose your active subscription using the following command:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to accept the legal terms and privacy statements for the Enterprise tier. This step is necessary only if your subscription has never been used to create an Enterprise tier instance of Azure Spring Apps.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept --publisher vmware-inc --product azure-spring-cloud-vmware-tanzu-2 --plan tanzu-asc-ent-mtr
   ```

1. Select a location. This location must be a location supporting Azure Spring Apps Enterprise tier.

1. Create a resource group using the following command:

   ```azurecli
   az group create --name <resource-group-name> \
       --location <location>
   ```

    For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md).

1. Prepare a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Create an Azure Spring Apps service instance using the following the command:

   ```azurecli
   az spring-cloud create \
       --resource-group <resource-group-name> \
       --name <spring-cloud-service> \
       --sku enterprise \
       --enable-application-configuration-service \
       --enable-service-registry \
       --enable-gateway \
       --enable-api-portal
   ```

1. Create a Log Analytics Workspace to be used for your Azure Spring Apps service using the following command:

   ```azurecli
   az monitor log-analytics workspace create \
       --resource-group <resource-group-name> \
       --workspace-name <workspace-name> \
       --location <location>
   ```

1. Retrieve the Resource ID for your Log Analytics Workspace and Azure Spring Apps service using the following commands:

   ```bash
   LOG_ANALYTICS_RESOURCE_ID=$(az monitor log-analytics workspace show \
       --resource-group <resource-group> \
       --workspace-name <workspace-name> | jq -r '.id')

   SPRING_CLOUD_RESOURCE_ID=$(az spring-cloud show \
       --resource-group <resource-group> \
       --name <spring-cloud-service> | jq -r '.id')
   ```

1. Configure diagnostic settings for the Azure Spring Apps Service using the following command:

   ```azurecli
   az monitor diagnostic-settings create \
       --name "send-logs-and-metrics-to-log-analytics" \
       --resource ${SPRING_CLOUD_RESOURCE_ID} \
       --workspace ${LOG_ANALYTICS_RESOURCE_ID} \
       --logs '[
            {
              "category": "ApplicationConsole",
              "enabled": true,
              "retentionPolicy": {
                "enabled": false,
                "days": 0
              }
            },
            {
               "category": "SystemLogs",
               "enabled": true,
               "retentionPolicy": {
                 "enabled": false,
                 "days": 0
               }
             },
            {
               "category": "IngressLogs",
               "enabled": true,
               "retentionPolicy": {
                 "enabled": false,
                 "days": 0
                }
              }
          ]' \
          --metrics '[
            {
              "category": "AllMetrics",
              "enabled": true,
              "retentionPolicy": {
                "enabled": false,
                "days": 0
              }
            }
          ]'
   ```

1. Create applications for `cart-service`, `order-service`, `payment-service`, `catalog-service`, and `frontend` using the following commands:

   ```azurecli
   az spring-cloud app create \
       --resource-group <resource-group> \
       --name cart-service \
       --service <spring-cloud-service>

   az spring-cloud app create \
       --resource-group <resource-group> \
       --name order-service \
       --service <spring-cloud-service>

   az spring-cloud app create \
       --resource-group <resource-group> \
       --name payment-service \
       --service <spring-cloud-service>

   az spring-cloud app create \
       --resource-group <resource-group> \
       --name catalog-service
       --service <spring-cloud-service>

   az spring-cloud app create \
       --resource-group <resource-group> \
       --name frontend \
       --service <spring-cloud-service>
   ```

## Externalize configuration with Application Configuration Service

Use the following steps to configure Application Configuration Service.

1. Create a configuration repository for Application Configuration Service using the following command:

   ```azurecli
   az spring-cloud application-configuration-service git repo add \
       --resource-group <resource-group> \
       --name acme-fitness-store-config \
       --service <spring-cloud-service> \
       --label main \
       --patterns "catalog/default,catalog/key-vault,identity/default,identity/key-vault,payment/default" \
       --uri "https://github.com/Azure-Samples/acme-fitness-store-config"
   ```

1. Bind Applications to Application Configuration Service using the following commands:

   ```azurecli
   az spring-cloud application-configuration-service bind \
       --resource-group <resource-group> \
       --app payment-service \
       --service <spring-cloud-service>

   az spring-cloud application-configuration-service bind \
       --resource-group <resource-group> \
       --app catalog-service \
       --service <spring-cloud-service>
   ```

## Service registration and discovery

Bind applications to Service Registry to activate Service Registration and Discovery using the following commands:

```azurecli
az spring-cloud service-registry bind \
    --resource-group <resource-group> \
    --app payment-service \
    --service <spring-cloud-service>

az spring-cloud service-registry bind \
    --resource-group <resource-group> \
    --app catalog-service \
    --service <spring-cloud-service>
```

## Deploy polyglot applications with Tanzu Build Service

Use the following steps to deploy and build applications. For these steps make sure that the terminal is in the project folder before running any commands.

1. Create a custom builder in Tanzu Build Service using the following command:

   ```azurecli
   az spring-cloud build-service builder create \
       --resource-group <resource-group> \
       --name quickstart-builder \
       --service <spring-cloud-service> \
       --builder-file azure/builder.json
   ```

1. Build and deploy the payment service using the following command:

   ```azurecli
   az spring-cloud app deploy \
       --resource-group <resource-group> \
       --name payment-service \
       --service <spring-cloud-service> \
       --config-file-pattern payment/default \
       --source-path apps/acme-payment
   ```

1. Build and deploy the catalog service using the following command:

   ```azurecli
   az spring-cloud app deploy \
       --resource-group <resource-group> \
       --name catalog-service \
       --service <spring-cloud-service> \
       --config-file-pattern catalog/default \
       --source-path apps/acme-catalog
   ```

1. Build and deploy the order service using the following command:

   ```azurecli
   az spring-cloud app deploy \
       --resource-group <resource-group> \
       --name order-service \
       --service <spring-cloud-service> \
       --builder quickstart-builder \
       --source-path apps/acme-order
   ```

1. Build and deploy the cart service using the following command:

   ```azurecli
   az spring-cloud app deploy \
       --resource-group <resource-group> \
       --name cart-service \
       --service <spring-cloud-service> \
       --builder quickstart-builder \
       --env "CART_PORT=8080" \
       --source-path apps/acme-cart
   ```

1. Build and deploy the frontend application using the following command:

   ```azurecli
   az spring-cloud app deploy \
       --resource-group <resource-group> \
       --name frontend \
       --service <spring-cloud-service> \
       --source-path apps/acme-shopping
   ```

> [!TIP]
> To troubleshot deployments, you can use the following command to get logs streaming in real time whenever the app is running `az spring-cloud app logs --name <app name> -f`.

## Effortlessly route requests to apps with Spring Cloud Gateway

Use the following steps to configure Spring Cloud Gateway and configure routes to applications.

1. Assign an endpoint to Spring Cloud Gateway using the following command:

   ```azurecli
   az spring-cloud gateway update \
       --resource-group <resource-group> \
       --service <spring-cloud-service> \
       --assign-endpoint true
   ```

1. Configure Spring Cloud Gateway API information using the following command:

   ```azurecli
   GATEWAY_URL=$(az spring-cloud gateway show \
       --resource-group <resource-group> \
       --service <spring-cloud-service> | jq -r '.properties.url')

   az spring-cloud gateway update \
       --resource-group <resource-group> \
       --service <spring-cloud-service> \
       --api-description "Acme Fitness Store API" \
       --api-title "Acme Fitness Store" \
       --api-version "v1.0" \
       --server-url "https://${GATEWAY_URL}" \
       --allowed-origins "*"
   ```

1. Create routes for the cart service using the following command:

   ```azurecli
   az spring-cloud gateway route-config create \
       --resource-group <resource-group> \
       --name cart-routes \
       --service <spring-cloud-service> \
       --app-name cart-service \
       --routes-file azure/routes/cart-service.json
   ```

1. Create routes for the order service using the following command:

   ```azurecli
   az spring-cloud gateway route-config create \
       --resource-group <resource-group> \
       --name order-routes \
       --service <spring-cloud-service> \
       --app-name order-service \
       --routes-file azure/routes/order-service.json
   ```

1. Create routes for the catalog service using the following command:

   ```azurecli
   az spring-cloud gateway route-config create \
       --resource-group <resource-group> \
       --name catalog-routes \
       --service <spring-cloud-service> \
       --app-name catalog-service \
       --routes-file azure/routes/catalog-service.json
   ```

1. Create routes for the frontend using the following command:

   ```azurecli
   az spring-cloud gateway route-config create \
       --resource-group <resource-group> \
       --name frontend-routes \
       --service <spring-cloud-service> \
       --app-name frontend \
       --routes-file azure/routes/frontend.json
   ```

1. Retrieve the URL for Spring Cloud Gateway using the following commands:

   ```azurecli
   GATEWAY_URL=$(az spring-cloud gateway show \
       --resource-group <resource-group> \
       --service <spring-cloud-service> | jq -r '.properties.url')

   echo "https://${GATEWAY_URL}"
   ```

    The above URL can be opened in a browser, use this to explore the deployed application.

## Browse and try APIs with API Portal

Use the following steps to configure API Portal.

1. Assign an endpoint to API Portal using the following command:

   ```azurecli
   az spring-cloud api-portal update \
       --resource-group <resource-group> \
       --service <spring-cloud-service> \
       --assign-endpoint true
   ```

1. Retrieve the URL for API Portal using the following commands:

   ```azurecli
   PORTAL_URL=$(az spring-cloud api-portal show \
       --resource-group <resource-group> \
       --service <spring-cloud-service> | jq -r '.properties.url')

   echo "https://${PORTAL_URL}"
   ```

   The above URL can be opened in a browser, use this to explore the application APIs.

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Configure Single Sign On](quickstart-configure-single-sign-on-enterprise.md)
