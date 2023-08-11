---
title: Secure access credentials with Linked Services in Apache Spark for Azure Synapse Analytics
description: This article provides concepts on how to securely integrate Apache Spark for Azure Synapse Analytics with other services using linked services and token library
services: synapse-analytics 
author: vijaysr 
ms.service:  synapse-analytics 
ms.topic: overview
ms.subservice: spark
ms.custom: devx-track-python
ms.date: 06/28/2023
ms.author: vijaysr
ms.reviewer: shravan
zone_pivot_groups: programming-languages-spark-all-minus-sql-r
---

# Secure credentials with linked services using the mssparkutils

Accessing data from external sources is a common pattern. Unless the external data source allows anonymous access, chances are you need to secure your connection with a credential, secret, or connection string.  

Azure Synapse Analytics uses Azure Active Directory (Azure AD) passthrough by default for authentication between resources. If you need to connect to a resource using other credentials, use the mssparkutils directly. The mssparkutils simplifies the process of retrieving SAS tokens, Azure AD tokens, connection strings, and secrets stored in a linked service or from an Azure Key Vault.

Azure AD passthrough uses permissions assigned to you as a user in Azure AD, rather than permissions assigned to Synapse or a separate service principal. For example, if you want to use Azure AD passthrough to access a blob in a storage account, then you should go to that storage account and assign blob contributor role to yourself.

When retrieving secrets from Azure Key Vault, we recommend creating a linked service to your Azure Key Vault. Ensure that the Synapse workspace managed service identity (MSI) has Secret Get privileges on your Azure Key Vault. Synapse will authenticate to Azure Key Vault using the Synapse workspace managed service identity. If you connect directly to Azure Key Vault without a linked service, you will authenticate using your user Azure Active Directory credential.

For more information, see [linked services](../../data-factory/concepts-linked-services.md?context=/azure/synapse-analytics/context/context).

## Usage

### mssparkutils help for tokens and secrets
This function displays the help documentation for secrets and tokens management in Synapse.

::: zone pivot = "programming-language-scala"

```scala
mssparkutils.credentials.help()
```

::: zone-end

::: zone pivot = "programming-language-python"

```python
mssparkutils.credentials.help()
```

::: zone-end

::: zone pivot = "programming-language-csharp"

```csharp
Console.WriteLine(TokenLibrary.help());
```

::: zone-end

Get result:

```
 getToken(audience: String, name: String): returns AAD token for a given audience, name (optional)
 isValidToken(token: String): returns true if token hasn't expired
 getConnectionStringOrCreds(linkedService: String): returns connection string or credentials for the linked service
 getFullConnectionString(linkedService: String): returns full connection string with credentials for the linked service
 getPropertiesAll(linkedService: String): returns all the properties of the linked service
 getSecret(akvName: String, secret: String, linkedService: String): returns AKV secret for a given AKV linked service, akvName, secret key using workspace MSI
 getSecret(akvName: String, secret: String): returns AKV secret for a given akvName, secret key using user credentials
 getSecretWithLS(linkedService: String, secret: String): returns AKV secret for a given linked service, secret key
 putSecret(akvName: String, secretName: String, secretValue: String): puts AKV secret for a given akvName, secretName
 putSecret(akvName: String, secretName: String, secretValue: String, linkedService: String): puts AKV secret for a given akvName, secretName
 putSecretWithLS(linkedService: String, secretName: String, secretValue: String): puts AKV secret for a given linked service, secretName
```

## Accessing Azure Data Lake Storage Gen2

#### ADLS Gen2 Primary Storage

Accessing files from the primary Azure Data Lake Storage uses Azure Active Directory passthrough for authentication by default and doesn't require the explicit use of the mssparkutils. The identity used in the passthrough authentication differs based on a few factors. By default, interactive notebooks are executed using the user's identity, but it can be changed to the workspace managed service identity (MSI). Batch jobs and non-interactive executions of the notebook use the Workspace MSI.

::: zone pivot = "programming-language-scala"

```scala
val df = spark.read.csv("abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<FILE PATH>")
display(df.limit(10))
```

::: zone-end

