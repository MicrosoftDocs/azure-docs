---
title: Integrate security solutions in Azure Security Center | Microsoft Docs
description: Learn about how Azure Security Center integrates with partners to enhance the overall security of your Azure resources.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 6af354da-f27a-467a-8b7e-6cbcf70fdbcb
ms.service: security-center
ms.topic: conceptual
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/20/2019
ms.author: memildin

---
# Integrate security solutions in Azure Security Center
This document helps you to manage security solutions already connected to Azure Security Center and add new ones.

> [!NOTE]
> A subset of security solutions has been retired on July 31st, 2019. For more information and alternative services, see [Retirement of Security Center features (July 2019)](security-center-features-retirement-july2019.md#menu_solutions).

## Integrated Azure security solutions
Security Center makes it easy to enable integrated security solutions in Azure. Benefits include:

- **Simplified deployment**: Security Center offers streamlined provisioning of integrated partner solutions. For solutions like antimalware and vulnerability assessment, Security Center can provision the agent on your virtual machines. For firewall appliances, Security Center can take care of much of the network configuration required.
- **Integrated detections**: Security events from partner solutions are automatically collected, aggregated, and displayed as part of Security Center alerts and incidents. These events also are fused with detections from other sources to provide advanced threat-detection capabilities.
- **Unified health monitoring and management**: Customers can use integrated health events to monitor all partner solutions at a glance. Basic management is available, with easy access to advanced setup by using the partner solution.

Currently, integrated security solutions include vulnerability assessment by [Qualys](https://www.qualys.com/public-cloud/#azure) and [Rapid7](https://www.rapid7.com/products/insightvm/) and Microsoft Application Gateway Web application firewall.

> [!NOTE]
> Security Center does not install the Log Analytics agent on partner virtual appliances because most security vendors prohibit external agents running on their appliances.
>
>

## How security solutions are integrated
Azure security solutions that are deployed from Security Center are automatically connected. You can also connect other security data sources, including computers running on-premises or in other clouds.

![Partner solutions integration](./media/security-center-partner-integration/security-center-partner-integration-fig8.png)

## Manage integrated Azure security solutions and other data sources

1. Sign in to the [Azure portal](https://azure.microsoft.com/features/azure-portal/).

2. On the **Microsoft Azure menu**, select **Security Center**. **Security Center - Overview** opens.

3. Under the Security Center menu, select **Security solutions**.

   ![Security Center Overview](./media/security-center-partner-integration/overview.png)

In **Security solutions**, you can see the health of integrated Azure security solutions and run basic management tasks.

### Connected solutions

The **Connected solutions** section includes security solutions that are currently connected to Security Center. It also shows the health status of each solution.  

![Connected solutions](./media/security-center-partner-integration/security-center-partner-integration-fig4.png)

The status of a partner solution can be:

* Healthy (green) - no health issues.
* Unhealthy (red) - there's a health issue that requires immediate attention.
* Health issues (orange) - the solution has stopped reporting its health.
* Not reported (gray) - the solution hasn't reported anything yet and no health data is available. A solution's status may be unreported if it was connected recently and is still deploying.

> [!NOTE]
> If health status data is not available, Security Center shows the date and time of the last event received to indicate whether the solution is reporting or not. If no health data is available and no alerts were received within the last 14 days, Security Center indicates that the solution is unhealthy or not reporting.
>
>

1. Select **VIEW** for additional information and options such as:

   - **Solution console**. Opens the management experience for this solution.
   - **Link VM**. Opens the Link Applications page. Here you can connect resources to the partner solution.
   - **Delete solution**.
   - **Configure**.

   ![Partner solution detail](./media/security-center-partner-solutions/partner-solutions-detail.png)

### Discovered solutions

Security Center automatically discovers security solutions running in Azure but not connected to Security Center and displays the solutions in the **Discovered solutions** section. These  solutions include Azure solutions, like [Azure AD Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection), and partner solutions.

> [!NOTE]
> The Standard tier of Security Center is required at the subscription level for the discovered solutions feature. See [Pricing](security-center-pricing.md) to learn more about the pricing tiers.
>
>

Select **CONNECT** under a solution to integrate with Security Center and be notified of security alerts.

### Add data sources

The **Add data sources** section includes other available data sources that can be connected. For instructions on adding data from any of these sources, click **ADD**.

![Data sources](./media/security-center-partner-integration/security-center-partner-integration-fig7.png)

## Exporting data to a SIEM

> [!NOTE]
> For details of a simpler method (currently in preview) for exporting data to a SIEM, see [Export security alerts and recommendations (Preview)](continuous-export.md). The new method does not use Activity Log as an intermediator and allows direct export from Security Center to Event Hubs (and then on to your SIEM), it also supports the export of Security Recommendations.


You can configure your SIEMs or other monitoring tools to receive Azure Security Center events.

All events from Azure Security Center are published to Azure Monitor's Azure [Activity log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md). Azure Monitor uses [a consolidated pipeline](../azure-monitor/platform/stream-monitoring-data-event-hubs.md) to  stream the data to an Event Hub where it can then be pulled into your monitoring tool.

The next sections describe how you can configure data to be streamed to an event hub. The steps assume that you already have Azure Security Center configured in your Azure subscription.

### High-level overview

![High-Level overview](media/security-center-export-data-to-siem/overview.png)

### What is the Azure security data exposed to SIEM?

In this version, we expose the [security alerts.](../security-center/security-center-managing-and-responding-alerts.md) In upcoming releases, we will enrich the data set with security recommendations.

### How to set up the pipeline

#### Create an Event Hub

Before you begin, [create an Event Hubs namespace](../event-hubs/event-hubs-create.md) - the destination for all your monitoring data.

#### Stream the Azure Activity Log to Event Hubs

See the following article [stream activity log to Event Hubs](../azure-monitor/platform/activity-logs-stream-event-hubs.md).

#### Install a partner SIEM connector 

Routing your monitoring data to an Event Hub with Azure Monitor enables you to easily integrate with partner SIEM and monitoring tools.

See the following article for the list of [supported SIEMs](../azure-monitor/platform/stream-monitoring-data-event-hubs.md#partner-tools-with-azure-monitor-integration).

### Example for Querying data 

Here are some Splunk queries you can use to pull alert data:

| **Description of Query** | **Query** |
|----|----|
| All Alerts| index=main Microsoft.Security/locations/alerts|
| Summarize count of operations by their name| index=main sourcetype="amal:security" \| table operationName \| stats count by operationName|
| Get Alerts info: Time, Name, State, ID, and Subscription | index=main Microsoft.Security/locations/alerts \| table \_time, properties.eventName, State, properties.operationId, am_subscriptionId |


## Next steps

In this article, you learned how to integrate partner solutions in Security Center. To learn more about Security Center, see the following article:

* [Security health monitoring in Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.