---
title: Configure table settings in Microsoft Sentinel (preview)
description: Configure Microsoft Sentinel and Defender XDR table settings in Microsoft Defender Portal to optimize security operations and cost efficiency.
ms.reviewer: dzatakovi
ms.author: guywild
author: guywi-ms
ms.topic: conceptual
ms.date: 07/13/2025
# Customer intent: As an IT administrator or subscription owner, I want to manage Microsoft Sentinel and Defender XDR table tiers and retention settings in Microsoft Defender Portal to optimize security operations needs and cost efficiency.
---

# Configure table settings in Microsoft Sentinel (preview)

The Microsoft Defender portal provides a centralized experience for configuring table-level data retention and tier settings across Microsoft Sentinel and Microsoft Defender XDR. You can view and manage retention settings, switch between analytics and data lake tiers, and optimize data storage based on operational and cost requirements. 

This article explains how to configure retention and tier settings for tables in Microsoft Sentinel and Defender XDR in the Microsoft Defender portal. 

For more information about how data tiers and retention work, see [Manage data tiers and retention in Microsoft Sentinel (preview)](manage-data-overview.md).

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

To view and manage table settings in the Microsoft Defender portal:

1. Select **Microsoft Sentinel** > **Configuration** > **Tables** from the left navigation pane.

    The **Table** screen lists all the tables you can manage in the Microsoft Defender portal and the settings of each table. 

    :::image type="content" source="media/manage-data-overview/view-table-properties-microsoft-defender-portal.png" lightbox="media/manage-data-overview/view-table-properties-microsoft-defender-portal.png" alt-text="Screenshot that shows the Tables screen in the Defender portal.":::  

    The workspace column shows the Microsoft Sentinel workspace in which a Microsoft Sentinel or custom table is stored. 

1. To manage Microsoft Sentinel and custom tables in a different Microsoft Sentinel workspace, select the workspace name at the top left corner of the screen to switch between workspaces.

1. Select a table on the **Tables** screen.

    This opens the table details side panel with more information about the table, including the table description, tier, and retention details.

    :::image type="content" source="media/manage-data-overview/table-management-microsoft-defender-portal.png" lightbox="media/manage-data-overview/table-management-microsoft-defender-portal.png" alt-text="Screenshot that shows the table details side panel for the CommonSecurityLog table on the Table Management screen in the Defender portal.":::  

1. Select **Manage table**.

    The **Manage table** screen lets you modify the table's retention settings in the current tier, and change the storage tier, if necessary. 

    :::image type="content" source="media/manage-data-overview/manage-table-settings-microsoft-defender-portal.png" lightbox="media/manage-data-overview/manage-table-settings-microsoft-defender-portal.png" alt-text="Screenshot that shows the Manage table screen for the CommonSecurityLog table in the Defender portal.":::  
    
    - **Analytics tier retention settings**:     
      - **Analytics retention**: 30 days to two years.
      - **Total retention**: Up to 12 years of long-term storage in the data lake. By default, total retention is equal to analytics retention, which means long-term retention isn't applied. To enable long-term retention, set the total retention to a value greater than analytics retention. 
      
        Example: To retain six months of data in long-term retention total and 90 days of data in analytics retention, set **Analytics retention** to 90 days and **Total retention** to 180 days.
    - **Data lake tier retention settings**: Set **Retention** to a value between 30 days and 12 years.  
    - **Tier changes**: If necessary, you can change tiers at any time based on your cost management and data usage needs.

      > [!NOTE]
      > Tier changes aren't available for all tables. For example, XDR and Microsoft Sentinel solution tables must be available in the analytics tier because Microsoft security services require the data in these tables for near-real-time analytics. 

    For more information about retention and tier settings work, see [Manage data tiers and retention in Microsoft Sentinel (preview)](manage-data-overview.md).
    
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

- [Microsoft Sentinel data lake (preview)](datalake/sentinel-lake-overview.md)
- [KQL jobs in Microsoft Sentinel (preview)](datalake/kql-jobs.md)

