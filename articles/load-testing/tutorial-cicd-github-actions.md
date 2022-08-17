---
title: 'Tutorial: Automate regression testing with GitHub Actions'
titleSuffix: Azure Load Testing
description: 'In this tutorial, you learn how to automate performance regression testing by using Azure Load Testing and GitHub Actions CI/CD workflows.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 05/30/2022
ms.topic: tutorial
#Customer intent: As an Azure user, I want to learn how to automatically test builds for performance regressions on every pull request and/or deployment by using GitHub Actions.
---

# Tutorial: Identify performance regressions with Azure Load Testing Preview and GitHub Actions

This tutorial describes how to automate performance regression testing with Azure Load Testing Preview and GitHub Actions. 

You'll set up a GitHub Actions CI/CD workflow to deploy a sample Node.js application on Azure and trigger a load test using the [Azure Load Testing action](https://github.com/marketplace/actions/azure-load-testing).

You'll then define test failure criteria to ensure the application meets your goals. When a criterion isn't met, the CI/CD pipeline will fail. For more information, see [Define load test failure criteria](./how-to-define-test-criteria.md).

Finally, you'll make the load test configurable by passing parameters from the CI/CD pipeline to the JMeter script. For example, you could use a GitHub secret to pass an authentication token the script. For more information, see [Parameterize load tests with secrets and environment variables](./how-to-parameterize-load-tests.md).

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

## Set up the sample application repository

To get started with this tutorial, you first need to set up a sample Node.js web application. The sample application repository contains a GitHub Actions workflow definition that deploys the Node.js application on Azure and then triggers a load test.

[!INCLUDE [azure-load-testing-set-up-sample-application](../../includes/azure-load-testing-set-up-sample-application.md)]

## Set up GitHub access permissions for Azure

To grant GitHub Actions access to your Azure Load Testing resource, perform the following steps:

