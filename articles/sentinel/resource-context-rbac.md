---
title: Manage access to Microsoft Sentinel data by resource
description: This article explains you can manage access to Microsoft Sentinel data by the resources a user can access. Managing access by resource enables you to provide access to specific data only, without the entire Microsoft Sentinel experience. This method is also known as resource-context RBAC.
author: limwainstein
ms.topic: conceptual
ms.date: 01/09/2023
ms.author: lwainstein
---

# Manage access to Microsoft Sentinel data by resource

Typically, users who have access to a Microsoft Sentinel workspace also have access to all the workspace data, including security content. Administrators can use [Azure roles](roles.md) to configure access to specific features in Microsoft Sentinel, depending on the access requirements in their team.

However, you may have some users who need to access only specific data in your Microsoft Sentinel workspace, but shouldn't have access to the entire Microsoft Sentinel environment. For example, you may want to provide a non-security operations (non-SOC) team with access to the Windows event data for the servers they own.

In such cases, we recommend that you configure your role-based access control (RBAC) based on the resources that are allowed to your users, instead of providing them with access to the Microsoft Sentinel workspace or specific Microsoft Sentinel features. This method is also known as setting up **resource-context RBAC**.

When users have access to Microsoft Sentinel data via the resources they can access instead of the Microsoft Sentinel workspace, they can view logs and workbooks using the following methods:

- **Via the resource itself**, such as an Azure Virtual Machine. Use this method to view logs and workbooks for a specific resource only.

- **Via Azure Monitor**. Use this method when you want to create queries that span multiple resources and/or resource groups. When navigating to logs and workbooks in Azure Monitor, define your scope to one or more specific resource groups or resources.

Enable resource-context RBAC in Azure Monitor. For more information, see [Manage access to log data and workspaces in Azure Monitor](../azure-monitor/logs/manage-access.md).

