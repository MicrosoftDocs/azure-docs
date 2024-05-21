---
title: How to create a hub and project using the Azure Machine Learning SDK
titleSuffix: Azure AI Studio
description: This article provides instructions on how to create an AI Studio hub and project using the Azure Machine Learning SDK.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: dantaylo
ms.author: eur
author: eric-urban
---

# Create a hub and project using the Azure Machine Learning SDK

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

In this article, you learn how to create the following AI Studio resources using the Azure Machine Learning SDK:
- An Azure AI Studio hub
- An Azure AI Services connection
- An Azure AI Studio project

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure AI Studio](https://azure.microsoft.com/free/) today.

## Set up your environment

[!INCLUDE [SDK setup](../../includes/development-environment-config.md)]

## Create the AI Studio hub and AI Services connection

Use the following code to create a new hub and AI Services connection. Replace example string values with your own values:

```Python
from azure.ai.ml.entities import Hub
from azure.ai.ml.entities import AzureAIServicesConnection

my_hub_name = "myexamplehub"
my_location = "East US"
my_display_name = "My Example Hub"

# construct a basic hub
my_hub = Hub(name=my_hub_name, 
            location=my_location,
            display_name=my_display_name)

created_hub = ml_client.workspaces.begin_create(my_hub).result()

# constrict an AI Services connection
my_connection_name = "myaiservivce"
my_endpoint = "demo.endpoint" # this could also be called target
my_api_keys = None # leave blank for Authentication type = AAD
my_ai_services_resource_id = "" # ARM id required

my_connection = AIServicesConnection(name=my_connection_name,
                                    endpoint=my_endpoint, 
                                    api_key= my_api_keys,
                                    ai_services_resource_id=my_ai_services_resource_id)

ml_client.connections.create_or_update(my_connection)
```

## Create AI Studio project

Use the following code to create a project from the hub you created previously. Replace example string values with your own values:

```Python
from azure.ai.ml.entities import Project

my_project_name = "myexampleproject"
my_location = "East US"
my_display_name = "My Example Project"

my_hub = Project(name=my_hub_name, 
                location=my_location,
                display_name=my_display_name,
                hub_id=created_hub.id)

created_project = ml_client.workspaces.begin_create(workspace=my_hub).result() 
```

## Update the MLClient

To use the new project, include it in the `MLClient`.

```python
ml_client = MLClient(workspace_name=my_project_name, resource_group_name=my_resource_group, subscription_id=my_subscription_id,credential=DefaultAzureCredential())
```

## Related content

- [Get started building a chat app using the prompt flow SDK](../../quickstarts/get-started-code.md)
- [Work with projects in VS Code](vscode.md)
- [Configure a managed network](../configure-managed-network.md?tabs=python)
