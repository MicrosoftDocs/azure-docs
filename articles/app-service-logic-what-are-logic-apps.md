<properties 
	pageTitle="What are Logic Apps?" 
	description="Learn more about App Service Logic Apps" 
	authors="joshtwist" 
	manager="dwrede" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/24/2015"
	ms.author="jtwist"/>

#What are Logic Apps?

Azure App Service is a fully managed Platform as a Service (PaaS) offering for professional developers that brings a rich set of capabilities to web, mobile and integration scenarios. Logic Apps are one part of the App Service suite and allow any technical user or developer to automate business process execution via an easy to use visual designer.

Best of all, Logic Apps can be combined with API apps and Connectors from our Marketplace to help solve even tricky integration scenarios with ease.

![Flow app designer](./media/app-service-learn-about-flows-preview/Designer.png)

##The SaaS, PaaS and Hybrid Explosion

The cloud era is bringing an explosion in the usage of SaaS and PaaS systems, putting increasing strain on developers everywhere. Meanwhile, IT's application backlogs are getting longer and these heterogeneous and distributed solutions present new integration challenges.  Furthermore, enterprises need to leverage their on-premises data and services in their solutions, and need to do so securely.

Building solutions that span these systems poses non-trivial challenges that are time consuming and error prone for development teams.

##Why Logic Apps?

Logic Apps allow developers to design workflows that articulate intent via a trigger and series of steps, each invoking an App Service API app whilst securely taking care of authentication and best practices like durable execution.

- **Easy to use design tools** - Logic Apps can be designed end-to-end in the browser. Start with a trigger - from a simple schedule to whenever a tweet appears about your company. Then orchestrate any number of actions  using the rich gallery of connectors.

- **Compose SaaS easily** - Even composition tasks that are easy to describe are difficult to implement in code. Logic Apps make it a cinch to connect disparate systems. Want to create a task in CRM based on activity on your Facebook or Twitter accounts? Want to connect your cloud marketing solution to your on-premises billing system? Logic apps are the fastest, most reliable way to deliver solutions to these problems.

- **Get started quickly from templates** - To help you get started we've provided a gallery of templates that allow you to rapidly create some common solutions. From advanced BizTalk solutions to simple SaaS connectivity, and even a few that are just 'for fun' - the gallery is the fastest way to understand the power of Logic Apps.

- **Extensibility baked in** - Don't see the connector you need? Logic Apps are part of the App Service suite and designed to work with API apps; you can easily create your own API app to use as a connector. Build a new app just for you, or share and monetize in the marketplace.

- **Real integration horsepower** - Start easy and grow as you need. Logic Apps can easily leverage the power of BizTalk, Microsoft's industry leading integration solution to enable integration professionals to build the solutions they need. Find out more about the [BizTalk capabilities provided with App Services][biztalk].

## Logic App Concepts

- **Workflow** - Logic Apps provides a graphical way to model your business processes as a series of steps or a workflow.
- **Connectors** - Your logic apps need access to data and services. A type of API App, a connector is a special type of API app created specifically to aid in connecting to and working with data easily. Find our more in [what are Connectors][biztalk].
- **Triggers** - Some connectors can also act as a trigger, starting a new instance of a workflow based on a specific event, like the arrival of an e-mail or a change in your Azure Storage account.
- **BizTalk** - for more advanced integration scenarios, Azure App Services includes capabilities from Microsoft's industry leading integration platform 'BizTalk'. The BizTalk API apps allow you to easily include validation, transformation, rules and more in to your Logic App workflows. Find out more in [what are BizTalk API apps][biztalk].

## Getting Started

To get started with Logic Apps, follow the [create a Logic App][create] tutorial.

For more information on Azure App Service platform, see [Azure App Service][appservice].

[biztalk]: ../app-service-logic-what-are-biztalk-api-apps/
[appservice]: ../app-service-value-prop-what-is/
[create]: ../app-service-create-a-logic-app/



