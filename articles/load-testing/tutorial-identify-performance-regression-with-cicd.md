---
title: 'Tutorial: Automate regression tests with CI/CD'
titleSuffix: Azure Load Testing
description: 'In this tutorial, you learn how to automate regression testing by using Azure Load Testing and CI/CD workflows. Quickly identify performance degradation for applications under high load.'
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 09/29/2022
ms.topic: tutorial
ms.custom: engagement-fy23
#Customer intent: As an Azure user, I want to learn how to automatically test builds for performance regressions on every merge request and/or deployment by using Azure Pipelines.
---

# Tutorial: Identify performance regressions by automating load tests with CI/CD

This tutorial describes how to quickly identify performance regressions by using Azure Load Testing Preview and CI/CD tools. Quickly identify when your application experiences degraded performance under load by running load tests in Azure Pipelines or GitHub Actions.

In  this tutorial, you'll set up a CI/CD pipeline that runs a load test for a sample application on Azure. You'll verify the application behavior under load directly from the CI/CD dashboard. You'll then use load test fail criteria to get alerted when the application doesn't meet your quality requirements.

In this tutorial, you'll use a sample Node.js application and JMeter script. The tutorial doesn't require any coding or Apache JMeter skills.

You'll learn how to:

> [!div class="checklist"]
> * Set up the sample application GitHub repository.
> * Configure service authentication for your CI/CD workflow.
> * Configure the CI/CD workflow to run a load test.
> * View the load test results in the CI/CD dashboard.
> * Define load test fail criteria to identify performance regressions.

> [!NOTE]
> Azure Pipelines has a 60-minute timeout on jobs that are running on Microsoft-hosted agents for private projects. If your load test is running for more than 60 minutes, you'll need to pay for [additional capacity](/azure/devops/pipelines/agents/hosted?tabs=yaml#capabilities-and-limitations). If not, the pipeline will time out without waiting for the test results. You can view the status of the load test in the Azure portal.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* If you're using Azure Pipelines, an Azure DevOps organization and project. If you don't have an Azure DevOps organization, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops&preserve-view=true). If you need help with getting started with Azure Pipelines, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline?preserve-view=true&view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).
* A GitHub account, where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).

## Set up the sample application repository

To get started with this tutorial, you first need to set up a sample Node.js web application. The sample application contains an Azure Pipelines definition to deploy the application on Azure and trigger a load test.

[!INCLUDE [azure-load-testing-set-up-sample-application](../../includes/azure-load-testing-set-up-sample-application.md)]

## Configure service authentication

Before you configure the CI/CD pipeline to run a load test, you'll grant the CI/CD workflow the permissions to access your Azure load testing resource.

# [Azure Pipelines](#tab/pipelines)

