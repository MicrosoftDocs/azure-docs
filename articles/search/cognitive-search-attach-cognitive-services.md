---
title: Attach a Cognitive Services resource with a skillset - Azure Search
description: Instructions for attaching a Cognitive Services all-in-one subscription to a cognitive enrichment pipeline in Azure Search.
manager: cgronlun
author: LuisCabrer
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 05/20/2019
ms.author: luisca
ms.custom: seodec2018
---
# Attach a Cognitive Services resource with a skillset in Azure Search 

AI algorithms drive the [cognitive indexing pipelines](cognitive-search-concept-intro.md) used for document enrichment in Azure Search. These algorithms are based on Azure Cognitive Services resources, including [Computer Vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/) for image analysis and optical character recognition (OCR) and [Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/) for entity recognition, key phrase extraction, and other enrichments. As used by Azure Search for document enrichment purposes, the algorithms are wrapped inside a *skill*, placed in a *skillset*, and referenced by an *indexer* during indexing.

You can enrich a limited number of documents for free. Or, you can attach a billable Cognitive Services resource to a *skillset* for larger and more frequent workloads. In this article, you'll learn how to attach a billable Cognitive Services resource to enrich documents during Azure Search [indexing](search-what-is-an-index.md).

> [!NOTE]
> Billable events include calls to Cognitive Services APIs and image extraction as part of the document-cracking stage in Azure Search. There is no charge for text extraction from documents or for skills that do not call Cognitive Services.
>
> Execution of billable skills is at the [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). For image extraction pricing, see the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).

## Same-region requirement

We require that Azure Search and Azure Cognitive Services exist within the same region. Otherwise, you will get this message at run time: `"Provided key is not a valid CognitiveServices type key for the region of your search service."` 

There is no way to move a service across regions. If you get this error, you should create a new Cognitive Services resource in the same region as Azure Search.

## Use Free resources

You can use a limited, free processing option to complete the cognitive search tutorial and quickstart exercises.

Free (Limited enrichments) resources are restricted to 20 documents per day, per subscription.

1. Open the Import data wizard:

   ![Open the Import data wizard](media/search-get-started-portal/import-data-cmd.png "Open the Import data wizard")

1. Choose a data source and continue to **Add cognitive search (Optional)**. For a step-by-step walkthrough of this wizard, see [Import, index, and query by using portal tools](search-get-started-portal.md).

1. Expand **Attach Cognitive Services** and then select **Free (Limited enrichments)**:

   ![Expanded Attach Cognitive Services section](./media/cognitive-search-attach-cognitive-services/attach1.png "Expanded Attach Cognitive Services section")

