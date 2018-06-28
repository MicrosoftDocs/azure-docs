---
title: Azure Integration Services - Simple Enterprise Integration
description: Reference architecture showing how to implement a simple enterprise integration pattern with Azure Logic Apps and Azure API Management 
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

# Simple Enterprise Integration - reference architecture

## Overview

This reference architecture shows a set of proven practices for an integration application that uses Azure Integration Services. This architecture can serve as this basis of many different application patterns requiring HTTP APIs, workflow and orchestration.

*There are many possible applications of integration technology, from a simple point-to point application to a full enterprise service bus. This architecture series sets out the reusable component parts for building any integration application – architects should consider the components they will need for their applications and infrastructure.*

   ![Architecture diagram - simple enterprise integration](./media/logic-apps-architectures-simple-enterprise-integration/simple_arch_diagram.png)

## Architecture

The architecture has the following components:

- Resource group. A resource group is a logical container for Azure resources.
- Azure API Management. Azure API Management is a fully managed platform for publishing, securing and transforming HTTP APIs.
- Azure API Management Developer Portal. Each instance of Azure API Management comes with a Developer Portal, giving access to documentation, code samples and the ability to test an API.
- Azure Logic Apps. Logic Apps is a serverless platform for building enterprise workflow and integration.
- Connectors. Connectors are used by Logic Apps to connect to commonly used services. Logic Apps already has hundreds of different connectors, but they can also be created using a custom connector.
- IP address. The Azure API Management service has a fixed public IP address and a domain name. The domain name is a subdomain of azure-api.net, such as contoso. azure-api.net. Logic Apps also has a public IP address; however, in this architecture we restrict access to call Logic apps endpoints to only the IP Address of API Management (for security).
- Azure DNS. Azure DNS is a hosting service for DNS domains, providing name resolution using Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records using the same credentials, APIs, tools, and billing as your other Azure services. To use a custom domain name (such as contoso.com) create DNS records that map the custom domain name to the IP address. For more information, see Configure a custom domain name in Azure API Management.
- Azure Active Directory (Azure AD). Use Azure AD or another identity provider for authentication. Azure AD provides authentication to access API endpoints (by passing a JSON Web Token for API Management to validate) and can secure access to the API Management Developer Portal (Standard & Premium tiers only).

This architecture has some fundamental patterns to its operation:

1. Existing backend HTTP APIs are published through the API Management Developer Portal, allowing developers (either internal to your organization, external or both) to integrate calls to these APIs into applications.
2. Composite APIs are built using Logic Apps; orchestrating calls to SAAS systems, Azure services and any APIs published to API Management. The Logic Apps are also published through the API Management Developer Portal.
3. Applications acquire an OAuth 2.0 security token necessary for gaining access to an API using Azure Active Directory.
4. Azure API Management validates the security token, and passes the request to the backend API/Logic App.

## Recommendations

Your requirements might differ from the architecture described here. Use the recommendations in this section as a starting point.

### Azure API Management tier

Use the Basic, Standard or Premium tiers because they offer a production SLA and support scale-out within the Azure region (number of units varies by tier). Premium tier also supports scale-out across multiple Azure regions. Base the tier you chose on your level of throughput required and feature set. For more information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

You are charged for all API Management instances when they are running. If you have scaled up and don’t need that level of performance all the time, consider taking advantage of API Management’s hourly billing and scale down.

### Logic Apps pricing

