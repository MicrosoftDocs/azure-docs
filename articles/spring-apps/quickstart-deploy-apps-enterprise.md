---
title: "Quickstart - Build and deploy apps to the Azure Spring Apps Enterprise plan"
description: Describes app deployment to the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-apps
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This quickstart shows you how to build and deploy applications to Azure Spring Apps using the Enterprise plan.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Understand and fulfill the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]

## Download the sample app

Use the following commands to download the sample:

```bash
git clone https://github.com/Azure-Samples/acme-fitness-store
cd acme-fitness-store
```

## Provision a service instance

Use the following steps to provision an Azure Spring Apps service instance.

1. Use the following command to sign in to the Azure CLI and choose your active subscription:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to accept the legal terms and privacy statements for the Enterprise plan. This step is necessary only if your subscription has never been used to create an Enterprise plan instance of Azure Spring Apps.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan asa-ent-hr-mtr
   ```

1. Select a location. This location must be a location supporting the Azure Spring Apps Enterprise plan. For more information, see the [Azure Spring Apps FAQ](faq.md).

1. Use the following command to create a resource group:

   ```azurecli
   az group create \
       --name <resource-group-name> \
       --location <location>
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md).

1. Prepare a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Use the following command to create an Azure Spring Apps service instance:

   ```azurecli
   az spring create \
       --resource-group <resource-group-name> \
       --name <Azure-Spring-Apps-service-instance-name> \
       --sku enterprise \
       --enable-application-configuration-service \
       --enable-service-registry \
       --enable-gateway \
       --enable-api-portal
   ```

1. Use the following command to create a Log Analytics Workspace to be used for your Azure Spring Apps service:

   ```azurecli
   az monitor log-analytics workspace create \
       --resource-group <resource-group-name> \
       --workspace-name <workspace-name> \
       --location <location>
   ```

1. Use the following commands to retrieve the Resource ID for your Log Analytics Workspace and Azure Spring Apps service instance:

   ```azurecli
   export LOG_ANALYTICS_RESOURCE_ID=$(az monitor log-analytics workspace show \
       --resource-group <resource-group-name> \
       --workspace-name <workspace-name> \
       --query id \
       --output tsv)

   export AZURE_SPRING_APPS_RESOURCE_ID=$(az spring show \
       --resource-group <resource-group-name> \
       --name <Azure-Spring-Apps-service-instance-name> \
       --query id \
       --output tsv)
   ```

1. Use the following command to configure diagnostic settings for the Azure Spring Apps Service:

   ```azurecli
   az monitor diagnostic-settings create \
       --name "send-logs-and-metrics-to-log-analytics" \
       --resource ${AZURE_SPRING_APPS_RESOURCE_ID} \
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

1. Use the following commands to create applications for `cart-service`, `order-service`, `payment-service`, `catalog-service`, and `frontend`:

   ```azurecli
   az spring app create \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name>

   az spring app create \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name>

   az spring app create \
       --resource-group <resource-group-name> \
       --name payment-service \
       --service <Azure-Spring-Apps-service-instance-name>

   az spring app create \
       --resource-group <resource-group-name> \
       --name catalog-service \
       --service <Azure-Spring-Apps-service-instance-name>

   az spring app create \
       --resource-group <resource-group-name> \
       --name frontend \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

## Externalize configuration with Application Configuration Service

Use the following steps to configure Application Configuration Service.

1. Use the following command to create a configuration repository for Application Configuration Service:

   ```azurecli
   az spring application-configuration-service git repo add \
       --resource-group <resource-group-name> \
       --name acme-fitness-store-config \
       --service <Azure-Spring-Apps-service-instance-name> \
       --label main \
       --patterns "catalog/default,catalog/key-vault,identity/default,identity/key-vault,payment/default" \
       --uri "https://github.com/Azure-Samples/acme-fitness-store-config"
   ```

1. Use the following commands to bind applications to Application Configuration Service:

   ```azurecli
   az spring application-configuration-service bind \
       --resource-group <resource-group-name> \
       --app payment-service \
       --service <Azure-Spring-Apps-service-instance-name>

   az spring application-configuration-service bind \
       --resource-group <resource-group-name> \
       --app catalog-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

## Activate service registration and discovery

To active service registration and discovery, use the following commands to bind applications to Service Registry:

```azurecli
az spring service-registry bind \
    --resource-group <resource-group-name> \
    --app payment-service \
    --service <Azure-Spring-Apps-service-instance-name>

