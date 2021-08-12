---
title: "How to - Launch your Spring Cloud application from source code"
description: In this quickstart, learn how to launch your Azure Spring Cloud application directly from your source code
author: karlerickson
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 09/03/2020
ms.author: karler
ms.custom: devx-track-java, devx-track-azurecli
---

# How to Launch your Spring Cloud application from source code

**This article applies to:** ✔️ Java

Azure Spring Cloud enables Spring Cloud based microservice applications on Azure.

You can launch applications directly from java source code or from a pre-built JAR. This article explains the deployment procedures.

This quickstart explains how to:

> [!div class="checklist"]
> * Provision a service instance
> * Set a configuration server for an instance
> * Build a microservices application locally
> * Deploy each microservice
> * Assign public endpoint for your application

## Prerequisites
Before you begin, ensure that your Azure subscription has the required dependencies:

1. [Install Git](https://git-scm.com/)
2. [Install JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
3. [Install Maven 3.0 or above](https://maven.apache.org/download.cgi)
4. [Install the Azure CLI](/cli/azure/install-azure-cli)
5. [Sign up for an Azure subscription](https://azure.microsoft.com/free/)

> [!TIP]
> The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article.  It has common Azure tools preinstalled, including the latest versions of Git, JDK, Maven, and the Azure CLI. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com.  You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

## Install the Azure CLI extension

Install the Azure Spring Cloud extension for the Azure CLI with the following command

```azurecli
az extension add --name spring-cloud
```

## Provision a service instance using the Azure CLI

Login to the Azure CLI and choose your active subscription.

```azurecli
az login
az account list -o table
az account set --subscription
```

Create a resource group to contain your Azure Spring Cloud service. You can learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).

```azurecli
az group create --location eastus --name <resource group name>
```

Run the following commands to provision an instance of Azure Spring Cloud. Prepare a name for your Azure Spring Cloud service. The name must be between 4 and 32 characters and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

```azurecli
az spring-cloud create -n <resource name> -g <resource group name>
```

The service instance will take about five minutes to deploy.

Set your default resource group name and Azure Spring Cloud instance name using the following commands:

```azurecli
az config set defaults.group=<service group name>
az config set defaults.spring-cloud=<service instance name>
```

## Create the Azure Spring Cloud application

The following command creates an Azure Spring Cloud application in your subscription.  This creates an empty service to which we can upload our application.

```azurecli
az spring-cloud app create -n <app-name>
```

## Deploy your Spring Cloud application

You can deploy your application from a pre-built JAR or from a Gradle or Maven repository.  Find instructions for each case below.

### Deploy a built JAR

To deploy from a JAR built on your local machine, ensure that your build produces a [fat-JAR](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-build.html#howto-create-an-executable-jar-with-maven).

To deploy the fat-JAR to an active deployment

```azurecli
az spring-cloud app deploy -n <app-name> --jar-path <path-to-fat-JAR e.g. "target\hellospring-0.0.1-SNAPSHOT.jar">
```

To deploy the fat-JAR to a specific deployment

```azurecli
az spring-cloud app deployment create --app <app-name> -n <deployment-name> --jar-path <path-to-fat-JAR e.g. "target\hellospring-0.0.1-SNAPSHOT.jar">
```

### Deploy from source code

Azure Spring Cloud uses [kpack](https://github.com/pivotal/kpack) to build your project.  You can use Azure CLI to upload your source code, build your project using kpack, and deploy it to the target application.

> [!WARNING]
> The project must produce only one JAR file with a `main-class` entry in the `MANIFEST.MF` in `target` (for Maven deployments) or `build/libs` (for Gradle deployments).  Multiple JAR files with `main-class` entries will cause the deployment to fail.

For single module Maven / Gradle projects:

```azurecli
cd <path-to-maven-or-gradle-source-root>
az spring-cloud app deploy -n <app-name>
```

For Maven / Gradle projects with multiple modules, repeat for each module:

```azurecli
cd <path-to-maven-or-gradle-source-root>
az spring-cloud app deploy -n <app-name> --target-module <relative-path-to-module>
```

### Show deployment logs

Review the kpack build logs using the following command:

```azurecli
az spring-cloud app show-deploy-log -n <app-name> [-d <deployment-name>]
```

> [!NOTE]
> The kpack logs will only show the latest deployment if that deployment was built from source using kpack.

## Assign a public endpoint to gateway

1. Open the **Application Dashboard** page.
2. Select the `gateway` application to show the **Application Details** page.
3. Select **Assign endpoint** to assign a public endpoint to gateway. This can take a few minutes.
4. Enter the assigned public IP into your browser to view your running application.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/javae2e?tutorial=asc-source-quickstart&step=public-endpoint)

## Next steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Provision a service instance
> * Set a configuration server for an instance
> * Build a microservices application locally
> * Deploy each microservice
> * Edit environment variables for applications
> * Assign public IP for your application gateway

> [!div class="nextstepaction"]
> [Spring Cloud logs, metrics, tracing](./quickstart-logs-metrics-tracing.md)

More samples are available on GitHub: [Azure Spring Cloud Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/service-binding-cosmosdb-sql).