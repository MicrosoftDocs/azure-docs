---
title: Continuous integration and continuous deployment of Azure Stream Analytics jobs
description: This article gives an overview of setting up a continuous integration and deployment (CI/CD) pipeline for Azure Stream Analytics jobs.
services: stream-analytics
author: alexlzx
ms.author: zhenxilin
ms.service: stream-analytics
ms.topic: how-to
ms.date: 05/24/2023
---

# Continuous integration and continuous deployment (CI/CD) of Stream Analytics jobs

You can build, test and deploy your Azure Stream Analytics (ASA) job using a source control integration. Source control integration creates a workflow in which updating code would trigger a resource deployment to Azure. This article outlines the basic steps for creating a continuous integration and continuous delivery (CI/CD) pipeline.

## Create a CI/CD pipeline

Follow the steps to create a CI/CD pipeline for your Stream Analytics project: 

1. Create a Stream Analytics project using VS Code. You can either create a new project or export an existing job to your local machine using the ASA Tools extension for Visual Studio Code.
    * [Quickstart: Create a Stream Analytics job using VS Code](./quick-create-visual-studio-code.md) 
    * [Export an existing job](visual-studio-code-explore-jobs.md)

2. Commit your Stream Analytics project to your source control system, like a Git repository.

3. Use [Azure Stream Analytics CI/CD tools](cicd-tools.md) to build the projects and generate Azure Resource Manager templates for the deployment.

4. Run [automated script tests](cicd-tools.md#automated-test) for quality regression.

5. [Deploy the job](cicd-tools.md#deploy-to-azure) to Azure automatically.

## Auto build, test, and deploy

You can use the command line and [Azure Stream Analytics CI/CD tools](cicd-tools.md) to auto build, test, and deploy. You can also set up a CI/CD pipeline in [Azure Pipelines](set-up-cicd-pipeline.md). Azure Pipelines to enable more advanced capabilities, such as pipeline management, visualization, and triggers.

## Next steps

* [Automate builds, tests and deployments of an Azure Stream Analytics job using CI/CD tools](cicd-tools.md)
* [Set up a CI/CD pipeline for Stream Analytics job using Azure Pipelines](set-up-cicd-pipeline.md)
