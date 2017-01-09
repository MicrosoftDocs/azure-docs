---
title: Log Analytics Features for Service Providers | Microsoft Docs
description: Log Analytics can help Managed Service Providers (MSPs), Large Enterprises, Independent Sofware Vendors (ISVs) and hosting service providers manage and monitor servers in customer's on-premises or cloud infrastructure.
services: log-analytics
documentationcenter: ''
author: richrundmsft
manager: jochan
editor: ''

ms.assetid: c07f0b9f-ec37-480d-91ec-d9bcf6786464
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/22/2016
ms.author: richrund

---
# Log Analytics features for Service Providers
Log Analytics can help managed service providers (MSPs), large enterprises, independent software vendors (ISVs), and hosting service providers manage and monitor servers in customer's on-premises or cloud infrastructure. 

Large enterprises share many similarities with service providers, particularly when there is a centralized IT team that is responsible for managing IT for many different business units. For simplicity, this document uses the term *service provider* but the same functionality is also available for enterprises and other customers.

## Cloud Solution Provider
For partners and service providers who are part of the [Cloud Solution Provider (CSP)](https://partner.microsoft.com/Solutions/cloud-reseller-overview) program, Log Analytics is one of the Azure services available on a CSP subscription. 

For Log Analytics, the following capabilities are enabled in *Cloud Solution Provider* subscriptions.

As a *Cloud Solution Provider* you can:

* Create Log Analytics workspaces in a tenant (customer's) subscription.
* Access workspaces created by tenants. 
* Add and remove user access to the workspace using Azure user management. When in a tenant’s workspace in the OMS portal the user management page under Settings is not available
  * Log Analytics does not support role-based access yet - giving a user `reader` permission in the Azure portal allows them to make configuration changes in the OMS portal

To log in to a tenant’s subscription, you need to specify the tenant identifier. The tenant identifier is often that last part of the e-mail address used to sign in.

* In the OMS portal, add `?tenant=contoso.com` in the URL for the portal. For example, `mms.microsoft.com/?tenant=contoso.com`
* In PowerShell, use the `-Tenant contoso.com` parameter when using `Add-AzureRmAccount` cmdlet
* The tenant identifier is automatically added when you use the `OMS portal` link from the Azure portal to open and log in to the OMS portal for the selected workspace

As a *customer* of a Cloud Solution Provider you can:

* Create log analytics workspaces in a CSP subscription
* Access workspaces created by the CSP
  * Use the `OMS portal` link from the Azure portal to open and log in to the OMS portal for the selected workspace
* View and use the user management page under Settings in the OMS portal

> [!NOTE]
> The included Backup and Site Recovery solutions for Log Analytics are not able to connect to a Recovery Services vault and cannot be configured in a CSP subscription. 
> 
> 

## Managing multiple customers using Log Analytics
It is recommended that you create a Log Analytics workspace for each customer you manage. A Log Analytics workspace provides:

* A geographic location for data to be stored. 
* Granularity for billing 
* Data isolation 
* Unique configuration

By creating a workspace per customer, you are able to keep each customer’s data separate and also track the usage of each customer.

More details on when and why to create multiple workspaces is described in [manage access to log analytics](log-analytics-manage-access.md#determine-the-number-of-workspaces-you-need).

Creation and configuration of customer workspaces can be automated using [PowerShell](log-analytics-powershell-workspace-configuration.md), [Resource Manager templates](log-analytics-template-workspace-configuration.md), or using the [REST API](https://www.nuget.org/packages/Microsoft.Azure.Management.OperationalInsights/).

The use of Resource Manager templates for workspace configuration allows you to have a master configuration that can be used to create and configure workspaces. You can be confident that as workspaces are created for customers they are automatically configured to your requirements. When you update your requirements, the template is updated and then reapplied the existing workspaces. This process ensures that even existing workspaces meet your new standards.    

When managing multiple Log Analytics workspaces, we recommend integrating each workspace with your existing ticketing system / operations console using the [Alerts](log-analytics-alerts.md) functionality. By integrating with your existing systems, support staff can continue to follow their familiar processes. Log Analytics regularly checks each workspace against the alert criteria you specify and generates an alert when action is needed.

For personalized views of data, use the [dashboard](../azure-portal/azure-portal-dashboards.md) capability in the Azure portal.  

For executive level reports that summarize data across workspaces you can use the integration between Log Analytics and [PowerBI](log-analytics-powerbi.md). If you need to integrate with another reporting system, you can use the Search API (via PowerShell or [REST](log-analytics-log-search-api.md)) to run queries and export search results.

## Next Steps
* Automate creation and configuration of workspaces using [Resource Manager templates](log-analytics-template-workspace-configuration.md)
* Automate creation of workspaces using [PowerShell](log-analytics-powershell-workspace-configuration.md) 
* Use [Alerts](log-analytics-alerts.md) to integrate with existing systems
* Generate summary reports using [PowerBI](log-analytics-powerbi.md)

