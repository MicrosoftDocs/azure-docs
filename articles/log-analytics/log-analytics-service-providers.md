---
title: Log Analytics for Service Providers | Microsoft Docs
description: Log Analytics can help Managed Service Providers (MSPs), large Enterprises, Independent Sofware Vendors (ISVs) and hosting service providers manage and monitor servers in customer's on-premises or cloud infrastructure.
services: log-analytics
documentationcenter: ''
author: MeirMen
manager: jochan
editor: ''
ms.assetid: c07f0b9f-ec37-480d-91ec-d9bcf6786464
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2018
ms.author: meirm
ms.component: 
---

# Log Analytics for Service Providers
Log Analytics can help managed service providers (MSPs), large enterprises, independent software vendors (ISVs), and hosting service providers manage and monitor servers in customer's on-premises or cloud infrastructure. 

Large enterprises share many similarities with service providers, particularly when there is a centralized IT team that is responsible for managing IT for many different business units. For simplicity, this document uses the term *service provider* but the same functionality is also available for enterprises and other customers.

For partners and service providers who are part of the [Cloud Solution Provider (CSP)](https://partner.microsoft.com/Solutions/cloud-reseller-overview) program, Log Analytics is one of the Azure services available in [Azure CSP subscriptions](https://docs.microsoft.com/azure/cloud-solution-provider/overview/azure-csp-overview). 

## Architectures for Service Providers

Log Analytics workspaces provide a method for the administrator to control the flow and isolation of the logs and create a log architecture that addresses its specific business needs. [This article](https://docs.microsoft.com/azure/log-analytics/log-analytics-manage-access) explains the general considerations around workspace management. Service providers have additional considerations.

There are three possible architectures for service providers regarding Log Analytics workspaces:

### 1. Distributed - Logs are stored in workspaces located in the customer's tenant 

In this architecture, a workspace is deployed in the customer's tenant that is used for all the logs of that customer. The service provider administrators are granted access to this workspace using [Azure Active Directory guest users (B2B)](https://docs.microsoft.com/azure/active-directory/b2b/what-is-b2b). The service provider administrators will have to switch to their customer's directory in the Azure portal to be able to access these workspaces.

The advantages of this architecture are:
* The customer can manage access to the logs using their own [role-based access](https://docs.microsoft.com/azure/role-based-access-control/overview).
* Each customer can have different settings for their workspace such as retention and data capping.
* Isolation between customers for regulatory and compliancy.
* The charge for each workspace will be rolled into the customer's subscription.
* Logs can be collected from all types of resources, not just agent-based. For example, Azure Audit Logs.

The disadvantages of this architecture are:
* It is harder for the service provider to manage a large number of customer tenants at once.
* Service provider administrators have to be provisioned in the customer directory.
* The service provider can't analyze data across its customers.

### 2. Central - Logs are stored in a workspace located in the service provider tenant

In this architecture, the logs are not stored in the customer's tenants but only in a central location within one of the service provider's subscriptions. The agents that are installed on the customer's VMs are configured to send their logs to this workspace using the workspace ID and secret key.

The advantages of this architecture are:
* It is easy to manage a large number of customers and integrate them to various backend systems.
* The service provider has full ownership over the logs and the various artifacts such as functions and saved queries.
* The service provider can perform analytics across all of its customers.

The disadvantages of this architecture are:
* This architecture is applicable only for agent-based VM data, it will not cover PaaS, SaaS and Azure fabric data sources.
* It might be hard to separate the data between the customers when they are merged into a single workspace. The only good method to do so is to use the computer's fully qualified domain name (FQDN) or via the Azure subscription ID. 
* All data from all customers will be stored in the same region with a single bill and same retention and configuration settings.
* Azure fabric and PaaS services such as Azure Diagnostics and Azure Audit Logs requires the workspace to be in the same tenant as the resource, thus they cannot send the logs to the central workspace.
* All VM agents from all customers will be authenticated to the cental workspace using the same workspace ID and key. There is no method to block logs from a specific customer without interrupting other customers.


### 3. Hybrid - Logs are stored in workspace located in the customer's tenant and some of them are pulled to a central location.

The third architecture mix between the two options. It is based on the first distributed architecture where the logs are local to each customer but using some mechanism to create a central repository of logs. A portion of the logs is pulled into a central location for reporting and analytics. This portion could be small number of data types or a summary of the activity such as daily statistics.

There are two options to implement the central location in Log Analytics:

1. Central workspace: The service provider can create a workspace in its tenant and use a script that utilizes the [Query API](https://dev.loganalytics.io/) with the [Data Collection API](log-analytics-data-collector-api.md) to bring the data from the various workspaces to this central location. Another option, other than a script, is to use [Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview).

2. Power BI as a central location: Power BI can act as the central location when the various workspaces export data to it using the integration between Log Analytics and [Power BI](log-analytics-powerbi.md). 


## Next Steps
* Automate creation and configuration of workspaces using [Resource Manager templates](log-analytics-template-workspace-configuration.md)
* Automate creation of workspaces using [PowerShell](log-analytics-powershell-workspace-configuration.md) 
* Use [Alerts](log-analytics-alerts.md) to integrate with existing systems
* Generate summary reports using [Power BI](log-analytics-powerbi.md)
* Review the process of [configuring Log Analytics and Power BI to monitor multiple CSP customers](https://docs.microsoft.com/azure/cloud-solution-provider/support/monitor-multiple-customers)
