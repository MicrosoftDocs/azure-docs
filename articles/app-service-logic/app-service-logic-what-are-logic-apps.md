<properties 
	pageTitle="What are Logic Apps?" 
	description="Learn more about App Service Logic Apps" 
	authors="kevinlam1" 
	manager="dwrede" 
	editor="" 
	services="logic-apps" 
	documentationCenter=""/>

<tags
	ms.service="logic-apps"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article" 
	ms.date="07/12/2016"
	ms.author="klam"/>

#What are Logic Apps?

Logic Apps provide a way to simplify and implement scalable integrations and workflows in the cloud. It provides a visual designer to model and automate your process as a series of steps known as a workflow.  There are [many connectors](../connectors/apis-list.md) across the cloud and on-premises to quickly integrate across services and protocols.  A logic app begins with a trigger (like 'When an account is added to Dynamics CRM') and after firing can begin many combinations actions, conversions, and condition logic.

The advantages of using Logic Apps include the following:  

- Saving time by designing complex processes using easy to understand design tools
- Implementing patterns and workflows seamlessly, that would otherwise be difficult to implement in code
- Getting started quickly from templates
- Customizing your logic app with your own custom APIs, code, and actions
- Connect and synchronise disparate systems across on-premises and the cloud
- Build off of BizTalk server, API Management, Azure Functions, and Azure Service Bus with first-class integration support

Logic Apps is a fully managed iPaaS (integration Platform as a Service) allowing developers not to have to worry about building hosting, scalability, availability and management.  Logic Apps will scale up automatically to meet demand.

![Flow app designer](./media/app-service-logic-what-are-logic-apps/LogicAppCapture2.png)

As mentioned, with Logic Apps, you can automate business processes. Here are a couple examples:  
 
* Move files uploaded to an FTP server into Azure Storage
* Process and route orders across on-premises and cloud systems
* Monitor all tweets about a certain topic, analyze the sentiment, and create alerts and tasks for items needing followup.

Scenarios such as these can be configured all from the visual designer and without writing a single line of code. Get started [building your logic app now][create].  Once written - a logic app can be [quickly deployed and reconfigured](app-service-logic-create-deploy-template.md) across multiple environments and regions.

## Why Logic Apps?

Logic Apps brings speed and scalability into the enterprise integration space.  The ease of use of the designer, variety of available triggers and actions, and powerful management tools make centralizing your APIs simpler than ever.  As businesses move towards digitalization, Logic Apps allows you to connect legacy and cutting-edge systems together.

Additionally, with our [Enterprise Integration Account][biztalk] you can scale to mature integration scenarios with the power of a [XML messaging][xml], [trading partner management][tpm], and more.

- **Easy to use design tools** - Logic Apps can be designed end-to-end in the browser or with Visual Studio tools. Start with a trigger - from a simple schedule to when a GitHub issue is created. Then orchestrate any number of actions using the rich gallery of connectors.

- **Connect APIs easily** - Even composition tasks that are easy to describe are difficult to implement in code. Logic Apps makes it easy to connect disparate systems. Want to connect your cloud marketing solution to your on-premises billing system? Want to centralize messaging across APIs and systems with an Enterprise Service Bus? Logic apps are the fastest, most reliable way to deliver solutions to these problems.

- **Get started quickly from templates** - To help you get started we've provided a [gallery of templates][templates] that allow you to rapidly create some common solutions. From advanced B2B solutions to simple SaaS connectivity, and even a few that are just 'for fun' - the gallery is the fastest way to get started with the power of Logic Apps.

- **Extensibility baked-in** - Don't see the connector you need? Logic Apps is designed to work with your own APIs and code; you can easily create your own API app to use as a custom connector, or call into an [Azure Function](https://functions.azure.com) to execute snippets of code on-demand. 

- **Real integration horsepower** - Start easy and grow as you need. Logic Apps can easily leverage the power of BizTalk, Microsoft's industry leading integration solution to enable integration professionals to build the solutions they need. Find out more about the [Enterprise Integration Pack](./app-service-logic-enterprise-integration-overview.md).

## Logic App Concepts

The following are some of the key pieces that comprise the Logic Apps experience. 

- **Workflow** - Logic Apps provides a graphical way to model your business processes as a series of steps or a workflow.
- **Managed Connectors** - Your logic apps need access to data and services. Managed connectors are created specifically to aid you when you are connecting to and working with your data. See the list of connectors available now in [managed connectors][managedapis].
- **Triggers** - Some Managed Connectors can also act as a trigger. A trigger starts a new instance of a workflow based on a specific event, like the arrival of an e-mail or a change in your Azure Storage account.
-  **Actions** - Each step after the trigger in a workflow is called an action. Each action typically maps to an operation on your managed connector or custom API apps.
- **Enterprise Integration Pack** - For more advanced integration scenarios, Logic Apps includes capabilities from BizTalk. BizTalk is Microsoft's industry leading integration platform. The Enterprise Integration Pack connectors allow you to easily include validation, transformation, and more in to your Logic App workflows.

## Getting Started  

- To get started with Logic Apps, follow the [create a Logic App][create] tutorial.  
- [View common examples and scenarios](app-service-logic-examples-and-scenarios.md)
- [You can automate business processes with Logic Apps](http://channel9.msdn.com/Events/Build/2016/T694) 
- [Learn How to Integrate your systems with Logic Apps](http://channel9.msdn.com/Events/Build/2016/P462)

[biztalk]: app-service-logic-enterprise-integration-accounts.md
[appservice]: ../app-service/app-service-value-prop-what-is.md
[create]: app-service-logic-create-a-logic-app.md
[managedapis]: ../connectors/apis-list.md
[tpm]: app-service-logic-enterprise-integration-accounts.md
[xml]: app-service-logic-enterprise-integration-b2b.md
[templates]: app-service-logic-use-logic-app-templates.md
