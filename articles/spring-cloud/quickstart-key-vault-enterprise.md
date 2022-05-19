---
title: "Quickstart - Securely Load Application Secrets using Key Vault"
description: Explains how to use Azure Key Vault to securely load secrets for apps running Azure Spring Apps Enterprise tier.
author: KarlErickson
ms.author: asirveda # external contributor: paly@vmware.com
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 05/31/2022
ms.custom: devx-track-java
---

# Quickstart: Securely load application secrets using Key Vault

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard tier ✔️ Enterprise tier

This quickstart shows you how to securely load secrets using Azure Key Vault for apps running Azure Spring Apps Enterprise tier.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A license for Azure Spring Apps Enterprise tier. For more information, see [View Azure Spring Apps Enterprise tier Offer in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the previous quickstarts in this series:
  - [Build and deploy apps to Azure Spring Apps using the Enterprise tier](quickstart-deploy-apps-enterprise.md).
  - [Integrate with Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)

## Provision Key Vault and store secrets

The following instructions describe how to create a Key Vault and to securely save application secrets.

1. Create a Key Vault to store application secrets using the following command:

   ```azurecli
   az keyvault create \
       --resource-group <resource-group-name> \
       --name <key-vault-name>
   ```

1. Store the full database server name in Key Vault using the following command:

   ```azurecli
   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "POSTGRES-SERVER-NAME" \
       --value "<postgres-server-name>.postgres.database.azure.com"
   ```

1. Store the database name in Key Vault for the Catalog Service Application using the following command:

   ```azurecli
   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "CATALOG-DATABASE-NAME" \
       --value "acmefit_catalog"
   ```

1. Store the database login credentials in Key Vault using the following commands:

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

1. Store the database connection string in Key Vault for the Order Service Application using the following command:

   ```azurecli
   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "ConnectionStrings--OrderContext" \
       --value "Server=<postgres-server-name>;Database=acmefit_order;Port=5432;Ssl Mode=Require;User Id=<postgres-user>;Password=<postgres-password>;"
   ```

1. Retrieve redis connection properties and store in Key Vault using the following commands:

   ```azurecli
   REDIS_HOST=$(az redis show \
       --resource-group <resource-group-name> \
       --name <redis-cache-name> | jq -r '.hostName')

   REDIS_PORT=$(az redis show \
       --resource-group <resource-group-name> \
       --name <redis-cache-name> | jq -r '.sslPort')

   REDIS_PRIMARY_KEY=$(az redis list-keys \
       --resource-group <resource-group-name> \
       --name <redis-cache-name> | jq -r '.primaryKey')

   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "CART-REDIS-CONNECTION-STRING" \
       --value "rediss://:${REDIS_PRIMARY_KEY}@${REDIS_HOST}:${REDIS_PORT}/0"
   ```

1. If [Single Sign-On](quickstart-configure-single-sign-on-enterprise.md) is configured, store the JSON Web Key (JWK) URI in Key Vault using the following command:

   ```azurecli
   az keyvault secret set \
       --vault-name <key-vault-name> \
       --name "SSO-PROVIDER-JWK-URI" \
       --value <jwk-uri>
   ```

## Enable access to secrets in Key Vault

The following instructions describe how to allow access to Key Vault secrets to applications deployed to Azure Spring Apps Enterprise tier.

1. Enable a System Assigned Identity for the Cart Service Application using the following command:

   ```azurecli
   az spring app identity assign \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Set an access policy of `get list` on Key Vault for the Cart Service Application using the following commands:

   ```azurecli
   CART_SERVICE_APP_IDENTITY=$(az spring app show \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.identity.principalId')

   az keyvault set-policy \
       --name <key-vault-name> \
       --object-id ${CART_SERVICE_APP_IDENTITY} \
       --secret-permissions get list
   ```

1. Enable a System Assigned Identity for the Order Service Application using the following command:

   ```azurecli
   az spring app identity assign \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Set an access policy of `get list` on Key Vault for the Order Service Application using the following commands:

   ```azurecli
   ORDER_SERVICE_APP_IDENTITY=$(az spring app show \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.identity.principalId')

   az keyvault set-policy \
       --name <key-vault-name> \
       --object-id ${ORDER_SERVICE_APP_IDENTITY} \
       --secret-permissions get list
   ```

1. Enable a System Assigned Identity for the Catalog Service Application using the following command:

   ```azurecli
   az spring app identity assign \
       --resource-group <resource-group-name> \
       --name catalog-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Set an access policy of `get list` on Key Vault for the Catalog Service Application using the following commands:

   ```azurecli
   CATALOG_SERVICE_APP_IDENTITY=$(az spring app show \
       --resource-group <resource-group-name> \
       --name catalog-service \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.identity.principalId')

   az keyvault set-policy \
       --name <key-vault-name> \
       --object-id ${CATALOG_SERVICE_APP_IDENTITY} \
       --secret-permissions get list
   ```

1. If [Single Sign-On](quickstart-configure-single-sign-on-enterprise.md) is configured, enable a System Assigned Identity for the Identity Service Application using the following command:

   ```azurecli
   az spring app identity assign \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

1. Set an access policy of `get list` on Key Vault for the Identity Service Application using the following commands:

   ```azurecli
   IDENTITY_SERVICE_APP_IDENTITY=$(az spring app show \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.identity.principalId')

   az keyvault set-policy \
       --name <key-vault-name> \
       --object-id ${IDENTITY_SERVICE_APP_IDENTITY} \
       --secret-permissions get list
   ```

## Update applications to use secrets

After granting access to read secrets from Key Vault, the applications must be updated to use the new secret values in their configurations. The following instructions describe how to do this.

1. Retrieve the URI for Key Vault to be used in updating applications using the following command:

   ```azurecli
   KEYVAULT_URI=$(az keyvault show --name <key-vault-name> | jq -r '.properties.vaultUri')
   ```

1. Retrieve the URL for Spring Cloud Gateway to be used in updating applications using the following command:

   ```azurecli
   GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')
   ```

1. Remove the Service Connector binding the Order Service application and the Azure Database for PostgreSQL Flexible Server using the following command:

   ```azurecli
   az spring connection delete \
       --resource-group <resource-group-name> \
       --app order-service \
       --connection order_service_db \
       --service <Azure-Spring-Apps-service-instance-name> \
       --deployment default \
       --yes
   ```

1. Update the Order Service environment with the URI to access Key Vault using the following command:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name order-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "ConnectionStrings__KeyVaultUri=${KEYVAULT_URI}" "AcmeServiceSettings__AuthUrl=https://${GATEWAY_URL}" "DatabaseProvider=Postgres"
   ```

1. Remove the Service Connector binding the Catalog Service application and the Azure Database for PostgreSQL Flexible Server using the following command:

   ```azurecli
   az spring connection delete \
       --resource-group <resource-group-name> \
       --app catalog-service \
       --connection catalog_service_db \
       --service <Azure-Spring-Apps-service-instance-name> \
       --deployment default \
       --yes
   ```

1. Update the Catalog Service environment and configuration pattern to access Key Vault using the following command:

   ```azurecli
    az spring app update \
       --resource-group <resource-group-name> \
       --name catalog-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --config-file-pattern catalog/default,catalog/key-vault \
       --env "SPRING_CLOUD_AZURE_KEYVAULT_SECRET_PROPERTY_SOURCES_0_ENDPOINT=${KEYVAULT_URI}" "SPRING_CLOUD_AZURE_KEYVAULT_SECRET_PROPERTY_SOURCES_0_NAME='acme-fitness-store-vault'" "SPRING_PROFILES_ACTIVE=default,key-vault"
   ```

1. Remove the Service Connector binding the Cart Service application and the Azure Cache for Redis using the following command:

   ```azurecli
   az spring connection delete \
       --resource-group <resource-group-name> \
       --app cart-service \
       --connection cart_service_cache \
       --service <Azure-Spring-Apps-service-instance-name> \
       --deployment default \
       --yes
   ```

1. Update the Cart Service environment to access Key Vault using the following command:

   ```azurecli
   az spring app update \
       --resource-group <resource-group-name> \
       --name cart-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --env "CART_PORT=8080" "KEYVAULT_URI=${KEYVAULT_URI}" "AUTH_URL=https://${GATEWAY_URL}"
   ```

1. Update the Identity Service environment and configuration pattern to access Key Vault using the following command:

   ```azurecli
    az spring app update \
       --resource-group <resource-group-name> \
       --name identity-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --config-file-pattern identity/default,identity /key-vault \
       --env "SPRING_CLOUD_AZURE_KEYVAULT_SECRET_PROPERTY_SOURCES_0_ENDPOINT=${KEYVAULT_URI}" "SPRING_CLOUD_AZURE_KEYVAULT_SECRET_PROPERTY_SOURCES_0_NAME='acme-fitness-store-vault'" "SPRING_PROFILES_ACTIVE=default,key-vault"
   ```

1. Retrieve the URL for Spring Cloud Gateway using the following commands:

   ```azurecli
   GATEWAY_URL=$(az spring gateway show \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> | jq -r '.properties.url')

   echo "https://${GATEWAY_URL}"
   ```

    The above URL can be opened in a browser, use this to explore the updated application.

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
> [Quickstart: Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