::: zone pivot = "programming-language-python"

```python
df = spark.read.csv('abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<FILE PATH>')
display(df.limit(10))
```

::: zone-end

#### ADLS Gen2 storage with linked services

Azure Synapse Analytics provides an integrated linked services experience when connecting to Azure Data Lake Storage Gen2. Linked services can be configured to authenticate using an **Account Key**, **Service Principal**, **Managed Identity**, or **Credential**.

When the linked service authentication method is set to **Account Key**, the linked service will authenticate using the provided storage account key, request a SAS key, and automatically apply it to the storage request using the **LinkedServiceBasedSASProvider**.

Synapse allows users to set the linked service for a particular storage account. This makes it possible to read/write data from **multiple storage accounts** in a single spark application/query. Once we set **spark.storage.synapse.{source_full_storage_account_name}.linkedServiceName** for each storage account that will be used, Synapse figures out which linked service to use for a particular read/write operation. However if our spark job only deals with a single storage account, we can simply omit the storage account name and use **spark.storage.synapse.linkedServiceName**

::: zone pivot = "programming-language-scala"

```scala
val sc = spark.sparkContext
val source_full_storage_account_name = "teststorage.dfs.core.windows.net"
spark.conf.set(s"spark.storage.synapse.$source_full_storage_account_name.linkedServiceName", "<LINKED SERVICE NAME>")
sc.hadoopConfiguration.set(s"fs.azure.account.auth.type.$source_full_storage_account_name", "SAS")
sc.hadoopConfiguration.set(s"fs.azure.sas.token.provider.type.$source_full_storage_account_name", "com.microsoft.azure.synapse.tokenlibrary.LinkedServiceBasedSASProvider")

val df = spark.read.csv("abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<FILE PATH>")

display(df.limit(10))
```

::: zone-end

::: zone pivot = "programming-language-python"

```python
%%pyspark
# Set the required configs
source_full_storage_account_name = "teststorage.dfs.core.windows.net"
spark.conf.set(f"spark.storage.synapse.{source_full_storage_account_name}.linkedServiceName", "<lINKED SERVICE NAME>")
sc._jsc.hadoopConfiguration().set(f"fs.azure.account.auth.type.{source_full_storage_account_name}", "SAS")
sc._jsc.hadoopConfiguration().set(f"fs.azure.sas.token.provider.type.{source_full_storage_account_name}", "com.microsoft.azure.synapse.tokenlibrary.LinkedServiceBasedSASProvider")

# Python code
df = spark.read.csv('abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<DIRECTORY PATH>')

df.show()
```

::: zone-end

When the linked service authentication method is set to **Managed Identity** or **Service Principal**, the linked service will use the Managed Identity or Service Principal token with the **LinkedServiceBasedTokenProvider** provider.  


::: zone pivot = "programming-language-scala"

```scala
val sc = spark.sparkContext
val source_full_storage_account_name = "teststorage.dfs.core.windows.net"
spark.conf.set(s"spark.storage.synapse.$source_full_storage_account_name.linkedServiceName", "<LINKED SERVICE NAME>")
sc.hadoopConfiguration.set(s"fs.azure.account.oauth.provider.type.$source_full_storage_account_name", "com.microsoft.azure.synapse.tokenlibrary.LinkedServiceBasedTokenProvider") 
val df = spark.read.csv("abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<FILE PATH>")

display(df.limit(10))
```

::: zone-end

::: zone pivot = "programming-language-python"

```python
%%pyspark
# Python code
source_full_storage_account_name = "teststorage.dfs.core.windows.net"
spark.conf.set(f"spark.storage.synapse.{source_full_storage_account_name}.linkedServiceName", "<LINKED SERVICE NAME>")
sc._jsc.hadoopConfiguration().set(f"fs.azure.account.oauth.provider.type.{source_full_storage_account_name}", "com.microsoft.azure.synapse.tokenlibrary.LinkedServiceBasedTokenProvider")

df = spark.read.csv('abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<DIRECTORY PATH>')

df.show()
```

::: zone-end

#### ADLS Gen2 storage (without linked services)

