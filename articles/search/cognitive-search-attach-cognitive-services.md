---
title: Attach Cognitive Services to a skillset
titleSuffix: Azure Cognitive Search
description: Learn how to attach a multi-service Cognitive Services resource to an AI enrichment pipeline in Azure Cognitive Search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 09/16/2022

---

# Attach a Cognitive Services resource to a skillset in Azure Cognitive Search

When configuring an optional [AI enrichment pipeline](cognitive-search-concept-intro.md) in Azure Cognitive Search, you can enrich a limited number of documents free of charge. For larger and more frequent workloads, you should attach a billable [**multi-service Cognitive Services resource**](../cognitive-services/cognitive-services-apis-create-account.md). 

A multi-service resource references "Cognitive Services" as the offering, rather than individual services, with access granted through a single API key. This key is specified in a [**skillset**](/rest/api/searchservice/create-skillset) and allows Microsoft to charge you for using these APIs:

+ [Computer Vision](../cognitive-services/computer-vision/overview.md) for image analysis and optical character recognition (OCR)
+ [Language service](../cognitive-services/language-service/overview.md) for language detection, entity recognition, sentiment analysis, and key phrase extraction
+ [Translator](../cognitive-services/translator/translator-overview.md) for machine text translation

> [!TIP]
> Azure provides infrastructure for you to monitor billing and budgets. For more information about monitoring Cognitive Services, see [Plan and manage costs for Azure Cognitive Services](../cognitive-services/plan-manage-costs.md).

## Set the resource key

You can use the Azure portal, REST API, or an Azure SDK to attach a billable resource to a skillset.

If you leave the property unspecified, your search service will attempt to use the free enrichments available to your indexer on a daily basis. Execution of billable skills will stop at 20 transactions per indexer invocation and a "Time Out" message will appear in indexer execution history.

### [**Azure portal**](#tab/portal)

