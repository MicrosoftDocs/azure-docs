---
title: Implement table-based role-based access control (table-based RBAC) in Azure Sentinel | Microsoft Docs
description: This article explains how to implement table-based, role-based access control (table-based RBAC) for Azure Sentinel. table-based RBAC enables you to provide access to specific Azure Sentinel tables only, without the entire Azure Sentinel experience.
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
ms.date: 02/15/2021
ms.author: bagol

---

# Table-based RBAC for Azure Sentinel

Typically, users who have access to an Azure Sentinel workspace also have access to all its resources, using [Azure roles](roles.md).

However, you may have users who need access to specific tables collected by your Azure Sentinel workspace, but shouldn't have access to the entire Azure Sentinel environment.

For example, if your operations team manages the performance monitor workload, and needs access to performance log tables only, and not other sensitive data such as security event logs. Both the performance logs and the security event logs are stored on the same workspace.

In such cases, we recommend you use the table-based, role-based access control (resource-based RBAC). Table-based RBAC enables you to provide access only to the tables required by each team.

Table-based RBAC is supported for Azure Sentinel via Log Analytics.

## Implementing table-base RBAC

1. **Define a custom RBAC role to support your table permissions**. Use the following JSON as a template:

    ```json
    {
        "Name": "Contoso Performance Monitoring Team",
        "Id": null,
        "IsCustom": true,
        "Description": "Enable users to monitor Linux server performance logs",
        "Actions": [
            "Microsoft.OperationalInsights/workspaces/read",
            "Microsoft.OperationalInsights/workspaces/query/read",
            "Microsoft.OperationalInsights/workspaces/query/Perf/read"
        ],
        "NotActions": [
        ],
        "AssignableScopes": [
           "/subscriptions/8f153238-e602-xxxx-xxxx-3043fbe50918"
        ]
      }
    ```

    For more information, see the [Azure RBAC documentation](/azure/role-based-access-control/custom-roles).

1. **Add the custom role to your Azure subscription**. Run the [New-AzRoleDefinition](/powershell/module/az.resources/new-azroledefinition) command, pointing to the custom JSON file you created in the previous step.

    ``PowerShell
    New-AzRoleDefinition -InputFile "C:\Users\<user>\OneDrive\Demos\Custom_RBAC.json"
    ```

    The command output should be similar to the following:

    Name             : Perf Monitor Team
    Id               : ab403341-d1f6-4cea-ae97-aea203b895a1
    IsCustom         : True
    Description      : Enable users to monitor Linux server performance logs
    Actions          : {Microsoft.OperationalInsights/workspaces/read, Microsoft.OperationalInsights/workspaces/query/read, Microsoft.OperationalInsights/workspaces/query/Perf/read}
    NotActions       : {}
    DataActions      : {}
    NotDataActions   : {}
    AssignableScopes : {/subscriptions/8f153238-e602-427e-a7c0-xxxxxxx50918}

    > [!NOTE]
    > Running Azure PowerShell commands requires that you've installed the Azure PowerShell module. For more information, see [Install Azure PowerShell](/powershell/azure/install-az-ps).

1. In your Azure subscription, add your operations team users to your new custom role.

The configured users on your operations team can now access the logs they need via Log Analytics. They don't have the ability to access security event tables or any other tables in the Azure Sentinel workspace.

## Alternate methods for controlling access to resources

The following table describes other methods you can use to allow access to specific Azure Sentinel resources:

|Scenario  |Method  |
|---------|---------|
|A subsidiary has a SOC team that requires a full Azure Sentinel experience     |Use a [multi-workspace architecture](https://www.youtube.com/watch?v=_mm3GNwPBHU&feature=youtu.be) to separate your data permissions.         |
|You want to set controls for specific resources in  Azure Sentinel     |  Use [resource-based RBAC](resource-based-rbac.md) to define permissions for specific resources.     |
|Provide only selected information to users     | Provide access to data using built-in integration with [Power BI dashboards and reports](/azure/azure-monitor/platform/powerbi).       |
|  Limit access based on the specific users referenced by an event   | **Example**: Limit access to Office 365 logs based on a user's subsidiary. <br><br>Use one of the following methods: <br>- Use data-based RBAC and custom-based collection <br>- Enrich the relevant log with the subsidiary information. In this case, you can use the enriched data in workbooks to ensure that each non-SOC team gets access to a workbook that is pre-filtered to display relevant data only.  <!--not sure if we should include this-->     |

## Next steps

For more information, see [Roles and permissions in Azure Sentinel](roles.md).