1. Continue to the next step, **Add Enrichments**. For a description of skills available in the portal, see [Step 2: Add cognitive skills](cognitive-search-quickstart-blob.md#create-the-enrichment-pipeline) in the cognitive search quickstart.

## Use billable resources

For workloads that create more than 20 enrichments per day, make sure to attach a billable Cognitive Services resource. We recommend that you always attach a billable Cognitive Services resource, even if you never intend to call Cognitive Services APIs. Attaching a resource overrides the daily limit.

You're charged only for skills that call the Cognitive Services APIs. You're not billed for [custom skills](cognitive-search-create-custom-skill-example.md), or skills like [text merger](cognitive-search-skill-textmerger.md), [text splitter](cognitive-search-skill-textsplit.md), and [shaper](cognitive-search-skill-shaper.md), which aren't API-based.

1. Open the Import data wizard, choose a data source, and continue to **Add cognitive search (Optional)**.

1. Expand **Attach Cognitive Services** and then select **Create new Cognitive Services resource**. A new tab opens so that you can create the resource:

   ![Create a Cognitive Services resource](./media/cognitive-search-attach-cognitive-services/cog-services-create.png "Create a Cognitive Services resource")

1. In the **Location** list, select the region where your Azure Search service is located. Make sure to use this region for performance reasons. Using this region also voids outbound bandwidth charges across regions.

1. In the **Pricing tier** list, select **S0** to get the all-in-one collection of Cognitive Services features, including the Vision and Language features that back the predefined skills used by Azure Search.

   For the S0 tier, you can find rates for specific workloads on the [Cognitive Services pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/).
  
   + In the **Select Offer** list, make sure **Cognitive Services** is selected.
   + Under **Language** features, the rates for **Text Analytics Standard** apply to AI indexing.
   + Under **Vision** features, the rates for **Computer Vision S1** apply.

1. Select **Create** to provision the new Cognitive Services resource.

1. Return to the previous tab, which contains the Import data wizard. Select **Refresh** to show the Cognitive Services resource, and then select the resource:

   ![Select the Cognitive Services resource](./media/cognitive-search-attach-cognitive-services/attach2.png "Select the Cognitive Services resource")

1. Expand the **Add Enrichments** section to select the specific cognitive skills that you want to run on your data. Complete the rest of the wizard. For a description of skills available in the portal, see [Step 2: Add cognitive skills](cognitive-search-quickstart-blob.md#create-the-enrichment-pipeline) in the cognitive search quickstart.

## Attach an existing skillset to a Cognitive Services resource

If you have an existing skillset, you can attach it to a new or different Cognitive Services resource.

1. On the **Service overview** page, select **Skillsets**:

   ![Skillsets tab](./media/cognitive-search-attach-cognitive-services/attach-existing1.png "Skillsets tab")

1. Select the name of the skillset, and then select an existing resource or create a new one. Select **OK** to confirm your changes.

   ![Skillset resource list](./media/cognitive-search-attach-cognitive-services/attach-existing2.png "Skillset resource list")

   Remember that the **Free (Limited enrichments)** option limits you to 20 documents daily, and that you can use **Create new Cognitive Services resource** to provision a new billable resource. If you create a new resource, select **Refresh** to refresh the list of Cognitive Services resources, and then select the resource.

## Attach Cognitive Services programmatically

When you're defining the skillset programmatically, add a `cognitiveServices` section to the skillset. In that section, include the key of the Cognitive Services resource that you want to associate with the skillset. Remember that the resource must be in the same region as your Azure Search resource. Also include `@odata.type`, and set it to `#Microsoft.Azure.Search.CognitiveServicesByKey`.

The following example shows this pattern. Notice the `cognitiveServices` section at the end of the definition.

```http
PUT https://[servicename].search.windows.net/skillsets/[skillset name]?api-version=2019-05-06
api-key: [admin key]
Content-Type: application/json
```
```json
{
    "name": "skillset name",
    "skills": 
    [
      {
        "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
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

## Example: Estimate costs

To estimate the costs associated with cognitive search indexing, start with an idea of what an average document looks like so you can run some numbers. For example, you might approximate:

+ 1,000 PDFs.
+ Six pages each.
+ One image per page (6,000 images).
+ 3,000 characters per page.

Assume a pipeline that consists of document cracking of each PDF, image and text extraction, optical character recognition (OCR) of images, and entity recognition of organizations.

The prices shown in this article are hypothetical. They're used to illustrate the estimation process. Your costs could be lower. For the actual prices of transactions, see See [Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services).

1. For document cracking with text and image content, text extraction is currently free. For 6,000 images, assume $1 for every 1,000 images extracted. That's a cost of $6.00 for this step.

2. For OCR of 6,000 images in English, the OCR cognitive skill uses the best algorithm (DescribeText). Assuming a cost of $2.50 per 1,000 images to be analyzed, you would pay $15.00 for this step.

3. For entity extraction, you'd have a total of three text records per page. Each record is 1,000 characters. Three text records per page multiplied by 6,000 pages equals 18,000 text records. Assuming $2.00 per 1,000 text records, this step would cost $36.00.

Putting it all together, you'd pay about $57.00 to ingest 1,000 PDF documents of this type with the described skillset.

## Next steps
+ [Azure Search pricing page](https://azure.microsoft.com/pricing/details/search/)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
