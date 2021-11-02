---
title: Continuous regression testing in Azure Pipelines with Azure Load Testing
titleSuffix: Azure Load Testing
description: Continuous regression testing in Azure Pipelines with Azure Load Testing
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 10/18/2021
ms.topic: tutorial
#Customer intent: As a Azure user, I want to learn how to automatically test builds for performance regressions on every merge request and/or deployment with Azure Pipelines
---

# Tutorial: Set up CI/CD pipeline in Azure Pipelines to run load tests automatically for every build

In this tutorial, you'll automatically load test a sample web app from Azure Pipelines on every pull request and deployment.  

In this tutorial, you'll learn how to:  

> [!div class="checklist"]

> * Set up your repository with files required for load testing.  
> * Set up Azure Pipelines to integrate with Azure Load testing.  
> * Run the load test and view results in the pipeline.  
> * Define test criteria for load test to pass or fail based on thresholds.  
> * Parameterize load test using pipeline variables.  

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
* An Azure DevOps organization. If you don't have one, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up.md?view=azure-devops&preserve-view=true). Azure DevOps Services includes Azure Pipelines. If you need help with getting started with Azure Pipelines, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline.md?preserve-view=true&view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).  
* A GitHub account, where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).  
* An existing Azure Load Testing resource. <!-- [Follow these steps to create one.](placeholder for doc in draft.)  -->

## Set up your repository

To get started, fork the following repository into your GitHub account.  

```
https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git
```

This repository has a sample Node.js app consisting of an Azure App Service web component and a Cosmos DB database.  

You'll require the following files in your repository for running the load test.  

1. Apache JMeter script: The source repository contains an Apache JMeter script named SampleApp.jmx. Make sure to update the Apache JMeter script with the URL of the webapp where the application will be deployed.  

1. Configuration files (if any): Not required for the sample app.  

