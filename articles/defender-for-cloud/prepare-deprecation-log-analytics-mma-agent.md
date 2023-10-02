---
title: Prepare for deprecation of the Log Analytics MMA agent 
description: Learn how to prepare for the deprecation of the Log Analytics MMA agent in Microsoft Defender for Cloud
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: how-to
ms.date: 10/02/2023
---

# Prepare for deprecation of the Log Analytics MMA agent

The Azure Log Analytics Microsoft Monitor Agent (MMA) will be [deprecated in August 2024](upcoming-changes.md#defender-for-cloud-plan-and-strategy-for-the-log-analytics-agent-deprecation). If you’ve deployed the Defender for Servers and Defender for SQL Server on Machines plans within Microsoft Defender for Cloud, here’s how you should prepare for this change.

## Prepare Defender for Servers

- **Review upcoming plans**: Review the upcoming changes and timelines for the impact of Log Analytics agent deprecation on Defender for Servers features (link to section in upcoming changes doc)
- **Enable Defender for Endpoint integration/agentless scanning**: Enable Defender for Endpoint integration and agentless disk scanning on your subscriptions. Learn more about [endpoint protection](integration-defender-for-endpoint.md) and [agentless scanning](concept-agentless-data-collection.md). This will assure your servers are secured, receive all the security content of Defender for Servers, and up-to-date with the alternative deliverables 
- **Don’t migrate to AMA**: We don’t recommend migrating to the Azure Monitor Agent (AMA) in Defender for Servers, since we’re not continuing to GA with this feature. Note that:
  - Machines with AMA installed will remain protected with Defender for Servers features that are based on the AMA public preview.
  - Features that are currently provided over AMA public preview will remain supported until an alternative version is provided based on Defender for Endpoint integration or agentless disk scanning.  

- **Prepare for auto-provisioning AMA deprecation__: In Upcoming Changes, note the timeline for the deprecation of AMA auto-provisioning  and related preview policies. Note that:
  - After the deprecation of AMA auto-provisioning, only the Log Analytics agent will be available for machines via the Defender for Cloud portal.
  - After the deprecation, even if Log Analytics agent  auto-provisioning is enabled, the agent won’t be provisioned on machines that already have AMA installed. 
  - If you have the AMA-related public preview policy initiative enabled, support will continue until August 2024.  
  - To disable AMA provisioning, you’ll need to manually remove the policy initiative.

- **Prepare Windows servers**: For devices running Windows Server 2016/ 2012 R2, we recommend enabling the unified agent integration, as soon as possible to take advantage of improvements, retain continuous protection, and remove dependencies on the Log Analytics agent.

## Prepare Defender for SQL Server on machines

When the new SQL-targeted AMA autoprovisioning process is released to GA, new customers will be automatically onboarded. For existing customers using the Log Analytics agent or current AMA process, follow these steps to prepare. 

1. **Review upcoming plans**: Review the upcoming changes and timelines for the impact of deprecation on Defender for SQL Server on machines (link to section in upcoming changes doc). 

1. **Watch for notifications**: If you’re an existing customer using the Log Analytics agent or AMA you’ll be notified to migrate after the preview of SQL-targeted AMA.  

    - Note that there’s no functional difference between the current Log Analytics agent and new SQL-targeted AMA.  
    - The benefit is a simpler, more seamless and error-free configuration across your SQL Server estate.

1. **Migrate**: You can fully migrate from the Log Analytics agent/AMA after SQL-targeted AMA is released to preview during 2023. Note that:

    - The Log Analytics agent will remain functional until it’s deprecated in August 2024.
    - The current AMA deployment won’t be supported after SQL-targeted AMA releases in preview, and you should migrate when you get the notification.
    - After GA of SQL-targeted AMA, it will be the default for all new customers.

## Next steps

