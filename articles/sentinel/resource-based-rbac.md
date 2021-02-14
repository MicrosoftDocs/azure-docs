---
title: Implement resource-based RBAC in Azure Sentinel | Microsoft Docs
description: This article explains how to implement resource-based, role-based access control (resource-based RBAC) for Azure Sentinel. Resource-based RBAC enables you to provide access to specific resources only, without the entire Azure Sentinel experience.
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
ms.date: 02/14/2021
ms.author: bagol

---

# Resource-based RBAC for Azure Sentinel

Typically, users who have access to an Azure Sentinel workspace also have access to all its resources, using [Azure roles](roles.md).

You may need to grant access to specific resources in your workspace for users who should not have access to the entire Azure Sentinel environment.

In such cases, we recommend that you use resource-based, role-based access control (resource-based RBAC) to provide access only to the required resources.

## Scenarios for resource-based RBAC

The following table describes the access requirements for security operations center (SOC) teams and non-SOC teams, highlighting the scenarios when resource-based RBAC is most helpful:

|  |SOC team  |Non-SOC team  |
|---------|---------|---------|
|**Permissions**     | The entire workspace        |   Specific resources only      |
|**Data access**     |  All data in the workspace       | Only data for resources that the team is authorized to access        |
|**Experience**     |  The full Azure Sentinel experience, possibly limited by the [functional permissions](roles.md) assigned to the user       |  Log queries and Workbooks only       |
|     |         |         |

## Implementing resource-base RBAC

1. In Azure Monitor, enable resource-based RBAC as described in the [Azure Monitor documentation](/azure/azure-monitor/platform/manage-access).

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

    - [Tag events using log forwarding](#tag-events-using-log-forwarding)
    - [Resource RBAC for custom collection](#resource-rbac-for-custom-collection)

Users with resource-based RBAC can access logs and workbooks via a parent resource group or via Azure Monitor. Azure Monitor also enables users to select the scope of the query or workbook, spanning multiple resource groups, and optionally selecting specific resources.

## Tag events using log forwarding

When events are collected using [Common Event Format (CEF](connect-common-event-format.md) or [Syslog](connect-syslog.md), log forwarding is used to collect events from multiple source systems.

For example, when a Syslog collector VM listens for the sources sending Syslog events, and forwards them to Azure Sentinel, the log forwarding resource ID is assigned to all the events they forward.

If you have multiple teams, make sure that you have separate log forwarding VMs processing the events for each separate team. 

For example, separating your VMs ensures that Syslog events that belong to Team A are collected using the collector VM A.

> [!TIP]
> When using an on-premises VM or a separate cloud VM as your log forwarder, ensure that it has a resource ID by implementing [Azure Arc](/azure/azure-arc/servers/overview).
>
> To scale your log fowarding VM environment, consider creating a [VM scale set](https://techcommunity.microsoft.com/t5/azure-sentinel/scaling-up-syslog-cef-collection/ba-p/1185854) to collect your CEF and Sylog logs.

## Resource RBAC for custom collection

When collecting using the [Log Analytics data collector API](/azure/azure-monitor/platform/data-collector-api), you can assign to events with a resource ID using a the HTTP [*x-ms-AzureResourceId*](/azure/azure-monitor/platform/data-collector-api#request-headers) request header.

If you are using resource-based RBAC and want the events collected by API to be available to specific users, use the resource ID of the resource group you [created for your users](#implementing-resource-base-rbac).

## Alternate methods for controlling access to resources

Resource-based RBAC may not provide a full solution for other scenarios. In such cases, use one of the following methods:

|Scenario  |Method  |
|---------|---------|
|A subsidiary has a SOC team that requires a full Azure Sentinel experience     |Use a [multi-workspace architecture](https://www.youtube.com/watch?v=_mm3GNwPBHU&feature=youtu.be) to separate your data permissions.         |
|You want to set controls on each table in Azure Sentinel     |  Use [table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043) to define permissions for each table.     |
|Provide only selected information to users     | Provide access to data using built-in integration with [PowerBi dashboards and reports](/azure/azure-monitor/platform/powerbi).       |
|  Limit access based on the specific users referenced by an event   | **Example**: Limit access to Office 365 logs based on a user's subsidiary. <br><br>Use one of the following methods: <br>- Use data-based RBAC and custom-based collection <br>- Enrich the relevant log with the subsidiary information. In this case, you can use the enriched data in workbooks to ensure that each non-SOC team gets access to a workbook that is pre-filtered to display relevant data only.  <!--not sure if we should include this-->     |

## Next steps

For more information, see [Roles and permissions in Azure Sentinel](roles.md).
