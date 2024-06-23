---
title: Attach Azure AI services to a skillset
titleSuffix: Azure AI Search
description: Learn how to attach an Azure AI multi-service resource to an AI enrichment pipeline in Azure AI Search.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/11/2024
---

# Attach an Azure AI multi-service resource to a skillset in Azure AI Search

When configuring an optional [AI enrichment pipeline](cognitive-search-concept-intro.md) in Azure AI Search, you can enrich a limited number of documents free of charge. For larger and more frequent workloads, you should attach a billable [**Azure AI multi-service resource**](../ai-services/multi-service-resource.md?pivots=azportal). 

A multi-service resource references a set of Azure AI services as the offering, rather than individual services, with access granted through a single API key. This key is specified in a [**skillset**](/rest/api/searchservice/create-skillset) and allows Microsoft to charge you for using these services:

+ [Azure AI Vision](../ai-services/computer-vision/overview.md) for image analysis and optical character recognition (OCR)
+ [Azure AI Language](../ai-services/language-service/overview.md) for language detection, entity recognition, sentiment analysis, and key phrase extraction
+ [Azure AI Speech](../ai-services/speech-service/overview.md) for speech to text and text to speech
+ [Azure AI Translator](../ai-services/translator/translator-overview.md) for machine text translation

> [!TIP]
> Azure provides infrastructure for you to monitor billing and budgets. For more information about monitoring Azure AI services, see [Plan and manage costs for Azure AI services](../ai-services/plan-manage-costs.md).

## Set the resource key

You can use the Azure portal, REST API, or an Azure SDK to attach a billable resource to a skillset.

If you leave the property unspecified, your search service attempts to use the free enrichments available to your indexer on a daily basis. Execution of billable skills stops at 20 transactions per indexer invocation and a "Time Out" message appears in indexer execution history.

### [**Azure portal**](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Create an [Azure AI multi-service resource](../ai-services/multi-service-resource.md?pivots=azportal) in the [same region](#same-region-requirement) as your search service.

1. Add the key to a skillset definition:

   + If using the [Import data wizard](search-import-data-portal.md), enter the key in the second step, "Add AI enrichments".

   + If adding the key to a new or existing skillset, provide the key in the **Azure AI services** tab.

   :::image type="content" source="media/cognitive-search-attach-cognitive-services/attach-existing2.png" alt-text="Screenshot of the key page." border="true":::

### [**REST**](#tab/cogkey-rest)

