---
title: Why Move from BizTalk Server to Azure Logic Apps?
description: Learn about the reasons for moving from BizTalk Server to Azure Logic Apps.
services: logic-apps
ms.service: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewer: estfan, azla
ms.topic: concept-article
ms.date: 02/11/2026
# Customer intent: As a BizTalk Server customer, I want to better understand why I should migrate from BizTalk Server to Azure Logic Apps in the cloud or hybrid deployment.
---

# Why migrate from BizTalk Server to Azure Logic Apps?

This guide provides an overview about the reasons and benefits, capabilities, and other information to help you start migrating from BizTalk Server to Azure Logic Apps. Following this guide, you'll find more guides that cover migration strategies, planning considerations, and best practices to help you deliver successful results.

## Reasons and benefits

By migrating your integration workloads to Azure Logic Apps, you can reap the following primary benefits:

| Benefit | Description |
|---------|-------------|
| Modern integration platform as a service (iPaaS) | Azure Logic Apps is part of Azure Integration Services, which provides capabilities that didn't exist when BizTalk Server was originally built, for example: <br><br>- The capability to create and manage REST APIs <br>- Scalable cloud infrastructure <br>- Authentication schemes that are modern, more secure, and easier to implement <br>- Simplified development tools, including many web browser-based experiences <br>- Automatic platform updates and integration with other cloud-native services <br>- Ability to run on premises (Azure Logic Apps hybrid deployment model) <br>- Ability to convert your orchestrations into Agentic business processes  |
| BizTalk Server 2020 is the final version of BizTalk Server. | For over 25 years, BizTalk Server supported mission-critical integration workloads for organizations around the world. From business process automation and B2B messaging to connectivity across industries such as financial services, healthcare, manufacturing, and government, BizTalk Server played a foundational role in enterprise integration strategies. Azure Logic Apps, part of Azure Integration Services, is the modern integration platform that carries forward what customers value in BizTalk while unlocking new innovation, scale, and intelligence.  |
| BizTalk Server features | Azure Logic Apps, the successor to BizTalk Server, includes many BizTalk Server core capabilities. For example, the Azure Logic Apps Rules Engine uses the same runtime as the BizTalk Business Rules Engine (BRE). HL7, MLLP, SWIFT, and many other technologies have a direct equivalent in Azure Logic Apps that preserve your investments in BizTalk Server, reduce refactoring, and support running custom code, .NET Framework, and native XML support. |
| Consumption-based pricing | With traditional middleware platforms, you must often make significant capital investments in procuring licenses and infrastructure, forcing you to "build for peak" and creating inefficiencies. Azure Integration Services provides multiple pricing models that generally let you pay for what you use. Although some pricing models enable and provide access to more advanced features, you have the flexibility to pay for what you consume. |
| Lower barrier to entry | BizTalk Server is a very capable middleware broker but requires significant time to learn and gain proficiency. Azure Logic Apps reduces the time required to start, learn, build, and deliver solutions. For example, [Azure Logic Apps](logic-apps-overview.md) includes a visual designer that gives you a no-code or low-code experience for building the declarative workflows that you want to replace BizTalk orchestrations. |
| SaaS connectivity | With REST APIs becoming standard for application integration, more SaaS companies have adopted this approach for exchanging data. Microsoft has built an expansive and continually growing connector ecosystem with hundreds of APIs to work with Microsoft and non-Microsoft services, systems, and protocols. In Azure Logic Apps, you can use the workflow designer to select operations from these connectors, easily create and authenticate connections, and configure the operations they want to use. This capability speeds up development and provides more consistency when authenticating access to these services using OAuth2. |
| Multiple geographical deployments | Azure currently offers [60+ announced regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/), more than any other cloud provider, so that you can easily choose the datacenters and regions that are right for you and your customers. This reach lets you deploy solutions in a consistent manner across many geographies and provides opportunities from both a scalability and redundancy perspective. |

<a name="how-does-biztalk-server-work"></a>

## How does BizTalk Server work?

BizTalk Server uses a publish-subscribe messaging engine architecture with the [MessageBox database](/biztalk/core/the-messagebox-database) at the heart. MessageBox is responsible for storing messages, message properties, subscriptions, orchestration states, tracking data, and other information.

When BizTalk Server receives a message, the server passes and processes the message through a pipeline. This step normalizes and publishes the message to MessageBox. BizTalk Server then evaluates any existing subscriptions and determines the message's intended recipient, based on the message context properties. Finally, BizTalk Server routes the message to the intended recipient, based on subscriptions or filters. This recipient is either an orchestration or a Send port, which is a destination to where BizTalk Server sends messages or source from where BizTalk Server can receive messages. BizTalk Server transmits messages through a Send port by passing them through a Send pipeline. The Send pipeline serializes the messages into the native format expected by the receiver before sending the messages through an adapter.

The MessageBox database has the following components:

- Messaging agent

  BizTalk Server interacts with MessageBox using this agent, which provides interfaces for publishing messages, subscribing to messages, retrieving messages, and more.

- One or more SQL Server databases

  These databases provide the persistence store for messages, message parts, message properties, subscriptions, orchestration state, tracking data, host queues for routing, and more.

The following image shows how the BizTalk Server Messaging Engine works:

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-server-messaging-engine.png" alt-text="Diagram shows BizTalk Server Messaging Engine." border="false":::

After a Receive port receives a message, MessageBox stores that message for processing by business processes or for routing to any Send ports that have subscriptions to specific messages.

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/biztalk-messagebox-receive-store-messages.png" alt-text="Diagram shows process for receiving and storing messages in the MessageBox database for BizTalk Server." border="false":::

