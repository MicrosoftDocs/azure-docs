---
title: Manage Azure Sentinel workspaces at scale
description: Learn how to effectively manage Azure Sentinel on delegated customer resources.
ms.date: 06/17/2020
ms.topic: how-to
---

# Manage Azure Sentinel workspaces at scale

As a service provider, you may have onboarded multiple customer tenants to [Azure Lighthouse](../overview.md). Azure Lighthouse allows service providers to perform operations at scale across several Azure Active Directory (Azure AD) tenants at once, making management tasks more efficient.

Azure Sentinel delivers security analytics and threat intelligence, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response. With Azure Lighthouse, you can manage multiple Azure Sentinel workspaces across tenants at scale. This enables scenarios such as running queries across multiple workspaces, or creating workbooks to visualize and monitor data from your connected data sources to gain insights. IP such as queries and playbooks remain in your managing tenant, but can be used to perform security management in the customer tenants.

This topic provides an overview of how to use [Azure Sentinel](../../sentinel/overview.md) in a scalable way for cross-tenant visibility and managed security services.

## Architectural considerations

For a managed security service provider (MSSP) who wants to build a Security-as-a-service offering using Azure Sentinel, a single security operations center (SOC) may be needed to centrally monitor, manage, and configure multiple Azure Sentinel workspaces deployed within individual customer tenants. Similarly, enterprises with multiple Azure AD tenants may want to centrally manage multiple Azure Sentinel workspaces deployed across their tenants.

This centralized model of deployment has the following advantages:

- Ownership of data remains with each managed tenant.
- Supports requirements to store data within geographical boundaries.
- Ensures data isolation, since data for multiple customers isn't stored in the same workspace. 
- Prevents data exfiltration from the managed tenants, helping to ensure data compliance.
- Related costs are charged to each managed tenant, rather than to the managing tenant.
- Data from all data sources and data connectors that are integrated with Azure Sentinel (such as Azure AD Activity Logs, Office 365 logs, or Microsoft Threat Protection alerts) will remain within each customer tenant.
- Reduces network latency.
- Easy to add or remove new subsidiaries or customers.

## Granular role-based access control (RBAC)

Each customer subscription that an MSSP will manage must be [onboarded to Azure Lighthouse](onboard-customer.md). This allows designated users in the managing tenant to access and perform management operations on Azure Sentinel workspaces deployed in customer tenants.

When creating your authorizations, you can assign the Azure Sentinel built-in roles to users, groups, or service principals in your managing tenant:

- [Azure Sentinel reader](../../role-based-access-control/built-in-roles.md#azure-sentinel-reader)
- [Azure Sentinel responder](../../role-based-access-control/built-in-roles.md#azure-sentinel-responder)
- [Azure Sentinel contributor](../../role-based-access-control/built-in-roles.md#azure-sentinel-contributor)

You may also want to assign additional built-in roles to perform additional functions. For information about specific roles that can be used with Azure Sentinel, see [Permissions in Azure Sentinel](../../sentinel/roles.md).

Once you've onboarded your customers, designated users can log into your managing tenant and [directly access the customer's Azure Sentinel workspace](../../sentinel/multiple-tenants-service-providers.md) with the roles that were assigned.

## View and manage incidents across workspaces

If you are managing Azure Sentinel resources for multiple customers, you can view and manage incidents in multiple workspaces across multiple tenants at once. For more information, see [Work with incidents in many workspaces at once](../../sentinel/multiple-workspace-view.md) and [Extend Azure Sentinel across workspaces and tenants](../../sentinel/extend-sentinel-across-workspaces-tenants.md).

> [!NOTE]
> Be sure that the users in your managing tenant have been assigned read and write permissions on all the workspaces that are managed. If a user only has read permissions on some workspaces, warning messages may be shown when selecting incidents in those workspaces, and the user won't be able to modify those incidents or any others you've selected with those (even if you do have permissions for the others).

## Configure playbooks for mitigation

[Playbooks](../../sentinel/tutorial-respond-threats-playbook.md) can be used for automatic mitigation when an alert is triggered. These playbooks can be run manually, or they can run automatically when specific alerts are triggered. The playbooks can be deployed either in the managing tenant or the customer tenant, with the response procedures configured based on which tenant's users will need to take action in response to a security threat.

## Create cross-tenant workbooks

[Azure Monitor Workbooks in Azure Sentinel](../../sentinel/overview.md#workbooks) help you visualize and monitor data from your connected data sources to gain insights. You can use the built-in workbook templates in Azure Sentinel, or create custom workbooks for your scenarios.

You can deploy workbooks in your managing tenant and create at-scale dashboards to monitor and query data across customer tenants. For more information, see [Cross-workspace monitoring](../../sentinel/extend-sentinel-across-workspaces-tenants.md#using-cross-workspace-workbooks). Note that some capabilities are [not supported across multiple workspaces](../../sentinel/extend-sentinel-across-workspaces-tenants.md#whats-not-supported-across-workspaces).

You can also deploy workbooks directly in an individual tenant that you manage for scenarios specific to that customer.

## Run queries across Azure Sentinel workspaces

You can create and save Log Analytics queries for threat detection centrally in the managing tenant. These queries can then be run across all of your customers' Azure Sentinel workspaces by using the Union operator and the workspace () expression. For more information, see [Cross-workspace querying](../../sentinel/extend-sentinel-across-workspaces-tenants.md#cross-workspace-querying).

## Use automation for cross-workspace management

You can use automation to manage multiple Azure Sentinel workspaces and configure [hunting queries](../../sentinel/hunting.md), playbooks, and workbooks. For more information, see [Cross-workspace management using automation](../../sentinel/extend-sentinel-across-workspaces-tenants.md#cross-workspace-management-using-automation).

Note that some capabilities are [not currently supported across multiple workspaces](../../sentinel/extend-sentinel-across-workspaces-tenants.md#whats-not-supported-across-workspaces).

## Next steps

- Learn about [Azure Sentinel](../../sentinel/overview.md).
- Review the [Azure Sentinel pricing page](https://azure.microsoft.com/pricing/details/azure-sentinel/).
- Learn about [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).

