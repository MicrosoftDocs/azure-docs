---
title: ServiceNow integration with Defender for Cloud
description: Learn about integrating ServiceNow with Microsoft Defender for Cloud to protect Azure, hybrid, and multicloud machines.
author: dcurwin
ms.author: dacurwin
ms.topic: overview
ms.date: 03/11/2024
ai-usage: ai-assisted
#customer intent: As a user, I want to learn about the integration that exists between ServiceNow and Microsoft Defender for Cloud so that I can protect my Azure, hybrid, and multicloud machines.
---

# ServiceNow integration with Defender for Cloud

ServiceNow is a cloud-based workflow automation and enterprise-oriented solution that enables organizations to manage and track digital workflows within a unified, robust platform. ServiceNow helps to improve operational efficiencies by streamlining and automating routine work tasks and delivers resilient services that help increase your productivity.  

ServiceNow can be integrated with Microsoft Defender for Cloud to allow customers to prioritize remediation of recommendations that affect your business. Defender for Cloud integrates with the IT Service Management (ITSM) module (incident management). As part of this connection, customers can create/view ServiceNow tickets (linked to recommendations) from Defender for Cloud.

As part of the integration, you can create and monitor tickets in ServiceNow directly from Defender for Cloud:

- **Incident**: An incident is an unplanned interruption of reduction in the quality of an IT service as reported by a user or monitoring system. ServiceNow’s incident management module helps IT teams track and manage incidents, from initial reporting to resolution.
- **Problem**: A problem is the underlying cause of one or more incidents. It’s often a recurring or persistent issue that needs to be addressed to prevent future incidents.
- **Change**: A change is a planned alternation or addition to an IT service or its supporting infrastructure. A change management module helps IT teams plan, approve, and execute changes in a controlled and systematic manner. It minimizes the risk of service disruptions and maintains service quality.

## Bidirectional synchronization

ServiceNow and Defender for Cloud automatically synchronize the status of the tickets between the platforms, which includes:

- A verification that a ticket state is still **In progress**. If the ticket state is changed to **Resolved**, **Canceled**, or **Closed** in ServiceNow, the change is synchronized to Defender for Cloud and delete the assignment.

- When the ticket owner is changed in ServiceNow, the assignment owner is updated in Defender for Cloud.

> [!NOTE]
> Synchronization occurs every 24 hrs.

## Related content

- [Integrate ServiceNow to Defender for Cloud](connect-servicenow.md)
- [Create a ticket in Defender for Cloud](create-ticket-servicenow.md)
- [Assign an owner to a recommendation or severity level](integration-servicenow.md)
