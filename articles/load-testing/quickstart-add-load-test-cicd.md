---
title: 'Quickstart: Automate load tests with CI/CD'
titleSuffix: Azure Load Testing
description: 'Learn how to automate an existing load test by adding it to Azure Pipelines directly from the Azure portal. Run load tests in your CI/CD pipeline to automate performance regression testing.'
services: load-testing
ms.service: load-testing
ms.topic: quickstart
author: ninallam
ms.author: ninallam
ms.date: 08/05/2023
adobe-target: true
---

# Quickstart: Automate an existing load test with CI/CD

In this article, you learn how to automate an existing load test by creating a CI/CD pipeline in Azure Pipelines. Select your test in Azure Load Testing, and directly configure a pipeline in Azure DevOps that triggers your load test with every source code commit. Automate load tests with CI/CD to continuously validate your application performance and stability under load.

If you want to automate your load test with GitHub Actions, learn how to [manually configure a CI/CD pipeline for Azure Load Testing](./how-to-configure-load-test-cicd.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Your Azure account needs to have the [Application Administrator](/azure/active-directory/roles/permissions-reference#application-administrator) role. See [Check access for a user to Azure resources](/azure/role-based-access-control/check-access) to verify your permissions.

- An Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops&preserve-view=true).

- Your Azure DevOps organization is connected to Microsoft Entra ID in your subscription. Learn how you can [connect your organization to Microsoft Entra ID](/azure/devops/organizations/accounts/connect-organization-to-azure-ad).

- A load testing resource, which contains a test. Create a [URL-based load test](./quickstart-create-and-run-load-test.md) or [use an existing JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md) to create a load test.

## Configure a CI/CD pipeline

In this section, you'll create a CI/CD pipeline in Azure Pipelines to run an existing load test. The test files like JMeter script and [test configuration YAML](/azure/load-testing/reference-test-config-yaml) will be committed to your repository.

1. In the [Azure portal](https://portal.azure.com/), go to your Azure load testing resource.

1. On the left pane, select **Tests** to view the list of tests.

1. Select a test from the list by selecting the checkbox, and then select **Set up CI/CD**.

    :::image type="content" source="media/how-to-set-up-cicd-pipeline-from-portal/list-of-tests.png" alt-text="Screenshot that shows the list of tests in Azure portal." lightbox="media/how-to-set-up-cicd-pipeline-from-portal/list-of-tests.png":::

1. Enter the following details for creating a CI/CD pipeline definition:

    |Setting|Value|
    |-|-|
    | **Organization** | Select the Azure DevOps organization where you want to run the pipeline from. |
    | **Project** | Select the project from the organization selected above. |
    | **Repository** | Select the source code repository to store and run the Azure pipeline from. |
    | **Branch** | Select the branch in the selected repository. |
    | **Repository branch folder** | (Optional) Enter the repository branch folder name in which you'd like to commit. If empty, the root folder is used. |
    | **Override existing files** | Check this setting. |
    | **Service connection** | Select *Create new* to create a new service connection to allow Azure Pipelines to connect to the load testing resource.<br/><br/>If you already have a service connection with the *Load Test Contributor* role on the resource, choose *Select existing* and select the service connection from the dropdown list. |

    :::image type="content" source="media/how-to-set-up-cicd-pipeline-from-portal/set-up-cicd-pipeline.png" alt-text="Screenshot that shows the settings to be configured to set up a CI/CD pipeline." lightbox="media/how-to-set-up-cicd-pipeline-from-portal/set-up-cicd-pipeline.png":::

    > [!IMPORTANT]
    > If you're getting an error creating a PAT token, or you don't see any repositories, make sure to [connect your Azure DevOps organization to Microsoft Entra ID](/azure/devops/organizations/accounts/connect-organization-to-azure-ad). Make sure the directory in Azure DevOps matches the directory you're using for Azure Load Testing. After connecting to Microsoft Entra ID, close and reopen your browser window.

1. Select **Create Pipeline** to start creating the pipeline definition.

    Azure Load Testing performs the following steps to configure the CI/CD pipeline:

    - Create a new service connection of type [Azure Resource Manager](/azure/devops/pipelines/library/service-endpoints#azure-resource-manager-service-connection) in the Azure DevOps project. The service principal is automatically assigned the *Load Test Contributor* role on the Azure load testing resource.

    - Commit the JMeter script and test configuration YAML to the source code repository.

    - Create a pipeline definition that invokes the Azure load testing resource and runs the load test.

1. When the pipeline creation finishes, you receive a notification in the Azure portal with a link to the pipeline.

1. Optionally, you can open the pipeline definition and modify the pipeline steps or change when the pipeline is triggered.

You now have a CI/CD pipeline in Azure Pipelines that invokes your load test when the pipeline is triggered. By default, the pipeline is triggered whenever you push an update to the selected branch. 

:::image type="content" source="media/how-to-set-up-cicd-pipeline-from-portal/load-testing-generated-pipeline.png" alt-text="Screenshot that shows the Azure pipeline in Azure DevOps that was generated by Azure Load Testing." lightbox="media/how-to-set-up-cicd-pipeline-from-portal/load-testing-generated-pipeline.png":::

## Grant permission to service connection

When you run the CI/CD pipeline for the first time, you need to grant permission to the pipeline to access the service connection and start the load test.

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project.
    
    Replace the `<your-organization>` text placeholder with your project identifier.

1. Select **Pipelines** in the left navigation, and then select your pipeline.

    Notice that the pipeline run status is *Pending*.

1. Select the pending pipeline run, and then select **View**.

    An alert message is shown that the pipeline needs permission to access the load test resource.

    :::image type="content" source="media/how-to-set-up-cicd-pipeline-from-portal/azure-pipelines-need-permission.png" alt-text="Screenshot that shows the alert message that the Azure pipeline run needs permission to access a resource." lightbox="media/how-to-set-up-cicd-pipeline-from-portal/azure-pipelines-need-permission.png":::

1. Select **Permit**, and then select **Permit** again in the confirmation window.

    :::image type="content" source="media/how-to-set-up-cicd-pipeline-from-portal/azure-pipelines-grant-permission-service-connection.png" alt-text="Screenshot that shows the grant permission window in Azure Pipelines to grant access to the service connection for running a load test." lightbox="media/how-to-set-up-cicd-pipeline-from-portal/azure-pipelines-grant-permission-service-connection.png":::

The CI/CD pipeline run now starts and accesses the Azure load testing resource to run the test.

## View load test results in CI/CD

You can view the load test summary results directly in the CI/CD output log.

:::image type="content" source="./media/how-to-set-up-cicd-pipeline-from-portal/azure-pipelines-log-load-testing-summary.png" alt-text="Screenshot that shows the Azure Pipelines output log information, highlighting the load testing results." lightbox="./media/how-to-set-up-cicd-pipeline-from-portal/azure-pipelines-log-load-testing-summary.png":::

The generated CI/CD pipeline publishes the load test results as a pipeline artifact. You can download these results as a CSV file for further reporting.

:::image type="content" source="./media/how-to-set-up-cicd-pipeline-from-portal/azure-pipelines-artifacts-load-testing-results.png" alt-text="Screenshot that shows the artifacts page for pipeline run in Azure Pipelines, highlighting the load test results zip file." lightbox="./media/how-to-set-up-cicd-pipeline-from-portal/azure-pipelines-artifacts-load-testing-results.png":::

## Next steps

You've configured a CI/CD pipeline in Azure Pipelines for an existing load test. 

- [Define test fail criteria](./how-to-define-test-criteria.md)
- [View performance trends over time](./how-to-compare-multiple-test-runs.md)
- [Manually configure a CI/CD pipeline for Azure Load Testing](./how-to-configure-load-test-cicd.md), if you want to add a load test to GitHub Actions or use an existing pipeline
