---
title: Set up disaster recovery for Azure SRE Agent
description: Learn how to prepare a cold-standby Azure SRE Agent in a secondary region, fail over during a regional outage, and fail back after the primary region recovers.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-sre-agent
ms.topic: how-to
ms.date: 08/31/2026
ms.ai-usage: ai-assisted
ms.custom: disaster recovery, cold standby, failover, failback, business continuity, RTO, RPO
#customer intent: As an SRE, I want to prepare a standby Azure SRE Agent in a second region so that I can recover quickly from a regional outage without losing control over production automation.
---

# Set up disaster recovery for Azure SRE Agent

Azure SRE Agent is a regional service. Each agent you deploy runs in a single region and has its own resource ID, endpoint, configuration, and runtime state. The service doesn't automatically fail over an agent to another region. If your workload needs faster recovery than rebuilding an agent from scratch, deploy a **cold-standby** backup agent in a second region and follow a defined failover procedure when the primary region becomes unavailable.

This article shows you how to design a cold-standby architecture, prepare for a regional outage, fail over to a backup agent, and fail back to your primary region.

## Key terms

| Term | Definition |
| --- | --- |
| **Recovery time objective (RTO)** | The maximum acceptable time between the start of a disruption and restoration of service through the backup agent. |
| **Recovery point objective (RPO)** | The maximum acceptable amount of configuration or runtime state you can afford to lose during recovery. |
| **Cold standby** | A fully deployed backup agent that stays stopped until you declare a disaster. |
| **Blast radius** | The scope a failure affects. A regional failure affects every agent deployed in that region. |

Microsoft doesn't publish an RTO or RPO commitment for disaster recovery of an individual agent. Set targets based on your own requirements and validate them through regular recovery drills.

## How cold standby works

A cold-standby deployment consists of two independent SRE Agent resources: a primary agent that handles production traffic and a backup agent that stays stopped until you need it.

| Component | Primary region | Backup region |
| --- | --- | --- |
| SRE Agent resource | Running | Stopped |
| Agent configuration | Deployed from source control | Deployed from the same source |
| User-assigned managed identity | Shared | Shared |
| Agent endpoint | Primary production endpoint | Backup endpoint used after failover |
| Network integration | Configured for the primary region | Configured separately for the backup region |
| Runtime state and history | Stored with the primary agent | Independent and initially empty |

Attach the same user-assigned managed identity to both agents so they get the same Azure role assignments. Because the identity is a separate Azure resource, its permissions stay available even when either agent is stopped or unavailable.

The two agents still have distinct system-assigned identities. If any dependency uses a system-assigned identity instead of the shared user-assigned identity, configure and validate its permissions separately for the backup agent.

> [!WARNING]
> **Run only one production agent at a time.** If both agents share the same incident integrations, scheduled tasks, triggers, scanners, or callers while both are active, you get duplicate investigations and duplicate actions. Keep production activation disabled on the backup, and keep the backup stopped, outside of recovery drills and declared recovery events.

> [!NOTE]
> A stopped agent still incurs the fixed always-on cost, even though it doesn't consume active-flow Azure Agent Units (AAUs). Include the backup agent in your recovery budget. For more information, see [What happens if I stop my agent?](pricing-billing.md#what-happens-if-i-stop-my-agent)

## Shared responsibility for disaster recovery

Disaster recovery for Azure SRE Agent is a shared responsibility between Microsoft and you.

| Responsibility | Owner | Detail |
| --- | --- | --- |
| Platform availability and recovery within a region | Microsoft | Microsoft operates the SRE Agent platform and restores affected regional services. |
| Deploying agents in two regions | You | Provision the primary and backup agents before an incident. |
| Maintaining equivalent definitions | You | Store definitions in source control, deploy them consistently to both agents, and keep backup production automations disabled. |
| Managing permissions | You | Attach the shared user-assigned managed identity and maintain its role assignments. |
| Detecting an outage and declaring failover | You | Use Azure Service Health and your own monitoring and incident processes. |
| Activating the backup agent | You | Confirm the primary is unavailable, then start the backup resource. |
| Redirecting users and integrations | You | Update callers to use the backup agent's endpoint. |
| Validating connectors and automations | You | Confirm each dependency works from the backup region. |
| Managing runtime-state loss | You | Conversation history, memory, and in-flight work don't move to the backup agent. |

## Prepare for a regional outage

Complete these steps before an incident happens.

> [!IMPORTANT]
> You can't quickly reproduce configuration that exists only in the portal during an outage. Treat your source-controlled infrastructure and agent configuration as the system of record for both regional agents.

