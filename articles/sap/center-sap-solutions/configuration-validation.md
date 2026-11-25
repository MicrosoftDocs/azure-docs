---
title: Configuration validation - Azure Workload Center for SAP
description: Configuration validation continuously checks SAP workloads against Azure best practices. Learn how it detects drift and guides remediation.
ms.date: 11/06/2026
ms.topic: concept-article
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
---

# Configuration validation in Azure Workload Center for SAP

Configuration validation continuously evaluates the configuration of SAP workloads onboarded to Azure Workload Center for SAP against Azure and SAP on Azure recommended practices. It identifies configuration deviations, shows which part of the workload is affected and why it matters, and provides guidance to help you resolve them.

This article explains what configuration validation is, the benefits it provides, how validation works, and how configuration deviation notifications keep the right people informed. For step-by-step instructions, see the configuration validation How-to guides listed under Next steps.

## What is configuration validation?

Configuration validation automatically checks your workload's configurations against best-practice baselines. When you onboard an SAP system, Azure Workload Center for SAP creates a workload virtual instance (WVI) that represents the SAP system, its workload components, and the Azure resources they run on. Configuration validation uses this workload context to evaluate the SAP system as a whole, rather than checking each Azure resource in isolation.

Validation starts automatically after the WVI is onboarded and the required permissions are in place, so it doesn't need to be enabled separately. Checks run every hour and you don't need to trigger runs manually. Each run evaluates the Azure resource configurations and the operating system (OS) configurations of the virtual machines in the workload, and the results are brought together in the WVI as a consolidated drift view that includes the impacted components, recommended fixes, and impact levels.

Configuration validation identifies deviations and provides guidance, and it doesn't change the configuration of your SAP system or Azure resources. You decide what to fix and when, by using the Azure portal or the Azure Copilot Run SAP agent.

## Benefits of configuration validation

With configuration validation, you can:

- Keep SAP workloads aligned with the Azure reference architecture and with Azure and SAP on Azure recommended practices, without manual audits.

<!-- -->

- Detect configuration drift early. Checks run every hour, so a change that moves a workload away from its recommended configuration surfaces soon after it happens.

<!-- -->

- See deviations in workload context. Results are mapped to the WVI and its components, so you can review them for a single component or for the entire workload and understand what is affected.

<!-- -->

- Focus on what matters most. Impact levels help you prioritize remediation, and notifications focus on high-impact deviations.

<!-- -->

- Move from finding to fix faster. Each deviation comes with a recommended fix, and the Azure Copilot Run SAP agent can provide workload-aware remediation steps and scripts.

<!-- -->

- Stay informed without opening the portal. Configuration deviation notifications tell the right people when a high-impact deviation appears and again when it's resolved.

<!-- -->

- Stay in control of every change. Configuration validation never changes your configuration, and remediation scripts are never run automatically.

## How configuration validation works

Configuration validation follows a continuous cycle for each WVI:

| Stage | What happens |
|---|---|
| Scope | The configuration template of the WVI defines which checks apply. Applicable checks are listed separately from non-applicable ones, and you can disable individual checks that you don't want to run. |
| Evaluate | Every hour, the Azure Workload Center for SAP service runs the enabled checks by using the user-assigned managed identity that you provide. The service reads Azure resource configurations through the identity's access to the workload resources. The service runs OS-level checks inside the virtual machines through VM Run Command. |
| Report | Each check returns a deviation or no-deviation status. Results include drift details, the impacted component, the impact, and the recommended action. You can view the results under Configuration Validation > Check results. |
| Notify | If enabled, when a high-impact check moves from no deviation to deviation, the service sends a notification to the recipients configured for the WVI. |
| Remediate | You review the recommended fix in the portal, or use the Azure Copilot Run SAP agent to get workload-aware remediation steps or a remediation script, and then apply the change yourself. |
| Revalidate | The next hourly run re-checks the configuration. When the check passes again, the deviation clears and, depending on the notification profile, a "Deviation resolved" notification is sent. |

## Key concepts

### Configuration checks

A configuration check compares one aspect of the workload's configuration with the value recommended by Azure and SAP on Azure guidance. Checks cover the Azure resource configurations of the resources associated with the WVI and the OS-level configurations of its virtual machines. Because checks are evaluated against the WVI, each result is tied to the workload component and resource it applies to.

### Check templates

