---
title: Migrate deployment approach for AWS Lambda to Azure Functions
description: Deployment specification for migrating AWS Lambda to Azure Functions.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Migrate deployment approach for AWS Lambda to Azure Functions

| :::image type="icon" source="../../migration/images/goal.svg"::: Your infrastructure as code and code deployment solution is migrated. You retain equivelant ability to perform both routine and emergency changes to either the infrastructure or code. |
| :-- |

## Discovery

> [!NOTE]
> **Content developer**: Use this section to help the reader understand the context of their workload. During the discovery phase, they will be able to justify why it's important to carry these over to Azure. Keep in mind that the answers will vary based on the reader's business needs and won't be covered in this article. Enumerate all of the surface area where deployments are happening with both infrastructure and code. These areas are where the customer needs to document current state and learn about the analogs in Azure. Consider the following:
>
> - Code deployment methods (SFTP, APIs, CLI commands)
> - Infrastructure (cloud resource) deployment methods
> - Code with infrastructure capabilities?  (Can I deploy the infra and define the code as well?)
> - Container-based deployments
> - Safe Deployment Practices
> - Emergency operations


Understand the existing authentication and authorization approaches used by your AWS Lambda service:

- Relevant area 1
- Relevant area 2
- Relevant area 3
- Relevant area 4

Your Azure Functions implementation will support all of your current deployment requirements. Without a complete list of requirements for your existing deployment needs, you risk having a migrated solution that doesn't have a way to perform future incremental updates either for route changes or emergency situations.

&#9997; Document your existing deployment requirements through these various discovery activities.

## Infrastructure as code

Your AWS Lamba resources are likely maintained through infrastructure as code. You should bring that practice to Azure in your management of the cloud resources for Azure Functions and its dependencies. You might be using AWS-specific technology or you might be using a cross-cloud technology, such as Terraform, but your existing templates will need to be recreated for Azure.

### Assess the business requirements for infrastructure as code

- Am I restricted to use specific technology?
- Do I do inplace upgrades on infrastructure or follow an immutable infrastructure approach?
- How do I handle deployment stamps?
- Am I required to use enterprise-provided templates, such as from my enterprise architecture team?
- When is AWS console expected or allowed to be used?

### Key technical factors for infrastructure as code

> [!NOTE]
> **Content developer**: Enumerate the typical and prominent features of how AWS Lambda infrastructure is deployed. Consider in place upgrades, immutable infrastructure, AWS console experiences, etc. Try to achieve a one-to-one mapping to similar concerns in Azure Functions. Make a note of gaps.

This table lists the common features of Lambda related to infrastructure deployment and change control through infrastructure as code; and the recommended equivalent in Azure.

| Feature   | AWS implementation | Azure implementation | Migration strategy |
|-----------|--------------|----------------------|--------------------|
| Feature 1 | Description  | Description          | Built-in/custom    |
| Feature 2 | Description  | Description          | Built-in/custom    |
| ...       | ...          | ...                  | ...                |

### Deviations for infrastructure as code

> [!NOTE]
> **Content developer**: Analyze the technical maps and summarize the features that require decision making.

Deviations reflect gaps when one-to-one mapping isn't feasible. You'll need to make decisions for, prioritizing minimal deviation to business requirements. Consider the potential benefits and drawbacks of each mitigation.

Here's the summarized view of the gaps identified in the technical map.

| Feature   | Deviation | Impact | Mitigation |
|-----------|-----------|--------|------------|
| Feature 1 |Description| Impact to business requirements | How could the customer address this during migration|
| Feature n |Description| Impact to business requirements | How could the customer address this during migration|

&#9997; Use the preceding table as a foundation to gather the technical details of the current AWS deployment. Expand on this list by identifying specific elements from your implementation.

## Infrastructure and code deployment pipelines

Your AWS Lambda resources, including dependencies, are likely deployed in a reptable way through pipeline scripts. Your migration to Azure Functions will need to evaluate the suitability of those pipelines and you'll need to decide if you can use those existing solutions or need to migrate deployment technology as well.

### Assess the business requirements for infrastructure and code deployments

- What deployment technology am I using, for example, Octopus Deploy, Jenkins, etc?
- Do I need to host my own deployment instances for compliance or for network isolation purposes?
- How are lifecycle concerns addressed between code and infrastructure?  Deployed seperately, deployed together?
- How is containerized code handled from a container registry perspective?
- Do I have "test in production" support through canary deployments?
- How much downtime do I support for routine deployments?
- What are my safe deployment practice requirements?

### Key technical factors for infrastructure and code deployments

> [!NOTE]
> **Content developer**: Enumerate the typical and prominent features of AWS Lambda's to receive code updates.  What methods? How coupled is it to infrastructure concerns? Do I need line of sight from a deployment VM to the control plane? Try to achieve a one-to-one mapping of deployment features in AWS Lambda implementation points. Make a note of gaps.

This table lists the common features of Lambda related to code deployment and pipeline concerns and the recommended equivalent in Azure.

| Feature   | AWS implementation | Azure implementation | Migration strategy |
|-----------|--------------|----------------------|--------------------|
| Feature 1 | Description  | Description          | Built-in/custom    |
| Feature 2 | Description  | Description          | Built-in/custom    |
| ...       | ...          | ...                  | ...                |

&#9997; Use the preceding table as a foundation to gather the technical details of the current AWS deployment. Expand on this list by identifying specific elements from your implementation.

### Deviations for deployments

> [!NOTE]
> **Content developer**: Analyze the technical maps and summarize the features that require decision making.

