---
title: CI/CD for Azure Spring Cloud
description: CI/CD for Azure Spring Cloud
author: bmitchell287
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/04/2019
ms.author: brendm

---
# CI/CD for Azure Spring Cloud

Continuous integration and continuous delivery tools allow developers to quickly deploy updates to existing applications with minimal effort and risk. Azure DevOps helps you organize and control these key jobs. Currently, Azure Spring Cloud does not offer a specific Azure DevOps plugin.  However, you can integrate your Spring Cloud applications with DevOps using an [Azure CLI task](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-cli?view=azure-devops). This article will show you how to use an Azure CLI task with Azure Spring Cloud to integrate with Azure DevOps.

## Create an Azure Resource Manager service connection

Read [this article](https://docs.microsoft.com/azure/devops/pipelines/library/connect-to-azure?view=azure-devops) to learn how to create an Azure Resource Manager service connection to your Azure DevOps project. Be sure to select the same subscription you are using for your Azure Spring Cloud service instance.

## Azure CLI task templates

### Deploy artifacts

You can build and deploy your projects using a series of `tasks`. This snippet first defines a Maven task to build the application, followed by a second task that deploys the JAR file using the Azure Spring Cloud Azure CLI extension.

```yaml
steps:
- task: Maven@3
  inputs:
    mavenPomFile: 'pom.xml'
- task: AzureCLI@1
  inputs:
    azureSubscription: <your service connection name>
    scriptLocation: inlineScript
    inlineScript: |
      az extension add -y --name spring-cloud
      az spring-cloud app deploy --resource-group <your-resource-group> --service <your-spring-cloud-service> --name <app-name> --jar-path ./target/your-result-jar.jar
      # deploy other app
```

### Deploy from source

It is possible to deploy directly to Azure without a separate build step.

```yaml
- task: AzureCLI@1
  inputs:
    azureSubscription: <your service connection name>
    scriptLocation: inlineScript
    inlineScript: |
      az extension add -y --name spring-cloud
      az spring-cloud app deploy --resource-group <your-resource-group> --service <your-spring-cloud-service> --name <app-name>

      # or if it is a multi-module project
      az spring-cloud app deploy --resource-group <your-resource-group> --service <your-spring-cloud-service> --name <app-name> --target-module relative/path/to/module
```
