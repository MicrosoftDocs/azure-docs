---
title: Configure data retention for logs in Microsoft Sentinel or Azure Monitor
description: In this tutorial, you'll configure a data retention policy for a table in a Log Analytics workspace. 
author: cwatson-cat
ms.author: cwatson
ms.service: microsoft-sentinel
ms.topic: tutorial 
ms.date: 01/05/2023
ms.custom: template-tutorial
#Customer intent: As an Azure account administrator, I want to archive older but less used data to save retention costs.
---

# Tutorial: Configure a data retention policy for a table in a Log Analytics workspace

In this tutorial, you'll set a retention policy for a table in your Log Analytics workspace that you use for Microsoft Sentinel or Azure Monitor. These steps allow you to keep older, less used data in your workspace at a reduced cost.

Retention policies in a Log Analytics workspace define when to transition old records in data tables in the workspace to the low-cost, minimal-access *long-term retention* (formerly known as archive) state. By default, all tables in your workspace inherit the workspace's *interactive retention* setting and have no long-term retention (archive) policy. You can modify the interactive and long-term retention policies of individual tables, except for workspaces in the legacy Free Trial pricing tier.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set the retention policy for a table
> * Review interactive and long-term retention policies

## Prerequisites

To complete the steps in this tutorial, you must have the following resources and roles.

- Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure account with the following roles:

  | Built-in Role | Scope | Reason |
  | ------------- | ----- | ------ | 
  | [Log Analytics Contributor](../role-based-access-control/built-in-roles.md) | Any of<ul><li>Subscription<li>Resource group<li>Table | To set retention policy on tables in Log Analytics |

- Log Analytics workspace.

## Set the retention policy for a table

In your Log Analytics workspace, change the interactive retention policy of the **SecurityEvent** table  from the workspace default of 90 days to 180 days, and the total retention policy to 3 years. The *total retention* period is the sum of the *interactive* and *long-term* (archive) retention periods.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, search for and open **Log Analytics workspaces**.

1. Select the appropriate workspace.

1. Under **Settings**, select **Tables**.

1. Find the **SecurityEvent** table in the list, and open the context menu (...).

1. Select **Manage table**.

   :::image type="content" source="media/configure-data-retention/data-retention-tables.png" alt-text="Screenshot of the manage table option on the context menu for a table in the tables view.":::

1. Under **Data retention settings**, enter the following values.

   | Field | Value |
   | ----- | ----- |
   | Interactive retention | 180 days |
   | Total retention period | 3 years |

   :::image type="content" source="media/configure-data-retention/data-retention-settings.png" alt-text="Screenshot of the data retention settings that shows the changes to the fields under the data retention section.":::

   See that the time graph shows that the long-term retention period equals the total retention period in days minus the interactive retention period in days. In this case, 915 days, or 2.5 years.

1. Select **Save**.

## Review interactive and total retention policies

On the **Tables** page for the table you updated, review the field values for **Interactive retention** and **Total retention**. 

:::image type="content" source="media/configure-data-retention/data-retention-archive-period.png" alt-text="Screenshot of the table view that shows the interactive retention and archive period columns.":::

## Clean up resources

No resources were created but you might want to restore the data retention settings you changed.

## Next steps

> [!div class="nextstepaction"]
> [Configure interactive and long-term data retention policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-configure.md)
