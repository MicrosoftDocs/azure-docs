---
title: Decommission Your Amazon Web Services (AWS) Workload After You Migrate to Azure
description: Learn how to decommission AWS resources after you migrate a single workload from AWS to Azure. Create final backups, delete resources, and establish new baselines.
ms.author: rhackenberg
author: reginahack
ai-usage: ai-assisted
ms.date: 02/13/2026
ms.topic: concept-article
ms.custom: migration-hub
ms.service: azure
ms.collection:
  - migration
  - aws-to-azure
---
# Decommission your Amazon Web Services (AWS) workload after you migrate to Azure

This article is part of a series about how to [migrate a workload from Amazon Web Services (AWS) to Azure](/azure/migration/migrate-workload-from-aws-introduction). 

This step is the final step in the workload migration. Proceed after you complete the evaluation phase and confirm that your workload operates as expected in Azure.

:::image type="icon" source="images/goal.svg" alt-text="Goal icon"::: The goal of this phase is to retire AWS dependencies safely, remove redundant resources, and complete the transition to Azure.

> [!IMPORTANT] 
> If you prematurely delete AWS resources, overlook hidden dependencies, or skip final data and access checks, you risk data loss, unexpected downtime, compliance violations, or ongoing cost from unused assets.

- **Create final backups and snapshots for archival purposes.**

- **Export your Azure Well-Architected Framework assessment.** Export a static copy of your AWS workload's Well-Architected Framework assessment.

- **Retire AWS workload resources.** Set a date to retire AWS workload resources. Stop and delete Amazon Elastic Compute Cloud (Amazon EC2) instances, databases, and services that you don't need. Ensure that no critical resources run in AWS before you delete them.

- **Confirm resource deletion.** [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html) maintains an inventory of all your AWS resources. You can use it during the decommission phase to ensure that no resources related to your workload are active.

- **Clean up artifacts.** Update your configuration management database (CMDB), billing, and documentation.

- **Reset your time to live (TTL).** Update your TTL to match its original setting.

- **Establish new baselines.** Establish a new performance baseline for your migrated workload in Azure. Measure how your workload and its components behave in terms of response time, throughput, and resource utilization. These metrics provide a point of reference for future optimizations. New baseline metrics also help you check that the workload meets expectations and detect post-migration regression.

- **Do another Well-Architected Framework assessment.** Take the [Well-Architected Review](/assessments/azure-architecture-review/) assessment on your workload. This assessment establishes a baseline and provides potential backlog items for future optimization. Schedule a periodic assessment going forward.

- **Retire AWS monitoring services.** Turn off or remove AWS CloudWatch alarms, dashboards, or logging configurations that the workload used. Shift all critical monitoring to Azure tools. Update runbooks and notification settings so that they don't reference AWS services.

For more information, see [Decommission source workloads after migration to cloud](/azure/cloud-adoption-framework/migrate/decommission-source-workload).

## Checklist

| &nbsp;  | Deliverable tasks                  |
| ------- | ---------------------------------  |
| &#9744; | Finalize data cutover              |
| &#9744; | Create final backups and snapshots |
| &#9744; | Retire AWS resources               |
| &#9744; | Check successful deletion          |
| &#9744; | Clean up artifacts                 |
| &#9744; | Reset TTL                          |
| &#9744; | Establish new baselines            |
| &#9744; | Do a workload assessment           |
| &#9744; | Retire AWS monitoring              |

## Next step

> [!div class="nextstepaction"]
> [Conclusion](migrate-workload-from-aws-conclusion.md)