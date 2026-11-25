---
title: View Advisor recommendations
titleSuffix: Azure Workload Center for Oracle
description: Learn how to view Azure Advisor recommendations for the resources of an Oracle workload.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# View Advisor recommendations

Azure Workload Center for Oracle shows [Azure Advisor](/azure/advisor/advisor-overview) recommendations for the resources of a *Workload Virtual Instance (WVI)*. Azure Advisor is the Azure service that recommends configuration improvements. You can find reliability, security, and performance risks without leaving the workload view.

## Prerequisites

- Enroll your Oracle system as a WVI so that you can review recommendations for its resources.
- To view Advisor recommendations, use an account with the **Reader**, **Contributor**, or **Owner** role on the relevant resources, resource group, or subscription. Applying a recommendation requires permissions to change the affected resource. For details, see [Permissions in Azure Advisor](/azure/advisor/permissions).

## View recommendations for a workload

1.  Open the WVI and select **Workload validation** > **Advisor recommendations**. The **Overview** page of the WVI also shows the number of available recommendations.

2.  Review the recommendations and their impact.

3.  Select a recommendation to see the affected resources and the recommended action.

4.  Review the action and any linked guidance before changing the resource. Check how the change affects the Oracle application and database components, and schedule changes that might interrupt service for a maintenance window.

5.  Follow the recommendation's links to apply the change. Opening a recommendation doesn't apply it automatically.

## Prioritize and verify changes

Use the recommendation's impact and the role of the affected resource in your workload to decide what to address first. For example, review reliability recommendations for resources that support a production database before making changes to a development environment.

After you apply a recommendation, verify that the affected resource and its Oracle workload operate as expected. Advisor can take up to a day to recognize an applied change, so the recommendation might not disappear immediately. For more information about recommendation categories and refresh behavior, see [Azure Advisor overview](/azure/advisor/advisor-overview).

## Review configuration validation findings

Advisor recommendations and configuration validation findings are separate views. Advisor provides recommendations for Azure resources. [Configuration validation](configuration-validation.md) checks the workload against Azure and Oracle on Azure recommended practices and reports deviations.

Review both views when assessing a workload. To investigate a configuration deviation, see [Review configuration findings and manage checks](review-configuration-findings.md).
