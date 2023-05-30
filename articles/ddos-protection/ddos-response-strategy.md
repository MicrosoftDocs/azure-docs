---
title: Components of a DDoS response strategy
description: Learn what how to use Azure DDoS Protection to respond to DDoS attacks.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: conceptual
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 10/12/2022
ms.author: abell
---

# Components of a DDoS response strategy

A DDoS attack that targets Azure resources usually requires minimal intervention from a user standpoint. Still, incorporating DDoS mitigation as part of an incident response strategy helps minimize the impact to business continuity.

## Microsoft threat intelligence

Microsoft has an extensive threat intelligence network. This network uses the collective knowledge of an extended security community that supports Microsoft online services, Microsoft partners, and relationships within the internet security community.

As a critical infrastructure provider, Microsoft receives early warnings about threats. Microsoft gathers threat intelligence from its online services and from its global customer base. Microsoft incorporates all of this threat intelligence back into the Azure DDoS Protection products.

Also, the Microsoft Digital Crimes Unit (DCU) performs offensive strategies against botnets. Botnets are a common source of command and control for DDoS attacks.

## Risk evaluation of your Azure resources

It’s imperative to understand the scope of your risk from a DDoS attack on an ongoing basis. Periodically ask yourself:

- What new publicly available Azure resources need protection?

- Is there a single point of failure in the service?

- How can services be isolated to limit the impact of an attack while still making services available to valid customers?

- Are there virtual networks where DDoS Protection should be enabled but isn't?

- Are my services active/active with failover across multiple regions?

It's essential that you understand the normal behavior of an application and prepare to act if the application isn't behaving as expected during a DDoS attack. Have monitors configured for your business-critical applications that mimic client behavior, and notify you when relevant anomalies are detected. Refer to [monitoring and diagnostics best practices](/azure/architecture/best-practices/monitoring#monitoring-and-diagnostics-scenarios) to gain insights on the health of your application.

[Azure Application Insights](../azure-monitor/app/app-insights-overview.md) is an extensible application performance management (APM) service for web developers on multiple platforms. Use Application Insights to monitor your live web application. It automatically detects performance anomalies. It includes analytics tools to help you diagnose issues and to understand what users do with your app. It's designed to help you continuously improve performance and usability.

## Customer DDoS response team

Creating a DDoS response team is a key step in responding to an attack quickly and effectively. Identify contacts in your organization who will oversee both planning and execution. This DDoS response team should thoroughly understand the Azure DDoS Protection service. Make sure that the team can identify and mitigate an attack by coordinating with internal and external customers, including the Microsoft support team.

We recommend that you use simulation exercises as a normal part of your service availability and continuity planning, and these exercises should include scale testing. See [test through simulations](test-through-simulations.md) to learn how to simulate DDoS test traffic against your Azure public endpoints.

## Alerts during an attack

Azure DDoS Protection identifies and mitigates DDoS attacks without any user intervention. To get notified when there’s an active mitigation for a protected public IP, you can [configure alerts](alerts.md).

### When to contact Microsoft support

Azure DDoS Protection customers have access to the DDoS Rapid Response (DRR) team, who can help with attack investigation during an attack as well as post-attack analysis. See [DDoS Rapid Response](ddos-rapid-response.md) for more details, including when you should engage the DRR team.

## Post-attack steps

It’s always a good strategy to do a postmortem after an attack and adjust the DDoS response strategy as needed. Things to consider:

- Was there any disruption to the service or user experience due to lack of scalable architecture?

- Which applications or services suffered the most?

- How effective was the DDoS response strategy, and how can it be improved?

If you suspect you're under a DDoS attack, escalate through your normal Azure Support channels.

## Next steps

- Learn how to [configure metric alerts through portal](alerts.md).
- Learn how to [engage DDoS Rapid Response](ddos-rapid-response.md).