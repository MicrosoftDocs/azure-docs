---
title: Azure Active Directory activity logs in Azure Monitor
description: Introduction to Azure Active Directory activity logs in Azure Monitor
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: report-monitor
ms.date: 06/26/2023
ms.author: sarahlipsey
ms.reviewer: besiler
ms.collection: M365-identity-device-management
---
# Azure AD activity logs in Azure Monitor

Using **Diagnostic settings** in Azure Active Directory (Azure AD), you can route activity logs to several endpoints for long term retention and data insights. You can archive logs for storage, integrate with Security Information and Event Management (SIEM) tools, and integrate logs with Azure Monitor logs.

With the Azure Monitor logs integration you can enable rich visualizations, monitoring, and alerting on the connected data. Log Analytics provides enhanced query and analysis capabilities for Azure AD activity logs. This article focuses on the requirements, settings, and cost considerations for sending Azure AD activity logs to Azure Monitor.
## Supported reports

The following logs can be integrated with one of many endpoints, including Azure Monitor logs.

* The [**audit logs activity report**](concept-audit-logs.md) gives you access to the history of every task that's performed in your tenant.
* With the [**sign-in activity report**](concept-sign-ins.md), you can determine who performed the tasks that are reported in the audit logs.
* With the [**provisioning logs**](../app-provisioning/application-provisioning-log-analytics.md), you can monitor which users have been created, updated, and deleted in all your third-party applications. 
* The [**risky users logs**](../identity-protection/howto-identity-protection-investigate-risk.md#risky-users) helps you monitor changes in user risk level and remediation activity. 
* With the [**risk detections logs**](../identity-protection/howto-identity-protection-investigate-risk.md#risk-detections), you can monitor user's risk detections and analyze trends in risk activity detected in your organization. 

## Getting started

To integrate Azure AD logs with Azure Monitor logs, you need the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, you can [sign up for a free trial](https://azure.microsoft.com/free/).
* An Azure AD Free, Basic, or Premium P1/P2 license. For more information, see [Azure AD pricing](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).
* One of the following roles in Azure Active Directory (if you're accessing Log Analytics through Azure portal):
    - Security Administrator
    - Security Reader
    - Reports Reader
    - Global Administrator
* A [Log Analytics workspace](../../azure-monitor/logs/log-analytics-workspace-overview.md) in your Azure subscription. Learn how to [create a Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md).
*  An Azure [Role-based access control](../../azure-monitor/logs/manage-access.md#azure-rbac) role for the Log Analytics workspace.

## Cost considerations

There is a cost for collecting data in a Log Analytics workspace, archiving data in a storage account, or streaming logs to an event hub. The amount of data and the cost incurred can vary significantly depending on the tenant size, the amount of Conditional Access policies in use, and even the time of day.

Because the size and cost for sending logs to Azure Monitor is difficult to predict, the most accurate way to determine your expected costs is to route your logs to Azure Monitor for one day. With this snapshot you can get an accurate prediction for your expected costs.

Additional considerations for sending Azure AD logs to Azure Monitor are covered in the the following Azure Monitor cost details articles:

- [Azure Monitor Logs cost calculations and options](../../azure-monitor/logs/cost-logs.md)
- [Azure Monitor cost and usage](../../azure-monitor/usage-estimated-costs.md)
- [Optimize costs in Azure Monitor](../../azure-monitor/best-practices-cost.md)

Azure Monitor provides the option to exclude whole events, fields, or parts of fields when ingesting logs from Azure AD. Learn more about this cost saving feature in [Data collection transformation in Azure Monitor](../../azure-monitor/essentials/data-collection-transformations.md).

### Estimate your daily log size

To estimate the costs for your organization, we recommend gathering a sample of your logs, adjusting the sample to align with your tenant size and settings, then applying that sample to the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

The following factors could affect costs for your organization:

- Audit log events use around 2 KB of data storage
- Sign-in log events use on average 11.5 KB of data storage
- A tenant of about 100,000 users could incur about 1.5 million events per day
- Events are batched into about 5-minute intervals and sent as a single message that contains all the events within that time frame

If you haven't downloaded logs from the Azure portal, review the [How to download logs in Azure AD](howto-download-logs.md) article. Depending on the size of your organization, you may need to choose a different sample size to start your estimation. The following sample sizes are a good place to start:

- 1000 records
- For large tenants, 15 minutes of sign-ins
- For small to medium tenants, 1 hour of sign-ins

You should also consider the geographic distribution and peak hours of your users when you capture your data sample. If your organization is based in one region, it's likely that sign-ins peak around the same time. Adjust your sample size and when you capture the sample accordingly. Conditional Access policies may increase the size of sign-in logs, so the number of policies in place should also be factored into your sample.

With the data sample captured, multiply accordingly to find out how large the file would be for one day.

### Calculate estimated costs

From the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) landing page you can estimate the costs for a variety of products. Select one or all of the following calculators from the Pricing calculator landing page.

- **Storage**: Storage Accounts
- **Analytics**: Event Hubs
- **Security**: Microsoft Sentinel
- **Dev Ops** or **Management and governance**: Azure Monitor

Once you have an estimate for the GB/day that will be sent to Azure Monitor or another endpoint, enter that value in the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/). 

![Screenshot of the Azure pricing calculator, with 8 GB/Day used as an example.](media/concept-activity-logs-azure-monitor/azure-pricing-calculator-values.png)

## Next steps

* [Create a storage account](../../storage/common/storage-account-create.md)
* [Archive activity logs to a storage account](quickstart-azure-monitor-route-logs-to-storage-account.md)
* [Route activity logs to an event hub](./tutorial-azure-monitor-stream-logs-to-event-hub.md)
* [Integrate activity logs with Azure Monitor](howto-integrate-activity-logs-with-log-analytics.md)
