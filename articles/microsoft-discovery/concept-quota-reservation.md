---
title: Quota reservations for Microsoft Discovery
description: Learn about the Azure quotas and capacity reservations required for Microsoft Discovery deployments, including VM SKUs, storage, database, and AI model quotas.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: concept-article
ms.date: 04/02/2026

#CustomerIntent: As a platform administrator, I want to understand quota requirements so that I can prepare my Azure subscription for a successful Microsoft Discovery deployment.
---

# Quota reservations for Microsoft Discovery

Microsoft Discovery requires specific quotas across multiple Azure services to function effectively. These quotas must be secured before deploying Microsoft Discovery infrastructure components. Proper quota planning ensures optimal performance and prevents deployment failures during infrastructure setup.

The primary quota categories include:

- **Virtual Machine SKUs**: For supercomputer node pools and computational workloads
- **Azure Cosmos DB throughput (RU/s)**: For Discovery workspace and Discovery project resources
- **Chat completion and text embedding models**: For Azure OpenAI and Azure AI Foundry services
- **Bookshelf service infrastructure**: For Azure AI Search, Azure Container Apps, Azure SQL DB, and indexing nodepools

## Prerequisites

Before requesting quota increases, ensure you have:

- An active Azure subscription with the Microsoft Discovery resource provider registered
- **Contributor** or **Owner** role on the Azure subscription
- Understanding of your planned Microsoft Discovery deployment scale and requirements
- Access to the Azure portal and Azure CLI (if using programmatic quota requests)
- Knowledge of your target Azure regions for deployment

## Virtual Machine SKU quotas

Standard VM SKUs are required for Microsoft Discovery infrastructure components, including supercomputer node pools, storage systems, and management services.

### Required VM SKU families

