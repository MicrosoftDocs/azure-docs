---
title: Why move from BizTalk Server to Azure Integration Services?
description: Get an overview about moving from BizTalk Server to Azure Integration Services.
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: kewear
ms.author: kewear
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 12/15/2022
# As a BizTalk Server customer, I want to better understand why I should migrate to Azure Integration Services in the cloud from on-premises BizTalk Server.
---

# Why migrate from BizTalk Server to Azure Integration Services?

This guide provides an overview about the reasons and benefits, product comparisons, capabilities, and other information to help you start migrating from on-premises BizTalk Server to cloud-based Azure Integration Services. Following this guide, you'll find more guides that cover how to choose the services that best fit your scenario along with migration strategies, planning considerations, and best practices to help you deliver successful results.

## Reasons and benefits

By migrating your integration workloads to Azure Integration Services, you can reap the following primary benefits:

| Benefit | Description |
|---------|-------------|
| Modern Integration Platform as a Service (iPaaS) | Azure Integration Services provides capabilities not yet conceived when BizTalk Server was originally built, for example: <br><br>- The capability to create and manage REST APIs <br>- Scalable cloud infrastructure <br>- Authentication schemes that are modern, more secure, and easier to implement <br>- Simplified development tools, including many web browser-based experiences <br>- Automatic platform updates and integration with other cloud-native services |
| Consumption-based pricing | With traditional middleware platforms, you must often make significant capital investments in procuring licenses and infrastructure, forcing you to "build for peak" and creating inefficiencies. Azure Integration Services provides multiple pricing models that generally let you pay for what you use. Although some pricing models enable and provide access to more advanced features, you have the flexibility to pay for what you consume. |
| Lower barrier to entry | BizTalk Server is a very capable middleware broker but requires significant time to learn and gain proficiency. Azure Integration Services reduces the time required to start, learn, build, and deliver solutions. For example, [Azure Logic Apps](./logic-apps-overview.md) includes a visual designer that gives you a no-code or low-code experience for building declarative workflows. |
| SaaS connectivity | With REST APIs becoming standard for application integration, more SaaS companies have adopted this approach for exchanging data. Microsoft has built an expansive and continually growing connector ecosystem with hundreds of APIs to work with Microsoft and non-Microsoft services, systems, and protocols. In Azure Logic Apps, you can use the workflow designer to select operations from these connectors, easily create and authenticate connections, and configure the operations they want to use. This capability speeds up development and provides more consistency when authenticating access to these services using OAuth2. |
| Multiple geographical deployments | Azure currently offers [60+ announced regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/), more than any other cloud provider, so that you can easily choose the datacenters and regions that are right for you and your customers. This reach lets you deploy solutions in a consistent manner across many geographies and provides opportunities from both a scalability and redundancy perspective. |

## What is Azure Integration Services?

Azure Integration Services includes the following cloud-based, serverless, scalable, and Microsoft-managed building blocks for you to create comprehensive integration solutions and migrate existing BizTalk Server solutions:

| Service | Description |
|---------|-------------|
| Azure Logic Apps | Create and run automated logic app workflows that integrate your apps, data, services, and systems. You can quickly develop highly scalable integration solutions for your enterprise and business-to-business (B2B) scenarios. Use the visual workflow designer to enable microservices, API orchestrations, and line-of-business integrations. To increase scale and portability while automating business-critical workflows, deploy and run anywhere that Kubernetes can run. <br><br>You can create either Consumption or Standard logic app resources. A Consumption logic app includes only one stateful workflow that runs in multi-tenant Azure Logic Apps. A Standard logic app can include multiple stateful or stateless workflows that run in single-tenant Azure Logic Apps, an App Service Environment v3, or Azure Arc enabled Logic Apps. <br><br>For positioning Azure Logic Apps within Azure Integration Services, this guide focuses on Standard logic apps, which provide the best balance between enterprise features, cost, and agility. For more information, see [Azure Logic Apps](./logic-apps-overview.md). |
| Azure Functions | Write less code, maintain less infrastructure, and save on costs to run applications. Without you having to deploy and maintain servers, the cloud infrastructure provides all the up-to-date resources needed to keep your applications running. For more information, see [Azure Functions](../azure-functions/functions-overview.md). |
| Azure Data Factory | Visually integrate all your data sources by using more than 90 built-in, maintenance-free connectors at no added cost. Easily construct Extract, Transform, and Load (ETL) and Extract, Load, and Transform (ELT) processes code-free in an intuitive environment, or you can write your own code. To unlock business insights, deliver your integrated data to Azure Synapse Analytics. For more information, see [Azure Data Factory](../data-factory/introduction.md). |
| Azure Service Bus | Transfer data between applications and services, even when offline, as messages using this highly reliable enterprise message broker. Get more flexibility when brokering messages between client and server with structured first-in, first-out (FIFO) messaging, publish-subscribe capabilities, and asynchronous operations. For more information, see [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md). |
| Azure Event Grid | Integrate applications using events delivered by an event broker to subscriber destinations, such as Azure services, other applications, or any endpoint where Event Grid has network access. Event sources can include other applications, SaaS services, and Azure services. For more information, see [Azure Event Grid](../event-grid/overview.md). |
| Azure API Management | Deploy API gateways side-by-side and optimize traffic flow with APIs hosted in Azure, other clouds, and on-premises. Meet security and compliance requirements, while you enjoy a unified management experience and full observability across all internal and external APIs. For more information, see [Azure API Management](../api-management/api-management-key-concepts.md). |

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/azure-integration-services-architecture-overview.png" alt-text="Diagram showing Azure Integration Services member services.":::

## Complementary Azure services

Beyond the previously described services, Microsoft also offers the following complementary services that provide underlying capabilities for Azure Integration Services and which you'll likely use in a migration project:

| Service | Description |
|---------|-------------|
| Azure Storage | Provides highly available, massively scalable, durable, secure, and modern storage for various data objects in the cloud. You can access these data objects from anywhere in the world over HTTP or HTTPS using a REST API. <br><br>Azure Integration Services uses these capabilities to securely store configuration and telemetry data for you while transactions flow through the platform. For more information, see [Azure Storage](../storage/common/storage-introduction.md). |
| Azure role-based access control (Azure RBAC) | Manage access to cloud resources, which is a critical function for any organization that uses the cloud. Azure RBAC is an authorization system built on Azure Resource Manager that provides fine-grained access management to Azure resources. You can manage who can access Azure resources, what they can do with those resources, and which areas they can access. For more information, see [Azure RBAC](../role-based-access-control/overview.md). |
| Azure Key Vault | Provides capabilities to help you solve problems related to secrets management, key management, and certificate management. <br><br>Azure Integration Services provides integration with Azure Key Vault through application configuration settings and through a connector. This capability lets you store secrets, credentials, keys, and certificates in a secure but convenient manner. For more information, see [Azure Key Vault](../key-vault/general/overview.md). |
| Azure Policy | Provides capabilities that help you enforce organizational standards and assess compliance in a scalable way. Through the compliance dashboard, you get an aggregated view so you can evaluate the overall state of the environment with the ability to drill down to per-resource, per-policy granularity. <br><br>Azure Integration Services integrates with Azure Policy so you can efficiently implement widespread governance. For more information, see [Azure Policy](../governance/policy/overview.md). |
| Azure Networking | Provides a wide variety of networking capabilities, including connectivity, application protection services, application delivery services, and networking monitoring. <br><br>Azure Integration Services uses these capabilities to provide connectivity across services using virtual networks and private endpoints. For more information, see [Azure Networking](../networking/fundamentals/networking-overview.md). |
| Azure Event Hubs | Build dynamic data pipelines and immediately respond to business challenges by streaming millions of events per second from any source with this fully managed, real-time data ingestion service that's simple, trusted, and scalable. <br><br>API Management performs custom logging using Event Hubs, which is one of the best solutions when implementing a decoupled tracking solution in Azure. For more information, see [Azure Event Hubs](../event-hubs/event-hubs-about.md). |
| Azure SQL Database | At some point, you might need to create custom logging strategies or custom configurations to support your integration solutions. While SQL Server is commonly used on premises for this purpose, Azure SQL Database might offer a viable solution when migrating on-premises SQL Server databases to the cloud. For more information, see [Azure SQL Database](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview). |
| Azure App Configuration | Centrally manage application settings and feature flags. Modern programs, especially those running in a cloud, generally have many distributed components by nature. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during application deployment. With App Configuration, you can store all the settings for your application and secure their accesses in one place. For more information, see [Azure App Configuration](../azure-app-configuration/overview.md). |
| Azure Monitor | Application Insights, which is part of Azure Monitor, provides application performance management and monitoring for live apps. Store application telemetry and monitor the overall health of your integration platform. You also have the capability to set thresholds and get alerts when performance exceeds configured thresholds. For more information, see [Application Insights](../azure-monitor/app/app-insights-overview.md). |
| Azure Automation | Automate your Azure management tasks and orchestrate actions across external systems within Azure. Built on PowerShell workflow so you can use this language's many capabilities. For more information, see [Azure Automation](../automation/overview.md). |

## Supported developer experiences

This section describes the developer tools that BizTalk server and Azure Integration Services support:

| Offering | Product or service with supported tools |
|----------|-----------------------------------------|
| BizTalk Server | Each BizTalk Server version supports a specific version of Visual Studio. <br><br>For example, BizTalk Server 2020 supports Visual Studio 2019 Enterprise or Professional. However, Visual Studio Community Edition isn't supported. |
| Azure Integration Services | - Azure Logic Apps (Standard): Azure portal and Visual Studio Code <br><br>- Azure Logic Apps (Consumption): Azure portal, Visual Studio Code, and Visual Studio 2019, 2017, or 2015 <br><br>- Azure Functions: Azure portal, Visual Studio Code, and Visual Studio 2022 <br><br>- Azure API Management: Azure portal and Visual Studio Code <br><br>- Azure Service Bus: Azure portal and Service Bus Explorer <br><br>- Azure Data Factory: Azure portal and Visual Studio 2015 or 2013 |

## BizTalk Server versus Azure Integration Services

To compare BizTalk Server with Azure Integration Services and discuss how to migrate, let's first briefly summarize what BizTalk Server does. Originally available in 2000, BizTalk Server is an on-premises, stable, middleware platform that connects various systems by using adapters. This platform works as a broker between businesses, systems, or applications and is now a well-established integration platform. To simplify the challenge in combining different systems that are developed in different languages and can be connected using different protocols and formats, BizTalk Server offers the following main capabilities:

- Orchestration (business flow)

  Provides the capability to create and run orchestrations or graphically defined business processes.

- Messaging

  Provides the capability to communicate with a wide range of software applications. Adapters allow BizTalk Server's messaging component to interact with various protocols and data formats.

The BizTalk Server engine includes the following components:

