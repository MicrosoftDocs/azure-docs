---
title: Attach a Cognitive Services resource with a skillset - Azure Search
description: Instructions for attaching a Cognitive Services All-in-One subscription to a cognitive enrichment pipeline in Azure Search.
manager: cgronlun
author: LuisCabrer
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 04/14/2019
ms.author: luisca
ms.custom: seodec2018
---
# Attach a Cognitive Services resource with a skillset in Azure Search 

AI algorithms drive the [cognitive indexing pipelines](cognitive-search-concept-intro.md) used for processing unstructured data in Azure Search. These algorithms are based on [Cognitive Services resources](https://azure.microsoft.com/services/cognitive-services/), including [Computer Vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/) for image analysis and optical character recognition (OCR), and [Text Analytics](https://azure.microsoft.com/services/cognitive-services/text-analytics/) for entity recognition, key phrase extraction, and other enrichments.

You can enrich a limited number of documents for free, or attach a billable Cognitive Services resource for larger and more frequent workloads. In this article, learn how to associate a Cognitive Services resource with your cognitive skillset to enrich data during [Azure Search indexing](search-what-is-an-index.md).

If your pipeline consists of skills unrelated to Cognitive Services APIs, you should still attach a Cognitive Services resource. Doing so overrides the **Free** resource that limits you to a small quantity of enrichments per day. There is no charge for skills that are not bound to Cognitive Services APIs. These skills include: [custom skills](cognitive-search-create-custom-skill-example.md), [text merger](cognitive-search-skill-textmerger.md), [text splitter](cognitive-search-skill-textsplit.md), and [shaper](cognitive-search-skill-shaper.md).

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to attach a billable Cognitive Services resource. Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Search. There are no charges for text extraction from documents.
>
> Execution of [Built-in cognitive skill](cognitive-search-predefined-skills.md) execution is charged at the [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services), at the same rate as if you had performed the task directly. Image extraction is an Azure Search charge, reflected on the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).


## Use Free resources

You can use a limited, free processing option to complete the cognitive search tutorial and quickstart exercises. 

**Free (Limited Enrichments)** are restricted to 20 documents per day, per subscription.

1. Open the **Import data** wizard.

   ![Import data command](media/search-get-started-portal/import-data-cmd2.png "Import data command")

1. Choose a data source and continue to **Add cognitive search (optional)**. For a step-by-step walkthrough of this wizard, see [Import, index, and query using portal tools](search-get-started-portal.md).

1. Expand **Attach Cognitive Services** and select **Free (Limited Enrichments)**.

   ![Expanded Attach Cognitive Services section](./media/cognitive-search-attach-cognitive-services/attach1.png "Expanded Attach Cognitive Services")

