---
title: Create Skillset (REST api-version=2017-11-11-Preview) - Azure Search | Microsoft Docs
description: A skillset is a collection of cognitive skills that comprise an augmentation pipline.
services: search
manager: pablocas
author: luiscabrer
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: rest-api
ms.workload: search
ms.topic: language-reference
ms.tgt_pltfrm: na
ms.date: 05/01/2018
ms.author: luisca
---
# Create Skillset (api-version=2017-11-11-Preview)

**Applies to:** api-version-2017-11-11-Preview

A skillset is a collection of cognitive skills used for natural language and other transformations, including entity extraction, key phrase extraction, chunking text into logical pages, among others.

To use the skillset, reference it in an Azure Search indexer and then run the indexer to import data, invoke transformations and enrichment, and map the output fields to an index. A skillset is high-level resource, but it is operational only within indexer processing. You can design a skillset once, and then reference it in multiple indexers. 

A skillset is expressed in Azure Search through an HTTP PUT or POST request. For PUT, the body of the request is a JSON schema that specifies which skills are invoked. Skills are chained together through input-output associations, where the output of one transform becomes input to another.

A skillset must have at least one skill. There is no theoretical limit on maximum number of skills, but three to five is a common configuration.  

```  
PUT http://[servicename].search.windows.net/skillsets/[skillset name]?api-version=2017-11-11-Preview
api-key: [admin key]
Content-Type: application/json
```  

## Request  
 HTTPS is required for all service requests. The **Create Skillset** request can be constructed using a PUT method, with the skillset name as part of the URL. If the skillset doesn't exist, it is created. If it already exists, it is updated to the new definition. Notice that you can only PUT one skillset at a time.  

 The skillset name must be lower case, start and end with a letter or number, have no slashes or dots, and be fewer than 128 characters. After starting the skillset name with a letter or number, the rest of the name can include any letter, number, and dashes as long as the dashes are not consecutive.  

 The **api-version** parameter is required. The only available version is `2017-11-11-Preview`. See [API versions in Azure Search](https://go.microsoft.com/fwlink/?linkid=834796) for a list of all versions. 


### Request headers  

 The following table describes the required and optional request headers.  

|Request Header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set this to `application/json`|  
|*api-key:*|Required. The `api-key` is used to authenticate the request to your Search service. It is a string value, unique to your service. The **Create Skillset** request must include an `api-key` header set to your admin key (as opposed to a query key).|  

 You will also need the service name to construct the request URL. You can get both the service name and `api-key` from your service dashboard in the Azure portal. See [Create an Azure Search service in the portal](https://azure.microsoft.com/documentation/articles/search-create-service-portal/) for page navigation help.  

### Request body syntax  

 The body of the request contains the skillset definition, consisting of one or more fully specified skills, as well as optional name and description parameters.  

 The syntax for structuring the request payload is as follows. A sample request is provided further on in this article and also in [How to define a skillset](cognitive-search-defining-skillset.md).  

```
{   
    "name" : "Required for POST, optional for PUT. Friendly name of the skillset",  
    "description" : "Optional. Anything you want, or null",  
    "Skills" : "Required. An array of skills. Each skill has an odata.type, name, input and output parameters",  
}  
```

### Request example
 The following example creates a skillset used for enriching a collection of financial documents.

```http
PUT http://[servicename].search.windows.net/skillsets/financedocenricher?api-version=2017-11-11-Preview
api-key: [admin key]
Content-Type: application/json
```

The body of request is a JSON document. This particular skillset uses two skills asynchronously, independently processing the substance of the `contents` as two different transformations. Alternatively, you can direct the output of one transformation to be the input of another. For more information, see [How to define a skillset](cognitive-search-defining-skillset.md).

```json
{
  "name": "financedocenricher",
  "description": 
  "Extract sentiment from financial records, extract company names, and then find additional information about each company mentioned.",
  "skills":
  [
    {
      "@odata.type": "#Microsoft.Skills.Text.NamedEntityRecognitionSkill",
      "categories": [ "Organization" ],
      "defaultLanguageCode": "en",
      "inputs": [
        {
          "name": "text",
          "source": "/document/content"
        }
      ],
      "outputs": [
        {
          "name": "organizations",
          "targetName": "organizations"
        }
      ]
    },
    {
      "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
      "inputs": [
        {
          "name": "text",
          "source": "/document/content"
        }
      ],
      "outputs": [
        {
          "name": "score",
          "targetName": "mySentiment"
        }
      ]
    },
  ]
}
```

## Response  

 For a successful request, you should see status code "201 Created".  

 By default, the response body will contain the JSON for the skillset definition that was created. However, if the Prefer request header is set to return=minimal, the response body will be empty, and the success status code will be "204 No Content" instead of "201 Created". This is true regardless of whether PUT or POST is used to create the skillset.   

## See also

+ [Cognitive search (Preview)](cognitive-search-concept-intro.md)
+ [Get started with preview](cognitive-search-get-start-preview.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [How to map fields](cognitive-search-output-field-mapping.md)
+ [How to define a custom interface](cognitive-search-custom-skill-interface.md)
+ [Example: creating a custom skill](cognitive-search-create-custom-skill-example.md)
+ [Predefined sklls](cognitive-search-predefined-skills.md)