---
title: Attach Cognitive Services to your skillset - Azure Search
description: Instructions for attaching a Cognitive Services All-in-One subscription to a cognitive skillset
manager: cgronlun
author: HeidiSteen
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 12/05/2018
ms.author: luisca
ms.custom: seodec2018
---
# Associate a Cognitive Services resource with a skillset 

A cognitive search extracts and enriches data to make it searchable in Azure Search. We call extraction and enrichment steps *cognitive skills*. The set of skills called during indexing of content are defined in a *skillset*. A skillset can use [predefined skills](cognitive-search-predefined-skills.md) or custom skills. For more information, see [Example: create a custom skill](cognitive-search-create-custom-skill-example.md).

In this article, you learn how to associate an [Azure Cognitive Services ](https://azure.microsoft.com/services/cognitive-services/) resource with your cognitive skillset.

The Cognitive Services resource that you select will power the built-in cognitive skills. This resource will also be used for billing purposes. Any enrichments that you perform by using the built-in cognitive skills will be billed against the Cognitive Services resource that you select. They will be billed at the same rate as if you had performed the same task by using a Cognitive Services resource. See [Cognitive Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).

> [!NOTE]
> As of December 21, 2018, you can associate a Cognitive Services resource with an Azure Search skillset. This allows us to charge for skillset execution. On this date, we also began charging for image extraction as part of the document-cracking stage. Text extraction from documents continue to be offered at no additional cost.
>
> The execution of built-in skills is charged at the [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is charged at preview pricing, and is described on the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).

## Limits when no Cognitive Services resource is selected
Starting Feb 1, 2019, if you don't associate a Cognitive Services subscription with your skillset, you will only be able to enrich a small number of documents for free (20 documents per day). 

## Associate a Cognitive Services resource with a new skillset

1. As part of the **Import data** experience, after you have connected to your data source, go to the **Add cognitive search** optional step. 

1. Expand the **Attach Cognitive Services** section. This step shows you any Cognitive Services resources you have in the same regions as the Azure Search service.

   ![Expanded Attach Cognitive Services section](./media/cognitive-search-attach-cognitive-services/attach1.png "Expanded Attach Cognitive Services")

1. Select an existing Cognitive Services resource, or select **Create new Cognitive Services resource**. If you select **Free (Limited Enrichments)**, you will only be able to enrich a small number of documents for free (20 documents per day). If you select **Create new Cognitive Services resource**, a new tab will open where you can create the resource. 

1. If you created a new resource, select **Refresh** to refresh the list of Cognitive Services resources, and then select the resource. 

   ![Selected Cognitive Services resource](./media/cognitive-search-attach-cognitive-services/attach2.png "Selected Cognitive Service Resource")

1. Expand the **Add Enrichments** section to select the specific cognitive skills that you want to run over your data, and proceed with the rest of the flow.

## Associate a Cognitive Services resource with an existing skillset

1. On the **Service Overview** page, select the **Skillsets** tab.

   ![Skillsets tab](./media/cognitive-search-attach-cognitive-services/attach-existing1.png "Skillsets tab")

1. Select the skillset that you want to modify. This step opens a blade where you can edit a skillset.

1. Select an existing Cognitive Services resource, or select **Create new Cognitive Services resource**. If you select **Free (Limited Enrichments)**, you will only be able to enrich a small number of documents for free (20 documents per day). If you select **Create new Cognitive Services resource**, a new tab will open where you can create the resource.

   <n/> 
   <img src="./media/cognitive-search-attach-cognitive-services/attach-existing2.png" width="350">

1. If you created a new resource, select **Refresh** to refresh the list of Cognitive Services resources, and then select the resource.

1. Select **OK** to confirm your changes.

## Associate a Cognitive Services resource programmatically

When you're defining the skillset programmatically, add a `cognitiveServices` section. In the section, include the key of the Cognitive Services resource that you want to associate with the skillset. Also include `@odata.type`, and set it to `#Microsoft.Azure.Search.CognitiveServicesByKey`. The following example shows this pattern.

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
    	"@odata.type": "#Microsoft.Azure.Search.CognitiveServicesByKey"
    	"description": "mycogsvcs",
    	"key": "your key goes here"
    }
}
```
## Example: Estimate the cost of document cracking and enrichment
You might want to estimate how much it costs to enrich a type of document. The following exercise is an example only, but it might be helpful to you.

Imagine that you have 1,000 PDFs. You estimate that on average, each of those documents has 6 pages. Each page has 1 image. On average, there are about 3,000 characters per page. 

Now, assume that you want to perform the following steps as part of the enrichment pipeline:
1. As part of document cracking, extract the content and images from the document.
1. As part of enrichment, use optical character recognition (OCR) for each of the extracted pages, combine the text for all pages, and then extract each of the organizations in the combined text of all images.

Let's estimate how much it would cost to ingest those 1,000 documents, step by step:

1. For document cracking, you would extract a combined number of 6,000 images. Assuming $1 for every 1,000 images extracted, that would cost you $6.00.

2. You would extract the text from each of those 6,000 images. In English, the OCR cognitive skill uses the best algorithm (DescribeText). Assuming a cost of $2.50 per 1,000 images to be analyzed, you would pay $15.00 for this step.

3. For entity extraction, you would have a total of 3 text records per page. (Each record is 1,000 characters.) Three text records per page * 6,000 pages = 18,000 text records. Assuming $2.00 per 1,000 text records, this step would cost $36.00.

Putting it all together, you would pay $57.00 to ingest 1,000 PDF documents of this nature with the described skillset. In this exercise, we assumed the most expensive price per transaction. It could have been lower because of graduating pricing. See [Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services).



## Next steps
+ [Azure Search pricing page](https://azure.microsoft.com/pricing/details/search/)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
