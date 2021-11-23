---
title: 'Tutorial: Identify performance regressions with Azure Load Testing and GitHub Actions'
titleSuffix: Azure Load Testing
description: 'In this tutorial, you learn how to automate performance regression testing with Azure Load Testing and GitHub Actions CI/CD workflows.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 11/12/2021
ms.topic: tutorial
#Customer intent: As an Azure user, I want to learn how to automatically test builds for performance regressions on every pull request and/or deployment with GitHub Actions
---

# Tutorial: Identify performance regressions with GitHub Actions and Azure Load Testing Preview

In this tutorial, you'll learn how to automate performance regression testing with Azure Load Testing Preview and GitHub Actions. You'll configure a GitHub Actions CI/CD workflow to run a load test for a sample web application, and then use the results to identify performance regressions.

If you're using Azure Pipelines for your CI/CD workflows, see the corresponding [Azure Pipelines tutorial](./tutorial-cicd-azure-pipelines.md).

You'll learn how to:

> [!div class="checklist"]
>
> * Set up your repository with files required for load testing.  
> * Set up a GitHub workflow to integrate with Azure Load testing.  
> * Run the load test and view results in the workflow.  
> * Define test criteria for the load test to pass or fail based on thresholds.  
> * Parameterize a load test using GitHub secrets.  

> [!IMPORTANT]
> Azure Load Testing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
* A GitHub account where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).
* An existing Azure Load Testing resource. To create a Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create_resource).

## Set up your repository

To get started, you first need a GitHub repository with the sample web application. You'll then use this repository to configure a GitHub Action workflow to run the load test.

1. Open a browser and navigate to the sample application's source GitHub repository: https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git

    The sample application is a Node.js app consisting of an Azure App Service web component and a Cosmos DB database.

1. Select **Fork** to fork the sample application repository to your GitHub account.

    :::image type="content" source="./media/tutorial-cicd-github-actions/fork-github-repo.png" alt-text="Screenshot that shows how to fork the sample application GitHub repo.":::

## Configure the Apache JMeter script

The sample application's source repo includes an Apache JMeter script named *SampleApp.jmx*. This script carries out three API calls on each test iteration:

* `add` - Carries out a data insert operation on Cosmos DB for the number of visitors on the webapp.
* `get` - Carries out a GET operation from Cosmos DB to retrieve the count.
* `lasttimestamp` - Updates the timestamp since the last user went to the website.

In this section, you update the Apache JMeter script with the URL of your sample web app.

1. In your sample application repository, open *SampleApp.jmx* for editing.

    :::image type="content" source="./media/tutorial-cicd-github-actions/edit-jmx.png" alt-text="Screenshot that shows how to edit the JMeter test script.":::

1. Search for `<stringProp name="HTTPSampler.domain">`.

   You'll see three instances of `<stringProp name="HTTPSampler.domain">` in the file.

1. Replace the value with the URL of your sample application's App Service in all three instances. 

   ```xml
   <stringProp name="HTTPSampler.domain">{your-app-name}.azurewebsites.net</stringProp>
   ```

    You'll deploy the sample application to an Azure App Service web app by using the GitHub Actions workflow. In the previous XML snippet, replace the placeholder text *`{your-app-name}`* with the unique name of the App Service web app.

    > [!IMPORTANT]
    > Don't include `https` or `http` in the sample application's URL.

1. Commit your changes to the main branch.

## Set up GitHub access permissions for Azure

In this section, you'll configure your GitHub repository to have permissions for accessing the Azure Load Testing resource.

To access Azure resources, you'll create an Azure Active Directory service principal and use role-based access control to assign the necessary permissions.

1. Run the following Azure CLI command to create a service principal:

    ```azurecli
    az ad sp create-for-rbac --name "my-load-test-cicd" --role contributor \
                             --scopes /subscriptions/<subscription-id>/resourceGroups/<resource-group> \
                             --sdk-auth
    ```

    In the previous command, replace the placeholder text *`<subscription-id>`* and *`<resource-group>`* with your Azure subscription ID and the Resource Group name of your Azure Load Testing resource.

    The outcome of the Azure CLI command is a JSON string, which you'll add to your GitHub secrets in a later step.

    ```json
    {
      "clientId": "<my-client-id>",
      "clientSecret": "<my-client-secret>",
      "subscriptionId": "<my-subscription-id>",
      "tenantId": "<my-tenant-id>",
      (...)
    }
    ```

1. Navigate to your forked sample application GitHub repository.

1. Add a new secret to your GitHub repository by selecting **Settings** > **Secrets** > **New repository secret**.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-new-secret.png" alt-text="Screenshot that shows how to add a new repository secret to your GitHub repo.":::

1. Enter *AZURE_CREDENTIALS* for the **Name**, paste the JSON response from the Azure CLI for the **value**, and then select **Add secret**.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-new-secret-details.png" alt-text="Screenshot that shows the details of the new GitHub repository secret.":::

