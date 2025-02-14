---
title: Migrate deployment assests for AWS Lambda to Azure Functions
description: Deployment specification for migrating AWS Lambda to Azure Functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Migrate deployment assests for AWS Lambda to Azure Functions

| :::image type="icon" source="../../migration/images/goal.svg"::: TBD |
| :-- |

### Plan your downtime approach

- Resources: The cloud resources in AWS and Azure.
- Code: your Lambda function code modified to run in Azure Functions
- State: such as data in dependent datastores, contents of event processing queues.

Unless otherwise negotiatied, assume your overall workload SLOs and SLAs still needs to be obtained to during this serverless platform migration.

#### Planned downtime migration

A planned downtime migration of AWS Lambda is for workloads that can withstand downtime. It's the safest approach to migration because you have a dedicated maintenance window to ensure a complete migration of functionality and state. The maintenance window also supports time to failing back on any discovered issues without state synchronization complications.

Here's an overview of the planned dowtime migration process from AWS Lambda to Azure Functions.

  1. Open your downtime maintenance window.
  1. Take AWS Lambda and all depdencies offline and shut down services.
  1. Migrate any state to Azure.
  1. Deploy Azure Functions and all dependencies in Azure.
  1. Restore state in Azure.
  1. Deploy function code.
  1. Validate deployment.
  1. Update clients or gateway to start using new resources
  1. Close your maintenance window.

Planned downtime migration can take as much time as you need, which could be a few minutes or a few days depending on the complexity of your AWS Lambda deployment.

#### Zero-downtime (ZDT) migration

Zero-downtime (ZDT) migration is for workloads that need minimal (seconds, minutes) to zero downtime and must remain live during the process. For critical workloads, you must attempt to build a live migration plan before resorting to minimized-downtime approach. ZDT migration is only possible if you have built a synchronous state replication process for stateful AWS Lambda dependencies.

Here's an overview of the zero-downtime migration process.

  1. Deploy Azure Functions, all dependencies, and the function application code in Azure.
  1. Keep AWS Lambda and dependencies running in AWS.
  1. Enable a custom state replication process to migrate and keep a state in sync.
  1. After the data synchronizes and stays synchronized through your syncrhonious replication process, activate and validate the endpoints triggers in Azure Functions.
  1. Update clients or gateway to start using new resources. Depending on your implementation, you might need to open a brief maintenance window for this change.
  1. Shut down the service and state synchronization in AWS.

#### Minimized-downtime migration

Minimized-downtime migration is for critical workloads that don't support live migration. Here's the warm migration process.

  1. Deploy Azure Functions, all dependencies, and the function application code in Azure.
  1. Keep AWS Lambda and dependencies running in AWS.
  1. Create a backup of all required state in AWS. It's a best practice to create the backup during off-peak hours.
  1. Migrate the backed up state data to Azure.
  1. If possible, enable a custom asynchronous state sync process from AWS to Azure to keep state deltas a minimum.
  1. After the backup data is restored, activate and validate the endpoints triggers in Azure Functions.
  1. Open your downtime maintenance window.
  1. Cordin and drain all existing usage in AWS.
  1. Migrate remaining state (data delta).
  1. After the delta data is restored, activate and validate the endpoints triggers in Azure Functions.
  1. Update clients or gateway to start using new resources.
  1. Close your maintenance window.

The minimized-downtime migration can take a few minutes or an hour depending on the rate of change in state data data.

### Technique recommendations

- IAC
- Testing & validation
- Pre-production / Migration environment
- Estimate timing for each step
- Agree on maintenance window
- Use differfent approaches for different environments, but don't make your production migration an untested path.

### Plan you failback approach

Your migration could fail at any step in the process. Your runbook for the migration must address how you'll restore full operations to your AWS Lambda deployment given a failure in migration at all points.

## Next step

> [!div class="nextstepaction"]
> [Address $TOPIC in your AWS Lambda migration](./governance.md)