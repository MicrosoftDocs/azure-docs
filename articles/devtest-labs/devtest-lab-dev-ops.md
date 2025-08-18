---
title: Integrate Azure DevTest Labs with DevOps CI/CD Pipelines
description: Learn how to use Azure DevTest Labs with continuous integration (CI) and continuous delivery (CD) pipelines in an enterprise environment.
ms.topic: concept-article 
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/18/2025
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to integrate Azure DevTest Labs with DevOps so that I can take advantage of the benefits of CI/CD pipelines.
---

# Integrate DevTest Labs and DevOps CI/CD pipelines

DevOps is a software development methodology that integrates software development (Dev) with system operations (Ops). The system helps you deliver new software features, updates, and fixes that align with business goals.

DevOps methodology also covers:

- Designing new features based on goals, usage patterns, and customer feedback.
- Fixing, recovering, and hardening the system when issues occur.

One component of DevOps methodology is the continuous integration (CI) and continuous delivery (CD) pipeline. A CI/CD pipeline moves information, code, and resources from a source control commit through a series of steps to produce the system. Steps include build, test, and release.

You can use Azure DevTest Labs in CI/CD pipelines. This article discusses using DevTest Labs in CI/CD build, test, and release pipelines in an enterprise environment.

## Benefits of using DevTest Labs in DevOps workflows

A lab should be used only by a team that's working on a feature area. This focus enables faster changes but limits any negative effects to a smaller group. Changes or problems happen in the lab environment, without affecting anything else.

This focus also enables the sharing of area-specific resources, like tools, scripts, and Azure Resource Manager (ARM) templates. Developers can use shared resources to create virtual machines (VMs) with all the code, tools, and configuration they need. ARM templates create lab VMs and lab environments with the appropriate Azure resources. The templates create resources dynamically or by creating base images with customizations.

For example, consider a scenario in which the product is a standalone system that installs on a customer's machine. To enable quick inner-loop code testing, DevTest Labs can create lab VMs that have customer software, artifacts, and configurations installed.

Here are some benefits of using labs in DevOps workflows:

- **Focused access.** Using a lab as a component associates a specific ecosystem with limited people. Usually, a team or group working in a common area or a specific feature has a lab assigned to them.

- **Infrastructure replication in the cloud.** A developer can quickly set up a development ecosystem that includes a developer VM with source code and tools. To enable faster inner-loop development, a developer can also create an environment that's nearly identical to the production configuration.

- **Pre-production environments.** To enable asynchronous testing, a lab in the CI/CD pipeline can run several different pre-production environments or machines at the same time. You can deploy and manage different support infrastructures and build agents in a lab.

## Use labs in CI/CD pipelines

The CI/CD pipeline is a critical DevOps component. The pipeline integrates the code from a developer's pull request with existing code, and deploys the code to the production ecosystem. For DevTest Labs integration, not all resources need to be in a lab. For example, you could set up a Jenkins host outside the lab for a more persistent resource. Here are some specific examples of integrating labs into the CI/CD pipeline.

### Build

The build pipeline creates a package of components to test together and hand off to release. Dynamically building infrastructure enables greater control. Labs can be part of the build pipeline as locations for build agents and other support resources. DevTest Labs can restrict lab access. Doing so increases security for build agents and reduces the possibility of accidental corruption.

Because you can have multiple environments in a lab, each build can run asynchronously. The build ID is part of the environment information that uniquely identifies the resources in a specific build.

### Test

A CI/CD pipeline can automate creating DevTest Labs resources like VMs and environments for automated and manual testing. The pipeline uses build information artifacts or formulas to create VMs that have different custom test configurations.

### Release

The release process can use DevTest Labs for verification before the code is deployed. The process is similar to testing. Production resources shouldn't be deployed in DevTest Labs.

### Customization

[Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines), a component of Azure DevOps Services, provides existing tasks for manipulating VMs and environments in specific labs. Azure Pipelines is one way to manage the CI/CD pipeline. You can integrate a lab into any system that supports calling REST APIs, running PowerShell scripts, or using Azure CLI.

Some CI/CD pipeline managers have existing open-source plug-ins that can manage Azure and DevTest Labs resources. You might need to use custom scripting to fit the needs of the pipeline. When you run a task, use a service principal with the appropriate role, usually Contributor, to access the lab.

## Next steps

- [Integrate DevTest Labs into Azure Pipelines](devtest-lab-integrate-ci-cd.md)
- [Integrate environments into your CI/CD pipelines](integrate-environments-devops-pipeline.md)
- [Use DevTest Labs in Azure Pipelines build and release pipelines](use-devtest-labs-build-release-pipelines.md)
 
