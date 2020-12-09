---
title: Content management API
description: placeholder description text Content management API
author: erikadoyle
ms.author: apimpm
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

# Content management API

New developer portal is a static web application, which relies on the content management API to save and retrieve content. Unlike classic CMSes, which store content in form of HTML, the developer portal outputs structured JSON. Every element from a page layout to a hyperlink has a strictly-defined contract. This approach allows to abstract data from its representation, ensure content consistency, avoid mixing different types of data, build JSON-based ARM templates, and more.

The content management API is an endpoint in the [Azure API Management REST API](/rest/api/apimanagement/apimanagementrest/api-management-rest). You can find API reference along with samples in the official Azure documentation:

- [Content Types](/rest/api/apimanagement/2019-12-01/contenttypes), [Content Type](/rest/api/apimanagement/2019-12-01/contenttype) - a content type is an entity describing a content item, its properties, validation rules, and constraints.
- [Content Item](/rest/api/apimanagement/2019-12-01/contentitem) - a content item represents data, which is described by a content type it belongs to.

Note:

- The following content types are built-in and can't be modified or removed (you can't perform operation other than GET): *Pages*, *Layouts*, *Blog posts*, *Blobs*, *URLs*, *Design blocks*, *Styles*, *Documents*.
- Custom content types ids need to start with the `c-` prefix

## Authentication

You can use the official rest API via Azure Resource Manager (ARM) or via the direct access API in API Management, in which case you need to [obtain a direct API access token](/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-authentication).

## OData support

Content management API supports filtering and ordering OData operations.

### Filtering

Filter the queried collection by one or more entity properties.

Example:

```
GET /contentTypes/page/contentItems?$filter=title eq 'about'
```

More options:

```
$filter=contains(title,'ab')
```

```
$filter=startswith(title,'hom')
```

```
$filter=endswith(title,'me')
```

### Ordering

Order the queried collection by an entity property.

Example:

```
GET /contentTypes/page/contentItems?$orderby=en_us/title desc
```
