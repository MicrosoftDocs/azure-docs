---
title: Azure Integration Services reference architecture
description: Reference Architecture showing how to implement an enterprise integration pattern with Logic Apps, API Management, Service Bus and  Event Grid 
author: mattfarm
manager: jonfan
editor: 
services: logic-apps api-management
documentationcenter: 

ms.assetid: 
ms.service: logic-apps
ms.workload: logic-apps
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 06/15/2018
ms.author: LADocs; estfan
---

# Enterprise integration with queues and events: Reference architecture

## Overview

This reference architecture shows a set of proven practices for an integration application that uses Azure Integration Services. This architecture can serve as this basis of many different application patterns requiring HTTP APIs, workflow and orchestration.

*There are many possible applications of integration technology, from a simple point-to point application to a full enterprise service bus. This architecture series sets out the reusable component parts which may apply for building a generic integration application – architects should consider which specific components they will need to implement for their applications and infrastructure.*

![Architecture diagram - enterprise integration with queues & events](media/logic-apps-architectures-enterprise-integration-with-queues-events/integr_queues_events_arch_diagram.png)

## Architecture

This architecture **builds on** the [simple enterprise integration](logic-apps-architectures-simple-enterprise-integration.md) architecture. **The [simple enterprise architecture recommendations](logic-apps-architectures-simple-enterprise-integration#recommendations) also apply here**, but have been omitted from the [recommendations](#recommendations) in this document for brevity. It has the following components:

- Resource group. A [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) is a logical container for Azure resources.
- Azure API Management. [Azure API Management](https://docs.microsoft.com/azure/api-management/) is a fully managed platform for publishing, securing and transforming HTTP APIs.
- Azure API Management Developer Portal. Each instance of Azure API Management comes with a [Developer Portal](https://docs.microsoft.com/azure/api-management/api-management-customize-styles), giving access to documentation, code samples and the ability to test an API.
- Azure Logic Apps. [Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview) is a serverless platform for building enterprise workflow and integration.
- Connectors. [Connectors](https://docs.microsoft.com/azure/connectors/apis-list) are used by Logic Apps to connect to commonly used services. Logic Apps already has hundreds of different connectors, but they can also be created using a custom connector.
- Azure Service Bus. [Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview) provides secure and reliable messaging. Messaging can be used to de-couple applications from one another and integrate with other message-based systems.
- Azure Event Grid. [Event Grid](https://docs.microsoft.com/azure/event-grid/overview) is a serverless platform for publishing and delivering application events.
- IP address. The Azure API Management service has a fixed public [IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm) and a domain name. The domain name is a subdomain of azure-api.net, such as contoso.azure-api.net. Logic Apps and Service Bus also have a public IP address; however, in this architecture we restrict access to call Logic apps endpoints to only the IP Address of API Management (for security). Calls to Service Bus are secured by a shared access signature.
- Azure DNS. [Azure DNS](https://docs.microsoft.com/azure/dns/) is a hosting service for DNS domains, providing name resolution using Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records using the same credentials, APIs, tools, and billing as your other Azure services. To use a custom domain name (such as contoso.com) create DNS records that map the custom domain name to the IP address. For more information, see Configure a custom domain name in Azure API Management.
- Azure Active Directory (Azure AD). Use [Azure AD](https://docs.microsoft.com/azure/active-directory/) or another identity provider for authentication. Azure AD provides authentication to access API endpoints (by passing a [JSON Web Token for API Management](https://docs.microsoft.com/azure/api-management/policies/authorize-request-based-on-jwt-claims) to validate) and can secure access to the API Management Developer Portal (Standard & Premium tiers only).

This architecture has some fundamental patterns to its operation:

1. Existing backend HTTP APIs are published through the API Management Developer Portal, allowing developers (either internal to your organization, external or both) to integrate calls to these APIs into applications.
2. Composite APIs are built using Logic Apps; orchestrating calls to SAAS systems, Azure services and any APIs published to API Management. The [Logic Apps are also published](https://docs.microsoft.com/azure/api-management/import-logic-app-as-api) through the API Management Developer Portal.
3. Applications [acquire an OAuth 2.0 security token](https://docs.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad) necessary for gaining access to an API using Azure Active Directory.
4. Azure API Management [validates the security token](https://docs.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad), and passes the request to the backend API/Logic App.
5. Service Bus queues are used to [decouple](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-messaging-overview) application activity and [smooth spikes in load](https://docs.microsoft.com/azure/architecture/patterns/queue-based-load-leveling). Messages are added to queues by Logic Apps, 3rd party applications, or (not pictured) by publishing the queue as an HTTP API through API Management.
6. When messages are added to a Service Bus queue, an Event fires. A Logic App is triggered by this event and processes the message.
7. Similarly, other Azure services (e.g. Blob Storage, Event Hub) also publish events to Event Grid. These trigger Logic Apps to receive the event and perform subsequent actions.

## Recommendations

Your specific requirements might differ from the generic architecture described here. Use the recommendations in this section as a starting point.

### Service Bus tier

Use Service Bus premium tier as this supports event grid notifications currently (support across all tiers is expected). See [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).

### Event Grid pricing

Event Grid works using a serverless model – billing is calculated based on number of operations (event execution). See [Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/) for more information. There are currently no tier considerations for Event Grid.

### Use PeekLock when consuming Service Bus messages

When creating Logic Apps to consume Service Bus messages, use [PeekLock](../service-bus-messaging/service-bus-fundamentals-hybrid-solutions.md#queues) within the Logic App to access a group of messages. The Logic App can then perform steps to validate each message before completing or abandoning. This approach protects against accidental message loss.

### Check for multiple objects when an Event Grid trigger fires

Event Grid triggers firing simply means that “at least 1 of these things happened”. For example, when Event Grid triggers a logic app on a message appearing in a Service Bus queue, the logic app should always assume there may be one or more messages available to process.

### Region

Provision API Management, Logic Apps and Service Bus in the same region to minimize network latency. Generally, choose the region closest to your users.

The resource group also has a region, which specifies where deployment metadata is stored, and where the deployment template is executed from. Put the resource group and its resources in the same region. This can improve availability during deployment.

## Scalability considerations

Azure Service Bus premium tier can scale-out the number of messaging units to achieve higher scalability. Premium can have 1, 2, or 4 messaging units. For further guidance on scaling Azure Service Bus, see [Best Practices for performance improvements using Service Bus Messaging](../service-bus-messaging/service-bus-performance-improvements.md).

## Availability considerations

At the time of writing, the service level agreement (SLA) for Azure API Management is 99.9% for Basic, Standard, and Premium tiers. Premium tier configurations with deployment of at least one unit in two or more regions have an SLA of 99.95%.

At the time of writing, the service level agreement (SLA) for Azure Logic Apps is 99.9%.

### Disaster recovery

Consider implementing Geo-disaster recovery in Service Bus premium to enable failover in the event of a serious outage. Read more about [Azure Service Bus Geo-disaster recovery](../service-bus-messaging/service-bus-geo-dr.md).

## Manageability considerations

Create separate resource groups for production, development, and test environments. This makes it easier to manage deployments, delete test deployments, and assign access rights.
When assigning resources to resource groups, consider the following:

- Lifecycle. In general, put resources with the same lifecycle into the same resource group.
- Access. You can use [Role-Based Access Control](../role-based-access-control/overview.md) (RBAC) to apply access policies to the resources in a group.
- Billing. You can view the rolled-up costs for the resource group.
- Pricing tier for API Management – we recommend using Developer Tier for development and test environments. For pre-production, we recommend deploying a replica of your production environment, running tests, and then shutting down to minimize cost.

For more information, see [resource group](../azure-resource-manager/resource-group-overview.md) overview.

### Deployment

We recommend that you use [Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md) to deploy Azure API Management, Logic Apps, Event Grid and Service Bus. Templates make it easier to automate deployments via PowerShell or the Azure command-line interface (CLI).

We recommend putting Azure API Management, any individual Logic Apps, Event Grid topics and Service Bus Namespaces in their own separate Resource Manager templates. This will allow storing them in source control systems. These templates can then be deployed together or individually as part of a continuous integration/continuous (CI/CD) deployment process.

### Diagnostics and monitoring

Service Bus, like API Management and Logic Apps can be monitored using Azure Monitor. Azure Monitor is enabled by default and will provide information based on the different metrics configured for each service.

## Security considerations

Secure Service Bus using a Shared Access Signature. [SAS authentication](../service-bus-messaging/service-bus-sas.md) enables you to grant a user access to Service Bus resources, with specific rights. Read more about [Service Bus authentication and authorization](../service-bus-messaging/service-bus-authentication-and-authorization.md).

Additionally, should a Service Bus queue need to be exposed as an HTTP endpoint (to allow posting of new messages), API Management should be used to secure it by fronting the endpoint. This can then be secured with certificates or OAuth as appropriate. The easiest way to do this is using a Logic App with a Request/Response HTTP trigger as an intermediary.

Event Grid secures event delivery through a validation code. If you use LogicApps to consume the event, this is performed automatically. See more details about [Event Grid security and authentication](../event-grid/security-authentication.md).

## Next steps

- [Simple Enterprise Integration](logic-apps-architectures-simple-enterprise-integration.md)