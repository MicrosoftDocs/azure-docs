---
title: Configure table settings in Microsoft Defender Portal (Preview)
ms.service: unified-secops-platform
description: Configure log table settings in Microsoft Defender Portal to optimize security operations and cost efficiency.
ms.reviewer: dzatakovi
ms.author: guywild
author: guywi-ms
ms.topic: conceptual
ms.date: 05/06/2025
# Customer intent: As an IT administrator or subscription owner, I want to manage log table tiers and retention settings in Microsoft Defender Portal to optimize security operations needs and cost efficiency.
---

# Configure table settings in Microsoft Defender Portal (Preview)

This article explains how to configure table retention and tier settings for Microsoft Sentinel and Defender XDR services in the Defender portal. 

For more information about how data tiers and retention work, see [Manage data tiers and retention in Microsoft Defender Portal (Preview)](manage-data-overview.md).

## Permissions required

Sentinel workspace permissions let you view or manage tables in specific Sentinel workspaces, while unified RBAC permissions apply to all Sentinel workspaces in the Defender portal.

| Action                  | Unified role-based access control (RBAC) in the Defender portal                                                                                           | Sentinel workspace permissions                                                                                      |
|:------------------------|:----------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------|
| View table settings     | `Security data basics (read)` permissions under the `Security operations` permissions group                                                               | `Microsoft.OperationalInsights/workspaces/tables/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](/azure/azure-monitor/logs/manage-access#log-analytics-reader), for example. |
| Configure table settings| `Data (manage)` permissions under the `Data operations` permissions group| `Microsoft.OperationalInsights/workspaces/write` and `Microsoft.OperationalInsights/workspaces/tables/write` permissions to the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](/azure/azure-monitor/logs/manage-access#log-analytics-contributor), for example. |

For more information about unified RBAC in the Defender portal, see [Microsoft Defender XDR Unified role-based access control (RBAC)](/defender-xdr/manage-rbac).

For more information about Sentinel workspace permissions, see [Roles and permissions in the Microsoft Sentinel platform](roles.md).

## Manage table settings

To view and manage table settings in the Microsoft Defender portal:

1. Select **System** > **Data management** > **Table management** from the left navigation pane.

    The **Table Management** screen lists all the tables you can manage in the Microsoft Defender portal and the settings of each table. 

    :::image type="content" source="media/manage-data-overview/view-table-properties-microsoft-defender-portal.png" lightbox="media/manage-data-overview/view-table-properties-microsoft-defender-portal.png" alt-text="Screenshot that shows the Table Management screen in the Defender portal.":::  

    The workspace column shows the Sentinel workspace in which a Sentinel or custom table is stored. 

1. To manage Sentinel and custom tables in a different Sentinel workspace, select the workspace name at the top left corner of the screen to switch between workspaces.

1. Select a table on the **Table Management** screen.

    This opens the table details side panel with more information about the table, including the table description, tier, and retention details.

    :::image type="content" source="media/manage-data-overview/table-management-microsoft-defender-portal.png" lightbox="media/manage-data-overview/table-management-microsoft-defender-portal.png" alt-text="Screenshot that shows the table details side panel for the CommonSecurityLog table on the Table Management screen in the Defender portal.":::  

1. Select **Manage Table**.

    The **Manage table** screen lets you modify the table's retention settings in the current tier, and change the storage tier, if necessary. 

    :::image type="content" source="media/manage-data-overview/manage-table-settings-microsoft-defender-portal.png" lightbox="media/manage-data-overview/manage-table-settings-microsoft-defender-portal.png" alt-text="Screenshot that shows the Manage table screen for the CommonSecurityLog table in the Defender portal.":::  
    
    - **Analytics tier retention settings**:     
      - **Analytics retention**: 30 days to two years.
      - **Total retention**: Up to 12 years of long-term storage in the data lake. By default, Total retention is equal to Analytics retention, which means long-term retention isn't applied. To enable long-term retention, set Total retention to a value greater than Analytics retention. 
      
        Example: To retain six months of data in long-term retention total and 90 days of data in Analytics retention, set **Analytics retention** to 90 days and **Total retention** to 180 days.
    - **Data lake tier retention settings**: Set **Retention** to a value between 30 days and 12 years.  
    - **Tier changes**: If necessary, you can change tiers at any time based on your cost management and data usage needs.

      > [!NOTE]
      > Tier changes aren't available for all tables. For example: 
      > - MSG tables are only available in the Date lake tier
      > - XDR and Sentinel solution tables are only available in the Analytics tier because Microsoft security services require the data in these tables for near-real-time analytics. 

    For more information about retention and tier settings work, see [Manage data tiers and retention in Microsoft Defender Portal (Preview)](manage-data-overview.md).
    
1.	Review warnings and messages. These messages help you understand important implications of changing table settings. 

    For example:
    -	Increased retention is likely to lead to increased data cost.
    -	Changing from the Analytics to the Data lake tier causes features that rely on Analytics data to stop functioning. 

1. Select **Save** to apply the new settings.

## Next steps

Learn more about:

- [Microsoft Sentinel data lake](https://aka.ms/sentinel-lake-overview)
- [KQL jobs in Microsoft Sentinel](https://aka.ms/kql-jobs)

