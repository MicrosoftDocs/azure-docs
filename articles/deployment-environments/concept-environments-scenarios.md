---
title: User scenarios for Azure Deployment Environments
description: Learn about scenarios enabled by Azure Deployment Environments.
ms.service: deployment-environments
ms.topic: conceptual
ms.author: anandmeg
author: meghaanand
ms.date: 07/29/2022
---
# Scenarios for using Azure Deployment Environments

Depending on the needs of an enterprise, 'Project Fidalgo' can be configured to meet different requirements. This article discusses a few possible scenarios, covering their benefits brought by using Project Fidalgo, and the resources to use to implement those scenarios.

- Environments as part of a Pipeline
- Sandboxed investigations
- On-demand Test environments
- Training sessions, hands-on labs, and hackathons

## Environments as part of a CI/CD Pipeline

Creating and managing environments across an enterprise can require significant effort. With 'Project Fidalgo', different types of environments such as Dev, Test, Staging, Pre-Prod, Prod, etc. can be easily created, updated and plugged into a CI/CD pipeline.  In this scenario, 'Project Fidalgo' provides the following benefits:

- Organizations can attach a Catalog and provide common 'infra-as-code' templates to create environments ensuring consistency across teams.
- Developers and Testers can test the latest version of their application by quickly provisioning environments by using reusable templates.
- Development Teams can connect their environments to CI/CD pipelines to enable DevOps scenarios.
- Central Dev IT teams can centrally track costs, security alerts and manage environments across different Projects and DevCenters.

## Sandboxed investigations

Developers often investigate different technologies or infrastructure design. By default, all environments created with 'Project Fidalgo' are created in their own resource group and the Project members get contributor access to those resources by default. This scenario allows developers to add and/or change Azure resources as they need for their development or test environments. Central Dev IT teams can easily and quickly track costs for all the environments used for investigations.

## On-demand Test environments

Often developers need to create ad-hoc test environments that mimic their formal development or testing environments to test a new capability before even checking in the code and executing a pipeline. With 'Project Fidalgo', test environments can be easily created, updated, or duplicated. It allows teams to access a fully configured environment when it’s needed. Developers can test the latest version of their application by quickly creating new ad-hoc environments using reusable templates.

## Trainings, hands-on labs, and hackathons

A Project in 'Project Fidalgo' acts as a great container for transient activities like workshops, hands-on labs, trainings, or hackathons. The service allows you to create a Project where you can provide custom templates that each trainee can use to create identical and isolated environments for training. It’s easy to delete a Project and all related resources when the training is over.

# Proof of concept vs. Scaled Deployment

Once you decide to explore Project Fidalgo, there are two general paths forward: Proof of Concept vs Scaled Deployment.

A **proof of concept** deployment focuses on a concentrated effort from a single team to establish organizational value. While it can be tempting to think of a scaled deployment, the approach tends to fail more often than the proof of concept option. Therefore, we recommend that you start small, learn from the first team, repeat the same approach with two to three additional teams, and then plan for a scaled deployment based on the knowledge gained. For a successful proof of concept, we recommend that you pick one or two teams, and identify their scenarios (Environments as part of a CI/CD Pipeline vs Sandbox environments), document their current use cases, and deploy 'Project Fidalgo'.

A **scaled deployment** consists of weeks of reviewing and planning with an intent of deploying Project Fidalgo to the entire enterprise that has hundreds or thousands of developers.

## Next steps

Read the following articles:

- To get started with the service, [Tutorial: Set up a Fidalgo DevCenter](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/tutorial-create-and-configure-devcenter.md)
- Learn more about [Project Fidalgo Concepts](https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md)