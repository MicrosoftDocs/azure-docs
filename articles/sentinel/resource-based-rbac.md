---
title: Implement resource-centric role-based access control (resource-centric RBAC) in Azure Sentinel | Microsoft Docs
description: This article explains how to implement resource-centric, role-based access control (resource-centric RBAC) for Azure Sentinel. Resource-centric RBAC enables you to provide access to specific resources only, without the entire Azure Sentinel experience.
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/16/2021
ms.author: bagol

---

objects in 

# Resource-centric RBAC for Azure Sentinel

Typically, users who have access to an Azure Sentinel workspace also have access to all the workspace data, such as both security and performance content. Administrators can use [Azure roles](roles.md) to configure access to specific features in Azure Sentinel, depending on the access requirements in their team.

However, you may have some users who need to access only specific data in your Azure Sentinel workspace, but shouldn't have access to the entire Azure Sentinel environment. For example, you may want to allow your performance team to view performance data only.

In such cases, we recommend that you configure your role-based access control (RBAC) based on the resources allowed to your users instead of providing them with access to the Azure Sentinel workspace or specific Azure Sentinel features. Users are able to view data only in resources or resource groups where the users have access.

Resource-centric RBAC enables users to view logs and workbooks using the following methods, instead of via Azure Sentinel:

- **Via the resource itself**, such as an Azure Virtual Machine. Use this method to view logs and workbooks for a specific resource only.
- **Via Azure Monitor**. Use this method when you want to create queries that span multiple resources and/or resource groups. When navigating to logs and workbooks in Azure Monitor, define your scope to one or more specific resource groups or resources.

> [!NOTE]
> If your data is not an Azure resource, such as Syslog, CEF, or AAD data, or data collected by a custom collector, you'll need to manually configure the resource ID that's used to identify the data and enable access.
>
> For more information, see [Manually configure resource-centric RBAC](#manually-configure-resource-centric-rbac).
>
## Scenarios for resource-centric RBAC

The following table highlights the scenarios where resource-centric RBAC is most helpful. Note the differences in access requirements between security operations (SOC) teams and non-SOC teams.

|  |SOC team  |Non-SOC team  |
|---------|---------|---------|
|**Permissions**     | The entire workspace        |   Specific resources only      |
|**Data access**     |  All data in the workspace       | Only data for resources that the team is authorized to access        |
|**Experience**     |  The full Azure Sentinel experience, possibly limited by the [functional permissions](roles.md) assigned to the user       |  Log queries and Workbooks only       |
|     |         |         |

If your team has similar access requirements to the non-SOC team described in the table above, resource-centric RBAC may be a good solution for your organization.


## Manually configure resource-centric RBAC

1. In Azure Monitor, enable resource-centric RBAC as described in the [Azure Monitor documentation](/azure/azure-monitor/platform/manage-access).

1. [Create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal) for each team of users who needs to access your resources without the entire Azure Sentinel environment.

    Assign [log reader permissions](/azure/azure-monitor/platform/manage-access#resource-permissions) for each of the team members.

1. Assign resources to the resource team groups you created, and tag events with the relevant resource IDs.

    When Azure resources send data to Azure Sentinel, the log records are automatically tagged with the resource ID of the data source.

    > [!TIP]
    > We recommend that you group the resource uou are granting access for under a specific resource group created for the purpose.
    >
    > If you can't, make sure that your team has log reader permissions directly to the resources you want them to access.
    >

    For more information about resource IDs, see:

    - [Resource IDs with log forwarding](#resource-ids-with-log-forwarding)
    - [Resource IDs with Logstash collection](#resource-ids-with-logstash-collection)
    - [Resource IDs with the Log Analytics API collection](#resource-ids-with-the-log-analytics-api-collection)

Users with resource-centric RBAC can access logs and workbooks via a parent resource group or via Azure Monitor. Azure Monitor also enables users to select the scope of the query or workbook, spanning multiple resource groups, and optionally selecting specific resources.

### Resource IDs with log forwarding

When events are collected using [Common Event Format (CEF](connect-common-event-format.md) or [Syslog](connect-syslog.md), log forwarding is used to collect events from multiple source systems.

For example, when a Syslog forwarding VM listens for the sources sending Syslog events, and forwards them to Azure Sentinel, the log forwarding resource ID is assigned to all the events they forward.

If you have multiple teams, make sure that you have separate log forwarding VMs processing the events for each separate team.

For example, separating your VMs ensures that Syslog events that belong to Team A are collected using the collector VM A.

> [!TIP]
> When using an on-premises VM or a separate cloud VM as your log forwarder, ensure that it has a resource ID by implementing [Azure Arc](/azure/azure-arc/servers/overview).
>
> To scale your log fowarding VM environment, consider creating a [VM scale set](https://techcommunity.microsoft.com/t5/azure-sentinel/scaling-up-syslog-cef-collection/ba-p/1185854) to collect your CEF and Sylog logs.


### Resource IDs with Logstash collection

If you are collecting your data using the Azure Sentinel [Logstash output plugin](connect-logstash.md), use the **x-ms-AzureResourceId** header parameter to configure your custom collector to include the resource ID in your output.

<!--For example:
needs example
-->

### Resource IDs with the Log Analytics API collection

When collecting using the [Log Analytics data collector API](/azure/azure-monitor/platform/data-collector-api), you can assign to events with a resource ID using the HTTP [*x-ms-AzureResourceId*](/azure/azure-monitor/platform/data-collector-api#request-headers) request header.

If you are using resource-centric RBAC and want the events collected by API to be available to specific users, use the resource ID of the resource group you [created for your users](#implementing-resource-base-rbac).

## Alternative methods for implementing resource-centric RBAC

Depending on the permissions required in your organization, manually configuring a resource ID to use with resource-centric RBAC may not provide a full solution.

The following list describes scenarios where other solutions for data access may fit your requirements better:


- **A subsidiary has a SOC team that requires a full Azure Sentinel experience**. In this case, use a [multi-workspace architecture](https://www.youtube.com/watch?v=_mm3GNwPBHU&feature=youtu.be) to separate your data permissions.

    Create multiple Azure Sentinel workspaces, and provide access

The following table describes other methods for providing access to specific data only, and ensuring that security data is available only to those who need it.

|Scenario  |Method  |
|---------|---------|
|A subsidiary has a SOC team that requires a full Azure Sentinel experience     |Use a [multi-workspace architecture](https://www.youtube.com/watch?v=_mm3GNwPBHU&feature=youtu.be) to separate your data permissions.         |
|You want to set controls on each table in Azure Sentinel     |  Use [table-based RBAC](table-based-rbac.md) to define permissions for each table.     |
|Provide only selected information to users     | Provide access to data using built-in integration with [Power BI dashboards and reports](/azure/azure-monitor/platform/powerbi).       |
|  Limit access based on the specific users referenced by an event   | **Example**: Limit access to Office 365 logs based on a user's subsidiary. <br><br>Use one of the following methods: <br>- Use data-based RBAC and custom-based collection <br>- Enrich the relevant log with the subsidiary information. In this case, you can use the enriched data in workbooks to ensure that each non-SOC team gets access to a workbook that is pre-filtered to display relevant data only.  <!--not sure if we should include this-->     |

## Next steps

For more information, see [Roles and permissions in Azure Sentinel](roles.md).
