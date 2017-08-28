---
title: Create custom connectors - Azure Logic Apps | Microsoft Docs
description: Workflow for how to create custom connectors
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
ms.date: 09/1/2017
ms.author: LADocs; estfan
---

# Workflow: Create custom connectors

and web services naturally fit this scenario. 
Your workflow can connect to a service, perform operations, 
and get data back. When you have a web service that 
you want to connect to Azure Logic Apps, 

This image shows the interaction between your API (service), 
the custom connector that you create from that API, 
and the logic app that calls the API.

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
see [Create a custom Web API (connector) for Logic Apps](../logic-apps/logic-apps-custom-api-connector-web-app-tutorial.md).

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

3. **Describe your API** with one of these industry-standard 
ways so that Logic Apps can connect to your API:

   * An OpenAPI (Swagger) file
   * A Postman collection

   You can also build an OpenAPI file in Step 4 
   as part of the registration process.

4. **Register your custom connector** 
by using the Logic Apps Connector wizard 
where you specify an API description, 
security details, and other information.

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

> [!IMPORTANT]
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
For more information, see [Describe custom connectors with Postman](../logic-apps/logic-apps-custom-api-connector-postman-collection.md).

### Get started with OpenAPI and Postman

* If you're new to OpenAPI, 
visit [Getting started with Swagger](http://swagger.io/getting-started/) 
on the swagger.io site.

* If you're new to Postman, 
[install the Postman app](https://www.getpostman.com/apps) 
from their site.

* **NEED LOGIC APPS INFO** 
If you built your API with Azure API Apps or Azure Functions, see 
[Exporting an Azure-hosted API](../app-service/app-service-export-api-to-powerapps-and-flow.md).

## Register your custom connector

Now register your custom connector with Logic Apps, Flow, or PowerApps 
by importing your OpenAPI file or Postman collection.

### Quota and throttling 

**NEED LOGIC APPS INFO**

* For details about custom connector creation quotas, 
see the Logic Apps pricing page.

* For each connection that's created for a custom connector, 
users can make up to **# FOR LOGIC APPS** requests per minute.

## Share your custom connector

Now that you have a custom connector, 
you can share your connector with other users in your organization. 
Remember that when you share an custom connector, 
others might start to depend on that connector, 
and deleting the connector deletes all connections to that connector. 
To provide a connector for users outside your organization, 
see [Certify custom connectors](**NEED LOGIC APPS TOPIC**).

**NEED LOGIC APPS INFO**

## Next steps

* [Create custom connectors from Web APIs](../logic-apps/custom-connector-build-web-api-app-tutorial.md)
* [Describe custom connectors with Postman](../logic-apps/custom-connector-api-postman-collection.md)
* [OpenAPI extensions for custom connectors](../logic-apps/customapi-how-to-swagger.md)