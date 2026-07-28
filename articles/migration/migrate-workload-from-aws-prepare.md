---
title: Prepare Your Workload Migration from Amazon Web Services (AWS) to Azure
description: Learn how to prepare a single workload for migration from AWS to Azure. Deploy infrastructure, refactor code, and test security for a smooth transition.
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
# Prepare your workload migration from Amazon Web Services (AWS) to Azure

This article is part of a series about how to [migrate a workload from Amazon Web Services (AWS) to Azure](/azure/migration/migrate-workload-from-aws-introduction).

The preparation phase consists of these steps:

> [!div class="checklist"]
> * Prepare the environment.
> * Prepare the application.

:::image type="icon" source="images/goal.svg" alt-text="Goal icon"::: The goal of this phase is to prepare your existing workload for migration. Deploy as much of your workload infrastructure and code in Azure as possible before you start the migration. Appropriate preparation reduces the amount of effort spent during migration and gives you ample testing opportunities.

During this phase, you build your Azure environment, refactor any code if needed, set up your continuous integration and continuous delivery (CI/CD) tooling and pipelines, and do tests to build confidence in your migration approach.

> [!IMPORTANT]
> Take your time during this phase. Any misconfigured infrastructure, insufficient testing, or the team's unreadiness can cause delays, security vulnerabilities, or failed deployments during migration.

## Prepare your environment

- **Provision application landing zones.** Give your Azure workload design to your Azure platform team so that they can provision the [Azure application landing zones](/azure/cloud-adoption-framework/ready/landing-zone/implementation-options) for your preproduction and production workload environments.

- **Set up migration tools.** If you plan to use Azure Migrate for the execution phase, deploy the Azure Migrate appliance and configure your Azure Migrate project. This approach ensures that all target Azure resources and discovery processes are ready before you cut over.

- **Deploy and configure Azure infrastructure.** Use infrastructure as code (IaC) to deploy your resources. This approach ensures consistency and repeatability. If your teams want to continue to use Terraform to write deployment scripts, they must write new scripts and modules for your Azure resources. If your existing deployment scripts use [AWS CloudFormation](https://docs.aws.amazon.com/cloudformation/), then use [Bicep](/azure/azure-resource-manager/bicep/) to deploy on Azure. Focus on nonproduction environments first and validate everything before you move on to production environments.

- **Update CI/CD pipelines for Azure to keep environments aligned.**

  - Modify your deployment pipelines to target Azure services.

  - Configure the service connections and ensure that your build and release workflows can deploy your selected Azure compute resources, like Azure App Service, Azure Kubernetes Service (AKS), or Azure Virtual Machines.

  - If you use a blue-green approach, ensure that you can deploy the workload to both AWS and Azure during the transition. For example, you might need to apply an urgent fix or support a rollback.

- **Test your infrastructure.** Validate your Azure Virtual WAN or hub network and any other foundational services, like AWS Direct Connect and Azure ExpressRoute or virtual private network (VPN) connections. Ensure that they support the target workload and the migration process. Validate end-to-end connectivity across your Azure and AWS environments. Use [Azure Chaos Studio](/azure/chaos-studio/) to simulate potential faults, like virtual machine (VM) or networking outages. Ensure that the migrated workload remains resilient under these circumstances.

- **Test your networking and security.** When you set up network security groups (NSGs), firewalls, and policies, check that the application can communicate with all required services. Perform connectivity tests to ensure that security settings aren't too restrictive or too permissive. Adjust settings as needed to maintain security and functionality.

	- Confirm that all required ports are open between Azure and AWS environments.

	- Validate firewall rules and NSG or application security group (ASG) configurations.

	- Document any temporary security exceptions needed during migration.

	- Ensure that rollback plans account for reverting any security-related changes.

## Prepare your application

- **Remove obsolete parts of your workload.** If your AWS workload has features, infrastructure, or operational processes that you don't use, remove them from your workload. This step can reduce the surface area of the migration and narrow infrastructure and testing.

- **Minimize changes to production workloads in AWS.** As you approach migration, minimize changes to the workload. Avoid changes that introduce new infrastructure, capabilities, or dependencies that might put the migration at risk.

- **Refactor your application's code.** Use feature flags to simplify feature and configuration management between the AWS and Azure environments.

- **Replace AWS-specific libraries and SDKs.** Many applications rely on AWS-native libraries or SDKs for storage, messaging, or authentication. These libraries and SDKs typically aren't compatible with Azure services. During refactoring, identify and replace AWS-specific libraries with Azure equivalents or platform-agnostic alternatives. This step helps you avoid runtime errors and ensures that your application integrates with Azure services.

   > [!TIP]
   > Tools like GitHub Copilot can help developers identify and refactor AWS-specific code, like SDK calls or service integrations, to Azure-compatible equivalents. Use Copilot to accelerate the transition and reduce manual effort.

- **Coordinate client configuration changes.** Ensure that you implement and validate all client-facing configuration changes. Provide preproduction environments for client teams to test updates to endpoints, authentication, and connectivity.

- **Prepare your operational functions.** Work with your operations team to implement workload monitoring in Azure. Set up Azure Monitor or Application Insights with dashboards and alert rules equivalent to your AWS CloudWatch alarms. Train the operations team on these tools. Collaborate with the security team to implement security monitoring and validate the Azure architecture. Validate that you can conduct your workload's routine, unplanned, and emergency operational tasks on Azure.

For more information about preparing your workloads and building your Azure environment, see [Prepare workloads for the cloud](/azure/cloud-adoption-framework/migrate/prepare-workloads-cloud).

## Checklist

| &nbsp;  | Deliverable tasks                              |
| ------- | ---------------------------------------------- |
| &#9744; | Provision application landing zones            |
| &#9744; | Deploy and configure Azure infrastructure      |
| &#9744; | Update CI/CD pipelines for Azure               |
| &#9744; | Test infrastructure                            |
| &#9744; | Test your networking and security              |
| &#9744; | Remove obsolete parts of your workload         |
| &#9744; | Minimize changes to production workload in AWS |
| &#9744; | Refactor application's code                    |
| &#9744; | Replace AWS-specific libraries and SDKs        |
| &#9744; | Coordinate client configuration changes        |
| &#9744; | Prepare operational functions                  |


## Next step

> [!div class="nextstepaction"]
> [Execute your migration](./migrate-workload-from-aws-execute.md)