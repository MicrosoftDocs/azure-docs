---
title: How to configure a private link for Azure AI hub
titleSuffix: Azure AI Studio
description: Learn how to configure a private link for Azure AI hub. A private link is used to secure communication with the AI hub.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom: ignite-2023, devx-track-azurecli
ms.topic: how-to
ms.date: 04/10/2024
ms.reviewer: jhirono
ms.author: larryfr
author: Blackmist
# Customer intent: As an admin, I want to configure a private link for Azure AI hub so that I can secure my Azure AI hub resources.
---

# How to configure a private link for Azure AI hub

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

We have two network isolation aspects. One is the network isolation to access an Azure AI hub. Another is the network isolation of computing resources in your Azure AI hub and Azure AI projects such as compute instances, serverless, and managed online endpoints. This article explains the former highlighted in the diagram. You can use private link to establish the private connection to your Azure AI hub and its default resources. This article is for Azure AI Studio (AI hub and AI projects). For information on Azure AI Services, see the [Azure AI Services documentation](/azure/ai-services/cognitive-services-virtual-networks).

:::image type="content" source="../media/how-to/network/azure-ai-network-inbound.svg" alt-text="Diagram of Azure AI hub network isolation." lightbox="../media/how-to/network/azure-ai-network-inbound.png":::

You get several Azure AI hub default resources in your resource group. You need to configure following network isolation configurations.