| Component | Description |
|-----------|-------------|
| Business Rule Engine (BRE) | Evaluates complex sets of rules. |
| Enterprise Single Sign-On (SSO) | Provides the capability to map authentication information between Windows and non-Windows systems. |
| Business Activity Monitoring (BAM) | Enables information workers to monitor a running business process. |
| Group Hub | Enables support personnel to manage the engine and the orchestrations that run. |

<a name="how-does-biztalk-server-work"></a>

### How does BizTalk Server work?

BizTalk Server uses a publish-subscribe messaging engine architecture with the [MessageBox database](/biztalk/core/the-messagebox-database) at the heart. MessageBox is responsible for storing messages, message properties, subscriptions, orchestration states, tracking data, and other information.

When BizTalk Server receives a message, the server passes and processes the message through a pipeline. This step normalizes and publishes the message to MessageBox. BizTalk Server then evaluates any existing subscriptions and determines the message's intended recipient, based on the message context properties. Finally, BizTalk Server routes the message to the intended recipient, based on subscriptions or filters. This recipient is either an orchestration or a Send port, which is a destination to where BizTalk Server sends messages or source from where BizTalk Server can receive messages. BizTalk Server transmits messages through a Send port by passing them through a Send pipeline. The Send pipeline serializes the messages into the native format expected by the receiver before sending the messages through an adapter.

The MessageBox database has the following components:

- Messaging agent

  BizTalk Server interacts with MessageBox using this agent, which provides interfaces for publishing messages, subscribing to messages, retrieving messages, and more.

- One or more SQL Server databases

  These databases provide the persistence store for messages, message parts, message properties, subscriptions, orchestration state, tracking data, host queues for routing, and more.

The following image shows how BizTalk Server Messaging Engine works:

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-server-messaging-engine.png" alt-text="Diagram showing BizTalk Server Messaging Engine.":::

