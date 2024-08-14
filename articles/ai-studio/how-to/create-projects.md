---
title: Create an Azure AI Studio project in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article describes how to create an Azure AI Studio project from an Azure AI Studio hub that was previously created.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: deeikele
ms.author: sgilley
author: sdgilley
# customer intent: As a developer, I want to create an Azure AI Studio project so I can work with generative AI.
---

# Create a project in Azure AI Studio

This article describes how to create an Azure AI Studio project. A project is used to organize your work and save state while building customized AI apps. 

Projects are hosted by an Azure AI Studio hub that provides enterprise-grade security and a collaborative environment. For more information about the projects and resources model, see [Azure AI Studio hubs](../concepts/ai-resources.md).

## Create a project

Use the following tabs to select the method you plan to use to create a project:

# [Azure AI Studio](#tab/ai-studio)

[!INCLUDE [Create Azure AI Studio project](../includes/create-projects.md)]

# [Python SDK](#tab/python)

[!INCLUDE [SDK setup](../includes/development-environment-config.md)]

8. Use the following code to create a project from a hub you or your administrator created previously. Replace example string values with your own values:

    ```Python
    from azure.ai.ml.entities import Project

    my_project_name = "myexampleproject"
    my_location = "East US"
    my_display_name = "My Example Project"
    hub_id = "" # Azure resource manager ID of the hub

    my_project = Project(name=my_hub_name, 
                    location=my_location,
                    display_name=my_display_name,
                    hub_id=created_hub.id)

    created_project = ml_client.workspaces.begin_create(workspace=my_hub).result() 
    ```

# [Azure CLI](#tab/azurecli)

1. If you don't have the Azure CLI and machine learning extension installed, follow the steps in the [Install and set up the machine learning extension](/azure/machine-learning/how-to-configure-cli) article.

1. To authenticate to your Azure subscription from the Azure CLI, use the following command:

    ```azurecli
    az login
    ```

    For more information on authenticating, see [Authentication methods](/cli/azure/authenticate-azure-cli).

1. Once the extension is installed and authenticated to your Azure subscription, use the following command to create a new Azure AI Studio project from an existing Azure AI Studio hub:

    ```azurecli
    az ml workspace create --kind project --hub-id {my_hub_ARM_ID} --resource-group {my_resource_group} --name {my_project_name}
    ```

---

## Project settings

# [Azure AI Studio](#tab/ai-studio)

On the project **Settings** page you can find information about the project, such as the project name, description, and the hub that hosts the project. You can also find the project ID, which is used to identify the project via SDK or API.

:::image type="content" source="../media/how-to/projects/project-settings.png" alt-text="Screenshot of an AI Studio project settings page." lightbox = "../media/how-to/projects/project-settings.png":::

- Name: The name of the project corresponds to the selected project in the left panel. 
- Hub: The hub that hosts the project. 
- Location: The location of the hub that hosts the project. For supported locations, see [Azure AI Studio regions](../reference/region-support.md).
- Subscription: The subscription that hosts the hub that hosts the project.
- Resource group: The resource group that hosts the hub that hosts the project.

Select **Manage in the Azure portal** to navigate to the project resources in the Azure portal.

# [Python SDK](#tab/python)

To manage or use the new project, include it in the `MLClient`:

```python
ml_client = MLClient(workspace_name=my_project_name, resource_group_name=my_resource_group, subscription_id=my_subscription_id,credential=DefaultAzureCredential())
```

# [Azure CLI](#tab/azurecli)

To view settings for the project, use the `az ml workspace show` command. For example:

```azurecli
az ml workspace show --name {my_project_name} --resource-group {my_resource_group}
```

---

## Project resource access

Common configurations on the hub are shared with your project, including connections, compute instances, and network access, so you can start developing right away.

In addition, a number of resources are only accessible by users in your project workspace:

1. Components including datasets, flows, indexes, deployed model API endpoints (open and serverless).
1. Connections created by you under 'project settings'.
1. Azure Storage blob containers, and a fileshare for data upload within your project. Access storage using the following connections:
   
   | Data connection | Storage location | Purpose |
   | --- | --- | --- |
   | workspaceblobstore | {project-GUID}-blobstore | Default container for data upload |
   | workspaceartifactstore | {project-GUID}-blobstore | Stores components and metadata for your project such as model weights |
   | workspacefilestore | {project-GUID}-code | Hosts files created on your compute and using prompt flow |

> [!NOTE]
> Storage connections are not created directly with the project when your storage account has public network access set to disabled. These are created instead when a first user accesses AI studio over a private network connection. [Troubleshoot storage connections](troubleshoot-secure-connection-project.md#troubleshoot-missing-storage-connections)


## Next steps

- [Deploy an enterprise chat web app](../tutorials/deploy-chat-web-app.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about hubs](../concepts/ai-resources.md)
