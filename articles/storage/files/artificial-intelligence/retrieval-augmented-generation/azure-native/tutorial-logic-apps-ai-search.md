---
title: Build a RAG pipeline using Azure Files with Logic Apps and AI Search
description: Learn how to build a no-code retrieval-augmented generation (RAG) pipeline that indexes documents from Azure Files using Azure Logic Apps, Azure OpenAI, and Azure AI Search.
author: ftrichardson1
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 04/15/2026
ms.author: t-flynnr
---

# Tutorial: Build a RAG pipeline using Azure Files with Logic Apps and AI Search

**Applies to:** ✔️ SMB file shares

In this tutorial, you build a no-code retrieval-augmented generation (RAG) pipeline over documents in Azure Files using the [Import data wizard](/azure/search/search-import-data-portal) in Azure AI Search. The wizard provisions a Consumption-plan Azure Logic Apps workflow that:

1. Reads files from your Azure file share and chunks each one.
2. Sends each chunk to Azure OpenAI for embedding.
3. Writes the embedded chunks to an Azure AI Search index.

You then query the index in the [Azure AI Foundry](/azure/ai-studio/what-is-ai-studio) chat playground, which retrieves relevant chunks and generates answers grounded in your file share data.

> [!IMPORTANT]
> The Azure Files indexer used by the Import data wizard is in **public preview**. Use it for evaluation and prototyping, not for production workloads. See [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- An [Azure Storage account](/azure/storage/common/storage-account-create) with an SMB Azure file share that contains the documents you want to index. The Azure File Storage connector the wizard uses is SMB-only, so [NFS isn't supported](/azure/search/search-file-storage-integration#prerequisites).
- Permission to create role assignments in your Azure subscription. The simplest option is the [**Owner**](/azure/role-based-access-control/built-in-roles/privileged#owner) role. If you only have [**Contributor**](/azure/role-based-access-control/built-in-roles/privileged#contributor), you'll also need a role that lets you assign roles to others, such as [**User Access Administrator**](/azure/role-based-access-control/built-in-roles/privileged#user-access-administrator) or [**Role Based Access Control Administrator**](/azure/role-based-access-control/built-in-roles/privileged#role-based-access-control-administrator). To check your role, in the Azure portal go to **Subscriptions**, select your subscription, and select **Access control (IAM)** > **View my access**.

> [!IMPORTANT]
> In this tutorial, the Logic App, Azure AI Search, and Azure OpenAI resources you create must all be in the **same Azure subscription** for [managed identity authentication](/azure/logic-apps/authenticate-with-managed-identity#prerequisites) to work.

> [!NOTE]
> This tutorial provisions billed services: Azure AI Search (Basic tier minimum), Azure OpenAI embeddings and chat completions, and a Consumption-plan Logic App. Estimate costs with the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) before you start, and use the [Clean up resources](#clean-up-resources) step when you're done.

## Region compatibility

The wizard creates the Logic App in the **same region** as your AI Search resource, which must be one of the [supported regions](/azure/search/search-how-to-index-logic-apps#supported-regions). Azure OpenAI and the storage account can be in different regions.

The following table shows wizard regions that also host the embedding and chat models used here via Global Standard deployment. **Verified April 2026.** Model availability changes, so reconfirm against the following sources before you choose a region:

- Wizard regions: [Logic Apps indexer supported regions](/azure/search/search-how-to-index-logic-apps#supported-regions).
- Embedding model availability: [Azure OpenAI embedding models](/azure/ai-services/openai/concepts/models#embeddings).
- Chat model availability: [Azure OpenAI gpt-4o / gpt-4o-mini model availability](/azure/ai-services/openai/concepts/models#gpt-4o-and-gpt-4o-mini).

| Region | Wizard | OpenAI embeddings | gpt-4o / gpt-4o-mini |
| :--- | :---: | :---: | :---: |
| East US | ✅ | ✅ | ✅ |
| East US 2 | ✅ | ✅ | ✅ |
| South Central US | ✅ | ✅ | ✅ |
| West US 3 | ✅ | ✅ | ✅ |
| Brazil South | ✅ | ✅ | ✅ |
| Australia East | ✅ | ✅ | ✅ |
| Sweden Central | ✅ | ✅ | ✅ |
| UK South | ✅ | ✅ | ✅ |

Other wizard regions (for example, West US 2, East Asia, Southeast Asia, North Europe) don't co-locate Azure OpenAI models. Deploy Azure OpenAI in a nearby supported region if needed.

## Step 1: Create an Azure OpenAI resource and deploy an embedding model

Azure OpenAI provides the embedding and chat completion models used in this tutorial.

### Create the resource

Follow [Create and deploy an Azure OpenAI resource](/azure/ai-services/openai/how-to/create-resource#create-a-resource) with these tutorial-specific settings:

- **Region**: Select one where at least one [supported embedding model](/azure/search/search-how-to-index-logic-apps#supported-models) (`text-embedding-3-small`, `text-embedding-3-large`, or `text-embedding-ada-002`) is available. See [Azure OpenAI models](/azure/ai-services/openai/concepts/models) for regional availability.

- **Network**: Select **All networks**. The wizard creates a Consumption-plan Logic App, which [doesn't support private endpoints](/azure/search/search-how-to-index-logic-apps#limitations), so **Disabled** won't work. To restrict access after setup, see [Configure network security for Azure OpenAI](/azure/ai-services/openai/how-to/create-resource#configure-network-security).

### Enable the system-assigned managed identity

The role assignments in Step 2 require Azure OpenAI to have a system-assigned managed identity.

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure OpenAI resource.
1. Expand **Resource Management** in the left navigation and select **Identity**.

1. Under **System assigned**, set **Status** to **On** and select **Save**.

### Assign the Cognitive Services OpenAI User role to yourself

This role lets your account call the chat completion and embedding APIs from the Foundry playground in Step 6.

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure OpenAI resource.
1. Select **Access control (IAM)** from the left navigation, then select **Add** > **Add role assignment**.

1. Search for **Cognitive Services OpenAI User**, select it, and select **Next**.

1. On the **Members** tab, leave **User, group, or service principal** selected and select **+ Select members**.
1. In the **Select members** pane, type your name or work email, select your account from the results, and then select **Select**.
1. Select **Review + assign**.

> [!NOTE]
> If you later get a `PermissionDenied` error in the Foundry chat playground, the error message includes the principal ID that needs this role.

### Deploy the embedding model

1. From your Azure OpenAI resource, select **Go to Azure AI Foundry portal**.

1. In the Foundry portal left navigation, select **Deployments**.

1. Select **+ Deploy model** > **Deploy base model**.

1. Search for `text` and select one of the [supported embedding models](/azure/search/search-how-to-index-logic-apps#supported-models). This tutorial uses `text-embedding-3-small`.

1. Select **Confirm**.

1. Accept the default deployment name and deployment type (typically **Global Standard**), and select **Deploy**.

> [!IMPORTANT]
> Record the deployment name. You need it when you run the Import data wizard. You can't change the embedding model later without re-indexing. For guidance on changing models, see [Customize the index or workflow after creation](/azure/search/search-how-to-index-logic-apps#modify-existing-objects).

## Step 2: Create an Azure AI Search resource

Follow [Create an Azure AI Search service in the Azure portal](/azure/search/search-create-service-portal) with these tutorial-specific settings:

- **Region**: Select one of the [wizard-supported regions](#region-compatibility).

  > [!IMPORTANT]
  > If your storage account has firewall rules, choose a region **different** from your storage account's region. Otherwise, the Logic App can't reach the file share. For more information, see [Access storage accounts behind firewalls](/azure/connectors/connectors-create-api-azureblobstorage#access-storage-accounts-behind-firewalls). The same managed-connector firewall guidance applies to Azure File Storage.

- **Pricing tier**: Select **Basic** or higher. [Basic is the minimum supported tier](/azure/search/search-how-to-index-logic-apps#prerequisites) for the Import data wizard's Logic Apps integration. See [service limits](/azure/search/search-limits-quotas-capacity) and [pricing](https://azure.microsoft.com/pricing/details/search/).

- **Networking**: Keep the default **public endpoint**. The Consumption-plan Logic App doesn't support private endpoints.

> [!NOTE]
> The wizard and the role assignments in this step cover two different identities. The wizard creates *ingestion-time* role assignments for the **Logic App's** system-assigned identity (so it can write to the index and call Azure OpenAI embeddings). The roles you assign below are *query-time* role assignments for the **Azure OpenAI** managed identity (so Foundry can read the index on your behalf). If indexing or query later fails, check **Access control (IAM)** on both resources to confirm the expected identity has the expected role.

### Enable the system-assigned managed identity

1. In the [Azure portal](https://portal.azure.com), navigate to your AI Search resource.
1. Expand **Settings** in the left navigation and select **Identity**.

1. Under **System assigned**, set **Status** to **On** and select **Save**.

### Enable role-based access control (RBAC)

This tutorial configures Foundry to reach the index with a managed identity, which requires RBAC on AI Search. Selecting **Both** also keeps API keys available for troubleshooting.

1. Under **Settings**, select **Keys**.

1. Under **API Access control**, select **Both**, then select **Yes** to confirm.

### Grant Azure OpenAI access to AI Search

Assign two roles on AI Search to Azure OpenAI's managed identity. This pairing is the [recommended](/azure/ai-services/openai/how-to/on-your-data-configuration#role-assignments) configuration for Foundry's "On Your Data" managed-identity flow:

- **Search Service Contributor**: Lets the inference service read the index **schema** for auto field mapping. Without read access to the index definition, Foundry can fail with a 403 on `GET /indexes/{name}`.
- **Search Index Data Reader**: Lets the inference service read the index **data** at query time.

You also need **Search Index Data Reader** on your own account so you can query the index directly for troubleshooting (see [Verify the index](#verify-the-index)).

Assign each role using the following steps. The screenshots walk through **Search Index Data Reader** as the example. Use the same flow for **Search Service Contributor**.

1. On the AI Search resource, select **Access control (IAM)** from the left navigation, then select **+ Add** > **Add role assignment**.

1. Search for and select the role (**Search Service Contributor** or **Search Index Data Reader**), then select **Next**.

1. For **Assign access to**, select **Managed identity**, then select **+ Select members**. In the **Managed identity** dropdown, select **Azure OpenAI**, select your Azure OpenAI resource, and select **Select**. Select **Next**.

1. Confirm the Azure OpenAI resource appears in the members table, then select **Review + assign**.

1. Repeat the previous steps for the other role.
1. Repeat once more to assign **Search Index Data Reader** to **yourself**. When you select members, choose **User, group, or service principal** instead of **Managed identity**, search for your account, and select **Select**. Then select **Review + assign**.

## Step 3: Get your storage account access key and file endpoint

The [Azure File Storage connector](/connectors/azurefile/) doesn't support managed identity, so you need an access key and the file endpoint URL.

1. In the Azure portal, go to your storage account.

1. Expand **Security + networking** in the left navigation and select **Access keys**.

1. Under **key1**, select **Show** next to **Key** and copy the value. Store it securely. You use it in Step 4.

1. Expand **Settings** in the left navigation and select **Endpoints**.

1. Under **File service**, copy the URL (for example, `https://mystorageaccount.file.core.windows.net/`).

## Step 4: Import data with the wizard

1. Go to your AI Search resource and, on the **Overview** page, select **Import data**.

1. Under **Choose a data source**, select **Azure File Storage (using Azure Logic Apps)**.

1. Provide the storage account file endpoint and access key you copied in Step 3.

1. Enter a name prefix. It's applied to both the index and the Logic App.

1. For **Indexing frequency**, select **On a schedule**.

1. For authentication between the Logic App and AI Search, select the **Logic App's system-assigned managed identity** option. The wizard creates the Logic App's ingestion-time role assignments on AI Search and Azure OpenAI for you (separate from the query-time roles you assigned to the Azure OpenAI identity in Step 2).
1. Select **Next**.

### Vectorize your text

1. Select your Azure OpenAI subscription and resource.
1. Select your embedding deployment (for example, `text-embedding-3-small`).
1. For authentication, select **system-assigned managed identity**.
1. Select **Next**.

### Review and create

1. If the wizard offers [semantic ranking](/azure/search/semantic-search-overview), enable it. Foundry uses the resulting semantic configuration for better relevance.
1. Review the summary and select **Create**.

The wizard creates a search index and a Consumption-plan Logic App (both named with your prefix). Select **Continue in Logic Apps** in the success dialog to proceed to the template setup.

### Complete the Azure File Storage connection

The wizard provisions the AI Search and Azure OpenAI connections automatically, but the Azure File Storage connection must be added manually before the workflow can run.

1. In the **Templates** pane that opens after creation, locate the **Vectorize files on a schedule from Azure File to AI Search** template. The **Azure File Storage** connection appears as **Not connected**.

1. Select **Use this template**.

1. On the **Connections** tab of the **Update workflow from template** pane, select **Connect** next to **Azure File Storage**.

1. In the **Azure File Storage connection** form, enter your storage account file endpoint and access key from Step 3, then select **Add connection**.

1. Confirm all three connections show **Connected**, then select **Next**.

1. On the **Parameters** tab, set **Azure File folder name** to the path of the folder on your file share that contains the documents you want to index. Use the folder picker on the right if needed.

1. Leave the other parameters at their defaults and select **Next**.

1. On the **Review + update** tab, select **Update** to save the workflow.

### Verify the index

Indexing begins automatically after the wizard finishes. Duration depends on file count and size. A few files typically index in under a minute, while larger shares may take 10–30 minutes or span multiple runs if the connector hits its [throttling limits](/connectors/azurefile/#throttling-limits).

1. From the [Azure portal](https://portal.azure.com), open your AI Search service.
1. Expand **Search management** in the left navigation and select **Indexes**.

1. Confirm the **Document count** for the new index is greater than zero, then select the index name. If the count is zero, check the Logic App's **Runs history** for errors.

1. Select the **Search explorer** tab and run a test query (for example, `*` to return all documents, or a keyword from your content). Hits here confirm indexing works before you troubleshoot anything in Foundry.

## Step 5: Verify or add a semantic configuration

Foundry's default search experience uses a semantic configuration.

1. On the index, select the **Fields** tab and note the field names the wizard generated. A typical wizard-generated schema looks like:

   | Field name | Type | Purpose | Use as |
   | :--- | :--- | :--- | :--- |
   | `chunk_id` | `Edm.String` (key) | Chunk identifier | — |
   | `parent_id` | `Edm.String` | Source document identifier | — |
   | `chunk` | `Edm.String` | Extracted text chunk | **Content field** |
   | `title` or `metadata_storage_name` | `Edm.String` | File name | **Title field** |
   | `text_vector` | `Collection(Edm.Single)` | Vector embedding | — |

1. Select the **Semantic configurations** tab.

   - If a semantic configuration is already listed, you're done with this step. Continue to [Step 6](#step-6-chat-with-your-documents-in-azure-ai-foundry).
   - If none is listed, select **+ Add semantic configuration** and continue with the next step.

1. In the **New semantic configuration** pane, enter the following values (using the field names you noted in the **Fields** tab), then select **Save**:

   - **Name**: `default`
   - **Title field**: the field marked **Title field** in the table above (`title` or `metadata_storage_name`).
   - **Content fields**: the field marked **Content field** in the table above (`chunk`, or `content` if your schema uses that name).
   - **Keyword fields**: leave empty.

## Step 6: Chat with your documents in Azure AI Foundry

### Open the chat playground

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure OpenAI resource and select **Go to Azure AI Foundry portal**.
1. In the Foundry portal, select **Playgrounds** > **Chat**.

### Deploy a chat completion model

If you already deployed a chat completion model, skip to [Connect your index](#connect-your-index).

1. Under **Setup**, in the **Deployment** section, expand the dropdown.

1. Select **+ Create new deployment** > **From base models**.

1. Search for `gpt` and select a [chat completion model](/azure/ai-services/openai/concepts/models) (this tutorial uses `gpt-4o-mini`).

1. Select **Confirm**.

1. Accept the default deployment name and deployment type (typically **Global Standard**), then select **Deploy**.

### Connect your index

1. Under **Setup**, expand **Add your data** and select **+ Add a data source**.

1. From the **Select data source** dropdown, select **Azure AI Search**.

1. Select your subscription, AI Search service, and the index you created in Step 4, then select **Next**.

1. For **Search type**, select **Semantic** to use the `default` semantic configuration from Step 5, then select **Next**.

1. For **Azure resource authentication type**, select **System assigned managed identity**, then select **Next**. This uses the role assignments you configured in Step 2 (`Search Service Contributor` + `Search Index Data Reader` for the Azure OpenAI managed identity).

   > [!NOTE]
   > Managed identity is the recommended authentication path. Because you selected **Both** under AI Search **API access control** in Step 2, **API key** also works if you choose that option in Foundry. For more information, see [Azure OpenAI On Your Data authentication options](/azure/ai-foundry/openai/concepts/use-your-data#data-connection).

1. Review the configuration and select **Save and close**.

1. Confirm the data source, search resource, and index appear under **Add your data** in the **Setup** pane.

### Ask a question

1. (Optional) Under **Give the model instructions and context**, replace the default system prompt with one that instructs the model to ground its answers and cite sources, for example: `Answer the question based on the context below. Be specific and cite the source file name in brackets for each fact.` Then select **Apply changes**.

1. In the chat box, ask a question about your documents. Foundry retrieves relevant chunks and returns a grounded answer with citations.

## Troubleshooting

| Symptom | Likely cause | Fix |
| :--- | :--- | :--- |
| Document count is **zero** after the wizard finishes | Logic App run failed, folder path is wrong, or connector is still waiting for its first scheduled run | Open the Logic App, check **Runs history** for the latest run's error, and confirm the **Azure File folder name** parameter points to a folder that contains files. |
| `PermissionDenied` in the Foundry chat playground | The signed-in user doesn't have **Cognitive Services OpenAI User** on the Azure OpenAI resource | Assign the role as described in [Step 1](#step-1-create-an-azure-openai-resource-and-deploy-an-embedding-model). The error message includes the principal ID that needs it. |
| `403` from Foundry on `GET /indexes/{name}` | Azure OpenAI's managed identity can't read the index definition on AI Search | Assign **Search Service Contributor** (recommended) to the Azure OpenAI managed identity, or use the minimum permissions in the [On Your Data role-assignments guidance](/azure/ai-services/openai/how-to/on-your-data-configuration#role-assignments). See [Step 2](#step-2-create-an-azure-ai-search-resource). |
| Foundry returns answers but without citations | Query is hitting the index with the wrong search type or semantic configuration | In the Foundry data source settings, confirm **Semantic** is selected and the configuration name matches the one from [Step 5](#step-5-verify-or-add-a-semantic-configuration). |
| Connector run fails with a throttling error | Share exceeds the Azure File Storage connector's per-connection rate or volume limits | Let the scheduled run retry, or split the share into smaller folders. See the current [connector throttling limits](/connectors/azurefile/#throttling-limits) for exact values. |
| Duplicate documents in the index | Known limitation of the current preview | Re-create the index, or [delete the duplicate documents](/azure/search/search-how-to-delete-documents) via the Search REST API. |
| Larger files aren't indexed | The wizard-generated workflow passes file content to the Logic Apps **Parse document** and **Chunk document** actions, which have their own per-file size limits | Split or preprocess larger files before placing them on the share. Verify the current limits for the [Parse document](/azure/logic-apps/parse-document-chunk-text) and [chunking](/connectors/azurefile/#actions-that-support-chunking-feature) actions against your file sizes during testing. |

## Clean up resources

To avoid ongoing charges, delete the resource group that contains the resources you created in this tutorial (the AI Search service, the Azure OpenAI resource, and the Logic App). If you created them in separate resource groups, delete each one.

First, confirm you're targeting the correct subscription:

```azurecli
az account show --query "{name:name, id:id}" -o table
```

If needed, switch subscriptions with `az account set --subscription <subscription-id>`. Then list the resource groups that match your tutorial prefix to confirm the exact name before you delete:

```azurecli
az group list --query "[?contains(name, '<your-prefix>')].name" -o tsv
```

Replace `<your-prefix>` with the prefix you chose in Step 4. Then delete the resource group:

```azurecli
az group delete --name <your-resource-group> --yes --no-wait
```

> [!WARNING]
> Don't delete the resource group that contains your storage account unless you also want to delete the file share and its contents. If the file share is shared infrastructure, confirm with your administrator first.

## Known limitations

- Fixed index schema (document ID, content, and vectorized content), with text extraction only. You can modify the index as long as the update doesn't affect existing fields. See [Limitations](/azure/search/search-how-to-index-logic-apps#limitations).
- Text embeddings only (no image embeddings).
- No deletion detection. Manually [delete orphaned documents](/azure/search/search-how-to-delete-documents#delete-a-single-document) from the index.

## Related content

- [What is retrieval-augmented generation?](../overview.md)
- [Use an Azure Logic Apps workflow for automated indexing in Azure AI Search](/azure/search/search-how-to-index-logic-apps)
- [Customize the index or workflow after creation](/azure/search/search-how-to-index-logic-apps#modify-existing-objects)
- [Index data from Azure Files](/azure/search/search-file-storage-integration) (REST API alternative)
