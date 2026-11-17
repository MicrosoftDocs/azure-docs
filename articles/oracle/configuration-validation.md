---
title: Configuration validation
titleSuffix: Azure Workload Center for Oracle
description: Learn how configuration validation checks an Oracle workload against recommended practices and reports deviations.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: concept-article
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Configuration validation

Configuration validation checks the configuration of your Oracle workload against Azure and Oracle on Azure recommended practices. It uses the *Workload Virtual Instance (WVI)* to decide which checks apply to each resource, and it links each finding to the component and resource that it affects.

## How checks run

Checks run every hour after you enroll an Oracle system. You don't need to start them. Each run evaluates every enabled check against the mapped resources and records the result.  
  
Configuration validation follows a continuous cycle for each WVI:

| **Stage**  | **What happens**                                                                                                                                                                                                                                    |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Scope      | The configuration template of the WVI defines which checks apply. You can disable checks that you don't want to run.                                                                                                                                 |
| Evaluate   | Every hour, Azure Workload Center for Oracle runs the enabled checks by using the managed identity of the WVI. Azure resource checks read the properties of the mapped resources. Operating system checks run inside the Azure virtual machines through [Run Command](/azure/virtual-machines/run-command-overview). |
| Report     | Each check returns a status. The **Check results** page shows the affected component, the impact, and the recommended fix.                                                                                                                           |
| Notify     | When a high-impact check moves from No Deviation to Deviation, a notification goes to the recipients set for the WVI.                                                                                                                                |
| Remediate  | You review the recommended fix in the portal or ask the Azure Copilot "Run Oracle" Agent for resolution steps. You apply the change yourself.                                                                                                        |
| Revalidate | The next hourly run checks the configuration again. When the check passes, the deviation clears.                                                                                                                                                     |

A check can have one of four results:

| **Result**   | **What it means**                                                                                                                                                      | **What you should do**                                                                                                                                                        |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Deviation    | The check ran, and the configuration doesn't match the recommended value. This condition is also called configuration deviation or drift.                                         | Review the recommended fix and apply it.                                                                                                                                       |
| No Deviation | The check ran, and the configuration matches the recommended value.                                                                                                     | No action is needed.                                                                                                                                                           |
| Failed       | The check couldn't complete, so its result is unknown. Possible causes include missing permissions on the managed identity, a connectivity problem, or a service issue. | Confirm that the managed identity still has the roles and Run Command permissions that it needs, and that the Azure virtual machines can be reached. If the check keeps failing, contact support. |
| Skipped      | The check didn't run on this resource.                                                                                                                                  | Fix the reason shown in the skipped details. For example, start the Azure virtual machine.                                                                                                        |

## Configuration templates

Each WVI gets a default configuration template that Microsoft manages. The template lists the checks that apply to the workload, based on the workload details that you entered during enrollment. You can disable a check that doesn't fit your system and enable it again later.

Each check belongs to a category, such as Operational Excellence, Performance, or Reliability. Each check also has an impact level of High, Medium, or Low.

## Example check

The check ODAA-Database-Application-SameAvailabilityZone finds that the Azure virtual machines in the application tier aren't in the same physical availability zone as the Oracle AI Database@Azure infrastructure.

The extra network hops add latency. The check has High impact. The remediation is to deploy the application tier in the same availability zone as the database.

## Where you see the results

- In the Azure portal, each WVI has a **Check results** page, and Azure Workload Center for Oracle has a combined view for all WVIs.

- Configuration deviation notifications send an email when a new high-impact deviation appears.

- The Azure Copilot Run Oracle Agent summarizes deviations and gives resolution steps.

Configuration validation finds deviations and gives the steps to fix them. It doesn't change your Oracle system or Azure resources.  

:::image type="content" source="media/configuration-validation/check-results-overview.png" alt-text="Screenshot that shows the Check results page of a WVI with the summary tiles and the list of check results." lightbox="media/configuration-validation/check-results-overview.png":::

## Configuration deviation notifications

Configuration deviation notifications tell the right people when a high-impact deviation appears on a WVI. They don't need to open the portal or ask the agent to find out.

- Notifications are sent when a result changes. A deviation that stays across runs doesn't send a new notification each hour.

- Notifications are combined per WVI. All new deviations from one validation run arrive in one notification.

| **Notification**   | **When it's sent**                                                                                                                          |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| Deviation detected | A high-impact check on the WVI moves from No Deviation to Deviation                                                                         |
| Deviation resolved | A check that was in deviation passes again in a later run. You get this notification only if you select it in a custom notification profile |

A notification profile controls which notifications are sent for a WVI. The Default notification profile is applied when you enroll a WVI. To change it, for example to add Deviation resolved notifications, use a custom profile.

Notifications go to the email recipients in an Azure Monitor action group. An action group is a reusable list of recipients that you can share across WVIs.
