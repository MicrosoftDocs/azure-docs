---
title: Search over encrypted Azure Blob storage content
titleSuffix: Azure Cognitive Search
description: Learn how to index and extract text from encrypted documents in Azure Blob Storage with Azure Cognitive Search.

manager: nitinme
author: careyjmac
ms.author: chalton
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/02/2020
---

# How to index encrypted blobs using blob indexers and skillsets in Azure Cognitive Search

This article shows how to use [Azure Cognitive Search](search-what-is-azure-search.md) to index documents that have been previously encrypted within [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md) using [Azure Key Vault](../key-vault/general/overview.md). Normally, an indexer cannot extract content from encrypted files because it doesn't have access to the encryption key. However, by leveraging the [DecryptBlobFile](https://github.com/Azure-Samples/azure-search-power-skills/blob/master/Utils/DecryptBlobFile) custom skill followed by the [DocumentExtractionSkill](cognitive-search-skill-document-extraction.md), you can provide controlled access to the key to decrypt the files and then have content extracted from them. This unlocks the ability to index these documents while never having to worry about your data being stored unencrypted at rest.

This guide uses Postman and the Search REST APIs to perform the following tasks:

> [!div class="checklist"]
> * Start with whole documents (unstructured text) such as PDF, HTML, DOCX, and PPTX in Azure Blob storage that have been encrypted using Azure Key Vault.
> * Define a pipeline that decrypts the documents and extracts text from them.
> * Define an index to store the output.
> * Execute the pipeline to create and load the index.
> * Explore results using full text search and a rich query syntax.

If you don't have an Azure subscription, open a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

This example assumes that you have already uploaded your files to Azure Blob Storage and have encrypted them in the process. If you need help with getting your files initially uploaded and encrypted, check out [this tutorial](../storage/blobs/storage-encrypt-decrypt-blobs-key-vault.md) for how to do so.

