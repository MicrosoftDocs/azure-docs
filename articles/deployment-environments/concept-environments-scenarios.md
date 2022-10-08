---
title: User scenarios for Azure Deployment Environments
description: Learn about scenarios enabled by Azure Deployment Environments.
ms.service: deployment-environments
ms.custom: ignite-2022
ms.topic: conceptual
ms.author: meghaanand
author: anandmeg
ms.date: 10/12/2022
---
# Scenarios for using Azure Deployment Environments Preview

This article discusses a few possible scenarios and benefits of Azure Deployment Environments Preview, and the resources used to implement those scenarios. Depending on the needs of an enterprise, Azure Deployment Environments can be configured to meet different requirements. 

Some possible scenarios are:
- Environments as part of a CI/CD pipeline
- Sandbox environments for investigations
- On-demand test environments
- Training sessions, hands-on labs, and hackathons

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Environments as part of a CI/CD pipeline

Creating and managing environments across an enterprise can require significant effort. With Azure Deployment Environments, different types of product lifecycle environments such as development, testing, staging, pre-Production, Production, etc. can be easily created, updated, and plugged into a CI/CD pipeline.

In this scenario, Azure Deployment Environments provides the following benefits:

- Organizations can attach a [Catalog](./concept-environments-key-concepts.md#catalogs) and provide common 'infra-as-code' templates to create environments ensuring consistency across teams.
- Developers and testers can test the latest version of their application by quickly provisioning environments by using reusable templates.
- Development teams can connect their environments to CI/CD pipelines to enable DevOps scenarios.
- Central Dev IT teams can centrally track costs, security alerts, and manage environments across different projects and dev centers.

## Sandbox environments for investigations

Developers often investigate different technologies or infrastructure designs. By default, all environments created with Azure Deployment Environments are created in their own resource group and the Project members get contributor access to those resources by default. 

In this scenario, Azure Deployment Environments provides the following benefits:
 - Allows developers to add and/or change Azure resources as they need for their development or test environments.
 - Central Dev IT teams can easily and quickly track costs for all the environments used for investigation purposes.

## On-demand test environments

Often developers need to create adhoc test environments that mimic their formal development or testing environments to test a new capability before checking in the code and executing a pipeline. With Azure Deployment Environments, test environments can be easily created, updated, or duplicated. 

In this scenario, Azure Deployment Environments provides the following benefits:
- Allows teams to access a fully configured environment when it’s needed. 
- Developers can test the latest version of their application by quickly creating new adhoc environments using reusable templates.

## Trainings, hands-on labs, and hackathons

A Project in Azure Deployment Environments acts as a great container for transient activities like workshops, hands-on labs, trainings, or hackathons. The service allows you to create a Project where you can provide custom templates to each user.

In this scenario, Azure Deployment Environments provides the following benefits: 
- Each trainee can create identical and isolated environments for training. 
- Easily delete a Project and all related resources when the training is over.

## Proof of concept deployment vs. scaled deployment

Once you decide to explore Azure Deployment Environments, there are two general paths forward: Proof of concept vs scaled deployment.

### Proof of concept deployment

A **proof of concept** deployment focuses on a concentrated effort from a single team to establish organizational value. While it can be tempting to think of a scaled deployment, the approach tends to fail more often than the proof of concept option. Therefore, we recommend that you start small, learn from the first team, repeat the same approach with two to three additional teams, and then plan for a scaled deployment based on the knowledge gained. For a successful proof of concept, we recommend that you pick one or two teams, and identify their scenarios ([environments as part of a CI/CD pipeline](#environments-as-part-of-a-cicd-pipeline) vs [sandbox environments](#sandbox-environments-for-investigations)), document their current use cases, and then deploy Azure Deployment Environments.

### Scaled deployment

A **scaled deployment** consists of weeks of reviewing and planning with an intent of deploying Azure Deployment Environments to the entire enterprise that has hundreds or thousands of developers.

## Next steps

- To get started with the service, [Quickstart: Create and configure the Azure Deployment Environments dev center](./quickstart-create-and-configure-devcenter.md)
- Learn more about [Azure Deployment Environments key concepts](./concept-environments-key-concepts.md)