1. **Select two supported regions.** Choose primary and backup regions that meet your availability and data residency requirements. See [Supported regions](supported-regions.md).

2. **Define both agents as infrastructure as code.** Store the agent resources and their supported child-resource configuration in source control. See [Deploy with infrastructure as code](deploy-iac.md).

3. **Deploy from one source.** Apply equivalent definitions to both agents and watch for configuration drift, while preserving the intentional override that keeps production automations disabled on the backup.

4. **Attach a shared user-assigned managed identity.** Grant the identity the least-privilege roles the agents require.

5. **Review system-assigned identity dependencies.** Record anything that doesn't use the shared identity, and configure it separately for the backup.

6. **Configure regional networking.** Provision the backup region's virtual network, subnet, DNS, routes, and firewall rules, and configure private endpoints for dependencies reached through the agent's outbound network path. Network integration is outbound only, and platform and connector traffic can use Microsoft-managed infrastructure. See [Network integration](network-integration.md) and [Network requirements](network-requirements.md).

7. **Inventory connectors and credentials.** Identify connectors that require interactive sign-in or region-specific configuration.

8. **Inventory and fence every activation source.** Keep scheduled tasks, response plans, HTTP triggers, other triggers and scanners, and tenant-specific automation disabled on the backup. Block production callers and upstream integrations from reaching the backup, and confirm it has no in-flight runs before you stop it.

9. **Preserve knowledge sources.** Keep uploaded documents in an external system of record so you can deploy or upload them to either agent.

10. **Record both endpoints.** Document every caller that must switch from the primary endpoint to the backup endpoint.

11. **Keep the backup stopped.** Verify its `powerState` is `Stopped` during normal operation.

12. **Run an isolated recovery drill.** Keep production automations disabled, use dedicated read-only test definitions and nonproduction destinations, and route only isolated test callers to the backup. Don't manually invoke production definitions. After the drill, remove test routing, confirm all test and production automations on the backup are disabled with no runs in progress, stop the backup, and verify `powerState` is `Stopped`.

### What transfers to the backup agent

Use this table to set expectations with your team before an outage happens.

| Component or state | Available after failover? | Notes |
| --- | --- | --- |
| Agent resource | Yes | The backup is deployed before the incident and starts during failover. |
| Source-controlled configuration | Yes | Available up to the last successful deployment to the backup agent. |
| Shared user-assigned managed identity role assignments | Yes | Both agents use the same identity and permissions. |
| Regional network integration | Yes, if preconfigured | The backup requires its own regional networking resources. |
| Connector definitions | Depends | Definitions might be deployed, but you must validate credentials and connectivity separately. |
| Scheduled tasks and HTTP triggers | Depends | Configuration might exist, but you must test activation and caller routing. |
| Uploaded knowledge | Only if copied separately | Keep the source outside the primary agent. |
| Conversation threads and history | No | History is tied to the primary agent and isn't copied to the backup. |
| Accumulated memory and session insights | No | The backup builds its own state after activation. |
| In-flight investigations and runs | No | Restart interrupted work on the backup agent. |
| Primary agent endpoint | No | The backup has a different endpoint. Redirect callers. |
| System-assigned identity permissions | No, unless configured | The backup has a different system-assigned identity principal. |

## Fail over to the backup agent

Failover is a controlled sequence, not a single switch. Work through these steps in order so the primary agent can't run production work at the same time as the backup, and so you confirm the backup is healthy before you redirect traffic and automations to it.

### 1. Declare the regional outage

Use [Azure Service Health](/azure/service-health/service-health-overview) and your own monitoring signals to confirm that the primary agent or region is unavailable. Record the incident start time, the affected agent and region, who authorized the failover, and the expected impact on active investigations and automations.

### 2. Fence the primary agent

> [!WARNING]
> **Don't start the backup agent until you confirm the primary agent can't run production work.** An unresponsive primary endpoint doesn't prove that outbound scheduled work, scanners, or incident processing stopped.

Before starting the backup agent:

1. Confirm the primary agent is `Stopped`, or independently disable or isolate every production activation source on the primary agent or its upstream system. Verify that no primary runs remain active, or independently fence the downstream effects of any run you can't stop.
2. Pause or queue push-based production callers, including HTTP trigger callers and webhooks.
3. Confirm all production automations on the backup agent are disabled and that it has no in-flight runs.
4. Verify that incident integrations, trigger routing, scanners, manual invocation paths, and other automation callers can't activate both agents at once.

If you can't reach the primary region, use upstream integration controls and monitoring evidence to establish the fence.

### 3. Start the backup agent

