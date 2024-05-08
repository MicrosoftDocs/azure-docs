---
title: Consume deployed serverless API endpoints from a different project or hub
titleSuffix: Azure Machine Learning
description: Learn about to consume deployed serverless API endpoints from a different project or hub
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: conceptual
ms.date: 05/03/2024
ms.reviewer: msakande 
reviewer: msakande
ms.author: fasantia
author: santiagxf
---

# Consume deployed serverless API endpoints from a different project or hub

Certain models in the model catalog can be deployed as a serverless API endpoint with pay-as-you-go, providing a way to consume them as an API without hosting them on your subscription, while keeping the enterprise security and compliance organizations need. This deployment option doesn't require quota from your subscription.

On some cases, you want to centralize your deployments on a given project or hub and consume them from different projects or hubs on your organization. On another situations, you may need to deploy models on a hub on a given region and consume it from another region. Some models supporting serverless API endpoint deployment are only available on specific Azure regions.

In this example, we will learn how to configured an existing serverless API endpoint on a new project or hub.

## Prerequisites

- An Azure subscription with a valid payment method. Free or trial Azure subscriptions won't work. If you don't have an Azure subscription, create a [paid Azure account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go) to begin.

- An [Azure AI Studio hub](create-azure-ai-resource.md).

- An [Azure AI Studio project](create-projects.md).

- A model [deployed to a serverless API endpoint](deploy-models-serverless.md). In this example we assumed you have deployed **Meta-Llama-3-8B-Instruct**.

- You need to install the following software to work with Azure Machine Learning:

    # [Portal](#tab/portal)

    You can use any compatible web browser to navigate [Azure Machine Learning](https://ai.azure.com).

    # [CLI](#tab/cli)

    The [Azure CLI](https://learn.microsoft.com/cli/azure/) and the [ml extension for Azure Machine Learning](how-to-configure-cli.md).

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

    # [Python](#tab/sdk)

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

Follow this steps to create a connection:

1. Connect to the project or hub where the endpoint is deployed:

    # [Portal](#tab/portal)

    Go to [Azure AI Studio](https://ai.azure.com) and follow these steps and navigate to the project where the endpoint you want to connect to is deployed.

    # [CLI](#tab/cli)

    Configure the CLI to point to the project:

    ```azurecli
    az account set --subscription <subscription>
    az configure --defaults workspace=<project-name> group=<resource-group> location=<location>
    ```

    # [Python](#tab/sdk)

    Create a client connected to your project:

    ```python
    client = MLClient(
        credential=InteractiveBrowserCredential(tenant_id="<tenant-id>"),
        subscription_id="<subscription-id>",
        resource_group_name="<resource-group>",
        workspace_name="<project-name>",
    )
    ```

1. Get the endpoints URL and credentials for the endpoint you want to connect to. In this example we get the details for an endpoint name **meta-llama3-8b-qwerty**.

    # [Portal](#tab/portal)

    1. Go to **Endpoints** and select **Serverless**.

    1. Locate the endpoint you want to connect to and select it.

    1. On the **Details** tab, copy the URL on **Target** and the value for **Key**.

    # [CLI](#tab/cli)

    ```azurecli
    az ml serverless-endpoint get-credentials -n meta-llama3-8b-qwerty
    ```

    # [Python](#tab/sdk)

    ```python
    endpoint_name = "meta-llama3-8b-qwerty"
    endpoint_keys = client.serverless_endpoints.get_keys(endpoint_name)
    print(endpoint_keys.primary_key)
    print(endpoint_keys.secondary_key)
    ```

1. Connect now to the project where you need to create the connection and consume the endpoint.

1. Create the connection in the project:

    # [Portal](#tab/portal)

    Go to [Azure AI Studio](https://ai.azure.com) and follow these steps:

    1. Navigate to the project where the connection needs to be created to.

    1. Select the **Settings** option in the left navigation bar.

    1. On **Connected resources**, select **New connection**.

    1. Select **Serverless Model**.

    1. On **Target URI**, paste the value you copied on the previous section.

    1. On **Key**, paste the value you copied on the previous section.

    1. Give the connection a name, in this case **meta-llama3-8b-connection**.

    1. Select **Add connection**.

    # [CLI](#tab/cli)

    Create a connection defintion

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

    # [Python](#tab/sdk)

    ```python
    client.connections.create(ServerlessConnection(
        name="meta-llama3-8b-connection",
        endpoint="https://meta-llama3-8b-qwerty-serverless.inference.ai.azure.com",
        api_key="1234567890qwertyuiop"
    ))
    ```

1. At this point, the connection will be available for consumption.

1. To validate the connection is working:

    1. On the **Tools** section on the navigation bar, select **Prompt flow**.

    1. Select **Create** and then select **Chat**.

    1. Give your *Prompt flow* a name and select **Create**.

    1. On the **chat** node, select the option **Connection** and select the connection you just created, in this case **meta-llama3-8b-connection**.

    1. On the top navigation bar, select **Start compute session** to start a **Prompt flow** automatic runtime.

    1. Select the **Chat** option. You should be able to send messages and get responses.