1. [Sign in to Azure portal](https://portal.azure.com).

1. Create a [multi-service Cognitive Services resource](../cognitive-services/cognitive-services-apis-create-account.md) in the [same region](#same-region-requirement) as your search service.

1. Add the key to a skillset definition:

   + If using the [Import data wizard](search-import-data-portal.md), enter the key in the second step, "Add AI enrichments".

   + If adding the key to a new or existing skillset, provide the key in the **Cognitive Services** tab.

   :::image type="content" source="media/cognitive-search-attach-cognitive-services/attach-existing2.png" alt-text="Screenshot of the key page." border="true":::

### [**REST**](#tab/cogkey-rest)

1. Create a [multi-service Cognitive Services resource](../cognitive-services/cognitive-services-apis-create-account.md) in the [same region](#same-region-requirement) as your search service.

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

The following code snippet is from [azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/tutorial-ai-enrichment/v11/Program.cs), trimmed for brevity.

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

<a name="same-region-requirement"></a>

## How the key is used

Key-based billing applies when API calls to Cognitive Services resources exceed 20 API calls per indexer, per day. 

The key is used for billing, but not connections. For connections, a search service [connects over the internal network](search-security-overview.md#internal-traffic) to a Cognitive Services resource that's co-located in the [same physical region](https://azure.microsoft.com/global-infrastructure/services/?products=search). Most regions that offer Cognitive Search also offer Cognitive Services.

If you attempt AI enrichment in a region that doesn't have both services, you'll see this message: "Provided key isn't a valid CognitiveServices type key for the region of your search service."

> [!NOTE]
> Some built-in skills are based on non-regional Cognitive Services (for example, the [Text Translation Skill](cognitive-search-skill-text-translation.md)). Using a non-regional skill means that your request might be serviced in a region other than the Azure Cognitive Search region. For more information on non-regional services, see the [Cognitive Services product by region](https://aka.ms/allinoneregioninfo) page.

### Key requirements special cases

[Custom Entity Lookup](cognitive-search-skill-custom-entity-lookup.md) is metered by Azure Cognitive Search, not Cognitive Services, but it requires a Cognitive Services resource key to unlock transactions beyond 20 per indexer, per day. For this skill only, the resource key unblocks the number of transactions, but is unrelated to billing.

## Free enrichments

AI enrichment offers a small quantity of free processing  of billable enrichments so that you can complete short exercises without having to attach a Cognitive Services resource. Free enrichments are 20 documents per day, per indexer. You can [reset the indexer](search-howto-run-reset-indexers.md) to reset the counter if you want to repeat an exercise.

Some enrichments are always free: 

+ Utility skills that don't call Cognitive Services (namely, [Conditional](cognitive-search-skill-conditional.md), [Document Extraction](cognitive-search-skill-document-extraction.md), [Shaper](cognitive-search-skill-shaper.md), [Text Merge](cognitive-search-skill-textmerger.md), and [Text Split skills](cognitive-search-skill-textsplit.md)) aren't billable.

+ Text extraction from PDF documents and other application files is non-billable. Text extraction occurs during the [document cracking](search-indexer-overview.md#document-cracking) phase and isn't technically an enrichment, but it occurs during AI enrichment and is thus noted here.

## Billable enrichments

 During AI enrichment, Cognitive Search calls the Cognitive Services APIs for [built-in skills](cognitive-search-predefined-skills.md) that are based on Computer Vision, Translator, and Azure Cognitive Services for Language. 

Billable built-in skills that make backend calls to Cognitive Services include [Entity Linking](cognitive-search-skill-entity-linking-v3.md), [Entity Recognition](cognitive-search-skill-entity-recognition-v3.md), [Image Analysis](cognitive-search-skill-image-analysis.md), [Key Phrase Extraction](cognitive-search-skill-keyphrases.md), [Language Detection](cognitive-search-skill-language-detection.md), [OCR](cognitive-search-skill-ocr.md), [Personally Identifiable Information (PII) Detection](cognitive-search-skill-pii-detection.md), [Sentiment](cognitive-search-skill-sentiment-v3.md), and [Text Translation](cognitive-search-skill-text-translation.md).

Image extraction is an Azure Cognitive Search operation that occurs when documents are cracked prior to enrichment. Image extraction is billable on all tiers, except for 20 free daily extractions on the free tier. Image extraction costs apply to image files inside blobs, embedded images in other files (PDF and other app files), and for images extracted using [Document Extraction](cognitive-search-skill-document-extraction.md). For image extraction pricing, see the [Azure Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/).

> [!TIP]
> To lower the cost of skillset processing, enable [incremental enrichment (preview)](cognitive-search-incremental-indexing-conceptual.md) to cache and reuse any enrichments that are unaffected by changes made to a skillset. Caching requires Azure Storage (see [pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) but the cumulative cost of skillset execution is lower if existing enrichments can be reused, especially for skillsets that use image extraction and analysis.

## Example: Estimate costs

To estimate the costs associated with Cognitive Search indexing, start with an idea of what an average document looks like so you can run some numbers. For example, you might approximate:

+ 1,000 PDFs.
+ Six pages each.
+ One image per page (6,000 images).
+ 3,000 characters per page.

Assume a pipeline that consists of document cracking of each PDF, image and text extraction, optical character recognition (OCR) of images, and entity recognition of organizations.

The prices shown in this article are hypothetical. They're used to illustrate the estimation process. Your costs could be lower. For the actual prices of transactions, see See [Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services).

1. For document cracking with text and image content, text extraction is currently free. For 6,000 images, assume $1 for every 1,000 images extracted. That's a cost of $6.00 for this step.

1. For OCR of 6,000 images in English, the OCR cognitive skill uses the best algorithm (DescribeText). Assuming a cost of $2.50 per 1,000 images to be analyzed, you would pay $15.00 for this step.

1. For entity extraction, you'd have a total of three text records per page. Each record is 1,000 characters. Three text records per page multiplied by 6,000 pages equal 18,000 text records. Assuming $2.00 per 1,000 text records, this step would cost $36.00.

Putting it all together, you'd pay about $57.00 to ingest 1,000 PDF documents of this type with the described skillset.

## Next steps

+ [Azure Cognitive Search pricing page](https://azure.microsoft.com/pricing/details/search/)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
