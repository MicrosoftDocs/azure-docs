---
title: "Quickstart - Integrate with Azure Database for PostgreSQL and Azure Cache for Redis"
titleSuffix: Azure Spring Apps Enterprise plan
description: Explains how to provision and prepare an Azure Database for PostgreSQL and an Azure Cache for Redis to be used with apps running the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-apps
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java, devx-track-extended-java, service-connector, devx-track-azurecli
---

# Quickstart: Integrate with Azure Database for PostgreSQL and Azure Cache for Redis

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This quickstart shows you how to provision and prepare an Azure Database for PostgreSQL and an Azure Cache for Redis to be used with apps running in the Azure Spring Apps Enterprise plan.

This article uses these services for demonstration purposes. You can connect your application to any backing service of your choice by using instructions similar to the ones in the [Create Service Connectors](#create-service-connectors) section later in this article.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Understand and fulfill the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the steps in [Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

## Provision services

To add persistence to the application, create an Azure Cache for Redis and an Azure Database for PostgreSQL Flexible Server.

### [Azure CLI](#tab/azure-cli)

The following steps describe how to provision an Azure Cache for Redis instance and an Azure Database for PostgreSQL Flexible Server by using the Azure CLI.

1. Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

   ```azurecli
   export REGION=<region>
   export RESOURCE_GROUP=<resource-group-name>
   export REDIS_CACHE_NAME=<redis-cache-name>
   export POSTGRES_SERVER_NAME=<postgres-server-name>
   export POSTGRES_USERNAME=<postgres-username>
   export POSTGRES_PASSWORD=<postgres-password>
   export AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME=<Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following command to create an instance of Azure Cache for Redis:

   ```azurecli
   az redis create \
       --resource-group ${RESOURCE_GROUP} \
       --name ${REDIS_CACHE_NAME} \
       --location ${REGION} \
       --sku Basic \
       --vm-size c0
   ```

   > [!NOTE]
   > Redis Cache creation takes approximately 20 minutes.

1. Use the following command to create an Azure Database for PostgreSQL Flexible Server instance:

   ```azurecli
   az postgres flexible-server create \
       --resource-group ${RESOURCE_GROUP} \
       --name ${POSTGRES_SERVER_NAME} \
       --location ${REGION} \
       --admin-user ${POSTGRES_USERNAME} \
       --admin-password ${POSTGRES_PASSWORD} \
       --yes
   ```

1. Use the following command to allow connections from other Azure Services to the newly created Flexible Server:

   ```azurecli
   az postgres flexible-server firewall-rule create \
       --rule-name allAzureIPs \
       --name ${POSTGRES_SERVER_NAME} \
       --resource-group ${RESOURCE_GROUP} \
       --start-ip-address 0.0.0.0 \
       --end-ip-address 0.0.0.0
   ```

1. Use the following command to enable the `uuid-ossp` extension for the newly created Flexible Server:

   ```azurecli
   az postgres flexible-server parameter set \
       --resource-group ${RESOURCE_GROUP} \
       --name azure.extensions \
       --value uuid-ossp \
       --server-name ${POSTGRES_SERVER_NAME}
   ```

1. Use the following command to create a database for the Order Service application:

   ```azurecli
   az postgres flexible-server db create \
       --resource-group ${RESOURCE_GROUP} \
       --server-name ${POSTGRES_SERVER_NAME} \
       --database-name acmefit_order
   ```

1. Use the following command to create a database for the Catalog Service application:

   ```azurecli
   az postgres flexible-server db create \
       --resource-group ${RESOURCE_GROUP} \
       --server-name ${POSTGRES_SERVER_NAME} \
       --database-name acmefit_catalog
   ```

### [ARM template](#tab/arm-template)

The following instructions describe how to provision an Azure Cache for Redis and an Azure Database for PostgreSQL Flexible Server by using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

You can find the template used in this quickstart in the [fitness store sample GitHub repository](https://github.com/Azure-Samples/acme-fitness-store/blob/HEAD/azure-spring-apps-enterprise/resources/json/deploy/azuredeploy.json).

To deploy this template, follow these steps:

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Cache for Redis and an Azure Database for PostgreSQL Flexible Server.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Facme-fitness-store%2FAzure%2Fazure-spring-apps-enterprise%2Fresources%2Fjson%2Fdeploy%2Fazuredeploy.json":::

1. Enter values for the following fields:

   - **Resource Group:** Select **Create new**, enter a unique name for the **resource group**, and then select **OK**.
   - **cacheName:** Enter the name for the Azure Cache for Redis Server.
   - **dbServerName:** Enter the name for the Azure Database for PostgreSQL Flexible Server.
   - **administratorLogin:** Enter the admin username for the Azure Database for PostgreSQL Flexible Server.
   - **administratorLoginPassword:** Enter the admin password for the Azure Database for PostgreSQL Flexible Server.
   - **tags:** Enter any custom tags.

1. Select **Review + Create** and then **Create**.

---

## Create Service Connectors

The following steps show how to bind applications running in the Azure Spring Apps Enterprise plan to other Azure services by using Service Connectors.

1. Use the following command to create a service connector to Azure Database for PostgreSQL for the Order Service application:

   ```azurecli
   az spring connection create postgres-flexible \
       --resource-group ${RESOURCE_GROUP} \
       --target-resource-group ${RESOURCE_GROUP} \
       --connection order_service_db \
       --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME} \
       --app order-service \
       --deployment default \
       --server ${POSTGRES_SERVER_NAME} \
       --database acmefit_order \
       --secret name=${POSTGRES_USERNAME} secret=${POSTGRES_PASSWORD} \
       --client-type dotnet
   ```

1. Use the following command to create a service connector to Azure Database for PostgreSQL for the Catalog Service application:

   ```azurecli
   az spring connection create postgres-flexible \
       --resource-group ${RESOURCE_GROUP} \
       --target-resource-group ${RESOURCE_GROUP} \
       --connection catalog_service_db \
       --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME} \
       --app catalog-service \
       --deployment default \
       --server ${POSTGRES_SERVER_NAME} \
       --database acmefit_catalog \
       --secret name=${POSTGRES_USERNAME} secret=${POSTGRES_PASSWORD} \
       --client-type springboot
   ```

1. Use the following command to create a service connector to Azure Cache for Redis for the Cart Service application:

   ```azurecli
   az spring connection create redis \
       --resource-group ${RESOURCE_GROUP} \
       --target-resource-group ${RESOURCE_GROUP} \
       --connection cart_service_cache \
       --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME} \
       --app cart-service \
       --deployment default \
       --server ${REDIS_CACHE_NAME} \
       --database 0 \
       --client-type java
   ```

1. Use the following command to reload the Catalog Service application to load the new connection properties:

   ```azurecli
   az spring app restart \
       --resource-group ${RESOURCE_GROUP} \
       --name catalog-service \
       --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME}
   ```

1. Use the following command to retrieve the database connection information:

   ```azurecli
   export POSTGRES_CONNECTION_STR=$(az spring connection show \
       --resource-group ${RESOURCE_GROUP} \
       --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME} \
       --deployment default \
       --connection order_service_db \
       --app order-service \
       | jq '.configurations[0].value' -r)
   ```

   > [!NOTE]
   > If you get an SSL verification exception with Nofsql 6.0, be sure to change the SSL mode from `Require` to `VerifyFull`. For more information, see the [Npgsql 6.0 Release Notes](https://www.npgsql.org/doc/release-notes/6.0.html).

1. Use the following command to update the Order Service application:

   ```azurecli
   az spring app update \
       --resource-group ${RESOURCE_GROUP} \
       --name order-service \
       --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME} \
       --env "DatabaseProvider=Postgres" "ConnectionStrings__OrderContext=${POSTGRES_CONNECTION_STR}"
   ```

1. Use the following commands to retrieve Redis connection information and update the Cart Service application:

   ```azurecli
   export REDIS_CONN_STR=$(az spring connection show \
       --resource-group ${RESOURCE_GROUP} \
       --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME} \
       --deployment default \
       --app cart-service \
       --connection cart_service_cache | jq -r '.configurations[0].value')

   export GATEWAY_URL=$(az spring gateway show \
       --resource-group ${RESOURCE_GROUP} \
       --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME} | jq -r '.properties.url')
    
   az spring app update \
       --resource-group ${RESOURCE_GROUP} \
       --name cart-service \
       --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME} \
       --env "CART_PORT=8080" "REDIS_CONNECTIONSTRING=${REDIS_CONN_STR}" "AUTH_URL=https://${GATEWAY_URL}"
   ```

## Access the application

Retrieve the URL for Spring Cloud Gateway and explore the updated application. You can use the output from the following command to explore the application:

```azurecli
export GATEWAY_URL=$(az spring gateway show \
    --resource-group ${RESOURCE_GROUP} \
    --service ${AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME} | jq -r '.properties.url')

echo "https://${GATEWAY_URL}"
```

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

Continue on to any of the following optional quickstarts:

- [Configure single sign-on](quickstart-configure-single-sign-on-enterprise.md)
- [Load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
- [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
- [Set request rate limits](quickstart-set-request-rate-limits-enterprise.md)
- [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)
- [Integrate Azure OpenAI](quickstart-fitness-store-azure-openai.md)
