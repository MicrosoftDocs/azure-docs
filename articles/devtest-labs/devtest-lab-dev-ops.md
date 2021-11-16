---
title: Integrate Azure DevTest Labs with DevOps pipelines
description: Learn how to use Azure DevTest Labs with a continuous integration (CI) and continuous delivery (CD) pipeline in an enterprise environment.
ms.topic: conceptual
ms.date: 11/16/2021
---

# Integrate Azure DevTest Labs and DevOps pipelines

DevOps is a software development methodology that integrates software development (Dev) with system operations (Ops). The system delivers new software features, updates, and fixes that align with business goals.

DevOps methodology also covers:

- Designing new features based on goals, usage patterns, and customer feedback.
- Fixing, recovering, and hardening the system when issues occur.

One component of DevOps methodology is the continuous integration (CI) and continuous delivery (CD) pipeline. A CI/CD pipeline moves information, code, and resources from a source control commit through a series of steps to produce the system. Steps include build, test, and release.

You can use Azure DevTest Labs in DevOps CI/CD pipelines. This article discusses using DevTest Labs with DevOps pipelines in an enterprise environment.

## Benefits of DevTest Labs in DevOps workflows

A lab should be focused on a team that's working in a feature area. This common focus allows faster changes, while limiting any negative effects to a smaller group. Changes or destructive work happen against the lab environment, without affecting anything else.

The common focus allows for sharing area-specific resources, like tools, scripts, and Azure Resource Manager (ARM) templates. By using shared resources, developers can create development virtual machines (VMs) with all the needed code, tools, and configuration. Developers can create resources dynamically, or in a system that creates base images with customizations. ARM templates can create lab VMs and lab environments based on the appropriate Azure resources.

For example, consider a scenario where the product is a standalone system installed on a customer's machine. In this scenario, DevTest Labs VM creation can include installing customer software and using customer artifacts and configurations, for quicker inner loop code testing.

Here are some benefits of using labs in DevOps workflows:

- **Focused access:** Using a lab as a component associates a specific ecosystem with limited people. Usually, a team or group working in a common area or a specific feature has a lab assigned to them.

- **Infrastructure replication in the cloud:** A developer can quickly set up a development ecosystem that includes a developer VM with source code and tools. A developer can also create an environment that's nearly identical to the production configuration, for faster inner loop development.

- **Pre-production environments:** A lab in the CI/CD pipeline can run several different pre-production environments or machines at the same time for asynchronous testing. You can deploy and manage different support infrastructure such as build agents with a lab.

## Use labs in CI/CD pipelines

The CI/CD pipeline is a critical DevOps component. The pipeline integrates the code from a developer's pull request with existing code, and deploys the code to the production ecosystem. For DevTest Labs integration, not all resources need to be in a lab. For example, you could set up a Jenkins host outside the lab for a more persistent resource. Here are some specific examples of integrating labs into the CI/CD pipeline.

### Build

The build pipeline creates a package of components to test together and hand off to release. Dynamically building infrastructure allows for greater control. Labs can be part of the build pipeline as locations for build agents and other support resources. DevTest Labs can restrict lab access, which increases security for build agents and reduces the possibility of accidental corruption.

With the ability to have multiple environments in a lab, each build can run asynchronously. The build ID is part of the environment information that uniquely identifies the resources in a specific build.

### Test

A CI/CD pipeline can automate creating DevTest Labs resources like VMs and environments for automated and manual testing. The pipeline uses build information artifacts or formulas to create VMs with different custom test configurations.

### Release

The release process can use DevTest Labs for verification before the code is deployed. The process is similar to testing. Production resources shouldn't be deployed in DevTest Labs.

### Customization

[Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines), a component of Azure DevOps Services, has existing tasks to manipulate VMs and environments within specific labs. Azure Pipelines is one way to manage the CI/CD pipeline. You can integrate a lab into any system that supports calling REST APIs, executing PowerShell scripts, or using Azure CLI.

Some CI/CD pipeline managers have existing open-source plugins that can manage Azure and DevTest Labs resources. You might need to use custom scripting to fit the needs of the pipeline. When executing a task, use a service principal with the appropriate role, usually Contributor, to access the lab. For more information, see [Integrate Azure DevTest Labs into your Azure Pipelines CI/CD pipeline](devtest-lab-integrate-ci-cd.md).

## Next steps

- [Integrate environments into your CI/CD pipelines](integrate-environments-devops-pipeline.md)
- [Use DevTest Labs in Azure Pipelines build and release pipelines](use-devtest-labs-build-release-pipelines.md)
 