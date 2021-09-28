---
title: Continuous regression testing in CI/CD (Azure Pipelines) with Azure Load Testing
titleSuffix: Azure Load Testing
description: Continuous regression testing in Azure Pipelines with Azure Load Testing
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 09/27/2021
ms.topic: tutorial
#Customer intent: As a Azure user, I want to learn how to automatically test builds for performance regressions on every merge request and/or deployment with Azure Pipelines
---

# Tutorial: Set up CI/CD pipeline in Azure DevOps to run load tests automatically for every build

In this tutorial, you'll automatically load test a sample web app from Azure Pipelines on every pull request and/or deployment. The application consists of a web API deployed to an Azure App Service. The app and service interacts with an Azure Cosmos DB data store.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> - Set up your repository with files required for load testing.
> - Define test criteria for load test to pass or fail based on thresholds.
> - Set up Azure Pipelines to integrate with Azure Load test.
> - Provide parameters from the pipeline to the load test.
> - Run the load test and view results in the pipeline.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure DevOps organization. If you don't have one, you can [create one for free](https://docs.microsoft.com/azure/devops/pipelines/get-started/pipelines-sign-up?view=azure-devops). Azure DevOps includes Azure Pipelines. If you need help getting started with Azure Pipelines, see [Create your first pipeline](https://docs.microsoft.com/azure/devops/pipelines/create-first-pipeline?preserve-view=true&view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).
- A GitHub account, where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).
- An existing Azure Load Testing resource. Follow these steps to create one.

## Set up your repository with files required for load testing

To get started, fork the following repository into your GitHub account.

```
https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git
```
This is a sample Node.js app consisting of an Azure App Service web component and a Cosmos DB database

You will require the following files in your repository for running the load test
1.	JMeter script: The source repository contains a JMeter script named SampleApp.jmx. Make sure to update the JMeter script with the URL of the webapp to which the application will be deployed.
1.	Configuration files (if any)
1.	Load test YAML file: If you have previously run a load test from Azure Portal or VS Code extension, you can download this file from the input files section on the dashboard as shown below.
Alternatively you can author this file using the syntax below. Know more about the Yaml properties [here](https://github.com/microsoft/azureloadtest/wiki/Common-Terminologies#brief-overview-of-yaml-properties). 

Note: The path of the testPlan and configurationFiles should be relative to the Load test YAML file.

## Define test criteria for your load test

## Set up Azure Pipelines to integrate with Azure Load testing Service
Before you can load test the sample app, you have to get it up and running. Create a pipeline in Azure DevOps to build and deploy a node.js app to App service. To learn how to build and deploy node.js apps in Azure Pipelines refer to this [tutorial](https://docs.microsoft.com/azure/devops/pipelines/ecosystems/javascript?view=azure-devops&tabs=code)

You can now integrate load testing into the above pipeline. 
1.	Set appropriate triggers on your pipeline
      - To run the load test on every push or pull request, ensure that your pipeline has CI triggers. Learn more about CI triggers [here](https://docs.microsoft.com/azure/devops/pipelines/build/triggers?view=azure-devops)
      - To run the load test based on a schedule, you can set scheduled triggers on your pipeline. Learn more about scheduled triggers [here](https://docs.microsoft.com/azure/devops/pipelines/process/scheduled-triggers?view=azure-devops&tabs=yaml)

1.	Install the Azure Load Testing task extension from the Azure DevOps Marketplace on your Azure DevOps organization
1. The Azure Load Testing task requires an Azure service connection as an input. [Create an Azure Resource Manager sevice connection](https://docs.microsoft.com/azure/devops/pipelines/library/service-endpoints?view=azure-devops&tabs=yaml#create-a-service-connection)
1. To run your load test after every release / deployment, add your load test stage after the deploy stage in your pipeline. You can use the task assistant or add the following YAML snippet to your existing azure-pipelines.yaml file.
   ```yaml
   - task: AzureLoadTest@1
   inputs:
      azureSubscription: '<Azure service connection>'
      YAMLFilePath: 'SampleApp.yaml'
      loadTestResource: '<name of the load test resource>'
      resourceGroup: '<name of the resource group of your load test resource>'    
   ``` 
## Provide parameters from the pipeline to the load test

## Azure Load Test Task
<table><thead><tr><th>Parameters</th><th>Description</th></tr></thead>
<tr><td><code>azureSubscription</code><br/>(Azure subscription)</td><td>(Required) Name of the Azure Resource Manager service connection</td></tr>
<tr><td><code>loadTestYAML</code><br/>(Load Test YAML)</td><td>(Required) Path of the YAML file. Should be fully qualified path or relative to the default working directory</td></tr>
<tr><td><code>loadtestResource</code><br/>(Load Test Resource)</td><td>(Required) Name of an existing load test resource</td></tr>
<tr><td><code>resourceGroup</code><br/>(Resource Group)</td><td>(Required) Name of the resource group.</td></tr>
</table>

## Run the load test and view results in the pipeline.
Once you have configured the above steps in your Azure load test task, you can run the pipeline. The load test results are available in the pipeline logs once the test run is completed. The task is marked success or failure based on the test execution status. The link to the portal is available in the log to view execution progress and detailed results once the run is complete. You can view the summary of the test run and the client side metrics in the pipeline logs. The results files are exported to the folder “dropResults\results.zip”
