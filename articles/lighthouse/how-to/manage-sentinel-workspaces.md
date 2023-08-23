---
title: Manage Microsoft Sentinel workspaces at scale
description: Azure Lighthouse helps you effectively manage Microsoft Sentinel across delegated customer resources.
ms.date: 05/23/2023
ms.topic: how-to
---

# Manage Microsoft Sentinel workspaces at scale

[Azure Lighthouse](../overview.md) allows service providers to perform operations at scale across several Azure Active Directory (Azure AD) tenants at once, making management tasks more efficient.

[Microsoft Sentinel](../../sentinel/overview.md) delivers security analytics and threat intelligence, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response. With Azure Lighthouse, you can manage multiple Microsoft Sentinel workspaces across tenants at scale. This enables scenarios such as running queries across multiple workspaces, or creating workbooks to visualize and monitor data from your connected data sources to gain insights. IP such as queries and playbooks remain in your managing tenant, but can be used to perform security management in the customer tenants.

This topic provides an overview of how Azure Lighthouse lets you use Microsoft Sentinel in a scalable way for cross-tenant visibility and managed security services.

> [!TIP]
> Though we refer to service providers and customers in this topic, this guidance also applies to [enterprises using Azure Lighthouse to manage multiple tenants](../concepts/enterprise.md).

