---
title: Manually Add an API by Using the Azure portal | Microsoft Docs
description: Learn how to use Azure API Management in the Azure portal to manually add an API. Add and test various operations.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: how-to
ms.date: 05/16/2025
ms.author: danlep
ms.custom: fasttrack-edit, devdivchpfy22


#customer intent: As an API developer, I want to use API Management to manually add an API. 
---

# Manually add an API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article shows how to manually add an API to Azure API Management. When you want to create mock responses from the API, you can create a blank API. For information about creating mock API responses, see [Mock API responses](mock-api-responses.md).

If you want to import an existing API, see the [Related content](#related-content) section of this article.

In this article, you learn how to create a blank API. You'll specify [httpbin.org](https://httpbin.org) (a public testing service) as a backend API.

## Prerequisites

- Complete the [Create an Azure API Management instance](get-started-create-service-instance.md) quickstart.

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Create an API

1. Under **APIs** in the left menu, select **APIs**.
1. Select **+ Add API**.
1. Select the **HTTP** tile:

    :::image type="content" source="media/add-api-manually/blank-api-1.png" alt-text="Screenshot that shows the HTTP tile in the Azure portal.":::     
      
1. Enter the backend **Web service URL** (for example, `https://httpbin.org`) and other settings for the API. The settings are explained in the [Import and publish your first API](import-and-publish.md#import-and-publish-a-backend-api) tutorial.
1. Select **Create**.

At this point, you have no operations in API Management that map to the operations in your backend API. If you call an operation that's exposed through the backend but not through API Management, you get a 404 error.

>[!NOTE]
> By default, when you add an API, even if it's connected to a backend service, API Management won't expose any operations until you allow them. To allow an operation of your backend service, create an API Management operation that maps to the backend operation.

## Add and test an operation

This section shows how to add a `/get` operation to map it to the backend `http://httpbin.org/get` operation.

### Add an operation

1. Select the API you created in the previous step.
1. Select **+ Add operation**.
1. In **URL**, select **GET** and enter **/get** in the text box.
1. In **Display name**, enter **FetchData**.
1. Select **Save**.

### Test the operation

Test the operation in the Azure portal. (You can also test it in the developer portal.)

1. Select the **Test** tab.
1. Select **FetchData**.
1. Select **Send**.

The response that the `http://httpbin.org/get` operation generates appears in the **HTTP response** section. If you want to transform your operations, see [Transform and protect your API](transform-api.md).

## Add and test a parameterized operation

This section shows how to add an operation that takes a parameter. In this example, you map the operation to `http://httpbin.org/status/200`.

### Add an operation

1. Select the API that you created earlier.
1. On the **Design** tab, select **+ Add operation**.
1. In **URL**, select **GET** and enter **/status/{code}** in the text box. 
1. In **Display name**, enter **GetStatus**.
1. Select **Save**.

### Test the operation

Test the operation in the Azure portal. (You can also test it in the developer portal.)

1. Select the **Test** tab.
1. Select **GetStatus**. In **code**, enter **200**. 
1. Select **Send**.

    The response that the `http://httpbin.org/status/200` operation generates appears in the **HTTP response** section. If you want to transform your operations, see [Transform and protect your API](transform-api.md).

## Add and test a wildcard operation

This section shows how to add a wildcard operation. A wildcard operation enables you to pass an arbitrary value with an API request. Instead of creating separate GET operations as shown in the previous sections, you could create a wildcard GET operation.

> [!CAUTION]
> Be cautious when you configure a wildcard operation. This configuration might make an API more vulnerable to certain [API security threats](mitigate-owasp-api-threats.md#improper-inventory-management).

### Add an operation

1. Select the API you created earlier.
1. On the **Design** tab, select **+ Add operation**.
1. In **URL**, select **GET** and enter **/*** in the text box.
1. In **Display name**, enter **WildcardGet**.
1. Select **Save**.

### Test the operation 

Test the operation in the Azure portal. (You can also test it in the developer portal.)

1. Select the **Test** tab.
1. Select **WildcardGet**. Try the GET operations that you tested in previous sections, or try a different supported GET operation.

    For example, in **Template parameters**, change the value next to the wildcard (*) name to **headers**. The operation returns the incoming request's HTTP headers.
1. Select **Send**.

    The response that the `http://httpbin.org/headers` operation generates appears in the **HTTP response** section. If you want to transform your operations, see [Transform and protect your API](transform-api.md).
  
>[!NOTE]
> It can be important to understand how the host for the backend API you're integrating with handles trailing slashes on an operation URL. For more information, see this [API Management FAQ](./api-management-faq.yml#how-does-api-management-handle-trailing-slashes-when-calling-backend-services-).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-append-apis.md)]

[!INCLUDE [api-management-define-api-topics.md](../../includes/api-management-define-api-topics.md)]
