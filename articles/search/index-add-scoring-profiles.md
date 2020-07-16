---
title: Boost search rank using scoring profiles
titleSuffix: Azure Cognitive Search
description: Boost search rank scores for Azure Cognitive Search results by adding scoring profiles.

manager: nitinme
author: shmed
ms.author: ramero
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 05/06/2020
---
# Add scoring profiles to an Azure Cognitive Search index

*Scoring* computes a search score for each item in a rank ordered result set. Every item in a search result set is assigned a search score, then ranked highest to lowest.

 Azure Cognitive Search uses default scoring to compute an initial score, but you can customize the calculation through a *scoring profile*. Scoring profiles give you greater control over the ranking of items in search results. For example, you might want to boost items based on their revenue potential, promote newer items, or perhaps boost items that have been in inventory too long.  

 The following video segment fast-forwards to how scoring profiles work in Azure Cognitive Search.
 
> [!VIDEO https://www.youtube.com/embed/Y_X6USgvB1g?version=3&start=463&end=970]

## Scoring profile definitions

 A scoring profile is part of the index definition, composed of weighted fields, functions, and parameters.  

 To give you an idea of what a scoring profile looks like, the following example shows a simple profile named 'geo'. This one boosts items that have the search term in the **hotelName** field. It also uses the `distance` function to favor items that are within ten kilometers of the current location. If someone searches on the term 'inn', and 'inn' happens to be part of the hotel name, documents that include hotels with 'inn' within a 10 KM radius of the current location will appear higher in the search results.  


```json
"scoringProfiles": [
  {  
    "name":"geo",
    "text": {  
      "weights": {  
        "hotelName": 5
      }                              
    },
    "functions": [
      {  
        "type": "distance",
        "boost": 5,
        "fieldName": "location",
        "interpolation": "logarithmic",
        "distance": {
          "referencePointParameter": "currentLocation",
          "boostingDistance": 10
        }                        
      }                                      
    ]                     
  }            
]
```  


 To use this scoring profile, your query is formulated to specify the profile on the query string. In the query below, notice the query parameter `scoringProfile=geo` in the request.  

```  
GET /indexes/hotels/docs?search=inn&scoringProfile=geo&scoringParameter=currentLocation--122.123,44.77233&api-version=2020-06-30 
```  

 This query searches on the term ‘inn’ and passes in the current location. Notice that this query includes other parameters, such as `scoringParameter`. Query parameters are described in [Search Documents &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents).  

 Click [Example](#bkmk_ex) to review a more detailed example of a scoring profile.  

## What is default scoring?  
 Scoring computes a search score for each item in a rank ordered result set. Every item in a search result set is assigned a search score, then ranked highest to lowest. Items with the higher scores are returned to the application. By default, the top 50 are returned, but you can use the `$top` parameter to return a smaller or larger number of items (up to 1000 in a single response).  

The search score is computed based on statistical properties of the data and the query. Azure Cognitive Search finds documents that include the search terms in the query string (some or all, depending on `searchMode`), favoring documents that contain many instances of the search term. The search score goes up even higher if the term is rare across the data index, but common within the document. The basis for this approach to computing relevance is known as [TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) or term frequency-inverse document frequency.  

 Assuming there is no custom sorting, results are then ranked by search score before they are returned to the calling application. If $top is not specified, 50 items having the highest search score are returned.  

 Search score values can be repeated throughout a result set. For example, you might have 10 items with a score of 1.2, 20 items with a score of 1.0, and 20 items with a score of 0.5. When multiple hits have the same search score, the ordering of same scored items is not defined, and is not stable. Run the query again, and you might see items shift position. Given two items with an identical score, there is no guarantee which one appears first.  

## When to add scoring logic 
 You should create one or more scoring profiles when the default ranking behavior doesn’t go far enough in meeting your business objectives. For example, you might decide that search relevance should favor newly added items. Likewise, you might have a field that contains profit margin, or some other field indicating revenue potential. Boosting hits that bring benefits to your business can be an important factor in deciding to use scoring profiles.  

 Relevancy-based ordering is also implemented through scoring profiles. Consider search results pages you’ve used in the past that let you sort by price, date, rating, or relevance. In Azure Cognitive Search, scoring profiles drive the ‘relevance’ option. The definition of relevance is controlled by you, predicated on business objectives and the type of search experience you want to deliver.  

##  <a name="bkmk_ex"></a> Example  
 As noted earlier, customized scoring is implemented through one or more scoring profiles defined in an index schema.  

 This example shows the schema of an index with two scoring profiles (`boostGenre`, `newAndHighlyRated`). Any query against this index that includes either profile as a query parameter will use the profile to score the result set.  

```json
{  
  "name": "musicstoreindex",  
  "fields": [  
    { "name": "key", "type": "Edm.String", "key": true },  
    { "name": "albumTitle", "type": "Edm.String" },  
    { "name": "albumUrl", "type": "Edm.String", "filterable": false },  
    { "name": "genre", "type": "Edm.String" },  
    { "name": "genreDescription", "type": "Edm.String", "filterable": false },  
    { "name": "artistName", "type": "Edm.String" },  
    { "name": "orderableOnline", "type": "Edm.Boolean" },  
    { "name": "rating", "type": "Edm.Int32" },  
    { "name": "tags", "type": "Collection(Edm.String)" },  
    { "name": "price", "type": "Edm.Double", "filterable": false },  
    { "name": "margin", "type": "Edm.Int32", "retrievable": false },  
    { "name": "inventory", "type": "Edm.Int32" },  
    { "name": "lastUpdated", "type": "Edm.DateTimeOffset" }  
  ],  
  "scoringProfiles": [  
    {  
      "name": "boostGenre",  
      "text": {  
        "weights": {  
          "albumTitle": 1.5,  
          "genre": 5,  
          "artistName": 2  
        }  
      }  
    },  
    {  
      "name": "newAndHighlyRated",  
      "functions": [  
        {  
          "type": "freshness",  
          "fieldName": "lastUpdated",  
          "boost": 10,  
          "interpolation": "quadratic",  
          "freshness": {  
            "boostingDuration": "P365D"  
          }  
        },  
        {
          "type": "magnitude",  
          "fieldName": "rating",  
          "boost": 10,  
          "interpolation": "linear",  
          "magnitude": {  
            "boostingRangeStart": 1,  
            "boostingRangeEnd": 5,  
            "constantBoostBeyondRange": false  
          }  
        }  
      ]  
    }  
  ],  
  "suggesters": [  
    {  
      "name": "sg",  
      "searchMode": "analyzingInfixMatching",  
      "sourceFields": [ "albumTitle", "artistName" ]  
    }  
  ]   
}  
```  

## Workflow  
 To implement custom scoring behavior, add a scoring profile to the schema that defines the index. You can have up to 100 scoring profiles within an index (see [Service Limits](search-limits-quotas-capacity.md)), but you can only specify one profile at time in any given query.  

 Start with the [Template](#bkmk_template) provided in this topic.  

 Provide a name. Scoring profiles are optional, but if you add one, the name is required. Be sure to follow the naming conventions for fields (starts with a letter, avoids special characters and reserved words). See [Naming rules &#40;Azure Cognitive Search&#41;](https://docs.microsoft.com/rest/api/searchservice/naming-rules) for the complete list.  

 The body of the scoring profile is constructed from weighted fields and functions.  

|||  
|-|-|  
|**Weights**|Specify name-value pairs that assign a relative weight to a field. In the [Example](#bkmk_ex), the albumTitle, genre, and artistName fields are boosted 1.5, 5, and 2 respectively. Why is genre boosted so much higher than the others? If search is conducted over data that is somewhat homogenous (as is the case with 'genre' in the `musicstoreindex`), you might need a larger variance in the relative weights. For example, in the `musicstoreindex`, ‘rock’ appears as both a genre and in identically phrased genre descriptions. If you want genre to outweigh genre description, the genre field will need a much higher relative weight.|  
|**Functions**|Used when additional calculations are required for specific contexts. Valid values are `freshness`, `magnitude`, `distance`, and `tag`. Each function has parameters that are unique to it.<br /><br /> -   `freshness` should be used when you want to boost by how new or old an item is. This function can only be used with `datetime` fields (edm.DataTimeOffset). Notice the `boostingDuration` attribute is used only with the `freshness` function.<br />-   `magnitude` should be used when you want to boost based on how high or low a numeric value is. Scenarios that call for this function include boosting by profit margin, highest price, lowest price, or a count of downloads. This function can only be used with double and integer fields.<br />     For the `magnitude` function, you can reverse the range, high to low, if you want the inverse pattern (for example, to boost lower-priced items more than higher-priced items). Given a range of prices from $100 to $1, you would set `boostingRangeStart` at 100 and `boostingRangeEnd` at 1 to boost the lower-priced items.<br />-   `distance` should be used when you want to boost by proximity or geographic location. This function can only be used with `Edm.GeographyPoint` fields.<br />-   `tag` should be used when you want to boost by tags in common between documents and search queries. This function can only be used with `Edm.String` and `Collection(Edm.String)` fields.<br /><br /> **Rules for using functions**<br /><br /> Function type (`freshness`, `magnitude`, `distance`), `tag` must be lower case.<br /><br /> Functions cannot include null or empty values. Specifically, if you include fieldname, you have to set it to something.<br /><br /> Functions can only be applied to filterable fields. See [Create Index &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/create-index) for more information about filterable fields.<br /><br /> Functions can only be applied to fields that are defined in the fields collection of an index.|  

 After the index is defined, build the index by uploading the index schema, followed by documents. See [Create Index &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/create-index) and [Add, Update or Delete Documents &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) for instructions on these operations. Once the index is built, you should have a functional scoring profile that works with your search data.  

##  <a name="bkmk_template"></a> Template  
 This section shows the syntax and template for scoring profiles. Refer to [Index attributes reference](#bkmk_indexref) in the next section for descriptions of the attributes.  

```  
. . .   
"scoringProfiles": [  
  {   
    "name": "name of scoring profile",   
    "text": (optional, only applies to searchable fields) {   
      "weights": {   
        "searchable_field_name": relative_weight_value (positive #'s),   
        ...   
      }   
    },   
    "functions": (optional) [  
      {   
        "type": "magnitude | freshness | distance | tag",   
        "boost": # (positive number used as multiplier for raw score != 1),   
        "fieldName": "...",   
        "interpolation": "constant | linear (default) | quadratic | logarithmic",   

        "magnitude": {
          "boostingRangeStart": #,   
          "boostingRangeEnd": #,   
          "constantBoostBeyondRange": true | false (default)
        }  

        // ( - or -)  

        "freshness": {
          "boostingDuration": "..." (value representing timespan over which boosting occurs)   
        }  

        // ( - or -)  

        "distance": {
          "referencePointParameter": "...", (parameter to be passed in queries to use as reference location)   
          "boostingDistance": # (the distance in kilometers from the reference location where the boosting range ends)   
        }   

        // ( - or -)  

        "tag": {
          "tagsParameter":  "..."(parameter to be passed in queries to specify a list of tags to compare against target field)   
        }
      }
    ],   
    "functionAggregation": (optional, applies only when functions are specified) "sum (default) | average | minimum | maximum | firstMatching"   
  }   
],   
"defaultScoringProfile": (optional) "...",   
. . .  
```  

##  <a name="bkmk_indexref"></a> Index attributes reference  

> [!NOTE]  
>  A scoring function can only be applied to fields that are filterable.  

|Attribute|Description|  
|---------------|-----------------|  
|`name`|Required. This is the name of the scoring profile. It follows the same naming conventions of a field. It must start with a letter, cannot contain dots, colons or @ symbols, and cannot start with the phrase ‘azureSearch’ (case-sensitive).|  
|`text`|Contains the weights property.|  
|`weights`|Optional. Contains name-value pairs that each specify a field name and relative weight. Relative weight must be a positive integer or floating-point number.<br /><br /> Weights are used to indicate the importance of one searchable field relative to another.|  
|`functions`|Optional. A scoring function can only be applied to fields that are filterable.|  
|`type`|Required for scoring functions. Indicates the type of function to use. Valid values include magnitude, freshness, distance, and tag. You can include more than one function in each scoring profile. The function name must be lower case.|  
|`boost`|Required for scoring functions. A positive number used as multiplier for raw score. It cannot be equal to 1.|  
|`fieldname`|Required for scoring functions. A scoring function can only be applied to fields that are part of the field collection of the index, and that are filterable. In addition, each function type introduces additional restrictions (freshness is used with datetime fields, magnitude with integer or double fields, and distance with location fields). You can only specify a single field per function definition. For example, to use magnitude twice in the same profile, you would need to include two definitions magnitude, one for each field.|  
|`interpolation`|Required for scoring functions. Defines the slope for which the score boosting increases from the start of the range to the end of the range. Valid values include Linear (default), Constant, Quadratic, and Logarithmic. See [Set interpolations](#bkmk_interpolation) for details.|  
|`magnitude`|The magnitude scoring function is used to alter rankings based on the range of values for a numeric field. Some of the most common usage examples of this are:<br /><br /> -   **Star ratings:** Alter the scoring based on the value within the “Star Rating” field. When two items are relevant, the item with the higher rating will be displayed first.<br />-   **Margin:** When two documents are relevant, a retailer may wish to boost documents that have higher margins first.<br />-   **Click counts:** For applications that track click through actions to products or pages, you could use magnitude to boost items that tend to get the most traffic.<br />-   **Download counts:** For applications that track downloads, the magnitude function lets you boost items that have the most downloads.|  
|`magnitude` &#124; `boostingRangeStart`|Sets the start value of the range over which magnitude is scored. The value must be an integer or floating-point number. For star ratings of 1 through 4, this would be 1. For margins over 50%, this would be 50.|  
|`magnitude` &#124; `boostingRangeEnd`|Sets the end value of the range over which magnitude is scored. The value must be an integer or floating-point number. For star ratings of 1 through 4, this would be 4.|  
|`magnitude` &#124; `constantBoostBeyondRange`|Valid values are true or false (default). When set to true, the full boost will continue to apply to documents that have a value for the target field that’s higher than the upper end of the range. If false, the boost of this function won’t be applied to documents having a value for the target field that falls outside of the range.|  
|`freshness`|The freshness scoring function is used to alter ranking scores for items based on values in `DateTimeOffset` fields. For example, an item with a more recent date can be ranked higher than older items.<br /><br /> It is also possible to rank items like calendar events with future dates such that items closer to the present can be ranked higher than items further in the future.<br /><br /> In the current service release, one end of the range will be fixed to the current time. The other end is a time in the past based on the `boostingDuration`. To boost a range of times in the future, use a negative `boostingDuration`.<br /><br /> The rate at which the boosting changes from a maximum and minimum range is determined by the Interpolation applied to the scoring profile (see the figure below). To reverse the boosting factor applied, choose a boost factor of less than 1.|  
|`freshness` &#124; `boostingDuration`|Sets an expiration period after which boosting will stop for a particular document. See [Set boostingDuration](#bkmk_boostdur) in the following section for syntax and examples.|  
|`distance`|The distance scoring function is used to affect the score of documents based on how close or far they are relative to a reference geographic location. The reference location is given as part of the query in a parameter (using the `scoringParameterquery` string option) as a lon,lat argument.|  
|`distance` &#124; `referencePointParameter`|A parameter to be passed in queries to use as reference location. `scoringParameter` is a query parameter. See [Search Documents &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) for descriptions of query parameters.|  
|`distance` &#124; `boostingDistance`|A number that indicates the distance in kilometers from the reference location where the boosting range ends.|  
|`tag`|The tag scoring function is used to affect the score of documents based on tags in documents and search queries. Documents that have tags in common with the search query will be boosted. The tags for the search query is provided as a scoring parameter in each search request (using the `scoringParameterquery` string option).|  
|`tag` &#124; `tagsParameter`|A parameter to be passed in queries to specify tags for a particular request. `scoringParameter` is a query parameter. See [Search Documents &#40;Azure Cognitive Search REST API&#41;](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) for descriptions of query parameters.|  
|`functionAggregation`|Optional. Applies only when functions are specified. Valid values include: sum (default), average, minimum, maximum, and firstMatching. A search score is single value that is computed from multiple variables, including multiple functions. This attribute indicates how the boosts of all the functions are combined into a single aggregate boost that then is applied to the base document score. The base score is based on the [tf-idf](http://www.tfidf.com/) value computed from the document and the search query.|  
|`defaultScoringProfile`|When executing a search request, if no scoring profile is specified, then default scoring is used ([tf-idf](http://www.tfidf.com/) only).<br /><br /> A default scoring profile name can be set here, causing Azure Cognitive Search to use that profile when no specific profile is given in the search request.|  

##  <a name="bkmk_interpolation"></a> Set interpolations  
 Interpolations allow you to set the shape of the slope used for scoring. Because scoring is high to low, the slope is always decreasing, but the interpolation determines the curve of the downward slope. The following interpolations can be used:  

|||  
|-|-|  
|`linear`|For items that are within the max and min range, the boost applied to the item will be done in a constantly decreasing amount. Linear is the default interpolation for a scoring profile.|  
|`constant`|For items that are within the start and ending range, a constant boost will be applied to the rank results.|  
|`quadratic`|In comparison to a Linear interpolation that has a constantly decreasing boost, Quadratic will initially decrease at smaller pace and then as it approaches the end range, it decreases at a much higher interval. This interpolation option is not allowed in tag scoring functions.|  
|`logarithmic`|In comparison to a Linear interpolation that has a constantly decreasing boost, Logarithmic will initially decrease at higher pace and then as it approaches the end range, it decreases at a much smaller interval. This interpolation option is not allowed in tag scoring functions.|  

 ![Constant, linear, quadratic, log10 lines on graph](media/scoring-profiles/azuresearch_scorefunctioninterpolationgrapht.png "AzureSearch_ScoreFunctionInterpolationGrapht")  

##  <a name="bkmk_boostdur"></a> Set boostingDuration  
 `boostingDuration` is an attribute of the `freshness` function. You use it to set an expiration period after which boosting will stop for a particular document. For example, to boost a product line or brand for a 10-day promotional period, you would specify the 10-day period as "P10D" for those documents.  

 `boostingDuration` must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an ISO 8601 duration value). The pattern for this is: "P[nD][T[nH][nM][nS]]".  

 The following table provides several examples.  

|Duration|boostingDuration|  
|--------------|----------------------|  
|1 day|"P1D"|  
|2 days and 12 hours|"P2DT12H"|  
|15 minutes|"PT15M"|  
|30 days, 5 hours, 10 minutes, and 6.334 seconds|"P30DT5H10M6.334S"|  

 For more examples, see [XML Schema: Datatypes (W3.org web site)](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration).  

## See also  

+ [REST API Reference](https://docs.microsoft.com/rest/api/searchservice/)   
+ [Create Index API](https://docs.microsoft.com/rest/api/searchservice/create-index)   
+ [Azure Cognitive Search .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/search?view=azure-dotnet)  
