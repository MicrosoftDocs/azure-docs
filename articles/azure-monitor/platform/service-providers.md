---
title: Azure Monitor Logs for Service Providers | Microsoft Docs
description: Azure Monitor Logs can help Managed Service Providers (MSPs), large enterprises, Independent Software Vendors (ISVs) and hosting service providers manage and monitor servers in customer's on-premises or cloud infrastructure.
ms.subservice: logs
ms.topic: conceptual
author: MeirMen
ms.author: meirm
ms.date: 02/03/2020

---

# Azure Monitor Logs for Service Providers

Log Analytics workspaces in Azure Monitor can help managed service providers (MSPs), large enterprises, independent software vendors (ISVs), and hosting service providers manage and monitor servers in customer's on-premises or cloud infrastructure.

Large enterprises share many similarities with service providers, particularly when there is a centralized IT team that is responsible for managing IT for many different business units. For simplicity, this document uses the term *service provider* but the same functionality is also available for enterprises and other customers.

For partners and service providers who are part of the [Cloud Solution Provider (CSP)](https://partner.microsoft.com/en-US/membership/cloud-solution-provider) program, Log Analytics in Azure Monitor is one of the Azure services available in Azure CSP subscriptions.

Log Analytics in Azure Monitor can also be used by a service provider managing customer resources through the Azure delegated resource management capability in [Azure Lighthouse](https://docs.microsoft.com/azure/lighthouse/overview).

## Architectures for Service Providers

Log Analytics workspaces provide a method for the administrator to control the flow and isolation of [log](data-platform-logs.md) data and create an architecture that addresses its specific business needs. [This article](design-logs-deployment.md) explains the design, deployment, and migration considerations for a workspace, and the [manage access](manage-access.md) article discusses how to apply and manage permissions to log data. Service providers have additional considerations.

There are three possible architectures for service providers regarding Log Analytics workspaces:

### 1. Distributed - Logs are stored in workspaces located in the customer's tenant

In this architecture, a workspace is deployed in the customer's tenant that is used for all the logs of that customer.

There are two ways that service provider administrators can gain access to a Log Analytics workspace in a customer tenant:

- A customer can add individual users from the service provider as [Azure Active Directory guest users (B2B)](https://docs.microsoft.com/azure/active-directory/b2b/what-is-b2b). The service provider administrators will have to sign in to each customer's directory in the Azure portal to be able to access these workspaces. This also requires the customers to manage individual access for each service provider administrator.
- For greater scalability and flexibility, service providers can use the [Azure delegated resource management](https://docs.microsoft.com/azure/lighthouse/concepts/azure-delegated-resource-management) capability of [Azure Lighthouse](https://docs.microsoft.com/azure/lighthouse/overview) to access the customer’s tenant. With this method, the service provider administrators are included in an Azure AD user group in the service provider’s tenant, and this group is granted access during the onboarding process for each customer. These administrators can then access each customer’s workspaces from within their own service provider tenant, rather than having to log into each customer’s tenant individually. Accessing your customers’ Log Analytics workspaces resources in this way reduces the work required on the customer side, and can make it easier to gather and analyze data across multiple customers managed by the same service provider via tools such as [Azure Monitor Workbooks](https://docs.microsoft.com/azure//azure-monitor/platform/workbooks-overview). For more info, see [Monitor customer resources at scale](https://docs.microsoft.com/azure/lighthouse/how-to/monitor-at-scale).

The advantages of the distributed architecture are:

* The customer can confirm specific levels of permissions via [Azure delegated resource management](https://docs.microsoft.com/azure/lighthouse/concepts/azure-delegated-resource-management), or can manage access to the logs using their own [role-based access](https://docs.microsoft.com/azure/role-based-access-control/overview).
* Logs can be collected from all types of resources, not just agent-based VM data. For example, Azure Audit Logs.
* Each customer can have different settings for their workspace such as retention and data capping.
* Isolation between customers for regulatory and compliancy.
* The charge for each workspace will be rolled into the customer's subscription.

The disadvantages of the distributed architecture are:

* Centrally visualizing and analyzing data across customer tenants with tools such as Azure Monitor Workbooks can result in slower experiences , especially when analyzing data across more than 50+ workspaces.
* If customers are not onboarded for Azure delegated resource management, service provider administrators must be provisioned in the customer directory, and it is harder for the service provider to manage a large number of customer tenants at once.

### 2. Central - Logs are stored in a workspace located in the service provider tenant

In this architecture, the logs are not stored in the customer's tenants but only in a central location within one of the service provider's subscriptions. The agents that are installed on the customer's VMs are configured to send their logs to this workspace using the workspace ID and secret key.

The advantages of the centralized architecture are:

* It is easy to manage a large number of customers and integrate them to various backend systems.
* The service provider has full ownership over the logs and the various artifacts such as functions and saved queries.
* The service provider can perform analytics across all of its customers.

The disadvantages of the centralized architecture are:

* This architecture is applicable only for agent-based VM data, it will not cover PaaS, SaaS and Azure fabric data sources.
* It might be hard to separate the data between the customers when they are merged into a single workspace. The only good method to do so is to use the computer's fully qualified domain name (FQDN) or via the Azure subscription ID. 
* All data from all customers will be stored in the same region with a single bill and same retention and configuration settings.
* Azure fabric and PaaS services such as Azure Diagnostics and Azure Audit Logs requires the workspace to be in the same tenant as the resource, thus they cannot send the logs to the central workspace.
* All VM agents from all customers will be authenticated to the central workspace using the same workspace ID and key. There is no method to block logs from a specific customer without interrupting other customers.

### 3. Hybrid - Logs are stored in workspace located in the customer's tenant and some of them are pulled to a central location.

The third architecture mix between the two options. It is based on the first distributed architecture where the logs are local to each customer but using some mechanism to create a central repository of logs. A portion of the logs is pulled into a central location for reporting and analytics. This portion could be small number of data types or a summary of the activity such as daily statistics.

There are two options to implement logs in a central location:

1. Central workspace: The service provider can create a workspace in its tenant and use a script that utilizes the [Query API](https://dev.loganalytics.io/) with the [Data Collection API](../../azure-monitor/platform/data-collector-api.md) to bring the data from the various workspaces to this central location. Another option, other than a script, is to use [Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview).

2. Power BI as a central location: Power BI can act as the central location when the various workspaces export data to it using the integration between the Log Analytics workspace and [Power BI](../../azure-monitor/platform/powerbi.md). 

## Next steps

* Automate creation and configuration of workspaces using [Resource Manager templates](template-workspace-configuration.md)

* Automate creation of workspaces using [PowerShell](../../azure-monitor/platform/powershell-workspace-configuration.md) 

* Use [Alerts](../../azure-monitor/platform/alerts-overview.md) to integrate with existing systems

* Generate summary reports using [Power BI](../../azure-monitor/platform/powerbi.md)

* Onboard customers to [Azure delegated resource management](https://docs.microsoft.com/azure/lighthouse/concepts/azure-delegated-resource-management).
