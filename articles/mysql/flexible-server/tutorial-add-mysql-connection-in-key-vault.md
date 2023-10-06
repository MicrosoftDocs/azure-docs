---
title: "Tutorial: Manage MySQL credentials in Azure Key Vault"
description: "This tutorial shows how to store and get an Azure Database for MySQL Flexible Server connection string in Azure Key Vault"
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: mksuni
ms.author: sumuth 
ms.date: 06/08/2023
---

# Tutorial: Manage MySQL credentials in Azure Key Vault
You can store the MySQL connection string in Azure Key Vault to ensure that sensitive information is securely managed and accessed only by authorized users or applications. Additionally, any changes to the connection string can be easily updated in the Key Vault without modifying the application code.

## Prerequisites

- You need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- All access to secrets takes place through Azure Key Vault. For this quickstart, create a key vault using [Azure portal](../../key-vault/general/quick-create-portal.md), [Azure CLI](../../key-vault/general/quick-create-cli.md), or [Azure PowerShell](../../key-vault/general/quick-create-powershell.md). Make sure you have the necessary permissions to manage and access the Key Vault.
- Install .NET or Java or PHP or Python based on the framework you are using for your application. 

## Add a secret to Key Vault

To add a secret to the vault, follow the steps:

1. Navigate to your new key vault in the Azure portal
1. On the Key Vault settings pages, select **Secrets**.
1. Select on **Generate/Import**.
1. On the **Create a secret** page, provide the following information: 
    - **Upload options**: Manual.
    - **Name**: Type a name for the secret. The secret name must be unique within a Key Vault. The name must be a 1-127 character string, starting with a letter and containing only 0-9, a-z, A-Z, and -. For more information on naming, see [Key Vault objects, identifiers, and versioning](../../key-vault/general/about-keys-secrets-certificates.md#objects-identifiers-and-versioning)
    - **Value**: Type a value for the secret. Key Vault APIs accept and return secret values as strings. 
    - Leave the other values to their defaults. Select **Create**.

Once that you receive the message that the secret has been successfully created, you may select on it on the list. 

For more information, see [About Azure Key Vault secrets](../../key-vault/secrets/secrets-best-practices.md)

## Configure access policies
In the Key Vault settings, configure the appropriate access policies to grant access to the users or applications that need to retrieve the MySQL connection string from the Key Vault. Ensure that the necessary permissions are granted for "Get" operations on secrets.

1.	In the [Azure portal](https://portal.azure.com), navigate to the Key Vault resource. 
1.	Select **Access policies**, then select **Create**.
1.	Select the permissions you want under **Key permissions**, **Secret permissions**, and **Certificate permissions**. 
1.	Under the **Principal** selection pane, enter the name of the user, app or service principal in the search field and select the appropriate result. If you're using a managed identity for the app, search for and select the name of the app itself. 
1.	Review the access policy changes and select **Create** to save the access policy.
1. Back on the **Access policies** page, verify that your access policy is listed. 
 
## Retrieve the MySQL connection string
In your application or script, use the Azure Key Vault SDK or client libraries to authenticate and retrieve the MySQL connection string from the Key Vault. You need to provide the appropriate authentication credentials and access permissions to access the Key Vault. Once you have retrieved the MySQL connection string from Azure Key Vault, you can use it in your application to establish a connection to the MySQL database. Pass the retrieved connection string as a parameter to your database connection code.

### Code samples to retrieve connection string 
Here are few code samples to retrieve the connection string from the key vault secret. 

### [.NET](#tab/dotnet)
In this code, we are using [Azure SDK for .NET](https://github.com/Azure/azure-sdk-for-net). We define the URI of our Key Vault and the name of the secret (connection string) we want to retrieve. We then create a new DefaultAzureCredential object, which represents the authentication information for our application to access the Key Vault.

```net
using System;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

namespace KeyVaultDemo
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var kvUri = "https://my-key-vault.vault.azure.net/";
            var secretName = "my-db-conn-string";
            
            var credential = new DefaultAzureCredential();
            var client = new SecretClient(new Uri(kvUri), credential);

            var secret = await client.GetSecretAsync(secretName);
            var connString = secret.Value;

            Console.WriteLine($"Connection string retrieved: {connString}");
        }
    }
}
```

### [Java](#tab/java)
In this Java code, we use the [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java) to interact with Azure Key Vault. We first define the Key Vault URL and the name of the secret (connection string) we want to retrieve. Then, we create a SecretClient object using the SecretClientBuilder class. We set the Key Vault URL and provide the DefaultAzureCredential to authenticate with Azure AD. The DefaultAzureCredential automatically authenticates using the available credentials, such as environment variables, managed identities, or Visual Studio Code authentication.

Next, we use the _getSecret_ method on the **SecretClient** to retrieve the secret. The method returns a **KeyVaultSecret** object, from which we can obtain the secret value using the _getValue_ method. Finally, we print the retrieved connection string to the console. Make sure to replace the _keyVaultUrl_ and _secretName_ variables with your own Key Vault URL and secret name. Next, we create a new **SecretClient** object and pass in the Key Vault URI and the credential object. We can then call the GetSecretAsync method on the client object, passing in the name of the secret we want to retrieve.

```java
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.azure.security.keyvault.secrets.models.KeyVaultSecret;

public class KeyVaultDemo {

    public static void main(String[] args) {
        String keyVaultUrl = "https://my-key-vault.vault.azure.net/";
        String secretName = "my-db-conn-string";

        SecretClient secretClient = new SecretClientBuilder()
                .vaultUrl(keyVaultUrl)
                .credential(new DefaultAzureCredentialBuilder().build())
                .buildClient();

        KeyVaultSecret secret = secretClient.getSecret(secretName);
        String connString = secret.getValue();

        System.out.println("Connection string retrieved: " + connString);
    }
}
```

### [PHP](#tab/php)
In this PHP code, we first require the necessary autoload file and import the required classes from the [Azure SDK for PHP](https://github.com/Azure/azure-sdk-for-php). We define the _$keyVaultUrl_ variable with the URL of your Azure Key Vault and _$secretName_ variable with the name of the secret (connection string) you want to retrieve. Next, we create a **DefaultAzureCredential** object to authenticate with Azure AD, which automatically picks up the available credentials from your environment. 

We then create a **SecretClient** object, passing the Key Vault URL and the credential object to authenticate with the Key Vault. The _getSecret_ method on the **SecretClient** can retrieve the secret by passing the _$secretName_. The method returns a KeyVaultSecret object, from which we can obtain the secret value using the getValue method. Finally, we print the retrieved connection string to the console. Make sure to have the necessary Azure SDK packages installed and the autoload file included properly in your PHP project.

```php
require_once 'vendor/autoload.php';

use Azure\Identity\DefaultAzureCredential;
use Azure\Security\KeyVault\Secrets\SecretClient;

$keyVaultUrl = 'https://my-key-vault.vault.azure.net/';
$secretName = 'my-db-conn-string';

$credential = new DefaultAzureCredential();
$client = new SecretClient($keyVaultUrl, $credential);

$secret = $client->getSecret($secretName);
$connString = $secret->getValue();

echo 'Connection string retrieved: ' . $connString;
```

### [Python](#tab/python)
In this Python code, we first import the necessary modules from the [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python). We define the _key_vault_url_ variable with the URL of your Azure Key Vault and _secret_name_ variable with the name of the secret (connection string) you want to retrieve. Next, we create a **DefaultAzureCredential** object to authenticate with Azure AD. The **DefaultAzureCredential** automatically authenticates using the available credentials, such as environment variables, managed identities, or Visual Studio Code authentication.

Then, we create a **SecretClient** object, passing the Key Vault URL and the credential object to authenticate with the Key Vault. The _get_secret_ method on the **SecretClient** can retrieve the secret by passing the secret_name. The method returns a **KeyVaultSecret** object, from which we can obtain the secret value using the value property. Finally, we print the retrieved connection string to the console. Make sure to replace the _key_vault_url_ and _secret_name_ variables with your own Key Vault URL and secret name.

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

key_vault_url = "https://my-key-vault.vault.azure.net/"
secret_name = "my-db-conn-string"

credential = DefaultAzureCredential()
secret_client = SecretClient(vault_url=key_vault_url, credential=credential)

secret = secret_client.get_secret(secret_name)
conn_string = secret.value

print("Connection string retrieved:", conn_string)
```
-----

## Next steps
[Azure Key Vault client libraries](../../key-vault/general/client-libraries.md)
