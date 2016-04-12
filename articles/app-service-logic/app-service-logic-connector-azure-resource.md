<properties
   pageTitle="Using the Azure Resource Connector in Logic Apps | Microsoft Azure App Service"
   description="How to create and configure the Azure Resource Connector or API app and use it in a logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="stepsic-microsoft-com"
   manager="erikre"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="02/10/2016"
   ms.author="stepsic"/>

# Get started with the Azure Resource Connector and add it to your Logic App
>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version.

Use the Azure Resource Connector to easily manage Azure Resources inside of your Logic app.

## Create the Azure Resource Connector
To use the Azure Resource Connector API App, you need to first create an instance of it. This can be done either inline while creating a Logic app or by selecting the Azure Resource Manger Connector API app from the Azure Marketplace.

To configure it, you have you need to set up a Service Principal with permissions to do whatever it is you want to do in Azure. All calls will be made on-behalf-of this Service Principal that you set up. This allows you to scope the Connector to use only exactly what you want it to do, and nothing more.

David Ebbo has written [a great blog post](http://blog.davidebbo.com/2014/12/azure-service-principal.html) on how to set this up. Please follow all the instructions there and get your **Tenant ID**, **Client ID** and **Secret**. These three fields, plus the **Subscription ID**, are what are required to configure the Connector.

## Using the Azure Resource Connector in Logic Apps designer
### Trigger
There are two triggers that are supported in the Connector:

Name | Description
---- | -----------
Event occurs | Trigger when an event occurs to a resource in your subscription.
Metric crosses threshold |  Trigger when a metric meets a certain threshold.

### Action

Likewise, you can provide a large number of actions inside your Azure subscription:

For **Resource groups** you can:

Name | Description
---- | -----------
List resource groups | List all of the resource groups in the subscription.
Get resource group | Get a resource group by its id.
Create resource group | Create or update a resource group.
Delete resource group | Delete a resource group.

For **Resources** you can:

Name | Description
---- | -----------
List resources | List resources in your subscription by different types of filters.
Get resource | Get a single resource by its resource Id.
Create or update resource | Create a resource, or, update an existing resource. You must provide all of the properties for that resource.
Resource action |  Perform any other action on a resource. You need to know the action name and the payload that this action takes (if any).
Delete resource | Delete a resource.

For **Resource Providers** you can:

Name | Description
---- | -----------
List resource providers | List all of the available resource providers in the subscription.

For **Resource Group Deployments** you can:

Name | Description
---- | -----------
List deployments | List all of the deployments in a resource group.
Get deployment | Get a template deployment by its id.
Create deployment | Create a new resource group deployment by providing a template.

For **Events** about resources you can:

Name | Description
---- | -----------
Get events | Get events in a subscription or for a resource.

For **Metrics** about resources you can:

Name | Description
---- | -----------
Get metrics | Get a metric for a resource Id.

## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic Apps before signing up for an Azure account, go to [Try Logic App](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

<!--References -->

<!--Links -->
[Creating a Logic App]: app-service-logic-create-a-logic-app.md
