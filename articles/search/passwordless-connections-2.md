---
title: Use passwordless connections with Azure AI Search
description: Use passwordless connections with Azure Identity for authentication and authorization with Azure AI Search.
ms.topic: how-to
ms.date: 06/05/2024
author: HeidiSteen
ms.author: heidist
ms.reviewer: scaddie
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python, passwordless-dotnet, passwordless-java, passwordless-js, passwordless-python, build-2024-intelligent-apps
#customer intent: As a developer, I want to use passwordless connections so that I don't leak secrets.
---

# Use Azure AI Search without keys 

In your application code, you can set up a passwordless connection to Azure AI Search that uses roles and Microsoft Entra ID for authentication and authorization. Application requests to most Azure services must be authenticated with keys or [passwordless connections](https://aka.ms/delete-passwords). Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate to the service. Passwordless authentication offers improved management and security benefits over the account key because there's no key (or connection string) to store.

Passwordless connections are enabled with the following steps: 

* Configure your authentication.
* Set environment variables, as needed. 
* Use an Azure Identity library credential type to create an Azure AI Search client object.

## Prerequisites

### Install Azure Identity client library

#### [.NET](#tab/csharp)

Install the .NET [Azure Identity client library](https://www.nuget.org/packages/Azure.Identity):

```dotnetcli
dotnet add package Azure.Identity
```

#### [Java](#tab/java)

Install the Java [Azure Identity client library](https://mvnrepository.com/artifact/com.azure/azure-identity) with the following POM file:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-identity</artifactId>
            <version>1.10.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

#### [JavaScript](#tab/javascript)

Install the JavaScript [Azure Identity client library](https://www.npmjs.com/package/@azure/identity):

```console
npm install --save @azure/identity
```

#### [Python](#tab/python)

Install the Python [Azure Identity client library](https://pypi.org/project/azure-identity/):

```console
pip install azure-identity
```

---

### Update source code to use DefaultAzureCredential

The Azure Identity library's `DefaultAzureCredential` allows the customer to run the same code in the local development environment and in the Azure Cloud.

#### [.NET](#tab/csharp)

For more information on `DefaultAzureCredential` for .NET, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme#defaultazurecredential).

```csharp
using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
using Azure.Search.Documents.Models;
using Azure.Identity;
using System;
using static System.Environment;

string endpoint = GetEnvironmentVariable("AZURE_SEARCH_ENDPOINT");
string indexName = "my-search-index";

SearchClient client = new SearchClient(new Uri(endpoint), indexName, new DefaultAzureCredential());

SearchIndexClient client = new SearchIndexClient(endpoint, new DefaultAzureCredential());
```

#### [Java](#tab/java)

For more information on `DefaultAzureCredential` for Java, see [Azure Identity client library for Java](/java/api/overview/azure/identity-readme#defaultazurecredential).

```java
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.search.documents.SearchAsyncClient;
import com.azure.search.documents.SearchClientBuilder;
import com.azure.search.documents.SearchDocument;
import com.azure.search.documents.indexes.SearchIndexAsyncClient;
import com.azure.search.documents.indexes.SearchIndexClientBuilder;

String ENDPOINT = System.getenv("AZURE_SEARCH_ENDPOINT");
String INDEX_NAME = "my-index";

DefaultAzureCredential CREDENTIAL = new DefaultAzureCredentialBuilder().build();

// Sync SearchClient
SearchClient searchClient = new SearchClientBuilder()
    .endpoint(ENDPOINT)
    .credential(CREDENTIAL)
    .indexName(INDEX_NAME)
    .buildClient();

// Sync IndexClient
SearchIndexClient searchIndexClient = new SearchIndexClientBuilder()
    .endpoint(ENDPOINT)
    .credential(CREDENTIAL)
    .buildClient();

// Async SearchClient
SearchAsyncClient searchAsyncClient = new SearchClientBuilder()
    .endpoint(ENDPOINT)
    .credential(CREDENTIAL)
    .indexName(INDEX_NAME)
    .buildAsyncClient();

// Async IndexClient
SearchIndexAsyncClient searchIndexAsyncClient = new SearchIndexClientBuilder()
    .endpoint(ENDPOINT)
    .credential(CREDENTIAL)
    .buildAsyncClient();
```

#### [JavaScript](#tab/javascript)

For more information on `DefaultAzureCredential` for JavaScript, see [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme#defaultazurecredential).


```javascript
import { DefaultAzureCredential } from "@azure/identity";
import { SearchClient,
  SearchIndexClient } from "@azure/search-documents";

const AZURE_SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT;
const index = "my-index";

// To query and manipulate documents
const searchClient = new SearchClient(
  AZURE_SEARCH_ENDPOINT,
  index,
  new DefaultAzureCredential()
);

// To manage indexes and synonymmaps
const indexClient = new SearchIndexClient(
  AZURE_SEARCH_ENDPOINT, 
  new DefaultAzureCredential());
```

#### [Python](#tab/python)

For more information on `DefaultAzureCredential` for Python, see [Azure Identity client library for Python](/python/api/overview/azure/identity-readme#defaultazurecredential).

```python
from azure.search.documents import SearchClient
from azure.identity import DefaultAzureCredential, AzureAuthorityHosts

# Azure Public Cloud
audience = "https://search.windows.net"
authority = AzureAuthorityHosts.AZURE_PUBLIC_CLOUD

service_endpoint = os.environ["AZURE_SEARCH_ENDPOINT"]
index_name = os.environ["AZURE_SEARCH_INDEX_NAME"]
credential = DefaultAzureCredential(authority=authority)

search_client = SearchClient(
    endpoint=service_endpoint, 
    index=index_name, 
    credential=credential, 
    audience=audience)

search_index_client = SearchIndexClient(
    endpoint=service_endpoint, 
    credential=credential, 
    audience=audience)
```

---


## Local development

### Roles for local development

The example for local dev would be all the roles for doing everything "Search Service Contributor, Search Index Data Contributor, Search Index Data Reader".

### Authentication for local development

Use a tool in your local development environment to authentication to Azure. 

#### [.NET](#tab/csharp)

Select a tool for [authentication during local development](/dotnet/api/overview/azure/identity-readme#authenticate-the-client).

#### [Java](#tab/java)

Select a tool for [authentication during local development](/java/api/overview/azure/identity-readme#authenticate-the-client).

#### [JavaScript](#tab/javascript)

Select a tool for [authentication during local development](/javascript/api/overview/azure/identity-readme#authenticate-the-client-in-development-environment).

#### [Python](#tab/python)

Select a tool for [authentication during local development](/python/api/overview/azure/identity-readme#authenticate-during-local-development).

---

### Configure environment variables for local development

To connect to Azure AI Search, your code needs to know your resource endpoint. 

Create an environment variable for your Azure AI Search endpoint. This URL generally has the following format, `https://<YOUR-RESOURCE-NAME>.search.windows.net/`.

* `AZURE_SEARCH_ENDPOINT`: This URL is the access point for your Azure AI Search resource.

## Production workloads

### Roles for production workloads

for production would be "Search Index Data Reader" for query-only workloads.

### Authentication for production workloads

Use the following Azure AI Search **Bicep template** to create the resource and set the authentication for the `identityId`. Bicep requires the role ID. The `name` shown in this Bicep snippet isn't the Azure role; it's specific to the Bicep deployment. 

```bicep
// main.bicep
param environment string = 'production'
param roleGuid string = ''

module aiSearchRoleUser 'core/security/role.bicep' = {
    scope: aiSearchResourceGroup
    name: 'aiSearch-role-user'
    params: {
        principalId: (environment == 'development') ? principalId : userAssignedManagedIdentity.properties.principalId 
        principalType: (environment == 'development') ? 'User' : 'ServicePrincipal'
        roleDefinitionId: roleGuid
    }
}
```

The `main.bicep` file calls the following generic Bicep code to create any role. You have the option to create multiple RBAC roles, such as one for the user and another for production. This allows you to enable both development and production environments within the same Bicep deployment.

```bicep
// core/security/role.bicep
metadata description = 'Creates a role assignment for an identity.'
param principalId string // passed in from main.bicep

@allowed([
    'Device'
    'ForeignGroup'
    'Group'
    'ServicePrincipal'
    'User'
])
param principalType string = 'ServicePrincipal'
param roleDefinitionId string // Role ID

resource role 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
    name: guid(subscription().id, resourceGroup().id, principalId, roleDefinitionId)
    properties: {
        principalId: principalId
        principalType: principalType
        roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', roleDefinitionId)
    }
}
```

### Configure environment variables for production workloads

To connect to Azure AI Search, your code needs to know your resource endpoint, and the ID of the managed identity. 

1. Create an environment variable for your Azure AI Search endpoint. This URL generally has the following format, `https://<YOUR-RESOURCE-NAME>.search.windows.net/`.

    * `AZURE_SEARCH_ENDPOINT`: This URL is the access point for your Azure AI Search resource.
    
2. Create managed identity environment variable:

    | Identity| Description|
    |--|--|
    |User-assigned managed identity|Create an `AZURE_CLIENT_ID` environment variable containing the client ID of the user-assigned managed identity to authenticate as.|

## Additional resources

* [Passwordless connections developer guide](/azure/developer/intro/passwordless-overview)