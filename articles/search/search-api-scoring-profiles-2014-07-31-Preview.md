<properties pageTitle="Add scoring profiles to a search indexe REST API Version 2014-07-31-Preview" description="Add scoring profiles to a search index: Version 2014-07-31-Preview" services="search" documentationCenter="" authors="HeidiSteen" manager="mblythe" editor=""/>

<tags ms.service="search" ms.devlang="rest-api" ms.workload="search" ms.topic="article"  ms.tgt_pltfrm="na" ms.date="05/21/2015" ms.author="heidist" />
      
#Add scoring profiles to a search index (Azure Search Service REST API version 2014-07-31-Preview)

This documentation about scoring profiles is for the older Azure Search Service REST API, version 2014-07-31-Preview, which has since been replaced by the generally available version at [Scoring Profiles (MSDN)](https://msdn.microsoft.com/library/dn798928.aspx).

**About scoring profiles**

Scoring refers to the computation of a search score for every item returned in search results. The score is an indicator of an item's relevance in the context of the current search operation. The higher the score, the more relevant the item. In search results, items are rank ordered from high to low, based on the search score calculated for each item.
Azure Search uses default scoring to compute an initial score, but you can customize the calculation through a scoring profile. Scoring profiles give you greater control over the ranking of items in search results. For example, you might want to boost items based on their revenue potential, promote newer items, or perhaps boost items that have been in inventory too long.

A scoring profile is part of the index definition, composed of fields, functions, and parameters. 

To give you an idea of what a scoring profile looks like, the following example shows a simple profile named 'geo'. This one boosts items that have the search term in the `hotelName` field. It also uses the `distance` function to favor items that are within ten kilometers of the current location. If someone searches on the term 'inn', and 'inn' happens to be part of the hotel name, documents that include hotels with 'inn' will appear higher in the search results.

    "scoringProfiles": [
      {
        "name": geo,
        "text": {
          "weights": { "hotelName": 5 }
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

To use this scoring profile, your query is formulated to specify the profile on the query string. In the query below, notice the query parameter, `scoringProfile=geo` in the request.

    GET /indexes/hotels/docs?search=inn&scoringProfile=geo&scoringParameter=currentLocation:-122.123,44.77233&api-version=2014-07-31-Preview

This query searches on the term ‘inn’ and passes in the current location. Note that this query includes other parameters, such as `scoringParameter`. Query parameters are described in [Search Documents (Azure Search API)](https://msdn.microsoft.com/library/azure/dn798927.aspx).

Click [Example](#bkmk_ex) to review a more detailed example of a scoring profile.

## What is default scoring?

Scoring computes a search score for each item in a rank ordered result set. Every item in a search result set is assigned a search score, then ranked highest to lowest. Items with the higher scores are returned to the application. By default, the top 50 are returned, but you can use the `$top` parameter to return a smaller or larger number of items (up to 1000 in a single response).

By default, a search score is computed based on statistical properties of the data and the query. Azure Search finds documents that include the search terms in the query string (some or all, depending on `searchMode`), favoring documents that contain many instances of the search term. The search score goes up even higher if the term is rare across the data corpus, but common within the document. The basis for this approach to computing relevance is known as TF-IDF or (term frequency-inverse document frequency).
Assuming there is no custom sorting, results are then ranked by search score before they are returned to the calling application. If `$top` is not specified, 50 items having the highest search score are returned.

Search score values can be repeated throughout a result set. For example, you might have 10 items with a score of 1.2, 20 items with a score of 1.0, and 20 items with a score of 0.5. When multiple hits have the same search score, the ordering of same scored items is not defined, and is not stable. Run the query again, and you might see items shift position. Given two items with an identical score, there is no guarantee which one appears first.

## When to use custom scoring

You should create one or more scoring profiles when the default ranking behavior doesn’t go far enough in meeting your business objectives. For example, you might decide that search relevance should favor newly added items. Likewise, you might have a field that contains profit margin, or some other field indicating revenue potential. Boosting hits that bring benefits to your business can be an important factor in deciding to use scoring profiles.

Relevancy-based ordering is also implemented through scoring profiles. Consider search results pages you’ve used in the past that let you sort by price, date, rating, or relevance. In Azure Search, scoring profiles drive the ‘relevance’ option. The definition of relevance is controlled by you, predicated on business objectives and the type of search experience you want to deliver.

## Example

As noted, customized scoring is implemented through scoring profiles defined in an index schema. 

This example shows the schema of an index with two scoring profiles (`boostGenre`, `newAndHighlyRated`). Any query against this index that includes either profile as a query parameter will use the profile to score the result set.

    {
      "name": "musicstoreindex",
	  "fields": [
	    { "name": "key", "type": "Edm.String", "key": true },
	    { "name": "albumTitle", "type": "Edm.String", "suggestions": true },
	    { "name": "albumUrl", "type": "Edm.String", "filterable": false },
	    { "name": "genre", "type": "Edm.String" },
	    { "name": "genreDescription", "type": "Edm.String", "filterable": false },
	    { "name": "artistName", "type": "Edm.String", "suggestions": true },
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
              "albumTitle": 1,
              "genre": 5 ,
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
      ]
    }


##Workflow

To implement custom scoring behavior, add a scoring profile to the schema that defines the index. You can have multiple scoring profiles within an index, but you can only specify one profile at time in any given query. 

Start with the [Template](#bkmk_template) provided in this topic.

Provide a name. Scoring profiles are optional, but if you add one, the name is required. Be sure to follow the naming conventions for fields (starts with a letter, avoids special characters and reserved words). See [Naming rules](https://msdn.microsoft.com/library/dn857353.aspx) for more information.

The body of the scoring profile is constructed from weighted fields and functions.

<font>
<table style="font-size:12">
<thead>
<tr><td>element</td><td>description</td></tr></thead>
<tbody 
<tr>
<td><b>Weights</b></td>
<td>
Specify name-value pairs that assign a relative weight to a field. In the [Example](#bkmk_ex), the albumTitle, genre, and artistName fields are boosted 1, 5, and null, respectively. Why is genre boosted so much higher than the others? If search is conducted over data that is somewhat homogeneous (as is the case with 'genre' in the `musicstoreindex`), you might need a larger variance in the relative weights. For example, in the `musicstoreindex`, ‘rock’ appears as both a genre and in identically phrased genre descriptions. If you want genre to outweigh genre description, the genre field will need a much higher relative weight.
</td>
</tr>
<tr>
<td><b>Functions</b></td><td>Used when additional calculations are required for specific contexts. Valid values include `freshness`, `magnitude`, or `distance`. Each function has parameters that are unique to it.
<br>
- `freshness` should be used when you want to boost by how new or old an item is. This function can only be used with datetime fields (edm.DataTimeOffset). Note the `boostingDuration` attribute is used only with the freshness function.
<br>
- `magnitude` should be used when you want to boost based on how high or low a numeric value is. Scenarios that call for this function include boosting by profit margin, highest price, lowest price, or a count of downloads. This function can only be used with double and integer fields.
<br>
- `distance` should be used when you want to boost by proximity or geographic location. This function can only be used with `geo.distance` fields.
<br>
<b>Rules for using functions</b>
<br>
Function type (freshness, magnitude, distance) must be lower case. 
<br>
Functions cannot include null or empty values. Specifically, if you include fieldname, you have to set it to something.
<br>
Functions can only be applied to filterable fields. See [Create Index (Azure Search API)]() for more information about filterable fields.
<br>
Functions can only be applied to fields that are defined in the fields collection of an index.
<td>
</tr>
</tbody>
</table>
</font>

After the index is defined, build the index by uploading the index schema, followed by documents. See [Create Index (Azure Search API)](https://msdn.microsoft.com/library/azure/dn798941.aspx) and [Add or Update Documents (Azure Search API)](https://msdn.microsoft.com/library/azure/dn798930.aspx) for instructions on these operations. Once the index is built, you should have a functional scoring profile that works with your search data.

##Template
This section shows the syntax and template for scoring profiles. Refer to [Index attribute reference](#bkmk_indexref) in the next section for descriptions of the attributes.

    ...
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
            "type": "magnitude | freshness | distance", 
            "boost": # (positive number used as multiplier for raw score != 1), 
            "fieldName": "...", 
            "interpolation": "constant | linear (default) | quadratic | logarithmic", 
            
            "magnitude": { 
              "boostingRangeStart": #, 
              "boostingRangeEnd": #, 
              "constantBoostBeyondRange": true | false (default) 
            }

            // (- or -) 
    
            "freshness": { 
              "boostingDuration": "..." (value representing timespan over which boosting occurs) 
            } 

            // (- or -) 

            "distance": { 
              "referencePointParameter": "...", (parameter to be passed in queries to use as reference location) 
              "boostingDistance": # (the distance in kilometers from the reference location where the boosting range ends) 
            } 
          } 
        ], 
        "functionAggregation": (optional, applies only when functions are specified) 
            "sum (default) | average | minimum | maximum | firstMatching" 
      } 
    ], 
    "defaultScoringProfile": (optional) "...",
    ...

##Index attributes reference

**Note**
A scoring function can only be applied to fields that are filterable. 

<table style="font-size:12">
<thead>
<tr>
<td>Attribute</td>
<td>Description</td>
</tr>
<tr>
<td>Name</td>	<td>Required. This is the name of the scoring profile. It follows the same naming conventions of a field. It must start with a letter, cannot contain dots, colons or @ symbols, and cannot start with the phrase ‘azureSearch’ (case-sensitive). </td>
</tr><tr>
<td>Text</td>	<td>Contains the Weights property.</td>
</tr><tr>
<td>Weights</td>	<td>Optional. A name-value pair that specifies a field name and relative weight. Relative weight must be a positive integer. The maximum value is int32.MaxValue. You can specify the field name without a corresponding weight. Weights are used to indicate the importance of one field relative to another.</td>
<tr>
<td>Functions</td>	<td>Optional. Note that a scoring function can only be applied to fields that are filterable.</td>
</tr><tr>
<td>Type</td>	<td>Required for scoring functions. Indicates the type of function to use. Valid values include magnitude, freshness, and distance. You can include more than one function in each scoring profile. The function name must be lower case.</td>
</tr><tr>
<td>Boost</td>	<td>Required for scoring functions. A positive number used as multiplier for raw score. It cannot be equal to 1.</td>
</tr><tr>
<td>Fieldname</td>	<td>Required for scoring functions. A scoring function can only be applied to fields that are part of the field collection of the index, and that are filterable. In addition, each function type introduces additional restrictions (freshness is used with datetime fields, magnitude with integer or double fields, and distance with location fields). You can only specify a single field per function definition. For example, to use magnitude twice in the same profile, you would need to include two definitions magnitude, one for each field.</td>
</tr><tr>
<td>Interpolation</td>	<td>Required for scoring functions. Defines the slope for which the score boosting increases from the start of the range to the end of the range. Valid values include Linear (default), Constant, Quadratic, and Logarithmic. See [Set interpolations](#bkmk_interpolation) for details.</td>
</tr><tr>
<td>magnitude</td>	<td>The magnitude scoring function is used to alter rankings based on the range of values for a numeric field. Some of the most common usage examples of this are: 
<br>
- Star ratings: Alter the scoring based on the value within the “Star Rating” field. When two items are relevant, the item with the higher rating will be displayed first.
<br>
- Margin: When two documents are relevant, a retailer may wish to boost documents that have higher margins first.
<br>
- Click counts: For applications that track click through actions to products or pages, you could use magnitude to boost items that tend to get the most traffic.
<br>
- Download counts: For applications that track downloads, the magnitude function lets you boost items that have the most downloads.
<tr>
<td>magnitude | boostingRangeStart</td>	<td>Sets the start value of the range over which magnitude is scored. The value must be an integer or double. For star ratings of 1 through 4, this would be 1. For margins over 50%, this would be 50.</td>
</tr><tr>
<td>magnitude | boostingRangeEnd</td>	<td>Sets the end value of the range over which magnitude is scored. The value must be an integer or double. For star ratings of 1 through 4, this would be 4.</td>
</tr><tr> 
<td>magnitude | constantBoostBeyondRange</td>	<td>Valid values are true or false (default). When set to true, the full boost will continue to apply to documents that have a value for the target field that’s higher than the upper end of the range. If false, the boost of this function won’t be applied to documents having a value for the target field that falls outside of the range.</td>
</tr><tr>
<td>freshness</td>	<td>The freshness scoring function is used to alter ranking scores for items based on values in DateTimeOffset fields. For example, an item with a more recent date can be ranked higher than older items. In the current service release, one end of the range will be fixed to the current time. The rate at which the boosting changes from a maximum and minimum range is determined by the Interpolation applied to the scoring profile (see the figure below). To reverse the boosting factor applied, choose a boost factor of < 1.</td>
</tr><tr>
<td>freshness | boostingDuration</td>	<td>Sets an expiration period after which boosting will stop for a particular document. See [Set boostingDuration ](#bkmk_boostdur) in the following section for syntax and examples.</td>
</tr><tr>
<td>distance</td>	<td>The distance scoring function is used to affect the score of documents based on how close or far they are relative to a reference geographic location. The reference location is given as part of the query in a parameter (using the `scoringParameterquery` string option) as a lon,lat argument.</td>
</tr><tr>
<td>distance | referencePointParameter</td>	<td>A parameter to be passed in queries to use as reference location. scoringParameter is a query parameter. See [Search Documents (Azure Search API)](https://msdn.microsoft.com/library/azure/dn798927.aspx) for descriptions of query parameters.</td>
</tr><tr>
<td>distance | boostingDistance</td>	<td>A number that indicates the distance in kilometers from the reference location where the boosting range ends.</td>
</tr><tr>
<td>functionAggregation</td>	<td>Optional. Applies only when functions are specified. Valid values include: sum (default), average, minimum, maximum, and firstMatching. A search score is single value that is computed from multiple variables, including multiple functions. This attributes indicates how the boosts of all the functions are combined into a single aggregate boost that then is applied to the base document score. The base score is based on the tf-idf value computed from the document and the search query.</td>
</tr><tr>
<td>defaultScoringProfile</td>	<td>When executing a search request, if no scoring profile is specified, then default scoring is used (tf-idf only).
A default scoring profile name can be set here, causing Azure Search to use that profile when no specific profile is given in the search request. </td>
</tr>
</tbody>
</table>

##Set interpolations

Interpolations allow you to define the slope for which the score boosting increases from the start of the range to the end of the range. The following interpolations can be used:

- `Linear`	For items that are within the max and min range, the boost applied to the item will be done in a constantly decreasing amount. Linear is the default interpolation for a scoring profile.

- `Constant`	For items that are within the start and ending range, a constant boost will be applied to the rank results.

- `Quadratic`	In comparison to a Linear interpolation that has a constantly decreasing boost, Quadratic will initially decrease at smaller pace and then as it approaches the end range, it decreases at a much higher interval.

- `Logarithmic`	In comparison to a Linear interpolation that has a constantly decreasing boost, Logarithmic will initially decrease at higher pace and then as it approaches the end range, it decreases at a much smaller interval.
 
<a name="Figure1"></a>
![](https://findable.blob.core.windows.net/docs/scoring_interpolations.png)

<a name="bkmk_boostdu"></a>
##Set boostingDuration

`boostingDuration` is an attribute of the freshness function. You use it to set an expiration period after which boosting will stop for a particular document. For example, to boost a product line or brand for a 10-day promotional period, you would specify the 10-day period as "P10D" for those documents.

`boostingDuration` must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an ISO 8601 duration value). The pattern for this is: "P(nD)(T(nH)(nM](nS))".

The following table provides several examples. 

<table style="font-size:12">
<thead>
<tr>
<td><b>Duration</b></td> <td><b>boostingDuration</b></td>
</tr>
</thead>
<tbody>
<tr>
<td>1 day</td>	<td>"P1D"</td>
</tr><tr>
<td>2 days and 12 hours</td>	<td>"P2DT12H"</td>
</tr><tr>
<td>15 minutes</td>	<td>"PT15M"</td>
</tr><tr>
<td>30 days, 5 hours, 10 minutes, and 6.334 seconds</td>	<td>"P30DT5H10M6.334S"</td>
</tr>
</tbody>
</table>

**See Also**

Azure Search Service REST API
Create Index (Azure Search API)
________________________________________

 