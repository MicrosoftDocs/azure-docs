---
title: Usage scenarios for Azure Deployment Environments
description: Learn how Azure Deployment Environments can be integrated into CI/CD pipelines, create sandboxes, and hackathon environments.
ms.service: deployment-environments
ms.custom: ignite-2022, build-2023
ms.topic: conceptual
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/25/2023
---
# Scenarios for using Azure Deployment Environments

This article discusses a few possible scenarios for Azure Deployment Environments, along with the resources that an organization can use to implement those scenarios. Azure Deployment Environments can be configured to meet the needs of an enterprise. 

## Environments as part of a CI/CD pipeline

Creating and managing environments across an enterprise can require significant effort. With Azure Deployment Environments, different types of product lifecycle environments (such as development, testing, staging, pre-production, and production) can be easily created, updated, and plugged into a continuous integration and continuous delivery (CI/CD) pipeline.

In this scenario, Azure Deployment Environments provides the following benefits:

- Organizations can attach a [catalog](./concept-environments-key-concepts.md#catalogs) and provide common infrastructure as code (IaC) templates to create environments, to help ensure consistency across teams.
- Developers and testers can test the latest version of their application by using reusable templates to quickly provision environments.
- Development teams can connect their environments to CI/CD pipelines to enable DevOps scenarios.
- Central dev IT teams can centrally track costs, track security alerts, and manage environments across projects and dev centers.

## Sandbox environments for investigations

Developers often investigate different technologies or infrastructure designs. By default, all environments created with Azure Deployment Environments are in their own resource group. Project members get contributor access to those resources by default. 

In this scenario, Azure Deployment Environments provides the following benefits:
- Developers can add and change Azure resources as they need for their development or test environments.
- Central dev IT teams can easily track costs for all the environments that are used for investigations.

## On-demand test environments

Developers often need to create ad hoc environments that mimic their formal development or test environments, to test a new capability before checking in the code and executing a pipeline. With Azure Deployment Environments, developers can easily create, update, or duplicate test environments. 

In this scenario, Azure Deployment Environments provides the following benefits:
- Teams can access a fully configured environment when it's needed. 
- Developers can test the latest version of an application by using reusable templates to quickly create new ad hoc environments.

## Training, hands-on labs, and hackathons

A project in Azure Deployment Environments acts as a container for transient activities like workshops, hands-on labs, trainings, or hackathons. You can create a project to provide custom templates to each user.

In this scenario, Azure Deployment Environments provides the following benefits: 
- Each user can create identical and isolated environments for training. 
- You can easily delete a project and all related resources when the training is over.

## Deployment options

After you decide to explore Azure Deployment Environments, there are two general paths forward: proof-of-concept deployment or scaled deployment.

### Proof-of-concept deployment

A proof-of-concept deployment is a concentrated effort from a single team to establish organizational value. Although it can be tempting to start with a scaled deployment, that approach tends to fail more often than the proof-of-concept option. 

We recommend that you start small, learn from the first team, repeat the same approach with two to three additional teams, and then plan for a scaled deployment based on the knowledge gained. For a successful proof of concept, we recommend that you pick one or two teams, identify their scenarios ([environments as part of a CI/CD pipeline](#environments-as-part-of-a-cicd-pipeline) versus [sandbox environments](#sandbox-environments-for-investigations)), document their current use cases, and then deploy Azure Deployment Environments.

### Scaled deployment

A scaled deployment consists of weeks of reviewing and planning with an intent of deploying Azure Deployment Environments to the entire enterprise, which has hundreds or thousands of developers.

## Next steps

- To get started with the service, see [Quickstart: Create and configure the Azure Deployment Environments dev center](./quickstart-create-and-configure-devcenter.md).
- Learn more about [Azure Deployment Environments key concepts](./concept-environments-key-concepts.md).
