---
title: Quickstart - Azure Key Vault Key client library for Java
description: Provides a quickstart for the Azure Key Vault Keys client library for Java.
author: msmbaldwin
ms.custom: devx-track-java, devx-track-azurecli, devx-track-azurepowershell, mode-api, passwordless-java, devx-track-extended-java
ms.author: mbaldwin
ms.date: 01/04/2023
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.devlang: java
---

# Quickstart: Azure Key Vault Key client library for Java

Get started with the Azure Key Vault Key client library for Java. Follow these steps to install the package and try out example code for basic tasks.

Additional resources:

- [Source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-keys)
- [API reference documentation](https://azure.github.io/azure-sdk-for-java/keyvault.html)
- [Product documentation](index.yml)
- [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-keys/src/samples/java/com/azure/security/keyvault/keys)

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

In a console window, use the `mvn` command to create a new Java console app with the name `akv-keys-java`.

```console
mvn archetype:generate -DgroupId=com.keyvault.keys.quickstart
                       -DartifactId=akv-keys-java
                       -DarchetypeArtifactId=maven-archetype-quickstart
                       -DarchetypeVersion=1.4
                       -DinteractiveMode=false
```

The output from generating the project will look something like this:

```console
[INFO] ----------------------------------------------------------------------------
[INFO] Using following parameters for creating project from Archetype: maven-archetype-quickstart:1.4
[INFO] ----------------------------------------------------------------------------
[INFO] Parameter: groupId, Value: com.keyvault.keys.quickstart
[INFO] Parameter: artifactId, Value: akv-keys-java
[INFO] Parameter: version, Value: 1.0-SNAPSHOT
[INFO] Parameter: package, Value: com.keyvault.keys.quickstart
[INFO] Parameter: packageInPathFormat, Value: com/keyvault/quickstart
[INFO] Parameter: package, Value: com.keyvault.keys.quickstart
[INFO] Parameter: groupId, Value: com.keyvault.keys.quickstart
[INFO] Parameter: artifactId, Value: akv-keys-java
[INFO] Parameter: version, Value: 1.0-SNAPSHOT
[INFO] Project created from Archetype in dir: /home/user/quickstarts/akv-keys-java
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  38.124 s
[INFO] Finished at: 2019-11-15T13:19:06-08:00
[INFO] ------------------------------------------------------------------------
```

Change your directory to the newly created `akv-keys-java/` folder.

```console
cd akv-keys-java
```

### Install the package

Open the *pom.xml* file in your text editor. Add the following dependency elements to the group of dependencies.

```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-security-keyvault-keys</artifactId>
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

Create an access policy for your key vault that grants key permissions to your user account.

```azurecli
az keyvault set-policy --name <your-key-vault-name> --upn user@domain.com --key-permissions delete get list create purge
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

The Azure Key Vault Key client library for Java allows you to manage keys. The [Code examples](#code-examples) section shows how to create a client, create a key, retrieve a key, and delete a key.

The entire console app is supplied in [Sample code](#sample-code).

## Code examples

### Add directives

Add the following directives to the top of your code:

```java
import com.azure.core.util.polling.SyncPoller;
import com.azure.identity.DefaultAzureCredentialBuilder;

import com.azure.security.keyvault.keys.KeyClient;
import com.azure.security.keyvault.keys.KeyClientBuilder;
import com.azure.security.keyvault.keys.models.DeletedKey;
import com.azure.security.keyvault.keys.models.KeyType;
import com.azure.security.keyvault.keys.models.KeyVaultKey;
```

### Authenticate and create a client

Application requests to most Azure services must be authorized. Using the [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) class is the recommended approach for implementing passwordless connections to Azure services in your code. `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

In this quickstart, `DefaultAzureCredential` authenticates to key vault using the credentials of the local development user logged into the Azure CLI. When the application is deployed to Azure, the same `DefaultAzureCredential` code can automatically discover and use a managed identity that is assigned to an App Service, Virtual Machine, or other services. For more information, see [Managed Identity Overview](/azure/active-directory/managed-identities-azure-resources/overview).

In this example, the name of your key vault is expanded to the key vault URI, in the format `https://<your-key-vault-name>.vault.azure.net`. For more information about authenticating to key vault, see [Developer's Guide](/azure/key-vault/general/developers-guide#authenticate-to-key-vault-in-code).

```java
String keyVaultName = System.getenv("KEY_VAULT_NAME");
String keyVaultUri = "https://" + keyVaultName + ".vault.azure.net";

KeyClient keyClient = new KeyClientBuilder()
    .vaultUrl(keyVaultUri)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

### Create a key

Now that your application is authenticated, you can create a key in your key vault using the `keyClient.createKey` method. This requires a name for the key and a key type. We've assigned the value "myKey" to the `keyName` variable and use a an RSA `KeyType` in this sample.

```java
keyClient.createKey(keyName, KeyType.RSA);
```

You can verify that the key has been set with the [az keyvault key show](/cli/azure/keyvault/key?#az-keyvault-key-show) command:

```azurecli
az keyvault key show --vault-name <your-unique-key-vault-name> --name myKey
```

### Retrieve a key

You can now retrieve the previously created key with the `keyClient.getKey` method.

```java
KeyVaultKey retrievedKey = keyClient.getKey(keyName);
 ```

You can now access the details of the retrieved key with operations like `retrievedKey.getProperties`, `retrievedKey.getKeyOperations`, etc.

### Delete a key

Finally, let's delete the key from your key vault with the `keyClient.beginDeleteKey` method.

Key deletion is a long running operation, for which you can poll its progress or wait for it to complete.

```java
SyncPoller<DeletedKey, Void> deletionPoller = keyClient.beginDeleteKey(keyName);
deletionPoller.waitForCompletion();
```

You can verify that the key has been deleted with the [az keyvault key show](/cli/azure/keyvault/key?#az-keyvault-key-show) command:

```azurecli
az keyvault key show --vault-name <your-unique-key-vault-name> --name myKey
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
package com.keyvault.keys.quickstart;

import com.azure.core.util.polling.SyncPoller;
import com.azure.identity.DefaultAzureCredentialBuilder;

import com.azure.security.keyvault.keys.KeyClient;
import com.azure.security.keyvault.keys.KeyClientBuilder;
import com.azure.security.keyvault.keys.models.DeletedKey;
import com.azure.security.keyvault.keys.models.KeyType;
import com.azure.security.keyvault.keys.models.KeyVaultKey;

public class App {
    public static void main(String[] args) throws InterruptedException, IllegalArgumentException {
        String keyVaultName = System.getenv("KEY_VAULT_NAME");
        String keyVaultUri = "https://" + keyVaultName + ".vault.azure.net";

        System.out.printf("key vault name = %s and key vault URI = %s \n", keyVaultName, keyVaultUri);

        KeyClient keyClient = new KeyClientBuilder()
             .vaultUrl(keyVaultUri)
             .credential(new DefaultAzureCredentialBuilder().build())
             .buildClient();

        String keyName = "myKey";

        System.out.print("Creating a key in " + keyVaultName + " called '" + keyName + " ... ");

        keyClient.createKey(keyName, KeyType.RSA);

        System.out.print("done.");
        System.out.println("Retrieving key from " + keyVaultName + ".");

        KeyVaultKey retrievedKey = keyClient.getKey(keyName);

        System.out.println("Your key's ID is '" + retrievedKey.getId() + "'.");
        System.out.println("Deleting your key from " + keyVaultName + " ... ");

        SyncPoller<DeletedKey, Void> deletionPoller = keyClient.beginDeleteKey(keyName);
        deletionPoller.waitForCompletion();

        System.out.print("done.");
    }
}
```

## Next steps

In this quickstart, you created a key vault, created a key, retrieved it, and then deleted it. To learn more about Key Vault and how to integrate it with your applications, continue on to these articles.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Read the [Key Vault security overview](../general/security-features.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- How to [Secure access to a key vault](../general/security-features.md)
