---
title: Use keyless connections with Azure AI Search
description: Use keyless connections with an Azure Identity library for authentication and authorization with Azure AI Search.
ms.topic: how-to
ms.date: 06/05/2024
author: HeidiSteen
ms.author: heidist
ms.reviewer: scaddie
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python, Keyless-dotnet, Keyless-java, Keyless-js, Keyless-python, build-2024-intelligent-apps
#customer intent: As a developer, I want to use keyless connections so that I don't leak secrets.
---

# Use Azure AI Search without keys 

In your application code, you can set up a keyless connection to Azure AI Search that uses Microsoft Entra ID and roles for authentication and authorization. Application requests to most Azure services must be authenticated with keys or keyless connections. Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate to the service. Keyless authentication offers improved management and security benefits over the account key because there's no key (or connection string) to store.

Keyless connections are enabled with the following steps: 

* Configure your authentication.
* Set environment variables, as needed. 
* Use an Azure Identity library credential type to create an Azure AI Search client object.

## Prerequisites

The following steps need to be completed for both local development and production workloads:

* [Create an AI Search resource](#create-an-ai-search-resource)
* [Enable role-based access on your search service](search-security-enable-roles.md)
* [Install Azure Identity client library](#install-azure-identity-client-library)

### Create an AI Search resource

Before continuing with this article, you need an Azure AI Search resource to work with. If you don't have a resource, [create your resource](search-create-service-portal.md) now. [Enable role-based access control (RBAC)](search-security-enable-roles.md) for the resource.

### Install Azure Identity client library

Before working locally without keyless, update your AI Search enabled code with the Azure Identity client library.

#### [.NET](#tab/csharp)

Install the [Azure Identity client library for .NET](https://www.nuget.org/packages/Azure.Identity):

```dotnetcli
dotnet add package Azure.Identity
```

#### [Java](#tab/java)

Install the [Azure Identity client library for Java](https://mvnrepository.com/artifact/com.azure/azure-identity) with the following POM file:

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

Install the [Azure Identity client library for JavaScript](https://www.npmjs.com/package/@azure/identity):

```console
npm install --save @azure/identity
```

#### [Python](#tab/python)

Install the [Azure Identity client library for Python](https://pypi.org/project/azure-identity/):

```console
pip install azure-identity
```

---

## Update source code to use DefaultAzureCredential

The Azure Identity library's `DefaultAzureCredential` allows you to run the same code in the local development environment and in the Azure cloud. Create a single credential and reuse the credential instance as needed to take advantage of token caching.

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

DefaultAzureCredential credential = new();
SearchClient searchClient = new(new Uri(endpoint), indexName, credential);
SearchIndexClient searchIndexClient = new(endpoint, credential);
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

DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

// Sync SearchClient
SearchClient searchClient = new SearchClientBuilder()
    .endpoint(ENDPOINT)
    .credential(credential)
    .indexName(INDEX_NAME)
    .buildClient();

// Sync IndexClient
SearchIndexClient searchIndexClient = new SearchIndexClientBuilder()
    .endpoint(ENDPOINT)
    .credential(credential)
    .buildClient();

// Async SearchClient
SearchAsyncClient searchAsyncClient = new SearchClientBuilder()
    .endpoint(ENDPOINT)
    .credential(credential)
    .indexName(INDEX_NAME)
    .buildAsyncClient();

// Async IndexClient
SearchIndexAsyncClient searchIndexAsyncClient = new SearchIndexClientBuilder()
    .endpoint(ENDPOINT)
    .credential(credential)
    .buildAsyncClient();
```

#### [JavaScript](#tab/javascript)

For more information on `DefaultAzureCredential` for JavaScript, see [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme#defaultazurecredential).


```javascript
import { DefaultAzureCredential } from "@azure/identity";
import {
  SearchClient,
  SearchIndexClient
} from "@azure/search-documents";

const AZURE_SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT;
const index = "my-index";
const credential = new DefaultAzureCredential();

// To query and manipulate documents
const searchClient = new SearchClient(
  AZURE_SEARCH_ENDPOINT,
  index,
  credential
);

// To manage indexes and synonymmaps
const indexClient = new SearchIndexClient(
  AZURE_SEARCH_ENDPOINT, 
  credential
);
```

#### [Python](#tab/python)

For more information on `DefaultAzureCredential` for Python, see [Azure Identity client library for Python](/python/api/overview/azure/identity-readme#defaultazurecredential).

```python
import os
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

Local development without keyless includes these steps:

- Assign your personal identity with RBAC roles on the specific resource.
- Use a tool to authenticate with Azure.
- Establish environment variables for your resource.

### Roles for local development

As a local developer, your Azure identity needs full control of your service. This control is provided with RBAC roles. To manage your resource during development, these are the suggested roles:

- Search Service Contributor
- Search Index Data Contributor
- Search Index Data Reader

Find your personal identity with one of the following tools. Use that identity as the `<identity-id>` value.

#### [Azure CLI](#tab/azure-cli)

1. Sign in to Azure CLI.

    ```azurecli
    az login
    ```

2. Get your personal identity.

    ```azurecli
    az ad signed-in-user show \
        --query id -o tsv
    ```

3. Assign the role-based access control (RBAC) role to the identity for the resource group.  

    ```azurecli
    az role assignment create \
        --role "<role-name>" \
        --assignee "<identity-id>" \
        --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
    ```
    
#### [Azure PowerShell](#tab/azure-powershell)

1. Sign in with PowerShell.

    ```azurepowershell
    Connect-AzAccount
    ```

2. Get your personal identity.

    ```azurepowershell
    (Get-AzContext).Account.ExtendedProperties.HomeAccountId.Split('.')[0]
    ```

3. Assign the role-based access control (RBAC) role to the identity for the resource group.  

    ```azurepowershell
    New-AzRoleAssignment -ObjectId "<identity-id>" -RoleDefinitionName "<role-name>" -Scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
    ```

#### [Azure portal](#tab/portal)

1. Use the steps found here: [find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id) in the Azure portal.
    
2. Use the steps found at [open the Add role assignment page](search-security-rbac.md) in the Azure portal.
    
---
    
Where applicable, replace `<identity-id>`, `<subscription-id>`, and `<resource-group-name>` with your actual values. 


### Authentication for local development

Use a tool in your local development environment to authentication to Azure identity. Once you're authenticated, the `DefaultAzureCredential` instance in your source code finds and uses the authentication.  

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

Create an environment variable named `AZURE_SEARCH_ENDPOINT` for your Azure AI Search endpoint. This URL generally has the format `https://<YOUR-RESOURCE-NAME>.search.windows.net/`.

## Production workloads

Deploy production workloads includes these steps:

- Choose RBAC roles that adhere to the principle of least privilege.
- Assign RBAC roles to your production identity on the specific resource.
- Set up environment variables for your resource.

### Roles for production workloads

To create your production resources, you need to create a [user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) then assign that identity to your resources with the correct roles. 

The following role is suggested for a production application:

|Role name|Id|
|--|--|
|Search Index Data Reader|1407120a-92aa-4202-b7e9-c0e197c71c8f|

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

Create environment variables for your deployed and keyless Azure AI Search resource:

- `AZURE_SEARCH_ENDPOINT`: This URL is the access point for your Azure AI Search resource. This URL generally has the format `https://<YOUR-RESOURCE-NAME>.search.windows.net/`.   
- `AZURE_CLIENT_ID`: This is the identity to authenticate as.

## Related content

* [Keyless connections developer guide](/azure/developer/intro/passwordless-overview)
* [Azure built-in roles](/azure/role-based-access-control/built-in-roles)
* [Set environment variables](/azure/ai-services/cognitive-services-environment-variables)