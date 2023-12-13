---
title:  "Tutorial: Connect Azure Spring Apps to Key Vault using managed identities"
description: Set up managed identity to connect Key Vault to an app deployed to Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/07/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# Tutorial: Connect Azure Spring Apps to Key Vault using managed identities

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to create a managed identity for an app deployed to Azure Spring Apps and use it to access Azure Key Vault.

Azure Key Vault can be used to securely store and tightly control access to tokens, passwords, certificates, API keys, and other secrets for your app. You can create a managed identity in Microsoft Entra ID, and authenticate to any service that supports Microsoft Entra authentication, including Key Vault, without having to display credentials in your code.

The following video describes how to manage secrets using Azure Key Vault.

<br>

> [!VIDEO https://www.youtube.com/embed/A8YQOoZncu8?list=PLPeZXlCR7ew8LlhnSH63KcM0XhMKxT1k_]

## Prerequisites

* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* [Install the Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli)
* [Install Maven 3.0 or higher](https://maven.apache.org/download.cgi)

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group to contain both the Key Vault and Spring Cloud using the command [az group create](/cli/azure/group#az-group-create):

```azurecli
az group create --name "myResourceGroup" --location "EastUS"
```

## Set up your Key Vault

To create a Key Vault, use the command [az keyvault create](/cli/azure/keyvault#az-keyvault-create):

> [!Important]
> Each Key Vault must have a unique name. Replace *\<your-keyvault-name>* with the name of your Key Vault in the following examples.

```azurecli
az keyvault create \
    --resource-group <your-resource-group-name> \
    --name "<your-keyvault-name>"
```

Make a note of the returned `vaultUri`, which is in the format `https://<your-keyvault-name>.vault.azure.net`. You use this value in the following step.

You can now place a secret in your Key Vault with the command [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set):

```azurecli
az keyvault secret set \
    --vault-name "<your-keyvault-name>" \
    --name "connectionString" \
    --value "jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;"
```

## Create Azure Spring Apps service and app

After installing corresponding extension, create an Azure Spring Apps instance with the Azure CLI command `az spring create`.

```azurecli
az extension add --upgrade --name spring
az spring create \
    --resource-group <your-resource-group-name> \
    --name <your-Azure-Spring-Apps-instance-name>
```

### [System-assigned managed identity](#tab/system-assigned-managed-identity)

The following example creates an app named `springapp` with a system-assigned managed identity, as requested by the `--system-assigned` parameter.

```azurecli
az spring app create \
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-instance-name> \
    --name "springapp" \
    --assign-endpoint true \
    --runtime-version Java_17 \
    --system-assigned
export MANAGED_IDENTITY_PRINCIPAL_ID=$(az spring app show \
    --resource-group "<your-resource-group-name>" \
    --service "<your-Azure-Spring-Apps-instance-name>" \
    --name "springapp" \
    | jq -r '.identity.principalId')
```

### [User-assigned managed identity](#tab/user-assigned-managed-identity)

First, create a user-assigned managed identity in advance with its resource ID set to `$USER_IDENTITY_RESOURCE_ID`. Save the client ID for the property configuration.

:::image type="content" source="media/tutorial-managed-identities-key-vault/app-user-managed-identity-key-vault.png" alt-text="Screenshot of Azure portal showing the Managed Identity Properties screen with 'Resource ID', 'Principle ID' and 'Client ID' highlighted." lightbox="media/tutorial-managed-identities-key-vault/app-user-managed-identity-key-vault.png":::

```bash
export MANAGED_IDENTITY_PRINCIPAL_ID=<principal-ID-of-user-assigned-managed-identity>
export USER_IDENTITY_RESOURCE_ID=<resource-ID-of-user-assigned-managed-identity>
```

The following example creates an app named `springapp` with a user-assigned managed identity, as requested by the `--user-assigned` parameter.

```azurecli
az spring app create \
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-instance-name> \
    --name "springapp" \
    --user-assigned $USER_IDENTITY_RESOURCE_ID \
    --runtime-version Java_17 \
    --assign-endpoint true
az spring app show \
    --resource-group <your-resource-group-name> \
    --service <your-Azure-Spring-Apps-instance-name> \
    --name "springapp"
```

---

Make a note of the returned URL, which is in the format `https://<your-app-name>.azuremicroservices.io`. You use this value in the following step.

## Grant your app access to Key Vault

Use the following command to grant proper access in Key Vault for your app:

```azurecli
az keyvault set-policy \
    --name "<your-keyvault-name>" \
    --object-id ${MANAGED_IDENTITY_PRINCIPAL_ID} \
    --secret-permissions set get list
```

> [!NOTE]
> For system-assigned managed identity case, use `az keyvault delete-policy --name "<your-keyvault-name>" --object-id ${MANAGED_IDENTITY_PRINCIPAL_ID}` to remove the access for your app after system-assigned managed identity is disabled.

## Build a sample Spring Boot app with Spring Boot starter

This app has access to get secrets from Azure Key Vault. Use the Azure Key Vault Secrets Spring boot starter.  Azure Key Vault is added as an instance of Spring **PropertySource**.  Secrets stored in Azure Key Vault can be conveniently accessed and used like any externalized configuration property, such as properties in files.

1. Use the following command to generate a sample project from `start.spring.io` with Azure Key Vault Spring Starter.

   ```bash
   curl https://start.spring.io/starter.tgz -d dependencies=web,azure-keyvault -d baseDir=springapp -d bootVersion=2.7.9 -d javaVersion=17 -d type=maven-project | tar -xzvf -
   ```

1. Specify your Key Vault in your app.

   ```bash
   cd springapp
   vim src/main/resources/application.properties
   ```

1. To use managed identity for an app deployed to Azure Spring Apps, add properties with the following content to the *src/main/resources/application.properties* file.

### [System-assigned managed identity](#tab/system-assigned-managed-identity)

```properties
spring.cloud.azure.keyvault.secret.property-sources[0].endpoint=https://<your-keyvault-name>.vault.azure.net
spring.cloud.azure.keyvault.secret.property-sources[0].credential.managed-identity-enabled=true
```

### [User-assigned managed identity](#tab/user-assigned-managed-identity)

```properties
spring.cloud.azure.keyvault.secret.property-sources[0].endpoint=https://<your-keyvault-name>.vault.azure.net
spring.cloud.azure.keyvault.secret.property-sources[0].credential.managed-identity-enabled=true
spring.cloud.azure.keyvault.secret.property-sources[0].credential.client-id={Client ID of user-assigned managed identity}
```

---

   > [!NOTE]
   > You must add the key vault URL in the *application.properties* file as shown previously. Otherwise, the key vault URL may not be captured during runtime.

1. Add the following code example to *src/main/java/com/example/demo/DemoApplication.java*. This code retrieves the connection string from the key vault.

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

   If you open the *pom.xml* file, you can see the `spring-cloud-azure-starter-keyvault` dependency, as shown in the following example:

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-keyvault</artifactId>
   </dependency>
   ```

1. Use the following command to package your sample app.

   ```bash
   ./mvnw clean package -DskipTests
   ```

1. Now you can deploy your app to Azure with the following command:

   ```azurecli
   az spring app deploy \
       --resource-group <your-resource-group-name> \
       --service <your-Azure-Spring-Apps-instance-name> \
       --name "springapp" \
       --artifact-path target/demo-0.0.1-SNAPSHOT.jar
   ```

1. To test your app, access the public endpoint or test endpoint by using the following command:

   ```bash
   curl https://myspringcloud-springapp.azuremicroservices.io/get
   ```

   You're shown the message `jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;`.

## Next steps

* [How to access Storage blob with managed identity in Azure Spring Apps](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/managed-identity-storage-blob)
* [How to enable system-assigned managed identity for applications in Azure Spring Apps](./how-to-enable-system-assigned-managed-identity.md)
* [Learn more about managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)
* [Authenticate Azure Spring Apps with Key Vault in GitHub Actions](./github-actions-key-vault.md)
