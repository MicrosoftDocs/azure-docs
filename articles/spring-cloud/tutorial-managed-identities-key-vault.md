---
title:  "Tutorial: Managed identity to connect Key Vault"
description: Set up managed identity to connect Key Vault to an Azure Spring Cloud app
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 07/08/2020
ms.custom: devx-track-java, devx-track-azurecli
---

# Tutorial: Use a managed identity to connect Key Vault to an Azure Spring Cloud app

**This article applies to:** ✔️ Java

This article shows you how to create a managed identity for an Azure Spring Cloud app and use it to access Azure Key Vault.

Azure Key Vault can be used to securely store and tightly control access to tokens, passwords, certificates, API keys, and other secrets for your app. You can create a managed identity in Azure Active Directory (AAD), and authenticate to any service that supports AAD authentication, including Key Vault, without having to display credentials in your code.

## Prerequisites

* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* [Install the Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli)
* [Install Maven 3.0 or above](https://maven.apache.org/download.cgi)

## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group to contain both the Key Vault and Spring Cloud using the command [az group create](/cli/azure/group#az_group_create):

```azurecli-interactive
az group create --name "myResourceGroup" -l "EastUS"
```

## Set up your Key Vault
To create a Key Vault, use the command [az keyvault create](/cli/azure/keyvault#az_keyvault_create):

> [!Important]
> Each Key Vault must have a unique name. Replace <your-keyvault-name> with the name of your Key Vault in the following examples.

```azurecli-interactive
az keyvault create --name "<your-keyvault-name>" -g "myResourceGroup"
```

Make a note of the returned `vaultUri`, which will be in the format "https://<your-keyvault-name>.vault.azure.net". It will be used in the following step.

You can now place a secret in your Key Vault with the command [az keyvault secret set](/cli/azure/keyvault/secret#az_keyvault_secret_set):

```azurecli-interactive
az keyvault secret set --vault-name "<your-keyvault-name>" \
    --name "connectionString" \
    --value "jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;"
```

## Create Azure Spring Cloud service and app
After installing corresponding extension, create an Azure Spring Cloud instance with the Azure CLI command `az spring-cloud create`. 

```azurecli-interactive
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
This app will have access to get secrets from Azure Key Vault. Use the starter app: [Azure Key Vault Secrets Spring boot starter](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-keyvault-secrets).  Azure Key Vault is added as an instance of Spring **PropertySource**.  Secrets stored in Azure Key Vault can be conveniently accessed and used like any externalized configuration property, such as properties in files. 

1. Generate a sample project from start.spring.io with Azure Key Vault Spring Starter. 
    ```azurecli
    curl https://start.spring.io/starter.tgz -d dependencies=web,azure-keyvault-secrets -d baseDir=springapp -d bootVersion=2.3.1.RELEASE -d javaVersion=1.8 | tar -xzvf -
    ```

2. Specify your Key Vault in your app. 

    ```azurecli
    cd springapp
    vim src/main/resources/application.properties
    ```

    To use managed identity for Azure Spring Cloud apps, add properties with the below content to src/main/resources/application.properties.

    ```
    azure.keyvault.enabled=true
    azure.keyvault.uri=https://<your-keyvault-name>.vault.azure.net
    ```
    > [!Note] 
    > Must add the key vault url in `application.properties` as above. Otherwise, the key vault url may not be captured during runtime.

3. Add the code example to src/main/java/com/example/demo/DemoApplication.java. It retrieves the connection string from the Key Vault. 

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

        public void run(String... varl) throws Exception {
          System.out.println(String.format("\nConnection String stored in Azure Key Vault:\n%s\n",connectionString));
        }
      }
    ```

    If you open pom.xml, you will see the dependency of `azure-keyvault-secrets-spring-boot-starter`. Add this dependency to your project in pom.xml. 

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-keyvault-secrets-spring-boot-starter</artifactId>
    </dependency>
    ```

4. Package your sample app. 

    ```azurecli
    mvn clean package
    ```

5. Now you can deploy your app to Azure with the Azure CLI command  `az spring-cloud app deploy`. 

    ```azurecli
    az spring-cloud app deploy -n "springapp" -s "myspringcloud" -g "myResourceGroup" --jar-path target/demo-0.0.1-SNAPSHOT.jar
    ```

6.  To test your app, access the public endpoint or test endpoint.

    ```azurecli
    curl https://myspringcloud-springapp.azuremicroservices.io/get
    ```

    You will see the message "Successfully got the value of secret connectionString from Key Vault https://<your-keyvault-name>.vault.azure.net/: jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;".

## Build sample Spring Boot app with Java SDK

This sample can set and get secrets from Azure Key Vault. The [Azure Key Vault Secret client library for Java](/java/api/overview/azure/security-keyvault-secrets-readme) provides Azure Active Directory token authentication support across the Azure SDK. It provides a set of **TokenCredential** implementations that can be used to construct Azure SDK clients to support AAD token authentication.

The Azure Key Vault Secret client library allows you to securely store and control the access to tokens, passwords, API keys, and other secrets. The library offers operations to create, retrieve, update, delete, purge, back up, restore, and list the secrets and its versions.

1. Clone a sample project. 

    ```azurecli
    git clone https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples.git
    ```

2. Specify your Key Vault in your app. 

    ```azurecli
    cd Azure-Spring-Cloud-Samples/managed-identity-keyvault
    vim src/main/resources/application.properties
    ```

    To use managed identity for Azure Spring Cloud apps, add properties with the following content to *src/main/resources/application.properties*.

    ```
    azure.keyvault.enabled=true
    azure.keyvault.uri=https://<your-keyvault-name>.vault.azure.net
    ```

3. Include [ManagedIdentityCredentialBuilder](/java/api/com.azure.identity.managedidentitycredentialbuilder) to get token from Azure Active Directory and [SecretClientBuilder](/java/api/com.azure.security.keyvault.secrets.secretclientbuilder) to set or get secrets from Key Vault in your code.

    Get the example from [MainController.java](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/blob/master/managed-identity-keyvault/src/main/java/com/microsoft/azure/MainController.java#L28) of the cloned sample project.

    Also include `azure-identity` and `azure-security-keyvault-secrets` as dependency in your pom.xml. Get the example from [pom.xml](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/blob/master/managed-identity-keyvault/pom.xml#L21) of the cloned sample project. 

4. Package your sample app. 

    ```azurecli
    mvn clean package
    ```

5. Now deploy the app to Azure with the Azure CLI command  `az spring-cloud app deploy`. 

    ```azurecli
    az spring-cloud app deploy -n "springapp" -s "myspringcloud" -g "myResourceGroup" --jar-path target/asc-managed-identity-keyvault-sample-0.1.0.jar
    ```

6. Access the public endpoint or test endpoint to test your app. 

    First, get the value of your secret that you set in Azure Key Vault. 
    ```azurecli
    curl https://myspringcloud-springapp.azuremicroservices.io/secrets/connectionString
    ```

    You will see the message "Successfully got the value of secret connectionString from Key Vault https://<your-keyvault-name>.vault.azure.net/: jdbc:sqlserver://SERVER.database.windows.net:1433;database=DATABASE;".

    Now create a secret and then retrieve it using the Java SDK. 
    ```azurecli
    curl -X PUT https://myspringcloud-springapp.azuremicroservices.io/secrets/test?value=success

    curl https://myspringcloud-springapp.azuremicroservices.io/secrets/test
    ```

    You will see the message "Successfully got the value of secret test from Key Vault https://<your-keyvault-name>.vault.azure.net: success". 

## Next steps

* [How to access Storage blob with managed identity in Azure Spring Cloud](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/managed-identity-storage-blob)
* [How to enable system-assigned managed identity for Azure Spring Cloud application](./spring-cloud-howto-enable-system-assigned-managed-identity.md)
* [Learn more about managed identities for Azure resources](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/active-directory/managed-identities-azure-resources/overview.md)
* [Authenticate Azure Spring Cloud with Key Vault in GitHub Actions](./spring-cloud-github-actions-key-vault.md)
