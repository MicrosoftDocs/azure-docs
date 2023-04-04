---
title: "Quickstart - Integrate with Azure Database for PostgreSQL and Azure Cache for Redis"
titleSuffix: Azure Spring Apps Enterprise tier
description: Explains how to provision and prepare an Azure Database for PostgreSQL and an Azure Cache for Redis to be used with apps running Azure Spring Apps Enterprise tier.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-apps
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java, service-connector, devx-track-azurecli
---

# Quickstart: Integrate with Azure Database for PostgreSQL and Azure Cache for Redis

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to provision and prepare an Azure Database for PostgreSQL and an Azure Cache for Redis to be used with apps running in Azure Spring Apps Enterprise tier.

This article uses these services for demonstration purposes. You can connect your application to any backing service of your choice by using instructions similar to the ones in the [Create Service Connectors](#create-service-connectors) section later in this article.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Understand and fulfill the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise Tier in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the steps in [Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).

## Provision services

To add persistence to the application, create an Azure Cache for Redis and an Azure Database for PostgreSQL Flexible Server.

### [Azure CLI](#tab/azure-cli)

The following steps describe how to provision an Azure Cache for Redis instance and an Azure Database for PostgreSQL Flexible Server by using the Azure CLI.

1. Use the following command to create an instance of Azure Cache for Redis:

   ```azurecli
   az redis create \
       --resource-group <resource-group-name> \
       --name <redis-cache-name> \
       --location ${REGION} \
       --sku Basic \
       --vm-size c0
   ```

   > [!NOTE]
   > Redis Cache creation takes approximately 20 minutes.

1. Use the following command to create an Azure Database for PostgreSQL Flexible Server instance:

   ```azurecli
   az postgres flexible-server create \
       --resource-group <resource-group-name> \
       --name <postgres-server-name> \
       --location <location> \
       --admin-user <postgres-username> \
       --admin-password <postgres-password> \
       --yes
   ```

1. Use the following command to allow connections from other Azure Services to the newly created Flexible Server:

   ```azurecli
   az postgres flexible-server firewall-rule create \
       --rule-name allAzureIPs \
       --name <postgres-server-name> \
       --resource-group <resource-group-name> \
       --start-ip-address 0.0.0.0 \
       --end-ip-address 0.0.0.0
   ```

1. Use the following command to enable the `uuid-ossp` extension for the newly created Flexible Server:

   ```azurecli
   az postgres flexible-server parameter set \
       --resource-group <resource-group-name> \
       --name azure.extensions \
       --value uuid-ossp \
       --server-name <postgres-server-name> \
   ```

1. Use the following command to create a database for the Order Service application:

   ```azurecli
   az postgres flexible-server db create \
       --resource-group <resource-group-name> \
       --server-name <postgres-server-name> \
       --database-name acmefit_order
   ```

1. Use the following command to create a database for the Catalog Service application:

   ```azurecli
   az postgres flexible-server db create \
       --resource-group <resource-group-name> \
       --server-name <postgres-server-name> \
       --database-name acmefit_catalog
   ```

### [ARM template](#tab/arm-template)

The following instructions describe how to provision an Azure Cache for Redis and an Azure Database for PostgreSQL Flexible Server by using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

You can find the template used in this quickstart in the [fitness store sample GitHub repository](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/azure/templates/azuredeploy.json).

To deploy this template, follow these steps:

1. Select the following image to sign in to Azure and open a template. The template creates an Azure Cache for Redis and an Azure Database for PostgreSQL Flexible Server.

   :::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Button to deploy the ARM template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Facme-fitness-store%2FAzure%2Fazure%2Ftemplates%2Fazuredeploy.json":::

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

The following steps show how to bind applications running in Azure Spring Apps Enterprise tier to other Azure services by using Service Connectors.

1. Use the following command to create a service connector to Azure Database for PostgreSQL for the Order Service application:

   ```azurecli
   az spring connection create postgres-flexible \
       --resource-group <resource-group-name> \
       --target-resource-group <target-resource-group> \
       --connection order_service_db \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app order-service \
       --deployment default \
       --server <postgres-server-name> \
       --database acmefit_order \
       --secret name=<postgres-username> secret=<postgres-password> \
       --client-type dotnet
   ```

1. Use the following command to create a service connector to Azure Database for PostgreSQL for the Catalog Service application:

   ```azurecli
   az spring connection create postgres-flexible \
       --resource-group <resource-group-name> \
       --target-resource-group <target-resource-group> \
       --connection catalog_service_db \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app catalog-service \
       --deployment default \
       --server <postgres-server-name> \
       --database acmefit_catalog \
       --secret name=<postgres-username> secret=<postgres-password> \
       --client-type springboot
   ```

1. Use the following command to create a service connector to Azure Cache for Redis for the Cart Service application:

   ```azurecli
   az spring connection create redis \
       --resource-group <resource-group-name> \
       --target-resource-group <target-resource-group> \
       --connection cart_service_cache \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app cart-service \
       --deployment default \
       --server <redis-cache-name> \
       --database 0 \
       --client-type java
   ```

1. Use the following command to reload the Catalog Service application to load the new connection properties:

   ```azurecli
   az spring app restart
       --resource-group <resource-group-name> \
       --name catalog-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following commands to retrieve the database connection information and update the Order Service application:

   ```azurecli
   POSTGRES_CONNECTION_STR=$(az spring connection show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --deployment default \
       --connection order_service_db \
       --app order-service | jq '.configurations[0].value' -r)

   az spring app update \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "DatabaseProvider=Postgres" "ConnectionStrings__OrderContext=${POSTGRES_CONNECTION_STR}"
   ```

1. Use the following commands to retrieve Redis connection information and update the Cart Service application:

   ```azurecli
   REDIS_CONN_STR=$(az spring connection show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --deployment default \
       --app cart-service \
       --connection cart_service_cache | jq -r '.configurations[0].value')

   az spring app update \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "CART_PORT=8080" "REDIS_CONNECTIONSTRING=${REDIS_CONN_STR}"
   ```

## Access the application

Retrieve the URL for Spring Cloud Gateway and explore the updated application. You can use the output from the following command to explore the application:

```azurecli
GATEWAY_URL=$(az spring gateway show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

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
