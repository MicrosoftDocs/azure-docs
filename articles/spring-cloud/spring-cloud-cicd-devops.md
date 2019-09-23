---
title: CI/CD for Azure Spring Cloud | Microsoft Docs
description: CI/CD for Azure Spring Cloud
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---
# CI/CD for Azure Spring Cloud

Continous integration and continuous delivery tools are useful for many applications. Azure DevOps can help you organize and control these key jobs in a thoughtful manner. Currently, Azure Spring Cloud does not offer a specific Azure DevOps plugin; however, integration with DevOps can still be achieved with an [Azure CLI task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/deploy/azure-cli?view=azure-devops). This article will show you how to use an Azure CLI task with Azure Spring Cloud to integrate with Azure DevOps.



## Create an Azure Resource Manager service connection
Use [this link](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/connect-to-azure?view=azure-devops) to see instructions on how to create Azure Resource Manager service connection in your Azure DevOps project setting. Be sure to select the same subscription you are using for your Azure Spring Cloud service instance. 

## Azure CLI task templates

### Deploy artifacts
Normally, separate `tasks` are used to build and deploy the projects. Here, we first use a Maven task for building, then deploy the JAR file using the Azure Spring Cloud Azure CLI extension.

```yaml
steps:
- task: Maven@3
  inputs:
    mavenPomFile: 'pom.xml'
- task: AzureCLI@1
  inputs:
    azureSubscription: <your azure subscription that contains the ASC instance>
    scriptLocation: inlineScript
    inlineScript: |
      az extension add -y --source https://github.com/VSChina/azure-cli-extensions/releases/download/0.1/asc-0.3.0-py2.py3-none-any.whl
      az spring-cloud app deploy --resource-group <asc-rg> --service <asc-instance> --name <app-name> --jar-path ./target/your-result-jar.jar
      # deploy other app
```

### Deploy from Source
It is possible to deploy directly to Azure without a separate build step. 

```yaml
- task: AzureCLI@1
  inputs:
    azureSubscription: <your azure subscription that contains the ASC instance>
    scriptLocation: inlineScript
    inlineScript: |
      az extension add -y --source https://github.com/VSChina/azure-cli-extensions/releases/download/0.1/asc-0.3.0-py2.py3-none-any.whl
      az spring-cloud app deploy --resource-group <asc-rg> --service <asc-instance> --name <app-name>
      # or if it's a multi-module project
      az spring-cloud app deploy --resource-group <asc-rp> --service <asc-instance> --name <app-name> --target-module relative/path/to/module
```