Connect to ADLS Gen2 storage directly by using a SAS key use the **ConfBasedSASProvider** and provide the SAS key to the **spark.storage.synapse.sas** configuration setting.

::: zone pivot = "programming-language-scala"

```scala
%%spark
sc.hadoopConfiguration.set("fs.azure.account.auth.type", "SAS")
sc.hadoopConfiguration.set("fs.azure.sas.token.provider.type", "com.microsoft.azure.synapse.tokenlibrary.ConfBasedSASProvider")
spark.conf.set("spark.storage.synapse.sas", "<SAS KEY>")

val df = spark.read.csv("abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<FILE PATH>")

display(df.limit(10))
```

::: zone-end

::: zone pivot = "programming-language-python"

```python
%%pyspark

sc._jsc.hadoopConfiguration().set("fs.azure.account.auth.type", "SAS")
sc._jsc.hadoopConfiguration().set("fs.azure.sas.token.provider.type", "com.microsoft.azure.synapse.tokenlibrary.ConfBasedSASProvider")
spark.conf.set("spark.storage.synapse.sas", "<SAS KEY>")

df = spark.read.csv('abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<FILE PATH>')

display(df.limit(10))
```

::: zone-end

#### ADLS Gen2 storage with Azure Key Vault

Connect to ADLS Gen2 storage using a SAS token stored in Azure Key Vault secret.  

::: zone pivot = "programming-language-scala"

```scala
%%spark
sc.hadoopConfiguration.set("fs.azure.account.auth.type", "SAS")
sc.hadoopConfiguration.set("fs.azure.sas.token.provider.type", "com.microsoft.azure.synapse.tokenlibrary.AkvBasedSASProvider")
spark.conf.set("spark.storage.synapse.akv", "<AZURE KEY VAULT NAME>")
spark.conf.set("spark.storage.akv.secret", "<SECRET KEY>")

val df = spark.read.csv("abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<FILE PATH>")

display(df.limit(10))
```

::: zone-end

::: zone pivot = "programming-language-python"

```python
%%pyspark
sc._jsc.hadoopConfiguration().set("fs.azure.account.auth.type", "SAS")
sc._jsc.hadoopConfiguration().set("fs.azure.sas.token.provider.type", "com.microsoft.azure.synapse.tokenlibrary.AkvBasedSASProvider")
spark.conf.set("spark.storage.synapse.akv", "<AZURE KEY VAULT NAME>")
spark.conf.set("spark.storage.akv.secret", "<SECRET KEY>")

df = spark.read.csv('abfss://<CONTAINER>@<ACCOUNT>.dfs.core.windows.net/<FILE PATH>')

display(df.limit(10))
```

::: zone-end

## TokenLibrary for other linked services

To connect to other linked services, you can make a direct call to the TokenLibrary.

#### getConnectionString()

 To retrieve the connection string, use the **getConnectionString** function and pass in the **linked service name**.

::: zone pivot = "programming-language-scala"

```scala
%%spark
// retrieve connectionstring from mssparkutils

mssparkutils.getFullConnectionString("<LINKED SERVICE NAME>")
```

::: zone-end

::: zone pivot = "programming-language-python"

```python
%%pyspark
# retrieve connectionstring from mssparkutils

mssparkutils.getFullConnectionString("<LINKED SERVICE NAME>")
```

::: zone-end

::: zone pivot = "programming-language-csharp"

```csharp
%%csharp
// retrieve connectionstring from TokenLibrary

using Microsoft.Spark.Extensions.Azure.Synapse.Analytics.Utils;

string connectionString = TokenLibrary.GetConnectionString(<LINKED SERVICE NAME>);
Console.WriteLine(connectionString);
```

::: zone-end

#### getPropertiesAll()

The getPropertiesAll is a helper function available in Scala and Python to get all the properties of a linked service

```python
%%pyspark
import json
# retrieve connectionstring from mssparkutils

json.loads(mssparkutils.credentials.getPropertiesAll("<LINKED SERVICE NAME>"))
```
The output will look like
```
{
    'AuthType': 'Key',
    'AuthKey': '[REDACTED]',
    'Id': None,
    'Type': 'AzureBlobStorage',
    'Endpoint': 'https://storageaccount.blob.core.windows.net/',
    'Database': None
}
```