For more information, see [Publish-subscribe architecture](#publish-subscribe-architecture) later in this guide.

## Azure Logic Apps: Successor to BizTalk

[Azure Logic Apps](logic-apps-overview.md) is the enterprise-grade workflow orchestration and integration platform from Microsoft. This platform is designed for deterministic, long‑running, stateful processes across cloud and hybrid environments. The key differentiator combines low‑code visual workflows with first‑class Azure platform capabilities: security, identity, networking, monitoring, and governance. Azure Logic Apps supports multiple deployment models (Consumption, Standard, Hybrid), which empower customers to run workflows fully managed in Azure or close to on‑premises systems while maintaining reliability, state management, and auditable execution. This flexibility makes the platform the natural backbone for modernizing BizTalk Server estates, orchestrating B2B/EDI integrations, and connecting SaaS, ERP, CRM, and legacy systems where durability and observability are non‑negotiable.

However, Azure Logic Apps isn't solely "low‑code". Customers routinely use pro-code extensibility alongside visual workflows: inline C#, JavaScript, and PowerShell, custom code through local functions that run in Azure Logic Apps, and custom connectors. This extensibility lets teams embed complex business logic, transformations, protocol handling, and validation directly inside orchestrations without breaking the workflow model. In real‑world scenarios, such as claims processing, onboarding, compliance pipelines, mainframe and healthcare integrations, customers rely on Azure Logic Apps to act as the controlled execution layer that blends deterministic orchestration with custom code and, increasingly, AI‑assisted decisions, while preserving governance, security, and operational confidence at scale.

In Azure Logic Apps, you can create executable business processes and applications as logic app workflows by using a "building block" way of programming with a visual designer and prebuilt operations from hundreds of connectors, requiring minimal code. A logic app workflow starts with a trigger operation followed by one or more action operations with each operation functioning as a logical step in the workflow implementation process. Your workflow can use actions to call external software, services, and systems. Some actions perform programming tasks, such as conditions, loops, data operations, variable management, and more.

Azure Logic Apps offers the following example advantages:

- Designer-first (declarative)

  Design complex processes by using easy-to-understand design tools to implement patterns and workflows that might otherwise be difficult to implement in code.

- Code-first development

  Create comprehensive code-based solutions using Visual Studio Code, allowing you to reuse existing legacy .NET Framework code and incorporate the latest .NET versions.

- Flexible and scalable

  Azure Logic Apps is a cloud-based, serverless, highly scalable, computing service that automatically scales and adapts to meet evolving business needs.

### Developer experiences

This section summarizes how development tooling changes when migrating from BizTalk Server (Visual Studio–centric) to Azure Logic Apps (Visual Studio Code–centric), and why many teams find the Azure Logic Apps workflow model faster to build and easier to maintain.

- Tooling and authoring model

  With BizTalk, day-to-day integration work happens in Visual Studio and is spread across multiple artifact types, such as schemas, maps, orchestrations, and pipelines, plus deployment packaging (MSI/bindings) to shared server environments.

  With Azure Logic Apps, many teams move to Visual Studio Code for editing workflow definitions and related files by using a simpler "workflow + connectors" approach that reduces solution complexity and encourages smaller, more incremental changes. In practice, Visual Studio Code is usually faster to install, update, and standardize across teams than maintaining BizTalk and Visual Studio version alignment. Text-based workflow definitions tend to improve Git diff and merge, code reviews, and reuse compared to large, compiled BizTalk solutions.

- What makes the move to Azure Logic Apps an improvement

  Azure Logic Apps pairs Visual Studio Code-based development with cloud-native diagnostics. You can quickly validate and update workflows, then use the workflow run history to see operation inputs and outputs without relying on server-side consoles and troubleshooting host instances. In migration projects, this benefit typically speeds up iteration (edit, deploy, update, validate), improves collaboration because workflows are easier to review and version, and supports cleaner environment separation by externalizing connections and settings, reducing the "it works on that server" configuration drift.

### Connectors

Connectors provide operations that you can use as steps in your workflows. When you build workflows with Azure Logic Apps, connectors help you work with data, events, and resources across apps, services, systems, protocols, and platforms often without writing code. You can build integration solutions for services and systems from both Microsoft and partners, including BizTalk Server, Salesforce, Office 365, IBM Mainframes, SQL databases, and many Azure services, such as Azure Functions, Azure Storage, and Azure Service Bus, plus on-premises apps, SaaS, and APIs. If no prebuilt connector exists for the resource you want to access, you can use the generic HTTP operation to communicate with the service, or you can create a custom connector.

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/azure-logic-apps-connectors-standard.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and connectors based on whether Built-in or Shared is selected.":::

Technically, a connector is a proxy or wrapper around an API that the underlying service or system uses to communicate with Azure Logic Apps. Connectors provide the connectivity capabilities in Azure Logic Apps and offer an abstraction on top of APIs that are usually owned by the underlying SaaS system. To simplify calling these APIs, connectors use metadata to describe the messaging contract so that developers know what data is expected in the request and in the response. The connector then exposes operations as triggers or actions with configurable properties. Some triggers and actions require that you first create and configure a connection to the underlying service or system and authenticate access to a user account.

Most connectors in Azure Logic Apps are either built in or managed. Some connectors are available in both versions, and availability depends on whether you create a Consumption or Standard logic app workflow. For BizTalk Server migration scenarios, Standard logic app workflows are recommended because BizTalk migration capabilities are available at the Standard level.

For many BizTalk migrations, the connectors that you select are driven by common integration requirements such as on-premises connectivity, file transfer such as SFTP, messaging systems, and line-of-business systems.

-	Built-in connectors natively run on the Azure Logic Apps runtime. Compared to managed connectors, built-in connectors usually reduce latency and avoid per-connection calls to the managed connector service, depending on the connector and scenario.

-	Managed connectors are deployed, hosted, and managed by Microsoft in Azure. These connectors provide triggers and actions for cloud services, on-premises systems, or both.

  In the designer's connector gallery, built-in connectors appear under the **Built-in** label, while managed connectors appear under the **Shared** label. For Consumption logic app workflows, managed connectors follow either the Standard or Enterprise pricing model.

-	Custom connectors let you wrap REST APIs, commonly by using an OpenAPI definition or SOAP APIs by using a WSDL, when no prebuilt connector exists. If no prebuilt connectors exist for the APIs you want to use, you can create a custom connector and access that connector from logic app workflows with the appropriate permissions.

  For REST APIs, you typically describe the API by using an OpenAPI definition. For SOAP APIs, you use a WSDL. The custom connector creates a contract between Azure Logic Apps and the API that helps you assemble request messages and receive typed responses that you can use in downstream actions. Custom connectors can reference public APIs or private APIs, including APIs on your local network.

  When you implement a custom connector, you provide a common interface for sending requests and receiving typed responses, which simplifies the development experience.

For more information, see:

- [Built-in connectors overview](../connectors/built-in.md)
- [Managed connectors overview](../connectors/managed.md)
- [Managed connectors available in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Custom connectors and APIs](/connectors/custom-connectors/)

### Data shaping and artifacts

When you migrate integrations to Azure Logic Apps, you typically need the following:

- In-workflow data shaping, for example, parsing, composing, and mapping.

- A clear strategy for storing and deploying reusable artifacts such as schemas, maps, templates, and assemblies.

The following sections summarize the main built-in options for transformations and the common places to store the supporting artifacts for Standard workflows and shared B2B scenarios.

- Data shaping in workflows: data operations, expressions, and Liquid templates

  For most JSON transformations in logic app workflows, use built-in data operations, such as the Compose and Parse JSON actions, together with expressions and workflow control actions, such as conditions and loops, to shape data. For more advanced mapping scenarios, especially where you want a reusable template for transformations like JSON-to-JSON, JSON-to-text, XML-to-JSON, or XML-to-text, you can use a Liquid template. Liquid templates describe mappings by using the open-source Liquid template language. You can version and deploy templates as artifacts alongside your workflow.

- Schema-based XML operations: Parse XML and Compose XML

  For XML creation and validation scenarios in logic app workflows, you can use built-in XML operations such as the **Compose XML with schema** and **Parse XML with schema** actions. These actions are the most useful when you need strongly typed XML handling (XSD-based), rather than treating the payload as plain text. For example, you need consistent element names, data types, and structure across multiple workflows.

- Store artifacts in Standard logic apps 

  For Standard logic app workflows, you can store integration artifacts in the logic app resource itself. In the Azure portal, you can upload maps and schemas directly to the Standard logic app resource. If you work in Visual Studio Code, you can add schemas, maps, and templates to the appropriate folders under the project’s Artifacts directory and deploy them together with the workflow. This capability makes it easier for you to keep artifacts in source control.

  Standard workflows support calling custom compiled assemblies, such as .NET Framework assemblies, from XSLT maps. This support helps you with BizTalk migration scenarios that rely on existing transformation logic.

- Store shared B2B artifacts in an integration account

  An *integration account* is an Azure resource that provides centralized access to reusable B2B and integration artifacts that multiple workflows can share. Artifacts can include trading partners, agreements, XSD schemas, XSLT maps, Liquid template-based maps, certificates, batch configurations, and .NET Framework assemblies.

  You commonly use integration accounts in B2B/EDI scenarios where you want a shared, governed artifact store separate from any single workflow. For Standard workflows, you can often avoid an integration account by packaging schemas, maps, and templates with the Standard logic app project and deploying them together. Standard workflows also support [calling .NET Framework assemblies from XSLT transformations](https://techcommunity.microsoft.com/blog/integrationsonazureblog/-net-framework-assembly-support-added-to-azure-logic-apps-standard-xslt-transfor/3669120), which can help when you port existing BizTalk maps and helper libraries. If you prefer a project-based approach, add schemas, maps, and assemblies in Visual Studio Code and then deploy to Azure.

- EDI schemas: Specialized XSD artifacts for B2B integrations

  EDI document schemas define the structure or body for an EDI transaction document type. In BizTalk migration projects, teams often start by reusing the same XSD definitions and then iteratively validate trading-partner-specific variations. For workflows in Azure Logic Apps, many BizTalk EDI schemas in the [Microsoft Integration GitHub repository](https://github.com/microsoft/Integration/tree/master/BizTalk%20Server/Schema) are publicly available for you to use. Based on your implementation approach, you can store these schemas either alongside a Standard logic app as project artifacts or centrally in an integration account for reuse across multiple workflows.

### Connectivity

The connectivity model in Azure Logic Apps differs from BizTalk Server, partially due to the evolution of the API economy. As more organizations expose access to underlying systems and data, a platform-agnostic approach was needed. REST is now the dominant architectural approach to designing modern web services.

In Azure Logic Apps, [REST](/azure/architecture/best-practices/api-design) is the default approach for connecting systems. As Microsoft and other software vendors expose RESTful services on top of their systems and data, Azure Logic Apps can expose and consume this type of information. The OpenAPI specification makes this capability possible for both humans and computers to understand the interaction between a client and server through metadata. As part of this understanding, both request and response payloads are derived, which means you can use dynamic content to populate a workflow action's inputs and use the outputs from the response in downstream actions.

Based on the software vendor who implements the underlying service that a connector calls, [authentication schemes](logic-apps-securing-a-logic-app.md) vary by connector. Generally, these schemes include the following types:

- [Basic](logic-apps-securing-a-logic-app.md#basic-authentication)
- [Client certificate](logic-apps-securing-a-logic-app.md#client-certificate-authentication)
- [Active Directory OAuth](logic-apps-securing-a-logic-app.md#oauth-microsoft-entra)
- [Raw](logic-apps-securing-a-logic-app.md#raw-authentication)
- [Managed Identity](logic-apps-securing-a-logic-app.md#managed-identity-authentication)

Microsoft provides strong layers of protection by [encrypting data during transit](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit) and at rest. When Azure customer traffic moves between datacenters, outside physical boundaries that aren't controlled by Microsoft or on behalf of Microsoft, a data-link layer encryption method that uses [IEEE 802.1AE MAC Security Standards (MACsec)](https://1.ieee802.org/security/802-1ae/) applies from point-to-point across the underlying network hardware.

Microsoft gives you the option to use [Transport Layer Security (TLS) protocol](../security/fundamentals/encryption-overview.md#tls-encryption) for protecting data that travels between cloud services and customers. Microsoft datacenters negotiate a TLS connection with client systems that connect to Azure services. TLS provides strong authentication, message privacy, and integrity, which enables detection of message tampering, interception, and forgery along with interoperability, algorithm flexibility, and ease of deployment and use.

While this section focused on RESTful connectivity through connectors, you can implement SOAP web service connectivity through the custom connector experience or by using the API Management experience, which provides great SOAP capabilities. For more information, see [Increasing business value by integrating SOAP legacy assets with Azure Logic Apps and Azure API Management](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/increasing-business-value-by-integrating-soap-legacy-assets-with/ba-p/4238077).

### Message durability

Azure Logic Apps provides message durability in the following ways:

- Stateful workflows in Standard logic apps persist workflow state and operation inputs and outputs to storage using checkpoints. This persistence provides durable execution and rich workflow run history so you can review detailed operation inputs and outputs.

- You can *resubmit* or rerun a workflow run in the Azure portal or by using APIs.

   Resubmission might cause the workflow to process the same message again, so make sure your designs assume at-least-once processing and implement *idempotency*. For example, use deduplication keys, upserts, or exactly once effects at the destination.
   
   Based on the workflow type and configuration, you can also resubmit from a specific point in the run. However, make sure your downstream systems can safely handle retries and potential duplicates.

- With [peek-lock messaging](/rest/api/servicebus/peek-lock-message-non-destructive-read) in Azure Service Bus, a receiver can process a message and then explicitly settle that message. For example, the receiver can complete the message and then remove it from the queue, or the receiver can abandon the message and make it available for redelivery.

  To use this capability in Azure Logic Apps, use the Azure Service Bus connector. Peek-lock mode improves reliability and supports retry or redelivery patterns. However, end-to-end, exactly once processing still typically requires idempotency in downstream systems.

- With RabbitMQ, you can commonly achieve durability by using durable queues or exchanges together with persistent messages and by relying on consumer acknowledgments so the system can redeliver messages if processing fails before sending an acknowledgment. When you integrate using the RabbitMQ connector, apply the same design principle as other brokers: assume retries and potential duplicates, and make downstream processing idempotent.

- With IBM MQ, you can typically address durability and reliable delivery by using persistent messages and transactional processing (units of work). You then have the capability to commit or roll back received messages and downstream work together. If a failure occurs before work is committed, or a message is acknowledged, the message can become available for redelivery.

  When you use the IBM MQ connector, design for at-least-once delivery and handle possible duplicates at the destination. In BizTalk migration scenarios, this pattern typically maps to designing the logic app workflow and downstream endpoints for safe reprocessing, for example, by using correlation identifiers, deduplication, and idempotent writes, rather than relying on the broker alone for end-to-end, exactly once behavior.

### Publish-subscribe architecture

Compared to the BizTalk Server messaging engine, Azure Logic Apps uses connectors and external messaging services to implement messaging patterns alongside workflow orchestration. For publish-subscribe (pub-sub) patterns with Azure Logic Apps, common broker options include Azure Service Bus (topics and subscriptions) and [RabbitMQ](/azure/logic-apps/connectors/built-in/reference/rabbitmq). [Azure Service Bus](../service-bus-messaging/service-bus-messaging-overview.md) is a fully managed enterprise message broker with queues and pub-sub topics that you can use to decouple applications and services, which provides the following benefits:

-	Load balance work across competing workers.
-	Safely route and transfer data with control across service and application boundaries.
-	Coordinate transactional work that requires a high degree of reliability.

Azure Logic Apps includes an [Azure Service Bus connector](/connectors/servicebus/) that you can use to publish and subscribe to messages. The benefit is that you can use messaging independently from your workflow. Unlike BizTalk Server, messaging is decoupled from the workflow engine. You can create message subscriptions in Azure Service Bus and use [message properties (user properties)](/rest/api/servicebus/message-headers-and-properties#message-properties) as key-value pairs that are evaluated by filters on a [topic subscription](../service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md). You define these user properties when you set up an Azure Service Bus operation by adding one or more key-value pairs. For a demonstration, see the video: [Pub Sub Messaging using Azure Integration Services - Part 2 Content Based Routing](https://youtu.be/1ZMJhWGDVro).

Azure Logic Apps with Standard workflows also includes a RabbitMQ built-in connector that you can use to send and receive messages. In RabbitMQ, you commonly implement the pub-sub pattern by publishing to an exchange and have multiple consumers receive messages through separate queues bound to that exchange, often by using routing keys or header-based routing, based on the exchange type. This approach supports fan-out and routing-based distribution patterns similar in intent to Service Bus topics and subscription rules, but configured using RabbitMQ exchanges, bindings, and queue settings. RabbitMQ is often a strong option when you have an existing on-premises RabbitMQ estate, need broker capabilities in environments where Azure Service Bus isn't available, or want to keep messaging local to the network where producers and consumers run. As with any broker-based integration, design for retries and potential duplicates, for example, by using acknowledgments, durable queues, and persistent messages where appropriate, and make downstream processing idempotent.

For many BizTalk migration projects, Azure Service Bus is the common default choice for cloud-native pub-sub because the service is fully managed and provides built-in topic and subscription semantics with filtering. For on-premises pub-sub requirements, RabbitMQ can be a better fit, especially with the Azure Logic Apps hybrid deployment model, because Azure Service Bus is a cloud service and doesn't have an on-premises deployment option. In these cases, standardize on durability and retry semantics and apply idempotency at the workflow and endpoint boundaries.

### Business rules engine

Azure Logic Apps includes the [Azure Logic Apps Rules Engine](rules-engine/rules-engine-overview.md). This rules engine includes the BizTalk Business Rules Engine (BRE) runtime so you can use reuse existing BizTalk BRE policies. Currently, support exists only for XML and .NET Framework facts.

### Networking

For inbound and outbound connectivity, Azure provides multiple ways to isolate their services within a network boundary and connect on-premises and cloud workloads. The following list describes different ways that you can integrate Azure resources with resources inside a network perimeter:

- Hybrid Connections

  Both an Azure service and a feature in Azure App Service, Hybrid Connections supports scenarios and offers capabilities beyond those in Azure App Service. For more information about usage outside Azure App Service, see [Azure Relay Hybrid Connections](../azure-relay/relay-hybrid-connections-protocol.md). In Azure App Service, you can use Hybrid Connections to access application resources in any network that can make outbound calls to Azure over port 443. Hybrid Connections provide access from your app to a TCP endpoint and doesn't enable a new way to access your app. In Azure App Service, each hybrid connection correlates to a single TCP host and port combination. This functionality enables your apps to access resources on any OS, provided that a TCP endpoint exists. Hybrid Connections doesn't know or care about the application protocol or what you want to access. This feature simply provides network access.

- Virtual network integration

  With [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) integration, you can connect your Azure resource to a virtual network configured in Azure, giving your app access to resources in that virtual network. Virtual network integration in Azure Logic Apps is used only to make outbound calls from your Azure resource to your virtual network.

  With [virtual network peering](../virtual-network/virtual-network-peering-overview.md), you can connect your on-premises networks to Azure, which provides bi-directional connectivity between on-premises resources and Azure services. Azure Integration Services provides virtual network connectivity, allowing for hybrid integration.
  
  The following image shows a Standard logic app resource with the Networking page open and virtual network integration enabled as highlighted in the **Outbound Traffic** box. This configuration makes sure that all outbound traffic leaves from this virtual network.

  :::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/standard-logic-app-networking-page-virtual-network-integration.png" alt-text="Screenshot shows Azure portal, Standard logic app resource, and Networking page with virtual network integration enabled.":::

- Private endpoints

  A [private endpoint](../private-link/private-endpoint-overview.md) is a network interface that uses a private IP address from your virtual network. This network interface privately and securely connects to an Azure resource that's powered by [Azure Private Link](../private-link/private-link-overview.md). By enabling a private endpoint, you bring that Azure resource into your virtual network and allow resources in the network to make inbound calls to your Azure resource.

### Custom code

In Azure Logic Apps, you can author and run .NET code in your Standard logic app workflow. For this, you need to use [Visual Studio Code with the Azure Logic Apps (Standard) extension](create-run-custom-code-functions.md).

The **Inline Code Operations** connector provides the actions named **Execute JavaScript Code**, **Execute CSharp Script Code**, and **Execute PowerShell Code**. You can use these actions to add code, which supports dynamic content inputs and outputs. The Azure Logic Apps engine expects this code to have short execution times. After the code completes execution, the output is available for downstream actions to use in the workflow.

As previously mentioned, support for calling .NET Framework assemblies from an XSLT map is currently available in logic app workflows when you upload those assemblies to an integration account. This capability helps support custom data transformation rules. For Standard logic app workflows, you can call .NET Framework code from XSLT maps without an integration account. You can also add assemblies and maps to a Standard logic app project in Visual Studio Code and subsequently deploy to Azure. For more information, see [.NET Framework assembly support added to Azure Logic Apps (Standard) XSLT transformations](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/net-framework-assembly-support-added-to-azure-logic-apps/ba-p/3669120).

### Application groups

In Azure Logic Apps, you can include and run multiple workflows in a Standard logic app resource, resulting in a 1-to-many relationship. If you're working locally on a Standard logic app project in Visual Studio Code, your logic app resource maps to this single project. With this approach, you can easily and logically group related workloads, code, and artifacts in the same project and deploy that project as a single unit.

Cloud architectures work differently than server-based paradigms such as BizTalk. Azure Logic Apps (Standard) uses a pull model to bring in code and artifacts. As a result, you'll copy any additional necessary artifacts into your project and subsequently deploy them with your code and other artifacts. In some cases, you might want to avoid having to copy the necessary code and artifacts. If so, you might consider turning this functionality into a service that you can manage separately but can call from a workflow.

For example, suppose you have a data transformation that's widely used by your organization. Rather than including the map for the transformation across multiple logic app projects, you can implement an interface that provides the transformation as a service. You can then manage the lifecycle for that service separately from your logic app projects and call that service from your workflows.

With the ability to include multiple workflows in a Standard logic app project, you might ask how you'd organize those workflows within a project or across multiple projects? The answer usually depends on your requirements, for example:

- Business process affinity
- End to end monitoring and support
- Security, role-based access control, and network isolation
- Performance and business criticality
- Geo-location and geo-redundancy

For more information, see [Organizing logic app workflows in Azure Logic Apps (Standard)](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/organizing-logic-apps-workflows-with-logic-apps-standard/ba-p/3251179).

### Security and governance

Azure Logic Apps supports the following security capabilities:

- Azure Key Vault

  You can store credentials, secrets, API keys, and certificates using [Azure Key Vault](/azure/key-vault/general/basic-concepts). In Azure Logic Apps, you can access this information by using the [Azure Key Vault connector](/connectors/keyvault/) and exclude this information from the platform's logs and run history by using the [secure inputs and outputs functionality](logic-apps-securing-a-logic-app.md#obfuscate).

  Later in the [Tracking](#tracking) section, this guide describes the run history functionality, which provides a step-by-step replay of a workflow's execution. Although Azure Logic Apps offers the value proposition of capturing every input and output in a workflow run, sometimes you need to manage access to sensitive data more granularly. You can set up obfuscation for this data by using the secure inputs and outputs capability on triggers and actions to hide such content from run history and prevent sending this data to Azure Monitor, specifically Log Analytics and Application Insights. The following image shows an example result from enabling secure inputs and secure outputs in run history.

  :::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/azure-logic-apps-secure-inputs-outputs.png" alt-text="Screenshot shows hidden inputs and outputs in workflow run history after you enable secure inputs and outputs.":::

- OAuth-based integration

  Most connectors use this authentication type when creating connections. This approach makes integrating with many SaaS services as easy as providing your email address and password. Azure API Management also supports OAuth, so you can use both services together by providing a unified authentication scheme.

  This capability isn't natively available in BizTalk Server.

- Managed identities

  Azure Logic Apps (Standard) can authenticate access to storage accounts by using a [managed identity](../active-directory/managed-identities-azure-resources/overview.md). Also, some connectors support using managed identities for authenticating access to resources protected by Microsoft Entra ID. When you use a managed identity to authenticate your connection, you don't have to provide credentials, secrets, or Microsoft Entra tokens.

### Application management and access management

The [Azure portal](/azure/azure-portal/azure-portal-overview) is a common tool that administrators and support personnel use to view and monitor the health of interfaces. For Azure Logic Apps, this experience includes rich transaction traces that are available through run history. Granular [role-based access controls (RBAC)](../role-based-access-control/overview.md) are also available so you can manage and restrict access to Azure resources at various levels.

### Storage

Azure Logic Apps relies on [Azure Storage](../storage/common/storage-introduction.md) to store and automatically [encrypt data at rest](logic-apps-securing-a-logic-app.md). This encryption protects your data and helps you meet your organizational security and compliance commitments. By default, Azure Storage uses Microsoft-managed keys to encrypt your data. For more information, see [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md).

When you work with Azure Storage in the Azure portal, [all transactions take place over HTTPS](../security/fundamentals/encryption-overview.md#azure-storage-transactions). You can also work with Azure Storage by using the Storage REST API over HTTPS. To enforce using HTTPS when you call the REST APIs to access objects in storage accounts, enable the secure transfer that's required for the storage account.

The Azure Logic Apps (Standard) hybrid deployment model relies on SQL Server. This dependency lets you use existing on-premises SQL Server environments with BizTalk Server.

### Large file processing

Some foundational differences exist between processing large files with BizTalk Server versus Azure Logic Apps. For example, carefully scrutinize large message scenarios to find the right solution because potentially different ways exist to solve this problem in a modern cloud environment.

#### File size limits

In Azure, file size limits exist to ensure consistent and reliable experiences. To validate your scenario, make sure to review the [service limits documentation for Azure Logic Apps](logic-apps-limits-and-config.md#messages). Some connectors support [message chunking](logic-apps-handle-large-messages.md) for messages that exceed the default message size limit, which varies based on the connector. Message chunking works by splitting a large message into smaller messages.

Azure Logic Apps isn't the only service that has message size limits. For example, Azure Service Bus also has [such limits](../service-bus-messaging/service-bus-premium-messaging.md). For more information about handling large messages in Azure Service Bus, see [Large messages support](../service-bus-messaging/service-bus-premium-messaging.md#large-messages-support).

To avoid file size limitations, you can implement the [claim-check pattern](/azure/architecture/patterns/claim-check), which works by splitting a large message into a *claim check* and a payload. You send the claim check to the messaging platform and store the payload on an external service. That way, you can process large messages, while you protect the message bus and the client from overload. This pattern also helps to reduce costs because storage is usually cheaper than resource units used by the messaging platform.

### Monitoring and alerts

In Azure Logic Apps, you can enable Application Insights support, which provides curated visualizations as a foundation for monitoring Azure services. These visualizations help you more effectively monitor Standard workflows by using dashboards specifically designed for Azure Logic Apps (Standard). The dashboard scope covers the workflows inside a Standard logic app. The dashboard is built on [Azure Workbooks](/azure/azure-monitor/visualize/workbooks-overview) and offers various visualizations. You can easily extend and customize these workbooks to meet specific needs.

[Serverless 360](https://www.serverless360.com/) is an external solution from [Kovai](https://www.kovai.co/) that provides monitoring and management through mapping Azure services, such as Azure Logic Apps, Azure Service Bus, Azure API Management, and Azure Functions. You can reprocess messages by using dead letter queues in Azure Service Bus, enable self-healing to address intermittent service disruptions, and set up proactive monitoring through synthetic transactions.

You can configure custom monitoring rules and view logs in a portal experience. You can send notifications through various channels, such as email, Microsoft Teams, and ServiceNow. To visually determine the health of your interfaces, service maps are available.

### Business activity monitoring

As a developer or business analyst working on solutions that integrate services and systems using various Azure resources, you might have difficulties visualizing the relationship between the technical components in your solution and your business scenario. To include business context about the Azure resources in your solution, you can build business processes that visually represent the business logic implemented by these resources. In [Azure Business Process Tracking](/azure/business-process-tracking/overview), a business process is a series of stages that represent the tasks flowing through real-world business scenario.

Another option is that you can use an external solution from [Kovai](https://www.kovai.co/) called [Serverless 360](https://www.serverless360.com/). Along with the monitoring platform, you can use the [business activity monitoring feature](https://www.serverless360.com/business-activity-monitoring) that provides end-to-end tracking for business process flows across cloud-native and hybrid integrations. This feature includes a managed connector that developers can use to instrument code and capture important business data. Administrators can subsequently build dashboards and share them with business analysts.

### Tracking

Azure Logic Apps provides rich workflow run history so that developers and support analysts can review action-by-action telemetry, including all processed inputs and outputs. To help protect any sensitive data, you can [enable secure inputs and outputs](logic-apps-securing-a-logic-app.md?tabs=azure-portal#obfuscate) on individual actions in workflows. This capability obfuscates or hides the data in logs and workflow run histories to avoid leaks.

Beyond data obfuscation, you can use [Azure RBAC](../role-based-access-control/overview.md) rules to protect data access. Azure RBAC includes [specific built-in roles for Azure Logic Apps (Standard)](logic-apps-securing-a-logic-app.md?tabs=azure-portal#standard-workflows). Beyond Azure RBAC, you can [restrict access to run history in Azure Logic Apps by IP address range](logic-apps-securing-a-logic-app.md#restrict-ip).

### Hosting

- Hosting plans

  In single-tenant Azure Logic Apps, you can use a single Workflow Service plan to host multiple Standard logic apps. This means you don't have to deploy all your workflows in a single Standard logic app resource. Instead, you can organize these workflows into logical groups (logic apps) to help you better manage other aspects of your solution. This approach helps you get the most out of your Workflow Service plan and future-proof your applications, which you can implement so that they can individually scale.

  A Standard logic app has the following pricing tiers: WS1, WS2 and WS3. Functionally, each tier provides the same capabilities. Your requirements for compute and memory determine what's best for your scenario, for example:

  | Pricing tier | Virtual CPU (vCPU) | Memory (GB) |
  |--------------|--------------------|-------------|
  | WS1 | 1 | 3.5 |
  | WS2 | 2 | 7 |
  | WS3 | 4 | 14 |

  For more information, see [Pricing tiers in the Standard model](logic-apps-pricing.md#standard-pricing-tiers).

- Hybrid deployment model

  Azure Logic Apps offers a hybrid deployment model so that you can deploy and host Standard logic app workflows in on-premises, private cloud, or public cloud scenarios. This model gives you the capabilities to host integration solutions in partially connected environments when you need to use local processing, data storage, and network access. With the hybrid option, you have the freedom and flexibility to choose the best environment for your workflows. For more information, see [Set up your own infrastructure for Standard logic apps using hybrid deployment](set-up-standard-workflows-hybrid-deployment-requirements.md).
  
- Availability and redundancy

  In Azure, [availability zones](/azure/reliability/availability-zones-overview#zonal-and-zone-redundant-services) provide resiliency, distributed availability, and active-active-active zone scalability. To increase availability for your logic app workloads, you can [enable availability zone support](set-up-zone-redundancy-availability-zones.md), but only when you create your logic app. You'll need at least three separate availability zones in any Azure region that supports and enables zone redundancy. The Azure Logic Apps platform distributes these zones and logic app workloads across these zones. This capability is a key requirement for enabling resilient architectures and providing high availability if datacenter failures happen in a region. For more information, see [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).

- Isolated and dedicated environment

  For Standard logic apps, you have the option to select an App Service Environment (ASE) v3 for your deployment environment. With an ASE v3, you get a fully isolated and dedicated environment to run applications at high scale with predictable pricing. You pay only for the [ASE App Service plan](single-tenant-overview-compare.md), no matter how many logic apps that you create and run.

For scenarios that require additional Azure integration services, see the following documentation:

- [Azure Service Bus Premium and Standard messaging tiers](../service-bus-messaging/service-bus-premium-messaging.md)
- [Azure API Management - Feature-based tier comparison](../api-management/api-management-features.md)

### Deployment

Azure Logic Apps supports Infrastructure as Code (IaC) by providing the capability to create infrastructure resources using Azure Resource Management templates. Although ARM templates can seem complex to understand and implement as a unified solution, you can use abstraction tools, such as Bicep, Terraform, or Pulumi, which provide a code-like experience for creating your infrastructure definition. Although these tools provide abstraction layers over ARM templates, the tools ultimately generate ARM templates and can deploy those templates for you.

With your infrastructure in place, you can deploy the logic that implements your end-to-end workflows. As Azure Integration Services offers a collection of tools for you to implement your integration workflows, you must deploy each component. For solutions built with Azure Integration Services, CI/CD pipelines are usually based on deploying an orchestration of components. DevOps engineers can use built-in actions that abstract deployment activities, or they use generic actions that run either CLI commands or automation scripts such as PowerShell and Bash. In most cases, engineers customize pipelines based on the application's needs, review guidance from official documentation, and use sample repositories as a starting point.

The process to get each component ready for deployment usually takes the following steps under consideration:

- Continuous integration phase

  1. Get the source code's latest version.

  1. Prepare the code with the environment-specific configuration.
  
     The details for this step depend on each technology's support for external injection of environment variables. The basic premise is that environment-based configuration information, such as connection strings and references to external resources, are abstracted to reference an application settings repository. So, in this scenario, you'd store references that can exist as clear text directly in the application settings repository, but you'd store sensitive values, such as secrets, as reference pointers to entries in a secrets store, such as an Azure key vault.

     Azure Logic Apps makes this approach possible for a Standard logic app resource by supporting references to the application settings repository, which you can then map name-value pairs to entries in your key vault.
     
  1. Package the code for deployment in various environments.

- Continuous deployment phase

  1. Deploy packaged code in the destination environment.

  1. Update the application settings repository with the correct environment values, either as clear text or references to entries in your key vault.

  1. Update any required permissions that depend on code.

  1. Get your application ready for execution, if required.

## Feature matchup

The following table and diagram shows how resources, artifacts, features, and capabilities compare and match between BizTalk Server, Azure Logic Apps (Standard), and other services. Try to use Azure Logic Apps features as much as possible to build a cohesive, more cost-effective solution.

### Azure Logic Apps Standard (Cloud)

| Feature or functionality | BizTalk Server | Azure Logic Apps (Cloud) |
|--------------------------|----------------|--------------------------|
| Orchestrations | - BizTalk Server orchestration <br>- C# code | - Azure Logic Apps workflow <br>- Azure Logic Apps workflow templates <br>- Local functions |
| Pipelines | - BizTalk Server pipelines <br>- Pipeline components | - Azure Logic Apps workflows as pipelines <br>- Local functions |
| Message routing | - MessageBox <br>- Property Promotions <br>- Filters | - Azure Service Bus queues and topics (message headers, message properties, and subscriptions) <br>- RabbitMQ Exchanges |
| Application connectivity | - BizTalk Server out-of-the-box and custom adapters <br>- Internet Information Services (IIS) and Azure API Management (hybrid capabilities) | - Azure Logic Apps connectors |
| Cross-references | xref_ * tables on BizTalk Management database (BizTalkMgmtDb) | - Local functions |
| Schemas (XSD) | - BizTalk Server schemas <br>- XML, JSON, and flat file schemas | - Azure Logic Apps (Standard) <br>- Azure integration account <br>- Azure storage account |
| Maps | - BizTalk Mapper <br>- XSLT maps <br>- Azure API Management (hybrid capabilities) | - Azure Logic Apps (Standard) - XSLT maps, Liquid templates <br>- Azure integration account (XSLT maps, Liquid templates) <br>- Azure storage account <br>- Data Mapper tool (Azure Logic Apps Standard extension for Visual Studio Code) |
| Business rules | BizTalk Server Business Rules Engine | Azure Logic Apps Rules Engine |
| Business activity monitoring | BizTalk Server Business Activity Monitoring | Azure Business Process Tracking |
| EDI | - BizTalk Server out-of-the-box capabilities <br>- Parties, partners, agreements, AS2, X12, EDIFACT | Azure Logic Apps and Azure integration account (partners, agreements, AS2, X12, EDIFACT) |
| HL7, RosettaNet, and SWIFT | BizTalk Server accelerators for HL7, RosettaNet, and SWIFT | - Azure Logic Apps: Azure integration account and HL7, MLLP, RosettaNet, and SWIFT connectors |
| Secrets | Enterprise single sign-on (SSO) | - Azure Key Vault <br>- SQL Server <br>- Application configuration |
| Security and governance | - Enterprise single sign-on (SSO) <br>- SSO affiliate applications <br>- Active Directory <br>- Signing certificates <br>- IIS Security Authentication <br>- Network security | - Microsoft Entra ID <br>- Azure Network Security <br>- Azure role-based access control (Azure RBAC) <br>- Claims, tokens <br>- Shared Access Policies |
| Data configuration | - Config files <br>- Enterprise SSO application configuration <br>- Custom cache components <br>- Custom database <br>- Windows registry | - Azure Key Vault <br>- Azure App Configuration <br>- Azure Cosmos DB <br>- Azure Table Storage <br>- Azure Logic Apps (Standard) configuration <br>- SQL Server <br>- Custom caching <br>- Custom database |
| Deployment | - BizTalk Server binding file | - Azure Pipelines <br>- Bicep scripts <br>- Terraform |
| Tracking | - BizTalk Server tracking capabilities (Receive ports, Send ports, pipelines, orchestrations) <br>- IIS tracking <br>- Azure API Management built-in analytics (hybrid capabilities) | - Azure Logic Apps workflow run history and tracked properties <br>- Azure Storage Account <br>- Azure Monitor (Application Insights) |
| Monitoring | - BizTalk Administration Console <br>- BizTalk Health Monitor | Azure Monitor (Application Insights, Log Analytics) |
| Operations | - BizTalk Server Administration Console <br>- Azure Pipelines <br>- MSI, PowerShell <br>- BizTalk Deployment Framework | - Azure portal <br>- Azure Monitor <br>- Azure Resource Manager templates <br>- Azure Pipelines <br>- PowerShell, CLI, Bicep |

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/enterprise-integration-platform.png" alt-text="Diagram shows matchup between components from BizTalk Server and Azure Logic Apps for the enterprise integration platform." border="false":::

### Azure Logic Apps Standard Hybrid (On-premises)

| Feature or functionality | BizTalk Server | Azure Logic Apps (Hybrid) |
|--------------------------|----------------|--------------------------|
| Orchestrations | - BizTalk Server orchestration <br>- C# code | - Azure Logic Apps workflow <br>- Azure Logic Apps workflow templates <br>- Local Functions |
| Pipelines | - BizTalk Server pipelines <br>- Pipeline components | - Azure Logic Apps workflows (as pipelines) <br>- Local functions|
| Message routing | - MessageBox <br>- Property Promotions <br>- Filters | <br>- RabbitMQ Exchanges |
| Application connectivity | - BizTalk Server out-of-the-box and custom adapters <br>- Internet Information Services (IIS) and Azure API Management (hybrid capabilities) | - Azure Logic Apps connectors |
| Cross-references | xref_ * tables on BizTalk Management database (BizTalkMgmtDb) | - Local functions |
| Schemas (XSD) | - BizTalk Server schemas <br>- XML, JSON, and flat file schemas | - Azure Logic Apps (Standard) <br>- Azure integration account <br>- Azure storage account |
| Maps | - BizTalk Mapper <br>- XSLT maps <br>- Azure API Management (hybrid capabilities) | - Azure Logic Apps (Standard) - XSLT maps, Liquid templates <br>- Azure integration account (XSLT maps, Liquid templates)  <br>- Data Mapper tool (Azure Logic Apps Standard extension for Visual Studio Code) |
| Business rules | BizTalk Server Business Rules Engine | Azure Logic Apps Rules Engine |
| Business activity monitoring | BizTalk Server Business Activity Monitoring | Azure Business Process Tracking |
| EDI | - BizTalk Server out-of-the-box capabilities <br>- Parties, partners, agreements, AS2, X12, EDIFACT | Azure Logic Apps and Azure integration account (partners, agreements, AS2, X12, EDIFACT) |
| HL7, RosettaNet, and SWIFT | BizTalk Server accelerators for HL7, RosettaNet, and SWIFT | - Azure Logic Apps: Azure integration account, HL7, MLLP, RosettaNet, and SWIFT connectors |
| Secrets | Enterprise single sign-on (SSO) | - Azure Key Vault <br>- SQL Server <br>- Application configuration |
| Security and governance | - Enterprise single sign-on (SSO) <br>- SSO affiliate applications <br>- Active Directory <br>- Signing certificates <br>- IIS Security Authentication <br>- Network security | - Microsoft Entra ID <br>- Azure Network Security <br>- Azure role-based access control (Azure RBAC) <br>- Claims, tokens <br>- Shared Access Policies |
| Data configuration | - Config files <br>- Enterprise SSO application configuration <br>- Custom cache components <br>- Custom database <br>- Windows registry | - Azure Key Vault <br>- Azure App Configuration <br>- Azure Cosmos DB <br>- Kubernetes Config maps <br>- Azure Logic Apps (Standard) configuration <br>- SQL Server <br>- Custom caching <br>- Custom database |
| Deployment | - BizTalk Server binding file | - Azure Pipelines <br>- Bicep scripts <br>- Terraform |
| Tracking | - BizTalk Server tracking capabilities (Receive ports, Send ports, pipelines, orchestrations) <br>- IIS tracking <br>- Azure API Management built-in analytics (hybrid capabilities) | - Azure Logic Apps workflow run history and tracked properties <br>- Azure Storage Account <br>- Azure Monitor (Application Insights) |
| Monitoring | - BizTalk Administration Console <br>- BizTalk Health Monitor | OpenTelemetry |
| Operations | - BizTalk Server Administration Console <br>- Azure Pipelines <br>- MSI, PowerShell <br>- BizTalk Deployment Framework | - Azure portal <br>- OpenTelemetry <br>- Azure Resource Manager templates <br>- Azure Pipelines <br>- PowerShell, CLI, Bicep |

:::image type="content" source="./media/biztalk-server-to-azure-integration-services-overview/enterprise-integration-platform-hybrid.png" alt-text="Diagram shows matchup between components from BizTalk Server and Azure Logic Apps with hybrid deployment model for the enterprise integration platform." border="false":::

To stay updated about the latest investments, subscribe to the [Integrations on Azure Blog - Tech Community](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/bg-p/IntegrationsonAzureBlog).

## Next steps

You learned more about how Azure Logic Apps compares with BizTalk Server. Next, review suggested approaches and resources, planning considerations, and best practices for your migration.

> [!div class="nextstepaction"]
>
> [Migration approaches for BizTalk Server to Azure Logic Apps](biztalk-server-migration-approaches.md)
