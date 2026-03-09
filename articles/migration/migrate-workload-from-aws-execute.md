---
title: Execute Your Migration from Amazon Web Services (AWS) to Azure
description: Learn how to execute the migration from AWS to Azure. Follow proven cutover strategies, sync data, validate workloads, and ensure rollback readiness.
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
#  Execute your workload migration from Amazon Web Services (AWS) to Azure

This article is part of a series about how to [migrate a workload from Amazon Web Services (AWS) to Azure](/azure/migration/migrate-workload-from-aws-introduction). 

The execute phase consists of these stages:

> [!div class="checklist"]
> * Before cutover
> * During cutover
> * After cutover

:::image type="icon" source="images/goal.svg" alt-text="Goal icon"::: The goal of this phase is to migrate the AWS workload to Azure within the agreed-upon downtime and data-loss limits. Follow your runbook closely and communicate with stakeholders throughout the process.

> [!IMPORTANT] 
> Don't rush testing or skip validation steps.
> 
> The execute phase has the highest risk of service disruption. Data sync problems, network misconfigurations, or unexpected application behavior can cause outages or data loss.

## Before cutover

1. **Open your negotiated maintenance window.**

1. **Execute your data migration.** Align the order of operations with your cutover model. Fully script and test all data migration steps in a nonproduction environment before you start to help ensure that these steps run reliably during cutover.

   - For live, or active, replication scenarios, set up continuous data sync between AWS and Azure. This approach minimizes downtime and helps ensure data consistency during cutover.

   - For backup-and-restore models, back up all of your AWS data. Securely transfer the backup to Azure and then restore it in the target environment. Validate the integrity of the data before you take the next step.

1. **Set up your application's components.** Connect each component to its dependencies. Some of these dependencies might remain on AWS. For example, in a phased migration approach, you might keep your database on AWS initially and migrate it later.

1. **Modify connectivity and networking settings.** Ensure that your Azure resources can reach dependencies on AWS and that your AWS resources can reach dependencies on Azure when required. Adjust your firewall rules, network security group (NSG) rules and policies, and routing so that they meet your requirements. Test and validate all connectivity changes in earlier phases to reduce troubleshooting in this phase.

1. **Run simple tests.** Do functional, performance, and failure testing. Keep these tests simple. Do extensive functional or load testing in the preceding phases.

1. **Iterate and fix problems early.** Plan thoroughly to help minimize fixes during this stage. If you run into problems, resolve them now. Common problems include paths in scripts or API calls that don't match expected values, Azure service-limit violations, and quota limits that you might need to increase. If you use Terraform, some Azure resource features might require different implementations.

1. **Reduce the time to live (TTL).** Reduce the TTL before cutover and account for propagation delay in your rollback planning.

1. **Update fully qualified domain names (FQDNs) and Domain Name System (DNS) routing.** Apply the FQDN transition plan that you defined during the planning phase. Update DNS records to point existing FQDNs to Azure endpoints or modify application configurations to use new Azure FQDNs. For public-facing services, carefully coordinate DNS cutover to minimize downtime.

## During cutover

> [!IMPORTANT]
> Follow your runbook and communicate with stakeholders about cutover progress. Include any expected changes to the timeline or other problems that they should be aware of.

How you complete this step depends on your chosen strategy. In the recommended blue-green approach, you switch all traffic at the same time during a cutover window. You must sync all data and prepare components to accept production traffic. Then you switch all connections to Azure and bring up your Azure environment as the primary environment. We recommend a maintenance window, during which you briefly pause traffic or the application to avoid inconsistencies. Automate health checks and monitor in real time during the cutover.

Work closely with operations teams to ensure that you address emerging problems immediately. The migration team and operations engineers should actively monitor a real-time health dashboard by using Azure Monitor or custom telemetry. Any anomalies should trigger immediate alerts and responses. Prepare to roll back if you can't resolve problems within the rollback criteria that you defined in the [planning phase](/azure/migration/migrate-workload-from-aws-plan).

## After cutover

1. **Maintain rollback readiness.** Keep the AWS environment available during your validation window in case you need to roll back. When you're confident in the Azure environment, decommission the AWS resources.

1. **Do post-cutover verification.** Monitor your workload metrics in Azure closely. If they degrade severely or you detect a critical bug, implement your rollback plan and be ready to revert traffic back to AWS. Run a full regression test in production if possible and check all components. Run smoke tests for critical functions, watch your security logs, and make sure that all monitoring signals and alerts are green. After a day or two, monitor costs and usage to find any runaway resources that might incur unnecessary costs.

1. **Update continuous integration and continuous delivery (CI/CD) pipelines for Azure.** Update deployment pipelines to stop targeting AWS and only target Azure.

1. **Update documentation and procedures.** Revise all production runbooks, support documents, and operational procedures to match the new Azure environment.

1. **Hand off operational monitoring.** Confirm that the operations team assumes ownership of monitoring the Azure environment. They should now use the Azure Monitor dashboards and alerts that you set up earlier to monitor the workload's health. Address any knowledge gaps as the team transitions into primary support for the Azure deployment.

For more information, see [Migrate to the cloud](/azure/cloud-adoption-framework/migrate/execute-migration).

## Checklist

| &nbsp; | Deliverable tasks |
| ------- | ----------------------------------- |
| &#9744; | Execute data migration |
| &#9744; | Set up application components |
| &#9744; | Modify connectivity and networking settings |
| &#9744; | Do functional tests |
| &#9744; | Do performance tests |
| &#9744; | Do failure testing |
| &#9744; | Fix all problems |
| &#9744; | Reduce the TTL |
| &#9744; | Update FQDNs and DNS routing |
| &#9744; | Maintain rollback readiness |
| &#9744; | Do post-cutover verification |
| &#9744; | Update CI/CD pipelines for Azure |
| &#9744; | Update documentation and procedures |
| &#9744; | Hand off operational monitoring |

## Next step

> [!div class="nextstepaction"]
> [Evaluate your migration status](./migrate-workload-from-aws-evaluate.md)