az spring service-registry bind \
    --resource-group <resource-group-name> \
    --app catalog-service \
    --service <Azure-Spring-Apps-service-instance-name>
```

## Deploy polyglot applications with Tanzu Build Service

Use the following steps to deploy and build applications. For these steps, make sure that the terminal is in the project folder before running any commands.

1. Use the following command to create a custom builder in Tanzu Build Service:

   ```azurecli
   az spring build-service builder create \
       --resource-group <resource-group-name> \
       --name quickstart-builder \
       --service <Azure-Spring-Apps-service-instance-name> \
       --builder-file azure-spring-apps-enterprise/resources/json/tbs/builder.json
   ```

1. Use the following command to build and deploy the payment service:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --name payment-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --config-file-pattern payment/default \
       --source-path apps/acme-payment \
       --build-env BP_JVM_VERSION=17
   ```

1. Use the following command to build and deploy the catalog service:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --name catalog-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --config-file-pattern catalog/default \
       --source-path apps/acme-catalog \
       --build-env BP_JVM_VERSION=17
   ```

1. Use the following command to build and deploy the order service:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --builder quickstart-builder \
       --source-path apps/acme-order
   ```

1. Use the following command to build and deploy the cart service:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --builder quickstart-builder \
       --env "CART_PORT=8080" \
       --source-path apps/acme-cart
   ```

1. Use the following command to build and deploy the frontend application:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --name frontend \
       --service <Azure-Spring-Apps-service-instance-name> \
       --source-path apps/acme-shopping
   ```

> [!TIP]
> To troubleshot deployments, you can use the following command to get logs streaming in real time whenever the app is running: `az spring app logs --name <app name> --follow`.

## Route requests to apps with Spring Cloud Gateway

Use the following steps to configure Spring Cloud Gateway and configure routes to applications.

1. Use the following command to assign an endpoint to Spring Cloud Gateway:

   ```azurecli
   az spring gateway update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --assign-endpoint true
   ```

1. Use the following commands to configure Spring Cloud Gateway API information:

   ```azurecli
   export GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --query properties.url \
       --output tsv)

   az spring gateway update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --api-description "Fitness Store API" \
       --api-title "Fitness Store" \
       --api-version "v1.0" \
       --server-url "https://${GATEWAY_URL}" \
       --allowed-origins "*"
   ```

1. Use the following command to create routes for the cart service:

   ```azurecli
   az spring gateway route-config create \
       --resource-group <resource-group-name> \
       --name cart-routes \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app-name cart-service \
       --routes-file azure-spring-apps-enterprise/resources/json/routes/cart-service.json
   ```

1. Use the following command to create routes for the order service:

   ```azurecli
   az spring gateway route-config create \
       --resource-group <resource-group-name> \
       --name order-routes \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app-name order-service \
       --routes-file azure-spring-apps-enterprise/resources/json/routes/order-service.json
   ```

1. Use the following command to create routes for the catalog service:

   ```azurecli
   az spring gateway route-config create \
       --resource-group <resource-group-name> \
       --name catalog-routes \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app-name catalog-service \
       --routes-file azure-spring-apps-enterprise/resources/json/routes/catalog-service.json
   ```

1. Use the following command to create routes for the frontend:

   ```azurecli
   az spring gateway route-config create \
       --resource-group <resource-group-name> \
       --name frontend-routes \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app-name frontend \
       --routes-file azure-spring-apps-enterprise/resources/json/routes/frontend.json
   ```

1. Use the following commands to retrieve the URL for Spring Cloud Gateway:

   ```azurecli
   export GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --query properties.url \
       --output tsv)

   echo "https://${GATEWAY_URL}"
   ```

   You can open the output URL in a browser to explore the deployed application.

## Browse and try APIs with API Portal

Use the following steps to configure API Portal.

1. Use the following command to assign an endpoint to API Portal:

   ```azurecli
   az spring api-portal update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --assign-endpoint true
   ```

1. Use the following commands to retrieve the URL for API Portal:

   ```azurecli
   export PORTAL_URL=$(az spring api-portal show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --query properties.url \
       --output tsv)

   echo "https://${PORTAL_URL}"
   ```

   You can open the output URL in a browser to explore the application APIs.

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

Now that you've successfully built and deployed your app, continue on to any of the following optional quickstarts:

- [Configure single sign-on](quickstart-configure-single-sign-on-enterprise.md)
- [Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
- [Load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
- [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
- [Set request rate limits](quickstart-set-request-rate-limits-enterprise.md)
- [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)
- [Integrate Azure Open AI](quickstart-fitness-store-azure-openai.md)