1. Create a service principal that has the permissions to access Azure Load Testing.
1. Configure a GitHub secret with the service principal information.
1. Authenticate with Azure using [Azure Login](https://github.com/Azure/login).

### Create a service principal

First, you'll create an Azure Active Directory [service principal](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) and grant it the permissions to access your Azure Load Testing resource.

1. Run the following Azure CLI command to create a service principal and assign the *Contributor* role:

    ```azurecli
    az ad sp create-for-rbac --name "my-load-test-cicd" --role contributor \
                             --scopes /subscriptions/<subscription-id> \
                             --sdk-auth
    ```

    In the previous command, replace the placeholder text `<subscription-id>` with the Azure subscription ID of your Azure Load Testing resource.

    > [!NOTE]
    > You might get a `--sdk-auth` deprecation warning when you run this command. Alternatively, you can use OpenID Connect (OIDC) based authentication for authenticating GitHub with Azure. Learn how to [use the Azure login action with OpenID Connect](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

    The output is the role assignment credentials that provide access to your resource. The command outputs a JSON object similar to the following snippet.

    ```json
    {
      "clientId": "<GUID>",
      "clientSecret": "<GUID>",
      "subscriptionId": "<GUID>",
      "tenantId": "<GUID>",
      (...)
    }
    ```

1. Copy this JSON object. You'll store this value as a GitHub secret in a later step.

1. Assign the service principal the **Load Test Contributor** role, which grants permission to create, manage and run tests in an Azure Load Testing resource.

    First, retrieve the ID of the service principal object by running this Azure CLI command:

    ```azurecli
    az ad sp list --filter "displayname eq 'my-load-test-cicd'" -o table
    ```

    Next, assign the **Load Test Contributor** role to the service principal. 

    Replace the placeholder text `<sp-object-id>` with the `ObjectId` value from the previous Azure CLI command. Also, replace `<subscription-id>` with your Azure subscription ID.

    ```azurecli
    az role assignment create --assignee "<sp-object-id>" \
        --role "Load Test Contributor" \
        --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group-name> \
        --subscription "<subscription-id>"
    ```

    In the previous command, replace the placeholder text `<sp-object-id>` with the `ObjectId` value from the previous Azure CLI command. Also, replace `<subscription-id>` with your Azure subscription ID.

You now have a service principal that the necessary permissions to create and run a load test.

### Configure the GitHub secret

Next, add a GitHub secret **AZURE_CREDENTIALS** to your repository to store the service principal you created earlier. You'll pass this GitHub secret to the Azure Login action to authenticate with Azure.

> [!NOTE]
> If you're using OpenID Connect to authenticate with Azure, you don't have to pass the service principle object in the Azure login action. Learn how to [use the Azure login action with OpenID Connect](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

1. In [GitHub](https://github.com), browse to your forked repository, select **Settings** > **Secrets** > **New repository secret**.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-new-secret.png" alt-text="Screenshot that shows selections for adding a new repository secret to your GitHub repo.":::

1. Paste the JSON role assignment credentials that you copied previously, as the value of secret variable **AZURE_CREDENTIALS**.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-new-secret-details.png" alt-text="Screenshot that shows the details of the new GitHub repository secret.":::

### Authenticate with Azure 

You can now use the `AZURE_CREDENTIALS` secret with the Azure Login action in your CI/CD workflow. The *.github/workflows/workflow.yml* file in the sample application repository already has this configuration:

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

> [!NOTE]
> If you're using OpenID Connect to authenticate with Azure, you don't have to pass the service principle object in the Azure login action. Learn how to [use the Azure login action with OpenID Connect](/azure/developer/github/connect-from-azure#use-the-azure-login-action-with-openid-connect).

You've now authorized your GitHub Actions workflow to access your Azure Load Testing resource. You'll now configure the CI/CD workflow to run a load test with Azure Load Testing.

## Configure the GitHub Actions workflow to run a load test

In this section, you'll set up a GitHub Actions workflow that triggers the load test by using the [Azure Load Testing Action](https://github.com/marketplace/actions/azure-load-testing).

The following code snippet shows an example of how to trigger a load test using the `azure/load-testing` action:

```yml
- name: 'Azure Load Testing'
uses: azure/load-testing@v1
with:
    loadTestConfigFile: 'my-jmeter-script.jmx'
    loadTestResource: my-load-test-resource
    resourceGroup: my-resource-group
    env: |
    [
        {
        "name": "webapp",
        "value": "my-web-app.azurewebsites.net"
        }
    ]          
```

The sample application repository already contains a sample workflow file *.github/workflows/workflow.yml*. The GitHub Actions workflow performs the following steps for every update to the main branch:

- Deploy the sample Node.js application to an Azure App Service web app.
- Create an Azure Load Testing resource using the *ARMTemplate/template.json* Azure Resource Manager (ARM) template, if the resource doesn't exist yet. Learn more about ARM templates [here](../azure-resource-manager/templates/overview.md).
- Invoke Azure Load Testing by using the [Azure Load Testing Action](https://github.com/marketplace/actions/azure-load-testing) and the sample Apache JMeter script *SampleApp.jmx* and the load test configuration file *SampleApp.yaml*.

Follow these steps to configure the GitHub Actions workflow for your environment:

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

    These variables are used to configure the GitHub Actions for deploying the sample application to Azure, and to connect to your Azure Load Testing resource.

1. Commit your changes directly to the main branch.

    The commit will trigger the GitHub Actions workflow in your repository. You can verify that the workflow is running by going to the **Actions** tab.

## View load test results

When the load test finishes, view the results in the GitHub Actions workflow log:

1. Select the **Actions** tab in your GitHub repository to view the list of workflow runs.
    
    :::image type="content" source="./media/tutorial-cicd-github-actions/workflow-run-list.png" alt-text="Screenshot that shows the list of GitHub Actions workflow runs.":::
    
1. Select the workflow run from the list to open the run details and logging information.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-workflow-completed.png" alt-text="Screenshot that shows the workflow logging information.":::

    After the load test finishes, you can view the test summary information and the client-side metrics in the workflow log. The log also shows the steps to go to the Azure Load Testing dashboard for this load test.

1. On the screen that shows the workflow run's details, select the **loadTestResults** artifact to download the result files for the load test.

    :::image type="content" source="./media/tutorial-cicd-github-actions/github-actions-artifacts.png" alt-text="Screenshot that shows artifacts of the workflow run.":::

## Define test pass/fail criteria

You can use test failure criteria to define thresholds for when a load test should fail. For example, a test might fail when the percentage of failed requests surpasses a specific value.

When at least one of the failure criteria is met, the load test status is failed. As a result, the CI/CD workflow will also fail and the development team can be alerted.

You can specify these criteria in the [test configuration YAML file](./reference-test-config-yaml.md):

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

Next, you'll parameterize your load test by using workflow variables. These parameters can be secrets, such as passwords, or non-secrets. For more information, see [Parameterize load tests with secrets and environment variables](./how-to-parameterize-load-tests.md).

In this tutorial, you'll now use the *SampleApp_Secrets.jmx* JMeter test script. This script invokes an application endpoint that requires a secure value to be passed as an HTTP header.

1. Edit the *SampleApp.yaml* file in your GitHub repository and update the `testPlan` configuration setting to use the *SampleApp_Secrets.jmx* file.

    The `testPlan` setting specifies which JMeter script Azure Load Testing uses.

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

* Learn more about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).
* Learn more about the [Azure Load Testing Action](https://github.com/marketplace/actions/azure-load-testing).
* Learn how to [parameterize a load test](./how-to-parameterize-load-tests.md).
* Learn how to [define test pass/fail criteria](./how-to-define-test-criteria.md).