1. Load test YAML file: The repository contains a SampleApp.yaml file. For a new test, you can author this file [using the syntax shown](https://github.com/microsoft/azureloadtest/wiki/Common-Terminologies#brief-overview-of-yaml-properties). If you've already run a load test, download this file from the input files section on the dashboard.  

    :::image type="content" source="media/tutorial-continuous-regression-testing-cicd-azure-pipeline/download-input-files-from-dashboard.png" alt-text="Download the input files from the dashboard of a test run":::

> [!IMPORTANT]
> The path of the testPlan and configurationFiles should be relative to the Load test YAML file.  

## Set up Azure Pipelines to integrate with Azure Load testing service

1. Sign in to your Azure DevOps organization.  

1. Install the Azure Load Testing task extension from the Azure DevOps Marketplace.  

1. Create an [Azure Resource Manager service connection](/azure/devops/pipelines/library/service-endpoints.md?view=azure-devops&tabs=yaml&preserve-view=true) for your Azure subscription.  

1. After creating the service connection, select 'Manage Service Principal.' You'll see the details of the Service Principal. Note the Object ID for the Service Principal.  

1. Authorize the Service Principal to access Azure Load Testing service by assigning the **Load Test Contributor** role. Run the following Az CLI command.  

    ```azurecli
    az role assignment create --assignee "{ObjectID}}" \
    --role "Load Test Contributor" \
    --subscription "{subscriptionNameOrId}"
    ```

1. In your Azure DevOps project, navigate to the Pipelines page. Choose 'create a new pipeline.'  

1. Walk through the steps of the wizard by first selecting GitHub as the location of your source code. You might be redirected to GitHub to sign in.  

1. When the list of repositories appears, select the fork of the sample app repository.  

1. The repository contains an azure-pipeline.yml file, which opens in the pipeline editor. Replace the following values of the variables.  

    ```yml
    webAppName: 'Name of the web App' #This should be same as the App name in the SampleApp.jmx
    serviceConnection: 'Name of ARM Service connection'
    azureSubscriptionId: 'Azure subscription ID'
    loadTestResource: 'Name of the Load test resource'
    loadTestResourceGroup: 'Name of the Load test resource group'
    ```

1. Select 'Save and run'.  
1. Select 'Commit directly to the main branch'.  
1. Choose 'Save and run'.  

## View results in the Azure Pipeline

Here's what happened when you ran the pipeline.  

* The pipeline builds, creates the required Azure resources, and deploys the sample node.js app to the App service.  The pipeline triggers are defined to run for every push to the main branch. You can modify the triggers according to the [available triggers](/azure/devops/pipelines/build/triggers/index.yml).  

* The Azure Load testing task created and ran a load test on the App service deployed in the above step.

The load test results are available in the pipeline logs once the test run is completed. The task is marked success or failure based on the test execution status. The link to the portal is available in the log to view execution progress. Once the test run is complete, you can view the summary and the client-side metrics in the pipeline logs. You can view the detailed dashboard by clicking on the portal URL. The results files are exported to the folder “loadTest\results.zip”.  

## Define test criteria for your load test

With your CI/CD pipeline configured to run load tests, add test criteria for your load test to determine the success of the test. These are failure criteria and the test will fail if the criteria evaluate to true. Learn more about test criteria [here](how-to-define-test-criteria.md).  

Add the test criteria to your pipeline load test as shown below:  

1. Edit the SampleApp.yml file in your GitHub repository.  
  
1. Add the following snippet to the file.  

    ```yml
    failureCriteria: 
        - avg(response_time_ms) > 100
        - percentage(error) > 20
    ```

1. Commit and push the changes to the main branch of the repository. Your changes trigger the CI/CD pipeline in Azure Pipelines.  

1. Once the load test completes, the above pipeline will fail. Go to the pipeline logs and view the output of the Azure Load Testing Task.  

1. The output of the task will show the outcome of the test criteria. Since the average response time is greater than 100 ms, the first criterion will fail. The second criterion should pass.

Let's understand the above criteria. The criteria defined above mean fail the load test if

1. The aggregate average response time is greater than 100ms.

1. The aggregate percentage of error is greater than 20%.

Now, increase the threshold for the first criterion to pass the load test:

1. Edit the SampleApp.yml file and change the above test criteria to:  

    ```yml
    failureCriteria: 
        - avg(response_time_ms) > 5000
        - percentage(error) > 20
    ```

1. Save and run the pipeline. The test should pass and the pipeline should run successfully.  

The Azure Load Testing service evaluates the criteria during the test execution. If any of the criteria defined in the test fails, Azure Load Testing service returns a non-zero exit code. The code tells the pipeline that the test failed. The task in the pipeline is then marked as passed or failed.  

## Provide parameters to your load tests from the pipeline  

Now that you have set test criteria to pass or fail your test, parameterize your load tests using pipeline variables. The parameters may be secrets, non-secrets, or both. Learn more about parameters [here](how-to-parameterize-load-tests.md).  

To add parameters to your load test from pipeline:  

1. Edit the SampleApp.yaml file in your repository. Change the **testPlan** to SampleApp_Secrets.jmx. This JMX script has a user defined variable, and the value is defined using custom function `{{__GetSecret(secretName)}}`. Save and commit the file.

1. Edit the SampleApp_Secrets.jmx and update the script with the URL of the webapp. Save and commit the file.

1. Go to the Pipelines page, select the appropriate pipeline, and then select Edit.  

1. Locate the Variables for this pipeline.  

1. Add a variable with Name "mySecret" and Value as "1797669089".  

1. Check the option 'Keep this value secret', to store the variable in an encrypted manner. Save the changes.  

1. In azure-pipeline.yml file, edit the Azure Load testing task. Add the following YAML snippet to the task definition.  

    ```yml
    secrets: |
      [
          {
          "name": "appToken",
          "value": "$(mySecret)",
          }
      ]
    ```

1. Save and run the pipeline.  

The Azure Load Testing task passes the secret from the pipeline to the load test engine in a secure manner. The secret parameter is used while running the load test and then the value is discarded.  

Take a look at the overview of the Azure Load Testing task in the next section.  

## Azure Load Testing Task

This task creates and runs an Azure load test from an Azure Pipeline. The task works on cross-platform agents running Windows, Linux, or Mac. It has the following parameters:  

|Parameters  |Description  |
|---------|---------|
|<code>azureSubscription</code><br/>(Azure subscription)     |  (Required) Name of the Azure Resource Manager service connection       |
|<code>loadTestConfigFile</code><br/>(Load Test configuration File)     | (Required) Path of the Load test YAML configuration file. Should be fully qualified path or relative to the default working directory        |
|<code>resourceGroup</code><br/>(Resource Group)     |  (Required) Name of the resource group.       |
|<code>loadTestResource</code><br/>(Load Testing Resource)     |   (Required) Name of an existing load test resource      |
|<code>secrets</code><br/>(Secrets)     |   (Optional) Enter Name (as in the test script) and value of each secret in JSON format |
|<code>env</code><br/>(Environment Variables)     |   (Optional) Enter Name (as in the test script) and value of each environment variable in JSON format |

```yaml
- task: AzureLoadTest@1
  inputs:
    azureSubscription: '<Azure service connection>'
    loadTestConfigFile: '< YAML File path>'
    loadTestResource: '<name of the load test resource>'
    resourceGroup: '<name of the resource group of your load test resource>' 
    secrets: |
      [
          {
          "name": "<Name of the secret>",
          "value": "$(mySecret1)",
          },
          {
          "name": "<Name of the secret>",
          "value": "$(mySecret1)",
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

You now have a CI/CD pipeline that builds, deploys, and triggers a load test on every build.  

Advance to the next article to learn how to set up a CI/CD workflow in GitHub to run load tests automatically.  

> [!div class="nextstepaction"]
> [Integrate Azure Load Testing with GitHub workflows](tutorial-continuous-regression-testing-cicd-github-actions.md)
