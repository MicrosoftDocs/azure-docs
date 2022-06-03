---
title: Continuous integration and deployment for Azure Stream Analytics 
description: This article gives an overview of a continuous integration and deployment (CI/CD) pipeline for Azure Stream Analytics.
services: stream-analytics
author: su-jie
ms.author: sujie
ms.service: stream-analytics
ms.topic: how-to
ms.date: 9/22/2020
---

# Continuous integration and deployment (CI/CD) for Azure Stream Analytics

You can deploy your Azure Stream Analytics job continuously by using source control integration. Source control integration enables a workflow in which a code update triggers a resource deployment to Azure. This article outlines the basic steps for creating a continuous integration and deployment (CI/CD) pipeline.

If you're new to Azure Stream Analytics, get started with the [Azure Stream Analytics quickstart](stream-analytics-quick-create-portal.md).

## Create a CI/CD pipeline

Follow the steps in this guide to create a CI/CD pipeline for Stream Analytics.

1. Develop an Azure Stream Analytics query.

   Use Azure Stream Analytics tools for [Visual Studio Code](./quick-create-visual-studio-code.md) or [Visual Studio](stream-analytics-quick-create-vs.md) to [develop and test queries locally](develop-locally.md). You can also [export an existing job](visual-studio-code-explore-jobs.md#export-a-job-to-a-local-project) to a local project.

   > [!NOTE] 
   > We strongly recommend using [**Stream Analytics tools for Visual Studio Code**](./quick-create-visual-studio-code.md) for best local development experience. There are known feature gaps in Stream Analytics tools for Visual Studio 2019 (version 2.6.3000.0) and it won't be improved going forward.

2. Commit your Azure Stream Analytics projects to your source control system, like a Git repository.

3. Use [Azure Stream Analytics CI/CD tools](cicd-tools.md) to build the projects and generate Azure Resource Manager templates for the deployment.

4. Run [automated script tests](cicd-tools.md#automated-test) for quality regression.

5. [Deploy the job](cicd-tools.md#deploy-to-azure) to Azure automatically.

## Auto build, test, and deploy

You can use the command line and [Azure Stream Analytics CI/CD tools](cicd-tools.md) to auto build, test, and deploy. You can also set up a CI/CD pipeline in [Azure Pipelines](set-up-cicd-pipeline.md). Azure Pipelines to enable more advanced capabilities, such as pipeline management, visualization, and triggers.

## Next steps

* [Automate builds, tests and deployments of an Azure Stream Analytics job using CI/CD tools](cicd-tools.md)
* [Set up a CI/CD pipeline for Stream Analytics job using Azure Pipelines](set-up-cicd-pipeline.md)
