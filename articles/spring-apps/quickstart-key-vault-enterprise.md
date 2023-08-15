---
title: "Quickstart - Load application secrets using Key Vault"
titleSuffix: Azure Spring Apps Enterprise plan
description: Explains how to use Azure Key Vault to securely load secrets for apps running the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-apps
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java, devx-track-extended-java, service-connector, devx-track-azurecli
---

# Quickstart: Load application secrets using Key Vault

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This quickstart shows you how to securely load secrets using Azure Key Vault for apps running the Azure Spring Apps Enterprise plan.

Every application has properties that connect it to its environment and supporting services. These services include resources like databases, logging and monitoring tools, messaging platforms, and so on. Each resource requires a way to locate and access it, often in the form of URLs and credentials. This information is often protected by law, and must be kept secret in order to protect customer data. In Azure Spring Apps, you can configure applications to directly load these secrets into memory from Key Vault by using managed identities and Azure role-based access control.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Understand and fulfill the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the steps in the following quickstarts:
  - [Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
  - [Integrate with Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)

## Provision Key Vault and store secrets

The following instructions describe how to create a Key Vault and securely save application secrets.

1. Use the following command to create a Key Vault to store application secrets:

   ```azurecli
   az keyvault create \
       --resource-group <resource-group-name> \
       --name <key-vault-name>
   ```

1. Use the following command to store the full database server name in Key Vault:

   ```azurecli
   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "POSTGRES-SERVER-NAME" \
       --value "<postgres-server-name>.postgres.database.azure.com"
   ```

1. Use the following command to store the database name in Key Vault for the Catalog Service application:

   ```azurecli
   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "CATALOG-DATABASE-NAME" \
       --value "acmefit_catalog"
   ```

1. Use the following commands to store the database login credentials in Key Vault:

   ```azurecli
   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "POSTGRES-LOGIN-NAME" \
       --value "<postgres-username>"

   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "POSTGRES-LOGIN-PASSWORD" \
       --value "<postgres-password>"
   ```

1. Use the following command to store the database connection string in Key Vault for the Order Service application:

   ```azurecli
   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "ConnectionStrings--OrderContext" \
       --value "Server=<postgres-server-name>;Database=acmefit_order;Port=5432;Ssl Mode=Require;User Id=<postgres-user>;Password=<postgres-password>;"
   ```

1. Use the following commands to retrieve Redis connection properties and store them in Key Vault:

   ```azurecli
   export REDIS_HOST=$(az redis show \
       --resource-group <resource-group-name> \
       --name <redis-cache-name> | jq -r '.hostName')

   export REDIS_PORT=$(az redis show \
       --resource-group <resource-group-name> \
       --name <redis-cache-name> | jq -r '.sslPort')

   export REDIS_PRIMARY_KEY=$(az redis list-keys \
       --resource-group <resource-group-name> \
       --name <redis-cache-name> | jq -r '.primaryKey')

   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "CART-REDIS-CONNECTION-STRING" \
       --value "rediss://:${REDIS_PRIMARY_KEY}@${REDIS_HOST}:${REDIS_PORT}/0"
   ```

1. If you've configured [single sign-on](quickstart-configure-single-sign-on-enterprise.md), use the following command to store the JSON Web Key (JWK) URI in Key Vault:

   ```azurecli
   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "SSO-PROVIDER-JWK-URI" \
       --value <jwk-uri>
   ```

## Grant applications access to secrets in Key Vault

The following instructions describe how to grant access to Key Vault secrets to applications deployed to the Azure Spring Apps Enterprise plan.

1. Use the following command to enable a System Assigned Identity for the Cart Service application:

   ```azurecli
   az spring app identity assign \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following commands to set an access policy of `get list` on Key Vault for the Cart Service application:

   ```azurecli
   export CART_SERVICE_APP_IDENTITY=$(az spring app show \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.identity.principalId')

   az keyvault set-policy \
       --name <key-vault-name> \
       --object-id ${CART_SERVICE_APP_IDENTITY} \
       --secret-permissions get list
   ```

1. Use the following command to enable a System Assigned Identity for the Order Service application:

   ```azurecli
   az spring app identity assign \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following commands to set an access policy of `get list` on Key Vault for the Order Service application:

   ```azurecli
   export ORDER_SERVICE_APP_IDENTITY=$(az spring app show \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.identity.principalId')

   az keyvault set-policy \
       --name <key-vault-name> \
       --object-id ${ORDER_SERVICE_APP_IDENTITY} \
       --secret-permissions get list
   ```

1. Use the following command to enable a System Assigned Identity for the Catalog Service application:

   ```azurecli
   az spring app identity assign \
       --resource-group <resource-group-name> \
       --name catalog-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following commands to set an access policy of `get list` on Key Vault for the Catalog Service application:

   ```azurecli
   export CATALOG_SERVICE_APP_IDENTITY=$(az spring app show \
       --resource-group <resource-group-name> \
       --name catalog-service \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.identity.principalId')

   az keyvault set-policy \
       --name <key-vault-name> \
       --object-id ${CATALOG_SERVICE_APP_IDENTITY} \
       --secret-permissions get list
   ```

1. If you've configured [single sign-on](quickstart-configure-single-sign-on-enterprise.md), use the following command to enable a System Assigned Identity for the Identity Service application:

   ```azurecli
   az spring app identity assign \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Use the following commands to set an access policy of `get list` on Key Vault for the Identity Service application:

   ```azurecli
   export IDENTITY_SERVICE_APP_IDENTITY=$(az spring app show \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.identity.principalId')

   az keyvault set-policy \
       --name <key-vault-name> \
       --object-id ${IDENTITY_SERVICE_APP_IDENTITY} \
       --secret-permissions get list
   ```

## Update applications to load Key Vault secrets

After granting access to read secrets from Key Vault, use the following steps to update the applications to use the new secret values in their configurations.

1. Use the following command to retrieve the URI for Key Vault to be used in updating applications:

   ```azurecli
   export KEYVAULT_URI=$(az keyvault show --name <key-vault-name> | jq -r '.properties.vaultUri')
   ```

1. Use the following command to retrieve the URL for Spring Cloud Gateway to be used in updating applications:

   ```azurecli
   export GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')
   ```

1. Use the following command to remove the Service Connector binding the Order Service application and the Azure Database for PostgreSQL Flexible Server:

   ```azurecli
   az spring connection delete \
       --resource-group <resource-group-name> \
       --app order-service \
       --connection order_service_db \
       --service <Azure-Spring-Apps-service-instance-name> \
       --deployment default \
       --yes
   ```

1. Use the following command to update the Order Service environment with the URI to access Key Vault:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "ConnectionStrings__KeyVaultUri=${KEYVAULT_URI}" "AcmeServiceSettings__AuthUrl=https://${GATEWAY_URL}" "DatabaseProvider=Postgres"
   ```

1. Use the following command to remove the Service Connector binding the Catalog Service application and the Azure Database for PostgreSQL Flexible Server:

   ```azurecli
   az spring connection delete \
       --resource-group <resource-group-name> \
       --app catalog-service \
       --connection catalog_service_db \
       --service <Azure-Spring-Apps-service-instance-name> \
       --deployment default \
       --yes
   ```

1. Use the following command to update the Catalog Service environment and configuration pattern to access Key Vault:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name catalog-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --config-file-pattern catalog/default,catalog/key-vault \
       --env "SPRING_CLOUD_AZURE_KEYVAULT_SECRET_PROPERTY_SOURCES_0_ENDPOINT=${KEYVAULT_URI}" "SPRING_CLOUD_AZURE_KEYVAULT_SECRET_PROPERTY_SOURCES_0_NAME='acme-fitness-store-vault'" "SPRING_PROFILES_ACTIVE=default,key-vault"
   ```

1. Use the following command to remove the Service Connector binding the Cart Service application and the Azure Cache for Redis:

   ```azurecli
   az spring connection delete \
       --resource-group <resource-group-name> \
       --app cart-service \
       --connection cart_service_cache \
       --service <Azure-Spring-Apps-service-instance-name> \
       --deployment default \
       --yes
   ```

1. Use the following command to update the Cart Service environment to access Key Vault:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "CART_PORT=8080" "KEYVAULT_URI=${KEYVAULT_URI}" "AUTH_URL=https://${GATEWAY_URL}"
   ```

1. Use the following command to update the Identity Service environment and configuration pattern to access Key Vault:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --config-file-pattern identity/default,identity/key-vault \
       --env "SPRING_CLOUD_AZURE_KEYVAULT_SECRET_PROPERTY_SOURCES_0_ENDPOINT=${KEYVAULT_URI}" "SPRING_CLOUD_AZURE_KEYVAULT_SECRET_PROPERTY_SOURCES_0_NAME='acme-fitness-store-vault'" "SPRING_PROFILES_ACTIVE=default,key-vault"
   ```

1. Use the following commands to retrieve the URL for Spring Cloud Gateway:

   ```azurecli
   export GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   echo "https://${GATEWAY_URL}"
   ```

   You can open the output URL in a browser to explore the updated application.

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
- [Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
- [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
- [Set request rate limits](quickstart-set-request-rate-limits-enterprise.md)
- [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)
