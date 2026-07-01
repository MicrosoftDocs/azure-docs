---
title: Evaluate your Workload from Amazon Web Services (AWS) After You Migrate to Azure
description: Learn how to evaluate the migration of a single workload from AWS to Azure. Monitor performance, verify baselines, and confirm data cutover.
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
# Evaluate your workload from Amazon Web Services (AWS) after you migrate to Azure

This article is part of a series about how to [migrate a workload from Amazon Web Services (AWS) to Azure](/azure/migration/migrate-workload-from-aws-introduction). 

Congratulations, your workload now serves its users from Azure!

The evaluation phase consists of these steps:

> [!div class="checklist"]
> * Validate the cutover.
> * Sign off on the migration.

:::image type="icon" source="images/goal.svg" alt-text="Goal icon"::: The goal of this phase is to confirm that your workload in Azure meets the functional, performance, reliability, security, and cost baselines that you establish in the planning phase on AWS.

> [!IMPORTANT] 
> Incomplete monitoring, insufficient performance testing, or ineffective cost and security reviews can hide problems that lead to outages, data exposure, or budget overruns later.

## Validate successful cutover

- **Monitor and fine-tune the workload.** Track your workload trends closely for errors, performance bottlenecks, or unusual patterns, especially during the first one to two weeks. Rightsize components, ensure that your scaling strategy works as intended, monitor budget thresholds, and validate your disaster recovery (DR) configurations and backups. Prioritize fixing security problems. Work with your operations team to fine-tune alert thresholds and dashboard views as needed.

- **Measure against baselines.** Verify that you meet the baseline key performance indicators (KPIs) that you documented in the planning phase, like throughput, latency, and error rates. The KPIs should be comparable to the AWS measurements.

- **Validate cutover via AWS logs.** [AWS CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) logs every API call and console action in your AWS account. It exposes any components in your workload that make calls to AWS services. Check that these logs don't show any unintended workload traffic.

- **Check firewall and network flow logs.** Review firewall and network flow logs in Azure to ensure that only the anticipated network traffic occurs. As part of your like-for-like migration, some network traffic allowances might now be obsolete. You can remove them from the network allow lists.

- **Confirm data cutover.** Confirm that Azure serves all production writes and reads based on your cutover strategy. If you use continuous replication or sync, stop it after you confirm that Azure has the authoritative copy of the data.

- **Do key routine tasks.** Do tasks like certificate rotation and off-site backups. Access gated operations, like just-in-time (JIT) access admin elevation. These tasks ensure that your workload operations team and automation settings have sufficient management control over the environment.

- **Schedule a DR failover test.** If your workload supports DR failover tests, schedule a test after the workload core stabilizes.

## Migration sign-off

- **Update the architectural knowledge base.** Ensure that your workload's knowledge base documents last-minute changes to the infrastructure or operational procedures that deviate from the original plan.

- **Complete the handover to the operations team.** Before the final sign-off, meet with the operations team. Confirm that the team accepts full responsibility for monitoring and supporting the Azure workload. Review the new alerting setup, like Azure Monitor alerts and Azure Service Health notifications, and confirm that the team is comfortable with the updated runbooks and dashboards.

- **Meet sign-off milestones.** Sign off only after you meet all predefined success criteria and after you test to confirm that the migration succeeds. For more information, see the acceptance criteria defined in the [planning phase](/azure/migration/migrate-workload-from-aws-plan).

- **Conduct a post-migration assessment.** Document the lessons learned from the workload migration. The migration team should identify what went well, what to improve next time, and any unexpected problems that they encountered. Share the assessment with the stakeholders and other teams in your organization that might plan a workload migration.

- **Plan for future improvements.** Create work items in your backlog for nonurgent improvements, like cost optimization, improved resilience, or reduced technical debt.

## Checklist

| &nbsp; | Deliverable tasks                        |
| ------- | ---------------------------------------- |
| &#9744; | Monitor and fine-tune the workload       |
| &#9744; | Measure against baselines                |
| &#9744; | Validate successful cutover              |
| &#9744; | Check firewall and network flow logs     |
| &#9744; | Confirm data cutover                     |
| &#9744; | Do key routine tasks                     |
| &#9744; | Schedule DR failover test |
| &#9744; | Update architectural knowledge base      |
| &#9744; | Complete handover to operations team     |
| &#9744; | Meet sign-off milestones                 |
| &#9744; | Conduct post-migration assessment        |
| &#9744; | Plan future improvements                 |

## Next step

> [!div class="nextstepaction"]
> [Decommission your AWS resources](./migrate-workload-from-aws-decommission.md)