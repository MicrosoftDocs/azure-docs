---
title: Content management API for developer portal
titleSuffix: Azure API Management
description: Learn about the content management API and how it's used to save and retrieve content for the API Management developer portal.
author: erikadoyle
ms.author: apimpm
ms.date: 03/25/2021
ms.service: api-management
ms.topic: conceptual
---

# Content management API for the developer portal

The API Management developer portal is a static web application that relies on the content management API to save and retrieve content. Classic content management systems store content in form of HTML. Developer portal outputs structured JSON. Every element, from a page layout to a hyperlink, has a strictly defined contract. This approach lets the developer portal:

- Abstract data from its representation.

- Ensure content consistency.

- Avoid mixing different types of data.

- Build JSON-based Resource Manager templates.

The content management API is an endpoint in the [Azure API Management REST API](/rest/api/apimanagement/apimanagementrest/api-management-rest). You can find API reference along with samples in these articles:

- [Content Types](/rest/api/apimanagement/2019-12-01/contenttypes), [Content Type](/rest/api/apimanagement/2019-12-01/contenttype) - a content type is an entity describing a content item, its properties, validation rules, and constraints.
- [Content Item](/rest/api/apimanagement/2019-12-01/contentitem) - a content item represents data that the content type it belongs to describes.

> [!NOTE]
> The developer portal comes with the following content types built-in that you can't change or remove: *Pages*, *Layouts*, *Blog posts*, *Blobs*, *URLs*, *Design blocks*, *Styles*, *Documents*. You can only carry out a GET operation on them.
>
> Also, custom content types ids need to start with the `c-` prefix.

## Authentication

You can use the official REST API via Azure Resource Manager or the direct access API in API Management. If you use the direct access API, you need to [get a direct API access token](/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-authentication).

## Open Data Protocol support

Content management API supports the following Open Data Protocol (OData) operations: *filtering* and *ordering*.

### Filtering

Filter the queried collection by one or more entity properties.

Example:

```http
GET /contentTypes/page/contentItems?$filter=title eq 'about'
```

More options:

```http
$filter=contains(title,'ab')
```

```http
$filter=startswith(title,'hom')
```

```http
$filter=endswith(title,'me')
```

### Ordering

Order the queried collection by an entity property.

Example:

```http
GET /contentTypes/page/contentItems?$orderby=en_us/title desc
```
## Next steps

- [Implement widgets](developer-portal-implement-widgets.md)
