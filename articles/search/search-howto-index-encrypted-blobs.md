---
title: 'Tutorial: Index encrypted blobs'
titleSuffix: Azure AI Search
description: Learn how to index and extract text from encrypted documents in Azure Blob Storage with Azure AI Search.

manager: nitinme
author: careyjmac
ms.author: chalton
ms.devlang: rest-api
ms.custom:
  - ignite-2023
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 01/28/2022
---

# Tutorial: Index and enrich encrypted blobs for full-text search in Azure AI Search

This tutorial shows you how to use [Azure AI Search](search-what-is-azure-search.md) to index documents that have been previously encrypted with a customer-managed key in [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md). 

Normally, an indexer can't extract content from encrypted files because it doesn't have access to the customer-managed encryption key in [Azure Key Vault](../key-vault/general/overview.md). However, by leveraging the [DecryptBlobFile custom skill](https://github.com/Azure-Samples/azure-search-power-skills/blob/main/Utils/DecryptBlobFile), followed by the [Document Extraction skill](cognitive-search-skill-document-extraction.md), you can provide controlled access to the key to decrypt the files and then extract content from them. This unlocks the ability to index and enrich these documents without compromising the encryption status of your stored documents.

Starting with previously encrypted whole documents (unstructured text) such as PDF, HTML, DOCX, and PPTX in Azure Blob Storage, this tutorial uses Postman and the Search REST APIs to perform the following tasks:

> [!div class="checklist"]
> + Define a pipeline that decrypts the documents and extracts text from them.
> + Define an index to store the output.
> + Execute the pipeline to create and load the index.
> + Explore results using full text search and a rich query syntax.

If you don't have an Azure subscription, open a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

+ [Azure AI Search](search-create-service-portal.md) on any tier or region.

+ [Azure Storage](https://azure.microsoft.com/services/storage/), Standard performance (general-purpose v2)

+ Blobs encrypted with a customer-managed key. See [Tutorial: Encrypt and decrypt blobs using Azure Key Vault](../storage/blobs/storage-encrypt-decrypt-blobs-key-vault.md) if you need to create sample data.

+ [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) in the same subscription as Azure AI Search. The key vault must have **soft-delete** and **purge protection** enabled.

+ [Postman app](https://www.postman.com/downloads/)

Custom skill deployment creates an Azure Function app and an Azure Storage account. Since these resources are created for you, they aren't listed as a prerequisite. When you're finished with this tutorial, remember to clean up the resources so that you aren't billed for services you're not using.

> [!NOTE]
> Skillsets often require [attaching an Azure AI multi-service resource](cognitive-search-attach-cognitive-services.md). As written, this skillset has no dependency on Azure AI services and thus no key is required. If you later add enrichments that invoke built-in skills, remember to update your skillset accordingly.

## 1 - Create services and collect credentials

### Deploy the custom skill

This example uses the sample [DecryptBlobFile](https://github.com/Azure-Samples/azure-search-power-skills/blob/main/Utils/DecryptBlobFile) project from the [Azure Search Power Skills](https://github.com/Azure-Samples/azure-search-power-skills) GitHub repository. In this section, you will deploy the skill to an Azure Function so that it can be used in a skillset. A built-in deployment script creates an Azure Function resource named starting with **psdbf-function-app-** and loads the skill. You'll be prompted to provide a subscription and resource group. Be sure to choose the same subscription that your Azure Key Vault instance lives in.

Operationally, the DecryptBlobFile skill takes the URL and SAS token for each blob as inputs, and it outputs the downloaded, decrypted file using the file reference contract that Azure AI Search expects. Recall that DecryptBlobFile needs the encryption key to perform the decryption. As part of setup, you'll also create an access policy that grants DecryptBlobFile function access to the encryption key in Azure Key Vault.

1. Click the **Deploy to Azure** button found on the [DecryptBlobFile landing page](https://github.com/Azure-Samples/azure-search-power-skills/blob/main/Utils/DecryptBlobFile#deployment), which will open the provided Resource Manager template within the Azure portal.

1. Choose the same subscription where your Azure Key Vault instance exists (this tutorial will not work if you select a different subscription).

1. Select an existing resource group or create a new one. A dedicated resource group makes cleanup easier later.

1. Select **Review + create**, make sure you agree to the terms, and then select **Create** to deploy the Azure Function.

    :::image type="content" source="media/indexing-encrypted-blob-files/arm-template.png" alt-text="Screenshot of the arm template page in Azure portal." border="true":::

1. Wait for the deployment to finish.

You should have an Azure Function app that contains the decryption logic and an Azure Storage resource that will store application data. In the next several steps, you'll give the app permissions to access the key vault and collect information that you'll need for the REST calls.

### Grant permissions in Azure Key Vault

1. Navigate to your Azure Key Vault service in the portal. [Create an access policy](../key-vault/general/assign-access-policy-portal.md) in the Azure Key Vault that grants key access to the custom skill.

1. On the left navigation pane, select **Access policies**, and then select **+ Create** to start the **Create an access policy** wizard.

    :::image type="content" source="media/indexing-encrypted-blob-files/keyvault-access-policies.png" alt-text="Screenshot of the Access Policy command in the left navigation pane." border="true":::

1. On the **Permissions** page under **Configure from template**, select **Azure Data Lake Storage or Azure Storage**.

1. Select **Next**.

1. On the **Principal** page, select the Azure Function instance that you deployed. You can search for it using the resource prefix that was used to create it in step 2, which has a default prefix value of **psdbf-function-app**.

1. Select **Next**.

1. On **Review + create**, select **Create**.

### Collect app information

1. Navigate to the **psdbf-function-app** function in the portal, and make a note of the following properties you'll need for the REST calls:

1. Get the function URL, which can be found under **Essentials** on the main page for the function.

    :::image type="content" source="media/indexing-encrypted-blob-files/function-uri.png" alt-text="Screenshot of the overview page and Essentials section of the Azure Function app." border="true":::

1. Get the host key code, which can be found by navigating to **App keys**, clicking to show the **default** key, and copying the value.

    :::image type="content" source="media/indexing-encrypted-blob-files/function-host-key.png" alt-text="Screenshot of the App Keys page of the Azure Function app." border="true":::

### Get an admin api-key and URL for Azure AI Search

1. Sign in to the [Azure portal](https://portal.azure.com), and in your search service **Overview** page, get the name of your search service. You can confirm your service name by reviewing the endpoint URL. If your endpoint URL were `https://mydemo.search.windows.net`, your service name would be `mydemo`.

2. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

   ![Get the service name and admin and query keys](media/search-get-started-javascript/service-name-and-keys.png)

All requests require an api-key in the header of every request sent to your service. A valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## 2 - Set up Postman

Install and set up Postman.

### Download and install Postman

1. Download the [Postman collection source code](https://github.com/Azure-Samples/azure-search-postman-samples/blob/master/index-encrypted-blobs/Index%20encrypted%20Blob%20files.postman_collection.json).

1. Select **File** > **Import** to import the source code into Postman.

1. Select the **Collections** tab, and then select the **...** (ellipsis) button.

1. Select **Edit**. 

   ![Postman app showing navigation](media/indexing-encrypted-blob-files/postman-edit-menu.jpg "Go to the Edit menu in Postman")

1. In the **Edit** dialog box, select the **Variables** tab. 

   ![Postman app variables tab](media/indexing-encrypted-blob-files/postman-variables-window.jpg "Postman's variables window")

1. On the **Variables** tab, provide the values that you've collected in the previous steps. Postman swaps in a value every time it encounters a specific variable inside double braces. For example, Postman replaces the symbol `{{admin-key}}` with the current value that you set for the search service admin API key.

    | Variable    | Where to get it |
    |-------------|-----------------|
    | `admin-key` | On the **Keys** page of the Azure AI Search service.  |
    | `search-service-name` | The name of the Azure AI Search service. The URL is `https://{{search-service-name}}.search.windows.net`. |
    | `storage-connection-string` | In the storage account, on the **Access Keys** tab, select **key1** > **Connection string**. |
    | `storage-container-name` | The name of the blob container that has the encrypted files to be indexed. |
    | `function-uri` |  In the Azure Function under **Essentials** on the main page. |
    | `function-code` | In the Azure Function, by navigating to **App keys**, clicking to show the **default** key, and copying the value. |
    | `api-version` | Leave as **2020-06-30**. |
    | `datasource-name` | Leave as **encrypted-blobs-ds**. |
    | `index-name` | Leave as **encrypted-blobs-idx**. |
    | `skillset-name` | Leave as **encrypted-blobs-ss**. |
    | `indexer-name` | Leave as **encrypted-blobs-ixr**. |

### Review and run each request

In this section, you'll issue four HTTP requests:

+ **PUT request to create the index**: This search index holds the data that Azure AI Search uses and returns.

+ **POST request to create the data source**: This data source specifies the connection to your storage account containing the encrypted blob files. 

+ **PUT request to create the skillset**: The skillset specifies the custom skill definition for the Azure Function that will decrypt the blob file data, and a [DocumentExtractionSkill](cognitive-search-skill-document-extraction.md) to extract the text from each document after it has been decrypted.

+ **PUT request to create the indexer**: Running the indexer retrieves the blobs, applies the skillset, and indexes and stores the results. You must run this request last. The custom skill in the skillset invokes the decryption logic.

To issue the requests, in Postman, select the tab for the requests and select **Send** for each of them.

## 3 - Monitor indexing

Indexing and enrichment commence as soon as you submit the Create Indexer request. Depending on how many documents are in your storage account, indexing can take a while. To find out whether the indexer is still running, use the **Get Indexer Status** request provided as part of the Postman collection and review the response to learn whether the indexer is running, or to view error and warning information.  

If you are using the Free tier, the following message is expected: `"Could not extract content or metadata from your document. Truncated extracted text to '32768' characters"`. This message appears because blob indexing on the Free tier has a [32K limit on character extraction](search-limits-quotas-capacity.md#indexer-limits). You won't see this message for this data set on higher tiers. 

## 4 - Search

After indexer execution is finished, you can run some queries to verify that the data has been successfully decrypted and indexed. Navigate to your Azure AI Search service in the portal, and use the [search explorer](search-explorer.md) to run queries over the indexed data.

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the All resources or Resource groups link in the left-navigation pane.

## Next steps

Now that you have successfully indexed encrypted files, you can [iterate on this pipeline by adding more cognitive skills](cognitive-search-defining-skillset.md). This will allow you to enrich and gain additional insights to your data.

If you are working with doubly encrypted data, you might want to investigate the index encryption features available in Azure AI Search. Although the indexer needs decrypted data for indexing purposes, once the index exists, it can be encrypted in a search index using a customer-managed key. This will ensure that your data is always encrypted when at rest. For more information, see [Configure customer-managed keys for data encryption in Azure AI Search](search-security-manage-encryption-keys.md).
