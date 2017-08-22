---
title: Describe custom connectors with Postman - Azure Logic Apps | Microsoft Docs
description: 
author: ecfan
manager: anneta
editor: 
services: logic-apps
documentationcenter: 

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/31/2017
ms.author: LADocs; estfan
---

# Describe custom connectors with Postman for logic apps

[Postman](https://www.getpostman.com/) makes your API development faster and easier. 
This tutorial shows how to create a [Postman Collection](https://www.getpostman.com/docs/postman/collections/creating_collections) 
by using the Azure Cognitive Services [Text Analytics API](https://azure.microsoft.com/services/cognitive-services/text-analytics/) as our example. This API identifies the language, sentiment, and key phrases in the text that you pass to this API. You can then use your Postman collection to easily create [custom connectors](../logic-apps/logic-apps-register-custom-api-connector.md) 
for Azure Logic Apps.

## Prerequisites

* If you're new to Postman, 
[install the Postman app](https://www.getpostman.com/apps).

* A [Cogntive Services account]. Learn how to get started with 
the [Text Analytics APIs](../cognitive-services/text-analytics/quick-start.md).

## Create a Postman Collection

Postman collections help you organize and group related requests.

1. In the Postman app, [create an HTTP request for your API endpoint](https://www.getpostman.com/docs/postman/sending_api_requests/requests). 

   When you create this request, you can set the HTTP verb, 
   the request URL, query or path parameters, headers, and the body. 
   For more information, see the Postman documentation for [Requests](https://www.getpostman.com/docs/postman/sending_api_requests/requests).

   For example, to enter the endpoint for the Detect Language API, set these values:

   ![Create request: "HTTP verb", "Request URL", "Authorization"](./media/logic-apps-postman-collection/01-create-api-http-request.png)

   |Parameter|Value| 
   |:--------|:----| 
   |**HTTP verb**|POST| 
   |**Request URL**| https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages| | 
   |**Authorization**|"No Auth"| | 
   ||| 

   ![Request continued: "Parameters"](./media/logic-apps-postman-collection/02-create-api-http-request-params.png)

   |Parameter|Value| 
   |:--------|:----| 
   |**Params**|**Key**: "numberOfLanguagesToDetect" </br>**Value**: "1"| 
   ||| 

   ![Request continued: "Headers"](./media/logic-apps-postman-collection/03-create-api-http-request-header.png)

   |Parameter|Value| 
   |:--------|:----|    
   |**Headers**|**Key**: "Ocp-Apim-Subscription-Key", **Value**: *your-API-subscription-key*, which you can find in your Cognitive Services account </br>**Key**: "Content-Type", **Value**: "application/json"| 
   ||| 

   ![Request continued: "Body"](./media/logic-apps-postman-collection/04-create-api-http-request-body.png)

   |Parameter|Value| 
   |:--------|:----|    
   |**Body**|```{"documents": [{ "id": "1", "text": "Hello World"}]}```| | 
   ||| 

2. To make the request and get the response back, choose **Send**.

3. To save the request to a Postman Collection, choose **Save**.

4. In the **Save Request** box, provide a **Request Name** 
and **Request description**. Later, you use these values for your custom connector.

5. 