Continue to the next step, **Add enrichments**. For a description of skills available in the portal, see ["Step 2: Add cognitive skill"](cognitive-search-quickstart-blob.md#create-the-enrichment-pipeline) in the cognitive search quickstart.

## Use billable resources

For workloads numbering more than 20 enrichments daily, you need to attach a billable Cognitive Services resource. 

You are only charged for skills that call the Cognitive Services APIs. Non-API-based skills like [custom skills](cognitive-search-create-custom-skill-example.md), [text merger](cognitive-search-skill-textmerger.md), [text splitter](cognitive-search-skill-textsplit.md), and [shaper](cognitive-search-skill-shaper.md) skills are not billed.

1. Open the **Import data** wizard, choose a data source, and continue to **Add cognitive search (optional)**. 

1. Expand **Attach Cognitive Services** and then select **Create new Cognitive Services resource**. A new tab opens so that you can create the resource. 

   ![Create a Cognitive Services resource](./media/cognitive-search-attach-cognitive-services/cog-services-create.png "Create a Cognitive Services resource")

1. In Location, choose the same region as Azure Search to avoid outbound bandwidth charges across regions.

1. In Pricing tier, choose **S0** to get the all-in-one collection of Cognitive Services features, including the Vision and Language features that back the predefined skills used by Azure Search. 

   For the S0 tier, you can find rates for specific workloads on the [Cognitive Services pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/).
  
   + In **Select Offer**, make sure that *Cognitive Services* is selected.
   + Under Language features, the rates for *Text Analytics Standard* apply to AI indexing. 
   + Under Vision features, the rates for *Computer Vision S1* are applied.

1. Click **Create** to provision the new Cognitive Services resource. 

1. Return to the previous tab containing the **Import data** wizard. Click **Refresh** to show the Cognitive Services resource, and then select the resource.

   ![Selected Cognitive Services resource](./media/cognitive-search-attach-cognitive-services/attach2.png "Selected Cognitive Service Resource")

1. Expand the **Add Enrichments** section to select the specific cognitive skills that you want to run over your data, and proceed with the rest of the flow. For a description of skills available in the portal, see ["Step 2: Add cognitive skill"](cognitive-search-quickstart-blob.md#create-the-enrichment-pipeline) in the cognitive search quickstart.

## Attach an existing skillset to a Cognitive Services resource

If you have an existing skillset, you can attach it to a new or different Cognitive Services resource.

1. On the **Service overview** page, click **Skillsets**.

   ![Skillsets tab](./media/cognitive-search-attach-cognitive-services/attach-existing1.png "Skillsets tab")

1. Click the name of skillset, and then select an existing resource or create a new one. Click **OK** to confirm your changes. 

   ![Skillset resource list](./media/cognitive-search-attach-cognitive-services/attach-existing2.png "Skillset resource list")

Recall that **Free (Limited Enrichments)** is limited to 20 documents daily, and that **Create new Cognitive Services resource** is used to provision a new billable resource. If you create a new resource, select **Refresh** to refresh the list of Cognitive Services resources, and then select the resource.

## Attach Cognitive Services programmatically

When you're defining the skillset programmatically, add a `cognitiveServices` section to the skillset. In the section, include the key of the Cognitive Services resource that you want to associate with the skillset. Recall that the resource must be in the same region as Azure Search. Also include `@odata.type`, and set it to `#Microsoft.Azure.Search.CognitiveServicesByKey`. 

The following example shows this pattern. Notice the cognitiveServices section at the bottom of the definition

```http
PUT https://[servicename].search.windows.net/skillsets/[skillset name]?api-version=2017-11-11-Preview
api-key: [admin key]
Content-Type: application/json
```
```json
{
    "name": "skillset name",
    "skills": 
    [
      {
        "@odata.type": "#Microsoft.Skills.Text.NamedEntityRecognitionSkill",
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

To estimate costs associated with cognitive search indexing, start with an idea of what an average document looks like so that you can run some numbers. For example, for estimation purposes, you might approximate:

+ 1000 PDFs
+ Six pages each
+ One image per page (6000 images)
+ 3000 characters per page

Assume a pipeline consisting of document cracking of each PDF with image and text extraction, optical character recognition (OCR) of images, and named entity recognition of organizations. 

In this exercise, we're using the most expensive price per transaction. Actual costs could be lower due to graduated pricing. See [Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services).

1. For document cracking with text and image content, text extraction is currently free. For 6000 images, assume $1 for every 1,000 images extracted, costing $6.00 for this step.

2. For OCR of 6,000 images in English, the OCR cognitive skill uses the best algorithm (DescribeText). Assuming a cost of $2.50 per 1,000 images to be analyzed, you would pay $15.00 for this step.

3. For entity extraction, you would have a total of 3 text records per page. Each record is 1,000 characters. Three text records per page * 6,000 pages = 18,000 text records. Assuming $2.00 per 1,000 text records, this step would cost $36.00.

Putting it all together, you would pay about $57.00 to ingest 1,000 PDF documents of this nature with the described skillset. 

## Next steps
+ [Azure Search pricing page](https://azure.microsoft.com/pricing/details/search/)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
