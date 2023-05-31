---
title: "Tutorial: Store and get a MySQL connection string in Azure Key vault"
description: "This tutorial shows how to store and get a Azure Database for MySQL Flexible Server connection string in Azure Key vault"
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: mksuni
ms.author: sumuth 
ms.date: 12/07/2022
---

# Tutorial: Store and get a MySQL connection string in Azure Key vault
By storing the MySQL connection string in Azure Key Vault, you ensure that sensitive information is securely managed and accessed only by authorized users or applications. Additionally, any changes to the connection string can be easily updated in the Key Vault without modifying the application code.

- Set up an Azure Key Vault :Create an Azure Key Vault in your Azure subscription if you haven't already. Make sure you have the necessary permissions to manage and access the Key Vault.
- Add a secret to the Key Vault: Inside the Key Vault, navigate to the "Secrets" section and click on "Generate/Import." Provide a name for your secret and enter the MySQL connection string as the secret value.
- Configure access policies: In the Key Vault settings, configure the appropriate access policies to grant access to the users or applications that need to retrieve the MySQL connection string from the Key Vault. Ensure that the necessary permissions are granted for "Get" operations on secrets.
- Retrieve the MySQL connection string: In your application or script, use the Azure Key Vault SDK or client libraries to authenticate and retrieve the MySQL connection string from the Key Vault. You will need to provide the appropriate authentication credentials and access permissions to access the Key Vault.
- Use the connection string in your application: Once you have retrieved the MySQL connection string from Azure Key Vault, you can use it in your application to establish a connection to the MySQL database. Pass the retrieved connection string as a parameter to your database connection code.

## Retrive secret from Key vault Code samples
Here are few code samples to retrieve the connection string from the key vault secret. 

### .NET 
In this code, we first define the URI of our Key Vault and the name of the secret (connection string) we want to retrieve. We then create a new DefaultAzureCredential object, which represents the authentication information for our application to access the Key Vault.
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
### Java

### PHP