1. To authorize the service principal to access the Azure Load Testing service, assign the **Load Test Contributor** role to the service principal. 

    First, retrieve the service principal object ID by running this Azure CLI command:

    ```azurecli
    az ad sp list --filter "displayname eq 'my-load-test-cicd'" -o table
    ```

    Next, assign the **Load Test Contributor** role to the service principal. Replace the placeholder text *`<sp-object-id>`* with the **ObjectId** value from the previous Azure CLI command. Also, replace the *`<subscription-name-or-id>`* with your Azure subscription ID.

    ```azurecli
    az role assignment create --assignee "<sp-object-id>" \
        --role "Load Test Contributor" \
        --subscription "<subscription-name-or-id>"
    ```

## Configure the GitHub Actions workflow to run a load test

In this section, you'll set up a GitHub Actions workflow that triggers the load test. 

To run a test with Azure Load Testing from a CI/CD workflow, you need a load test YAML configuration file. The sample application repository contains the *SampleApp.yaml* file that contains the parameters for running the test.

1. Open the *.github/workflows/workflow.yml* GitHub Actions workflow file in your sample application repository.
 
1. Edit the file and replace the following placeholder texts.

    |Placeholder  |Value  |
    |---------|---------|
    |*`<your-azure-web-app>`*     | The Azure App Service web app name. This name should match the name used for the endpoint URL in the *SampleApp.jmx* test script. |
    |*`<your-azure-load-testing-resource-name>`*     | The name of your Azure Load Testing resource. |
    |*`<your-azure-load-testing-resource-group-name>`*     | The resource group name that contains the Azure Load Testing resource. |

    ```yaml
    env:
      AZURE_WEBAPP_NAME: "<your-azure-web-app>"
      LOAD_TEST_RESOURCE: "<your-azure-load-testing-resource-name>"
      LOAD_TEST_RESOURCE_GROUP: "<your-azure-load-testing-resource-group-name>"
    ```

1. Commit your changes directly to the main branch.
    
    :::image type="content" source="./media/tutorial-cicd-github-actions/commit-workflow.png" alt-text="Screenshot that shows how to commit the changes to the GitHub Actions workflow file.":::

    The commit will trigger the GitHub Actions workflow in your repository. You can verify that the workflow is running by navigating to the **Actions** tab.

## View load test results

The GitHub Actions workflow executes the following steps for every update to the main branch:

- Deploy the sample Node.js application to an Azure App Services web app. The name of the web app is configured in the workflow file.
- Trigger Azure Load Testing to create and run the load test based on the Apache JMeter script and the test configuration YAML file in the repository.

In this section, you'll view the load test results in the GitHub Actions workflow log.

1. Select the **Actions** tab in your GitHub repository to view the list of workflows runs.
    
    :::image type="content" source="./media/tutorial-cicd-github-actions/workflow-run-list.png" alt-text="Screenshot that shows the list of GitHub Actions workflow runs.":::
    
1. Select the workflow run from the list to navigate to the run details and logging information.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-workflow-completed.png" alt-text="Screenshot that shows the workflow logging information.":::

    Once the load test finishes, you can view the test summary information and the client-side metrics in the workflow logs. The log also shows the URL to navigate to the Azure Load Testing dashboard for this load test.

1. In the workflow run details screen, select the **loadTestResults** artifact to download the load test result files.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-artifacts.png" alt-text="Screenshot that shows artifacts of the workflow run.":::

    
## Define test pass/fail criteria

In this section, you'll add failure criteria to determine the outcome of your load test. If at least one of the failure criteria evaluates to true, the load test is unsuccessful.

You can specify these criteria in the test configuration YAML file.

1. Edit the *SampleApp.yml* file in your GitHub repository.  

1. Add the following snippet at the end of the file.

    ```yaml
    failureCriteria: 
    - avg(response_time_ms) > 100
    - percentage(error) > 20
    ```

    You've now specified failure criteria for your load test. The test will fail if at least one of these conditions is met:
    
    - The aggregate average response time is greater than 100 ms.    
    - The aggregate percentage of errors is greater than 20%.

1. Commit and push the changes to the main branch of the repository.
    
    The changes will trigger the GitHub Actions CI/CD workflow.

1. Select the **Actions** tab, and then select the most recent workflow run to view the workflow logs.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-workflow-failed.png" alt-text="Screenshot that shows the failed workflow output log.":::

    After the load test finishes, you'll notice that the workflow failed because the average response time was higher than you specified in the failure criteria.

    The Azure Load Testing service evaluates the criteria during the test execution. If any of these conditions fails, Azure Load Testing service returns a non-zero exit code. This code informs the CI/CD workflow that the test has failed.

1. Edit the *SampleApp.yml* file and change the test failure criteria.

    ```yaml
    failureCriteria: 
    - avg(response_time_ms) > 5000
    - percentage(error) > 20
    ```
    
