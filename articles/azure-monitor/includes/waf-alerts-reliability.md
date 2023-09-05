---
author: AbbyMSFT
ms.author: abbyweisberg
ms.service: azure-monitor
ms.topic: include
ms.date: 09/04/2023
---

Azure Monitor alerts offer a high degree of reliability without any design decisions. Conditions where a temporary loss of alert data loss are often mitigated by features of other Azure Monitor components.


### Design checklist

> [!div class="checklist"]
> - Configure service health alert rules.
> - Configure resource health alert rules.
> - Avoid service limits for alert rules that could produce large scale notifications.
 
### Configuration recommendations

| Recommendation | Benefit |
|:---|:---|
| Configure service health alert rules. | Service health alerts will send you notifications for outages, service disruptions, planned maintenance and security advisories. |
| Configure resource health alert rules. |Resource Health alerts can notify you in near real-time when these resources have a change in their health status. |
| Avoid service limits for alert rules that could produce large scale notifications  |Depending on the service you use to send email or SMS notifications, if you have alert rules that would send a large amount of notifications, you may be rate limited. Configure programmatic actions, or choose an alternate notification method or provider to better handle large scale notifications. See [Service limits for notifications](../alerts/action-groups.md#service-limits-for-notifications).|
