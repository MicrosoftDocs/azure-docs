---
title: Use SOC optimizations programmatically
description: Learn how to use Microsoft Sentinel SOC optimization recommendations programmatically.
ms.pagetype: security
ms.author: bagol
author: batamig
manager: raynew
ms.collection:
  - usx-security
ms.topic: concept-article
ms.date: 06/09/2024
appliesto:
  - Microsoft Sentinel in the Microsoft Defender portal
  - Microsoft Sentinel in the Azure portal
#customerIntent: As a SOC engineer, I want to learn about about how to interact with SOC optimziation recommendations programmatically via API.
---

# Using SOC optimizations programmatically (Preview)

Use the Microsoft Sentinel `recommendations` API to programmatically interact with SOC optimization recommendations, helping you to close coverage gaps against specific threats and tighten ingestion rates. You can get details about all current recommendations across your workspaces or a specific SOC optimization recommendation, or you can reevaluate a recommendation if you've made changes in your environment.

For example, use the `recommendations` API to:

- Build custom reports and dashboards. For example, see [Visualize custom SOC optimization data](#visualize-custom-soc-optimization-data).
- Integrate with third-party tools, such as for SOAR and ITSM services
- Get automated, real-time access to SOC optimization data, triggering evaluations and responding promptly to the suggestions

For customers or MSSPs managing multiple environments, the `recommendations` API provides a scalable way to handle recommendations across multiple workspaces. You can also export data from the API and store it externally for audit, archiving, or tracking trends.

> [!IMPORTANT]
> [!INCLUDE [unified-soc-preview-without-alert](../includes/unified-soc-preview-without-alert.md)]
>
> The `recommendations` API is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Get, update, or reevaluate recommendations

Use the following examples of the `recommendations` API to interact with SOC optimization recommendations programmatically:

- **Get a list of all current SOC optimization recommendations in your workspace**:

    ```rest
    GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/recommendations 
    ```

- **Get a specific recommendation by recommendation ID**:

    ```rest 
    GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/recommendations/{recommendationId} 
    ```

    Find a recommendation's ID value by first getting a list of all recommendations in your workspace.

- **Update a recommendation's status to *Active*, *In Progress*, *Completed*, *Dismissed*, or *Reactivate***:

    ```rest
    PATCH /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/recommendations/{recommendationId} 
    ```

- **Manually trigger an evaluation for a specific recommendation**: 

    ```rest
    POST /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/recommendations/{recommendationId} /triggerEvaluation 
    ```

## Visualize custom SOC optimization data

The **Microsoft Sentinel Optimization Workbook** uses the `recommendations` API to visualize SOC optimization data. Install and customize the workbook in your workspace to create your own custom SOC optimization dashboard.

In the **Microsoft Sentinel Optimization Workbooks**, select the **SOC Optimization** tab and expand the items under **Details** to drill down into to view SOC optimization data. Edit the workbook to modify the data shown as needed for your organization.

For example:

:::image type="content" source="media/soc-optimization-api/soc-optimization-workbook.png" alt-text="Screenshot of the Microsoft Sentinel Optimization Workbook."  lightbox="media/soc-optimization-api/soc-optimization-workbook.png":::

For more information, see:

- [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md)
- [Visualize and monitor your data by using workbooks in Microsoft Sentinel](../monitor-your-data.md).

## Related content

For more information, see:

- [Optimize your security operations](soc-optimization-access.md)
- [SOC optimization reference of recommendations](soc-optimization-reference.md)
- Blogs: [Introducing the SOC Optimization API](https://aka.ms/SocOptimizationAPI) | [Unlock the power of precision-driven security management](https://aka.ms/SOC_Optimization)