1. Commit the changes to trigger the GitHub Actions workflow. 

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-workflow-passed.png" alt-text="Screenshot that shows the succeeded workflow output log.":::

    The load test now succeeds and the workflow finishes successfully.

## Pass parameters to your load tests from the workflow

Next, you'll parameterize your load test using workflow variables. These parameters can be secrets such as passwords or non-secrets.

1. Edit the *config.json* file in your GitHub repository.
    
    Update the `enableSecretsFeature` value to **true** to enable the code which expects an x-secret value in the request header.

1. Commit the changes to the config.json file.

1. Edit the *SampleApp.yaml* file in your GitHub repository.

    Update the **testPlan** configuration setting to use the *SampleApp_Secrets.jmx* file.

    ```yml
    version: v0.1
    testName: SampleApp
    testPlan: SampleApp_Secrets.jmx
    description: 'SampleApp Test with secrets'
    engineInstances: 1
    ```

    The *SampleApp_Secrets.jmx* JMeter script uses a user-defined variable that contains a secret value. The value is defined with a custom function `{{__GetSecret(secretName)}}`.

1. Commit the changes to the YAML file.

1. Edit the *SampleApp_Secrets.jmx* file.

1. Search for `<stringProp name="HTTPSampler.domain">`.

   You'll see three instances of `<stringProp name="HTTPSampler.domain">` in the file.

1. Replace the value with the URL of your sample application's App Service in all three instances. 

   ```xml
   <stringProp name="HTTPSampler.domain">{your-app-name}.azurewebsites.net</stringProp>
   ```

    You'll deploy the sample application to an Azure App Service web app by using the GitHub Actions workflow. In the previous XML snippet, replace the placeholder text *`{your-app-name}`* with the unique name of the App Service web app.

    > [!IMPORTANT]
    > Don't include `https` or `http` in the sample application's URL.

1. Save and commit the Apache JMeter script.

1. Add a new secret to your GitHub repository by selecting **Settings** > **Secrets** > **New repository secret**.

1. Enter *MY_SECRET* for the **Name**, and *1797669089* for the **value**, and then select **Add secret**.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-new-secret-jmx.png" alt-text="Screenshot that shows the repository secret that is used in the JMeter script.":::

1. Edit the *.github/workflows/workflow.yml* file to pass the secret to the load test.

    Edit the Azure Load Testing action by adding the following YAML snippet.

    ```yaml
    secrets: |
      [
          {
          "name": "appToken",
          "value": "${{ secrets.MY_SECRET }}",
          }
      ]
    ```

1. Commit the changes, which trigger the GitHub Actions workflow.

    The Azure Load Testing task securely passes the repository secret from the workflow to the test engine. The secret parameter is only used while running the load test, and then its value is discarded from memory.

## Azure Load Testing Action

This section describes the Azure Load Testing GitHub action. You can use this action by referencing `azure/load-testing@v1` action in your workflow. The action runs on Windows, Linux, and Mac runners. 

You can use the following parameters to configure the GitHub action.

|Parameter  |Description  |
|---------|---------|
|`loadTestConfigFile`    | **Required** Path to the load test YAML configuration file. The path is fully qualified or relative to the default working directory.        |
|`resourceGroup`     |  **Required** Name of the resource group that contains the Azure Load Testing resource.       |
|`loadTestResource`     |   **Required** Name of an existing Azure Load Testing resource.      |
|`secrets`   |   Array of JSON objects that consist of the **name** and **value** for each secret. The name should match the secret name used in the Apache JMeter test script. |
|`env`     |   Array of JSON objects that consist of the **name** and **value** for each environment variable. The name should match the variable name used in the Apache JMeter test script. |

The following YAML code snippet describes how to use the action in a GitHub Actions workflow. 

```yaml
- name: 'Azure Load Testing'
  uses: azure/load-testing@v1
  with:
    loadTestConfigFile: '< YAML File path>'
    loadTestResource: '<name of the load test resource>'
    resourceGroup: '<name of the resource group of your load test resource>' 
    secrets: |
      [
          {
          "name": "<Name of the secret>",
          "value": "${{ secrets.MY_SECRET1 }}",
          },
          {
          "name": "<Name of the secret>",
          "value": "${{ secrets.MY_SECRET2 }}",
          }
      ]
    env: |
      [
          {
          "name": "<Name of the variable>",
          "value": "<Value of the variable>",
          },
          {
          "name": "<Name of the variable>",
          "value": "<Value of the variable>",
          }
      ]
```

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]  

## Next steps

You've now created a GitHub Actions workflow that uses Azure Load Testing for automatically running load tests. By using pass/fail criteria, you can set the status of the CI/CD workflow. With parameters, you can make the load test execution configurable.

* For more information about parameterizing load tests, see [Parameterize a load test](./how-to-parameterize-load-tests.md).
* For more information about defining test pass/fail criteria, see [Define test criteria](./how-to-define-test-criteria.md).