1. Create an [Azure AI multi-service resource](../ai-services/multi-service-resource.md?pivots=azportal) in the [same region](#same-region-requirement) as your search service.

1. Create or update a skillset, specifying `cognitiveServices` section in the body of the [skillset request](/rest/api/searchservice/create-skillset):

```http
PUT https://[servicename].search.windows.net/skillsets/[skillset name]?api-version=2020-06-30
api-key: [admin key]
Content-Type: application/json
{
    "name": "skillset name",
    "skills": 
    [
      {
        "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
        "categories": [ "Organization" ],
        "defaultLanguageCode": "en",
        "inputs": [
          {
            "name": "text", "source": "/document/content"
          }
        ],
        "outputs": [
          {
            "name": "organizations", "targetName": "organizations"
          }
        ]
      }
    ],
    "cognitiveServices": {
        "@odata.type": "#Microsoft.Azure.Search.CognitiveServicesByKey",
        "description": "mycogsvcs",
        "key": "<your key goes here>"
    }
}
```

### [**.NET SDK**](#tab/cogkey-csharp)

The following code snippet is from [azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/main/tutorial-ai-enrichment/v11/Program.cs), trimmed for brevity.

```csharp
IConfigurationBuilder builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
IConfigurationRoot configuration = builder.Build();

string searchServiceUri = configuration["SearchServiceUri"];
string adminApiKey = configuration["SearchServiceAdminApiKey"];
string cognitiveServicesKey = configuration["CognitiveServicesKey"];

SearchIndexerClient indexerClient = new SearchIndexerClient(new Uri(searchServiceUri), new AzureKeyCredential(adminApiKey));

// Create the skills
Console.WriteLine("Creating the skills...");
OcrSkill ocrSkill = CreateOcrSkill();
MergeSkill mergeSkill = CreateMergeSkill();

// Create the skillset
Console.WriteLine("Creating or updating the skillset...");
List<SearchIndexerSkill> skills = new List<SearchIndexerSkill>();
skills.Add(ocrSkill);
skills.Add(mergeSkill);

SearchIndexerSkillset skillset = CreateOrUpdateDemoSkillSet(indexerClient, skills, cognitiveServicesKey);
```

---

## Remove the key

Enrichments are billable operations. If you no longer need to call Azure AI services, follow these instructions to remove the multi-region key and prevent use of the external resource. Without the key, the skillset reverts to the default allocation of 20 free transactions per indexer, per day. Execution of billable skills stops at 20 transactions and a "Time Out" message appears in indexer execution history when the allocation is used up.

### [**Azure portal**](#tab/portal-remove)

1. Sign in to the [Azure portal](https://portal.azure.com) and open the search service **Overview** page.

1. Under **Skillsets**, select the skillset containing the key you want to remove.

   :::image type="content" source="media/cognitive-search-attach-cognitive-services/select-skillset.png" alt-text="Screenshot of the skillset page." border="true" lightbox="media/cognitive-search-attach-cognitive-services/select-skillset.png":::

1. Scroll to the end of the file. 

1. Remove the key from the JSON and save the skillset.

   :::image type="content" source="media/cognitive-search-attach-cognitive-services/remove-key-save.png" alt-text="Screenshot of the skillset JSON." border="true" lightbox="media/cognitive-search-attach-cognitive-services/remove-key-save.png":::

### [**REST**](#tab/cogkey-rest-remove)

1. [Get Skillset](/rest/api/searchservice/get-skillset) so that you have the full definition.

1. Formulate an [Update Skillset](/rest/api/searchservice/update-skillset) request, providing the JSON definition of the skillset.

1. Remove the key in the body of the definition, and then send the request:

    ```http
    PUT https://[servicename].search.windows.net/skillsets/[skillset name]?api-version=2020-06-30
    api-key: [admin key]
    Content-Type: application/json
    {
        "name": "skillset name",
        "skills": 
        [
          {
            "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
            "categories": [ "Organization" ],
            "defaultLanguageCode": "en",
            "inputs": [
              {
                "name": "text", "source": "/document/content"
              }
            ],
            "outputs": [
              {
                "name": "organizations", "targetName": "organizations"
              }
            ]
          }
        ],
        "cognitiveServices": {
            "@odata.type": "#Microsoft.Azure.Search.CognitiveServicesByKey",
            "description": "mycogsvcs",
            "key": ""
        }
    }
    ```

    Alternatively, you can set "cognitiveServices" to null:

    ```json
    "cognitiveServices": null,
    ```

---

<a name="same-region-requirement"></a>

## How the key is used

Key-based billing applies when API calls to Azure AI services resources exceed 20 API calls per indexer, per day. 

The key is used for billing, but not for enrichment operations' connections. For connections, a search service [connects over the internal network](search-security-overview.md#internal-traffic) to an Azure AI services resource that's located in the [same physical region](https://azure.microsoft.com/global-infrastructure/services/?products=search). Most regions that offer Azure AI Search also offer other Azure AI services such as Language. If you attempt AI enrichment in a region that doesn't have both services, you'll see this message: "Provided key isn't a valid CognitiveServices type key for the region of your search service."

Currently, billing for [built-in skills](cognitive-search-predefined-skills.md) requires a public connection from Azure AI Search to another Azure AI service. Disabling public network access breaks billing. If disabling public networks is a requirement, you can configure a [Custom Web API skill](cognitive-search-custom-skill-interface.md) implemented with an [Azure Function](cognitive-search-create-custom-skill-example.md) that supports [private endpoints](../azure-functions/functions-create-vnet.md) and add the [Azure AI services resource to the same VNET](../ai-services/cognitive-services-virtual-networks.md). In this way, you can call Azure AI services resource directly from the custom skill using private endpoints.

> [!NOTE]
> Some built-in skills are based on non-regional Azure AI services (for example, the [Text Translation Skill](cognitive-search-skill-text-translation.md)). Using a non-regional skill means that your request might be serviced in a region other than the Azure AI Search region. For more information on non-regional services, see the [Azure AI services product by region](https://aka.ms/allinoneregioninfo) page.

### Key requirements special cases

[Custom Entity Lookup](cognitive-search-skill-custom-entity-lookup.md) is metered by Azure AI Search, not Azure AI services, but it requires an Azure AI multi-service resource key to unlock transactions beyond 20 per indexer, per day. For this skill only, the resource key unblocks the number of transactions, but is unrelated to billing.

## Free enrichments

AI enrichment offers a small quantity of free processing  of billable enrichments so that you can complete short exercises without having to attach an Azure AI multi-service resource. Free enrichments are 20 documents per day, per indexer. You can [reset the indexer](search-howto-run-reset-indexers.md) to reset the counter if you want to repeat an exercise.

Some enrichments are always free: 

+ Utility skills that don't call Azure AI services (namely, [Conditional](cognitive-search-skill-conditional.md), [Document Extraction](cognitive-search-skill-document-extraction.md), [Shaper](cognitive-search-skill-shaper.md), [Text Merge](cognitive-search-skill-textmerger.md), and [Text Split skills](cognitive-search-skill-textsplit.md)) aren't billable.

+ Text extraction from PDF documents and other application files is nonbillable. Text extraction, which occurs during the [document cracking](search-indexer-overview.md#document-cracking), isn't an AI enrichment, but it occurs during AI enrichment and is thus noted here.

## Billable enrichments

 During AI enrichment, Azure AI Search calls the Azure AI services APIs for [built-in skills](cognitive-search-predefined-skills.md) that are based on Azure AI Vision, Translator, and Azure AI Language. 

Billable built-in skills that make backend calls to Azure AI services include [Entity Linking](cognitive-search-skill-entity-linking-v3.md), [Entity Recognition](cognitive-search-skill-entity-recognition-v3.md), [Image Analysis](cognitive-search-skill-image-analysis.md), [Key Phrase Extraction](cognitive-search-skill-keyphrases.md), [Language Detection](cognitive-search-skill-language-detection.md), [OCR](cognitive-search-skill-ocr.md), [Personally Identifiable Information (PII) Detection](cognitive-search-skill-pii-detection.md), [Sentiment](cognitive-search-skill-sentiment-v3.md), and [Text Translation](cognitive-search-skill-text-translation.md).

Image extraction is an Azure AI Search operation that occurs when documents are cracked prior to enrichment. Image extraction is billable on all tiers, except for 20 free daily extractions on the free tier. Image extraction costs apply to image files inside blobs, embedded images in other files (PDF and other app files), and for images extracted using [Document Extraction](cognitive-search-skill-document-extraction.md). For image extraction pricing, see the [Azure AI Search pricing page](https://azure.microsoft.com/pricing/details/search/).

> [!TIP]
> To lower the cost of skillset processing, enable [incremental enrichment (preview)](cognitive-search-incremental-indexing-conceptual.md) to cache and reuse any enrichments that are unaffected by changes made to a skillset. Caching requires Azure Storage (see [pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) but the cumulative cost of skillset execution is lower if existing enrichments can be reused, especially for skillsets that use image extraction and analysis.

## Example: Estimate costs

To estimate the costs associated with Azure AI Search indexing, start with an idea of what an average document looks like so you can run some numbers. For example, you might approximate:

+ 1,000 PDFs.
+ Six pages each.
+ One image per page (6,000 images).
+ 3,000 characters per page.

Assume a pipeline that consists of document cracking of each PDF, image and text extraction, optical character recognition (OCR) of images, and entity recognition of organizations.

The prices shown in this article are hypothetical. They're used to illustrate the estimation process. Your costs could be lower. For the actual price of transactions, see [Azure AI services pricing](https://azure.microsoft.com/pricing/details/cognitive-services).

1. For document cracking with text and image content, text extraction is currently free. For 6,000 images, assume $1 for every 1,000 images extracted. That's a cost of $6.00 for this step.

1. For OCR of 6,000 images in English, the OCR cognitive skill uses the best algorithm (DescribeText). Assuming a cost of $2.50 per 1,000 images to be analyzed, you would pay $15.00 for this step.

1. For entity extraction, you'd have a total of three text records per page. Each record is 1,000 characters. Three text records per page multiplied by 6,000 pages equal 18,000 text records. Assuming $2.00 per 1,000 text records, this step would cost $36.00.

Putting it all together, you'd pay about $57.00 to ingest 1,000 PDF documents of this type with the described skillset.

## Next steps

+ [Azure AI Search pricing page](https://azure.microsoft.com/pricing/details/search/)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
