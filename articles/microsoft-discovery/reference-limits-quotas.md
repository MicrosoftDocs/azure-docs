---
title: Microsoft Discovery limits and quotas
description: Look up Microsoft Discovery job runtime limits and onboarding-tool eligibility input bounds, and find related quota-planning guidance.
author: yousefi-msft
ms.author: yousefi
ms.service: azure
ms.topic: limits-and-quotas
ms.date: 11/17/2026
# Customer intent: As a platform administrator or tool publisher, I want to look up execution limits and configuration bounds so that I can plan workloads and onboarding.
---

# Microsoft Discovery limits and quotas

Use this reference to look up job runtime limits and onboarding-tool input bounds for Microsoft Discovery. These constraints have different scopes: a job runtime limit applies to a scheduled job, whereas an onboarding input bound applies to the deployment tool's configuration.

For Azure service quota requirements, model allocations, and Bookshelf sizing, see [Quota reservations for Microsoft Discovery](concept-quota-reservation.md). Available quota doesn't guarantee regional physical capacity.

## Job execution limits

| Limit | Value | Scope |
| --- | --- | --- |
| Maximum job runtime | 42 days | Starts when the job is scheduled from the queue. |

If a job can exceed this runtime, plan checkpointing. For workload planning, see [Plan tool requirements](how-to-plan-tool-requirements.md#step-2-document-compute-requirements). For job submission and monitoring, see [Submit and monitor jobs by using REST APIs](how-to-run-jobs-supercomputer-rest-api.md).

## Onboarding-tool input bounds

The following bound applies to the [onboarding configuration](https://github.com/microsoft/discovery/blob/main/utilities/onboarding-tool/script-specs/config.schema.json), not to a Discovery service quota or a PIM role-activation window.

| Configuration field | Minimum | Maximum | Unit and applicability |
| --- | --- | --- | --- |
| `rbac.jitEligibilityDurationDays` | 7 | 3650 | Whole days of new eligibility when `rbac.humanAccessMode` is `customer-jit-managed`. |

Confirm PIM licensing and an eligibility policy that permits the selected duration with your IAM team. Eligible access isn't active access. For setup instructions, see [Select human-access management](how-to-create-deployment-configuration.md#select-human-access-management).

## Related content

- [Quota reservations](concept-quota-reservation.md)
- [Resource naming guidelines](reference-resource-naming.md)
- [Create a tool definition](how-to-create-tool-definition.md)
