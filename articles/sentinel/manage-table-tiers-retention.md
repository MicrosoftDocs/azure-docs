---
title: Configure table settings in Microsoft Sentinel
description: Configure Microsoft Sentinel and Defender XDR table settings in Microsoft Defender Portal to optimize security operations and cost efficiency.
ms.reviewer: dzatakovi
ms.author: guywild
author: guywi-ms
ms.topic: conceptual
ms.date: 11/05/2025
# Customer intent: As an IT administrator or subscription owner, I want to manage Microsoft Sentinel and Defender XDR table tiers and retention settings in Microsoft Defender Portal to optimize security operations needs and cost efficiency.
---

# Configure table settings in Microsoft Sentinel

The Microsoft Defender portal provides a centralized experience for configuring table-level data retention and tier settings across Microsoft Sentinel and Microsoft Defender XDR. You can view and manage retention settings, switch between analytics and data lake tiers, and optimize data storage based on operational and cost requirements. 

This article explains how to configure retention and tier settings for tables in Microsoft Sentinel and Defender XDR in the Microsoft Defender portal. 

For more information about how data tiers and retention work, see [Manage data tiers and retention in Microsoft Sentinel](manage-data-overview.md).

## Prerequisites

- To manage Defender XDR hunting tables, you need to onboard to Microsoft Sentinel in the Defender portal. For more information, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard).

## Permissions required

Microsoft Sentinel workspace permissions let you view or manage tables in specific Microsoft Sentinel workspaces, while unified RBAC permissions apply to all Microsoft Sentinel workspaces in the Defender portal.

| Action                  | Unified role-based access control (RBAC) in the Defender portal                                                                                           | Microsoft Sentinel workspace permissions                                                                                      |
|:------------------------|:----------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------|
| View table settings     | `Security data basics (read)` permissions under the `Security operations` permissions group                                                               | `Microsoft.OperationalInsights/workspaces/tables/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](/azure/azure-monitor/logs/manage-access#log-analytics-reader), for example. |
| Configure table settings| `Data (manage)` permissions under the `Data operations` permissions group| `Microsoft.OperationalInsights/workspaces/write` and `Microsoft.OperationalInsights/workspaces/tables/write` permissions to the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](/azure/azure-monitor/logs/manage-access#log-analytics-contributor), for example. |

For more information about unified RBAC in the Defender portal, see [Microsoft Defender XDR Unified role-based access control (RBAC)](/defender-xdr/manage-rbac).

For more information about Microsoft Sentinel workspace permissions, see [Roles and permissions in the Microsoft Sentinel platform](roles.md).

## Manage table settings

To view and manage table settings in the Microsoft Defender portal, follow these steps:

1. Select **Microsoft Sentinel** > **Configuration** > **Tables** from the left navigation pane.

    The **Table** screen lists all the tables you can manage in the Microsoft Defender portal and the settings of each table. 

    :::image type="content" source="media/manage-data-overview/view-table-properties-microsoft-defender-portal.png" lightbox="media/manage-data-overview/view-table-properties-microsoft-defender-portal.png" alt-text="Screenshot that shows the Tables screen in the Defender portal.":::  

    The workspace column shows the Microsoft Sentinel workspace in which a Microsoft Sentinel or custom table is stored. 

1. To manage Microsoft Sentinel and custom tables in a different Microsoft Sentinel workspace, select the workspace name at the top left corner of the screen to switch between workspaces.

1. Select a table on the **Tables** screen.

    This action opens the table details side panel with more information about the table, including the table description, tier, and retention details.

    :::image type="content" source="media/manage-data-overview/table-management-microsoft-defender-portal.png" lightbox="media/manage-data-overview/table-management-microsoft-defender-portal.png" alt-text="Screenshot that shows the table details side panel for the CommonSecurityLog table on the Table Management screen in the Defender portal.":::  

1. Select **Manage table**.

    The **Manage table** screen lets you modify the table's retention settings in the current tier, and change the storage tier, if necessary. 

    :::image type="content" source="media/manage-data-overview/manage-table-settings-microsoft-defender-portal.png" lightbox="media/manage-data-overview/manage-table-settings-microsoft-defender-portal.png" alt-text="Screenshot that shows the Manage table screen for the CommonSecurityLog table in the Defender portal.":::  
    
    - **Analytics tier retention settings**:     
      - **Analytics retention**: 30 days to two years.
      - **Total retention**: Up to 12 years of long-term storage in the data lake. If you have Sentinel data lake, total retention represents retention of the data in the lake and by default is equal to analytics retention. For example, setting analytics retention to six months, also retains the data in the data lake for six months by default, at no extra cost.
      You can extend long-term retention in the lake for longer than the analytics tier retention. For example, setting analytics retention to six months and total retention to 1 year. Data lake retention is charged only for the duration beyond analytics retention, in this case 6 months.
    
    - **Data lake tier**: Set **Retention** to a value between 30 days and 12 years. Selecting **Data lake tier** stores data exclusively in the data lake.
    - **Tier changes**: If necessary, you can change tiers at any time based on your cost management and data usage needs.

      > [!NOTE]
      > Tier changes aren't available for all tables. For example, some XDR and Microsoft Sentinel solution tables must be available in the analytics tier because Microsoft security services require the data in these tables for near-real-time analytics. 

    For more information about retention and tier settings, see [Manage data tiers and retention in Microsoft Sentinel](manage-data-overview.md).
    
1.	Review warnings and messages. These messages help you understand important implications of changing table settings. 

    For example:
    - Increased retention is likely to lead to increased data cost.
    - Changing from the analytics to the data lake tier causes features that rely on analytics data to stop functioning such as:    
      - Alerting
      - Advanced hunting
      - Analytics rules
      - Custom detection rules
      

1. Select **Save** to apply the new settings.

## Next steps

Learn more about:

- [Microsoft Sentinel data lake](datalake/sentinel-lake-overview.md)
- [KQL jobs in Microsoft Sentinel](datalake/kql-jobs.md)

