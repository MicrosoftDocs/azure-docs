---
title:  Tutorial - Managed identity to invoke Azure Functions from an Azure Spring Cloud app
description: Use managed identity to invoke Azure Functions from an Azure Spring Cloud app
author:  MarkGardner
ms.author: margard
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 07/10/2020
---

# Tutorial: Use a managed identity to invoke Azure Functions from an Azure Spring Cloud app

This article shows you how to create a managed identity for an Azure Spring Cloud app and use it to invoke Http triggered Functions.

Both Azure Functions and App Services have built in support for Azure Active Directory (AAD) authentication. By leveraging the platform authentication capability with Managed Identities for Azure Spring Cloud we can invoke RESTful services using modern OAuth semantics. This method does not require storing secrets in code and provides more granular controls for defining access to external resources. 

## Prerequisites

* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* [Install the Azure CLI version 2.0.67 or higher](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
* [Install the Azure Functions Core Tools version 3.0.2009 or higher](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#install-the-azure-functions-core-tools)

## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group to contain both the Function app and Spring Cloud using the command [az group create](/cli/azure/group?view=azure-cli-latest#az-group-create):

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a Function App
To create a a Function app you must first create a backing storage account, use the command [az storage account create](/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create):

> [!Important]
> Each Function app and Storage Account must have a unique name. Replace <your-functionapp-name> with the name of your Function app and <your-storageaccount-name> with the name of your Storage Account in the following examples.

```azurecli-interactive
az storage account create --name <your-storageaccount-name> --resource-group myResourceGroup --location eastus --sku Standard_LRS
```

Once the Storage Account has been created, you can create the Function app.

```azurecli-interactive
az functionapp create --name <your-functionapp-name> --resource-group myResourceGroup --consumption-plan-location eastus --os-type windows --runtime node --storage-account <your-storageaccount-name> --functions-version 3
```

Make a note of the returned `hostNames`, which will be in the format "https://<your-functionapp-name>.azurewebsites.net". It will be used in a following step.

## Enable Azure Active Directory Authentication

Access the newly created Function app from the [Azure portal](https://portal.azure.com) and select "Authentication / Authorization" from the settings menu. Enable App Service Authentication and set the "Action to take when request is not authenticated" to "Log in with Azure Active Directory".

![Authentication settings showing Azure Active Directory as the default provider](media/spring-cloud-tutorial-managed-identities-functions/function-auth-config-1.jpg)

Under Authentication Providers select Azure Active Directory to configure the application registration. Selecting Express Management Mode will automatically create an application registration in your AAD tenant with the correct configuration.

![Azure Active Directory provider set to Express Management Mode](media/spring-cloud-tutorial-managed-identities-functions/function-auth-config-2.jpg)

Once you save the settings the function app will restart and all subsequent requests will be prompted to login via AAD. You can test this by navigating to the function apps root URL (returned in the hostNames output in the step above), you should be redirect to your organizations AAD login screen.

## Create an Http Triggered Function

In an empty local directory create a new function app and add an Http triggered function.

```bash
func init --worker-runtime node
func new --template HttpTrigger --name HttpTrigger
```

By default Functions use key-based authentication to secure Http endpoints. Since we will be enabling AAD authentication to secure access to the Functions, we want to [set the function auth level to anonymous](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger#secure-an-http-endpoint-in-production).

```json function.json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      ...
    }
  ]
}
```

The app now needs to be published to the Function app instance created in the previous step.

```bash
func azure functionapp publish <your-functionapp-name>
```

The output from the publishing command should list the URL to your newly created function.

```bash
Deployment completed successfully.
Syncing triggers...
Functions in <your-functionapp-name>:
    HttpTrigger - [httpTrigger]
        Invoke url: https://<your-functionapp-name>.azurewebsites.net/api/httptrigger
```

## Create Azure Spring Cloud service and app
After installing corresponding extension, create an Azure Spring Cloud instance with the Azure CLI command `az spring-cloud create`. 

```azurecli-interactive
az extension add --name spring-cloud
az spring-cloud create -n "myspringcloud" -g "myResourceGroup"
```
The following example creates an app named `springapp` with a system-assigned managed identity, as requested by the `--assign-identity` parameter.

```azurecli
az spring-cloud app create -n "springapp" -s "myspringcloud" -g "myResourceGroup" --is-public true --assign-identity
export SERVICE_IDENTITY=$(az spring-cloud app show --name "springapp" -s "myspringcloud" -g "myResourceGroup" | jq -r '.identity.principalId')
```

Make a note of the returned `url`, which will be in the format"https://<your-app-name>.azuremicroservices.io". It will be used in the following step.


## Grant your app access to Key Vault
Use `az keyvault set-policy` to grant proper access in Key Vault for your app.
```azurecli
az keyvault set-policy --name "<your-keyvault-name>" --object-id ${SERVICE_IDENTITY} --secret-permissions set get list
```

## Build a sample Spring Boot app with Spring Boot starter
This app will have access to get secrets from Azure Key Vault. Use the starter app: [Azure Key Vault Secrets Spring boot starter](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-keyvault-secrets).  Azure Key Vault is added as an instance of Spring **PropertySource**.  Secrets stored in Azure Key Vault can be conveniently accessed and used like any externalized configuration property, such as properties in files. 

1. Generate a sample project from start.spring.io with Azure Key Vault Spring Starter. 
    ```azurecli
    curl https://start.spring.io/starter.tgz -d dependencies=web,azure-keyvault-secrets -d baseDir=springapp -d bootVersion=2.3.1.RELEASE | tar -xzvf -
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
    > Must add key the vault url in `application.properties` as above. Otherwise, the key vault url may not be captured during runtime.

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
    public class SecretsApplication implements CommandLineRunner {

        @Value("${connectionString}")
        private String connectionString;

        public static void main(String[] args) {
          SpringApplication.run(SecretsApplication.class, args);
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

This sample can set and get secrets from Azure Key Vault. The [Azure Key Vault Secret client library for Java](https://docs.microsoft.com/java/api/overview/azure/security-keyvault-secrets-readme?view=azure-java-stablelibrary) provides Azure Active Directory token authentication support across the Azure SDK. It provides a set of **TokenCredential** implementations that can be used to construct Azure SDK clients to support AAD token authentication.

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

3. Include [ManagedIdentityCredentialBuilder](https://docs.microsoft.com/java/api/com.azure.identity.managedidentitycredentialbuilder?view=azure-java-stable) to get token from Azure Active Directory and [SecretClientBuilder](https://docs.microsoft.com/java/api/com.azure.security.keyvault.secrets.secretclientbuilder?view=azure-java-stable) to set or get secrets from Key Vault in your code.

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
* [How to enable system-assigned managed identity for Azure Spring Cloud application](https://docs.microsoft.com/azure/spring-cloud/spring-cloud-howto-enable-system-assigned-managed-identity)
* [Learn more about managed identities for Azure resources](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/active-directory/managed-identities-azure-resources/overview.md)
* [Authenticate Azure Spring Cloud with Key Vault in GitHub Actions](https://docs.microsoft.com/azure/spring-cloud/spring-cloud-github-actions-key-vault)
