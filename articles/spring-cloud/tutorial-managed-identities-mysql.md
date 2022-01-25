---
title:  "Tutorial: Managed identity to connect Azure Database for MySQL"
description: Set up managed identity to connect Azure Database for MySQL to an Azure Spring Cloud app
author: xiading
ms.author: xiading
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 01/25/2022
ms.custom: devx-track-java, devx-track-azurecli
---

# Tutorial: Use a managed identity to connect Azure Database for MySQL to an Azure Spring Cloud app

**This article applies to:** ✔️ Java

This article shows you how to create a managed identity for an Azure Spring Cloud app and use it to access Azure Database for MySQL while store the MySQL password in Key Vault for security consideration.

The following video describes how to manage secrets using Azure Key Vault.

<br>

> [!VIDEO https://www.youtube.com/embed/A8YQOoZncu8?list=PLPeZXlCR7ew8LlhnSH63KcM0XhMKxT1k_]

## Prerequisites

* [JDK 8](/azure/java/jdk/java-jdk-install)
* [Maven 3.0 and above](http://maven.apache.org/install.html)
* [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Azure Cloud Shell](/azure/cloud-shell/overview)
* An existing Key Vault. If you need to create a Key Vault, you can use the [Azure Portal](/azure/key-vault/secrets/quick-create-portal) or [Azure CLI](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-create)
* An existing Azure Database for MySQL instance with a database with name `demo`. If you need to create Azure Database for MySQL, you can use the [Azure Portal](/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal) or [Azure CLI](/azure/mysql/quickstart-create-mysql-server-database-using-azure-cli)

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group to contain both the Key Vault and Spring Cloud using the command [az group create](/cli/azure/group#az_group_create):

```azurecli
az group create --name "myResourceGroup" -l "EastUS"

## Set up your Key Vault

To create a Key Vault, use the command [az keyvault create](/cli/azure/keyvault#az_keyvault_create):

> [!Important]
> Each Key Vault must have a unique name. Replace *\<your-keyvault-name>* with the name of your Key Vault in the following examples.

```azurecli
az keyvault create --name "<your-keyvault-name>" -g "myResourceGroup"
```

Make a note of the returned `vaultUri`, which will be in the format `https://<your-keyvault-name>.vault.azure.net`. It will be used in the following step.

You can now place a secret in your Key Vault with the command [az keyvault secret set](/cli/azure/keyvault/secret#az_keyvault_secret_set):

```azurecli
az keyvault secret set --vault-name "<your-keyvault-name>" \
    --name "MYSQL-PASSWORD" \
    --value "<MySQL-PASSWORD>"
```

## Set up your Azure Database for MySQL

To create a Azure Database for MySQL, use [Azure Portal](/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal) or [Azure CLI](/azure/mysql/quickstart-create-mysql-server-database-using-azure-cli)

Please create a database named `demo` for later use.
```azurecli
az mysql db create \
    --resource-group "myResourceGroup" \
    --name demo \
    --server-name "<mysql-name>"
```

## Create Azure Spring Cloud service and app

After installing corresponding extension, create an Azure Spring Cloud instance with the Azure CLI command `az spring-cloud create`.

```azurecli
az extension add --name spring-cloud
az spring-cloud create -n "myspringcloud" -g "myResourceGroup"
```

The following example creates an app named `springapp` with a system-assigned managed identity, as requested by the `--assign-identity` parameter.

```azurecli
az spring-cloud app create -n "springapp" -s "myspringcloud" -g "myResourceGroup" --assign-endpoint true --assign-identity
export SERVICE_IDENTITY=$(az spring-cloud app show --name "springapp" -s "myspringcloud" -g "myResourceGroup" | jq -r '.identity.principalId')
```

Make a note of the returned `url`, which will be in the format `https://<your-app-name>.azuremicroservices.io`. It will be used in the following step.

## Grant your app access to Key Vault

Use `az keyvault set-policy` to grant proper access in Key Vault for your app.

```azurecli
az keyvault set-policy --name "<your-keyvault-name>" --object-id ${SERVICE_IDENTITY} --secret-permissions set get list
```

> [!NOTE]
> Use `az keyvault delete-policy --name "<your-keyvault-name>" --object-id ${SERVICE_IDENTITY}` to remove the access for your app after system-assigned managed identity is disabled.

## Build a sample Spring Boot app with Spring Boot starter

This [sample](https://github.com/leonard520/Azure-Spring-Cloud-Samples/managed-identity-mysql) can create an entry and list entires from MySQL.

1. Clone a sample project.

    ```azurecli
    git clone https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples.git
    ```

2. Specify your Key Vault and Azure Database for MySQL information in your app's `application.properties`.
    ```
    spring.datasource.url=jdbc:mysql://<mysql-instance-name>.mysql.database.azure.com:3306/demo?serverTimezone=UTC
    spring.datasource.username=<mysql-username>@<mysql-instance-name>
    spring.cloud.azure.keyvault.secret.endpoint=https://<keyvault-instance-name>.vault.azure.net/
    ```

3. Package your sample app.

    ```azurecli
    mvn clean package
    ```

4. Now deploy the app to Azure with the Azure CLI command  `az spring-cloud app deploy`.

    ```azurecli
    az spring-cloud app deploy -n "springapp" -s "myspringcloud" -g "myResourceGroup" --jar-path target/asc-managed-identity-mysql-sample-0.1.0.jar
    ```

5. Access the public endpoint or test endpoint to test your app.
    ```
    # Create an entry in table
    curl --header "Content-Type: application/json" \
        --request POST \
        --data '{"description":"configuration","details":"congratulations, you have set up JDBC correctly!","done": "true"}' \
        https://myspringcloud-springapp.azuremicroservices.io
        
    # List entires in table
    curl https://myspringcloud-springapp.azuremicroservices.io
    ```
