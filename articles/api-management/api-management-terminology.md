---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure API Management terminology | Microsoft Docs
description: This article gives definitions for the terms that are specific to API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 10/11/2017
ms.author: apimpm
---

# Terminology

This article gives definitions for the terms that are specific to API Management (APIM).

## Term definitions

* **Backend API** -  An HTTP service that implements your API and its operations. 
* **Frontend API**/**APIM API** - An APIM API does not host APIs, it creates facades for your APIs in order to customize the facade according to your needs without touching the back end API. For more information, see [Import and publish an API](import-and-publish.md).
* **APIM product** -  a product contains one or more APIs as well as a usage quota and the terms of use. You can include a number of APIs and offer them to developers through the Developer portal. For more information, see [Create and publish a product](api-management-howto-add-products.md).
* **APIM API operation** -  Each APIM API represents a set of operations available to developers. Each APIM API contains a reference to the back end service that implements the API, and its operations map to the operations implemented by the back end service. For more information, see [Mock API responses](mock-api-responses.md).
* **Version** - Sometimes you want to publish new or different API features to some users, while others want to stick with the API that currently works for them. For more information, see [Publish multiple versions of your API](api-management-get-started-publish-versions.md).
* **Revision** - When your API is ready to go and starts to be used by developers, you usually need to take care in making changes to that API and at the same time not to disrupt callers of your API. It's also useful to let developers know about the changes you made. For more information, see [Use revisions](api-management-get-started-revise-api.md).
* **Developer portal** - Your customers (developers) should use the Developer portal to access your APIs. The Developer portal can be customized. For more information, see [Customize the Developer portal](api-management-customize-styles.md).

## Next steps

> [!div class="nextstepaction"]
> [Create an instance](get-started-create-service-instance.md)

