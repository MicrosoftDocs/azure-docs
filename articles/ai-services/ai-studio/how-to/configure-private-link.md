---
title: How to configure a private link for Azure AI
titleSuffix: Azure AI services
description: Learn how to configure a private link for Azure AI
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to configure a private link for Azure AI

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

We have two network isolation aspects. One is the network isolation to access an Azure AI. Another is the network isolation of computing resources in your Azure AI and Azure AI projects such as Compute Instance, Serverless and Managed Online Endpoint. This document explains the former highlighted in the diagram. You can use private link to establish the private connection to your Azure AI and its default resources.

:::image type="content" source="../media/how-to/network/azure-ai-network-inbound.png" alt-text="Diagram of Azure AI network isolation." lightbox="../media/how-to/network/azure-ai-network-inbound.png":::

You get several Azure AI default resources in your resource group. You need to configure following network isolation configurations.

- Disable public network access flag of Azure AI default resources such as Storage, Key Vault, Container Registry, Azure AI services and Azure AI Search.
- Establish private endpoint connection to Azure AI resource.
- Establish private endpoint connection to Azure AI services created with your Azure AI resource. For more information, see [this article](/azure/ai-services/cognitive-services-virtual-networks?tabs=portal#use-private-endpoints).
- (Optional) Private endpoint connection to Storage created with your Azure AI or your own Azure AI Search if you need direct access to them. Not required if you interact with them in Azure AI.

## Prerequisites

* You must have an existing virtual network to create the private endpoint in. 

    > [!IMPORTANT]
    > We do not recommend using the 172.17.0.0/16 IP address range for your VNet. This is the default subnet range used by the Docker bridge network or on-premises.

* Disable network policies for private endpoints before adding the private endpoint.

## Limitations

* You might encounter problems trying to access the private endpoint for your Azure AI if you're using Mozilla Firefox. This problem might be related to DNS over HTTPS in Mozilla Firefox. We recommend using Microsoft Edge or Google Chrome.

## Create an Azure AI that uses a private endpoint

Use one of the following methods to create an Azure AI resource with a private endpoint. Each of these methods __requires an existing virtual network__:

# [Azure CLI](#tab/cli)

Create your Azure AI Studio

```azurecli-interactive
ai init
```

After creating the Azure AI, use the [Azure networking CLI commands](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) to create a private link endpoint for the Azure AI.

```azurecli-interactive
az network private-endpoint create \
    --name <private-endpoint-name> \
    --vnet-name <vnet-name> \
    --subnet <subnet-name> \
    --private-connection-resource-id "/subscriptions/<subscription>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>" \
    --group-id amlworkspace \
    --connection-name workspace -l <location>
```

To create the private DNS zone entries for the workspace, use the following commands:

```azurecli-interactive
# Add privatelink.api.azureml.ms
az network private-dns zone create \
    -g <resource-group-name> \
    --name privatelink.api.azureml.ms

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name privatelink.api.azureml.ms \
    --name <link-name> \
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group create \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
    --private-dns-zone privatelink.api.azureml.ms \
    --zone-name privatelink.api.azureml.ms

# Add privatelink.notebooks.azure.net
az network private-dns zone create \
    -g <resource-group-name> \
    --name privatelink.notebooks.azure.net

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name privatelink.notebooks.azure.net \
    --name <link-name> \
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group add \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
    --private-dns-zone privatelink.notebooks.azure.net \
    --zone-name privatelink.notebooks.azure.net
```

# [Azure portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), go to Azure AI Studio and choose __+ New Azure AI__.
1. Choose network isolation mode in __Networking__ tab.
1. Scroll down to __Workspace Inbound access__ and choose __+ Add__.
1. Input required fields. When selecting the __Region__, select the same region as your virtual network.

---

## Add a private endpoint to an Azure AI

Use one of the following methods to add a private endpoint to an existing Azure AI:

# [Azure CLI](#tab/cli)

Use the [Azure networking CLI commands](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) to create a private link endpoint for the Azure AI.

```azurecli-interactive
az network private-endpoint create \
    --name <private-endpoint-name> \
    --vnet-name <vnet-name> \
    --subnet <subnet-name> \
    --private-connection-resource-id "/subscriptions/<subscription>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>" \
    --group-id amlworkspace \
    --connection-name workspace -l <location>
```

To create the private DNS zone entries for the workspace, use the following commands:

```azurecli-interactive
# Add privatelink.api.azureml.ms
az network private-dns zone create \
    -g <resource-group-name> \
    --name 'privatelink.api.azureml.ms'

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name 'privatelink.api.azureml.ms' \
    --name <link-name> \
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group create \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
    --private-dns-zone 'privatelink.api.azureml.ms' \
    --zone-name 'privatelink.api.azureml.ms'

# Add privatelink.notebooks.azure.net
az network private-dns zone create \
    -g <resource-group-name> \
    --name 'privatelink.notebooks.azure.net'

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name 'privatelink.notebooks.azure.net' \
    --name <link-name> \
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group add \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
    --private-dns-zone 'privatelink.notebooks.azure.net' \
    --zone-name 'privatelink.notebooks.azure.net'
```

# [Azure portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), select your Azure AI.
1. From the left side of the page, select __Networking__ and then select the __Private endpoint connections__ tab.
1. When selecting the __Region__, select the same region as your virtual network.
1. When selecting __Resource type__, use azuremlworkspace.
1. Set the __Resource__ to your workspace name.

Finally, select __Create__ to create the private endpoint.

---

## Remove a private endpoint

You can remove one or all private endpoints for an Azure AI. Removing a private endpoint removes the Azure AI from the VNet that the endpoint was associated with. Removing the private endpoint might prevent the Azure AI from accessing resources in that VNet, or resources in the VNet from accessing the workspace. For example, if the VNet doesn't allow access to or from the public internet.

> [!WARNING]
> Removing the private endpoints for a workspace __doesn't make it publicly accessible__. To make the workspace publicly accessible, use the steps in the [Enable public access](#enable-public-access) section.

To remove a private endpoint, use the following information:

# [Azure CLI](#tab/cli)

When using the Azure CLI, use the following command to remove the private endpoint:

```azurecli
az network private-endpoint delete \
    --name <private-endpoint-name> \
    --resource-group <resource-group-name> \
```

# [Azure portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), select your Azure AI.
1. From the left side of the page, select __Networking__ and then select the __Private endpoint connections__ tab.
1. Select the endpoint to remove and then select __Remove__.

---

## Enable public access

In some situations, you might want to allow someone to connect to your secured Azure AI over a public endpoint, instead of through the VNet. Or you might want to remove the workspace from the VNet and re-enable public access.

> [!IMPORTANT]
> Enabling public access doesn't remove any private endpoints that exist. All communications between components behind the VNet that the private endpoint(s) connect to are still secured. It enables public access only to the Azure AI, in addition to the private access through any private endpoints.

To enable public access, use the following steps:

# [Azure CLI](#tab/cli)

```azurecli
Not Available.
```

# [Azure portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), select your Azure AI.
1. From the left side of the page, select __Networking__ and then select the __Public access__ tab.
1. Select __Enabled from all networks__, and then select __Save__.

---


## DNS configuration

See [this documentation](/azure/machine-learning/how-to-custom-dns).


## Next steps

- [Create a project](create-projects.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about Azure AI resources](../concepts/ai-resources.md)