After a Receive port receives a message, MessageBox stores that message for processing by business processes or for routing to any Send ports that have subscriptions to specific messages.

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-messagebox-receive-store-messages.png" alt-text="Diagram showing process for receiving and storing messages in the MessageBox database for BizTalk Server.":::

 For more information, see [Publish-subscribe architecture](#publish-subscribe-architecture) later in this guide.

### Business processes

This section describes options for designing and building business processes that you can run in BizTalk Server and Azure Integration Services.

#### BizTalk Server

In BizTalk Server, orchestrations are executable business processes that can subscribe to (receive) messages and publish (send) messages through the MessageBox database. Orchestrations can construct new messages and can receive messages using the subscription and routing infrastructure. When MessageBox fills subscriptions for orchestrations, a new *instance* (orchestration run) activates, and MessageBox delivers the message. If necessary, the instance is rehydrated, and the message is then delivered. When messages are sent from an orchestration, they're published to MessageBox in the same way as a message arriving at a receive location with the appropriate properties added to the database for routing.

To enable publish-subscribe messaging, orchestrations use bindings that help create subscriptions. Orchestration ports are logical ports that describe an interaction. To deliver messages, you must bind these logical ports to a physical port, but this binding process is nothing more than configuring subscriptions for message routing.

BizTalk Server offers the following example advantages:

- Designer-first (declarative)

  Design complex processes by using easy-to-understand design tools to implement patterns and workflows that might otherwise be difficult to implement in code.

- Abstraction with end systems

  Design processes with focus on the messages, not the end system. For example, while developing your solutions, you don't have to worry about whether you're going to use a FILE adapter or an FTP adapter. Instead, you focus on the communication type, whether one way or request-response, and on the message type that you want to process. Later, when you deploy your solutions, you can then specify the adapter and the end systems.

#### Azure Integration Services

In [Azure Logic Apps](./logic-apps-overview.md), you can create executable business processes and applications as logic app workflows by using a "building block" way of programming with a visual designer and prebuilt operations from hundreds of connectors, requiring minimal code. A logic app workflow starts with a trigger operation followed by one or more action operations with each operation functioning as a logical step in the workflow implementation process. Your workflow can use actions to call external software, services, and systems. Some actions perform programming tasks, such as conditionals (if statements), loops, data operations, variable management, and more.

Azure Logic Apps offers the following example advantages:

- Designer-first (declarative)

  Design complex processes by using easy-to-understand design tools to implement patterns and workflows that might otherwise be difficult to implement in code.

- Flexible and scalable

  Azure Logic Apps is a cloud-based, serverless, highly scalable, computing service, which automatically scales and adapts to meet evolving business needs.

- Connects to anything

  Select from a constantly expanding gallery with hundreds of prebuilt connectors to build your workflows. A connector provides operations that you can use as steps in your workflows. You can build integration solutions for most services and systems from both Microsoft and partners, including BizTalk Server, Salesforce, Office 365, SQL databases, most Azure services such as Azure Functions, Azure Storage, Azure Service Bus, and many others plus on-premises applications or systems, mainframes, SaaS, and APIs. If no prebuilt connector exists for the resource that you want to access, you can use the generic HTTP operation to communicate with the service, or you can create a custom connector.

### Reusable components

Integration platforms offer ways to solve problems in a consistent and unified manner, which you can often achieve through reusable components. This section describes how you can reuse components in BizTalk Server and Azure Integration Services.

### BizTalk Server

- Orchestrations

  You can create and share common business logic as orchestrations across different workflows, internally inside the same application or with multiple applications. You can trigger orchestrations by using the native publish-subscribe mechanism in BizTalk Server (in a decoupled way) or by using the orchestration shapes named Call Orchestration for synchronous calls or Start Orchestration for asynchronous calls.

- Adapters

  Adapters are software components that provide connectivity between BizTalk Server and trading partners using commonly recognized data protocols and document formats. These components make sending and receiving messages easier by using a delivery mechanism that conforms to a commonly recognized standard, such as SMTP, FTP, HTTP, and more. Adapters are part of the core platform, so all existing applications share them. You can also extend this layer by creating a custom adapter, either native or based on Windows Communication Foundation (WCF), by using the BizTalk Adapter Framework.

- Schemas

  XML Schema Definition (XSD) schemas enable contract-based messaging in BizTalk Server. To avoid creating redundant schemas, you can reference schemas from compiled assemblies. To use shared schemas, you must add a reference to the shared assembly from your BizTalk project.

  While this step might sound simple, managing changes to shared assemblies might become difficult due to dependency chaining. If the shared assembly requires an update, you must remove all projects that reference the shared assembly from BizTalk Server to install the update. However, to avoid these constraints, you can implement assembly versioning where you deploy a new version for a schema or shared schemas without breaking your existing solutions.

- Maps and custom functoids

  Maps enable XML message translation or transformation in BizTalk Server. You can share maps, but like shared schemas, similar cautions apply to shared maps. Due to dependency chaining, proceed carefully and make sure that you have a mature software development lifecycle to manage change.

  In maps, functoids perform calculations by using predefined formulas and specific values called arguments. BizTalk Server provides many functoids to support a range of diverse operations. Custom functoids provide a way for you to extend the range of available operations in the BizTalk Server mapping environment.

  If you start to create many maps, you'll realize that you're repeatedly implementing similar logic. Consequently, you'll find yourself spending time maintaining multiple equivalent code snippets that you usually copy and paste into several locations within a map or across maps. Consider transforming such code snippets into a custom functoid. That way, you create the functoid only once, but you can reuse the functoid in as many maps as you want and update the functoid in only one place. Each custom functoid is deployed as a .NET assembly using classes derived from the **Microsoft.BizTalk.BaseFunctoids** namespace. A single assembly can contain more than one custom functoid.

- .NET Fx assemblies

  You can share these assemblies across BizTalk Server projects. These assemblies are easier to manage from a dependency perspective. Provided that no breaking changes exist, an update to a .NET Fx assembly requires updating the DLL in the Global Assembly Cache (GAC), which automatically makes the changes available to other assemblies. If breaking changes exist, you must also update the dependent project to accommodate the changes in the .NET Fx assembly.

- Custom pipelines and pipeline components

  When BizTalk Server receives and sends messages, the server might need to prepare and transform messages for entry and exit, due to business reasons. In BizTalk Server, pipelines provide an implementation of the [Pipes and Filters integration pattern](https://www.enterpriseintegrationpatterns.com/PipesAndFilters.html) and include many features such as a JSON encoder and decoder, MIME or SMIME decoder, and so on.

  When you need to add information to the context of a message that requires pipeline customization, BizTalk Server provides the capability to customize these pipelines by creating custom pipeline components. A custom pipeline component is a.NET class that you use to implement multiple BizTalk interfaces and then use inside different stages of any custom pipeline. To write code for such a component, you can use C# or Visual Basic for .NET.

- Rules Engine policies

  A Business Rules Engine policy is another kind of artifact that you can share across BizTalk Server applications deployed within the same [BizTalk group](/biztalk/core/biztalk-groups). If you have common Business Rules Engine rules, for example, related to message routing, you can manage these rules in one location and share them widely across installed BizTalk applications. The Business Rules Engine caches these rules, so if you make any updates to these rules, you must restart the Business Rules Engine Update Service. Otherwise, the changes are picked up in the next [Cache Timeout](/biztalk/core/rule-engine-configuration-and-tuning-parameters).

#### Azure Integration Services

- Integration account

  For [Azure Logic Apps](./logic-apps-overview.md), an integration account is a cloud-based container and Azure resource that provides centralized access to reusable artifacts. For Consumption logic app workflows, these artifacts include trading partners, agreements, XSD schemas, XSLT maps, Liquid template-based maps, certificates, batch configurations, and .NET Fx assemblies.

  For Standard logic app workflows, Azure Logic Apps recently [introduced support for calling .NET Fx assemblies from XSLT transformations](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/net-framework-assembly-support-added-to-azure-logic-apps/ba-p/3669120) without requiring an integration account. Alternatively, you can add schemas, maps, and assemblies to a Standard logic app project in Visual Studio Code and subsequently deploy to Azure.

- APIs

  APIs enable digital experiences, make data and services reusable and universally accessible, simplify application integration, and underpin new digital products. ​With the proliferation and increasing dependency on APIs, organizations need to manage them as first-class assets throughout their lifecycle.​

  You can reuse APIs, especially those managed with Azure API Management, within Azure Integration Services. After you add APIs to Azure API Management, you can use the API Management connector with Consumption logic app workflows to easily access APIs in a managed and governed manner. Azure Logic Apps also supports creating and using custom APIs so that your organization can promote reuse across the enterprise and avoid unnecessary redundant connectors that developers might otherwise create. Custom APIs also democratize who can use these APIs, rather than have developer figure out the mechanics to use a particular API.

- Custom connectors

  If no prebuilt connectors exist for the APIs you want to use, you can wrap an external or external API with an OpenAPI schema to create a custom connector and access that connector from Consumption logic app workflows with the appropriate permissions. The custom connector creates a contract between Azure Logic Apps and the API that allows the easy assembly of request messages and for Azure Logic Apps to receive a typed response that you can use in downstream actions. Both REST APIs and SOAP APIs are supported, and they can reference either public APIs or private APIs that exist on your local network. You can also use custom connectors with Microsoft Power Automate and Microsoft Power Apps.

  For Standard logic app workflows, you can create your own built-in custom connectors that are based on a service provider.

  By implementing a custom connector, you simplify the development experience by creating a common interface for sending request messages and receiving typed responses. For more information, see [Custom connectors and APIs](/connectors/custom-connectors/).

### Adapters and connectors

The following section describes the concepts of adapters and connectors respectively in BizTalk Server and Azure Integration Services.

#### BizTalk Server

To exchange messages with external systems, applications, and entities, BizTalk Server provides adapters, which are COM or .NET Fx components that transfer messages to and from business endpoints such as file systems, databases, and custom business applications by using various communication protocols. BizTalk Server provides native adapters that support various protocols, for example:

- A File adapter that supports sending and receiving messages from a file location
- Adapters for EDI, FTP, HTTP, MSMQ, SMTP, POP3, and SOAP protocols
- An adapter for Windows SharePoint Services

The [BizTalk Adapter Framework](/biztalk/core/developing-custom-adapters) offers a stable, open mechanism for all adapters to implement or access work from the BizTalk Server Messaging Engine. The interfaces in the **Microsoft.BizTalk.Adapter.Framework** namespace enable adapters to modify configuration property pages. The BizTalk Adapter Framework also provides the capability to import services and schemas into a BizTalk project. Partner adapters are also available from various vendors and community members. For a list of known adapters, see [BizTalk Server: List of Third-Party Adapters](https://technet2.github.io/Wiki/articles/12956.biztalk-server-list-of-third-party-adapters.html).

#### Azure Integration Services

When you build workflows with [Azure Logic Apps](./logic-apps-overview.md), you can use prebuilt connectors to help you easily and quickly work with data, events, and resources in other apps, services, systems, protocols, and platforms, usually without having to write any code. Azure Logic Apps provides a constantly expanding gallery with hundreds of connectors that you can use. You can build integration solutions for many services and systems, cloud-based or on-premises, from both Microsoft and partners, such as BizTalk Server, Salesforce, Office 365, SQL databases, most Azure services, mainframes, APIs, and more. Some connectors provide operations that perform programming operations, such as conditional (if) statements, loops, data operations, variables management, and so on. If no connector is available for the resource that you want, you can use the generic HTTP operation to communicate with the service, or you can create a custom connector.

Technically, a connector is a proxy or a wrapper around an API that the underlying service or system uses to communicate with Azure Logic Apps. This connector provides the operations that you use in your workflows to perform tasks. An operation is available either as a trigger or action with properties that you can configure. Some triggers and actions also require that you first create and configure a connection to the underlying service or system. If necessary, you'll also then authenticate access to a user account.

Most connectors in Azure Logic Apps are either a built-in connector or managed connector. Some connectors are available in both versions. The versions available depend on whether you create a Consumption logic app workflow or a Standard logic app workflow.

- Built-in connectors are designed to run natively on the Azure Logic Apps runtime and usually have better performance, throughput, capacity, or other benefits compared to any managed connector counterparts.

- Managed connectors are deployed, hosted, and managed by Microsoft in Azure. These connectors provide triggers and actions for cloud services, on-premises systems, or both. In Standard logic app workflows, all managed connectors are grouped as **Azure** connectors. However, in Consumption logic app workflows, managed connectors are grouped as either Standard or Enterprise, based on their pricing level.

For more information, see the following documentation:

- [Built-in connectors overview](../connectors/built-in.md)
- [Managed connectors overview](../connectors/managed.md)
- [Managed connectors available in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)

### Application connectivity

The following section describes options to connect with other applications from BizTalk Server and Azure Integration Services.

#### BizTalk Server

Adapters provide the connectivity capabilities in BizTalk Server and run locally on the BizTalk server that performs the send or receive operation. Approximately 30 out-of-the-box adapters are available, while a small ecosystem of ISV adapters provide additional functionality. With these adapters running locally, Windows Authentication is a popular authentication method. Commonly used adapters include FILE, SFTP, SQL, WCF (Basic-HTTP), HTTP, and SMTP. From this list, you can determine that the adapters in BizTalk Server are mostly protocol adapters. As a result, adapters usually use a message-oriented messaging pattern where a complete message is exchanged with other systems where those systems are responsible for parsing the data before loading the data into the final data store.

#### Azure Integration Services

Connectors provide the connectivity capabilities in [Azure Logic Apps](./logic-apps-overview.md) and offer an abstraction on top of APIs that are usually owned by the underlying SaaS system. For example, services such as SharePoint are built using an API-first approach where APIs provide functionality to the service for end users, but the same functionality is exposed for other systems to call through an API. To simplify calling these APIs, connectors use metadata to describe the messaging contract so that developers know what data is expected in the request and in the response.

The following screenshot shows the connector search experience for a Standard logic app workflow in single-tenant Azure Logic Apps. When you select the **Built-in** tab, you can find built-in connectors such as Azure Functions, Azure Service Bus, SQL Server, Azure Storage, File System, HTTP, and more. On the **Azure** tab, you can find more than 800 connectors, including other Microsoft SaaS connectors, partner SaaS connectors, and so on.

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/azure-logic-apps-connectors-standard.png" alt-text="Screenshot showing the Azure portal, Standard logic app workflow designer, and the available connectors based on whether the Built-in tab or Azure tab is selected.":::

### Web services and API connectivity

The following section describes support for web services and API connectivity in BizTalk Server and Azure Integration Services.

#### BizTalk Server

Web services support is a popular capability in BizTalk Server and is available by integrating with [Windows Communication Foundation (WCF)](/biztalk/core/using-wcf-services). This support in BizTalk falls into two categories: publishing and consuming WCF services.

[WCF adapters](/biztalk/core/wcf-adapters) provide the support for WS-* standards, such as WS-Addressing, WS-Security, and WS-AtomicTransaction. However, WS-ReliableMessaging isn't supported in this release of the WCF adapters.

WCF adapters support [Single Sign On (SSO)](/biztalk/core/single-sign-on-support-for-the-wcf-adapters) through impersonation and acquire the Enterprise SSO ticket for using SSO with WCF adapters. This capability enables the user context to flow across systems. From an authentication perspective, [Service Authentication](/biztalk/core/what-are-the-wcf-adapters#service-authentication-types) supports the following types: None, Windows, and Certificate. [Client Authentication](/biztalk/core/what-are-the-wcf-adapters#client-authentication-types) supports the following types: Anonymous, UserName, Windows, and Certificate. Supported [security modes](/biztalk/core/what-are-the-wcf-adapters#security-modes) include the following types: Transport, Message, and Mixed.

WCF supports transactions using the [WS-AutomicTransaction protocol](/biztalk/core/what-are-the-wcf-adapters#ws-atomictransaction), which you can find in WCF adapters such as WCF-WsHttp, WCF-NetTcp, and WCF-NetMsmq. This capability is supported in the following scenarios:

- Transactional submission of messages to the MessageBox database
- Transactional transmission of messages from the MessageBox to a transactional destination

The transactional scope is limited by the MessageBox component. For example, a BizTalk orchestration can't participate in a client's transaction. Similarly, a destination endpoint can't participate in a transaction that's initiated by a BizTalk orchestration.

WCF extensibility is available through WCF custom bindings. You'll need to compile and add custom code to the Global Assembly Cache (GAC). You'll also need to update the machine.config file to include the new extension. After the binding is installed, the extension is visible to the WCF-Custom and WCF-CustomIsolated adapters.

BizTalk Server can expose WCF-BasicHTTP receive locations as endpoints within Azure API Management when you use the BizTalk Administration Console. You can also expose your SOAP endpoints through API Management from BizTalk Server by using API Management in the Azure portal. For more information, see [Publish BizTalk WCF-BasicHTTP endpoints in API Management](/biztalk/core/connect-to-azure-api-management).

#### Azure Integration Services

The connectivity model in Azure Integration Services differs from BizTalk Server, partially due to the evolution of the API economy. As more organizations expose access to underlying systems and data, a platform-agnostic approach was needed. REST is now the dominant architectural approach to designing modern web services.

In [Azure Logic Apps](./logic-apps-overview.md), [REST](/azure/architecture/best-practices/api-design) is the default approach for connecting systems. As Microsoft and other software vendors expose RESTful services on top of their systems and data, Azure Logic Apps can expose and consume this type of information. The OpenAPI specification makes this capability possible for both humans and computers to understand the interaction between a client and server through metadata. As part of this understanding, both request and response payloads are derived, which means you can use dynamic content to populate a workflow action's inputs and use the outputs from the response in downstream actions.

Based on the software vendor who implements the underlying service that a connector calls, [authentication schemes](./logic-apps-securing-a-logic-app.md) vary by connector. Generally, these schemes include the following types:

- [Basic](./logic-apps-securing-a-logic-app.md#basic-authentication)
- [Client Certificate](./logic-apps-securing-a-logic-app.md#client-certificate-authentication)
- [Active Directory OAuth](./logic-apps-securing-a-logic-app.md#azure-active-directory-oauth-authentication)
- [Raw](./logic-apps-securing-a-logic-app.md#raw-authentication)
- [Managed Identity](./logic-apps-securing-a-logic-app.md#managed-identity-authentication)

Microsoft provides strong layers of protection by [encrypting data during transit](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit) and at rest. When Azure customer traffic moves between datacenters, outside physical boundaries that aren't controlled by Microsoft or on behalf of Microsoft, a data-link layer encryption method that uses [IEEE 802.1AE MAC Security Standards (MACsec)](https://1.ieee802.org/security/802-1ae/) applies from point-to-point across the underlying network hardware.

Microsoft gives you the option to use [Transport Layer Security (TLS) protocol](../security/fundamentals/encryption-overview.md#tls-encryption-in-azure) for protecting data that travels between cloud services and customers. Microsoft datacenters negotiate a TLS connection with client systems that connect to Azure services. TLS provides strong authentication, message privacy, and integrity, which enables detection of message tampering, interception, and forgery along with interoperability, algorithm flexibility, and ease of deployment and use.

While this section focused on RESTful connectivity through connectors, you can implement SOAP web service connectivity through the custom connector experience.

### Block adapter or connector usage

The following section describes options to prevent adapter or connector usage respectively in BizTalk Server and Azure Integration Services.

#### BizTalk Server

BizTalk Server doesn't include the concept of blocking specific adapters from different applications, but you can "block" their usage in your applications by removing those adapters from the environment. Adapters in BizTalk Server are part of the platform settings, so installed adapters are available for anyone to use. You can also define specific receive and send handlers for each adapter, which defines the computers that belong to the [BizTalk group](/biztalk/core/biztalk-groups) that can execute or process those handlers.

#### Azure Integration Services

If your organization doesn't permit connecting to restricted or unapproved resources by using managed connectors in [Azure Logic Apps](./logic-apps-overview.md), you can block the capability to create and use those connections in your logic app workflows. With Azure Policy, you can define and enforce policies that prevent creating or using the connections for connectors that you want to block. For example, for security reasons, you might want to block connections to specific social media platforms or other services and systems.

### Message durability

The following section describes message persistence in BizTalk Server and Azure Integration Services.

#### BizTalk Server

The MessageBox database offers another benefit by acting as a persistence point that makes sure a message is persisted in storage before attempting to send to an endpoint. If the message fails to send after exhausting any configured retry attempts, the message is suspended and stored in MessageBox.

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-server-messagebox-persistence-point.png" alt-text="Diagram showing BizTalk MessageBox database as a persistence point.":::

As an administrator, you can resume suspended messages from the BizTalk Administration Console. The same behavior happens when you use orchestrations. The Orchestration runtime persists the business logic, which you can resume if something goes wrong. For example, you can resume a message in an orchestration in the following scenarios:

- A message sent within a non-atomic scope
- At the end of a transactional scope
- When starting a new orchestration instance (Start Orchestration shape)
- In a debug breakpoint
- When the engine decides to dehydrate
- When the orchestration completes
- When system shuts down

BizTalk Server provides all these capabilities out-of-the-box. You don't need to worry about implementing persistence because BizTalk Server handles that for you.

#### Azure Integration Services

[Azure Logic Apps](./logic-apps-overview.md) provides message durability in the following ways:

- Stateful workflows, which are the default in Consumption logic apps and available in Standard logic apps, have checkpoints that track the workflow state and store messages as they pass through workflow actions. This functionality provides access to rich data stored in the trigger and workflow instance run history where you can review detailed input and output values.

  You can reprocess a run instance either through Azure portal or an API. As this time, the entire run instance executes, regardless where any failure happened in the previous run. This behavior implies that messages are delivered *at least once*, and that idempotent processing happens at the consumers.

- With [peek-lock messaging](/rest/api/servicebus/peek-lock-message-non-destructive-read) available in Azure Service Bus, you can either commit a message after successful message execution or abandon the message when a failure happens. To use this capability in Azure Logic Apps, select the Azure Service Bus connector. A committed message is removed from the message queue, while an abandoned message is unlocked and available for processing by clients. The peek-lock is a great way to achieve "exactly once" messaging.

### Publish-subscribe architecture

The following section describes options to implement the publish-subscribe pattern in BizTalk Server and Azure Integration Services.

#### BizTalk Server

Publish-subscribe (pub-sub) capabilities exist through the [MessageBox database](/biztalk/core/the-messagebox-database), which is described earlier in the section, [How does BizTalk Server work](#how-does-biztalk-server-work). A popular way to create subscriptions is by using Promoted Properties, which allow you to identify specific elements or attributes in a defined message schema as a Promoted Property. You can then establish subscriptions to filter messages based upon specific criteria against a Promoted Property. For example, if you promoted a schema element named City, you can then create a subscription that filters on the City element for specific cities. If your criteria are met, your subscription, a Send port, or an orchestration receives a copy of the message.

#### Azure Integration Services

With an architecture completely different from BizTalk Server, most services in Azure Integration Services are event-based. If you need to implement a publish-subscribe solution, you can use [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md). This service is a fully managed enterprise message broker with message queues and publish-subscribe topics in a namespace. You can use Azure Service Bus to decouple applications and services from each other, providing the following benefits:

- Load balance work across competing workers.
- Safely route and transfer data with control across service and application boundaries.
- Coordinate transactional work that requires a high degree of reliability.

[Azure Logic Apps](./logic-apps-overview.md) includes an [Azure Service Bus connector](/connectors/servicebus/) that you can use to publish and subscribe to messages. The benefit to using Service Bus is that you can use messaging independently from your workflow. Unlike BizTalk Server, your messaging is decoupled from your workflow platform. Although messaging and workflow capabilities are decoupled in Azure Integration Services, you can create message subscriptions in Azure Service Bus, which has support for [message properties (user properties)](/rest/api/servicebus/message-headers-and-properties#message-properties). Use these properties to provide key-value pairs that are evaluated by filters created on a [topic subscription](../service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md). You define these user properties when you set up an Azure Service Bus operation by adding one or more key-value pairs. For a demonstration, see the following video: [Pub Sub Messaging using Azure Integration Services - Part 2 Content Based Routing](https://youtu.be/1ZMJhWGDVro).

Outside Azure Integration Services, you can also implement publish-subscribe scenarios by using we can also use [Azure Cache for Redis](../azure-cache-for-redis/cache-overview.md).

### Business rules engine

The following section describes options for setting up business rules in BizTalk Server and Azure Integration Services.

#### BizTalk Server

BizTalk Server includes a forward-chaining rules engine that lets you construct "if-then-else" rules by using a visual editor. You can bundle these rules within a policy that's transportable to other environments in your IT landscape. These policies can also access XSD schemas, .NET Fx code, and SQL Server database tables to look up data and enrich outputs.

#### Azure Integration Services

Although no equivalent rules engine capability currently exists in Azure, customers often use [Azure Functions](../azure-functions/functions-overview.md) to implement rules using custom code. They then access these rules using the built-in Azure Functions connector in Azure Logic Apps.

For more information about future investments in this area, see the [Road Map](#road-map) section later in this guide.

### Data transformation

The following section describes data transformation capabilities in BizTalk Server and Azure Integration Services.

#### BizTalk Server

Provides rich tooling for you to transform XML messages from one format to another. Data transformation uses XSLT maps, which support extension objects that allow injecting custom .NET Fx code into the middle of these maps. You can also use out-of-box functoids that provide reusable functionality that helps you build rich maps.

Beyond the core XML transformations, BizTalk Server also provides encoding and decoding for CSV and JSON formats so you can convert between these formats and XML, giving you support for different formats.

#### Azure Integration Services

- Enterprise Integration Pack

  This component follows similar concepts in BizTalk Server and makes B2B capabilities easy to use in [Azure Logic Apps](./logic-apps-overview.md). However, one major difference is that the Enterprise Integration Pack is architecturally based on integration accounts. These accounts simplify how you store, manage, and use artifacts, such as trading partners, agreements, maps (XSLT or Liquid templates), schemas, and certificates, for B2B scenarios.

- Liquid templates

  For basic JSON transformations in logic app workflows, you can use built-in data operations, such as the Compose action or Parse JSON action. However, some scenarios might require advanced and complex transformations that include elements such as iterations, control flows, and variables. For transformations between JSON to JSON, JSON to text, XML to JSON, or XML to text, you can create a Liquid template that describes the required mapping or transformation using the Liquid open-source template language.

- EDI schemas

  EDI document schemas define the body of an EDI transaction document type. For your logic app workflows, all BizTalk EDI schemas in the [Microsoft Integration GitHub repository](https://github.com/microsoft/Integration/tree/master/BizTalk%20Server/Schema) are publicly available for you to use.

- Standard logic apps

  In the Azure portal, you can upload maps and schemas directly to a Standard logic app resource. If you're working with a Standard logic app project in Visual Studio Code, you can upload these artifacts to their respective folders within the Artifacts folder without using an integration account. You can also call custom compiled assemblies from XSLT maps.

- Azure Functions

  You can execute XSLT or Liquid template transformations by using C# or any other programing language to create an Azure function that you can call with Azure API Management or Azure Logic Apps.

### Network connectivity

The following section describes network connectivity functionality and capabilities in BizTalk Server and Azure Integration Services.

#### BizTalk Server

With BizTalk Server always installed in a server environment, network connectivity depends on the underlying server's network configuration. When you set up network connectivity for BizTalk Server, you usually have to configure the following areas:

- Dependencies
- Inbound and outbound connectivity to end systems

##### Dependencies configuration

To fully configure BizTalk Server in a multi-server environment, you need to pay special attention to all network connectivity dependencies, which usually involves firewall configuration to enable TCP and UDP ports for well-known services or protocols. For example, such services and protocols include access to a SQL Server engine, Microsoft Distributed Transaction Coordinator (MSDTC), clustered network drives, SSO services if installed on a different server, and SharePoint are all services that you must configure by creating inbound and outbound rules to implement connectivity.

##### Inbound and outbound connectivity configuration

After you fully set up BizTalk Server and are getting ready to deploy applications, make sure to implement firewall rules that allow host instances to connect and access different services, whether they're part of an internal or external network. When you're thinking about connectivity to end systems outside the organization network, you must also include security considerations. Various systems rely on defining a list of allowed IP addresses as their first line of defense, so ideally, BizTalk Server routes all their outbound communication through a well-defined list of public IP addresses.

When partner services try to contact BizTalk Server, make sure they don't reach an instance that's within your organization's network or inner layer where the core organization services might be available. Instead, give partner services access to an endpoint that exists within a perimeter network, also known as a demilitarized zone (DMZ), which is the outmost boundary of an organization's network. However, services to where BizTalk Server must route messages usually exist within your organization's network, so they should have access to that inner layer.

To achieve these scenarios, multiple approaches exist, for example:

- Implement BizTalk Server in a perimeter network and only allow its own services, or host instances, to access your organization's network
- Set up two BizTalk Servers with one in a perimeter network and the other in your organization's network. The server in the perimeter network then publishes the messages that the server in the organizational network consumes.
- Develop custom applications or appliance software, such as NetScaler and F5, which can act as reverse proxies, receive messages on behalf of BizTalk within the perimeter network, and redirect those calls to BizTalk Server.

#### Azure Integration Services

- Inbound and outbound connectivity

  Azure provides multiple ways to isolate their services within a network boundary and connect on-premises and cloud workloads. The following list describes different ways that you can integrate Azure resources with resources inside a network perimeter:

  - On-premises data gateway

    This gateway acts as a bridge between Azure and resources within a network perimeter, providing quick and secure data transfer between on-premises data and various Microsoft cloud services. These services include Azure Logic Apps, Microsoft Power BI, Microsoft Power Apps, Microsoft Power Automate, and Azure Analysis Services. With this gateway, you can keep databases and other data sources within their on-premises networks and securely use that on-premises data in cloud services.

  - Hybrid Connections

    Both an Azure service and a feature in Azure App Service, Hybrid Connections support scenarios and offers capabilities beyond those used in Azure App Service. For more information about usage outside Azure App Service, see [Azure Relay Hybrid Connections](../azure-relay/relay-hybrid-connections-protocol.md). Within Azure App Service, you can use Hybrid Connections to access application resources in any network that can make outbound calls to Azure over port 443. Hybrid Connections provide access from your app to a TCP endpoint and doesn't enable a new way to access your app. In Azure App Service, each hybrid connection correlates to a single TCP host and port combination. This functionality enables your apps to access resources on any OS, provided that a TCP endpoint exists. Hybrid Connections doesn't know or care about the application protocol or what you want to access. This feature simply provides network access.

  - Virtual network integration

    With [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) integration, you can connect your Azure resource to a virtual network configured in Azure, giving your app access to resources in that virtual network. Virtual network integration in Azure Logic Apps is used only to make outbound calls from your Azure resource to your virtual network.

    With [virtual network peering](../virtual-network/virtual-network-peering-overview.md), you can connect your on-premises networks to Azure, which provides bi-directional connectivity between on-premises resources and Azure services. Azure Integration Services provides virtual network connectivity, allowing for hybrid integration. The following image shows a Standard logic app resource with the Networking page open and virtual network integration enabled as highlighted in the **Outbound Traffic** box. This configuration makes sure that all outbound traffic leaves from this virtual network.

    :::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/standard-logic-app-networking-page-virtual-network-integration.png" alt-text="Screenshot showing Azure portal, Standard logic app resource, and Networking page with virtual network integration enabled.":::

  - Private endpoints

    A [private endpoint](../private-link/private-endpoint-overview.md) is a network interface that uses a private IP address from your virtual network. This network interface privately and securely connects to an Azure resource that's powered by [Azure Private Link](../private-link/private-link-overview.md). By enabling a private endpoint, you bring that Azure resource into your virtual network and allow resources in the network to make inbound calls to your Azure resource.

The following table shows the network connectivity methods that each Azure Integration Services resource can use:

| Resource | On-premises data gateway | Hybrid Connections | Virtual network integration | Private endpoints |
|----------|--------------------------|--------------------|-----------------------------|-------------------|
| Azure API Management | ✅ || ✅ | ✅ |
| Azure Logic Apps (Consumption) | ✅ ||||
| Azure Logic Apps (Standard) | ✅ <br>(with Azure connectors) | ✅ <br>(with built-in connectors) |  ✅ <br>(with built-in connectors) | ✅ |
| Azure Service Bus ||| ✅ | ✅ |
| Azure Event Grid ||||

### Custom code

The following section describes options for authoring and running your own code in BizTalk Server and Azure Integration Services.

#### BizTalk Server

You can extend BizTalk in many ways by using custom .NET Fx code, for example:

| Capability | Description |
|------------|-------------|
| Inline code | You can write inline C# code within an Orchestration shape. You can also write inline code within a BizTalk Map. In both scenarios, the code snippets are generally simple in nature and can't be debugged. |
| Compiled assemblies | You can call these assemblies from the following places: <br><br>- Expression shapes in an orchestration <br>- BizTalk maps using the Scripting Functoid <br>- Business Rules Engine policies <br>- Pipelines as custom pipeline components <br><br>You can debug compiled assemblies by attaching the Visual Studio debugger to the appropriate host instance Windows process. |
| Custom adapters | BizTalk Server includes many out-of-the-box adapters, but you can always create your own adapter if needed. |
| Custom WCF behaviors | BizTalk Server includes many out-of-the box adapters with the majority based on Windows Communication Foundation (WCF). In some cases, you might need to extend their capabilities by developing custom behaviors, such as applying an OAuth header to your system communication. |
| Extensibility in BizTalk Server maps | - You can create inline code using C#, JScript, Visual Basic, XSLT or XSLT Call Templates to suppress some limitations or difficulties using the out-of-the-box functoids. <br><br>- You can call an external assembly using the Scripting Functoid. <br><br>- You can create custom functoids to use across all your maps. |

#### Azure Integration Services

Azure Functions provides the capability for you to write code that you can run from the Azure Functions connector in [Azure Logic Apps](./logic-apps-overview.md). The Functions platform supports various programming languages and runtimes, which offer much flexibility. These functions are generally designed to have short execution times, and a rich set of developer tools exists to support local development and debugging.

In Azure Logic Apps, the **Inline Code** connector provides the action named **Execute JavaScript Code**. You can use this action to write small code snippets in JavaScript. These code snippets are also expected to have short execution times and support dynamic content inputs and outputs. After the code runs, the output is available for downstream actions in the workflow. Although no direct debugging support currently exists for this action, you can view the inputs and outputs in the workflow instance's run history.

As mentioned in the [Reusable Components](#reusable-components) section, support for calling .NET Fx assemblies from an XSLT map is currently available in Consumption logic app workflows when you upload those assemblies to an integration account. This capability helps support custom data transformation rules. For Standard logic app workflows, the Azure Logic Apps team recently released support for calling .NET Fx code from XSLT maps without requiring an integration account. You can also add assemblies and maps to a Standard logic app project in Visual Studio Code and subsequently deploy to Azure. For more information, see [.NET Framework assembly support added to Azure Logic Apps (Standard) XSLT transformations](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/net-framework-assembly-support-added-to-azure-logic-apps/ba-p/3669120) and the Road Map section.

You can also extend workflows by including Azure API apps or web apps created with Azure App Service. When you have a requirement to host web apps, REST APIs, and mobile back ends, Azure App Service is the go-to HTTP-based solution. You can integrate apps hosted in Azure App Service with on-premises or cloud services. This platform supports both Windows and Linux-based environments to run and scale applications along with various languages and frameworks, such as ASP.NET Core, Java, Ruby, Node.js, PHP and Python.

### Application groups

The following section describes options for organizing your workloads in BizTalk Server and Azure Integration Services.

#### BizTalk Server

Part of your software development lifecycle includes building and managing your code and artifacts in logical packages. BizTalk Server supports the concept of an application such that you can deploy a Visual Studio solution into a BizTalk application. So, if you have scenarios where you need to share resources, you can reference other applications.

BizTalk Server uses an explicit sharing model where you can add references to compiled assemblies. Provided that these assemblies are in the Global Assembly Cache (GAC), the BizTalk Runtime finds and load assemblies as needed. One drawback is that when you need to update the shared assemblies, unless you implement a versioning scheme, you have to uninstall all BizTalk projects that reference your assemblies before you make your update. This limitation can result in lengthy deployment timelines and complexity in managing multiple installs and uninstalls.

#### Azure Integration Services

In Azure Logic Apps, the Consumption logic app resource includes only a single stateful workflow, which means your workflow and logic app resource, which is your application, always has a 1-to-1 relationship. With the Standard logic app resource, the application concept evolved. Although your Standard logic app resource is still your application, you can include and run multiple workflows with this resource, resulting in a 1-to-many relationship. If you're working locally on a Standard logic app project in Visual Studio Code, your logic app resource maps to this single project. With this approach, you can easily and logically group related workloads, code, and artifacts in the same project and deploy that project as a single unit.

Cloud architectures work differently than server-based paradigms such as BizTalk. Azure Logic Apps (Standard) uses a pull model to bring in code and artifacts. So, as a result, you'll copy any additional necessary artifacts into your project and subsequently deploy them with your code and other artifacts. In some cases, you might want to avoid having to copy all the necessary code and artifacts. If so, you might consider turning this functionality into a service that you can manage separately but can call from a workflow.

For example, suppose you have a data transformation that's widely used by your organization. Rather than including the map for the transformation across multiple logic app projects, you can implement an interface that provides the transformation as a service. You can then manage the lifecycle for that service separately from your logic app projects and call that service from your workflows.

With the ability to include multiple workflows in a Standard logic app project, you might ask how you'd organize those workflows within a project or across multiple projects? The answer usually depends on your requirements, for example:

- Business process affinity
- End to end monitoring and support
- Security, role-based access control, and network isolation
- Performance and business criticality
- Geo-location and geo-redundancy

For more information, see [Organizing logic app workflows in Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/organizing-logic-apps-workflows-with-logic-apps-standard/ba-p/3251179).

### Security and governance

Security and governance are naturally important when building integrated solutions. By definition, middleware sits between two or more systems. To connect and access these systems when establishing a connection, you often need to pass along credentials or secrets, so managing this sensitive information requires consideration.

#### BizTalk Server

BizTalk includes [Enterprise Single Sign-On (SSO)](/biztalk/core/enterprise-single-sign-on-sso), which lets you store, map and transmit encrypted credentials used by adapters. This encrypted information is stored in the SSO database. You can also configure [SSO affiliate applications](/biztalk/core/enterprise-single-sign-on2#create-affiliate-application-for-non-windows-systems), which are logical entities that represent a system or line of business system that you want to connect.

#### Azure Integration Services

[Azure Logic Apps](./logic-apps-overview.md) supports the following security capabilities:

- Azure Key Vault

  You can store credentials, secrets, API keys, and certificates using [Azure Key Vault](../key-vault/general/basic-concepts.md). In Azure Logic Apps, you can access this information by using the [Azure Key Vault connector](/connectors/keyvault/) and exclude this information from the platform's logs and run history by using the [secure inputs and outputs functionality](./logic-apps-securing-a-logic-app.md#obfuscate).

  Later in the [Tracking](#tracking) section, this guide describes the run history functionality, which provides a step-by-step replay of a workflow's execution. Although Azure Logic Apps offers the value proposition of capturing every input and output in a workflow run, sometimes you need to manage access to sensitive data more granularly. You can set up obfuscation for this data by using the secure inputs and outputs capability on triggers and actions to hide such content from run history and prevent sending this data to Azure Monitor, specifically Log Analytics and Application Insights. The following image shows an example result from enabling secure inputs and secure outputs in run history.

    :::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/azure-logic-apps-secure-inputs-outputs.png" alt-text="Screenshot showing hidden inputs and outputs in workflow run history after enabling secure inputs and outputs.":::

- OAuth-based integration

  Most connectors use this authentication type when creating connections. This approach makes integrating with many SaaS services as easy as providing your email address and password. Azure API Management also supports OAuth, so you can use both services together by providing a unified authentication scheme.

  This capability isn't natively available in BizTalk Server.

- Managed identities

  Some connectors support using a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for authenticating access to resources protected by Microsoft Entra ID. When you use a managed identity to authenticate your connection, you don't have to provide credentials, secrets, or Microsoft Entra tokens.

### Application management and access management

The following section describes options for managing applications and access in BizTalk Server and Azure Integration Services.

#### BizTalk Server

Administrators use the [BizTalk Server Administrator Console](/biztalk/core/using-the-biztalk-server-administration-console) to manage BizTalk Server applications. This tool is a Microsoft Management Console (MMC) thick client application that administrators can use to deploy applications, review previous, active, and queued transactions, and perform deep troubleshooting activities such as reviewing traces and resubmitting transactions.

#### Azure Integration Services

The [Azure portal](../azure-portal/azure-portal-overview.md) is a common tool that administrators and support personnel use to view and monitor the health of interfaces. For Azure Logic Apps, this experience includes rich transaction traces that are available through run history.

Granular [role-based access controls (RBAC)](../role-based-access-control/overview.md) are also available so you can manage and restrict access to Azure resources at various levels.

### Storage

The following section describes options for data storage in BizTalk Server and Azure Integration Services.

#### BizTalk Server

BizTalk Server heavily relies on [SQL Server for data store and data persistence](/biztalk/technical-guides/high-availability-for-databases). All other components and hosts in BizTalk Server have specific roles in integrating disparate business applications, such as receiving, processing, or routing messages. However, the database computer captures and persists this work to disk. For example, when BizTalk Server receives an incoming message, the receive host persists that message to the MessageBox database before other hosts retrieve the message for orchestration processing and sending.

As you're responsible for provisioning and managing your SQL databases, high availability is an important architectural component to ensure uptime. To provide high availability for the BizTalk Server databases, customers often use Windows Clustering to create a server cluster with two or more computers running SQL Server. This server cluster provides redundancy and fault tolerance for BizTalk Server databases. Unlike load-balanced clustering where a computer group works together to increase availability and scalability, server clustering typically involves a pair of database computers in an active-passive configuration so that one computer provides backup resources for the other.

#### Azure Integration Services

[Azure Logic Apps](./logic-apps-overview.md) relies on [Azure Storage](../storage/common/storage-introduction.md) to store and automatically [encrypt data at rest](./logic-apps-securing-a-logic-app.md). This encryption protects your data and helps you meet your organizational security and compliance commitments. By default, Azure Storage uses Microsoft-managed keys to encrypt your data. For more information, see [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md).

When you work with Azure Storage through the Azure portal, [all transactions take place over HTTPS](../security/fundamentals/encryption-overview.md#azure-storage-transactions). You can also work with Azure Storage by using the Storage REST API over HTTPS. To enforce using HTTPS when you call the REST APIs to access objects in storage accounts, enable the secure transfer that's required for the storage account.

### Data configuration

The separation between configuration and code becomes important when you want to move your integration solutions between environments without having to recompile or reassemble your code. Configuration information is usually environment specific, so you can define endpoints and other details that need to change as you deploy solutions across your landscape.

#### BizTalk Server

- BizTalk NT Service executable

  This executable calls an app.config file named [**BTSNTSvc.exe.config**](/biztalk/core/btsntsvc-exe-config-file). This file provides key-value pairs so that you can store clear text configuration information. However, take care with this file based on the following considerations:

  - Make sure to carefully replicate configuration across all computers within a [BizTalk group](/biztalk/core/biztalk-groups).

  - Configuration changes require that you restart host instances to pick up the latest values in this configuration file.

  - Any syntax errors introduced to this configuration file prevent host instances from starting and result in downtime.

- Enterprise SSO tool

  You can also use this tool as a configuration store. [Community tools](https://blog.sandro-pereira.com/2018/02/27/how-to-configure-and-use-my-sso-application-configuration-tool/) are also available to enable data management using Enterprise SSO. You can subsequently access this data through SDK tooling to retrieve this data at runtime.

- Custom cache components

  These components are often introduced so you can address use cases beyond key-value pairs. For example, suppose you want to store tabular data in a SQL Server database and load that data into memory when a host instance starts. This implementation allows BizTalk Server to get this information at runtime by running custom .NET Fx code. You can then access this data from orchestrations, BizTalk maps, and custom pipeline components.

- Custom database

  Databases are a well-known technology and language for both developers and administrators, so a custom database is another common option for storing application configuration data.

- Business Rules Engine (BRE)

  While not a primary use case, the BRE can also act as a configuration store. Whether you call the engine from an orchestration or [pipeline component](https://adventuresinsidethemessagebox.wordpress.com/2014/02/17/biztalk-bre-pipeline-framework-v1-4-0-released-on-codeplex-site/), you can define environment-specific information in BRE policies and then deploy the corresponding policy to the relevant environment. At runtime, an orchestration or pipeline component can access and use this information in downstream functions such as maps or in routing situations.

- Custom configuration file

  You can use custom configuration (.config) files to store application configuration data, but this approach isn't common because you likely have to maintain a static and fixed location for these files across all environments.

- Windows registry

  You can use the [Windows registry](/troubleshoot/windows-server/performance/windows-registry-advanced-users) as a valid option to store the application configuration values. This registry is a central hierarchical database used by Microsoft Windows operating systems to store information that's necessary to configure the system for one or more users, applications, and hardware devices. The registry contains the following basic elements: hives, keys and values. However, maintaining values stored in the registry can prove difficult in large environments with multiple registries and the difficulty of backing up individual application settings.

#### Azure Integration Services

- Azure Key Vault

  This service stores and protects cryptographic keys and other secrets used by applications and cloud services. Because secure key management is essential to protect data in the cloud, use [Azure Key Vault](../key-vault/general/overview.md) to encrypt and store keys and secrets, such as passwords.

- Azure App Configuration

  This service centrally manages application settings and feature flags. You can store configurations for all your Azure apps in a universal, hosted location. Manage configurations effectively and reliably in real time and without affecting customers by avoiding time-consuming redeployments. [Azure App Configuration](../azure-app-configuration/overview.md) is built for speed, scalability, and security.

- Azure Cosmos DB

  This service is a fully managed NoSQL database for modern app development with single-digit millisecond response times plus automatic and instant scalability that guarantee speed at any scale. You can load configuration data into [Azure Cosmos DB](../cosmos-db/introduction.md) and then access that data using the [Azure Cosmos DB connector](/connectors/documentdb/) in Azure Logic Apps.

- Azure Table Storage

  This service provides another storage facility to keep configuration data at a low cost. You can easily access this data using the [Azure Table Storage connector](/connectors/azuretables/) in Azure Logic Apps. For more information, see [Azure Table Storage](../storage/tables/table-storage-overview.md).

- Custom caching

  You can also implement custom caching solutions with Azure Integration Services. Popular approaches include using [caching policies](/azure/api-management/api-management-caching-policies#CachingPolicies) in [Azure API Management](../api-management/api-management-key-concepts.md) and [Azure Cache for Redis](../azure-cache-for-redis/cache-overview.md).

- Custom database

  Databases are a well-known technology and language for both developers and administrators, so a custom database is another common option for storing application configuration data.

### Large file processing

The following section describes options for handling large files in BizTalk Server and Azure Integration Services.

#### BizTalk Server

To address large file processing, BizTalk Server includes [optimizations](/biztalk/core/how-biztalk-server-processes-large-messages) based upon the following profiles:

- Message routing only

  If you use BizTalk Server only for routing messages based on promoted message properties, messages are streamed to the MessageBox database using the .NET XmlReader interface. BizTalk Server doesn't load individual message parts into memory, so in this scenario, out of memory errors aren't a problem. However, the primary consideration is the amount of time required to write very large messages (over 100 MB) to the MessageBox database. The BizTalk Server development team has successfully tested the processing of messages up to 1 GB when only performing routing. For more information, see [Optimizing pipeline performance](/biztalk/technical-guides/optimizing-pipeline-performance).

- Data transforms with maps

  When BizTalk Server transforms a document using a map, this potentially memory-intensive operation passes the message to the .NET XslCompiledTransform class, which loads the XSL style sheet. After the load operation successfully completes, multiple threads can simultaneously call the [Transform method](/biztalk/esb-toolkit/the-transformation-web-service). For more information, see [XslCompiledTransform Class](/dotnet/api/system.xml.xsl.xslcompiledtransform).

  BizTalk Server significantly improves memory management for large documents by implementing a configurable message size threshold for loading documents into memory during transforms. By default, the message size threshold is 1 MB. For any message with a size below this threshold, BizTalk Server handles the message within memory. To reduce memory requirements for any message with a size above this threshold, BizTalk Server buffers the message to the file system.

#### Azure Integration Services

Some foundational differences exist between processing large files with an on-premises middleware platform such as BizTalk Server versus a PaaS offering such as Azure Logic Apps. For example, carefully scrutinize large message scenarios to find the right solution because potentially different ways exist to solve this problem in a modern cloud environment.

##### File size limits

In Azure, file size limits exist to ensure consistent and reliable experiences. To validate your scenario, make sure to review the [service limits documentation for Azure Logic Apps](./logic-apps-limits-and-config.md#messages). Some connectors support [message chunking](./logic-apps-handle-large-messages.md) for messages that exceed the default message size limit, which varies based on the connector. Message chunking works by splitting a large message into smaller messages.

Azure Logic Apps isn't the only service that has message size limits. For example, Azure Service Bus also has [such limits](../service-bus-messaging/service-bus-premium-messaging.md). For more information about handling large messages in Azure Service Bus, see [Large messages support](../service-bus-messaging/service-bus-premium-messaging.md#large-messages-support).

##### Claim-check pattern

To avoid file size limitations, you can implement the [claim-check pattern](/azure/architecture/patterns/claim-check), which works by splitting a large message into a *claim check* and a payload. You send the claim check to the messaging platform and store the payload on an external service. That way, you can process large messages, while you protect the message bus and the client from overload. This pattern also helps to reduce costs because storage is usually cheaper than resource units used by the messaging platform.

##### Azure Data Factory

[Azure Data Factory](../data-factory/introduction.md) provides another option for handling large files. This service is Azure's [ELT offering](../data-factory/introduction.md) for scalable serverless data integration and data transformation with a code-free visual experience for intuitive authoring and single-pane-of-glass monitoring and management. You can also lift and shift existing [SQL Server Integration Services (SSIS)](/sql/integration-services/sql-server-integration-services) packages to Azure and run them with full compatibility in Azure Data Factory. The SSIS Integration Runtime offers a fully managed service, so you don't have to worry about infrastructure management. For more information, see [Lift and shift SQL Server Integration Services workloads to the cloud](/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview).

In on-premises architectures, SSIS was a popular option for managing the loading of large files into databases. As the cloud equivalent for that architecture, Azure Data Factory can address the transformation and movement of large datasets across various data sources, such as file systems, databases, SAP, Azure Blob Storage, Azure Data Explorer, Oracle, DB2, Amazon RDS, and more. When you have large data processing requirements, consider using Azure Data Factory as a better option over Azure Logic Apps and Azure Service Bus.

### Monitoring and alerts

#### BizTalk Server

- [BizTalk Health Monitor](/biztalk/core/monitoring-biztalk-server)

  This tool is an MMC snap-in that you can use to monitor the health of your BizTalk Server environments and perform maintenance tasks. Features include MsgBox Viewer (MBV) reports, Terminator tool tasks, email notifications, report collection, and [perfmon](/windows-server/administration/windows-commands/perfmon) integration.

- [BizTalk Administration console](/biztalk/core/administration-tools#tools-list)

  This tool is also an MMC snap-in for administrators to discover failures, suspended instances, transactions currently being retried, state, and more. The tool experience is very reactive in nature because you must constantly refresh the console to review the latest information.

- [BizTalk360](https://www.serverless360.com/business-applications)

  An external web solution that provides total control over your BizTalk Server environment. This single tool offers operations, monitoring, and analytics capabilities for BizTalk Server.

#### Azure Integration Services

- [Azure Monitor](../azure-monitor/overview.md)

  To monitor Azure resources, you can use this service and the [Log Analytics](../azure-monitor/logs/log-analytics-workspace-overview.md) capability as a comprehensive solution for collecting, analyzing, and acting on telemetry data from your cloud and on-premises environments.

- In [Azure Logic Apps](./logic-apps-overview.md), the following options are available:

  - For Consumption logic app workflows, you can install the Logic Apps Management Solution (Preview) in the Azure portal and set up Azure Monitor logs to collect diagnostic data. After you set up your logic app to send that data to an Azure Log Analytics workspace, telemetry flows to where the Logic Apps Management Solution can provide health visualizations. For more information, see [Set up Azure Monitor logs and collect diagnostics data for Azure Logic Apps](./monitor-workflows-collect-diagnostic-data.md). With diagnostics enabled, you can also use Azure Monitor to send alerts based on different signal types such as when a trigger or a run fails. For more information, see [Monitor run status, review trigger history, and set up alerts for Azure Logic Apps](./monitor-logic-apps.md?tabs=consumption#set-up-monitoring-alerts).

  - For Standard logic app workflows, you can enable Application Insights at logic app resource creation to send diagnostic logging and traces from your logic app's workflows. In Application Insights, you can view an [application map](../azure-monitor/app/app-map.md) to better understand the performance and health characteristics of your interfaces. Application Insights also includes [availability capabilities](../azure-monitor/app/availability-overview.md) for you to configure synthetic tests that proactively call endpoints and then evaluate the response for specific HTTP status codes or payload. Based upon your configured criteria, you can send notifications to stakeholders or call a webhook for additional orchestration capabilities.

- [Serverless 360](https://www.serverless360.com/) is an external solution from [Kovai](https://www.kovai.co/) that provides monitoring and management through mapping Azure services, such as Azure Logic Apps, Azure Service Bus, Azure API Management, and Azure Functions. You can reprocess messages by using dead letter queues in Azure Service Bus, enable self-healing to address intermittent service disruptions, and set up proactive monitoring through synthetic transactions.

  You can configure custom monitoring rules and view logs in a portal experience. You can send notifications through various channels, such as email, Microsoft Teams, and ServiceNow. To visually determine the health of your interfaces, service maps are available.

### Business activity monitoring

The following section describes options to monitor and collect telemetry for workloads in BizTalk Server and Azure Integration Services.

#### BizTalk Server

BizTalk Server includes a feature called Business Activity Monitoring (BAM) that allows developers and business analysts to define tracking profiles that they can apply to orchestrations. As messages move through receive and send ports, data attributes are captured and stored in a BAM database. Custom implementation is also available through a .NET Fx API.

#### Azure Integration Services

Although no equivalent business activity monitoring capability exists in Azure, you can build a custom solution using capabilities such as Application Insights or other data platforms. Throughout workflow execution, you can instrument your code or configuration to send relevant information to these data stores where you can perform additional analytics and visualization using [Power BI](/power-bi/fundamentals/power-bi-overview). For more information about future investments in this area, see the [Road Map](#road-map) section later in this guide.

Another option is that you can use an external solution from [Kovai](https://www.kovai.co/) called [Serverless 360](https://www.serverless360.com/). Along with the monitoring platform, you can use the [business activity monitoring feature](https://www.serverless360.com/business-activity-monitoring) that provides end-to-end tracking for business process flows across cloud-native and hybrid integrations. This feature includes a managed connector that developers can use to instrument code and capture important business data. Administrators can subsequently build dashboards and share them with business analysts.

### Tracking

The following section describes options to track artifacts for performance monitoring and health analysis in BizTalk Server and Azure Integration Services.

#### BizTalk Server

- Message tracking

  BizTalk Server administrators can use [message body tracking](/biztalk/core/what-is-message-tracking#message-body) to indicate when to persist message bodies to storage for troubleshooting and audit purposes. Message tracking is an expensive operation from both performance and storage perspectives, so use this capability selectively to avoid performance issues. When you enable message body tracking on Receive and Send ports, BizTalk Server copies the data to the [BizTalk Tracking database (BizTalkDTADb)](/biztalk/core/databases-in-biztalk-server) by using the [SQL Server Agent job](/troubleshoot/developer/biztalk/setup-config/sql-server-agent-jobs-biztalk) named [TrackedMessages_Copy_<*message-box-name*>](/biztalk/core/how-to-copy-tracked-messages-into-the-biztalk-tracking-database).

  :::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-server-tracking-orchestrations.png" alt-text="Diagram showing orchestration tracking in BizTalk Server.":::

  You can apply tracking to almost all BizTalk Server artifacts, including orchestrations, pipelines, Receive ports, Send ports, schemas, and business rules. These options are enabled or disabled in runtime without affecting your code (solution) or requiring any restart.

- Health and Activity Tracking (HAT)

  Although the HAT tool was removed from the BizTalk Server starting with the 2009 edition, the functionality still exists within the BizTalk Administration Console. Administrators can search for data through the New Query interface within the Group Overview experience. You can tailor queries based on different criteria including the event type, port name, URI, schema name, and more. If you want to review the message bodies that moved through a Receive or Send port, you can access this information provided that you enabled port level tracking. For more information, see [Health and activity tracking](/biztalk/core/health-and-activity-tracking).

- Integration with Application Insights and Azure Event Hubs

  As of [BizTalk Server 2016 Feature Pack 1](/biztalk/core/send-tracking-data-to-azure-application-insights-using-biztalk-server), you can publish telemetry to Application Insights in Azure Monitor or to Azure Event Hubs. This approach avoids SQL Server disk capacity issues, so that you can use elastic, cloud-based data stores instead, such as Application Insights, Log Analytics, and run history in Azure Logic Apps.

#### Azure Integration Services

Azure Logic Apps provides rich run history so that developers and support analysts can review action by action telemetry, including all processed inputs and outputs. To help protect any sensitive data, you can [enable secure inputs and outputs](./logic-apps-securing-a-logic-app.md?tabs=azure-portal#obfuscate) on individual actions in workflows. This capability obfuscates or hides the data in logs and workflow run histories to avoid leaks.

Beyond data obfuscation, you can use [Azure RBAC](../role-based-access-control/overview.md) rules to protect data access. Azure RBAC includes two built-in roles specifically for Azure Logic Apps, which are [Logic App Contributor and Logic App Operator](./logic-apps-securing-a-logic-app.md#secure-operations).

Beyond Azure RBAC, you can also [restrict access to run history in Azure Logic Apps by IP address range](./logic-apps-securing-a-logic-app.md#restrict-ip).

### Hosting

The following section describes hosting options for BizTalk Server and Azure Integration Services.

#### BizTalk Server

BizTalk Server 2020 supports the following Microsoft platforms and products:

- Windows Server 2019, Windows Server 2016, and Windows 10
- Visual Studio 2019 Enterprise and Visual Studio 2019 Professional
- SQL Server 2019, SQL Server 2017, and SQL Server 2016 SP2
- Office 2019 and Office 2016

You can install and run BizTalk Server on your own hardware, on-premises virtual machine, or Azure virtual machines. Azure virtual machines give you the flexibility of virtualization for a wide range of computing solutions with support for BizTalk Server, Windows Server, SQL Server, and more. All current generation virtual machines include load balancing and auto-scaling at no cost.

#### Azure Integration Services

##### Azure Logic Apps

- Hosting plans

  In single-tenant Azure Logic Apps, a Standard logic app is similar to an Azure function or web app where you can use a single Workflow Service plan to host multiple Standard logic apps. This similarity means you don't have to deploy all your workflows in a single Standard logic app resource. Instead, you can organize these workflows into logical groups (logic apps) to help you better manage other aspects of your solution. This approach helps you get the most out of your Workflow Service plan and future-proof your applications, which you can implement so that they can individually scale.

  A Standard logic app has the following pricing tiers: WS1, WS2 and WS3. Functionally, each tier provides the same capabilities. Your requirements for compute and memory determine is best for your scenario, for example:

  | Pricing tier | Virtual CPU (vCPU) | Memory (GB) |
  |--------------|--------------------|-------------|
  | WS1 | 1 | 3.5 |
  | WS2 | 2 | 7 |
  | WS3 | 4 | 14 |

  For the latest information, see [Pricing tiers in the Standard model](./logic-apps-pricing.md#standard-pricing-tiers).

- Availability and redundancy

  In Azure, [availability zones](../reliability/availability-zones-overview.md#zonal-and-zone-redundant-services) provide resiliency, distributed availability, and active-active-active zone scalability. To increase availability for your logic app workloads, you can [enable availability zone support](./set-up-zone-redundancy-availability-zones.md), but only when you create your logic app. You'll need at least three separate availability zones in any Azure region that supports and enables zone redundancy. The Azure Logic Apps platform distributes these zones and logic app workloads across these zones. This capability is a key requirement for enabling resilient architectures and providing high availability if datacenter failures happen in a region. For more information, see [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

- Isolated and dedicated environment

  For Standard logic apps, you have the option to select an App Service Environment (ASE) v3 for your deployment environment. With an ASE v3, you get a fully isolated and dedicated environment to run applications at high scale with predictable pricing. You pay only for the [ASE App Service plan](./single-tenant-overview-compare.md), no matter how many logic apps that you create and run.

##### Azure Service Bus

Azure Service Bus offers various pricing tiers so that you can choose the best tier that meets your needs. For enterprise environments, customers usually choose Premium or Standard tiers. For customers that need high throughput with predictable performance and support for advanced networking, the Premium tier is a better option. Or, if you can accept variable throughput and smaller message processing, the Standard tier might make more sense. The following table summarizes both tiers:

| Premium tier | Standard tier |
|--------------|---------------|
| High throughput | Variable throughput |
| Predictable performance | Variable latency |
| Fixed pricing | Pay as you go variable pricing |
| Ability to scale workload up and down | Not available |
| Message size up to 100 MB. See [Large message support](../service-bus-messaging/service-bus-premium-messaging.md#large-messages-support). | Message size up to 256 KB |

For the latest information, see [Service Bus Premium and Standard messaging tiers](../service-bus-messaging/service-bus-premium-messaging.md).

##### Azure API Management

Azure API Management offers various pricing tiers so that you can choose the best tier that meets your needs. Each tier has its own capabilities and are named Consumption, Developer, Basic, Standard, and Premium.

The capabilities in these tiers range from Microsoft Entra integration, Azure virtual network support, built-in cache, self-hosted gateways, and more. For more information about these tiers and their capabilities, see [Feature-based comparison of the Azure API Management tiers](../api-management/api-management-features.md).

##### Azure Data Factory

Azure Data Factory offers various pricing models so that you can choose the best model that meets your needs. The options vary based upon the [runtime type](../data-factory/concepts-integration-runtime.md#integration-runtime-types), which includes the Azure Integration Runtime, Azure Managed VNET Integration Runtime, and the Self-Hosted Integration Runtime. Within each runtime offering, consider the support for orchestrations, data movement activity, pipeline activity, and external pipeline activity. For more information about cost planning and pricing, see [Plan to manage costs for Azure Data Factory](../data-factory/plan-manage-costs.md) and [Understanding Data Factory pricing through examples](../data-factory/pricing-concepts.md)

### Deployment

#### BizTalk Server

The native deployment packaging in BizTalk Server is based on a Microsoft Installer (MSI) file combined with an environment configuration, or bindings, file. These two files create a separation between the installation of components, which are deployed to the following BizTalk Server repositories and defines settings at the port and pipeline level, including endpoint, secrets, pipeline configuration, and others.

- Management DB
- BizTalk Server local folders
- .NET Global Assembly Cache

Although this process can prove effective, you also have to manage each individual environment configuration separately from the code. The BizTalk Deployment Framework (BTDF) open-source project offers one solution for this problem. With this tool, you can maintain the environment configuration as part of your BizTalk Server solution by using a tokenized binding file, which you create at design time, and a token matrix, which you create as an Excel file, for each environment.

The build process then creates a unified and versioned MSI file. This file supports component deployment and environment configuration from the same package, which gives you better control over the version of the solution that you want to implement across environments.

Support for a BTDF package in a continuous integration-continuous deployment (CI/CD) pipeline is available in BizTalk Server 2020, which includes this functionality introduced with the BizTalk Server 2016 Feature Packs. You can use this functionality and the Azure DevOps platform to streamline automatic deployment for BizTalk Server solutions across environments.

#### Azure Integration Services

When you deploy an Azure Integration Services component or solution to Azure, you must manage the following items:

- Azure resources that act as containers or the infrastructure for the solutions that you want to deploy, for example, the API Management instance, Standard logic app resource, Service Bus namespace, or Event grid topic

- The actual logic implemented by each component such as APIs, workflows, queues, and subscriptions

- The environment-specific configuration associated with each component, for example, permissions, secrets, alerts, and so on

When you keep the infrastructure definition separate from the code, you can treat the infrastructure definition as just another piece of code that you can version, store safely in a source control repository, and trigger a deployment when the definition changes. This practice, commonly known as Infrastructure as Code (IaC), improves environment quality because you can create versions for each environment and track changes back to source control.

Azure Integration Services supports IaC by providing the capability to create infrastructure resources using Azure Resource Management templates. Although ARM templates can seem complex to understand and implement as a unified solution, you can use abstraction tools, such as Bicep, Terraform, or Pulumi, which provide a code-like experience for creating your infrastructure definition. Although these tools provide abstraction layers over ARM templates, the tools ultimately generate ARM templates and can deploy those templates for you.

With your infrastructure in place, you can deploy the logic that implements your end-to-end workflows. As Azure Integration Services offers a collection of tools for you to implement your integration workflows, you must deploy each component. For solutions built with Azure Integration Services, CI/CD pipelines are usually based on deploying an orchestration of components. DevOps engineers can use built-in actions that abstract deployment activities, or they use generic actions that run either CLI commands or automation scripts such as PowerShell and Bash. In most cases, engineers customize pipelines based on the application's needs, review guidance from official documentation, and use sample repositories as a starting point.

The process to get each component ready for deployment usually takes the following steps under consideration:

- Continuous integration phase

  1. Get the source code's latest version.

  1. Prepare the code with the environment-specific configuration.
  
     The details for this step depend on each technology's support for external injection of environment variables. The basic premise is that environment-based configuration information, such as connection strings and references to external resources, are abstracted to reference an application settings repository. So, in this scenario, you'd store references that can exist as clear text directly in the application settings repository, but you'd store sensitive values, such as secrets, as reference pointers to entries in a secrets store, such as an Azure key vault.

     Azure Logic Apps makes this approach possible for a Standard logic app resource by supporting references to the application settings repository, which you can then map name-value pairs to entries in your key vault.

     For Azure API Management, you can get similar results by using a name-values configuration, which also supports Azure Key Vault.

  1. Package the code for deployment in various environments.

- Continuous deployment phase

  1. Deploy packaged code in the destination environment.

  1. Update the application settings repository with the correct environment values, either as clear text or references to entries in your key vault.

  1. Update any required permissions that depend on code.

  1. Get your application ready for execution, if required.

## Feature matchup

The following table and diagram roughly show how resources, artifacts, features, and capabilities match up between BizTalk Server compared to Azure Integration Services, although the matchup won't be one-to-one. While Azure Integration Services is a key platform for integration workloads, make sure that you consider all the available Azure capabilities as a whole.

| Feature or functionality | BizTalk Server | Azure |
|--------------------------|----------------|-------|
| Orchestrations | - BizTalk Server orchestration <br>- C# code (Helper class or web service) | - Azure Logic Apps workflow <br>- Azure Functions function app <br>- Azure API app |
| Pipelines | - BizTalk Server pipelines <br>- Pipeline components | - Azure Logic Apps workflows (as pipelines) <br>- Azure API Management (as pipelines) <br>- Azure Functions or Azure API app |
| Message routing | - MessageBox <br>- Property Promotions <br>- Filters | - Azure Service Bus queues and topics (message headers, message properties, and subscriptions) <br>- Azure Event Grid or Azure API Management <br>- SQL Server or Azure Cache for Redis |
| Application connectivity | - BizTalk Server out-of-the-box and custom adapters <br>- Internet Information Services (IIS) and Azure API Management (hybrid capabilities) | - Azure Logic Apps connectors <br>- Azure API Management (as connectors) <br>- Azure Functions or Azure API app |
| Cross-references | xref_ * tables on BizTalk Management database (BizTalkMgmtDb) | - Azure Functions <br>- SQL Server <br>- Custom |
| Schemas (XSD) | - BizTalk Server schemas <br>- XML, JSON, and flat file schemas | - Azure Logic Apps (Consumption) and Azure Integration Account <br>- Azure Functions and Azure Storage Account <br>- Azure Logic Apps and Azure API App <br>- Azure Logic Apps (Standard) |
| Maps | - BizTalk Mapper <br>- XSLT maps <br>- Azure API Management (hybrid capabilities) | - Azure Logic Apps (Consumption) and Azure Integration Account (XSLT maps, Liquid) <br>- Azure Functions and Azure Storage Account <br>- Azure Logic Apps and Azure API app <br>- Azure Logic Apps (Standard)
| Business rules | BizTalk Server Business Rules Engine | - Azure Functions <br>- SQL Server <br>- Custom database |
| Business activity monitoring | BizTalk Server Business Activity Monitoring | - SQL Server <br>- Azure Monitor (Application Insights) <br>- Power BI |
| EDI | - BizTalk Server out-of-the-box capabilities <br>- Parties, partners, agreements, AS2, X12, EDIFACT | Azure Logic Apps and Azure Integration Account (partners, agreements, AS2, X12, EDIFACT) |
| HL7, RosettaNet, and SWIFT | BizTalk Server accelerators for HL7, RosettaNet, and SWIFT | - Azure Logic Apps, RosettaNet and SWIFT connectors, and Azure Integration Account <br>- Azure API Management for FHIR (HL7) <br>- Azure Blueprint, which enables SWIFT CSP compliance on Azure |
| Secrets | Enterprise Single Sign-On (SSO) | - Azure Key Vault <br>- SQL Server <br>- Application configuration |
| Security and governance | - Enterprise Single Sign-On (SSO) <br>- SSO affiliate applications <br>- Active Directory <br>- Signing certificates <br>- IIS Security Authentication <br>- Network security | - Microsoft Entra ID <br>- Azure Network Security <br>- Azure role-based access control (Azure RBAC) <br>- Claims, tokens <br>- Shared Access Policies |
| Data configuration | - Config files <br>- Enterprise SSO application configuration <br>- Custom cache components <br>- Custom database <br>- Business Rules Engine <br>- Windows registry | - Azure Key Vault <br>- Azure App Configuration <br>- Azure Cosmos DB <br>- Azure Table Storage <br>- Azure Logic Apps (Standard) configuration <br>- Azure Functions configuration <br>- Azure API Management named values and backends <br>- SQL Server <br>- Custom caching <br>- Custom database |
| Deployment | - BizTalk Server binding file | - Azure DevOps pipelines <br>- Bicep scripts <br>- Terraform |
| Tracking | - BizTalk Server tracking capabilities (Receive ports, Send ports, pipelines, orchestrations) <br>- IIS tracking <br>- Azure API Management built-in analytics (hybrid capabilities) | - Azure Logic Apps run  history and tracked properties <br>- Azure Storage Account <br>- Azure Monitor (Application Insights) <br>- Azure API Management built-in analytics <br>- Custom solution, for example, Azure Event Hubs plus Azure Functions plus SQL Server plus Azure Data Explorer |
| Monitoring | - BizTalk Administration Console <br>- BizTalk Health Monitor | Azure Monitor (Application Insights, Log Analytics) |
| Operations | - BizTalk Server Administration Console <br>- Azure DevOps Pipelines <br>- MSI, PowerShell <br>- BizTalk Deployment Framework | - Azure portal <br>- Azure Monitor <br>- Azure Resource Manager templates <br>- Azure DevOps pipelines <br>- PowerShell, CLI, Bicep |

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/enterprise-integration-platform.png" alt-text="Screenshot showing matchup between components from BizTalker Server and Azure Integration Services for the Enterprise Integration Platform.":::

### Road map

To help address BizTalk customers' needs in migrating their workloads and interfaces to Azure Integration Services, Microsoft currently prioritizes the following investments:

| Timeframe | Functionality investments |
|-----------|---------------------------|
| Short term | - [XSLT + .NET Framework support (Public Preview)](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/net-framework-assembly-support-added-to-azure-logic-apps/ba-p/3669120) <br>- [SWIFT MT encoder and decoder (Public Preview)](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/announcement-public-preview-of-swift-message-processing-using/ba-p/3670014) <br>- Call custom .NET Framework code from Azure Logic Apps (Standard) |
| Medium term | - EDI and integration account enhancements <br>- Native XML support <br>- WCF and SOAP support <br>- Business Rules Engine support |
| Long term | Business event tracking |

To stay updated about the latest investments, subscribe to the [Integrations on Azure Blog - Tech Community](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/bg-p/IntegrationsonAzureBlog).

## Next steps

You've learned more about how Azure Integration Services compares to BizTalk Server. Next, learn how to choose the best Azure capabilities for your scenarios. Or, skip ahead to review suggested approaches and resources, planning considerations, and best practices for your migration.

> [!div class="nextstepaction"]
> [Choose the best Azure Integration Services offerings for your scenario](azure-integration-services-choose-capabilities.md)
>
> [Migration approaches for BizTalk Server to Azure Integration Services](biztalk-server-azure-integration-services-migration-approaches.md)
