---
title: Import an OData API to Azure API Management | Microsoft Docs
description: Learn how to import an OData API to an API Management instance using the Azure portal.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: how-to
ms.date: 06/06/2023
ms.author: danlep
ms.custom: 
---
# Import an OData API

This article shows how to import an OData-compliant service as an API in API Management. 

In this article, you learn how to:
> [!div class="checklist"]
> * Import an OData metadata description using the Azure portal
> * Manage the OData schema in the portal
> * Secure the OData API

> [!NOTE]
> Importing an OData service as an API from its metadata description is in preview. Currently, testing OData APIs isn't supported in the test console of the Azure portal or in the API Management developer portal.

## Prerequisites

* An API Management instance. If you don't already have one, complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).

* A service exposed as OData v2 or v4.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

[!INCLUDE [api-management-import-odata-metadata](../../includes/api-management-import-odata-metadata.md)]

[!INCLUDE [api-management-append-apis.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
