---
title: Configure data retention for logs in Microsoft Sentinel or Azure Monitor
description: In this tutorial, you'll configure an archive policy for a table in a Log Analytics workspace. 
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

Retention policies in a Log Analytics workspace define when to migrate data tables in the workspace to low-cost, minimal-access *auxiliary retention* (formerly known as archive) plans. By default, all tables in your workspace inherit the workspace's *interactive retention* setting and have no auxiliary retention (archive) policy. You can modify the interactive and auxiliary retention policies of individual tables, except for workspaces in the legacy Free Trial pricing tier.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set the retention policy for a table
> * Review interactive and auxiliary retention policies

## Prerequisites

To complete the steps in this tutorial, you must have the following resources and roles.

- Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure account with the following roles:

  | Built-in Role | Scope | Reason |
  | ------------- | ----- | ------ | 
  | [Log Analytics Contributor](../role-based-access-control/built-in-roles.md) | Any of<ul><li>Subscription<li>Resource group<li>Table | To set retention policy on tables in Log Analytics |

- Log Analytics workspace.

## Review interactive and auxiliary retention policies

On the **Tables** page for the table you updated, review the field values for **Interactive retention** and **Total retention period**. The auxiliary retention (archive) period equals the total retention period in days minus the interactive retention in days. For example, you set the following values:

   | Field | Value |
   | ----- | ----- |
   | Interactive retention | 90 days |
   | Total retention period | 1.1 years |

So the **Tables** page shows the following an archive period of 310 days.

:::image type="content" source="media/configure-data-retention/data-retention-archive-period.png" alt-text="Screenshot of the table view that shows the interactive retention and archive period columns.":::

## Set the retention policy for a table

In your Log Analytics workspace, clear the **Use default workspace settings** setting if you want to change the interactive retention period from its default of 31 days (90 days for Microsoft Sentinel workspaces). Then, change the total retention policy for a table like **SecurityAlert** to 3 years of data. The *total retention* period is the sum of the *interactive* and *auxiliary* (archive) retention periods.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, search for and open **Log Analytics workspaces**.
1. Select the appropriate workspace.
1. Under **Settings**, select **Tables**.
1. On a table like **SecurityAlert**, open the context menu (...).
1. Select **Manage table**.
   :::image type="content" source="media/configure-data-retention/data-retention-tables.png" alt-text="Screenshot of the manage table option on the context menu for a table in the tables view.":::
1. Under **Data retention**, enter the following values.

   | Field | Value |
   | ----- | ----- |
   | Use default workspace settings | Clear the checkbox |
   | Interactive retention | 120 days |
   | Total retention period | 3 years |

   :::image type="content" source="media/configure-data-retention/data-retention-settings.png" alt-text="Screenshot of the data retention settings that shows the changes to the fields under the data retention section.":::

1. Select **Save**.

## Clean up resources

No resources were created but you might want to restore the data retention settings you changed.

## Next steps

> [!div class="nextstepaction"]
> [Configure data retention and archive policies in Azure Monitor Logs](../azure-monitor/logs/data-retention-archive.md?tabs=portal-1%2cportal-2)
