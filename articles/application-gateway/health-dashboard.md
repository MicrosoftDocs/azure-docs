---
title: Monitor and resolve Application Gateway health events using Gateway Health Dashboard
description: Learn how to use the Application Gateway Gateway Health Dashboard to view active health events, understand affected resources, and follow recommended remediation actions to maintain application availability and reliability.
services: application gateway
author: jaesoni
ms.service: azure-application-gateway
ms.topic: troubleshooting
ms.date: 05/11/2026
ms.author: jaysoni
---

# Gateway Health Dashboard (preview)

The Gateway Health Dashboard provides a centralized view of health events that affect your Application Gateway resource. It helps you identify configuration issues, resource dependencies, capacity constraints, and other conditions that might affect the availability, reliability, or performance of your gateway. For each detected issue, the dashboard shows affected resources, detailed error information, and recommended remediation steps. You can use this information to diagnose and resolve problems. The overall goal of this report is to help you proactively maintain a healthy gateway configuration and reduce the risk of service degradation or outages.

The health events that the Gateway Health Dashboard surfaces also appear under the [**Azure Application Gateway Resource Health**](https://learn.microsoft.com/troubleshoot/azure/application-gateway/resource-health-overview). While Resource Health helps with notifications and alerts, the new Gateway Health Dashboard is helpful for issue details and resolution guidance. Together, these features provide proactive alerting and rich troubleshooting information in the Application Gateway experience. They help you move quickly from issue detection to remediation. Configure Resource Health [alerts](https://learn.microsoft.com/azure/service-health/resource-health-alert-monitor-guide) through Azure Monitor to receive notifications through channels such as email, SMS, webhooks, Logic Apps, and other automation workflows.

## Understanding different health tools for Application Gateway

Application Gateway provides different health-related tools. The following information helps you understand the purpose of each tool and its interface.

1. **Resource health** - Azure Resource Health provides visibility into the health and availability of individual Azure resources across Azure services, including Application Gateway. You can also configure Resource Health alerts to be notified when a resource’s health status changes.
   
1. **Gateway health (Preview)** - The Gateway Health dashboard surfaces critical issues for supported scenarios that are affecting or could affect your Application Gateway. Each health event includes issue details, affected resources or subresources, and recommended resolution steps. Gateway Health events are also surfaced in Azure Resource Health. The two experiences are complementary, with Gateway Health providing detailed diagnostic and remediation information for Application Gateway.

1. **Backend health** - Backend Health provides visibility into the health and availability of the backend targets associated with an Application Gateway. Its scope is limited to backend connectivity and health and doesn’t represent the overall health of the gateway or its other components.

## Scenarios
The Gateway Health monitors detect common configuration, dependency, and operational issues that affect Application Gateway. 

> [!NOTE]
> * The dashboard will gradually support additional scenarios over the coming months.
> * The Gateway Health report isn't generated when a resource lock is applied to the Application Gateway resource.


### **Inaccessible custom error page**
| Field | Value |
|---|---|
| Health status | Degraded |
| Event name | Inaccessible custom error page |
| Error code | CustomErrorPageDownloadFailed |
| Message | The source hosting the custom error pages is inaccessible. |
| Frequency | 5 minutes |


## Status

The Gateway Health monitors categorize the scenarios they evaluate into one of the following statuses.

### NoEvents
A NoEvents report indicates that the Gateway Health monitors didn't detect any critical events for the scenarios evaluated. The following image shows how this status appears in the Azure portal.

:::image type="content" source="./media/health-dashboard/noevents.png" alt-text="Screenshot shows that no issues were detected by gateway health monitors.":::


### EventsGenerated
An EventsGenerated status indicates that the Gateway Health monitors detected an issue that affects the gateway. Review the Gateway Health dashboard for details about the issue, affected resources or subresources, and recommended resolution steps.

### Unknown

An Unknown status indicates that gateway health information couldn't be retrieved or evaluated. 
:::image type="content" source="./media/health-dashboard/unknown.png" alt-text="The screenshot shows how the Unknown Gateway Health status appears in the Azure portal.":::

This status can occur for the following reasons:

* A connectivity issue prevents the Application Gateway instance from communicating with the GatewayManager service. Ensure that no [Network security group (NSG)](configuration-infrastructure.md#network-security-groups) rules block this connectivity.
* The Application Gateway instances are undergoing automated repair or replacement.
* The Application Gateway is running an older version that doesn't support the Gateway Health service.