Deviations reflect gaps when one-to-one mapping isn't feasible. You'll need to make decisions for, prioritizing minimal deviation to business requirements. Consider the potential benefits and drawbacks of each mitigation.

Here's the summarized view of the gaps identified in the technical map.

| Feature   | Deviation | Impact | Mitigation |
|-----------|-----------|--------|------------|
| Feature 1 |Description| Impact to business requirements | How could the customer address this during migration|
| Feature n |Description| Impact to business requirements | How could the customer address this during migration|

&#9997; Use this list as a starting point and build on it by identifying specifics from your implementation. Clearly outline how to address any deviations as part of the migration process.

## Plan your downtime approach

Your routine infrastructure and code deployment approach to AWS Lambda should be replicated in Azure. However, a migration isn't a typical deployment and is generally a one-time event. The pipelines you use for migration might or might not be the same resources you use for routine changes to your workload, depending on the complications of the migration, such as state syncrhonization.

For this one-time migration, you'll need to make a choice on your approach to initial infrastructure and code deployment, along with day-of migration interruption to live business processes and clients. You'll be migrating the following:

- **Resources**: The cloud resources in AWS and Azure.
- **Function code**: your Lambda function code modified to run in Azure Functions
- **State**: such as data in dependent datastores, contents of event processing queues.

Unless otherwise negotiatied, assume your overall workload SLOs and SLAs still needs to be obtained to during this serverless platform migration. Based on business expectations for this migration, you'll need to select one of the following approachs:

- [Full downtime during migration](#planned-downtime-migration)
- [No downtime during migration](#zero-downtime-zdt-migration)
- [Minimized downtime during migration](#minimized-downtime-migration)

### Planned downtime migration

A planned downtime migration of AWS Lambda is for workloads that can withstand downtime. It's the safest approach to migration because you have a dedicated maintenance window to ensure a complete migration of functionality and state. The maintenance window also supports time to failing back on any discovered issues without state synchronization complications. The general approach is:

  1. Open your downtime maintenance window.
  1. Take AWS Lambda and all depdencies fully offline.
  1. Deploy Azure Functions infrastructure and function code.
  1. Migrate all state to Azure.
  1. Update clients or gateway to start using new resources, shifting all load from AWS to Azure.
  1. Close your maintenance window.

Planned downtime migration can take as much time as you need, which could be a few minutes or a few days depending on the complexity of your AWS Lambda deployment.

### Zero-downtime (ZDT) migration

Zero-downtime (ZDT) migration is for workloads that need minimal (seconds, minutes) to zero downtime and must remain live during the process. For critical workloads, you must attempt to build a live migration plan before resorting to minimized-downtime approach. ZDT migration is only possible if you have built a synchronous state replication process for stateful AWS Lambda dependencies.

  1. Deploy Azure Functions infrastructure and function code.
  1. Keep AWS Lambda and dependencies running in AWS.
  1. Enable a custom state replication process to migrate and keep all state in sync.
  1. After the data synchronizes and stays synchronized through your syncrhonious replication process, activate and validate the endpoints triggers in Azure Functions.
  1. Update clients or gateway to start using Azure, incrementally shifting load from AWS to Azure.
  1. Shut down the AWS resources and state synchronization.

### Minimized-downtime migration

Minimized-downtime migration is for critical workloads that don't support live migration, opening just the smallest possible maintenance window.

  1. Deploy Azure Functions infrastructure and function code.
  1. Keep AWS Lambda and dependencies running in AWS.
  1. Create a backup of all required state in AWS. It's a best practice to create the backup during off-peak hours.
  1. Migrate the backed up state to Azure.
  1. If possible, enable a custom asynchronous state sync process from AWS to Azure to keep state deltas a minimum.
  1. Open your downtime maintenance window.
  1. Cordin and drain all existing usage in AWS.
  1. Migrate remaining state (data delta).
  1. Update clients or gateway to start using Azure, shifting all load from AWS to Azure.
  1. Close your maintenance window.

The minimized-downtime migration can take a few minutes or an hour depending on the rate of change in state data data.

### Technique recommendations

> [!NOTE]
> **Content developer**: Work with your SME to cover any "tips for success" in this deployment topic. Consider talking about things like the following:
>
> - Testing & validation
> - Pre-production vs Dedicated migration environment
> - Estimate timing for each step
> - Agree on maintenance window
> - Use differfent approaches for different environments, but don't make your production migration an untested path.

## Deployment challenges

When planning a migration to Azure, expect challenges in understanding Azure expectations and how they align with the business requirements already achieved in the existing AWS solution running in production. This list presents some of those challenges.

> [!NOTE]
> **Content developer**: Have a discussion with the SME on challenges faced in their customers' migrations in this area. Provide at least two points.

- Potential Issue 1 - Description and mitigation.
- Potential Issue 2 - Description and mitigation.

### Plan your failback approach

Your migration could fail at any step in the process. Your runbook for the migration must address how you'll restore full operations to your AWS Lambda deployment given a failure in migration at all points.

> [!NOTE]
> **Content developer**: Have a discussion with the SME on any recommendations to support failback.

- Tip 1
- Tip 2

## Azure resources

- Link to Bicep resources for Azure Functions
- Link to Terraform resources for Azure Functions
- Link to GitHub actions specific to Azure Functions
- Link to Azure Pipeline steps specific to Azure Functions

## Next step

> [!div class="nextstepaction"]
> [Migrate monitoring capabilities to Azure Functions](./monitoring.md)
