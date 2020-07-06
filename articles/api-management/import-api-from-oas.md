---
title: Import an OpenAPI specification using the Azure portal | Microsoft Docs
description: Learn how to import an OpenAPI specification with API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 04/20/2020
ms.author: apimpm

---
# Import an OpenAPI specification

This article shows how to import an "OpenAPI specification" back-end API residing at https://conferenceapi.azurewebsites.net?format=json. This back-end API is provided by Microsoft and hosted on Azure. The article also shows how to test the APIM API.

In this article, you learn how to:

> [!div class="checklist"]
> * Import an "OpenAPI specification" back-end API
> * Test the API in the Azure portal
> * Test the API in the Developer portal

## Prerequisites

Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## <a name="create-api"> </a>Import and publish a back-end API

1. Navigate to your API Management service in the Azure portal and select **APIs** from the menu.
2. Select **OpenAPI specification** from the **Add a new API** list.

    ![OpenAPI specification](./media/import-api-from-oas/oas-api.png)
3. Enter API settings. You can set the values during creation or configure them later by going to the **Settings** tab. The settings are explained in the [Import and publish your first API](import-and-publish.md#-import-and-publish-a-backend-api) tutorial.
4. Select **Create**.

> [!NOTE]
> The API import limitations are documented in [another article](api-management-api-import-restrictions.md).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]

## Next steps

> [!div class="nextstepaction"]
> [Transform and protect a published API](transform-api.md)
