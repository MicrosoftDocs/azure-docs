---
title: Integrate security solutions in Azure Security Center | Microsoft Docs
description: Learn about how Azure Security Center integrates with partners to enhance the overall security of your Azure resources.
services: security-center
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: 6af354da-f27a-467a-8b7e-6cbcf70fdbcb
ms.service: security-center
ms.topic: conceptual
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 3/20/2019
ms.author: rkarlin

---
# Integrate security solutions in Azure Security Center
This document helps you to manage security solutions already connected to Azure Security Center and add new ones.

## Integrated Azure security solutions
Security Center makes it easy to enable integrated security solutions in Azure. Benefits include:

- **Simplified deployment**: Security Center offers streamlined provisioning of integrated partner solutions. For solutions like antimalware and vulnerability assessment, Security Center can provision the needed agent on your virtual machines, and for firewall appliances, Security Center can take care of much of the network configuration required.
- **Integrated detections**: Security events from partner solutions are automatically collected, aggregated, and displayed as part of Security Center alerts and incidents. These events also are fused with detections from other sources to provide advanced threat-detection capabilities.
- **Unified health monitoring and management**: Customers can use integrated health events to monitor all partner solutions at a glance. Basic management is available, with easy access to advanced setup by using the partner solution.

Currently, integrated security solutions include:

