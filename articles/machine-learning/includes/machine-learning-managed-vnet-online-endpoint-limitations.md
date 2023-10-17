---
author: msakande
ms.service: machine-learning
ms.topic: include
ms.date: 08/15/2023
ms.author: mopeakande
---

- The `v1_legacy_mode` flag must be disabled (false) on your Azure Machine Learning workspace. If this flag is enabled, you won't be able to create a managed online endpoint. For more information, see [Network isolation with v2 API](../how-to-configure-network-isolation-with-v2.md).

- If your Azure Machine Learning workspace has a private endpoint that was created before May 24, 2022, you must recreate the workspace's private endpoint before configuring your online endpoints to use a private endpoint. For more information on creating a private endpoint for your workspace, see [How to configure a private endpoint for Azure Machine Learning workspace](../how-to-configure-private-link.md).

    > [!TIP]
    > To confirm when a workspace was created, you can check the workspace properties.
    >
    > In the Studio, go to the `Directory + Subscription + Workspace` section (top right of the Studio) and select `View all properties in Azure Portal`. Select the JSON view from the top right of the "Overview" page, then choose the latest API version. From this page, you can check the value of `properties.creationTime`.
    >
    > Alternatively, use `az ml workspace show` with [CLI](../how-to-manage-workspace-cli.md#get-workspace-information), `my_ml_client.workspace.get("my-workspace-name")` with [SDK](../how-to-manage-workspace.md?tabs=python#find-a-workspace), or `curl` on a workspace with [REST API](../how-to-manage-rest.md#drill-down-into-workspaces-and-their-resources).

- When you use network isolation with a deployment, you can use resources (Azure Container Registry (ACR), Storage account, Key Vault, and Application Insights) from a different resource group or subscription than that of your workspace. However, these resources must belong to the same tenant as your workspace.

> [!NOTE]
> Network isolation described in this article applies to data plane operations, that is, operations that result from scoring requests (or model serving). Control plane operations (such as requests to create, update, delete, or retrieve authentication keys) are sent to the Azure Resource Manager over the public network.