Start the SRE Agent resource in the backup region. To learn more about the start operation and resource properties, see [control plane (ARM) operations](api-reference.md#control-plane-arm-operations). Wait until:

- `provisioningState` is `Succeeded`.
- `powerState` is `Running`.
- The backup endpoint responds successfully.

### 4. Validate dependencies

Before you redirect production traffic, verify:

- The shared user-assigned managed identity is attached.
- Required Azure role assignments remain effective.
- Network, DNS, firewall, and private connectivity work from the backup region.
- Required connectors can authenticate and query their dependencies.
- Knowledge sources required for investigations are available.
- A representative read-only investigation completes successfully.
- Production automations remain disabled on the backup after startup, with no unexpected or in-flight runs.

### 5. Switch callers to the backup endpoint

While push-based production callers stay paused or queued, update every dependency that references the primary endpoint, including:

- User bookmarks and operational links.
- HTTP trigger callers.
- Incident management integrations.
- Webhooks and automation systems.
- Internal routing, aliases, or configuration stores.

Switching the endpoint is a manual step unless your organization provides a separate routing layer. Send an isolated test request to confirm routing targets only the backup before you resume production callers.

### 6. Activate production work on the backup

After you validate the primary fence and the backup routing:

1. Enable the required scheduled tasks, response plans, triggers, scanners, and other production automations only on the backup.
2. Enable backup HTTP triggers before you resume their paused or queued callers.
3. Resume production callers and verify requests reach only the backup.
4. Confirm the primary remains fenced and doesn't start new work.

### 7. Monitor the backup agent

After activation, monitor agent health, request success rate, connector failures, automation execution, authorization failures, and duplicate investigations or actions. Compare the measured recovery time with your target RTO.

## Fail back to the primary region

Failback is a controlled operation. You can't merge runtime state created by the backup agent into the original agent.

1. Confirm the primary region and original agent are healthy.
2. Reconcile source-controlled configuration so both agents run the intended version.
3. Record any work the backup performed that you must retain outside its conversation history.
4. Pause production callers and disable new automation activation on the backup.
5. Wait for active backup runs to complete, or terminate them and record any interrupted work you need to restart.
6. Stop the backup agent.
7. Confirm every production activation source on the primary is disabled or isolated before you start it.
8. Start the primary agent and wait for `powerState` to become `Running`.
9. Validate identity, networking, connectors, knowledge, and a representative read-only investigation while primary production automations remain disabled.
10. Redirect paused callers to the primary endpoint and send an isolated test request to confirm only the primary is targeted.
11. Enable the required production automations on the primary, then resume callers.
12. Confirm the backup remains stopped, its production automations remain disabled, and no runs are in progress.
13. Record the failback results and update your runbook with lessons from the event.

If you prefer to keep operating in the backup region, designate the backup agent as the new primary and keep the recovered original agent stopped.

## Set recovery objectives

Set business RTO and RPO targets before you run a recovery drill, then use each drill to validate the targets and improve your procedure.

RTO starts when the disruption begins, not when you declare failover, so it includes detection, the operator's decision, activation, endpoint switching, and validation. During a declared failover, measure from the disruption time until:

1. The backup agent reports `Running`.
2. Required health and connectivity checks pass.
3. Users and integrations are redirected to the backup endpoint and paused production callers resume.
4. Required production automations are enabled only on the backup.
5. A representative investigation completes successfully.
6. Monitoring confirms duplicate execution isn't occurring.

During a drill, measure the equivalent isolated test steps without enabling production automations or resuming production callers, and record separately any production cutover steps the drill simulated rather than executed.

RPO varies by state type:

- **Configuration RPO** is the time since the last successful deployment to the backup agent.
- **Knowledge RPO** depends on how frequently you synchronize external knowledge sources.
- **Conversation, memory, and in-flight execution RPO** is total loss, because that state doesn't transfer between agents.

> [!NOTE]
> Don't publish recovery targets based only on estimated startup or deployment times. Validate them against measured drill results.

## Plan for business continuity

Disaster recovery is one part of business continuity. Plan how your team operates while the agent is unavailable or a failover is in progress:

- Keep operational runbooks executable by a person.
- Preserve incident management and escalation paths that don't depend on the agent.
- Route work to your existing on-call process while recovery is underway.
- Restart interrupted investigations after the backup agent becomes active.

## Related content

- [Supported regions for Azure SRE Agent](supported-regions.md)
- [Deploy with infrastructure as code in Azure SRE Agent](deploy-iac.md)
- [Data residency and privacy in Azure SRE Agent](data-privacy.md)
- [Network requirements for Azure SRE Agent](network-requirements.md)
- [Audit agent actions in Azure SRE Agent](audit-agent-actions.md)
