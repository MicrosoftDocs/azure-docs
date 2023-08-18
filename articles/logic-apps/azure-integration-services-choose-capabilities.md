---
title: Choose the best Azure integration services for your scenarios
description: How to choose the best Azure Integration Services capabilities for your scenarios and requirements.
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: kewear
ms.author: kewear
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 12/15/2022
# As an Azure customer, I want to better understand which Azure Integration Services capabilities work best for my integration scenarios and requirements.
---

# Choose the best integration services in Azure for enterprise integration scenarios

Azure Integration Services offers many capabilities across this collection of integration services, but some overlapping capabilities might exist. This guide provides information to help you choose the best services for your enterprise integration scenarios and requirements. Remember also to consider the full impact of using a particular service, including performance requirements, skill set availability, operational support, and costs.

> [!NOTE]
>
> If you're a BizTalk Server customer looking to move your workloads to Azure Integration Services, 
> you can get a migration overview and compare the capabilities between these two offerings by reviewing 
> [Why migrate from BizTalk Server to Azure Integration Services?](biztalk-server-to-azure-integration-services-overview.md)

## When to choose a specific integration service and why

| Service | When to choose | Why |
|---------|----------------|-----|
| Azure Logic Apps | You have business processes to orchestrate across multiple systems where you understand their structures well. | - Provides greater developer productivity through the low-code workflow designer. <br><br>- Excels at wiring API calls together quickly using prebuilt, out-of-the-box connectors. <br><br>- Supports both synchronous and asynchronous processing. <br><br>- Offers rich debugging history for stateful workflows. <br><br>- Supports stateless workflows for low latency requirements. <br><br>- Supports creating custom APIs and custom connectors, which let you wrap existing REST APIs or SOAP APIs to access services where no prebuilt connector currently exists. (Consumption workflows only) <br><br> - Supports creating custom built-in connectors based on a service provider. (Standard workflows only) | 
| Azure Functions | You need to run complex business logic that's better implemented as code than as workflow expressions. <br><br>You need to build a centralized utility function that you can access from other integration platform components, such as Azure Logic Apps. <br><br>You have unique data transformation requirements. | Provides an event driven, compute-on-demand experience for developers that that need to extend the Azure application platform by implementing code triggered by events in Azure or other services and on-premises systems. |
| Azure Data Factory | You need the capability to transform and move large datasets across various data sources, such as file systems, database, SAP, Azure Blob Storage, Azure Data Explorer, Oracle, DB2, Amazon RDS, and more. | - Provides a cloud-based serverless ETL service for scale-out, dataset integration, and data transformation. Can handle large data and message processing requirements. <br><br>- Offers code-free UI for intuitive authoring and single-pane-of-glass monitoring and management. <br><br>- Supports lift-and-shift for existing SQL Server Integration Services (SSIS) packages to Azure and running them with full compatibility in Azure Data Factory. The SSIS Integration Runtime offers a fully managed service, so you don't have to worry about infrastructure management. |
| Azure Service Bus | You need a messaging system that supports the publish-subscribe model, ordered delivery, duplicate detection, message scheduling, and message expiration scenarios. | - Provides a fully managed enterprise message broker with message queues and publish-subscribe topics. <br><br>- By decoupling applications and services from each other, this service provides the following benefits: <br><br>--- Load balancing across competing workers <br>--- Safe message routing, data transfer, and control across service and application boundaries <br>--- Coordinated transactional work that requires a high degree of reliability. <br><br>- Complements Azure Logic Apps and supports scenarios where you want to use SDKs, not connectors, to interact with Service Bus entities. |
| Azure Event Grid | You need an event subscription architecture to stay updated on state changes in one or more applications and systems because your integration solutions depend heavily on events to communicate such changes and make any related data changes. | - Provides a highly scalable, serverless event broker for integrating applications using events. Event Grid delivers events to subscriber destinations such as applications, Azure services, or any endpoint where Event Grid has network access. Event sources can include applications, SaaS services, and Azure services. <br><br>- Increases efficiency by avoiding constant polling to determine state changes. As more underlying services emit events, subscription architecture increases in popularity. |
| Azure API Management | You want to abstract and protect your underlying service implementation in Azure Logic Apps from end users and consumers. | - Provides a hybrid, multi-cloud management platform for APIs across all environments. <br><br>- Offers the capability to reuse central services in a secure way, giving your organization more governance and control over who can call enterprise services and how to call them. You can subsequently call these APIs from Azure Logic Apps after your organization catalogs them in Azure API Management. |

## Next steps

You've now learned more about which offerings in Azure Integration Services best suit specific scenarios and needs. If you're considering moving from BizTalk Server to Azure Integration Services, learn more about migration approaches, planning considerations, and best practices to help with your migration project.

> [!div class="nextstepaction"]
>
> [Migration approaches for BizTalk Server to Azure Integration Services](biztalk-server-azure-integration-services-migration-approaches.md)
