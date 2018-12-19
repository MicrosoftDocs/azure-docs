---
title: Attach Cognitive Services to your skillset - Azure Search
description: Instructions for attaching a Cognitive Services All-in-One subscription to a Cognitive Skillset
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
# Associate Cognitive Services resource with a skillset 

> [!NOTE]
> Starting December 21, 2018, you will be able to associate a Cognitive Services resource with an Azure Search skillset. This will allow us to start charging for skillset execution. On this date, we will also begin charging for image extraction as part of the document-cracking stage. Text extraction from documents will continue to be offered at no additional cost.
>
> The execution of built-in skills will be charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/)
. Image extraction pricing will be charged at preview pricing, and is described on the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400).


Cognitive search extracts and enriches data to make it searchable in Azure Search. We call extraction and enrichment steps *cognitive skills*. The set of skills called during indexing of content are defined in a *skillset*. A skillset can use [predefined skills](cognitive-search-predefined-skills.md) or custom skills (see [Example: create a custom skill](cognitive-search-create-custom-skill-example.md) for more information).

In this article, you learn how to associate the [Cognitive Services ](https://azure.microsoft.com/services/cognitive-services/) resource to your cognitive skillset.

The Cognitive Services resource you select will power the built-in cognitive skills. This resource will also be used for billing purposes. Any enrichments you perform using the built-in cognitive skills will be billed against the Cognitive Services resource you select. They will be billed at the same rate as if you had performed the same task using a Cognitive Services resource. See [Cognitive Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).

## Limits when no Cognitive Services resource is selected
Starting Feb 1, 2019, if you do not associate a Cognitive Services subscription with your skillset, you will only be able to enrich a small number of documents for free (20 documents per day). 

## Associating a Cognitive Services resource with a new skillset

1. As part of the *Import data* experience, after you have Connected to your data source you will navigate to the *Add cognitive search* optional step. 

1. Expand the *Attach Cognitive Services* section. This will show you any Cognitive Service resources you have in the same regions as your Search Service. 
![Expanded Attach Cognitive Service](./media/cognitive-search-attach-cognitive-services/attach1.png "Expanded Attach Cognitive Services")

1. Select an existing Cognitive Services resource, or *Create a new Cognitive Services resource*. If you select the *Free (Limited Enrichments) resource*, you will only be able to enrich a small number of documents for free (20 documents per day). If you clicked on *Create a new Cognitive Services resource*, a new tab will open that will allow you to create the Cognitive Services resource. 

1. If you created a new resource, click *Refresh* to refresh the list of Cognitive Services resources, and select the resource. 
![Selected Cognitive Service Resource](./media/cognitive-search-attach-cognitive-services/attach2.png "Selected Cognitive Service Resource")

1. Once you have done this, you can expand the *Add Enrichments* section to select the specific cognitive skills you want to run over your data and proceed with the rest of the flow.

## Associating a Cognitive Services resource with an existing skillset

1. On the Service Overview page, select the *Skillsets* tab.
![Skillsets tab](./media/cognitive-search-attach-cognitive-services/attach-existing1.png "Skillsets tab")

1. *Click* on the skillset you would like to modify. This will open a blade that will allow you to edit a skillset.

1. Select an existing Cognitive Services resource or *Create a new Cognitive Services resource*. If you select the *Free (Limited Enrichments) resource*, you will only be able to enrich a small number of documents for free (20 documents per day). If you clicked on *Create a new Cognitive Services resource*, a new tab will open that will allow you to create the Cognitive Services resource. <n/> 
<img src="./media/cognitive-search-attach-cognitive-services/attach-existing2.png" width="350">

1. If you created a new resource, click *Refresh* to refresh the list of Cognitive Services resources, and select the resource.
1. Click *OK* to confirm your changes

## Associating a Cognitive Services resource programmatically

When defining the skillset programmatically, add a `cognitiveServices` section. The section should include the key of the Cognitive Services resource you would like to associate with the skillset, as well as the @odata.type, which should be set to "#Microsoft.Azure.Search.CognitiveServicesByKey". This pattern is shown in the example below.

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
## Example: Estimating the cost of document cracking and enrichment
You may want to estimate how much it costs to enrich a given type of document. The exercise below is an example only, but it may be helpful to you.

Imagine that we have 1000 PDFs and we estimate that on average each of those documents have 6 pages each. Let's say that each of them has one image per page for this exercise. Let's also imagine that on average, there are about 3,000 characters per page. 

Now, let's assume that we want to perform the following steps as part of the enrichment pipeline:
1. As part of document cracking, extract the content and images from the document.
1. As part of enrichment, OCR each of the pages extracted, combine the text for all pages, and then extract each of the organizations in the combined text of all images.

Let's estimate how much it would cost to ingest those documents, step by step.

For the 1000 documents:

1. Document Cracking, we would extract a combined number of 6,000 images. Assuming $1 for every 1000 images extracted, that would cost us $6.00.

2. We would extract the text from each of those 6,000 images. In English, the OCR cognitive skill uses the best algorithm (DescribeText). Assuming a cost of $2.50 per 1,000 images to be analyzed, we would pay $15.00 for this step.

3. For entity extraction, we would have a total of 3 text records per page (each record is 1,000 characters). 3 text records/page * 6,000 pages = 18,000 text records. Assuming $2.00 / 1000 text records, this step would cost us $36.00.

Putting it all together, we would pay $57.00 to ingest 1000 pdf documents of this nature with the skillset described.  In this exercise we assumed the most expensive price per transaction, it could have been lower due to graduating pricing. See [Cognitive Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services).



## Next steps
+ [Azure Search Pricing page](https://azure.microsoft.com/pricing/details/search/)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
