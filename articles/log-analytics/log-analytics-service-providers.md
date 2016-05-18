<properties
	pageTitle="Log Analytics Features for Service Providers | Microsoft Azure"
	description="Log Analytics can help Managed Service Providers (MSPs), Large Enterprises, Independent Sofware Vendors (ISVs) and hosting service providers manage and monitor servers in customer's on-premises or cloud infrastructure."
	services="log-analytics"
	documentationCenter=""
	authors="richrundmsft"
	manager="jochan"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/16/2016"
	ms.author="richrund"/>

# Log Analytics Features for Service Providers

Log Analytics can help Managed Service Providers (MSPs), Large Enterprises, Independent Software Vendors (ISVs) and hosting service providers manage and monitor servers in customer's on-premises or cloud infrastructure.

For service providers there are 3 main areas of opportunity when using Log Analytics:

+	Resale via Cloud Solution Provider (CSP)
+	Building of Custom Solutions 
+	Provision of Managed Services

## Cloud Solution Provider

For partners and service providers who are part of the Cloud Solution Provider (CSP) program, Log Analytics is one of the Azure services available on a CSP subscription. 
Find out more on the benefits of the [Cloud Solution Provider program] (https://partner.microsoft.com/Solutions/cloud-reseller-overview). 

For Log Analytics, the following capabilities are enabled in Cloud Solution Provider subscriptions.

As a *Cloud Solution Provider* you can:

+ Create Log Analytics workspaces in a tenant (customer's) subscription (using the Azure portal, PowerShell, or ARM). When you login to a tenant’s subscription you will pass the tenant identifier (The tenant identifier is often that last part of the e-mail address they use to sign in):
  - In the OMS portal add `?tenant=contoso.com` in the URL for the portal e.g. `mms.microsoft.com/?tenant=contoso.com`
  - In PowerShell, use the `-Tenant contoso.com` parameter when using `Add-AzureRmAccount` cmdlet
+ Access workspaces created by tenants, both in the Azure portal and in the OMS portal, as well as via PowerShell / ARM
  - Use the `OMS portal` link from the Azure portal to open and log into the OMS portal for the selected workspace
+ Add and remove user access to the workspace using Azure user management. When in a tenant’s workspace in the OMS portal you won’t see the user management page under Settings
  - Note: OMS does not support role based access yet - giving a user `reader` permission in the Azure portal will still allow them to make configuration changes in the OMS portal

As a *customer* of a Cloud Solution Provider you can:

+ Create log analytics workspaces in a CSP subscription
+ Access workspaces created by the CSP, both in the Azure portal and in the OMS portal, as well as via PowerShell / ARM
  -  Use the `OMS portal` link from the Azure portal to open and log into the OMS portal for the selected workspace
+ View and use the user management page under Settings in the OMS portal

## Building Custom Solutions
In the future you will be able to build your own solutions, which can either be sold directly, sold via the Azure Marketplace, or made available in a community gallery.
Log Analytics solutions consist of several components, including:

+ Visualizations
+ [Custom Log](log-analytics-data-sources-custom-logs.md) sources
+ [Custom Field](log-analytics-custom-fields.md) definitions
+ [Alerts](log-analytics-alerts.md)
+ Saved Searches
+ Automation

Using a custom solution you can collect data from additional data sources and use a dashboard to summarize the logs.

More information on how to build and share custom solutions will be available when this feature is in public preview.

## Managed Services

Large enterprises share many similarities with Service Providers, particularly when there is a centralized IT team that is responsible for managing IT of many different business units.
In this section I’ll refer to managed service providers, but the same functionality is also available for enterprises and other customers.

It is recommended that you create a Log Analytics workspace for each customer you manage. A Log Analytics workspace provides:

+	A geographic location for data to be stored. 
+	Granularity for billing 
+	Data isolation 
+ Unique configuration

By creating a workspace per customer you are able to keep each customer’s data separate and also track the usage of each customer. If you are in an large organization, create a workspace for each department or business group, especially if you want to perform a cross charge or give each department access to only their data.

Since you’re creating a workspace for each customer you’ll want to automate this process using the PowerShell cmdlets. You can also automate the configuration of each workspace too and you can use PowerShell to enable solutions, set up saved searches etc. The full list of cmdlets is available on [TechNet](https://msdn.microsoft.com/library/mt188224.aspx) and [sample scripts](log-analytics-powershell-workspace-configuration.md) are also available. 

No IT system runs in isolation so you’ll also want to integrate Log Analytics with your other systems.

For reporting Log Analytics is able to automatically export data to [PowerBI](log-analytics-powerbi.md). If you need to integrate with another reporting system, you can use the Search cmdlets to run queries and export search results.

Grant users access to the Log Analytics workspace using [Azure RBAC](../active-directory/role-based-access-control-manage-access-powershell.md) to provide people access to the workspace.  

For ticketing or alerting systems you can with integrate Log Analytics using the [Alerting](log-analytics-alerts.md) functionality and its ability to call a webhook or an Azure Automation runbook. 

### Future Investments

We’re working to make Log Analytics even better for service providers by adding the following:

+	Additional PowerShell cmdlets for configuring Log Analytics
+	Full role based access control for actions using Azure’s role based access
  -	This will allow fine grained control of all create, update and delete operations
+	Aggregated views across workspaces
  -	This provides a single view of data that is in multiple workspaces, even if the workspaces are in different subscriptions
+	Creation of custom views and dashboards
  -	Including the ability for dashboards to be shared or private
+	Custom solution authoring
+	Inventory data for searching and grouping
  -	This provides the ability to creates groups based on asset information and to view asset details as part of search results
