---
title: moreLikeThis in Azure Search (preview) - Azure Search
description: Preliminary documentation for the moreLikeThis (preview) feature, exposed in the Azure Search REST API.
author: brjohnstmsft
manager: jlembicz
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: brjohnst
ms.custom: seodec2018
---
# moreLikeThis in Azure Search

> [!Note]
> moreLikeThis is in preview and not intended for production use. The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no .NET SDK support at this time.

`moreLikeThis=[key]` is a query parameter in the [Search Documents API](https://docs.microsoft.com/rest/api/searchservice/search-documents) that finds documents similar to the document specified by the document key. When a search request is made with `moreLikeThis`, a query is generated with search terms extracted from the given document that describe that document best. The generated query is then used to make the search request. By default, the contents of all searchable fields are considered, minus any restricted fields that you specified using the `searchFields` parameter. The `moreLikeThis` parameter cannot be used with the search parameter, `search=[string]`.

By default, the contents of all top-level searchable fields are considered. If you want to specify particular fields instead, you can use the `searchFields` parameter. 

You cannot use moreLikeThis on searchable sub-fields in a [complex type](search-howto-complex-data-types.md).

## Examples 

Below is an example of a moreLikeThis query. The query finds documents whose description fields are most similar to the field of the source document as specified by the `moreLikeThis` parameter.

```
Get /indexes/hotels/docs?moreLikeThis=1002&searchFields=description&api-version=2019-05-06-Preview
```

```
POST /indexes/hotels/docs/search?api-version=2019-05-06-Preview
    {
      "moreLikeThis": "1002",
      "searchFields": "description"
    }
```


## Next steps

You can use any web testing tool to experiment with this feature.  We recommend using Postman for this exercise.

> [!div class="nextstepaction"]
> [Explore Azure Search REST APIs using Postman](search-get-started-postman.md)