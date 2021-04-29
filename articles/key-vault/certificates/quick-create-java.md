---
title: Quickstart for Azure Key Vault Certificate client library - Java
description: Learn about the the Azure Key Vault Certificate client library for Java with the steps in this quickstart. 
author: msmbaldwin
ms.custom: devx-track-java
ms.author: mbaldwin
ms.date: 12/18/2020
ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
---

# Quickstart: Azure Key Vault Certificate client library for Java (Certificates)
Get started with the Azure Key Vault Certificate client library for Java. Follow the steps below to install the package and try out example code for basic tasks.

Additional resources:

* [Source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-certificates)
* [API reference documentation](https://azure.github.io/azure-sdk-for-java/keyvault.html)
* [Product documentation](index.yml)
* [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-certificates/src/samples/java/com/azure/security/keyvault/certificates)

## Prerequisites
- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above
- [Apache Maven](https://maven.apache.org)
- [Azure CLI](/cli/azure/install-azure-cli)

This quickstart assumes you are running [Azure CLI](/cli/azure/install-azure-cli) and [Apache Maven](https://maven.apache.org) in a Linux terminal window.

## Setting up
This quickstart is using the Azure Identity library with Azure CLI to authenticate user to Azure Services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls, for more information, see [Authenticate the client with Azure Identity client library](/java/api/overview/azure/identity-readme).

### Sign in to Azure
1. Run the `login` command.

    ```azurecli-interactive
    az login
    ```

   If the CLI can open your default browser, it will do so and load an Azure sign-in page.

   Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
   authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

### Create a new Java console app
In a console window, use the `mvn` command to create a new Java console app with the name `akv-certificates-java`.

```console
mvn archetype:generate -DgroupId=com.keyvault.certificates.quickstart
                       -DartifactId=akv-certificates-java
                       -DarchetypeArtifactId=maven-archetype-quickstart
                       -DarchetypeVersion=1.4
                       -DinteractiveMode=false
```

The output from generating the project will look something like this:

```console
[INFO] ----------------------------------------------------------------------------
[INFO] Using following parameters for creating project from Archetype: maven-archetype-quickstart:1.4
[INFO] ----------------------------------------------------------------------------
[INFO] Parameter: groupId, Value: com.keyvault.certificates.quickstart
[INFO] Parameter: artifactId, Value: akv-certificates-java
[INFO] Parameter: version, Value: 1.0-SNAPSHOT
[INFO] Parameter: package, Value: com.keyvault.certificates.quickstart
[INFO] Parameter: packageInPathFormat, Value: com/keyvault/quickstart
[INFO] Parameter: package, Value: com.keyvault.certificates.quickstart
[INFO] Parameter: groupId, Value: com.keyvault.certificates.quickstart
[INFO] Parameter: artifactId, Value: akv-certificates-java
[INFO] Parameter: version, Value: 1.0-SNAPSHOT
[INFO] Project created from Archetype in dir: /home/user/quickstarts/akv-certificates-java
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  38.124 s
[INFO] Finished at: 2019-11-15T13:19:06-08:00
[INFO] ------------------------------------------------------------------------
```

Change your directory to the newly created `akv-certificates-java/` folder.

```console
cd akv-certificates-java
```

### Install the package
Open the *pom.xml* file in your text editor. Add the following dependency elements to the group of dependencies.

```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-security-keyvault-certificates</artifactId>
      <version>4.1.3</version>
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
Create an access policy for your key vault that grants certificate permissions to your user account.

```console
az keyvault set-policy --name <your-key-vault-name> --upn user@domain.com --certificate-permissions delete get list create purge
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
The Azure Key Vault Certificate client library for Java allows you to manage certificates. The [Code examples](#code-examples) section shows how to create a client, create a certificate, retrieve a certificate, and delete a certificate.

The entire console app is [below](#sample-code).

## Code examples
### Add directives
Add the following directives to the top of your code:

```java
import com.azure.core.util.polling.SyncPoller;
import com.azure.identity.DefaultAzureCredentialBuilder;

import com.azure.security.keyvault.certificates.CertificateClient;
import com.azure.security.keyvault.certificates.CertificateClientBuilder;
import com.azure.security.keyvault.certificates.models.CertificateOperation;
import com.azure.security.keyvault.certificates.models.CertificatePolicy;
import com.azure.security.keyvault.certificates.models.DeletedCertificate;
import com.azure.security.keyvault.certificates.models.KeyVaultCertificate;
import com.azure.security.keyvault.certificates.models.KeyVaultCertificateWithPolicy;
```

### Authenticate and create a client
In this quickstart, a logged in user is used to authenticate to Key Vault, which is preferred method for local development. For applications deployed to Azure, a Managed Identity should be assigned to an App Service or Virtual Machine. For more information, see [Managed Identity Overview](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

In the example below, the name of your key vault is expanded to the key vault URI, in the format "https://\<your-key-vault-name\>.vault.azure.net". This example is using the ['DefaultAzureCredential()'](https://docs.microsoft.com/java/api/com.azure.identity.defaultazurecredential) class, which allows to use the same code across different environments with different options to provide identity. For more information, see [Default Azure Credential Authentication](https://docs.microsoft.com/java/api/overview/azure/identity-readme).

```java
String keyVaultName = System.getenv("KEY_VAULT_NAME");
String keyVaultUri = "https://" + keyVaultName + ".vault.azure.net";

CertificateClient certificateClient = new CertificateClientBuilder()
    .vaultUrl(keyVaultUri)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

### Save a secret
Now that your application is authenticated, you can create a certificate in your key vault using the `certificateClient.beginCreateCertificate` method. This requires a name for the certificate and a certificate policy -- we've assigned the value "myCertificate" to the `certificateName` variable in this sample and use a default policy.

Certificate creation is a long running operation, for which you can poll its progress or wait for it to complete.

```java
SyncPoller<CertificateOperation, KeyVaultCertificateWithPolicy> certificatePoller =
    certificateClient.beginCreateCertificate(certificateName, CertificatePolicy.getDefault());
certificatePoller.waitForCompletion();
```

You can obtain the certificate once creation has completed with via the following call:

```java
KeyVaultCertificate createdCertificate = certificatePoller.getFinalResult();
```

### Retrieve a certificate
You can now retrieve the previously created certificate with the `certificateClient.getCertificate` method.

```java
KeyVaultCertificate retrievedCertificate = certificateClient.getCertificate(certificateName);
 ```

You can now access the details of the retrieved certificate with operations like `retrievedCertificate.getName`, `retrievedCertificate.getProperties`, etc. As well as its contents `retrievedCertificate.getCer`.

### Delete a certificate
Finally, let's delete the certificate from your key vault with the `certificateClient.beginDeleteCertificate` method, which is also a long running operation.

```java
SyncPoller<DeletedCertificate, Void> deletionPoller = certificateClient.beginDeleteCertificate(certificateName);
deletionPoller.waitForCompletion();
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
package com.keyvault.certificates.quickstart;

import com.azure.core.util.polling.SyncPoller;
import com.azure.identity.DefaultAzureCredentialBuilder;

import com.azure.security.keyvault.certificates.CertificateClient;
import com.azure.security.keyvault.certificates.CertificateClientBuilder;
import com.azure.security.keyvault.certificates.models.CertificateOperation;
import com.azure.security.keyvault.certificates.models.CertificatePolicy;
import com.azure.security.keyvault.certificates.models.DeletedCertificate;
import com.azure.security.keyvault.certificates.models.KeyVaultCertificate;
import com.azure.security.keyvault.certificates.models.KeyVaultCertificateWithPolicy;

public class App {
    public static void main(String[] args) throws InterruptedException, IllegalArgumentException {
        String keyVaultName = System.getenv("KEY_VAULT_NAME");
        String keyVaultUri = "https://" + keyVaultName + ".vault.azure.net";

        System.out.printf("key vault name = %s and kv uri = %s \n", keyVaultName, keyVaultUri);

        CertificateClient certificateClient = new CertificateClientBuilder()
                .vaultUrl(keyVaultUri)
                .credential(new DefaultAzureCredentialBuilder().build())
                .buildClient();

        String certificateName = "myCertificate";

        System.out.print("Creating a certificate in " + keyVaultName + " called '" + certificateName + " ... ");

        SyncPoller<CertificateOperation, KeyVaultCertificateWithPolicy> certificatePoller =
                certificateClient.beginCreateCertificate(certificateName, CertificatePolicy.getDefault());
        certificatePoller.waitForCompletion();

        System.out.print("done.");
        System.out.println("Retrieving certificate from " + keyVaultName + ".");

        KeyVaultCertificate retrievedCertificate = certificateClient.getCertificate(certificateName);

        System.out.println("Your certificate's ID is '" + retrievedCertificate.getId() + "'.");
        System.out.println("Deleting your certificate from " + keyVaultName + " ... ");

        SyncPoller<DeletedCertificate, Void> deletionPoller = certificateClient.beginDeleteCertificate(certificateName);
        deletionPoller.waitForCompletion();

        System.out.print("done.");
    }
}
```

## Next steps
In this quickstart you created a key vault, created a certificate, retrieved it, and then deleted it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- How to [Secure access to a key vault](../general/security-features.md)