---
title: Azure Integration Services enterprise integration reference architecture
description: Describes the reference architecture that shows how to implement an enterprise integration pattern by using Logic Apps, API Management, Service Bus, and Event Grid.
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

# Reference architecture: Enterprise integration with queues and events

The following reference architecture shows a set of proven practices that you can apply to an integration application that uses Azure Integration Services. The architecture can serve as the basis for many different application patterns that require HTTP APIs, workflow, and orchestration.

![Architecture diagram - Enterprise integration with queues and events](media/logic-apps-architectures-enterprise-integration-with-queues-events/integr_queues_events_arch_diagram.png)

*There are many possible applications for integration technology. They range from a simple point-to-point application to a full enterprise Azure Service Bus application. The architecture series describes the reusable component parts that might apply to building a generic integration application. Architects should consider which components they need to implement for their application and infrastructure.*

## Architecture

The architecture *builds on* the [simple enterprise integration](logic-apps-architectures-simple-enterprise-integration.md) architecture. [Recommendations for the simple enterprise architecture](logic-apps-architectures-simple-enterprise-integration.md#recommendations) apply here. They are omitted from the [recommendations](#recommendations) in this article for brevity. 

The architecture has the following components:

- **Resource group**. A [resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) is a logical container for Azure resources.
- **Azure API Management**. [API Management](https://docs.microsoft.com/azure/api-management/) is a fully managed platform that's used to publish, secure, and transform HTTP APIs.
- **Azure API Management Developer portal**. Each instance of Azure API Management comes with access to the [Developer portal](https://docs.microsoft.com/azure/api-management/api-management-customize-styles). The API Management Developer portal gives you access to documentation and code samples. You can test APIs in the Developer portal.
- **Azure Logic Apps**. [Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview) is a serverless platform that's used to build enterprise workflow and integration.
- **Connectors**. Logic Apps uses [connectors](https://docs.microsoft.com/azure/connectors/apis-list) to connect to commonly used services. Logic Apps already has hundreds of different connectors, but you can also create a custom connector.
- **Azure Service Bus**. [Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview) provides secure and reliable messaging. Messaging can be used to decouple applications and integrate with other message-based systems.
- **Azure Event Grid**. [Event Grid](https://docs.microsoft.com/azure/event-grid/overview) is a serverless platform that's used to publish and deliver application events.
- **IP address**. The Azure API Management service has a fixed public [IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm) and a domain name. The domain name is a subdomain of azure-api.net, such as contoso.azure-api.net. Logic Apps and Service Bus also have a public IP address. However, in this architecture, we restrict access for calling Logic Apps endpoints to only the IP address of API Management (for security). Calls to Service Bus are secured by a shared access signature (SAS).
- **Azure DNS**. [Azure DNS](https://docs.microsoft.com/azure/dns/) is a hosting service for DNS domains. Azure DNS provides name resolution by using the Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records by using the same credentials, APIs, tools, and billing that you use for your other Azure services. To use a custom domain name (like contoso.com), create DNS records that map the custom domain name to the IP address. For more information, see [Configure a custom domain name in API Management](https://docs.microsoft.com/en-us/azure/api-management/configure-custom-domain).
- **Azure Active Directory (Azure AD)**. Use [Azure AD](https://docs.microsoft.com/azure/active-directory/) or another identity provider for authentication. Azure AD provides authentication for accessing API endpoints by passing a [JSON Web Token for API Management](https://docs.microsoft.com/azure/api-management/policies/authorize-request-based-on-jwt-claims) to validate. Azure AD can secure access to the API Management Developer portal (Standard and Premium tiers only).

The architecture has some patterns that are fundamental to its operation:

* Existing back-end HTTP APIs are published through the API Management Developer portal. In the portal, developers (either internal to your organization, external, or both) can integrate calls to these APIs into applications.
* Composite APIs are built by using logic apps and by orchestrating calls to software as a service (SaaS) systems, Azure services, and any APIs that are published to API Management. [Logic apps are also published](https://docs.microsoft.com/azure/api-management/import-logic-app-as-api) through the API Management Developer portal.
- Applications use Azure AD to [acquire an OAuth 2.0 security token](https://docs.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad) that's required to gain access to an API.
- API Management [validates the security token](https://docs.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad) and then passes the request to the back-end API or logic app.
- Service Bus queues are used to [decouple](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-messaging-overview) application activity and to [smooth spikes in load](https://docs.microsoft.com/azure/architecture/patterns/queue-based-load-leveling). Messages are added to queues by logic apps, third-party applications, or (not pictured) by publishing the queue as an HTTP API through API Management.
- When messages are added to a Service Bus queue, an event fires. A logic app is triggered by the event. The logic app then processes the message.
- Other Azure services (for example, Azure Blob storage and Azure Event Hubs) also publish events to Event Grid. These services trigger logic apps to receive the event and then perform subsequent actions.

## Recommendations

Your specific requirements might differ from the generic architecture that's described in this article. Use the recommendations in this section as a starting point.

### Service Bus tier

Use the Service Bus Premium tier. The Premier tier supports Event Grid notifications. For more information, see [Service Bus pricing](https://azure.microsoft.com/pricing/details/service-bus/).

### Event Grid pricing

Event Grid uses a serverless model. Billing is calculated based on the number of operations (event execution). For more information, see [Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/). Currently, there are no tier considerations for Event Grid.

### Use PeekLock to consume Service Bus messages

When you create a logic app to consume Service Bus messages, use [PeekLock](../service-bus-messaging/service-bus-fundamentals-hybrid-solutions.md#queues) in the logic app to access a group of messages. When you use PeekLock, the logic app can perform steps to validate each message before completing or abandoning the message. This approach protects against accidental message loss.

### Check for multiple objects when an Event Grid trigger fires

When an Event Grid trigger fires, it means simply that “at least one of these things happened.” For example, when Event Grid triggers a logic app on a message that appears in a Service Bus queue, the logic app should always assume that there might be one or more messages available to process.

### Region

Provision API Management, Logic Apps, and Service Bus in the same region to minimize network latency. Generally, choose the region that's closest to your users.

The resource group also has a region. The region specifies where deployment metadata is stored and where the deployment template executes from. Put the resource group and its resources in the same region to improve availability during deployment.

## Scalability

The Service Bus Premium tier can scale out the number of messaging units to achieve higher scalability. Premium tier configurations can have one, two, or four messaging units. For more information about scaling Service Bus, see [Best practices for performance improvements by using Service Bus Messaging](../service-bus-messaging/service-bus-performance-improvements.md).

## Availability

Currently, the service level agreement (SLA) for Azure API Management is 99.9% for Basic, Standard, and Premium tiers. Premium tier configurations with deployment of at least one unit in two or more regions have an SLA of 99.95%.

Currently, the SLA for Azure Logic Apps is 99.9%.

### Disaster recovery

Consider implementing geo-disaster recovery in Service Bus Premium to enable failover if a serious outage occurs. For more information, see [Azure Service Bus geo-disaster recovery](../service-bus-messaging/service-bus-geo-dr.md).

## Manageability

Create separate resource groups for production, development, and test environments. Separate resource groups makes it easier to manage deployments, delete test deployments, and assign access rights.

When you assign resources to resource groups, consider the following factors:

- **Lifecycle**. In general, put resources that have the same lifecycle in the same resource group.
- **Access**. You can use [role-based access control](../role-based-access-control/overview.md) (RBAC) to apply access policies to the resources in a group.
- **Billing**. You can view rollup costs for the resource group.
- **Pricing tier for API Management**. We recommend using the Developer tier for development and test environments. For preproduction, we recommend deploying a replica of your production environment, running tests, and then shutting down to minimize cost.

For more information, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md).

### Deployment

We recommend that you use [Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md) to deploy API Management, Logic Apps, Event Grid, and Service Bus. Templates make it easier to automate deployments via PowerShell or the Azure CLI.

We recommend putting API Management, any individual logic apps, Event Grid topics, and Service Bus namespaces in their own, separate Resource Manager templates. When you use separate templates, you can store the resources in source control systems. You can then deploy these templates together or individually as part of a continuous integration/continuous deployment (CI/CD) process.

### Diagnostics and monitoring

Like API Management and Logic Apps, you can monitor Service Bus by using Azure Monitor. Azure Monitor provides information based on the metrics that are configured for each service. Azure Monitor is enabled by default.

## Security

Secure Service Bus by using an SAS. You can use [SAS authentication](../service-bus-messaging/service-bus-sas.md) to grant a user access to Service Bus resources with specific rights. For more information, see [Service Bus authentication and authorization](../service-bus-messaging/service-bus-authentication-and-authorization.md).

If a Service Bus queue needs to be exposed as an HTTP endpoint (for posting new messages), you should use API Management to secure it by fronting the endpoint. The endpoint can then be secured with certificates or OAuth as appropriate. The easiest way to secure an endpoint is by using a logic app with a request/response HTTP trigger as an intermediary.

Event Grid secures event delivery through a validation code. If you use Logic Apps to consume the event, validation is performed automatically. For more information, see [Event Grid security and authentication](../event-grid/security-authentication.md).

## Next steps

- Learn about [simple enterprise integration](logic-apps-architectures-simple-enterprise-integration.md).