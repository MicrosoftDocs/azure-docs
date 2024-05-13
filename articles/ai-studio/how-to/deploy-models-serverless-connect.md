---
title: Consume deployed serverless API endpoints from a different project or hub
titleSuffix: Azure AI Studio
description: Learn how to consume deployed serverless API endpoints from a different project or hub.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/21/2024
ms.author: mopeakande 
author: msakande
ms.reviewer: fasantia
reviewer: santiagxf
ms.custom: 
 - build-2024
 - serverless
---

# Consume serverless API endpoints from a different Azure AI Studio project or hub

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this article, you learn how to configure an existing serverless API endpoint in a different project or hub than the one that was used to create the deployment.

[Certain models in the model catalog](deploy-models-serverless-availability.md) can be deployed as serverless APIs. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

The need to consume a serverless API endpoint in a different project or hub than the one that was used to create the deployment might arise in situations such as these:

- You want to centralize your deployments in a given project or hub and consume them from different projects or hubs in your organization.
- You need to deploy a model in a hub in a particular Azure region where serverless deployment for that model is available. However, you need to consume it from another region, where serverless deployment isn't available for the particular models.

## Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.

- An [Azure AI Studio hub](create-azure-ai-resource.md).

- An [Azure AI Studio project](create-projects.md).

- A model [deployed to a serverless API endpoint](deploy-models-serverless.md). This article assumes that you previously deployed the **Meta-Llama-3-8B-Instruct** model. To learn how to deploy this model as a serverless API, see [Deploy models as serverless APIs](deploy-models-serverless.md).

- You need to install the following software to work with Azure AI Studio:

    # [AI Studio](#tab/azure-ai-studio)

    You can use any compatible web browser to navigate [Azure AI Studio](https://ai.azure.com).

    # [Azure CLI](#tab/cli)

    The [Azure CLI](/cli/azure/) and the [ml extension for Azure Machine Learning](../../machine-learning/how-to-configure-cli.md).

    ```azurecli
    az extension add -n ml
    ```

    If you already have the extension installed, ensure the latest version is installed.

    ```azurecli
    az extension update -n ml
    ```

    Once the extension is installed, configure it:

    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<project-name> group=<resource-group> location=<location>
    ```

    # [Python SDK](#tab/python)

    Install the [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).

    ```python
    pip install -U azure-ai-ml
    ```

    Once installed, import necessary namespaces:

    ```python
    from azure.ai.ml import MLClient
    from azure.identity import InteractiveBrowserCredential
    from azure.ai.ml.entities import ServerlessEndpoint, ServerlessConnection
    ```

## Create a serverless API endpoint connection

Follow these steps to create a connection:

1. Connect to the project or hub where the endpoint is deployed:

    # [AI Studio](#tab/azure-ai-studio)

    Go to [Azure AI Studio](https://ai.azure.com) and navigate to the project where the endpoint you want to connect to is deployed.

    # [Azure CLI](#tab/cli)

    Configure the CLI to point to the project:

    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<project-name> group=<resource-group> location=<location>
    ```

    # [Python SDK](#tab/python)

    Create a client connected to your project:

    ```python
    client = MLClient(
        credential=InteractiveBrowserCredential(tenant_id="<tenant-id>"),
        subscription_id="<subscription-id>",
        resource_group_name="<resource-group>",
        workspace_name="<project-name>",
    )
    ```

1. Get the endpoint's URL and credentials for the endpoint you want to connect to. In this example, you get the details for an endpoint name **meta-llama3-8b-qwerty**.

    # [AI Studio](#tab/azure-ai-studio)

    1. From the left sidebar of your project in AI Studio, go to **Components** > **Deployments** to see the list of deployments in the project.

    1. Select the deployment you want to connect to.

    1. Copy the values for **Target URI** and **Key**.

    # [Azure CLI](#tab/cli)

    ```azurecli
    az ml serverless-endpoint get-credentials -n meta-llama3-8b-qwerty
    ```

    # [Python SDK](#tab/python)

    ```python
    endpoint_name = "meta-llama3-8b-qwerty"
    endpoint_keys = client.serverless_endpoints.get_keys(endpoint_name)
    print(endpoint_keys.primary_key)
    print(endpoint_keys.secondary_key)
    ```

1. Now, connect to the project or hub **where you want to create the connection**:

    # [AI Studio](#tab/azure-ai-studio)

    Go to the project where the connection needs to be created to.

    # [Azure CLI](#tab/cli)

    Configure the CLI to point to the project:

    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<project-name> group=<resource-group> location=<location>
    ```

    # [Python SDK](#tab/python)

    Create a client connected to your project:

    ```python
    client = MLClient(
        credential=InteractiveBrowserCredential(tenant_id="<tenant-id>"),
        subscription_id="<subscription-id>",
        resource_group_name="<resource-group>",
        workspace_name="<project-name>",
    )
    ```

1. Create the connection in the project:

    # [AI Studio](#tab/azure-ai-studio)

    1. From the left sidebar of your project in AI Studio, select **Settings**.

    1. In the **Connected resources** section, select **New connection**.

    1. Select **Serverless Model**.

    1. For the **Target URI**, paste the value you copied previously.

    1. For the **Key**, paste the value you copied previously.

    1. Give the connection a name, in this case **meta-llama3-8b-connection**.

    1. Select **Add connection**.

    # [Azure CLI](#tab/cli)

    Create a connection definition:

    __connection.yml__
    
    ```yml
    name: meta-llama3-8b-connection
    type: serverless
    endpoint: https://meta-llama3-8b-qwerty-serverless.inference.ai.azure.com
    api_key: 1234567890qwertyuiop
    ```

    ```azurecli
    az ml connection create -f connection.yml
    ```

    # [Python SDK](#tab/python)

    ```python
    client.connections.create(ServerlessConnection(
        name="meta-llama3-8b-connection",
        endpoint="https://meta-llama3-8b-qwerty-serverless.inference.ai.azure.com",
        api_key="1234567890qwertyuiop"
    ))
    ```

1. At this point, the connection is available for consumption.

1. To validate that the connection is working:

    1. From the left sidebar of your project in AI Studio, go to **Tools** > **Prompt flow**.

    1. Select **Create** to create a new flow.

    1. Select **Create** in the **Chat flow** box.

    1. Give your *Prompt flow* a name and select **Create**.

    1. Select the **chat** node from the graph to go to the _chat_ section.

    1. For **Connection**, open the dropdown list to select the connection you just created, in this case **meta-llama3-8b-connection**.

    1. Select **Start compute session** from the top navigation bar, to start a prompt flow automatic runtime.

    1. Select the **Chat** option. You can now send messages and get responses.


## Related content

- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Azure AI FAQ article](../faq.yml)