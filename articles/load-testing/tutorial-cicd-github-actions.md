---
title: 'Tutorial: Identify performance regressions with Azure Load Testing and GitHub Actions'
titleSuffix: Azure Load Testing
description: 'In this tutorial, you learn how to automate performance regression testing by using Azure Load Testing and GitHub Actions CI/CD workflows.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 01/21/2022
ms.topic: tutorial
#Customer intent: As an Azure user, I want to learn how to automatically test builds for performance regressions on every pull request and/or deployment by using GitHub Actions.
---

# Tutorial: Identify performance regressions with Azure Load Testing Preview and GitHub Actions

This tutorial describes how to automate performance regression testing by using Azure Load Testing Preview and GitHub Actions. You'll configure a GitHub Actions CI/CD workflow and use the [Azure Load Testing Action](https://github.com/marketplace/actions/azure-load-testing) to run a load test for a sample web application. You'll then use the test results to identify performance regressions.

If you're using Azure Pipelines for your CI/CD workflows, see the corresponding [Azure Pipelines tutorial](./tutorial-cicd-azure-pipelines.md).

You'll learn how to:

> [!div class="checklist"]
>
> * Set up your repository with files required for load testing.  
> * Set up a GitHub workflow to integrate with Azure Load Testing.  
> * Run the load test and view results in the workflow.  
> * Define test criteria for the load test to pass or fail based on thresholds.  
> * Parameterize a load test by using GitHub secrets.  

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
* A GitHub account where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).
* An existing Azure Load Testing resource. To create a Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create_resource).

## Set up your repository

To get started, you need a GitHub repository with the sample web application. You'll use this repository to configure a GitHub Actions workflow to run the load test.

The sample application's source repo includes an Apache JMeter script named *SampleApp.jmx*. This script makes three API calls on each test iteration:

* `add`: Carries out a data insert operation on Azure Cosmos DB for the number of visitors on the web app.
* `get`: Carries out a GET operation from Azure Cosmos DB to retrieve the count.
* `lasttimestamp`: Updates the time stamp since the last user went to the website.

1. Open a browser and go to the sample application's [source GitHub repository](https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git).

    The sample application is a Node.js app that consists of an Azure App Service web component and an Azure Cosmos DB database.

1. Select **Fork** to fork the sample application's repository to your GitHub account.

    :::image type="content" source="./media/tutorial-cicd-github-actions/fork-github-repo.png" alt-text="Screenshot that shows the button to fork the sample application's GitHub repo.":::

## Set up GitHub access permissions for Azure

To grant GitHub Actions access to your Azure Load Testing resource, perform the following steps:

