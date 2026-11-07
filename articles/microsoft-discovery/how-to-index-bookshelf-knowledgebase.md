---
title: Create Bookshelf and index a Knowledge base for Microsoft Discovery
description: Learn how to create a Bookshelf resource, configure storage, create a knowledge base, and index documents using the Microsoft Discovery Bookshelf service.
author: kaanan
ms.author: kaanan
ms.service: azure
ms.topic: how-to
ms.date: 10/01/2026

#CustomerIntent: As a Discovery platform user, I want to create a Bookshelf resource and index my documents into a knowledge base so that I can use it with a Discovery agent for retrieval-augmented generation queries.
---

# Create Bookshelf and index a knowledge base

This article walks you through creating a Bookshelf resource, uploading documents, and indexing a knowledge base.

A Bookshelf knowledge base enables you to convert an unstructured private dataset in Azure blob storage into a rich, summary-based index. This capability enables a graph-enabled retrieval-augmented generation (RAG) with rich citations. The knowledge base can answer global queries that address the entire dataset, such as "what are the main themes in the data?" or "what are the most important implications for X?" The key components of the Bookshelf service are the Bookshelf resource and a knowledge base within each Bookshelf. A knowledge base contains a vector database and knowledge graph of your indexed artifacts. Discovery agents use knowledge bases as grounding skills for various use cases including answering questions, summarization, and reasoning.

