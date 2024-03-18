---
title: Continuous export concept in Microsoft Defender for Cloud
description: Learn about the benefits of continuous export in Microsoft Defender for Cloud. Stream security data to Azure Monitor workspace for analysis and visualization.
ms.date: 03/18/2024
author: dcurwin
ms.author: dacurwin
ms.topic: concept-article
#customer intent: As a reader, I want to understand the benefits of continuous export in Microsoft Defender for Cloud so that I can make informed decisions about implementing it in my organization.
---

# title: Continuous export concept in Microsoft Defender for Cloud


Microsoft Defender for Cloud provides continuous export of security data. This feature allows you to stream security data to Log Analytics in Azure Monitor, to Azure Event Hubs, or to another Security Information and Event Management (SIEM), Security Orchestration Automated Response (SOAR), or IT classic [deployment model solution](export-to-siem.md). You can analyze and visualize the data using Azure Monitor logs and other Azure Monitor features.

When you set up continuous export, you can fully customize what information to export and where the information goes. For example, you can configure it so that:

- All high-severity alerts are sent to an Azure event hub.
- All medium or higher-severity findings from vulnerability assessment scans of your computers running SQL Server are sent to a specific Log Analytics workspace.
- Specific recommendations are delivered to an event hub or Log Analytics workspace whenever they're generated.
- The secure score for a subscription is sent to a Log Analytics workspace whenever the score for a control changes by 0.01 or more.

## What data types can be exported?

You can use continuous export to export the following data types whenever they change:

- Security recommendations.
- Secure score.
- Security alerts.
- Regulatory compliance.
- Security attack paths (preview)
- Security findings.

Findings can be thought of as "sub" recommendations and belong to a "parent" recommendation. For example:

- The recommendations [System updates should be installed on your machines (powered by Update Center)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e1145ab1-eb4f-43d8-911b-36ddf771d13f) and [System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4ab6e3c5-74dd-8b35-9ab9-f61b30875b27) each has one sub recommendation per outstanding system update.
- The recommendation [Machines should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1195afff-c881-495e-9bc5-1486211ae03f) has a sub recommendation for every vulnerability that the vulnerability scanner identifies.

> [!NOTE]
> If you’re configuring continuous export by using the REST API, always include the parent with the findings.

## Export data to an event hub or Log Analytics workspace in another tenant

You *can't* configure data to be exported to a Log Analytics workspace in another tenant if you use Azure Policy to assign the configuration. This process works only when you use the REST API to assign the configuration, and the configuration is unsupported in the Azure portal (because it requires a multitenant context). Azure Lighthouse *doesn't* resolve this issue with Azure Policy, although you can use Azure Lighthouse as the authentication method.

When you collect data in a tenant, you can analyze the data from one, central location.

To export data to an event hub or Log Analytics workspace in a different tenant:

- In the tenant that has the event hub or Log Analytics workspace, [invite a user](../active-directory/external-identities/what-is-b2b.md#easily-invite-guest-users-from-the-azure-portal) from the tenant that hosts the continuous export configuration, or you can configure Azure Lighthouse for the source and destination tenant.

- If you use business-to-business (B2B) guest user access in Microsoft Entra ID, ensure that the user accepts the invitation to access the tenant as a guest.

- If you use a Log Analytics workspace, assign the user in the workspace tenant one of these roles: Owner, Contributor, Log Analytics Contributor, Sentinel Contributor, or Monitoring Contributor.

- Create and submit the request to the Azure REST API to configure the required resources. You must manage the bearer tokens in both the context of the local (workspace) tenant and the remote (continuous export) tenant.

## Related content

- [Continuously export Microsoft Defender for Cloud data](continuous-export.md)
- 
- 