Logic Apps works as a [serverless](logic-apps-serverless-overview.md) model – billing is calculated based on action and connector execution. See [Logic Apps pricing](https://azure.microsoft.com/pricing/details/logic-apps/) for more information. There are currently no tier considerations for Logic Apps.

### Logic Apps for asynchronous API calls

Logic Apps works best in scenarios that don’t require low latency – e.g. asynchronous or semi-long-running API calls. If low latency is required (e.g. a call that blocks a user interface) we recommend implementing that API or operation using a different technology, e.g. Azure Functions or Web API deployed using App Service. We still recommend that this API be fronted using API Management to API consumers.

### Region

Provision API Management and Logic Apps in the same region to minimize network latency. Generally, choose the region closest to your users.

The resource group also has a region, which specifies where deployment metadata is stored, and where the deployment template is executed from. Put the resource group and its resources in the same region. This can improve availability during deployment.

## Scalability considerations

API Management administrators should add [caching policies](../api-management/api-management-howto-cache.md) where appropriate to increase the scalability of the service and reduce load on their backend services.

Azure API Management Basic, Standard and Premium tiers can be scaled out with in an Azure region to offer greater capacity. Administrators can use the Capacity Metric within the Metrics menu to analyze the usage of their service and scale up or scale down as appropriate.

Recommendations for scaling an API Management service:

- Scaling needs to take account of traffic patterns – customers with more volatile traffic patterns will have greater need for increased capacity.
- Consistent capacity above 66% may indicate a need to scale up.
- Consistent capacity below 20% may indicate an opportunity to scale down.
- It is always recommended to load test your API Management service with a representative load before enabling in production.

Premium tier services can be scaled out across multiple Azure regions. Customers deploying in this manner will gain a higher SLA (99.95% as opposed to 99.9%) and can provision services near to users in multiple regions.

Logic Apps’ serverless model means administrators do not need to make extra consideration for service scalability; the service scales automatically to meet demand.

## Availability considerations

At the time of writing, the service level agreement (SLA) for Azure API Management is 99.9% for Basic, Standard, and Premium tiers. Premium tier configurations with deployment of at least one unit in two or more regions have an SLA of 99.95%.

At the time of writing, the service level agreement (SLA) for Azure Logic Apps is 99.9%.

### Backups

The configuration of Azure API Management should be [backed up regularly](../api-management/api-management-howto-disaster-recovery-backup-restore.md) (appropriately based on regularity of change), and the backup files stored in a location or Azure Region different to where the service resides. Customers can then choose one of two options for their DR strategy:

1. In a DR event, a new API Management instance is provisioned, the backup is restored to it, and DNS records are repointed.
2. Customers keep a passive copy of their service in another Azure region (incurring additional cost) Backups are regularly restored to it. In a DR event, only DNS records need be repointed to restore the service.

As Logic Apps can be recreated very quickly and are serverless, they are backed up by saving a copy of the associated Azure Resource Manager template. These can be saved to source control/integrated into a customers’ continuous integration/continuous deployment (CI/CD) process.

Logic Apps that have been published through API Management will need their locations updated should they move to a different data center. This can be accomplished through a simple PowerShell script to update the Backend property of the API.

## Manageability considerations

Create separate resource groups for production, development, and test environments. This makes it easier to manage deployments, delete test deployments, and assign access rights.
When assigning resources to resource groups, consider the following:

- Lifecycle. In general, put resources with the same lifecycle into the same resource group.
- Access. You can use [Role-Based Access Control](../role-based-access-control/overview.md) (RBAC) to apply access policies to the resources in a group.
- Billing. You can view the rolled-up costs for the resource group.
- Pricing tier for API Management – we recommend using Developer Tier for development and test environments. For pre-production, we recommend deploying a replica of your production environment, running tests, and then shutting down to minimize cost.

For more information, see [resource group](../azure-resource-manager/resource-group-overview.md) overview.

### Deployment

We recommend that you use [Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md) to deploy both Azure API Management and Azure Logic Apps. Templates make it easier to automate deployments via PowerShell or the Azure command-line interface (CLI).

We recommend putting Azure API Management and any individual Logic Apps in their own separate Resource Manager templates. This will allow storing them in source control systems. These templates can then be deployed together or individually as part of a continuous integration/continuous (CI/CD) deployment process.

### Versions

Each time you make a configuration change to a Logic App (or deploy an update through a Resource Manager template), a copy of that version is kept for your convenience (all versions that have a run history will be kept). You can use these versions to track historical changes, and also promote a version to be the current configuration of the logic app; doing so means you can effectively roll-back a Logic App, for example.

API Management has two distinct (but complimentary) [versioning concepts](https://blogs.msdn.microsoft.com/apimanagement/2018/01/11/versions-revisions-general-availibility/):

- Versions used to provide your API consumers with a choice of the API they could consume based on their needs (e.g. v1, v2 or beta, production).
- Revisions allowing API Administrators to safely make changes to an API and deploy them to users with optional commentary.

In the context of deployment – API Management revisions should be considered as a way to make changes safely, keep a change history, and make API consumers aware of those changes. A revision can be created in a development environment and deployed between other environments using Resource Manager templates.

Whilst revisions can be used to test an API before it is made ‘current’ and made accessible to users, we do not recommend using this mechanism for load or integration testing – separate test or pre-production environments should be used instead.

### Configuration

Never check passwords, access keys, or connection strings in to source control. If they are needed, use the appropriate technique to deploy and secure these values. 

In Logic Apps, any sensitive values needed within the logic app (that cannot be created in the form of a connection) should be stored in Azure Key Vault and referred to from a Resource Manager template. We also suggest using deployment template parameters along with parameter files for each environment. More guidance on [securing parameters and inputs within a workflow](logic-apps-securing-a-logic-app.md#secure-parameters-and-inputs-within-a-workflow).

In API Management, secrets are managed using objects called Named Values/Properties. These securely store values that can be accessed in API Management policies. See how to [manage secrets in API Management](../api-management/api-management-howto-properties.md).

### Diagnostics and monitoring

Both [API Management](../api-management/api-management-howto-use-azure-monitor.md) and [Logic Apps](logic-apps-monitor-your-logic-apps.md) support operational monitoring through [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-azure-monitor.md). Azure Monitor is enabled by default and will provide information based on the different metrics configured for each service.

Additionally, there are further options for each service:

- Logic Apps logs can be sent to [Log Analytics](logic-apps-monitor-your-logic-apps-oms.md) for deeper analysis and dashboarding.
- API Management supports configuring Application Insights for Dev Ops monitoring.
- API Management supports the [Power BI Solution Template for custom API analytics](http://aka.ms/apimpbi). This solution template allows customers to create their own custom analytics solution, with reports available in Power BI for business users.

## Security considerations

This section lists security considerations that are specific to the Azure services described in this article, deployed in the architecture as described. It's not a complete list of security best practices.

- Use role-based access control (RBAC) to ensure appropriate levels of access for users.
- Secure public API endpoints in API Management using OAuth/Open IDConnect. Do this by configuring an identity provider and adding a JWT validation policy.
- Connect to backend services from API Management using mutual certificates
- Secure HTTP trigger-based Logic Apps by creating an IP Address whitelist pointing to the IP Address of API Management. This prevents calling the logic app from the public internet without first going through API Management.

This reference architecture showed how to build a simple enterprise integration platform using Azure Integration Services.

## Next steps

* [Enterprise Integration with Queues and Events](logic-apps-architectures-enterprise-integration-with-queues-events.md)