To access your Azure Load Testing resource from the Azure Pipelines workflow, you first create a service connection in your Azure DevOps project. The service connection creates an Azure Active Directory [service principal](/active-directory/develop/app-objects-and-service-principals#service-principal-object). This service principal represents your Azure Pipelines workflow in Azure Active Directory. 

Next, you grant permissions to this service principal to create and run a load test with your Azure Load Testing resource.

### Create a service connection in Azure Pipelines

Create a service connection in Azure Pipelines so that your CI/CD workflow has access to your Azure subscription. In a next step, you'll then grant permissions to create and run load tests.

1. Sign in to your Azure DevOps organization (`https://dev.azure.com/<your-organization>`), and select your project.

1. Select **Project settings** > **Service connections**.

1. Select **+ New service connection**, select the **Azure Resource Manager** service connection, and then select **Next**.

1. Select the **Service Principal (automatic)** authentication method, and then select **Next**.

1. Enter the service connection information, and then select **Save** to create the service connection.

    | Field | Value |
    | ----- | ----- |
    | **Scope level** | *Subscription*. |
    | **Subscription** | Select the Azure subscription that will host your load testing resource. |
    | **Resource group** | Leave empty. The pipeline creates a new resource group for the Azure Load Testing resource. |
    | **Service connection name** | Enter a unique name for the service connection. You'll use this name later, to configure the pipeline definition. |
    | **Grant access permission to all pipelines** | Checked. |

1. Select the service connection that you created from the list, and then select **Manage Service Principal**.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/manage-service-principal.png" alt-text="Screenshot that shows selections for managing a service principal.":::

1. In the Azure portal, copy the **Application (Client) ID** value.

[!INCLUDE [cli-launch-cloud-shell-sign-in](../../includes/cli-launch-cloud-shell-sign-in.md)]

### Grant access to Azure Load Testing

To grant access to your Azure Load Testing resource, assign the Load Test Contributor role to the service principal. This role grants the service principal access to create and run load tests with your Azure Load Testing service. Learn more about [managing users and roles in Azure Load Testing](./how-to-assign-roles.md).

1. Retrieve the ID of the service principal object using the Azure CLI. Replace the text placeholder `<application-client-id>` with the value you copied.

    ```azurecli-interactive
    object_id=$(az ad sp show --id "<application-client-id>" --query "id" -o tsv)
    echo $object_id
    ```
    
1. Assign the `Load Test Contributor` role to the service principal:

    ```azurecli-interactive
    subscription=$(az account show --query "id" -o tsv)
    echo $subscription

    az role assignment create --assignee $object_id \
        --role "Load Test Contributor" \
        --scope /subscriptions/$subscription \
        --subscription $subscription
    ```

# [GitHub Actions](#tab/github)

To access your Azure Load Testing resource from the GitHub Actions workflow, you first create an Azure Active Directory [service principal](/active-directory/develop/app-objects-and-service-principals#service-principal-object). This service principal represents your GitHub Actions workflow in Azure Active Directory. 

Next, you grant permissions to the service principal to create and run a load test with your Azure Load Testing resource.

[!INCLUDE [cli-launch-cloud-shell-sign-in](../../includes/cli-launch-cloud-shell-sign-in.md)]

### Create a service principal

Create a service principal in the Azure subscription and assign the Contributor role so that your GitHub Actions workflow has access to your Azure subscription. In a next step, you'll then grant permissions to create and run load tests.

1. Create a service principal and assign the `Contributor` role:

    ```azurecli-interactive
    subscription=$(az account show --query "id" -o tsv)
    echo $subscription

    az ad sp create-for-rbac --name "my-load-test-cicd" --role contributor \
                             --scopes /subscriptions/$subscription \
                             --sdk-auth
    ```

    The output is a JSON object that represents the service principal. You'll use this information to authenticate with Azure in the GitHub Actions workflow.

    ```output
    Creating 'contributor' role assignment under scope '/subscriptions/123abc45-6789-0abc-def1-234567890abc'
    {
      "clientId": "00000000-0000-0000-0000-000000000000",
      "clientSecret": "00000000-0000-0000-0000-000000000000",
      "subscriptionId": "00000000-0000-0000-0000-000000000000",
      "tenantId": "00000000-0000-0000-0000-000000000000",
      "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
      "resourceManagerEndpointUrl": "https://management.azure.com/",
      "activeDirectoryGraphResourceId": "https://graph.windows.net/",
      "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
      "galleryEndpointUrl": "https://gallery.azure.com/",
      "managementEndpointUrl": "https://management.core.windows.net/"    
    }
    ```

    > [!NOTE]
    > You might get a `--sdk-auth` deprecation warning when you run this command. Alternatively, you can use OpenID Connect (OIDC) based authentication for authenticating GitHub with Azure. Learn how to [use the Azure login action with OpenID Connect](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

1. Copy the output JSON object.

1. Add a GitHub secret **AZURE_CREDENTIALS** to your repository to store the service principal you created earlier. The `azure/login` action in the GitHub Actions workflow uses this secret to authenticate with Azure.

    > [!NOTE]
    > If you're using OpenID Connect to authenticate with Azure, you don't have to pass the service principal object in the Azure login action. Learn how to [use the Azure login action with OpenID Connect](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).
    
    1. In [GitHub](https://github.com), browse to your forked repository, and select **Settings** > **Secrets** > **Actions** > **New repository secret**.
    
    1. Enter the new secret information, and then select **Add secret** to create a new secret.

        | Field | Value |
        | ----- | ----- |
        | **Name** | *AZURE_CREDENTIALS* |
        | **Secret** | Paste the JSON role assignment credentials you copied earlier. |

### Grant access to Azure Load Testing

To grant access to your Azure Load Testing resource, assign the Load Test Contributor role to the service principal. This role grants the service principal access to create and run load tests with your Azure Load Testing service. Learn more about [managing users and roles in Azure Load Testing](./how-to-assign-roles.md).

1. Retrieve the ID of the service principal object:

    ```azurecli-interactive
    object_id=$(az ad sp list --filter "displayname eq 'my-load-test-cicd'" --query "[0].id" -o tsv)
    echo $object_id
    ```

1. Assign the `Load Test Contributor` role to the service principal:

    ```azurecli-interactive
    az role assignment create --assignee $object_id \
        --role "Load Test Contributor" \
        --scope /subscriptions/$subscription \
        --subscription $subscription
    ```
---

## Configure the CI/CD workflow to run a load test

You'll now create a CI/CD workflow to create and run a load test for the sample application. The sample application repository already contains a CI/CD workflow definition that first deploys the application to Azure, and then creates a load test based on JMeter test script (*SampleApp.jmx*). You'll update the sample workflow definition file to specify the Azure subscription and application details.

On the first CI/CD workflow run, it creates a new Azure Load Testing resource in your Azure subscription by using the *ARMTemplate/template.json* Azure Resource Manager (ARM) template. Learn more about ARM templates [here](/azure-resource-manager/templates/overview).

# [Azure Pipelines](#tab/pipelines)

You'll create a new Azure pipeline that is linked to your fork of the sample application repository. This repository contains the following items:

- The sample application source code.
- The *azure-pipelines.yml* pipeline definition file.
- The *SampleApp.jmx* JMeter test script.
- The *SampleApp.yaml* Azure Load Testing configuration file.

To create and run the load test, the Azure Pipelines definition uses the [Azure Load Testing task](/azure/devops/pipelines/tasks/test/azure-load-testing) extension from the Azure DevOps Marketplace.

1. Open the [Azure Load Testing task extension](https://marketplace.visualstudio.com/items?itemName=AzloadTest.AzloadTesting) in the Azure DevOps Marketplace, and select **Get it free**.

1. Select your Azure DevOps organization, and then select **Install** to install the extension.

    If you don't have administrator privileges for the selected Azure DevOps organization, select **Request** to request an administrator to install the extension.

1. In your Azure DevOps project, select **Pipelines** in the left navigation, and then select **Create pipeline**.

1. On the **Connect** tab, select **GitHub**.

1. Select **Authorize Azure Pipelines** to allow Azure Pipelines to access your GitHub account for triggering workflows.

1. On the **Select** tab, select the sample application's forked repository.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-pipeline-select-repo.png" alt-text="Screenshot that shows how to select the sample application's GitHub repository.":::

    Azure Pipelines automatically detects the *azure-pipelines.yml* pipeline definition file.

1. Notice that the pipeline definition contains the `LoadTest` stage, which has two tasks.

    The `AzureResourceManagerTemplateDeployment` task deploys a new Azure load testing resource in your Azure subscription.

    Next, the `AzureLoadTest` [Azure Load Testing task](/azure/devops/pipelines/tasks/test/azure-load-testing) creates and starts a load test. This task uses the `SampleApp.yaml` [load test configuration file](./reference-test-config-yaml.md), which contains the configuration parameters for the load test, such as the number of parallel test engines.

    ```yml
    - task: AzureLoadTest@1
      inputs:
        azureSubscription: $(serviceConnection)
        loadTestConfigFile: 'SampleApp.yaml'
        resourceGroup: $(loadTestResourceGroup)
        loadTestResource: $(loadTestResource)
        env: |
          [
            {
            "name": "webapp",
            "value": "$(webAppName).azurewebsites.net"
            }
          ]
    ```

    If a load test already exists, the `AzureLoadTest` task won't create a new load test, but will add a test run to this load test. To identify regressions over time, you can then [compare multiple test runs](./how-to-compare-multiple-test-runs.md).

1. On the **Review** tab, replace the following placeholder text at the beginning of the pipeline definition:

    These variables are used to configure the deployment of the sample application, and to create the load test.

    |Placeholder  |Value  |
    |---------|---------|
    | `<Name of your webapp>`     | The name of the Azure App Service web app. |
    | `<Name of your webARM Service connection>` | The name of the service connection that you created in the previous section. |
    | `<Azure subscriptionId>`     | Your Azure subscription ID. |
    | `<Name of your load test resource>`     | The name of your Azure Load Testing resource. |
    | `<Name of your load test resource group>`     | The name of the resource group that contains the Azure Load Testing resource. |

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-pipeline-review.png" alt-text="Screenshot that shows the Azure Pipelines Review tab when you're creating a pipeline.":::

1. Select **Save and run**, enter text for **Commit message**, and then select **Save and run**.

    Azure Pipelines now runs the CI/CD workflow and will deploy the sample application and create the load test.

1. Select **Pipelines** in the left navigation, and then select new pipeline run from the list to monitor the status.

    You can view the detailed run log by selecting the pipeline job.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-pipeline-status.png" alt-text="Screenshot that shows how to view pipeline job details.":::

# [GitHub Actions](#tab/github)

You'll create a GitHub Actions workflow in your fork of the sample application repository. This repository contains the following items:

- The sample application source code.
- The *.github/workflows/workflow.yml* GitHub Actions workflow.
- The *SampleApp.jmx* JMeter test script.
- The *SampleApp.yaml* Azure Load Testing configuration file.

To create and run the load test, the GitHub Actions workflow uses the [Azure Load Testing Action](https://github.com/marketplace/actions/azure-load-testing) from the GitHub Actions Marketplace.

The sample application repository already contains a sample workflow file *.github/workflows/workflow.yml*. The GitHub Actions workflow performs the following steps for every update to the main branch:


- Invoke Azure Load Testing by using the [Azure Load Testing Action](https://github.com/marketplace/actions/azure-load-testing) and the sample Apache JMeter script *SampleApp.jmx* and the load test configuration file *SampleApp.yaml*.

1. Open the *.github/workflows/workflow.yml* GitHub Actions workflow file in your sample application's repository.

1. Notice the `loadTest` job, which creates and runs the load test:

    - The `azure/login` action authenticates with Azure, by using the `AZURE_CREDENTIALS` secret to pass the service principal credentials.

        ```yml
          - name: Login to Azure
            uses: azure/login@v1
            continue-on-error: false
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}
        ```

    - The `azure/arm-deploy` action deploys a new Azure load testing resource in your Azure subscription.

        ```yml
            - name: Create Azure Load Testing resource
                    uses: azure/arm-deploy@v1
                    with:
                      resourceGroupName: ${{ env.LOAD_TEST_RESOURCE_GROUP }}
                      template: ./ARMTemplate/template.json
                      parameters: ./ARMTemplate/parameters.json name=${{ env.LOAD_TEST_RESOURCE }} location="${{ env.LOCATION }}"
        ```

    - The `azure/load-testing` [Azure Load Testing Action](https://github.com/marketplace/actions/azure-load-testing) creates and starts a load test. This action uses the `SampleApp.yaml` [load test configuration file](./reference-test-config-yaml.md), which contains the configuration parameters for the load test, such as the number of parallel test engines.

        ```yml
          - name: 'Azure Load Testing'
            uses: azure/load-testing@v1
            with:
              loadTestConfigFile: 'SampleApp.yaml'
              loadTestResource: ${{ env.LOAD_TEST_RESOURCE }}
              resourceGroup: ${{ env.LOAD_TEST_RESOURCE_GROUP }}
              env: |
                [
                  {
                  "name": "webapp",
                  "value": "${{ env.AZURE_WEBAPP_NAME }}.azurewebsites.net"
                  }
                ]          
        ```

        If a load test already exists, the `azure/load-testing` action won't create a new load test, but will add a test run to this load test. To identify regressions over time, you can then [compare multiple test runs](./how-to-compare-multiple-test-runs.md).
    
1. Replace the following placeholder text at the beginning of the workflow definition file:

    These variables are used to configure the deployment of the sample application, and to create the load test.

    |Placeholder  |Value  |
    |---------|---------|
    |`<Name of your webapp>`     | The name of the Azure App Service web app. |
    |`<Name of your load test resource>`     | The name of your Azure Load Testing resource. |
    |`<Name of your load test resource group>`     | The name of the resource group that contains the Azure Load Testing resource. |

    ```yaml
    env:
      AZURE_WEBAPP_NAME: "<Name of your webapp>"    # set this to your application's name
      LOAD_TEST_RESOURCE: "<Name of your load test resource>"
      LOAD_TEST_RESOURCE_GROUP: "<Name of your load test resource group>"
    ```

1. Commit your changes to the main branch.

    The commit will trigger the GitHub Actions workflow in your repository. Verify that the workflow is running by going to the **Actions** tab.

---

## View load test results

Azure Load Testing enables you to view the results of the load test run directly in the CI/CD workflow output. The CI/CD log contains the following client-side metrics:

- Response time metrics: average, minimum, median, maximum, and 90-95-99 percentiles.
- Number of requests per second.
- Total number of requests.
- Total number of errors.
- Error rate.

In addition, the [load test results file](./how-to-export-test-results.md) is available as a workflow run artifact, which you can download for further reporting.

# [Azure Pipelines](#tab/pipelines)

1. In your Azure DevOps project, select **Pipelines**, and then select your pipeline definition from the list.

1. Select the pipeline run to view the run summary.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-pipeline-run-summary.png" alt-text="Screenshot that shows the pipeline run summary.":::

1. Select **Load Test** in the **Jobs** section to view the pipeline log.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-pipeline-log.png" alt-text="Screenshot that shows the Azure Pipelines run log.":::

    After the load test finishes, you can view the test summary information and the client-side metrics in the pipeline log. The log also shows the URL to go to the Azure Load Testing dashboard for this load test.

1. In the pipeline log view, select **Load Test**, and then select **1 artifact produced** to download the result files for the load test.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/create-pipeline-download-results.png" alt-text="Screenshot that shows how to download the load test results.":::

# [GitHub Actions](#tab/github)

1. Select the **Actions** tab in your GitHub repository to view the list of workflow runs.
    
    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/github-actions-workflow-run-list.png" alt-text="Screenshot that shows the list of GitHub Actions workflow runs.":::
    
1. Select the workflow run from the list to open the run details and logging information.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/github-actions-workflow-completed.png" alt-text="Screenshot that shows the workflow logging information.":::

    After the load test finishes, you can view the test summary information and the client-side metrics in the workflow log. The log also shows the steps to go to the Azure Load Testing dashboard for this load test.

1. On the screen that shows the workflow run's details, select the **loadTestResults** artifact to download the result files for the load test.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/github-actions-artifacts.png" alt-text="Screenshot that shows artifacts of the workflow run.":::

---

## Define test fail criteria

Azure Load Testing enables you to define load test fail criteria. These criteria determine when a load test should pass or fail. For example, your load test should fail when the average response time is greater than a specific value, or when too many errors occur.

When you run a load test as part of a CI/CD pipeline, the status of the pipeline run will reflect the status of the load test. This approach allows you to quickly identify performance regressions, or degraded application behavior when the application is experiencing high load.

In this section, you'll configure test fail criteria based on the average response time and the error rate.

You can specify load test fail criteria for Azure Load Testing in the test configuration YAML file. Learn more about [configuring load test fail criteria](./how-to-define-test-criteria.md).

1. Edit the *SampleApp.yml* file in your fork of the sample application GitHub repository.

1. Add the following snippet at the end of the file:

    ```yaml
    failureCriteria: 
        - avg(response_time_ms) > 100
        - percentage(error) > 20
    ```

    You've now specified pass/fail criteria for your load test. The test will fail if at least one of these conditions is met:
    
    - The aggregate average response time is greater than 100 ms.    
    - The aggregate percentage of errors is greater than 20%.

1. Commit and push the changes to the main branch of the repository.
    
    The changes will trigger the CI/CD workflow.

1. After the test finishes, notice that the CI/CD pipeline run has failed.

    In the CI/CD output log, you find that the test failed because one of the fail criteria was met. The load test average response time was higher than the value that you specified in the pass/fail criteria.

    :::image type="content" source="./media/tutorial-identify-performance-regression-with-cicd/test-criteria-failed.png" alt-text="Screenshot that shows pipeline logs after failed test criteria.":::

    The Azure Load Testing service evaluates the criteria during the test run. If any of these conditions fails, Azure Load Testing service returns a nonzero exit code. This code informs the CI/CD workflow that the test has failed.

1. Edit the *SampleApp.yml* file and change the test's pass/fail criteria to increase the criterion for average response time:

    ```yaml
    failureCriteria: 
        - avg(response_time_ms) > 5000
        - percentage(error) > 20
    ```
    
1. Commit the changes to trigger the CI/CD workflow again.

    After the test finishes, you notice that the load test and the CI/CD workflow run complete successfully.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You've now created a CI/CD workflow that uses Azure Load Testing to automate running load tests. By using load test fail criteria, you can set the status of the CI/CD workflow and quickly identify performance and application behavior degradations.

* Learn more about [Configuring server-side monitoring](./how-to-monitor-server-side-metrics.md).
* Learn more about [Comparing results across multiple test runs](./how-to-compare-multiple-test-runs.md).
* Learn more about [Parameterizing a load test](./how-to-parameterize-load-tests.md).
* Learn more about [Defining test pass/fail criteria](./how-to-define-test-criteria.md).