You can complete this flow in two ways: create the Bookshelf resource in the Azure portal and then create and index its knowledge base in Discovery Studio, or create and index the Bookshelf entirely in Discovery Studio. Both approaches are described in [Create and index a bookshelf](#create-and-index-a-bookshelf).

> [!NOTE]
> Discovery Studio now presents a single, unified **Bookshelf** concept that manages both the Bookshelf resource and its knowledge base together. The **knowledge base** terminology is retained in this article and in surfaces that still use it.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Access to the Azure Discovery resource provider (`Microsoft.Discovery`) in your subscription.
- Microsoft Discovery Platform Administrator role.

### Resource quota requirements

A Bookshelf control plane resource is the top-level container that hosts a **single** knowledge base data plane resource. Each Bookshelf gets a dedicated data plane endpoint for API operations on the knowledge base. Before you create a Bookshelf resource, ensure that you have sufficient quota for the following Azure resources.

#### Knowledge base indexing

Indexing builds the knowledge graph from your documents. It requires memory optimized compute, embedding model, and storage resources.

- Azure Discovery workspace with a **supercomputer node pool** configured for indexing. Also, identify a discovery project resource for the indexing tool run on the supercomputer. Indexing is a memory-intensive operation. The following memory-optimized compute SKUs are recommended based on the size of your indexed data:

  | Index size | Data size (text data) | Recommended SKU | vCPU | Memory |
  |------------|----------------------|-----------------|------|-----|
  | Small | ~200 MB | Standard_E20s_v6 | 20 | 160 GB |
  | Medium | ~500 MB | Standard_E64s_v6 | 64 | 512 GB |
  | Large | ~1 GB | Standard_E96s_v6 | 96 | 768 GB |

- **Azure OpenAI [text-embedding-3-small](/azure/ai-services/openai/concepts/models#embeddings)** deployment with a minimum quota of **200,000 TPM** during Bookshelf creation. Before you start an indexing operation, increase your quota to **2,000,000 TPM**. Higher embedding model quota speeds up the indexing operation. You can reduce the allocated quota after indexing completes.

#### Knowledge base search

After you index a knowledge base, it requires the following resources to serve search queries:

- **Azure AI Search** [Standard S1 tier](/azure/search/search-sku-tier) with **2 replicas** for [availability zone support](/azure/search/search-reliability#resilience-to-availability-zone-failures).

- **Azure SQL Database** Hyperscale Standard-series (Gen5), **20 vCores** with zone redundancy.

- **Zone-redundant Azure Container Apps environment.** The following [dedicated workload profiles](/azure/container-apps/workload-profiles-overview) are used depending on the indexed graph size:

  | Index size | Data size (text data) | Workload profile | vCPU | Memory |
  |------------|----------------------|------------------|------|--------|
  | Small | ~200 MB | E4 | 4 | 32 GiB |
  | Medium | ~500 MB | E8 | 8 | 64 GiB |
  | Large | ~1 GB | E16 | 16 | 128 GiB |

- **Azure OpenAI [GPT-5.2](/azure/ai-services/openai/concepts/models)** deployment with a minimum quota of **200,000 TPM** during Bookshelf creation. For Knowledge base search, a quota of **2,000,000 TPM** is recommended.

- **Azure OpenAI [GPT-5-mini](/azure/ai-services/openai/concepts/models)** deployment with a minimum quota of **200,000 TPM** during Bookshelf creation. For Knowledge base search, a quota of **10,000,000 TPM** is recommended.

## Create and index a bookshelf

You can create and index a bookshelf and its knowledge base in two ways. Each tab covers the full end-to-end flow: create, index, and track. Select the tab for the approach you want:

- **Azure portal + Studio** — Create the Bookshelf resource in the Azure portal, then create and index its knowledge base in Discovery Studio.
- **Discovery Studio** — Create and index the bookshelf entirely in Discovery Studio, using the **New Bookshelf** wizard in your project.

The source data preparation (uploading documents, creating a Discovery storage container and storage asset, and granting the managed identity access to storage) is the same for both approaches.

> [!NOTE]
> For new bookshelves, use the **Discovery Studio** approach. Microsoft is retiring the classic Studio **Resources** > **Knowledge** experience that the **Azure portal + Studio** approach uses to create and index the knowledge base. The in-project **AI Capabilities** > **Bookshelves** experience replaces it.

# [Azure portal + Studio](#tab/portal)

## Step 1: Create a Bookshelf resource

The following steps show how to create a Bookshelf resource in the Azure portal.

1. Sign in with your Azure subscription in the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** and search for **Microsoft Discovery Bookshelves**. When you locate the service, select **Create**.

1. On the **Create Bookshelf** page, provide the following information for the fields on the **Basics** tab:

   | Field | Description |
   |-------|-------------|
   | **Subscription** | The Azure subscription to use for your Bookshelf resource. |
   | **Resource group** | The Azure resource group to contain your Bookshelf. You can create a new group or use a preexisting group. |
   | **Name** | A descriptive name for your Bookshelf resource, such as *bkshlfleukemiaresearch*. The name becomes part of the data plane endpoint URL (`https://<name>.bookshelf.discovery.azure.com`). |
   | **Region** | The location of your instance. Choose a region close to your data and users, such as *UK South*. |

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-basics.png" alt-text="Screenshot that shows how to configure the Basics tab for a Bookshelf resource in the Azure portal." lightbox="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-basics.png":::

1. Select **Next**.

### Configure network security

The **Networking** tab configures how the Bookshelf data plane endpoint is accessed and which subnets are used for private endpoints and search services.

| Field | Description |
|-------|-------------|
| **Public network access** | Controls whether the data plane endpoint is accessible over the public internet |

The networking tab requires two subnet configurations:

- **Private Endpoint Subnet** — Used for private connectivity to the Bookshelf data plane. Select a virtual network and subnet (for example, *discovery-uksouth-v2* / *default*).
- **Search Subnet** — Used by the managed AI Search service created in the Bookshelf's managed resource group. The search subnet must be different from the private endpoint subnet (for example, *discovery-uksouth-v2* / *bookshelfsearch*).

> [!NOTE]
> Provision a separate search subnet for each Bookshelf. You can't share search subnets across Bookshelf resources.

:::image type="content" source="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-networking.png" alt-text="Screenshot that shows how to configure network security for a Bookshelf resource in the Azure portal." lightbox="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-networking.png":::

Select **Next** to continue to the **Encryption** tab.

### Configure encryption

The **Encryption** tab lets you configure encryption settings for data at rest.

By default, data is encrypted using Microsoft-managed keys. If your organization requires customer-managed keys (CMK) for more control, select the **Enable customer-managed keys (CMK)** checkbox and provide your Azure Key Vault details.

:::image type="content" source="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-encryption.png" alt-text="Screenshot that shows the encryption settings for a Bookshelf resource in the Azure portal." lightbox="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-encryption.png":::

Select **Next** to continue to the **Identity** tab.

### Configure identity

Use the **Identity** tab to set up the workload identity that the Bookshelf Knowledge base uses to access blob storage with the private dataset.

1. Under **User assigned managed identity**, select **+ Add**.

1. In the selection pane, find and select the user-assigned managed identity for your Bookshelf. For example, *discovery-uksouth-v2* in the *mdqlabs-discovery-uksouth-v2* resource group.

1. Select **Add** to confirm the identity assignment.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-identity.png" alt-text="Screenshot that shows how to configure the workload identity for a Bookshelf resource in the Azure portal." lightbox="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-identity.png":::

   > [!IMPORTANT]
   > Knowledge base uses this managed identity to access Azure Blob Storage. You must grant this identity the Storage Blob Data Contributor role on the storage account that holds the private dataset. Create the managed identity in the same region as the Bookshelf resource.

Select **Next** to continue to the **Tags** tab.

### Add tags

The **Tags** tab lets you add optional name-value pairs to categorize your Bookshelf resource for billing and management purposes.

| Name | Value | Description |
|------|-------|-------------|
| `indexSize` | `small`, `medium`, or `large` | Controls the infrastructure provisioned in the managed resource group for the knowledge base search. See the [resource quota requirements](#resource-quota-requirements) tables for the compute and memory allocated at each size. |

:::image type="content" source="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-tags.png" alt-text="Screenshot that shows how to add tags to a Bookshelf resource in the Azure portal." lightbox="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-tags.png":::

Select **Review + create** to validate your configuration.

### Review and create

The **Review + create** tab displays a summary of all your settings across tabs. The portal validates your configuration and displays any errors.

:::image type="content" source="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-review.png" alt-text="Screenshot that shows the Review + create tab for a Bookshelf resource in the Azure portal." lightbox="media/how-to-index-bookshelf-knowledgebase/create-bookshelf-review.png":::

1. Review the settings summary. Verify that the subscription, resource group, name, region, networking, identity, and tags are all correct.

1. Select **Create** to deploy the Bookshelf resource.

1. After deployment completes, select **Go to resource** to view your Bookshelf.

> [!NOTE]
> The Bookshelf deployment creates a managed resource group that contains infrastructure resources such as an Azure SQL database, storage account, AI Search service, and container app. You don't need to manage these resources directly.

After creation, your Bookshelf data plane endpoint is available at:

```text
https://<bookshelf-name>.bookshelf.discovery.azure.com
```

## Step 2: Create a storage account and upload documents

Your documents must be stored in an Azure Blob Storage container before indexing. The Bookshelf indexer reads documents from this container during the enrichment and indexing process.

### Supported document formats

The Bookshelf indexer supports the following file formats:

| Format | File extensions |
|--------|----------------|
| Documents | `.pdf`, `.docx`, `.pptx`, `.xlsx` |
| Text | `.txt`, `.html`|


> [!IMPORTANT]
> PDF files are limited to **2,000 pages** per file. For larger documents, split them into multiple files before uploading. For more information, see [Document Layout skill data limits](/azure/search/cognitive-search-skill-document-intelligence-layout#data-limits).

### Create the storage account

1. In the Azure portal, select **Create a resource** and search for **Storage account**.

1. Select **Create** and provide the following values:

   | Setting | Value |
   |---------|-------|
   | **Subscription** | Select your Azure subscription. |
   | **Resource group** | Select the same resource group as your Bookshelf resource. |
   | **Storage account name** | Enter a unique name (for example, `bkshelfstorconuk`). |
   | **Region** | Select the same region as your Bookshelf resource. |
   | **Performance** | Select **Standard**. |
   | **Redundancy** | Select **Locally-redundant storage (LRS)** or your preferred redundancy level. |

1. Select **Review + create**, and then select **Create**.

### Create a container and upload documents

1. Navigate to your storage account in the Azure portal.

1. In the left menu, under **Data storage**, select **Containers**.

1. Select **+ Add container** and create a new container (for example, `leukemia-drug-discovery`).

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/create-storage-container.png" alt-text="Screenshot that shows the storage account containers in the Azure portal with the Add container button highlighted." lightbox="media/how-to-index-bookshelf-knowledgebase/create-storage-container.png":::

1. Open the container and select **Upload** to upload your document files.

   You can upload files individually or use [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/) for bulk uploads.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/upload-documents.png" alt-text="Screenshot that shows uploaded documents inside a blob container in the Azure portal with the Upload button highlighted." lightbox="media/how-to-index-bookshelf-knowledgebase/upload-documents.png":::

## Step 3: Configure managed identity access to storage

The Bookshelf resource uses a managed identity to read documents from your storage account. You must grant this identity the **Storage Blob Data Contributor** role on your storage account.

### Find your Bookshelf managed identity

1. Navigate to your Bookshelf resource in the Azure portal.

1. On the **Overview** page, select **View value as JSON** under **System Data** to view the resource JSON. The `workloadIdentities` section contains the managed identity resource ID, principal ID, and client ID.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/find-bookshelf-managed-identity.png" alt-text="Screenshot that shows the Bookshelf resource overview and Resource JSON with the workload identity details." lightbox="media/how-to-index-bookshelf-knowledgebase/find-bookshelf-managed-identity.png":::

### Assign the Storage Blob Data Contributor role

1. Navigate to your storage account in the Azure portal.

1. In the left menu, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment**.

1. On the **Role** tab, search for and select **Storage Blob Data Contributor**.

1. On the **Members** tab, select **Managed identity**, then select **+ Select members**.

1. Find and select the Bookshelf managed identity from the previous step.

1. Select **Review + assign** to complete the role assignment.

:::image type="content" source="media/how-to-index-bookshelf-knowledgebase/assign-blob-data-reader-role.png" alt-text="Screenshot that shows the Add role assignment page with Storage Blob Data Contributor selected and the managed identity selection pane." lightbox="media/how-to-index-bookshelf-knowledgebase/assign-blob-data-reader-role.png":::

> [!NOTE]
> Role assignments can take up to 10 minutes to propagate. Verify that the assignment is active before proceeding to the next step.

## Step 4: Create a storage container resource and storage asset

An Azure Discovery storage container resource and storage asset provide the link between the Knowledge base and the blob storage that holds your documents. The storage asset points to the specific blob container and uses the managed identity for authentication.

### Create a discovery storage container resource

1. In the Azure portal, select **Create a resource** and search for **Microsoft Discovery Storage Containers**.

1. Select **Create** to open the **Create Storage Container** form.

1. On the **Basics** tab, provide the following values:

   | Field | Description |
   |-------|-------------|
   | **Subscription** | The Azure subscription to use for the storage container resource. |
   | **Resource group** | Select the same resource group as your Bookshelf resource (for example, `mdqlabs-discovery-uksouth-v2`). |
   | **Name** | A name for the storage container resource, such as *bkshlfleukemiacontainer*. |
   | **Region** | Select the same region as your Bookshelf resource (for example, `UK South`). |
   | **Storage store** | Select **Azure Storage Blob**. |
   | **Storage account** | Select the storage account that contains your documents (for example, `bkshelfstorconuk`). |

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/create-storage-container-resource.png" alt-text="Screenshot that shows the Create Storage Container Basics tab with storage store and storage account fields." lightbox="media/how-to-index-bookshelf-knowledgebase/create-storage-container-resource.png":::

1. Select **Next** to continue to the **Storage asset** tab.

### Create a discovery storage asset resource

The **Storage asset** tab defines the specific data path within the storage account that the Bookshelf uses for indexing.

1. On the **Storage asset** tab, provide the following values:

   | Field | Description |
   |-------|-------------|
   | **Name** | A name for the storage asset, such as *leukemiacontainer*. |
   | **Data path** | The blob container name and optional subfolder path that contains your documents (for example, `leukemia-drug-discovery/papers/`). |
   | **Storage asset description** | A description of the dataset (for example, *Private dataset for Leukemia research*). |

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/create-storage-asset.png" alt-text="Screenshot that shows the Storage asset tab with name, data path, and description fields." lightbox="media/how-to-index-bookshelf-knowledgebase/create-storage-asset.png":::

1. Select **Review + create**, and then select **Create**.

## Step 5: Create a knowledge base

A knowledge base is the searchable index built from your documents. You create it within a Bookshelf using the Discovery Studio portal and associate it with your storage asset.

> [!NOTE]
> The **Resources** > **Knowledge** experience described in this step is retiring. For new bookshelves, use the in-project **AI Capabilities** > **Bookshelves** flow described in the **Discovery Studio** tab.

1. Navigate to the [Discovery Studio portal](https://studio.discovery.microsoft.com).

1. In the left menu under **Resources**, select **Knowledge**.

1. Select your Bookshelf from the **Bookshelf** dropdown (for example, `bkshlfleukemiaresearch`), and then select **+ Create new**.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/knowledgebase-list-create-new.png" alt-text="Screenshot that shows the Knowledge bases page in Discovery Studio with the Bookshelf selected and the Create new button highlighted." lightbox="media/how-to-index-bookshelf-knowledgebase/knowledgebase-list-create-new.png":::

1. On the first page of the **Create knowledge base** wizard, provide the following values:

   | Field | Description |
   |-------|-------------|
   | **Name** | A unique name for your knowledge base, such as *leukemiaresearchkb*. |
   | **Version** | The version number for this knowledge base (for example, `1`). |
   | **Description** | A description of the knowledge base content. The description is visible in the Discovery Studio. |
   | **Copilot instruction** | Instructions that the discovery agent uses to understand the capabilities of this knowledge base. Provide a description that helps the agent determine when to query this knowledge base. |
   | **Bookshelf** | The Bookshelf resource associated with this knowledge base (for example, `bkshlfleukemiaresearch`). |

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/knowledgebase-create-form.png" alt-text="Screenshot that shows the Create knowledge base form with name, version, description, copilot instruction, and bookshelf fields." lightbox="media/how-to-index-bookshelf-knowledgebase/knowledgebase-create-form.png":::

1. Select **Next**.

1. On the second page, configure the storage and identity settings:

   | Field | Description |
   |-------|-------------|
   | **Select Storage Container** | The storage container resource you created in Step 4. |
   | **Select Storage Asset** | The storage asset within the container that points to your documents. |
   | **User Assigned Identity** | The workload identity that the knowledge base uses to access the storage account. Select the same managed identity you configured in Step 1. |

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/knowledgebase-select-storage-identity.png" alt-text="Screenshot that shows the storage container, storage asset, and user assigned identity selection page in the Create knowledge base wizard." lightbox="media/how-to-index-bookshelf-knowledgebase/knowledgebase-select-storage-identity.png":::

1. Select **Create**.

## Step 6: Index the knowledge base

Indexing processes your documents through an enrichment pipeline (text extraction, chunking, embedding) and builds the LazyGraphRAG search index.

1. In Discovery Studio, open the knowledge base you created from **Resources** > **Knowledge**. The **Details** tab shows the knowledge base info, status, and linked assets. Verify that the **Status** shows **NotStarted** and **Provisioning State** shows **Succeeded**.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/knowledgebase-details-index-button.png" alt-text="Screenshot that shows the knowledge base details page in Discovery Studio with the Index button, Status, and Provisioning State highlighted." lightbox="media/how-to-index-bookshelf-knowledgebase/knowledgebase-details-index-button.png":::

1. Select the **Index** button. In the **Index Knowledge Base** dialog, select the project and node pool for the indexing run.

   | Field | Description |
   |-------|-------------|
   | **Select Project** | The Discovery project used for tracking the indexing tool run. |
   | **Select Node Pool** | The supercomputer node pool that provides compute for the indexing run. Choose a memory-optimized SKU based on your data size (see [resource quota requirements](#resource-quota-requirements)). |

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/knowledgebase-index-dialog.png" alt-text="Screenshot that shows the Index Knowledge Base dialog with Select Project and Select Node Pool dropdowns." lightbox="media/how-to-index-bookshelf-knowledgebase/knowledgebase-index-dialog.png":::

1. Select **Start Indexing** to begin the indexing operation.

   > [!NOTE]
   > The **Resources** > **Knowledge** indexing experience is retiring. For new bookshelves, use the **Discovery Studio** tab to create and index your bookshelf from **AI Capabilities** > **Bookshelves**.

## Step 7: Track indexing progress

After you start indexing, the knowledge base **Status** changes to **Running**. You can monitor the progress in Discovery Studio.

1. On the knowledge base details page, select **Refresh** to check the current status.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/knowledgebase-indexing-running.png" alt-text="Screenshot that shows the knowledge base details page with Status set to Running and the Refresh button highlighted." lightbox="media/how-to-index-bookshelf-knowledgebase/knowledgebase-indexing-running.png":::

1. When indexing finishes, the **Status** changes to **Succeeded**. Your knowledge base is now indexed and ready to use with a Discovery agent.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/knowledgebase-indexing-succeeded.png" alt-text="Screenshot that shows the knowledge base details page with Status set to Succeeded and Provisioning State set to Succeeded." lightbox="media/how-to-index-bookshelf-knowledgebase/knowledgebase-indexing-succeeded.png":::

# [Discovery Studio](#tab/studio)

Create the bookshelf and its knowledge base together by using the **New Bookshelf** wizard in your project, and then index it—all without switching to the Azure portal.

Prepare your source data and identity before you start the wizard. These prerequisites are the same storage prerequisites used by the Azure portal approach:

- Upload your documents to an Azure Blob Storage container. For details, see **Step 2** in the **Azure portal + Studio** tab.
- Create a Discovery storage container resource and a storage asset that points to your documents. For details, see **Step 4** in the **Azure portal + Studio** tab.
- Create a user-assigned managed identity and grant it the **Storage Blob Data Contributor** role on the storage account. For details, see **Step 3** in the **Azure portal + Studio** tab.

## Step 1: Create a bookshelf in Discovery Studio

1. Sign in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com) and open your project.

1. In the **Discovery** tab, select **AI Capabilities**, and then select **Bookshelves**.

1. Select **New Bookshelf**.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/studio-bookshelves-list.png" alt-text="Screenshot that shows the Bookshelves section of the AI Capabilities tab in Discovery Studio with the New Bookshelf button.":::

1. On the **1. Details** step, provide the following values, and then select **Next**:

   | Field | Description |
   |-------|-------------|
   | **Name** | A name for the bookshelf, such as *bkshlfleukemiaresearch*. |
   | **Bookshelf Azure resource** | Optional. If you already created a Bookshelf resource in Azure, select it here. Leave this field empty to have the wizard create a new Bookshelf resource and its knowledge base for you. Only bookshelves in your subscription and the project's region are listed. |
   | **Description** | A description of the bookshelf content. |
   | **Instructions for use** | Rules and guidelines that tell Discovery AI when to use this bookshelf (for example, *only reference this bookshelf when I ask about recent drug discoveries*). |

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/studio-create-bookshelf-details.png" alt-text="Screenshot that shows the Details step of the New Bookshelf wizard in Discovery Studio.":::

1. On the **2. Connect data** step, select the storage container that holds your documents and the managed identity that has access to the storage account. Select **Next**.

1. On the **3. Networking** step, configure how the bookshelf data plane endpoint is accessed. These options match the networking settings in the Azure portal:

   - **Public network access** — Enable or disable access to the data plane endpoint over the public internet.
   - **Private Endpoint Subnet** — The virtual network and subnet used for private connectivity to the bookshelf data plane.
   - **Search Subnet** — A separate subnet used by the managed AI Search service. The search subnet must be different from the private endpoint subnet.

   Select **Next**.

   > [!NOTE]
   > Provision a separate search subnet for each bookshelf. You can't share search subnets across bookshelves.

1. On the **4. Tags** step, optionally add name-value pairs to categorize the resource. For example, add the `indexSize` tag (`small`, `medium`, or `large`) to control the search infrastructure provisioned for the knowledge base. See the [resource quota requirements](#resource-quota-requirements) tables for the compute and memory allocated at each size. Select **Next**.

1. On the **5. Review + create** step, review your configuration, and then select **Create**.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/studio-create-bookshelf-review.png" alt-text="Screenshot that shows the Review step of the New Bookshelf wizard in Discovery Studio.":::

After the bookshelf is created, index it as described in the next step.

## Step 2: Index the bookshelf

Indexing processes your documents through an enrichment pipeline (text extraction, chunking, embedding) and builds the LazyGraphRAG search index.

1. In Discovery Studio, open the knowledge base you want to index. In your project, select **AI Capabilities** > **Bookshelves**, and then open the bookshelf. The **Details** tab shows the knowledge base info, status, and linked assets. Verify that the **Status** shows **NotStarted** and **Provisioning State** shows **Succeeded**.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/studio-bookshelf-index.png" alt-text="Screenshot that shows the bookshelf knowledge base details page in Discovery Studio with the Index button." lightbox="media/how-to-index-bookshelf-knowledgebase/studio-bookshelf-index.png":::

1. Select **Index**. In the **Index** dialog, optionally select a node pool, and then select **Index** to start the indexing run.

   | Field | Description |
   |-------|-------------|
   | **Node Pool** | Optional. The supercomputer node pool that provides compute for the indexing run. Choose a memory-optimized SKU based on your data size (see [resource quota requirements](#resource-quota-requirements)). |

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/studio-bookshelf-index-node-pool.png" alt-text="Screenshot that shows the Index dialog in Discovery Studio with the optional node pool selection." lightbox="media/how-to-index-bookshelf-knowledgebase/studio-bookshelf-index-node-pool.png":::

## Step 3: Track indexing progress

After you start indexing, the knowledge base **Status** changes to **Running**. You can monitor the progress in Discovery Studio.

1. Open the Bookshelf that you just indexed.

   :::image type="content" source="media/how-to-index-bookshelf-knowledgebase/studio-bookshelf-index-track.png" alt-text="Screenshot that shows the bookshelf details page with Status set to Succeeded." lightbox="media/how-to-index-bookshelf-knowledgebase/studio-bookshelf-index-track.png":::

1. When indexing finishes, the **Status** changes to **Succeeded**. Your knowledge base is now indexed and ready to use with a Discovery agent.
1. You can also edit the description, instructions, or data source by selecting the **Edit** button.

---

## Incremental enrichment and reindexing

After the initial indexing, you can add new documents to the source storage container and reindex the knowledge base. When you select the **Index** button again, the following behavior applies:

- **Incremental enrichment.** The enrichment pipeline processes only the newly added documents (text extraction). Previously enriched documents aren't reprocessed.
- **Full graph reindex.** The system rebuilds the GraphRAG search index from scratch using all text documents, including both the previously enriched and newly enriched content. Ensure that the selected node pool has sufficient memory for the complete dataset, not just the new documents.
- **Node pool selection.** You can select a different supercomputer node pool for the reindex operation. Choose a node pool size based on the total dataset size, not just the incremental additions.

> [!IMPORTANT]
> Deleting files from the source storage container isn't supported. If you need to remove documents from a knowledge base, create a new knowledge base with a fresh storage container that contains only the desired documents, and run a full enrichment and index.

## Related content

- [Query bookshelf knowledge base query logs](how-to-query-bookshelf-logs.md)
- [Query bookshelf indexing logs](how-to-query-bookshelf-indexing-logs.md)
- [Access resource logs for Microsoft Discovery resources](how-to-access-resource-logs.md)
- [Microsoft Discovery Bookshelf & Knowledge Bases](concept-bookshelf-knowledge-bases.md)
- [Managed identities in Microsoft Discovery](concept-managed-identities.md)
