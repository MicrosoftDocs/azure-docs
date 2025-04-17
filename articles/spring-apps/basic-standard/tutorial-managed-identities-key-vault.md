---
title:  Connect Azure Spring Apps to Key Vault Using Managed Identities
description: Set up managed identity to connect Key Vault to an app deployed to Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 02/01/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
zone_pivot_groups: spring-apps-tier-selection
---

# Connect Azure Spring Apps to Key Vault using managed identities

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Java ❎ C#

This article shows you how to create a system-assigned or user-assigned managed identity for an app deployed to Azure Spring Apps and use it to access Azure Key Vault.

Azure Key Vault can be used to securely store and tightly control access to tokens, passwords, certificates, API keys, and other secrets for your app. You can create a managed identity in Microsoft Entra ID, and authenticate to any service that supports Microsoft Entra authentication, including Key Vault, without having to display credentials in your code.

The following video describes how to manage secrets using Azure Key Vault.

<br>

> [!VIDEO https://www.youtube.com/embed/A8YQOoZncu8?list=PLPeZXlCR7ew8LlhnSH63KcM0XhMKxT1k_]

## Prerequisites

::: zone pivot="sc-enterprise"

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](../enterprise/how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](../enterprise/how-to-enterprise-marketplace-offer.md).
- [Azure CLI](/cli/azure/install-azure-cli), version 2.55.0 or higher.

::: zone-end

::: zone pivot="sc-standard"

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli), version 2.55.0 or higher.

::: zone-end

## Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

### [System-assigned managed identity](#tab/system-assigned-managed-identity)

```azurecli
export LOCATION=<location>
export RESOURCE_GROUP=myresourcegroup
export SPRING_APPS=myasa
export APP=springapp-system
export KEY_VAULT=<your-keyvault-name>
```

### [User-assigned managed identity](#tab/user-assigned-managed-identity)

```azurecli
export LOCATION=<location>
export RESOURCE_GROUP=myresourcegroup
export SPRING_APPS=myasa
export APP=springapp-user
export KEY_VAULT=<your-keyvault-name>
export USER_ASSIGNED_IDENTITY=<user-assigned-identity-name>
```