Templates define the scope of checks applied to a workload. The configuration template of a WVI lists the checks that are applicable to it and, on a separate tab, the checks that aren't. You can enable or disable individual checks; disabled checks aren't run in subsequent validation runs.

### Validation runs

Checks run automatically every hour after the WVI is onboarded. Runs are performed by the Azure Workload Center for SAP service by using the user-assigned managed identity configured for the workload, so the identity must keep the required permissions for checks to continue to run. Validation also relies on the resources associated with the WVI, so keep workload components and resource associations aligned with the actual SAP environment.

### Check results

Each run produces a status for every enabled check: deviation, when the current configuration differs from the recommended configuration, or no deviation, when it matches. Results include drift details, the impacted components, impact levels and recommended actions. You can view results for an individual component or for the entire workload, and they remain available as part of the WVI.

> [!NOTE]
> Deviations are also visible in Advisor recommendations.

| **Status** | **What it means** | **What you should do** |
|---|---|---|
| Deviation | The check ran and the current configuration doesn't match the recommended value. The result shows the affected component, the impact and the recommended fix. | Review the recommended fix in the portal, or ask the Azure Copilot Run SAP agent for remediation steps. After you apply the fix, the next hourly run checks it again. |
| No deviation | The check ran and the configuration matches the recommended value. | Nothing. The check keeps running every hour, and its status changes to Deviation if the configuration drifts later. |
| Failed | The check couldn't be completed, so its result is unknown. Possible causes include missing permissions on the managed identity, a connectivity problem, or a service-side issue. | Confirm the managed identity still has the roles and Run Command permissions it needs, and that the VMs can be reached. If it keeps failing, contact support. Check the failure reason. |
| Skipped | The check wasn't run for this workload. Check the Skipped details | Fix the issues like powering on VM, check Run commands on the resource etc. |

### Impact

Each deviation carries an impact level that indicates its potential impact on the workload. Use impact to decide what to remediate first. Configuration deviation notifications are sent for high-impact deviations, and the Azure Copilot Run SAP agent can filter deviations by impact.

### Configuration deviation notifications

Configuration validation checks your workloads every hour. Configuration deviation notifications proactively tell the right people when a high-impact configuration deviation appears on a WVI, so you no longer need to open the portal or ask the agent to find out. Every notification takes you straight to remediation, and you're told again when the deviation is resolved.

### How notifications work

- Notifications are sent on changes, not on every run. A notification is sent when a check moves from no deviation to deviation, so a deviation that persists across runs doesn't generate a new notification each hour.

<!-- -->

- Notifications are combined per WVI. Everything that qualifies for a WVI in a validation run is combined into a single notification.

### Notification types

| Notification | When it's sent | What it helps you do |
|---|---|---|
| Deviation detected | A high-impact check on the WVI moves from no deviation to deviation. | Review the deviations for the WVI and go straight to remediation. |
| Deviation resolved | A check that was in deviation passes again in a later validation run. Available to select in custom notification profile. | Confirm that the configuration is back in line with recommended practices. |

### Notification profiles

A notification profile controls which notifications are sent for a WVI. The Default notification profile is applied automatically when you onboard a new WVI. Use a custom profile to change this behavior, for example to control whether "Deviation resolved" notifications are sent.

### Recipients and action groups

Notifications are delivered to the email recipients defined in an Azure Monitor action group. An action group is a reusable collection of notification preferences that you can share across WVIs, so one set of recipients can serve several workloads. We recommend using a distribution list rather than named individuals, so that notifications keep reaching the right people through role changes.

### Investigate and remediate deviations

You can explore validation results in the Azure portal or through the Azure Copilot Run SAP agent for guided analysis and remediation. The agent can summarize drifts, filter issues by impact, and create remediation plans.

Workload Aware Remediation uses the WVI's topology and component roles, together with the deviations found by configuration validation, to generate a single, ordered remediation script for the WVI. By default, the script contains only non-disruptive changes, and scripts don’t run automatically: you review and run them yourself. After you apply a fix, the next hourly run re-checks the configuration, and you can use Configuration Retrieval to confirm the new value.

### Related capabilities

Configuration validation works alongside other capabilities in Azure Workload Center for SAP.

| Capability | Question it answers | Learn more |
|---|---|---|
| Configuration Retrieval | What is my system configured to right now? | Retrieve &amp; remediate configuration drift with Run SAP agent |
| Advisor recommendations | Which Azure Advisor recommendations affect this workload and which components do they affect? | Advisor Recommendation |
