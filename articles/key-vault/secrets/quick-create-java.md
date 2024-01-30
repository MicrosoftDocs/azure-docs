---
title: Quickstart - Azure Key Vault Secret client library for Java
description: Provides a quickstart for the Azure Key Vault Secret client library for Java.
author: msmbaldwin
ms.custom: devx-track-java, devx-track-azurecli, devx-track-azurepowershell, mode-api, passwordless-java, devx-track-extended-java
ms.author: mbaldwin
ms.date: 01/11/2023
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.devlang: java
---

# Quickstart: Azure Key Vault Secret client library for Java

Get started with the Azure Key Vault Secret client library for Java. Follow these steps to install the package and try out example code for basic tasks.

> [!TIP]
> If you're working with Azure Key Vault Secrets resources in a Spring application, we recommend that you consider [Spring Cloud Azure](/azure/developer/java/spring-framework/) as an alternative. Spring Cloud Azure is an open-source project that provides seamless Spring integration with Azure services. To learn more about Spring Cloud Azure, and to see an example using Key Vault Secrets, see [Load a secret from Azure Key Vault in a Spring Boot application](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault).

Additional resources:

- [Source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets)
- [API reference documentation](https://azure.github.io/azure-sdk-for-java/keyvault.html)
- [Product documentation](index.yml)
- [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets/src/samples/java/com/azure/security/keyvault/secrets)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above
- [Apache Maven](https://maven.apache.org)
- [Azure CLI](/cli/azure/install-azure-cli)

This quickstart assumes you're running [Azure CLI](/cli/azure/install-azure-cli) and [Apache Maven](https://maven.apache.org) in a Linux terminal window.

## Setting up

This quickstart is using the Azure Identity library with Azure CLI to authenticate user to Azure Services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls, for more information, see [Authenticate the client with Azure Identity client library](/java/api/overview/azure/identity-readme).

### Sign in to Azure

1. Run the `login` command.

   ```azurecli-interactive
   az login
   ```

   If the CLI can open your default browser, it will do so and load an Azure sign-in page.

   Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the authorization code displayed in your terminal.

1. Sign in with your account credentials in the browser.

### Create a new Java console app

In a console window, use the `mvn` command to create a new Java console app with the name `akv-secrets-java`.

```console
mvn archetype:generate -DgroupId=com.keyvault.secrets.quickstart
                       -DartifactId=akv-secrets-java
                       -DarchetypeArtifactId=maven-archetype-quickstart
                       -DarchetypeVersion=1.4
                       -DinteractiveMode=false
```

The output from generating the project will look something like this:

```console
[INFO] ----------------------------------------------------------------------------
[INFO] Using following parameters for creating project from Archetype: maven-archetype-quickstart:1.4
[INFO] ----------------------------------------------------------------------------
[INFO] Parameter: groupId, Value: com.keyvault.secrets.quickstart
[INFO] Parameter: artifactId, Value: akv-secrets-java
[INFO] Parameter: version, Value: 1.0-SNAPSHOT
[INFO] Parameter: package, Value: com.keyvault.secrets.quickstart
[INFO] Parameter: packageInPathFormat, Value: com/keyvault/quickstart
[INFO] Parameter: package, Value: com.keyvault.secrets.quickstart
[INFO] Parameter: groupId, Value: com.keyvault.secrets.quickstart
[INFO] Parameter: artifactId, Value: akv-secrets-java
[INFO] Parameter: version, Value: 1.0-SNAPSHOT
[INFO] Project created from Archetype in dir: /home/user/quickstarts/akv-secrets-java
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  38.124 s
[INFO] Finished at: 2019-11-15T13:19:06-08:00
[INFO] ------------------------------------------------------------------------
```

Change your directory to the newly created `akv-secrets-java/` folder.

```azurecli
cd akv-secrets-java
```

### Install the package

Open the *pom.xml* file in your text editor. Add the following dependency elements to the group of dependencies.

```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-security-keyvault-secrets</artifactId>
      <version>4.2.3</version>
    </dependency>

    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-identity</artifactId>
      <version>1.2.0</version>
    </dependency>
```

### Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-rg-kv-creation.md)]

#### Grant access to your key vault

Create an access policy for your key vault that grants secret permissions to your user account.

```azurecli
az keyvault set-policy --name <your-key-vault-name> --upn user@domain.com --secret-permissions delete get list set purge
```

#### Set environment variables

This application is using your key vault name as an environment variable called `KEY_VAULT_NAME`.

Windows

```cmd
set KEY_VAULT_NAME=<your-key-vault-name>
````

Windows PowerShell

```powershell
$Env:KEY_VAULT_NAME="<your-key-vault-name>"
```

macOS or Linux

```cmd
export KEY_VAULT_NAME=<your-key-vault-name>
```

## Object model

The Azure Key Vault Secret client library for Java allows you to manage secrets. The [Code examples](#code-examples) section shows how to create a client, set a secret, retrieve a secret, and delete a secret.

## Code examples

### Add directives

Add the following directives to the top of your code:

```java
import com.azure.core.util.polling.SyncPoller;
import com.azure.identity.DefaultAzureCredentialBuilder;

import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.azure.security.keyvault.secrets.models.DeletedSecret;
import com.azure.security.keyvault.secrets.models.KeyVaultSecret;
```

### Authenticate and create a client

Application requests to most Azure services must be authorized. Using the [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) class is the recommended approach for implementing passwordless connections to Azure services in your code. `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

In this quickstart, `DefaultAzureCredential` authenticates to key vault using the credentials of the local development user logged into the Azure CLI. When the application is deployed to Azure, the same `DefaultAzureCredential` code can automatically discover and use a managed identity that is assigned to an App Service, Virtual Machine, or other services. For more information, see [Managed Identity Overview](/azure/active-directory/managed-identities-azure-resources/overview).

In this example, the name of your key vault is expanded to the key vault URI, in the format `https://<your-key-vault-name>.vault.azure.net`. For more information about authenticating to key vault, see [Developer's Guide](/azure/key-vault/general/developers-guide#authenticate-to-key-vault-in-code).

```java
String keyVaultName = System.getenv("KEY_VAULT_NAME");
String keyVaultUri = "https://" + keyVaultName + ".vault.azure.net";

SecretClient secretClient = new SecretClientBuilder()
    .vaultUrl(keyVaultUri)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

### Save a secret

Now that your application is authenticated, you can put a secret into your key vault using the `secretClient.setSecret` method. This requires a name for the secret—we've assigned the value "mySecret" to the `secretName` variable in this sample.

```java
secretClient.setSecret(new KeyVaultSecret(secretName, secretValue));
```

You can verify that the secret has been set with the [az keyvault secret show](/cli/azure/keyvault/secret?#az-keyvault-secret-show) command:

```azurecli
az keyvault secret show --vault-name <your-unique-key-vault-name> --name mySecret
```

### Retrieve a secret

You can now retrieve the previously set secret with the `secretClient.getSecret` method.

```java
KeyVaultSecret retrievedSecret = secretClient.getSecret(secretName);
 ```

You can now access the value of the retrieved secret with `retrievedSecret.getValue()`.

### Delete a secret

Finally, let's delete the secret from your key vault with the `secretClient.beginDeleteSecret` method.

Secret deletion is a long running operation, for which you can poll its progress or wait for it to complete.

```java
SyncPoller<DeletedSecret, Void> deletionPoller = secretClient.beginDeleteSecret(secretName);
deletionPoller.waitForCompletion();
```

You can verify that the secret has been deleted with the [az keyvault secret show](/cli/azure/keyvault/secret?#az-keyvault-secret-show) command:

```azurecli
az keyvault secret show --vault-name <your-unique-key-vault-name> --name mySecret
```

## Clean up resources

When no longer needed, you can use the Azure CLI or Azure PowerShell to remove your key vault and the corresponding resource group.

```azurecli
az group delete -g "myResourceGroup"
```

```azurepowershell
Remove-AzResourceGroup -Name "myResourceGroup"
```

## Sample code

```java
package com.keyvault.secrets.quickstart;

import java.io.Console;

import com.azure.core.util.polling.SyncPoller;
import com.azure.identity.DefaultAzureCredentialBuilder;

import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.azure.security.keyvault.secrets.models.DeletedSecret;
import com.azure.security.keyvault.secrets.models.KeyVaultSecret;

public class App {
    public static void main(String[] args) throws InterruptedException, IllegalArgumentException {
        String keyVaultName = System.getenv("KEY_VAULT_NAME");
        String keyVaultUri = "https://" + keyVaultName + ".vault.azure.net";

        System.out.printf("key vault name = %s and key vault URI = %s \n", keyVaultName, keyVaultUri);

        SecretClient secretClient = new SecretClientBuilder()
            .vaultUrl(keyVaultUri)
            .credential(new DefaultAzureCredentialBuilder().build())
            .buildClient();

        Console con = System.console();

        String secretName = "mySecret";

        System.out.println("Please provide the value of your secret > ");

        String secretValue = con.readLine();

        System.out.print("Creating a secret in " + keyVaultName + " called '" + secretName + "' with value '" + secretValue + "' ... ");

        secretClient.setSecret(new KeyVaultSecret(secretName, secretValue));

        System.out.println("done.");
        System.out.println("Forgetting your secret.");

        secretValue = "";
        System.out.println("Your secret's value is '" + secretValue + "'.");

        System.out.println("Retrieving your secret from " + keyVaultName + ".");

        KeyVaultSecret retrievedSecret = secretClient.getSecret(secretName);

        System.out.println("Your secret's value is '" + retrievedSecret.getValue() + "'.");
        System.out.print("Deleting your secret from " + keyVaultName + " ... ");

        SyncPoller<DeletedSecret, Void> deletionPoller = secretClient.beginDeleteSecret(secretName);
        deletionPoller.waitForCompletion();

        System.out.println("done.");
    }
}
```

## Next steps

In this quickstart, you created a key vault, stored a secret, retrieved it, and then deleted it. To learn more about Key Vault and how to integrate it with your applications, continue on to these articles.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- How to [Secure access to a key vault](../general/security-features.md)