> [!NOTE]
> If your data is not an Azure resource, such as Syslog, CEF, or AAD data, or data collected by a custom collector, you'll need to manually configure the resource ID that's used to identify the data and enable access. For more information, see [Explicitly configure resource-context RBAC](#explicitly-configure-resource-context-rbac).
>
> Additionally, [functions](../azure-monitor/logs/functions.md) and saved searches are not supported in resource-centric contexts. Therefore, Microsoft Sentinel features such as parsing and [normalization](normalization.md) are not supported for resource-context RBAC in Microsoft Sentinel.
> 

## Scenarios for resource-context RBAC

The following table highlights the scenarios where resource-context RBAC is most helpful. Note the differences in access requirements between SOC teams and non-SOC teams.

| Requirement type |SOC team  |Non-SOC team  |
|---------|---------|---------|
|**Permissions**     | The entire workspace        |   Specific resources only      |
|**Data access**     |  All data in the workspace       | Only data for resources that the team is authorized to access        |
|**Experience**     |  The full Microsoft Sentinel experience, possibly limited by the [functional permissions](roles.md) assigned to the user       |  Log queries and Workbooks only       |


If your team has similar access requirements to the non-SOC team described in the table above, resource-context RBAC may be a good solution for your organization.

## Alternative methods for implementing resource-context RBAC

Depending on the permissions required in your organization, using resource-context RBAC may not provide a full solution.

The following list describes scenarios where other solutions for data access may fit your requirements better:

|Scenario  |Solution  |
|---------|---------|
|**A subsidiary has a SOC team that requires a full Microsoft Sentinel experience**.     |  In this case, use a multi-workspace architecture to separate your data permissions. <br><br>For more information, see: <br>- [Extend Microsoft Sentinel across workspaces and tenants](extend-sentinel-across-workspaces-tenants.md)<br>    - [Work with incidents in many workspaces at once](multiple-workspace-view.md)          |
|**You want to provide access to a specific type of event**.     |  For example, provide a Windows administrator with access to Windows Security events in all systems. <br><br>In such cases, use [table-level RBAC](https://techcommunity.microsoft.com/t5/azure-sentinel/table-level-rbac-in-azure-sentinel/ba-p/965043) to define permissions for each table.       |
| **Limit access to a more granular level, either not based on the resource, or to only a subset of the fields in an event**   |   For example, you might want to limit access to Office 365 logs based on a user's subsidiary. <br><br>In this case, provide access to data using built-in integration with [Power BI dashboards and reports](../azure-monitor/logs/log-powerbi.md).      |


## Explicitly configure resource-context RBAC

Use the following steps if you want to configure resource-context RBAC, but your data is not an Azure resource.

For example, data in your Microsoft Sentinel workspace that are not Azure resources include Syslog, CEF, or AAD data, or data collected by a custom collector.

**To explicitly configure resource-context RBAC**:

1. Make sure that you've [enabled resource-context RBAC](../azure-monitor/logs/manage-access.md) in Azure Monitor. 

1. [Create a resource group](../azure-resource-manager/management/manage-resource-groups-portal.md) for each team of users who needs to access your resources without the entire Microsoft Sentinel environment.

    Assign [log reader permissions](../azure-monitor/logs/manage-access.md#resource-permissions) for each of the team members.

1. Assign resources to the resource team groups you created, and tag events with the relevant resource IDs.

    When Azure resources send data to Microsoft Sentinel, the log records are automatically tagged with the resource ID of the data source.

    > [!TIP]
    > We recommend that you group the resources you are granting access for under a specific resource group created for the purpose.
    >
    > If you can't, make sure that your team has log reader permissions directly to the resources you want them to access.
    >

    For more information about resource IDs, see:

    - [Resource IDs with log forwarding](#resource-ids-with-log-forwarding)
    - [Resource IDs with Logstash collection](#resource-ids-with-logstash-collection)
    - [Resource IDs with the Log Analytics API collection](#resource-ids-with-the-log-analytics-api-collection)

### Resource IDs with log forwarding

When events are collected using [Common Event Format (CEF)](connect-common-event-format.md) or [Syslog](connect-syslog.md), log forwarding is used to collect events from multiple source systems.

For example, when a CEF or Syslog forwarding VM listens for the sources sending Syslog events, and forwards them to Microsoft Sentinel, the log forwarding VM resource ID is assigned to all the events they forward.

If you have multiple teams, make sure that you have separate log forwarding VMs processing the events for each separate team.

For example, separating your VMs ensures that Syslog events that belong to Team A are collected using the collector VM A.

> [!TIP]
> - When using an on-premises VM or another cloud VM, such as AWS, as your log forwarder, ensure that it has a resource ID by implementing [Azure Arc](../azure-arc/servers/overview.md).
> - To scale your log forwarding VM environment, consider creating a [VM scale set](https://techcommunity.microsoft.com/t5/azure-sentinel/scaling-up-syslog-cef-collection/ba-p/1185854) to collect your CEF and Sylog logs.


### Resource IDs with Logstash collection

If you are collecting your data using the Microsoft Sentinel [Logstash output plugin](connect-logstash.md), use the **azure_resource_id** field to configure your custom collector to include the resource ID in your output.

If you are using resource-context RBAC and want the events collected by API to be available to specific users, use the resource ID of the resource group you [created for your users](#explicitly-configure-resource-context-rbac).

For example, the following code shows a sample Logstash configuration file:

``` ruby
 input {
     beats {
         port => "5044"
     }
 }
 filter {
 }
 output {
     microsoft-logstash-output-azure-loganalytics {
       workspace_id => "4g5tad2b-a4u4-147v-a4r7-23148a5f2c21" # <your workspace id>
       workspace_key => "u/saRtY0JGHJ4Ce93g5WQ3Lk50ZnZ8ugfd74nk78RPLPP/KgfnjU5478Ndh64sNfdrsMni975HJP6lp==" # <your workspace key>
       custom_log_table_name => "tableName"
       azure_resource_id => "/subscriptions/wvvu95a2-99u4-uanb-hlbg-2vatvgqtyk7b/resourceGroups/contosotest" # <your resource ID>   
     }
 }
```

> [!TIP]
> You may want to add multiple `output` sections to differentiate the tags applied to different events.
>
### Resource IDs with the Log Analytics API collection

When collecting using the [Log Analytics data collector API](../azure-monitor/logs/data-collector-api.md), you can assign to events with a resource ID using the HTTP [*x-ms-AzureResourceId*](../azure-monitor/logs/data-collector-api.md#request-headers) request header.

If you are using resource-context RBAC and want the events collected by API to be available to specific users, use the resource ID of the resource group you [created for your users](#explicitly-configure-resource-context-rbac).



## Next steps

For more information, see [Permissions in Microsoft Sentinel](roles.md).
