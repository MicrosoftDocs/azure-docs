---
title: Continuous integration and continuous deployment for Azure Stream Analytics 
description: This article gives an overview of a CI/CD pipeline for Azure Stream Analytics.
services: stream-analytics
author: sujie
ms.author: sujie
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: how-to
ms.date: 9/22/2020
---

# Continuous integration and continuous deployment (CI/CD) for Azure Stream Analytics

Azure Stream Analytics allows you to deploy your job continuously by using source control integration. Source control integration enables a workflow in which a code update triggers deployment to Azure. If you're new to Azure Stream Analytics, get started with the [Azure Stream Analytics quickstart](stream-analytics-quick-create-portal.md).

## Create a CI/CD pipeline

You can setup continuous integration and deployment pipelines for Azure Stream Analytics by following the steps below:

1. Develop an Azure Stream Analytics query.

   Use [Azure Stream Analytics tools for Visual Studio Code](visual-studio-code-explore-jobs.md) or Visual Studio to [develop and test queries locally](visual-studio-code-local-run.md) or [export an existing job to a local project](resource-manager-export.md).

2. Commit your Azure Stream Analytics projects to your source control system, like a Git repository.

3. Use [Azure Stream Analytics CI/CD tools]() to build the projects on an arbitrary machine to do syntax check and generate Azure Resource Management Templates for deployment.

4. Optionally, you can run [automated script test]() for quality regression.

5. [Deploy the job to Azure]() automatically.

## Auto build, test and deploy

You can use the command lines from [Azure Stream Analytics CI/CD tools](cicd-tools.md) to perform auto build, test and deployment or [setup a CI/CD pipeline in Azure Pipelines](setup-cicd-pipeline.md) to enable more advanced capabilibities (pipleline management, visualization, trigger, etc).

## Next steps

* [Automate build, test and deployment of an Azure Stream Analytics job using CI/CD tools](cicd-tools.md)
* [Setup a CI/CD pipeline for Stream Analytics job using Azure Pipelines](setup-cicd-pipeline.md)