> [!NOTE]
> You can manage delegated resources that are located in different [regions](../../availability-zones/az-overview.md#regions). However, you can't delegate resources across a national cloud and the Azure public cloud, or across two separate [national cloud](../../active-directory/develop/authentication-national-cloud.md).

## Architectural considerations

For a managed security service provider (MSSP) who wants to build a Security-as-a-Service offering using Microsoft Sentinel, a single security operations center (SOC) may be needed to centrally monitor, manage, and configure multiple Microsoft Sentinel workspaces deployed within individual customer tenants. Similarly, enterprises with multiple Azure AD tenants may want to centrally manage multiple Microsoft Sentinel workspaces deployed across their tenants.

This model of centralized management has the following advantages:

- Ownership of data remains with each managed tenant.
- Supports requirements to store data within geographical boundaries.
- Ensures data isolation, since data for multiple customers isn't stored in the same workspace.
- Prevents data exfiltration from the managed tenants, helping to ensure data compliance.
- Related costs are charged to each managed tenant, rather than to the managing tenant.
- Data from all data sources and data connectors that are integrated with Microsoft Sentinel (such as Azure AD Activity Logs, Office 365 logs, or Microsoft Threat Protection alerts) will remain within each customer tenant.
- Reduces network latency.
- Easy to add or remove new subsidiaries or customers.
- Able to use a multi-workspace view when working through Azure Lighthouse.
- To protect your intellectual property, you can use playbooks and workbooks to work across tenants without sharing code directly with customers. Only analytic and hunting rules will need to be saved directly in each customer's tenant.

> [!IMPORTANT]
> If workspaces are only created in customer tenants, the Microsoft.SecurityInsights & Microsoft.OperationalInsights resource providers must also be [registered](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) on a subscription in the managing tenant.

An alternate deployment model is to create one Microsoft Sentinel workspace in the managing tenant. In this model, Azure Lighthouse enables log collection from data sources across managed tenants. However, there are some data sources that can't be connected across tenants, such as Microsoft 365 Defender. Because of this limitation, this model isn't suitable for many service provider scenarios.

## Granular Azure role-based access control (Azure RBAC)

Each customer subscription that an MSSP will manage must be [onboarded to Azure Lighthouse](onboard-customer.md). This allows designated users in the managing tenant to access and perform management operations on Microsoft Sentinel workspaces deployed in customer tenants.

When creating your authorizations, you can assign the Microsoft Sentinel built-in roles to users, groups, or service principals in your managing tenant:

- [Microsoft Sentinel Reader](../../role-based-access-control/built-in-roles.md#microsoft-sentinel-reader)
- [Microsoft Sentinel Responder](../../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder)
- [Microsoft Sentinel Contributor](../../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor)

You may also want to assign additional built-in roles to perform additional functions. For information about specific roles that can be used with Microsoft Sentinel, see [Roles and permissions in Microsoft Sentinel](../../sentinel/roles.md).

Once you've onboarded your customers, designated users can log into your managing tenant and [directly access the customer's Microsoft Sentinel workspace](../../sentinel/multiple-tenants-service-providers.md#how-to-access-microsoft-sentinel-in-managed-tenants) with the roles that were assigned.

## View and manage incidents across workspaces

If you work with Microsoft Sentinel resources for multiple customers, you can view and manage incidents in multiple workspaces across different tenants at once. For more information, see [Work with incidents in many workspaces at once](../../sentinel/multiple-workspace-view.md) and [Extend Microsoft Sentinel across workspaces and tenants](../../sentinel/extend-sentinel-across-workspaces-tenants.md).

> [!NOTE]
> Be sure that the users in your managing tenant have been assigned both read and write permissions on all of the manage workspaces. If a user only has read permissions on some workspaces, warning messages may appear when selecting incidents in those workspaces, and the user won't be able to modify those incidents or any others selected along with them (even if the user has write permissions for the others).

## Configure playbooks for mitigation

[Playbooks](../../sentinel/tutorial-respond-threats-playbook.md) can be used for automatic mitigation when an alert is triggered. These playbooks can be run manually, or they can run automatically when specific alerts are triggered. The playbooks can be deployed either in the managing tenant or the customer tenant, with the response procedures configured based on which tenant's users should take action in response to a security threat.

## Create cross-tenant workbooks

[Azure Monitor workbooks in Microsoft Sentinel](../../sentinel/monitor-your-data.md) help you visualize and monitor data from your connected data sources to gain insights. You can use the built-in workbook templates in Microsoft Sentinel, or create custom workbooks for your scenarios.

You can deploy workbooks in your managing tenant and create at-scale dashboards to monitor and query data across customer tenants. For more information, see [Cross-workspace workbooks](../../sentinel/extend-sentinel-across-workspaces-tenants.md#using-cross-workspace-workbooks).

You can also deploy workbooks directly in an individual managed tenant for scenarios specific to that customer.

## Run Log Analytics and hunting queries across Microsoft Sentinel workspaces

Create and save Log Analytics queries for threat detection centrally in the managing tenant, including [hunting queries](../../sentinel/extend-sentinel-across-workspaces-tenants.md#hunt-across-multiple-workspaces). These queries can be run across all of your customers' Microsoft Sentinel workspaces by using the Union operator and the [workspace() expression](../../azure-monitor/logs/workspace-expression.md).

For more information, see [Cross-workspace querying](../../sentinel/extend-sentinel-across-workspaces-tenants.md#query-multiple-workspaces).

## Use automation for cross-workspace management

You can use automation to manage multiple Microsoft Sentinel workspaces and configure [hunting queries](../../sentinel/hunting.md), playbooks, and workbooks. For more information, see [Cross-workspace management using automation](../../sentinel/extend-sentinel-across-workspaces-tenants.md#manage-multiple-workspaces-using-automation).

## Monitor security of Office 365 environments

Use Azure Lighthouse in conjunction with Microsoft Sentinel to monitor the security of Office 365 environments across tenants. First, enable out-of-the box [Office 365 data connectors](../../sentinel/data-connectors/office-365.md) in the managed tenant. Information about user and admin activities in Exchange and SharePoint (including OneDrive) can then be ingested to a Microsoft Sentinel workspace within the managed tenant. This information includes details about actions such as file downloads, access requests sent, changes to group events, and mailbox operations, along with details about the users who performed those actions. [Office 365 DLP alerts](https://techcommunity.microsoft.com/t5/azure-sentinel/ingest-office-365-dlp-events-into-azure-sentinel/ba-p/1031820) are also supported as part of the built-in Office 365 connector.

You can use the [Microsoft Defender for Cloud Apps connector](../../sentinel/data-connectors/microsoft-defender-for-cloud-apps.md) to stream alerts and Cloud Discovery logs into Microsoft Sentinel. This connector offers visibility into cloud apps, provides sophisticated analytics to identify and combat cyberthreats, and helps you control how data travels. Activity logs for Defender for Cloud Apps can be [consumed using the Common Event Format (CEF)](https://techcommunity.microsoft.com/t5/azure-sentinel/ingest-box-com-activity-events-via-microsoft-cloud-app-security/ba-p/1072849).

After setting up Office 365 data connectors, you can use cross-tenant Microsoft Sentinel capabilities such as viewing and analyzing the data in workbooks, using queries to create custom alerts, and configuring playbooks to respond to threats.

## Protect intellectual property

When working with customers, you may want to protect the intellectual property you've developed in Microsoft Sentinel, such as Microsoft Sentinel analytics rules, hunting queries, playbooks, and workbooks. There are different methods you can use to ensure that customers don't have complete access to the code used in these resources.

For more information, see [Protecting MSSP intellectual property in Microsoft Sentinel](../../sentinel/mssp-protect-intellectual-property.md).

## Next steps

- Learn about [Microsoft Sentinel](../../sentinel/overview.md).
- Review the [Microsoft Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/).
- Explore [MicrosoftSentinel All-in-One](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/Sentinel-All-In-One), a project to speed up deployment and initial configuration tasks of a Microsoft Sentinel environment.
- Learn about [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).
