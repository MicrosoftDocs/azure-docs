---
title: Query for a Blob Storage endpoint using the Azure Storage management library
titleSuffix: Azure Storage
description: Learn how to query for a Blob Storage endpoint using the Azure Storage management library. Then use the endpoint to create a BlobServiceClient object to connect to Blob Storage data resources.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 06/07/2023
ms.custom: devguide-csharp, devguide-java, devguide-javascript, devguide-python
---

# Query for a Blob Storage endpoint using the Azure Storage management library

A Blob Storage endpoint forms the base address for all objects within a storage account. When you create a storage account, you specify which type of endpoint you want to use. Blob Storage supports two types of endpoints:
 
- A [standard endpoint](../common/storage-account-overview.md#standard-endpoints) includes the unique storage account name along with a fixed domain name. The format of a standard endpoint is `https://<storage-account>.blob.core.windows.net`.
- An [Azure DNS zone endpoint (preview)](../common/storage-account-overview.md#azure-dns-zone-endpoints-preview) dynamically selects an Azure DNS zone and assigns it to the storage account when it's created. The format of an Azure DNS Zone endpoint is `https://<storage-account>.z[00-99].blob.storage.azure.net`. 

When your application creates a service client object that connects to Blob Storage data resources, you pass a URI referencing the endpoint to the service client constructor. You can construct the URI string manually, or you can query for the service endpoint at runtime using the Azure Storage management library.

> [!IMPORTANT]
> When referencing a service endpoint in a client application, it's recommended that you avoid taking a dependency on a cached IP address. The storage account IP address is subject to change, and relying on a cached IP address may result in unexpected behavior.
>
> Additionally, it's recommended that you honor the time-to-live (TTL) of the DNS record and avoid overriding it. Overriding the DNS TTL may result in unexpected behavior.

The Azure Storage management library provides programmatic access to the [Azure Storage resource provider](/rest/api/storagerp). The resource provider is the Azure Storage implementation of the Azure Resource Manager. The management library enables developers to manage storage accounts and account configuration, as well as configure lifecycle management policies, object replication policies, and immutability policies.

In this article, you learn how to query a Blob Storage endpoint using the Azure Storage management library. Then you use that endpoint to create a `BlobServiceClient` object to connect with Blob Storage data resources.

## Set up your project 

To work with the code examples in this article, follow these steps to set up your project.

### Install packages

Install packages to work with the libraries used in this example.

## [.NET](#tab/dotnet)

Install the following packages using `dotnet add package`:

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Azure.ResourceManager.Storage
dotnet add package Azure.Storage.Blobs
```

## [Java](#tab/java)

Open the `pom.xml` file in your text editor. 

Add **azure-sdk-bom** to take a dependency on the latest version of the library. In the following snippet, replace the `{bom_version_to_target}` placeholder with the version number. Using **azure-sdk-bom** keeps you from having to specify the version of each individual dependency. To learn more about the BOM, see the [Azure SDK BOM README](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/boms/azure-sdk-bom/README.md).

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-sdk-bom</artifactId>
            <version>{bom_version_to_target}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Then add the following dependency elements to the group of dependencies. The **azure-identity** dependency is needed for passwordless connections to Azure services.

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-storage-blob</artifactId>
</dependency>
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-identity</artifactId>
</dependency>
<dependency>
  <groupId>com.azure.resourcemanager</groupId>
  <artifactId>azure-resourcemanager</artifactId>
  <version>2.24.0</version>
</dependency>
<dependency>
  <groupId>com.azure.resourcemanager</groupId>
  <artifactId>azure-resourcemanager-storage</artifactId>
  <version>2.24.0</version>
</dependency>
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-core-management</artifactId>
  <version>1.10.2</version>
</dependency>
```

## [JavaScript](#tab/javascript)

Install the following packages using `npm install`:

```console
npm install @azure/identity
npm install @azure/storage-blob
npm install @azure/arm-resources
npm install @azure/arm-storage
```

## [Python](#tab/python)

Install the following packages using `pip install`:

```console
pip install azure-identity
pip install azure-storage-blob
pip install azure-mgmt-resource
pip install azure-mgmt-storage
```

---

### Set up the app code

Add the necessary `using` or `import` directives to the code. Note that the code examples may split out functionality between files, but in this section all directives are listed together.

## [.NET](#tab/dotnet)

Add the following `using` directives:

```csharp
using Azure.Core;
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.ResourceManager;
using Azure.ResourceManager.Resources;
using Azure.ResourceManager.Storage;
```

Client library information:

- [Azure.Identity](/dotnet/api/overview/azure/identity-readme): Provides Azure Active Directory (Azure AD) token authentication support across the Azure SDK, and is needed for passwordless connections to Azure services.
- [Azure.ResourceManager.Storage](/dotnet/api/overview/azure/resourcemanager.storage-readme): Supports management of Azure Storage resources, including resource groups and storage accounts.
- [Azure.Storage.Blobs](/dotnet/api/overview/azure/storage.blobs-readme): Contains the primary classes that you can use to work with Blob Storage data resources.

## [Java](#tab/java)

Add the following `import` directives:

```java
import com.azure.identity.*;
import com.azure.storage.blob.*;
import com.azure.resourcemanager.*;
import com.azure.resourcemanager.storage.models.*;
import com.azure.core.management.*;
import com.azure.core.management.profile.*;
```

Client library information:

- [com.azure.identity](/java/api/overview/azure/identity-readme): Provides Azure Active Directory (Azure AD) token authentication support across the Azure SDK, and is needed for passwordless connections to Azure services.
- [com.azure.storage.blob](/java/api/com.azure.storage.blob): Contains the primary classes that you can use to work with Blob Storage data resources.
- [com.azure.resourcemanager](/java/api/overview/azure/resourcemanager-readme): Supports management of Azure resources and resource groups.
- [com.azure.resourcemanager.storage](/java/api/overview/azure/resourcemanager-storage-readme): Supports management of Azure Storage resources, including resource groups and storage accounts.

## [JavaScript](#tab/javascript)

Add the following `require` statements to load the modules:

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");
const { ResourceManagementClient } = require("@azure/arm-resources");
const { StorageManagementClient } = require("@azure/arm-storage");
```

Client library information:

- [@azure/identity](/javascript/api/overview/azure/identity-readme): Provides Azure Active Directory (Azure AD) token authentication support across the Azure SDK, and is needed for passwordless connections to Azure services.
- [@azure/storage-blob](/javascript/api/overview/azure/storage-blob-readme): Contains the primary classes that you can use to work with Blob Storage data resources.
- [@azure/arm-resources](/javascript/api/overview/azure/arm-resources-readme): Supports management of Azure resources and resource groups.
- [@azure/arm-storage](/javascript/api/overview/azure/arm-storage-readme): Supports management of Azure Storage resources, including resource groups and storage accounts.

## [Python](#tab/python)

Add the following `import` statements:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.storage import StorageManagementClient
```

Client library information:

- [azure-identity](/python/api/overview/azure/identity-readme): Provides Azure Active Directory (Azure AD) token authentication support across the Azure SDK, and is needed for passwordless connections to Azure services.
- [azure-storage-blob](/python/api/overview/azure/storage-blob-readme): Contains the primary classes that you can use to work with Blob Storage data resources.
- [azure-mgmt-resource](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient): Supports management of Azure resources and resource groups.
- [azure-mgmt-storage](/python/api/azure-mgmt-storage/azure.mgmt.storage.storagemanagementclient): Supports management of Azure Storage resources, including resource groups and storage accounts.

---

### Register the Storage resource provider with a subscription

A resource provider must be registered with your Azure subscription before you can work with it. This step only needs to be done once per subscription, and only applies if the resource provider **Microsoft.Storage** is not currently registered with your subscription.

You can register the Storage resource provider, or check the registration status, using [Azure portal](/azure/azure-resource-manager/management/resource-providers-and-types#azure-portal), [Azure CLI](/azure/azure-resource-manager/management/resource-providers-and-types#azure-cli), or [Azure PowerShell](/azure/azure-resource-manager/management/resource-providers-and-types#azure-powershell).

You can also use the Azure management libraries to check the registration status and register the Storage resource provider, as shown in the following examples:

## [.NET](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobQueryEndpoint/QueryEndpoint.cs" id="Snippet_RegisterSRP":::

## [Java](#tab/java)

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-query-endpoint/src/main/java/com/blobs/queryendpoint/AccountProperties.java" id="Snippet_RegisterSRP":::

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/blob-query-endpoint/index.js" id="Snippet_register_srp":::

## [Python](#tab/python)

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-query-endpoint/blob-query-endpoint.py" id="Snippet_register_srp":::

---

> [!NOTE]
> To perform the register operation, you'll need permissions for the following Azure RBAC action: **Microsoft.Storage/register/action**. This permission is included in the **Contributor** and **Owner** roles.

## Query for the Blob Storage endpoint

To retrieve the Blob Storage endpoint for a given storage account, we need to get the storage account properties by calling the [Get Properties](/rest/api/storagerp/storage-accounts/get-properties) operation. The following code samples use both the data access and management libraries to get a Blob Storage endpoint for a specified storage account:

## [.NET](#tab/dotnet)

To get the properties for a specified storage account, use the following method from a [StorageAccountCollection](/dotnet/api/azure.resourcemanager.storage.storageaccountcollection) object:

- [GetAsync](/dotnet/api/azure.resourcemanager.storage.storageaccountcollection.getasync)

This method returns a [StorageAccountResource](/dotnet/api/azure.resourcemanager.storage.storageaccountresource) object, which represents the storage account.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobQueryEndpoint/QueryEndpoint.cs" id="Snippet_QueryEndpoint":::

## [Java](#tab/java)

To get the properties for a specified storage account, use the following method from an [AzureResourceManager](/java/api/com.azure.resourcemanager.azureresourcemanager) object:

- [storageAccounts().getByResourceGroup](/java/api/com.azure.resourcemanager.resources.fluentcore.arm.collection.supportsgettingbyresourcegroup#com-azure-resourcemanager-resources-fluentcore-arm-collection-supportsgettingbyresourcegroup-getbyresourcegroup(java-lang-string-java-lang-string))

This method returns a [StorageAccount](/java/api/com.azure.resourcemanager.storage.models.storageaccount) interface, which is an immutable client-side representation of the storage account.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-query-endpoint/src/main/java/com/blobs/queryendpoint/AccountProperties.java" id="Snippet_QueryEndpoint":::

## [JavaScript](#tab/javascript)

To get the properties for a specified storage account, use the following method from a [StorageManagementClient](/javascript/api/@azure/arm-storage/storagemanagementclient) object:

- [storageAccounts.getProperties](/javascript/api/@azure/arm-storage/storageaccounts#@azure-arm-storage-storageaccounts-getproperties)

This method returns a [`Promise<StorageAccountsGetPropertiesResponse>`](/javascript/api/@azure/arm-storage/storageaccountsgetpropertiesresponse), which represents the storage account.

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/blob-query-endpoint/index.js" id="Snippet_query_blob_endpoint":::

## [Python](#tab/python)

To get the properties for a specified storage account, use the following method from a [StorageManagementClient](/python/api/azure-mgmt-storage/azure.mgmt.storage.storagemanagementclient) object:

- [storageAccounts.getProperties](/python/api/azure-mgmt-storage/azure.mgmt.storage.storagemanagementclient#azure-mgmt-storage-storagemanagementclient-storage-accounts)

This method returns a `StorageAccount` object, which represents the storage account.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-query-endpoint/blob-query-endpoint.py" id="Snippet_query_blob_endpoint":::

---

## Create a client object using the endpoint

Once you have the Blob Storage endpoint for a storage account, you can instantiate a client object to work with data resources. The following code sample creates a `BlobServiceClient` object using the endpoint we retrieved in the earlier example:

## [.NET](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobQueryEndpoint/Program.cs" id="Snippet_CreateClientWithEndpoint":::

## [Java](#tab/java)

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-query-endpoint/src/main/java/com/blobs/queryendpoint/App.java" id="Snippet_CreateClientWithEndpoint":::

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/blob-query-endpoint/index.js" id="Snippet_create_client_with_endpoint":::

## [Python](#tab/python)

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-query-endpoint/blob-query-endpoint.py" id="Snippet_create_client_with_endpoint":::

---

## Next steps

View the full code samples (GitHub):
- [.NET](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/dotnet/BlobQueryEndpoint)
- [Java](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/Java/blob-query-endpoint/src/main/java/com/blobs/queryendpoint)
- [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/blob-query-endpoint/index.js)
- [Python](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-query-endpoint/blob-query-endpoint.py)

To learn more about creating client objects, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).



