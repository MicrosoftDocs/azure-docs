---
title: Register and use custom connectors - Azure Logic Apps | Microsoft Docs
description: Learn how to register custom APIs as connectors for Azure Logic Apps
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

# Register and use custom APIs (connectors) in Azure Logic Apps

Logic Apps helps you build workflows without code. 
But sometimes, you need to extend Logic Apps capabilites, 
and web services naturally fit this scenario. 
Your workflow can connect to a service, perform operations, 
and get data back. When you have a web service that 
you want to connect to Azure Logic Apps, 
you can register your service as a custom connector. 
This process helps Azure Logic Apps understand the 
your Web API's characteristics, including the required authentication, 
the supported operations, and the parameters and outputs for each operation.

This topic describes the steps for how to register and use a custom connector 
by using the Azure Cognitive Services Text Analytics API as our example. 
This API identifies the language, sentiment, and key phrases in the text 
that you pass to this API. For example, this image shows the interaction 
between your service, the custom API, or connector, that we create from 
that service, and the logic app that calls the API.

![Conceptual overview for Azure Cognitive Services API, custom connector, and Logic Apps](./media/logic-apps-register-custom-api-connector/custom-connector-conceptual.png)

## Prerequisites

* An Azure subscription. If you don't have a subscription, 
you can start with a [free Azure account](https://azure.microsoft.com/free/). 
Otherwise, sign up for a [Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* Any item here:

  * An [OpenAPI 2.0 file in JSON format](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md), 
  previously known as the Swagger Specification
  * A URL to an OpenAPI definition
  * A [Postman collection](https://www.getpostman.com/docs/postman/collections/creating_collections) 
  for your API 

  If you don't have any of these, we'll provide guidance for you.

* Optional: An image to use as an icon for your custom connector

## Overview: Steps in the custom connector process

The custom connector process has several steps, 
which we describe briefly below. This article assumes that you 
already have a RESTful API with some type of authenticated access, 
so we'll focus on Steps 3-6 in this article. For example of Steps 1 and 2, 
see [Create a custom Web API (connector) for Logic Apps](../logic-apps/logic-apps-custom-api-web-api-tutorial.md).

1. **Build a RESTful API** in your chosen language and platform. 
For Microsoft technologies, we recommend one of these platforms:

   * [Azure Functions](https://azure.microsoft.com/services/functions/)
   * [Azure Web Apps](https://azure.microsoft.com/services/app-service/web/)
   * [Azure API Apps](https://azure.microsoft.com/services/app-service/api/)

2. **Secure your API** with one of these authentication mechanisms: 

   * [Azure Active Directory](https://azure.microsoft.com/develop/identity/)
   * [OAuth 2.0](https://oauth.net/2/) for specific services, such as Dropbox, 
   Facebook, and SalesForce
   * Generic OAuth 2.0
   * API Key
   * Basic Authentication

   You can allow unauthenticated access to your APIs, 
   but we don't recommend that.

3. **Describe your API** using one of these industry-standard ways 
so that Logic Apps can connect to your API:

   * An OpenAPI file, also known as a Swagger file
   * A Postman collection

   You can also build an OpenAPI file in Step 4 
   as part of the registration process.

4. **Register your custom connector** by using a **wizard - WHAT WIZARD** in Logic Apps, 
where you specify an API description, security details, 
and other information.

5. **Include your custom connector in a logic app**. 
In your logic app, create a connection to your connector, 
and call any operations that the API provides, 
in the same way that you call standard connections in Logic Apps.

6. **Share your custom connector** the same way that you share 
other resources in Logic Apps. Although this step is optional, 
it often makes sense to share custom connectors across 
multiple logic app creators.

## Describe your API

Assuming that you have an API with some type of authenticated access, 
you need a way to describe the API so that Logic Apps can connect to your API. 
For this, you create an OpenAPI file or a Postman collection, 
which you can do from any REST API endpoint, including:

* Publicly available connectors, for example, [Spotify](https://developer.spotify.com/), 
[Slack](https://api.slack.com/), [Rackspace](http://docs.rackspace.com/), and more

* An API that you create and deploy to any cloud hosting provider, 
such as Azure, Amazon Web Services (AWS), Heroku, Google Cloud, and more

* A custom line-of-business API that's deployed to your network 
as long as that API is exposed on the public internet

> [!NOTE]
> Your file size must be less than 1MB.

OpenAPI 2.0, previously known as Swagger, 
and Postman collections use different formats, 
but both are language-agnostic machine-readable documents 
that describe your API's operations and parameters.
You can generate these documents by using various tools, 
depending on the language and platform 
that you used to build your API. 
For an example OpenAPI file, see the 
[Text Analytics API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/export?DocumentFormat=Swagger&ApiName=Azure). 

If you don't already have an OpenAPI file for your API and don't want to create one, 
you can still easily create a custom connector by using a Postman collection. 
Logic Apps ultimately uses OpenAPI behind the scenes, 
parses a Postman collection, and translates the Collection to an OpenAPI definition file. 
For more information, see [Describe custom connectors with Postman](../logic-apps/logic-apps-postman-collection.md).

### Get started with OpenAPI and Postman

* If you're new to OpenAPI, 
visit [Getting started with Swagger](http://swagger.io/getting-started/) 
on the swagger.io site.

* If you're new to Postman, 
[install the Postman app](https://www.getpostman.com/apps) 
from their site.

* **NEED LOGIC APPS INFO** 
If you built your API with Azure API Apps or Azure Functions, see 
[Exporting an Azure hosted API to Microsoft Flow and Microsoft Flow](../app-service/app-service-export-api-to-powerapps-and-flow.md).

## Register your custom connector

Now register your custom connector in Logic Apps by 
using your OpenAPI file or Postman collection.

**NEED LOGIC APPS STEPS IN AZURE PORTAL STEPS**

#### Quota and throttling 

**NEED LOGIC APPS INFO**

* For details about custom connector creation quotas, 
see the Logic Apps pricing page.

* For each connection created for a custom connector, 
users can make up to **# FOR LOGIC APPS** requests per minute.

## Share your custom connector

Now that you have a custom connector, 
you can share your connector with other users in your organization. 
Remember that when you share an custom connector, 
others might start to depend on that connector, 
and deleting the connector deletes all connections to that connector. 
To provide a connector for users outside your organization, 
see [Certify custom connectors in Logic Apps](**NEED LOGIC APPS TOPIC**).

**NEED LOGIC APPS INFO**

## Next steps

* [Create a custom Web API (connector) for Logic Apps](../logic-apps/logic-apps-custom-api-web-api-tutorial.md)
* [Describe custom connectors with Postman](../logic-apps/postman-collection.md)
* [Custom OpenAPI extensions](../logic-apps/customapi-how-to-swagger.md)