---

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group to contain both the Key Vault and Spring Cloud using the [az group create](/cli/azure/group#az-group-create) command, as shown in the following example:

```azurecli
az group create --name ${RESOURCE_GROUP} --location ${LOCATION}
```

## Set up your Key Vault

To create a Key Vault, use the [az keyvault create](/cli/azure/keyvault#az-keyvault-create) command, as shown in the following example:

> [!IMPORTANT]
> Each Key Vault must have a unique name.

```azurecli
az keyvault create \
    --resource-group ${RESOURCE_GROUP} \
    --name ${KEY_VAULT}
```

Use the following command to show the app URL and then make a note of the returned URL, which is in the format `https://${KEY_VAULT}.vault.azure.net`. Use this value in the following step.

```azurecli
az keyvault show \
    --resource-group ${RESOURCE_GROUP} \
    --name ${KEY_VAULT} \
    --query properties.vaultUri --output tsv
```

You can now place a secret in your Key Vault by using the [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command, as shown in the following example:

```azurecli
az keyvault secret set \
    --vault-name ${KEY_VAULT} \
    --name "connectionString" \
    --value "jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;"
```

## Create Azure Spring Apps service and app

After you install all corresponding extensions, use the following command to create an Azure Spring Apps instance:

::: zone pivot="sc-enterprise"

```azurecli
az extension add --upgrade --name spring
az spring create \
    --resource-group ${RESOURCE_GROUP} \
    --sku Enterprise \
    --name ${SPRING_APPS}
```

### [System-assigned managed identity](#tab/system-assigned-managed-identity)

The following example creates the app with a system-assigned managed identity, as requested by the `--system-assigned` parameter:

```azurecli
az spring app create \
    --resource-group ${RESOURCE_GROUP} \
    --service ${SPRING_APPS} \
    --name ${APP} \
    --assign-endpoint true \
    --system-assigned
export MANAGED_IDENTITY_PRINCIPAL_ID=$(az spring app show \
    --resource-group ${RESOURCE_GROUP} \
    --service ${SPRING_APPS} \
    --name ${APP} \
    --query identity.principalId --output tsv)
```

### [User-assigned managed identity](#tab/user-assigned-managed-identity)

Use the following command to create a user-assigned managed identity:

```azurecli
az identity create --resource-group ${RESOURCE_GROUP} --name ${USER_ASSIGNED_IDENTITY}
export MANAGED_IDENTITY_PRINCIPAL_ID=$(az identity show \
    --resource-group ${RESOURCE_GROUP} \
    --name ${USER_ASSIGNED_IDENTITY} \
    --query principalId --output tsv)
export USER_IDENTITY_RESOURCE_ID=$(az identity show \
    --resource-group ${RESOURCE_GROUP} \
    --name ${USER_ASSIGNED_IDENTITY} \
    --query id --output tsv)
```

The following command creates the app with a user-assigned managed identity, as requested by the `--user-assigned` parameter:

```azurecli
az spring app create \
    --resource-group ${RESOURCE_GROUP} \
    --service ${SPRING_APPS} \
    --name ${APP} \
    --user-assigned $USER_IDENTITY_RESOURCE_ID \
    --assign-endpoint true
```

---

::: zone-end

::: zone pivot="sc-standard"

```azurecli
az extension add --upgrade --name spring
az spring create \
    --resource-group ${RESOURCE_GROUP} \
    --name ${SPRING_APPS}
```

### [System-assigned managed identity](#tab/system-assigned-managed-identity)

The following example creates an app named `springapp` with a system-assigned managed identity, as requested by the `--system-assigned` parameter.

```azurecli
az spring app create \
    --resource-group ${RESOURCE_GROUP} \
    --service ${SPRING_APPS} \
    --name ${APP} \
    --assign-endpoint true \
    --runtime-version Java_17 \
    --system-assigned
export MANAGED_IDENTITY_PRINCIPAL_ID=$(az spring app show \
    --resource-group ${RESOURCE_GROUP} \
    --service ${SPRING_APPS} \
    --name ${APP} \
    --query identity.principalId --output tsv)
```

### [User-assigned managed identity](#tab/user-assigned-managed-identity)

Use the following command to create a user-assigned managed identity:

```azurecli
az identity create --resource-group ${RESOURCE_GROUP} --name ${USER_ASSIGNED_IDENTITY}
export MANAGED_IDENTITY_PRINCIPAL_ID=$(az identity show \
    --resource-group ${RESOURCE_GROUP} \
    --name ${USER_ASSIGNED_IDENTITY} \
    --query principalId --output tsv)
export USER_IDENTITY_RESOURCE_ID=$(az identity show \
    --resource-group ${RESOURCE_GROUP} \
    --name ${USER_ASSIGNED_IDENTITY} \
    --query id --output tsv)
```

The following command creates the app with a user-assigned managed identity, as requested by the `--user-assigned` parameter.

```azurecli
az spring app create \
    --resource-group ${RESOURCE_GROUP} \
    --service ${SPRING_APPS} \
    --name ${APP} \
    --user-assigned $USER_IDENTITY_RESOURCE_ID \
    --runtime-version Java_17 \
    --assign-endpoint true
```

---

::: zone-end

## Grant your app access to Key Vault

Use the following command to grant proper access in Key Vault for your app:

```azurecli
az keyvault set-policy \
    --name ${KEY_VAULT} \
    --object-id ${MANAGED_IDENTITY_PRINCIPAL_ID} \
    --secret-permissions set get list
```

> [!NOTE]
> For system-assigned managed identity, use `az keyvault delete-policy --name ${KEY_VAULT} --object-id ${MANAGED_IDENTITY_PRINCIPAL_ID}` to remove the access for your app after system-assigned managed identity is disabled.

## Build a sample Spring Boot app with Spring Boot starter

This app has access to get secrets from Azure Key Vault. Use the Azure Key Vault Secrets Spring boot starter.  Azure Key Vault is added as an instance of Spring **PropertySource**.  Secrets stored in Azure Key Vault can be conveniently accessed and used like any externalized configuration property, such as properties in files.

1. Use the following command to generate a sample project from `start.spring.io` with Azure Key Vault Spring Starter.

   ```bash
   curl https://start.spring.io/starter.tgz -d dependencies=web,azure-keyvault -d baseDir=springapp -d bootVersion=3.2.1 -d javaVersion=17 -d type=maven-project | tar -xzvf -
   ```

1. Specify your Key Vault in your app.

   ```bash
   cd springapp
   vim src/main/resources/application.properties
   ```

1. To use managed identity for an app deployed to Azure Spring Apps, add properties with the following content to the **src/main/resources/application.properties** file.

   ### [System-assigned managed identity](#tab/system-assigned-managed-identity)

   ```properties
   spring.cloud.azure.keyvault.secret.property-sources[0].endpoint=<your-keyvault-url>
   spring.cloud.azure.keyvault.secret.property-sources[0].credential.managed-identity-enabled=true
   ```

   ### [User-assigned managed identity](#tab/user-assigned-managed-identity)

   Use the following command to query the client ID of the user-assigned managed identity:

   ```azurecli
   az identity show \
       --resource-group ${RESOURCE_GROUP} \
       --name ${USER_ASSIGNED_IDENTITY} \
       --query clientId --output tsv
   ```

   ```properties
   spring.cloud.azure.keyvault.secret.property-sources[0].endpoint=<your-keyvault-url>
   spring.cloud.azure.keyvault.secret.property-sources[0].credential.managed-identity-enabled=true
   spring.cloud.azure.keyvault.secret.property-sources[0].credential.client-id=<client-ID-of-user-assigned-managed-identity>
   ```

    ---

   > [!NOTE]
   > You must add the key vault URL in the **application.properties** file as shown previously. Otherwise, the key vault URL may not be captured during runtime.

1. Update **src/main/java/com/example/demo/DemoApplication.java** with the following code example. This code retrieves the connection string from the Key Vault.

   ```Java
   package com.example.demo;

   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.beans.factory.annotation.Value;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RestController;

   @SpringBootApplication
   @RestController
   public class DemoApplication implements CommandLineRunner {

       @Value("${connectionString}")
       private String connectionString;

       public static void main(String[] args) {
           SpringApplication.run(DemoApplication.class, args);
       }

       @GetMapping("get")
       public String get() {
           return connectionString;
       }

       public void run(String... args) throws Exception {
           System.out.println(String.format("\nConnection String stored in Azure Key Vault:\n%s\n",connectionString));
       }
   }
   ```

   If you open the **pom.xml** file, you can see the `spring-cloud-azure-starter-keyvault` dependency, as shown in the following example:

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-keyvault</artifactId>
   </dependency>
   ```

::: zone pivot="sc-standard"

5. Use the following command to deploy your app to Azure Spring Apps:

   ```azurecli
   az spring app deploy \
       --resource-group ${RESOURCE_GROUP} \
       --service ${SPRING_APPS} \
       --name ${APP} \
       --source-path
   ```

::: zone-end

::: zone pivot="sc-enterprise"

5. Use the following command to deploy your app to Azure Spring Apps:

   ```azurecli
   az spring app deploy \
       --resource-group ${RESOURCE_GROUP} \
       --service ${SPRING_APPS} \
       --name ${APP} \
       --source-path \
       --build-env BP_JVM_VERSION=17
   ```

::: zone-end

6. To test your app, access the public endpoint or test endpoint by using the following command:

   ```bash
   curl https://${SPRING_APPS}-${APP}.azuremicroservices.io/get
   ```

   The following message is returned in the response body: `jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;`.

## Clean up resources

Use the following command to delete the entire resource group, including the newly created service instance:

```azurecli
az group delete --name ${RESOURCE_GROUP} --yes
```

## Next steps

- [How to access Storage blob with managed identity in Azure Spring Apps](https://github.com/Azure-Samples/azure-spring-apps-samples/tree/main/managed-identity-storage-blob)
- [Enable system-assigned managed identity for applications in Azure Spring Apps](./how-to-enable-system-assigned-managed-identity.md)
- [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
- [Authenticate Azure Spring Apps with Key Vault in GitHub Actions](./github-actions-key-vault.md)
