---
title: Introduction of Microsoft Spark Utilities
description: Tutorial of using MSSparkutils in Azure Synapse Analytics notebooks.
author: ruxu 
services: synapse-analytics 
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: spark
ms.date: 09/10/2020
ms.author: ruxu
ms.reviewer: 
---

# Introduction of Microsoft Spark Utilities
Microsoft Spark Utilities (MSSparkUtils) is a builtin package to help you do common used tasks more easily. You can use MSSparkUtils to work with file system efficiently, to get environment variables, and to work with secrets. MSSparkUtils are available in `PySpark (Python)`, `Scala`, and `.NET Spark (C#)` notebooks and synapse pipelines.

## Pre-requisites
### Configure access to Azure Data Lake Storage Gen2 
Synapse notebooks use Azure active directory(Azure AD) pass-through to access the ADLS Gen2 accounts. You need to be a **Blob Storage Contributor** to access the ADLS Gen2 account (or folder). 

Synapse pipelines use managed identity(MSI) for your Azure Synapse workspace to access the storage accounts. To use MSSparkUtils in your pipeline activities, your workspace identity needs to be a **Blob Storage Contributor** to access the ADLS Gen2 account (or folder).

Follow these steps to make sure your Azure AD and workspace MSI have access to the ADLS Gen2 account:
1. Open the [Azure portal](https://portal.azure.com/) and the storage account you want to access. You can navigate to the specific container you want to access.
2. Select the **Access control(IAM)** from the left panel.
3. Assign the following roles or make sure they're already assigned.
    - For the **Storage Blob Data Contributor** role on the storage account, assign **your Azure AD account** and **your workspace identity** (same as your workspace name) or make sure it is already assigned. 
4. Select **Save**.

You can access data on ADLS Gen2 with Synapse Spark via following URL:

<code>abfss://<container_name>@<storage_account_name>.dfs.core.windows.net/<path></code>

### Configure access to Azure Blob Storage 

Synapse leverage **Shared access signature (SAS)** to access Azure Blob Storage. To avoid exposing SAS keys in the code, we recommend creating a new linked service in your Synapse workspace to the Azure Blob Storage account you will access.

Follow these steps to add a new linked service for an Azure Blob Storage account:

1. Open the [Azure Synapse Studio](https://web.azuresynapse.net/).
2. Select **Manage** from the left panel and select **Linked services** under the **External connections**.
3. Search **Azure Blob Storage** in the **New linked Service** panel on the right.
4. Click **Continue**.
5. Select the Azure Blob Storage Account to access and configure the linked service name. Suggest using **Account key** for the **Authentication method**.
6. Click **Test connection** to validate the settings are correct.
7. Click **Create** first and click **Publish all** to save your change. 

You can access data on Azure Blob Storage with Synapse Spark via following URL:

<code>wasb[s]://<container_name>@<storage_account_name>.blob.core.windows.net/<path></code>

Here is a code example. 
 
:::zone pivot = "programming-language-python"

```python
from pyspark.sql import SparkSession

# Azure storage access info
blob_account_name = 'Your account name' # replace with your blob name
blob_container_name = 'Your container name' # replace with your container name
blob_relative_path = 'Your path' # replace with your relative folder path
linkedServiceName = 'Your linked service name' # replace with your linked service name

blob_sas_token = mssparkutils.credentials.getConnectionStringOrCreds(linkedServiceName)

# Allow SPARK to access from Blob remotely

wasb_path = 'wasbs://%s@%s.blob.core.windows.net/%s' % (blob_container_name, blob_account_name, blob_relative_path)

spark.conf.set('fs.azure.sas.%s.%s.blob.core.windows.net' % (blob_container_name, blob_account_name), blob_sas_token)
print('Remote blob path: ' + wasb_path)
```
::: zone-end

###  Configure access to Azure Key Vault

You can add an Azure Key Vault as a linked service to manage your credentials in Synapse. 

Follow these steps to add an Azure Key Vault as a Synapse linked service:
1. Open the [Azure Synapse Studio](https://web.azuresynapse.net/).
2. Select **Manage** from the left panel and select **Linked services** under the **External connections**.
3. Search **Azure Key Vault** in the **New linked Service** blade.
4. Select the Azure Key Vault Account to access and configure the linked service name.
5. Click **Test connection** to validate the settings are correct.
6. Click **Create** first and click **Publish all** to save your change. 

Synapse notebooks use Azure active directory(Azure AD) pass-through to access Azure Key Vault. Synapse pipelines use workspace identity to access Azure Key Vault. To make sure your code work both in notebook and in Synapse pipeline, we recommend you to grand secret access permission for your Azure AD account and your workspace identity.

Follow these steps to grand secret access to your workspace identity:
1. Open the [Azure portal](https://portal.azure.com/) and the Azure Key Vault you want to access. 
2. Select the **Access policies** from the left panel.
3. Click **Add Access Policy**: 
    - Choose **Key, Secret, & Certificate Management** as config template.
    - Select **your Azure AD account** and **your workspace identity** (same as your workspace name) in the select principal or make sure it is already assigned. 
4. Click **Select** and **Add**.
5. Click the **Save** button to commit changes.  


## File system utilities

`mssparkutils.fs` provides utilities for working with various file systems, including Azure Data Lake Storage Gen2 (ADLS Gen2) and Azure Blob Storage. Make sure you configure access to [Azure Data Lake Storage Gen2](#configure-access-to-azure-data-lake-storage-gen2) and [Azure Blob Storage](#configure-access-to-azure-blob-storage) appropriately.

Run following command to get an overview about the available methods:

:::zone pivot = "programming-language-python"

```python
from notebookutils import mssparkutils
mssparkutils.fs.help()
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.fs.help()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
using Microsoft.Spark.Extensions.Azure.Synapse.Analytics.Notebook.MSSparkUtils;
FS.Help()
```

::: zone-end

Get result:
```
mssparkutils.fs provides utilities for working with various FileSystems.

Below is overview about the available methods:

cp(from: String, to: String, recurse: Boolean = false): Boolean -> Copies a file or directory, possibly across FileSystems
mv(from: String, to: String, recurse: Boolean = false): Boolean -> Moves a file or directory, possibly across FileSystems
ls(dir: String): Array -> Lists the contents of a directory
mkdirs(dir: String): Boolean -> Creates the given directory if it does not exist, also creating any necessary parent directories
put(file: String, contents: String, overwrite: Boolean = false): Boolean -> Writes the given String out to a file, encoded in UTF-8
head(file: String, maxBytes: int = 1024 * 100): String -> Returns up to the first 'maxBytes' bytes of the given file as a String encoded in UTF-8
append(file: String, content: String, createFileIfNotExists: Boolean): Boolean -> Append the content to a file
rm(dir: String, recurse: Boolean = false): Boolean -> Removes a file or directory

Use mssparkutils.fs.help("methodName") for more info about a method.

```

### List files
List the content of a directory.


:::zone pivot = "programming-language-python"

```python
mssparkutils.fs.ls('Your directory path')
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.fs.ls("Your directory path")
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
FS.Ls("Your directory path")
```

::: zone-end


### View file properties
Returns file properties including file name, file path, file size, whether it is a directory and whether it is a file.

:::zone pivot = "programming-language-python"

```python
files = mssparkutils.fs.ls('Your directory path')
for file in files:
    print(file.name, file.isDir, file.isFile, file.path, file.size)
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
val files = mssparkutils.fs.ls("/")
files.foreach{
    file => println(file.name,file.isDir,file.isFile,file.size)
}
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
var Files = FS.Ls("/");
foreach(var File in Files) {
    Console.WriteLine(File.Name+" "+File.IsDir+" "+File.IsFile+" "+File.Size);
}
```

::: zone-end

### Create new directory
Creates the given directory if it does not exist, also creating any necessary parent directories.

:::zone pivot = "programming-language-python"

```python
mssparkutils.fs.mkdirs('new directory name')
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.fs.mkdirs("new directory name")
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
FS.Mkdirs("new directory name")
```

::: zone-end

### Copy file
Copies a file or directory, support copy across file systems.

:::zone pivot = "programming-language-python"

```python
mssparkutils.fs.cp('source file or directory', 'destination file or directory', True)# Set the third parameter as True to copy all files and directories recursively
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.fs.cp("source file or directory", "destination file or directory", true) // Set the third parameter as True to copy all files and directories recursively
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
FS.Cp("source file or directory", "destination file or directory", true) // Set the third parameter as True to copy all files and directories recursively
```

::: zone-end

### Preview file content
Returns up to the first 'maxBytes' bytes of the given file as a String encoded in UTF-8.

:::zone pivot = "programming-language-python"

```python
mssparkutils.fs.head('file path', maxBytes to read)
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.fs.head("file path", maxBytes to read)
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
FS.Head("file path", maxBytes to read)
```

::: zone-end

### Move file
Moves a file or directory, support move across file systems.

:::zone pivot = "programming-language-python"

```python
mssparkutils.fs.mv('source file or directory', 'destination directory', True) # Set the last parameter as True to firstly create the parent directory if it does not exist
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.fs.mv("source file or directory", "destination directory", true) // Set the last parameter as True to firstly create the parent directory if it does not exist
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
FS.Mv("source file or directory", "destination directory", true)
```

::: zone-end

### Write file
Writes the given String out to a file, encoded in UTF-8.

:::zone pivot = "programming-language-python"

```python
mssparkutils.fs.put("file path", "content to write", True) # Set the last parameter as True to overwrite the file if it existed already
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.fs.put("file path", "content to write", true) // Set the last parameter as True to overwrite the file if it existed already
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
FS.Put("file path", "content to write", true) // Set the last parameter as True to overwrite the file if it existed already
```

::: zone-end

### Append content to a file
Appends the given String to a file, encoded in UTF-8.

:::zone pivot = "programming-language-python"

```python
mssparkutils.fs.append('file path','content to append',True) # Set the last parameter as True to create the file if it does not exist
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.fs.append("file path","content to append",true) // Set the last parameter as True to create the file if it does not exist
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
FS.Append("file path","content to append",true) // Set the last parameter as True to create the file if it does not exist
```

::: zone-end

### Delete file or directory
Removes a file or a directory.

:::zone pivot = "programming-language-python"

```python
mssparkutils.fs.rm('file path', True) # Set the last parameter as True to remove all files and directories recursively 
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.fs.rm("file path", true) // Set the last parameter as True to remove all files and directories recursively 
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp
FS.Rm("file path", true) // Set the last parameter as True to remove all files and directories recursively 
```

::: zone-end


## Credentials utilities

You can use MSSparkUtils Credentials Utilities to get the access tokens of linked services and manage secrets in Azure Key Vault. 

Run following command to get an overview about the available methods:

:::zone pivot = "programming-language-python"

```python
mssparkutils.credentials.help()
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.credentials.help()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end

Get result:

```
getToken(audience, name): returns AAD token for a given audience, name (optional)
isValidToken(token): returns true if token hasn't expired
getConnectionStringOrCreds(linkedService): returns connection string or credentials for linked service
getSecret(akvName, secret, linkedService): returns AKV secret for a given AKV linked service, akvName, secret key
getSecret(akvName, secret): returns AKV secret for a given akvName, secret key
putSecret(akvName, secretName, secretValue, linkedService): puts AKV secret for a given akvName, secretName
putSecret(akvName, secretName, secretValue): puts AKV secret for a given akvName, secretName
```

### Get token
Returns Azure AD token for a given audience, name (optional). The table below list all the available audience types: 

|Audience Type|Audience key|
|--|--|
|Audience Resolve Type|'Audience'|
|Storage Audience Resource|'Storage'|
|Data Warehouse Audience Resource|'DW'|
|Data Lake Audience Resource|'AzureManagement'|
|Vault Audience Resource|'DataLakeStore'|
|Azure OSSDB Audience Resource|'AzureOSSDB'|
|Azure Synapse Resource|'Synapse'|
|Azure Data Factory Resource|'ADF'|

:::zone pivot = "programming-language-python"

```python
mssparkutils.credentials.getToken('audience Key')
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.credentials.getToken("audience Key")
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end


### Validate token
Returns true if token hasn't expired.

:::zone pivot = "programming-language-python"

```python
mssparkutils.credentials.isValidToken('your token')
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.credentials.isValidToken("your token")
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end


### Get connection string or credentials for linked service
Returns connection string or credentials for linked service. 

:::zone pivot = "programming-language-python"

```python
mssparkutils.credentials.getConnectionStringOrCreds('linked service name')
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.credentials.getConnectionStringOrCreds("linked service name")
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end


### Get secret using workspace identity
Returns Azure Key Vault secret for a given Azure Key Vault name, secret name, and linked service name using workspace identity. Make sure you configure the access to [Azure Key Vault](#configure-access-to-azure-key-vault) appropriately.

:::zone pivot = "programming-language-python"

```python
mssparkutils.credentials.getSecret('azure key vault name','secret name','linked service name')
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.credentials.getSecret("azure key vault name","secret name","linked service name")
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end


### Get secret using user credentials
Returns Azure Key Vault secret for a given Azure Key Vault name, secret name, and linked service name using user credentials. 

:::zone pivot = "programming-language-python"

```python
mssparkutils.credentials.getSecret('azure key vault name','secret name')
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.credentials.getSecret("azure key vault name","secret name")
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end

### Put secret using workspace identity
Puts Azure Key Vault secret for a given Azure Key Vault name, secret name, and linked service name using workspace identity. Make sure you configure the access to [Azure Key Vault](#configure-access-to-azure-key-vault) appropriately.

:::zone pivot = "programming-language-python"

```python
mssparkutils.credentials.putSecret('azure key vault name','secret name','secret value','linked service name')
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.credentials.putSecret("azure key vault name","secret name","secret value","linked service name")
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end


### Put secret using user credentials
Puts Azure Key Vault secret for a given Azure Key Vault name, secret name, and linked service name using user credentials. 

:::zone pivot = "programming-language-python"

```python
mssparkutils.credentials.putSecret('azure key vault name','secret name','secret value')
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.credentials.putSecret("azure key vault name","secret name","secret value")
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end


## Environment utilities 

Run following command to get an overview about the available methods:

:::zone pivot = "programming-language-python"

```python
mssparkutils.env.help()
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end

Get result:
```
getUserName(): returns user name
getUserId(): returns unique user id
getJobId(): returns job id
getWorkspaceName(): returns workspace name
getPoolName(): returns Spark pool name
getClusterId(): returns cluster id
```

### Get user name
Returns current user name.

:::zone pivot = "programming-language-python"

```python
mssparkutils.env.getUserName()
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.env.getUserName()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end

### Get user ID
Returns current user ID.

:::zone pivot = "programming-language-python"

```python
mssparkutils.env.getUserId()
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.env.getUserId()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end

### Get job ID
Returns job ID.

:::zone pivot = "programming-language-python"

```python
mssparkutils.env.getJobId()
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.env.getJobId()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end

### Get workspace name
Returns workspace name.

:::zone pivot = "programming-language-python"

```python
mssparkutils.env.getWorkspaceName()
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.env.getWorkspaceName()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end

### Get pool name
Returns Spark pool name.

:::zone pivot = "programming-language-python"

```python
mssparkutils.env.getPoolName()
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.env.getPoolName()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end

### Get cluster ID
Returns current cluster ID.

:::zone pivot = "programming-language-python"

```python
mssparkutils.env.getClusterId()
```
::: zone-end

:::zone pivot = "programming-language-scala"

```scala
mssparkutils.env.getClusterId()
```

::: zone-end

:::zone pivot = "programming-language-csharp"

```csharp

```

::: zone-end

## Next steps
- [Check out Synapse sample notebooks](https://github.com/Azure-Samples/Synapse/tree/master/Notebooks)
- [Quickstart: Create an Apache Spark pool (preview) in Azure Synapse Analytics using web tools](../quickstart-apache-spark-notebook.md)
- [What is Apache Spark in Azure Synapse Analytics](apache-spark-overview.md)
- [Azure Synapse Analytics](https://docs.microsoft.com/azure/synapse-analytics)