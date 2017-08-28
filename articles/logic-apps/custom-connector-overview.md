---
title: Custom connectors overview - Azure Logic Apps | Microsoft Docs
description: Overview about creating custom connectors for supporting and expanding integration scenarios
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

# Custom connectors overview

[Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/), [Microsoft Flow](https://flow.microsoft.com), 
and [Microsoft PowerApps](https://powerapps.microsoft.com) 
help you build workflows or apps without code. But sometimes, 
you might need to extend extend these services' capabilites, 
so that they can support your users' business and productivity needs.

For more tailored scenarios, you can build *custom connectors* 
so that your users can build workflows or apps for integrating their 
data and business processes with prebuilt triggers and actions. 
Custom connectors expand the integrations, reach, discoverability, 
and use for your service or product, which can help increase and accelerate customer adoption.

For example, this diagram shows the interaction between an API, 
the custom connector for that API, and a logic app that works with 
that API through the custom connector:

![Conceptual overview for Azure Cognitive Services API, custom connector, and logic app](./media/logic-apps-register-custom-api-connector/custom-connector-conceptual.png)

This overview outlines the general high-level tasks for creating, 
securing, registering, and using plus optionally sharing or certifying 
your connectors:

![Custom connector authoring steps](./media/custom-connector-overview/authoring-steps.png)

## Prerequisites

To build your custom connector from end-to-end, 
you need these items:

* An Azure subscription. If you don't have a subscription, 
you can start with a [free Azure account](https://azure.microsoft.com/free/). 
Otherwise, sign up for a [Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* A RESTful API with some type of authenticated access 

* Any item here:

  * An [OpenAPI 2.0 file in JSON format](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md), 
  previously known as the Swagger Specification

  * A URL to an OpenAPI definition

  * A [Postman collection](https://www.getpostman.com/docs/postman/collections/creating_collections) 
  for your API 

  If you don't have any of these, we'll provide guidance for you.

* Optional: An image to use as an icon for your custom connector

## 1. Build your RESTful API

Technically, a connector is a wrapper around a REST API 
that's based on an OpenAPI (formerly Swagger) specification 
and lets your underlying service talk to Logic Apps, Flow, or PowerApps. 
So first, you need a fully functioning API before you create your custom connector. 

You can use any language and platform for your API. For Microsoft technologies, 
we recommend one of these platforms:

* [Azure Functions](https://azure.microsoft.com/services/functions/)
* [Azure Web Apps](https://azure.microsoft.com/services/app-service/web/)
* [Azure API Apps](https://azure.microsoft.com/services/app-service/api/)

For example, this tutorial shows 
[how to build a custom connector from a Web API](../logic-apps/custom-connector-build-web-api-app-tutorial.md).

## 2. Secure your API

To secure calls to your APIs, you can set up Azure Active Directory (Azure AD) 
authentication for your API through the Azure portal so you don't have to update your code. 
Or, you can require and enforce authentication through your API's code. 
You can use these authentication standards for your APIs:

   * [Azure Active Directory](https://azure.microsoft.com/develop/identity/)
   * [OAuth 2.0](https://oauth.net/2/) for specific services, such as Dropbox, 
   Facebook, and SalesForce
   * Generic OAuth 2.0
   * API Key
   * Basic authentication

For more information, follow the appropriate tutorials:

* [Logic Apps: Secure your custom connector](../logic-apps/custom-connector-security-authentication-overview.md)
* [Flow: Secure your custom connector](https://ms.flow.microsoft.com/documentation/customapi-azure-resource-manager-tutorial/)
* [PowerApps: Secure your custom connector](https://powerapps.microsoft.com/tutorials/customapi-azure-resource-manager-tutorial/)

## 3. Describe your API 

Assuming that your API has some type of authenticated access, 
you need to describe your API's interface and operations so that 
Logic Apps, Flow, or PowerApps can communicate with your API.
use one of these industry standard definitions:

* An [OpenAPI 2.0 (previously Swagger) file](https://swagger.io/). 
You can start by building with an existing OpenAPI file, 
or you can import a [Postman collection](https://www.getpostman.com/docs/collections). 

  If you're new to OpenAPI, 
  visit [Getting started with Swagger](http://swagger.io/getting-started/) 
  on the swagger.io site.
  For an example OpenAPI file, see the 
  [Text Analytics API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/export?DocumentFormat=Swagger&ApiName=Azure). 

* A Postman collection, 
which automatically generates the OpenAPI file for you. 
When you don't already have an OpenAPI file 
and don't want to create one, you can still easily 
create a custom connector by using a Postman collection.

  If you're new to Postman, [install the Postman app](https://www.getpostman.com/apps) 
  from their site.

OpenAPI 2.0 and Postman collections use different formats, 
but both are language-agnostic machine-readable documents 
that describe your API's operations and parameters.
You can generate these documents by using various tools, 
depending on the language and platform that you used to build your API. 

> [!IMPORTANT]
> Your file size must be less than 1MB.

Behind the scenes, Logic Apps, Flow, and PowerApps ultimately use OpenAPI, 
parses a Postman collection, and translates the collection to an OpenAPI definition file. For more information, see 
[Describe custom connectors with Postman](../logic-apps/custom-connector-postman-collection.md).

For example, you create an OpenAPI file or a Postman collection 
from any REST API endpoint, including:

* Publicly available connectors, for example, 
[Spotify](https://developer.spotify.com/), 
[Slack](https://api.slack.com/), 
[Rackspace](http://docs.rackspace.com/), and so on.

* An API that you create and deploy to any cloud hosting provider, 
such as Azure, Amazon Web Services (AWS), Heroku, Google Cloud, and more

* A custom line-of-business API that's deployed to your network 
as long as that API is exposed on the public internet

You can also build an OpenAPI file during the registration process.

## 4. Register your connector

The registration process helps Logic Apps, Flow, or PowerApps understand 
your API's characteristics, including the description, required authentication, 
supported operations, and the parameters and outputs for each operation. 
When you start the registration wizard, you can provide either an 
OpenAPI file or a Postman collection, which automatically populates the 
metadata fields in the wizard. You can edit these fields' values at any time.

![Describe your API](./media/custom-connector-overview/build-your-api-updated.png)

To register your connector, follow the appropriate tutorial:

* [Logic Apps: Register your connector](../logic-apps/logic-apps-custom-connector-register.md)
* [Flow; Register your connector](https://ms.flow.microsoft.com/documentation/register-custom-api/#register-your-custom-connector)
* [PowerApps: Register your connector](https://powerapps.microsoft.com/tutorials/register-custom-api/#register-your-custom-connector)

### 4a. Provide connector details

To identify your connector, add an icon and description. 

![Connector details](./media/custom-connector-overview/add-connector-details.png)

### 4b. Choose the authentication type for your connector

To make sure that user identities flow appropriately between 
your service and any clients, select the authentication type 
that your service supports. Then provide additional 
details for that authentication type.

![Choose authentication type](./media/custom-connector-overview/security.png)

### 4c. Define triggers and actions

To describe the triggers and actions that users can 
use in their flows, you can edit your connector's schema 
and response for existing operations, or add new operations.
You can specify each operation's properties so that you can 
control your connector's end-user experience. 

![Connector definition](./media/custom-connector-overview/definition.png)

To learn more about the different operation types:

* Triggers for [Logic Apps](**NEED TOPIC**) and [Flow](https://ms.flow.microsoft.com/documentation/customapi-webhooks/) 
(not available for PowerApps)

* Actions for [Logic Apps](../logic-apps/logic-apps-custom-connector-register.md), 
[Flow](https://ms.flow.microsoft.com/documentation/register-custom-api), 
and [PowerApps](https://powerapps.microsoft.com/en-us/tutorials/register-custom-api)

For advanced connector functionality, 
see [Logic Apps: OpenAPI extensions for custom connectors](../logic-apps/custom-connector-openapi-extensions.md) 
or [Flow: OpenAPI extensions for custom connectors](https://ms.flow.microsoft.com/documentation/customapi-how-to-swagger/).

To request features that aren't available in the registration wizard, 
please contact [condevhelp@microsoft.com](mailto:condevhelp@microsoft.com).

### Quotas and throttling 

For details about connector creation quotas, 
see the appropriate pricing page:

* [Logic Apps](**NEED INFO!!!!!!!!**)
* [Flow pricing](https://flow.microsoft.com/pricing/)
* [PowerApps pricing](https://powerapps.microsoft.com/pricing/)

For each connection that's created for a custom connector, 
users can make up to 500 requests per minute. (**VERIFY FOR LOGIC APPS**)

## 5. Use your connector in a logic app, flow, or app 

You can use your connector the same way that you do with 
Microsoft-managed connectors. For example, in a logic app workflow, 
create a connection to your API with your custom connector, 
and call any operations that the API provides, 
in the same way that you call Microsoft-managed connections.

## 6. Share your connector 

You can share your connector with other users in your organization 
the same way that you share resources in Logic Apps, Flow, or PowerApps. 
Although this step is optional, you might have scenarios 
where you want to share custom connectors with other creators. 

Remember that when you share a connector, 
others might start to depend on that connector. 
***Deleting your connector deletes all connections to that connector.***

* [Logic Apps: Share your connector](**NEED TOPIC**)
* [Flow: Share your connector](https://ms.flow.microsoft.com/documentation/register-custom-api/#share-your-custom-connector)
* [PowerApps: Share your connector](https://powerapps.microsoft.com/tutorials/register-custom-api/#share-your-custom-connector)

> [!NOTE] 
> Registered but uncertified custom connectors work like 
> Microsoft-managed connectors, but are visible and available 
> *only* to the connector's author and users who have the same 
> Azure Active Directory tenant and Azure subscription 
> for apps in the region where they are deployed. 
> 
> To share your connector with external users outside these boundaries, 
> submit your connector for Microsoft certification.

## Submit your connector for Microsoft certification

To optionally share your connector with all users in Logic Apps, Flow, 
and PowerApps, submit the connector for Microsoft certification. 
This process reviews and validates your connector's functionality for Logic Apps, 
Flow, and PowerApps, and checks for technical and content compliance 
before Microsoft can publish your connector. Learn 
[how to submit your connector for Microsoft certification](../logic-apps/custom-connector-submit-certification.md).

## Get support

For support with onboarding and development, please email 
[condevhelp@microsoft.com](mailto:condevhelp@microsoft.com). 
Microsoft actively monitors and manages this account, 
routing developer questions and incidents to the appropriate team.

## Next steps

* [Build a custom connector from a Web API](../logic-apps/custom-connector-build-web-api-app-tutorial.md)
* [Set up authentication for custom connectors](../logic-apps/custom-connector-security-authentication-overview.md)
* [Describe custom connectors with Postman collections](../logic-apps/custom-connector-api-postman-collection.md)
* [Submit custom connectors for Microsoft certification](../logic-apps/custom-connector-submit-certification.md)
