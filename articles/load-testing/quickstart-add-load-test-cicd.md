---
title: 'Add load test to CI/CD'
description: 'This quickstart shows how to run your load tests with Azure Load Testing in CI/CD. Learn how to add a load test to GitHub Actions or Azure Pipelines.'
author: ntrogh
ms.author: nicktrog
ms.service: load-testing
ms.topic: quickstart 
ms.date: 06/05/2023
---

# Quickstart: Automate a load test with CI/CD in GitHub Actions or Azure Pipelines

Get started with automating load tests in Azure Load Testing by adding it to a CI/CD pipeline. After running a load test in the Azure portal, you export the configuration files, and configure a CI/CD pipeline in GitHub Actions or Azure Pipelines. After you complete this quickstart, you have a CI/CD workflow that is configured to run a load test with Azure Load Testing.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Load Testing test. Create a [URL-based load test](./quickstart-create-and-run-load-test.md) or [use an existing JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md) to create a load test.

# [GitHub Actions](#tab/github)
- A GitHub account. If you don't have a GitHub account, you can [create one for free](https://github.com/).
- A GitHub repository to store the load test input files and create a GitHub Actions workflow. To create one, see [Creating a new repository](https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).

# [Azure Pipelines](#tab/pipelines)
- An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops&preserve-view=true). If you need help with getting started with Azure Pipelines, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline?preserve-view=true&view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).
---

## Configure service authentication

Before you configure the CI/CD pipeline to run a load test, you'll grant the CI/CD workflow the permissions to access your Azure load testing resource.

## Export load test input files

## Add Azure Load Testing to the CI/CD workflow

## Run workflow and view test results

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

Advance to the next article to learn how to use identify performance regressions by defining test fail criteria and comparing test runs.

> [!div class="nextstepaction"]
> [Next steps button](./tutorial-identify-performance-regression-with-cicd.md)
