---
title: Consume deployed serverless API endpoints from a different workspace
titleSuffix: Azure Machine Learning
description: Learn about to consume deployed serverless API endpoints from a different workspace
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.date: 05/09/2024
ms.reviewer: mopeakande
reviewer: msakande
ms.author: fasantia
author: santiagxf
---

# Consume deployed serverless API endpoints from a different workspace

Certain models in the model catalog can be deployed as a serverless API endpoint with pay-as-you-go, providing a way to consume them as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.

On some cases, you want to centralize your deployments on a given workspace and consume them from different workspaces on your organization. On another situations, you may need to deploy models on a workspace on a given region and consume it from a workspace on another region. Some models supporting serverless API endpoint deployment are only available on specific Azure regions.

In this example, you learn how to configure an existing serverless API endpoint on a new workspace.

## Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.

- An [Azure Machine Learning workspace](quickstart-create-resources.md) where you want to consume the existing deployment.

- A model [deployed to a serverless API endpoint](how-to-deploy-models-serverless.md). In this example, we assumed you deployed **Meta-Llama-3-8B-Instruct**.

- You need to install the following software to work with Azure Machine Learning:

    # [Studio](#tab/azure-studio)

    You can use any compatible web browser to navigate [Azure Machine Learning](https://ml.azure.com).

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

    Go to [Azure Machine Learning Studio](https://ml.azure.com) and follow these steps and navigate to the workspace where the endpoint you want to connect to is deployed.

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

1. Get the endpoints URL and credentials for the endpoint you want to connect to. In this example, we get the details for an endpoint name **meta-llama3-8b-qwerty**.

    # [Studio](#tab/azure-studio)

    1. Go to **Endpoints** and select **Serverless**.

    1. Locate the endpoint you want to connect to and select it.

    1. On the **Details** tab, copy the URL on **Target** and the value for **Key**.

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

1. Connect now to the workspace where you need to create the connection and consume the endpoint.

1. Create the connection in the workspace:

    # [Studio](#tab/azure-studio)

    Go to [Azure Machine Learning Studio](https://ml.azure.com) and follow these steps:

    1. Navigate to the workspace where the connection needs to be created to.

    1. Go to **Manage** section in the left navigation bar and select **Connections**.

    1. Select **Create**.

    1. Select **Serverless Model**.

    1. On **Target URI**, paste the value you copied on the previous section.

    1. On **Key**, paste the value you copied on the previous section.

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

1. To validate the connection is working:

    1. On the **Authoring** section on the navigation bar, select **Prompt flow**.

    1. Select **Create** and then select **Chat**.

    1. Give your *Prompt flow* a name and select **Create**.

    1. On the **chat** node, select the option **Connection** and select the connection you just created, in this case **meta-llama3-8b-connection**.

    1. On the top navigation bar, select **Start compute session** to start a **Prompt flow** automatic runtime.

    1. Select the **Chat** option. You should be able to send messages and get responses.