- Web application firewall ([Barracuda](https://www.barracuda.com/products/webapplicationfirewall), [F5](https://support.f5.com/kb/en-us/products/big-ip_asm/manuals/product/bigip-ve-web-application-firewall-microsoft-azure-12-0-0.html), [Imperva](https://www.imperva.com/Products/WebApplicationFirewall-WAF), [Fortinet](https://www.fortinet.com/products.html), and [Azure Application Gateway](https://azure.microsoft.com/blog/azure-web-application-firewall-waf-generally-available/))
- Next-generation firewall ([Check Point](https://www.checkpoint.com/products/vsec-microsoft-azure/), [Barracuda](https://campus.barracuda.com/product/nextgenfirewallf/article/NGF/AzureDeployment/), [Fortinet](https://docs.fortinet.com/d/fortigate-fortios-handbook-the-complete-guide-to-fortios-5.2), [Cisco](https://www.cisco.com/c/en/us/td/docs/security/firepower/quick_start/azure/ftdv-azure-qsg.html), and [Palo Alto Networks](https://www.paloaltonetworks.com/products))
- Vulnerability assessment ([Qualys](https://www.qualys.com/public-clouds/microsoft-azure/) and [Rapid7](https://www.rapid7.com/products/insightvm/))

> [!NOTE]
> Security Center does not install the Microsoft Monitoring Agent on partner virtual appliances because most security vendors prohibit external agents running on their appliance.
>
>

## How security solutions are integrated
Azure security solutions that are deployed from Security Center are automatically connected. You can also connect other security data sources, including:

- Azure AD Identity Protection
- Computers running on-premises or in other clouds
- Security solution that supports the Common Event Format (CEF)
- Microsoft Advanced Threat Analytics

![Partner solutions integration](./media/security-center-partner-integration/security-center-partner-integration-fig8.png)

## Manage integrated Azure security solutions and other data sources

1. Sign in to the [Azure portal](https://azure.microsoft.com/features/azure-portal/).

2. On the **Microsoft Azure menu**, select **Security Center**. **Security Center - Overview** opens.

3. Under the Security Center menu, select **Security solutions**.

   ![Security Center Overview](./media/security-center-partner-integration/overview.png)

Under **Security solutions**, you can view information about the health of integrated Azure security solutions and perform basic management tasks. You can also connect other types of security data sources, such as Azure Active Directory Identity Protection alerts and firewall logs in Common Event Format (CEF).

### Connected solutions

The **Connected solutions** section includes security solutions that are currently connected to Security Center and information about the health status of each solution.  

![Connected solutions](./media/security-center-partner-integration/security-center-partner-integration-fig4.png)

The status of a partner solution can be:

* Healthy (green) - there is no health issue.
* Unhealthy (red) - there is a health issue that requires immediate attention.
* Health issues (orange) - the solution has stopped reporting its health.
* Not reported (gray) - the solution has not reported anything yet, a solution's status may be unreported if it has recently been connected and is still deploying, or no health data is available.

> [!NOTE]
> If health status data is not available, Security Center shows the date and time of the last event received to indicate whether the solution is reporting or not. If no health data is available and no alerts are received within the last 14 days, Security Center indicates that the solution is unhealthy or not reporting.
>
>

1. Select **VIEW** for additional information and options, which includes:

   - **Solution console**. Opens the management experience for this solution.
   - **Link VM**. Opens the Link Applications blade. Here you can connect resources to the partner solution.
   - **Delete solution**.
   - **Configure**.

   ![Partner solution detail](./media/security-center-partner-solutions/partner-solutions-detail.png)

### Discovered solutions

Security Center automatically discovers security solutions running in Azure but are not connected to Security Center and displays the solutions in the **Discovered solutions** section. This includes Azure solutions, such as [Azure AD Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection), as well as partner solutions.

> [!NOTE]
> The Standard tier of Security Center is required at the subscription level for the discovered solutions feature. See [Pricing](security-center-pricing.md) to learn more about Security's pricing tiers.
>
>

Select **CONNECT** under a solution to integrate with Security Center and be notified on security alerts.

![Discovered solutions](./media/security-center-partner-integration/security-center-partner-integration-fig5.png)

Security Center also discovers solutions deployed in the subscription that are able to forward Common Event Format (CEF) logs. Learn how to [connect a security solution](quick-security-solutions.md) that uses CEF logs to Security Center.

### Add data sources

The **Add data sources** section includes other available data sources that can be connected. For instructions on adding data from any of these sources, click **ADD**.

![Data sources](./media/security-center-partner-integration/security-center-partner-integration-fig7.png)

### Connect external solutions

In addition to collecting security data from your computers, you can integrate security data from a variety of other security solutions, including any that support Common Event Format (CEF). CEF is an industry standard format on top of Syslog messages, used by many security vendors to allow event integration among different platforms.

This quickstart shows you how to:
- Connect a security solution to Security Center using CEF Logs
- Validate the connection with the security solution

#### Prerequisites
To get started with Security Center, you must have a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free account](https://azure.microsoft.com/free/).

To step through this quickstart, you must be on Security Center’s Standard pricing tier. You can try Security Center Standard at no cost. The quickstart [Onboard your Azure subscription to Security Center Standard](security-center-get-started.md) walks you through how to upgrade to Standard. To learn more, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).

You also need a [Linux machine](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-linux), with Syslog service that is already connected to your Security Center.

#### Connect solution using CEF

1. Sign into the [Azure portal](https://azure.microsoft.com/features/azure-portal/).
2. On the **Microsoft Azure** menu, select **Security Center**. **Security Center - Overview** opens.

	![Select security center](./media/quick-security-solutions/quick-security-solutions-fig1.png)  

3. Under the Security Center main menu, select **Security Solutions**.
4. In the Security Solutions page, under **Add data sources (3)**, click **Add** under **Common Event Format**.

	![Add data source](./media/quick-security-solutions/quick-security-solutions-fig2.png)

5. In the Common Event Format Logs page, expand the second step, **Configure Syslog forwarding to send the required logs to the agent on UDP port 25226**, and follow the instructions below in your Linux computer:

	![Configure syslog](./media/quick-security-solutions/quick-security-solutions-fig3.png)

6. Expand the third step, **Place the agent configuration file on the agent computer**, and follow the instructions below in your Linux computer:

	![Agent configuration](./media/quick-security-solutions/quick-security-solutions-fig4.png)

7. Expand the fourth step, **Restart the syslog daemon and the agent**, and follow the instructions below in your Linux computer:

	![Restart the syslog](./media/quick-security-solutions/quick-security-solutions-fig5.png)


#### Validate the connection

Before you proceed to the steps below, you will need to wait until the syslog starts reporting to Security Center. This can take some time, and it will vary according to the size of the environment.

1.	In the left pane, of the Security Center dashboard, click **Search**.
2.	Select the workspace that the Syslog (Linux Machine) is connected to.
3.	Type *CommonSecurityLog* and click the **Search** button.

The following example shows the result of these steps:
![CommonSecurityLog](./media/quick-security-solutions/common-sec-log.png)

#### Clean up resources
Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, continue running the Standard tier and keep automatic provisioning enabled. If you do not plan to continue or wish to return to the Free tier:

1. Return to the Security Center main menu and select **Security Policy**.
2. Select the subscription or policy that you want to return to Free. **Security policy** opens.
3. Under **POLICY COMPONENTS**, select **Pricing tier**.
4. Select **Free** to change subscription from Standard tier to Free tier.
5. Select **Save**.

If you wish to disable automatic provisioning:

1. Return to the Security Center main menu and select **Security policy**.
2. Select the subscription that you wish to disable automatic provisioning.
3. Under **Security policy – Data Collection**, select **Off** under **Onboarding** to disable automatic provisioning.
4. Select **Save**.

>[!NOTE]
> Disabling automatic provisioning does not remove the Microsoft Monitoring Agent from Azure VMs where the agent has been provisioned. Disabling automatic provisioning limits security monitoring for your resources.
>

## Exporting data to a SIEM

Processed events produced by Azure Security Center are published to the Azure [Activity log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md), one of the log types available through Azure Monitor. Azure Monitor offers a consolidated pipeline for routing any of your monitoring data into a SIEM tool. This is done by streaming that data to an Event Hub where it can then be pulled into a partner tool.

This pipe uses the [Azure Monitoring single pipeline](../azure-monitor/platform/stream-monitoring-data-event-hubs.md) for getting access to the monitoring data from your Azure environment. This enables you to easily set up SIEMs and monitoring tools to consume the data.

The next sections describe how you can configure data to be streamed to an event hub. The steps assume that you already have Azure Security Center configured in your Azure subscription.

High-level overview

![High-Level overview](media/security-center-export-data-to-siem/overview.png)

### What is the Azure security data exposed to SIEM?

In this version we expose the [security alerts.](../security-center/security-center-managing-and-responding-alerts.md) In upcoming releases, we will enrich the data set with security recommendations.

### How to setup the pipeline

#### Create an Event Hub

Before you begin, you need to [create an Event Hubs namespace](../event-hubs/event-hubs-create.md). This namespace and Event Hub is the destination for all your monitoring data.

#### Stream the Azure Activity Log to Event Hubs

Please refer to the following article [stream activity log to Event Hubs](../azure-monitor/platform/activity-logs-stream-event-hubs.md)

#### Install a partner SIEM connector 

Routing your monitoring data to an Event Hub with Azure Monitor enables you to easily integrate with partner SIEM and monitoring tools.

Refer to the following link to see the list of [supported SIEMs](../azure-monitor/platform/stream-monitoring-data-event-hubs.md#what-can-i-do-with-the-monitoring-data-being-sent-to-my-event-hub)

### Example for Querying data 

Here is a couple of Splunk queries that you can use to pull alert data:

| **Description of Query** | **Query** |
|----|----|
| All Alerts| index=main Microsoft.Security/locations/alerts|
| Summarize count of operations by their name| index=main sourcetype="amal:security" \| table operationName \| stats count by operationName|
| Get Alerts info: Time, Name, State, ID, and Subscription | index=main Microsoft.Security/locations/alerts \| table \_time, properties.eventName, State, properties.operationId, am_subscriptionId |


## Next steps

In this article, you learned how to integrate partner solutions in Security Center. To learn more about Security Center, see the following articles:

* [Security health monitoring in Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.
* [Monitor partner solutions with Security Center](security-center-partner-solutions.md). Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQs](security-center-faq.md). Get answers to frequently asked questions about using Security Center.
* [Azure Security blog](https://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.
