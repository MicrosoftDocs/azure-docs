---
title: Consume deployed serverless API endpoints from a different workspace
titleSuffix: Azure Machine Learning
description: Learn how to consume a serverless API endpoint from a different workspace than the one where it was deployed. 
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 05/09/2024
ms.reviewer: mopeakande
reviewer: msakande
ms.author: fasantia
author: santiagxf
ms.custom: 
 - build-2024
 - serverless
---

# Consume serverless API endpoints from a different workspace

In this article, you learn how to configure an existing serverless API endpoint in a different workspace than the one where it was deployed.

Certain models in the model catalog can be deployed as serverless APIs. This kind of deployment provides a way to consume models as an API without hosting them on your subscription, while keeping the enterprise security and compliance that organizations need. This deployment option doesn't require quota from your subscription.

The need to consume a serverless API endpoint in a different workspace than the one that was used to create the deployment might arise in situations such as these:

- You want to centralize your deployments in a given workspace and consume them from different workspaces in your organization.
- You need to deploy a model in a workspace in a particular Azure region where serverless deployment for that model is available. However, you need to consume it from another region, where serverless deployment isn't available for the particular models.

## Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.

- An [Azure Machine Learning workspace](quickstart-create-resources.md) where you want to consume the existing deployment.

- A model [deployed to a serverless API endpoint](how-to-deploy-models-serverless.md). This article assumes that you previously deployed the **Meta-Llama-3-8B-Instruct** model. To learn how to deploy this model as a serverless API, see [Deploy models as serverless APIs](how-to-deploy-models-serverless.md).

- You need to install the following software to work with Azure Machine Learning:

    # [Studio](#tab/azure-studio)

    You can use any compatible web browser to navigate [Azure Machine Learning studio](https://ml.azure.com).

    # [Azure CLI](#tab/cli)

    The [Azure CLI](/cli/azure/) and the [ml extension for Azure Machine Learning](how-to-configure-cli.md).

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
    az configure --defaults workspace=<workspace-name> group=<resource-group> location=<location>
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

1. Connect to the workspace where the endpoint is deployed:

    # [Studio](#tab/azure-studio)

    Go to [Azure Machine Learning studio](https://ml.azure.com) and navigate to the workspace where the endpoint you want to connect to is deployed.

    # [Azure CLI](#tab/cli)

    Configure the CLI to point to the workspace:

    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<workspace-name> group=<resource-group> location=<location>
    ```

    # [Python SDK](#tab/python)

    Create a client connected to your workspace:

    ```python
    client = MLClient(
        credential=InteractiveBrowserCredential(tenant_id="<tenant-id>"),
        subscription_id="<subscription-id>",
        resource_group_name="<resource-group>",
        workspace_name="<workspace-name>",
    )
    ```

1. Get the endpoint's URL and credentials for the endpoint you want to connect to. In this example, you get the details for an endpoint name **meta-llama3-8b-qwerty**.

    # [Studio](#tab/azure-studio)

    1. Select **Endpoints** from the left sidebar.

    1. Select the **Serverless endpoints** tab to display the serverless API endpoints.

    1. Select the endpoint you want to connect to.

    1. On the endpoint's **Details** tab, copy the values for **Target URI** and **Key**.

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

1. Now, connect to the workspace *where you want to create the connection and consume the endpoint*.

1. Create the connection in the workspace:

    # [Studio](#tab/azure-studio)

    1. Go to the workspace where the connection needs to be created to.

    1. Go to the **Manage** section in the left navigation bar and select **Connections**.

    1. Select **Create**.

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

    1. From the left navigation bar of Azure Machine Learning studio, go to **Authoring** > **Prompt flow**.

    1. Select **Create** to create a new flow.

    1. Select **Create** in the **Chat flow** box.

    1. Give your *Prompt flow* a name and select **Create**.

    1. Select the **chat** node from the graph to go to the _chat_ section.

    1. For **Connection**, open the dropdown list to select the connection you just created, in this case **meta-llama3-8b-connection**.

    1. Select **Start compute session** from the top navigation bar, to start a prompt flow automatic runtime.

    1. Select the **Chat** option. You can now send messages and get responses.   

## Related content

- [Model Catalog and Collections](concept-model-catalog.md)
- [Deploy models as serverless API endpoints](how-to-deploy-models-serverless.md)