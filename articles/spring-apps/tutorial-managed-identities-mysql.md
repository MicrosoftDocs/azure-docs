---
title:  "Tutorial: Managed identity to connect an Azure Database for MySQL to apps in Azure Spring Apps"
description: Set up managed identity to connect an Azure Database for MySQL to apps in Azure Spring Apps
author: karlerickson
ms.author: xiading
ms.service: spring-apps
ms.topic: tutorial
ms.date: 03/30/2022
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
---

# Tutorial: Use a managed identity to connect an Azure Database for MySQL to an app in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java

This article shows you how to create a managed identity for an app in Azure Spring Apps. This article also shows you how to use the managed identity to access an Azure Database for MySQL with the  MySQL password stored in Key Vault.

The following video describes how to manage secrets using Azure Key Vault.


> [!VIDEO https://www.youtube.com/embed/A8YQOoZncu8?list=PLPeZXlCR7ew8LlhnSH63KcM0XhMKxT1k_]

## Prerequisites

* [JDK 8](/azure/java/jdk/java-jdk-install)
* [Maven 3.0 or above](http://maven.apache.org/install.html)
* [Azure CLI](/cli/azure/install-azure-cli) or [Azure Cloud Shell](../cloud-shell/overview.md)
* An existing Key Vault. If you need to create a Key Vault, you can use the [Azure portal](../key-vault/secrets/quick-create-portal.md) or [Azure CLI](/cli/azure/keyvault#az-keyvault-create)
* An existing Azure Database for MySQL instance with a database named `demo`. If you need to create an Azure Database for MySQL, you can use the [Azure portal](../mysql/quickstart-create-mysql-server-database-using-azure-portal.md) or [Azure CLI](../mysql/quickstart-create-mysql-server-database-using-azure-cli.md)

## Create a resource group

A resource group is a logical container where Azure resources are deployed and managed. Create a resource group to contain both the Key Vault and Spring Cloud using the command [az group create](/cli/azure/group#az-group-create):

```azurecli
az group create --location <location> --name <resource-group-name>
```

## Set up your Key Vault

To create a Key Vault, use the command [az keyvault create](/cli/azure/keyvault#az-keyvault-create):

> [!IMPORTANT]
> Each Key Vault must have a unique name. Replace *\<key-vault-name>* with the name of your Key Vault in the following examples.

```azurecli
az keyvault create --resource-group <resource-group-name> --name <key-vault-name>
```

Make a note of the returned `vaultUri`, which will be in the format `https://<key-vault-name>.vault.azure.net`. It will be used in the following step.

You can now place a secret in your Key Vault with the command [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set):

```azurecli
az keyvault secret set \
    --vault-name <key-vault-name> \
    --name <mysql-password> \
    --value <mysql-password>
```

## Set up your Azure Database for MySQL

To create an Azure Database for MySQL, use the [Azure portal](../mysql/quickstart-create-mysql-server-database-using-azure-portal.md) or [Azure CLI](../mysql/quickstart-create-mysql-server-database-using-azure-cli.md)

Create a database named *demo* for later use.

```azurecli
az mysql db create \
    --resource-group <resource-group-name> \
    --name demo \
    --server-name <mysql-instance-name>
```

## Create an app and service in Azure Spring Apps

After installing the corresponding extension, create an Azure Spring Apps instance with the Azure CLI command [az spring create](/cli/azure/spring#az-spring-cloud-create).

```azurecli
az extension add --name spring
az spring create --name <Azure-Spring-Apps-instance-name> --resource-group <resource-group-name>
```

The following example creates an app named `springapp` with a system-assigned managed identity, as requested by the `--assign-identity` parameter.

```azurecli
az spring app create \
   --resource-group <resource-group-name> \
   --service <Azure-Spring-Apps-instance-name>
   --name springapp 
   --assign-endpoint true \
   --assign-identity
export SERVICE_IDENTITY=$(az spring app show --name springapp -s <Azure-Spring-Apps-instance-name> -g <resource-group-name> | jq -r '.identity.principalId')
```

Make a note of the returned `url`, which will be in the format `https://<app-name>.azuremicroservices.io`. It will be used in the following step.

## Grant your app access to Key Vault

Use [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) to grant proper access in Key Vault for your app.

```azurecli
az keyvault set-policy 
   --name <key-vault-name> \
   --object-id ${SERVICE_IDENTITY} \
   --secret-permissions set get list
```

> [!NOTE]
> Use `az keyvault delete-policy --name <key-vault-name> --object-id ${SERVICE_IDENTITY}` to remove the access for your app after system-assigned managed identity is disabled.

## Build a sample Spring Boot app with Spring Boot starter

This [sample](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/managed-identity-mysql) will create an entry and list entires from MySQL.

1. Clone a sample project.

   ```azurecli
   git clone https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples.git
   ```

2. Specify your Key Vault and Azure Database for MySQL information in your app's `application.properties`.

   ```properties
   spring.datasource.url=jdbc:mysql://<mysql-instance-name>.mysql.database.azure.com:3306/demo?serverTimezone=UTC
   spring.datasource.username=<mysql-username>@<mysql-instance-name>
   spring.cloud.azure.keyvault.secret.endpoint=https://<keyvault-instance-name>.vault.azure.net/
   ```

3. Package your sample app.

   ```azurecli
   mvn clean package
   ```

4. Now deploy the app to Azure with the Azure CLI command [az spring app deploy](/cli/azure/spring/app#az-spring-cloud-app-deploy).

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name springapp \
       --jar-path target/asc-managed-identity-mysql-sample-0.1.0.jar
   ```

5. Access the public endpoint or test endpoint to test your app.

   ```bash
   # Create an entry in table
   curl --header "Content-Type: application/json" \
        --request POST \
        --data '{"description":"configuration","details":"congratulations, you have set up JDBC correctly!","done": "true"}' \
               https://myspringcloud-springapp.azuremicroservices.io

   # List entires in table
   curl https://myspringcloud-springapp.azuremicroservices.io
   ```

## Next Steps

* [Managed identity to connect Key Vault](tutorial-managed-identities-key-vault.md)
* [Managed identity to invoke Azure functions](tutorial-managed-identities-functions.md)
