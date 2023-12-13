---
title: How to configure a private link for Azure AI
titleSuffix: Azure AI Studio
description: Learn how to configure a private link for Azure AI
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom: ignite-2023, devx-track-azurecli
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# How to configure a private link for Azure AI

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

We have two network isolation aspects. One is the network isolation to access an Azure AI. Another is the network isolation of computing resources in your Azure AI and Azure AI projects such as Compute Instance, Serverless and Managed Online Endpoint. This document explains the former highlighted in the diagram. You can use private link to establish the private connection to your Azure AI and its default resources.

:::image type="content" source="../media/how-to/network/azure-ai-network-inbound.png" alt-text="Diagram of Azure AI network isolation." lightbox="../media/how-to/network/azure-ai-network-inbound.png":::

You get several Azure AI default resources in your resource group. You need to configure following network isolation configurations.

- Disable public network access flag of Azure AI default resources such as Storage, Key Vault, Container Registry. Azure AI services and Azure AI Search should be public.
- Establish private endpoint connection to Azure AI default resource. Note that you need to have blob and file PE for the default storage account.
- [Managed identity configurations](#managed-identity-configuration) to allow Azure AI resources access your storage account if it's private.


## Prerequisites

* You must have an existing virtual network to create the private endpoint in. 

    > [!IMPORTANT]
    > We do not recommend using the 172.17.0.0/16 IP address range for your VNet. This is the default subnet range used by the Docker bridge network or on-premises.

* Disable network policies for private endpoints before adding the private endpoint.

## Create an Azure AI that uses a private endpoint

Use one of the following methods to create an Azure AI resource with a private endpoint. Each of these methods __requires an existing virtual network__:

# [Azure CLI](#tab/cli)

Create your Azure AI resource with the Azure AI CLI. Run the following command and follow the prompts. For more information, see [Get started with Azure AI CLI](cli-install.md).

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

Not available in AI CLI, but you can use [Azure Machine Learning CLI](../../machine-learning/how-to-configure-private-link.md#enable-public-access). Use your Azure AI name as workspace name in Azure Machine Learning CLI.

# [Azure portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), select your Azure AI.
1. From the left side of the page, select __Networking__ and then select the __Public access__ tab.
1. Select __Enabled from all networks__, and then select __Save__.

---

## Managed identity configuration

This is required if you make your storage account private. Our services need to read/write data in your private storage account using [Allow Azure services on the trusted services list to access this storage account](../../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) with below managed identity configurations. Enable system assigned managed identity of Azure AI Service and Azure AI Search, configure role-based access control for each managed identity.

| Role | Managed Identity | Resource | Purpose | Reference |
|--|--|--|--|--|
| `Storage File Data Privileged Contributor` | Azure AI project | Storage Account | Read/Write prompt flow data.  | [Prompt flow doc](../../machine-learning/prompt-flow/how-to-secure-prompt-flow.md#secure-prompt-flow-with-workspace-managed-virtual-network) |
| `Storage Blob Data Contributor` | Azure AI Service | Storage Account | Read from input container, write to preprocess result to output container. | [Azure OpenAI Doc](../../ai-services/openai/how-to/managed-identity.md) |
| `Storage Blob Data Contributor` | Azure AI Search | Storage Account | Read blob and write knowledge store | [Search doc](../../search/search-howto-managed-identities-data-sources.md)|

## Custom DNS configuration

See [Azure Machine Learning custom dns doc](../../machine-learning/how-to-custom-dns.md#example-custom-dns-server-hosted-in-vnet) for the DNS forwarding configurations.

If you need to configure custom dns server without dns forwarding, the following is the required A records.

* `<AI-STUDIO-GUID>.workspace.<region>.cert.api.azureml.ms`
* `<AI-PROJECT-GUID>.workspace.<region>.cert.api.azureml.ms`
* `<AI-STUDIO-GUID>.workspace.<region>.api.azureml.ms`
* `<AI-PROJECT-GUID>.workspace.<region>.api.azureml.ms`
* `ml-<workspace-name, truncated>-<region>-<AI-STUDIO-GUID>.<region>.notebooks.azure.net`
* `ml-<workspace-name, truncated>-<region>-<AI-PROJECT-GUID>.<region>.notebooks.azure.net`

    > [!NOTE]
    > The workspace name for this FQDN might be truncated. Truncation is done to keep `ml-<workspace-name, truncated>-<region>-<workspace-guid>` at 63 characters or less.
* `<instance-name>.<region>.instances.azureml.ms`

    > [!NOTE]
    > * Compute instances can be accessed only from within the virtual network.
    > * The IP address for this FQDN is **not** the IP of the compute instance. Instead, use the private IP address of the workspace private endpoint (the IP of the `*.api.azureml.ms` entries.)

* `<managed online endpoint name>.<region>.inference.ml.azure.com` - Used by managed online endpoints

See [this documentation](../../machine-learning/how-to-custom-dns.md#find-the-ip-addresses) to check your private IP addresses for your A records. To check AI-PROJECT-GUID, go to Azure portal > Your Azure AI Project > JSON View > workspaceId.

## Limitations

* Private Azure AI services and Azure AI Search aren't supported.
* The "Add your data" feature in the Azure AI Studio playground doesn't support private storage account.
* You might encounter problems trying to access the private endpoint for your Azure AI if you're using Mozilla Firefox. This problem might be related to DNS over HTTPS in Mozilla Firefox. We recommend using Microsoft Edge or Google Chrome.

## Next steps

- [Create a project](create-projects.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about Azure AI resources](../concepts/ai-resources.md)
