---
title: Upgrade workspace management to SDK v2
titleSuffix: Azure Machine Learning
description: Upgrade workspace management from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: deeikele
ms.author: deeikele
ms.date: 09/16/2022
ms.reviewer: sgilley
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade workspace management to SDK v2

The workspace functionally remains unchanged with the V2 development platform. However, there are network-related changes to be aware of. For details, see [Network Isolation Change with Our New API Platform on Azure Resource Manager](how-to-configure-network-isolation-with-v2.md?tabs=python)

This article gives a comparison of scenario(s) in SDK v1 and SDK v2.

## Create a workspace

* SDK v1

    ```python
    from azureml.core import Workspace
    
    ws = Workspace.create(
        name='my_workspace',
        location='eastus',
        subscription_id = '<SUBSCRIPTION_ID>'
        resource_group = '<RESOURCE_GROUP>'
    )
    ```

* SDK v2

    ```python
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import Workspace
    from azure.identity import DefaultAzureCredential
    
    # specify the details of your subscription
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"
    
    # get a handle to the subscription
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group)
    
    # specify the workspace details
    ws = Workspace(
        name="my_workspace",
        location="eastus",
        display_name="My workspace",
        description="This example shows how to create a workspace",
        tags=dict(purpose="demo"),
    )
    
    ml_client.workspaces.begin_create(ws)
    ```

## Create a workspace for use with Azure Private Link endpoints

* SDK v1

    ```python
    from azureml.core import Workspace
    
    ws = Workspace.create(
        name='my_workspace',
        location='eastus',
        subscription_id = '<SUBSCRIPTION_ID>'
        resource_group = '<RESOURCE_GROUP>'
    )
    
    ple = PrivateEndPointConfig(
        name='my_private_link_endpoint',
        vnet_name='<VNET_NAME>',
        vnet_subnet_name='<VNET_SUBNET_NAME>',
        vnet_subscription_id='<SUBSCRIPTION_ID>', 
        vnet_resource_group='<RESOURCE_GROUP>'
    )
    
    ws.add_private_endpoint(ple, private_endpoint_auto_approval=True)
    ```

* SDK v2

    ```python
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import Workspace
    from azure.identity import DefaultAzureCredential
    
    # specify the details of your subscription
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"
    
    # get a handle to the subscription
    ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group)
    
    ws = Workspace(
        name="private_link_endpoint_workspace,
        location="eastus",
        display_name="Private Link endpoint workspace",
        description="When using private link, you must set the image_build_compute property to a cluster name to use for Docker image environment building. You can also specify whether the workspace should be accessible over the internet.",
        image_build_compute="cpu-compute",
        public_network_access="Disabled",
        tags=dict(purpose="demonstration"),
    )
    
    ml_client.workspaces.begin_create(ws)
    ```

## Load/connect to workspace using parameters

* SDK v1

    ```python
    from azureml.core import Workspace
    ws = Workspace.from_config()
    
    # specify the details of your subscription
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"
    
    # get handle on the workspace
    ws = Workspace.get(
        subscription_id='<SUBSCRIPTION_ID>',
        resource_group='<RESOURCE_GROUP>',
        name='my_workspace',
    )
    ```

* SDK v2

    ```python
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import Workspace
    from azure.identity import DefaultAzureCredential
    
    # specify the details of your subscription
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"
    
    # get handle on the workspace
    ws = MLClient(
        DefaultAzureCredential(),
        subscription_id='<SUBSCRIPTION_ID>',
        resource_group_name='<RESOURCE_GROUP>',
        workspace_name='my_workspace'
    )
    ```

## Load/connect to workspace using config file

* SDK v1

    ```python
    from azureml.core import Workspace
    
    ws = Workspace.from_config()
    ws.get_details()
    ```

* SDK v2

    ```python
    from azure.ai.ml import MLClient
    from azure.ai.ml.entities import Workspace
    from azure.identity import DefaultAzureCredential
    
    ws = MLClient.from_config(
        DefaultAzureCredential()
    )
    ```

## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[Method/API in SDK v1 (use links to ref docs)](/python/api/azureml-core/azureml.core.workspace.workspace)|[Method/API in SDK v2 (use links to ref docs)](/python/api/azure-ai-ml/azure.ai.ml.entities.workspace)|

## Related documents

For more information, see:

* [What is a workspace?](concept-workspace.md)