- Disable public network access of Azure AI hub default resources such as Azure Storage, Azure Key Vault, and Azure Container Registry.
- Establish private endpoint connection to Azure AI hub default resources. You need to have both a blob and file private endpoint for the default storage account.
- [Managed identity configurations](#managed-identity-configuration) to allow Azure AI hub resources access your storage account if it's private.
- Azure AI Services and Azure AI Search should be public.


## Prerequisites

* You must have an existing Azure Virtual Network to create the private endpoint in. 

    > [!IMPORTANT]
    > We do not recommend using the 172.17.0.0/16 IP address range for your VNet. This is the default subnet range used by the Docker bridge network or on-premises.

* Disable network policies for private endpoints before adding the private endpoint.

## Create an Azure AI that uses a private endpoint

Use one of the following methods to create an Azure AI hub resource with a private endpoint. Each of these methods __requires an existing virtual network__:

# [Azure portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), go to Azure AI Studio and choose __+ New Azure AI__.
1. Choose network isolation mode in __Networking__ tab.
1. Scroll down to __Workspace Inbound access__ and choose __+ Add__.
1. Input required fields. When selecting the __Region__, select the same region as your virtual network.

# [Azure CLI](#tab/cli)

Create your Azure AI hub resource with the Azure AI CLI. Run the following command and follow the prompts. For more information, see [Get started with Azure AI CLI](cli-install.md).

```azurecli-interactive
ai init
```

After creating the Azure AI hub, use the [Azure networking CLI commands](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) to create a private link endpoint for the Azure AI.

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

---

## Add a private endpoint to an Azure AI hub

Use one of the following methods to add a private endpoint to an existing Azure AI hub:

# [Azure portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), select your Azure AI hub.
1. From the left side of the page, select __Networking__ and then select the __Private endpoint connections__ tab.
1. When selecting the __Region__, select the same region as your virtual network.
1. When selecting __Resource type__, use `azuremlworkspace`.
1. Set the __Resource__ to your workspace name.

Finally, select __Create__ to create the private endpoint.

# [Azure CLI](#tab/cli)

Use the [Azure networking CLI commands](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) to create a private link endpoint for the Azure AI hub.

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

---

## Remove a private endpoint

You can remove one or all private endpoints for an Azure AI hub. Removing a private endpoint removes the Azure AI hub from the Azure Virtual Network that the endpoint was associated with. Removing the private endpoint might prevent the Azure AI hub from accessing resources in that virtual network, or resources in the virtual network from accessing the workspace. For example, if the virtual network doesn't allow access to or from the public internet.

> [!WARNING]
> Removing the private endpoints for an AI hub __doesn't make it publicly accessible__. To make the AI hub publicly accessible, use the steps in the [Enable public access](#enable-public-access) section.

To remove a private endpoint, use the following information:

# [Azure portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), select your Azure AI hub.
1. From the left side of the page, select __Networking__ and then select the __Private endpoint connections__ tab.
1. Select the endpoint to remove and then select __Remove__.

# [Azure CLI](#tab/cli)

When using the Azure CLI, use the following command to remove the private endpoint:

```azurecli
az network private-endpoint delete \
    --name <private-endpoint-name> \
    --resource-group <resource-group-name> \
```

---

## Enable public access

In some situations, you might want to allow someone to connect to your secured Azure AI hub over a public endpoint, instead of through the virtual network. Or you might want to remove the workspace from the virtual network and re-enable public access.

> [!IMPORTANT]
> Enabling public access doesn't remove any private endpoints that exist. All communications between components behind the virtual network that the private endpoint(s) connect to are still secured. It enables public access only to the Azure AI hub, in addition to the private access through any private endpoints.

To enable public access, use the following steps:

# [Azure portal](#tab/azure-portal)

1. From the [Azure portal](https://portal.azure.com), select your Azure AI hub.
1. From the left side of the page, select __Networking__ and then select the __Public access__ tab.
1. Select __Enabled from all networks__, and then select __Save__.

# [Azure CLI](#tab/cli)

Not available in AI CLI, but you can use [Azure Machine Learning CLI](../../machine-learning/how-to-configure-private-link.md#enable-public-access). Use your Azure AI hub name as workspace name in Azure Machine Learning CLI.

---

## Managed identity configuration

A manged identity configuration is required if you make your storage account private. Our services need to read/write data in your private storage account using [Allow Azure services on the trusted services list to access this storage account](../../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services) with following managed identity configurations. Enable the system assigned managed identity of Azure AI Service and Azure AI Search, then configure role-based access control for each managed identity.

| Role | Managed Identity | Resource | Purpose | Reference |
|--|--|--|--|--|
| `Storage File Data Privileged Contributor` | Azure AI project | Storage Account | Read/Write prompt flow data. | [Prompt flow doc](../../machine-learning/prompt-flow/how-to-secure-prompt-flow.md#secure-prompt-flow-with-workspace-managed-virtual-network) |
| `Storage Blob Data Contributor` | Azure AI Service | Storage Account | Read from input container, write to preprocess result to output container. | [Azure OpenAI Doc](../../ai-services/openai/how-to/managed-identity.md) |
| `Storage Blob Data Contributor` | Azure AI Search | Storage Account | Read blob and write knowledge store | [Search doc](../../search/search-howto-managed-identities-data-sources.md). |

## Custom DNS configuration

See [Azure Machine Learning custom DNS](../../machine-learning/how-to-custom-dns.md#example-custom-dns-server-hosted-in-vnet) article for the DNS forwarding configurations.

If you need to configure custom DNS server without DNS forwarding, use the following patterns for the required A records.

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

To find the private IP addresses for your A records, see the [Azure Machine Learning custom DNS](../../machine-learning/how-to-custom-dns.md#find-the-ip-addresses) article.
To check AI-PROJECT-GUID, go to the Azure portal, select your Azure AI project, settings, properties, and the workspace ID is displayed.

## Limitations

* Private Azure AI Services and Azure AI Search aren't supported.
* The "Add your data" feature in the Azure AI Studio playground doesn't support private storage account.
* You might encounter problems trying to access the private endpoint for your Azure AI hub if you're using Mozilla Firefox. This problem might be related to DNS over HTTPS in Mozilla Firefox. We recommend using Microsoft Edge or Google Chrome.

## Next steps

- [Create an Azure AI project](create-projects.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about Azure AI hub resources](../concepts/ai-resources.md)
- [Troubleshoot secure connectivity to a project](troubleshoot-secure-connection-project.md)