#### GetSecret()

To retrieve a secret stored from Azure Key Vault, we recommend that you create a linked service to Azure Key Vault within the Synapse workspace. The Synapse workspace managed service identity will need to be granted **GET** Secrets permission to the Azure Key Vault. The linked service will use the managed service identity to connect to Azure Key Vault service to retrieve the secret. Otherwise, connecting directly to Azure Key Vault will use the user's Azure Active Directory (Azure AD) credential. In this case, the user will need to be granted the Get Secret permissions in Azure Key Vault.

In government clouds, please provide the fully qualified domain name of the keyvault.

`mssparkutils.credentials.getSecret("<AZURE KEY VAULT NAME>", "<SECRET KEY>" [, <LINKED SERVICE NAME>])`

To retrieve a secret from Azure Key Vault, use the **mssparkutils.credentials.getSecret()** function.

::: zone pivot = "programming-language-scala"

```scala

mssparkutils.credentials.getSecret("<AZURE KEY VAULT NAME>", "<SECRET KEY>", "<LINKED SERVICE NAME>")

```

::: zone-end

::: zone pivot = "programming-language-python"

```python
mssparkutils.credentials.getSecret("<AZURE KEY VAULT NAME>", "<SECRET KEY>", "<LINKED SERVICE NAME>")
```

::: zone-end

::: zone pivot = "programming-language-csharp"

```csharp
using Microsoft.Spark.Extensions.Azure.Synapse.Analytics.Utils;

string connectionString = TokenLibrary.GetSecret("<AZURE KEY VAULT NAME>", "<SECRET KEY>", "<LINKED SERVICE NAME>");
Console.WriteLine(connectionString);
```

::: zone-end

#### Linked service connections supported from the Spark runtime

While Azure Synapse Analytics supports a variety of linked service connections (from pipelines and other Azure products), not all of them are supported from the Spark runtime. Here is the list of supported linked services:

 - Azure Blob Storage
 - Azure AI services
 - Azure Cosmos DB
 - Azure Data Explorer
 - Azure Database for MySQL
 - Azure Database for Postgre SQL
 - Azure Data Lake Store (Gen1)
 - Azure Key Vault
 - Azure Machine Learning
 - Azure Purview
 - Azure SQL Database
 - Azure SQL Data Warehouse (Dedicated and Serverless)
 - Azure Storage

 #### mssparkutils.credenials.getToken()
 When you need an OAuth bearer token to access services directly, you can use the `getToken` method. The following resources are supported:

| Service Name                                          | String literal to be used in API call |
|-------------------------------------------------------|---------------------------------------|
| Azure Storage                                         | `Storage`                             |
| Azure Key Vault                                       | `Vault`                               |
| Azure Management                                      | `AzureManagement`                     |
| Azure SQL Data Warehouse (Dedicated and Serverless)   | `DW`                                  |
| Azure Synapse                                         | `Synapse`                             |
| Azure Data Lake Store                                 | `DataLakeStore`                       |
| Azure Data Factory                                    | `ADF`                                 |
| Azure Data Explorer                                   | `AzureDataExplorer`                   |
| Azure Database for MySQL            | `AzureOSSDB`                          |
| Azure Database for MariaDB          | `AzureOSSDB`                          |
| Azure Database for PostgreSQL       | `AzureOSSDB`                          |
#### Unsupported linked service access from the Spark runtime

The following methods of accessing the linked services are not supported from the Spark runtime:

  - Passing arguments to parameterized linked service
  - Connections with User assigned managed identities (UAMI)

While running a notebook or a Spark job, requests to get a token / secret using a linked service may fail with an error message that indicates 'BadRequest'. This is often caused by a configuration issue with the linked service. If you see this error message, please check the configuration of your linked service. If you have any questions, please contact Microsoft Azure Support at the [Azure portal](https://portal.azure.com).

## Next steps

- [Write to dedicated SQL pool](./synapse-spark-sql-pool-import-export.md)