Microsoft Discovery supports various VM SKU families for different computational workloads. For more information, see [Azure VM SKU Families](/azure/virtual-machines/sizes/overview?tabs=breakdownseries%2Cgeneralsizelist%2Ccomputesizelist%2Cmemorysizelist%2Cstoragesizelist%2Cgpusizelist%2Cfpgasizelist%2Chpcsizelist#general-purpose).

The following table lists sample VM SKU families supported in preview:

| VM SKU Family | Recommended SKUs | Use Case |
|---|---|---|
| **D-series v5/v6** | Standard_D4s_v5, Standard_D4s_v6 | Enterprise-grade applications, relational databases, in-memory caching, data analytics |
| **NC-family (GPU)** | Standard_NC4as_T4_v3, Standard_NC8as_T4_v3, Standard_NC16as_T4_v3, Standard_NC64as_T4_v3, Standard_NC24ads_A100_v4, Standard_NC48ads_A100_v4, Standard_NC96ads_A100_v4 | Compute-intensive AI/ML workloads, graphics-intensive applications, visualization, deep learning training |
| **NV-family (GPU)** | Standard_NV6ads_A10_v5, Standard_NV12ads_A10_v5, Standard_NV24ads_A10_v5, Standard_NV36ads_A10_v5, Standard_NV36adms_A10_v5, Standard_NV72ads_A10_v5 | Virtual desktop (VDI), single-precision compute, video encoding, and rendering, remote visualization |
| **ND-family (GPU)** | Standard_ND40rs_v2 | Large memory compute-intensive workloads, large memory graphics-intensive applications, distributed deep learning |

VM vCPU quota is reserved per subscription. You can check vCPU quota by following the guidance at [Check vCPU quotas](/azure/virtual-machines/quotas?tabs=cli).

Depending on the resources you plan to create in your subscription, allocate vCPU quotas accordingly. If you need GPU support for your tools, follow the same process with VM SKUs that include GPU support. All supported VM SKUs are listed in the preceding table.

For more information, see [Increase VM-family vCPU quotas](/azure/quotas/per-vm-quota-requests).

## Azure Cosmos DB throughput quota

Microsoft Discovery uses **Azure Cosmos DB**. Cosmos DB throughput is measured in **RU/s (Request Units per second)** and should be planned to ensure both successful resource creation and steady runtime performance.

To learn more, see [Request units in Azure Cosmos DB](/azure/cosmos-db/request-units).

### Cosmos DB account quota behavior

- There's no per-subscription quota limit on RU/s.
- Throughput availability is managed per Cosmos DB account.
- Discovery Platform manages the Cosmos DB, which uses throughput within the default assignment range.
- If there's a quota issue due to region-level restrictions (for example, a high-demand region), [raise a support ticket](/azure/cosmos-db/nosql/create-support-request-quota-increase) to request the appropriate extension.

For more information, see [Azure Cosmos DB service quotas](/azure/cosmos-db/concepts-limits?source=recommendations).

### Required throughput

Both the Discovery workspace resource and each Discovery project resource require autoscale throughput to be available.

| Resource | Minimum RU/s required | Maximum RU/s (autoscale) | Notes |
|---|---|---|---|
| **Discovery workspace** | 2,400 RU/s | 4,000 RU/s | Cosmos DB service support autoscale |
| **Discovery project** | 400 RU/s | 4,000 RU/s | Cosmos DB service support autoscale |

### Operational guidance

- If the minimum RU/s isn't available, you might see resource creation failures.
- If the maximum RU/s can't be fulfilled, the platform might experience performance degradation under load.

### Example sizing

For a workspace with 10 projects:

- **Minimum**: 2,400 + (400 × 10) = **6,400 RU/s**
- **Maximum**: 4,000 + (4,000 × 10) = **44,000 RU/s**

## Chat completion and text embedding model quotas

Azure OpenAI and Azure AI Foundry quotas are essential for Microsoft Discovery's AI-powered features, including Copilot, Bookshelf, Discovery Engine, and natural language processing.

### Model TPM requirements summary

The following table shows the total TPM required per model for a workspace with a single Bookshelf instance. For each Bookshelf, add the corresponding per-instance Bookshelf TPM values. For detailed per-service breakdowns, see [Chat completion and text embedding model quotas](#chat-completion-and-text-embedding-model-quotas).

| Model | Total minimum TPM | Total recommended TPM | Contributing services |
|---|---|---|---|
| **GPT-5.2** | 550,000 | 4,000,000 | Discovery Engine + Bookshelf + Agents (Copilot Service) |
| **GPT-5 Mini** | 100,000 | 10,000,000 | Bookshelf |
| **Text Embedding 3 (Large)** | 50,000 | 2,000,000 | Bookshelf |

> [!TIP]
> For deployments with multiple Bookshelves, multiply the Bookshelf per-instance TPM by the number of Bookshelf instances and add it to the workspace-scoped totals. For example, a workspace with three Bookshelves at recommended TPM requires: GPT-5.2 = 1,000,000 + (2,000,000 × 3) + 1,000,000 = **8,000,000 TPM**.

### Consolidated model TPM requirements

The following table provides a consolidated view of model TPM requirements across all Microsoft Discovery services. Use this table to plan your total Azure OpenAI quota needs for a single workspace deployment.

#### Per-service model TPM breakdown

| Model | Service | Minimum TPM | Recommended TPM | Scope |
|---|---|---|---|---|
| **GPT-5.2** | Discovery Engine | 250,000 | 1,000,000 | Per workspace |
| **GPT-5.2** | Bookshelf | 100,000 | 2,000,000 | Per Bookshelf instance |
| **GPT-5.2** | Agents (Copilot Service) | 200,000 | 1,000,000 | Per workspace |
| **GPT-5 Mini** | Bookshelf | 100,000 | 10,000,000 | Per Bookshelf instance |
| **Text Embedding 3 (Large)** | Bookshelf | 50,000 | 2,000,000 | Per Bookshelf instance |

### Discovery Engine models

Discovery Engine requires two GPT model deployments. The first is created automatically during workspace provisioning for cognition (reasoning and task planning). The second must be created manually for task validation.

| Model | Deployment name | Minimum TPM | Recommended TPM | Purpose |
|---|---|---|---|---|
| **GPT-5.2** | *(auto-provisioned)* | 250,000 | 1,000,000 | Cognition reasoning, task planning, and answer generation |
| **GPT-5.2** | `gpt-5-2` | 250,000 | 250,000 | Task validation. evaluates agent results against validation requirements |

- **Cognition model**: Deployed automatically during workspace creation with an initial quota of 250,000 TPM. This deployment is dedicated to the Discovery Engine and isn't shared with other services. After workspace creation, increase the TPM to the recommended 1,000,000 TPM for optimal performance. For instructions, see [How to update quota assigned to a model deployment](/azure/ai-foundry/openai/how-to/quota).
- **Validation model**: You must manually create a chat model deployment named `gpt-5-2` using model `gpt-5.2`. Without this deployment, the Discovery Engine can't validate task results and won't start. See [Create Chat Model Deployment](quickstart-infrastructure-portal.md#5-create-chat-model-deployment) for setup instructions.

> [!IMPORTANT]
> Both deployments consume GPT-5.2 quota in your subscription. Ensure you have at least 500,000 TPM of GPT-5.2 quota available (250,000 minimum per deployment).

### Bookshelf service quotas

Bookshelf requires infrastructure resources and LLM model quotas across enrichment, indexing, search, and search tuning.

#### Enrichment infrastructure

Bookshelf uses Azure AI Search for enrichment (built-in skills) and incremental enrichment watermarks. An Azure AI Search instance is created when the knowledge base is deployed.

| Resource | SKU | Lifecycle |
|---|---|---|
| **Azure AI Search** | Standard S1 | Always on |

Enrichment processing is variable and depends on the number of pages, files, images, and tables in your documents.

#### Indexing quotas

Bookshelf supports three index size tiers based on text content volume:

| Index size | Content volume | Supercomputer nodepool SKU |
|---|---|---|
| **Small** | 200 MB TXT | Standard_D48s_v6 (192 GB) |
| **Medium** | 500 MB TXT | Standard_D128s_v6 (512 GB) |
| **Large** | 1 GB TXT | Standard_D192s_v6 (768 GB) |

Supercomputer nodepools for indexing are on-demand and only consumed during indexing operations.

#### LLM model quotas

Bookshelf uses three models for indexing and search operations. Ensure that each Bookshelf has at least the minimum quota allocated.

| Model | Minimum TPM | Preferred TPM | Purpose |
|---|---|---|---|
| **Text Embedding 3 (Large)** | 50,000 | 2,000,000 | Document indexing and embedding generation |
| **GPT-5.2** | 100,000 | 2,000,000 | Query decomposition and answer generation |
| **GPT-5 Mini** | 100,000 | 10,000,000 | Primary search model |

GPT-5 Mini has the highest preferred quota because a single search query can consume approximately 800K–1M tokens.

#### Search infrastructure

Bookshelf deploys always-on infrastructure for domain specific knowledge search when a Bookshelf is created.

| Resource | Size tier | Configuration |
|---|---|---|
| **Azure Container Apps** (dedicated profile) | Small | E4 vCPU, 32-GiB memory |
| **Azure Container Apps** (dedicated profile) | Medium | E8 vCPU, 64-GiB memory |
| **Azure Container Apps** (dedicated profile) | Large | E16 with 16 vCPU, 128-GiB memory |

#### Scaling behavior

- **Indexing (Text Embedding)**—Scales with dataset size. Large datasets across multiple Bookshelves might require millions of TPM. High embedding quota is easy to obtain.
- **Querying (GPT models)**—Independent of dataset size. Driven by concurrent users, search frequency, and relevance budget. Quota is shared at the subscription and region level across all Bookshelves.
- **Fixed infrastructure**—Azure AI Search, Azure Container Apps dedicated profile, and Azure SQL DB are always-on resources created at Bookshelf deployment.
- **Variable components**—Enrichment processing, embedding generation, and model inference scale with usage.

### Copilot Service models

The Copilot Service requires the following GPT model for agents. Ensure that each workspace has at least the minimum TPM allocated. Quota is reserved per workspace.

| Model | Minimum TPM | Recommended TPM | Purpose |
|---|---|---|---|
| **GPT-5.2** | 200,000 | 1,000,000 | Conversation and reasoning for Copilot agents |

> [!NOTE]
> GPT-5.2 is the recommended model. Other models available in the [Azure AI Foundry Model Catalog](https://ai.azure.com) can also be supported. If you choose a different model, ensure the corresponding model quota is reserved in your subscription.

By default, **Global Standard** is the deployment mode for model deployments. If data residency is required, **Data Zone Standard** is supported as an alternative deployment mode. For more information, see [Data Zone Standard deployment type](/azure/foundry/foundry-models/concepts/deployment-types#data-zone-standard).

### Requesting Azure OpenAI quota

To request or increase model quota:

- Sign in to the [Azure AI Foundry Portal](https://ai.azure.com).
- Navigate to **Management Center** > **Quota**.
- Select the correct subscription and the region where you plan to deploy Microsoft Discovery.
- Select **Request quota** for the desired model and fill in the request form with the model name, deployment type (Standard), and the TPM values from the tables in this article.

For more information, see [Request quota for Azure OpenAI models](/azure/ai-foundry/openai/quotas-limits?tabs=REST#how-to-request-quota-increases).

## Regional quota considerations

Choose regions based on quota availability and proximity to your users, and the locations where the platform is available.

Before requesting quotas, verify regional availability:

```azurecli
# Check VM quota availability by region
az vm list-usage --location "swedencentral" --query "[?contains(name.value, 'cores')]"

# Check Azure OpenAI model availability
az cognitiveservices model list --location "swedencentral" --kind "OpenAI"
```

## Quota request best practices

- **Request quotas 2–4 weeks before deployment** to allow for processing time. Standard requests typically take 1–3 business days; large quota requests might take 5–10 business days.
- **Plan for multiple regions** in case primary region quotas are unavailable.
- **Set up Azure Monitor alerts** at 80% quota utilization and configure notifications to platform administrators.
- **Integrate with cost management** by linking quota monitoring with cost management, setting up spending alerts for Azure OpenAI usage, and implementing budget controls for quota-intensive resources.

## Acronyms

| Acronym | Full term | Definition |
|---|---|---|
| **VM** | Virtual Machine | An on-demand, scalable compute resource in Azure that emulates a physical computer. |
| **SKU** | Stock Keeping Unit | A specific configuration or pricing tier of an Azure resource, such as a VM size or storage level. |
| **VDI** | Virtual Desktop Infrastructure | A technology that hosts desktop environments on a remote server, delivered to users through services like Azure Virtual Desktop. |
| **GPT** | Generative Pretrained Transformer | A family of large language models used in Azure OpenAI Service for text generation, reasoning, and conversation. |
| **TPM** | Tokens Per Minute | A unit measuring the rate of token consumption allocated to an Azure OpenAI model deployment. |

## Related content

- [Azure AI Foundry Documentation](/azure/ai-services/openai/)
- [Azure OpenAI Service Quotas and Limits](/azure/ai-services/openai/quotas-limits)
- [Manage Azure OpenAI Quotas](/azure/ai-services/openai/how-to/quota)
- [Provisioned Throughput Units (PTU)](/azure/ai-services/openai/concepts/provisioned-throughput)