1. Create a service principal that has the permissions to access Azure Load Testing.
1. Configure a GitHub secret with the service principal information.
1. Authenticate with Azure using [Azure Login](https://github.com/Azure/login).

### Create a service principal

First, you'll create an Azure Active Directory [service principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object) and grant it the permissions to access your Azure Load Testing resource.

1. Run the following Azure CLI command to create a service principal and assign the *Contributor* role:

    ```azurecli
    az ad sp create-for-rbac --name "my-load-test-cicd" --role contributor \
                             --scopes /subscriptions/<subscription-id> \
                             --sdk-auth
    ```

    In the previous command, replace the placeholder text `<subscription-id>` with the Azure subscription ID of your Azure Load Testing resource.

    > [!NOTE]
    > Azure Login supports multiple ways to authenticate with Azure. For other authentication options, see the [Azure and GitHub integration site](/azure/developer/github).

    The output is the role assignment credentials that provide access to your resource. The command should output a JSON object similar to this.

    ```json
    {
      "clientId": "<GUID>",
      "clientSecret": "<GUID>",
      "subscriptionId": "<GUID>",
      "tenantId": "<GUID>",
      (...)
    }
    ```

1. Copy this JSON object, which you can use to authenticate from GitHub.

1. Grant permissions to the service principal to create and run tests with Azure Load Testing. The Load Test Contributor role grants permissions to create, manage and run tests in an Azure Load Testing resource.

    First, retrieve the ID of the service principal object by running this Azure CLI command:

    ```azurecli
    az ad sp list --filter "displayname eq 'my-load-test-cicd'" -o table
    ```

    Next, run the following Azure CLI command to assign the *Load Test Contributor* role to the service principal.

    ```azurecli
    az role assignment create --assignee "<sp-object-id>" \
        --role "Load Test Contributor" \
        --subscription "<subscription-id>"
    ```
    
    In the previous command, replace the placeholder text `<sp-object-id>` with the `ObjectId` value from the previous Azure CLI command. Also, replace `<subscription-id>` with your Azure subscription ID.

### Configure the GitHub secret

You'll add a GitHub secret to your repository for the service principal you created in the previous step. The Azure Login action uses this secret to authenticate with Azure.

1. In [GitHub](https://github.com), browse to your forked repository, select **Settings** > **Secrets** > **New repository secret**.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-new-secret.png" alt-text="Screenshot that shows selections for adding a new repository secret to your GitHub repo.":::

1. Paste the JSON role assignment credentials that you copied previously, as the value of secret variable *AZURE_CREDENTIALS*.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-new-secret-details.png" alt-text="Screenshot that shows the details of the new GitHub repository secret.":::

### Authenticate with Azure 

You can now use the `AZURE_CREDENTIALS` secret with the Azure Login action in your CI/CD workflow. The *workflow.yml* file in the sample application already has the necessary configuration:

```yml
jobs:
  build-and-deploy:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - name: Checkout GitHub Actions 
        uses: actions/checkout@v2
        
      - name: Login to Azure
        uses: azure/login@v1
        continue-on-error: false
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
```

You've now authenticated with Azure from the GitHub. You'll now configure the CI/CD workflow to run a load test by using Azure Load Testing.

## Configure the GitHub Actions workflow to run a load test

In this section, you'll set up a GitHub Actions workflow that triggers the load test. The sample application repository contains a workflow file *SampleApp.yaml*. The workflow first deploys the sample web application to Azure App Service, and then invokes the load test by using the [Azure Load Testing Action](https://github.com/marketplace/actions/azure-load-testing). The GitHub action uses an environment variable to pass the URL of the web application to the Apache JMeter script.

Update the *SampleApp.yaml* GitHub Actions workflow file to configure the parameters for running the load test.

1. Open the *.github/workflows/workflow.yml* GitHub Actions workflow file in your sample application's repository.
 
1. Edit the file and replace the following placeholder text:

    |Placeholder  |Value  |
    |---------|---------|
    |`<your-azure-web-app>`     | The name of the Azure App Service web app. |
    |`<your-azure-load-testing-resource-name>`     | The name of your Azure Load Testing resource. |
    |`<your-azure-load-testing-resource-group-name>`     | The name of the resource group that contains the Azure Load Testing resource. |

    ```yaml
    env:
      AZURE_WEBAPP_NAME: "<your-azure-web-app>"
      LOAD_TEST_RESOURCE: "<your-azure-load-testing-resource-name>"
      LOAD_TEST_RESOURCE_GROUP: "<your-azure-load-testing-resource-group-name>"
    ```

1. Commit your changes directly to the main branch.

    :::image type="content" source="./media/tutorial-cicd-github-actions/commit-workflow.png" alt-text="Screenshot that shows selections for committing changes to the GitHub Actions workflow file.":::

    The commit will trigger the GitHub Actions workflow in your repository. You can verify that the workflow is running by going to the **Actions** tab.

## View results of a load test

The GitHub Actions workflow executes the following steps for every update to the main branch:

- Deploy the sample Node.js application to an Azure App Service web app. The name of the web app is configured in the workflow file.
- Trigger Azure Load Testing to create and run the load test based on the Apache JMeter script and the test configuration YAML file in the repository.

To view the results of the load test in the GitHub Actions workflow log:

1. Select the **Actions** tab in your GitHub repository to view the list of workflow runs.
    
    :::image type="content" source="./media/tutorial-cicd-github-actions/workflow-run-list.png" alt-text="Screenshot that shows the list of GitHub Actions workflow runs.":::
    
1. Select the workflow run from the list to open the run details and logging information.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-workflow-completed.png" alt-text="Screenshot that shows the workflow logging information.":::

    After the load test finishes, you can view the test summary information and the client-side metrics in the workflow log. The log also shows the steps to go to the Azure Load Testing dashboard for this load test.

1. On the screen that shows the workflow run's details, select the **loadTestResults** artifact to download the result files for the load test.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-artifacts.png" alt-text="Screenshot that shows artifacts of the workflow run.":::
    
## Define test pass/fail criteria

In this section, you'll add criteria to determine whether your load test passes or fails. If at least one of the pass/fail criteria evaluates to `true`, the load test is unsuccessful.

You can specify these criteria in the test configuration YAML file:

1. Edit the *SampleApp.yml* file in your GitHub repository.  

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
    
    The changes will trigger the GitHub Actions CI/CD workflow.

1. Select the **Actions** tab, and then select the most recent workflow run to view the workflow log.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-workflow-failed.png" alt-text="Screenshot that shows the failed workflow output log.":::

    After the load test finishes, you'll notice that the workflow failed because the average response time was higher than the time that you specified in the pass/fail criteria.

    The Azure Load Testing service evaluates the criteria during the test run. If any of these conditions fails, Azure Load Testing service returns a nonzero exit code. This code informs the CI/CD workflow that the test has failed.

1. Edit the *SampleApp.yml* file and change the test's pass/fail criteria:

    ```yaml
    failureCriteria: 
    - avg(response_time_ms) > 5000
    - percentage(error) > 20
    ```
    
1. Commit the changes to trigger the GitHub Actions workflow. 

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-workflow-passed.png" alt-text="Screenshot that shows the succeeded workflow output log.":::

    The load test now succeeds and the workflow finishes successfully.

## Pass parameters to your load tests from the workflow

Next, you'll parameterize your load test by using workflow variables. These parameters can be secrets, such as passwords, or non-secrets.

In this tutorial, you'll reconfigure the sample application to accept only secure requests. To send a secure request, you need to pass a secret value in the HTTP request:

1. Edit the *SampleApp.yaml* file in your GitHub repository.

    Update the `testPlan` configuration setting to use the *SampleApp_Secrets.jmx* file:

    ```yml
    version: v0.1
    testName: SampleApp
    testPlan: SampleApp_Secrets.jmx
    description: 'SampleApp Test with secrets'
    engineInstances: 1
    ```

    The *SampleApp_Secrets.jmx* Apache JMeter script uses a user-defined variable that retrieves the secret value with the custom function `${__GetSecret(secretName)}`. Apache JMeter then passes this secret value to the sample application endpoint.

1. Commit the changes to the YAML file.

1. Edit the *config.json* file in your GitHub repository.
    
    Update the `enableSecretsFeature` setting to `true` to reconfigure the sample application to accept only secure requests:
    
    ```json
    {
        "enableSecretsFeature": true
    }
    ```
    
1. Commit the changes to the *config.json* file.

1. Add a new secret to your GitHub repository by selecting **Settings** > **Secrets** > **New repository secret**.

1. Enter **MY_SECRET** for **Name**, enter **1797669089** for **Value**, and then select **Add secret**.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-new-secret-jmx.png" alt-text="Screenshot that shows the repository secret that's used in the JMeter script.":::

1. Edit the *.github/workflows/workflow.yml* file to pass the secret to the load test.

    Edit the Azure Load Testing action by adding the following YAML snippet:

    ```yaml
    secrets: |
      [
          {
          "name": "appToken",
          "value": "${{ secrets.MY_SECRET }}"
          }
      ]
    ```

1. Commit the changes, which trigger the GitHub Actions workflow.

    The Azure Load Testing task securely passes the repository secret from the workflow to the test engine. The secret parameter is used only while you're running the load test. Then the parameter's value is discarded from memory.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]  

## Next steps

You've now created a GitHub Actions workflow that uses Azure Load Testing for automatically running load tests. By using pass/fail criteria, you can set the status of the CI/CD workflow. With parameters, you can make the running of load tests configurable.

* Learn more about the [Azure Load Testing Action](https://github.com/marketplace/actions/azure-load-testing).
* Learn how to [parameterize a load test](./how-to-parameterize-load-tests.md).
* Learn how to [define test pass/fail criteria](./how-to-define-test-criteria.md).
