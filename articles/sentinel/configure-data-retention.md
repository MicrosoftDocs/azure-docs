---
title: Configure data retention for a table in Microsoft Sentinel and Azure Monitor
description: Set a retention policy for a table in a Log Analytics workspace. 
author: cwatson-cat
ms.author: cwatson
ms.service: microsoft-sentinel
ms.topic: tutorial 
ms.date: 09/02/2-22
ms.custom: template-tutorial
---

# Tutorial: Configure a data retention policy for a table in a Log Analytics workspace

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

[Add your introductory paragraph]

<!-- 3. Tutorial outline 
Required. Use the format provided in the list below.
-->

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set the retention policy for a table


<!-- 4. Prerequisites 
Required. First prerequisite is a link to a free trial account if one exists. If there 
are no prerequisites, state that no prerequisites are needed for this tutorial.
-->

## Prerequisites

- <!-- An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F). -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->

<!-- 5. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->
To complete the steps in this tutorial, you must have the following resources and roles.

- Log Analytics workspace.

## Set the retention policy for a table
<!-- Introduction paragraph -->

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, search for and open **Log Analytics workspaces".
1. Select the appropriate workspace.
1. Under **Settings**, select **Tables**.
1. On a table like **Syslog**, open the context menu (...).
1. Select **Manage table**.
1. Under **Data retention**, enter the following values.

   |Field |Value  |
   |---------|---------|
   |Workplace settings     | Clear the checkbox        |
   |Interactive retention    |  30 days       |
   |Total retention period     |     60 days    |

1. Select **Save**.


## Review data retention and archive policy

On the **Tables** page for the table you updated, review the field values for **Interactive retention** and **Archive period**. The archive period equals the total retention period in days minus the interactive retention in days. For example, you set the following values:

   |Field |Value  |
   |---------|---------|
   |Interactive retention    |  30 days       |
   |Total retention period     |     60 days    |

So the **Table** page shows the following an archive period of 30 days.


## Clean up resources

No resources were created but you might want to restore the data retention settings you changed.

## Next steps

> [!div class="nextstepaction"]
> [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview)