---
title: Tutorial - Continuous regression testing in GitHub with Azure Load Testing
titleSuffix: Azure Load Testing
description: Continuous regression testing in GitHub with Azure Load Testing
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 10/14/2021
ms.topic: tutorial
#Customer intent: As a Azure user, I want to learn how to automatically test builds for performance regressions on every pull request and/or deployment with GitHub Actions
---

# Tutorial: Set up CI/CD workflow in GitHub to run load tests automatically for every build

In this tutorial, you'll automatically load test a sample web app from GitHub on every pull request and deployment.

You'll learn how to:

> [!div class="checklist"]
>
> * Set up your repository with files required for load testing.  
> * Set up a GitHub workflow to integrate with Azure Load testing.  
> * Run the load test and view results in the workflow.  
> * Define test criteria for load test to pass or fail based on thresholds.  
> * Parameterize load test using GitHub secrets.  

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
* A GitHub account where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).
* An existing Azure Load Testing resource. Follow these steps to create one.  

## Set up your repository

To get started, fork the following repository into your GitHub account.  

```
https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git
```

This repository has a sample Node.js app consisting of an Azure App Service web component and a Cosmos DB database.  

You'll require the following files in your repository for running the load test.  

1. Apache JMeter script: The source repository contains an Apache JMeter script named SampleApp.jmx. Make sure to update the script with the URL of the webapp to which the application will be deployed.  

1. Configuration files (if any): Not required for the sample app.  

1. Load test YAML file: The repository contains a SampleApp.yaml file. For a new test, you can author this file using [this syntax](https://github.com/microsoft/azureloadtest/wiki/Common-Terminologies#brief-overview-of-yaml-properties). If you've already run a load test, download the file from the input files section on the dashboard as shown below.  

    :::image type="content" source="media/tutorial-continuous-regression-testing-cicd-azure-pipelines/download-input-files-from-dashboard.png" alt-text="Download the input files from the dashboard of a test run":::

> [!IMPORTANT]
> The path of the testPlan and configurationFiles should be relative to the Load test YAML file.  

## Set up a GitHub workflow to integrate with Azure Load testing service

1. Create an [Azure Service Principal for Roll-based access control (RBAC)](../../role-based-access-control/overview.md) by running the below Azure CLI command:  

    ```azurecli
    az ad sp create-for-rbac --name "myApp" --role contributor \
                                     --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                                     --sdk-auth
            
            # Replace {subscription-id}, {resource-group} with the subscription, resource group details of the WebApp
            # The command should output a JSON object similar to this:
        
          {
            "clientId": "<GUID>",
            "clientSecret": "<GUID>",
            "subscriptionId": "<GUID>",
            "tenantId": "<GUID>",
            (...)
          }
    ```

1. Paste the json response from the above Azure CLI to your GitHub Repository > Settings > Secrets > Add a new secret > AZURE_CREDENTIALS.  

1. Authorize the Service Principal to access the Azure Load Testing service. Assign the **Load Test Contributor** role to the Service Principal. Run the following Azure CLI command.  

    ```azurecli
    az role assignment create --assignee "{ObjectID}}" \
    --role "Load Test Contributor" \
    --subscription "{subscriptionNameOrId}"
    ```

1. Now edit the workflow file in your branch: .github/workflows/workflow.yml. Replace the following values of the variables.  

    ```yml
    webAppName: 'Name of the web App' #This should be same as the App name in the SampleApp.jmx
    loadTestResource: 'Name of the Load test resource'
    loadTestResourceGroup: 'Name of the Load test resource group'
    ```

1. Commit the file directly to the main branch. The workflow should trigger. You can check in the Actions tab.  

## View results in GitHub

Here's what happened when you ran the workflow:  

* The workflow builds, creates the required Azure resources, and deploys the sample node.js app to the App service.  The workflow triggers are defined to run for every push to the main branch. You can modify the triggers according to the [available triggers](https://docs.github.com/actions/learn-github-actions/events-that-trigger-workflows).  

* The Azure Load testing action was used to create and run a load test on the App service deployed in the above step.  

The load test results are available in the workflow logs once the test run is complete. The task is marked 'success' or 'failure' based on the test execution status. The link to the portal is available in the log to view execution progress. Once the test run is complete, you can view the summary and the client-side metrics in the pipeline logs. You can view the detailed dashboard by clicking on the portal URL. The results files are exported to the folder “loadTest\results.zip”.  

## Define test criteria for your load test

Now that you have your CI/CD workflow configured to run load tests, add test criteria for your load test to determine the success of the test.  

Test criteria can be defined using the below syntax:  

`[Aggregate_function] ([client_metric]) [condition] [value]`

It includes the following inputs:  

|Parameter  |Description  |
|---------|---------|
|Client metric     | (Required) The client metric on which the criteria should be applied.        |
|Aggregate function     |  (Required) The aggregate function to be applied on the client metric.       |
|Condition     | (Required) The comparison operator. Supported types >.        |
|Value     |  (Required) The threshold value to compare with the client metric.        |
|Action     |   (Optional) Either ‘continue’ or 'stop' after the threshold is met.  Default: ‘continue’      |

* If action is ‘continue’, the criteria is evaluated on the aggregate values, when the test is completed.  
* If the action is ‘stop’, the criteria is evaluated for the entire test at every 60 seconds. If the criteria evaluates to true at any time, the test is stopped.  

The following are the supported values:  

|Aggregate function  |client metric  |condition  |
|---------|---------|---------|
|Average (avg)     | Response Time (response_time)  Integer values Units: milliseconds (ms). Only Integer values are allowed  |    greater than (>)      |
|Average (avg)     | Latency (latency)  Units: milliseconds (ms). Only Integer values are allowed          |    greater than (>)      |
|Rate (rate)       | Error (error)  Enter percentage values. Float values are allowed                |    greater than (>)      |

Add the test criteria to your pipeline load test as shown below:  

1. Edit the SampleApp.yml file in your GitHub repository.  
  
1. Add the following snippet to the file.  

    ```yml
    faliureCriteria: 
        - avg(response_time) > 100ms
        - avg(latency) > 300ms
        - rate(error) > 20
    ```

1. Commit and push the changes to the main branch of the repository. The changes will trigger the CI/CD workflow in GitHub.  

1. Once the load test completes, the above workflow will fail. Go to the workflow logs and view the output of the Azure Load Testing action.  

1. The output of the task will show the outcome of the test criteria. For the above criteria  since the average response time is greater than 100 ms, the first criteria will fail. The other two criteria should pass.  

1. Edit the SampleApp.yml file and change the above test criteria to the following:  

    ```yml
    faliureCriteria: 
        - avg(response_time) > 300ms
        - avg(latency) > 300ms
        - rate(error) > 20
    ```

1. Save and run the workflow. The test should pass and the workflow should run successfully.  

The Azure Load Testing service evaluates the criteria during the test execution. If any of the criteria defined in the test fails, Azure Load Testing service returns a non-zero exit code. The code tells the workflow that the test has failed. The action in the workflow is then marked as passed or failed.  

## Provide parameters to your load tests from the workflow

Now that you have set test criteria to pass or fail your test, parameterize your load tests using workflow variables. The parameters may be secrets, non-secrets, or a combination of both:  

* Secret parameters: Any sensitive variables you don't want to be checked in to your source control repository. Secret parameters can be stored as a secret in GitHub or in any other secret store, which can be fetched within the workflow.  

* Non-secret parameters: Values that may keep changing based on the test run. Non-secret parameters can be provided as inputs at runtime, instead of being defined in the test script.  

To add parameters to your load test from the workflow:  

1. Edit the SampleApp.jmx file in your GitHub repository. Use the built-in function *get_param(param_name)* in your test script to fetch the parameters as shown below. Save and commit the file.  

    `{{get_param(APIKey)}}`

1. Go your GitHub Repository > Settings > Secrets > New repository secret > "APIKeySecret". Add "" as the value and select Add secret.  

1. In the workflow.yml file, edit the Azure Load testing task. Add the following YAML snippet to the task definition.  

    ```yml
    secrets: |
      [
          {
          "name": "APIKey",
          "value": "${{ secrets.APIKeySecret }}",
          }
      ]
    ```

1. Save and run the pipeline.  

The Azure Load Testing task, passes the secret from the workflow to the load test engine in a secure manner. The secret parameter is used while running the load test and then the value is discarded. These are failure criteria and the test will fail if the criteria evaluate to true.  

Take a look at the overview of the Azure Load Testing action in the next section.  

## Azure Load Testing Action

This action creates and runs an Azure load test from a GitHub Workflow. The action runs on Windows, Linux, and Mac runners. Use the azure/load-testing@v1 action in your workflow. It has the following parameters.  

|Parameters  |Description  |
|---------|---------|
|YAMLFilePath    | (Required) Path of the YAML file. Should be a fully qualified path or relative to the default working directory        |
|resourceGroup     |  (Required) Name of the resource group       |
|loadtestResource     |   (Required) Name of an existing load test resource      |
|parameters   |   (Optional) secrets  and  non-secrets parameters <br> Enter Name and value of each parameter in JSON format  |

```yaml
- name: 'Azure Load Testing'
  uses: azure/load-testing@v1
  with:
    YAMLFilePath: '< YAML File path>'
    loadTestResource: '<name of the load test resource>'
    resourceGroup: '<name of the resource group of your load test resource>' 
    parameters: |
      { 
          "secrets": [ 
              { 
                  "name": "secret1", 
                  "value": "$(mySecret1)" 
              }, 
              { 
                  "name": "secret2", 
                  "value": "$(mySecret2)" 
              } 
          ], 
          "non_secrets": [ 
              { 
                  "name": "param1", 
                  "value": "paramValue1" 
              }, 
              { 
                  "name": "param2", 
                  "value": "paramValue2" 
              } 
          ] 
      }
```

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]  

## Next steps

You can find our set of GitHub Actions grouped into different repositories on GitHub, each contains documentation and examples to help you use GitHub for CI/CD and deploy your apps to Azure.  

> [!div class="nextstepaction"]
> [Azure and GitHub integration](../../developer/github/index.yml)