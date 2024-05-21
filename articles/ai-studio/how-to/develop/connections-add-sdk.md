---
title: How to add a new connection in AI Studio using the Azure Machine Learning SDK
titleSuffix: Azure AI Studio
description: This article provides instructions on how to add connections to other resources using the Azure Machine Learning SDK.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: dantaylo
ms.author: larryfr
author: Blackmist
---

# Add a new connection using the Azure Machine Learning SDK

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

In this article, you learn how to add a new connection using the Azure Machine Learning SDK.

Connections are a way to authenticate and consume both Microsoft and other resources within your Azure AI Studio projects. For example, connections can be used for prompt flow, training data, and deployments. [Connections can be created](../../how-to/connections-add.md) exclusively for one project or shared with all projects in the same Azure AI Studio hub. For more information, see [Connections in Azure AI Studio](../../concepts/connections.md).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure AI Studio](https://azure.microsoft.com/free/) today.
- An Azure AI Studio hub. For information on creating a hub, see [Create AI Studio resources with the SDK](./create-hub-project-sdk.md).
- A resource to create a connection to. For example, an AI Services resource. The examples in this article use placeholders that you must replace with your own values when running the code.

## Set up your environment

[!INCLUDE [SDK setup](../../includes/development-environment-config.md)]

## Azure OpenAI Service

The following example creates an Azure OpenAI Service connection.

> [!TIP]
> To connect to Azure OpenAI and more AI services with one connection, you can use the [AI services connection](#azure-ai-services) instead.

```python
from azure.ai.ml.entities import Connection, AzureOpenAIConnection, ApiKeyConfiguration
from azure.ai.ml.entities import UsernamePasswordConfiguration

name = "XXXXXXXXX"

target = "https://XXXXXXXXX.cognitiveservices.azure"
api_key= "my-key"
resource_id= "Azure-resource-id"

wps_connection = AzureOpenAIConnection(
    name=name,
    endpoint=target,
    credentials=ApiKeyConfiguration(key=api_key),
    resource_id = resource_id,
    is_shared=False
)
ml_client.connections.create_or_update(wps_connection)
```

## Azure AI services

The following example creates an Azure AI services connection. This example creates one connection for the AI services documented in the [Connect to Azure AI services](../../ai-services/connect-ai-services.md) article. The same connection also supports the Azure OpenAI service.

```python
from azure.ai.ml.entities import AzureAIServicesConnection, ApiKeyConfiguration
from azure.ai.ml.entities import UsernamePasswordConfiguration

name = "my-ai-services"

target = "https://XXXXXXXXX.cognitiveservices.azure.com/"
resource_id=""
api_key="XXXXXXXXX"

wps_connection = AzureAIServicesConnection(
    name=name,
    endpoint=target,
    credentials=ApiKeyConfiguration(key=api_key),
    ai_services_resource_id=resource_id,
)
ml_client.connections.create_or_update(wps_connection)
```

## Azure AI Search (preview)

The following example creates an Azure AI Search connection:

```python
from azure.ai.ml.entities import AzureAISearchConnection, ApiKeyConfiguration
from azure.ai.ml.entities import UsernamePasswordConfiguration

name = "my_aisearch_demo_connection"

target = "https://XXXXXXXXX.search.windows.net"
api_key="XXXXXXXXX"
wps_connection = AzureAISearchConnection(
    name=name,
    endpoint=target,
    credentials=ApiKeyConfiguration(key=api_key),
)
ml_client.connections.create_or_update(wps_connection)
```

## Azure AI Content Safety (preview)

The following example creates an Azure AI Content Safety connection:

```python
from azure.ai.ml.entities import AzureContentSafetyConnection, ApiKeyConfiguration
from azure.ai.ml.entities import UsernamePasswordConfiguration

name = "my_content_safety"

target = "https://XXXXXXXXX.cognitiveservices.azure.com/"
api_key = "XXXXXXXXX"

wps_connection = AzureContentSafetyConnection(
    name=name,
    endpoint=target,
    credentials=ApiKeyConfiguration(key=api_key),
    #api_version="1234"
)
ml_client.connections.create_or_update(wps_connection)
```

## Serverless model (preview)

The following example creates a serverless endpoint connection:

```python
from azure.ai.ml.entities import ServerlessConnection

name = "my_maas_apk"

endpoint = "https://XXXXXXXXX.eastus2.inference.ai.azure.com"
api_key = "XXXXXXXXX"
wps_connection = ServerlessConnection(
    name=name,
    endpoint=endpoint,
    api_key=api_key,

)
ml_client.connections.create_or_update(wps_connection)
```

## Azure Blob Storage (preview)

The following example creates an Azure Blob Storage connection. This connection is authenticated with an account key or a SAS token:

```python
from azure.ai.ml.entities import AzureBlobStoreConnection, SasTokenConfiguration,AccountKeyConfiguration
from azure.ai.ml.entities import UsernamePasswordConfiguration


name = "my_blobstore"
url = "https://XXXXXXXXX.blob.core.windows.net/mycontainer/"

wps_connection = AzureBlobStoreConnection(
    name=name,
    container_name="XXXXXXXXX",
    account_name="XXXXXXXXX",
    url=url,
    #credentials=None
    credentials=SasTokenConfiguration(sas_token="XXXXXXXXX")
    #credentials=AccountKeyConfiguration(account_key="XXXXXXXXX")
)
ml_client.connections.create_or_update(wps_connection)
```

## Azure Data Lake Storage Gen 2 (preview)

The following example creates Azure Data Lake Storage Gen 2 connection. This connection is authenticated with a Service Principal:

```python
from azure.ai.ml.entities import WorkspaceConnection
from azure.ai.ml.entities import UsernamePasswordConfiguration, ServicePrincipalConfiguration

sp_config = ServicePrincipalConfiguration(
    tenant_id="XXXXXXXXXXXX",
    client_id="XXXXXXXXXXXXX",
    client_secret="XXXXXXXXXXXXXXXk" # your-client-secret
    
)
name = "myadlsgen2"

target = "https://ambadaladlsgen2.core.windows.net/dummycont"

wps_connection = WorkspaceConnection(
    name=name,
    type="azure_data_lake_gen2",
    target=target,
    credentials=None
    
)
ml_client.connections.create_or_update(workspace_connection=wps_connection)
```

## Microsoft OneLake (preview)

The following example creates a Microsoft OneLake connection. This connection is authenticated with a Service Principal:

```python
from azure.ai.ml.entities import MicrosoftOneLakeWorkspaceConnection, OneLakeArtifact
from azure.ai.ml.entities import ServicePrincipalConfiguration

sp_config = ServicePrincipalConfiguration(
    tenant_id="XXXXXXXXXXX",
    client_id="XXXXXXXXXXXXXXXXXX",
    client_secret="XXXXXXXXXXXXXXXX" # your-client-secret
)
name = "my_onelake_sp"

artifact = OneLakeArtifact(
    name="XXXXXXXXX",
    type="lake_house"
   
)

wps_connection = MicrosoftOneLakeWorkspaceConnection(
    name=name,
    artifact=artifact,
    one_lake_workspace_name="XXXXXXXXXXXXXXXXX",
    endpoint="XXXXXXXXX.dfs.fabric.microsoft.com"
    credentials=sp_config
    
)
ml_client.connections.create_or_update(workspace_connection=wps_connection)
```

## Serp

The following example creates a Serp connection:

```python
from azure.ai.ml.entities import SerpConnection

name = "my_serp_apk"
api_key = "XXXXXXXXX"

wps_connection = SerpConnection(
    name=name,
    api_key=api_key,
)
ml_client.connections.create_or_update(wps_connection)
```

## OpenAI

The following example creates an OpenAI (not Azure OpenAI) connection:

```python
from azure.ai.ml.entities import OpenAIConnection

name = "my_oai_apk"
api_key = "XXXXXXXX

wps_connection = OpenAIConnection(
    name=name,
    api_key=api_key,
)
ml_client.connections.create_or_update(wps_connection)
```

## Custom

The following example creates custom connection:

```python
from azure.ai.ml.entities import WorkspaceConnection
from azure.ai.ml.entities import UsernamePasswordConfiguration, ApiKeyConfiguration


name = "my_custom"

target = "https://XXXXXXXXX.core.windows.net/mycontainer"

wps_connection = WorkspaceConnection(
    name=name,
    type="custom",
    target=target,
    credentials=ApiKeyConfiguration(key="XXXXXXXXX"),    
)
ml_client.connections.create_or_update(workspace_connection=wps_connection)
```

## List connections

To list all connections, use the following example:

```python
from azure.ai.ml.entities import Connection, AzureOpenAIConnection, ApiKeyConfiguration
connection_list = ml_client.connections.list()
for conn in connection_list:
  print(conn)
```

## Delete connections

To delete a connection, use the following example:

```python
name = "my-connection"

ml_client.connections.delete(name)
```

## Related content

- [Get started building a chat app using the prompt flow SDK](../../quickstarts/get-started-code.md)
- [Work with projects in VS Code](vscode.md)
- [Connections in Azure AI Studio](../../concepts/connections.md)
