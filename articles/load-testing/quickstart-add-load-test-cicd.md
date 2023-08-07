---
title: 'Quickstart: Configure a CI/CD pipeline for a load test from Azure portal'
titleSuffix: Azure Load Testing
description: 'Learn how to configure a CI/CD pipeline for an existing load test in Azure Load Testing from Azure portal'
services: load-testing
ms.service: load-testing
ms.topic: quickstart
author: ninallam
ms.author: ninallam
ms.date: 08/05/2023
adobe-target: true
---

# Quickstart: Configure a CI/CD pipeline for an existing load test in Azure Load Testing

Get started with automating load tests in Azure Load Testing by adding it to a CI/CD pipeline from Azure portal. After running a load test in the Azure portal, you can configure your Azure DevOps settings to create a pipeline to run the test.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure Load Testing test. Create a [URL-based load test](./quickstart-create-and-run-load-test.md) or [use an existing JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md) to create a load test.

- An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops&preserve-view=true).

## Configure a CI/CD pipeline

In this section, you'll create a CI/CD pipeline in Azure Pipelines to run an existing load test. The test files like JMeter script and [test configuration YAML](/azure/load-testing/reference-test-config-yaml) will be committed to your repository.

1. In the [Azure portal](https://portal.azure.com/), go to your Azure load testing resource.

1. On the left pane, select **Tests** to view a list of tests.

1. Select your test from the list by selecting the checkbox, and then select **Set up CI/CD**.

    :::image type="content" source="media/how-to-set-up-cicd-pipeline-from-portal/list-of-tests.png" alt-text="Screenshot that shows the list of tests in Azure portal.":::

1. Enter the details for configuring the pipeline. Select the Azure DevOps organization where you want to run the pipeline from.

1. Select the project from the organization selected above.

1. Select a repository from the project selected above.

1. Select a branch from the repository selected above.

1. Enter the repository branch folder name in which you'd like to commit. If not provided files will be committed to the root folder.

1. Select Override existing file to edit existing files with the same name in the folder.
 
1. Select Create new, if you'd like to create a new service connection. A service connection of type [Azure Resource Manager](/azure/devops/pipelines/library/service-endpoints#azure-resource-manager-service-connection) with automatic Service Principal will be created in the project. The Service Principal will be automatically assigned *Load Test Contributor* role on the resource.

1. If you already have a service connection with *Load Test Contributor* role on the resource, select existing service connection from the dropdown.

    :::image type="content" source="media/how-to-set-up-cicd-pipeline-from-portal/set-up-cicd-pipeline.png" alt-text="Screenshot that shows the settings to be configured to set up a CI/CD pipeline.":::

1. Click on Create Pipeline.

The JMeter script and test configuration YAML will be committed to the repository. A pipeline will be automatically created and will be triggered whenever you push an update to the branch selected. You will get a notification with the link to th pipeline. You can click and modify the pipeline if needed.

## Next steps

You've configured a CI/CD pipeline for an existing load test. You can view the load test results in the output logs after the test run.

- Learn how to [view load test results in CI/CD pipeline](/azure/load-testing/how-to-configure-load-test-cicd#view-load-test-results).