+ [Azure Storage](https://azure.microsoft.com/services/storage/)
+ [Azure Key Vault](https://azure.microsoft.com/services/key-vault/)
+ [Azure Function](https://azure.microsoft.com/services/functions/)
+ [Postman desktop app](https://www.getpostman.com/)
+ [Azure Cognitive Search](search-create-service-portal.md) on a [billable tier](search-sku-tier.md#tiers) (Basic or above, in any region)

## 1 - Create services and collect credentials

### Set up the custom skill

This example uses the sample [DecryptBlobFile](https://github.com/Azure-Samples/azure-search-power-skills/blob/master/Utils/DecryptBlobFile) project from the [Azure Search Power Skills](https://github.com/Azure-Samples/azure-search-power-skills) GitHub repository. In this section, you will deploy the skill to an Azure Function so that it can be used in a skillset. A built-in deployment script creates an Azure Function resource named starting with **psdbf-function-app-** and loads the skill. You'll be prompted to provide a subscription and resource group. Be sure to choose the same subscription that your Azure Key Vault instance lives in.

Operationally, the DecryptBlobFile skill takes the URL and SAS token for each blob as inputs, and it outputs the downloaded, decrypted file using the file reference contract that Azure Cognitive Search expects. Recall that DecryptBlobFile needs the encryption key to perform the decryption. As part of set up, you'll also create an access policy that grants DecryptBlobFile function access to the encryption key in Azure Key Vault.

1. Click the **Deploy to Azure** button found on the [DecryptBlobFile landing page](https://github.com/Azure-Samples/azure-search-power-skills/blob/master/Utils/DecryptBlobFile#deployment), which will open the provided Resource Manager template within the Azure portal.

1. Select **the subscription where your Azure Key Vault instance exists** (this guide will not work if you select a different subscription), and either select an existing resource group or create a new one (if you create a new one, you will also need to select a region to deploy to).

1. Select **Review + create**, make sure you agree to the terms, and then select **Create** to deploy the Azure Function.

    ![ARM template in portal](media/indexing-encrypted-blob-files/arm-template.jpg "ARM template in portal")

1. Wait for the deployment to finish.

1. Navigate to your Azure Key Vault instance in the portal. [Create an access policy](../key-vault/general/assign-access-policy-portal.md) in the Azure Key Vault that grants key access to the custom skill.
 
    1. Under **Settings**, select **Access policies**, and then select **Add access policy**
     
       ![Keyvault add access policy](media/indexing-encrypted-blob-files/keyvault-access-policies.jpg "Keyvault access policies")

    1. Under **Configure from template**, select **Azure Data Lake Storage or Azure Storage**.

    1. For the principal, select the Azure Function instance that you deployed. You can search for it using the resource prefix that was used to create it in step 2, which has a default prefix value of **psdbf-function-app**.

    1. Do not select anything for the authorized application option.
     
        ![Keyvault add access policy template](media/indexing-encrypted-blob-files/keyvault-add-access-policy.jpg "Keyvault access policy template")

    1. Be sure to click **Save** on the access policies page before navigating away to actually add the access policy.
     
         ![Keyvault save access policy](media/indexing-encrypted-blob-files/keyvault-save-access-policy.jpg "Save Keyvault access policy")

1. Navigate to the **psdbf-function-app** function in the portal, and make a note of the following properties as you will need them later in the guide:

    1. The function URL, which can be found under **Essentials** on the main page for the function.
    
        ![Function URL](media/indexing-encrypted-blob-files/function-uri.jpg "Where to find the Azure Function URL")

    1. The host key code, which can be found by navigating to **App keys**, clicking to show the **default** key, and copying the value.
     
        ![Function Host Key Code](media/indexing-encrypted-blob-files/function-host-key.jpg "Where to find the Azure Function host key code")

### Cognitive Services

AI enrichment and skillset execution are backed by Cognitive Services, including Text Analytics and Computer Vision for natural language and image processing. If your objective was to complete an actual prototype or project, you would at this point provision Cognitive Services (in the same region as Azure Cognitive Search) so that you can attach it to indexing operations.

For this exercise, however, you can skip resource provisioning because Azure Cognitive Search can connect to Cognitive Services behind the scenes and give you 20 free transactions per indexer run. After it processes 20 documents, the indexer will fail unless a Cognitive Services key is attached to the skillset. For larger projects, plan on provisioning Cognitive Services at the pay-as-you-go S0 tier. For more information, see [Attach Cognitive Services](cognitive-search-attach-cognitive-services.md). Note that a Cognitive Services key is required to run a skillset with more than 20 documents even if none of your selected cognitive skills connect to Cognitive Services (such as with the provided skillset if no skills are added to it).

### Azure Cognitive Search

The last component is Azure Cognitive Search, which you can [create in the portal](search-create-service-portal.md). You can use the Free tier to complete this guide. 

As with the Azure Function, take a moment to collect the admin key. Further on, when you begin structuring requests, you will need to provide the endpoint and admin api-key used to authenticate each request.

### Get an admin api-key and URL for Azure Cognitive Search

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the name of your search service. You can confirm your service name by reviewing the endpoint URL. If your endpoint URL were `https://mydemo.search.windows.net`, your service name would be `mydemo`.

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

On the **Variables** tab, you can add values that Postman swaps in every time it encounters a specific variable inside double braces. For example, Postman replaces the symbol `{{admin-key}}` with the current value that you set for `admin-key`. Postman makes the substitution in URLs, headers, the request body, and so on. 

To get the value for `admin-key`, use the Azure Cognitive Search admin api-key you noted earlier. Set `search-service-name` to the name of the Azure Cognitive Search service you are using. Set `storage-connection-string` by using the value on your storage account's **Access Keys** tab, and set `storage-container-name` to the name of the blob container on that storage account where the encrypted files are stored. Set `function-uri` to the Azure Function URL you noted before, and set `function-code` to the Azure Function host key code you noted before. You can leave the defaults for the other values.

![Postman app variables tab](media/indexing-encrypted-blob-files/postman-variables-window.jpg "Postman's variables window")


| Variable    | Where to get it |
|-------------|-----------------|
| `admin-key` | On the **Keys** page of the Azure Cognitive Search service.  |
| `search-service-name` | The name of the Azure Cognitive Search service. The URL is `https://{{search-service-name}}.search.windows.net`. | 
| `storage-connection-string` | In the storage account, on the **Access Keys** tab, select **key1** > **Connection string**. | 
| `storage-container-name` | The name of the blob container that has the encrypted files to be indexed. | 
| `function-uri` |  In the Azure Function under **Essentials** on the main page. | 
| `function-code` | In the Azure Function, by navigating to **App keys**, clicking to show the **default** key, and copying the value. | 
| `api-version` | Leave as **2020-06-30**. |
| `datasource-name` | Leave as **encrypted-blobs-ds**. | 
| `index-name` | Leave as **encrypted-blobs-idx**. | 
| `skillset-name` | Leave as **encrypted-blobs-ss**. | 
| `indexer-name` | Leave as **encrypted-blobs-ixr**. | 

### Review the request collection in Postman

When you run this guide, you must issue four HTTP requests: 

- **PUT request to create the index**: This index holds the data that Azure Cognitive Search uses and returns.
- **POST request to create the datasource**: This datasource connects your Azure Cognitive Search service to your storage account and therefore encrypted blob files. 
- **PUT request to create the skillset**: The skillset specifies the custom skill definition for the Azure Function that will decrypt the blob file data, and a [DocumentExtractionSkill](cognitive-search-skill-document-extraction.md) to extract the text from each document after it has been decrypted.
- **PUT request to create the indexer**: Running the indexer reads the data, applies the skillset, and stores the results. You must run this request last.

The [source code](https://github.com/Azure-Samples/azure-search-postman-samples/blob/master/index-encrypted-blobs/Index%20encrypted%20Blob%20files.postman_collection.json) contains a Postman collection that has the four requests, as well as some useful follow-up requests. To issue the requests, in Postman, select the tab for the requests and select **Send** for each of them.

## 3 - Monitor indexing

Indexing and enrichment commence as soon as you submit the Create Indexer request. Depending on how many documents are in your storage account, indexing can take a while. To find out whether the indexer is still running, use the **Get Indexer Status** request provided as part of the Postman collection and review the response to learn whether the indexer is running, or to view error and warning information.  

If you are using the Free tier, the following message is expected: `"Could not extract content or metadata from your document. Truncated extracted text to '32768' characters"`. This message appears because blob indexing on the Free tier has a [32K limit on character extraction](search-limits-quotas-capacity.md#indexer-limits). You won't see this message for this data set on higher tiers. 

## 4 - Search

After indexer execution is finished, you can run some queries to verify that the data has been successfully decrypted and indexed. Navigate to your Azure Cognitive Search service in the portal, and use the [search explorer](search-explorer.md) to run queries over the indexed data.

## Next steps

Now that you have successfully indexed encrypted files, you can [iterate on this pipeline by adding more cognitive skills](cognitive-search-defining-skillset.md). This will allow you to enrich and gain additional insights to your data.

If you are working with doubly encrypted data, you might want to investigate the index encryption features available in Azure Cognitive Search. Although the indexer needs decrypted data for indexing purposes, once the index exists, it can be encrypted using a customer-managed key. This will ensure that your data is always encrypted when at rest. For more information, see [Configure customer-managed keys for data encryption in Azure Cognitive Search](search-security-manage-encryption-keys.md).